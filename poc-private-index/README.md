# poc-private-index

A working private web-search index you hit directly, with the query hidden from the index by cryptography alone. No TEE, no hardware trust, no third party. This is the Tiptoe ranking primitive (LWE linearly-homomorphic inner-product search), built small enough to read in one sitting and benchmarked on a real archived-web corpus on this laptop.

It exists to answer one question you had: for "the node builds an index of the web and you hit it, max privacy preserving," do you need a TEE, or is Tiptoe/PIR the move? The benchmark below answers it. **For max privacy you want PIR, and it runs fine. A TEE is a speed-and-quality upgrade you take only if you are willing to trust the chip.**

## What it does

The server holds a plaintext matrix of document embeddings. The client encrypts its query embedding under LWE, the server multiplies its matrix by the ciphertext, and the client decrypts the exact inner-product scores. The server's entire view is one LWE ciphertext, which reveals nothing about the query under standard lattice hardness. This is the same linearity your [mixing-query-embeddings](../mixing-query-embeddings-for-private-search.md) report identified as the load-bearing fact, done the sound way (encrypt one user's query, do not blend many users' queries).

```
client                          server (sees only ciphertext c)
  embed(query) -> q
  c = A·s + e + Δ·q   ───────▶  ans = M · c          # M = doc embeddings (plaintext)
                                     = (M·A)·s + M·e + Δ·(M·q)
  ans − hint·s ≈ Δ·(M·q)  ◀───  ans
  round(·/Δ) = scores = M·q     # exact integer inner products
  top-k locally
```

## Results (measured, not estimated)

Run on a MacBook (Darwin 23.4.0), Python 3.9 + numpy, 963 real archived web pages from `~/world_knowledge/web`, embeddings d=128, LWE security dimension n=1024, modulus q=2^32, 4-bit document/query quantization. Reproduce with `python3 bench.py`.

**Correctness and quality**

| metric | value | meaning |
|---|---|---|
| crypto fidelity | **1.000** | PIR-decrypted top-10 is bit-identical to plaintext top-10. The crypto is exact, not approximate. |
| quantization tax | 0.862 | 4-bit embeddings keep 86% of the float top-10. The only quality loss, and it is tunable by bit-width. |
| semantic recall@10 | 0.700 | title finds its own document (LSA embedder; a neural embedder would lift this, and nothing else changes). |

**Cost, full-scan PIR (max privacy, server learns nothing)**

| docs N | hint (offline) | query up | response down | server compute | online latency |
|---|---|---|---|---|---|
| 1,000 | 3.9 MiB | 512 B | 3.9 KiB | 0.08 ms | **1.6 ms** |
| 5,000 | 19.5 MiB | 512 B | 19.5 KiB | 0.74 ms | **8.3 ms** |
| 20,000 | 78.1 MiB | 512 B | 78.1 KiB | 3.96 ms | **33 ms** |
| 50,000 | 195.3 MiB | 512 B | 195.3 KiB | 9.99 ms | **86 ms** |

Latency is linear in corpus size and dominated by the client-side `hint·s` step. At 50k docs the whole private query is 86 ms on one laptop core, versus Tiptoe's reported 2.7 s at 360M pages across 45 servers. The PoC is not faster than Tiptoe; it is smaller, and it shows the mechanism is cheap at niche scale.

**The cluster knob (privacy vs speed vs recall)**

Tiptoe-style clustering, but as the leaky-fast variant: the client picks the nearest cluster locally and asks the server to search only that cluster, which reveals a coarse topic. The sweep is the honest tradeoff curve.

| probes | speedup | recall vs full-scan | leaks (topic bits) |
|---|---|---|---|
| 1 | 9.8x | 0.54 | 5.0 |
| 2 | 8.0x | 0.69 | 3.9 |
| 4 | 5.3x | 0.84 | 2.8 |

Single-probe recall of 0.54 lines up with Tiptoe's documented ~35% best-match-in-cluster. The takeaway: at reachable corpus sizes full-scan PIR is already in the tens of milliseconds and leaks nothing, so clustering (which costs both privacy and recall) is not worth it until the corpus is very large.

## The verdict: TEE or PIR?

| | this PoC (PIR) | TEE path |
|---|---|---|
| privacy root | LWE hardness, survives full server collusion | trust the chip + vendor PKI + no side channel |
| query leaks to operator | never | only if the chip is broken |
| latency | 1.6 to 86 ms (1k to 50k docs) | tens of ms at any scale |
| result quality | exact inner products, minus a 4-bit tax | full neural recall, no tax |
| scaling wall | the hint download (195 MiB at 50k, linear) | none of consequence |
| hardware needed | any CPU | H100-class GPU TEE for in-enclave embedding |

For "max privacy preserving," PIR wins outright: it gives cryptographic privacy with no hardware trust, and this PoC proves it runs in milliseconds at niche scale. Reach for a TEE only when you need web scale at low latency, full neural-embedding recall, or functionality past inner-product ranking. That is the choice the two design docs ([Periscope](../tee-indexed-private-search-design.md) and the TEE-query-path alternative) lay out; this benchmark is the evidence under them.

## Leak / protect ledger

| party | learns the query? | learns the corpus access? |
|---|---|---|
| index operator (full-scan PIR) | no (LWE ciphertext) | no (touches every doc identically) |
| index operator (cluster mode) | no | yes, the coarse cluster id (~5 bits) |
| network observer | no (encrypt before send) | sees only fixed-size ciphertext + response |
| anyone without the secret s | no | no |

This covers WHAT (query content). It does not hide WHO (your IP) or THAT you searched; compose with OHTTP or a mixnet for those, exactly as the corpus reports lay out.

## Honest scope

- **Embedder is LSA, not neural.** This laptop had no sentence-transformer. LSA is a weaker semantic space, so the 0.70 recall is a floor. Every privacy and cost number is independent of the embedder; swap `Embedder.encode` for a neural model returning L2-normalized vectors and nothing downstream changes.
- **The hint download is the real scaling wall.** It is N·n·4 bytes, linear in corpus size and LWE dimension: 195 MiB at 50k docs, ~1.4 TB extrapolated to 360M. Tiptoe tames this with response compression and seed-expanded `A`; newer schemes (YPIR, HintlessPIR) remove the hint entirely. This PoC ships the uncompressed mechanism so the cost is visible, not the optimized one.
- **Single box, no network.** Latencies are local compute only. A real deployment adds transport and, at large N, sharding.
- **Not implemented:** Tiptoe's padded-cluster trick (cluster-grade recall at full-scan privacy), response compression, malicious-server integrity. The PoC is the honest core, not the optimized product.

## Files

```
private_index/lwe.py      the LWE homomorphic inner-product scheme (+ self-test)
private_index/corpus.py   load and clean the local web archive
private_index/embed.py    TF-IDF -> SVD dense embeddings, 4-bit quantization
private_index/pir.py      index build + three query modes (plain, pir, pir_cluster)
bench.py                  the benchmark that produced the tables above
results.json              machine-readable results from the last run
```

Run the crypto self-test: `python3 -m private_index.lwe`
Run the benchmark: `python3 bench.py` (or `--quick`)
