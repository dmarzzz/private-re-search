# The search mixer: can you blend many people's query embeddings into one private search?

The idea is clean enough to be tempting. Build an embeddings-based search engine, or borrow one like Exa or Parallel. Take several users' query embeddings, add them together into one vector, run a single search with the sum, then split the results back out and hand each user their piece. The search engine only ever sees a blend, never an individual query. Privacy for free, and one search instead of N.

The instinct underneath it is correct. The construction on top of it is not. This report separates the two, because the gap between them is exactly the difference between a broken scheme and an open research problem worth chasing.

The threat model is fixed up front: query confidentiality. The search backend must not learn *what* any individual user searched for. Hiding *who* asked is a separate, orthogonal problem, and conflating the two is the first mistake to avoid.

## The verdict per target

| Target | Query-confidential search? | Why |
|---|---|---|
| Google as-is | No | Every working private-search system needs the server to cooperate cryptographically, computing over ciphertext or running PIR. A black-box ranker you do not control has to be handed plaintext to rank it. There is no surface to inject an encrypted query. |
| Exa / Parallel as they ship | No | Exa is [a web-scale vector database](https://exa.ai/blog/building-web-scale-vector-db) and [Parallel](https://parallel.ai/blog/parallel-search-api) is a neural search API, so both are embeddings-based. But the API takes plaintext query text and embeds it server-side. Confidentiality structurally requires an endpoint that accepts an encrypted query vector and scores it under encryption. Neither exposes that. |
| Your own index | Yes | You control the scoring function, so you can compute the inner product against an encrypted query vector. This is the only target where the idea is fully realizable, and the blueprints already exist. |

The Exa and Parallel verdicts are conditional on their current API surfaces, which I did not live-test. The prior art only proves you would *need* an encrypted-vector endpoint. If they accept only plaintext text, they force plaintext exposure, full stop. Worth a direct check of their live docs before relying on it.

One real-world proof point that this is not science fiction: Apple ships homomorphic-encryption-based private retrieval in production today, powering Live Caller ID Lookup and private nearest-neighbor landmark lookup in Photos ([Apple ML, 2024](https://machinelearning.apple.com/research/homomorphic-encryption)). The cryptography is deployable, not just publishable.

## What the naive mixer gets right

Dense retrieval scores documents by inner product. The score of a document against a query is the dot product of the two vectors, and the dot product is linear in the query: the score against `qA + qB` equals the score against `qA` plus the score against `qB`. That linearity is real, and it is precisely the property that every cryptographic private-search system leans on.

[Tiptoe](https://eprint.iacr.org/2023/1438) (Henzinger, Dauterman, Corrigan-Gibbs, Zeldovich, MIT, SOSP 2023) says it outright: the inner-product scores the servers need to compute are a public, linear function of the client's encrypted query embedding, so a linearly-homomorphic scheme suffices. [Coeus](https://eprint.iacr.org/2022/154.pdf) (SOSP 2021) frames scoring as a matrix-vector product, the tf-idf matrix times the query vector, and computes it over BFV lattice encryption. [SimplePIR](https://www.usenix.org/system/files/sec23summer_27-henzinger-prepub.pdf) (USENIX Security 2023), the PIR layer Tiptoe builds on, is itself an oblivious matrix-vector product where the server computes the encrypted product `D · E(q) = E(D · q)` without ever seeing `q`.

So the user instinct is not just plausible, it is the load-bearing fact of the entire field. The error is in what you do with it.

## Why summing and decomposing breaks

Two independent failures. Either one alone is fatal.

**Utility: the centroid problem.** Scores are linear, but top-k is not. A single summed vector points at the centroid of the constituent queries, and the centroid can sit near none of them. Worse, there is no linear operation that recovers each user's top-k from one shared ranked list. The sharp way to see it: the exact property that makes [Bonawitz secure aggregation](https://arxiv.org/abs/1611.04482) (CCS 2017) private, that the server learns only the sum and the aggregate is by design indecomposable into per-user contributions, is the same property that destroys retrieval utility here. You cannot simultaneously have "the server cannot decompose the blend" and "I can decompose the blend." Pick one.

**Privacy: embeddings invert.** Text embeddings are not a one-way hash. [vec2text](https://arxiv.org/abs/2310.06816) (Morris et al., EMNLP 2023) recovers 92% of 32-token inputs exactly and pulls full patient names out of clinical notes. [Song and Raghunathan](https://arxiv.org/abs/2004.00053) (CCS 2020) recover 50 to 70% of input words under a black-box, query-access-only threat model, the same access an honest-but-curious backend has, and they explicitly treat inverting the *average* of word vectors as a tractable sparse-coding problem. The honest caveat: their averaging is mean-pooling within a single text, not summing across many independent users. Cross-user summing is not directly studied, and recoverability should degrade as the number of summed independent queries grows. So "summing destroys the content" is plausible but unproven, and the published evidence points the other way for small blends. A sum of two or three queries is a tiny anonymity set protecting invertible vectors. That is not a guarantee, it is a hope.

## The architecture that actually works

Reduce private full-text search to private nearest-neighbor search, then run it for a single user's query under linearly-homomorphic encryption plus PIR. The linearity you spotted is what makes it go: the client encrypts its query embedding, the server scores every document under encryption because scoring is a public linear function of that ciphertext, and the client decrypts only its own results.

The proven blueprints, in order of relevance:

- **Tiptoe** is the closest prior art. Private web search over 360 million pages, cryptography alone, no hardware enclaves and no non-collusion assumption. Privacy holds even if every server colludes; only availability is at risk. The cost is your concrete budget: 145 core-seconds of server compute, 56.9 MiB of communication with 74% of it in query-independent offline preprocessing, and 2.7 seconds of end-to-end latency on a 45-server cluster.
- **SimplePIR** is the single-server PIR under plain learning-with-errors that Tiptoe reuses. Single untrusted server, no non-collusion assumption.
- **Coeus** is independent confirmation of the same shape, single-client, three rounds, confidentiality but not integrity against a malicious server.
- **SANNS** ([Chen et al., USENIX Security 2020](https://arxiv.org/abs/1904.02033)) is private approximate k-nearest-neighbor, two-party, semi-honest, keeping both the query and the results confidential, with a custom top-k selection circuit.

If you ever want speed over the single-server guarantee, two-server DPF PIR runs at roughly 5,381 MB/s, but it requires non-colluding servers, which is the split-trust assumption you would have to actually enforce.

## Where mixing across people legitimately belongs

Cross-user mixing is real cryptography. It just solves a different problem than the one stated here.

[Secure aggregation](https://arxiv.org/abs/1611.04482) genuinely sums per-user vectors so a server learns only the total, robust to up to a third of clients dropping out. But its threat model is a federated-learning aggregator hiding individual inputs, not a search backend blind to query content. These are different setups with different guarantees, and equating them is a category error. An adversarial verification pass on this exact claim refuted the equivalence three to zero. Do not build on the conflation.

PIR hides content, not identity. It hides which item you fetch, not that you are fetching. If you also want unlinkability, who asked, that is a separate transport layer: [Oblivious HTTP](https://www.ietf.org/rfc/rfc9458.html) (RFC 9458) or a mixnet, both already in this corpus.

Metric-DP perturbation ([Feyisetan et al., WSDM 2020](https://arxiv.org/abs/1910.08902)) is the single-user alternative that needs no server cooperation: add calibrated multivariate Laplace noise to the query embedding under d-chi-privacy. It works, but the privacy-utility tradeoff is poor because of the curse of dimensionality. A fallback, not a foundation.

## The open problem hiding inside the idea

Here is the part worth keeping. There is no published system that does private *multi-client* batched retrieval while preserving per-user result separability without leaking content. "Batching" in the PIR literature ([Batched DP-PIR](https://www.usenix.org/conference/usenixsecurity22/presentation/albab), USENIX 2022) is an efficiency trick that amortizes server compute across queries. It never mixes query content across users, and it offers no path to decompose a centroid back into per-user top-k.

So the naive mixer is a non-starter, but the sound version of "many people's queries blended, searched once, results split back" is a genuine open problem. The direction worth probing: can secure-aggregation-style masking plus per-user blinding factors plus an oblivious decomposition step yield per-user top-k out of a single shared computation, and what would its security and utility actually be? Combine that with calibrated metric-DP noise on an index you control, and there may be a usable privacy-utility point that nobody has characterized. That is a paper if it works.

## Open questions for a follow-up pass

1. Do Exa's and Parallel's current APIs expose any encrypted-vector or inner-product-over-ciphertext endpoint, or only plaintext query text? This is a time-sensitive product fact that needs direct doc verification.
2. Does the linearity argument survive modern multi-stage retrieval, late-interaction ColBERT scoring or cross-encoder rerankers, or is it confined to the single dot-product nearest-neighbor stage as in Tiptoe and Coeus?
3. The real gap: is there any construction for private multi-client retrieval with per-user separability, and how fast does embedding-inversion recoverability decay as a function of the number of independent queries summed?

## Sources

- Tiptoe, private web search, [eprint.iacr.org/2023/1438](https://eprint.iacr.org/2023/1438)
- SimplePIR, [USENIX Security 2023](https://www.usenix.org/system/files/sec23summer_27-henzinger-prepub.pdf)
- Coeus, [eprint.iacr.org/2022/154](https://eprint.iacr.org/2022/154.pdf)
- SANNS, private approximate nearest neighbor, [arXiv:1904.02033](https://arxiv.org/abs/1904.02033)
- vec2text, [arXiv:2310.06816](https://arxiv.org/abs/2310.06816)
- Song and Raghunathan, information leakage in embedding models, [arXiv:2004.00053](https://arxiv.org/abs/2004.00053)
- Bonawitz et al., secure aggregation, [arXiv:1611.04482](https://arxiv.org/abs/1611.04482)
- Feyisetan et al., metric-DP text privatization, [arXiv:1910.08902](https://arxiv.org/abs/1910.08902)
- Batched DP-PIR, [USENIX Security 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/albab)
- Oblivious HTTP, [RFC 9458](https://www.ietf.org/rfc/rfc9458.html)
- Apple, homomorphic encryption in production, [machinelearning.apple.com](https://machinelearning.apple.com/research/homomorphic-encryption)
- Exa, web-scale vector database, [exa.ai/blog](https://exa.ai/blog/building-web-scale-vector-db)
- Parallel search API, [parallel.ai/blog](https://parallel.ai/blog/parallel-search-api)
