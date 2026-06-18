# PIG audience brief (context for the presentation work)

Distilled from the Flashbots Privacy Information Group (PIG) sync + jam transcript
(~June 2026) and the user's own framing. This is the audience the presentation is
for. Use it to calibrate content, framing, and voice. Do not invent quotes.

## Who is in the room
- **Mark Simkin** — cryptographer, leads the Flashnet anonymous-broadcast work.
  Pragmatic, allergic to "solving problems no one has." Mid-breakthrough on a
  sqrt-bandwidth trick for the Flashnet broadcast array (tensor/key-switching).
  Will catch any imprecise crypto claim instantly.
- **Jonathan Passerat-Palmbach** — tracks secure inference (MPC/FHE for neural
  nets), TEEs, runs the reading group. Bullish on async/latency-tolerant use cases.
- **Sarah Allen** — raised the spam/Sybil/reputation problem unprompted; thinks
  about applications and who actually has the problem.
- **Luís Correia** — asked the sharp question: Flashnet needs synchronous rounds;
  agents fire many queries in parallel; is that compatible? Also presented on AWS
  Nitro / TEEs.
- The user (dmarz) is positioned by the group as "the person who has thought the
  most about this" use case; floated as a possible reading-group guest.

## What the group values (calibration)
- **Conciseness + technical correctness.** This is an elite crypto audience. State
  primitives in the language of cryptography, not code. One wrong claim about LWE
  noise growth or an anonymity assumption costs credibility.
- **"Does anyone actually have this problem?"** Mark's recurring test. Every
  research question must be motivated by a real use case with named actors and a
  threat model, not by "wouldn't it be cool if."
- **Honest scope.** Built vs designed vs open, stated plainly. They respect a clean
  "this is unsolved" far more than hand-waving. ADCNet's own README says
  "hand-rolled crypto, do not use in production" — mirror that honesty.
- **Spell out actors and trust boundaries.** Mark: "spell out specifically who is
  an actor and who can be malicious." Diagrams of who-sees-what beat prose.

## Key technical positions established in the sync (build on these, don't relitigate)
- **Origin-hiding vs content-hiding.** Hiding *who asked* (anonymous broadcast,
  cheap, Flashnet's domain) is very different from hiding *what was asked* (secure
  inference / MPC over the model, ~100-1000x+, "a humongous new project," out of
  scope). For search, queries are low-sensitivity and redundant, so the need is
  almost always origin-hiding. The user's whole thesis lives here.
- **The three parameters that decide feasibility** (Mark, stated twice): message
  size, anonymity-set size, throughput/latency tolerance. Any concrete proposal
  should give these numbers.
- **Return path = store-and-handle.** Mark's stated trick: append a public
  encryption key to the broadcast message; the responder encrypts the answer,
  publishes it (e.g. an IPFS handle), client fetches. "Trivial" for one response;
  the open question is the general/async/scaled version.
- **Synchronous rounds are inherent to strong anonymity.** Without rounds + cover
  traffic you get timing-correlation attacks (the Tor weakness). Agents firing
  parallel bursts stress this; auction-based scheduling is the lever.
- **Spam/Sybil is the first wall.** Sarah: a privacy-preserving reputation/rate
  system is needed and "sounds really hard." Mark: TEEs + linkable ring signatures
  or RLN-style rate limiting, but "credential issuance cost is the root."
- **Reset-the-LLM trick.** For private inference, a stateless TEE that forgets
  after each query can substitute for expensive MPC in some trust models. (Context
  only; user is NOT pursuing private inference.)

## What the group explicitly asked of the user
1. A concretely scoped use case: actors, trust boundary, threat model
   (origin-hide vs content-hide).
2. The three numbers: message size, anonymity set, rate/latency tolerance.
3. Resolve the agent-parallelism vs synchronous-rounds tension (Luís).
4. The Sybil/spam answer (Sarah) — the user's reputation-gated egress + RLN is the
   strongest existing artifact here.
5. Possibly guest the reading group; Mark offered a synchronous call as more
   productive than async.

## The user's positioning (the thesis to communicate)
- Not building private inference. Building **private search**, and the road there
  runs through the **last-mile IP leak** shared by BuilderNet, TEE inference, and
  search.
- The user's work is the **layers on top of** the Flashbots anonymous-broadcast
  transport (DC-net -> ZipNet -> ADCNet -> Flashnet -> NAMP), not a competing
  transport: an access/anti-Sybil layer (reputation-gated egress, Semaphore + RLN,
  BUILT + LIVE) and an application (Periscope oblivious search, BUILT + benchmarked).
- The research questions are the **seams** between their transport and a usable
  app: (1) broadcast return path, (2) anonymous payment without counterparty-graph
  leakage, (3) credential issuance cost as the Sybil root, (4) credential
  portability vs linkage across egress points.
- Two sharp connections: the return path is a gap the *mempool* use case hid
  (fire-and-forget); auction-based scheduling is the answer to Luís's
  agent-parallelism question.

## The user's voice + standards (match these in any artifact)
- Punchy declaratives, distinction-by-negation, first person, sentence case.
- **Never use em dashes** in copy handed to the user.
- Name the destination, not the distance (no preemptive flinching at ambition).
- Concrete and opinionated like a spec: real nouns, verify/leak ledgers, honest
  scope. Never fake evidence for unbuilt things.
- Visual restraint-as-system; no decorative noise.

## Delivery decisions (locked by user, 2026-06-16)
- Format: **talk + leave-behind doc**. Lean live slides the user drives, plus a
  standalone doc with full citations and the research-questions one-pager.
- Crypto depth: **~75% intuition-first, ~25% precise**. Lead with picture +
  threat model; then a tight "for the cryptographers" section stating primitives
  correctly (LWE params, RLN nullifier semantics, anonymity assumptions). Mirrors
  the existing deck's body-then-appendix shape.

## Source artifacts on disk
- `~/private-re-search/PIG-WALKTHROUGH.md` — current presentation spine + tech tree.
- `~/private-re-search/reputation-gated-onion-egress/` — the live PoC.
- `~/private-re-search/periscope-poc/` — oblivious search PoC + benchmarks
  (BENCH.md, BENCH_ROUTER.md, BENCH_SCALE.md).
- `~/private-re-search/*.md` — research corpus (POST.md, SYNTHESIS.md,
  tee-indexed-private-search-design.md, feedback-and-rewards-*.md,
  reputation-gated-egress-rnd-update.md, etc.).
- `~/alcyone/` — market/strategy decks (search-stats.html, business-model.html).
