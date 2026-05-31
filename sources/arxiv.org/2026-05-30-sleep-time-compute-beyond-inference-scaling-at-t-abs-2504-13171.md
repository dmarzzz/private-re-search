---
url: https://arxiv.org/abs/2504.13171
title: Sleep-time Compute: Beyond Inference Scaling at Test-time
fetched_at: 2026-05-30T20:35:38
content_hash: sha1:e209029f82bcba10d601f51d4a75af28b34d7cf3
extractor: trafilatura
---

# Computer Science > Artificial Intelligence

[Submitted on 17 Apr 2025]

# Title:Sleep-time Compute: Beyond Inference Scaling at Test-time

[View PDF](https://arxiv.org/pdf/2504.13171)

[HTML (experimental)](https://arxiv.org/html/2504.13171v1)

Abstract:Scaling test-time compute has emerged as a key ingredient for enabling large language models (LLMs) to solve difficult problems, but comes with high latency and inference cost. We introduce sleep-time compute, which allows models to "think" offline about contexts before queries are presented: by anticipating what queries users might ask and pre-computing useful quantities, we can significantly reduce the compute requirements at test-time. To demonstrate the efficacy of our method, we create modified versions of two reasoning tasks - Stateful GSM-Symbolic and Stateful AIME. We find that sleep-time compute can reduce the amount of test-time compute needed to achieve the same accuracy by ~ 5x on Stateful GSM-Symbolic and Stateful AIME and that by scaling sleep-time compute we can further increase accuracy by up to 13% on Stateful GSM-Symbolic and 18% on Stateful AIME. Furthermore, we introduce Multi-Query GSM-Symbolic, which extends GSM-Symbolic by including multiple related queries per context. By amortizing sleep-time compute across related queries about the same context using Multi-Query GSM-Symbolic, we can decrease the average cost per query by 2.5x. We then conduct additional analysis to understand when sleep-time compute is most effective, finding the predictability of the user query to be well correlated with the efficacy of sleep-time compute. Finally, we conduct a case-study of applying sleep-time compute to a realistic agentic SWE task.

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

*(*[What is CORE?](https://core.ac.uk/services/recommender))# arXivLabs: experimental projects with community collaborators

arXivLabs is a framework that allows collaborators to develop and share new arXiv features directly on our website.

Both individuals and organizations that work with arXivLabs have embraced and accepted our values of openness, community, excellence, and user data privacy. arXiv is committed to these values and only works with partners that adhere to them.

Have an idea for a project that will add value for arXiv's community? [ Learn more about arXivLabs](https://info.arxiv.org/labs/index.html).
