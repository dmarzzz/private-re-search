# Closing the loop: feedback and rewards for private, decentralized search

Periscope as built is a one-way pipe: a node serves an index it attests, clients query it blind. Two questions break that simplicity open. How does the search get *good* when nobody is allowed to see what anyone searched? And if independent indexer nodes each build their own corner of the index, how do you pay the best ones without naming them, in a network where anonymity makes minting identities free?

These are one problem wearing two coats. Both are about extracting a signal (relevance, contribution) from participants the system is designed not to identify. The design below has three planes: feedback, rewards, verification. Each plane gets a primitive that already exists, and the places where nothing exists yet are flagged as exactly that.

## The one structural fact

The only party in the entire system who can ever judge relevance is the client. The query and the results co-exist nowhere else, by construction. So every feedback mechanism is some flavor of: clients compute judgments locally, then export them in a form that protects the individual. There is no server-side fallback, no log mining, no click stream. Whatever the export channel is, it carries the whole learning loop on its back.

## Feedback plane: three channels, all aggregate

**1. Demand: private heavy hitters tell indexers what to crawl.** The "what are people searching for" signal, the one that directs crawl budgets, is exactly the private heavy-hitters problem, and it is solved and deployed. [Poplar](https://arxiv.org/abs/2012.14884) (and its weighted successor [Mastic](https://petsymposium.org/popets/2025/popets-2025-0017.pdf)) lets two non-colluding aggregators find the popular strings submitted by a population while learning nothing about any individual's string. The [IETF DAP protocol](https://datatracker.ietf.org/doc/draft-ietf-ppm-dap/) standardizes the deployment, and [Divvi Up](https://divviup.org/blog/divvi-up-in-firefox/) already runs it for Firefox telemetry in production. Clients submit (query-cluster or query-string) shares; the network learns "these 10k topics are hot this epoch"; no one learns who asked what. That output is the crawl-targeting signal handed to the indexer market.

**2. Quality: DP aggregates per shard are the reward meter.** After a query, the client knows whether a result was clicked, dwelled on, or judged useful. Export that as a [Prio3](https://blog.cloudflare.com/deep-dive-privacy-preserving-measurement/) sum bound to the *shard and epoch*, never the query: "shard 0x3f, epoch 412: +1 useful." VDAF validity proofs force each report to be well-formed; differential-privacy noise at the aggregator protects individuals; minimum-batch thresholds stop small-population deanonymization. The per-shard usefulness aggregate is the only quality number the network ever sees, and it is the input to payouts.

**3. Learning: federated learning-to-rank is the mixer that works.** To improve the ranking model itself, clients compute gradients of a pairwise ranking loss from their own click data and submit them through secure aggregation, the [FPDGD](https://ielab.io/publications/pdfs/wang2021fpdgd.pdf) / [FOLTR](https://arxiv.org/abs/2412.19069) line of work. This closes a loop opened in the [mixer report](mixing-query-embeddings-for-private-search.md): summing across users destroyed retrieval because top-k is not linear, but gradients are exactly the thing you *want* summed. Same Bonawitz machinery, right object this time. The updated model ships in the next index epoch's public artifact, so the embedding model stays client-runnable.

The honest caveats: DP noise at small user counts drowns the signal, so quality aggregates need population floors before they unlock; clicks on doc IDs leak topic even in aggregate, so the epsilon budget is a real design parameter, not a checkbox; and every aggregate channel is a poisoning surface, which is the reward plane's problem to bound.

## Reward plane: your own theorem forbids the obvious design

"Reward whoever does the best" means measuring each indexer's marginal contribution and splitting payouts accordingly, which is Shapley-value attribution, and the [Sybil analysis already in this corpus](https://github.com/dmarzzz) (the MaxShapley forum post) closes that door for an anonymous network. Shapley is provably not false-name-proof; on max-type games a replicating contributor's combined take goes (2t+1)/(2t+2) with t copies; and [Ohta et al.](https://www.cs.cmu.edu/~conitzer/anonymityproofshapleyAAMAS08.pdf) prove the incompatibility is axiomatic: symmetry, null-player, and additivity each conflict with anonymity-proofness. Per [Mazorra and Della Penna](https://arxiv.org/abs/2301.12813), the regime that matters is the cost *c* of minting an identity, and an anonymity-preserving network sits at *c* ≈ 0 *by design*. A privacy-first indexer network that pays by marginal contribution is a machine for rewarding whoever splits themselves fastest.

So the design must buy back identity cost without buying back identity. Two levers, used together:

- **Economic:** claiming a shard requires stake, slashable on audit failure. Stake is the *c* that makes false names expensive, and it needs no name attached.
- **Cryptographic:** participation (reward claims, feedback reports) is gated by rate-limited anonymous credentials, Semaphore membership plus RLN epoch nullifiers, the exact stack already proven live in this repo's [reputation-gated onion egress](reputation-gated-onion-egress/) PoC. One claim per credential per epoch, no linkability across epochs.

And the allocation rule avoids contribution-splitting entirely:

- The index is partitioned into **shards with explicit boundaries** (topic clusters from the demand signal, or URL-prefix ranges). One paid claim per shard per epoch; contested shards resolve by audit performance and stake, not by similarity-judged credit splits. No band for copies to crowd into means no replication payoff.
- Payout per shard = **base rate for verified work** (crawl and embedding proofs, below) times a **bounded quality multiplier** from the Prio aggregate. Bounded means a great shard earns, say, 3x a passable one, never 100x, which caps the incentive to game the quality channel.
- Demand-weighted: hot shards (from Poplar) pay more, which is what steers "interesting parts of the index" toward what people actually need. [The Graph's curation model](https://thegraph.com/blog/the-graph-network-in-depth-part-2/) is the closest shipped precedent (signal directs indexers, query fees pay them); its gap for our purposes is that its QoS oracle and curation are not privacy-preserving, which is precisely what the DAP channel replaces.
- Payouts land on **fresh stealth addresses**, so reward flow does not deanonymize the indexer over time.

The remaining Sybil surface is the *feedback* channel: an indexer who controls many client credentials can vote its own shard up. RLN bounds the rate per credential, not the number of credentials, so everything reduces to credential issuance cost. That is the system's root trust anchor, and it is an honest open problem (stake-priced credentials, invite graphs, or proof-of-personhood, each with different failure modes). No published system solves anonymous, Sybil-resistant, *cheap* credentialing; pretending otherwise would be design fraud.

## Verification plane: proving an anonymous node did the work

An anonymous indexer claims "I crawled shard X and embedded it honestly." Three escalating checks, all compatible with the node staying nameless:

1. **Commitment:** each shard epoch publishes a Merkle root over (URL, content hash, embedding row). This is the thing the stake stands behind.
2. **Crawl provenance:** random spot-audits demand proof that sampled pages really said what the index claims. Either the node's build ran in a TEE (the attestation slot from the [design doc](tee-indexed-private-search-design.md), now per-node), or it supplies [zkTLS](https://tlsnotary.org/) fetch proofs ([TLSNotary](https://arxiv.org/html/2409.17670v1), DECO-lineage systems like Reclaim and Opacity): MPC-witnessed TLS sessions proving "this origin served these bytes," no trust in the crawler. zkTLS is the decentralized substitute for the TEE: same integrity role, no chip vendor.
3. **Embedding correctness:** the model is public and deterministic, so auditors re-embed sampled pages and check the committed rows. Probabilistic, cheap, and slashing makes the expected value of cheating negative.

## The assembled loop

```
clients ──(periscope LWE queries)──────────────▶ indexer nodes' shards
   │                                                  ▲
   ├─(Poplar/DAP: private heavy hitters)──▶ demand ───┤  shard market:
   ├─(Prio3/DAP: per-shard usefulness)───▶ quality ───┤  stake + RLN claim,
   └─(secure-agg gradients)──▶ next epoch's model     │  base pay × bounded
                                                      │  quality, audits via
                              payouts ──▶ stealth ────┘  zkTLS/TEE + re-embed
```

What each party learns: clients reveal only DP-protected aggregate shares, rate-limited by nullifier. Aggregator pair (non-colluding) learns only aggregates. Indexers learn which shards are in demand, never who demanded. The payer learns that *some* valid credential earned a payout to an unlinkable address. Nobody holds a query log, a click log, or an identity-to-work mapping, and the system still learns what to crawl, which shards are good, and how to rank better.

## Addendum: agents, intake, and the router (2026-06-10, second pass)

**Agents are the feedback plane's natural clients.** A human gives you a click and maybe a dwell time. An agent gives you a labeled judgment: it knows programmatically whether the retrieved passage answered its question, and it emits SAT/DSAT with no UX cost, at volume. Three agent-only superpowers fall out: (1) dense implicit labels through the existing Prio channel, no human in the loop; (2) *sensitivity-classified query donation*: an agent can locally decide a given failed query is non-sensitive and donate it in cleartext to the demand pool, a judgment you cannot ask a human to make per-query, giving the network its richest crawl-targeting signal at zero privacy cost on exactly the queries where it is safe; (3) structured gap reports ("cluster X, zero results above threshold at epoch T") instead of inferring gaps from silence. The agent reframes the whole economics: dense labeled feedback was the scarce input, and agents produce it for free as a byproduct of doing their job. The DP noise-floor blocker softens too, because volume per shard climbs fast when each client queries hundreds of times a day.

### Intake: how niche URLs actually get in

Indexing "the web" is the wrong frame and the reason it feels impossibly big. The network never needs the whole web; it needs the union of what its clients actually reach for, which is a tiny, heavy-tailed, self-revealing subset. Four intake paths, cheapest first:

1. **Demand-pull from the gap signal.** The Poplar/agent-donation channel already surfaces "queries that returned nothing good." That list *is* the crawl frontier. You do not guess what is missing; the feedback plane tells you, ranked by how often it was wanted. This is the dominant path and it is already in the design.
2. **Submission with provenance.** A client (especially an agent) that found a good URL out-of-band submits it; the indexer that crawls it commits it with a zkTLS fetch proof. Niche URLs enter because the person who needed them brought them.
3. **Frontier expansion per shard.** Each node link-crawls outward from its shard's seed set, but only along edges that score near its shard centroid, so a niche-history node deepens niche-history coverage instead of drifting toward the generic center.
4. **Archive backfill.** Bulk niche corpora (your `world_knowledge` archive, a domain dump, a dataset) get embedded and committed wholesale. This is how a cohort cold-starts a shard before organic demand exists.

The heavy tail is a feature here: a node that wants reward should chase under-served niches precisely because the demand-weighted payout is highest where coverage is thin and competition is absent. The market pays for the long tail rather than dog-piling the head, the opposite of ad-funded search.

### The router: a privacy-preserving fan-out, not a query-reading dispatcher

You correctly spotted that sharded coverage needs a router, and named the hard part: a normal router reads the query to pick a shard, which is the one thing this system forbids. The resolution is that routing happens on the *client*, against public metadata, and the network side is a blind fan-out:

- **Each shard publishes a public profile**: its centroid(s), a coverage sketch, freshness, and a quality score from the Prio aggregate. This ships in the index manifest, like centroids already do in the PoC.
- **The client routes locally.** It embeds its query (already does), scores it against every shard's public centroids (cheap, k is small), and picks the top-m shards. The routing decision, like the cluster choice inside a single Periscope node, never leaves the machine.
- **The client fan-outs encrypted queries** to those m shard-nodes in parallel, one LWE ciphertext each, and merges the returned scores locally. Each node sees only its own uniform-noise ciphertext; none sees the query, the routing decision, or that it was one of m. Cover queries to a fixed m (padding with decoy shards) make even the fan-out fan-in count constant.
- **A directory, not a dispatcher.** The only central-ish component is a registry of shard profiles, which is public, cacheable, and itself serveable through the same anonymizing transport. It holds no query traffic. It can be a contract, a gossip set, or a signed list; it never sees a search.

So the router is a *client-side ranking over public shard descriptors* plus a *blind multi-node PIR fan-out*. This is the natural generalization of what the single node already does: Periscope routes a query to one of k internal clusters locally; the network routes it to one of K shard-nodes locally, by the identical mechanism, one level up. Nothing about it reads the query. The cost is real and bounded: latency is the slowest of m parallel nodes, communication is m times a single query's, and m is a tunable privacy/coverage/cost knob. Stale or lying shard profiles are caught by the same audit plane that polices index integrity, so a node cannot advertise coverage it does not have without failing a spot check.

The honest gap: cross-shard score calibration. Inner-product scores from independently-built shards with different local quantization are not directly comparable, so merging top-k across nodes needs a normalization step (shared scale published in profiles, or a light client-side recalibration). Tractable, unsolved here, flagged.

1. **Credential issuance cost** is the root of all Sybil resistance here (both indexer and feedback sides). Stake-priced credentials are the least-bad default; the privacy-utility-cost triangle is uncharacterized.
2. **DP budget vs small populations:** a young network has few users per shard, exactly when honest signal is scarcest and noise floors bite hardest. Cold-start may need trusted-jury relevance panels before aggregate feedback unlocks.
3. **Shard boundary governance:** who defines shards decides the market. Demand-driven auto-sharding from Poplar output is the mechanism-light answer; whether it is stable under adversarial demand injection is unstudied.
6. **Cross-shard score calibration:** merging top-k from independently-built shards needs comparable scores across nodes that quantized differently. A shared published scale or client-side recalibration is the candidate; correctness of the merged ranking is unproven.
4. **Hint economics multiply:** every shard is its own index epoch, so the client hint-refresh problem from the design doc scales with shard count. Pacmann-style client-walked PIR or per-shard epoch staggering are the candidates.
5. **Quality-channel collusion** between an indexer and a bloc of client credentials, below the rate limit, above the noise floor: the bounded multiplier caps the damage but does not zero it.

## Sources

- Poplar, [arXiv:2012.14884](https://arxiv.org/abs/2012.14884); Mastic, [PoPETs 2025](https://petsymposium.org/popets/2025/popets-2025-0017.pdf)
- DAP, [IETF draft](https://datatracker.ietf.org/doc/draft-ietf-ppm-dap/); Cloudflare deep dive, [blog](https://blog.cloudflare.com/deep-dive-privacy-preserving-measurement/); Divvi Up in Firefox, [divviup.org](https://divviup.org/blog/divvi-up-in-firefox/)
- FPDGD, [SIGIR ICTIR 2021](https://ielab.io/publications/pdfs/wang2021fpdgd.pdf); secure FOLTR, [arXiv:2412.19069](https://arxiv.org/abs/2412.19069)
- MaxShapley Sybil post (this author), `~/maxshapley-sybil-forum-post.md`; Ohta et al., [anonymity-proof Shapley](https://www.cs.cmu.edu/~conitzer/anonymityproofshapleyAAMAS08.pdf); Mazorra and Della Penna, [arXiv:2301.12813](https://arxiv.org/abs/2301.12813)
- The Graph, [network in depth](https://thegraph.com/blog/the-graph-network-in-depth-part-2/), [curation docs](https://thegraph.com/docs/en/resources/roles/curating/)
- TLSNotary, [tlsnotary.org](https://tlsnotary.org/), [protocol review](https://arxiv.org/html/2409.17670v1); DECO lineage overview, [Stanford Blockchain Review](https://review.stanfordblockchain.xyz/p/74-cryptography-research-spotlight)
- Presearch (incentivized-node precedent, token-rewarded uptime not quality), [presearch.io](https://presearch.io/)
- Prior reports in this corpus: [mixer verdict](mixing-query-embeddings-for-private-search.md), [Periscope design](tee-indexed-private-search-design.md), [reputation-gated onion egress](reputation-gated-onion-egress/)
