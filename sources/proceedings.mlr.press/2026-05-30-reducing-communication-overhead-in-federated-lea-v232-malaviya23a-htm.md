---
url: https://proceedings.mlr.press/v232/malaviya23a.html
title: Reducing Communication Overhead in Federated Learning for Pre-trained Language Models Using Parameter-Efficient Finetuning
fetched_at: 2026-05-30T17:18:38
content_hash: sha1:98b4c57309b25ce90052308ee2cca2ab759b0293
extractor: trafilatura
---

[[edit](https://github.com/mlresearch/v232/edit/gh-pages/_posts/2023-11-20-malaviya23a.md)]

# Reducing Communication Overhead in Federated Learning for Pre-trained Language Models Using Parameter-Efficient Finetuning

*Proceedings of The 2nd Conference on Lifelong Learning Agents*, PMLR 232:456-469, 2023.

#### Abstract

Pre-trained language models are shown to be effective in solving real-world natural language problems. Due to privacy reasons, data may not always be available for pre-training or finetuning of the model. Federated learning (FL) is a privacy-preserving technique for model training, but it suffers from communication overhead when the model size is large. We show that parameter-efficient finetuning (PEFT) reduces communication costs while achieving good model performance in both supervised and semi-supervised federated learning. Also, often in real life, data for the target downstream task is not available, but it is relatively easy to obtain the data for other related tasks. To this end, our results on the task-level transferability of PEFT methods in federated learning show that the model achieves good zero-shot performance on target data when source data is from a similar task. Parameter-efficient finetuning can aid federated learning in building efficient, privacy-preserving Natural Language Processing (NLP) applications.
