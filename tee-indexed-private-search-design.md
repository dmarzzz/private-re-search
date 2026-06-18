# Periscope: a TEE-built web index with a Tiptoe-style encrypted query path

Working name: Periscope. You look at the open web from below the surface, and the surface cannot look back down the tube.

This report does three things. It pins down what Tiptoe actually is, mechanism by mechanism. It maps the follow-up work since SOSP 2023, because the field forked into two lanes and the fork matters for design. Then it specifies a service that builds its index inside a TEE and answers queries with the embedding "mixer" done right, and answers the standing question from the [mixer report](mixing-query-embeddings-for-private-search.md): no, the mixer still cannot ride on a public search engine, but a TEE can bridge to one with a strictly weaker guarantee, and the design below makes that tradeoff explicit instead of pretending it away.

## Tiptoe, precisely

[Tiptoe](https://eprint.iacr.org/2023/1438) (Henzinger, Dauterman, Corrigan-Gibbs, Zeldovich, SOSP 2023) is private web search over 360 million Common Crawl pages where the servers learn nothing about the query. No enclaves, no non-collusion assumption: privacy holds even if every server colludes, from lattice cryptography alone.

The pipeline, end to end:

1. **Offline, index build.** Every page is embedded with a small public model, reduced by PCA, and the corpus is clustered by k-means into roughly 1.28 million clusters. The embedding matrix is sharded across a ranking service (80 shards in the paper's evaluation); URLs live in a separate URL service (8 shards).
2. **Offline, client side.** The client downloads the cluster centroids and query-independent cryptographic hints. 74% of the total per-query communication happens here, before the user has typed anything.
3. **Online, ranking.** The client embeds the query locally with the same public model, picks the nearest centroid locally, and sends the query embedding encrypted under a linearly homomorphic scheme ([underhood](https://github.com/ahenzinger/underhood), built on the SimplePIR lattice machinery). Scoring is a matrix-vector product, a public linear function of the ciphertext, so the server computes every inner product without seeing the query or even which cluster was selected.
4. **Online, retrieval.** The client decrypts the scores, identifies its top documents, and fetches their URLs via PIR from the URL service.

The bill at 360M pages on a 45-server cluster: 145 core-seconds of server compute per query, 56.9 MiB of communication, 2.7 seconds end-to-end latency. Quality on MS MARCO: the best-matching result lands at average position 7.7, versus 2.3 for the same retrieval stack without privacy and 6.7 for tf-idf. Usable first-page results, a real but bounded quality tax, and a compute bill roughly five orders of magnitude above a plaintext query.

The [reference implementation](https://github.com/ahenzinger/tiptoe) is public, including the crypto layer. This is buildable today, not paper-ware.

## The follow-up fork, 2024 to 2026

Everything after Tiptoe splits on one question: what do you relax to pay less?

| System | Venue | What it relaxes | What it gains |
|---|---|---|---|
| [Wally](https://arxiv.org/abs/2406.06761) (Apple, Asi et al.) | 2024 | Pure crypto guarantee weakened to (ε,δ)-differential privacy; requires many concurrent users and an anonymizing network | 7 to 28x queries/sec and 6.7 to 31x less communication than Tiptoe at 3.2M entries. Server does crypto on a few entries per query instead of all of them; clients inject fake queries to hide the rest |
| [Compass](https://eprint.iacr.org/2024/1255) (Berkeley, Zhu, Patel, Zaharia, Popa) | OSDI 2025 | Setting: outsourced encrypted corpus, server is storage not search engine | Plaintext-quality accuracy by walking a real HNSW graph under Oblivious RAM, around one second perceived latency. Solves the quality tax, not the public-web-index problem |
| [Pacmann](https://eprint.iacr.org/2024/1600) (Zhou et al.) | ICLR 2025 | Server-side homomorphic compute dropped entirely; client does the graph walk, each hop is a preprocessing-PIR fetch | Up to 2.5x better accuracy than prior private ANN, 90% of non-private search quality, scales to 100M vectors with no heavy crypto on the server |
| [Tiptoe++](https://65610.csail.mit.edu/2025/reports/tiptoe.pdf) (MIT 6.5610 course report) | 2025 | Nothing; attacks the quality gap inside Tiptoe's own model | Balanced graph partitioning instead of raw k-means, plus a learned classifier routing queries to clusters. Course report, not peer reviewed, but it confirms where the quality is lost: rigid centroid routing |
| [PIR-RAG](https://arxiv.org/abs/2509.21325), [Synopsis](https://arxiv.org/abs/2505.23880) | 2025 | Same machinery, new targets | The Tiptoe construction repointed at RAG retrieval and at analytics over encrypted embedding streams. Signal that this is becoming infrastructure, not a one-off |

Apple meanwhile ships the Wally-shaped stack [in production](https://machinelearning.apple.com/research/homomorphic-encryption): Live Caller ID Lookup and landmark search in Photos run homomorphic nearest-neighbor lookups at consumer scale. The deployment existence proof from the mixer report has only strengthened.

Two readings of the fork that drive the design below:

- **The query path is a solved menu.** Crypto-only and slow (Tiptoe), DP-batched and fast (Wally), client-walked and server-cheap (Pacmann), ORAM-accurate for private corpora (Compass). You pick by threat model and user count; you do not need to invent one.
- **Nobody touched the index.** Every one of these systems evaluates on a static snapshot and assumes the index is honest. Who crawled it, whether the embeddings match the published model, whether the cluster structure was poisoned to skew results: out of scope in all five papers. The open operational problem is index integrity and freshness, and that is exactly the piece a TEE is good for.

## The mixer question, closed out

The [mixer report](mixing-query-embeddings-for-private-search.md) already killed the naive version: summing several users' query embeddings breaks utility (top-k is not linear, the centroid serves nobody) and does not reliably protect content (embeddings invert). That verdict stands. What the follow-up literature adds is that legitimate "mixing" exists at exactly two layers, and neither mixes query content across users:

- **Mixing with noise, per user.** Tiptoe's LHE blends one user's query with lattice noise. The server computes on the blend. This is the sound version of "the engine only sees a mix."
- **Mixing identities, across users.** Wally batches many users' separately encrypted queries through an anonymous network with DP fake-query padding. The crowd is the anonymity set; content never blends. This is the sound version of "many people's queries go in together."

And the public-engine question: still no. Exa, Parallel, and Google take plaintext text at the API boundary, so there is no surface for an encrypted vector, mixed or not. The one new path the TEE opens is a bridge, not a fix: an attested enclave can decrypt your query inside hardware the operator cannot inspect and forward it to public engines. The operator learns nothing; the upstream engine still reads your query in plaintext but attributes it to the enclave, not you. That is identity protection from the engine and content protection from the operator only. It is worth shipping as a v0 precisely because it is honest about being weaker.

## Periscope: the design

One sentence: a TEE attests that the index was built honestly, and lattice cryptography guarantees that nobody, including that TEE, ever sees a query.

The core move is separating the planes so each technology covers the other's weakness. TEEs have a bad record on confidentiality (side channels, vendor trust) but are good at integrity attestation of a batch computation. Lattice crypto is unconditional on confidentiality but has no opinion about whether the database it is scanning is honest. So:

### Build plane, inside the TEE

Crawler, embedder, and clusterer run inside attested enclaves (AWS Nitro Enclaves or Intel TDX bare metal; Nitro first, since attestation tooling via `nitro-cli` and vsock is the most paved path). Per epoch the enclave:

1. Ingests a declared corpus snapshot: a Common Crawl segment list, or the local `~/world_knowledge` archive for a niche v1.
2. Embeds every page with a pinned, public, client-runnable model (this is a hard constraint, not a choice: the client must embed queries with the same model locally, so the model must be small and published; Tiptoe's PCA-reduced setup is the template).
3. Clusters, shards, and emits one signed index artifact: embedding matrix shards, centroids, URL store, plus a manifest binding {code measurement, model hash, corpus snapshot ID, epoch number} into the attestation document.

Anyone can verify which open-source code produced the index over which inputs. Index poisoning now requires breaking the TEE or the published code, both auditable events, instead of being silently free for the operator.

### Query plane, crypto only, no TEE

Tiptoe's protocol verbatim against the attested artifact, reusing `ahenzinger/tiptoe` and `underhood`. Client checks the attestation on the manifest, downloads centroids and hints for the current epoch, embeds locally, sends the LHE ciphertext, decrypts scores, PIR-fetches URLs. A fully compromised server farm, TEE included, learns nothing about queries. The TEE never touches the query path, so its side-channel record is irrelevant to confidentiality.

### Transport plane, optional

Oblivious HTTP (RFC 9458) in front for IP unlinkability, which this corpus already covers, and a Wally-style DP batching mode that switches on once concurrent users exist. Identity mixing across users, content mixing never.

### Leak ledger

| Party / compromise | Learns about queries | Learns about you |
|---|---|---|
| Operator, honest | Nothing (LHE) | Timing, volume, IP unless OHTTP |
| Operator, fully malicious, all servers | Nothing; can only deny service or serve a stale epoch | Same as above |
| TEE vendor compromised at build time | Nothing about queries; can poison the index until the code audit catches the measurement mismatch | Nothing new |
| Public engine behind the v0 bridge | Full query plaintext | Nothing, sees only the enclave |
| Embedding model publisher | Nothing at runtime; model is frozen per epoch | Nothing |

### The honest hard problem: freshness versus hints

Tiptoe's 74%-offline communication is query-independent but index-dependent. Every index update invalidates every client's downloaded hints and centroids. "Index the web" wants daily epochs; "preprocessed PIR" punishes every epoch with a re-download. This tension is the real engineering problem of Periscope, and no published system solves it for a live web index. Mitigations to evaluate, in order: epoch the index and let clients ride a stale epoch for days (staleness is a tunable, not a failure), delta-shard so only changed clusters invalidate, or swap the ranking layer to Pacmann-style client-walked PIR whose preprocessing also rotates but with different constants. Flagged as the first thing to benchmark, not designed away on paper.

### Sizing, derived not measured

SimplePIR-family server compute is linear in database size. Scaling Tiptoe's published 145 core-seconds at 360M pages down to a 1 to 5M page niche corpus gives roughly 0.4 to 2 core-seconds per query, single-box territory. Communication shrinks too but follows the matrix dimensions, not linearly; the honest number needs the hint-size math run against the real corpus. Both figures are extrapolations from the paper's table, not measurements.

### Ship ladder

- **v0, the bridge.** SearXNG fan-out (the existing `searxng-wth-frnds` daemon) inside a Nitro enclave with attested TLS. Weaker guarantee, stated plainly: operator-blind, engine-unlinkable, not content-private from the engines. Weeks, not months, and it exercises the attestation plumbing the build plane needs anyway.
- **v1, the real thing at niche scale.** TEE-built index over a 1 to 5M page research-domain corpus, Tiptoe query path on one box, epoch cadence weekly. This is the smallest artifact that demonstrates the whole thesis: attested build plus unconditional query privacy.
- **v2, scale on demand.** Wally batching when there is a crowd, Pacmann or Tiptoe++-style routing when the quality tax bites, Common Crawl scale when there is a cluster budget.

**Status update, 2026-06-10:** the query plane now exists as a working PoC in [`periscope-poc/`](periscope-poc/): this corpus indexed behind the Tiptoe-style LWE path, exact decryption 20/20, 49 ms median query, benchmarked to 1M synthetic docs. It confirmed the plane separation empirically: query privacy needed no TEE at all.

## Open questions for a follow-up pass

1. Hint economics: actual hint and centroid sizes per epoch at 1M and 5M pages, and the staleness window users would tolerate. This decides Tiptoe-style versus Pacmann-style ranking for v1.
2. Does Nitro attestation compose cleanly with a multi-day clustering job (enclave memory limits, checkpointing without breaking the measurement story)?
3. The v0 bridge inside an enclave: what does SearXNG's engine fan-out leak through traffic shape even when the operator is blind?

## Sources

- Tiptoe, [eprint.iacr.org/2023/1438](https://eprint.iacr.org/2023/1438), [reference code](https://github.com/ahenzinger/tiptoe), [underhood LHE](https://github.com/ahenzinger/underhood), [SOSP version](https://dl.acm.org/doi/10.1145/3600006.3613134)
- Wally, [arXiv:2406.06761](https://arxiv.org/abs/2406.06761), [Apple ML overview](https://machinelearning.apple.com/research/wally-search)
- Compass, [eprint.iacr.org/2024/1255](https://eprint.iacr.org/2024/1255), [OSDI 2025](https://www.usenix.org/conference/osdi25/presentation/zhu-jinhao)
- Pacmann, [eprint.iacr.org/2024/1600](https://eprint.iacr.org/2024/1600), [ICLR 2025](https://openreview.net/forum?id=yQcFniousM)
- Tiptoe++, [MIT 6.5610 course report](https://65610.csail.mit.edu/2025/reports/tiptoe.pdf)
- PIR-RAG, [arXiv:2509.21325](https://arxiv.org/abs/2509.21325); Synopsis, [arXiv:2505.23880](https://arxiv.org/abs/2505.23880)
- Apple, HE in production, [machinelearning.apple.com](https://machinelearning.apple.com/research/homomorphic-encryption)
- Oblivious HTTP, [RFC 9458](https://www.ietf.org/rfc/rfc9458.html)
- Prior report in this corpus: [mixing-query-embeddings-for-private-search.md](mixing-query-embeddings-for-private-search.md)
