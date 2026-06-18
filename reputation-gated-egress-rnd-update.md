---

- metadata

    timestamp: 2026-06-08T00:00:00
    source: internal
    status: routed
    type: readout
    title: "Reputation-Gated Egress: PoC Readout"
    routed_to: privacy-tee
    tags: anonymous-broadcast, egress, tor, zk, semaphore, rln, flashnet, distribution, agentic, privacy
    author:

    - dmarz
    domain: flashbots

---

## ⚡ 1. Document Purpose

A single-page readout of the anonymous-broadcast jams from the last two weeks, plus the proof of concept I built and deployed off the back of them. It exists to make a new line of work legible before it gets a permanent track page: what the jams concluded, what I built, what the benchmarks say, and what is still open.

This sits under **Privacy & TEE → Network Coordination** on the Flashbots R&D & Product Roadmap, alongside Flashnet and Mosaik. It does not resolve protocol design. The unresolved questions are named explicitly in Section 8.

---

## 🤖 2. Thesis

Some people in the Shape Rotator program route their agents through Tor to anonymize traffic from the agent to the clearnet. Internally our rough position on Tor is two-part:

1. **Long-term compromised.** A global passive adversary running a few intro and exit nodes defeats the anonymity set.
2. **Latency.** Three hops through Tor is not usable for our latency-sensitive use cases.

The new data point: even if you accept (1) and (2) for your agent, you hit a third wall. **Most Tor exit IPs are blocked**, especially by Cloudflare and Akamai. Tor makes this trivial for the blocker by publishing a bulk dump of every exit IP at [check.torproject.org/torbulkexitlist](https://check.torproject.org/torbulkexitlist). I benchmarked it. A large share of the bigger search engines block the traffic outright.

The thesis that came out of the jam: **the fix is reputation, not more hops.** Replace the open Tor exit set with a reputation-gated egress that only proven members can use, so the shared IP pool cannot be poisoned by spam.

---

## 🧱 3. Why This Matters for Flashnet Distribution

This is the part that is directly load-bearing for product. Even in the event we ship the most ideal anonymous-broadcast primitive for our use case (i.e. Flashnet), we still end up with people spamming the channel and **poisoning our IPs**. Phil has alluded to this by arguing we need to bootstrap the consortium that becomes our initial node set. That helps, but a fixed consortium can still be poisoned from the inside.

Reputation gating is the candidate answer: a node set whose egress is metered by who you can prove you are, not by who can reach the endpoint. It is a plausible first stepping stone for distributing Flashnet, upgradeable over time as the design and use case solidify.

---

## 🔬 4. Evidence: Tor Exit Blocking Benchmark

Pre-registered benchmark of how often search engines and websites block Tor exit IPs.

- **Scope:** 392 requests across 70 Tor exits.
- **Finding:** niche engines block roughly 0 percent; walled engines (the larger, Cloudflare/Akamai-fronted ones) block in the 87 to 100 percent range. The real axis is the anti-bot wall, not engine size.
- **Mechanism:** the bulk exit list makes Tor exits a known, enumerable IP set that any CDN can deny by default.

Report: see Field Log.

---

## 🛡️ 5. The Design: Reputation-Gated Egress

Instead of using the existing open Tor exit nodes, stand up a new egress that **accepts a zk proof that the caller is part of a member set permitted to use these nodes.** Eventually you layer a payment channel on top so members pay for egress bandwidth.

Components in the proof of concept:

- **zk identity:** a basic instantiation of **Semaphore** (the same primitive World and ZuPass use for zk identity).
- **Anti-spam:** a **Rate Limiting Nullifier (RLN)** derived from that identity, so no member can spam the egress and poison the IPs. Exceeding the rate reveals the spammer's secret.
- **Routing:** integrates with a **Tor rendezvous service** so the egress operator never learns the originator. The agent reaches a rendezvous point, the rendezvous reaches the reputation-gated egress, the egress hits the clearnet.

**Hop topology (and its honest cost):** 3 hops to the rendezvous, then 3 hops to the egress, then the clearnet, then the whole path traces back. That is 6 hops of onion routing wrapping each request. This is where the latency in Section 6 comes from.

---

## 📊 6. PoC State and Benchmark

**Built, deployed, and used this past weekend.** It is a deliberately simple demonstration, not production.

Initial benchmark, roughly 1,000 requests to Google through the deployed egress:

| Metric | Direct | Reputation-Gated Egress |
| --- | --- | --- |
| Median latency | 0.15s | 1.9s |
| p99 latency | n/a | ~9s |

These latencies are not suitable for latency-game HFT orderflow. For interacting with Railgun or public search engines from an agent, I believe they are tolerable. The agent is patient where a human is not, which is exactly what makes the 6-hop cost affordable here.

---

## 🧪 7. Heilmeier Catechism: Reputation-Gated Egress

**1. What are you trying to do?**
Give an agent a way to reach the clearnet (search engines, Railgun) without revealing who is asking, over egress nodes that only authorized members can use, so the shared IP pool cannot be poisoned by spam.

**2. How is it done today, and what are the limits?**
Today people route through open Tor exit nodes or commercial residential-proxy providers. Tor exits are published in bulk and widely blocked. Residential proxies do not preserve privacy and are frequently sourced unethically (see Section 9). Both share an open-commons IP-poisoning problem.

**3. What is new in the approach, and why will it succeed?**
Membership is proven with a Semaphore zk proof; abuse is bounded with an RLN so no member can spam; routing rides a Tor rendezvous so the operator never sees the originator. The IP pool is gated by reputation, not reachability, which is the property the open Tor set lacks.

**4. Who cares?**
Flashnet distribution. An ideal anonymous-broadcast product still fails in the wild if its IPs get poisoned and blocked. This is a candidate substrate for shipping it.

**5. What are the risks?**
Sybil resistance and key distribution for the member set. The egress operator remains a single in-path observer at the exit unless it runs in a TEE. Blockers may escalate and deny the new egress IPs once they are known. Payment-channel design is unspecified.

**6. What does it cost?**
Latency. Median 1.9s vs 0.15s direct, p99 ~9s, 6 hops. Fine for non-HFT; wrong tool for latency-game orderflow.

**7. How long did it take / will it take?**
PoC built and deployed in a weekend. The remaining work is protocol design (membership, payments, TEE), not a demo gap.

**8. What are the exams?**
- Block-rate of the gated egress vs raw Tor over the same engine set and request count.
- Sustained throughput under simulated member spam with RLN enabled (does the nullifier actually hold the IPs clean).
- Latency distribution at higher concurrency, not just the 1k-request pilot.
- External review of the Semaphore + RLN instantiation.

---

## 📒 8. Honest Scope Ledger

| Status | Item |
| --- | --- |
| ✅ Built and deployed | Semaphore membership proof; RLN rate-limit; Tor-rendezvous routing to a single reputation-gated egress; ~1k-request Google benchmark |
| 📐 Designed, not built | Payment channel for metered egress; multi-operator consortium egress set |
| ❓ Open | Membership governance and key distribution; TEE for the egress; whether gated egress IPs survive blocker escalation; sybil resistance of the member set; payment mechanism |

---

## 🌐 9. Distribution and Adjacent Research

**DAppNode as a distribution point.** Someone in the jam is close with DAppNode. They have roughly 4,000 home stakers deployed. We could package this egress and have them run it for a small payment to use their bandwidth. That turns a node-set bootstrap problem into a packaging-and-incentive problem against an existing operator base.

**Residential proxy market research.** I did a full pass on existing residential-IP proxy providers and marketplaces. Too much to summarize here, but the headline: essentially all existing solutions do not preserve privacy at best, and at worst are unethical, with end devices routing other people's traffic without knowing it. This is the bar the reputation-gated egress has to clear, and clearing it is most of the point. Full taxonomy in Field Log.

---

## 🧭 10. Relationship to Roadmap and Naming

Proposed naming-registry entry for this work:

| Canonical ID | Internal Name | Protocol Family | What It Is (one line) | Layer | Stage |
| --- | --- | --- | --- | --- | --- |
| `reputation-gated-egress` | Reputation-Gated Egress | Network Coordination | zk-membership-gated, RLN-rate-limited anonymizing egress for agent traffic to the clearnet | protocol | poc |

Feeds: Flashnet (distribution substrate), Mosaik (shared privacy primitives). Lives under the forthcoming Anonymous Broadcast track page.

---

## 🔜 11. Next Steps

The open work lives mostly in the protocol-design realm:

1. **Membership.** How is the member set defined, governed, and rotated. How are keys distributed without re-introducing a linkage point.
2. **Payments.** Payment-channel design for metered egress. What unit, what settlement.
3. **TEE.** Should the egress run inside a TEE so the exit operator cannot observe in-path traffic. This is the question that connects this work back to FlashBox / DStack.

I am optimistic this path is a real initial stepping stone for distributing Flashnet, upgradeable over time as the design and use case solidify.

---

## 🎭 12. Combined Design: Uniform Exit Profile

This section extends the egress with an application-layer anonymity capability, prompted by a parallel thread with pcaversaccio and Vitalik on User-Agent and header fingerprinting. The reputation-gated egress hides **who** is asking at the network layer. It does nothing yet about **what you look like** at the application layer: the User-Agent, Accept-Language, header order, and TLS fingerprint that a website or observer uses to correlate sessions and shrink the anonymity set even when the IP is hidden.

### 12.1. The insight

pcaversaccio wants a browser that "literally mixes all the tracked shit." Vitalik asked whether it should instead be "a service everyone passes through which mixes metadata." We already built that service. The egress is a shared chokepoint that authenticated members route through and that re-originates requests to the clearnet. That makes it the correct place to normalize the fingerprint, not the client.

This turns the hardest result in the fingerprinting literature into a non-issue. The dominant attack on client-side spoofing (Vastel's FP-Scanner) is detecting **inconsistency** between a claimed User-Agent and the actual TLS stack, header order, and behavior. Every naive spoofer fails this way. But if the egress makes the real outbound request, the User-Agent, header order, TLS/JA3, and HTTP/2 framing all originate from one place and are inherently consistent. There is no lie to detect. Uniformity comes for free, and the anonymity set equals the member set.

### 12.2. Why uniformity, not randomization

The research splits into two schools:

- **Uniformity** (Tor Browser, Mullvad): make every user byte-identical. Maximizes the anonymity set.
- **Randomization** (Brave "farbling"): perturb values per session. Defeats commercial cross-site tracking but gives **no anonymity set**, each user stays unique, just unpredictable.

The numbers favor uniformity for an anonymity goal. Eckersley's Panopticlick (2010, n=470k) measured a full browser fingerprint at 18.1 bits of entropy, with 83.6 percent of browsers uniquely identifiable (94.2 percent with Flash/Java); User-Agent alone carried 10.0 bits. The decisive counterpoint is Gomez-Boix (2018, n=1.8M real fingerprints): at representative scale, uniqueness drops to 35.7 percent desktop and 18.5 percent mobile, and per-attribute entropy falls with it (User-Agent 10.0 to 7.2 bits, Accept-Language 5.9 to 2.7 bits). That is the strongest evidence that blending into a large real crowd works, and that the crowd does the work, not the obfuscation. Meanwhile randomized fingerprints are both internally inconsistent (FP-Scanner detects the lie) and a per-request value is itself linkable (FP-Stalker: 34 percent of fingerprints stay linkable after six months). So the right move is a single shared profile, exactly what pcaversaccio concluded.

### 12.3. The design

1. **Normalize at the egress, not the client.** Members send a minimal canonical request. The egress strips and rewrites everything observable to one canonical profile before hitting the clearnet.
2. **The profile is the largest real crowd, not a "privacy" value.** This is the correction to the Tor mistake of shipping a standardized-looking value that itself flags you. Mimic current stable Chrome on Windows, tracked to the live version: User-Agent, `Accept` / `Accept-Encoding` / `Accept-Language: en-US,en`, exact Chrome header order and casing, a TLS ClientHello matched to that Chrome build (uTLS-style stack) so JA3/JA4 line up, and HTTP/2 SETTINGS and pseudo-header order matched to Chrome. This is also the Cloudflare answer: you are not a rare privacy UA, you are indistinguishable from the single largest browser population.
3. **Reputation does double duty.** The RLN already stops spam from poisoning the egress IPs. It now also defines and sybil-bounds the fingerprint anonymity set. Tor cannot bound or measure its userbase; we can. The same mechanism that stops IP poisoning stops an adversary from flooding fake clients to map the anonymity set.
4. **Localize client-side to kill the language leak.** This is the highest-value single fix. Accept-Language alone carries roughly 4 to 6 bits of entropy, so a non-English setting shrinks your anonymity set by 16x to 64x. pcaversaccio's instinct ("I would never set my lang settings to Italian") is exactly right, and now quantified. The fix: everyone exits as `en-US` so the wire stays uniform, and the agent translates the response locally. For an LLM agent this is nearly free and is a real edge over a browser. It is a cleaner version of Vitalik's "request in N languages, pick locally": request in one uniform language, localize after. The Italian leak never touches the wire.

### 12.4. Threat-layer split

| Layer | Leak | Handled by |
| --- | --- | --- |
| Network | Client IP, Tor-exit membership | Reputation-gated egress (existing) |
| Application metadata | UA, Accept-Language, header order, TLS/JA3, HTTP/2 fingerprint | Uniform exit profile (this section) |
| Content | Query text, LLM prompt, logged-in cookies | Out of scope here; pair with query-privacy layer (OHTTP / PIR from private-search) |
| Timing | Time-of-day, inter-request cadence | Egress batching / jitter, or cover traffic |

### 12.5. Honest scope ledger (uniform exit profile)

| Status | Item |
| --- | --- |
| ✅ Verified feasible (swarm) | TLS JA3/JA4 Chrome impersonation is solved in Go (uTLS, enetx/surf) and Python (curl-impersonate / curl_cffi), passing public reflectors (tls.peet.ws, ja3.zone) as of 2026. Matching Chrome's HTTP/2 (Akamai) SETTINGS + pseudo-header fingerprint is solved in Go via surf; HTTP/3/QUIC too. JA4's normalization (it strips GREASE and sorts fields) actually helps us: it punishes randomization, not exact mimicry, and we are mimicking exactly. |
| 📐 Designed, not built | Egress-side header/UA/TLS normalization to a canonical Chrome profile using a uTLS-style outbound stack; client-side localization; profile-version update pipeline tracking live Chrome releases |
| ❗ Confirmed hard (and why it needs the egress) | A perfect Chrome fingerprint from a datacenter IP is still challenged or blocked. Cloudflare and Akamai read the fingerprint hash alongside IP reputation and behavior. **This is the validation, not a problem:** the fingerprint layer is necessary but not sufficient, and the missing half is clean residential/mobile IPs, which is exactly what the egress's residential distribution plan (DAppNode home stakers, Section 9) provides. The two halves compose: uniform fingerprint + reputation-gated residential egress. Neither alone clears a major CDN. |
| ❓ Open / to verify | Profile-bucket count vs anonymity-set tradeoff (one global Chrome/Win profile vs a small set of Chrome/Win + Safari/iOS buckets); behavioral/session parity beyond protocol level; keeping pace with Chrome version drift |
| 🚫 Explicit non-goals | Browser JS surface (canvas, WebGL, fonts) is not applicable to a headless agent and is out of scope; content-layer identity is handled by a separate privacy layer |

### 12.6. Heilmeier delta (just the new layer)

**What:** make every member's clearnet request carry one identical, plausible, current-Chrome application-layer fingerprint, enforced at the egress.
**New:** consistency is structural because the egress originates the request, defeating FP-Scanner-style inconsistency detection that breaks client-side spoofers.
**Who cares:** closes the metadata-correlation channel that survives IP hiding; pcaversaccio's point that a UA or language leak "can perfectly destroy full on-chain privacy."
**Risk:** IP reputation may override a perfect fingerprint (open question above); a single profile may break device-class-sensitive sites; profile drift as Chrome ships new versions requires upkeep at the egress.
**Cost:** one canonical-profile update pipeline at the egress, plus a uTLS-style outbound stack. No per-client cost.
**Exam:** run the same query through (a) raw Tor, (b) the gated egress with default headers, and (c) the gated egress with the uniform profile, against a fingerprinting reflector (e.g. a JA3/HTTP2 echo service) and a Cloudflare-fronted target; measure distinguishability and challenge rate.

The one-liner for the thread: stop trying to make each client lie consistently, which it cannot, and make the shared egress tell one true story for everyone.

---

## 🗂️ Field Log

| Date | Title | Topic | Link |
| --- | --- | --- | --- |
| 2026-06-03 | Who blocks Tor? Measuring search-engine and website blocking of Tor exit IPs | Exit-blocking benchmark (392 reqs / 70 exits) | https://gist.github.com/dmarzzz/d09823f06e3d448c997d8bf678b87fa2 |
| 2026-06-04 | reputation-gated-onion-egress | PoC repo (Semaphore + RLN + Tor rendezvous) | https://github.com/dmarzzz/reputation-gated-onion-egress |
| 2026-06-02 | Residential proxy providers: a classification taxonomy | Market research | https://residential-proxy-report.vercel.app |
| 2026-06-04 | private-re-search | Full research corpus | https://github.com/dmarzzz/private-re-search |
| reference | Tor bulk exit list | The enumerable IP set blockers use | https://check.torproject.org/torbulkexitlist |
| 2010 | How Unique Is Your Web Browser? (Eckersley, Panopticlick) | ~18.1 bits fingerprint entropy, ~83-94% unique | https://coveryourtracks.eff.org/ |
| 2018 | Hiding in the Crowd (Gomez-Boix et al.) | 35.7% unique desktop / 18.5% mobile at 1.8M scale; Accept-Language entropy falls to 2.7 bits | https://hal.inria.fr/hal-01718234 |
| 2018 | FP-Stalker / FP-Scanner (Vastel et al.) | Fingerprint linkability over time; spoof-inconsistency detection | https://hal.inria.fr/hal-01652021 |
| tool | enetx/surf (Go) | Chrome JA3/JA4 + HTTP/2 + HTTP/3 impersonation | https://github.com/enetx/surf |
| tool | curl-impersonate / curl_cffi | Chrome TLS + HTTP/2 impersonation (Python/CLI) | https://github.com/lwthiker/curl-impersonate |
| reference | Swarm research outputs | UA/header randomization, foundational entropy, egress feasibility | ~/world_knowledge/reports/ua-*.md |

---

- Version history
    - **2026-06-08 (v2):** Added Section 12, the uniform exit profile combined design (egress-enforced canonical Chrome UA/TLS/HTTP fingerprint shared across the member set). Added the uniformity-vs-randomization rationale with verified Eckersley / Laperdrix / Gomez-Boix / Vastel figures (18.1 bits and 83.6% unique at lab scale falling to 35.7% at 1.8M scale; Accept-Language 4-6 bits = 16-64x anon-set cost; FP-Stalker 34% linkable after 6 months), the threat-layer split, an honest scope ledger and Heilmeier delta, and fingerprinting + tooling references. Swarm-verified the technical feasibility: TLS JA3/JA4 and Chrome HTTP/2 impersonation are solved (uTLS, enetx/surf, curl-impersonate); the one confirmed-hard item, IP reputation overriding a perfect fingerprint, is precisely what the egress's residential distribution (Section 9) addresses, so the two layers compose. Prompted by the pcaversaccio / Vitalik header-fingerprinting thread.
    - **2026-06-08 (v1):** Initial readout. Captures the two-week anonymous-broadcast jams, the Tor exit-blocking benchmark, the reputation-gated egress design (Semaphore + RLN + Tor rendezvous), the deployed PoC and its ~1k-request Google benchmark (median 1.9s / p99 ~9s vs 0.15s direct), the honest scope ledger, the DAppNode distribution angle, the residential-proxy market finding, the proposed naming-registry entry, and open protocol-design questions (membership, payments, TEE). *Awaiting feedback.*
