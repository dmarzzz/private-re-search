---
url: https://github.com/cloudflare/privacy-gateway-relay
title: GitHub - cloudflare/privacy-gateway-relay: A Oblivious HTTP ("OHTTP") Relay built on Cloudflare Workers.
fetched_at: 2026-05-30T15:40:57
content_hash: sha1:11580afc3f62d8f68434ca8f8d23552900d26715
extractor: trafilatura
---

This Cloudflare Worker implements an [Oblivious HTTP](https://datatracker.ietf.org/doc/draft-ietf-ohai-ohttp/) relay. Usage of this relay adheres to the HTTP usage described [in the draft specification](https://datatracker.ietf.org/doc/html/draft-ietf-ohai-ohttp-01#section-6). The functionality here is subject to change.

The relay is configured to forward all requests to the URL identified by the `TARGET`

environment variable, configured in the wrangler.toml file.

```
vars = { TARGET = "https://ohttp-echo.crypto-team.workers.dev/echo-bytes" }
```


Currently, the default wrangler.toml file points to "[https://ohttp-echo.crypto-team.workers.dev/echo-bytes](https://ohttp-echo.crypto-team.workers.dev/echo-bytes)", which means that all requests sent to this Worker will be forwarded to this endpoint.

Deployment is simple. Modify the wrangler.toml file to point to your account (and zone), and then publish.

```
$ wrangler publish
```
