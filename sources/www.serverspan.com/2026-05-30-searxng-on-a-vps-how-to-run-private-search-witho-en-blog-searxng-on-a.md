---
url: https://www.serverspan.com/en/blog/searxng-on-a-vps-how-to-run-private-search-without-getting-rate-limited-into-uselessness
title: SearXNG on a VPS: how to run private search without getting rate-limited into uselessness - ServerSpan
fetched_at: 2026-05-30T17:22:38
content_hash: sha1:e9ab56babad71b7c222cc722cf46c57ce8be32f1
extractor: trafilatura
---

If your SearXNG instance works beautifully for a week and then slowly turns into a CAPTCHA magnet, an error page factory, or a search box that returns half the web only on lucky days, the problem is usually not raw CPU or RAM. The problem is that private metasearch only stays private and useful when three layers stay disciplined at the same time: your incoming client traffic, your reverse proxy, and your outgoing traffic toward upstream search engines. If any one of those layers is sloppy, your instance gets rate-limited into irrelevance.

The production-safe pattern is simple. Keep the instance private by default. Pass the real client IP through the reverse proxy correctly. Enable SearXNG’s limiter with Valkey. Keep trusted home, office, or VPN networks on a pass list instead of disabling protection globally. Keep your engine list lean. Back off aggressively when upstream engines start returning access-denied or CAPTCHA errors. If you have multiple legitimate egress paths, use them deliberately. If you do not, stop pretending one public VPS IP can behave like an infinite search gateway forever.

## What usually makes a SearXNG instance become useless

Most failed SearXNG deployments do not die because SearXNG itself is weak. They die because the operator treats it like a static website with a search box on top.

- The reverse proxy forwards the wrong client IP, so every user appears to be the proxy itself.
- The limiter is disabled, misconfigured, or missing Valkey, so bots and browser abuse hit the same public exit IP.
- The instance is exposed more widely than intended, but still configured as if it were truly private.
- Too many engines are enabled, so one user query fans out into a larger upstream footprint than necessary.
- Once engines start returning CAPTCHA or access-denied responses, the operator keeps hammering them instead of backing off.
- The VPS has only one clean egress path, but the instance is being used like a semi-public metasearch service.

That combination is what makes SearXNG feel “amazing in month one, annoying in month two, and pointless in month three”.

## The first rule: decide whether your instance is actually private

SearXNG has a distinction that people ignore too casually. A private instance and a public instance should not be treated the same way. In the settings, `public_instance: true`

enables behavior specifically meant for public-facing deployments. If you are building a personal, family, office, or VPN-only search portal, keep it private unless it is truly exposed to the open internet in a way that strangers can use.

That does not mean you should leave it unprotected. It means you should stop pretending that “internet-facing, but only friends know the URL” is the same thing as private. It is not.

A sane baseline in `settings.yml`

looks like this:

```
server:
secret_key: "replace-this-with-a-real-secret"
limiter: true
public_instance: false
valkey:
url: valkey://127.0.0.1:6379/0
```


This does two important things. It keeps the limiter active, and it avoids turning on public-instance behavior you do not need for a genuinely private deployment.

If you want the base host where you can control this stack properly, a [KVM VPS with full root access](https://www.serverspan.com/en/virtual-servers) is the correct home for it. This is not the kind of application you throw into a constrained shared environment and hope the network layer behaves.

## The second rule: your reverse proxy must tell the truth about the client

This is the most common silent failure. SearXNG’s limiter assigns requests to clients by IP. The docs are explicit that correct `X-Forwarded-For`

and `X-Real-IP`

handling is essential. If your reverse proxy forwards the wrong values, the limiter becomes useless or actively harmful.

If all requests appear to come from the proxy, one impatient user can trip limits for everyone. Worse, if you try to add NGINX rate limiting on top without fixing the client IP first, you make the problem twice as stupid.

For an NGINX reverse proxy in front of SearXNG on a dedicated subdomain, the critical part is not complicated:

```
server {
listen 443 ssl http2;
server_name search.example.com;
ssl_certificate /etc/letsencrypt/live/search.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/search.example.com/privkey.pem;
location / {
proxy_pass http://127.0.0.1:8080;
proxy_set_header Host $host;
proxy_set_header Connection $http_connection;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
}
```


If SearXNG is mounted under a subpath instead of a dedicated subdomain, you also need `X-Script-Name`

. The official docs show that explicitly. The blunt operational advice is simpler: do not use a subpath unless you have to. A dedicated subdomain is easier to reason about and harder to misroute.

If NGINX itself sits behind another proxy or load balancer, fix the real client IP before you add request limits. The NGINX real IP module exists for exactly that reason.

```
set_real_ip_from 10.0.0.0/8;
set_real_ip_from 192.168.0.0/16;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```


Without that, per-IP controls are theatre.

## The third rule: SearXNG’s limiter is not optional on an internet-facing instance

SearXNG’s own documentation is blunt about why the limiter exists. SearXNG passes queries to upstream engines, which means abusive traffic against your instance turns into abusive traffic from your server IP toward those engines. The result is predictable. Your server gets classified as a bot, challenged with CAPTCHA, or blocked outright.

The limiter is there to stop that chain reaction before upstream providers punish your VPS IP. But the limiter requires Valkey. Without it, you are missing the feature designed to stop one bad client from poisoning the whole instance.

A minimal local limiter configuration in `/etc/searxng/limiter.toml`

should at least define trusted proxies and, for genuinely trusted networks, a pass list:

```
[botdetection]
trusted_proxies = [
"127.0.0.0/8",
"::1",
"10.0.0.0/8",
"192.168.0.0/16",
]
[botdetection.ip_lists]
pass_ip = [
"10.8.0.0/24",
"192.168.1.0/24",
]
```


This is the right way to give your own VPN or LAN users breathing room. The wrong way is to disable limiter entirely because you got annoyed once while testing.

SearXNG’s bot-detection logic also distinguishes burst behavior, longer sliding windows, and API-style traffic separately. That matters because API-style requests are treated more strictly than normal HTML browsing. If you bolt browser extensions, automated suggestion requests, or scripted clients onto your private instance without understanding that, you can trip rate controls faster than you expect.

## The fourth rule: NGINX rate limits can help, but they are not a substitute for SearXNG’s limiter

NGINX can enforce request-rate limits per client IP using the leaky-bucket model. That is useful for slowing obvious bursts before they hit SearXNG. It is not a replacement for the application-level limiter, because NGINX does not know which upstream engines your query fanout is about to touch.

A practical front-door guardrail looks like this:

```
http {
limit_req_zone $binary_remote_addr zone=searxng_search:10m rate=2r/s;
server {
listen 443 ssl http2;
server_name search.example.com;
location = /search {
limit_req zone=searxng_search burst=8 nodelay;
proxy_pass http://127.0.0.1:8080;
proxy_set_header Host $host;
proxy_set_header Connection $http_connection;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
}
}
```


That kind of rate limit does not need to be aggressive on a private instance. Its job is to catch obvious spikes, not to turn your own search box into a nuisance. Let SearXNG make the more nuanced decisions after NGINX filters the dumbest traffic first.

## The fifth rule: keep the engine list lean

Every extra engine you enable expands your upstream footprint. One user query can already fan out into many outbound requests. If you enable too many engines “just in case”, you increase the chances of upstream friction without improving results proportionally.

This is one of the least glamorous performance wins in SearXNG. Be selective. Keep the engines you actually trust and use. Drop the dead weight. A private search instance is not a museum of every engine adapter the project supports.

If you need some engines only for trusted users, use SearXNG’s engine-token support instead of exposing everything to everyone. Private engines are a cleaner pattern than a bloated always-on engine list.

## The sixth rule: treat outbound egress as a real design decision

Most SearXNG guides obsess over the incoming side and barely discuss the outgoing side. That is backwards. Your search quality lives or dies on the egress path.

SearXNG supports outgoing proxies and source IP selection. If you have multiple legitimate egress options, SearXNG can distribute requests across them in round-robin, and retries can use a different proxy or source IP on each attempt. That matters when one upstream engine starts treating a single IP as noisy or suspicious.

A practical example looks like this:

```
outgoing:
request_timeout: 4.0
retries: 1
source_ips:
- 198.51.100.10
- 2001:db8:10::10
proxies:
https:
- socks5://127.0.0.1:9050
- socks5://127.0.0.1:9051
useragent_suffix: "contact: admin@example.com"
```


Use this responsibly. Multiple source IPs or proxies are a resilience tool for a legitimate private instance. They are not a license to turn one VPS into a scraping farm. If you abuse upstream engines harder, you will still end up blocked. You will just arrive there in a slightly more distributed way.

The `useragent_suffix`

detail matters more than people expect. The docs note that adding contact information can help if an engine wants to block you. That is not guaranteed mercy, but it is better than presenting as a faceless black box.

## The seventh rule: back off when upstream engines start complaining

If an upstream engine starts returning access denied or CAPTCHA errors, stop hammering it. SearXNG already gives you the controls to back off. Use them.

The search settings allow engine suspension after failures, and the documented defaults for `SearxEngineAccessDenied`

and `SearxEngineCaptcha`

are severe for a reason. Once a provider has started challenging your server IP, more retries are often just self-harm.

```
search:
ban_time_on_fail: 5
max_ban_time_on_fail: 120
suspended_times:
SearxEngineAccessDenied: 86400
SearxEngineCaptcha: 86400
```


You can tune those values, but the principle should stay the same. A healthy private instance backs off quickly when a source starts pushing back. It does not behave like a stubborn script.

## What to do when your VPS IP is already challenged

Once an engine has started presenting CAPTCHA from your server IP, you have two jobs. First, stop the behavior that got you there. Second, clear the challenge from the server’s own IP identity if the engine allows it.

SearXNG documents a practical way to solve that kind of challenge from the server’s IP using an SSH SOCKS tunnel:

`ssh -q -N -D 8080 user@your-vps.example.com`


Then point your browser at `socks5://127.0.0.1:8080`

, confirm the browser is using the VPS IP, and solve the upstream CAPTCHA as the server. This is first aid, not a permanent operating model. If you do not fix the upstream abuse pattern, the challenge will come back.

## The VPS layout we would actually trust

For a private SearXNG deployment that must stay useful over time, the layout we would trust is boring:

- Debian 12 or Ubuntu 24.04
- SearXNG in Docker Compose or a clean native install
- Valkey local to the host
- NGINX in front with truthful IP forwarding
- a dedicated subdomain such as
`search.example.com`

- a small, curated engine set
- limiter enabled, passlist only for truly trusted networks

That layout is not flashy. Good. Search privacy infrastructure should be calm, not clever.

If you are building a wider self-hosted stack around the same box, read [Managing Docker and Containers on a VPS](https://www.serverspan.com/managing-docker-and-containers-on-a-vps-best-practices-for-stability-and-performance). If you are still planning the host rather than hardening it, [Self Host Website Guide 2026](https://www.serverspan.com/self-host-website-guide-2026-the-complete-beginners-setup-architecture) is the better infrastructure-level companion. And if you want a VPS designed for this class of application from the start, [ServerSpan virtual servers](https://www.serverspan.com/en/virtual-servers) are the parent fit for the article because they give you the control layer this setup actually requires.

## Lockout and uselessness checklist

- Verify the reverse proxy passes the real client IP correctly.
- Verify SearXNG limiter is enabled and Valkey is actually reachable.
- Verify trusted proxies are defined correctly in
`limiter.toml`

. - Verify your own VPN or LAN is on a pass list if that is how trusted users connect.
- Trim unused engines.
- Check whether upstream engines are already suspended because of CAPTCHA or access-denied errors.
- If using multiple egress paths, verify they are actually being used.

The first commands worth running are simple:

```
curl -I https://search.example.com/
docker compose ps
docker compose logs --tail 200 searxng
redis-cli ping
valkey-cli ping
```


If your limiter is conceptually enabled but Valkey is missing, misaddressed, or dead, your instance is only pretending to be protected.

## The practical answer

Private search on a VPS does not become useless because SearXNG is flawed. It becomes useless because operators skip the traffic hygiene that the application expects. If the reverse proxy lies about the client IP, the limiter cannot protect you properly. If the limiter is missing Valkey, it cannot do the job it was built for. If the engine list is bloated, your upstream footprint grows for no good reason. If you ignore access-denied and CAPTCHA signals, you burn your own server IP faster.

Run SearXNG as a private service, not a hobbyist public gateway with optimistic settings. Keep the proxy honest. Keep the limiter real. Keep the engine list lean. Treat outbound egress as part of the design. Then your private search box stays useful instead of collapsing into a pretty interface that upstream engines no longer trust.

[SearXNG pe un VPS: cum rulezi căutare privată fără să fie limitată până devine inutilă](https://www.serverspan.ro/blog/searxng-pe-un-vps-cum-rulezi-cautare-privata-fara-sa-fie-limitata-pana-devine-inutila)

##### Source & Attribution

This article is based on original data belonging to serverspan.com blog. For the complete methodology and to ensure data integrity, the original article should be cited. The canonical source is available at: [SearXNG on a VPS: how to run private search without getting rate-limited into uselessness](https://www.serverspan.com/searxng-on-a-vps-how-to-run-private-search-without-getting-rate-limited-into-uselessness).
