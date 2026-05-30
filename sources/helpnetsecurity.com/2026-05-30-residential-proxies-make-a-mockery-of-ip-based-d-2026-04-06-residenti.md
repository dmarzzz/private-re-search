---
url: https://helpnetsecurity.com/2026/04/06/residential-proxy-attack-traffic-ip-reputation-enterprise-security
title: Residential proxies make a mockery of IP-based defenses - Help Net Security
fetched_at: 2026-05-30T17:23:58
content_hash: sha1:e609e4d25557a1494cdf1a6febeddb27e85f2483
extractor: trafilatura
---

# Residential proxies make a mockery of IP-based defenses

[Attack traffic](https://www.helpnetsecurity.com/2026/03/03/cloudflare-cyber-threat-report-2026/) moved through ordinary home and mobile connections in ways that limited the usefulness of IP reputation on its own.

GreyNoise observed 4 billion malicious sessions during a 90-day period and described activity that appeared indistinguishable from normal user traffic at the network level.

Residential proxies routed traffic through consumer broadband, mobile data, and small-business connections. These same IP ranges were used by employees, customers, and partners, which made it difficult to separate malicious activity based on source address alone.

“Much of the security industry built defenses around the idea that you can determine intent from an IP address,” said [Ash Devata](https://www.linkedin.com/in/devata/), CEO, GreyNoise Intelligence. “This research proves that assumption is now broken at scale. Nearly 4 in 10 IPs hitting our sensors are residential IPs, indicating the scale with which home internet gear has been compromised. Attackers have weaponized the infrastructure we trust most, and every organization that relies on IP reputation as a primary defensive layer is exposed right now.”

### Short-lived IPs change detection conditions

Residential address space accounted for a large share of systems probing enterprise edges. These IPs appeared briefly, generated a small number of sessions, and then rotated out. Most residential IPs were observed only once or twice before disappearing.

This pattern limited the usefulness of reputation-based controls. IPs often rotated before they could be cataloged or shared through detection systems.

The activity remained widely distributed. A total of 683 ISP organizations contributed residential attack traffic, and no single network accounted for more than 8% of the total. The same providers carried both legitimate user traffic and malicious activity.

### Compromised devices supplied the infrastructure

Residential proxy traffic drew from compromised consumer systems. Separate populations contributed to this supply.

One group came from long-running worm infections on Windows systems. These infections continued scanning activity for extended periods without user awareness. Another group came from IoT devices such as routers and cameras that were recruited into botnets through default Telnet credentials.

The two groups operated independently. No overlap appeared between residential IPs involved in SMB worm activity and those involved in Telnet-based botnet recruitment, indicating distinct sources of activity.

### Device behavior appeared in traffic patterns

Some residential traffic reflected how compromised devices were used. GreyNoise observed that activity associated with home PCs in India declined during overnight hours, with a 34% drop between daytime peak and overnight trough during the observation period.

The report presented device power cycles as the most likely explanation and noted alternative factors such as IP reassignment and usage patterns.

In contrast, server-based SSH traffic from datacenters showed minimal variation, remaining within a narrow range during the day.

These patterns aligned with the presence of compromised consumer devices rather than dedicated attack infrastructure.

### Residential proxies supported reconnaissance activity

Residential IPs were primarily associated with scanning and reconnaissance. Only 0.1% of residential sessions carried exploitation payloads, compared with 1.0% from hosting infrastructure.

Residential proxies were used to probe exposed services, including enterprise VPN gateways. The data includes 33 residential IPs targeting VPN login pages and enterprise VPN client signatures appearing on 48 residential IPs interacting with edge systems.

The report described a pattern in which residential infrastructure was used to map targets, followed by activity from hosting environments.

“Residential proxies are nightmare fuel for defenders,” said [Andrew Morris](https://www.linkedin.com/in/andrew---morris/), Chief Architect at GreyNoise. “They flip every IP and geolocation-based defense on its head. AI content scrapers have massively driven up demand for these networks, and the businesses behind them are not thinking about security or abuse — the incentives are misaligned in a perfect storm. Nation-states are tunneling attack and C2 traffic through regular people’s phones during active conflict, and this is only going to get worse.”

### Disruption shifted infrastructure use

Disruption of large proxy networks produced short-term changes in activity. Researchers described the January 2026 [disruption of the IPIDEA network](https://www.helpnetsecurity.com/2026/01/29/ipidea-proxy-network-disrupted/), which reduced its capacity by about 40%.

Following that event, residential sessions linked to IPIDEA-associated fingerprints declined by 46% from December to February, while hosting-based sessions increased during the same period. The report described this shift as consistent with operators replacing lost residential capacity with datacenter infrastructure.

GreyNoise also noted that proxy networks tend to recover after disruption, with activity returning through new or reconstituted infrastructure.
