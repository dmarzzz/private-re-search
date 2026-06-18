"""
Benchmark the private index locally.

Measures, on the real archived-web corpus plus synthetic scale-up:
  - crypto fidelity  : do PIR-decrypted rankings equal plaintext rankings? (must be ~1.0)
  - quantization tax : 4-bit vs float top-10 agreement
  - semantic recall  : title -> document retrieval (sanity that the index works)
  - online latency   : client encrypt + server eval + client decrypt, per query
  - server compute   : the server's per-query bill (the eval step alone)
  - communication    : query up, response down, offline hint size
  - cluster mode      : speed + recall + what it leaks

Run:  python3 bench.py            (default grid)
      python3 bench.py --quick    (small grid, fast)
"""
from __future__ import annotations
import sys, time, json, statistics
import numpy as np
from private_index import corpus, lwe
from private_index.embed import Embedder, topk_plain
from private_index.pir import Index

D = 128
N_LWE = 1024
K = 10
N_QUERIES = 200


def overlap_at_k(a, b, k=K):
    return len(set(a[:k]) & set(b[:k])) / k


def pad_to(M_real, N_target, rng):
    if N_target <= len(M_real):
        return M_real[:N_target]
    extra = rng.integers(-8, 8, size=(N_target - len(M_real), M_real.shape[1]), dtype=np.int64)
    return np.vstack([M_real, extra])


def timeit(fn, trials):
    ts = []
    for _ in range(trials):
        t = time.perf_counter()
        fn()
        ts.append(time.perf_counter() - t)
    return statistics.median(ts) * 1000.0      # ms


def human_bytes(n):
    for u in ("B", "KiB", "MiB", "GiB"):
        if n < 1024:
            return f"{n:.1f} {u}"
        n /= 1024
    return f"{n:.1f} TiB"


def main():
    quick = "--quick" in sys.argv
    grid = [1000, 5000] if quick else [1000, 5000, 20000, 50000]
    rng = np.random.default_rng(0)

    print("loading corpus ...")
    docs = corpus.load()
    texts = [f"{d.title}\n{d.body}" for d in docs]
    print(f"  {len(docs)} clean docs")

    print("fitting embedder (TF-IDF + SVD, d=%d) ..." % D)
    emb = Embedder(d=D).fit(texts)
    Z_docs = emb.encode(texts)
    M_real = emb.quantize(Z_docs)
    Nreal = len(M_real)

    # queries: title -> its own document
    qidx = rng.choice(Nreal, size=min(N_QUERIES, Nreal), replace=False)
    q_titles = [docs[i].title for i in qidx]
    Zq = emb.encode(q_titles)
    Mq = emb.quantize(Zq)

    results = {"config": {"d": D, "n_lwe": N_LWE, "k": K, "n_docs_real": Nreal,
                          "q_bits": lwe.Q_BITS, "embed_bits": 4}, "rows": []}

    # ---------- fidelity + recall on the REAL corpus ----------
    print("\n== fidelity & recall (real corpus, full-scan PIR) ==")
    idx = Index(M=M_real, embedder=emb, n_lwe=N_LWE).build()
    crypto_ov, quant_ov, sem_hits = [], [], 0
    for j, i in enumerate(qidx):
        qv = Mq[j]
        topk_pir, _ = idx.query_pir(qv, K)
        topk_quant, _ = idx.query_plain(qv, K)
        # float baseline (no quantization, no crypto)
        fscores = Z_docs @ Zq[j]
        topk_float = topk_plain(fscores, K)
        crypto_ov.append(overlap_at_k(topk_pir, topk_quant))
        quant_ov.append(overlap_at_k(topk_quant, topk_float))
        if i in set(topk_float[:K]):
            sem_hits += 1
    print(f"  crypto fidelity  (PIR == quantized plaintext top-{K}): {np.mean(crypto_ov):.3f}")
    print(f"  quantization tax (4-bit == float top-{K})            : {np.mean(quant_ov):.3f}")
    print(f"  semantic recall@{K} (title -> own doc, float)         : {sem_hits/len(qidx):.3f}")
    results["fidelity"] = {"crypto": float(np.mean(crypto_ov)),
                           "quant": float(np.mean(quant_ov)),
                           "recall": sem_hits / len(qidx)}

    # ---------- cost scaling ----------
    print("\n== cost scaling (synthetic pad for N > %d; cost is content-independent) ==" % Nreal)
    hdr = f"{'N':>7} | {'build_hint':>10} | {'hint_size':>10} | {'q_up':>7} | {'resp_down':>10} | {'server_ms':>9} | {'online_ms':>9}"
    print(hdr); print("-" * len(hdr))
    sample_q = Mq[0]
    for N in grid:
        M = pad_to(M_real, N, rng)
        ix = Index(M=M, embedder=emb, n_lwe=N_LWE)
        t = time.perf_counter()
        ix.build()
        build_ms = (time.perf_counter() - t) * 1000
        sk = ix.lhe.keygen()
        c = ix.lhe.encrypt(sk, sample_q)
        trials = 7 if N <= 20000 else 4
        server_ms = timeit(lambda: ix.lhe.server_eval(ix.M_modq, c), trials)
        online_ms = timeit(lambda: ix.query_pir(sample_q, K), trials)
        row = {"N": N, "build_hint_ms": build_ms, "hint_bytes": ix.hint_bytes(),
               "query_up_bytes": ix.query_up_bytes(),
               "response_down_bytes": ix.response_down_bytes("pir"),
               "server_ms": server_ms, "online_ms": online_ms}
        results["rows"].append(row)
        print(f"{N:>7} | {build_ms:>9.0f}m | {human_bytes(ix.hint_bytes()):>10} | "
              f"{human_bytes(ix.query_up_bytes()):>7} | {human_bytes(ix.response_down_bytes('pir')):>10} | "
              f"{server_ms:>8.2f}m | {online_ms:>8.2f}m")

    # ---------- cluster mode: the privacy / speed / recall knob ----------
    print("\n== cluster mode: probe sweep, full-scan PIR vs leaky cluster-PIR (real corpus) ==")
    nclust = max(8, int(np.sqrt(Nreal)))
    idxc = Index(M=M_real, embedder=emb, n_lwe=N_LWE, n_clusters=nclust).build()
    full_ms = timeit(lambda: idxc.query_pir(Mq[0], K), 7)
    print(f"  clusters: {nclust} (~sqrt(N)), avg size ~{Nreal//nclust}")
    print(f"  full-scan PIR: {full_ms:.2f} ms, recall-vs-self 1.000, leaks NOTHING (the max-privacy point)")
    print(f"  {'n_probe':>7} | {'online_ms':>9} | {'speedup':>7} | {'recall_vs_full':>14} | {'leaks(topic bits)':>17}")
    print("  " + "-" * 66)
    cl_rows = []
    for n_probe in (1, 2, 4):
        clus_ms = timeit(lambda: idxc.query_pir_cluster(Mq[0], K, n_probe), 7)
        ov = []
        for j in range(min(80, len(qidx))):
            full_top, _ = idxc.query_pir(Mq[j], K)
            clus_top, cids, csz = idxc.query_pir_cluster(Mq[j], K, n_probe)
            ov.append(overlap_at_k(full_top, clus_top))
        leak_bits = float(np.log2(max(1, nclust // n_probe)))   # narrows to ~1/n_probe of clusters
        cl_rows.append({"n_probe": n_probe, "online_ms": clus_ms, "speedup": full_ms / clus_ms,
                        "recall_vs_full": float(np.mean(ov)), "leak_bits": leak_bits})
        print(f"  {n_probe:>7} | {clus_ms:>8.2f}m | {full_ms/clus_ms:>6.1f}x | "
              f"{np.mean(ov):>14.3f} | {leak_bits:>17.1f}")
    results["cluster"] = {"n_clusters": nclust, "full_ms": full_ms, "sweep": cl_rows}

    with open("results.json", "w") as fh:
        json.dump(results, fh, indent=2)
    print("\nwrote results.json")


if __name__ == "__main__":
    main()
