# Research questions for PIG (refined, framed for cryptographers)

Four seams. Two the mempool use case HID. Two it shares but never centered. I name the prior art up front on every one, because the honest-scope move is to scope the open part narrowly, not to pretend a shipped primitive is my discovery.

---

## Seam A (mempool HID it) — the broadcast return path. For Mark.

**The use case.** Search and inference are request/response. I ask, I must get an answer back, privately, to a sender with no address. The mempool never forced this because mempool broadcast is fire-and-forget. So this is a gap in a shared system, hidden by the mempool use case, not a hole specific to me.

**The threat actor.** A global passive observer who links a client's outbound query to its inbound answer by watching which mailbox slot that client fetches.

**The prior art I adopt, said up front.** The general async return path is a private mailbox: authorized DPF private-write to deliver (Express virtual-address + blind-MAC, Sabre), and PIR private-read to collect (Talek oblivious logging). That part is known. Your store-and-handle trick is the synchronous special case, and the honest read is that the fetch is itself a PIR.

**The precise open problem (the part that is actually unsolved).**
1. Can the return-mailbox PIR-read be sharded or centroid-routed the way Periscope shards its index, so a client PIR-scans only its shard instead of a linear scan over all mailboxes at search scale?
2. Does folding the collect-read into Flashnet's IBLT-knapsack auction as a second message class leak via its different size and shape, given the allocator currently models one class?

**Why it is not already solved.** The primitive is solved; the scaling and the scheduling are not. The PIR-read is a linear scan over the whole mailbox store per query, the same web-scale-PIR wall Periscope already names, and nobody has shown the read survives search scale without it. And your sqrt-bandwidth broadcast work bears on the read scaling, which is why I want it in front of you. To be clear, I am keeping two of your things separate: the store-and-handle trick is the candidate primitive; the sqrt-bandwidth construction is a different thing I have not seen written down.

---

## Seam B (mempool HID it) — anonymous payment without rebuilding the graph. For the cryptographers.

**The use case.** RLN gives me anonymous metering. It does not give me anonymous payment. I want to charge for egress without the payment rail rebuilding the who-pays-whom edge the comms layer hid.

**The threat actor.** The gateway-as-payee, which is both issuer and verifier, and must not be able to connect the funding event to the spend.

**The prior art I adopt, said up front.** Carrying value in one anonymous credential is solved. ACT (draft-schlesinger-cfrg-act, Schlesinger and Katz) is a KVAC/BBS credential carrying a numeric balance, spends via range proof, reveals a fresh nullifier, returns signed anonymous change, and leaks only the nullifier and the spent amount, never the link. There is reference Rust. Nym zk-nyms are a deployed cousin, payment de-linked from usage. I am not reinventing a coin.

**The precise open problem (what ACT leaves open in MY setting).**
1. Can one gateway-issued KVAC run dual-mode, an ARC-style presentation limit for the free tier and an ACT-style credit balance for paid egress, sharing one nullifier store, without the dual use re-linking the two tiers?
2. ACT collapses the leak to a single funding event; it does not eliminate it. Can the unfunded-issuance event, where fiat or crypto meets identity, collapse to one padded, batched top-up so the residual leak is a single infrequent event, not per-query?
3. The spend nullifier, the RLN rate nullifier, and the return-path reply credential all attach to the same query. Binding them naively re-links all three. What binding keeps them independent?

**Why it is not already solved.** Each sub-question is composition and binding, not a new primitive. The double-spend check is online and must be atomic with insertion or parallel spends race through; the per-spend amount is revealed, which is fine for flat-rate egress and a real leak for variable pricing. Nobody has shown the three-credential binding stays unlinkable under concurrent gateway load.

---

## Seam C (mempool SHARES it, transport-independent) — issuance cost as the Sybil root. For Sarah.

**The use case.** Anonymity deletes the one free rate-limit the internet gave me, the IP. RLN rate-limits a credential; it does nothing about how cheap the next credential is to mint. You raised Sybil unprompted, so this one is yours.

**The threat actor.** A spammer minting cheap leaves to get N times the rate limit.

**The prior art I adopt, said up front.** Define C(N) = total cost for one adversary to control N valid leaves. The known frontier: pure stake is linear and splittable; proof-of-personhood caps near one per human (World ID already uses Semaphore, the exact stack); pluralistic composition is the realistic path toward Vitalik's N-squared ideal. I am stating the frontier, not claiming it.

**The precise open problem.** Find an issuance mechanism whose C(N) is (a) at least linear and ideally superlinear in N, (b) cheap at N=1 so honest users enroll, and (c) anonymous at issuance, the issuer learns only "one new member" and never links the leaf to a person or to later traffic. Sharp sub-questions: can RLN's slashable stake double as the issuance cost, or does the stake-splitting linearity result force a personhood gate on top to recover superlinearity? And does anonymous issuance preclude the social-graph methods, since those inherently read graph position?

**Why it is not already solved.** This is a design question with no settled answer for an anonymous egress set: stake is splittable, personhood needs trusted hardware or a clustered web of trust, and anonymous issuance fights the graph methods. Naming the constraints does not pick the function.

---

## Seam D (mempool SHARES it, transport-independent) — portability vs linkage. FLAGSHIP. For Jonathan and Luis.

**The use case.** My RLN credentials are spendable across egress points. Good for the user, one membership, many egresses. But two egresses in the same epoch see the same nullifier for the same user, which is exactly what lets each rate-limit and exactly what correlates them.

**The threat actor.** A coalition of up-to-threshold egress operators correlating a user across points.

**The prior art I adopt, said up front.** Privacy Pass RFC 9576 names the hazard: redeeming the same token to multiple Origins risks those Origins linking the client. ARC assumes a joint Origin+Issuer specifically to bound cross-context use. Neither resolves the global-metering-vs-cross-egress-unlinkability tension.

**The precise open problem, as a falsifiable conjecture.** For a user spending one credential at egress points {E1..Ek} in epoch t, is there a scope construction that simultaneously (a) enforces a GLOBAL aggregate rate limit across all Ei and (b) keeps any coalition of up-to-threshold egresses unable to decide whether two redemptions came from the same user? Conjecture: (a) and (b) are mutually exclusive under any shared-nullifier construction, because the object that lets two egresses sum your usage is the object that lets them correlate you. Open: does a re-randomizable token-bucket carried in an ARC-style credential, with the global counter reconciled out of band, escape the tradeoff, or is it fundamental?

**Why it is not already solved.** This is the most defensible "no one has solved this" claim I have. RFC 9576 and ARC name the linkage but neither attacks the global-metering tension. It is a clean falsifiable conjecture, which is the form this room wants, so I am leading the seams with it.

---

## Note on the count
There are FOUR seams, matching the rail and the deck. The old "where does the work belong" is positioning, not a question, so it is folded into the tech-tree close as a one-line thesis (my work is the layers on top, not a competing transport), not listed as a fifth RQ. If a fifth genuinely-open item is wanted, the sharpest candidate is the agent-era query-cost blowup: a human types one short query, an agent expands it into a fan-out of long, multi-vector sub-queries, each a full PIR pass and each forcing its own return delivery. Tiptoe and Periscope economics assume the human. The private-search cost model for the agent is unstudied, and it reconnects seam A's scheduling to Part 2's PIR.
