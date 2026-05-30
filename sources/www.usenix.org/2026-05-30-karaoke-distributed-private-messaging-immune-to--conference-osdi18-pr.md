---
url: https://www.usenix.org/conference/osdi18/presentation/lazar
title: Karaoke: Distributed Private Messaging Immune to Passive Traffic Analysis
fetched_at: 2026-05-30T15:57:10
content_hash: sha1:f6022e2acfb51df7b31d9a70c6e5bd3efba48570
extractor: trafilatura
---

David Lazar, Yossi Gilad, and Nickolai Zeldovich, *MIT CSAIL*

Karaoke is a system for low-latency metadata-private communication. Karaoke provides differential privacy guarantees, and scales better with the number of users than prior such systems (Vuvuzela and Stadium). Karaoke achieves high performance by addressing two challenges faced by prior systems. The first is that differential privacy requires continuously adding noise messages, which leads to high overheads. Karaoke avoids this using optimistic indistinguishability: in the common case, Karaoke reveals no information to the adversary, and Karaoke clients can detect precisely when information may be revealed (thus requiring less noise). The second challenge lies in generating sufficient noise in a distributed system where some nodes may be malicious. Prior work either required each server to generate enough noise on its own, or used expensive verifiable shuffles to prevent any message loss. Karaoke achieves high performance using efficient noise verification, generating noise across many servers and using Bloom filters to efficiently check if any noise messages have been discarded. These techniques allow our prototype of Karaoke to achieve a latency of 6.8 seconds for 2M users. Overall, Karaoke's latency is 5x to 10x better than Vuvuzela and Stadium.

## Open Access Media

USENIX is committed to Open Access to the research presented at our events. Papers and proceedings are freely available to everyone once the event begins. Any video, audio, and/or slides that are posted after the event are also free and open to everyone. [Support USENIX](https://www.usenix.org/annual-fund) and our commitment to Open Access.

author = {David Lazar and Yossi Gilad and Nickolai Zeldovich},

title = {Karaoke: Distributed Private Messaging Immune to Passive Traffic Analysis},

booktitle = {13th USENIX Symposium on Operating Systems Design and Implementation (OSDI 18)},

year = {2018},

isbn = {978-1-939133-08-3},

address = {Carlsbad, CA},

pages = {711--725},

url = {https://www.usenix.org/conference/osdi18/presentation/lazar},

publisher = {USENIX Association},

month = oct

}
