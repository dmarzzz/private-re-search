---
url: https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-scheme-profiles.md
title: pir-comparison/hot-state-pir/docs/hot-state-pir-scheme-profiles.md at main · turanzv/pir-comparison
fetched_at: 2026-05-30T15:52:21
content_hash: sha1:dc63759ad2c628d6a8f4296f2b39769c9ecb053f
extractor: trafilatura
---

This document provides detailed per-scheme construction breakdowns as a companion to the [main comparison document](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-comparison.md). The main document covers cross-scheme analysis organized by metric (query performance, update overhead, communication costs) and concludes with tradeoff profiles. This document provides the per-scheme depth: construction details, cryptographic assumptions, preprocessing models, and hot-state-specific properties — update mechanism, update cost, and hint refresh behavior — for each of the eleven schemes.

Schemes are grouped by the same five hot-state tradeoff profiles used in the main document. Within each group, schemes are presented in chronological order by publication year. All performance numbers are drawn from the original papers; no independent benchmarking was performed.

**Schemes:** SealPIR, MulPIR, OnionPIR, Spiral

This group comprises the first generation of practical single-server PIR schemes (2017–2022). All four share a common hot-state characteristic: they require a full server-side rebuild (re-preprocessing) whenever the database changes, and none of the papers report the time cost of that rebuild step. They differ substantially in query latency and communication efficiency, with OnionPIR being an extreme outlier in server computation time.

**Year:** 2017
**Authors:** Sebastian Angel, Hao Chen, Kim Laine, Srinath Setty

SealPIR builds on XPIR with oblivious expansion — a technique that allows the client to send a compressed query that the server expands obliviously into a full selection vector. The client compresses the query by a factor of up to 274× for 288-byte entries, reducing upload communication substantially over the XPIR baseline. The server evaluates the expanded query homomorphically against the database encoded as FV plaintexts, then returns the response ciphertext.

**BV (Brakerski-Vaikuntanathan) FHE**— for homomorphic evaluation**FV (Fan-Vercauteren) homomorphic encryption**— for BFV-style ciphertext encoding**RLWE (Ring Learning with Errors)**— hardness assumption underlying both

Single-server. The server performs database-dependent preprocessing and evaluates homomorphic queries against the preprocessed database representation. Server computation is dominated by the ServerRespond phase (homomorphic evaluation).

**Type:**Database-dependent server-side preprocessing**Offline communication:**None**Reusability:**Preprocessing output is invalidated by any database change**Rebuild required:**Yes — any database modification triggers full re-preprocessing

SealPIR does not describe an incremental update mechanism. The update model is full-rebuild: any change to the database requires re-running the entire server-side preprocessing step. The paper characterizes preprocessing as database-dependent (Section 3.4) without providing timing for the preprocessing phase itself.

Preprocessing encodes database records into BFV plaintext polynomials, packing multiple records into ciphertext slots via NTT-based encoding. When a single record changes, only the affected plaintext polynomial is technically altered — but SealPIR's query expansion mechanism (oblivious expansion via substitution automorphisms) touches all polynomials during query evaluation. For the server's response to be correct, the entire encoded database must be consistent at query time, so partial re-encoding introduces a synchronization hazard unless the server can atomically swap only the modified polynomial. In practice, the full encoding pass is re-run to guarantee consistency. The rebuild bottleneck is the NTT-based encoding pass over the entire database. A theoretical path to incremental updates exists — re-encode only the changed polynomial — but would require careful query-time synchronization that SealPIR does not implement.

**Client-Side Rebuild Requirement:** Ephemeral keys, 0 bytes stored client-side; rebuild is transparent to client.

The paper does not benchmark preprocessing time as a standalone operation. The rebuild cost is described as "varies by database size" without absolute figures at hot-state-relevant sizes (256 MB or larger). Update cost tier: **unknown**.

SealPIR clients store 0 bytes of per-query hints — client state consists only of an ephemeral FHE secret key generated per query and discarded after the response is received. There is no persistent client-side hint that requires refreshing. The server-side preprocessed database, however, must be fully rebuilt after any update; the client is unaffected by this rebuild beyond the fact that queries must wait for it to complete.

Benchmarks sourced from the MulPIR paper (Table 3) and SealPIR paper (Figure 9).

**Server time at ~268 MB (d=2, 1,048,576 × 288B entries):**2.01 s (SealPIR Figure 9 ANSWER time)**Server time at ~281 MB (d=2, 1,048,576 × 288B entries):**3.52 s (MulPIR Table 3)**Query size:**61.4–64 KB (depending on recursion depth and source)**Response size:**256–307 KB**Total online communication at ~281 MB:**~368 KB (61.4 KB query + 307 KB response)**Hardware:**Intel Xeon E5-2667 @ 3.6 GHz (Figure 9) / Intel Xeon E5-2695 v3 @ 2.30 GHz (MulPIR Table 3)

Note: SealPIR benchmarks appear as both self-reported (2017 paper) and as a baseline in the MulPIR paper (2019). Both sets are retained; hardware differences between papers limit direct comparison.

- Establishes oblivious expansion as the foundational query compression technique for single-server PIR
- Up to 274× query compression relative to XPIR baseline
- Cross-client batch query support via probabilistic batch codes (PBC) — multiple queries share a single server computation cycle
- No offline communication or client-side hint management required
- Supports a wide entry size range (288 B to 2 MB)

- Preprocessing time (rebuild cost) not benchmarked — update feasibility at 256 MB+ is unknown
- Communication costs higher than later schemes (Spiral, Respire) — 61.4 KB query, 307 KB response
- Benchmarks from 2017 hardware; AVX-512 and modern RLWE library improvements may significantly change absolute numbers
- Response size increases with database size, unlike communication-optimized schemes

**Year:** 2019
**Authors:** Asra Ali, Tancrède Lepoint, Sarvar Patel, Mariana Raykova, Phillipp Schoppmann, Karn Seth, Kevin Yeo

MulPIR extends SealPIR by exploiting both additive and multiplicative homomorphism, using BFV somewhat-homomorphic encryption. By incorporating multiplicative operations in the recursion steps, MulPIR reduces query upload by up to 80% and download communication for large entry sizes relative to SealPIR. The database is encoded as BFV ciphertexts; server computation remains similar in cost to SealPIR.

**BFV (Brakerski-Fan-Vercauteren) SHE**— somewhat homomorphic encryption for both additive and multiplicative operations**RLWE (Ring Learning with Errors)**— hardness assumption**Somewhat Homomorphic Encryption (SHE)**— bounded multiplication depth sufficient for the recursion depth used

Single-server. Architecture extends SealPIR: database-dependent preprocessing followed by homomorphic evaluation of queries. Server computation (ServerExpand + ServerRespond) is comparable to SealPIR at equivalent database sizes.

**Type:**Database-dependent server-side preprocessing**Offline communication:**None**Reusability:**Preprocessing is invalidated by any database change**Rebuild required:**Yes — same full-rebuild model as SealPIR

MulPIR does not describe an incremental update mechanism. Any database change requires full re-preprocessing, identical to SealPIR's update model. The paper does not benchmark preprocessing time.

MulPIR's multiplicative homomorphism over SealPIR's additive base does not change the update picture — the server still operates on the same BFV-encoded database representation. The update model is identical to SealPIR's: preprocessing encodes records into BFV plaintext polynomials, and any database change invalidates the encoded representation. MulPIR's deeper multiplicative recursion means the server's preprocessing could theoretically be split into two phases — base BFV encoding (same as SealPIR) and multiplicative hint precomputation for the additional recursion dimensions — but the paper does not explore this decomposition. The rebuild bottleneck is the same NTT-based encoding pass as SealPIR; the multiplicative precomputation adds overhead but is not the dominant cost for typical database sizes.

**Client-Side Rebuild Requirement:** Same as SealPIR — ephemeral keys, no persistent client state.

The paper does not report preprocessing time as a rebuild cost. The description notes that preprocessing "varies by database size" without providing numbers at 256 MB or larger. Update cost tier: **unknown**.

Note: MulPIR's only benchmarked database is 1.44 MB (5,000 × 288-byte records) from Table 5, plus 75.5 MB and 4 GB entries from Tables 3–4. No benchmarks exist at 256 MB or larger for the 288-byte entry size relevant to hot-state analysis.

Same as SealPIR: clients store 0 bytes of persistent per-query state. The SHE secret key is ephemeral. No client-side hints require refreshing on database updates.

Benchmarks from MulPIR paper Tables 3, 4, and 5.

**Server time at ~75.5 MB (d=2, 262,144 × 288B entries):**2,310 ms = 2.31 s (Table 3)**Server time at ~75.5 MB (d=3, 262,144 × 288B entries):**3,664 ms = 3.66 s (Table 3)**Server time at ~1.44 MB (5,000 × 288B entries):**3,910 ms = 3.91 s (Table 5)**Query size:**14–130 KB (depending on database size and recursion depth)**Response size:**21–130 KB**Communication reduction vs. SealPIR:**up to 80% reduction in upload**Hardware:**Intel Xeon Platinum 8375C @ 2.30 GHz, 128 GB RAM

Critical limitation: The smallest hot-state-relevant database (256 MB) has no published MulPIR benchmark. All normalized hot-state entries for MulPIR use the 1.44 MB database with size_mismatch=True; these values should not be extrapolated to hot-state scales.

- Up to 80% communication reduction in upload relative to SealPIR for small entries
- Supports cross-client batch queries via probabilistic batch codes (PBC)
- Tunable communication-computation tradeoff via recursion depth parameter
- Supports a range of entry sizes (288 B to 40 KB tested)

- No benchmarks at hot-state-relevant database sizes (256 MB or larger for 288B entries) — the 1.44 MB benchmark database is the smallest of any scheme in this comparison
- Rebuild cost not benchmarked — update feasibility at relevant scales unknown
- Higher query size than later schemes (Spiral, Respire) due to BFV-based construction
- Performance at 256 MB+ is unknown from paper data alone

**Year:** 2021
**Authors:** Muhammad Haris Mughees, Hao Chen, Ling Ren

OnionPIR focuses on response compression using RGSW external products. The scheme uses a hierarchical PIR structure: BFV ciphertext-plaintext multiplication for the first hypercube dimension, followed by RGSW-BFV external products for remaining dimensions. This achieves a 2× response size reduction relative to SealPIR for equivalent databases (128 KB fixed response for databases up to 2^24 entries). OnionPIR offers two variants: a stateless variant requiring no preprocessing, and a stateful variant that trades offline setup for improved online performance.

**BFV (Brakerski-Fan-Vercauteren) encryption**— for ciphertext-plaintext multiplication**RGSW (Ring GSW) encryption**— for external product operations in remaining dimensions**RLWE (Ring Learning with Errors)**— hardness assumption underlying both

Single-server. The stateless variant requires no preprocessing; the server pays full TotalComputation cost (QueryUnpack + all DotProducts) per query. The stateful variant uses a Benes copy-network offline phase to precompute subset sums, shifting cost from query time to offline setup.

**Stateless variant:**None — no server preprocessing required**Stateful variant:**Offline phase (Private Stateful Information Retrieval setup via Benes copy network)**Offline communication:**None for stateless; variable for stateful**Reusability:**Stateful offline phase is database-dependent and must be rebuilt for any database change

OnionPIR does not describe an incremental database update mechanism. For the stateless variant, the update cost is trivially zero — there is no preprocessing to rebuild, so any database change takes effect immediately. For the stateful variant, any database change requires re-running the offline Benes network setup phase; the paper does not benchmark this as an update cost. The paper discusses the static database limitation in Sections 5 and 8.

The stateful variant's offline phase computes a Benes copy-network permutation structure — a network of copy and swap operations that enables oblivious expansion of encrypted index queries into selection vectors. This permutation network depends on the database layout (how records are indexed and mapped into the hypercube structure), not directly on record values. However, because the Benes network encodes the topology of the database's indexing scheme, it cannot be incrementally patched when records are added or removed — the permutation must be recomputed from scratch for the new database structure. The 1.5ck-byte client hints for the stateful variant encode a compressed representation of the permutation structure; when the database layout changes (records added or removed), these hints become stale and must be discarded. A single record value change (without structural reindexing) might not require full Benes recomputation in principle, but the paper does not explore this case.

**Client-Side Rebuild Requirement:** Stateless variant: no client action needed. Stateful variant: client must discard stale hints (1.5ck bytes) after rebuild.

**Stateless variant:**No preprocessing — update cost is zero (no rebuild required)**Stateful variant:**Offline phase must be re-run; cost not benchmarked in the paper

For hot-state analysis, this distinction matters: the stateless variant has no update cost but pays that cost entirely in query time — 400.9 seconds at ~30 MB and 6,416.2 seconds at ~500 MB. The stateful variant has an unknown update cost but achieves substantially lower per-query latency. Update cost tier for stateful variant: **unknown**.

**Stateless:**Clients store 0 bytes — no hints. No refresh needed.**Stateful:**Clients may store 1.5ck bytes (where c = subset size, k = subset count) for the stateful variant. These hints encode the compressed permutation structure and would need to be updated or discarded when the database changes and the offline phase is rerun.

Benchmarks from OnionPIR paper Tables 3 (stateless) and 4 (stateful). All benchmarks use 30-byte entries.

**Stateless variant (this analysis uses TotalComputation = QueryUnpack + DotProducts):**

**Server time at ~30 MB (2^20 × 30B entries):**400.9 s (QueryUnpack 4.6 s + DotProducts 396.3 s)**Server time at ~500 MB (2^24 × 30B entries):**6,416.2 s (QueryUnpack 5.5 s + DotProducts 6,410.7 s)**Query size:**64 KB (constant across database sizes)**Response size:**128 KB (constant)

**Stateful variant (online phase only):**

**Server time at ~30 MB:**25.1 s online**Server time at ~500 MB:**200.5 s online**Offline phase at ~500 MB:**87.1 s (would be the rebuild cost)**Hardware:**Amazon EC2 c5.2xlarge (Intel Xeon Platinum 8124M @ 3 GHz), 32 GB RAM

OnionPIR's stateless variant is an extreme outlier in server computation time — 100–1,000× slower than other schemes at comparable database sizes — because the stateless design shifts all preprocessing amortization to query time.

- Stateless variant requires no server preprocessing — update cost is zero, and server is fully stateless
- Fixed 128 KB response size regardless of database size (up to 2^24 entries) — communication grows sub-linearly
- 2× smaller response than SealPIR for equivalent databases
- Stateful variant achieves 1.8–22× computation reduction over stateless for online phase
- No offline communication required

- Stateless variant server computation is extreme: 400–6,416 seconds — 100–1,000× slower than SealPIR, Spiral, and Respire at comparable sizes; impractical for latency-sensitive applications
- Stateful variant update cost not benchmarked; offline phase at 500 MB is 87.1 s (likely high tier)
- No 256-byte entry size benchmarks — benchmarks use 30-byte entries, limiting direct communication comparison with schemes using 256B entries
- Stateful variant requires client hints (1.5ck bytes) that must be managed across database updates

**Year:** 2022
**Authors:** Samir Jordan Menon, David J. Wu

Spiral achieves query compression and throughput improvements through FHE composition — translating between matrix Regev ciphertexts and GSW ciphertexts to enable controlled noise growth during homomorphic evaluation. The database is organized as a hypercube with dimensions 2^v1 × 2 × 2 × ... × 2. Query-independent public parameters can be reused across queries, but any database change requires regenerating the database-dependent preprocessing. SpiralPack is a variant optimized for larger records via packing.

**RLWE (Ring Learning with Errors)**— primary hardness assumption**Regev encryption**— for multi-dimensional query structure**GSW (Gentry-Sahai-Waters) encryption**— for noise-controlled FHE composition

Single-server. Server-side setup generates query-independent public parameters (reusable across queries). Database-dependent preprocessing must be rerun on any database change. Server computation involves dimension reduction using FHE-composed operations.

**Type:**Server-side setup and public parameter generation**Offline communication:**Public parameters only (14–47 MB, generated server-side and reusable)**Reusability:**Public parameters are query-independent and reusable; database-dependent setup must be rerun for any database change**Rebuild required:**Yes — database changes require re-running database-dependent preprocessing

Spiral does not describe an incremental update mechanism. The full-rebuild model applies: any database change requires regenerating the server's preprocessed database representation. The paper does not report preprocessing time as a rebuild cost. The query-independent nature of the public parameters means those do not need to be regenerated on updates — only the database-dependent portion needs rebuilding.

Spiral's database-dependent preprocessing encodes the database into a hypercube of ring elements organized for Regev-style homomorphic evaluation. The hypercube dimensions are fixed at setup time (2^v1 × 2 × 2 × ... × 2) and each dimension's encoding interleaves records across ring element coefficients. A single-record change propagates across the entire hypercube slice containing that record — not just the one slot at that index, but across all ring elements within the affected slice, because Regev encoding distributes record bits across polynomial coefficients via NTT. The public parameters (query-independent: key-switching matrices, automorphism evaluation keys) survive updates and do not require regeneration. The bottleneck is re-encoding the database-dependent hypercube portion, but the paper does not separately time or characterize this step. A theoretical path to partial updates exists at the hypercube slice level, but this would require careful handling of the NTT interleaving within each slice and is not explored in the paper.

**Client-Side Rebuild Requirement:** Public parameters are query-independent and survive database updates.

Rebuild timing is not benchmarked in the Spiral paper. The paper notes setup involves key generation and public parameter generation (Construction 4.1) but does not separate database-dependent from query-independent preprocessing costs or report absolute time for the database-dependent portion. Update cost tier: **unknown**.

Clients store 0 bytes of per-query hints — the ephemeral secret key is discarded after each response. No persistent client state requires refreshing on database updates. The server-side public parameters that are query-independent also do not need refreshing on database updates.

Benchmarks from Spiral paper Table 2 (base), Table 3 (SpiralPack), Table 4 (streaming).

**Server time at 268 MB (2^20 × 256B entries, base variant):**1.69 s**Server time at 1.6 GB (2^14 × 100KB entries):**4.92 s**Server time at 7.9 GB (2^18 × 30KB entries):**24.46 s**Query size at 268 MB (256B entries):**14 KB**Response size at 268 MB (256B entries):**21 KB**Total online communication at 268 MB (256B entries):**35 KB**Communication rate at 256B entries:**0.0122 (rate = record_size / response_size)**Hardware:**Intel Xeon Platinum 8124M @ 3 GHz, 21 GB RAM

Spiral achieves the lowest server response time of the 2017–2022 generation at 256 MB (1.69 s), and 35 KB total online communication is substantially lower than SealPIR (368 KB) at comparable sizes.

- Lowest server response time of the first-generation schemes at 256 MB (1.69 s)
- 4.5× query size reduction compared to OnionPIR
- 2× throughput improvement over OnionPIR
- Query-independent public parameters reusable across queries without regeneration
- SpiralPack variant supports efficient larger record retrieval

- Rebuild time not benchmarked — update cost at 256 MB is unknown
- No batch query support (single-client or cross-client)
- Communication rate (35 KB at 268 MB) is higher than Respire (6.1 KB at 256 MB)
- Server benchmark hardware has only 21 GB RAM — benchmark scope limited to databases fitting this constraint

**Schemes:** Respire, NPIR

Respire and NPIR are the two schemes with measured rebuild cost data. Respire is the only scheme with explicitly benchmarked rebuild time at a hot-state-relevant database size, making it the most analytically tractable for hot-state feasibility assessment. NPIR's preprocessing time (13.32 s at 1 GB) provides a rebuild proxy, though with caveats around entry size.

**Year:** 2024
**Authors:** Alexander Burton, Samir Jordan Menon, David J. Wu

Respire extends Spiral with subring embedding and ring switching, achieving substantial reductions in both query and response size for small-record databases. The database is organized as a (1 + v2 + v3)-dimensional hypercube, with multiple records packed into single RLWE encodings using subring embedding. Ring switching compresses the query (3.9× relative to Spiral) and response (10× relative to Spiral). The scheme is specifically optimized for 256-byte entries; compression techniques are less effective for large records.

**RLWE (Ring Learning with Errors)**— primary hardness assumption**Circular security**— required for key-switching matrices used in ring switching

Single-server. Server-side preprocessing packs database records into ring elements via NTT transformation (SetupDB). Query processing uses dimension reduction operations and ring switching for response compression.

**Type:**Server-side database packing and NTT transformation (database-dependent)**Offline communication:**3.9 MB client-specific public parameters (one-time upload per client, reusable across subsequent queries)**Reusability:**Client public parameters are query-independent and reusable; server database packing is database-dependent and must be rerun for any database change**Rebuild required:**Yes — full re-packing of the database on any update

Respire does not describe an incremental update mechanism. The update model is full-rebuild: any database change requires re-running SetupDB (database packing + NTT transformation). Unlike other schemes in this comparison, Respire explicitly benchmarks this step.

SetupDB packs database records into RLWE ring elements using NTT (Number-Theoretic Transform), which distributes each record's bits across polynomial coefficients in a non-local pattern. This non-locality is the mechanism that makes incremental updates expensive: changing one record's data alters the coefficient values across the ring element that contains it, potentially affecting multiple coefficients simultaneously. The NTT conversion dominates the rebuild cost — the 16.8-second figure at 256 MB is primarily the NTT re-packing pass rather than I/O or key regeneration. A per-block NTT approach (packing records into separate ring elements independently) would enable incremental updates by localizing each record to one ring element, but at the cost of larger ciphertexts and higher query overhead — each additional ring element requires an additional homomorphic evaluation step. This is the fundamental tradeoff Respire's design chose not to make: Respire's subring embedding achieves tight response compression precisely because multiple records are packed into shared ring elements.

**Client-Side Rebuild Requirement:** 3.9 MB public parameters remain valid across DB updates; clients can immediately issue new queries without any re-setup.

Rebuild time data (from Respire paper, Section 4.2):

- 256 MB database:
**16.8 seconds** - 8 GB database:
**569 seconds** - The paper notes linear scaling with database size

Implied from linear scaling (paper's stated scaling law, not this document's extrapolation):

- 512 MB: approximately 33.6 seconds
- 1 GB: approximately 67.2 seconds

These extrapolated values follow the paper's linear scaling claim and are not measured values.

**16.8 seconds for a 256 MB database** — measured and reported in the Respire paper. This places Respire in the **medium** update-cost tier (12 s < 16.8 s ≤ 120 s). The 16.8-second rebuild exceeds Ethereum's 12-second block time by 4.8 seconds. Whether a 300–500 MB hot-state database could be rebuilt within 12 seconds is not answered by the paper's data.

Client public parameters (3.9 MB) do not require re-upload after a database update — they are query-independent and remain valid across database changes.

Clients store 0 bytes of per-query hints. The 3.9 MB client-specific public parameters, uploaded once, remain valid when the database changes — they do not need refreshing on database updates. After a database rebuild on the server side, clients can immediately issue new queries without any re-setup.

Benchmarks from Respire paper Tables 1 (single-query) and 2 (batch).

**Single-query performance:**

**Server time at 250 MB (2^20 × 256B):**1.26 s | Throughput: 204 MB/s | Rebuild: 16.8 s**Server time at 1 GB (2^22 × 256B):**3.48 s | Throughput: 295 MB/s**Server time at 8 GB (2^25 × 256B):**20.84 s | Throughput: 393 MB/s | Rebuild: 569 s**Query size at 256 MB:**4.1 KB |**Response size:**2.0 KB |**Total online:**6.1 KB**Query size at 1 GB:**7.7 KB |**Response size:**2.0 KB**Offline communication:**3.9 MB (one-time per client)**Communication rate at 256B entries:**38.8 (rate = record_size / total_online_bytes at 1 GB)

**Batch query performance (from Table 2):**

- Batch size 32 at 256 MB: 67.0 KB query, 31.8 KB response, 15.02 s server time
- Batch size 32 at 1 GB: 113 KB query, 31.8 KB response, 28.12 s server time
- Batch communication reduction: 3.4–7.1× relative to single-query for batches up to 128
**Hardware:**Intel Xeon Platinum 8175M, 32 GB RAM

Respire achieves the lowest total online communication of any scheme with data at 256 MB (6.1 KB vs. Spiral's 35 KB and SealPIR's 368 KB).

- Only scheme with explicitly benchmarked rebuild time at a hot-state-relevant database size (16.8 s at 256 MB)
- Lowest total online communication of any scheme with data at this scale (6.1 KB at 256 MB with 256B entries)
- Client public parameters (3.9 MB) are reusable across queries and across database updates — no client re-setup after server rebuild
- Single-client batch query support (3.4–7.1× communication reduction for batch sizes 2–128)
- 5.9× lower online communication than Spiral at comparable sizes

- 16.8 s rebuild at 256 MB exceeds Ethereum's 12-second block time — medium update-cost tier, not low
- Rebuild cost scales linearly: 512 MB implies ~33.6 s, 1 GB implies ~67.2 s (implied from paper's stated scaling)
- No cross-client batch query support — each client requires a separate 3.9 MB public parameter upload
- Optimized specifically for small records (256 bytes); performance advantage diminishes for larger entries
- 3.9 MB one-time offline upload required per new client; not zero-setup for new clients

**Year:** 2025
**Authors:** Yuliang Lin, Baosheng Wang, Yi Wang, Rongmao Chen

NPIR is the only NTRU-based PIR scheme in this comparison. The key innovation is NTRU packing: compressing multiple NTRU encodings of rotated polynomials into a single NTRU encoding, reducing the response from Nφ encodings to φ encodings. The database is represented as a matrix of polynomials D ∈ R_p^(Nφ×ℓ). Server-side preprocessing encodes the database into this polynomial representation via NTT conversion. NPIR is optimized for moderate-size records (2–128 KB tested); its performance on 256-byte entries is not benchmarked in the paper.

**NTRU (N-th degree Truncated polynomial Ring Units)**— for encoding and packing**Decisional NTRU problem**— security hardness assumption (Definition 2 in paper)

Security relies on the decisional NTRU assumption rather than RLWE. This is a distinct computational assumption from the RLWE-based schemes (SealPIR, Spiral, Respire, etc.), and NTRU hardness assumptions have a separate body of cryptanalysis literature.

Single-server. Server-side preprocessing encodes the database as polynomial encodings with NTT conversion. The preprocessing is database-dependent; any change to the database requires re-running the encoding step.

**Type:**Server-side database encoding and NTT conversion (database-dependent)**Offline communication:**None — client-light design**Reusability:**Preprocessing is database-dependent and must be rerun for any database change**Rebuild required:**Yes — database changes require full re-encoding

NPIR does not describe an incremental update mechanism. The paper does not address database mutations. The preprocessing is database-dependent (polynomial encoding + NTT conversion), so any database change would require re-running the full preprocessing step. Update cost tier is based on preprocessing time data from the paper. Partial updates may be possible per the paper's description, but no incremental mechanism is specified — the scheme is classified as full-rebuild.

NPIR's preprocessing time is the most informative update proxy for a scheme in this group. The paper reports preprocessing time in Table 1 as a separate measurement from query time.

The polynomial matrix D ∈ R_p^(Nφ×ℓ) encodes the database by converting record chunks into polynomial coefficients via NTT. The matrix structure does have column-level locality — each column corresponds to a chunk of records, and the NTRU packing technique operates within columns. This column-level organization could theoretically allow column-level re-encoding when only a subset of records changes, with the column boundaries providing a natural incremental update granularity. However, the NTT conversion within each column creates the same global coefficient interleaving as in Respire and Spiral: changing one record's data within a column alters polynomial coefficients across that column's ring element, not just the single coefficient corresponding to that record. The 13.32-second preprocessing time at 1 GB is dominated by the NTT conversion pass across all columns. Whether a column-granularity partial update would provide a meaningful speedup over full re-encoding has not been analyzed by the paper's authors.

**Client-Side Rebuild Requirement:** Secret key f is DB-independent; client unaffected by server-side rebuild.

Preprocessing time from NPIR paper (Table 1), which serves as a rebuild proxy:

**1 GB database (32 KB records):**13.32 s —**medium tier**(13.32 s > 12 s threshold)**4 GB database (32 KB records):**52.47 s**8 GB database (32 KB records):**111.06 s**32 GB database (32 KB records):**437.69 s

The 13.32-second figure at 1 GB is 1.32 seconds above the 12-second Ethereum block time threshold. This makes NPIR the closest to the low-cost threshold of any scheme with data, after Respire. However, the 32 KB entry size does not match the 256-byte hot-state target — scaling behavior at 256-byte entries is unknown.

Clients store 0 bytes of per-query hints. The client secret key (small constant-size NTRU secret key f) is generated per client and used to generate queries; it does not need to be refreshed when the database changes. No client-side state requires updating after a server-side rebuild.

Benchmarks from NPIR paper Tables 1, 3, 4, and 5.

**Standard NPIR (32 KB records):**

**Server time at 1 GB (2^15 × 32KB):**5.84 s | Preprocessing: 13.32 s | Throughput: 175.34 MB/s**Server time at 4 GB (2^17 × 32KB):**9.79 s | Preprocessing: 52.47 s | Throughput: 418.39 MB/s**Server time at 8 GB (2^18 × 32KB):**14.87 s | Preprocessing: 111.06 s | Throughput: 550.91 MB/s**Server time at 32 GB (2^20 × 32KB):**45.82 s | Preprocessing: 437.69 s | Throughput: 715.15 MB/s**Query size:**84 KB (constant across database sizes)**Response size:**128 KB (at 32 KB entry size)

**NPIR at smaller entry sizes:**

**Server time at 1 GB (2^19 × 2KB):**1.72 s | Preprocessing: 13.32 s**Server time at 1 GB (2^13 × 128KB):**20.82 s | Preprocessing: 13.35 s

**Batch variant NPIR_b (batch size 32, 32 KB records):**

**Server time at 1 GB:**191.24 s | Preprocessing: 13.32 s**Server time at 8 GB:**469.85 s**Hardware:**Intel Xeon Ice Lake Platinum 8369B @ 2.70 GHz, 512 GB RAM

Note: NPIR's query size (84 KB) is substantially larger than Spiral (14 KB) and Respire (4.1–7.7 KB). NPIR's communication advantage is in response compression (rate = 0.250 at 1 GB for 32 KB records), not query size.

- Only NTRU-based scheme in the comparison — distinct cryptographic assumption (decisional NTRU) provides algorithmic diversity
- Preprocessing time measured (13.32 s at 1 GB) — closest to the low-cost tier of any scheme after Respire
- High throughput at large databases: 715 MB/s at 32 GB with 32 KB records
- Cross-client batch query support via NPIR_b variant
- No offline communication — client-light design with zero hint size

- 13.32 s preprocessing at 1 GB exceeds the 12-second threshold by 1.32 s — medium tier, not low
- All benchmarks use 32 KB entry sizes; no 256-byte entry benchmarks available for hot-state comparison
- Query size (84 KB) is 6× larger than Spiral and 20× larger than Respire — high upload communication
- Preprocessing time at 256-byte entry sizes and 256 MB database is unknown
- Batch variant NPIR_b has high server time (191 s at 1 GB for 32 simultaneous queries) — sequential queries may be preferable

**Schemes:** OnionPIRv2, Pirouette

Both OnionPIRv2 and Pirouette are 2025 publications whose papers focus on query performance without explicitly analyzing database update scenarios. Both are classified as full-rebuild based on architectural analysis: Pirouette's hypercube polynomial packing encodes database content (requiring re-encoding on any update); OnionPIRv2's preprocessing generates key material only (DB-independent, implying near-zero preprocessing rebuild cost). Neither paper provides update benchmarks. Pirouette also appears in Group 4 (Query-Minimizing) due to its query-minimization tradeoff; the group membership here reflects the update-type classification, not a comprehensive profile.

**Year:** 2025
**Authors:** Yue Chen, Ling Ren

OnionPIRv2 improves on OnionPIR (2021) by combining BFV and RGSW encryption with external products for noise control. The initial dimension uses BFV ciphertext-plaintext multiplication; remaining dimensions use RGSW external products with improved noise management relative to the 2021 prototype. The result is an 11× throughput improvement over the OnionPIR prototype. The database is organized as a hypercube of d dimensions with initial dimension N0 = 512. OnionPIRv2's native entry sizes are 3.75 KB (n=2048 parameter set) and 22.5 KB (n=4096 parameter set).

**LWE (Learning with Errors)**— for query structure**RLWE (Ring Learning with Errors)**— for ring-based evaluation**BFV (Brakerski-Fan-Vercauteren) FHE**— for initial dimension computation**RGSW (Ring-Gentry-Sahai-Waters) FHE**— for external product operations

Single-server. Server requires minimal preprocessing — key material only (0.63–2.9 MB), which is query-parameter-dependent rather than database-content-dependent. The server's query pipeline does not depend on the specific contents of the database records, only on the database structure (size and entry format).

**Type:**Minimal — key material only, no database-dependent preprocessing**Offline communication:**0.63 MB (n=2048 parameter set) or 2.9 MB (n=4096 parameter set), stored on server**Reusability:**Key material does not change when the database changes — database-independent**Rebuild required:**Key material does not require regeneration on database updates

This is OnionPIRv2's most notable hot-state-relevant property: unlike all other schemes with server preprocessing in this comparison, OnionPIRv2's preprocessing is not database-dependent. The server pipeline does not need to be rebuilt when the database changes — only the underlying database data needs to be updated. However, the paper provides no explicit analysis or benchmarks of this update scenario.

OnionPIRv2 does not describe a database update mechanism. The paper focuses entirely on query performance and does not address what happens when the database changes. The classification is `update_type: full-rebuild`

— based on architectural analysis that the server pipeline must accommodate database content changes, though the preprocessing itself (key material only) does not need to be re-run.

The database-independent nature of OnionPIRv2's preprocessing warrants closer architectural analysis. The preprocessing computes RLWE key-switching matrices and automorphism evaluation keys that depend only on cryptographic parameters (ring dimension n, modulus q, gadget decomposition) — NOT on database content. This means the server's preprocessing state survives database mutations entirely: when records change, the key-switching matrices remain valid because they encode the query-evaluation circuit structure, not record values. The only per-query computation that changes with the database is the inner-product evaluation, which operates on the raw (unpacked) database records directly without requiring a separate preprocessing step. This makes OnionPIRv2 architecturally the most favorable scheme for hot-state deployments among those surveyed — the preprocessing overhead effectively disappears for an updating database. The caveat is important: the paper does not benchmark or discuss this scenario, so this claim is an architectural inference from the described construction, not an empirical confirmation. Deployment would require verifying that the query pipeline correctly handles in-place database updates without stale intermediate state.

**Client-Side Rebuild Requirement:** 0 bytes client-side state; client unaffected by any server-side changes.

No update timing data available. The preprocessing is database-independent (0.63–2.9 MB key material), which implies minimal to zero preprocessing rebuild cost on database changes. However, the paper does not confirm or benchmark this. Update cost tier: **unknown** (full-rebuild classification based on architectural inference; preprocessing itself does not require rebuild, but paper provides no update benchmarks).

Clients store 0 bytes of per-query hints. The 0.63–2.9 MB key material is stored on the server (not the client). No client-side state requires refreshing on database updates.

Benchmarks from OnionPIRv2 paper Table 2. All benchmarks report throughput, not per-query server time.

**Throughput at 0.9 GB (n=2048, 3.75 KB entries):**1,109 MB/s (implied server time: ~0.83 s)**Throughput at 7.5 GB (n=2048, 3.75 KB entries):**1,271 MB/s**Throughput at 1.4 GB (n=4096, 22.5 KB entries):**1,098 MB/s**Throughput at 11.3 GB (n=4096, 22.5 KB entries):**1,641 MB/s (highest throughput)**Query size:**16 KB (n=2048) or 64 KB (n=4096)**Response size:**13.5 KB (n=2048) or 57 KB (n=4096)**Key material (server-side):**0.63 MB (n=2048) or 2.9 MB (n=4096)**Response overhead:**2.53–3.6× relative to entry size**Hardware:**AWS EC2 c5n.9xlarge (Intel Xeon Platinum 8124M @ 3.00 GHz), 96 GB RAM

Note: OnionPIRv2's native entry sizes (3.75–22.5 KB) do not match the 256-byte hot-state target. The smallest benchmarked database is 0.9 GB. These factors limit direct comparison with Spiral, Respire, and SealPIR at 256 MB with 256-byte entries.

- 11× throughput improvement over the OnionPIR prototype (1,100–1,600 MB/s)
- Database-independent preprocessing — key material does not require regeneration on database updates
- Minimal server-side key material (0.63–2.9 MB) — substantially lower than schemes requiring large offline setups
- Throughput scales favorably with database size (1,109 MB/s at 0.9 GB to 1,641 MB/s at 11.3 GB)

- Paper provides no analysis of database update scenarios — hot-state applicability is uncharacterized
- Throughput-only reporting (no per-query server time) limits direct latency comparison with other schemes
- Native entry sizes (3.75–22.5 KB) do not match 256-byte hot-state target — communication rates are not comparable
- Smallest benchmarked database (0.9 GB) is larger than the 256–512 MB primary hot-state range
- No batch query support described

**Schemes:** YPIR, VIA

YPIR and VIA represent a new class of schemes that achieve server-side preprocessing without requiring any offline communication to the client. Both were published in 2024–2025 and target high throughput through LWE/RLWE-based constructions. Both share a key limitation for hot-state analysis: their primary benchmarks use single-bit record retrieval rather than the 32–256 byte entries required for Ethereum hot-state. Neither paper describes an incremental update mechanism; both follow the full-rebuild model for preprocessing.

**Year:** 2024
**Authors:** Samir Jordan Menon, David J. Wu (same authors as Spiral)

YPIR extends SimplePIR with a silent preprocessing approach: the server computes the database-dependent hint locally without sending it to the client. In SimplePIR, the client downloads a 121–724 MB offline hint that must be refreshed after any database update. YPIR eliminates this client-side hint entirely by embedding hint computation into the server's query-processing pipeline. The trade-off is a larger query size: the client transmits key-switching parameters (approximately 462 KB of public key material) at query time. LWE-to-RLWE packing reduces the response to 12 KB regardless of database size.

The scheme inherits SimplePIR's folded hypercube database structure and LWE-based query protocol, adding an LWE-to-RLWE packing transformation that achieves 7.8–12.1 GB/s server throughput at 1–32 GB database sizes.

**LWE (Learning with Errors)**— SimplePIR subprotocol underlying the query structure (Section 2)**RLWE (Ring Learning with Errors)**— LWE-to-RLWE packing transformation for response compression (Section 3)

Single-server. Server-side preprocessing computes the database-dependent hint locally (silent preprocessing). Query processing involves LWE-to-RLWE packing to produce the response. Server computation scales with database size; throughput increases with database size due to memory bandwidth saturation effects.

**Type:**Server-side silent preprocessing (database-dependent hint precomputation, server-only)**Offline communication:**None — no hint download to client**Reusability:**Preprocessing is database-dependent and must be rerun on any database change; client is unaffected (no client-side hint to refresh)**Rebuild required:**Yes — full rerun of silent preprocessing on any database update

YPIR does not describe an incremental update mechanism. The update model is full-rebuild: any database change requires the server to rerun the entire silent preprocessing phase (hint recomputation). Because the client stores zero bytes, there is no client-side rebuild action — the server rebuilds independently, and the client can immediately issue new queries without any re-setup.

Silent preprocessing makes YPIR's update model more favorable than SimplePIR's for client-side management: after a database update, clients do not need to download a new hint. The server absorbs the full preprocessing cost. At 1 GB, the server preprocessing throughput of 39 MB/s implies approximately 26 seconds of rebuild time — exceeding Ethereum's 12-second block time. At hot-state sizes (256–512 MB), the derived preprocessing time is approximately 6.6–13 seconds, placing small databases at the boundary of the low-cost tier.

**Client-Side Rebuild Requirement:** None — YPIR stores 0 bytes client-side; client requires no action after database update.

Rebuild times are derived from the preprocessing throughput column of YPIR Table 2; they are approximated rather than directly benchmarked:

**1 GB database:**~26 s (1 GB / 39 MB/s preprocessing throughput) —**medium tier**(> 12 s threshold)**8 GB database:**~174 s (8 GB / 46 MB/s)**32 GB database:**~667 s (32 GB / 48 MB/s)

Extrapolated to hot-state sizes (not in paper):

**~256 MB:**~6.6 s (extrapolated — low tier, but preprocessing throughput at sub-1 GB sizes is not reported and may differ)**~512 MB:**~13 s (extrapolated — borderline medium tier)

These extrapolated values follow the paper's reported preprocessing throughput and are approximations. Update cost tier at 1 GB: **medium**.

Clients store 0 bytes of persistent state — YPIR is client-light by design. There is no offline hint requiring refresh. After a database update, the server reruns preprocessing autonomously; clients can immediately query without any re-setup or re-download. This is a significant improvement over SimplePIR, which would require re-downloading 121 MB after each database update.

Benchmarks from YPIR paper Table 2 (page 20). Hardware: Amazon EC2 r6i.16xlarge (Intel Xeon Platinum 8375C @ 2.9 GHz), 512 GB RAM, single-threaded.

**Note:** All benchmarks are for 1-bit entry retrieval. YPIR does not benchmark 32–256 byte entries (the hot-state target range). Performance at 256-byte entries is unknown.

| DB Size | Server Time | Throughput | Query Size | Response Size | Prep. Throughput |
|---|---|---|---|---|---|
| 1 GB | 129 ms | 7.8 GB/s | 846 KB | 12 KB | 39 MB/s (~26 s derived) |
| 8 GB | 687 ms | 11.6 GB/s | 1.5 MB | 12 KB | 46 MB/s (~174 s derived) |
| 32 GB | 2.64 s | 12.1 GB/s | 2.5 MB | 12 KB | 48 MB/s (~667 s derived) |

Query sizes include key-switching parameters (pk ≈ 462 KB) transmitted at query time. Response size is constant at 12 KB due to LWE-to-RLWE packing.

Cross-client batching provides a 1.3× effective throughput improvement at batch size 4, amortizing the LWE-to-RLWE packing cost across clients (Section 4.3).

- Silent preprocessing eliminates offline hint download — client-light design with 0 bytes stored client-side
- After database updates, clients require no hint refresh; server rebuilds autonomously
- Highest single-threaded throughput of any scheme at 1–32 GB: 7.8–12.1 GB/s
- Cross-client batching support (1.3× throughput at batch size 4)
- YPIR's incremental preprocessing mechanism (iSimplePIR) is applicable to this scheme — see Group 5

- Entry size mismatch: benchmarks are for 1-bit records; 256-byte entry performance is unknown
- Preprocessing rebuild time ~26 s at 1 GB exceeds Ethereum's 12-second block time (medium tier)
- Large query size (846 KB at 1 GB) due to key-switching parameters transmitted per query
- Preprocessing throughput at 256–512 MB is not reported; hot-state extrapolations carry uncertainty
- Full-rebuild model — no incremental update mechanism in YPIR itself (but iSimplePIR mechanism is applicable)

**Year:** 2025
**Authors:** Chenyang Liu, Xukun Wang, Zhifang Zhang (AMSS, Chinese Academy of Sciences)

VIA achieves O(log N) online communication complexity — response size is polylogarithmic in database size — without requiring any offline communication in its base variant. The construction uses a DMux-CMux (demultiplexer/conditional multiplexer) framework over RLWE ring elements, with LWE-to-RLWE conversion for the final response. This produces a server-side offline computation phase that prepares the database for queries, followed by a fast online phase.

VIA has two distinct variants with fundamentally different communication profiles:

**VIA (no offline communication):**The base variant transmits no offline hint to the client. Query sizes are 473–675 KB (growing logarithmically with database size). Online response is 15.5 KB (fixed).**VIA-C (with 14.8 MB offline communication):**The VIA-C variant adds a fixed 14.8 MB offline hint — constant regardless of database size — that dramatically reduces query size to under 1 KB. The fixed hint size suggests the hint encodes query-parameter information rather than database content.

The separation of these variants is critical for analysis: they have completely different communication profiles and tradeoffs.

**RLWE (Ring Learning with Errors)**— DMux-CMux framework (Section 1.1)**LWE (Learning with Errors)**— LWE-to-RLWE conversion used in the construction (Section 1.1)

Single-server. Server-side preprocessing (offline computation) is database-dependent and prepares the database for online query processing. The online phase processes client queries against the preprocessed database. VIA's offline computation at 1 GB (1.06 s) is below the Ethereum 12-second block time threshold — the only scheme in this analysis to achieve this at 1 GB scale.

**VIA variant:**Server-side offline computation (database-dependent); no offline communication to client**VIA-C variant:**Server-side offline computation; 14.8 MB fixed offline hint sent to client**Rebuild required:**Yes — any database change requires rerunning offline computation**Reusability:**VIA-C's 14.8 MB offline hint is fixed-size and does not require refresh after database updates (it encodes query-parameter information, not database content)

VIA does not describe an incremental update mechanism. The paper does not address database mutations explicitly. The update model is full-rebuild: any database change requires rerunning the offline computation phase.

For the VIA (no-offline) variant: after a database update, the server reruns offline computation (1.06 s at 1 GB), and the client requires no action — there is no offline hint to refresh.

For the VIA-C variant: the 14.8 MB offline hint is fixed and does not need to be re-downloaded after database updates. The hint encodes query-parameter structure, not database content. Only the server's offline computation is repeated on updates (2.09 s at 1 GB).

**Client-Side Rebuild Requirement:** VIA — no client action (0 bytes stored). VIA-C — offline hint does not require refresh after database updates (hint is query-parameter-dependent, not database-content-dependent).

**VIA (no-offline)** — offline computation times from Table 1 (page 18, 2025-2074.pdf), interpreted as database preprocessing/rebuild cost:

**1 GB database:****1.06 s**—**low tier**(below Ethereum 12-second block time threshold)**4 GB database:**4.195 s —**low tier****32 GB database:**33.34 s —**medium tier**(> 12 s threshold)

VIA at 1 GB is the only scheme in this analysis with a measured update-equivalent cost below the 12-second Ethereum block time threshold. This makes VIA architecturally the most promising for Ethereum hot-state update compatibility at 1 GB scale, subject to the entry size caveat below.

**VIA-C (with-offline)** — offline computation times:

**1 GB database:**2.09 s —**low tier****4 GB database:**7.786 s —**low tier****32 GB database:**67.539 s —**medium tier**

**VIA:**Clients store 0 bytes — no offline hint. After database update, server reruns offline computation; client can immediately query without re-setup.**VIA-C:**Clients store 14.8 MB fixed offline hint. After database update, the hint does NOT need to be re-downloaded — the fixed size and query-parameter nature of the hint means it remains valid across database content changes. Only the server's offline computation is repeated.

Benchmarks from VIA paper Table 1 (page 18, 2025-2074.pdf). Hardware: AMD Ryzen 9 9950X, 128 GB RAM, single-threaded.

**Note:** All benchmarks are for 1-bit entry retrieval. VIA does not benchmark 32–256 byte entries. Performance at 256-byte hot-state entries is unknown.

**VIA (no offline communication):**

| DB Size | Offline Comp | Online Time | Throughput | Query Size | Response Size |
|---|---|---|---|---|---|
| 1 GB | 1.06 s | 0.442 s | 2.26 GB/s | 473.1 KB | 15.5 KB |
| 4 GB | 4.195 s | 1.361 s | 2.94 GB/s | 587.1 KB | 15.5 KB |
| 32 GB | 33.34 s | 10.286 s | 3.11 GB/s | 674.75 KB | 15.5 KB |

**VIA-C (14.8 MB offline communication):**

| DB Size | Offline Comm | Offline Comp | Online Time | Throughput | Query Size | Response Size |
|---|---|---|---|---|---|---|
| 1 GB | 14.8 MB | 2.09 s | 0.83 s | 1.2 GB/s | 0.568 KB | 1.439 KB |
| 4 GB | 14.8 MB | 7.786 s | 2.777 s | 1.44 GB/s | 0.604 KB | 1.439 KB |
| 32 GB | 14.8 MB | 67.539 s | 20.307 s | 1.58 GB/s | 0.659 KB | 1.439 KB |

VIA-C's offline communication is fixed at 14.8 MB regardless of database size. VIA's query sizes grow logarithmically (473 KB at 1 GB to 675 KB at 32 GB), consistent with the O(log N) communication bound.

- VIA at 1 GB achieves 1.06 s offline computation — the only scheme in this analysis below the 12-second Ethereum block time threshold at 1 GB scale
- Client-light design (VIA variant): 0 bytes stored client-side; no hint refresh required
- VIA-C's 14.8 MB offline hint is fixed-size and does not require refresh after database updates
- O(log N) online communication complexity — response size grows sub-linearly with database size
- VIA-C variant offers sub-kilobyte query sizes (0.568 KB at 1 GB)
- Both variants benefit from fast offline recomputation at practical database sizes

- Entry size mismatch: benchmarks are for 1-bit records; 256-byte entry performance is unknown — the low-cost tier finding at 1 GB applies only to the benchmarked entry size
- Online throughput (2.26–3.11 GB/s) is lower than YPIR (7.8–12.1 GB/s) and Spiral-family schemes
- VIA (no-offline) query sizes are large: 473–675 KB, comparable to YPIR; VIA-C requires 14.8 MB offline setup
- Hardware difference (AMD Ryzen 9 9950X) from Intel-based schemes limits direct throughput comparison
- No incremental update mechanism — full offline recomputation required for each database update

**Scheme:** iSimplePIR

iSimplePIR is the only scheme in this analysis with formal support for incremental preprocessing updates. Rather than requiring a full server-side rebuild for every database change, iSimplePIR recomputes only the preprocessing segments corresponding to modified database entries. The scheme inherits SimplePIR's online query protocol and throughput but adds a new incremental update mechanism as its primary contribution. It carries SimplePIR's offline hint requirement (121 MB at 1 GB), making it distinct from the client-light schemes in Groups 1–4.

**Year:** 2026
**Authors:** Pengfei Lu, Guangwu Xu, Zengpeng Li, Mei Wang, Haoyu Cui (Shandong University)

iSimplePIR extends SimplePIR with entry-level incremental preprocessing — the first formal definition of single-server incremental PIR. The online query protocol is identical to SimplePIR: the server responds to an LWE-based query vector using a precomputed hint matrix. iSimplePIR's contribution is the mechanism by which that hint matrix is updated: instead of recomputing the entire hint on every database change, iSimplePIR recomputes only the affected hint segments corresponding to modified entries.

The scheme introduces two orthogonal design axes:

**Update granularity:**Entry-level (individual database entries) or row-level (entire database rows). Entry-level provides finer granularity and is generally preferred.**Storage layout:**Row-major or column-major. Row-major layout minimizes offline communication per update; column-major minimizes offline computation but produces dramatically higher communication in the row-level variant.

SimplePIR's offline hint (121 MB for a 1 GB database) is retained: the initial download requirement is unchanged. iSimplePIR's benefit is in reducing the per-update hint refresh from a full 121 MB re-download to a small incremental delta (1.26 MB for 1% row-major update of 1 GB).

**LWE (Learning with Errors)**— inherited from SimplePIR (Section 2); all query and preprocessing operations use LWE hardness

Single-server. Server-side preprocessing generates a hint matrix from the database. On database updates, only the hint segments corresponding to modified entries are recomputed (incremental preprocessing). Online query processing is identical to SimplePIR.

**Type:**Server-side LWE hint matrix generation (database-dependent) + client offline hint download**Offline communication:**121 MB initial hint download (inherited from SimplePIR for 1 GB database; scales linearly with database size); incremental updates require only 1.26 MB per 1% row-major update**Reusability:**Initial hint is valid until the database changes; incremental updates refresh only the modified portions**Rebuild required:**Incremental for typical updates; full rebuild (121 MB re-download) only for complete database replacement or initial setup

**Important:** iSimplePIR is **NOT client-light**. The 121 MB offline hint is a persistent client-side requirement. This is a critical distinction from YPIR, VIA, and all other groups in this analysis, where clients store 0 bytes of offline state.

iSimplePIR decomposes SimplePIR's hint matrix into segments corresponding to individual database entries (entry-level) or rows (row-level). When database entries are modified, only the hint segments for those entries are recomputed server-side and re-sent to the client.

**Update granularity:**

**Entry-level**(preferred): Updates hint segments for each modified entry independently. Finer granularity minimizes recomputation scope.**Row-level**: Updates entire rows of the hint matrix. Equivalent to entry-level for row-major storage, but catastrophically expensive for column-major storage (the row-level variant must traverse non-contiguous memory when rows are stored in column-major order).

**Storage layout effect:**

**Row-major**: Database entries within a row are stored contiguously. Row-level and entry-level have comparable cost. Offline communication is minimal (1.26 MB per 1% update).**Column-major**: Database entries within a column are stored contiguously. Entry-level remains manageable (0.77 s, 28.50 MB), but row-level becomes pathological: each row's entries are scattered across all columns, requiring 172.45 s offline computation and 120.75 MB communication for 1% update.

**Full benchmark table** from Table 2 (page 18, 2026-030.pdf). Scenario: 1% of a 1 GB database modified. Hardware: Intel i7 @ 3.3 GHz, 16 GB RAM.

| Variant | Storage | Offline Comp | Offline Comm | Online Comm | Server Comp | Throughput |
|---|---|---|---|---|---|---|
| Entry-level | Row-major | 1.70 s | 1.26 MB | 240 KB | 94.62 ms | 10.6 GB/s |
| Entry-level | Col-major | 0.77 s | 28.50 MB | 240 KB | 95.63 ms | 10.5 GB/s |
| Row-level | Row-major | 1.77 s | 1.26 MB | 241 KB | 95.73 ms | 10.4 GB/s |
| Row-level | Col-major | 172.45 s | 120.75 MB | — | — | — |

Row-major + entry-level is the preferred configuration for Ethereum hot-state: 1.70 s offline computation and 1.26 MB offline communication per 1% update of 1 GB. This falls within the low-cost tier (below 12 s Ethereum block time).

Column-major + entry-level achieves 0.77 s offline computation (the fastest of any variant) but requires 28.50 MB incremental communication — which may be relevant when Ethereum's state trie updates are distributed across the address space (column-major-like distribution in a sorted key-value database).

Row-level + column-major is pathological and should not be used: 172.45 s offline computation for a 1% update renders it unusable for any latency-sensitive application.

iSimplePIR's incremental mechanism applies specifically to schemes sharing SimplePIR's LWE hint matrix structure. The paper explicitly identifies applicable schemes (Abstract and Section 1).

**Directly applicable (per paper):**

- SimplePIR (self)
- DoublePIR
**YPIR**— LWE-based preprocessing structure compatible with iSimplePIR's incremental mechanism; see Group 4- APIR (Authenticated PIR)
- VeriSimplePIR

**Not applicable — different preprocessing architecture:**

- SealPIR (BFV ciphertext-plaintext multiplication; NTT-based encoding, not LWE hint matrix)
- MulPIR (BFV with multiplicative homomorphism; same encoding architecture as SealPIR)
- OnionPIR (BFV + RGSW external products; different preprocessing structure)
- Spiral (GSW composition with Regev ciphertexts; hypercube encoding is not an LWE hint matrix)
- Respire (RLWE subring embedding; NTT packing, not LWE hint matrix)
- OnionPIRv2 (BFV + RGSW; key-material-only preprocessing — no hint matrix to update incrementally)
- Pirouette (FHE evaluation keys; circuit topology rather than database-content hint)
- NPIR (NTRU-based polynomial matrix; different hardness assumption and preprocessing structure)

**Uncertain — different preprocessing structure:**

- VIA (RLWE + DMux-CMux + LWE-to-RLWE conversion; uses LWE-based components but the DMux-CMux framework has a different offline computation structure than SimplePIR's hint matrix; applicability requires further analysis)

The most architecturally significant implication is that YPIR — already the highest-throughput scheme in this analysis — could theoretically support iSimplePIR's incremental update mechanism, combining YPIR's silent preprocessing (no client hint download) with iSimplePIR's incremental per-update approach. This possibility is noted here as a theoretical combination; no implementation or joint benchmark exists.

**iSimplePIR requires a 121 MB offline hint for a 1 GB database** (inherited from SimplePIR). This is not eliminated by the incremental mechanism — it is a persistent client-side requirement that scales linearly with database size:

- 1 GB database: 121 MB initial hint (from YPIR paper Table 2 SimplePIR reference)
- 8 GB database: ~362 MB initial hint
- 32 GB database: ~724 MB initial hint

The incremental mechanism updates this hint efficiently for small mutations (1.26 MB re-download per 1% row-major update of 1 GB instead of 121 MB), but the initial hint download is unavoidable for new clients or complete database replacements.

This makes iSimplePIR the only scheme in Groups 1–5 that is **not** client-light. All other eleven schemes store either 0 bytes (most schemes) or a fixed-size parameter set (VIA-C: 14.8 MB, Respire: 3.9 MB, OnionPIRv2: 0.63–2.9 MB). iSimplePIR's 121 MB hint is a significant drawback for resource-constrained clients.

For incremental updates (the primary use case):

**Entry-level row-major, 1% update of 1 GB:**1.70 s offline computation, 1.26 MB incremental communication —**low tier****Entry-level col-major, 1% update of 1 GB:**0.77 s offline computation, 28.50 MB —**low tier**(compute)**Row-level row-major, 1% update of 1 GB:**1.77 s offline computation, 1.26 MB —**low tier****Row-level col-major, 1% update of 1 GB:**172.45 s offline computation —**high tier**(avoid)

For full rebuild (initial setup or complete database replacement):

SimplePIR full preprocessing throughput is approximately 3.7 MB/s at 1 GB (per YPIR paper Table 2 SimplePIR comparison column). Full rebuild: ~1 GB / 3.7 MB/s ≈ **270 s** — high tier. The incremental path is strongly preferred for hot-state deployments where only a small fraction of entries change per block.

Online query performance is inherited from SimplePIR. Benchmarks from iSimplePIR Table 2 (page 18, 2026-030.pdf). Hardware: Intel i7 @ 3.3 GHz, 16 GB RAM — notably slower hardware than most other schemes.

| Metric | Value |
|---|---|
| Server computation at 1 GB | ~95 ms |
| Throughput at 1 GB | ~10.5 GB/s (inherited from SimplePIR) |
| Online communication | 240 KB |
| Entry size | 1-bit (primary benchmarks) |

Note: The ~10 GB/s throughput is SimplePIR's protocol performance on a slower test machine. YPIR paper reports SimplePIR at ~13.6 GB/s on EC2 hardware. The online protocol is iSimplePIR's unchanged baseline, not a unique contribution.

iSimplePIR is the only scheme in this analysis with formal incremental update support. For small, frequent mutations (1–10% of entries per Ethereum block), the incremental update cost is sub-second to low-seconds — below Ethereum's 12-second block time threshold in the preferred entry-level row-major configuration. For large mutations or initial setup, the scheme falls back to SimplePIR's full preprocessing, which takes approximately 270 s at 1 GB.

The key tension for Ethereum hot-state deployment:

**Update frequency advantage:**iSimplePIR's incremental mechanism is the most targeted solution to the update cost problem — it directly addresses why full-rebuild PIR schemes are expensive for frequently-updating databases.**Client hint disadvantage:**The 121 MB offline hint is a significant drawback for resource-constrained clients or scenarios where hint maintenance across client devices is operationally complex.**Entry size mismatch:**Like YPIR and VIA, primary benchmarks use 1-bit entries. Performance at 256-byte hot-state entries is not benchmarked.**YPIR combination potential:**iSimplePIR's mechanism is applicable to YPIR (per paper). A YPIR-based incremental PIR would combine YPIR's silent preprocessing (no client hint) with iSimplePIR's incremental update capability — but this combination has no existing implementation or benchmark.

- Only scheme with formal incremental update support — incremental update times of 0.77–1.77 s for 1% update of 1 GB (low tier)
- Incremental hint re-download (1.26 MB per 1% update) vs. full 121 MB re-download — substantial bandwidth reduction for high-update-frequency deployments
- Inherits SimplePIR's high online throughput (~10 GB/s) without modification
- Incremental mechanism is applicable to YPIR, potentially enabling a hint-free incremental PIR

- Requires 121 MB offline hint (initial SimplePIR inheritance) — NOT client-light; the only offline-hint scheme in this analysis
- Full rebuild cost (~270 s at 1 GB) is higher than all other schemes due to SimplePIR's low preprocessing throughput (3.7 MB/s)
- Entry size mismatch: benchmarks use 1-bit entries; 256-byte hot-state performance is unknown
- Row-level col-major variant is pathological (172.45 s for 1% update) and must be avoided
- Hardware gap: benchmarked on slower Intel i7 vs. EC2/Xeon hardware used by most other schemes

**Scheme:** Pirouette

Pirouette is architecturally distinct from all other schemes in this comparison. It minimizes per-query client-to-server communication (36 bytes) at the cost of a substantial one-time offline setup (1.2 GB evaluation key download). No update mechanism is described.

**Year:** 2025
**Authors:** Jiayi Kang, Leonard Schild

Pirouette builds on the T-Respire transciphering approach and introduces a v-bit RLWE selector construction for efficient homomorphic bit decomposition. The database is organized as a hypercube structure with polynomial rings, supporting databases of up to 2^25 records. The key innovation is extracting LWE inputs from RLWE ciphertexts using the novel v-bit selector, which allows the client query to be compressed to 36 bytes — the smallest of any scheme in this comparison. The tradeoff is a 1.2 GB offline evaluation key download that clients must complete before issuing any queries. PirouetteH is a variant using high-precision decomposition that achieves 55–60-byte queries with a smaller 650 MB offline setup.

**FHE (Fully Homomorphic Encryption)**— for homomorphic evaluation**LWE (Learning with Errors)**— for query structure and LWE secret key**RLWE (Ring Learning with Errors)**— for ring-based efficiency improvements

Single-server. Server performs database encoding during setup, and evaluation key generation is included in the offline phase. Query processing involves the two-phase structure described in the paper.

**Type:**Server-side database encoding with one-time client download of evaluation keys**Offline communication:**1.2 GB (evaluation keys, one-time downloaded by client)**Reusability:**Once downloaded, evaluation keys are reusable across subsequent queries — the 1.2 GB download is a one-time initialization cost, not per-query**Rebuild required:**Whether evaluation keys must be re-downloaded after database updates is not specified in the paper

Pirouette does not describe a database update mechanism. The paper contains no sections addressing database mutations, incremental updates, or what happens when the database changes after the offline setup is complete. The `update_type`

is classified as `full-rebuild`

— based on architectural analysis that Pirouette's hypercube polynomial packing encodes database content and must be re-run on any database change.

The most significant hot-state concern for Pirouette is whether the 1.2 GB offline evaluation key download must be repeated after database updates. The 1.2 GB evaluation keys encode the homomorphic circuit structure for database retrieval, including the v-bit RLWE selector construction used for homomorphic bit decomposition. If these keys encode only the PIR circuit topology — the number of levels, slot rotation structure, and decomposition parameters — they are database-independent and would survive content changes, analogous to Spiral's query-independent public parameters. If, however, they encode database-specific constants such as packed database elements baked into the circuit or database-size-dependent parameterization, then each database update would require regenerating and re-downloading the full 1.2 GB. The paper's description of "server-side database encoding with one-time client download of evaluation keys" is ambiguous on this distinction. Even if client evaluation keys survive database updates, the server must re-encode the underlying database for each update — the server-side preprocessing cost (not benchmarked in the paper) is the true bottleneck, independent of the client key refresh question.

**Client-Side Rebuild Requirement:** Unknown — 1.2 GB evaluation keys may or may not need re-download after DB rebuild; paper is ambiguous on whether keys encode database content or only circuit topology.

No update timing data available. The paper does not benchmark preprocessing time as an update cost, and no rebuild scenario is described. Update cost tier: **unknown** (full-rebuild classification based on architectural inference; no measured rebuild cost available).

Clients store 0 bytes of per-query state — each query uses a 32-byte LWE secret key s that is ephemeral. However, the 1.2 GB offline evaluation key download, while classified as one-time, raises a refresh question: if database updates invalidate the evaluation keys, clients would need to re-download 1.2 GB per update cycle. The paper does not address this. Per-query client state: 0 bytes (client-light). One-time setup: 1.2 GB offline download.

Benchmarks from Pirouette paper Table 7.

**Standard Pirouette (single-threaded):**

**Server time at 244 MB (2^20 × 256B):**19 s**Server time at 977 MB (2^22 × 256B):**26 s**Server time at 7.8 GB (2^25 × 256B):**60 s**Query size:**36 B (constant across database sizes)**Response size:**2 KB**Total online communication at 244 MB:**2.036 KB (36 B query + 2 KB response)**Offline communication:**1.2 GB (one-time evaluation key download)**Communication rate at 256B entries (244 MB actual):**8.14

**Parallelized variants (32 cores, Table 7):**

- Phase 0 parallelized: 8 s at 244 MB, 12 s at 977 MB
- Fully parallelized: 7 s at 244 MB, 9 s at 977 MB, 14 s at 7.8 GB

**PirouetteH variant (single-threaded):**

**Server time at 244 MB:**15 s | Query: 55 B | Offline: 650 MB**Server time at 977 MB:**21 s | Query: 57 B | Offline: 650 MB**Hardware:**Intel Xeon Gold 6248R @ 3.0 GHz (single-threaded); 32-core variant (parallelized)

Pirouette achieves the smallest query size of any scheme: 36 bytes, compared to 4.1 KB (Respire), 14 KB (Spiral), and 61.4 KB (SealPIR). Total online communication (2.036 KB) is the lowest of any scheme with 256B entry data. The tradeoff is the 1.2 GB one-time offline setup and server response times of 19–26 s (single-threaded) that are higher than Spiral (1.69 s) and Respire (1.26 s) at comparable database sizes.

- Smallest query size of any scheme: 36 bytes — 420× smaller than Respire, orders of magnitude smaller than SealPIR and Spiral
- Lowest total online communication of any scheme at 256B entries: 2.036 KB at 244 MB
- Client-light per-query design: 0 bytes of per-query state after initial setup
- Fully parallelized variant achieves 7–14 s server times — competitive when parallelism is available
- PirouetteH variant achieves 650 MB offline setup (vs. 1.2 GB) with only slightly larger queries (55–60 B)

- 1.2 GB one-time offline evaluation key download — the largest offline setup cost of any scheme (Respire: 3.9 MB; OnionPIRv2: 0.63–2.9 MB)
- No update mechanism described — hot-state feasibility uncharacterized; unclear if 1.2 GB setup must be repeated after database updates
- Single-threaded server time (19–26 s at 244 MB–977 MB) is higher than Spiral (1.69 s) and Respire (1.26 s) at comparable sizes
- No batch query support (single-client or cross-client)
- Optimized for small records (256 bytes); large record support not benchmarked

The table below provides a compact comparison across all eleven schemes on the dimensions most relevant to hot-state deployment. For the full benchmark data and analysis, see the [main comparison document](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-comparison.md).

| Scheme | Year | Group | Update Type | Rebuild Time | Offline Comm | Online Comm (256B, ~256 MB) | Server Time (~256 MB) | Client Rebuild Action |
|---|---|---|---|---|---|---|---|---|
| SealPIR | 2017 | Full-Rebuild | full-rebuild | unknown | 0 | ~368 KB (288B entries) | 2.01–3.52 s | none |
| MulPIR | 2019 | Full-Rebuild | full-rebuild | unknown | 0 | no 256 MB data | 3.91 s (at 1.44 MB) | none |
| OnionPIR | 2021 | Full-Rebuild | full-rebuild | stateless: 0; stateful: not benchmarked | 0 | no 256B data | 400.9 s (at ~30 MB, stateless) | none (stateless) / discard hints (stateful) |
| Spiral | 2022 | Full-Rebuild | full-rebuild | unknown | 0 | 35 KB (256B entries, 268 MB) | 1.69 s | none |
| Respire | 2024 | Measured Rebuild | full-rebuild | 16.8 s (256 MB) |
3.9 MB | 6.1 KB (256B, 250 MB) | 1.26 s | none |
| YPIR | 2024 | Silent Preprocessing | full-rebuild | ~26 s derived (1 GB, 1-bit) | 0 | no 256B data | 129 ms (1 GB, 1-bit) | none |
| NPIR | 2025 | Measured Rebuild | full-rebuild | 13.32 s proxy (1 GB, 32KB) | 0 | no 256B data | 5.84 s (at 1 GB) | none |
| OnionPIRv2 | 2025 | Inferred Full-Rebuild | full-rebuild | N/A (DB-independent preproc) | 0.63–2.9 MB | no 256B data | N/A (throughput-only) | none |
| Pirouette | 2025 | Query-Minimizing | full-rebuild | not benchmarked | 1.2 GB | 2.036 KB (256B, 244 MB) | 19 s | unknown |
| VIA | 2025 | Silent Preprocessing | full-rebuild | 1.06 s (1 GB, 1-bit) |
0 / 14.8 MB | no 256B data | 0.442 s (1 GB, 1-bit) | none |
| iSimplePIR | 2026 | Incremental Update | incremental | 1.70 s per 1% update (1 GB, incremental) | 121 MB initial | no 256B data | 94.62 ms (1 GB, 1-bit) | incremental hint update (1.26 MB per 1%) |

**Hot-state update cost tiers:**

**Low (≤ 12 s):**VIA (1.06 s at 1 GB, 1-bit entries); iSimplePIR incremental (1.70 s per 1% update, 1 GB)**Medium (≤ 120 s):**Respire (16.8 s at 256 MB), NPIR (13.32 s at 1 GB proxy), YPIR (~26 s derived at 1 GB)**Unknown:**SealPIR, MulPIR, OnionPIR, Spiral, Pirouette**Not benchmarked (DB-independent preprocessing):**OnionPIRv2 — preprocessing does not require rebuild on database updates

Note: VIA and iSimplePIR low-tier figures are for 1-bit entry benchmarks. Performance at 256-byte hot-state entry sizes is not benchmarked for either scheme. VIA's low-tier finding is the most analytically significant result in the expanded analysis — it is the only measured full-rebuild cost below the 12-second Ethereum block time threshold.

**Key data gaps:** MulPIR has no 256 MB benchmark; OnionPIR has no 256B entry benchmark; OnionPIRv2 has no server-time data and no 256B entry data; NPIR has no 256B entry data; rebuild times are unknown for SealPIR, Spiral, OnionPIR (stateful), MulPIR, and Pirouette; YPIR, VIA, and iSimplePIR have no 256B entry benchmarks — all three new schemes are benchmarked exclusively at 1-bit entry size.

For figures, scaling plots, and the full feature comparison table, see the [main comparison document](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-comparison.md) and the `../figures/static/`

directory.
