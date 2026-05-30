---
url: https://nlp.stanford.edu/IR-book/html/htmledition/language-models-for-information-retrieval-1.html
title: Language models for information retrieval
fetched_at: 2026-05-30T19:00:48
content_hash: sha1:4daaff46b121589567779fbdc7a3359acd0b25e1
extractor: trafilatura
---

Language models for information retrieval

A common suggestion to users for coming up with good
queries is to think of words that would likely appear in a relevant
document, and to use those words as the query. The language modeling
approach to IR directly models that idea: a document is a good match to
a query if the document model is likely to generate the query, which
will in turn happen if the document contains the query words often.
This approach thus provides a different realization of some of the
basic ideas for document ranking which we saw in Section [6.2](https://nlp.stanford.edu/term-frequency-and-weighting-1.html#sec:tfidf) (page [).
Instead of overtly modeling the probability of relevance of a
document to a query , as in the traditional probabilistic approach to IR
(Chapter ](https://nlp.stanford.edu/term-frequency-and-weighting-1.html#p:tfidf)[11](https://nlp.stanford.edu/probabilistic-information-retrieval-1.html#ch:probir) ), the basic language modeling approach
instead builds a
probabilistic language model [ from each
document , and ranks
documents based on the probability of the model generating the
query: .
]

In this chapter, we first introduce the concept of language models
(Section [12.1](https://nlp.stanford.edu/language-models-1.html#sec:langmodel) ) and then describe the basic and most commonly
used language modeling approach to IR, the Query Likelihood Model
(Section [12.2](https://nlp.stanford.edu/the-query-likelihood-model-1.html#sec:qlm) ). After some comparisons between the language modeling
approach and other approaches to IR (Section [12.3](https://nlp.stanford.edu/language-modeling-versus-other-approaches-in-ir-1.html#sec:lm-vs-other) ), we
finish by briefly describing various extensions to the language
modeling approach (Section [12.4](https://nlp.stanford.edu/extended-language-modeling-approaches-1.html#sec:extended-lm) ).


[Language models](https://nlp.stanford.edu/language-models-1.html)

[The query likelihood model](https://nlp.stanford.edu/the-query-likelihood-model-1.html)[Using query likelihood language models in IR](https://nlp.stanford.edu/using-query-likelihood-language-models-in-ir-1.html)[Estimating the query generation probability](https://nlp.stanford.edu/estimating-the-query-generation-probability-1.html)[Ponte and Croft's Experiments](https://nlp.stanford.edu/ponte-and-crofts-experiments-1.html)


[Language modeling versus other approaches in IR](https://nlp.stanford.edu/language-modeling-versus-other-approaches-in-ir-1.html)[Extended language modeling approaches](https://nlp.stanford.edu/extended-language-modeling-approaches-1.html)[References and further reading](https://nlp.stanford.edu/references-and-further-reading-12.html)

This is an automatically generated page. In case of formatting errors you may want to look at the

2009-04-07
