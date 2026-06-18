# Durable research digest (grouped by the 8 threads)

Every external fact carries its citation URL. Verification state noted. This is the citation spine for the leave-behind doc.

## Thread 1 — Lineage (DC-net -> ZipNet -> ADCNet -> Flashnet -> NAMP)
- Anonymity trilemma: against a GLOBAL PASSIVE adversary, strong anonymity requires paying in either added latency OR added bandwidth (cover traffic). A lower bound coupling the two, a continuous frontier, NOT a discrete pick-2-of-3. Das, Meiser, Mohammadi, Kate, IEEE S&P 2018. https://eprint.iacr.org/2017/954 (claim attested via dossier; PDF binary-unreadable on fetch, confirm exact wording before precise spoken use).
- ZipNet: client-server anytrust, anonymity holds if >=1 of e.g. 2 servers is honest; TEEs and untrusted aggregators buy bandwidth/liveness, NOT anonymity. Rosenberg et al., PoPETs 2025, eprint 2024/1227. https://eprint.iacr.org/2024/1227
- VERBATIM (verified via NAMP): "anonymity does not rely on the security of TEEs." https://writings.flashbots.net/network-anonymized-mempools
- NAMP metadata thesis VERBATIM (verified): "Even when infrastructure runs in TEEs, operators are still able to learn metadata opening up surface area for selective censorship and adversarial MEV strategies." Same URL.
- NAMP trilemma framing VERBATIM (verified): "We provide the strongest level of anonymity ... and achieve low latency, at the cost of moderate bandwidth overhead." Same URL.
- ADCNet: Go PoC "mostly based on ZIPNet," IBLT auction scheduling + knapsack engine, optional Intel TDX attestation, anytrust ("one honest server"). README disclaimer VERBATIM (verified): "This repository is a work in progress. A lot of it is vibe-coded, a lot of the cryptography is hand-rolled. Do not use for any production use cases!" https://github.com/flashbots/adcnet
- Flashnet: ZipNet core + IBLT knapsack auction replaces wasteful random slots. Anonymity = anytrust; liveness is the separate honest-majority/all-online axis, keep distinct. https://collective.flashbots.net/t/anonymous-broadcast-with-auction-based-scheduling/5630
- DC-net (Chaum 1988): XOR aggregation; anonymity information-theoretic ONLY relative to pre-shared unconditionally-secure pairwise keys (degrades to computational with PK-derived keys), assumes reliable broadcast; a single malicious participant can anonymously JAM. https://link.springer.com/article/10.1007/BF00206326
- NAMP staking integration is NOT in the writeup; it is the user's own extrapolation. Flag as such.
- ZipNet/Flashnet concrete latency/throughput numbers were never retrieved; keep off slides.
- Simkin sqrt-bandwidth trick: UNPUBLISHED. Talk exists (MEV-SBC 2025, youtube qurXQD2pBrw) but no eprint. Any reconstruction is first-principles, defer specifics to Mark, never cite a paper.

## Thread 2 — Threat model (one leak, three rooms)
- Shared invariant: a network observer or the receiving endpoint learns source IP, destination, timing/volume/packet-shape, bound to a stable identity, regardless of payload encryption. TLS protects content not shape; destination in CONNECT, re-leaked by cleartext SNI without ECH.
- Room 1 BuilderNet: orderflow-proxy is plain mTLS with attested certs and peer forwarding; authenticates/signs, does NOT anonymize the sender. https://github.com/flashbots/buildernet-orderflow-proxy . IP-leak framing lives in NAMP / decentralized-building (https://writings.flashbots.net/decentralized-building-wat-do), NOT the BuilderNet intro post. Room 1 is the PARTIAL case: attestation/attested-peer architecture blunts some of it; threat model is operator-as-adversary at a known endpoint.
- Room 2 inference: Confidential Prompting (arXiv:2409.19134, Li, Gim, Zhong) secures prompt content in a CVM/TEE and is SILENT on client IP / who-is-asking; its only network statement limits the CVM's outbound capability. https://arxiv.org/abs/2409.19134 VERIFIED. Frame the IP leak as a gap the paper leaves, not a claim it makes.
- Room 3 search: Tiptoe non-goal VERBATIM (verified): "Tiptoe does not hide when a client makes a query, or how many queries the client makes." https://eprint.iacr.org/2023/1438 . Wally builds the anonymous network in as an ASSUMPTION, VERBATIM (verified): "In Wally, each client adds a few fake queries and sends each query via an anonymous network to the server at independently chosen random instants." https://arxiv.org/abs/2406.06761 . Credit Wally, not Tiptoe, for the stacking. Wally relaxes to (e,d)-DP, not PIR.
- Four disanalogies that sharpen "fix it once": (1) return-path asymmetry (mempool fire-and-forget vs search/inference request/response); (2) anonymity-set composition differs per room; (3) BuilderNet has a partial non-network mitigation the others lack; (4) content sensitivity unequal (inference needs both content- and origin-hiding, search mostly origin-hiding).

## Thread 3 — Residential proxies (the disqualified escape)
- 911 S5: DOJ May 29 2024, over 19M IPs across 190 countries, malware-bundled fake VPNs, operator YunHe Wang, ~$99M revenue. https://www.justice.gov/archives/opa/pr/911-s5-botnet-dismantled-and-its-administrator-arrested-coordinated-international-operation VERIFIED.
- Structural point: a proxy relocates the all-seeing observer to a commercial party bound to your billing identity; no cryptographic unlinkability, unilateral deanonymization. Contrast = split trust across non-colluding parties (RFC 9458 OHTTP). https://www.ietf.org/rfc/rfc9458.html

## Thread 4 — PIR / oblivious search (Part 2, Periscope)
- Lower bound (Beimel-Ishai-Malkin): single-server stateless PIR must touch every entry per query unless preprocessed into a database-dependent hint. https://eprint.iacr.org/2007/351
- SimplePIR/DoublePIR (eprint 2022/949, USENIX Sec 2023; NOT 2023/1438): 1 GB DB, SimplePIR hint 121 MB, 242 KB/query, ~10 GB/s/core; DoublePIR hint 16 MB, 345 KB/query, 7.4 GB/s/core. Hint = A*DB, invalidated by any DB change. https://eprint.iacr.org/2022/949 VERIFIED.
- Tiptoe (eprint 2023/1438, SOSP 2023): private nearest-neighbor over embeddings, 360M pages, 145 core-s/query, 2.7s on 45 servers. https://eprint.iacr.org/2023/1438
- Periscope (on disk, VERIFIED): n=1024 q=2^32 sigma=6.4; 234 pages/6143 chunks, 20/20 correctness, 49ms median, ~29 KiB up / ~8 KiB down at this corpus size, per-query bandwidth ~sqrt(N); hint size fits ~N^0.497; live on 3 DO nodes ~$18/mo. TWO error sources: top-10 overlap vs full-scan 0.56 (0.64 vs quantized) = quantization loss on the built thing; two-node router accuracy 0.812 (~19% wrong shard), router top-10 vs oracle 0.431 vs single-index 0.356. NOT built: incremental hint refresh; agent-era multi-vector blowup. (BENCH.md, BENCH_ROUTER.md, BENCH_SCALE.md.)
- iSimplePIR (eprint 2026/030, Jan 2026): first single-server entry-level incremental scheme on SimplePIR; the unbuilt-refresh state of the art. https://eprint.iacr.org/2026/030
- Agent-era cost: agentic RAG fans out ~2-3 sub-queries/task (commonly cited range, not authoritative); ColBERT-style multi-vector queries multiply the oblivious matvec by token count; no private system has absorbed multi-vector queries. https://arxiv.org/abs/2004.12832

## Thread 5 — Return path (Seam A)
- General async return path = a private mailbox: authorized DPF private-write (Express/Sabre virtual-address + blind-MAC) + PIR private-read (Talek oblivious logging). KNOWN PRIOR ART, not novel.
- Express (USENIX Sec 2021): two non-colluding servers, DPF write O(log M) request, server work O(M) per write (linear scan); recipient hands senders a virtual address carrying a secret-shared MAC key. https://people.eecs.berkeley.edu/~henrycg/files/academic/papers/sec21express.pdf
- Talek (ACSAC 2020): pseudorandom log positions from a shared secret, PIR-read; ~9,433 msgs/sec at 32,000 users, 1.7s; read cost linear. https://eprint.iacr.org/2020/066
- Mark's store-and-handle is the synchronous special case; its leak is that the FETCH reveals which slot is yours, fixed by PIR-read.
- ACTUALLY-OPEN core: (a) sharding/centroid-routing the PIR-read at search scale (Periscope-style); (b) whether folding collect-reads into the IBLT auction as a second message class leaks via different size/shape. Both DESIGNED, not built.

## Thread 6 — Payment (Seam B)
- Carrying value in one anonymous credential is SOLVED. ACT (draft-schlesinger-cfrg-act, Schlesinger & Katz, Google): KVAC/BBS credential carrying numeric balance, spend via range proof, fresh nullifier per spend, signed anonymous change; leaks only nullifier + spent amount; double-spend is an online nullifier-set check that MUST be atomic with insertion (draft Section 6.5.1). https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html + reference Rust https://github.com/SamuelSchlesinger/anonymous-credit-tokens VERIFIED.
- Deployed cousin: Nym zk-nyms, "payment de-linked from usage," threshold blind issuance (Coconut) + offline ecash. https://nym.com/zk-nyms ; Coconut https://arxiv.org/pdf/1802.07344
- ARC (Anonymous Rate-Limited Credentials, Yun-Wood): KVAC with a fixed presentation limit L; nonce is strictly a COUNT, not value. The free-tier dual to ACT's paid balance. https://datatracker.ietf.org/doc/draft-ietf-privacypass-arc-protocol/
- Why a zk payment channel fails: on-chain open/close is a public (payer, gateway, amount, time) edge; settlement linkage; routing/timing correlation on an un-padded medium. zk hides the interior, leaks at the boundary. https://arxiv.org/pdf/2208.09716
- The seam ACT leaves open (the actual RQ): dual-mode one-credential (ARC limit + ACT balance) sharing one nullifier store without re-linking tiers; collapsing the funding event to one padded batched top-up; binding the spend nullifier + RLN nullifier + reply credential to one query without re-linking all three.

## Thread 7 — Sybil / issuance cost (Seam C) and portability vs linkage (Seam D)
- RLN precisely (RLN v2): Semaphore membership + Shamir secret sharing; A(x)=a1*x+a0, a1=Poseidon(a0, externalNullifier, messageId), externalNullifier=Poseidon(epoch, rln_identifier), nullifier=Poseidon(a1); exceed userMessageLimit -> two points on the line -> reconstruct a0 -> slash. https://rate-limiting-nullifier.github.io/rln-docs/rln_in_details.html (confirm field ordering vs circuit source before any verbatim v2 slide.) The LIVE PoC is the simpler one-message-per-epoch nullifier with a gateway-side budget counter, NOT in-circuit SSS reconstruction.
- C(N) (issuance cost) three constraints: (a) >=linear, ideally superlinear in N (Vitalik N^2 ideal); (b) cheap at N=1; (c) anonymous at issuance (issuer learns only "one new member"). https://vitalik.eth.limo/general/2023/07/24/biometric.html
- Known frontier: pure stake = linear and splittable (stake-splitting linearity, arXiv:2509.18338 https://arxiv.org/pdf/2509.18338); proof-of-personhood caps near 1/human (World ID already uses Semaphore, https://world.org/blog/worldcoin/worldcoin-privacy-faqs); pluralistic composition is the realistic target. Open: can RLN's slashable stake double as issuance cost, or does stake-splitting force a personhood gate on top.
- Portability vs linkage (FLAGSHIP): Privacy Pass RFC 9576 names the redemption-context linkage hazard ("Clients that redeem the same token to multiple Origins do risk those Origins being able to link Client activity together"). https://www.rfc-editor.org/rfc/rfc9576.html . Falsifiable conjecture: global aggregate rate limiting and cross-egress unlinkability are mutually exclusive under any shared-nullifier construction; open whether a re-randomizable token-bucket with an out-of-band global counter escapes it.

## Thread 8 — Craft (how to present to PIG)
- Seminar, not a conference talk: 12-16 slides max (hard cap 14 here + slide-0 frame), 18-22 min prepared spine, plan 30-40% eaten by interruptions, the seam discussion IS the deliverable. https://simon.peytonjones.org/great-research-talk/
- Slide sparse, precision in your mouth; crypto detail in speaker notes never projected.
- One threat-model diagram letter-perfect: actors, trust boundary, who-sees-what per edge.
- Demo the problem-to-solution contrast interactively, BEFORE the open questions; under 4 min with a recorded fallback.
- Open problems framed as seams in a shared system, hooked to one person by name, then STOP talking and let silence pull someone to the whiteboard.

---

## Corrections the critics forced (provenance)
- RQ2 (payment) was the near-fatal one: it was framed as "most genuinely open" / a discovery, but the primitive (value-carrying anonymous credential) already ships as ACT + Nym zk-nyms. Reframed to adopt ACT and scope the open part to composition/binding/funding-event. Presenting it as a discovery to this room would have read as not having done the reading.
- RQ4 (portability vs linkage) promoted to flagship: it is the cleanest "no one has solved this," restated as a falsifiable conjecture.
- RQ1 (return path) was mostly solved as posed (Express/Talek private mailbox); sharpened to the two open sub-problems (PIR-read at search scale; auction scheduling of return-reads).
- The "seams the mempool hid" banner only fit A and B; split into HID (A,B, request/response-forced) vs SHARED (C,D, transport-independent).
- Crypto precision: trilemma is a lower-bound frontier not pick-2-of-3; the live PoC is Semaphore + gateway-counter nullifier, NOT RLN v1/degree-0 (no Shamir, no slashing); SimplePIR is 242 KB/q at 1GB so Periscope's ~29 KiB must be labeled "at this corpus size, ~sqrt(N)"; Periscope has TWO error sources (0.56 quantization + 0.81 routing), not one; agent-parallelism/return-path equivalence is a proposal with a named gap (one-class allocator), not a settled answer.
