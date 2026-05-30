---
url: https://nlp.stanford.edu/IR-book/html/htmledition/references-and-further-reading-12.html
title: References and further reading
fetched_at: 2026-05-30T19:01:05
content_hash: sha1:0af0ff70c098ee4c138001db48fa8b1cb164be15
extractor: trafilatura
---

References and further reading

For more details on the basic concepts of probabilistic language
models and techniques for smoothing, see either
[Manning and Schütze (1999, Chapter 6)](https://nlp.stanford.edu/bibliography-1.html#manning99foundations) or [Jurafsky and Martin (2008, Chapter 4)](https://nlp.stanford.edu/bibliography-1.html#jurafsky08slp).

The important initial papers that originated the language modeling
approach to IR are:
([Berger and Lafferty, 1999](https://nlp.stanford.edu/bibliography-1.html#berger99ir), [Ponte and Croft, 1998](https://nlp.stanford.edu/bibliography-1.html#ponte98lm), [Miller et al., 1999](https://nlp.stanford.edu/bibliography-1.html#miller99hmm), [Hiemstra, 1998](https://nlp.stanford.edu/bibliography-1.html#hiemstra98linguistically)).
Other relevant papers can be found in the next several years of SIGIR
proceedings. ([Croft and Lafferty, 2003](https://nlp.stanford.edu/bibliography-1.html#croft03lm)) contains a collection of papers from a
workshop on
language modeling approaches and [Hiemstra and Kraaij (2005)](https://nlp.stanford.edu/bibliography-1.html#hiemstra05lm) review one
prominent thread of work on using language modeling approaches for TREC tasks.
[Zhai and Lafferty (2001b)](https://nlp.stanford.edu/bibliography-1.html#zhai01smoothing) clarify the role of smoothing in LMs for IR
and present detailed empirical
comparisons of different
smoothing methods. [Zaragoza et al. (2003)](https://nlp.stanford.edu/bibliography-1.html#zaragoza03bayesian) advocate using full
Bayesian predictive distributions rather than MAP point estimates, but
while they outperform Bayesian smoothing, they fail to outperform a
linear interpolation. [Zhai and Lafferty (2002)](https://nlp.stanford.edu/bibliography-1.html#zhai02two) argue that a two-stage
smoothing model with first Bayesian smoothing followed by linear
interpolation gives a good model of the task, and performs better and
more stably than a single form of smoothing. A nice feature of the LM
approach is that it provides a convenient and principled way to put
various kinds of prior information into the model; [Kraaij et al. (2002)](https://nlp.stanford.edu/bibliography-1.html#kraaij02importance)
demonstrate this by showing the value of link information as a prior
in improving web entry page retrieval performance.
As briefly discussed in Chapter [16](https://nlp.stanford.edu/flat-clustering-1.html#ch:flatclust) (page [16.1](https://nlp.stanford.edu/clustering-in-information-retrieval-1.html#p:clusterlgmodel) ), [Liu and Croft (2004)](https://nlp.stanford.edu/bibliography-1.html#liu04cluster) show some gains by smoothing a document LM with
estimates from a cluster of similar documents; [Tao et al. (2006)](https://nlp.stanford.edu/bibliography-1.html#tao06language)
report larger gains by doing document-similarity based smoothing.

[Hiemstra and Kraaij (2005)](https://nlp.stanford.edu/bibliography-1.html#hiemstra05lm) present TREC results showing a LM approach
beating use of BM25 weights.
Recent
work has achieved some gains by going beyond the unigram model,
providing the higher order models are smoothed with lower order models
([Cao et al., 2005](https://nlp.stanford.edu/bibliography-1.html#cao05integrating), [Gao et al., 2004](https://nlp.stanford.edu/bibliography-1.html#gao04dependence)), though the gains to date
remain modest.
[Spärck Jones (2004)](https://nlp.stanford.edu/bibliography-1.html#sparckjones04rational) presents a critical viewpoint on the
rationale for the language modeling approach, but
[Lafferty and Zhai (2003)](https://nlp.stanford.edu/bibliography-1.html#lafferty03probabilistic) argue that a unified account can be
given of the probabilistic semantics underlying both the language
modeling approach presented in this chapter and the classical
probabilistic information retrieval approach of Chapter [11](https://nlp.stanford.edu/probabilistic-information-retrieval-1.html#ch:probir) .
The Lemur Toolkit (` http://www.lemurproject.org/`) provides a
flexible open source framework for investigating language modeling
approaches to IR.


This is an automatically generated page. In case of formatting errors you may want to look at the

2009-04-07
