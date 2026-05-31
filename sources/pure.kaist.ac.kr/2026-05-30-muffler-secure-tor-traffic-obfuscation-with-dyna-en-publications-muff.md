---
url: https://pure.kaist.ac.kr/en/publications/muffler-secure-tor-traffic-obfuscation-with-dynamic-connection-sh-2
title: MUFFLER: Secure Tor Traffic Obfuscation with Dynamic Connection Shuffling and Splitting
fetched_at: 2026-05-30T20:42:20
content_hash: sha1:5a7c04562a144f0a68cdf9d873138699318964a7
extractor: trafilatura
---

## Abstract

Tor, a widely utilized privacy network, enables anonymous communication but is vulnerable to flow correlation attacks that deanonymize users by correlating traffic patterns from Tor's ingress and egress segments. Various defenses have been developed to mitigate these attacks; however, they have two critical limitations: (i) significant network overhead during obfuscation and (ii) a lack of dynamic obfuscation for egress segments, exposing traffic patterns to adversaries. In response, we introduce MUFFLER, a novel connection-level traffic obfuscation system designed to secure Tor egress traffic. It dynamically maps real connections to a distinct set of virtual connections between the final Tor nodes and targeted services, either public or hidden. This approach creates egress traffic patterns fundamentally different from those at ingress segments without adding intentional padding bytes or timing delays. The mapping of real and virtual connections is adjusted in real-time based on ongoing network conditions, thwarting adversaries' efforts to detect egress traffic patterns. Extensive evaluations show that MUFFLER mitigates powerful correlation attacks with a TPR of 1% at an FPR of 10-2 while imposing only a 2.17% bandwidth overhead. Moreover, it achieves up to 27x lower latency overhead than existing solutions and seamlessly integrates with the current Tor architecture.

| Original language | English |
|---|---|
| Title of host publication | INFOCOM 2025 - IEEE Conference on Computer Communications |
| Publisher |
|

[2025 IEEE Conference on Computer Communications, INFOCOM 2025](https://pure.kaist.ac.kr)- London, United KingdomDuration: 19 May 2025 → 22 May 2025

### Publication series

| Name | Proceedings - IEEE INFOCOM |
|---|---|
| ISSN (Print) | 0743-166X |

### Conference

| Conference | 2025 IEEE Conference on Computer Communications, INFOCOM 2025 |
|---|---|
| Country/Territory | United Kingdom |
| City | London |
| Period | 19/05/25 → 22/05/25 |

## Fingerprint

Dive into the research topics of 'MUFFLER: Secure Tor Traffic Obfuscation with Dynamic Connection Shuffling and Splitting'. Together they form a unique fingerprint.## Cite this

- APA
- Author
- BIBTEX
- Harvard
- Standard
- RIS
- Vancouver
