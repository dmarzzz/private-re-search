---
url: https://en.wikipedia.org/wiki/Ranking_(information_retrieval)
title: Ranking (information retrieval) - Wikipedia
fetched_at: 2026-05-30T18:54:05
content_hash: sha1:679e69e3c718e3a5f0caba3289cef57f46094379
extractor: trafilatura
---

# Ranking (information retrieval)

**Ranking** of query is one of the fundamental problems in [information retrieval](https://en.wikipedia.org/wiki/Information_retrieval) (IR), [1] the scientific/engineering discipline behind

[search engines](https://en.wikipedia.org/wiki/Search_engine).

Given a query q and a collection D of documents that match the query, the problem is to rank, that is, sort, the documents in D according to some criterion so that the "best" results appear early in the result list displayed to the user. Ranking in terms of information retrieval is an important concept in computer science and is used in many different applications such as search engine queries and

[[2]](https://en.wikipedia.org#cite_note-2)[recommender systems](https://en.wikipedia.org/wiki/Recommender_system).

A majority of search engines use ranking algorithms to provide users with accurate and

[[3]](https://en.wikipedia.org#cite_note-3)[relevant](https://en.wikipedia.org/wiki/Relevance_(information_retrieval))results.


[[4]](https://en.wikipedia.org#cite_note-4)## History

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=1)]

The notion of page rank dates back to the 1940s and the idea originated in the field of economics. In 1941, [Wassily Leontief](https://en.wikipedia.org/wiki/Wassily_Leontief) developed an [iterative method](https://en.wikipedia.org/wiki/Iterative_method) of valuing a country's sector based on the importance of other sectors that supplied resources to it. In 1965, Charles H Hubbell at the [University of California, Santa Barbara](https://en.wikipedia.org/wiki/University_of_California,_Santa_Barbara), published a technique for determining the importance of individuals based on the importance of the people who endorse them.[[5]](https://en.wikipedia.org#cite_note-5)

Gabriel Pinski and Francis Narin came up with an approach to rank journals. [6] Their rule was that a journal is important if it is cited by other important journals.

[Jon Kleinberg](https://en.wikipedia.org/wiki/Jon_Kleinberg), a

[computer scientist](https://en.wikipedia.org/wiki/Computer_scientist)at

[Cornell University](https://en.wikipedia.org/wiki/Cornell_University), developed an almost identical approach to

[PageRank](https://en.wikipedia.org/wiki/PageRank)which was called

[Hypertext Induced Topic Search](https://en.wikipedia.org/wiki/HITS_algorithm)or HITS and it treated

[web pages](https://en.wikipedia.org/wiki/Web_page)as "hubs" and "authorities".

Google's PageRank algorithm was developed in 1998 by Google's founders [Sergey Brin](https://en.wikipedia.org/wiki/Sergey_Brin) and [Larry Page](https://en.wikipedia.org/wiki/Larry_Page) and it is a key part of Google's method of ranking web pages in [search results](https://en.wikipedia.org/wiki/Search_engine_results_page). [7] All the above methods are somewhat similar as all of them exploit the structure of links and require an iterative approach.


[[8]](https://en.wikipedia.org#cite_note-8)## Models

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=2)]

Ranking functions are evaluated by a variety of means; one of the simplest is determining the [precision](https://en.wikipedia.org/wiki/Precision_(information_retrieval)) of the first *k* top-ranked results for some fixed *k*; for example, the proportion of the top 10 results that are relevant, on average over many queries.

IR models can be broadly divided into three types: [Boolean models](https://en.wikipedia.org/wiki/Boolean_model_of_information_retrieval) or BIR, [Vector Space Models](https://en.wikipedia.org/wiki/Vector_space_model), and [Probabilistic Models](https://en.wikipedia.org/wiki/Statistical_language_acquisition). [9] Various comparisons between retrieval models can be found in the literature (e.g.,

).

[[10]](https://en.wikipedia.org#cite_note-10)### Boolean

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=3)]

Boolean Model or BIR is a simple baseline query model where each query follows the underlying principles of [relational algebra](https://en.wikipedia.org/wiki/Relational_algebra) with algebraic expressions and where documents are not fetched unless they completely match with each other. Since the query is either fetch the document (1) or does not fetch the document (0), there is no methodology to rank them.

### Vector Space

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=4)]

Since the Boolean Model only fetches complete matches, it does not address the problem of the documents being partially matched. The [Vector Space Model](https://en.wikipedia.org/wiki/Vector_Space_Model) solves this problem by introducing vectors of index items each assigned with weights. The weights are ranged from positive (if matched completely or to some extent) to negative (if unmatched or completely oppositely matched) if documents are present. Term Frequency - Inverse Document Frequency ([tf-idf](https://en.wikipedia.org/wiki/Tf-idf)) is one of the most popular techniques where weights are terms (e.g. words, keywords, phrases etc.) and dimensions is number of words inside corpus.

The similarity score between query and document can be found by calculating cosine value between query weight vector and document weight vector using [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity). Desired documents can be fetched by ranking them according to similarity score and fetched top k documents which has the highest scores or most relevant to query vector.

### Probabilistic

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=5)]

In probabilistic model, [probability theory](https://en.wikipedia.org/wiki/Probability_theory) has been used as a principal means for modeling the retrieval process in mathematical terms. The probability model of information retrieval was introduced by Maron and Kuhns in 1960 and further developed by Roberston and other researchers. According to Spack Jones and Willett (1997): The rationale for introducing probabilistic concepts is obvious: IR systems deal with natural language, and this is too far imprecise to enable a system to state with certainty which document will be relevant to a particular query.

The model applies the theory of probability to information retrieval (An event has a possibility from 0 percent to 100 percent of occurring). i.e, in probability model, relevance is expressed in terms of probability. Here, documents are ranked in order of decreasing probability of relevance. It takes into the consideration of uncertainty element in the IR process. i.e., uncertainty about whether documents retrieved by the system are relevant to a given query.

The probability model intends to estimate and calculate the probability that a document will be relevant to a given query based on some methods. The "event" in this context of information retrieval refers to the probability of relevance between a query and a document. Unlike other IR models, the probability model does not treat relevance as an exact miss-or-match measurement.

The model adopts various methods to determine the probability of relevance between queries and documents. Relevance in the probability model is judged according to the similarity between queries and documents. The similarity judgment is further dependent on term frequency.

Thus, for a query consisting of only one term (B), the probability that a particular document (Dm) will be judged relevant is the ratio of users who submit query term (B) and consider the document (Dm) to be relevant in relation to the number of users who submitted the term (B). As represented in Maron's and Kuhn's model, can be represented as the probability that users submitting a particular query term (B) will judge an individual document (Dm) to be relevant.

According to [Gerard Salton](https://en.wikipedia.org/wiki/Gerard_Salton) and Michael J. McGill, the essence of this model is that if estimates for the probability of occurrence of various terms in relevant documents can be calculated, then the probabilities that a document will be retrieved, given that it is relevant, or that it is not, can be estimated.[[11]](https://en.wikipedia.org#cite_note-11)

Several experiments have shown that the probabilistic model can yield good results. However, such results have not been sufficiently better than those obtained using the Boolean or Vector Space model.[[12]](https://en.wikipedia.org#cite_note-12)[[13]](https://en.wikipedia.org#cite_note-13)

## Evaluation Measures

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=6)]

The most common measures of evaluation are precision, recall, and f-score. They are computed using unordered sets of documents. These measures must be extended, or new measures must be defined, in order to evaluate the ranked retrieval results that are standard in modern search engines. In a ranked retrieval context, appropriate sets of retrieved documents are naturally given by the top k retrieved documents. For each such set, [precision and recall](https://en.wikipedia.org/wiki/Precision_and_recall) values can be plotted to give a precision-recall curve.[[14]](https://en.wikipedia.org#cite_note-14)

### Precision

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=7)]

Precision measures the exactness of the retrieval process. If the actual set of relevant documents is denoted by I and the retrieved set of documents is denoted by O, then the precision is given by:

### Recall

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=8)]

Recall is a measure of completeness of the IR process. If the actual set of relevant documents is denoted by I and the retrieved set of documents is denoted by O, then the recall is given by:

### F1 Score

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=9)]

F1 Score tries to combine the precision and recall measure. It is the [harmonic mean](https://en.wikipedia.org/wiki/Harmonic_mean) of the two. If P is the precision and R is the recall then the F-Score is given by:

## Page Rank Algorithm

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=10)]

The [PageRank](https://en.wikipedia.org/wiki/PageRank) algorithm outputs a [probability distribution](https://en.wikipedia.org/wiki/Probability_distribution) used to represent the likelihood that a person randomly clicking on the links will arrive at any particular page. PageRank can be calculated for collections of documents of any size. It is assumed in several research papers that the distribution is evenly divided among all documents in the collection at the beginning of the computational process. The PageRank computations require several passes through the collection to adjust approximate PageRank values to more closely reflect the theoretical true value. The formulae is given below:

i.e. the PageRank value for a page **u** is dependent on the PageRank values for each page **v** contained in the set **B u** (the set containing all pages linking to page

**u**), divided by the amount

*L*(

*v*) of links from page

**v**.

## HITS Algorithm

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=11)]

Similar to [PageRank](https://en.wikipedia.org/wiki/PageRank), HITS uses Link Analysis for analyzing the relevance of the pages but only works on small sets of subgraph (rather than entire web graph) and as well as being query dependent. The subgraphs are ranked according to weights in hubs and authorities where pages that rank highest are fetched and displayed.[[15]](https://en.wikipedia.org#cite_note-15)

## Re-ranking

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=12)]

**Re-ranking** means adjustment of the original ranking of items to balance the primary ranking criterion, e.g., information relevance, with additional objectives / constraints, such as information freshness and diversity. [16]
Accounting for multiple objectives when constructing the final item ranking results in a time-intensive optimization problem


[[17]](https://en.wikipedia.org#cite_note-17)and substantial research effort has focused on speeding up the optimization to keep in check the perceived latency of obtaining the ranking by the user.

[[18]](https://en.wikipedia.org#cite_note-18)

[[19]](https://en.wikipedia.org#cite_note-19)

[[20]](https://en.wikipedia.org#cite_note-20)

[[21]](https://en.wikipedia.org#cite_note-21)## See also

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=13)]

[Learning to rank](https://en.wikipedia.org/wiki/Learning_to_rank): application of[machine learning](https://en.wikipedia.org/wiki/Machine_learning)to the ranking problem[Semantic search](https://en.wikipedia.org/wiki/Semantic_search)[Personalized search](https://en.wikipedia.org/wiki/Personalized_search)

## References

[[edit](https://en.wikipedia.org/w/index.php?title=Ranking_(information_retrieval)&action=edit§ion=14)]

Piccoli, Gabriele; Pigni, Federico (July 2018).[^](https://en.wikipedia.org#cite_ref-1)(Edition 4.0 ed.). Prospect Press. p. 28.*Information systems for managers: with cases*[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-1-943153-50-3](https://en.wikipedia.org/wiki/Special:BookSources/978-1-943153-50-3). Retrieved 25 November 2018.Mogotsi, I. C.[^](https://en.wikipedia.org#cite_ref-2)["Christopher D. Manning, Prabhakar Raghavan, and Hinrich Schütze: Introduction to information retrieval: Cambridge University Press, Cambridge, England, 2008, 482 pp, ISBN: 978-0-521-86571-5"](http://link.springer.com/10.1007/s10791-009-9115-y).*Information Retrieval*.**13**(2): 192–195.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/s10791-009-9115-y](https://doi.org/10.1007%2Fs10791-009-9115-y).[ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier))[1386-4564](https://search.worldcat.org/issn/1386-4564).[S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier))[31674042](https://api.semanticscholar.org/CorpusID:31674042).[^](https://en.wikipedia.org#cite_ref-3)["What is Information Retrieval?"](https://www.geeksforgeeks.org/what-is-information-retrieval/).*GeeksforGeeks*. 2020-07-02. Retrieved 2022-03-02.[^](https://en.wikipedia.org#cite_ref-4)["Google's Search Algorithm and Ranking System - Google Search"](https://www.google.com/search/howsearchworks/algorithms/).*www.google.com*. Retrieved 2022-03-02.[^](https://en.wikipedia.org#cite_ref-5)["Scientist Finds PageRank-Type Algorithm from the 1940s"](https://www.technologyreview.com/2010/02/17/264032/scientist-finds-pagerank-type-algorithm-from-the-1940s/).*MIT Technology Review*. Retrieved 2022-03-02.Pinski, Gabriel; Narin, Francis (1976).[^](https://en.wikipedia.org#cite_ref-6)["Citation influence for journal aggregates of scientific publications: Theory, with application to the literature of physics"](https://linkinghub.elsevier.com/retrieve/pii/0306457376900480).*Information Processing & Management*.**12**(5): 297–312.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1016/0306-4573(76)90048-0](https://doi.org/10.1016%2F0306-4573%2876%2990048-0).[^](https://en.wikipedia.org#cite_ref-7)["What are SERP Features?"](https://www.accuranker.com/blog/how-you-can-use-serp-features-to-boost-traffic/).*www.accuranker.com*. 2019-03-28. Retrieved 2022-03-02.Franceschet, Massimo (17 February 2010).[^](https://en.wikipedia.org#cite_ref-8)["Scientist Finds PageRank-Type Algorithm from the 1940s"](https://www.technologyreview.com/s/417529/scientist-finds-pagerank-type-algorithm-from-the-1940s/). www.technologyreview.com.Datta, Joydip (16 April 2010).[^](https://en.wikipedia.org#cite_ref-9)["Ranking in Information Retrieval"](https://www.cse.iitb.ac.in/archive/internal/techreports/reports/TR-CSE-2010-31.pdf)(PDF). Department of Computer Science and Engineering, Indian Institute of Technology. p. 7. Retrieved 25 April 2019.Turtle, Howard R.; Croft, W.Bruce (1992).[^](https://en.wikipedia.org#cite_ref-10)["A comparison of text retrieval models"](https://doi.org/10.1093%2Fcomjnl%2F35.3.279).*The Computer Journal*.**35**(3): 279–290.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1093/comjnl/35.3.279](https://doi.org/10.1093%2Fcomjnl%2F35.3.279).Harter, Stephen P. (1984-07-01).[^](https://en.wikipedia.org#cite_ref-11)["Introduction to modem information retrieval (Gerard Salton and Michael J. McGill)"](https://www.medra.org/servlet/aliasResolver?alias=iospress&doi=10.3233/EFI-1984-2307).*Education for Information*.**2**(3): 237–238.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.3233/EFI-1984-2307](https://doi.org/10.3233%2FEFI-1984-2307).Chu, H. Information Representation and Retrieval in the Digital Age. New Delhi: Ess Ess Publication.[^](https://en.wikipedia.org#cite_ref-12)G.G.Choudhary. Introduction to Modern Information Retrieval. Facet Publishing.[^](https://en.wikipedia.org#cite_ref-13)Manning, Christopher; Raghavan, Prabhakar; Schutze, Hinrich.[^](https://en.wikipedia.org#cite_ref-14). Cambridge University Press.*Evaluation of ranked retrieval results*Tanase, Racula; Radu, Remus (16 April 2010).[^](https://en.wikipedia.org#cite_ref-15)["Lecture #4: HITS Algorithm - Hubs and Authorities on the Internet"](https://pi.math.cornell.edu/~mec/Winter2009/RalucaRemus/Lecture4/lecture4.html).[^](https://en.wikipedia.org#cite_ref-16)["Re-ranking"](https://developers.google.com/machine-learning/recommendation/dnn/re-ranking).*developers.google.com*. 2024-07-26. Retrieved 2024-12-07.Singh, A.; Joachims, T. (2018).[^](https://en.wikipedia.org#cite_ref-17)["Fairness of Exposure in Rankings"](https://dl.acm.org/doi/10.1145/3219819.3220088).*Proceedings of the 24th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining*. pp. 2219–2228.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/3219819.3220088](https://doi.org/10.1145%2F3219819.3220088).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-1-4503-5552-0](https://en.wikipedia.org/wiki/Special:BookSources/978-1-4503-5552-0).Biega, A. J.; Gummadi, K. P.; Weikum, G. (2018).[^](https://en.wikipedia.org#cite_ref-18)["Equity of Attention: Amortizing Individual Fairness in Rankings"](https://dl.acm.org/doi/10.1145/3209978.3210063).*The 41st International ACM SIGIR Conference on Research & Development in Information Retrieval*. pp. 405–414.[arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1805.01788](https://arxiv.org/abs/1805.01788).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/3209978.3210063](https://doi.org/10.1145%2F3209978.3210063).[hdl](https://en.wikipedia.org/wiki/Hdl_(identifier)):[21.11116/0000-0003-4E55-7](https://hdl.handle.net/21.11116%2F0000-0003-4E55-7).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-1-4503-5657-2](https://en.wikipedia.org/wiki/Special:BookSources/978-1-4503-5657-2).Mehta, Aranyak (2013). "Bayesian Mechanism Design".[^](https://en.wikipedia.org#cite_ref-19)*Foundations and Trends in Theoretical Computer Science*.**8**(4): 265–368.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1561/0400000057](https://doi.org/10.1561%2F0400000057).Shah, P.; Soni, A.; Chevalier, T. (2017).[^](https://en.wikipedia.org#cite_ref-20)["Online ranking with constraints: A primal-dual algorithm and applications to web traffic-shaping"](https://dl.acm.org/doi/10.1145/3097983.3098025).*ACM SIGKDD*: 405–414.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/3097983.3098025](https://doi.org/10.1145%2F3097983.3098025).Zhernov, A.; Dvijotham, K. D.; Lobov, I.; Calian, D. A.; Gong, M.; Chandrashekar, N.; Mann, T. A. (2020).[^](https://en.wikipedia.org#cite_ref-21)["The NodeHopper: Enabling Low Latency Ranking with Constraints via a Fast Dual Solver"](https://dl.acm.org/doi/10.1145/3394486.3403181).*Proceedings of the 26th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining*. pp. 1285–1294.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/3394486.3403181](https://doi.org/10.1145%2F3394486.3403181).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-1-4503-7998-4](https://en.wikipedia.org/wiki/Special:BookSources/978-1-4503-7998-4).
