---
url: https://eprint.iacr.org/2022/949
title: One Server for the Price of Two: Simple and Fast Single-Server Private Information Retrieval
fetched_at: 2026-05-30T16:55:02
content_hash: sha1:40abf6a110c59bdacd0c26683e4de262b011eb02
extractor: trafilatura
---

#### Paper 2022/949

### One Server for the Price of Two: Simple and Fast Single-Server Private Information Retrieval

##### Abstract

We present SimplePIR, the fastest single-server private information retrieval scheme known to date. SimplePIR’s security holds under the learning-with-errors assumption. To answer a client’s query, the SimplePIR server performs fewer than one 32-bit multiplication and one 32-bit addition per database byte. SimplePIR achieves 10 GB/s/core server throughput, which approaches the memory bandwidth of the machine and the performance of the fastest two-server private-information-retrieval schemes (which require non-colluding servers). SimplePIR has relatively large communication costs: to make queries to a 1 GB database, the client must download a 121 MB "hint" about the database contents; thereafter, the client may make an unbounded number of queries, each requiring 242 KB of communication. We present a second single-server scheme, DoublePIR, that shrinks the hint to 16 MB at the cost of slightly higher per-query communication (345 KB) and slightly lower throughput (7.4 GB/s/core). Finally, we apply our new private-information-retrieval schemes, together with a novel data structure for approximate set membership, to the task of private auditing in Certificate Transparency. We achieve a strictly stronger notion of privacy than Google Chrome’s current approach with modest communication overheads: 16 MB of download per month, along with 150 bytes per TLS connection.

##### Metadata

- Available format(s)
-
[PDF](https://eprint.iacr.org/2022/949.pdf) - Category
[Cryptographic protocols](https://eprint.iacr.org/search?category=PROTOCOLS)- Publication info
- Published elsewhere. Major revision. USENIX Security Symposium 2023
- Keywords
[Private Information Retrieval](https://eprint.iacr.org/search?q=Private%20Information%20Retrieval)- Contact author(s)
- ahenz @ csail mit edu
- History
- 2024-11-09: last of 6 revisions
- 2022-07-22: received
[See all versions](https://eprint.iacr.org/archive/versions/2022/949)- Short URL
[https://ia.cr/2022/949](https://ia.cr/2022/949)- License

CC BY

**BibTeX**

@misc{cryptoeprint:2022/949, author = {Alexandra Henzinger and Matthew M. Hong and Henry Corrigan-Gibbs and Sarah Meiklejohn and Vinod Vaikuntanathan}, title = {One Server for the Price of Two: Simple and Fast Single-Server Private Information Retrieval}, howpublished = {Cryptology {ePrint} Archive, Paper 2022/949}, year = {2022}, url = {https://eprint.iacr.org/2022/949} }
