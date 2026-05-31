---
url: https://arxiv.org/abs/2512.23675
title: End-to-End Test-Time Training for Long Context
fetched_at: 2026-05-30T20:36:29
content_hash: sha1:e384140c085ab5499da194375dd76899e53a0565
extractor: trafilatura
---

# Computer Science > Machine Learning

[Submitted on 29 Dec 2025 (

[v1](https://arxiv.org/abs/2512.23675v1)), last revised 31 Dec 2025 (this version, v2)]# Title:End-to-End Test-Time Training for Long Context

[View PDF](https://arxiv.org/pdf/2512.23675)

[HTML (experimental)](https://arxiv.org/html/2512.23675v2)

Abstract:We formulate long-context language modeling as a problem in continual learning rather than architecture design. Under this formulation, we only use a standard architecture -- a Transformer with sliding-window attention. However, our model continues learning at test time via next-token prediction on the given context, compressing the context it reads into its weights. In addition, we improve the model's initialization for learning at test time via meta-learning at training time. Overall, our method, a form of Test-Time Training (TTT), is End-to-End (E2E) both at test time (via next-token prediction) and training time (via meta-learning), in contrast to previous forms. We conduct extensive experiments with a focus on scaling properties. In particular, for 3B models trained with 164B tokens, our method (TTT-E2E) scales with context length in the same way as Transformer with full attention, while others, such as Mamba 2 and Gated DeltaNet, do not. However, similar to RNNs, TTT-E2E has constant inference latency regardless of context length, making it 2.7 times faster than full attention for 128K context. Our code is publicly available.

## Submission history

From: Yu Sun [[view email](https://arxiv.org/show-email/e7bd9bd2/2512.23675)]

**Mon, 29 Dec 2025 18:30:14 UTC (256 KB)**

[[v1]](https://arxiv.org/abs/2512.23675v1)**[v2]**Wed, 31 Dec 2025 18:41:09 UTC (256 KB)

### References & Citations

export BibTeX citation
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
Papers with Code

*(*[What is Papers with Code?](https://paperswithcode.com/))
ScienceCast

*(*[What is ScienceCast?](https://sciencecast.org/welcome))# Demos

# Recommenders and Search Tools

Influence Flower

*(*[What are Influence Flowers?](https://influencemap.cmlab.dev/))
CORE Recommender

*(*[What is CORE?](https://core.ac.uk/services/recommender))
IArxiv Recommender

*(*[What is IArxiv?](https://iarxiv.org/about))# arXivLabs: experimental projects with community collaborators

arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.

Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.

Have an idea for a project that will add value for arXiv's community? [ Learn more about arXivLabs](https://info.arxiv.org/labs/index.html).
