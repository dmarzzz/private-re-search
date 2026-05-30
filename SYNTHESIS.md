# Research Syntheses — IP Anonymization for Search

## survey the full design space of IP anonymization for search: how do you query a search engine without revealing your IP address or linking queries to your identity? cover Tor and onion routing, VPNs and proxies, mixnets (Loopix), Oblivious HTTP (OHTTP) and relays, Private Information Retrieval (PIR) for search, anonymous/metadata-private search engines, Apple Private Relay, and trusted-proxy designs

_Run: `20260530-153935-survey-the-full-design-space-of-ip-anonymiza.json` · grounding 5/5_

# Survey of IP Anonymization Techniques for Search

When querying a search engine, users may wish to hide their IP address and prevent their queries from being linked to their identity. The design space for achieving this encompasses a range of network-layer and cryptographic approaches, each with distinct privacy, security, and usability trade-offs.

---

## 1. Tor and Onion Routing

**Mechanism:**  
Tor routes user traffic through a series of volunteer-operated relays (entry, middle, exit), encrypting data in layers ("onion" encryption). The entry node sees the user's IP but not the destination; the exit node sees the destination but not the user's IP. No single relay knows both ends of the connection.

**Privacy Properties:**
- The search engine sees only the exit node's IP, not the user's.
- No single entity can link the user's identity to their search queries.
- Tor Browser further minimizes tracking by clearing cookies and blocking plugins.

**Limitations:**
- Not immune to attacks if an adversary controls both entry and exit nodes.
- User identity can be compromised if personal info is provided to websites or files are opened outside Tor.
- Latency is higher than direct connections.

**References:**  
[https://support.torproject.org/faq/staying-anonymous/], [https://proxyscrape.com/blog/does-tor-hide-your-ip], [arXiv:2307.02429]

---

## 2. VPNs, Traditional Proxies, and Trusted-Proxy Designs (Apple Private Relay)

| Technology         | Privacy Properties                                                                 | Security Properties                                                              | Limitations & Risks                                                                 |
|--------------------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| **Traditional Proxy** | Hides client IP from destination; proxy sees all traffic; no encryption by default. | No end-to-end encryption; proxy can log or modify data. | Proxy operator can monitor/log/inject; no privacy from proxy; not suitable for sensitive data. |
| **VPN**            | Hides client IP from destination; VPN sees all traffic; encrypts traffic between client and VPN server. | Strong encryption; protects against local eavesdropping; VPN can log/monitor. | Trust is shifted to VPN; VPN can deanonymize; endpoint correlation attacks possible. |
| **Apple Private Relay** | Hides client IP from destination and (in theory) search provider; splits trust between Apple and partner; uses encryption and IP obfuscation. | Encrypts device-to-entry relay; entry knows user IP, exit knows destination; aims to prevent single party from linking both. | Requires trust in Apple/partners; not open source; only for some traffic (e.g., Safari); not Tor-level anonymity. |

**Key Points:**
- Proxies and VPNs hide your IP from the search engine, but the proxy/VPN provider can see your queries and potentially deanonymize you.
- Apple Private Relay splits trust between two parties, so no single entity can link user and destination, but trust is still required and coverage is limited.
- None of these solutions provide the strong unlinkability of Tor or mixnets.

**Research Gap:**  
There is a lack of peer-reviewed academic analysis of trusted-proxy designs (like Apple Private Relay) specifically for search query anonymization.

**References:**  
[https://stateofsurveillance.org/guides/basic/vpn-vs-tor-vs-proxy-which-do-you-need/], [https://nordvpn.com/blog/vpn-vs-proxy/], [https://www.fortinet.com/resources/cyberglossary/proxy-vs-vpn], [https://kinsta.com/blog/proxy-vs-vpn/], [https://geekflare.com/proxy/proxy-vs-vpn/], [https://www.scrapeless.com/en/blog/are-proxies-safe], [https://support.apple.com/en-us/HT212614]

---

## 3. Mixnets (Loopix)

**Mechanism:**  
Mixnets like Loopix use a network of relays that delay and mix messages, inject cover (dummy) traffic, and employ stratified topologies. Each message is delayed randomly (Poisson mixing), and cover traffic makes it hard to distinguish real queries from noise.

**Privacy Properties:**
- Strong IP and metadata privacy: adversaries cannot easily link queries to users or determine when users are active.
- Self-monitoring loops help detect active attacks.

**Trade-offs:**
- **Latency:** Message delivery is delayed by several seconds (vs. milliseconds for direct connections).
- **Scalability:** Throughput can be scaled by adding more relays, but practical limits exist (e.g., ~300 messages/sec per relay).
- **Overhead:** Additional bandwidth and processing for cover and loop traffic.

**References:**  
[arXiv:1703.00536], [arXiv:2406.06760]

---

## 4. Private Information Retrieval (PIR) for Search

**Mechanism:**  
PIR protocols allow users to retrieve data from a server without revealing which item they requested. This is achieved via homomorphic encryption or related cryptographic primitives, so the server processes encrypted queries.

**Privacy Properties:**
- In theory, the server cannot determine which query was made.

**Practical Challenges:**
- **Computation:** Many PIR protocols require the server to process the entire database for each query, which is prohibitive for web-scale search.
- **Communication:** Large bandwidth requirements for cryptographic material.
- **Scalability:** Difficult to scale to millions of queries and large datasets.
- **Privacy-utility tradeoff:** Some systems (e.g., Wally) relax privacy for scalability, using differential privacy rather than full obliviousness.
- **Preprocessing/state:** Some protocols require large precomputed states.

**Current Systems:**
- **Wally:** Scalable, uses differential privacy, but privacy degrades with fewer users.
- **Piano:** Fast (12ms/query on 100GB DB), requires preprocessing, provides full PIR.
- **Tiptoe/Spiral/OnionPIR:** Full PIR, but impractical for web-scale search due to overhead.

**Summary:**  
PIR enables strong query privacy in theory, but practical, large-scale deployment for web search remains an open challenge.

**References:**  
[https://www.cs.cmu.edu/~csd-phd-blog/2024/piano-private-information-retrieval/], [https://arxiv.org/html/2406.06761v4]

---

## 5. Anonymous/Metadata-Private Search Engines

Some search engines (e.g., DuckDuckGo, Startpage) claim not to log IP addresses or link queries to users, but users must trust their privacy policies. These do not provide cryptographic unlinkability and are not covered in depth in the sub-syntheses, but are worth mentioning as part of the design space.

---

## 6. Oblivious HTTP (OHTTP) and Relays

While not covered in detail in the sub-syntheses, OHTTP is a protocol where a relay forwards encrypted requests to the server, so the relay sees the client but not the content, and the server sees the content but not the client. This is similar in spirit to Apple Private Relay and trusted-proxy designs, with similar trust and metadata leakage considerations.

---

# Summary Table

| Approach              | Hides IP from Search Engine | Unlinks Queries from Identity | Trust Model                | Latency/Scalability    | Practicality for Web Search |
|-----------------------|----------------------------|------------------------------|----------------------------|------------------------|-----------------------------|
| Tor/Onion Routing     | Yes                        | Yes (unless entry/exit collude) | Distributed, open relays   | Moderate latency       | Widely used, robust         |
| VPN/Proxy             | Yes                        | No (provider can link)        | Centralized provider       | Low latency            | Widely used, trust required |
| Apple Private Relay   | Yes                        | Partial (split trust)         | Apple + partner relay      | Low latency            | Limited to Safari, etc.     |
| Mixnets (Loopix)      | Yes                        | Yes (strong metadata privacy) | Distributed relays         | Higher latency         | Research/deployment stage   |
| PIR                   | Yes                        | Yes (cryptographic)           | Cryptographic assumption   | High overhead          | Not yet practical at scale  |
| Metadata-private SEs  | Policy-based               | Policy-based                  | Search engine's honesty    | Low latency            | Practical, but trust needed |

---

# Contradictions and Research Gaps

- **Trusted-proxy designs** (Apple Private Relay) are less studied in the academic literature for search anonymization compared to Tor and mixnets.
- **PIR** offers the strongest theoretical privacy, but is not yet practical for large-scale web search.
- **Mixnets** provide strong unlinkability but at the cost of latency and bandwidth.
- **VPNs/proxies** are easy to use but require trust in the provider and do not unlink queries from user identity.

---

# Conclusion

A variety of techniques exist to anonymize search queries and hide user IP addresses, each with unique trade-offs in privacy, trust, latency, and scalability. Tor and mixnets provide strong unlinkability, but with higher latency. VPNs and proxies are convenient but require trust in the provider. Trusted-proxy designs like Apple Private Relay split trust, but are not as robust or transparent as Tor. PIR protocols promise cryptographic privacy but face significant practical hurdles for web-scale deployment. The choice of technique depends on the desired balance between privacy, trust, usability, and performance.

---

**References:**  
[https://support.torproject.org/faq/staying-anonymous/], [https://proxyscrape.com/blog/does-tor-hide-your-ip], [arXiv:2307.02429], [https://stateofsurveillance.org/guides/basic/vpn-vs-tor-vs-proxy-which-do-you-need/], [https://nordvpn.com/blog/vpn-vs-proxy/], [https://www.fortinet.com/resources/cyberglossary/proxy-vs-vpn], [https://kinsta.com/blog/proxy-vs-vpn/], [https://geekflare.com/proxy/proxy-vs-vpn/], [https://www.scrapeless.com/en/blog/are-proxies-safe], [https://support.apple.com/en-us/HT212614], [arXiv:1703.00536], [arXiv:2406.06760], [https://arxiv.org/html/2406.06761v4], [https://www.cs.cmu.edu/~csd-phd-blog/2024/piano-private-information-retrieval/]

**Coverage gaps flagged by self-critique:**
- Sphinx mixnet (for comparison with Loopix)
- Riposte (as a PIR/mixnet hybrid)
- Recent OHTTP deployments in production (e.g., Google’s OHTTP for Safe Browsing)
- More detail on the cryptographic underpinnings of OHTTP
- Mention of Oblivious DNS over HTTPS (ODoH) as a related protocol

---

## Oblivious HTTP (OHTTP) and oblivious relays for anonymizing web and search traffic: RFC 9458 architecture, key configuration, the split-trust relay+gateway model, real production deployments including Google Safe Browsing OHTTP, Cloudflare and Fastly relays, Apple Private Relay internals, and Oblivious DNS over HTTPS (ODoH). How do they hide client IP from the resource server?

_Run: `20260530-154633-oblivious-http-ohttp-and-oblivious-relays-fo.json` · grounding 5/5_

# Oblivious HTTP (OHTTP), Oblivious Relays, and Client IP Privacy

## OHTTP Architecture and RFC 9458

OHTTP, as defined in [RFC 9458](https://www.ietf.org/rfc/rfc9458.html), is designed to prevent resource servers from learning the client’s IP address by splitting the protocol into two distinct roles:

- **Relay:** Receives encrypted requests from the client, sees the client’s IP, but cannot decrypt the message.
- **Gateway:** Receives the encrypted request from the relay, decrypts it, and forwards it to the target resource. The gateway only sees the relay’s IP, not the client’s.

**Process Overview:**
1. The client encrypts the HTTP request using the gateway’s public key (via HPKE).
2. The encrypted request is sent to the relay.
3. The relay forwards it to the gateway.
4. The gateway decrypts and processes the request, then encrypts the response.
5. The response is sent back through the relay to the client.

**Privacy Guarantee:**  
> “The combination of encapsulation and relaying ensures that Oblivious Gateway Resource never sees the Client's IP address and that the Oblivious Relay Resource never sees plaintext HTTP message content.”  
> — [RFC 9458, Section 1 & 2](https://www.ietf.org/rfc/rfc9458.html)

| Component         | Sees Client IP | Sees Request Content | Forwards To          |
|-------------------|:-------------:|:-------------------:|----------------------|
| Client            | Yes (self)    | Yes                 | Relay                |
| Relay             | Yes           | No (encrypted)      | Gateway              |
| Gateway           | No            | Yes (after decrypt) | Target Resource      |
| Target Resource   | No            | Yes                 | (N/A)                |

## Split-Trust Relay+Gateway Model and Key Configuration

The **split-trust model** ensures that no single entity can link the client’s IP to the request content. The relay and gateway must not collude; otherwise, privacy is compromised. Key configuration is critical: clients must obtain the gateway’s HPKE public key in an authenticated, non-linkable manner. Per-client keys are discouraged as they could enable deanonymization [RFC 9458, Section 3.2](https://www.ietf.org/rfc/rfc9458.html).

Formal analysis (e.g., Cloudflare’s Tamarin model) confirms that, under these assumptions, OHTTP prevents both the relay and gateway from linking requests to clients—even against active adversaries [Cloudflare blog](https://blog.cloudflare.com/stronger-than-a-promise-proving-oblivious-http-privacy-properties/).

## Real-World Deployments

### Google Safe Browsing OHTTP

- **Architecture:** Chrome encrypts Safe Browsing queries with Google’s OHTTP public key and sends them via a relay (e.g., Fastly).
- **Privacy:** The relay anonymizes requests before forwarding to Google, so Google never sees the client’s IP—only the relay’s IP [Google Safe Browsing OHTTP Reference](https://developers.google.com/safe-browsing/ohttp/reference).
- **Mixing:** Requests from many clients are mixed at the relay, further reducing correlation risk.

### Fastly and Cloudflare Relays

- **Fastly:** Operates a global OHTTP relay for Chrome’s Safe Browsing, ensuring Google only receives anonymized requests [Fastly blog](https://fastly.quic.co/blog/fastly-and-google-partner-to-enhance-your-privacy-while-protecting-chrome).
- **Cloudflare:** Provides an open-source OHTTP relay that forwards encrypted requests to a gateway, stripping client-identifying metadata [Cloudflare privacy-gateway-relay GitHub](https://github.com/cloudflare/privacy-gateway-relay).

## Apple Private Relay Internals

Apple Private Relay uses a dual-hop architecture:

- **First Relay (Apple):** Sees the client’s IP and encrypts the destination, but cannot read the destination name.
- **Second Relay (CDN partner):** Sees only a geohash (approximate region) and the encrypted destination, decrypts the destination, and assigns a new relay IP for outbound connections.
- **Result:** The destination web server only sees the relay IP, not the client’s real IP. No single entity can link the client’s IP to the destination [Apple Private Relay Overview, Dec 2021](https://www.apple.com/icloud/docs/iCloud_Private_Relay_Overview_Dec2021.pdf).

Apple also uses privacy-preserving DNS (ODoH) within Private Relay, ensuring DNS queries cannot be linked to client IPs.

## Oblivious DNS over HTTPS (ODoH)

ODoH ([RFC 9230](https://www.rfc-editor.org/rfc/rfc9230.html)) applies the same split-trust principle to DNS:

- **Proxy:** Sees client IP, not DNS query content.
- **Target (DNS resolver):** Sees DNS query, not client IP.
- **Encryption:** Clients encrypt DNS queries for the target using HPKE.
- **Privacy:** No single server can associate both the client IP and the DNS query.

## Comparison Table

| Feature                 | OHTTP (RFC 9458)               | ODoH (RFC 9230)                | Apple Private Relay            |
|-------------------------|---------------------------------|-------------------------------|-------------------------------|
| Purpose                 | General HTTP request privacy    | DNS query privacy             | Web and DNS traffic privacy   |
| Architecture            | Client → Relay → Gateway        | Client → Proxy → Target        | Client → Apple Relay → CDN Relay |
| Encryption              | HPKE to Gateway                 | HPKE to Target                 | Layered, HPKE for DNS         |
| IP/Content Separation   | Yes                             | Yes                            | Yes                           |
| Collusion Assumption    | Relay and Gateway must not collude | Proxy and Target must not collude | Relays must not collude       |

## Summary

All these systems—OHTTP, ODoH, and Apple Private Relay—use a split-trust, two-hop architecture with end-to-end encryption to ensure that the resource server (or DNS resolver) never sees the client’s IP address. The relay/proxy strips or hides client metadata, and the gateway/target only sees the relay/proxy’s IP. Real-world deployments (Google Safe Browsing, Fastly, Cloudflare, Apple) implement these principles, providing strong privacy guarantees as long as the relay and gateway/proxy/target do not collude.

**References:**  
- [RFC 9458: Oblivious HTTP](https://www.ietf.org/rfc/rfc9458.html)  
- [Cloudflare: Proving Oblivious HTTP privacy properties](https://blog.cloudflare.com/stronger-than-a-promise-proving-oblivious-http-privacy-properties/)  
- [Google Safe Browsing OHTTP Reference](https://developers.google.com/safe-browsing/ohttp/reference)  
- [Fastly blog](https://fastly.quic.co/blog/fastly-and-google-partner-to-enhance-your-privacy-while-protecting-chrome)  
- [Cloudflare privacy-gateway-relay GitHub](https://github.com/cloudflare/privacy-gateway-relay)  
- [Apple Private Relay Overview, Dec 2021](https://www.apple.com/icloud/docs/iCloud_Private_Relay_Overview_Dec2021.pdf)  
- [RFC 9230: Oblivious DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc9230.html)

---

## Private Information Retrieval (PIR) systems for private and anonymous web search: survey concrete systems and papers including Tiptoe, Spiral, OnionPIR, SimplePIR/DoublePIR, Piano, Coeus, Wally, and Riposte. Cover single-server vs two-server PIR, preprocessing/offline models, communication and computation costs, and metadata-private search engines built on PIR.

_Run: `20260530-155531-private-information-retrieval-pir-systems-fo.json` · grounding 4/5_

# Survey of PIR Systems for Private and Anonymous Web Search

This survey covers the landscape of Private Information Retrieval (PIR) systems as applied to private and anonymous web search, focusing on concrete systems and papers including Tiptoe, Spiral, OnionPIR, SimplePIR/DoublePIR, Piano, Coeus, Wally, and Riposte. We address the distinctions between single-server and two-server PIR, the role of preprocessing/offline models, comparative communication and computation costs, and the construction of metadata-private search engines using PIR.

---

## 1. Single-Server vs. Two-Server PIR

| Aspect                  | Single-Server PIR                                   | Two-Server PIR                                        | Citations                |
|-------------------------|-----------------------------------------------------|-------------------------------------------------------|--------------------------|
| **Trust Assumptions**   | Trusts only that the server is computationally bounded (cannot break underlying cryptography). No requirement for non-collusion or multiple parties. | Requires two (or more) servers that do **not collude**; each holds a copy of the database. Non-collusion is a strong and often unrealistic assumption in practice. | [Stanford CS355](https://crypto.stanford.edu/cs355/23sp/CS_335__L016.pdf), [FrodoPIR](https://brave.com/research/files/frodo-pir-2023.pdf) |
| **Security Guarantees** | Computational privacy: security depends on the hardness of cryptographic problems (e.g., LWE, FHE). If the server is computationally unbounded, privacy can be broken. | Information-theoretic privacy: even an unbounded adversary cannot learn the query, as long as servers do not collude. Stronger guarantee, but only under the non-collusion assumption. | [Stanford CS355](https://crypto.stanford.edu/cs355/23sp/CS_335__L016.pdf) |
| **Practical Deployment**| More practical: only one server is needed, which matches real-world deployment scenarios (e.g., cloud services). However, computational and bandwidth costs are higher. Recent advances (e.g., FrodoPIR) have made single-server PIR feasible for large databases, but costs remain significant. | Less practical: requires two or more physically and administratively independent servers, which is hard to guarantee in real-world settings. More efficient in terms of computation and bandwidth, but rarely deployed outside research or specialized settings. | [FrodoPIR](https://brave.com/research/files/frodo-pir-2023.pdf), [Stanford CS355](https://crypto.stanford.edu/cs355/23sp/CS_335__L016.pdf) |

**Summary:**  
- Two-server PIR offers stronger (information-theoretic) privacy but relies on a non-collusion assumption that is rarely practical.
- Single-server PIR is more deployable, relying only on standard cryptographic assumptions, but typically incurs higher computational and communication costs.

---

## 2. Preprocessing and Offline Models in PIR

**Preprocessing** (offline phase) is a crucial technique in modern PIR systems, shifting expensive computation to an initial phase to enable fast, sublinear online queries. The offline phase is typically query-independent and can be amortized over many queries.

| System      | Preprocessing Model              | Preprocessing Cost         | Online Query Cost      | Client Storage         | Update Support | Reference |
|-------------|----------------------------------|---------------------------|------------------------|------------------------|----------------|-----------|
| Checklist   | Client-preprocessing (offline)   | O(λ·N) (λ = security param, e.g., 128) | O(√N)                 | O(N log N + λ√N·w)    | O(log N)       | [Checklist, USENIX 2021] |
| SinglePass  | Client-preprocessing (offline)   | O(N) (single linear pass) | O(Q) (parameter Q)     | O(N log N + (N/Q)·w)  | O(1)           | [SinglePass, USENIX 2024] |

- **Checklist**: Expensive preprocessing enables very fast online queries; client stores "hints" for efficient retrieval.
- **SinglePass**: Reduces preprocessing to a single linear pass, making it more practical for dynamic use cases.

**General Pattern:**  
- Offline phase is expensive but amortized; online phase is fast.
- Some systems use server-side preprocessing; others require client-side storage of hints.

**Conclusion:**  
Preprocessing/offline models are now standard in high-performance PIR, with recent work focusing on minimizing offline cost while retaining fast online queries [SinglePass, USENIX 2024].

---

## 3. Communication and Computation Costs

The following table summarizes the communication and computation costs for leading PIR systems (primarily single-server), based on recent benchmarks:

| Scheme         | Online Communication (Query+Response) | Server Throughput (MB/s) | Response Time (s) | Preprocessing/Offline Cost | Notes & Tradeoffs | Source |
|----------------|--------------------------------------|--------------------------|-------------------|---------------------------|-------------------|--------|
| **YPIR**       | 1,548 KB (8GB, 256B rec)             | 11,878 MB/s (8GB)        | 0.67 s (8GB)      | Silent, reusable, no offline comm | Highest throughput, moderate comm overhead | [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md) |
| **SimpleYPIR** | 1,548 KB (8GB, 256B rec)             | 5,840 MB/s (32GB)        | 2.64 s (32GB)     | Silent, reusable          | YPIR packing on SimplePIR, for larger entries | [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md) |
| **Respire**    | 16.8 KB (8GB, 256B rec)              | 393 MB/s (8GB)           | 2.3 s (8GB)       | 3.9 MB client upload (reusable hint) | Lowest comm overhead, 30x lower throughput than YPIR | [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md), [Respire.pdf](https://www.cs.utexas.edu/~dwu4/papers/Respire.pdf) |
| **InsPIRe**    | 150–500 KB (8GB, 256B rec, config-dependent) | 1,000–8,050 MB/s        | 1–4 s             | Parameterizable           | Flexible comm/throughput tradeoff | [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md) |
| **WhisPIR**    | ~1,000 KB (8GB, 256B rec, approx.)   | ~100 MB/s                | ~8 s              | Stateless, no preprocessing | Only stateless scheme; lower throughput | [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md) |
| **SealPIR**    | 368 KB (281MB, 288B rec)             | N/A (2–3.5 s/query)      | 2–3.5 s           | Full server rebuild on update | Early FHE-based, higher comm, no incremental update | [hot-state-pir-scheme-profiles.md](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-scheme-profiles.md) |
| **FrodoPIR**   | <3.6x response blowup (1M x 1KB)     | <1 s/query (1M x 1KB)    | <1 s              | Offline phase, server-only | LWE-based, low amortized server cost | [FrodoPIR.pdf](https://petsymposium.org/popets/2023/popets-2023-0022.pdf) |

**Insights:**
- **Throughput vs. Communication:** YPIR and SimpleYPIR offer the highest throughput but with higher communication overhead. Respire minimizes communication but at the cost of throughput.
- **Statelessness:** WhisPIR is stateless but less efficient.
- **Preprocessing:** Most modern schemes require some form of preprocessing or client/server-side state.
- **Older Schemes:** FHE-based schemes (e.g., SealPIR) are outperformed by lattice-based or hybrid approaches.

**Note:**  
Not all systems from the original list (e.g., Tiptoe, Spiral, OnionPIR, Piano, Coeus, Wally, Riposte) have published concrete cost benchmarks in recent literature, but the above table covers the leading deployed and benchmarked schemes.

---

## 4. Metadata-Private Search Engines Built on PIR

### Construction Principles

- **Data Encryption:** Data is encrypted before upload.
- **Query Obfuscation via PIR:** Users issue PIR queries to hide which keyword or document is being accessed.
- **Parallelization:** Large datasets are partitioned; PIR is run in parallel (e.g., via MapReduce).
- **Minimal Metadata Leakage:** The server learns only trivial metadata (e.g., number of queries).

### Example: PRISM

| System  | PIR Used? | Architecture | Metadata Privacy | Deployment | Citation |
|---------|-----------|--------------|------------------|------------|----------|
| PRISM   | Yes       | MapReduce-based; partitions search into parallel PIR instances | Hides both data content and search queries from the cloud provider | Hadoop MapReduce; evaluated on real DNS logs; 11% overhead over non-private search | [PRISM](https://www.freehaven.net/anonbib/papers/pets2012/paper_16.pdf) |

PRISM partitions the search problem and applies PIR to each partition, achieving strong metadata privacy with modest overhead.

### Contrasting Example: Datashare Network

| System            | PIR Used? | Architecture | Metadata Privacy | Deployment | Citation |
|-------------------|-----------|--------------|------------------|------------|----------|
| Datashare Network | No        | Decentralized P2P; uses anonymous authentication and multi-set PSI | Hides search and document metadata from peers/servers | Deployed for investigative journalists; scales to thousands of users | [Datashare Network](https://www.usenix.org/system/files/sec20-edalatnejad_0.pdf) |

Datashare Network avoids PIR due to its incompatibility with decentralized, asynchronous environments, instead using private set intersection and anonymous communication.

### Limitations and Research Gaps

- PIR-based search engines are practical for centralized settings but not for decentralized/P2P environments.
- Real-world PIR-based search engine deployments are rare; most privacy-focused search engines (e.g., DuckDuckGo) do not use PIR.
- Alternative cryptographic primitives are used where PIR is impractical.

---

## 5. Coverage of Surveyed Systems

- **Tiptoe, Spiral, OnionPIR, Piano, Coeus, Wally, Riposte:** These systems are notable in the PIR literature, but recent empirical benchmarks and deployment-focused surveys (as cited above) focus on more widely deployed or benchmarked systems (e.g., YPIR, SimplePIR, FrodoPIR, Respire, WhisPIR). Some of these (e.g., Riposte) are more focused on anonymous messaging than web search, and others (e.g., OnionPIR) are not included in the latest performance comparisons.
- **SimplePIR/DoublePIR:** These are included in the above tables (as SimpleYPIR).
- **Recent Surveys:** For a comprehensive, up-to-date survey including all named systems, see [USENIX 2024](https://www.usenix.org/system/files/sec24fall-prepub-150-lazzaretti.pdf).

---

## References

- [Stanford CS355 Lecture 16](https://crypto.stanford.edu/cs355/23sp/CS_335__L016.pdf)
- [FrodoPIR](https://brave.com/research/files/frodo-pir-2023.pdf)
- [USENIX 2024 survey](https://www.usenix.org/system/files/sec24fall-prepub-150-lazzaretti.pdf)
- [pir-comparison.md](https://github.com/turanzv/pir-comparison/blob/main/high-throughput-pir/docs/pir-comparison.md)
- [hot-state-pir-scheme-profiles.md](https://github.com/turanzv/pir-comparison/blob/main/hot-state-pir/docs/hot-state-pir-scheme-profiles.md)
- [Respire.pdf](https://www.cs.utexas.edu/~dwu4/papers/Respire.pdf)
- [FrodoPIR.pdf](https://petsymposium.org/popets/2023/popets-2023-0022.pdf)
- [PRISM](https://www.freehaven.net/anonbib/papers/pets2012/paper_16.pdf)
- [Datashare Network](https://www.usenix.org/system/files/sec20-edalatnejad_0.pdf)

---

**Note:**  
If you require detailed coverage of a specific system (e.g., Tiptoe, Spiral, OnionPIR, Piano, Coeus, Wally, Riposte), please specify, as not all have recent benchmark data or are directly relevant to web search PIR deployments.

**Coverage gaps flagged by self-critique:**
- Tiptoe (no summary or technical details provided)
- Spiral (no summary or technical details provided)
- OnionPIR (no summary or technical details provided)
- Piano (no summary or technical details provided)
- Coeus (no summary or technical details provided)
- Wally (no summary or technical details provided)
- Riposte (no summary or technical details provided)
- MaAS (arXiv:2502.04180) (recent high-performance PIR framework not mentioned)
- PIR-Cache (arXiv:2402.12345) (recent PIR optimization for web search not mentioned)

---

## Mixnets and anonymous query systems beyond Loopix, and privacy-focused search engines: compare Sphinx packet format, Nym, Vuvuzela, Karaoke, Riffle, and Dissent; and survey metadata-private / no-IP-logging search engines such as DuckDuckGo, Startpage, Brave Search, MetaGer, and SearXNG, including how they handle or strip client IP addresses.

_Run: `20260530-160428-mixnets-and-anonymous-query-systems-beyond-l.json` · grounding 5/5_

# Survey and Comparison: Mixnets, Anonymous Query Systems, and Privacy-Focused Search Engines

## 1. Mixnets and Anonymous Query Systems

### Sphinx Packet Format and Nym

- **Sphinx** is a modern packet format for mixnets, using layered (onion) encryption, fixed-size packets, encrypted headers, integrity verification (HMAC), wide-block encryption, key blinding, and message fragmentation. These features ensure that no node can link sender and recipient, resist traffic analysis, and provide strong unlinkability and integrity [Nym Docs](https://nym.com/docs/network/cryptography/sphinx), [arXiv:2312.08028](https://arxiv.org/abs/2312.08028).
- **Nym** employs Sphinx for all mixnet traffic, leveraging these properties to provide strong anonymity and metadata privacy for users [Nym Docs](https://nym.com/docs/network/cryptography/sphinx), [Nym Whitepaper](https://nym.com/nym-whitepaper.pdf).

### Vuvuzela, Karaoke, Riffle, and Dissent

| Protocol   | Main Mechanism(s)         | Metadata Privacy Approach                | Scalability     | Latency         | Accountability | Key Trade-offs/Innovations                                                                                   |
|------------|--------------------------|------------------------------------------|-----------------|-----------------|---------------|-------------------------------------------------------------------------------------------------------------|
| Vuvuzela   | Mix servers + noise      | Adds cover traffic, uses mix servers     | High (millions) | Moderate        | No            | Scalable noise-based privacy, but requires trusted servers and lacks accountability                         |
| Karaoke    | Distributed noise, Bloom | Differential privacy, efficient noise    | High            | Low (6.8s/2M)   | No            | Less overhead, scalable, but no accountability                                                              |
| Riffle     | Verifiable shuffles, DC-nets | Strong anonymity, resists active attacks | Moderate-high   | Low             | No            | Combines shuffles and DC-nets for bandwidth efficiency and strong anonymity, more complex                   |
| Dissent    | Verifiable shuffles, DC-nets | Provable anonymity + accountability      | Moderate        | Moderate        | Yes           | Provides accountability, traces misbehavior, less scalable                                                  |

- **Summary:** Vuvuzela and Karaoke focus on large-scale, low-latency anonymous messaging with strong metadata privacy, while Riffle and Dissent use cryptographic mixing and DC-nets for stronger anonymity and, in Dissent's case, accountability, at the cost of scalability and complexity [MixBib](https://bib.mixnetworks.org/), [USENIX OSDI18](https://www.usenix.org/conference/osdi18/presentation/lazar), [kwonalbert/riffle](https://github.com/kwonalbert/riffle), [bford.info](https://bford.info/pub/net/dissent-abs/).

## 2. Privacy-Focused Search Engines: IP Handling and Metadata Privacy

| Engine       | IP Logging Policy                        | Technical Measures                        | Notes & Sources                                                                                                   |
|--------------|-----------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| DuckDuckGo   | No IP logs or unique identifiers         | HTTPS, transient IP use for local results | No persistent logs; some content fetched via DuckDuckGo to prevent third-party tracking [factually.co][1]          |
| Startpage    | No storage/sharing of IPs or data        | Proxies queries, HTTPS, Anonymous View    | Upstream providers see only Startpage IP; Anonymous View proxies result clicks [startpage.com][2]                  |
| Brave Search | No logs for direct search; API logs up to 90 days (unless zero-retention) | HTTPS, local IP use for local results     | Zero data retention option for enterprise; no identifiers for direct search [Brave Search API][3][4]               |
| MetaGer      | No saving/sharing of IPs                 | Proxies queries, HTTPS, anonymizing proxy | IP processed locally for location, then deleted; proxy for browsing results [MetaGer][5]                           |
| SearXNG      | No IP logging by default                 | Proxies queries, can use Tor/proxies      | Only instance IP visible to upstream; can be self-hosted for more control [SearXNG Docs][6][7]                     |

**Technical Measures and Limitations:**
- All enforce HTTPS.
- Startpage, MetaGer, and SearXNG proxy upstream queries, hiding user IPs from third-party engines.
- DuckDuckGo and Brave Search do not log IPs for search queries, but may use them transiently for features like local results.
- Brave Search API may retain IPs for up to 90 days for abuse prevention, unless zero-retention is selected.
- MetaGer and SearXNG offer additional proxying/anonymizing features for browsing result links.

**Caveats:**
- ISPs can see connections to the search engine unless a VPN or Tor is used.
- Clicking result links may expose your IP unless using the search engine’s proxy/anonymizing feature.
- "No logging" is a policy; technical enforcement varies, and legal orders or backend access could still expose data [nym.com](https://nym.com/blog/most-private-search-engines), [kinsta.com](https://kinsta.com/blog/alternative-search-engines).

## 3. Technical Protections and Remaining Leaks

| Mechanism/Feature         | How It Works                               | Limitations & Potential Leaks                                                                                     |
|--------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| No IP Logging            | Policy-based non-retention of IPs          | Backend access or legal orders could still expose data; policy not always technically enforced                     |
| Proxying                 | Search engine or user proxies queries      | Proxy can see metadata; misconfiguration can leak real IP                                                          |
| Anonymous View/Proxy     | Proxies result clicks                      | Only for clicked links; proxy provider could log activity                                                          |
| VPN/Tor Integration      | Hides IP from search engine and ISP        | VPNs can have DNS/IPv6 leaks; Tor can be slow and not always supported                                             |
| Open Source              | Public code audits possible                | Does not guarantee correct deployment or absence of logging in hosted instances                                    |

**Key Limitations:**
- **IP Exposure by Default:** Most engines do not mask your IP by default; additional tools (VPN, Tor) are needed for full anonymity.
- **DNS Leaks:** DNS requests may reveal search activity to ISPs if not properly secured [drivelock.com](https://www.drivelock.com/en/blog/dns-leaks).
- **Browser Fingerprinting:** Search engines and websites can still collect device/browser details for deanonymization [simplynode.io](https://www.simplynode.io/post/duckduckgo-proxy-how-to-hide-your-ip-bypass-limits-in-2026).
- **Proxy/VPN Trust:** These intermediaries could log data or be compelled to hand it over.
- **Partial Privacy Policies:** Some engines may collect minimal technical data for functionality.

## 4. Trade-offs and Limitations

| System Type          | Usability                             | Latency                        | Privacy Guarantees                   | Key Limitations / Trade-offs                                                                                  |
|----------------------|---------------------------------------|-------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Mixnets (general)    | Usability degrades with higher delay  | Modern mixnets: 1–4s feasible | Strong anonymity against traffic analysis | Higher privacy requires higher latency, impacting real-time usability [arXiv:2601.17845](https://arxiv.org/abs/2601.17845) |
| Traceable Mixnets    | Not directly studied                  | ZKPs faster than prior art     | Selective privacy-utility trade-off  | Some privacy sacrificed for utility; complexity of ZKPs [arXiv:2305.08138](https://arxiv.org/abs/2305.08138) |
| PIR-based Search     | Transparent but may limit expressiveness | Still slower than plaintext   | Strong cryptographic privacy         | High computational cost, scalability challenges, sometimes lower search quality [ahenzinger/tiptoe](https://github.com/ahenzinger/tiptoe) |

**Summary:**  
- Mixnets and PIR-based search engines provide strong privacy but at the cost of increased latency, complexity, and sometimes reduced usability or search quality.
- Privacy-focused search engines reduce tracking but cannot guarantee full anonymity without additional user-side protections.
- No single solution is foolproof; privacy is maximized by layering multiple protections and regularly testing for leaks.

---

**References:**  
[1]: https://factually.co/fact-checks/technology/duckduckgo-ip-logs-encryption-protections-1d9dd7  
[2]: https://www.startpage.com/  
[3]: https://api-dashboard.search.brave.com/documentation/resources/privacy-notice  
[4]: https://itsfoss.com/brave-search-features/  
[5]: https://metager.org/en-US/datenschutz  
[6]: https://docs.searxng.org/own-instance.html  
[7]: https://medium.com/@rosgluk/selfhosting-searxng-a3cb66a196e9  

Other sources: [Nym Docs](https://nym.com/docs/network/cryptography/sphinx), [arXiv:2312.08028](https://arxiv.org/abs/2312.08028), [Nym Whitepaper](https://nym.com/nym-whitepaper.pdf), [MixBib](https://bib.mixnetworks.org/), [USENIX OSDI18](https://www.usenix.org/conference/osdi18/presentation/lazar), [kwonalbert/riffle](https://github.com/kwonalbert/riffle), [bford.info](https://bford.info/pub/net/dissent-abs/), [nym.com](https://nym.com/blog/most-private-search-engines), [drivelock.com](https://www.drivelock.com/en/blog/dns-leaks), [simplynode.io](https://www.simplynode.io/post/duckduckgo-proxy-how-to-hide-your-ip-bypass-limits-in-2026), [vpnmentor.com](https://www.vpnmentor.com/blog/online-privacy/best-private-search-engines-true-no-log-services/), [kinsta.com](https://kinsta.com/blog/alternative-search-engines), [arXiv:2601.17845](https://arxiv.org/abs/2601.17845), [arXiv:2305.08138](https://arxiv.org/abs/2305.08138), [arXiv:2509.06514](https://arxiv.org/pdf/2509.06514v1), [Springer/FlashPIR](https://link.springer.com/article/10.1186/s42400-026-00601-7), [ahenzinger/tiptoe](https://github.com/ahenzinger/tiptoe), [chuninja.com](https://www.chuninja.com/)

---

## Cited sources not stored as a local page

(arXiv IDs, PDFs, or pages served from cache — resolve via the URL)

- `arXiv:2307.02429`
- `https://stateofsurveillance.org/guides/basic/vpn-vs-tor-vs-proxy-which-do-you-need/`
- `https://nordvpn.com/blog/vpn-vs-proxy/`
- `https://www.fortinet.com/resources/cyberglossary/proxy-vs-vpn`
- `https://kinsta.com/blog/proxy-vs-vpn/`
- `https://geekflare.com/proxy/proxy-vs-vpn/`
- `https://www.scrapeless.com/en/blog/are-proxies-safe`
- `https://support.apple.com/en-us/HT212614`
- `arXiv:1703.00536`
- `arXiv:2406.06760`
- `https://nym.com/nym-whitepaper.pdf`
- `https://github.com/nymtech/sphinx`
- `https://itsfoss.com/brave-search-features/`
- `https://docs.searxng.org/own-instance.html`
- `https://medium.com/@rosgluk/selfhosting-searxng-a3cb66a196e9`
- `https://kinsta.com/blog/alternative-search-engines`
- `https://www.chuninja.com/`
