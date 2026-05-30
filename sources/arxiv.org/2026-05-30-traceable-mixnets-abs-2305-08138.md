---
url: https://arxiv.org/abs/2305.08138
title: Traceable mixnets
fetched_at: 2026-05-30T16:02:31
content_hash: sha1:89e24e7ccf62ff11a96417440a0e7cdcf3418a93
extractor: trafilatura
---

# Computer Science > Cryptography and Security

[Submitted on 14 May 2023 (

[v1](https://arxiv.org/abs/2305.08138v1)), last revised 5 Jan 2024 (this version, v3)]# Title:Traceable mixnets

[View PDF](https://arxiv.org/pdf/2305.08138)

Abstract:We introduce the notion of \emph{traceable mixnets}. In a traditional mixnet, multiple mix-servers jointly permute and decrypt a list of ciphertexts to produce a list of plaintexts, along with a proof of correctness, such that the association between individual ciphertexts and plaintexts remains completely hidden. However, in many applications, the privacy-utility tradeoff requires answering some specific queries about this association, without revealing any information beyond the query result. We consider queries of the following types: a) given a ciphertext in the mixnet input list, whether it encrypts one of a given subset of plaintexts in the output list, and b) given a plaintext in the mixnet output list, whether it is a decryption of one of a given subset of ciphertexts in the input list. Traceable mixnets allow the mix-servers to jointly prove answers to the above queries to a querier such that neither the querier nor a threshold number of mix-servers learn any information beyond the query result. Further, if the querier is not corrupted, the corrupted mix-servers do not even learn the query result. We first comprehensively formalise these security properties of traceable mixnets and then propose a construction of traceable mixnets using novel distributed zero-knowledge proofs (ZKPs) of set membership and of a statement we call reverse set membership. Although set membership has been studied in the single-prover setting, the main challenge in our distributed setting lies in making sure that none of the mix-servers learn the association between ciphertexts and plaintexts during the proof. We implement our distributed ZKPs and show that they are faster than state-of-the-art by at least one order of magnitude.

## Submission history

From: Subhashis Banerjee [[view email](https://arxiv.org/show-email/833aa1d7/2305.08138)]

**Sun, 14 May 2023 12:18:59 UTC (1,472 KB)**

[[v1]](https://arxiv.org/abs/2305.08138v1)**Fri, 22 Sep 2023 05:14:06 UTC (67 KB)**

[[v2]](https://arxiv.org/abs/2305.08138v2)**[v3]**Fri, 5 Jan 2024 05:01:53 UTC (127 KB)

### References & Citations

Loading...

# Bibliographic and Citation Tools

Bibliographic Explorer

*(*[What is the Explorer?](https://info.arxiv.org/labs/showcase.html#arxiv-bibliographic-explorer))
Connected Papers

*(*[What is Connected Papers?](https://www.connectedpapers.com/about))
Litmaps

*(*[What is Litmaps?](https://www.litmaps.co/))
scite Smart Citations

*(*[What are Smart Citations?](https://www.scite.ai/))# Code, Data and Media Associated with this Article

alphaXiv

*(*[What is alphaXiv?](https://alphaxiv.org/))
CatalyzeX Code Finder for Papers

*(*[What is CatalyzeX?](https://www.catalyzex.com))
DagsHub

*(*[What is DagsHub?](https://dagshub.com/))
Gotit.pub

*(*[What is GotitPub?](http://gotit.pub/faq))
Hugging Face

*(*[What is Huggingface?](https://huggingface.co/huggingface))
ScienceCast

*(*[What is ScienceCast?](https://sciencecast.org/welcome))# Demos

# Recommenders and Search Tools

Influence Flower

*(*[What are Influence Flowers?](https://influencemap.cmlab.dev/))
CORE Recommender

*(*[What is CORE?](https://core.ac.uk/services/recommender))# arXivLabs: experimental projects with community collaborators

arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.

Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.

Have an idea for a project that will add value for arXiv's community? [ Learn more about arXivLabs](https://info.arxiv.org/labs/index.html).
