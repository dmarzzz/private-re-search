# Research brief: minimizing client download in private search

## The question, sharpened

Periscope today follows the SimplePIR/Tiptoe bargain: the client downloads a large offline **hint** `H = M·A` (hundreds of MiB to ~1 GiB across shards) so that each online query is a single cheap server matvec. The hint *is* the download. That bargain is backwards for an agent-facing, frequently-updated service: we want the client to download almost nothing and arrive at robust results, even if the shard has to work harder.

The intuition to chase: **route with something tiny, then push the heavy ranking and retrieval onto the shard homomorphically.** Concretely, can we land in a regime where

1. **routing** costs the client kilobytes, not the per-shard hint, and
2. **ranking + record retrieval** run as server-side homomorphic computation (FHE/RLWE), so the client downloads little or no per-epoch state,

while keeping the query content private to the shard and returning results at least as good as the current single-cluster, 4-bit-quantized path?

This is not a vague wish. It maps onto a known design axis in the PIR literature: the trade between **client-preprocessing/hint PIR** (SimplePIR, Tiptoe: big download, cheap server) and **FHE/RLWE PIR** (SealPIR, OnionPIR, Spiral, Respire: tiny download, heavy server), plus a newer **hintless** line that tries to get SimplePIR's online speed without the hint download. The research is to map that axis for *our* workload (semantic top-k over N docs, then a record fetch) and find the point that fits low-client-download, fresh, sharded, private search.

## Decomposition (what the swarm should answer)

**A. Hint elimination.** What does removing the offline hint cost? Cover HintlessPIR and the LWE-to-RLWE "homomorphically evaluate the hint" technique (Ren et al., and the line that turns SimplePIR's hint into server-side work). Does it compose with Tiptoe-style nearest-neighbor ranking, i.e. is "Tiptoe without a client hint" a real construction or an open problem? Server compute, latency, and communication numbers.

**B. Cheap private routing.** Can the routing step use a tiny code instead of downloading per-shard centroids and profiles? Product quantization, binary/LSH routing codes, learned low-dimensional routers. How small can routing state get while preserving routing accuracy? Can the route itself be made oblivious so the shard does not learn which cluster was chosen?

**C. FHE-based ranking and retrieval.** Survey the RLWE/BFV/BGV/CKKS PIR family that minimizes client download: SealPIR, OnionPIR, Spiral/SpiralStream, Respire, FrodoPIR, Pirana, MulPIR. Download vs server-compute vs latency, and which can return top-k scores plus the record(s) in one interaction. Is CKKS usable for the similarity/inner-product step, and BFV/BGV for the record PIR?

**D. More robust results, server-side.** Can the shard do homomorphic reranking, multi-probe (more than one cluster) retrieval, or batched multi-record fetch under FHE, so the client gets better and more results without a bigger download? What does "robust" cost in this setting?

**E. The frontier, and the freshness bonus.** Plot the client-download vs server-compute vs latency Pareto frontier across these families for embedding search at our scale (10^5–10^6 docs/shard, 256–768 dim). Critically: a hintless/FHE design has *no hint to invalidate*, so does going hintless also dissolve the index-freshness problem from `FRESHNESS.md`? If yes, that reframes both problems at once.

## What a good answer looks like

Named schemes with real numbers (download, server time, latency, params), an honest statement of which compose with semantic top-k vs which are point-PIR only, and a recommendation for one or two concrete architectures to prototype against the current shard. Primary sources (papers, reference implementations) over blog summaries. This brief is the target of a `rotate research --parallel` swarm; gathered pages land in `sources/` via `build_index.py`.

See also: `tee-indexed-private-search-design.md` (the hint problem), `periscope-poc/FRESHNESS.md` (freshness, which a hintless design may dissolve), `mixing-query-embeddings-for-private-search.md`.
