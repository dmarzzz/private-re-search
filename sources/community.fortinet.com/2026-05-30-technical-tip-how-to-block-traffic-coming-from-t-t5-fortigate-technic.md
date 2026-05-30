---
url: https://community.fortinet.com/t5/FortiGate/Technical-Tip-How-to-block-traffic-coming-from-TOR-exit-nodes/ta-p/190958
title: Technical Tip: How to block traffic coming from TOR exit nodes | Community
fetched_at: 2026-05-30T17:21:41
content_hash: sha1:4cef2c9b241c858dbbc1feb15b207244b24be45f
extractor: trafilatura
---

# Technical Tip: How to block traffic coming from TOR exit nodes

**Description**


This article describes how to block TOR traffic from the WAN to the LAN, by using the ISDB object. This ISDB object contains a list of all TOR exit nodes currently known and is updated by FortiGuard.


**Scope**


FortiGate.

**Solution**


Go to **Policy & Objects -> IPV4 Policy **and select '**Create New**'.

- Incoming interface: WAN.
- Outgoing interface: LAN.

Go to **Source -> Internet Service**, search for 'Tor' and select 'Tor-Exit node'.

When creating the policy is finished, place it as high in the policy list.

Since policy lookup is done from top to bottom, place this policy as high as possible to prevent traffic coming from TOR to run through all the other policies above it.

Application Control can be used as well:


**Blocking Tor traffic using the Application Control profile:**

- Go to
**Security Profiles**->**Application Control**and edit the App control profile. - Under Application Overrides, select
**Add Signatures**. - Search for Tor, then filter the results to show only the Proxy category. Two signatures will appear, one for the Tor client, one for web-based Tor2web & TorGuard.
- Highlight both signatures and select Use Selected Signatures.
- Both signatures now appear in the Application Overrides list, with the Action set to Block.




The references listed below on FortiGuard Labs provide additional details regarding the application control used in this article.



**Tor2Web**:[Application Control Tor2Web](https://fortiguard.fortinet.com/appcontrol/30452)


**TorGuard**:[Application Control TorGuard](https://www.fortiguard.com/appcontrol/44589)**Related article:**[Technical Tip: How to block Tor connections](https://community.fortinet.com/t5/FortiGate/Technical-Tip-How-to-block-Tor-connections/ta-p/316401)
