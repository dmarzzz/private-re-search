---
url: https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md
title: pir-comparison/high-throughput-pir/docs/pir-comparison.md at main · turanzv/pir-comparison
fetched_at: 2026-05-30T15:52:21
content_hash: sha1:2cf0e83b783e6e6d2817cbb41f307419823a769c
extractor: trafilatura
---

This document compares single-server PIR schemes: YPIR, SimpleYPIR, InsPIRe (with variants InsPIRe0, InsPIRe, InsPIRe(2)), Respire, WhisPIR, and HintlessPIR. The analysis draws from benchmark data extracted from each scheme's publication, normalized to common database sizes (1 GB, 8 GB, 32 GB) and standardized metric units. SimpleYPIR — YPIR's packing applied to a single-level SimplePIR structure — is included as the YPIR family representative for entry sizes beyond 1-bit, where YPIR itself lacks benchmarks.

**Key findings:**

-
**YPIR leads the throughput-latency tradeoff.**At 32 GB, YPIR achieves 12,390 MB/s throughput with 2.64 s response time — the highest throughput and lowest response time of any scheme at every database size tested. SimpleYPIR (YPIR's packing on single-level SimplePIR) extends the family to larger entry sizes at 5,840 MB/s (32 GB). -
**No single scheme leads across all dimensions.**The tradeoff space is genuinely multi-dimensional. While YPIR leads in throughput and response time, it does not minimize communication costs. Schemes optimized for communication (Respire, InsPIRe) sacrifice throughput by factors of 15–30x compared to YPIR. -
**Respire achieves the lowest communication overhead.**At 8 GB with 256-byte records, Respire's total online communication is 16.8 KB (14.8 KB query, 2.0 KB response) — 92x lower than YPIR's 1,548 KB, but at the cost of 30x lower throughput (393 MB/s vs. 11,878 MB/s). -
**InsPIRe family offers a configurable communication-throughput tradeoff.**Through parameter tuning, InsPIRe configurations span a wide range: the best configurations match YPIR's throughput (8,050 MB/s), while median configurations reduce communication by 50-80% compared to YPIR at the cost of 40-50% lower throughput. This flexibility makes InsPIRe suitable for use cases with intermediate priorities. -
**WhisPIR is uniquely stateless.**Unlike all other schemes which require preprocessing (ranging from client key uploads to server-side database packing), WhisPIR operates statelessly with no preprocessing phase. However, WhisPIR data is approximate (extracted from graphs), which limits the precision of conclusions.

**Data extraction.** Benchmark data was extracted from five papers (YPIR, Respire, WhisPIR, HintlessPIR, InsPIRe) into CSV format with provenance tracking. Each paper benchmarked their scheme along with selected baselines; these benchmarks were captured as published.

**Normalization.** Benchmarks were aligned to common database sizes (1 GB, 8 GB, 32 GB) where available. Metrics were standardized to consistent units: KB for communication, ms for latency, MB/s for throughput. Where papers reported only subset of database sizes, interpolation or extrapolation was not performed; comparisons are restricted to reported configurations.

**Hardware differences.** The papers use different server hardware:

- YPIR: Intel Xeon 8375C
- Respire: Intel Xeon 8488C @ 2.4 GHz
- HintlessPIR: Intel Xeon Sapphire Rapids @ 3.0 GHz
- InsPIRe: Intel Xeon @ 2.6 GHz
- WhisPIR: Intel Core i7 @ 2.5 GHz (consumer-grade, not server hardware)

Hardware differences are acknowledged here. Throughout the remainder of this document, direct comparisons are made without per-comparison hardware caveats. The reader should interpret absolute performance numbers with hardware context in mind, while relative tradeoffs (communication vs. throughput, for example) are more robust across hardware.

**WhisPIR data.** WhisPIR presents benchmarks primarily as graphs rather than tables. All WhisPIR values in this document are approximate (extracted visually from figures) and marked with `~`

where precision matters. This affects the confidence of direct numerical comparisons involving WhisPIR, but broad characterizations (stateless model, communication profiles) remain valid.

**InsPIRe parameter configurations.** InsPIRe (and its variants InsPIRe0, InsPIRe(2)) support multiple parameter configurations offering different communication-computation tradeoffs via the interpolation degree parameter `t`

. Rather than selecting an arbitrary single configuration, we present:

**Best configuration:**The configuration that maximizes throughput (or minimizes latency/communication where throughput is tied)**Median configuration:**The middle configuration in the paper's parameter sweep, representing a balanced point in the tradeoff space

This dual representation shows the range of InsPIRe's configurability. Individual configurations are available in figures and detailed tables but are not discussed individually in the main text.

**Figures.** This document embeds a curated selection of 12 figures. The full set of ~750 visualizations (including all database sizes, entry sizes, light/dark themes, and interactive HTML versions) is available in the `figures/`

directory. Static figures are in `figures/static/`

in PNG, PDF, and SVG formats; interactive Plotly figures are in `figures/interactive/`

as standalone HTML files.

**YPIR (2024).** YPIR is based on LWE-to-RLWE packing using the Chen-Dai-Kim-Song transformation applied to the DoublePIR structure. Its key innovation is eliminating the hint download phase required by DoublePIR through compact RLWE response packing. YPIR requires server-side preprocessing with no offline communication (silent preprocessing). The preprocessing is database-independent and reusable across queries. YPIR's tradeoff profile is **high-throughput**: it achieves up to 83% of memory bandwidth (12.1 GB/s for 32 GB databases), yielding both the highest throughput and the lowest response time of any scheme at every database size tested. This comes with moderate communication overhead (2.6 MB total for 32 GB, 1-bit queries). YPIR only benchmarks 1-bit entries; for larger entry sizes, **SimpleYPIR** — which applies YPIR's LWE-to-RLWE packing to a single-level SimplePIR structure rather than DoublePIR — serves as the YPIR family representative. SimpleYPIR is not the same scheme as SimplePIR (SimplePIR requires a 121–724 MB client hint download; SimpleYPIR eliminates this through YPIR's packing). It uses the same key material (462 KB upload keys) and the same silent preprocessing model. SimpleYPIR is benchmarked in the InsPIRe paper for 1-bit, 64-byte, and 32-kilobyte entries. At 8 GB, SimpleYPIR achieves 4,420 MB/s throughput with 892 KB total communication — roughly 2.7x slower than YPIR but with 42% lower communication.

**Respire (2024).** Respire builds on Spiral with subring embedding and ring switching for query and response compression. The scheme requires client-side key upload (3.9-11.3 MB depending on database size, one-time reusable) followed by server-side database packing. Respire is optimized for databases with small records (256-byte entries), achieving 10x response compression and 3.9x query compression compared to Spiral. Its tradeoff profile is **low-communication-small-records**: Respire achieves the lowest total communication (16.8 KB at 8 GB) at the cost of significantly lower throughput (393 MB/s, roughly 30x slower than YPIR). Respire's preprocessing model involves offline communication, distinguishing it from silent preprocessing schemes.

**WhisPIR (2024).** WhisPIR is a BGV-based scheme with optimized index expansion, using a single rotation key and a non-compact BGV variant. Unlike all other schemes in this comparison, WhisPIR is **stateless**: it requires no preprocessing, no offline communication, and no persistent client or server state. This makes WhisPIR uniquely suitable for ephemeral-client scenarios or environments where preprocessing is infeasible. WhisPIR's tradeoff profile is **stateless-low-comm**: it achieves low communication overhead (optimal for entries up to 256 bytes) without preprocessing, though throughput is lower than YPIR and concrete values are approximate due to graph-based data presentation. The stateless property is WhisPIR's defining feature and primary differentiator.

**HintlessPIR (2023).** HintlessPIR uses homomorphic encryption with composable preprocessing, outsourcing hint computation to the server rather than requiring clients to download hints (as in DoublePIR). Preprocessing is database-independent and highly parallelizable (SIMD-friendly). HintlessPIR supports both single-client and cross-client batch queries. The scheme's tradeoff profile is **balanced**: it sits between YPIR's high throughput (5,018 MB/s at 8 GB for 1-bit, roughly 2x slower than YPIR) and Respire's low communication (3.2 MB total at 8 GB, higher than Respire but far lower than YPIR). HintlessPIR's database-independent preprocessing model allows preprocessing to be performed once and reused across database updates, a useful property for frequently-updated databases.

**InsPIRe (2025).** InsPIRe introduces the InspiRING ring packing algorithm, which packs LWE ciphertexts into RLWE using only 2 key-switching matrices (compared to log(d) matrices in Chen-Dai-Kim-Song). The paper presents three construction variants:

-
**InsPIRe0:**Based on DoublePIR structure with InspiRING packing, optimized for small entries only. Tradeoff profile:**balanced**, similar to HintlessPIR but with reduced key material (5x smaller cryptographic keys than YPIR). -
**InsPIRe:**Combines ring packing with homomorphic polynomial evaluation to support arbitrary entry sizes (1-bit to large records). The interpolation degree parameter`t`

controls a communication-computation tradeoff: higher`t`

reduces communication but increases preprocessing and query processing time. This configurability is InsPIRe's key feature. Tradeoff profile:**low-communication**(median configs) to**high-throughput**(best configs). -
**InsPIRe(2):**Uses double ring packing (two-level packing) optimized for small to medium entries. Offers similar configurability to InsPIRe with slightly different tradeoff curves depending on entry size.

All InsPIRe variants use server-side preprocessing only (silent, no offline communication). The preprocessing is database-independent and reusable. InsPIRe achieves up to 25% higher throughput than YPIR for 32KB entries (with best configurations), and 50-93% lower communication overhead depending on configuration and entry size. The family's defining feature is **tradeoff configurability**: by selecting parameter `t`

, users can position themselves anywhere along a communication-throughput frontier, making InsPIRe suitable for use cases with intermediate or flexible priorities.

**For detailed construction breakdowns** (including cryptographic assumptions, preprocessing models, key innovations, and per-scheme performance profiles), see the [companion profiles document](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-scheme-profiles.md).

The plots below show throughput and server response time scaling across database sizes for 1-bit entries — the only entry size where all schemes report benchmarks.

**YPIR leads throughput by a wide margin.** At 32 GB, YPIR achieves 12,390 MB/s throughput with 2.64 s response time, approaching memory bandwidth limits. At 8 GB, it reaches 11,878 MB/s with 687 ms response time. No other scheme comes within 15% of YPIR's throughput at any database size.

**InsPIRe0 is the second-highest-throughput scheme.** At 32 GB, InsPIRe0 reaches 9,670 MB/s (3.39 s) — 78% of YPIR's throughput. At 8 GB, it reaches 10,060 MB/s (810 ms). InsPIRe0 is restricted to small entries only, which limits its applicability, but for 1-bit workloads it is a strong alternative to YPIR with 35% lower communication.

**The configurable InsPIRe variants span a wide throughput range.** At 32 GB, InsPIRe's best configuration reaches 8,180 MB/s (4.01 s) and InsPIRe(2)'s best reaches 8,570 MB/s (3.82 s) — the throughput gap to YPIR narrows as database size increases. InsPIRe's median config drops to 6,230 MB/s (5.26 s) at 32 GB. At 8 GB, InsPIRe best achieves 7,150 MB/s (1.15 s) and median 4,440 MB/s (1.85 s). The median configurations sacrifice throughput for lower communication (detailed in the next section).

**HintlessPIR occupies the middle ground.** At 32 GB (1-bit), HintlessPIR achieves 6,554 MB/s (5.0 s) on Xeon 8375C hardware, and 5,550 MB/s (5.91 s) as benchmarked in the InsPIRe paper. At 8 GB, it reaches 5,018 MB/s (1.62 s). HintlessPIR's throughput is modest compared to YPIR or InsPIRe's best configs, but its database-independent preprocessing model provides operational advantages not captured by raw throughput numbers.

**Respire trades throughput for communication savings.** At 8 GB with 256-byte entries (the largest database size Respire benchmarks), Respire achieves only 393 MB/s (20.84 s response time) — roughly 30x lower throughput than YPIR. This is a direct consequence of Respire's subring embedding and ring switching optimizations, which compress communication at the cost of computational overhead.

**WhisPIR's throughput is difficult to assess precisely.** WhisPIR benchmarks are approximate (extracted from graphs). At 32 GB, the paper reports ~20 s response time. WhisPIR's throughput is lower than the InsPIRe family and YPIR, but its stateless property — no preprocessing, no persistent state — is its defining feature rather than raw throughput.

For 32-kilobyte entries, only InsPIRe, SimpleYPIR, HintlessPIR, and WhisPIR have data. YPIR, InsPIRe0, and Respire do not benchmark this entry size.

**InsPIRe's best configurations lead at 32KB.** At 32 GB, InsPIRe's best config reaches 9,360 MB/s (3.50 s) — higher throughput than SimpleYPIR at 5,840 MB/s (5.61 s) and HintlessPIR at 5,550 MB/s (5.91 s). At 8 GB, InsPIRe best reaches 8,050 MB/s (1.02 s) vs. SimpleYPIR at 4,420 MB/s (1.85 s). The relative ordering shifts from the 1-bit picture: YPIR is absent and SimpleYPIR, its single-level variant, cannot match InsPIRe's throughput at this entry size.

**InsPIRe's median configurations remain competitive.** At 32 GB, InsPIRe median achieves 7,580 MB/s (4.32 s) with 1,160 KB communication — still faster than SimpleYPIR while using 35% less communication. At 8 GB, median reaches 4,260 MB/s (1.92 s) with 488 KB communication.

**SimpleYPIR and HintlessPIR converge.** At 32KB entries, SimpleYPIR (4,420 MB/s at 8 GB) and HintlessPIR (4,040 MB/s) are within 10% of each other in throughput, though their communication profiles differ substantially: SimpleYPIR at 892 KB total vs. HintlessPIR at 3,828 KB.

Communication cost is the total data transferred per query: query size (client to server) plus response size (server to client). Some schemes also incur one-time offline communication during preprocessing.

**Respire achieves the lowest online communication.** At 8 GB with 256-byte entries, Respire's total online communication is 16.8 KB (14.8 KB query + 2.0 KB response). This is 92x lower than YPIR's 1,548 KB and 19x lower than InsPIRe's median configuration (277 KB). However, Respire requires a one-time offline key upload of 3,994 KB (~3.9 MB). When amortized over many queries, the offline cost becomes negligible; for single-query scenarios, the effective communication is ~4 MB.

**InsPIRe's communication-throughput tradeoff is its defining feature.** The InsPIRe family spans a continuous range of communication costs by varying the interpolation degree parameter `t`

:

- InsPIRe median config (1-bit, 8 GB): 277 KB total (225 KB query + 52 KB response)
- InsPIRe(2) median config: 628 KB total
- InsPIRe best config: 907 KB total (855 KB query + 52 KB response)
- InsPIRe(2) best config: 992 KB total

At the low-communication end, InsPIRe's median config achieves 82% lower communication than YPIR (277 KB vs. 1,548 KB) at 2.7x lower throughput. At the high-throughput end, InsPIRe's best config is still 41% lower communication than YPIR while achieving 60% of YPIR's throughput. This tunability allows deployers to select configurations matching their bandwidth-throughput priorities.

**YPIR's communication is moderate.** At 32 GB (1-bit), YPIR transfers 2,572 KB per query (2,560 KB query + 12 KB response). The query is large but the response is compact (12 KB), reflecting YPIR's RLWE packing efficiency. At 8 GB, total communication is 1,548 KB. SimpleYPIR's communication at 32 GB is 1,784 KB (896 KB query + 888 KB response) — 31% lower total than YPIR, but with a much larger response due to the single-level structure lacking RLWE response packing.

**HintlessPIR has the highest online communication among primary schemes.** At 32 GB (1-bit), HintlessPIR transfers 7,476 KB (1,024 KB query + 6,452 KB response) as benchmarked in the InsPIRe paper, or 5,734 KB (2,458 KB query + 3,277 KB response) as reported in its own paper. At 8 GB, this is 3,174 KB. HintlessPIR's communication costs reflect the tradeoff for eliminating client-side hint downloads: the server must return more data to compensate for the absence of precomputed client hints.

**Communication scaling across database sizes.** Communication costs generally grow sublinearly with database size. YPIR's query size scales from 384 KB (1 GB) to 2,560 KB (32 GB) — roughly 6.7x growth for 32x more data. InsPIRe's response size remains constant at 52 KB regardless of database size (a property of ring packing), while query size grows. HintlessPIR's response size scales more steeply: from 1,748 KB (1 GB) to 6,452 KB (32 GB).

All schemes except WhisPIR require some form of preprocessing before queries can be served. Preprocessing models differ significantly in who bears the cost, whether the result is reusable, and whether it depends on database content.

**WhisPIR — no preprocessing.** WhisPIR is fully stateless: no preprocessing, no offline communication, no persistent client or server state. Each query is self-contained. This is unique among the compared schemes and is WhisPIR's primary differentiator.

**YPIR and InsPIRe — silent server-side preprocessing.** Both YPIR and the InsPIRe family perform preprocessing entirely server-side with no offline communication. The preprocessing packs the database into a format optimized for homomorphic evaluation. Preprocessing is database-independent (depends only on database dimensions, not content) and reusable across queries and database updates.

- YPIR at 32 GB: ~724 s (reported as 48 MB/s/core preprocessing throughput)
- InsPIRe at 8 GB: 94–598 s depending on configuration (lower
`t`

= faster preprocessing) - InsPIRe at 32 GB: 589–2,581 s depending on configuration
- InsPIRe(2) at 32 GB: 2,052–2,340 s
- InsPIRe0 at 1 GB: 43 s; at 8 GB: 200 s; at 32 GB: 731 s

InsPIRe's preprocessing time varies significantly with configuration — aggressive communication reduction (higher `t`

) requires substantially more preprocessing. For InsPIRe's most communication-efficient configs at 32 GB, preprocessing can exceed 40 minutes.

**HintlessPIR — database-independent server preprocessing.** HintlessPIR's preprocessing generates reusable rotation keys on the server. The key property is database independence: preprocessing does not need to be repeated when the database changes, only when cryptographic parameters change. At ~8 GB (8.589 GB), HintlessPIR preprocessing takes 2,128 s (~35 minutes) single-threaded. At ~1 GB, it takes 199 s. HintlessPIR's preprocessing is highly parallelizable (SIMD-friendly), so wall-clock time decreases roughly linearly with available cores.

**Respire — client key upload + server packing.** Respire is the only scheme requiring offline communication: the client uploads a 3.9 MB reusable key to the server, after which the server packs the database. This offline upload is one-time and reusable across queries, but it means the client must interact with the server before the first query. This offline round-trip distinguishes Respire from the silent preprocessing models.

The Pareto frontier plots below show the throughput-communication tradeoff space across two entry sizes — 1-bit (the only entry size where all schemes report data) and 32KB (the largest entry size with multi-scheme coverage) — at both 8 GB and 32 GB database sizes. Points on the Pareto frontier (connected by the dashed line) represent schemes where no other scheme is simultaneously better on both dimensions.

**At 1-bit, YPIR and InsPIRe share the frontier.** YPIR anchors the high-throughput end — 11,878 MB/s at 8 GB, 12,390 MB/s at 32 GB — while InsPIRe and InsPIRe(2) configurations span the middle and low-communication region, with communication as low as 238 KB (at 1,750 MB/s, 8 GB). InsPIRe0 sits between YPIR and the configurable InsPIRe variants: 10,060 MB/s at 8 GB with 1,060 KB total communication.

At 32 GB, WhisPIR appears on the frontier at the low-communication corner (~20 s response time, ~30 KB communication), though its values are approximate. HintlessPIR, SimpleYPIR, and Respire (at 256B) sit behind the frontier in the throughput-communication plane. This does not make them poor choices — it means other factors (preprocessing model, statelessness, entry size support) must justify their selection.

**At 32KB, InsPIRe sweeps the entire frontier.** This is a qualitative shift from the 1-bit picture. At 8 GB, InsPIRe configs span from 1,570 MB/s / 320 KB (config-1) to 8,050 MB/s / 2,056 KB (config-6), with every config on the frontier. SimpleYPIR (4,420 MB/s, 892 KB) and HintlessPIR (4,040 MB/s, 3,828 KB) both sit behind it. At 32 GB, InsPIRe extends from 2,120 MB/s / 472 KB (config-1) to 9,360 MB/s / 7,432 KB (config-7), again with SimpleYPIR (5,840 MB/s, 1,784 KB) and HintlessPIR (5,550 MB/s, 7,476 KB) behind the frontier.

The contrast across entry sizes is significant: YPIR leads at 1-bit but has no 32KB benchmarks (SimpleYPIR, its single-level variant, fills that gap at lower throughput). InsPIRe's polynomial evaluation approach scales naturally across entry sizes, giving it an advantage at larger records where YPIR's DoublePIR structure is unavailable.

Based on the data, the schemes cluster into five tradeoff profiles:

**High-throughput: YPIR.** YPIR leads all metrics related to server computation speed at 1-bit entries. It requires silent server-side preprocessing and supports only 1-bit entry benchmarks (SimpleYPIR extends the family to larger entries at lower throughput).

**Configurable communication-throughput: InsPIRe, InsPIRe(2).** The InsPIRe family allows deployers to position themselves anywhere along the communication-throughput frontier. At 1-bit, best configs approach YPIR's throughput; at 32KB, InsPIRe configs occupy the entire Pareto frontier. The tradeoff is higher preprocessing time for more communication-efficient configurations.

**Balanced: HintlessPIR, InsPIRe0.** HintlessPIR and InsPIRe0 offer moderate throughput (~5,000–10,000 MB/s), moderate communication (~1,000–3,200 KB), and straightforward deployment. HintlessPIR's database-independent preprocessing is particularly valuable for frequently-updated databases. InsPIRe0 is restricted to small entries but delivers near-YPIR throughput.

**Low-communication (small records): Respire.** Respire achieves 16.8 KB total online communication at 8 GB / 256B entries — orders of magnitude lower than any other scheme. The cost is 30x lower throughput (393 MB/s) and a one-time 3.9 MB offline key upload.

**Stateless: WhisPIR.** WhisPIR is the only scheme requiring no preprocessing, no offline communication, and no persistent state. WhisPIR's throughput and communication are competitive with mid-range InsPIRe configurations, though precise comparison is limited by approximate data.

This comparison has several boundaries that the reader should be aware of when using it for scheme selection.

**Hardware heterogeneity.** The benchmarks are drawn from five different papers, each using different server hardware (see Methodology). Absolute performance numbers are not directly comparable across papers — a scheme benchmarked on a faster CPU may appear faster than it would on identical hardware. Communication metrics are hardware-independent and therefore more reliable for cross-scheme comparison. Throughput ratios between schemes benchmarked on the same hardware (e.g., YPIR and HintlessPIR from the YPIR paper, or InsPIRe family and baselines from the InsPIRe paper) are more trustworthy than ratios across papers.

**Paper-reported benchmarks only.** All numbers come from the original papers. No independent benchmarking was performed. Papers may optimize their own scheme more carefully than baselines, introducing systematic bias. Where a scheme appears as a baseline in another paper (e.g., YPIR benchmarked in the InsPIRe paper), we include both the scheme's own numbers and the baseline numbers to provide cross-reference points.

**Single-threaded comparisons.** Most benchmarks reported here are single-threaded. HintlessPIR additionally reports 4-thread results (20,530 MB/s at ~8 GB for 32 KB entries, vs. 6,376 MB/s single-threaded), suggesting substantial parallelization headroom. Other schemes may also benefit from multi-threading but do not report parallel benchmarks. Single-threaded numbers understate the potential of schemes with parallelizable inner loops.

**Entry size coverage is uneven.** 1-bit entries are used for the primary cross-scheme comparison because it is the only entry size where all schemes report benchmarks. For 64-byte and 32-kilobyte entries, only InsPIRe, SimpleYPIR, and HintlessPIR have data. Respire benchmarks 256-byte entries exclusively. This makes cross-entry-size comparisons difficult and means some schemes may perform differently at entry sizes not benchmarked.

**WhisPIR data is approximate.** WhisPIR presents benchmarks as graphs rather than tables. All WhisPIR values are visually extracted and carry uncertainty. Broad characterizations (stateless model, relative communication positioning) are reliable, but precise numerical comparisons involving WhisPIR should be treated with caution.

**Batch query performance not compared.** Several schemes (HintlessPIR, Respire) support batch queries where amortized costs per query decrease significantly. This comparison focuses on single-query performance. For high-query-volume deployments, batch-mode throughput may change the relative rankings.

**Implementation maturity and availability.** This comparison does not assess code availability, library maturity, or ease of integration. Some schemes have open-source implementations; others do not. Production deployment feasibility depends on factors beyond benchmark numbers.

**No GPU benchmarks.** YPIR reports GPU-accelerated results (97 GB/s throughput) which are not included in this comparison. For GPU-equipped deployments, YPIR's advantage would be substantially larger than shown here.
