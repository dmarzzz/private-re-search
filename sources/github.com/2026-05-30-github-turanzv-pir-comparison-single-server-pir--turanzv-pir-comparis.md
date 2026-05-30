---
url: https://github.com/turanzv/pir-comparison
title: GitHub - turanzv/pir-comparison: Single-server PIR scheme analysis for Ethereum hot-state access: benchmark data, comparative analysis, and visualizations
fetched_at: 2026-05-30T15:52:01
content_hash: sha1:f5df6ff937c565371cbdb77c0b112821f51d4883
extractor: trafilatura
---

Single-server Private Information Retrieval (PIR) scheme analysis for Ethereum, comparing construction features, empirical benchmarks, and update overhead across two analysis tracks.

| Document | Track | Description |
|---|---|---|
|

[Hot-State Scheme Profiles](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-scheme-profiles.md)[High-Throughput PIR Comparison](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md)[High-Throughput Scheme Profiles](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-scheme-profiles.md)**Hot-State PIR — Overview of all 11 analyzed schemes:**

**High-Throughput PIR — Scaling behavior across database sizes:**

```
pir-comparison/
├── hot-state-pir/
│ ├── data/ # Per-scheme YAML features + CSV benchmarks
│ ├── docs/ # Comparison document + scheme profiles
│ └── figures/
│ └── static/ # PNG and PDF figures (light theme)
└── high-throughput-pir/
├── data/ # Per-scheme YAML features + CSV benchmarks
├── docs/ # Comparison document + scheme profiles (MD + HTML)
└── figures/
├── static/ # PNG and PDF figures (light theme)
└── interactive/ # Interactive HTML figures (30 plots)
```


Analyzes 11 PIR schemes — SealPIR, MulPIR, Spiral, OnionPIR, OnionPIRv2, Respire, NPIR, Pirouette, YPIR, iSimplePIR, and VIA — targeting small, frequently-updated databases (up to 1 GB, entries of 32–256 bytes). The analysis focuses on update overhead relative to the Ethereum 12-second block time threshold and client-side communication costs. All schemes are evaluated for suitability in a stateless-client Ethereum access pattern.

Analyzes 5 schemes — HintlessPIR, InSPIR, Respire, WhiSPIR, and YPIR — across large databases ranging from 1 GB to 128 GB with entry sizes from 1 bit to 32 KB. The analysis covers server computation time, total communication, and throughput under varied workloads, with Pareto frontier analysis for latency vs. communication tradeoffs.

The `data/`

directory in each analysis track contains structured, reusable benchmark data:

`features.yaml`

— construction properties, update model, and metadata for each scheme`benchmarks.csv`

— empirical timing and communication measurements from published papers`notes.md`

— extraction notes and data quality observations`comparison/`

— aggregated CSVs and markdown comparison tables across all schemes

Supported by an Ethereum Foundation grant.
