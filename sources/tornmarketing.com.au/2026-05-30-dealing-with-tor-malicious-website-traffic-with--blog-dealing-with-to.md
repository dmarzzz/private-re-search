---
url: https://tornmarketing.com.au/blog/dealing-with-tor-malicious-website-traffic-with-cloudflare
title: Dealing with TOR malicious website traffic with Cloudflare - Torn Marketing
fetched_at: 2026-05-30T17:22:02
content_hash: sha1:5328802d04db39d499d347382641aa64d211daf1
extractor: trafilatura
---

## What is Cloudflare

It is the leading service provider for managing the nuts and bots of front end website access.

We implement this platform on all of our clients and systems as it keeps real time security in check as a level 1 security measure.

- DNS (point your domain to your website)
- Firewall (Security access)
- Caching (speeding up your website)

## Setting your Cloudflare Security Level

The **Security Level** uses the IP reputation of a visitor to decide whether to present a challenge. A Cloudflare internal algorithm calculates an IP’s reputation and assigns a threat score that ranges from 0 to 100. The security levels and the challenge display criteria:

*High*– for scores greater than*0**Medium*– for scores greater than*14**Low*– for scores greater than 24- Essentially off – for scores greater than 49

You can adjust the **Security Level** for your domain in the **Firewall** app of the Cloudflare dashboard

Cloudflare recommends starting at a medium security level (the default setting) to adequately protect your site.

Tor

## Why might a Tor visitor be blocked or challenged?

Due to the behavior of some individuals using the Tor network (spammers, distributors of malware, attackers, etc.), the IP addresses of Tor exit nodes may earn a bad reputation, elevating their Cloudflare threat score.

Our basic protection level issues CAPTCHA-based challenges to visitors whose IP address has a high threat score, depending on the level chosen by the Cloudflare customer. The choices for security range from Essentially Off to I’m Under Attack. The default level is Medium.

## What additional control do Cloudflare customers have over traffic from visitors using Tor?

Since February 2016, Cloudflare treats Tor exit nodes as a “country” of their own. There’s no geography associated with these IPs, but this approach lets Cloudflare customers override the default Cloudflare threat score to define the experience for their Tor visitors.

Cloudflare updates its list of Tor exit node IP addresses every 15 minutes.

Control is in the **IP Firewall** > **Access Rules** panel of the Cloudflare dashboard **Firewall** app. *Learn more about Access Rules.*

The options for Tor are:

*Block –*blacklist*Challenge –*visible CAPTCHAchallenge, the visitor must interact with it to pass*Whitelist*– trust*JavaScript*Challenge – visible challenge with less friction, testing the browser

Cloudflare uses the two-letter code T1 for Tor.

Here’s an example where a Cloudflare customer chooses in their dashboard to Whitelist Tor.

## What does a Tor visitor see when CAPTCHA is selected?

A Tor visitor to any Cloudflare site which has chosen to CAPTCHA (challenge) Tor will see a page like this and need to proceed through the CAPTCHA, which may have different actions required.

## What does a Tor visitor see when Blocked selected?

Tor visitors to a Cloudflare site which has chosen to Block Tor will see Error 1009, as shown below:

## What does a Tor visitor see when JavaScript Challenge selected?

Tor visitors to a Cloudflare site which has chosen JavaScript Challenge will see a page like this:

## Does Cloudflare support Onion Routing?

Beyond applying firewall filters to Tor traffic, Cloudflare users can improve the Tor user experience by enabling Onion Routing.

Onion Routing allows Cloudflare to serve your website’s content directly through the Tor network, without requiring exit nodes required. This improves Tor browsing as follows:

- Tor users no longer will access your site via exit nodes, which can sometimes be compromised, and may snoop on user traffic.
- Human Tor users and bots can be distinguished by our Onion services, such that CAPTCHA challenges are only served to malicious bot traffic.

You can toggle this setting on or off in the **Onion Routing** panel of the Cloudflare dashboard **Crypto** app.
