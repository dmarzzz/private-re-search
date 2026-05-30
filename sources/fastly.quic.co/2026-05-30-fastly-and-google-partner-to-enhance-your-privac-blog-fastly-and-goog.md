---
url: https://fastly.quic.co/blog/fastly-and-google-partner-to-enhance-your-privacy-while-protecting-chrome
title: Fastly and Google partner to enhance your privacy while protecting Chrome users from online threats in real-time | Fastly
fetched_at: 2026-05-30T15:40:57
content_hash: sha1:895108d36df8b7b5571690023315cb000d4a3a71
extractor: trafilatura
---

Google Safe Browsing provides Chrome users with protection from deceptive and harmful online content, and sketchy websites and links, such as phishing scams and malware. Our values have remained consistent, as Fastly is committed to enabling as many people as possible with the necessary tools and technologies needed to deliver secure, reliable, and rapidly scalable privacy-conscious online experiences – not only to our customers but their customers and end users as well. Which is why we’re [thrilled to partner with Google](https://security.googleblog.com/2024/03/blog-post.html) on this project.

Google is introducing two innovations in the most recent release of Standard protection mode for Safe Browsing in Chrome.

Real-time checks against the Google Safe Browsing service bring a more sophisticated level of browser safety to an expanded set of Chrome users.

Google is also partnering with Fastly to introduce an Oblivious HTTP (OHTTP) Relay integration at scale with an OHTTP Relay operated by Fastly sitting between Chrome and the Google Safe Browsing endpoint as a step forward in safeguarding user privacy.


Now, Fastly’s programmable edge cloud platform has made it possible for Google to improve user protection while also enhancing its users' privacy. For those reasons, Google Chrome is leveraging [ Fastly Oblivious HTTP (OHTTP) Relay](https://docs.fastly.com/products/oblivious-http-relay) to support the

[mode in Chrome.](https://support.google.com/chrome/answer/9890866)

__Standard protection__## Why partner with Fastly?

In addition to our highly programmable edge network, Fastly is already a trusted edge delivery provider for some of the largest brands on the internet, and we continue to offer our customers new products and technologies to help them scale services that require a leading edge cloud platform that could match their scale and technical prowess while managing user privacy. When partnering with Google, Fastly was identified as a trusted partner due to our long history of transparency, integrity, and inclusion to empower developers.

We developed our OHTTP Relay solution from the ground up, leveraging our flexible and resilient platform. The Fastly OHTTP Relay implements the Oblivious HTTP [ RFC 9458](https://datatracker.ietf.org/doc/rfc9458/) that allows Google and other OHTTP Relay customers to receive critical request data from end users while Fastly acts as a trusted third party to protect end users’ identifying metadata.

[page provides greater detail on our commitment to user privacy and supporting services.](https://www.fastly.com/solutions/customer-trust)

__Fastly’s Customer Trust__## How the Fastly OHTTP Relay works with Google

Fastly has created an OHTTP Relay service that leverages our global edge compute platform for easy extensibility and rapid scaling to meet business needs. With our partnership, Chrome can now perform Safe Browsing checks in real time while guaranteeing the privacy of its users. Google has partnered with Fastly as a trusted third party to anonymize URL requests from Chrome users before they are sent to Google’s Safe Browsing server. The Google Safe Browsing server receives anonymized requests to check URLs and cannot correlate them to specific users.

With OHTTP, Google Safe Browsing does not see your IP address, and your Safe Browsing checks are mixed amongst those sent by other Chrome users. This means Google Safe Browsing cannot correlate the URL checks you send as you browse the web. The double-blinded nature of the OHTTP service is essential for enabling user privacy: one layer handles end user identifying metadata (the Relay) while another handles the end user's request data (the Gateway).

The technology behind OHTTP is as follows:

## Leveraging Fastly’s Edge Compute Platform to build a global OHTTP Relay service

Working with Google to build a flexible and globally scalable implementation for their needs was an exciting, collaborative process. To ensure a secure connection between The Fastly OHTTP Relay and the Google OHTTP Gateway, we needed to build an application that authenticated the connection via OAuth and asynchronously revalidated the token without disrupting traffic flow or user experience. Building the logic for handling traffic and managing auth on a global scale is a great fit for the Fastly Compute platform’s ability to simultaneously connect to multiple backend systems. Fastly’s Compute ecosystem is built on top of WebAssembly ([ WASM](https://webassembly.org/)) for efficiency and flexibility and was able to meet Google’s performance, scale, and security needs without sacrificing the developer experience that Fastly is known for.

The Compute’s platform ecosystem was invaluable: we used Secret Store for first class, secure token storage, and KV store to retain frequently-used metadata from the token itself in an efficient way. Building our OHTTP Relay on our Compute platform allowed us to move quickly to build a globally scalable, performant, and secure edge solution.

## Looking Ahead

We’re looking forward to what’s next. We believe these are still very early days in how any enterprise, large or small, can answer the diverse set of customer and regulatory demands for compliance and user privacy. While massive platforms like Firefox, Safari, and Chrome validate and create growing expectations around personal data, there is much more on the horizon.

If you're building or thinking about privacy-enabled Internet services we would love to talk to you about how Fastly can help you build, operate, and scale these services to help ensure that your user privacy practices are as strong as possible while still delivering the very best experience.
