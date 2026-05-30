---
url: https://2016.berlinbuzzwords.de/sites/2016.berlinbuzzwords.de/files/media/documents/bm25_buzzwords_britta_weber.pdf
title: bm25_final.key
fetched_at: 2026-05-30T18:56:53
content_hash: sha1:23c891905c67a53988703d769df0a62d539dbc93
extractor: jina
---

Title: bm25_final.key

URL Source: https://2016.berlinbuzzwords.de/sites/2016.berlinbuzzwords.de/files/media/documents/bm25_buzzwords_britta_weber.pdf

Published Time: Sun, 01 Sep 2024 14:55:04 GMT

Number of Pages: 84

Markdown Content:
> ‹#›

Britta Weber 

6/7 /2016 

# BM25 Demystified 2

What is BM25? 

“Oh! BM25 is that probabilistic approach to scoring!” 3

What is BM25? 4

What is BM25? 5

What is BM25? Why is this so complicated? 

> 6

Often when you search you really 

just want to filter by… 

• categories 

• timestamps 

• age 

• ids … 

> 7

Searching in natural language text 

"_source": {

"oder-nr": 1234, 

"items": [3,5,7], 

"price": 30.85, 

"customer": "Jon Doe", 

"date": "2015-01-01" 

}Tweets mails, articles,… are fuzzy 

• language is ambivalent, verbose 

and many topics in one doc 

• no clear way to formulate your 

query 

> 8

Searching in natural language text 

"_source": {

"titles": "guru of everything", 

"programming_languages": [

"java", 

"python", 

"FORTRAN" 

], 

"age": 32, 

"name": "Jon Doe", 

"date": "2015-01-01", 

"self-description": "I am a

hard-working self-motivated expert 

in everything. High performance is 

not just an empty word for me..." 

}9

A free text search is a very inaccurate description of 

our information need 

What you want: 

• quick learner 

• works hard 

• reliable 

• enduring 

• …

"_source": {

"titles": "guru of everything", 

"programming_languages": [

"java", 

"python", 

"FORTRAN" 

], 

"age": 32, 

"name": "Jon Doe", 

"date": "2015-01-01", 

"self-description": "I am a

hard-working self-motivated expert 

in everything. High performance is 

not just an empty word for me..." 

}10 

A free text search is a very inaccurate description of 

our information need 

What you want: 

• quick learner 

• works hard 

• reliable 

• enduring 

• …

But you type : 

“hard-working, self-motivated, 

masochist” 

"_source": {

"titles": "guru of everything", 

"programming_languages": [

"java", 

"python", 

"FORTRAN" 

], 

"age": 32, 

"name": "Jon Doe", 

"date": "2015-01-01", 

"self-description": "I am a

hard-working self-motivated expert 

in everything. High performance is 

not just an empty word for me..." 

}By the end of this talk you should 

• know the monster, understand what the parameters of BM25 do 

> 11

The p urpose of this talk 12 

The p urpose of this talk 

By the end of this talk you should 

• know the monster, understand what the parameters of BM25 do 

• know why it has the label “probabilistic” 13 

The p urpose of this talk 

By the end of this talk you should 

• know the monster, understand what the parameters of BM25 do 

• know why it has the label “probabilistic” 

• be convinced that switching to BM25 is the right thing to do 14 

The p urpose of this talk 

By the end of this talk you should 

• know the monster, understand what the parameters of BM25 do 

• know why it has the label “probabilistic” 

• be convinced that switching to BM25 is the right thing to do 

• be able to impress people with you in depth knowledge of probabilistic 

scoring The current default - TF/IDF 

> 15 16

Example: we are looking for an intern 

Search in self-description of 

applications for these words: 

• self-motivated 

• hard-working 

• masochist 

We want to order applications by their 

relevance to the query. 17 

Evidence for relevance - term frequencies 

Use term frequencies in description, title etc. 

“I got my PhD in Semiotics at the University of ….but I am 

still hard-working ! … It takes a masochist to go through a 

PhD…” 18 

Major tweaks 

• term frequency: more is better 

> term frequency
> score 19

Major tweaks 

• term frequency: more is better 

• inverse document frequency: common words 

are less important 

> term frequency
> score
> document frequency
> score 20

Major tweaks 

• term frequency: more is better 

• inverse document frequency: common words 

are less important 

• long documents with same tf are less 

important: norm 

> term frequency
> score
> document frequency
> score score
> length 21

Bool query and the coord- factor 

Query: holiday, china 

“Blog: My holiday in Bejing” 

term frequencies: 

holiday : 4 

china: 5 

“Economic development of 

Sichuan from 1920-1930” 

term frequencies: 

holiday : 0 

china: 15 

Coord factor: reward document 1 because both terms matched 22 

TF/IDF 

• Successful since the beginning of Lucene 

• Well studied 

• Easy to understand 

• One size fits most 23 

What is wrong with TF/IDF? 

It is a heuristic that makes sense intuitively but it is somewhat a guess. (Ad 

hoc.) 

So…can we do better? Probabilistic ranking and how it led to 

# BM25 

> 24 25

The root of BM25: Probability ranking principle 

(abridged) 

## “If retrieved documents are ordered by 

## decreasing probability of relevance on the 

## data available, then the system’s 

## effectiveness is the best that can be 

## obtained for the data. ” 

> K. Sparck Jones, S. Walker, and S. E. Robertson, “A probabilistic model of information retrieval: Development and comparative experiments. Part 1,”

• simplification: relevance is 

binary! 

• get a dataset queries - relevant/ 

irrelevant documents 

• use that to estimate relevancy 

> 26

Estimate relevancy 27 

Estimate relevancy get a dataset queries - relevant/irrelevant documents and use that to estimate 

relevancy 

> 28

Estimate relevancy 

> relevant
> all documents 29

In math 

For each document, query pair - what is the probability that the document is 

relevant? Order by that! 30 

In math 

R=1 R=0 

d1 0.1 0.9 

d2 0.2 0.8 

d3 0.7 0.3 

… … …31 

In math 

for each query q!

R=1 R=0 

d1 0.1 0.9 

d2 0.2 0.8 

d3 0.7 0.3 

… … …32 

In math 

No way we can ever get a list of that, no matter how many interns we hire…. 

R=1 R=0 

d1 0.1 0.9 

d2 0.2 0.8 

d3 0.7 0.3 

… … …

for each query q!…here be math… 

> 33

34 35 

…and we get to …36 

…and we get to …

…but at least we know we only need two distributions! 

P(tf of “hard-working” = 1| R=1) = 0.1 

P(tf of “hard-working” = 1| R=0) = 0.12 

P(tf of “hard-working” = 2| R=1) = 0.3 

…

P(“hard-working” does not occur in document| R=1) = 0.1 

P(“hard-working” does not occur in document| R=0) = 0.4 How to estimate all these probabilities 

> 37

query term occurs in a document or doesn’t - we don’t care how often 

> 38

The binary independence model - a dramatic but 

useful simplification 

relevant 

documents (R) 

relevant 

documents 

contain 

query term (r) 

documents 

contain 

query term (n) 

all documents (N) 39 

Use actual counts to estimate! 

relevant 

documents (R) 

relevant 

documents 

contain 

query term (r) 

documents 

contain 

query term (n) 

all documents (N) 

Stephen Robertson and Karen Spark Jones, Relevance Weighting of Search Terms 40 

Use actual counts to estimate! 

relevant 

documents (R) 

relevant 

documents 

contain 

query term (r) 

documents 

contain 

query term (n) 

all documents (N) 

Stephen Robertson and Karen Spark Jones, Relevance Weighting of Search Terms 41 

Use actual counts to estimate! 

relevant 

documents (R) 

relevant 

documents 

contain 

query term (r) 

documents 

contain 

query term (n) 

all documents (N) 

Stephen Robertson and Karen Spark Jones, Relevance Weighting of Search Terms 42 

Use actual counts to estimate! 

Plug this into our weight equation 

Stephen Robertson and Karen Spark Jones, Relevance Weighting of Search Terms 43 

Robertson/Sparck Jones weight 

These are really just counts 44 

So, you have an unlimited supply of interns… 

relevant 

relevant 

documents 

contain 

query term (r) 

documents 

contain 

query term (n) 

all documents (N) 

weight 

motivated 0.1 

working 0.6 

experienced 0.23 

… …45 

…but you probably don’t have that 

Still use Robertson/Sparck Jones weight but assume that the number of 

relevant documents is negligible (R=0, r=0): IDF comparison 

> 46

BM25 IDF comparison 

> 47

BM25 

TF/IDF BM25 - We are here… 

> 48

BM25 - We are here… 

> 49

idf - how popular 

is the term in the 

corpus? 50 

Now, consider term frequency! 

What does the number of occurrence of a term tell us about relevancy? 

• In TF/IDF: The more often the term occurs the better 

• But…is a document about a term just because it occurs a certain number of 

times? 

• This property is called “eliteness” 51 

Example for “eliteness” 

• “tourism” 

• Look at wikipedia: Many documents are about tourism 

• Many documents contain the word tourism - but are about something 

completely different, like for example just a country 

Can we use prior knowledge on the distribution of term frequency for getting a 

better estimate on the influence of tf? Two cases: 

• document is not about the 

term 

52 

Eliteness as Poisson Distribution 

Stephen P. Harter, A probabilistic approach to automatic keyword indexing. Part I. On the Distribution of Specialty Words in a Technical Literature 

term frequency 

> Probability for this term frequency

documents that are not 

about term (E=0) Two cases: 

• document is not about the 

term 

• document is about the term 

53 

Eliteness as Poisson Distribution  

> Stephen P. Harter, A probabilistic approach to automatic keyword indexing. Part I. On the Distribution of Specialty Words in a Technical Literature

term frequency 

> Probability for this term frequency

documents that actually 

are about term (E=1) 

documents that are not 

about term (E=0) 54 

How to estimate this? 

• gather data on eliteness for 

term 

• many term frequencies -> 

do for many documents 55 

We need even more interns! Suppose we knew the relationship of 

frequency and eliteness. 

We need: relationship of frequency and 

relevancy! 

> 56

How relevance ties into that Suppose we knew the relationship of 

frequency and eliteness. 

We need: relationship of frequency and 

relevancy! 

• Have yet another 

distribution: 

• make eliteness 

depend on relevanc y

• estimate from data 

> 57

How relevance ties into that 

> elite
> documents
> elite and
> relevant
> documents
> relevant
> documents 58

We need even more interns for the relevance too! 59 

elite 

elite and 

relevant 

documents 

relevant 

documents 

combine the two… 

…plug into here… …here be math… 

> 60 61

…and we get to…. 62 

…and we get to…. Stephen Robertson and Hugo Zaragoza, The Probabilistic Relevance Framework: BM25 and Beyond 

> 63

“This is a somewhat messy formula, and furthermore we do not in general 

know the values of these three parameters, or have any easy way of 

estimating them. ”64 

“…they took a leap of faith…” 

Victor Lavrenko, Probabilistic model 9: BM25 and 2-poisson , youtube 65 

What is the shape? 

If we actually had all these interns and could get the exact shape then the 

curve… 

• would start at 0 

• increase monotonically 

• approach a maximum asymptotically 

• maximum would be the IDF we computed before! 66 

What is the shape? 

If we actually had all these interns and could get the exact shape then the 

curve… 

• would start at 0 

• increase monotonically 

• approach a maximum asymptotically 

• maximum would be the IDF we computed before! 

Just use something similar! 67 

Tf saturation curve 

• limits influence of tf 

• allows to tune influence by 

tweaking k 

bm25 - approaches limit   

> ft,d = frequency of term in document
> k= saturation parameter 68

Tf saturation curve 

• limits influence of tf 

• allows to tune influence by 

tweaking k 

bm25 - approaches limit 

tf/idf - keeps growing   

> ft,d = frequency of term in document
> k= saturation parameter

BM25 - We are here… 

> 69

idf - how popular 

is the term in the 

corpus? BM25 - We are here… 

> 70

idf - how popular 

is the term in the 

corpus? 

saturation 

curve - limit 

influence of tf 

on the score • Poisson distribution: Assumes a fixed length of documents 

• But they don’t have that (most of the time) 

• We have to incorporate this too! 

• scale tf by it like so: 

> 71

So…we assume all documents have same length? 

Interpolation between 1 and document length/average document length 72 

Influence of b 

• tweak influence of document 

length 

ft,d = frequency of term in document 

k = saturation parameter 

b = length parameter 

l(d) = number of tokens in document 

avgdl = average document length in corpus 73 

Influence of b 

• tweak influence of document 

length 

ft,d = frequency of term in document 

k = saturation parameter 

b = length parameter 

l(d) = number of tokens in document 

avgdl = average document length in corpus BM25 - We are here… 

> 74

idf - how popular 

is the term in the 

corpus? 

saturation 

curve - limit 

influence of tf 

on the score BM25 - We are done! 

> 75

idf - how popular 

is the term in the 

corpus? 

saturation 

curve - limit 

influence of tf 

on the score 

length weighing -

tweak influence of 

document length 76 

Is BM25 probabilistic? 

• many approximations 

• really hard to get the probabilities right even with unlimited data 

BM25 is “inspired” by probabilistic ranking. A short history of BM25 

> 77

Probability 

ranking principle 

TREC-3 

BM25 final! 

Poisson 

distribution 

for terms 

1970 1980 1990 2000 2010 

1975 1994 

1977 

TREC-2 

Leap of faith 

1993 

1976 

Robertson/Sparck Jones 

weight Pluggable similarities 

+ BM25 in 

Lucene (GSoC ,

David Nemeskey )

BM25 becomes default! 

elasticsearch 5.0 

Lucene 6.0 

First Lucene 

release (TF/IDF) 

1999 

2011 

We are 

here 

?2016 So…will I get a better scoring with BM25? 

> 78 79

Pros with the frequency cutoff 

TF/IDF: common words can still influence the score! 

BM25: limits influence of term frequency 

• less influence of common words 

• no more coord factor! 

• check if you should disable coord for bool queries? 

index.similarity.default.type: BM25 

> bm25 - approaches limit
> tf/idf - keeps growing 80

Other benefits 

parameters can be tweaked. To update: 

• close index 

• update mapping (or settings) 

• re-open index 

Mathematical framework to include non-textual features 81 

A warning: Lower automatic boost for short fields 

With TF/IDF: short fields (title,…) are automatically scored higher 

BM25: Scales field length with average 

• field length treatment does not automatically boost short fields (you have to 

explicitly boost) 

• might need to adjust boost 82 

Is BM25 better? 

• Literature suggests so 

• Challenges suggest so (TREC,…) 

• Users say so 

• Lucene developers say so 

• Konrad Beiske says so: Blog “BM25 vs Lucene Default Similarity ”

But: It depends on the features of your corpus. 

Finally: You can try it out now! Lucene stores everything necessary already. 83 

Useful literature 

• Manning et al., Introduction to Information retrieval 

• Robertson and Zaragoza, The Probabilistic Relevance Framework: BM25 

and Beyond 

• Robertson et al., Okapi at TREC-3 

• https://github.com/apache/lucene-solr/blob/master/lucene/core/src/java/org/ 

apache/lucene/search/similarities/BM25Similarity.java 84 

Thank you!
