window.TREE = {
 "nodes": [
  {
   "id": "g_txn",
   "label": "Anonymous\nTxn Submission",
   "cls": "goal",
   "desc": "Goal: an agent submits an onchain transaction without revealing who is acting. Two top-level needs: an anonymous onchain identity (out of scope, families exist) and anonymous metadata so the submission's last-mile IP/timing does not deanonymize the sender. No dedicated pay-for node: native value/gas rides the onchain anonymity layer, and any transport fee collapses into the reputation gateway's anti-Sybil concern; pay-for-inclusion is deliberately folded into the gateway budget, not a separate shared-payments parent. Fire-and-forget: no return path, the submission expects no reply.",
   "actors": "Flashbots (decentralized building)",
   "open": "none at this layer",
   "links": [
    {
     "label": "Flashbots: Decentralized Building (wat do)",
     "url": "https://writings.flashbots.net/decentralized-building-wat-do"
    },
    {
     "label": "Flashbots: Network-Anonymized Mempools (NAMP)",
     "url": "https://writings.flashbots.net/network-anonymized-mempools"
    }
   ],
   "cluster": "goals"
  },
  {
   "id": "g_llm",
   "label": "Anonymous\nLLM Inference",
   "cls": "goal",
   "desc": "Goal: an agent queries an LLM origin-anonymously (hide who-is-asking, not the prompt content). Top-level needs: private inference (out of scope; content-hiding via TEE/MPC/FHE), anonymous metadata for the last-mile IP leak, a return path to deliver the reply to an addressless client, and a way to pay the inference operator without a counterparty graph. Origin-hiding only; content-hiding is the out-of-scope project.",
   "actors": "Confidential Prompting (Li, Gim, Zhong, arXiv:2409.19134); Jonathan Passerat-Palmbach (secure inference, TEEs)",
   "open": "none at this layer",
   "links": [
    {
     "label": "Confidential Prompting (Li, Gim, Zhong, arXiv:2409.19134)",
     "url": "https://arxiv.org/abs/2409.19134"
    }
   ],
   "cluster": "goals"
  },
  {
   "id": "g_search",
   "label": "Anonymous\nClearNet Search",
   "cls": "goal",
   "desc": "Goal: an agent searches the clearnet web without the index server learning the query or who asked. Top-level needs: oblivious search (don't leak the query), anonymous metadata (don't leak who/when/how-often), a return path for the results, and pay-for-search to fund the index host without a billing-linked identity. The flagship use case of this work.",
   "actors": "dmarz (Periscope); Wally (Dauterman et al.); Tiptoe (Henzinger et al.)",
   "open": "none at this layer",
   "links": [
    {
     "label": "dmarzzz/private-re-search (Periscope)",
     "url": "https://github.com/dmarzzz/private-re-search"
    },
    {
     "label": "Wally (Dauterman et al., arXiv:2406.06761)",
     "url": "https://arxiv.org/abs/2406.06761"
    },
    {
     "label": "Tiptoe (Henzinger et al., SOSP'23, eprint 2023/1438)",
     "url": "https://eprint.iacr.org/2023/1438"
    }
   ],
   "cluster": "goals"
  },
  {
   "id": "stub_onchain",
   "label": "Anonymous\nonchain identity",
   "cls": "stub",
   "desc": "Hide who you are onchain so the txn can't be linked to a funded identity. Solutions exist and are mature; deliberately OUT OF SCOPE, kept as a terminal node that names the families. Real families: (1) stealth addresses (one-time recipient keys, ERC-5564); (2) shielded pools (Zcash Sapling/Orchard, ~59% shielded share by Feb 2026; Aztec) hiding sender/receiver/amount via zk; (3) compliance-aware pools / proof-of-innocence (Privacy Pools, Railgun, ~$4B cumulative shielded volume) adding membership/exclusion proofs. We consume this, we do not build it.",
   "actors": "Zcash (ECC), Aztec, Railgun, Privacy Pools (Buterin/Soleimani et al.), ERC-5564 stealth addresses",
   "open": "out of scope (families exist)",
   "links": [
    {
     "label": "ERC-5564: Stealth Addresses",
     "url": "https://eips.ethereum.org/EIPS/eip-5564"
    },
    {
     "label": "Privacy Pools (Buterin, Illum, Nadler, Schar, Soleimani, SSRN)",
     "url": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364"
    },
    {
     "label": "Zcash (Electric Coin Company)",
     "url": "https://z.cash"
    }
   ],
   "cluster": "oos"
  },
  {
   "id": "stub_privinf",
   "label": "Private inference",
   "cls": "stub",
   "desc": "Hide the inference computation itself (model sees neither plaintext prompt nor are weights exposed to host). Distinct from origin-anonymity, which the LLM goal gets from anonymous metadata. Deliberately OUT OF SCOPE; not building this. Real families named for honesty: (1) TEE / confidential compute (NVIDIA Hopper/Blackwell CC, Intel TDX, AMD SEV-SNP, Apple PCC) -- the only practical end-to-end confidential LLM path today, <~7% overhead; (2) secure MPC -- strong threat model, bottlenecked by interaction/round complexity (JPP's reading-group domain); (3) FHE -- strongest crypto guarantee, ~100x-10,000x slowdown, impractical for real-time chat. Terminal.",
   "actors": "NVIDIA Confidential Computing, Intel TDX, AMD SEV-SNP, Apple PCC; MPC/FHE academia (incl. Jonathan Passerat-Palmbach)",
   "open": "out of scope (families exist)",
   "links": [
    {
     "label": "NVIDIA Confidential Computing",
     "url": "https://www.nvidia.com/en-us/data-center/solutions/confidential-computing/"
    },
    {
     "label": "Intel TDX (Trust Domain Extensions)",
     "url": "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html"
    },
    {
     "label": "Apple Private Cloud Compute",
     "url": "https://security.apple.com/blog/private-cloud-compute/"
    }
   ],
   "cluster": "oos"
  },
  {
   "id": "cap_meta",
   "label": "Anonymous\nmetadata",
   "cls": "capability",
   "desc": "Hide who-sent-what at the network layer: source IP, destination, timing/volume/packet-shape bound to a stable identity, so an observer (network or receiving endpoint) cannot link a message to its sender. TLS protects content not shape. THE shared need under all three goals (txn, inference, search) AND under the reply leg of the return path. Resolves into a family of anonymous-transport protocols, each landing on the anonymity-trilemma frontier: against a global passive adversary, strong anonymity is paid in added latency OR added bandwidth/cover traffic (a continuous lower-bound frontier, not pick-2-of-3; Das-Meiser-Mohammadi-Kate, IEEE S&P 2018). Unlinkability is information-theoretic in a DC-net relative to pre-shared keys, statistical in a mixnet, weak/path-based in onion routing.",
   "actors": "dmarz; Flashbots; Chaum 1988",
   "links": [
    {
     "label": "Anonymity trilemma (Das-Meiser-Mohammadi-Kate, IEEE S&P 2018)",
     "url": "https://eprint.iacr.org/2017/954"
    },
    {
     "label": "Chaum, The Dining Cryptographers Problem (1988)",
     "url": "https://link.springer.com/article/10.1007/BF00206326"
    },
    {
     "label": "Flashbots NAMP (network-anonymized mempools)",
     "url": "https://writings.flashbots.net/network-anonymized-mempools"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "cap_cover",
   "label": "Cover traffic",
   "cls": "capability",
   "desc": "Dummy/loop messages indistinguishable from real ones, so an adversary cannot tell active communication from idle. SHARED across two rooms: (1) the bandwidth side of the transport trilemma (strong-anonymity transports buy unlinkability with cover traffic vs latency; Loopix loops, ZipNet/ADCNet moderate-bandwidth low-latency); and (2) application-layer query-VOLUME hiding, where Wally injects a few FAKE QUERIES to hide how-many/when on the search side (Tiptoe's explicit non-goal).",
   "actors": "Loopix (Piotrowska et al.); Flashbots; Wally (Dauterman et al.)",
   "links": [
    {
     "label": "Loopix (Piotrowska et al., USENIX Sec 2017)",
     "url": "https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/piotrowska"
    },
    {
     "label": "Wally (Dauterman et al., arXiv:2406.06761)",
     "url": "https://arxiv.org/abs/2406.06761"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "fam_transport",
   "label": "Anonymous\ntransport (family)",
   "cls": "family",
   "desc": "Family of protocols realizing sender unlinkability, each picking a point on the trilemma frontier: onion routing (Tor) = low overhead/latency but weak vs a global passive adversary; mixnets (Nym/Loopix) = strong anonymity bought with latency AND cover traffic; DC-nets (Chaum line) = strong anonymity at low latency, paid in bandwidth. We chose the DC-net branch (ZipNet -> Flashnet -> ADCNet); Tor and Nym are alternatives we did not take. The right member depends on the workload, not a single winner.",
   "actors": "Tor Project; Nym; Chaum/Flashbots",
   "links": [
    {
     "label": "Tor Project",
     "url": "https://www.torproject.org/"
    },
    {
     "label": "Nym",
     "url": "https://nym.com/"
    },
    {
     "label": "Flashbots NAMP",
     "url": "https://writings.flashbots.net/network-anonymized-mempools"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "t_tor",
   "label": "Tor / onion",
   "cls": "option",
   "desc": "Onion routing: layered encryption over a 3-hop circuit. Low overhead, low latency, but only weak anonymity against a global passive adversary that correlates entry/exit timing. A real path to anonymous metadata, not the one chosen here. Best for interactive, low-latency request/response. Return path: native synchronous bidirectional rendezvous.",
   "actors": "Tor Project",
   "links": [
    {
     "label": "Tor Project",
     "url": "https://www.torproject.org/"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "t_nym",
   "label": "Nym / mixnet",
   "cls": "option",
   "desc": "Stratified continuous-time mixnet on Loopix: per-hop exponential delays reorder messages, plus loop cover traffic for unobservability. Strong anonymity bought with latency AND cover traffic; the high-latency corner of the frontier. Not chosen because the use cases want low latency. Best for latency-tolerant, async workloads. Return path: replies via SURBs (single-use reply blocks).",
   "actors": "Nym; Piotrowska, Hayes, Elahi (Loopix, USENIX Sec 2017)",
   "links": [
    {
     "label": "Nym",
     "url": "https://nym.com/"
    },
    {
     "label": "Loopix (Piotrowska, Hayes, Elahi et al., USENIX Sec 2017)",
     "url": "https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/piotrowska"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "t_dcnets",
   "label": "Anon broadcast\n(secret-sharing)",
   "cls": "family",
   "desc": "Anonymous broadcast, framed (per the Flashbots NAMP / anon-mempool writeup) as a SECRET-SHARING protocol rather than a raw XOR DC-net: each client places its message in a random slot of a shared array and secret-shares / additively-homomorphically encrypts it, then the summed array reveals every message with senders detached. The XOR dining-cryptographers net (Chaum 1988) is the information-theoretic special case; the Flashbots line (ZipNet -> Flashnet -> ADCNet) is the secret-sharing / homomorphic-vector-commitment generalization, run in an ANYTRUST client-server regime (anonymity holds if >=1 server is honest; TEEs buy liveness, not anonymity). Native hazard: anonymous disruption / jamming, addressed by accountable variants (Dissent/Verdict). Best for broadcast / fire-and-forget with many simultaneous senders.",
   "actors": "Chaum 1988; DEDIS (Dissent/Verdict)",
   "links": [
    {
     "label": "Chaum, The Dining Cryptographers Problem (1988)",
     "url": "https://link.springer.com/article/10.1007/BF00206326"
    },
    {
     "label": "Dissent: Accountable Anonymous Group Messaging (Yale DEDIS, CCS 2010)",
     "url": "https://dl.acm.org/doi/10.1145/1866307.1866346"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "l_zip",
   "label": "ZipNet",
   "cls": "lineage",
   "desc": "Low-bandwidth anonymous broadcast in the client-server anytrust model: anonymity holds if >=1 server is honest. TEEs and untrusted aggregators buy bandwidth/liveness, NOT anonymity. The crypto base ADCNet/Flashnet build on. eprint 2024/1227, PoPETs 2025.",
   "actors": "Rosenberg et al. (academia)",
   "links": [
    {
     "label": "ZipNet (Rosenberg et al., eprint 2024/1227, PoPETs 2025)",
     "url": "https://eprint.iacr.org/2024/1227"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "b_adcnet",
   "label": "ADCNet",
   "cls": "built",
   "desc": "ADCNet: the Go PoC that IMPLEMENTS Flashnet (its README says 'mostly based on ZIPNet' + IBLT auction scheduling). The built artifact that anonymizes broadcast metadata. Research-grade, hand-rolled crypto ('do not use in production').",
   "actors": "Flashbots",
   "links": [
    {
     "label": "flashbots/adcnet",
     "url": "https://github.com/flashbots/adcnet"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "l_flash",
   "label": "Flashnet",
   "cls": "designed",
   "desc": "Flashnet: the Flashbots DESIGN that fixes ZipNet's wasteful random slot scheduling with an IBLT-knapsack auction (collective #5630). Comes from ZipNet; ADCNet is its implementation. TEE for liveness, classical crypto for anonymity, low latency.",
   "actors": "Flashbots",
   "links": [
    {
     "label": "Flashnet: Anonymous Broadcast with Auction-Based Scheduling",
     "url": "https://collective.flashbots.net/t/anonymous-broadcast-with-auction-based-scheduling/5630"
    },
    {
     "label": "Flashbots NAMP",
     "url": "https://writings.flashbots.net/network-anonymized-mempools"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "front_rounds_parallel",
   "label": "Rounds vs\nparallelism",
   "cls": "frontier",
   "desc": "Open transport-side problem (Luis Correia's sharp question). Strong anonymity is inherent to synchronous rounds + cover traffic (without them you get Tor-style timing-correlation), but agents fire many queries in PARALLEL bursts, stressing the round structure. The proposed lever is auction-based scheduling (IBLT/ADCNet) absorbing parallel bursts into scheduled slots; unproven at agent fan-out. Designed framing, not resolved.",
   "actors": "Luis Correia (PIG); dmarz",
   "open": "Can IBLT/auction-based scheduling absorb parallel agent query bursts into synchronous broadcast rounds without sacrificing the anonymity set or blowing up latency?",
   "links": [
    {
     "label": "Flashnet: Anonymous Broadcast with Auction-Based Scheduling",
     "url": "https://collective.flashbots.net/t/anonymous-broadcast-with-auction-based-scheduling/5630"
    }
   ],
   "cluster": "transport"
  },
  {
   "id": "prob_ip_poisoning",
   "label": "IP poisoning",
   "cls": "problem",
   "desc": "Anonymous transport removes the one free rate-limit every clearnet service relies on: the source IP. With no per-IP cost, a single party mints unlimited indistinguishable requests, so spam and Sybil flooding arrive for free. The first wall any anonymous-metadata system hits the moment it works. Only PARTIALLY mitigable: a reputation gateway rate-limits credentials a client already holds, but with cheap anonymous credential minting unsolved (the Sybil root), the problem is blunted, not eliminated.",
   "actors": "Sarah Allen (PIG, raised spam/Sybil unprompted); Mark Simkin (RLN/rate-limit framing); Flashbots Research DB (Sybils as a standing hazard)",
   "links": [
    {
     "label": "RLN documentation (rate-limiting nullifier)",
     "url": "https://rate-limiting-nullifier.github.io/rln-docs/rln_in_details.html"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "sol_gateway",
   "label": "Reputation\ngateway",
   "cls": "built",
   "desc": "Reputation-gated egress that re-imposes a rate limit without an IP. A client proves zk membership in a reputation set (Semaphore) and presents one nullifier per epoch; the gateway holds a per-identity budget COUNTER on its side and refuses egress past the budget. Built + live (p50 ~1.9s). Precision: the live PoC is Semaphore membership + gateway-side budget counter, NOT in-circuit RLN-v2 Shamir secret-sharing / slashing. SCOPE: this is ONE solution and it gives BASIC Sybil resistance only -- it rate-limits a credential a client already holds, but does nothing to make minting the next credential expensive, so it PARTIALLY blunts IP poisoning rather than handling it. True Sybil resistance is not achieved (and we think is likely impossible anonymously). Closest prior art: zk-promises (USENIX Security 2025, anonymous reputation + reputation-dependent rate-limiting from anonymous credentials with callbacks); cf. Flashbots searcher reputation (non-anonymous).",
   "actors": "dmarz; zk-promises (USENIX'25); Flashbots searcher reputation",
   "open": "Two open problems block it from being true Sybil resistance: how to price credential issuance (the Sybil root, conjectured to have no full anonymous answer) and whether one credential can be spent across egresses without re-linking the client. Neither is solved.",
   "links": [
    {
     "label": "dmarzzz/reputation-gated-onion-egress",
     "url": "https://github.com/dmarzzz/reputation-gated-onion-egress"
    },
    {
     "label": "zk-promises (USENIX Security 2025)",
     "url": "https://www.usenix.org/conference/usenixsecurity25/presentation/shih"
    },
    {
     "label": "zk-promises (eprint 2024/1260)",
     "url": "https://eprint.iacr.org/2024/1260"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "prim_semrln",
   "label": "Semaphore + RLN",
   "cls": "primitive",
   "desc": "zk group membership (Semaphore) plus a rate-limiting nullifier. The live gateway uses the simple one-message-per-epoch nullifier (externalNullifier = H(epoch, id)) with the budget enforced by a gateway-side counter. RLN v2's in-circuit Shamir secret sharing (shown for userMessageLimit=1 as A(x)=a1*x+a0, two points over the limit reconstruct a0 to slash; generalizes to a degree-(limit) sharing polynomial) is the heavier on-chain-slashing variant, NOT what the PoC runs.",
   "actors": "PSE / RLN community",
   "links": [
    {
     "label": "RLN in detail (rate-limiting-nullifier docs)",
     "url": "https://rate-limiting-nullifier.github.io/rln-docs/rln_in_details.html"
    },
    {
     "label": "semaphore-protocol/semaphore",
     "url": "https://github.com/semaphore-protocol/semaphore"
    },
    {
     "label": "Semaphore docs (PSE)",
     "url": "https://docs.semaphore.pse.dev/"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "front_issuance_cost",
   "label": "True Sybil\nresistance (C(N))",
   "cls": "frontier",
   "desc": "The real Sybil root, and what the gateway does NOT solve: RLN and the gateway counter METER usage, they do not make minting the next identity expensive. True Sybil resistance reduces to an issuance cost C(N) that satisfies three constraints at once: (a) at least linear, ideally superlinear in N (Vitalik's N^2 ideal); (b) cheap at N=1 so honest newcomers are not priced out; (c) anonymous at issuance (the issuer learns only 'one new member'). Conjecture: no construction satisfies all three anonymously -- without a trusted personhood or cost anchor an adversary can always mint cheaply, so the gateway only ever delivers basic (rate-limited) Sybil resistance.",
   "actors": "Vitalik (biometric/pluralistic ID essay); Mark Simkin; World ID; Douceur 2002 (Sybil impossibility); zk-promises (USENIX'25); Flashbots Research DB (Mechanism Design with Sybils / VCG and Sybils / Price of Anarchy with Sybils)",
   "open": "Can RLN's slashable stake double as issuance cost, or does stake-splitting (arXiv:2509.18338) force a personhood gate on top? Pluralistic composition is the realistic target; no single mechanism wins -- and the strong form (cheap, superlinear, anonymous, all at once) is conjectured impossible.",
   "links": [
    {
     "label": "Vitalik, biometric / pluralistic ID essay",
     "url": "https://vitalik.eth.limo/general/2023/07/24/biometric.html"
    },
    {
     "label": "Stake-splitting linearity (arXiv:2509.18338)",
     "url": "https://arxiv.org/abs/2509.18338"
    },
    {
     "label": "Douceur, The Sybil Attack (IPTPS 2002)",
     "url": "https://link.springer.com/chapter/10.1007/3-540-45748-8_24"
    },
    {
     "label": "World ID privacy FAQs",
     "url": "https://world.org/blog/worldcoin/worldcoin-privacy-faqs"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "fam_sybil",
   "label": "Sybil resistance\n(family)",
   "cls": "family",
   "desc": "The family of mechanisms that can supply a superlinear, personhood-anchored issuance cost. Members, none sufficient alone, composed pluralistically (Vitalik) so no provider holds near-total share: (1) PROOF OF PERSONHOOD -- caps near 1-per-human (World ID, built on Semaphore; pseudonym parties); strongest ceiling, heaviest friction/exclusion risk. (2) STAKE -- bonded slashable capital, but pure stake is LINEAR and splittable (stake-splitting linearity, arXiv:2509.18338), excludes those who cannot pay. (3) SOCIAL GRAPH -- vouching/web-of-trust (Circles); resists capital Sybils but gameable by collusive sub-graphs and leaks relationship metadata.",
   "actors": "World ID, Worldcoin; RLN slashing; Circles / web-of-trust; zk-promises (USENIX'25); Douceur 2002; Mark Simkin; Vitalik (pluralistic ID)",
   "links": [
    {
     "label": "World ID privacy FAQs (Worldcoin)",
     "url": "https://world.org/blog/worldcoin/worldcoin-privacy-faqs"
    },
    {
     "label": "Douceur, The Sybil Attack (IPTPS 2002)",
     "url": "https://link.springer.com/chapter/10.1007/3-540-45748-8_24"
    },
    {
     "label": "Vitalik, pluralistic ID essay",
     "url": "https://vitalik.eth.limo/general/2023/07/24/biometric.html"
    },
    {
     "label": "zk-promises (eprint 2024/1260)",
     "url": "https://eprint.iacr.org/2024/1260"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "front_portability_linkage",
   "label": "Portability\nvs linkage ★",
   "cls": "flagship",
   "desc": "Spend ONE credential across many egresses without the egresses being able to correlate your activity. Privacy Pass RFC 9576 names the hazard directly: clients redeeming the same token to multiple Origins risk those Origins linking their activity. Falsifiable conjecture (the flagship open problem): global aggregate rate-limiting across egresses and cross-egress unlinkability are mutually exclusive under ANY shared-nullifier construction. Open whether a re-randomizable token-bucket with an out-of-band global counter escapes it. This conjecturally BLOCKS the reputation gateway's multi-egress generalization.",
   "actors": "Privacy Pass RFC 9576; ARC",
   "open": "Is the conjecture true? Or does a re-randomizable token-bucket with an out-of-band global counter break the impossibility?",
   "flagship": true,
   "links": [
    {
     "label": "Privacy Pass architecture, RFC 9576",
     "url": "https://www.rfc-editor.org/rfc/rfc9576.html"
    },
    {
     "label": "ARC (draft-ietf-privacypass-arc-protocol)",
     "url": "https://datatracker.ietf.org/doc/draft-ietf-privacypass-arc-protocol/"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "cap_payments",
   "label": "Anon unlinkable\npayments",
   "cls": "capability",
   "desc": "Pay a service so the payment cannot be linked to who is using it, nor uses linked to each other. Carrying value in ONE anonymous credential is already SOLVED (see ACT); the open work is composition/binding/funding, not the value-carrying primitive. THE shared dependency: depended on by the reputation gateway, by paying for search, and by paying for inference (one node, three parents). Realized by a family of protocols differing on whether a credential carries numeric VALUE vs a single-use right, issuance trust (single vs threshold issuer), and online vs offline double-spend handling: Chaumian e-cash, Privacy Pass blind-signature tokens / ARC, Nym zk-nyms (Coconut threshold blind issuance, 'payment de-linked from usage'), and the chosen ACT.",
   "actors": "Samuel Schlesinger & Jonathan Katz (Google, ACT); Nym Technologies (zk-nyms/Coconut); David Chaum (e-cash origin); IETF Privacy Pass WG",
   "links": [
    {
     "label": "ACT (draft-schlesinger-cfrg-act)",
     "url": "https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html"
    },
    {
     "label": "Nym zk-nyms",
     "url": "https://nym.com/zk-nyms"
    },
    {
     "label": "Coconut (arXiv:1802.07344)",
     "url": "https://arxiv.org/abs/1802.07344"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "proto_act_kvac",
   "label": "ACT (KVAC/BBS)",
   "cls": "designed",
   "desc": "CHOSEN/CLOSEST. KVAC/BBS-style credential carrying a numeric BALANCE in one credential. Spend = range proof of sufficient balance (amount hidden), reveal a fresh nullifier, receive a signed anonymous CHANGE token. Issuer cannot correlate issuance with spend; leaks only nullifier + spent amount. CONFIRMED via live draft: 'The issuer MUST ensure atomic nullifier checking and recording within a single database transaction' (draft Sec 6.5.1) -- double-spend prevention is an ONLINE atomic check. Carrying value in one credential is SOLVED here; reference Rust impl exists. The non-chosen alternatives (Chaumian e-cash, Privacy Pass tokens/ARC, Nym zk-nyms) are folded into the family node.",
   "actors": "Samuel Schlesinger & Jonathan Katz (Google) — draft-schlesinger-cfrg-act",
   "links": [
    {
     "label": "ACT (draft-schlesinger-cfrg-act)",
     "url": "https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html"
    },
    {
     "label": "SamuelSchlesinger/anonymous-credit-tokens (Rust)",
     "url": "https://github.com/SamuelSchlesinger/anonymous-credit-tokens"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "prim_kvac",
   "label": "KVAC / BBS",
   "cls": "primitive",
   "desc": "Keyed-Verification Anonymous Credentials and BBS-style signatures: the cryptographic primitive under ACT (and ARC). Supports issuance unlinkable from presentation, selective disclosure, and (in ACT) a hidden numeric attribute proven in range. Note: the Privacy Pass blind-signature line (VOPRF / blind RSA, RFC 9578) and Chaumian e-cash rest on blind signatures, NOT KVAC; only ARC and ACT are KVAC-based.",
   "actors": "Chase, Meiklejohn, Zaverucha (KVAC); BBS signature lineage",
   "links": [
    {
     "label": "Algebraic MACs and KVAC (eprint 2013/516, CCS'14)",
     "url": "https://eprint.iacr.org/2013/516"
    },
    {
     "label": "Improved Algebraic MACs / practical KVAC (Springer)",
     "url": "https://link.springer.com/chapter/10.1007/978-3-319-69453-5_20"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "frontier_nullifier_binding",
   "label": "Nullifier\nbinding",
   "cls": "frontier",
   "desc": "Open sub-problem (the actual RQ), created by adopting ACT. A single agentic query must bind THREE things -- the payment spend nullifier (ACT), the rate-limit (RLN/Semaphore) nullifier, and the reply/return credential -- to the same request, while keeping all three mutually unlinkable and unlinkable across queries. Subsumes two named sub-leaks: (a) FUNDING-EVENT leak -- acquiring/topping-up the credential is an observable (payer, amount, time) edge at the fiat/on-chain boundary (an on-chain channel open/close is a public edge); open to collapse it into one padded, batched top-up. (b) ONLINE ATOMIC double-spend -- ACT's nullifier check MUST be atomic with insertion (Sec 6.5.1), forcing a synchronous available nullifier store, a liveness/scaling/centralization tension for a high-throughput agentic gateway; open is distributed/sharded atomic insertion without a single chokepoint. Also the dual-mode one-credential question (ARC count-limit + ACT balance sharing one nullifier store without re-linking tiers).",
   "actors": "(open) — composition of ACT + RLN v2 + Express/Talek return path; informed by ACT Sec 6.5.1 + payment-channel boundary-leak analysis",
   "open": "Can the spend nullifier, the RLN nullifier, and the reply credential be bound to one query, with a padded batched funding top-up and distributed atomic double-spend checking, while staying mutually and cross-query unlinkable?",
   "links": [
    {
     "label": "ACT draft (Sec 6.5.1 atomic nullifier check)",
     "url": "https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html"
    },
    {
     "label": "RLN in detail",
     "url": "https://rate-limiting-nullifier.github.io/rln-docs/rln_in_details.html"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "cap_pay_search",
   "label": "Pay for search",
   "cls": "capability",
   "desc": "Fund the oblivious-search index host without binding payment to a billing identity or leaking a (payer, host, amount, time) edge that would re-link otherwise-anonymous queries. A metered, recurring service-payment need specific to keeping the index online (Periscope runs ~$18/mo on 3 DO nodes). Resolves downward into the shared anon-unlinkable-payments capability.",
   "actors": "dmarz (Periscope hosting); ACT (Schlesinger & Katz)",
   "open": "realized via shared payments capability",
   "links": [
    {
     "label": "ACT (draft-schlesinger-cfrg-act)",
     "url": "https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html"
    },
    {
     "label": "dmarzzz/private-re-search (Periscope)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "cap_pay_inf",
   "label": "Pay for inference",
   "cls": "capability",
   "desc": "Pay the LLM inference operator per-query without a counterparty graph or billing-linked identity that would deanonymize the origin-anonymous client. A metered service-payment need (inference is the costly resource, so usage-linked billing is the natural leak). Resolves downward into the shared anon-unlinkable-payments capability.",
   "actors": "ACT (Schlesinger & Katz, Google); Nym zk-nyms (Coconut)",
   "open": "realized via shared payments capability",
   "links": [
    {
     "label": "ACT (draft-schlesinger-cfrg-act)",
     "url": "https://samuelschlesinger.github.io/ietf-anonymous-credit-tokens/draft-schlesinger-cfrg-act.html"
    },
    {
     "label": "Nym zk-nyms",
     "url": "https://nym.com/zk-nyms"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "cap_oblsearch",
   "label": "Private search",
   "cls": "capability",
   "desc": "Query a clearnet search index without the server learning the query or which record was fetched. Required by the search goal only. Realized by Periscope; resolves downward into the single-server PIR family plus two open sub-problems. Distinct from anonymous metadata: this hides WHAT was asked, not WHO asked. Query-VOLUME hiding (how-many/when) is a separate need filled by cover traffic (Wally's fake queries), not by PIR alone.",
   "actors": "dmarz",
   "links": [
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "b_periscope",
   "label": "Periscope",
   "cls": "built",
   "desc": "Built + live single-server PIR search over LWE ciphertext; server sees neither query nor fetched record. On-disk params n=1024, q=2^32, sigma=6.4; 234 pages / 6143 chunks, 20/20 correctness, 49ms median, ~29 KiB up / ~8 KiB down at this corpus size (bandwidth ~sqrt(N), hint fits ~N^0.497). Live on 3 DigitalOcean nodes (~$18/mo). TWO error sources: top-10 overlap vs full-scan 0.56 (quantization loss, 0.64 vs quantized), and two-node centroid router accuracy 0.812 (~19% wrong shard; router top-10 vs oracle 0.431 vs single-index 0.356). NOT built: incremental hint refresh; agent-era multi-vector queries.",
   "actors": "dmarz",
   "links": [
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fam_pir",
   "label": "PIR family",
   "cls": "family",
   "desc": "Family of single-server PIR schemes realizing oblivious retrieval, all inheriting the Beimel-Ishai-Malkin lower bound (a stateless single-server query must touch every entry unless preprocessed into a database-dependent hint). Members trade query/response size, hint size, and throughput; Periscope sits in the SimplePIR/LWE lineage. Named members: SimplePIR/DoublePIR (LWE, hint=A*DB; at 1GB: 121MB/16MB hint, 242/345 KB/query, ~10/7.4 GB/s/core; eprint 2022/949, USENIX Sec 2023), Spiral (FHE-composed high-rate, ~1.9 GB/s SpiralStreamPack; Menon & Wu, S&P 2022), FrodoPIR (LWE with query-independent offline preprocessing; Brave, PoPETs 2023), Tiptoe (private nearest-neighbor over embeddings, 360M pages, 145 core-s/q on 45 servers; non-goal: hides neither WHEN nor HOW MANY queries; SOSP 2023), and PSE LeanPIR (GPU-accelerated, 100GB+ scale).",
   "actors": "Henzinger/Corrigan-Gibbs/Dauterman/Zeldovich (MIT); Menon & Wu (UT Austin); Brave; PSE",
   "links": [
    {
     "label": "SimplePIR/DoublePIR (eprint 2022/949, USENIX Sec'23)",
     "url": "https://eprint.iacr.org/2022/949"
    },
    {
     "label": "Spiral (eprint 2022/368, S&P'22)",
     "url": "https://eprint.iacr.org/2022/368"
    },
    {
     "label": "FrodoPIR (eprint 2022/981, PoPETs'23)",
     "url": "https://eprint.iacr.org/2022/981"
    },
    {
     "label": "Tiptoe (eprint 2023/1438, SOSP'23)",
     "url": "https://eprint.iacr.org/2023/1438"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "alt_wally",
   "label": "Wally (DP)",
   "cls": "alternative",
   "desc": "The (ε,δ)-DP cousin of strict PIR that STACKS the anonymous network onto private search as an explicit assumption. VERBATIM: 'each client adds a few fake queries and sends each query via an anonymous network to the server at independently chosen random instants.' This is the node that wires oblivious search to cover traffic (fake queries) + anonymous metadata (anon network) for the search goal. Relaxes to (ε,δ)-DP rather than information-theoretic PIR. Credit Wally, not Tiptoe, for the stacking.",
   "actors": "Dauterman et al., arXiv:2406.06761",
   "links": [
    {
     "label": "Wally (arXiv:2406.06761)",
     "url": "https://arxiv.org/abs/2406.06761"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "pr_pir_lb",
   "label": "PIR lower\nbound (BIM)",
   "cls": "primitive",
   "desc": "Beimel-Ishai-Malkin: a stateless single-server PIR query must touch every database entry, unless the work is preprocessed into a database-dependent hint. The foundational constraint every family member pays, and the root of both open sub-problems (hint invalidation on update; per-query linear cost under fan-out). eprint 2007/351.",
   "actors": "Beimel, Ishai, Malkin",
   "links": [
    {
     "label": "Beimel-Ishai-Malkin PIR lower bound (eprint 2007/351)",
     "url": "https://eprint.iacr.org/2007/351"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fr_hintrefresh",
   "label": "Hint refresh",
   "cls": "frontier",
   "desc": "The hint (A*DB) is database-dependent, so any update to the search index invalidates it and naively forces a full recompute + redownload to every client. A live clearnet index changes constantly; Periscope has NOT built incremental refresh. State of the art is iSimplePIR (eprint 2026/030), the first single-server entry-level incremental scheme on SimplePIR. Open: incremental hint maintenance at search-corpus scale with sharded routing.",
   "actors": "iSimplePIR (eprint 2026/030); dmarz (unbuilt for Periscope)",
   "open": "Can the database-dependent hint be incrementally maintained at search-corpus scale under constant index churn, across shards, without a full client redownload?",
   "links": [
    {
     "label": "iSimplePIR (eprint 2026/030)",
     "url": "https://eprint.iacr.org/2026/030"
    },
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fr_agentcost",
   "label": "Agent query\ncost blowup",
   "cls": "frontier",
   "desc": "Because each PIR query is a linear scan, query count and dimensionality multiply server cost directly. Agentic RAG fans out ~2-3 sub-queries per task (commonly-cited range, not authoritative), and ColBERT-style multi-vector retrieval multiplies the oblivious matvec by the query's token count. No private system has absorbed decomposed / multi-vector queries; the agent-era scaling wall on oblivious search.",
   "actors": "dmarz (open); cf. ColBERT (arXiv:2004.12832)",
   "open": "Can decomposed (multi-sub-query) and multi-vector (ColBERT-style) retrieval be served under PIR's per-query linear-scan cost without server cost exploding by the fan-out times the token count?",
   "links": [
    {
     "label": "ColBERT (arXiv:2004.12832)",
     "url": "https://arxiv.org/abs/2004.12832"
    },
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "cap_returnpath",
   "label": "Return path",
   "cls": "capability",
   "desc": "Deliver a response back to a sender who has no stable, routable address. Needed by request/response goals (search, inference); NOT by fire-and-forget txn submission, which never expects a reply. The reply leg itself traverses the network, so it REUSES anonymous metadata / cover traffic exactly like the request leg (front_fold_auction proposes scheduling the reply on the same anonymous broadcast). Realized as a private mailbox: senders privately WRITE a reply into a recipient-owned slot, recipient privately READS it -- two composed sub-capabilities (authorized private-write + oblivious private-read) over two NON-COLLUDING servers (split-trust, RFC 9458 OHTTP; the anytrust cousin). General async case is established prior art (Express, Sabre, Talek). Return path is a TRANSPORT-DEPENDENT tradeoff: Tor's onion rendezvous gives a native synchronous bidirectional return (cheapest, weakest anonymity); mixnets (Nym/Loopix) support replies via SURBs (single-use reply blocks: pre-computed Sphinx headers encoding a return route, so the recipient answers without learning the sender), at mixnet latency; DC-net / anonymous broadcast (ZipNet -> Flashnet) has NO native return (fire-and-forget broadcast), so it needs the async private-mailbox overlay (authorized write + oblivious read) below. The stronger the sender-anonymity model, the harder the return path.",
   "actors": "dmarz (PIG seam A); Express, Sabre, Talek",
   "links": [
    {
     "label": "Express (USENIX Sec'21)",
     "url": "https://people.eecs.berkeley.edu/~henrycg/files/academic/papers/sec21express.pdf"
    },
    {
     "label": "Talek (eprint 2020/066, ACSAC'20)",
     "url": "https://eprint.iacr.org/2020/066"
    },
    {
     "label": "RFC 9458 (OHTTP)",
     "url": "https://www.rfc-editor.org/rfc/rfc9458.html"
    },
    {
     "label": "Nym/Loopix SURBs",
     "url": "https://nym.com/docs/network/concepts/loopix"
    }
   ],
   "cluster": "returnpath"
  },
  {
   "id": "cap_authwrite",
   "label": "Authorized\nprivate write",
   "cls": "capability",
   "desc": "A sender writes a reply into the recipient's mailbox slot without revealing which slot, while servers verify the write is authorized (no spam/overwrite). Realized by distributed point functions (DPF) over two non-colluding servers plus a per-slot authorization check. KNOWN PRIOR ART: Express (USENIX Sec 2021; DPF write O(log M) request, O(M) server work per write; recipient hands senders a virtual address carrying a secret-shared blind-MAC key; Eskandarian, Boneh et al.) and Sabre (IEEE S&P 2022; same DPF-write structure, logarithmic-cost audits replacing linear, ~order-of-magnitude speedup, PRF-based mailbox-ID verification; Vadapalli, Storrier, Henry). Solved as posed.",
   "actors": "Express (Eskandarian, Boneh et al.); Sabre (Vadapalli, Storrier, Henry)",
   "links": [
    {
     "label": "Express (USENIX Sec'21)",
     "url": "https://people.eecs.berkeley.edu/~henrycg/files/academic/papers/sec21express.pdf"
    },
    {
     "label": "Sabre (IEEE S&P'22)",
     "url": "https://ieeexplore.ieee.org/document/9833601/"
    }
   ],
   "cluster": "returnpath"
  },
  {
   "id": "cap_oblread",
   "label": "Oblivious\nprivate read",
   "cls": "capability",
   "desc": "The recipient retrieves their reply without revealing which slot is theirs; a naive fetch leaks the slot index, PIR-read fixes it. PRIOR ART: Talek (ACSAC 2020; oblivious logging, pseudorandom log positions from a shared secret, PIR-read; ~9,433 msgs/sec at 32,000 users, 1.7s latency; read cost LINEAR in the log; Cheng, Krohn et al.). This is where the search-scale frontier lives.",
   "actors": "Talek (Cheng, Krohn et al.)",
   "links": [
    {
     "label": "Talek (eprint 2020/066, ACSAC'20)",
     "url": "https://eprint.iacr.org/2020/066"
    }
   ],
   "cluster": "returnpath"
  },
  {
   "id": "front_pirread_scale",
   "label": "PIR-read\nat scale",
   "cls": "frontier",
   "desc": "Talek's PIR-read is linear in the log; at search-corpus scale that does not hold. OPEN: shard/centroid-route the return-read the way Periscope routes search (sublinear, ~sqrt(N) bandwidth), so a recipient pulls their reply without scanning the whole mailbox. ALSO captures the second seam half: folding the recipient's collect-read into the IBLT auction as a SECOND message class in the ADCNet/Flashnet broadcast, with the risk that a class of different size/shape leaks via the auction. DESIGNED, not built.",
   "actors": "dmarz (Periscope-style); cf. Simkin sqrt-bandwidth trick (MEV-SBC 2025, unpublished -- defer specifics to Mark, do not cite a paper)",
   "open": "Can the return-read be sharded/centroid-routed to ~sqrt(N) bandwidth, and can collect-reads be folded into the IBLT auction as a second message class without the differing size/shape leaking via the schedule?",
   "links": [
    {
     "label": "Talek (eprint 2020/066, ACSAC'20)",
     "url": "https://eprint.iacr.org/2020/066"
    },
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "cap_corpus_ownership",
   "label": "Private-corpus\nsearch (SSE)",
   "cls": "capability",
   "desc": "The axis the corpus never enters: search over a PRIVATE corpus the client owns, not a public shared web index. You encrypt your documents, ship them to an untrusted server, and search via an encrypted index, accepting a NAMED leakage profile (access pattern, search pattern, volume) in exchange for near-plaintext, sublinear speed. The inverse bet to Periscope (public corpus, secret query, zero leakage, linear scan). This is the dominant academic paradigm for private search and the natural model for private-RAG-over-your-own-files, which the corpus flags as an open frontier but never staffs. Imports the leakage-tier vocabulary (L1/L2, response-revealing vs response-hiding) as the grading rubric for the whole map.",
   "actors": "SSE academia; Bost (Sophos); Cash-Grubbs-Perry-Ristenpart",
   "open": "Entirely unexplored in the corpus: SSE forward/backward privacy as a peer axis to public-index PIR.",
   "links": [
    {
     "label": "Sophos: Forward Secure SSE (eprint 2016/728)",
     "url": "https://eprint.iacr.org/2016/728"
    },
    {
     "label": "Cash-Grubbs-Perry-Ristenpart leakage-abuse (CCS'15)",
     "url": "https://eprint.iacr.org/2016/718"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fam_sse",
   "label": "Searchable\nsymmetric enc",
   "cls": "family",
   "desc": "Family realizing private-corpus search via an encrypted keyword index. Forward privacy hides which past searches a new update matches; backward privacy hides deleted documents. Members trade leakage tier against speed: response-revealing vs response-hiding, conjunctive vs single-keyword. Near-twin distributed-trust point is DORY (DPF over multiple servers, 1M docs ~862ms across 8 servers, eprint 2020/1280). The whole family is uncited in the corpus.",
   "actors": "Bost (Sophos, forward-private); Sun et al. (backward-private); DORY (Dauterman, Popa et al.)",
   "links": [
    {
     "label": "Sophos: Forward Secure SSE (eprint 2016/728)",
     "url": "https://eprint.iacr.org/2016/728"
    },
    {
     "label": "DORY (eprint 2020/1280, OSDI'20)",
     "url": "https://eprint.iacr.org/2020/1280"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fam_oram_index",
   "label": "ORAM oblivious\nindex",
   "cls": "family",
   "desc": "The third access-pattern-hiding mechanism beside PIR and SSE: an ORAM over an encrypted index hides which records are touched. Oblix's doubly-oblivious structures hide BOTH the server's view AND the in-enclave client's own memory accesses (12.7ms latency, tens of millions of records). Directly relevant to the TEE build plane: if an index ever runs inside an enclave, the enclave's memory accesses leak, and Oblix exists to close exactly that. Compass (Ring-ORAM walk of HNSW) is the one corpus citation; Oblix and Path ORAM are named once and deferred.",
   "actors": "Oblix (Mishra, Poddar, Popa, UC Berkeley); Compass (Zhu, Patel, Zaharia, Popa, OSDI'25)",
   "links": [
    {
     "label": "Oblix (S&P'18)",
     "url": "https://people.eecs.berkeley.edu/~raluca/oblix.pdf"
    },
    {
     "label": "Compass (eprint 2024/1255, OSDI'25)",
     "url": "https://eprint.iacr.org/2024/1255"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "opt_labeled_psi",
   "label": "Labeled PSI\n(keyword PIR)",
   "cls": "option",
   "desc": "The keyword/exact-match private-lookup interface the corpus flags as absent ('keyword/KV PIR is entirely absent') but never staffs with a primitive. Labeled PSI from FHE: the client privately learns whether its term is in the server's huge set and pulls the associated label (document/posting), with the unbalanced case (tiny client set, huge server set) being exactly the search query shape. Malicious-secure constructions exist (Microsoft APSI); recent work reaches O(sqrt|X|) homomorphic mults and sublinear comm. The PSI-as-symmetric-PIR equivalence connects it to sub-query sharding across non-colluding engines.",
   "actors": "Chen-Laine-Rindal (labeled PSI from FHE); Microsoft APSI",
   "links": [
    {
     "label": "Labeled PSI from FHE w/ Malicious Security (eprint 2018/787)",
     "url": "https://eprint.iacr.org/2018/787"
    },
    {
     "label": "microsoft/APSI",
     "url": "https://github.com/microsoft/APSI"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fr_private_rerank",
   "label": "Private\nlate-interaction",
   "cls": "frontier",
   "desc": "The only path to closing the quality tax past Tiptoe's single-dot-product ceiling. Every private-retrieval system in the corpus leans on one fact: dense scoring is a linear inner-product, exactly what LHE/PIR needs, which confines the field to a single nearest-neighbor stage. Periscope pays for it: top-10 overlap 0.56. Modern retrieval is multi-stage (ColBERT late-interaction MaxSim, cross-encoder rerank) and whether linearity survives is unknown. External search confirms NO published work on private ColBERT/MaxSim over encrypted embeddings; CKKS homomorphic top-k/sort exists but is brutal (Mazzone USENIX'25: argmax ~12.8s, sort ~78.6s for 128 elements). Genuinely greenfield. The agent re-prices it: seconds of HE-rerank that kill it for humans are an ordinary step for a patient agent.",
   "actors": "(open) dmarz; cf. ColBERTv2 (Khattab); Mazzone et al. (CKKS sort)",
   "open": "Does retrieval linearity survive ColBERT MaxSim or a cross-encoder rerank under HE, and is the CKKS-for-similarity + BFV/BGV-for-record-PIR split usable?",
   "links": [
    {
     "label": "ColBERTv2 (arXiv:2112.01488)",
     "url": "https://arxiv.org/abs/2112.01488"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fr_depir_gpu",
   "label": "Sublinear /\nGPU PIR",
   "cls": "frontier",
   "desc": "Two whole families that attack the per-node linear-scan complexity, both absent from the corpus, which escapes the single-node wall ONLY by adding nodes. DEPIR (doubly-efficient PIR) changes the complexity class: sublinear server compute after preprocessing (Okada/Player/Pohmann/Weinert EUROCRYPT'25 algebraic HE), but a fresh 2026 paper (eprint 2026/243) shows it still needs 733TB server state and 2^37 reads at N=2^23, so the wall is under attack but NOT beaten. GPU/in-memory PIR changes the constant by an order of magnitude (VIPIR ~163-233 qps with tensor cores, IM-PIR in-memory) and directly contradicts the corpus's 'compute is the wall, only add nodes' framing. Cheap to test against the live Periscope numbers.",
   "actors": "Okada/Player/Pohmann/Weinert (DEPIR); VIPIR; IM-PIR; PSE LeanPIR",
   "open": "Can GPU/in-memory PIR collapse the add-nodes-only scaling story on one box, or is per-node linear scan effectively fixed until DEPIR becomes practical?",
   "links": [
    {
     "label": "Algebraic HE / DEPIR (eprint 2024/1307, EUROCRYPT'25)",
     "url": "https://eprint.iacr.org/2024/1307"
    },
    {
     "label": "VIPIR (arXiv:2606.11536)",
     "url": "https://arxiv.org/abs/2606.11536"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "fr_traj_loop",
   "label": "Trajectory\nprivacy loop",
   "cls": "frontier",
   "desc": "The deepest original synthesis: for an agent the privacy unit is the trajectory, not the packet, accounted cumulatively (DP under continual observation), AND a bounded-optimal stopping rule is INCIDENTALLY a privacy mechanism (every query whose value-of-computation falls below cost never enters a log). Three pieces of the loop are unbuilt: (1) no online estimator for the marginal leakage l of the next query given the trace (it is the adversary's inference run by the defender); (2) no agent plans its query SEQUENCE to minimize cumulative leakage under a budget; (3) the stopping/footprint coupling is named as a clean open intersection and never quantified. No external work frames the stopping-as-privacy coupling. IntentMiner (~85% intent reconstruction from tool-call logs) is the adversary an l-estimator would run.",
   "actors": "(open) dmarz; cf. Dwork continual-observation DP; IntentMiner (Yao et al.)",
   "open": "Can the agent estimate l online and plan a leakage-minimizing trajectory under a budget, and how much privacy does the stopping rule buy as a function of query footprint?",
   "links": [
    {
     "label": "Dwork-Naor-Pitassi-Rothblum: DP Under Continual Observation (STOC'10)",
     "url": "https://dl.acm.org/doi/10.1145/1806689.1806787"
    },
    {
     "label": "IntentMiner (Yao et al., arXiv:2512.14166)",
     "url": "https://arxiv.org/abs/2512.14166"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "front_fleet_pir",
   "label": "Fleet-scale PIR\nvs re-linkage",
   "cls": "frontier",
   "desc": "Named the genuine crypto research problem to fund. The hint bargain that makes hint-based PIR cheap (Periscope's hint amortizing over a long-lived client) is backwards for agents: a shared offline hint is keyed to one DB snapshot, so sharing it across a fleet re-links every agent into one anonymity set (the hint epoch), and batching online queries makes them jointly correlatable. Per-agent hint = no linkage but no amortization; shared hint = amortization but linkage. The corpus's own patient-agent move (amortize the offline phase) may reintroduce the ID-channel leak it eliminated. Directly-relevant multi-client-PIR literature is uncited (Hafiz-Henry FC15 sublinear multi-client PIR; Zelda eprint 2025/1340; client-independent preprocessing PIR).",
   "actors": "(open); Hafiz-Henry (multi-client PIR); Zelda",
   "open": "Does client-independent or per-client-rerandomized preprocessing break the amortization=linkage coupling, or is the tension fundamental?",
   "links": [
    {
     "label": "Periscope (dmarzzz/private-re-search)",
     "url": "https://github.com/dmarzzz/private-re-search"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "prob_adversary_plane",
   "label": "Adversary\nplane",
   "cls": "problem",
   "desc": "The single biggest hole, flagged in the corpus's own ledger and getting worse where agents live. The corpus is defense-heavy and has almost no attack material; without the adversary plotted against each defense you cannot say WHEN any defense fails, so every 'this protects X' claim is unfalsified. Two empty halves: NETWORK attacks (website fingerprinting Deep Fingerprinting 98%/93.5% on defended Tor, flow correlation DeepCorr ~96% DeepCoFFEA ~93%, AS/BGP RAPTOR, statistical disclosure, SimAttack ~37%) and CRYPTO-SEARCH attacks (leakage-abuse Cash-Grubbs CCS'15, access-pattern recovery, volume/range full-DB reconstruction Kellaris/Grubbs, embedding inversion vec2text/ALGEN). Worse for agents: machine-regular jitter-free trajectories are a cleaner fingerprint, and agent-browser traffic grew 7,851% YoY.",
   "actors": "Sirinam (Deep Fingerprinting); Nasr (DeepCorr); Cash-Grubbs-Perry-Ristenpart (leakage-abuse); Morris (vec2text)",
   "open": "Build the cross matrix: each attack x each defense x deployability x agent-latency-tolerance; the most novel sub-region is timing-channel WF against a constant-cadence agent.",
   "links": [
    {
     "label": "Deep Fingerprinting (Sirinam et al., CCS 2018)",
     "url": "https://arxiv.org/abs/1801.02265"
    },
    {
     "label": "Leakage-Abuse Attacks Against Searchable Encryption (Cash-Grubbs-Perry-Ristenpart, CCS 2015)",
     "url": "https://eprint.iacr.org/2016/718"
    }
   ],
   "cluster": "adversary"
  },
  {
   "id": "prob_joint_benchmark",
   "label": "Joint J'\nbenchmark",
   "cls": "problem",
   "desc": "The corpus's most load-bearing UNMEASURED claim. The whole latency-tolerance flip is, by the corpus's own admission, an argument from mechanism cost sheets, not a measured operating point. No benchmark scores all three terms of the objective on one trajectory set: Cranfield/TREC scores relevance only; GAIA/BrowseComp/DeepResearch Bench score answer correctness only; none price leakage or cost. Until it exists the flip and the agent-reprices-the-map thesis are conjecture. Buildable now: take a real agent trajectory set (Ning et al. 2026, 14.44M requests / 3.97M sessions), run three adversaries as scorers (IntentMiner-style intent alignment, WF accuracy, IP-linkage), plot the operating point.",
   "actors": "(open) dmarz; cf. DeepResearch Bench (Du et al.); Ning et al. 2026 (Agentic Search in the Wild)",
   "open": "What is the actual measured operating point of the latency flip when U, c, and ℓ are scored jointly on real agent trajectories?",
   "links": [
    {
     "label": "DeepResearch Bench (Du et al., arXiv:2506.11763)",
     "url": "https://arxiv.org/abs/2506.11763"
    },
    {
     "label": "Agentic Search in the Wild (Ning et al., arXiv:2601.17617)",
     "url": "https://arxiv.org/abs/2601.17617"
    }
   ],
   "cluster": "adversary"
  },
  {
   "id": "prim_leakage_abuse",
   "label": "Leakage-abuse\nattacks",
   "cls": "primitive",
   "desc": "The crypto-search half of the adversary plane and the reason SSE needs forward/backward privacy at all. Canonical proofs that schemes hiding content but leaking access/search/volume pattern get broken: Cash-Grubbs-Perry-Ristenpart (CCS 2015), Islam-Kuzu-Kantarcioglu query recovery, Kellaris/Grubbs volume-based full-database reconstruction from range queries (succeeds past ~N^2/2 records), 2025 wave (VIOLIN volumetric injection, Peekaboo passive DSSE). Directly prices Periscope's two residual leaks (public centroid leaks coarse topic; contacted-shard set leaks topic) by analogy to volume-reconstruction bounds.",
   "actors": "Cash-Grubbs-Perry-Ristenpart; Kellaris-Kollios-Nissim-O'Neill; Grubbs-Lacharite",
   "links": [
    {
     "label": "Leakage-Abuse Attacks Against Searchable Encryption (Cash-Grubbs-Perry-Ristenpart, CCS 2015)",
     "url": "https://eprint.iacr.org/2016/718"
    }
   ],
   "cluster": "adversary"
  },
  {
   "id": "l_hebtor",
   "label": "HebTor",
   "cls": "alternative",
   "desc": "Near-exact uncited prior art for the reputation-gated onion egress (CCS 2020, 'Bypassing Tor Exit Blocking with Exit Bridge Onion Services'). Built short-lived exit bridges run AS Tor onion services (any device with outbound TCP, NAT/firewall-agnostic), a MICRO-PAYMENT system compensating operators, AND a PRIVACY-PRESERVING REPUTATION scheme preventing freeloading. Our egress + planned payment channel + DAppNode operators reinvents this lineage. Positioning against it isolates what is genuinely new (Semaphore+RLN epoch-nullifier anonymous rate-limiting; the uniform-exit-profile fingerprint normalization) from what HebTor already did.",
   "actors": "Zhang, Zhou, Sherr (Georgetown, ACM CCS 2020)",
   "links": [
    {
     "label": "HebTor: Bypassing Tor Exit Blocking with Exit Bridge Onion Services (Zhang, Zhou, Sherr, CCS 2020)",
     "url": "https://dl.acm.org/doi/10.1145/3372297.3417245"
    },
    {
     "label": "HebTor paper PDF (Georgetown SecLab)",
     "url": "https://seclab.cs.georgetown.edu/papers/zhao-exitbridgeonions.pdf"
    }
   ],
   "cluster": "access"
  },
  {
   "id": "alt_confidential_vecdb",
   "label": "Confidential\nvector DB",
   "cls": "alternative",
   "desc": "The industry's actually-shipping bet on private retrieval for agents, the direct commercial competitor to Periscope's TEE-build-plane bet, dismissed in the corpus in one line. Periscope uses a TEE only for BUILD-integrity and argues query privacy needs no TEE. The confidential-vector-DB camp makes the opposite bet: put the whole index AND the query inside the enclave and trust the chip for confidentiality (TDX-resident Qdrant/Milvus + cosine in-enclave, CyborgDB encrypted-vector ANN, OPAQUE confidential agentic RAG). The four-direction taxonomy (crypto / TEE / anonymization / split-learning) is the clean top-level partition of private retrieval the corpus lacks.",
   "actors": "CyborgDB; OPAQUE; TDX-resident vector DBs",
   "links": [
    {
     "label": "CyborgDB (encrypted vector DB)",
     "url": "https://www.cyborg.co/"
    },
    {
     "label": "cyborginc/cyborgdb-go",
     "url": "https://github.com/cyborginc/cyborgdb-go"
    }
   ],
   "cluster": "search"
  },
  {
   "id": "alt_zkpaychan",
   "label": "zk payment\nchannel",
   "cls": "alternative",
   "cluster": "access",
   "desc": "The obvious way to pay anonymously, and why it does NOT work here: a zk payment channel hides the interior, but opening/closing on-chain exposes a public (payer, payee, amount, time) edge, and settlement + routing/timing correlation reconstruct the who-pays-whom graph the comms layer just hid. zk hides the interior, leaks at the boundary. Rejected in favour of value-carrying anonymous credentials (ACT).",
   "actors": "zk-PCN (Qin et al.)",
   "links": [
    {
     "label": "zk-PCN graph leakage (arXiv:2208.09716)",
     "url": "https://arxiv.org/abs/2208.09716"
    }
   ]
  }
 ],
 "edges": [
  {
   "id": "stub_onchain_g_txn_requires",
   "source": "stub_onchain",
   "target": "g_txn",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_meta_g_txn_requires",
   "source": "cap_meta",
   "target": "g_txn",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "stub_privinf_g_llm_requires",
   "source": "stub_privinf",
   "target": "g_llm",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_meta_g_llm_requires",
   "source": "cap_meta",
   "target": "g_llm",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_pay_inf_g_llm_requires",
   "source": "cap_pay_inf",
   "target": "g_llm",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_returnpath_g_llm_requires",
   "source": "cap_returnpath",
   "target": "g_llm",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_oblsearch_g_search_requires",
   "source": "cap_oblsearch",
   "target": "g_search",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_meta_g_search_requires",
   "source": "cap_meta",
   "target": "g_search",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_pay_search_g_search_requires",
   "source": "cap_pay_search",
   "target": "g_search",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_returnpath_g_search_requires",
   "source": "cap_returnpath",
   "target": "g_search",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_payments_cap_pay_search_requires",
   "source": "cap_payments",
   "target": "cap_pay_search",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_payments_cap_pay_inf_requires",
   "source": "cap_payments",
   "target": "cap_pay_inf",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_cover_cap_meta_requires",
   "source": "cap_cover",
   "target": "cap_meta",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "fam_transport_cap_meta_realizes",
   "source": "fam_transport",
   "target": "cap_meta",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "t_tor_fam_transport_member",
   "source": "t_tor",
   "target": "fam_transport",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "t_nym_fam_transport_member",
   "source": "t_nym",
   "target": "fam_transport",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "t_dcnets_fam_transport_member",
   "source": "t_dcnets",
   "target": "fam_transport",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_cover_t_nym_requires",
   "source": "cap_cover",
   "target": "t_nym",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_cover_t_dcnets_requires",
   "source": "cap_cover",
   "target": "t_dcnets",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "l_zip_t_dcnets_member",
   "source": "l_zip",
   "target": "t_dcnets",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "l_zip_l_flash_requires",
   "source": "l_zip",
   "target": "l_flash",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "b_adcnet_l_flash_realizes",
   "source": "b_adcnet",
   "target": "l_flash",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "t_dcnets_front_rounds_parallel_creates",
   "source": "t_dcnets",
   "target": "front_rounds_parallel",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "front_rounds_parallel_cap_meta_requires",
   "source": "front_rounds_parallel",
   "target": "cap_meta",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "fam_transport_prob_ip_poisoning_creates",
   "source": "fam_transport",
   "target": "prob_ip_poisoning",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "prim_semrln_sol_gateway_requires",
   "source": "prim_semrln",
   "target": "sol_gateway",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_payments_sol_gateway_requires",
   "source": "cap_payments",
   "target": "sol_gateway",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "front_issuance_cost_sol_gateway_requires",
   "source": "front_issuance_cost",
   "target": "sol_gateway",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "front_portability_linkage_sol_gateway_requires",
   "source": "front_portability_linkage",
   "target": "sol_gateway",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "sol_gateway_prob_ip_poisoning_handles",
   "source": "sol_gateway",
   "target": "prob_ip_poisoning",
   "type": "handles",
   "label": "partially handles",
   "cross": true
  },
  {
   "id": "front_issuance_cost_sol_gateway_blocks",
   "source": "front_issuance_cost",
   "target": "sol_gateway",
   "type": "blocks",
   "label": "no true Sybil resistance",
   "cross": true
  },
  {
   "id": "front_portability_linkage_sol_gateway_blocks",
   "source": "front_portability_linkage",
   "target": "sol_gateway",
   "type": "blocks",
   "label": "conjectured-blocks",
   "cross": true
  },
  {
   "id": "sol_gateway_cap_meta_realizes",
   "source": "sol_gateway",
   "target": "cap_meta",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "fam_sybil_front_issuance_cost_requires",
   "source": "fam_sybil",
   "target": "front_issuance_cost",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "proto_act_kvac_cap_payments_realizes",
   "source": "proto_act_kvac",
   "target": "cap_payments",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "prim_kvac_proto_act_kvac_requires",
   "source": "prim_kvac",
   "target": "proto_act_kvac",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "proto_act_kvac_frontier_nullifier_binding_creates",
   "source": "proto_act_kvac",
   "target": "frontier_nullifier_binding",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "frontier_nullifier_binding_cap_payments_blocks",
   "source": "frontier_nullifier_binding",
   "target": "cap_payments",
   "type": "blocks",
   "label": "",
   "cross": true
  },
  {
   "id": "b_periscope_cap_oblsearch_realizes",
   "source": "b_periscope",
   "target": "cap_oblsearch",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "fam_pir_b_periscope_requires",
   "source": "fam_pir",
   "target": "b_periscope",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "alt_wally_fam_pir_alt",
   "source": "alt_wally",
   "target": "fam_pir",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_cover_alt_wally_requires",
   "source": "cap_cover",
   "target": "alt_wally",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_meta_alt_wally_requires",
   "source": "cap_meta",
   "target": "alt_wally",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "pr_pir_lb_fam_pir_requires",
   "source": "pr_pir_lb",
   "target": "fam_pir",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "pr_pir_lb_fr_hintrefresh_creates",
   "source": "pr_pir_lb",
   "target": "fr_hintrefresh",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "pr_pir_lb_fr_agentcost_creates",
   "source": "pr_pir_lb",
   "target": "fr_agentcost",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "fr_hintrefresh_b_periscope_blocks",
   "source": "fr_hintrefresh",
   "target": "b_periscope",
   "type": "blocks",
   "label": "",
   "cross": true
  },
  {
   "id": "fr_agentcost_b_periscope_blocks",
   "source": "fr_agentcost",
   "target": "b_periscope",
   "type": "blocks",
   "label": "",
   "cross": true
  },
  {
   "id": "cap_authwrite_cap_returnpath_requires",
   "source": "cap_authwrite",
   "target": "cap_returnpath",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_oblread_cap_returnpath_requires",
   "source": "cap_oblread",
   "target": "cap_returnpath",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_meta_cap_returnpath_requires",
   "source": "cap_meta",
   "target": "cap_returnpath",
   "type": "requires",
   "label": "",
   "cross": true
  },
  {
   "id": "front_pirread_scale_cap_oblread_requires",
   "source": "front_pirread_scale",
   "target": "cap_oblread",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "cap_corpus_ownership_g_search_alt",
   "source": "cap_corpus_ownership",
   "target": "g_search",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "fam_sse_cap_corpus_ownership_realizes",
   "source": "fam_sse",
   "target": "cap_corpus_ownership",
   "type": "realizes",
   "label": "",
   "cross": false
  },
  {
   "id": "fam_oram_index_cap_corpus_ownership_member",
   "source": "fam_oram_index",
   "target": "cap_corpus_ownership",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "prim_leakage_abuse_fam_sse_creates",
   "source": "prim_leakage_abuse",
   "target": "fam_sse",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "opt_labeled_psi_fam_pir_alt",
   "source": "opt_labeled_psi",
   "target": "fam_pir",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "fr_private_rerank_b_periscope_blocks",
   "source": "fr_private_rerank",
   "target": "b_periscope",
   "type": "blocks",
   "label": "blocks",
   "cross": true
  },
  {
   "id": "pr_pir_lb_fr_depir_gpu_creates",
   "source": "pr_pir_lb",
   "target": "fr_depir_gpu",
   "type": "creates",
   "label": "creates",
   "cross": true
  },
  {
   "id": "fr_depir_gpu_fam_pir_alt",
   "source": "fr_depir_gpu",
   "target": "fam_pir",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "fr_traj_loop_g_search_requires",
   "source": "fr_traj_loop",
   "target": "g_search",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "front_fleet_pir_b_periscope_blocks",
   "source": "front_fleet_pir",
   "target": "b_periscope",
   "type": "blocks",
   "label": "blocks",
   "cross": true
  },
  {
   "id": "front_fleet_pir_cap_meta_requires",
   "source": "front_fleet_pir",
   "target": "cap_meta",
   "type": "requires",
   "label": "",
   "cross": false
  },
  {
   "id": "prob_adversary_plane_cap_meta_blocks",
   "source": "prob_adversary_plane",
   "target": "cap_meta",
   "type": "blocks",
   "label": "blocks",
   "cross": true
  },
  {
   "id": "prim_leakage_abuse_prob_adversary_plane_member",
   "source": "prim_leakage_abuse",
   "target": "prob_adversary_plane",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "prob_adversary_plane_b_periscope_blocks",
   "source": "prob_adversary_plane",
   "target": "b_periscope",
   "type": "blocks",
   "label": "blocks",
   "cross": true
  },
  {
   "id": "prob_joint_benchmark_fr_traj_loop_blocks",
   "source": "prob_joint_benchmark",
   "target": "fr_traj_loop",
   "type": "blocks",
   "label": "blocks",
   "cross": true
  },
  {
   "id": "l_hebtor_sol_gateway_alt",
   "source": "l_hebtor",
   "target": "sol_gateway",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "alt_confidential_vecdb_cap_oblsearch_alt",
   "source": "alt_confidential_vecdb",
   "target": "cap_oblsearch",
   "type": "alt",
   "label": "",
   "cross": true
  },
  {
   "id": "l_flash_t_dcnets_member",
   "source": "l_flash",
   "target": "t_dcnets",
   "type": "member",
   "label": "",
   "cross": false
  },
  {
   "id": "t_tor_cap_returnpath_realizes",
   "source": "t_tor",
   "target": "cap_returnpath",
   "type": "realizes",
   "label": "sync rendezvous",
   "cross": false
  },
  {
   "id": "t_nym_cap_returnpath_realizes",
   "source": "t_nym",
   "target": "cap_returnpath",
   "type": "realizes",
   "label": "SURBs",
   "cross": false
  },
  {
   "id": "alt_zkpaychan_cap_payments_alt",
   "source": "alt_zkpaychan",
   "target": "cap_payments",
   "type": "alt",
   "label": "leaks graph",
   "cross": true
  }
 ]
};
