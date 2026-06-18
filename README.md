# private-re-search

A private research corpus on **IP anonymization for search**: how you query a
search engine without revealing your IP address or linking queries to your
identity.

The links and raw page contents here were gathered by the local
[research-swarm](https://github.com/dmarzzz/research-swarm) DSPy agent, which
fetches every page it reads into a local archive. This repo is a snapshot of
that archive filtered to this topic, plus a generated index.

## What's here

| Path | What it is |
|------|------------|
| [`INDEX.md`](INDEX.md) | Human-readable index of every source, grouped by domain |
| [`SYNTHESIS.md`](SYNTHESIS.md) | The agent's merged write-ups per run, plus sources cited but not stored as a page |
| [`GAPS.md`](GAPS.md) | What the swarm missed: 52 verified gaps found by a Claude deep + parallel research pass, grouped and ranked |
| [`gaps.json`](gaps.json) | Machine-readable version of the gap analysis |
| [`anonymized-scraping-residential-proxies-privacy.md`](anonymized-scraping-residential-proxies-privacy.md) | Deep-research report: why SearXNG-over-Tor gets blocked, the residential-proxy market + sourcing, the China angle, and whether residential proxies kill your privacy guarantees |
| [`the-search-problem-formalization.md`](the-search-problem-formalization.md) | Literature review + formalization: a unified model of the search problem (AI state-space + decision-theoretic optimal stopping + IR relevance), then a formal contrast of human vs AI-agent searchers. 71 verified references |
| [`when-to-stop-metareasoning-for-search-agents.md`](when-to-stop-metareasoning-for-search-agents.md) | Deep dive on the agent stopping rule σ: value-of-computation metareasoning, where clean optimal-stopping rules (Weitzman, SPRT, best-arm) exist and why they break for retrieval agents, and whether LLM confidence is calibrated enough to ground a bounded-optimal σ |
| [`private-search-when-the-searcher-is-an-agent.md`](private-search-when-the-searcher-is-an-agent.md) | Bridges the privacy corpus and the formalization: privacy as a term in the agent objective J, and the latency-tolerance flip (mixnets/PIR/cover-traffic that fail for humans become viable for patient agents) |
| [`mixing-query-embeddings-for-private-search.md`](mixing-query-embeddings-for-private-search.md) | Verdict on the naive embedding mixer (summing users' query vectors): why linearity is real but the construction breaks on top-k non-linearity + embedding inversion, and the open multi-client problem hiding inside it |
| [`tee-indexed-private-search-design.md`](tee-indexed-private-search-design.md) | Tiptoe deep-dive + the 2024-2026 follow-up fork (Wally, Compass, Pacmann, Tiptoe++), then the Periscope design: TEE-attested index build plane + Tiptoe-style LHE query plane, leak ledger, and a v0/v1/v2 ship ladder |
| [`feedback-and-rewards-for-private-decentralized-search.md`](feedback-and-rewards-for-private-decentralized-search.md) | Closing the loop: how private search learns (Poplar/DAP heavy hitters, Prio3 per-shard quality, federated LTR) and how anonymous indexer nodes get paid without Shapley's Sybil hole (stake + RLN claims, bounded quality multipliers, zkTLS/TEE audits); open problems ranked |
| [`periscope-poc/`](periscope-poc/) | Working PoC of the design: a node serving this corpus (6,143 chunks) behind a Tiptoe-style LWE encrypted query path, no TEE needed for query privacy. 20/20 exact decryption, 49 ms median query, 29 KiB up/query; benchmarked to 1M synthetic docs (`BENCH.md`). Now also a **two-node router** (`router.py`, `BENCH_ROUTER.md`): domain-sharded coverage, client-side routing over public shard profiles, blind parallel fan-out + calibrated merge, 0.81 routing accuracy. Plus `slides.html` (protocol walkthrough) and `scale_deck.html` + `BENCH_SCALE.md`, a 100x-scale benchmark (crypto measured to 1M docs/node, composed across all variables): the thesis = add nodes, latency stays flat at 247 ms while corpus → 10M and qps scales linearly |
| [`manifest.json`](manifest.json) | Machine-readable index (one record per page: url, title, hash, local path, word count, blocked flag) |
| [`sources/`](sources/) | Raw fetched pages as markdown (`<domain>/<date>-<slug>.md`, with YAML frontmatter) |
| [`traces/`](traces/) | Raw agent run traces (question, synthesis, sources, self-critique) |
| [`build_index.py`](build_index.py) | Regenerates `INDEX.md`, `SYNTHESIS.md`, and `manifest.json` from `sources/` + `traces/` |

## Topic coverage

Four research runs fanned out across the design space:

1. **Broad survey** — Tor / onion routing, VPNs and proxies, Loopix, PIR, Apple Private Relay
2. **Oblivious HTTP** — RFC 9458, the relay+gateway split-trust model, ODoH (RFC 9230), Google Safe Browsing / Cloudflare / Fastly deployments
3. **Private Information Retrieval** — Tiptoe, FrodoPIR, OnionPIR, Piano, Wally, RESPIRE, IM-PIR, FlashPIR; single- vs two-server, preprocessing models
4. **Mixnets + private search engines** — Sphinx, Nym, Riffle, Dissent, Karaoke; DuckDuckGo, Startpage, Brave Search, MetaGer, SearXNG

The current snapshot is **53 pages across 34 domains** plus **17** sources cited
but not stored as a local page (arXiv IDs, PDFs, pages served from cache). A few
fetches hit bot walls and are flagged `⚠️ blocked/empty` in the index.

## Regenerating the index

`build_index.py` pulls pages newer than `/tmp/re-search-marker` out of the
shared `~/world_knowledge` archive and rebuilds the three generated files. To add
to the corpus, drop a fresh marker, run more research, and re-run the script:

```bash
touch /tmp/re-search-marker
rotate research --parallel "your follow-up question"
python3 build_index.py
```
