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
