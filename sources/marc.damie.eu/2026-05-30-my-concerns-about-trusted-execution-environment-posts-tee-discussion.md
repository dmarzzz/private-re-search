---
url: https://marc.damie.eu/posts/tee-discussion
title: My concerns about Trusted Execution Environment
fetched_at: 2026-05-30T17:12:43
content_hash: sha1:9b8970d87b83bd7cace783f82b03d378f032098f
extractor: trafilatura
---

Recently, I was watching random Youtube videos late in the evening when suddenly… an ad about Samsung KNOX appeared. As a security researcher, this name instantly rang a bell but I was not expecting at all to see an ad about it.

Samsung KNOX is a new hardware implementing a “Trusted Execution Environment” (TEE). TEE is a hot topic in security to solve many privacy issues but I always considered it as an expert debate. Obviously, this ad presented this technology in a very appealing (and non-informative) way. More generally, many scientific and non-scientific papers promote TEE as a key component for future privacy-enhancing technologies (PET).

When I discuss informally with security researchers, this point of view is not shared by the whole community. Some researchers (including myself) have some concerns about this technology. However, I have never read structured criticism. This post will humbly put some words on my concerns regarding TEE.

Before starting this discussion, a little disclaimer is necessary: I work on PETs but I am not a TEE expert. From time to time, I read about TEE-based solutions which can be a direct alternative to my own solutions. Hence, I have a high-level understanding of TEE. I may make some mistakes about the implementation details so I will try to be extra careful.

# What is TEE?[#](https://marc.damie.eu#what-is-tee)

TEE is a hardware technology also referred to as secure enclaves or secure hardware. As presented in the schema, TEE is an isolated section of the CPU with a dedicated OS. This technology guarantees that anything happening in the TEE remains private. Even the CPU owner cannot read what is going on in this part of the CPU! The only counterpart to this strong guarantee is that we need to trust the CPU manufacturer. For more information about TEE, please refer to the dedicated [Wikipedia page](https://en.wikipedia.org/wiki/Trusted_execution_environment).

This security guarantee sounds marvelous because it may solve more or less any privacy issue: an organization can process private data without being able to read it in the clear. We don’t need to trust private companies to respect our data privacy since TEE ensures they cannot even access it. However, I believe there are some downsides that we need to discuss before investing too much effort into this technology.

Several major chip manufacturers already implemented TEE: Intel SGX, Samsung KNOX, ARM TrustZone, etc.

# A trust issue[#](https://marc.damie.eu#a-trust-issue)

The first issue is the trust assumption. Often, we could be a bit breezy about this point. Indeed, the security holds as long as we trust the chip manufacturer to not leak some sort of master cryptographic key. This is not a trivial assumption.

Over the last decades, we had several examples of companies sharing private data with national security agencies. It has been a key enabler for mass surveillance. Hence, trusting such companies could be unsatisfying for many use cases, especially for activists whose lives depend on the security of their communications.

Let’s assume we consider only economical/mainstream use cases. Thus, trusting a chip manufacturer could be acceptable. I argue there remains another implicit trust assumption: we need to trust the developers. As highlighted in the schema, the application and the OS are also trusted. Any flaw in the implementation could lead to a privacy breach. More generally, the TEE literature has described many side-channel attacks breaking the security of some so-called secure algorithms.

While software vulnerabilities are not specific to TEE, I believe this technology increases the attack surface. In classic cryptography, we usually have reference implementations subject to many audits (e.g., OpenSSL). In TEE, the hardware and the associated OS are (for now) all proprietary, so many unknown vulnerabilities might be present. While closed-source cryptography is now seen as a red flag in security, I am afraid TEE could go back in time and reintroduce some closed-source security solutions.

Moreover, the side-channel attacks in TEE are subtle and we would need some complex frameworks to check that app developers do not break the security with insecure operations.

# A silver bullet[#](https://marc.damie.eu#a-silver-bullet)

TEE is often presented as a silver bullet. Indeed, in theory, TEE is a perfect solution to many (nay all?) privacy issues. This silver-bullet discourse is my second concern.

Don’t get me wrong, I am not conservative about my research. If needed, I don’t mind switching to other primitives when it makes sense. However, I believe security and privacy are complex issues and we must be careful when coping with them. When someone talks about a form of universal solution I am always a bit skeptical: it always sounds too good to be true.

My message is just to be careful with TEE. I believe it will solve some privacy issues… but not all issues. Hence, we must remain clear about the advantages and disadvantages of this technology, and avoid getting hyped by a nice-looking solution heavily promoted by private interests. Indeed, don’t forget that powerful companies have a major economical interest in this technology… they could make big money if TEE becomes the pivotal element of any secure system.

# A proprietary solution[#](https://marc.damie.eu#a-proprietary-solution)

A previous paragraph already discussed the security risk induced by closed sources. Proprietary solutions also raise some societal issues: our security would be somehow owned by a private company. To understand this point, we can compare TEE to classic cryptographic libraries. If the OpenSSL foundation closes, anyone can fork the project and maintain the implementations. If Intel suddenly closes, I doubt we could maintain the OS or produce new chips.

An underlying problem here is interoperability. Each manufacturer produces their own TEE and I haven’t seen any attempt of interoperability. This is a new market so all manufacturers may try to obtain as many market shares as possible and they have low incentives to make everything interoperable. However, the use cases of TEE are not yet well-established so it could be a bit too early for a unique standard. Still, we should be aware of the long-term risks associated with these techniques.

Even an open-source standard, TEE remains a proprietary solution. It is a hardware-based solution, so our security relies on a handful of private companies. In other words, with TEE, the PETs would inherit the centralization problems present in the hardware industry.

# Obsolescence[#](https://marc.damie.eu#obsolescence)

I want to end this post with an overlooked issue: obsolescence. If we switch to hardware-based solutions, we would need to replace many **functional** devices with new devices compatible with TEE. Obsolescence isn’t specific to TEE but TEE is clearly yet another reason to buy new hardware. Once again, all chip manufacturers have a strong economical interest in this technology. We must remember their priority is not to sell us privacy, they sell us hardware…

Obsolescence would be a long-term issue: it remains present even for devices with integrated TEE. The secure hardware is always linked to a secure OS. Hence, the life expectancy of our hardware will be correlated to the software maintenance provided by the manufacturer. While several Linux distributions support old hardware, I doubt we will have open-source distributions for old TEE.

Information Technologies (IT) like any other modern technology have to find a sustainable model. Privacy should not be seen as a reason to excuse any form of waste. Recent studies on IT sustainability all showed that hardware production is the first source of carbon emissions in IT. Therefore, reducing hardware production should be our first goal with it comes to IT sustainability… and TEE production is not in line with this goal.

Most security researchers only develop some software, but software has a very concrete impact on the environment.

# Conclusion[#](https://marc.damie.eu#conclusion)

I hope this post gave you a new perspective on TEE. It is a hot topic in security and a contradictory debate is always interesting. My post could seem a bit too negative, but I still admit that TEE has many advantages. I am convinced you can find many papers/articles selling the promises of TEE. I intended to give some light on the untold downsides of this technology.
