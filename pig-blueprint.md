# Master blueprint (FINAL): One leak, three rooms

**Spine:** Threat-model-first. Open cold on the last-mile network leak and prove it survives every application-layer fix across three named rooms. Once the threat is felt, the layers, the built artifacts, and the four research questions fall out as forced consequences. Motivation precedes mechanism on every slide. Demo lands at the hinge between threat and open. Crypto precision lives in speaker notes, not on slides.

**Format (seminar craft):** HARD CAP 14 live slides plus a slide-0 timebox frame. Prepared spine ~18-22 min, plan for interruptions to eat 30-40% of the clock. Leave-behind doc (`pig-research-questions.md` + `PIG-WALKTHROUGH.md`) with full citations handed out at the END. Crypto depth ~75% intuition / ~25% precise; the precise 25% is spoken or in notes. Plan for the deck to be abandoned mid-talk when someone goes to the whiteboard.

**Voice:** Punchy declaratives, distinction-by-negation, first person, sentence case, no em dashes, real nouns, honest scope. Never fake evidence for unbuilt things.

**Recurring visual: the four-seam rail.** A thin four-row strip introduced dim on slide 5, lit one row at a time across the seam slides:
- row A: return path (the mempool HID it) -> Mark
- row B: payment (the mempool HID it) -> the cryptographers
- row C: issuance cost / Sybil (mempool SHARES it, transport-independent) -> Sarah
- row D: portability vs linkage (mempool SHARES it, transport-independent) -> Jonathan/Luis. **FLAGSHIP.**

**Live-scope-down fallback (cut order when interruptions eat the clock):** drop Slide 7 (residential proxies) first, then Slide 14 (Periscope/Part 2) second. NEVER cut the demo or the seam slides; the seam discussion is the deliverable.

---

## Slide 0 — Timebox frame (spoken, ~20 sec, optional micro-slide)
- "I will talk about 20 minutes, then it is yours. Stop me whenever. The point is for one of you to pick up a problem, not for me to finish the deck."

## Section 1 — Cold open: the leak (3 slides)

### Slide 1 — One leak, three rooms
- One sentence out loud: one network-layer leak sits under three things you already care about, and the transport to fix it already exists. No bio, no outline. Subtitle states the leak precisely: source IP, timing/volume, who-you-dial, bound to a stable network identity, regardless of payload encryption. Unlinkability story, not confidentiality.
- Visual: near-black title slide, one line of type, three faint room outlines (builder, enclave, search box) all wired to one red node labeled YOUR IP.

### Slide 2 — The invariant: TLS hides content, not shape
- A network observer or the receiving endpoint learns source IP, destination, timing/volume/packet-shape, regardless of payload encryption. TLS protects content not shape; destination in CONNECT, re-leaked by cleartext SNI without ECH. The application-layer primitive in each room hides a DIFFERENT thing and leaves this untouched. That orthogonality is the whole thesis.
- Visual: one horizontal flow client -> [TLS tunnel, payload locked] -> server; annotate OUTSIDE the tunnel in red: IP, timing, size, destination.

### Slide 3 — Flashbots already named this
- Pre-empt "is this your invention." Flashbots-native problem.
- VERBATIM (verified, slide-safe): "Even when infrastructure runs in TEEs, operators are still able to learn metadata opening up surface area for selective censorship and adversarial MEV strategies." (writings.flashbots.net/network-anonymized-mempools)

## Section 2 — Three rooms, one leak (4 slides)

### Slide 4 — Room 1: BuilderNet counterparty IP (own the asterisk on-slide)
- Actor: an orderflow provider sending bundles to a builder instance. Orderflow encrypted to the TEE, content safe. Connection is plain mTLS; operator at the endpoint learns sender IP, timing, volume. Enables selective censorship by network identity, latency discrimination, traffic-blocking of a known counterparty. SAY THE ASTERISK OUT LOUD: Room 1 is the partial case. Attestation and the attested-peer orderflow-proxy architecture blunt some of this, which is exactly why it is the easy leg and search/inference are the hard ones. Threat model: operator-as-adversary at a known endpoint.
- Citation: github.com/flashbots/buildernet-orderflow-proxy (plain mTLS, attested certs, peer forwarding; authenticates+signs, does NOT anonymize the sender). IP-leak framing attributed to NAMP / decentralized-building, NOT the BuilderNet intro post.

### Slide 5 — Room 2: the last mile to a TEE
- Actor (named): a journalist or researcher querying an attested inference enclave, whose query PATTERN, not content, is sensitive; or an agent whose query volume fingerprints its operator. The TEE protects prompt content; does nothing for the last mile. Secure inference is not anonymous inference. Jonathan I-listened signal: I am NOT building private inference, this is unlinkability not confidentiality, the thing I told you in DM.
- Visual: same diagram shape as Room 1 (visual rhyme). Introduce the dim four-seam rail here.
- Citation (corrected framing): Confidential Prompting (arXiv:2409.19134, Li/Gim/Zhong) secures prompt content in a CVM/TEE and is SILENT on client IP. Frame the IP leak as a gap the paper leaves open, not a claim it makes. VERIFIED.

### Slide 6 — Room 3: hitting a search engine
- Two layers. Against a normal engine you leak IP AND raw query. Against an oblivious (PIR) engine the query content is hidden but you still open a connection that leaks IP, timing, query count. Spoken line credits WALLY, not Tiptoe, for the stacking: Tiptoe says it does not hide the metadata; Wally fixes that by ASSUMING an anonymous network plus fake queries. That two-layer stack is mine.
- VERBATIM Tiptoe non-goal (verified): "Tiptoe does not hide when a client makes a query, or how many queries the client makes."
- VERBATIM Wally (verified): "In Wally, each client adds a few fake queries and sends each query via an anonymous network to the server at independently chosen random instants."
- Citation: Tiptoe SOSP 2023 (eprint 2023/1438). Wally arXiv:2406.06761 (relaxes to (ε,δ)-DP, not PIR; say so).

### Slide 7 — The escape that fails: residential proxies (FIRST to cut if short)
- Pre-empt "why not a VPN/proxy." A residential proxy does not anonymize you; it relocates the all-seeing observer to a commercial intermediary bound to your billing identity. No cryptographic unlinkability, unilateral deanonymization. Supply chain structurally non-consensual: 911 S5, over 19M IPs across 190 countries, malware-bundled fake VPNs, DOJ May 2024. Real anonymity = unlinkability split across non-colluding parties, which proxies lack.
- Citation: DOJ 911 S5 takedown May 29 2024 (justice.gov) VERIFIED. RFC 9458 (OHTTP) as the split-trust contrast.

## Section 3 — The pipe and what it forces (2 slides)

### Slide 8 — The fix exists: I do not rebuild the pipe
- Real anonymity needs anonymous broadcast, and Flashbots already built the pipe: DC-net (Chaum 1988) -> ZipNet -> ADCNet -> Flashnet -> NAMP. Two facts on separate lines: anonymity = anytrust (>=1 honest server hides everyone); liveness = the separate honest-majority/all-online axis. TEEs buy liveness/bandwidth, NOT anonymity.
- Trilemma as INTUITION not slogan-theorem: against a global passive adversary, strong anonymity is not free, you pay in added latency OR added bandwidth (cover traffic). A lower bound coupling the two, a continuous frontier, not a clean pick-2-of-3. The Flashbots line spends bandwidth to keep latency low. Do NOT assert exactly two of three.
- DC-net honesty (notes): anonymity is information-theoretic only relative to pre-shared unconditionally-secure pairwise keys (degrades to computational with PK-derived keys) and assumes a reliable broadcast channel. A single malicious participant can anonymously JAM by XORing garbage (known DC-net DoS). If asked "IT or computational," answer "depends on key setup."
- VERBATIM ZipNet (verified): "anonymity does not rely on the security of TEEs."
- Citation: trilemma Das/Meiser/Mohammadi/Kate IEEE S&P 2018 (eprint 2017/954). ZipNet PoPETs 2025 (eprint 2024/1227). Keep ZipNet/Flashnet concrete latency numbers OFF every slide.

### Slide 9 — What you inherit the moment you turn it on
- Spam. Sybil, flooding, IP poisoning. Anonymity removes the one free rate-limit the internet gave you: the IP. Transport-independent: true for Tor, DC-net, mixnet alike. First wall, exactly what Sarah raised unprompted. So the first thing on top of the pipe is not the application, it is an access layer.
- Spoken aside (Luis hook, the auction's first appearance): the IBLT knapsack auction that schedules the broadcast round is also the lever for agent parallelism. Hold the precise claim for the seam slides.

## Section 4 — What is built (2 slides; demo is the hinge)

### Slide 10 — Reputation-gated egress (built + live) + the LIVE DEMO
- The access layer, built + verified live (deployed 2026-06-08, p50 1.9s vs real Google). Client proves zk membership (Semaphore v4), dials a Tor onion service (no exit), gateway tunnels out from one clean IP; home IP and Tor exit never touch the target.
- Anti-spam at PoC fidelity (drop "RLN v1 / degree-0"): Semaphore membership proof + a per-epoch nullifier hash(secret, epoch), rate limit enforced by a gateway-side budget counter, NOT in-circuit Shamir reconstruction. The RLN idea at PoC fidelity; the gateway counts. Full RLN polynomial slashing is designed, not built. Nullifiers unlinkable across epochs; session-level unlinkability still depends on anonymity-set size and timing.
- Adversary model (live PoC): gateway trusted-for-availability, honest-but-curious for unlinkability. Sees the nullifier AND outbound query timing (just not home IP), so a single point that could correlate timing.
- The three numbers Mark asked for twice: message size ~constant per query; anonymity-set size = current deployed Semaphore leaf count = 1 today (proof-of-mechanism, grows live as the room joins in the demo); latency p50 1.9s over Tor. Own that a small set is a small set; effective set degrades to the subset sharing pinnable metadata.
- Over-Tor caveat (sharpest disanalogy): these numbers live in the WEAK-anonymity, no-cover-traffic corner (Tor) by design; the moment it rides Flashnet, cover-traffic cost reshapes latency/bandwidth per the trilemma.
- Backed by a measured Tor exit-blocking benchmark (392 reqs/70 exits: niche 0% blocked, Cloudflare/Akamai-fronted 87-100%).
- THE DEMO (the hinge, under 4 min): hand out Semaphore keys; the room joins the set, runs the shim, curls a real query through the egress, watches the nullifier rate-limit past the epoch budget. Recorded 30s fallback cut queued. Re-run benchmark morning-of, update the leaf-count number.
- Visual: the letter-perfect threat-model diagram. Boxes: client, gateway/egress, target engine (NEW: tagged malicious actor, learns only the clean shared egress IP, can block/poison = shared-fate DoS), reputation set, enrollment issuer (NEW: sees only "one new member", never links leaf to person/traffic). Trust boundary drawn, every edge labeled who-sees-what, each actor tagged HBC vs malicious.

### Slide 11 — Honest scope ledger
- BUILT+LIVE: reputation-gated egress; per-epoch nullifier with gateway-side budget counter; synchronous-rendezvous return path (Tor); Periscope oblivious search.
- DESIGNED, not built: full RLN v2 polynomial slashing; ACT/KVAC value-carrying credential; broadcast return path via private mailbox (DPF-write + PIR-read); incremental hint refresh; DAppNode distribution (ride ~4000 DAppNode nodes; packaging + incentive, NOT cold-start); folding return-reads into the IBLT auction (allocator models one message class; accounting not worked out).
- OPEN: the four seams.
- INHERITED (not mine): ZipNet, ADCNet, Flashnet, NAMP. NAMP staking integration is MY extrapolation, not in the writeup; label it.
- VERBATIM ADCNet (verified): "This repository is a work in progress. A lot of it is vibe-coded, a lot of the cryptography is hand-rolled. Do not use for any production use cases!"

## Section 5 — The seams (research questions) (2 slides)

### Slide 12 — The asymmetry, then the two seams the mempool HID (return path -> Mark, payment -> cryptographers)
- Open with the asymmetry: the leak is shared across all three rooms; the FIX surface is not. Split honestly: TWO seams the mempool HID (return path, payment), forced by request/response and never solved by the broadcast line; TWO it SHARES but never centered (issuance cost, portability/linkage), transport-independent. This slide covers the two HID seams.
- Seam A return path (-> Mark). Actor: a global passive observer who links a client's outbound query to its inbound answer by watching which mailbox slot it fetches. The general async return path IS a private mailbox (authorized DPF-write + PIR-read, Express/Talek), KNOWN prior art. Mark's store-and-handle is the synchronous special case; the fetch is itself a PIR. Open: (a) can the PIR-read be sharded/centroid-routed like Periscope's index so a client scans only its shard not a linear scan over all mailboxes at search scale; (b) does folding the collect-read into the IBLT auction as a second message class leak via different size/shape. Keep the two Mark-things SEPARATE: store-and-handle is the candidate; the sqrt-bandwidth work is a different thing, "your construction, which I have not seen written down", never part of the return-path answer.
- Seam B payment (-> cryptographers). Actor: the gateway-as-payee, both issuer and verifier, must not connect funding to spend. ACT named as adopted PRIOR ART up front: carrying value in one anonymous credential is SOLVED (ACT draft-schlesinger-cfrg-act, KVAC/BBS, balance, range proof, fresh nullifier, signed change; reference Rust; Nym zk-nyms deployed cousin). Re-posed as the composition/binding seam ACT leaves open: (1) one gateway KVAC dual-mode (ARC limit free tier + ACT balance paid) sharing one nullifier store WITHOUT re-linking tiers; (2) collapse the funding event to one padded batched top-up (ACT collapses the leak to one event, does NOT eliminate it); (3) bind spend nullifier + RLN nullifier + return-path reply credential to one query without re-linking all three. Honest scope said out loud: ACT double-spend is an online nullifier-set check, MUST be atomic with insertion; per-spend amount revealed (fine for flat-rate egress).
- Citation: ACT draft-schlesinger-cfrg-act (Schlesinger & Katz). Nym zk-nyms. Express USENIX Sec 2021, Talek ACSAC 2020. zk-PCN graph leakage arXiv:2208.09716.

### Slide 13 — The two seams the mempool SHARES (Sybil root -> Sarah; portability vs linkage -> Jonathan/Luis, FLAGSHIP)
- Seam C issuance cost / Sybil root (-> Sarah, raised Sybil unprompted). Actor: a spammer minting cheap leaves. RLN is a meter, not a mint. C(N) = cost for one adversary to control N valid leaves; want (a) at least linear ideally superlinear (Vitalik N^2 ideal), (b) cheap at N=1, (c) anonymous at issuance (issuer learns only "one new member"). Known frontier: pure stake linear+splittable; proof-of-personhood caps near 1/human (World ID already on Semaphore); pluralistic composition is the realistic target. Sharp sub-question: can RLN's slashable stake double as issuance cost, or does stake-splitting linearity force a personhood gate on top; does anonymous issuance preclude social-graph methods.
- Seam D portability vs linkage (-> Jonathan/Luis). FLAGSHIP, sharpest genuinely-open. Actor: a coalition of up-to-threshold egress operators. Scope is a knob: wide = portability + cross-egress correlation; narrow = unlinkable but no global metering. My RLN shows it: two egresses in the same epoch see the same nullifier for the same user. Falsifiable conjecture: for a user spending one credential at {E1..Ek} in epoch t, is there a scope construction that simultaneously (a) enforces a GLOBAL aggregate rate limit and (b) keeps any coalition of up-to-threshold egresses unable to decide whether two redemptions came from the same user? Conjecture: (a)+(b) mutually exclusive under any shared-nullifier construction. Open: does a re-randomizable token-bucket in an ARC-style credential with the global counter reconciled out of band escape it, or is it fundamental?
- Citation: Vitalik biometric/pluralistic (2023). Stake-splitting linearity arXiv:2509.18338. Privacy Pass RFC 9576, ARC draft.

## Section 6 — Part 2 + close (3 slides; Periscope SECOND to cut if short)

### Slide 14 — Part 2: the raw-query leak (Periscope) [cut after Slide 7 if tight]
- Granting IP hiding, hitting a search engine still leaks your raw query to the engine. Periscope is the oblivious-search answer, built + benchmarked. Tiptoe/SimplePIR style, secret-key Regev LWE (n=1024, q=2^32, sigma=6.4); client embeds+encrypts locally, server ranks over ciphertext.
- Three numbers, qualified: ~29 KiB up / ~8 KiB down per query AT THIS CORPUS SIZE (6143 chunks); per-query bandwidth scales ~sqrt(N); 234 pages, 20/20 correctness, 49ms median; live on 3 DO nodes ~$18/mo. Notes pre-load: raw SimplePIR is 242 KB/query at 1 GB (DoublePIR 345 KB); ours is smaller only because the index is smaller, same sqrt(N) law.
- Build-plane, not query-plane: TEE attests honest index construction; confidentiality is LWE, not hardware.
- TWO error sources stated SEPARATELY: (1) quantization loss on a BUILT thing, top-10 overlap 0.56; (2) routing error, two-node router 0.812 accurate (~19% wrong shard), router top-10 vs oracle 0.431 vs single 0.356. Separately NOT built: incremental hint refresh; agent-era blowup.
- Visual: query flow + a small build-plane lane (index builder -> attested artifact -> served index, malicious-builder threat labeled).
- Citation: SimplePIR/DoublePIR eprint 2022/949. Tiptoe eprint 2023/1438. iSimplePIR eprint 2026/030 (unbuilt incremental refresh).

### Slide 15 — The tech tree (close on this), with the scheduling CONJECTURE to Luis
- One picture. Their transport line down the DC-net branch wins the trilemma for low-latency strong anonymity. My two layers on top: access/anti-Sybil (reputation-gated egress, BUILT+LIVE) and application (Periscope). Four seams flagged; two forced by my use cases, two shared but acute at the gate.
- Luis answer as conjecture-with-a-named-gap: agent parallelism and the return path look like the same scheduling object (N queries = N out-slots + N return-reads in one auction round). Honest gap: the allocator models ONE message class, a return-read is a different size/shape, so whether they fold cleanly is OPEN. Luis, that is your question.
- Visual: full tech-tree, trilemma as a frontier across the top, NAMP staking tagged "my extrapolation."

### Slide 16 — The ask (lead with the warm leads)
- Concrete and small. Lead with the two warm leads: "Sarah, seam C is yours if you want it, you raised it. Mark, yes to the reading-group session you offered." Then offer seam D as the open flagship, seam B as the highest-leverage ADOPTION (adopt ACT, do not reinvent).
- One smallest first step: curl through the live egress with the key in your hand tonight. If seam B grabs you, the ACT reference Rust is the starting artifact (github.com/SamuelSchlesinger/anonymous-credit-tokens).
- Leave-behinds at the END: the research-questions doc, the standalone gist, Semaphore keys. No audience-tailored sign-off.

---

## Correctness guardrails (must hold)
- Anonymity (anytrust, >=1 honest) and liveness (honest-majority/all-online) on separate lines; precise version in notes.
- Trilemma = a LOWER BOUND coupling latency and bandwidth overhead against a global passive adversary, NOT a pick-2-of-3. "Choose two" only as loose intuition.
- Drop "RLN v1 / degree-0" entirely. Live PoC = Semaphore membership + per-epoch nullifier + gateway-side budget counter, no Shamir, no in-circuit slashing. Full RLN v2 in DESIGNED.
- ACT = adopted prior art, pre-final draft, reference Rust, never built by me or final. Double-spend online + atomic.
- Simkin sqrt-trick is unpublished: verbal hook to Mark only, never on a slide, kept separate from store-and-handle. Notes-only fallback: sqrt layout + tensor factors + key-switching, my read, defer noise/params and IT-vs-LWE to Mark.
- Periscope 0.56 (quantization) and 0.81 router (routing) = two separate error sources; incremental hint refresh NOT built; SimplePIR 242 KB/q context pre-loaded.
- Agent-parallelism/return-path equivalence is a PROPOSAL with a named gap (one-class allocator), lit DESIGNED.
- Anonymity-set number committed: 1 leaf today, grows live; degrades to the subset sharing pinnable metadata.
- NAMP staking integration is my extrapolation; flag it.
- ZipNet/Flashnet concrete latency numbers off every slide.
- Demo capped 4 min, 30s fallback queued. Live cut order: Slide 7 then Slide 14.

## Still to verify before delivery (flagged, not faked)
- Anonymity trilemma exact theorem wording (eprint 2017/954 PDF unreadable on fetch); confirm the lower-bound phrasing against a readable copy before any precise spoken version.
- Decentralized-building exact sentence (paraphrase-confirmed via NAMP; check the page directly before quoting verbatim).
- RLN v2 polynomial field ordering vs circuit source (only if a v2 slide is added).
- Exact current deployed leaf count at talk time (re-pull morning-of).
