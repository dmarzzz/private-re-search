---
url: https://learnprompting.org/docs/retrieval_augmented_generation/self-rag
title: Self-RAG
fetched_at: 2026-05-30T20:34:15
content_hash: sha1:83374fe29cebcd17f68e2503c7778eb5316400cd
extractor: trafilatura
---

# Self-RAG

[medium](https://learnprompting.org/docs/introduction#header-4)

**Self-RAG (Self-Reflective Retrieval-Augmented Generation)** is a new approach that improves Large Language Models (LLMs) by making them smarter about when to retrieve external knowledge and how to self-assess their responses.

Unlike traditional [Retrieval-Augmented Generation (RAG)](https://learnprompting.org/docs/retrieval_augmented_generation/rag) systems, which blindly fetch a fixed number of documents, Self-RAG introduces **self-reflection** to:

**Decide if retrieval is needed**before fetching knowledge.**Generate responses while evaluating the relevance**of retrieved passages.**Critique its own output**to improve factuality and overall quality.

This means that the model doesn't just "guess" an answer, it learns to verify and refine its own responses, leading to **more accurate, relevant, and reliable outputs**.

## How Self-RAG Differs from Existing Techniques

| Feature | Traditional RAG | Self-RAG |
|---|---|---|
Retrieval | Always retrieves a fixed number of documents | Retrieves only when necessary |
Relevance checking | Uses retrieved docs without verification | Assesses whether retrieved docs are relevant |
Self-critique | No self-evaluation | Evaluates its own responses for correctness and factuality |
Customization | No control over output quality | Allows tuning for precision vs. completeness |

Unlike previous methods that either:

- Always retrieve information (even when unnecessary), or
- Generate outputs without verification

Self-RAG retrieves only when needed and critically assesses its own outputs.

## How Self-RAG Works

### Step 1: Retrieve on Demand

- The model first decides if retrieval is necessary using a special
**Retrieve token**. - If retrieval is needed, it fetches the top K most relevant documents.

### Step 2: Generate and Evaluate in Parallel

- It processes multiple retrieved passages simultaneously.
- It evaluates each passage's relevance with an ISREL (Is Relevant) token.

### Step 3: Critique and Select the Best Response

- The model critiques its own output using:
**ISSUP (Is Supported) token**: Checks if the response is backed by evidence.**ISUSE (Is Useful) token**: Measures the overall quality of the response.

- The final response is selected based on these critique scores.

## Conclusion

Self-RAG is a breakthrough approach for making AI more factually accurate, reliable, and controllable. By retrieving only when needed and self-reflecting on its outputs, it outperforms existing RAG techniques and even beats proprietary models like ChatGPT in factual accuracy tasks.

### Valeriia Kuka

Valeriia Kuka, Head of Content at Learn Prompting, is passionate about making AI and ML accessible. Valeriia previously grew a 60K+ follower AI-focused social media account, earning reposts from Stanford NLP, Amazon Research, Hugging Face, and AI researchers. She has also worked with AI/ML newsletters and global communities with 100K+ members and authored clear and concise explainers and historical articles.

## Footnotes

-
Asai, A., Wu, Z., Wang, Y., Sil, A., & Hajishirzi, H. (2023). Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection.

[https://arxiv.org/abs/2310.11511](https://arxiv.org/abs/2310.11511)[↩](https://learnprompting.org#user-content-fnref-1)
