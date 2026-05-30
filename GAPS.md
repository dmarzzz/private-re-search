# Gaps the swarm missed

_Generated 2026-05-30 by a Claude deep + parallel research workflow (6 gap-hunters across distinct lenses, then adversarial verification of each candidate, then synthesis). 68 agents, 61 unique candidates surfaced, **52 confirmed** as real, relevant, and genuinely absent from the [corpus](INDEX.md)._

Structured data for every confirmed gap (verdicts + URLs) is in [`gaps.json`](gaps.json).

---

The corpus skews heavily toward defense mechanisms (Tor, mixnets, PIR, OHTTP, private search engines) and almost entirely omits two halves of the field: the attack/threat-model literature that establishes when those defenses actually fail, and several whole defense families that are not cryptographic-PIR or onion-routing. The single biggest thematic miss is the **attack side** — there is no website-fingerprinting, flow-correlation, AS/BGP routing, statistical-disclosure, or query-log deanonymization work at all, despite these being the canonical evidence that anonymization is hard. The second is the **obfuscation / decoy-query family** (TrackMeNot, GooPIR, and its formal critiques), an entire paradigm that is absent. Third, the corpus has the modern PIR *implementations* but not their *foundational papers*, and references several key systems (SealPIR, Spiral, SimplePIR) only secondhand through a benchmark. Finally, several deployed and standardized IP-hiding systems (MASQUE, Privacy Pass, Kagi, Google IP Protection, I2P) and the peer-forwarding / P2P-overlay anonymity branch (Crowds, Tarzan, MorphMix, Freenet) are missing.

---

### Attacks and threat models (highest-priority category gap)

The corpus is defense-only. These are the canonical attacks that define what "anonymized" actually buys you.

| System | What it is | Why it matters |
|---|---|---|
| **A Face Is Exposed for AOL Searcher No. 4417749** ([NYT, 2006](https://www.nytimes.com/2006/08/09/technology/09aol.html)) | The landmark real-world query-log reidentification: pseudonymized AOL logs linked to a named individual in days. | THE canonical proof that stripping IP is insufficient — query content alone is a fingerprint. Motivates the entire query-unlinkability threat model the corpus's defenses target, yet there is no deanonymization case study at all. |
| **RAPTOR: Routing Attacks on Privacy in Tor** ([USENIX Sec 2015](https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-sun.pdf)) | AS-level routing attacks: asymmetric-traffic correlation, BGP churn, and active BGP hijack to observe both ends of a Tor circuit. | Explicitly named in the lens. The reference network-layer/BGP attack; the corpus has zero AS/BGP routing-adversary material. |
| **Users Get Routed: Traffic Correlation by Realistic Adversaries** ([CCS 2013](https://dl.acm.org/doi/10.1145/2508859.2516651)) | Models relay + AS + IXP + IXP-group adversaries; introduces TorPS and time-to-first-compromise metrics. | The canonical "how bad is end-to-end correlation in practice" paper. Corpus has Tor best-practices but no realistic-adversary threat model. |
| **DeepCorr: Strong Flow Correlation Attacks on Tor** ([CCS 2018](https://arxiv.org/abs/1808.07285)) | Deep-learning flow-correlation linking Tor entry/exit flows at ~96% accuracy from ~900 packets. | The core deanonymization primitive against low-latency anonymous search; the corpus contains no flow-correlation/traffic-confirmation attack. |
| **Deep Fingerprinting** ([CCS 2018](https://arxiv.org/abs/1801.02265)) | CNN website-fingerprinting attack: a passive local eavesdropper IDs the visited site at >98% from packet-direction sequences, defeating WTF-PAD. | The de-facto baseline WF attack everything since is measured against. No WF attack exists in the corpus. |
| **Online Website Fingerprinting** ([USENIX Sec 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/cherubin)) | First WF evaluation on genuine Tor traffic with real ground truth in a true open world (Distinguished Paper). | Critical correction to lab-optimistic WF claims; recalibrates real-world danger. Complements the Deep Fingerprinting lab result with field measurement. |
| **OB-PWS: Obfuscation-Based Private Web Search** ([IEEE S&P 2012](https://oaklandsok.github.io/papers/balsa2012.pdf)) | Formal model and analysis framework systematically evaluating decoy-query defenses (TrackMeNot, GooPIR) and exposing their failures. | The canonical SoK/critique of the noise-injection category — and the corpus has neither the category nor its critique. |
| **On the Privacy of TrackMeNot** ([PETS 2010](https://link.springer.com/chapter/10.1007/978-3-642-14527-8_2)) | Shows an adversarial engine with a short query history separates real queries from decoys via off-the-shelf ML. | The foundational attack proving decoy-query obfuscation fails; canonical TMN-breaking paper. |
| **SimAttack: private web search under fire** ([JISA 2016](https://jisajournal.springeropen.com/articles/10.1186/s13174-016-0044-x)) | One similarity-based attack deanonymizing queries protected by Tor unlinkability, TrackMeNot, AND GooPIR (~37/45/52%). | The only cross-cutting attack spanning all three private-search families; unifies the critiques the corpus lacks. |
| **DeepCoFFEA** ([IEEE S&P 2022](https://ieeexplore.ieee.org/document/9833801/)) | Flow-correlation via paired embedding networks + amplification, solving the O(N²) base-rate problem; ~93% TPR. | State-of-the-art post-DeepCorr confirmation attack showing current (not just historical) feasibility. |
| **Tik-Tok: Utility of Packet Timing in WF** ([PETS 2020](https://petsymposium.org/popets/2020/popets-2020-0043.pdf)) | Isolates packet-timing/burst features: 98.4% undefended, 93.5% on WTF-PAD-defended Tor. | Establishes timing as an independent leakage axis surviving padding — generalizes the OHTTP/relay timing-correlation concern the corpus does not address. |
| **Statistical Disclosure Attacks** ([Danezis, 2003](http://www0.cs.ucl.ac.uk/staff/G.Danezis/papers/StatDisclosure.pdf)) | The founding long-term intersection attack: links a persistent user to correspondents by intersecting mix activity over many rounds. | Directly attacks the mixnet unlinkability (Loopix/Nym/Karaoke) the corpus relies on over repeated queries; no intersection/SDA paper is present. |

---

### Obfuscation / decoy-query private search (missing paradigm)

A whole defense family — hide the real query in noise rather than encrypt or route it. The corpus has none of it.

| System | What it is | Why it matters |
|---|---|---|
| **TrackMeNot** ([Howe, Nissenbaum, Toubiana](https://github.com/vtoubiana/TrackMeNot)) | Browser extension injecting programmatically generated decoy queries so the real query can't be linked to user interests. | The defining artifact of the entire noise-injection category, referenced by every later attack paper; entirely absent. |
| **GooPIR / h(k)-PIR** ([Domingo-Ferrer et al., 2009](https://www.emerald.com/insight/content/doi/10.1108/14684520910985693/full/html)) | Masks a real query by OR-ing it with k−1 dictionary dummy keywords (h(k)-PIR indistinguishability), re-ranking locally. | The canonical "obfuscate the query against an uncooperative engine" approach; distinct from server-cooperating cryptographic PIR. |
| **Private Web Search (PWS)** ([Saint-Jean, Johnson, Boneh, Feigenbaum, WPES 2007](https://crypto.stanford.edu/~dabo/pubs/abstracts/privwebsearch.html)) | Firefox plugin acting as HTTP proxy + Tor client that filters identifying query/response components. | The named academic "Private Web Search" system the lens calls out; pairs Tor anonymization with query-content privacy, distinct from Tiptoe's PIR-based "private web search." |
| **Optimized Query Forgery for PIR** ([Rebollo-Monedero, Forné, IEEE Trans. IT 2010](https://doi.org/10.1109/TIT.2010.2054471)) | Information-theoretic optimum for generating dummy queries to minimize KL divergence from a target profile at fixed overhead. | The formal theory underpinning all profile-obfuscation/dummy-query schemes; corpus has no noise-injection theory. |
| **X-Search** ([Mokhtar et al., Middleware 2017](https://arxiv.org/abs/1805.01742)) | Intel SGX enclave proxy that aggregates and obfuscates queries inside a TEE, positioned as a fix for the SimAttack-broken predecessors. | The canonical SGX answer in the private-web-search line; corpus has no TEE/enclave-based private search. |
| **Castellà-Roca et al., "Preserving user's privacy in web search engines"** ([Computer Communications 2009](https://www.sciencedirect.com/science/article/abs/pii/S014036640900125X)) | Group/collaborative scheme where users submit each other's queries so the engine only sees a shared group profile (UPIR). | The canonical user-private-information-retrieval / group-shuffling approach; a mechanism distinct from both decoy injection and relay mixnets, unrepresented. |

---

### Foundational PIR papers and key systems (definitions and primary sources missing)

The corpus has modern PIR *implementations* but lacks the founding definitions and treats several core systems only as benchmark line-items.

| System | What it is | Why it matters |
|---|---|---|
| **Private Information Retrieval** ([Chor, Goldreich, Kushilevitz, Sudan, 1995/1998](https://dl.acm.org/doi/10.1145/293347.293350)) | The originating definition of PIR: retrieve a DB item from replicated servers without any server learning which item. | The direct ancestor of every PIR system in the corpus (Tiptoe, FrodoPIR, Piano); the field-defining paper is missing. |
| **Single-Database Computational PIR** ([Kushilevitz, Ostrovsky, FOCS 1997](https://ieeexplore.ieee.org/document/646125/)) | First single-server computational PIR: one non-replicated DB suffices to hide which record is fetched. | The theoretical basis for every single-server private-search system in the corpus (SimplePIR, Spiral, Tiptoe). |
| **PIR with Sublinear Online Time** ([Corrigan-Gibbs, Kogan, Eurocrypt 2020](https://eprint.iacr.org/2019/1075)) | Introduces the offline/online PIR model giving sublinear online lookups without extra server storage. | The paradigm that makes interactive private search feasible at scale; corpus has the downstream systems (Piano, Wally) but not the foundation. |
| **SimplePIR / DoublePIR** ([Henzinger et al., USENIX Sec 2023](https://www.usenix.org/conference/usenixsecurity23/presentation/henzinger)) | Fastest LWE-based single-server PIR with an offline hint. | The direct cryptographic engine behind Tiptoe (already in corpus), yet referenced only secondhand via the pir-comparison benchmark. |
| **Spiral** ([Menon, Wu, IEEE S&P 2022](https://eprint.iacr.org/2022/368)) | High-rate single-server PIR via Regev+GSW FHE composition (up to 1.9 GB/s). | A leading building block for private web/DB queries; in the corpus only secondhand through the benchmark, not as the primary paper. |
| **SealPIR** ([Angel, Chen, Laine, Setty, IEEE S&P 2018](https://eprint.iacr.org/2017/1142)) | Single-server FHE/RLWE PIR with query compression (up to 274× smaller) and probabilistic batch codes. | Foundational practical PIR whose batch techniques underpin later private-search work; only an indirect benchmark mention exists. (Note: the candidate's "SealPIR/XPIR" label conflates two systems — the URL is unambiguously SealPIR.) |

---

### Applied / keyword / batch PIR systems and oblivious storage

PIR variants closer to a real search interface (keyword, batch, stateful) and the oblivious-storage substrate underneath private retrieval.

| System | What it is | Why it matters |
|---|---|---|
| **Coeus** ([Ahmad et al., SOSP 2021](https://dl.acm.org/doi/10.1145/3477132.3483586)) | End-to-end oblivious keyword search: secure tf-idf ranking + PIR retrieval over a public corpus, server learns nothing about the query. | This is *exactly* private search, as a full system distinct from Tiptoe/Wally; absent. |
| **Splinter** ([Wang et al., NSDI 2017](https://www.usenix.org/conference/nsdi17/technical-sessions/presentation/wang-frank)) | Hides search-style queries on public data (maps, flights, reviews) via Function Secret Sharing across non-colluding providers. | The only FSS-based private-query approach; a distinct cryptographic family with no equivalent in the corpus's PIR set. |
| **Private Blocklist Lookups with Checklist** ([Kogan, Corrigan-Gibbs, USENIX Sec 2021](https://www.usenix.org/conference/usenixsecurity21/presentation/kogan)) | Two-server PIR for Safe Browsing lookups without leaking the URL-hash prefix; integrated into Firefox. | A concrete deployed private-lookup system; corpus covers Safe Browsing over OHTTP but not the PIR approach to the same problem. |
| **Pantheon** ([Ahmad et al., VLDB 2023](https://www.vldb.org/pvldb/vol16/p643-ahmad.pdf)) | Single-round keyword/key-value PIR over a large public store; server learns neither key nor result. | The keyword-PIR shape underlying web-scale private search; no keyword/KV PIR exists in the corpus. |
| **Constant-weight PIR** ([Mahdavi, Kerschbaum, USENIX Sec 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/mahdavi)) | First practical single-round single-server keyword PIR via constant-weight equality operators. | Lookup by keyword (not index) is the natural private-search interface; absent. |
| **Pung** ([Angel, Setty, OSDI 2016](https://www.usenix.org/system/files/conference/osdi16/osdi16-angel.pdf)) | Metadata-private key-value retrieval on cPIR with private multi-retrieval and batch codes over fully untrusted infrastructure. | The seminal PIR-messaging system whose batch/multi-query techniques (SealPIR's lineage) underpin later private search. |
| **Vectorized Batch PIR** ([Mughees, Ren, IEEE S&P 2023](https://eprint.iacr.org/2022/1262)) | Single-server batch PIR via vectorized RLWE, 7.5–98.5× lower communication. | Fills the batch-PIR gap directly; corpus references batch concepts only secondhand via SealPIR's PBCs. |
| **Private Stateful Information Retrieval** ([Patel, Persiano, Yeo, CCS 2018](https://eprint.iacr.org/2018/1083)) | Clients keep state across queries so repeated private retrievals cost sublinear online time (~10× savings). | The foundational stateful-PIR primitive for repeated private searches; distinct from later preprocessing PIR (Piano). |
| **Popcorn** ([Gupta et al., NSDI 2016](https://www.usenix.org/conference/nsdi16/technical-sessions/presentation/gupta-trinabh)) | Applied hybrid multi+single-server PIR hiding which item a client fetches at Netflix-library scale. | The canonical practical-deployment counterpoint to the corpus's academic PIR set. |
| **Snoopy** ([Dauterman et al., SOSP 2021](https://eprint.iacr.org/2021/1280)) | Horizontally scalable oblivious (ORAM-style) object store using enclaves + distributed oblivious load balancing (92K req/s). | The corpus has zero ORAM/oblivious-storage work; this is the scalable substrate making oblivious retrieval backends fast. |

---

### Deployed and standardized IP-hiding / unlinkable-auth systems

Real, shipped, or IETF-standardized building blocks on the IP-and-identity-unlinking axis.

| System | What it is | Why it matters |
|---|---|---|
| **MASQUE: CONNECT-IP + CONNECT-UDP** ([RFC 9484](https://datatracker.ietf.org/doc/rfc9484/), RFC 9298) | IETF framework for tunneling client IP packets and UDP through an HTTP proxy to hide the client IP from the destination. | The transport substrate beneath Apple Private Relay and Google IP Protection; corpus has OHTTP (RFC 9458) and ODoH but not the lower-layer IP-tunneling standard. |
| **Privacy Pass** ([RFC 9576](https://www.rfc-editor.org/info/rfc9576/), 9577, 9578) | Blind-signature tokens proving a client is authorized without revealing which client, giving issuance-redemption unlinkability. | Addresses the "unlink queries from identity" half of the problem (authorization without identification); the cryptographic primitive behind Kagi and Apple's tokens. |
| **Kagi Privacy Pass** ([blog.kagi.com, 2025](https://blog.kagi.com/kagi-privacy-pass)) | Live commercial-search deployment of Privacy Pass: subscribers mint blind tokens so Kagi verifies entitlement but cannot link searches to an account, shipped with a Tor onion service. | One of very few real production deployments of unlinkable auth for search; corpus lists DuckDuckGo/Startpage/Brave but not Kagi. |
| **Google IP Protection** ([GoogleChrome/ip-protection, 2025](https://github.com/GoogleChrome/ip-protection)) | Chrome Incognito two-hop proxy (Google ingress + CDN egress) with RSA blind-signature tokens so neither hop links traffic to the account. | A distinct browser-scale deployed two-hop system; corpus has Apple Private Relay and Cloudflare/Fastly OHTTP relays but not Google's. |
| **iCloud Private Relay traffic-analysis study** ([ASIA CCS 2023](https://dl.acm.org/doi/10.1145/3579856.3595793)) | Peer-reviewed flow-correlation / website-fingerprinting attack model against Private Relay's two-hop architecture, plus Apple's technical whitepaper. | Corpus lists Private Relay only at overview level; the adversarial evaluation of its actual IP-hiding limits is the load-bearing missing piece. |
| **Tinfoil** ([tinfoil.sh, 2025](https://tinfoil.sh/technology)) | Deployed confidential-computing service running LLM inference and web search inside attested TEEs; shared enclave egress IP hides the client from the search provider. | The most prominent deployed enclave-based private-query/RAG product; corpus has no TEE/enclave private-inference product. |
| **DNS over QUIC (DoQ)** ([RFC 9250](https://datatracker.ietf.org/doc/rfc9250/)) | Encrypted DNS over dedicated QUIC connections, concealing resolved names from on-path observers. | Corpus has DNS leaks and ODoH but not the QUIC-based encrypted-DNS transport standard (deployed by Quad9, AdGuard). Lower priority — transport confidentiality, adjacent to core IP anonymization. |

---

### Peer-forwarding and P2P-overlay anonymity (missing architectural branch)

The corpus covers Tor and named mixnets but not the "blend into a crowd" / P2P-overlay family that is the main non-Tor architectural alternative.

| System | What it is | Why it matters |
|---|---|---|
| **Crowds** ([Reiter, Rubin, ACM TISSEC 1998](https://dl.acm.org/doi/10.1145/290163.290168)) | Anonymizes web/HTTP requests by forwarding each through a random chain of peer crowd members; introduces "degrees of anonymity." | The canonical foundational peer-forwarding design directly on the "hide your IP from a search engine" threat model; its formal anonymity notion is cited by later query-privacy work. Entirely absent. |
| **I2P** ([geti2p.net tech-intro](https://geti2p.net/en/docs/how/tech-intro)) | Widely deployed garlic-routing overlay over unidirectional volunteer tunnels; carries HTTP via eepsites/outproxies. | The other major deployed anonymity overlay besides Tor, architecturally distinct (garlic/unidirectional, no directory authorities); not listed. |
| **Tarzan** ([Freedman, Morris, CCS 2002](https://www.freehaven.net/anonbib/cache/tarzan:ccs02.pdf)) | Decentralized P2P IP overlay anonymizing arbitrary apps via layered encryption + cover traffic over a restricted topology. | The seminal P2P IP-anonymizer; the corpus has no P2P-overlay anonymity system at all. |
| **MorphMix** ([Rennhard, Plattner, WPES 2002](https://dl.acm.org/doi/10.1145/644527.644537)) | Low-latency P2P circuit mix where every node is a mix, with collusion detection for malicious relays. | The other canonical scalable P2P mix design; companion to Tarzan, also absent. |
| **Freenet / Hyphanet** ([Clarke et al., 2001](https://link.springer.com/chapter/10.1007/3-540-44702-4_4)) | P2P store whose core operation is anonymous keyed retrieval — key-based routing so no node links who requested or stored an item. | The routed-distributed-store anonymity model, a distinct retrieval-privacy design from PIR; the search-adjacent lookup-unlinkability case. |
| **HORNET** ([Chen et al., CCS 2015](https://arxiv.org/abs/1507.05724)) | Stateless network-layer onion routing at >93 Gb/s using only symmetric crypto and per-packet headers. | A scalability-oriented onion-routing alternative to Tor (the line continued by TARANET); corpus onion coverage is Tor + Sphinx only. |

---

### Independent / decentralized private search engines (breadth)

Lower-priority completeness additions to the private-search-engine listicle, but each covers a distinct threat model.

| System | What it is | Why it matters |
|---|---|---|
| **Whoogle Search** ([benbusby/whoogle-search](https://github.com/benbusby/whoogle-search)) | Self-hostable proxy fetching upstream results so the client IP never reaches the engine; queries egress from one shared server. | The relay-you-control pattern as a distinct primary source (and a real deployment caveat: final release after Google's JS blocking, now defaulting to Mullvad Leta). Corpus has SearXNG but not Whoogle. |
| **Mojeek** ([mojeek.com/about](https://www.mojeek.com/about/)) | UK search engine with its own independent crawler/index (5B+ pages) and a no-tracking, no-IP-logging policy. | Different threat-model coverage (fully independent index, not metasearch) than DuckDuckGo/Startpage/Brave/MetaGer. Privacy is operator-trust, not cryptographic — hence lower priority. |
| **Presearch** ([Wikipedia](https://en.wikipedia.org/wiki/Presearch_(search_engine))) | Decentralized metasearch routing queries through tens of thousands of community-run nodes via a PII-stripping gateway. | A DePIN node-routing model distinct from mixnets and PIR. Note: policy/operator-trust privacy, not a cryptographically proven scheme — a breadth datapoint, not a rigorous technique. |
