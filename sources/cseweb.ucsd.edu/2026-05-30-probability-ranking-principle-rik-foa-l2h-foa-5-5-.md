---
url: https://cseweb.ucsd.edu/~rik/foa/l2h/foa-5-5-1.html
title: Probability Ranking Principle
fetched_at: 2026-05-30T18:56:50
content_hash: sha1:34541d9391573a347d4e65e74934da6de53104b0
extractor: trafilatura
---

We begin with an important assumption called the
Dr. Cooper recently offered the
following, updated opinion concerning the PRP:
If a reference retrieval
system's response to each request is a ranking of the documents in the
collection in order of decreasing probability of relevance ... the
overall effectiveness of the system to its user will be the best that is
obtainable\ldots. \vanR{113}
This assumption reduces the problem of
building an optimal IR system to one of ordering documents in order of
decreasing probability of relevance. Defining our retrieval task in
these terms is optimal in the sense that it minimizes the amount of
expected error in retrieval performance (cf. Section
There are at least two possible
interpretations of precisely what a probability of relevance, $)$,
means, in terms of an underlying event space [
Consistent
with previous notation (cf. Section
According to the PRP, we
can hope that our ${ \mathname{Match}}(\mathbf{q,d})$ function
accurately reflects the probability of relevance: {\bf
\mathname{Match}}(\mathbf{q,d}) \propto \Pr( \mathname{Rel}_{\mathbf{q}}
| \mathbf{d}_{i}) but in fact only need to require that it reliably
ranks documents: {\bf \mathname{Rank}}(\mathbf{d}_{i}) < {\bf
\mathname{Rank}}(\mathbf{d}_{j}) \Longleftrightarrow \Pr( \mathname{Rel}
| \mathbf{d}_{i}) > \Pr( \mathname{Rel} |\mathbf{d}_{j})
Finally, to
emphasize the
**FOA Home****UP:** Probabilisitic retrieval

## Probability Ranking Principle

**PROBABILITY RANKING
PRINCIPLE** (PRP): {The PRP has been variously attributed (cf.
\vanR{113}) to William Maron, William Cooper and Steve Robertson. Here
we use van Reijsbergen's statement.
[§5.5.6](https://cseweb.ucsd.edu/foa-5-5-6.html) ).
[Maron77](https://cseweb.ucsd.edu/bibrefs.html#Maron77)] [[REF178](https://cseweb.ucsd.edu/bibrefs.html#REF178)] [[REF318](https://cseweb.ucsd.edu/bibrefs.html#REF318)] . The first is to imagine (again
considering a particular query) that the ``experiment'' of showing the
document to a user is repeated across multiple users. Alternatively, we
can imagine that the same query/document relevance question is put
*repeatedly to the same user* with them sometimes replying that
it is relevant and sometimes that it isn't. However we interpret
$\Pr(\mathname{Rel})$, we will focus on one particular query and compute
$Pr(\mathname{Rel})$ *conditionalized* by any and all
**FEATURES** we might associate with the document $\mathbf{d}$ .
[§4.3.4](https://cseweb.ucsd.edu/foa-4-3-4.html) , [§5.3.1](https://cseweb.ucsd.edu/foa-5-3-1.html) ) we will define ${\bf
\mathname{Rank}}(d)$ to be a positive integer assigned to each document
in the \Ret set, in descending order of similarity with respect to a
(henceforth implicit) query $q$, and using the matching function ${\bf
\mathname{Match}}(q,d)$: {\bf \mathname{Match}}(\mathbf{q,d}) \;\in \Re
\nonumber \\ {\bf \mathname{Rank}}(\mathbf{d}) \;\in \jmath^{+}
\nonumber \\ {\bf \mathname{Rank}}(\mathbf{d}_{i}) < {\bf
\mathname{Rank}}(\mathbf{d}_{j}) \Longleftrightarrow {\bf
\mathname{Match}}(\mathbf{q},\mathbf{d}_{i}) > {\bf
\mathname{Match}}(\mathbf{q},\mathbf{d}_{j})
*representation* of the document into its
constituent features, as well as the sensitivity of our notions of
relevance on this representation (cf. [[vanR92](https://cseweb.ucsd.edu/bibrefs.html#vanR92)] ), the remainder of this section
will change notation slightly. Let ${\bf x}$ be a vector of features
$x_{i}$ describing the document. The PRP is then restated: \Pr
(\mathname{Rel} | {\bf x})

*Top of Page***UP:** Probabilisitic retrieval[, FOA Home ](http://www.cse.ucsd.edu/~rik/foa/)
