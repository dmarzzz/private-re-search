# Private search: the full design space

This is the map of every choice I have actually explored in the private-search corpus, plus the regions I have not. It is wider than any one deck. The tech tree (`tech-tree/graph.js`) is the dependency skeleton: goals down through capabilities, primitives, built artifacts, and open seams. This doc grafts the option spectra onto that skeleton and re-prices each axis against the agent cost function, so I can see coverage as coordinates, not as a reading list.

## The one organizing idea

A search episode emits an observable trace `O(τ)` = ordered `(query, timing, endpoint, fetched-object, identity)` tuples. Each axis below kills a different column of that trace. Privacy is a term in the searcher's objective, not a network setting:

`J'(π,σ) = E[ U(b_τ,T) − Σ ( c + λ·ℓ(a_t, O_{<t}) ) ]`

where `ℓ` is the marginal leakage of the next action given everything already seen. That single equation does two things. It makes the axes orthogonal (each drives a different term toward zero), and it explains the latency-tolerance flip: an agent pays `c` in tokens and latency-tolerance, not attention, so the mechanisms a human rejected as too slow flip to deployable. The corpus is honest that this flip is still an argument from cost sheets. No benchmark yet scores `U`, `c`, and `ℓ` on one trajectory set.

The axes compose along `O(τ)`, they do not compete. My own built work is already composition: reputation-gated onion egress is Tor + Semaphore + RLN + uniform exit profile; Periscope is an attested TEE build plane + a crypto-only query plane. The blueprint's "one leak, three rooms" thesis is exactly this orthogonality.

---

## The axes

### 1. Retrieval-content privacy (what the engine learns about the query)
Spectrum: plaintext to a trusted engine -> policy no-log engine (DuckDuckGo/Startpage/Brave/Mojeek) -> obfuscation/decoy (TrackMeNot, GooPIR) -> single-server homomorphic/PIR (Tiptoe, SimplePIR/DoublePIR, Spiral, Respire, FrodoPIR, YPIR) -> client-walked PIR (Pacmann) -> ORAM over a private corpus (Compass) -> two-server/FSS (Splinter, DPF-PIR).

My position + artifact: Periscope, built and live. Tiptoe-style secret-key Regev LWE (n=1024, q=2^32, sigma=6.4), client embeds and encrypts locally, server ranks over ciphertext. 20/20 exact decryption, ~29 KiB up / ~8 KiB down, 49 ms median, 3 DO nodes ~$18/mo. The quality tax is real and measured: top-10 overlap 0.56 at 4-bit quantization, roughly half from single-cluster routing, half from quantization.

Tradeoff: crypto-only (Tiptoe) needs no non-collusion but pays ~5 orders of server compute plus the quality tax; DP-relaxed (Wally) is 7-28x faster but needs many concurrent users plus an anonymizing network; two-server is fast but needs a non-collusion assumption you must enforce. Obfuscation only raises entropy, it never zeroes leakage, and ML re-separates decoys from a short history (SimAttack ~37%, OB-PWS).

Unexplored: keyword/KV PIR as the real interface (Coeus, Pantheon, constant-weight PIR) is absent. Labeled PSI from FHE is the deployed, malicious-secure way to build exact-match private lookup and sits between dense-vector PIR and full SSE; it is uncited and the PSI-as-symmetric-PIR equivalence connects it to sub-query sharding. Foundational PIR (CGKS 1995, Kushilevitz-Ostrovsky 1997, Corrigan-Gibbs/Kogan) is referenced only secondhand. The deepest hole: does linearity survive ColBERT late-interaction MaxSim or a cross-encoder rerank, or is private retrieval confined to the single dot-product stage? External search confirms no published work on private late-interaction over encrypted embeddings. This is greenfield.

### 1b. Corpus ownership (the axis the corpus never enters)
This is the single largest external gap. The whole corpus assumes the corpus is PUBLIC and only the query is secret. The encrypted-PRIVATE-corpus family inverts that: you encrypt YOUR documents, ship them to an untrusted server, and search via an encrypted index, accepting a NAMED leakage profile (access pattern, search pattern, volume) in exchange for near-plaintext speed.

Spectrum: public shared index, zero leakage, linear scan (Periscope/Tiptoe) -> private owned corpus with bounded named leakage and sublinear speed (Searchable Symmetric Encryption with forward/backward privacy) -> ORAM-index hiding all access patterns (Oblix doubly-oblivious, DORY distributed-trust DPF).

Position + artifact: none. The corpus names private-RAG-over-your-own-files as an open frontier but never models it as an SSE problem with a leakage budget. The leakage-tier vocabulary (L1/L2, response-revealing vs response-hiding) is also the precise rubric for grading every other axis, and the corpus does not import it.

Tradeoff: zero-leakage-but-linear (PIR) vs named-leakage-but-sublinear (SSE) vs access-pattern-hiding-on-a-trust-anchor (ORAM). Forward privacy hides which past searches a new update matches; backward privacy hides deleted docs.

Unexplored: SSE as a peer axis to Periscope; Oblix's doubly-oblivious insight bears directly on the TEE build plane (an in-enclave index leaks its own memory accesses, which Oblix exists to fix); DORY is a near-twin of Periscope's distributed-trust DPF posture and is uncited.

### 2. Network-identity privacy (who the observer learns is asking)
Spectrum: direct -> VPN/residential proxy (one trusted party) -> OHTTP/ODoH split-trust (RFC 9458/9230) -> Apple Private Relay / Google IP Protection two-hop -> Tor -> mixnet (Loopix/Nym) -> anonymous broadcast/DC-net (ZipNet/ADCNet/Flashnet) -> P2P overlay (Crowds, Tarzan, I2P).

Position + artifact: reputation-gated onion egress, built and live. Client proves Semaphore v4 membership, dials a Tor onion service (no exit), gateway tunnels out from one clean IP. p50 1.9s vs 0.15s direct, p99 ~9s, 6 hops. We inherit, not rebuild, the Flashbots DC-net broadcast line.

Tradeoff: the anonymity/latency/bandwidth trilemma is a lower bound, not pick-2-of-3. OHTTP is cheapest and deployable today but only splits trust two ways; mixnets give the strongest metadata privacy at seconds of delay; our live numbers sit in the weak-anonymity, no-cover-traffic Tor corner by design.

Unexplored / positioning gap: HebTor (CCS 2020) already built onion exit bridges + micropayments + privacy-preserving reputation. It is near-exact prior art for our egress and is uncited; I should position against it to isolate what is genuinely new (Semaphore+RLN epoch-nullifier anonymous rate-limiting, the uniform-exit-profile normalization). The whole P2P/peer-forwarding branch (Crowds, Tarzan, MorphMix, I2P, Freenet, HORNET) is missing. MASQUE CONNECT-IP (RFC 9484) under Private Relay is absent. ZXAD (zk Tor abuse detection) and sPAR/Panini (stronger-trust transports) are uncited.

### 3. Metadata / traffic-shape privacy (what the encrypted channel still leaks)
Spectrum: none -> constant-rate cover traffic -> padding (WTF-PAD, Walkie-Talkie) -> per-hop Poisson mixing delay -> full DC-net broadcast. Plus the fingerprint sub-axis: client spoofing -> randomization (Brave farbling) -> uniformity (Tor/Mullvad) -> egress-enforced uniform profile.

Position + artifact: uniform exit profile, designed. Normalize UA / Accept-Language / header order / JA3-JA4 / HTTP-2 framing AT the egress, so consistency is structural and FP-Scanner-style lie-detection has nothing to detect. Everyone exits as en-US Chrome-on-Windows, the agent localizes locally. Feasibility swarm-verified (uTLS, enetx/surf, curl-impersonate).

Tradeoff: uniformity maximizes the anonymity set, randomization gives none (FP-Stalker: 34% linkable after 6 months). At real scale, fingerprint uniqueness falls from 83.6% (Panopticlick lab) to 35.7% desktop (Gomez-Boix, 1.8M). Accept-Language alone is 4-6 bits = 16-64x anonymity-set cost.

Unexplored and worse for agents: machine-regular bursts strip the dwell-time jitter that website-fingerprinting relied on as incidental cover (Deep Fingerprinting >90%, Tik-Tok 93.5% on WTF-PAD-defended Tor). We have no WF/flow-correlation (DeepCorr, DeepCoFFEA, RAPTOR) attack material in the corpus. Timing-channel defense for a constant-cadence agent must be re-derived from scratch.

### 4. The searcher / trajectory-level privacy (the agent inverts the threat model)
Spectrum: sparse human query stream -> agent fan-out with per-query defense -> trajectory-as-the-privacy-unit with cumulative-budget accounting (DP under continual observation) -> sensitivity-classified query donation.

Position + artifact: the formalization (`the-search-problem-formalization.md`, the unified tuple P and objective J) and `private-search-when-the-searcher-is-an-agent.md`. Privacy enters J as a leakage cost ℓ priced by λ, accounted cumulatively over the stream.

Tradeoff: functional decomposition forces semantic transparency. A sub-query for blood-pressure norms plus one for low-sodium recipes jointly triangulate a condition no single query stated. IntentMiner reconstructs ~85% of intent from tool-call logs without the prompt (the corpus flags this as one unrefereed number). This is the agent-native AOL re-identification (searcher 4417749).

Unexplored: no agent today plans π to minimize cumulative leakage under a budget; we have no online estimator for ℓ. The deepest original seam is the closed loop: online ℓ-estimation + leakage-minimizing planning + a private stopping rule. A bounded-optimal σ is incidentally a privacy mechanism (every query whose value-of-computation falls below cost never enters a log). Quantifying the stopping/footprint coupling is a clean publishable result no external work frames. Training-time routes to σ (AI-SearchPlanner, Beyond Outcome Reward, ReSeek) are treated only analytically. Decomposition as a dual-use jailbreak vector is uncovered. Network-level/observable-channel leakage and compositional multi-agent privacy are adjacent surfaces absent from the corpus.

### 5. Freshness vs preprocessing (the hint problem)
Spectrum: static snapshot -> epoch + ride-stale -> delta-shard -> client-walked PIR with rotating preprocessing (Pacmann) -> hintless PIR (HintlessPIR, YPIR) -> FHE/RLWE PIR with no hint (Spiral, Respire, OnionPIR).

Position + artifact: flagged as Periscope's real engineering problem, with measured incremental refresh. Rank hint row-delta is 27x smaller at 1k docs (byte-exact, crossover to full resync at ~26k new docs), URL rank-1 patch is 512 B/doc. Re-cluster drift is mild on same-distribution growth (2.5 recall points behind a full re-cluster at 4x). iSimplePIR (eprint 2026/030) is the cited state of the art, referenced not built.

Tradeoff: big-download/cheap-server (SimplePIR/Tiptoe) vs tiny-download/heavy-server (FHE). Staleness is a tunable, not a failure. Hint economics multiply per shard.

Unexplored: does going hintless dissolve the freshness problem (no hint to invalidate)? The deck pins this to a concrete hintless-rank construction but does not prove it composes end-to-end with nearest-neighbor ranking. Drift past 4x and under topic shift is unrun. The client-download vs server-compute vs latency Pareto for 10^5-10^6 docs/shard at 256-768 dim is unmapped.

### 6. Index integrity / who-built-the-corpus (the build plane)
Spectrum: trust the operator -> reproducible public build -> TEE-attested build (Nitro/TDX) -> zkTLS fetch proofs (TLSNotary, DECO, Reclaim, Opacity) -> re-embed audit on a public deterministic model.

Position + artifact: plane separation, empirically confirmed. TEE attests {code measurement, model hash, corpus snapshot, epoch}; lattice crypto guarantees nobody including the TEE sees a query. The PoC proved query privacy needs no TEE at all. v0 bridge = SearXNG fan-out inside a Nitro enclave (operator-blind, engine-unlinkable, honestly weaker than content-private).

Tradeoff: TEEs have a bad confidentiality record but are good at integrity attestation of a batch job; zkTLS is the decentralized substitute at higher proving cost. Index poisoning goes from silently free to an auditable measurement-mismatch.

Unexplored: every PIR paper assumes the index is honest; nobody touched build integrity. Does Nitro attestation compose with a multi-day clustering job? What does the v0 enclave bridge leak through engine fan-out traffic shape? And the live competitor I dismiss in one line: confidential-compute vector DBs (TDX-resident Qdrant/Milvus, CyborgDB, OPAQUE confidential RAG) make the opposite bet, TEE-on-everything. I should position Periscope (crypto-on-query + TEE-on-build) against TEE-on-everything explicitly, and import the four-direction taxonomy (crypto / TEE / anonymization / split-learning) as the top-level partition of private retrieval.

### 7. Incentives / economics (paying anonymous indexers, getting feedback)
Spectrum: ad-funded -> subscription (Kagi) -> token-rewarded uptime (Presearch) -> stake + bounded-quality-multiplier shard market -> Shapley marginal-contribution (provably broken here).

Position + artifact: `feedback-and-rewards-...md` plus alcyone's corrected unit economics. Feedback plane: private heavy-hitters for demand (Poplar/Mastic/DAP, live in Firefox), Prio3 per-shard DP usefulness, federated learning-to-rank gradients. Reward plane: one paid claim per shard per epoch, base-pay x bounded quality multiplier, demand-weighted, to fresh stealth addresses. Live deployment is 3 DO droplets ~$18/mo; infra is ~1% of gross at every scale, so this is a scraper payroll, not an infra business. The two-sided co-op (patrons vs shard operators) is kept distinct from the agent/API line.

Tradeoff: my own MaxShapley theorem forbids the obvious design. Shapley is provably not false-name-proof (a max-game replicator takes (2t+1)/(2t+2)); Ohta et al. prove the incompatibility is axiomatic. So allocation must avoid contribution-splitting: explicit shard boundaries, no band for copies to crowd into. SwarmSearch ships the exact Data-Shapley valuation the corpus proves broken, validating the insight against live prior art.

Unexplored: anonymous, Sybil-resistant, CHEAP credentialing is the root trust anchor and is unsolved everywhere (the single highest-leverage economic question). DP noise drowns signal at small populations (cold-start may need trusted-jury panels). The opt-in intent market is named "most interesting" but never modeled against the data-market graveyard (Datacoup/Streamr/Ocean/BAT). The agent-API line's own economics are unmodeled despite being "arguably the bigger market." Operator retention/labor dynamics and collective-bargaining mechanics are flagged and unmeasured.

### 8. Trust model (who must not collude)
Spectrum: single trusted party -> two non-colluding (OHTTP, two-server PIR, Private Relay) -> anytrust (>=1 honest hides everyone; DC-net) -> no-collusion-assumption single-server crypto (Tiptoe: privacy holds even if every server colludes) -> hardware root of trust (TEE vendor).

Position + artifact: Periscope's query path takes the strongest column (single untrusted server, plain LWE). The egress is honest-but-curious for unlinkability. The leak ledger enumerates what each party learns under each compromise.

Tradeoff: anonymity (anytrust) and liveness (honest-majority/all-online) are separate axes. TEEs buy liveness/bandwidth, not anonymity. The crypto-strongest position pays in compute; the cheapest split-trust positions pay in a collusion assumption you cannot enforce.

Unexplored: the iCloud Private Relay traffic-analysis study (ASIA CCS 2023) shows split-trust two-hop is attackable; we have it at overview level only. Adversarial evaluation of our own egress under a relay-gateway-correlating coalition is unwritten.

### 9. Sybil resistance / access control (the cost of minting an identity)
Spectrum: open commons (Tor exit list, poisonable) -> IP rate-limit (the one free meter, removed by anonymity) -> stake (linear, splittable) -> rate-limited anonymous credentials (Semaphore + RLN nullifiers, Privacy Pass) -> proof-of-personhood (World ID, ~1/human) -> pluralistic composition.

Position + artifact: built. Semaphore membership + per-epoch nullifier hash(secret, epoch) + gateway-side budget counter (RLN at PoC fidelity; full RLN v2 polynomial slashing designed, not built). Anonymity removes the IP rate-limit, so access is the first layer on top of any anonymous transport.

Tradeoff: RLN is a meter, not a mint. It bounds rate per credential, not the number of credentials, so everything reduces to issuance cost C(N). Want superlinear (Vitalik N^2 ideal), cheap at N=1, anonymous at issuance. Pure stake is linear+splittable (stake-splitting, arXiv:2509.18338); personhood caps near 1/human but needs a gate. No published system solves anonymous, Sybil-resistant, cheap credentialing.

Unexplored / positioning gap: Cloudflare shipped private rate-limiting for bots AND agents in 2025-2026, near-exact uncited prior art for the agent angle. Personhood Credentials and Human Challenge Oracles are a 2025 frontier we have not mapped. zk-promises (USENIX'25) is the closest anonymous-reputation prior art. Can RLN's slashable stake double as issuance cost, or does stake-splitting force a personhood gate on top?

### 10. Return path (linking the answer back to the asker)
Spectrum: synchronous rendezvous -> private mailbox async (authorized DPF-write + PIR-read; Express, Sabre, Talek) -> sharded/centroid-routed mailbox read -> folded into the broadcast scheduling round.

Position + artifact: synchronous-rendezvous return path built over Tor. The general async case is a private mailbox: authorized private-write (Express/Sabre, solved as posed) + oblivious private-read (Talek, linear in the log). Flagship open seam.

Tradeoff: this is one of the two seams the broadcast/mempool line hid. A global observer links query to answer by which mailbox slot is fetched, so the read must itself be oblivious.

Unexplored: can the PIR-read be sharded/centroid-routed like Periscope's index so a client scans only its shard? Does folding the collect-read into the IBLT scheduling auction as a second message class leak via different size/shape? The full metadata-private-messaging menu (synchronized-round Vuvuzela/Pung vs async-free-read Express vs hidden-access-pattern Talek vs traffic-analysis-immune Karaoke) is the natural option spectrum for this axis and is engaged only as scattered one-line references.

### 11. Payment / value-carrying credentials (paying without linking funding to spend)
Spectrum: named account -> blind-signature tokens (Privacy Pass RFC 9576) -> KVAC limit credentials (ARC) -> value-carrying anonymous credit tokens (ACT, KVAC/BBS with balance + range proof + fresh nullifier).

Position + artifact: ADOPT, do not reinvent. ACT (draft-schlesinger-cfrg-act) is the chosen prior art; carrying value in one credential is solved (reference Rust impl exists, online atomic nullifier check per Sec 6.5.1). Payment channel for metered egress is designed, not built.

Tradeoff: the open part is composition/binding, not the value-carrying primitive. ACT collapses the funding leak to one padded batched top-up but does not eliminate it; per-spend amount is revealed (fine for flat-rate egress); double-spend is an online atomic nullifier check.

Unexplored: one gateway KVAC dual-mode (ARC free tier + ACT paid) sharing one nullifier store without re-linking tiers; binding spend-nullifier + RLN-nullifier + return-path reply-credential to one query without re-linking all three; distributed/sharded atomic double-spend checking without a single chokepoint.

### 12. Portability vs linkage scope (global metering vs cross-egress unlinkability)
Spectrum: per-egress local meter (unlinkable, no global limit) -> shared-nullifier scope (global limit, cross-egress correlatable) -> re-randomizable token-bucket with out-of-band counter reconciliation.

Position + artifact: flagship, the sharpest genuinely-open seam. Our RLN exposes it: two egresses in the same epoch see the same nullifier for the same user. Privacy Pass RFC 9576 names the hazard directly.

Tradeoff: scope is a knob. Wide gives portability + a global aggregate rate limit but lets an up-to-threshold egress coalition correlate; narrow keeps redemptions unlinkable but gives no global metering.

Unexplored: the falsifiable conjecture. For a credential spent at {E1..Ek} in epoch t, no shared-nullifier construction can simultaneously (a) enforce a global aggregate rate limit and (b) keep any up-to-threshold coalition unable to decide whether two redemptions came from the same user. No known impossibility result surfaced in search, so it stands genuinely open. Does a re-randomizable token-bucket with an out-of-band counter escape it, or is the tension fundamental?

---

## The adversary plane (the axis that should cross every defense above)
The corpus is defense-heavy. The single biggest hole, flagged in its own ledger and getting worse where agents live, is the adversary coordinate. Two separate empty halves:

- Network attacks: website fingerprinting (Deep Fingerprinting 98% closed-world / 93.5% on WTF-PAD-defended Tor), flow correlation (DeepCorr ~96%, DeepCoFFEA ~93%), AS/BGP routing (RAPTOR), statistical disclosure (Danezis >79-95%), query deanonymization (SimAttack ~37% Tor / 45% TrackMeNot / 52% GooPIR). Agent-browser traffic grew 7,851% YoY with benign vs malicious automation separated by 0.5 percentage points, so the surface the corpus ignores is the one exploding. GAPS.md lists these systems but never plots them as a coordinate against the defenses.
- Crypto-search attacks: leakage-abuse (Cash-Grubbs-Perry-Ristenpart CCS 2015), access-pattern query recovery (Islam-Kuzu-Kantarcioglu), volume/range full-DB reconstruction (Kellaris, Grubbs), and the 2025 wave (VIOLIN volumetric injection, Peekaboo passive DSSE). This is the precise evidence for when an encrypted-index defense fails, and it directly prices Periscope's two residual leaks (public centroid leaks coarse topic; contacted-shard set leaks topic) by analogy to volume-reconstruction bounds. Embedding inversion (vec2text, Song-Raghunathan, ALGEN 2025 black-box) is the adversary for the embedding-handling axis: published centroids and stored quantized vectors are an inversion surface, so RaBitQ 1-bit and 4-bit quantization should be re-read as accidental partial defenses.

## The measurement gap (the load-bearing unmeasured claim)
No benchmark scores U, c, and ℓ on the same agent trajectories. Cranfield/TREC scores relevance; GAIA/BrowseComp/DeepResearch Bench score answer correctness; none price leakage or cost. Until one exists, the latency-flip and the whole agent-reprices-the-map thesis are conjecture. It is buildable now: take a real agent trajectory set (Ning et al. 2026, 14.44M requests / 3.97M sessions), run three adversaries as scorers (IntentMiner-style intent alignment, WF accuracy, IP-linkage), plot the operating point.

## Honest scope
- BUILT + LIVE: reputation-gated egress, per-epoch nullifier + gateway budget counter, synchronous return path, Periscope oblivious search (with measured freshness deltas, two-node router, scale study).
- DESIGNED: RLN v2 slashing, ACT value credential, async mailbox return, hint refresh, uniform exit profile, payment channel, hintless-rank Periscope.
- OPEN: the four seams (return path scaling, payment binding, issuance cost, portability/linkage), private late-interaction rerank, online ℓ estimation + leakage-minimizing planning + private stopping, fleet-scale PIR without shared-preprocessing re-linkage, the joint J' benchmark, and the whole adversary plane.

## The composition frontier
The cheapest, highest-leverage missing artifact is the cross-axis matrix: each defense x each attack x deployability x agent-latency-tolerance. The pieces all exist in the corpus; nothing is layered. The matrix would also expose which compositions are redundant (two mechanisms killing the same trace column) vs complementary (each killing a different column), which the orthogonality thesis predicts but never checks.

Sources:
- [SSE survey + forward/backward privacy](https://dl.acm.org/doi/10.1145/3617991), [Leakage-abuse vs FBP-SSE](https://arxiv.org/abs/2309.04697)
- [Oblix doubly-oblivious search index](https://people.eecs.berkeley.edu/~raluca/oblix.pdf), [DORY distributed-trust encrypted search](https://eprint.iacr.org/2020/1280.pdf)
- [Labeled PSI from FHE, malicious security](https://www.microsoft.com/en-us/research/publication/labeled-psi-from-fully-homomorphic-encryption-with-malicious-security/), [Labeled PSI reduced comm](https://eprint.iacr.org/2021/1116)

---

## Coverage matrix

| Axis | Options (spectrum) | What we explored (artifact, status) | Open |
|---|---|---|---|
| 1. Retrieval-content privacy | plaintext -> no-log engine -> decoys -> single-server PIR -> client-walked -> ORAM -> 2-server FSS | Periscope LWE-PIR, BUILT+LIVE; top-10 overlap 0.56 measured | private late-interaction/rerank (no prior art); keyword/KV PIR + labeled PSI uncited; DEPIR; GPU/in-memory PIR |
| 1b. Corpus ownership | public shared index -> private owned (SSE FBP) -> ORAM-index (Oblix/DORY) | NONE; private-RAG named as frontier, never modeled as SSE | whole SSE axis; leakage-tier vocabulary as a grading rubric; Oblix/DORY uncited |
| 2. Network-identity | direct -> proxy/VPN -> OHTTP -> Private Relay -> Tor -> mixnet -> DC-net -> P2P | reputation-gated onion egress, BUILT+LIVE; p50 1.9s | HebTor uncited prior art; P2P branch; MASQUE CONNECT-IP; sPAR/Panini |
| 3. Traffic-shape / fingerprint | none -> cover -> padding -> Poisson delay -> DC-net; spoof->random->uniform->egress-uniform | uniform exit profile, DESIGNED; entropy figures verified | WF/flow-correlation vs constant-cadence agent (zero corpus material) |
| 4. Trajectory / searcher | sparse human -> agent fan-out -> trajectory-budget DP -> donation | the formalization (P, J) BUILT-as-theory | online ℓ estimator; leakage-min planning; stopping-as-privacy loop; multi-agent compositional leak |
| 5. Freshness vs hint | static -> epoch -> delta-shard -> rotating preproc -> hintless -> no-hint FHE | measured deltas (27x, byte-exact), DESIGNED protocol | hintless dissolves freshness?; topic-shift drift unrun; the download/compute/latency Pareto |
| 6. Index integrity / build | trust op -> reproducible -> TEE-attested -> zkTLS -> re-embed audit | plane separation, CONFIRMED; v0 Nitro+SearXNG bridge | Nitro vs multi-day clustering; confidential-vector-DB camp (TEE-on-everything) undebated |
| 7. Incentives / economics | ad -> subscription -> token-uptime -> stake+quality -> Shapley(broken) | feedback+reward design + alcyone unit economics, DESIGNED; live $18/mo | cheap anonymous credentialing; intent-market vs data-graveyard; agent-API economics unmodeled |
| 8. Trust model | single -> 2-non-collude -> anytrust -> no-collusion crypto -> TEE vendor | Periscope strongest column; leak ledger, BUILT | adversarial eval of own egress under correlating coalition; Private Relay attack study at overview only |
| 9. Sybil / access | open commons -> IP-limit -> stake -> RLN creds -> personhood -> pluralistic | Semaphore+epoch-nullifier+budget counter, BUILT (RLN v2 DESIGNED) | issuance cost C(N) unsolved; Cloudflare private rate-limiting uncited; personhood-credential frontier |
| 10. Return path | sync rendezvous -> mailbox async -> sharded read -> folded into round | sync return path BUILT; async = Express/Sabre/Talek | FLAGSHIP: PIR-read sharding at scale; metadata-private-messaging menu unmapped |
| 11. Payment binding | named -> blind tokens -> KVAC limit -> value-carrying (ACT) | ACT ADOPTED (designed); channel DESIGNED | 3-nullifier binding; dual-mode one-credential; distributed atomic double-spend |
| 12. Portability vs linkage | local meter -> shared nullifier -> re-randomizable token-bucket | FLAGSHIP open conjecture surfaced by our RLN | is the impossibility conjecture true? no known result |
| ADV. Adversary plane | WF / flow-correlation / AS-BGP / SDA / leakage-abuse / volume-recon / embedding-inversion | almost none (defense-heavy corpus) | the biggest hole; plot every attack against every defense; worse for agents |
| MEAS. Joint J' benchmark | relevance-only / answer-only / (U,c,ℓ)-jointly | none scores all three | buildable now on Ning et al. 2026 traces with 3 adversaries as scorers |

---

## Research threads, located in the space

1. Periscope oblivious search (LWE-PIR over a public index) — axis 1, hint-based LWE corner; BUILT+LIVE with measured quality tax, freshness deltas, router, scale study.
2. Reputation-gated onion egress — axis 2 + 9, Tor onion-service rendezvous + Semaphore/RLN gating; BUILT+LIVE.
3. Uniform exit-profile fingerprint normalization — axis 3, egress-side UA/JA3/HTTP2 uniformity; DESIGNED, feasibility-verified.
4. The search-problem formalization (tuple P, objective J) — axis 4, unifies AI state-space + optimal-stopping + IR ranking; theory.
5. When-to-stop metareasoning for search agents — axis 4, value-of-computation σ and why all five closed-form stopping rules break; theory, with stopping-as-privacy as the open intersection.
6. Private search when the searcher is an agent (the latency-flip + WHO/WHAT split) — axes 2/3/4 cross-cut; theory, the load-bearing unmeasured thesis.
7. Residential-proxy demolition + consent-spectrum field map — axis 2 null result; empirical taxonomy of 58 providers, the anonymity anti-pattern verdict.
8. Tor exit-blocking benchmark — adversary/deployability corner of axis 2; 392 reqs / 70 exits, 87-100% block on walled engines, the empirical reason the problem exists.
9. TEE-attested build plane (plane separation) — axis 6 + 8; CONFIRMED that query privacy needs no TEE, TEE is for integrity only; v0 Nitro bridge.
10. Feedback + rewards for private decentralized search (MaxShapley-broken, DAP/Prio3/FL channels) — axis 7; DESIGNED, with the anonymity-proof Shapley impossibility as the load-bearing theorem.
11. alcyone two-sided co-op + corrected unit economics — axis 7; scraper-payroll finding, two-markets framing, n=1 personal search-stats.
12. The four request/response seams (return path, payment binding, issuance cost, portability/linkage) — axes 9-12; the flagship open frontier surfaced once the agent forces request/response.
13. Low-download / hintless brief + deck — axis 5; the freshness-dissolves-with-the-hint hypothesis and three PIR families mapped.
14. The mixer non-result (cross-user query summing) + the sound multi-client-separable open problem — axis 1; embedding inversion kills the naive version.
15. The corpus self-audit (GAPS.md / SYNTHESIS / INDEX meta-layer) — the meta-thread that already names most open problems and the second-order blind spots it cannot see.