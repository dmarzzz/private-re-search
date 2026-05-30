---
url: https://www.akamai.com/blog/performance/act-against-geopiracy-with-enhanced-proxy-detection
title: Act Against Geopiracy with Enhanced Proxy Detection
fetched_at: 2026-05-30T17:22:16
content_hash: sha1:b63fa31151f090661cfb1b046acdce41e7bec45b
extractor: jina
---

Title: Act Against Geopiracy with Enhanced Proxy Detection

URL Source: https://www.akamai.com/blog/performance/act-against-geopiracy-with-enhanced-proxy-detection

Published Time: 2021-03-12T05:00:00Z

Markdown Content:
![Image 1: Sandeep Singh](https://www.akamai.com/site/en/images/blog/header-images/eng_header_image085.png)

## Widespread use of location spoofing to circumvent territorial content restrictions

Do you recognize this screen?

![Image 2](https://www.akamai.com/site/en/images/blog/2021/03/Geopiracy1-thumb-600xauto-12331.jpeg)

According to the description, the service is a virtual private network (VPN) desktop application and proxy browser extension that helps viewers mask their physical location, circumvent censorship, and restore access to blocked content.

The COVID-19 pandemic confined more people to their homes in 2020, significantly impacting the media and entertainment industry. As digital content viewership surged, so did online content piracy. Home audiences started using VPNs (like the one above) and Domain Name System (DNS) proxy services to circumvent territorial restrictions and access content not available in their regions.

In a SportsPro [interview](https://www.sportspromedia.com/from-the-magazine/bein-sports-yousef-al-obaidly-tv-rights-piracy-beoutq-premier-league-f1), BeIN Media Group CEO, Yousef Al-Obaidly, opens up about trying to keep a US$15 billion portfolio of sports rights from the clutches of a state-backed piracy operation, "We really relish the competition, [but] the worst thing for our whole industry is to have illegal competition, and by illegal competition, I mean piracy. It's not fair competition."

He goes on to say, "We should quadruple the investment into the anti-piracy infrastructure. We need to ensure that piracy is a top, top priority for the top management, and really engage the government on that issue, and of course, prosecute pirates."

There is a visible trend around the increasing use of VPNs and DNS proxies to spoof a user's location in order to access geographically restricted content. According to the [Global Web Index survey](https://insight.globalwebindex.net/hubfs/VPN-Usage-Around-the-World-Infographic.pdf?_ga=2.197139368.607082869.1616454596-1835170578.1616454596), the top motivation for VPN usage is "Accessing Better Entertainment Content" and figures suggest that 51% of all internet users are using VPNs for "Accessing Better Entertainment Content."

![Image 3](https://www.akamai.com/site/en/images/blog/2021/03/Image%202-thumb-900xauto-12333.jpeg)

## Geopiracy impacts rights holders obligations and revenue

This widespread use of location spoofing undermines the territorial business model that rights holders implement. Consumers of premium over-the-top (OTT) and traditional pay TV use geopiracy to access the services of foreign broadcasters that offer the same or better content at cheaper prices and with earlier release schedules.

![Image 4](https://www.akamai.com/site/en/images/blog/2021/03/geopiracy%203-thumb-600xauto-12336.jpeg)

Broadcasters and studios consider the use of VPNs and similar services to evade geoblocking by online viewers a violation of copyright laws for their online video services, as these services do not hold the rights to make their content available in the viewer's country. This results in media companies that license the content not meeting their contractual obligations with their rights holders.

Geo-based piracy also causes revenue loss as illegitimate users access content outside of the territorial regions, resulting in less competition for future broadcast rights and ultimately lower revenues for rights holders. Viewing pirated content also displaces legitimate viewing. According to a survey conducted by the University of Amsterdam's Institute for Information Law, when it came to watching "blockbuster movies," the displacement rate was 0.46, meaning that for every 10 pirated views, 4 to 5 legitimate views were lost.

## Blocking illegitimate geoviewership to meet contractual obligations

Measures to block users who are trying to access online video services from outside the legitimate territorial boundaries are critical for media companies that license the content to meet their contractual obligations with their rights holders. Viewers today have several options at their disposal to access content outside of their home territory -- the most popular are IP geo-based VPN and DNS proxy services.

Since many VPN and DNS proxy providers aggressively target major OTT platforms, a solution to block illegitimate users circumventing georestrictions is to screen the viewer's IP address against a highly accurate, updated database of known IP addresses used by the proxy services. If the IP address is recognized as a known data center that hosts the VPN connections, the viewer can be blocked or another appropriate action taken.

This IP address database should be refreshed frequently. In addition, the OTT service site may want to collaborate with the vendor to ensure that the scale and scope of tackling the geopiracy requirements are met, so the OTT services can maintain contractual obligations with rights holders.

## Enhanced proxy detection prevents unauthorized access

Akamai’s Enhanced Proxy Detection feature allows our customers to determine whether a requesting IP address is associated with a VPN service or an anonymous proxy and take action on users who are trying to access content from illegitimate regions.

Akamai has partnered with GeoGuard to incorporate its market-leading VPN/Smart DNS Proxy detection solution. GeoGuard's premium VPN/Smart DNS Proxy detection is now fully integrated with Akamai to offer Enhanced Proxy Detection for online streaming services. GeoGuard's solutions are based on the award-winning geolocation compliance and geoprotection technologies that are trusted by leading content owners and studios across the globe.

![Image 5](https://www.akamai.com/site/en/images/blog/2021/03/geopiracy%204-thumb-900xauto-12338.jpeg)

Akamai keeps checking the GeoGuard database at a specific frequency and, when an online user makes a request for a specific piece of content, we match the requesting IP information to the GeoGuard database information. If a match is found, the request can be allowed, denied, or redirected at a category level based on the local database lookup.

## Enhanced proxy detection features and functionality

The Enhanced Proxy Detection workflow consists of an application that is responsible for retrieving IP data from GeoGuard, performing safety checks to avoid the risk of blocking legitimate traffic based on third-party data, and converting the information into an input format for distribution within the Akamai Intelligent Edge Platform.

GeoGuard maintains a list of categories that are assigned to each illegitimate IP address. This list includes four Best Practices categories (Anonymous VPN, Public Proxy, Tor Exit Node, and Smart DNS Proxy) and two Advanced categories (Hosting Provider and VPN Data Center). Behavior is assessed against these categories to recognize that a request is coming from a proxy.

When an incoming IP address is mapped to one of the identified categories, three actions can be taken:

*   **Allow**lets the request through, and the action is logged; the logs can be audited later to determine if setting a different action may affect the traffic
*   **Deny** blocks all matching requests

*   **Redirect** sends the requests to an alternate URL provided in the redirect URL field

![Image 6](https://www.akamai.com/site/en/images/blog/2021/03/Geopiracy5-thumb-900x830-12340-thumb-450xauto-12343.jpeg)

## Allowlisting specific IP addresses

There may be instances when an IP address is misidentified as illegitimate, or even cases in which a legitimate user is on a network that you want to block. In these cases, allowlisting helps you enable content access for these specific IP addresses.

## Show my IP

To detect whether a VPN provider is selectively tunneling traffic to specific viewer endpoints to evade detection, the “Show My IP" feature provides visibility into a specific endpoint IP address in a customer domain that would normally be undetectable with a VPN.

## Header enrichment

Header Enrichment includes an additional header on requests that go forward to the origin that carries information about the category of the connecting IP address such as anonymous proxy.

## Support for hosting provider category

This category specifically includes IP addresses associated with cloud and content delivery network (CDN) providers to enhance the ingest workflow.

## Support for IPv6 datasets

Enhanced Proxy Detection supports both IPv4 and now, IPv6 addresses for all the Enhanced Proxy Detection categories under Best Practices and Advanced categories.

## Combating the hijacked residential IP threat

Many VPN providers have recently launched a new tactic to circumvent the detection of a VPN's datacenter IPs. By enticing users to download a "free" VPN, millions of people worldwide have unwittingly had their residential IP addresses hijacked by the "free" VPN provider (through complicated terms of service agreement) and sold to the highest bidder -- usually other VPNs that offer these addresses as a premium "undetectable" service.

Enhanced Proxy Detection works to combat hijacked residential IPs. The integration of GeoGuard's VPN/Smart DNS Proxy database with Akamai enables the broadcaster to do a secondary check on a viewer's IP address when the stream starts. It detects the change from the hijacked residential IP that was used to access the stream to the VPN's datacenter IP that was used to deliver the stream. Once the change is detected, the stream can be stopped.

## The way forward

[Almost 30%](https://insight.globalwebindex.net/hubfs/VPN-Usage-Around-the-World-Infographic.pdf?_ga=2.164584376.607082869.1616454596-1835170578.1616454596) of internet users have used a VPN or proxy server in the past month, with the likely predominant purpose of circumventing content geofiltering restrictions. Akamai’s Enhanced Proxy Detection provides a simple and effective method to ensure an enhanced level of content security to combat geolocation fraud and geopiracy.

Enhanced Proxy Detection is a capability within our [Adaptive Media Delivery](https://www.akamai.com/es/products/adaptive-media-delivery) solution. If you want to give Enhanced Proxy Detection a quick spin, start a [free trial](https://www.akamai.com/products) and see how easy it can be to manage contractual obligations with rights holders.

*   [DNS](https://www.akamai.com/blog?filter=blogs/dns)
*   [Delivery](https://www.akamai.com/blog?filter=blogs/delivery)
*   [Performance](https://www.akamai.com/blog?filter=blogs/performance)

![Image 7: Sandeep Singh](https://www.akamai.com/site/en/images/blog/userpics/sandeep-singh.png)

Written by

[Sandeep Singh](https://www.akamai.com/blog?author=sandeep_singh)

March 12, 2021

![Image 8: Sandeep Singh](https://www.akamai.com/site/en/images/blog/userpics/sandeep-singh.png)
