---
url: https://en.wikipedia.org/wiki/Vector_space_model
title: Vector space model - Wikipedia
fetched_at: 2026-05-30T20:25:58
content_hash: sha1:6ffdd362395afe7666703f27e13dcb12f5a8286d
extractor: trafilatura
---

# Vector space model

**Vector space model** (VSM) or **term vector model** is an algebraic model for representing text documents (or more generally, items) as [vectors](https://en.wikipedia.org/wiki/Vector_space) such that the distance between vectors represents the relevance between the documents. It is used in [information filtering](https://en.wikipedia.org/wiki/Information_filtering), [information retrieval](https://en.wikipedia.org/wiki/Information_retrieval), [indexing](https://en.wikipedia.org/wiki/Index_(search_engine)) and relevance rankings. Its first use was in the [SMART Information Retrieval System](https://en.wikipedia.org/wiki/SMART_Information_Retrieval_System).[[1]](https://en.wikipedia.org#cite_note-1)

## Definitions

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=1)]

In this section we consider a particular vector space model based on the [bag-of-words](https://en.wikipedia.org/wiki/Bag-of-words_model) representation. Documents and queries are represented as vectors.

Each [dimension](https://en.wikipedia.org/wiki/Dimension_(vector_space)) corresponds to a separate term. If a term occurs in the document, its value in the vector is non-zero. Several different ways of computing these values, also known as (term) weights, have been developed. One of the best known schemes is [tf-idf](https://en.wikipedia.org/wiki/Tf-idf) weighting (see the example below).

The definition of *term* depends on the application. Typically terms are single words, [keywords](https://en.wikipedia.org/wiki/Keyword_(linguistics)), or longer phrases. If words are chosen to be the terms, the dimensionality of the vector is the number of words in the vocabulary (the number of distinct words occurring in the [corpus](https://en.wikipedia.org/wiki/Text_corpus)).

Vector operations can be used to compare documents with queries.[[2]](https://en.wikipedia.org#cite_note-:0-2)

## Applications

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=2)]

Candidate documents from the corpus can be retrieved and ranked using a variety of methods. [Relevance](https://en.wikipedia.org/wiki/Relevance_(information_retrieval)) [rankings](https://en.wikipedia.org/wiki/Ranking) of documents in a keyword search can be calculated, using the assumptions of [document similarities](https://en.wikipedia.org/wiki/Semantic_similarity) theory, by comparing the deviation of angles between each document vector and the original query vector where the query is represented as a vector with same dimension as the vectors that represent the other documents.

In practice, it is easier to calculate the [cosine](https://en.wikipedia.org/wiki/Cosine) of the angle between the vectors, instead of the angle itself:

Where is the intersection (i.e. the [dot product](https://en.wikipedia.org/wiki/Dot_product)) of the document (d2 in the figure to the right) and the query (q in the figure) vectors, is the norm of vector d2, and is the norm of vector q. The [norm](https://en.wikipedia.org/wiki/Norm_(mathematics)) of a vector is calculated as such:

Using the cosine the similarity between document *d j* and query

*q*can be calculated as:

As all vectors under consideration by this model are element-wise nonnegative, a cosine value of zero means that the query and document vector are [orthogonal](https://en.wikipedia.org/wiki/Orthogonal) and have no match (i.e. the query term does not exist in the document being considered). See [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) for further information.[[2]](https://en.wikipedia.org#cite_note-:0-2)

## Term frequency–inverse document frequency (tf–idf) weights

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=3)]

In the classic vector space model proposed by [Salton](https://en.wikipedia.org/wiki/Gerard_Salton), Wong and Yang, [3] the term-specific weights in the document vectors are products of local and global parameters. The model is known as

[term frequency–inverse document frequency](https://en.wikipedia.org/wiki/Term_frequency%E2%80%93inverse_document_frequency)(tf–idf) model. The weight vector for document

*d*is , where

and

- is term frequency of term
*t*in document*d*(a local parameter) - is inverse document frequency (a global parameter). is the total number of documents in the document set; is the number of documents containing the term
*t*.

## Advantages

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=4)]

The vector space model has the following advantages over the [Standard Boolean model](https://en.wikipedia.org/wiki/Standard_Boolean_model):

- Allows ranking documents according to their possible relevance
- Allows retrieving items with a partial term overlap
[[2]](https://en.wikipedia.org#cite_note-:0-2)

Most of these advantages are a consequence of the difference in the density of the document collection representation between Boolean and term frequency-inverse document frequency approaches. When using Boolean weights, any document lies in a vertex in a n-dimensional [hypercube](https://en.wikipedia.org/wiki/Hypercube). Therefore, the possible document representations are and the maximum Euclidean distance between pairs is . As documents are added to the document collection, the region defined by the hypercube's vertices become more populated and hence denser. Unlike Boolean, when a document is added using term frequency-inverse document frequency weights, the inverse document frequencies of the terms in the new document decrease while that of the remaining terms increase. In average, as documents are added, the region where documents lie expands regulating the density of the entire collection representation. This behavior models the original motivation of Salton and his colleagues that a document collection represented in a low density region could yield better retrieval results.

## Limitations

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=5)]

The vector space model has the following limitations:

- Query terms are assumed to be independent, so phrases might not be represented well in the ranking
- Semantic sensitivity; documents with similar context but different term vocabulary won't be associated
[[2]](https://en.wikipedia.org#cite_note-:0-2)

Many of these difficulties can, however, be overcome by the integration of various tools, including mathematical techniques such as [singular value decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition) and [lexical databases](https://en.wikipedia.org/wiki/Lexical_database) such as [WordNet](https://en.wikipedia.org/wiki/WordNet).

## Models based on and extending the vector space model

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=6)]

Models based on and extending the vector space model include:

## Software that implements the vector space model

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=7)]

The following software packages may be of interest to those wishing to experiment with vector models and implement search services based upon them.

### Free open source software

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=8)]

[Apache Lucene](https://en.wikipedia.org/wiki/Apache_Lucene). Apache Lucene is a high-performance, open source, full-featured text search engine library written entirely in Java.[OpenSearch (software)](https://en.wikipedia.org/wiki/OpenSearch_(software)),[Elasticsearch](https://en.wikipedia.org/wiki/Elasticsearch)and[Solr](https://en.wikipedia.org/wiki/Apache_Solr): the three most well-known search engine programs based on Lucene. Others are also available.[Gensim](https://en.wikipedia.org/wiki/Gensim)is a Python+[NumPy](https://en.wikipedia.org/wiki/NumPy)framework for Vector Space modelling. It contains incremental (memory-efficient) algorithms for[term frequency-inverse document frequency](https://en.wikipedia.org/wiki/Tf%E2%80%93idf),[latent semantic indexing](https://en.wikipedia.org/wiki/Latent_Semantic_Indexing),[random projections](https://en.wikipedia.org/wiki/Locality_sensitive_hashing#Random_projection)and[latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_Allocation).[Weka](https://en.wikipedia.org/wiki/Weka_(machine_learning)). Weka is a popular data mining package for Java including WordVectors and[Bag Of Words models](https://en.wikipedia.org/wiki/Bag-of-words_model).[Word2vec](https://en.wikipedia.org/wiki/Word2vec). Word2vec uses vector spaces for word embeddings.

## Generalized vector space model

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=9)]

The **Generalized vector space model** is a generalization of the VSM used in [information retrieval](https://en.wikipedia.org/wiki/Information_retrieval). Wong *et al.* [4] presented an analysis of the problems that the pairwise orthogonality assumption of the VSM creates. From here they extended the VSM to the generalized vector space model (GVSM).

Recently Tsatsaronis [5] focused on the first approach. They measure semantic relatedness (

*SR*) using a thesaurus (

*O*) like

[WordNet](https://en.wikipedia.org/wiki/WordNet). It considers the path length, captured by compactness (

*SCM*), and the path depth, captured by semantic path elaboration (

*SPE*).

Building also on the first approach, Waitelonis et al. [6] have computed semantic relatedness from

[Linked Open Data](https://en.wikipedia.org/wiki/Linked_data)resources including

[DBpedia](https://en.wikipedia.org/wiki/DBpedia)as well as the

[YAGO taxonomy](https://en.wikipedia.org/wiki/YAGO_(database)). Thereby they exploits taxonomic relationships among semantic entities in documents and queries after

[named entity linking](https://en.wikipedia.org/wiki/Entity_linking).

## See also

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=10)]

## References

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=11)]

Berry, Michael W.; Drmac, Zlatko; Jessup, Elizabeth R. (January 1999). "Matrices, Vector Spaces, and Information Retrieval".[^](https://en.wikipedia.org#cite_ref-1)*SIAM Review*.**41**(2): 335–362.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1137/s0036144598347035](https://doi.org/10.1137%2Fs0036144598347035).- ^
**a****b****c**Büttcher, Stefan; Clarke, Charles L. A.; Cormack, Gordon V. (2016).**d***Information retrieval: implementing and evaluating search engines*(First MIT Press paperback ed.). Cambridge, Massachusetts London, England: The MIT Press.[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-262-52887-0](https://en.wikipedia.org/wiki/Special:BookSources/978-0-262-52887-0). [^](https://en.wikipedia.org#cite_ref-3)[G. Salton, A. Wong, C. S. Yang, A vector space model for automatic indexing](http://doi.acm.org/10.1145/361219.361220), Communications of the ACM, v.18 n.11, p.613–620, Nov. 1975Wong, S. K. M.; Ziarko, Wojciech; Wong, Patrick C. N. (1985-06-05), "Generalized vector spaces model in information retrieval",[^](https://en.wikipedia.org#cite_ref-wong_4-0)*Proceedings of the 8th annual international ACM SIGIR conference on Research and development in information retrieval - SIGIR '85*,[SIGIR ACM](https://en.wikipedia.org/wiki/Association_for_Computing_Machinery), pp. 18–25,[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/253495.253506](https://doi.org/10.1145%2F253495.253506),[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[0897911598](https://en.wikipedia.org/wiki/Special:BookSources/0897911598)Tsatsaronis, George; Panagiotopoulou, Vicky (2009-04-02),[^](https://en.wikipedia.org#cite_ref-5)(PDF),*A Generalized Vector Space Model for Text Retrieval Based on Semantic Relatedness*[EACL ACM](https://en.wikipedia.org/wiki/Association_for_Computing_Machinery)Waitelonis, Jörg; Exeler, Claudia; Sack, Harald (2015-09-11),[^](https://en.wikipedia.org#cite_ref-6)(PDF), ISWC 2015, CEUR-WS 1581*Linked Data enabled Generalized Vector Space Model to improve document retrieval*

## Further reading

[[edit](https://en.wikipedia.org/w/index.php?title=Vector_space_model&action=edit§ion=12)]

[G. Salton](https://en.wikipedia.org/wiki/Gerard_Salton)(1962), "[Some experiments in the generation of word and document associations](https://dl.acm.org/citation.cfm?id=1461544)"*Proceeding AFIPS '62 (Fall) Proceedings of the December 4–6, 1962, fall joint computer conference*, pages 234–250.*(Early paper of Salton using the term-document matrix formalization)*[G. Salton](https://en.wikipedia.org/wiki/Gerard_Salton), A. Wong, and C. S. Yang (1975), "[A Vector Space Model for Automatic Indexing](https://dl.acm.org/citation.cfm?id=361220)"*Communications of the ACM*, vol. 18, nr. 11, pages 613–620.*(Article in which a vector space model was presented)*- David Dubin (2004),
[The Most Influential Paper Gerard Salton Never Wrote](https://www.ideals.illinois.edu/items/1790)*(Explains the history of the Vector Space Model and the non-existence of a frequently cited publication)* [Description of the vector space model](https://web.archive.org/web/20110814000253/http://cogsys.imm.dtu.dk/thor/projects/multimedia/textmining/node5.html)[Description of the classic vector space model by Dr E. Garcia](http://www.miislita.com/term-vector/term-vector-3.html)[Relationship of vector space search to the "k-Nearest Neighbor" search](http://nlp.stanford.edu/IR-book/html/htmledition/vector-space-classification-1.html)
