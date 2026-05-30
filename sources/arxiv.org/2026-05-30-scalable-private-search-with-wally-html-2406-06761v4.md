---
url: https://arxiv.org/html/2406.06761v4
title: Scalable Private Search with Wally
fetched_at: 2026-05-30T15:37:32
content_hash: sha1:d03cf0b8f4489dd8eff6b1835bcad06f9a94d58e
extractor: trafilatura
---

# Scalable Private Search with Wally

###### Abstract

This paper presents Wally, a private search system that supports efficient semantic and keyword search queries against large databases. When sufficiently many clients are making queries, Wally’s performance is significantly better than previous systems. In previous private search systems, for each client query, the server must perform at least one expensive cryptographic operation per database entry. As a result, performance degraded proportionally with the number of entries in the database.

In Wally, we remove this limitation. Specifically, for each query the server performs cryptographic operations against only a few database entries. We achieve these results by requiring each client to add a few fake queries, and send each query via an anonymous network to the server at independently chosen random instants. Additionally, each client also uses somewhat homomorphic encryption (SHE) to hide whether a query is real or fake. Wally provides -differential privacy guarantee, which is an accepted standard for strong privacy.

The number of fake queries each client makes depends inversely on the number of clients making queries. Therefore, the fake queries’ overhead vanishes as the number of clients increases, enabling scalability to millions of queries and large databases. Concretely, Wally can process eight million queries in 117 minutes, or just under two hours. That is around four orders of magnitude faster than the state of the art.

## 1 Introduction

Consider a scenario where a client holding a search query wants to retrieve relevant information from a large database hosted on a server. This scenario reflects the flow of current search engines such as Google, Bing, and DuckDuckGo. These search engines improve the quality of our lives by promptly providing helpful information. Nevertheless, they require learning the client’s query in order to respond accurately, hence providing no query privacy. In some situations, learning the query could reveal sensitive and personal information about the client. For example, consider the queries “High blood pressure with late-stage HIV?”, “Closest diabetes clinic from Albuquerque”, and “Best divorce lawyers”. Revealing these queries to search engines could be damaging to the client. However, even if the queries do not appear sensitive, they may allow the server to learn personal information like medical information, marital status, sexuality, etc. Therefore, enabling query privacy is critical for search engines.

Private search engines opt to provide query privacy. However, these systems have
significantly higher computational and communication
overhead than the state-of-the-art insecure solutions.
For example, in Tiptoe [[26](https://arxiv.org/html/2406.06761v4#bib.bib26)], a state-of-the-art private search engine, a single client query is 21 MB and
requires 339 core-seconds of server computing against a database of million entries.
The high computational cost is because, for each client query, the server must scan the entire database; otherwise,
it will learn which database entries the client is not interested in. Similarly,
the client must send cryptographic material for each database entry, which results
in high communication cost111In reality, these systems trade off response
size with request size by using a standard database clustering trick. We detail this trade off in a later section..
An additional limitation of Tiptoe is that it requires each client to store a database-dependent state of around 50 MB
for each client query.

In this paper, we present Wally, a privacy preserving search engine that efficiently scales to the performance constraints of large-scale search engines. Wally supports semantic search, where the client wants to fetch the most relevant documents to a query, and keyword search, where the client wants to retrieve documents associated with a private keyword. To provide privacy, our key observation is that in search engines, there are always enough clients making queries. We exploit this observation to gain privacy by devising a way to hide a particular query in the crowd of queries. In our protocol, the server computation and the communication are amortized over the number of clients making the requests; therefore, when the number of clients is large, the per-query cost becomes minimal.

Wally achieves these results by relaxing its privacy notion to -differential privacy.
In Wally, the server learns a noised differentially private histogram of anonymized queries
from all clients, over a partition of the server database. We emphasize that previous works, e.g., Tiptoe, are fully oblivious.
That is, the server learns nothing besides that a particular client is making a query.
Therefore, the privacy guarantee of schemes like Tiptoe is stronger than Wally. However,
differential privacy is an accepted standard for strong privacy [[16](https://arxiv.org/html/2406.06761v4#bib.bib16)].
Specifically, every client in Wally is guaranteed that any statistical inferences
are insensitive to their data. In other words, their participation
does not significantly alter the server’s view, except with probability ,
and thus provides strong privacy protection.

At a high level, Wally works in *epochs*.
Within each epoch, a fixed number of users make queries.
The epoch length is picked to ensure enough clients are present to make queries, and their queries will be processed by the end of an epoch.
The server divides the database into clusters.
Each query consists of a relevant cluster *index*,
and the server response is all the entries in the cluster.
The queries arrive at the server via an anonymous network, ensuring all identifiable information like IP address is removed from the queries.
The server then generates a response to each query independently and sends it back to the respective client via an anonymous network.

Even though queries are anonymized, they do not provide query privacy. The server can infer information about the client query by exploiting the access pattern (if a particular cluster is accessed) or arrival time (when the server receives queries). To prevent this leakage, Wally implements the following two changes at the client.

First, to ensure that the server does not learn information by observing the access patterns, each client in Wally makes fake queries. For each fake query, the client picks a randomly selected bucket. This ensures that the server cannot differentiate between real and fake queries. The number of fake queries is sampled from a particular distribution to ensure the revealed histogram of queries is -differentially private. In expectation, each client makes fake queries where is the number of clients within an epoch, and is the maximum number of queries each client can make in an epoch. Note that increasing the number of clients decreases the average number of fake queries. The overhead due to fake queries can be traded with privacy because more fake queries are required as decreases. We emphasize that fake queries do not affect the accuracy or correctness seen by any client, as the client can discard the responses due to these queries.

Second, Wally also ensures that arrival time and order of the queries leak no information about the client to the server.
To achieve this, instead of making a query instantly, the clients make queries at random one second *slots* within an epoch.
Also, an anonymous network collects the requests received within a particular slot and sends them as a batch to the server.

Anonymizing the queries, adding fake queries that are indistinguishable from real ones, and randomizing query order and time guarantees differential privacy.

As mentioned above, for each query, the server response contains all the entries in the cluster. For large clusters, this would result in very high response overhead. In Wally, we utilize lattice-based, somewhat homomorphic encryption (SHE) to reduce the response overhead. Specifically, for semantic search, each query additionally includes a semantic information (dependent on the client’s input) encrypted under SHE. The server computes the distance function between the encrypted information and the cluster entries under SHE and returns encrypted scores. This reduces the response because the size of encrypted scores is significantly smaller than the entries.

For a keyword search, the client sends an encrypted PIR query, and the server runs an SHE-based keyword private information retrieval (PIR) protocol within the cluster, which returns data associated with the client keyword. To ensure that the server cannot differentiate between real and fake queries, for every fake query the client includes encrypted semantic, or keyword queries based on fake data. We propose various optimizations that significantly improve performance for both kinds of searches.

Overall, for a database with 35 million entries Wally can process eight million real queries in 117 minutes on 320 cores, a drastic improvement over the state-of-the-art, which would have required years to process the same queries. Additionally, the size of each request is 53 times smaller and the size of each response is 3.5 times smaller compared to Tiptoe.

Our contributions are as follows:

-
•
We describe Wally’s design, which enables privacy-preserving large-scale search engines. Its novelty stems from the combination of anonymity, fake queries added by the clients, and the client’s use of SHE to encrypt its queries.

-
•
We also describe the implementation of Wally, showing efficiency and scalability along with a robust privacy guarantee. Generally, SHE computations have a high performance overhead. To achieve desired performance constraints, we propose several optimizations to SHE computation (distance computation and PIR) that could be of independent interest.

-
•
We evaluate Wally for private image search, demonstrating both strong privacy and low overhead.


#### Limitation.

Wally requires a set number of clients always present in an epoch to make queries.
This assumption aligns with current search engines. For example, hundreds of
millions of people make queries in Google search daily [[19](https://arxiv.org/html/2406.06761v4#bib.bib19)].
We remark that for systems with few users, the overhead due to fake queries could
get quite high, therefore fully oblivious protocols, like Tiptoe,
for these systems would be more suitable.

## 2 Background

Let be the set of the first natural
numbers starting from one. Matrices and vectors are represented
as capital boldface letters and capital lowercase, respectively,
e.g., and . The entry-wise, Hadamard, product
of two vectors is denoted as .
All logarithms are the natural log unless noted otherwise.
We denote a random variable being sampled from a probability distribution as .
All distributions in this work are over finite sets and
denotes uniformly sampling from when is a discrete set.
We denote the integers as and the integers
modulo a positive integer as .
Let denote the negative binomial distribution
parameterized by .
Its probability mass function is
, ,
for every non-negative integer . An important fact about
the negative binomial distribution is that it is infinitely divisible,
Definition [1](https://arxiv.org/html/2406.06761v4#Thmdefinition1).

###### Definition 1.

A distribution is infinitely-divisible if for all , it can be expressed as the sum of i.i.d. variables. That is, there exists a distribution such that and .

### 2.1 (Somewhat) Homomorphic Encryption

Fully homomorphic encryption (FHE) is a special cryptosystem allowing arbitrary computation over ciphertexts. FHE for arbitrary computation is still very expensive. To achieve practical performance, somewhat homomorphic encryption (SHE, also called leveled FHE) is often used, which only supports a limited number of computations.

We focus on SHE schemes based on the Ring Learning
with Errors (RLWE) problem. Concretely, Wally can be implemented using
any SHE scheme such as BFV [[18](https://arxiv.org/html/2406.06761v4#bib.bib18)] or BGV [[10](https://arxiv.org/html/2406.06761v4#bib.bib10)]
that share the following structure.
A plaintext is a polynomial in a ring (with degree at most )
and plaintext modulus is a prime or prime power.
The secret key is a
polynomial of degree with small coefficients, in .
A ciphertext is a pair of polynomials
where is ciphertext modulus and .
Here is picked uniform randomly and is a noise polynomial with coefficients
sampled from a bounded Gaussian distribution. A scheme satisfies its decryption formula: .
This noise polynomial’s coefficients grow as we compute more
homomorphic operations on the ciphertext, and we can only decrypt correctly
if .
We call the parameter’s noise budget, measured in bits.

#### SHE parameters.

We choose parameters by first choosing a homomorphic computation, plaintext modulus, and a security parameter. This leads to a ring dimension and modulus which 1) satisfies the security requirement and 2) allows for enough noise budget to allow decryption after homomorphic computation. Larger gives more noise budget, but it also necessitates a larger dimension for security. The ratio of the ring dimension to the modulus bits, , stays roughly constant for a fixed security level.

#### Vectorized SHE.

When a plaintext modulus is a prime satisfying , these SHE schemes support operations on plaintext vectors as well as polynomials. In the vectorized case, each ciphertext encrypts a plaintext vector , and the homomorphic operations are single-instruction multiple-data (SIMD) instructions, that is, the same operation is performed on each component of the plaintext vectors. Vectorized SHE is crucial for applications requiring homomorphic linear algebra.

#### SHE operations and costs.

SHE schemes we consider support the following operations. Given , ,

-
•
returns a ciphertext encrypting .

-
•
returns a ciphertext encrypting .

-
•
returns a ciphertext encrypting .

-
•
returns a ciphertext encrypting .

-
•
for returns a ciphertext encrypting

where () is () cyclically shifted to the left by r positions, if originally encrypted . We can homomorphically swap with the same operation, called “conjugation”.


In Table [1](https://arxiv.org/html/2406.06761v4#S2.T1) we show concrete run times and noise growth for BFV, an efficient SHE scheme.
In general, addition and plaintext multiplication are efficient
and addition has minimal noise growth. The latter has larger growth proportional to .
Ciphertext-ciphertext multiplication has large noise growth and is
somewhat inefficient since it requires multiplying the ciphertext
polynomials over the integers then rounding down back to .
Ciphertext rotation adds little noise but it is somewhat slow due to
key-switching. Therefore, minimizing the number of ciphertext multiplications
and ciphertext rotations is crucial for scalable applications.

#### Evaluation keys.

Ciphertext rotation and multiplication require evaluation keys that depend on a secret key. Additionally, each rotation requires a separate evaluation key. Usually, these keys can be reused, but as mentioned later, in Wally the client must send fresh keys for each query. Therefore, these keys contribute to the client’s request size.

| Operation | Time (ms) | Noise added (bits) |

[6](https://arxiv.org/html/2406.06761v4#bib.bib6)] (git commit b70d927) on an Intel Xeon w3-2423 using a single core.

#### Differential privacy.

We use the standard notion of differential
privacy (DP) [[15](https://arxiv.org/html/2406.06761v4#bib.bib15), [14](https://arxiv.org/html/2406.06761v4#bib.bib14)]: a randomized mechanism
is -differentially private if for all and
, any two datasets differing on
one element, and for any subset of possible transcripts output by ,
where the probability is over the randomness of .
Let be an output of a mechanism , then
the privacy loss in observing between two datasets as input
is

Essentially, standard DP ensures that neighboring datasets have
a privacy loss of at most with probability
at least for all observations.
We use basic composition in DP [[36](https://arxiv.org/html/2406.06761v4#bib.bib36), Lemma 2.3].

###### Lemma 1.

If are each -DP with independently sampled randomness, then is -DP.

#### Anonymous networks.

Anonymous networks (ANs), also called anonymization networks and anonymous communication protocols, are protocols
which offer user anonymity by using cryptographic techniques such as
onion routing [[23](https://arxiv.org/html/2406.06761v4#bib.bib23)], or mixnets [[11](https://arxiv.org/html/2406.06761v4#bib.bib11)].
Throughout the paper, we assume that ANs 1) strip all identifying information from incoming messages from clients,
and 2) permute all received messages within a batch of messages from clients before sending them to the server.

#### Private information retrieval.

Though the paper is mostly presented for approximate nearest neighbor retrieval,
Wally applies to exact retrieval as well by using keyword PIR for its homomorphic computation.
Private information retrieval (PIR) protocols are cryptographic
client-server protocols where a server holds a large database
and the client obliviously retrieves an entry from the database.
PIR protocols can be for index retrieval or retrieval by keyword [[12](https://arxiv.org/html/2406.06761v4#bib.bib12)].
In this paper, we focus on single-server PIR protocols [[30](https://arxiv.org/html/2406.06761v4#bib.bib30)]
since we can shard the database and the client can run Wally to anonymously
retrieve entries and hide its downloaded entry on the shard. We use and optimize PIR
protocols based on SHE with minimal preprocessing, such as [[5](https://arxiv.org/html/2406.06761v4#bib.bib5)]
and [[4](https://arxiv.org/html/2406.06761v4#bib.bib4)]. There is a notion of differentially-private
PIR in the multi-server setting [[34](https://arxiv.org/html/2406.06761v4#bib.bib34), [2](https://arxiv.org/html/2406.06761v4#bib.bib2)],
where the database is stored across non-colluding servers while guaranteeing differential privacy.
This is in contrast to Wally which stores the database on one server or servers controlled by a single entity.

## 3 System Overview

Figure [1](https://arxiv.org/html/2406.06761v4#S3.F1) shows a high-level design of Wally.
It consists of three entities: the server, the clients, and the anonymization network.
Wally runs in epochs of time; within each epoch, a fixed number of clients make queries.
Within each epoch, Wally performs a search that outputs the most *relevant*
results to client queries, similar to insecure search engines.
Wally does not require any synchronization across clients.
Each client can independently decide to participate or skip an epoch.
However, we require a minimum number of honest clients
stay online throughout an epoch and that a participating client can only make at most queries within each epoch.
Overall, the privacy loss for a particular client is the sum of the loss in each epoch in which the client has participated.
Wally’s privacy notion also requires that each client makes at most queries in the system’s lifetime; therefore, a client can participate at most epochs.
The correctness guarantee is that all the queries within epoch are processed by the end of the epoch.

In Wally each epoch is divided into time slots, each a second long, e.g., and privacy is guaranteed by the following:

-
•
Hiding the content of the queries (somewhat homomorphic encryption).

-
•
Hiding the real queries of clients among fake queries (differential privacy).

-
•
Removing the identifiable information from each query and shuffling the batch of queries received within a time slot (anonymization network).

-
•
Hiding the information revealed by queries order and time of arrival (random query schedule).


#### Embedding-based search.

Similar to state of the art insecure semantic search and previous secure search,
Wally utilizes (vector) embeddings for semantic search.
Embeddings are a machine learning-based technique that map unstructured objects like documents,
images, and videos to -dimensional vectors of floats.
These embeddings retain the semantic relationship between
objects by placing similar objects close together in a vector space.
Hence, they are used to find relevant entries in search systems.
Embeddings are usually much smaller than the objects themselves,
which results in a significant reduction in client-to-server communication.
Embeddings can be generated for different data types, including text,
image, and video. Therefore, Wally can support all these data types.
Wally is compatible with all the recent embedding models, such as BERT [[13](https://arxiv.org/html/2406.06761v4#bib.bib13)].

In the following sections, we introduce the insecure version of semantic search in Wally. We then highlight the privacy issues in this version. Finally, we discuss how we overcome these privacy issues.

### 3.1 Insecure Search Pipeline

In the offline phase, the server maps each document to the corresponding embedding. At the time of a query the client embeds the query into an embedding. Once the client query and the server documents are represented as embeddings, Wally uses an approximate nearest neighbor algorithm to find the documents most relevant to the client’s query. Our two-step approximate nearest neighbor protocol has the following flow:

-
•
Server initialization. At initialization, the server divides the documents (using their embeddings) into clusters using K-means clustering, a heuristic-based technique that partitions data into disjoint clusters , and outputs these clusters and their centroid embeddings . The server sends the centroid embeddings to the client.

-
•
Pick nearest centroid. To make a query, the client first locally finds the cluster nearest to the query embedding. For this, the client computes a similarity between the query and each of the centroid embeddings and picks a cluster whose centroid has high similarity.

-
•
Server computation. The client then sends the nearest cluster index and query embedding to the server. The server computes similarity between the query embedding and each embedding in cluster . The server returns the similarity scores to the client.

-
•
Pick nearest entry. The client sorts these scores and picks the entry closest to the query.

-
•
Metadata retrieval. The client then fetches the metadata associated with the closest entry from the server.


The clustering technique provides a trade-off between performance and accuracy; generally, increasing the number of clusters improves the performance (reduces server computation and response size). However, it degrades the accuracy because there is a higher chance that a potential nearest neighbor is in a different cluster than the cluster with the closest centroid. Therefore, finding a balance is important for the overall usability of the system.

The above protocol is not private. To ensure that the protocol does not reveal any information about the client’s query, it must hide the following information from the server:

-
•
Query embedding. The client sends query embeddings to the server at the time of the query. Recall that these embeddings maintain the semantic meaning of the original data and reveal sensitive information about that data. Recent research has shown that embeddings reveal up to 92 of the original data [

[33](https://arxiv.org/html/2406.06761v4#bib.bib33)]. -
•
Nearest cluster. The client reveals to the server the nearest cluster ID. Recall that clustering puts highly correlated documents together in a cluster. Therefore, the cluster ID can reveal the kind of data the client holds. For example, if the client query is a song embedding, the cluster ID might reveal the genre of the song.

-
•
Closest entry index. To fetch the relevant metadata, the client sends the index of the closest entry to the server. Learning this could reveal server information about the query.


We show how we hide the above data below and in Section [6](https://arxiv.org/html/2406.06761v4#S6).

### 3.2 Hiding the Query Embedding

We rely on efficient vectorized, RLWE-based SHE described in Section [2](https://arxiv.org/html/2406.06761v4#S2) to hide a query embedding.
At a high level, the client sends an SHE encryption of its embedding to the server, and the server homomorphically (under encryption)
computes similarity scores between the query embedding and all the embeddings in the nearest cluster. The server
then returns encrypted scores to the client.
SHE computation is inherently expensive; we utilize various techniques to make similarity computation efficient.
Overall, in our implementation, the client query and server response are a single RLWE ciphertext of sizes 226kB,
and 53kB, respectively, (the former with evaluation keys) and it only takes 19 ms for the server
to compute similarity scores for a single cluster homomorphically.

### 3.3 Hiding the nearest cluster

By using SHE, the content of the query is hidden from the server, but the server learns the nearest cluster. Hiding the nearest cluster is a significant performance bottleneck in previous schemes like Tiptoe. Specifically, to conceal the nearest cluster for a single query, Tiptoe requires the server to perform SHE operations against the entire database (all the clusters). Otherwise, skipping clusters will reveal to the server that the client is not interested in them. Computing over the entire database hides the nearest cluster in the most robust possible sense, but this results in a prohibitively high server computation cost.

Instead, we propose an approach based on differential privacy. The key advantage is that, in expectation, the server computes encrypted similarity scores only against a few clusters per query. Our approach results in a significant improvement in server computation. An additional advantage of our approach is a reduction in request size; concretely, the request size is only , around smaller than Tiptoe. Conversely, differential privacy is a weaker privacy notion than the full, cryptographic obliviousness Tiptoe achieves.

The starting point of our solution is an observation that in large-scale search engines, sufficiently many clients are making the queries at any given time. Therefore, we propose a novel mechanism to hide a particular client query among the crowd of queries from all the clients. Our proposed approach provides -differential privacy. This approach guarantees to every client that the maximum privacy loss due to its queries is essentially bounded by with all but probability. In other words, a client’s queries do not significantly influence the outcome of any statistical inference run by the server.

As the first step, we require all the traffic (queries and responses) to and from the server to route through the anonymization network. Intuitively, one would expect that doing this would hide the query in the crowd of queries, as queries do not carry identifiable information. However, note that only using an anonymization network is not sufficient because by observing traffic patterns, the server can learn information about a client. For example, if the server has side information that a particular client is interested in a specific cluster and all the other clients are known not to access the cluster then by observing that the cluster is accessed, the server can infer whether a request is from the client or not. Similarly, the server can exploit the arrival times of queries to infer if queries belong to a particular client. For example, the queries towards each epoch’s start could belong to a particular user.

To achieve the desired privacy, we make the following two additional changes, highlighted in Figure [3](https://arxiv.org/html/2406.06761v4#S4.F3):

-
•
Fake queries. In addition to real queries, each client makes a few fake queries. Specifically, for each cluster, the client makes fake queries, where distribution is chosen to guarantee differential privacy after fake queries from many clients are aggregated. In expectation, the client makes fake queries. For each fake query, the client creates an SHE encryption of zero and pseudorandomly picks one of the clusters.

-
•
Random query schedule. The client makes queries at random instances within the epoch. For this, we assume that each epoch is divided into slots, each one second long. For each query (real or fake), the client independently picks a random slot and only makes the query at that slot.


Intuitively, these two changes suppress the leakage, as mentioned above.
In Section [6](https://arxiv.org/html/2406.06761v4#S6), we show that using the negative binomial distribution for
fake queries along with random query schedule guarantees differential privacy.

### 3.4 Hiding Metadata Index

After learning the index of the nearest entry, the client retrieves metadata associated with it. When metadata per entry is small, the server returns metadata of the entire cluster with each query. Note that this leaks no extra information because the server already learns the cluster ID for each query. The client then locally selects the metadata associated with the most relevant entry. However, if the metadata is quite large, the client can run Keyword PIR to fetch the metadata of only the most relevant entry within a cluster.

### 3.5 Keyword Search

Wally also supports keyword searches in which the client is interested in retrieving data associated with a keyword. Using a random hash function, the server divides the database into random buckets (instead of clusters). For each query, the client uses the same hash function to find the bucket in which the keyword falls locally and then uses the efficient keyword PIR scheme to fetch a specific record within a bucket. The differential privacy part remains the same as in semantic search. That is, clients make fake queries for random buckets at a random schedule.

## 4 Efficient SHE-Based Instantiation

In Wally, for semantic search, SHE is used to calculate similarity scores between the query and nearest cluster embeddings, and for the keyword search, an SHE based Keyword PIR is used to fetch the entry associated with query keyword among the entries in the bucket in which query keyword falls. In this section, we discuss the details of our efficient SHE-based instantiation.

### 4.1 SHE details in semantic search

The server database is encoded as an array of plaintext vectors. The output is a single response ciphertext with at most encrypted similarity scores, where is the RLWE polynomial dimension.

#### Server database.

Recall that the server database is divided into K clusters. Each cluster consists of at most embeddings. For simplicity, we assume that for a given cluster , the dataset is represented as a cube of dimensions , recall that is the embedding size. Each cube consists of slices, each of which is a matrix of dimensions , and each column within a slice is an embedding. Denote elements of ’th embedding as . For now, we assume that the plaintext dimension size and each diagonal within a slice is a separate plaintext. That is each slice is represented as plaintexts vectors, and ’th vector consists of entries . This means each plaintext vector consists of a single index from each embedding in a slice in increments of one. The client encrypts the query embedding in a single SHE ciphertext.

#### SHE dot-product computation.

Recall, from Section [2](https://arxiv.org/html/2406.06761v4#S2), to calculate cosine similarity between two embeddings, the server needs to compute a dot-product between them.
To achieve that, the server must align the query to ensure that elements of a query vector only get multiplied with
corresponding element of plaintext vectors, i.e., every element-wise multiplication should
be of the form .
The server will use homomorphic rotation to move the elements within the encrypted query vector to the correct alignment.
Specifically, for a given slice, starting with the first plaintext vector ,
the server performs *vectorized ciphertext-plaintext* multiplication between the query ciphertext and the first plaintext vector .
This results in encrypted .
No rotation is required for first multiplication because the query is already aligned with the first vector.
The elements of the second plaintext vector are .
Hence, the server cannot directly multiply it with the query vector.
The server first homomorphically rotates the query vector one slot to the left, resulting in query vector then
multiplies the result: .
The server then repeats this for all the remaining plaintext vectors in a slice: rotating the query vector in increments
of one and multiplying it with the plaintext vector.
By the end the server has encrypted multiplications.
The server then sums all of these vectors together, resulting in a single encrypted vector in which each element is a dot
product between the client query vector and one of the embeddings in the slice.
Figure [2](https://arxiv.org/html/2406.06761v4#S4.F2) shows an example server computation for a single slice for .

#### Database and query packing.

The above description assumes that the polynomial dimension equals embedding dimension . However, is often significantly larger than . In this setting, each plaintext vector could hold multiple diagonals. Our scheme packs diagonals across the slices in a single plaintext vector. Concretely, a cube’s -th plaintext vector holds -th diagonals of slices. In all the practical databases that we have considered, the number of slices per cube is smaller than . Therefore, by using packing, the entire cube can be encoded with only plaintext vectors.

The client query encrypts a plaintext vector of repetitions of the query embedding. This query still allows the server to align the entries of query embeddings by homomorphically rotating left in increments of one. The number of ciphertext-plaintext multiplications is now while the response consists of ciphertexts. Again, for the databases we consider, results in multiplications, and each response is a single ciphertext.

Recall from Section [2](https://arxiv.org/html/2406.06761v4#S2) that homomorphic rotation is
costly. In the above explanation, the server performs rotations even after packing to align the query.
In Wally we use the standard baby-step giant-step (BSGS) optimization [[24](https://arxiv.org/html/2406.06761v4#bib.bib24)]
to minimize the number of rotations: for -dimensional inner products, BSGS
requires only rotations for step sizes of (baby step) and (giant step).
See Algorithm 1 in [[24](https://arxiv.org/html/2406.06761v4#bib.bib24)] for the BSGS algorithm.

#### Float-to-integer encoding.

Recall from Section [2](https://arxiv.org/html/2406.06761v4#S2) that vectorized SHE supports operations over vectors of integers while
embeddings are vectors of floats.
In Wally we convert each float into an integer by multiplying it with the appropriate scaling factor
having the plaintext modulus be large enough to perform the computation over the integers. The choice
of scaling factor depends on the size of SHE plaintext modulus and the required precision.

### 4.2 SHE details in keyword search

The server database consists of (keyword, value) entries. Recall that the server divides these entries into buckets using a random hash function. Within each bucket, in Wally we use a keyword PIR construction based on cuckoo hashing and index PIR.

At a high level, for each bucket independently, the server uses the cuckoo hashing to map the entries
into a table of size using two random hash functions.
The guarantee is that if a *keyword* is present in the database,
it must be at bucket index or in the table.
The client then uses index PIR to privately fetch entries at these indices and locally find
the index containing the entry and associated data.
Wally uses MulPIR [[4](https://arxiv.org/html/2406.06761v4#bib.bib4)] as the underlying index PIR, an efficient single-server PIR scheme based on SHE.
We emphasize that even though we initialize Wally with MulPIR,
it is compatible with any recent efficient PIR scheme.

Each server bucket consisting of entries is represented as a matrix . MulPIR uses a polynomial version of SHE, where each plaintext is a polynomial. For this explanation, we assume that each entry has the same size as SHE plaintext. If entries are larger than a plaintext, then we split each entry across multiple plaintexts, and if entries are smaller, then we pack multiple entries into each plaintext polynomial when applicable. A client query in MulPIR is a single ciphertext encrypting row and column indices. Given a query, the server does the following.

-
1.
First expand to two -length ciphertext vectors. Encrypting row indicator vector and column indicator vector . The server uses the oblivious expansion algorithm given in [

[4](https://arxiv.org/html/2406.06761v4#bib.bib4)] to expand. This algorithm requires homomorphic substitutions. -
2.
Then compute the matrix-vector product with plaintext-ciphertext multiplications and ciphertext additions.

-
3.
Finish by computing that results a single ciphertext that is a response. This step uses ciphertext-ciphertext multiplications and ciphertext additions. to compute.


Section [A](https://arxiv.org/html/2406.06761v4#A1) discusses various optimizations we implemented for MulPIR.
Overall, our optimizations resulted in a three-fold reduction in server computation and
a three-fold reduction in request size.

## 5 Wally Protocol

In this section, we describe the complete Wally protocol for a single epoch in semantic search.
We assume that honest clients are present to query within that epoch.
Due to the space limitation, we only describe the semantic search protocol in detail,
but keyword search follows a similar protocol with changes mentioned
in Section [A](https://arxiv.org/html/2406.06761v4#A1).

#### Server initialization.

The server uses Algorithm [1](https://arxiv.org/html/2406.06761v4#alg1)
to encode the database with embeddings into vectorized plaintexts.
Specifically, the algorithm divides the input embeddings into clusters using K-means clustering.
The algorithm then iterates over each cluster separately.
Each cluster consists of column-wise slices.
The algorithm then fills plaintext vectors for each cluster.
In a plaintext vector , the algorithm packs ’th diagonal of all matrices.
Once plaintext vectors are generated, the algorithm iterates over a group of plaintexts,
rotating each group in increasing multiples of . These rotations are required for the baby-step giant step
(BSGS) optimization [[24](https://arxiv.org/html/2406.06761v4#bib.bib24)].
Note that these rotations are performed on plaintexts, so their cost are negligible.

#### Query generation.

Each client uses Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2) to generate queries
and their schedule at the start of an epoch.
The client locally has a set of cluster centroids that the server generates during initialization.
The algorithm first generates independent queries for at most real query embeddings.
To generate a ’th real query, the algorithm picks a centroid nearest to ’th query embedding.
Then, the algorithm copies the embedding times into a plaintext vector of size .
This is done to take advantage of SHE packing.
The algorithm then generates a fresh SHE secret key and rotation evaluation key ,
and encrypts using .

Next, the algorithm generates fake queries. Here, the algorithm iterates over each cluster, sampling a number of fake queries from the negative binomial distribution . To generate a single fake query, the algorithm picks a random centroid, generates a fresh SHE secret key and evaluation keys , and encrypts using . Note that the client must generate a fresh evaluation key to keep each query anonymous. Also, each evaluation key must include a rotation key for steps and , because the server computation involves rotating by these steps.

The algorithm then permutes the real and fake queries list and generates a random schedule for the queries. To generate the schedule , for each query , the algorithm picks a random slot independently and appends to . In other words, the schedule maps slot indices to the query indices. At a particular time slot within an epoch, the client will make queries (independently) indicated by .

#### Server computation.

The server uses Algorithm [4](https://arxiv.org/html/2406.06761v4#alg4)
to generate a response for every query received.
The algorithm first aligns the query ciphertext .
That is, first it copies the query ciphertext times and then rotates each copy left in increments of one, in total rotations.
Then, the algorithm performs a dot-product between rotated query ciphertexts and the plaintext vectors for cluster .
Recall that we ensure each cluster is encoded into plaintexts.
The algorithm iterates in groups of plaintexts; within each group,
multiply the -th plaintext with the -th
copy of the rotated query and sum the resulting ciphertexts.
These iterations yield ciphertexts.
After that, the algorithm iterates over the resulting ciphertexts,
rotating right each in increments of and summing all of them into a single ciphertext .
This step requires a total of rotations. The algorithm returns and cluster ’s metadata.

## 6 Security

In this section, we prove that if honest clients follow
Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2) to generate queries, then the overall system achieves
-differential privacy in each epoch. Recall from Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2) that each query
consists of the nearest centroid and the embedding. We only focus on proving the
privacy of centroids because the IND-CPA security of SHE protects query embeddings.
Therefore, we model each query as a nearest centroid without an embedding in this section.
During each epoch, the server receives multiple queries for each cluster. Towards the end of the epoch,
the server’s view can be considered as a noisy
histogram over all clusters. We consider this noisy histogram as an output of the DP mechanism.

We prove this argument in two steps: First, we show that a noisy histogram output by a curator, which gets users’ queries as input and uses negative binomial mechanism to sample fake queries, is -DP in the central model. Second, we show that the view of the server in an epoch can be simulated only using the curator’s output.

### 6.1 DP Security in the Central Model

We define the central model as follows:

#### Central model.

The curator performs the following:

-
1.
Collects the real queries from all the clients, , where is the total number of clients, and is each client’s set of queries and will be at most . Let denote the list of all real queries.

-
2.
For each cluster , samples the number of fake queries . Add it to the fake queries list .

-
3.
Given the list of real and fake queries, randomly permute them: .

-
4.
Send to the server.


Another way to view it is that the curator sends a noisy histogram of queries to each cluster to the server. Recall that each client can contribute at most queries.

We then prove the following theorem:

###### Theorem 1.

For any query database of size , number of clusters , differential privacy parameters , and , let and . Then, the negative binomial mechanism is -DP for -histogram.

###### Proof.

We define the curator as Algorithm that takes input from a database of requests from clients and outputs a noisy histogram. We prove the theorem by investigating the affected buckets when we change the input by replacing one client with another.

For a particular cluster in the histogram, we define , where is the total real queries for the cluster in the database. Note that this is the curator’s exact output for each cluster. We break down the proof into two edge cases: 1) the simpler case where and differ by a client which sends all their messages to a single cluster and 2) they differ by a client which sends messages to different clusters.

Simple case. Consider two neighboring databases and which differ in queries contributed by a single client. Concretely, in the client contributes queries to a cluster and in instead contributes to another cluster . Note that when then and are identically distributed. Thus, the privacy provided by is 0-DP for all .

Now consider the cluster ; the two databases differ by real queries for this cluster. By the following, lemma provides privacy on cluster .

######
Lemma 2 (Theorem 13 [[22](https://arxiv.org/html/2406.06761v4#bib.bib22)]).

For any and , let
and . Then,
the -Mechanism is -DP
in the central model for -summation222-summation is the counting problem in which each client can send at most queries.
We extend it to histograms, -histograms, or the counting problem adopted by allowing each client to make at max queries per epoch across all buckets.
.

We can make a similar argument for a cluster . Therefore, by basic composition,
Lemma [1](https://arxiv.org/html/2406.06761v4#Thmlemma1), the total privacy provided by for these neighboring databases is —DP.

General case. Now, we consider a general case where two neighboring databases that differ in queries from a single client. In database the client contributes queries for cluster and in database the client contributes queries for the cluster . Define . The total difference between two neighboring databases is given by .

Let .
Further, we only consider the clusters where since the
clusters where are already -DP. (Equivalently, for these .)
Then, Lemma [2](https://arxiv.org/html/2406.06761v4#Thmlemma2) implies cluster is -DP
for -summation for the same mechanism since

Simple composition over all the clusters yields

Basic composition also yields that the composed protocol has since at most clusters differ. ∎

We emphasize that the theorem is stated for a particular epoch . If clients participate in many epochs, say , then basic composition yields -DP.

### 6.2 Generating view of the server

We show how the curator’s output is sufficient to simulate the server’s view generated by distributed DP
algorithm defined in Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2) together with an anonymization network (AN).
We also require pseudorandom ciphertexts and evaluation keys,
a common assumption for RLWE-based SHE schemes. The latter is
also why we cannot reuse evaluation keys.

###### Theorem 2.

Let be an anonymous network that 1) removes all identifying information
from messages it receives and 2) randomly permutes all the messages it receives
over a second-long slot. Let each honest client run the distributed mechanism in Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2)
with messages sent to the server via . Then, the view of the server in an epoch can be simulated
using the curator noisy histogram output described above in the central model.

###### Proof.

We use infinite divisibility of distribution to produce a standard cryptography hybrid argument.

Hybrid 0: Every client is the same as the real client given in Algorithm [2](https://arxiv.org/html/2406.06761v4#alg2) except it does not include
encrypted embeddings with each request (real or fake).
Hybrid 0 is equivalent to the real client finding the nearest centroid for each real query and
a fake random centroid for each fake query. The client then picks a random slot for each query and send
associated queries at each slot.

Hybrid 1: In this hybrid, we replace all the clients with a single simulator. The input of a simulator is a list , where are the real queries for -th client. The simulator then simulates each client with input as in Hybrid 0.

As the simulator internally runs each client as in
Hybrid 0 with input , from the adversary’s point of view,
the distribution of requests is the same as Hybrid 0.

Hybrid 2: In this Hybrid, the simulator’s input is the same as in the previous Hybrid 1. The simulator is defined as follows.

-
1.
Collects the real queries from all the clients, . Call it a list of real queries .

-
2.
For each cluster , samples the number of fake queries . Add it to the fake queries list .

-
3.
Given the list of real queries and fake queries , randomly permutes them: .

-
4.
Initialize schedule list of size (where z is the total number of slots in an epoch). For each query , pick a random slot and set .

-
5.
For each slot send queries in to the server.


There are two differences between Hybrid 2 and Hybrid 1:

-
1.
In Hybrid 1, each simulated client samples fake queries for each cluster from a distribution . While in Hybrid 2 (Line

[2](https://arxiv.org/html/2406.06761v4#S6.I2.i2)) the simulator samples fake queries per cluster from . -
2.
In Hybrid 1, each simulated client generates a schedule for its queries independently, while in Hybrid 2, the simulator generates a schedule for queries.


To show that Hybrid 2 and 1 are indistinguishable, we use the definition of infinitely divisible
distribution, Definition [1](https://arxiv.org/html/2406.06761v4#Thmdefinition1).

Note that negative binomial distribution is infinite divisible because .
Thus, the distribution of per cluster fake queries per cluster in Hybrid 2 (Line [2](https://arxiv.org/html/2406.06761v4#S6.I2.i2)) is the same as in Hybrid 1.
Observe that a random slot is picked for each
query independently in both Hybrids.
Therefore, the query schedule generated in both Hybrids is indistinguishable.

To complete the proof, note that in Line [3](https://arxiv.org/html/2406.06761v4#S6.I2.i3), the simulator generates
in the same way as the curator in the central model. After that, the simulator uses this to generate a random query schedule,
which results in a server’s view indistinguishable from the view in Hybrid 0.

∎

## 7 Implementation and Performance Evaluation

In this section, we demonstrate Wally’s concrete performance via a set of experiments. We also showcase Wally’s performance tradeoffs: fake query overhead versus number of clients, fake query overhead versus the DP parameters, and the difference in low-precision performance versus high-precision performance.

### 7.1 Implementation

We have implemented Wally in Swift atop the
Apple swift-homomorphic-encryption library [[6](https://arxiv.org/html/2406.06761v4#bib.bib6)]. Following the library,
we use BFV [[18](https://arxiv.org/html/2406.06761v4#bib.bib18)] to implement the SHE parts of Wally. However, our
protocol could easily be implemented using other SHE schemes such as BGV [[10](https://arxiv.org/html/2406.06761v4#bib.bib10)].

#### BFV parameters

The choice of BFV parameters provides a trade-off between computation and communication in Wally.
At a high level, larger parameters provide better computation but result in high request size.
We tried multiple sets of parameters and picked the one that provided the best performance.
We set polynomial modulus , ciphertext modulus , and plaintext modulus bits.
These parameters allow a precision of six bits. To increase the precision, we use plaintext CRT optimization described in
Section [A](https://arxiv.org/html/2406.06761v4#A1). This optimization’s key benefit is increasing precision without increasing
the evaluation key size (which is a dominating factor in each query).
For this we set first plaintext modulus bits and second plaintext .
This gives us a precision of 13 bits.

#### Differential privacy parameters

Differential privacy parameters provide a trade-off between privacy and performance overhead due to fake queries. For a fixed failure probability , smaller provides stronger privacy but worse performance because each client is required to make more fake queries. We set , which means DP will fail only once a million and , providing a decent privacy guarantee.

### 7.2 Performance Evaluation

#### Experimental setup.

We ran server-side computations on an Intel Xeon w3-2423 instance with 32GB of RAM and 6 cores.

#### End-to-end performance.

| Metric | Low prec. | Mid prec. | Tiptoe |
| Query Size (MB) | 0.67 | 0.84 | 16.2 |
| Response Size | |||
| (MB) | 0.16 | 0.18 | 3.2 |
| Time to process | |||
| queries | 117 mins | 139 mins | 2.8 years |
| Precision (bits) | 6 | 13 | 4 |
| Privacy | DP | DP | SHE |

Table [2](https://arxiv.org/html/2406.06761v4#S7.T2) describes our main experiments compared to Tiptoe.
For an end-to-end system, we estimate the network time on a 30Mbps channel.
This comes out to 74ms for transmitting
a query and response over the network for the small precision setting
(first column in Tables [2](https://arxiv.org/html/2406.06761v4#S7.T2) and [3](https://arxiv.org/html/2406.06761v4#S7.T3)).

The server database consists of 35 million entries divided into around 8500 clusters. We keep each cluster size less than the number of plaintext slots in each BFV ciphertext, . We assume each client makes queries per epoch for these experiments. Moreover, there are four million honest clients present in an epoch. This results in eight million real queries in an epoch.

For Wally, we calculated the overhead by using Theorem [2](https://arxiv.org/html/2406.06761v4#Thmlemma2).
The fake query overhead is derived by
the expected number of fake queries for the negative binomial
mechanism, , as

| (1) |

where is the total number of clusters and
is the total number of clients. For our selected parameters, for each real query, the client is required to make
just under two fake queries.
Therefore, the total number of queries within an epoch is 24 million.
In Table [2](https://arxiv.org/html/2406.06761v4#S7.T2), we included fake query overhead in query request,
response and total computation plus estimated network time in Wally. The epoch size in Wally is the total time
it takes to process all the queries (real and fake).

For Tiptoe, we assume there are eight million queries the server processes one by one.
Tiptoe requires running experiments on real compute nodes; due to resource limitations, we
carefully estimate their results using Table 7 in [[26](https://arxiv.org/html/2406.06761v4#bib.bib26)].

Before discussing Wally’s performance, we emphasize that Wally requires the following two extra assumptions not required in Tiptoe.

-
•
Wally requires sufficiently many honest clients during an epoch.

-
•
It also needs an anonymization network that removes all identifying information from incoming messages and randomly permutes messages over a short time, e.g., one-second time slots.


In other words, Wally trades off privacy guarantees for scalability.

Wally has significantly better performance than Tiptoe across all the metrics. Specifically, the query size (including overhead due to fake queries) in Wally 19-23 times smaller than in Tiptoe. This is because the query in Wally only covers a single cluster, while Tiptoe covers all clusters. Similarly, the response size is 3.1-3.6 smaller. Wally’s efficient server computation makes it an ideal candidate for practical deployments in comparison to Tiptoe. For example, to process eight million queries, the server with 320 cores requires around 117 minutes in Wally. In Tiptoe, the same server would require more than two years to process these queries, which is unsuitable for most practical search services.

#### Scaling DP with .

Figure [4](https://arxiv.org/html/2406.06761v4#S7.F4) shows how the expected fake queries per cluster for each client
scales with for one million clients and four million clients.
This is derived by dividing Equation [1](https://arxiv.org/html/2406.06761v4#S7.E1) by the number of clusters .
Note that the total number of clients has a linear effect while the dependence on
is nonlinear as we decrease .

#### Precision.

Table [3](https://arxiv.org/html/2406.06761v4#S7.T3) shows how each query grows as
we increase precision, i.e., as we increase the BFV parameters using
our plaintext CRT optimization described in Section [A](https://arxiv.org/html/2406.06761v4#A1).
The six bit precision parameters are the same as we used in Table [2](https://arxiv.org/html/2406.06761v4#S7.T2)
while the bit parameters use the plaintext CRT on
and , .
Lastly, the 29 precision parameters use two
BFV parameter sets with
and .

| Precision (bits) | 6 | 13 | 29 |
| Query (KB) | 226 | 283 | 901 |
| Response (KB) | 53 | 63 | 196 |
| Server comp. (ms) | 19 | 35 | 110 |

#### Scaling with the number of clients.

Table [4](https://arxiv.org/html/2406.06761v4#S7.T4) shows how the fake query overhead varies with
the number of messages per epoch and the number of clients
in the system. We emphasize that the number of fake queries increases
linearly with the number of buckets and decreases proportionally
to the number of clients. As mentioned above, this can be offset by increasing
the size of the clusters to a multiple of and we can perform
the similarity computation in parallel with more threads.
Table [4](https://arxiv.org/html/2406.06761v4#S7.T4) emphasizes the importance of having many
clients in a system since the overhead vanishes as the number
of clients becomes large.

| Number of Clients | .5M | 1M | 2M | 10M |
| Fake queries () | ||||
| Exp. MB () | ||||
| Fake queries () | ||||
| Exp. MB () |

[2](https://arxiv.org/html/2406.06761v4#S7.T2).

### 7.3 Keyword Query Performance

Table [5](https://arxiv.org/html/2406.06761v4#S7.T5) shows single-threaded keyword PIR server performance, measured on an Intel Xeon w3-2423
CPU with 32GB of RAM using swift-homomorphic-encryption [[6](https://arxiv.org/html/2406.06761v4#bib.bib6)].
Each entry used a BFV parameter set of , with three ciphertext moduli, and
using MulPIR [[4](https://arxiv.org/html/2406.06761v4#bib.bib4)]. Each response size was 27KB.
Note, however, that each dataset size requires manual tuning for optimal encryption and cuckoo hashing parameters.

| Database entries | Entry Size (Bytes) | Query size (KB) | Time (ms) |
| 100k | 10 | 368 | 166 |
| 100k | 100 | 539 | 465 |
| 1 million | 10 | 539 | 565 |
| 1 million | 100 | 624 | 1700 |

[A](https://arxiv.org/html/2406.06761v4#A1).

## 8 Related Work

Anonymization networks alone do not provide query privacy. Further, the server can learn the distribution of queries to each cluster when these protocols are applied to clustered databases.

Recently, there has been a number of works making private search engines using
homomorphic encryption, and potentially PIR, in order to obtain full cryptographic obliviousness.
Tiptoe [[26](https://arxiv.org/html/2406.06761v4#bib.bib26)], the most recent and performant, has
been discussed above in-detail. Other less efficient solutions include
Coeus [[1](https://arxiv.org/html/2406.06761v4#bib.bib1)] as well as Hers [[17](https://arxiv.org/html/2406.06761v4#bib.bib17)],
with the latter providing privacy for the server’s database as well.
Adjusting Wally to provide security for the server would decrease performance since we
would need to add circuit privacy to the server’s SHE computation, raising the RLWE parameters
to the next largest ring dimension for noise flooding[[7](https://arxiv.org/html/2406.06761v4#bib.bib7), [32](https://arxiv.org/html/2406.06761v4#bib.bib32)],
and including a client public key in each query [[20](https://arxiv.org/html/2406.06761v4#bib.bib20)].

Another related area of work is differentially-private multi-server PIR schemes [[34](https://arxiv.org/html/2406.06761v4#bib.bib34), [2](https://arxiv.org/html/2406.06761v4#bib.bib2)].
In both works, servers learn differentially private, noised histograms over queries. The former, [[34](https://arxiv.org/html/2406.06761v4#bib.bib34)],
has clients generate fake queries whereas the latter, [[2](https://arxiv.org/html/2406.06761v4#bib.bib2)], has the servers inject fake queries.
Both require a secure multiparty computation over the entire database. Notably, [[2](https://arxiv.org/html/2406.06761v4#bib.bib2)] can serve
one million queries in about two seconds on a 100K entry database with eight servers in a dishonest majority security model
and a ten minute pre-computation. Their offline and online computation grows linearly with the size of the
server’s database.

Differential privacy has also been applied to multiple anonymous messaging systems [[37](https://arxiv.org/html/2406.06761v4#bib.bib37), [35](https://arxiv.org/html/2406.06761v4#bib.bib35), [31](https://arxiv.org/html/2406.06761v4#bib.bib31)].
These are large (many server) mix-net-like protocols where the servers add in fake queries
to hide user messages with a differential privacy guarantee. Though they are for a different application, their
use of differential privacy is similar to Wally’s.

## 9 Conclusion

Wally demonstrates that private search systems can be scalable to systems with many users. Wally carefully balances somewhat homomorphic encryption together with differential privacy to hide the client’s query and reveal a differentially private histogram over all clients’ traffic to database clusters. Further, Wally’s overhead from differential privacy vanishes as the number of users in the system increases. This vanishing overhead is crucial to scalability and is potentially useful in many private systems deployable at-scale.

## References

- [1] Ishtiyaque Ahmad, Laboni Sarker, Divyakant Agrawal, Amr El Abbadi, and Trinabh Gupta. Coeus: A system for oblivious document ranking and retrieval. In SOSP, pages 672–690. ACM, 2021.
- [2] Kinan Dak Albab, Rawane Issa, Mayank Varia, and Kalman Graffi. Batched differentially private information retrieval. In USENIX Security Symposium, pages 3327–3344. USENIX Association, 2022.
- [3] Martin R. Albrecht, Rachel Player, and Sam Scott. On the concrete hardness of learning with errors. J. Math. Cryptol., 9(3):169–203, 2015.
- [4] Asra Ali, Tancrède Lepoint, Sarvar Patel, Mariana Raykova, Phillipp Schoppmann, Karn Seth, and Kevin Yeo. Communication-computation trade-offs in PIR. In USENIX Security Symposium, pages 1811–1828. USENIX Association, 2021.
- [5] Sebastian Angel, Hao Chen, Kim Laine, and Srinath T. V. Setty. PIR with compressed queries and amortized query processing. In IEEE Symposium on Security and Privacy, pages 962–979. IEEE Computer Society, 2018.
-
[6]
Apple Inc. and Swift Homomorphic Encryption project authors.
Swift Homomorphic Encryption.
URL:
[https://github.com/apple/swift-homomorphic-encryption](https://github.com/apple/swift-homomorphic-encryption). - [7] Gilad Asharov, Abhishek Jain, Adriana López-Alt, Eran Tromer, Vinod Vaikuntanathan, and Daniel Wichs. Multiparty computation with low communication, computation and interaction via threshold FHE. In EUROCRYPT, volume 7237 of Lecture Notes in Computer Science, pages 483–501. Springer, 2012.
- [8] Jean-Claude Bajard, Julien Eynard, M. Anwar Hasan, and Vincent Zucca. A full RNS variant of FV like somewhat homomorphic encryption schemes. In SAC, volume 10532 of Lecture Notes in Computer Science, pages 423–442. Springer, 2016.
- [9] Zvika Brakerski. Fully homomorphic encryption without modulus switching from classical gapsvp. In CRYPTO, volume 7417 of Lecture Notes in Computer Science, pages 868–886. Springer, 2012.
- [10] Zvika Brakerski, Craig Gentry, and Vinod Vaikuntanathan. (leveled) fully homomorphic encryption without bootstrapping. ACM Trans. Comput. Theory, 6(3):13:1–13:36, 2014.
- [11] David Chaum. Untraceable electronic mail, return addresses, and digital pseudonyms. Commun. ACM, 24(2):84–88, 1981.
- [12] Benny Chor, Niv Gilboa, and Moni Naor. Private information retrieval by keywords. IACR Cryptol. ePrint Arch., page 3, 1998.
- [13] Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. BERT: pre-training of deep bidirectional transformers for language understanding. In NAACL-HLT (1), pages 4171–4186. Association for Computational Linguistics, 2019.
- [14] Cynthia Dwork, Krishnaram Kenthapadi, Frank McSherry, Ilya Mironov, and Moni Naor. Our data, ourselves: Privacy via distributed noise generation. In EUROCRYPT, volume 4004 of Lecture Notes in Computer Science, pages 486–503. Springer, 2006.
- [15] Cynthia Dwork, Frank McSherry, Kobbi Nissim, and Adam D. Smith. Calibrating noise to sensitivity in private data analysis. In TCC, volume 3876 of Lecture Notes in Computer Science, pages 265–284. Springer, 2006.
- [16] Cynthia Dwork, Aaron Roth, et al. The algorithmic foundations of differential privacy. Foundations and Trends® in Theoretical Computer Science, 9(3–4):211–407, 2014.
- [17] Joshua J. Engelsma, Anil K. Jain, and Vishnu Naresh Boddeti. HERS: homomorphically encrypted representation search. IEEE Trans. Biom. Behav. Identity Sci., 4(3):349–360, 2022.
- [18] Junfeng Fan and Frederik Vercauteren. Somewhat practical fully homomorphic encryption. IACR Cryptol. ePrint Arch., page 144, 2012.
-
[19]
Torbjørn Flensted.
How many people use google? statistics facts.
[https://seo.ai/blog/how-many-people-use-google](https://seo.ai/blog/how-many-people-use-google), 2024. [Online; accessed 23-May-2024]. - [20] Craig Gentry. A fully homomorphic encryption scheme. PhD thesis, Stanford University, USA, 2009.
- [21] Craig Gentry, Shai Halevi, and Nigel P. Smart. Homomorphic evaluation of the AES circuit. In CRYPTO, volume 7417 of Lecture Notes in Computer Science, pages 850–867. Springer, 2012.
- [22] Badih Ghazi, Ravi Kumar, Pasin Manurangsi, and Rasmus Pagh. Private counting from anonymous messages: Near-optimal accuracy with vanishing communication overhead. In ICML, volume 119 of Proceedings of Machine Learning Research, pages 3505–3514. PMLR, 2020.
- [23] David M. Goldschlag, Michael G. Reed, and Paul F. Syverson. Onion routing. Commun. ACM, 42(2):39–41, 1999.
- [24] Shai Halevi and Victor Shoup. Faster homomorphic linear transformations in helib. In CRYPTO (1), volume 10991 of Lecture Notes in Computer Science, pages 93–120. Springer, 2018.
- [25] David Harvey. Faster arithmetic for number-theoretic transforms. Journal of Symbolic Computation, 60:113–119, 2014.
- [26] Alexandra Henzinger, Emma Dauterman, Henry Corrigan-Gibbs, and Nickolai Zeldovich. Private web search with tiptoe. In SOSP, pages 396–416. ACM, 2023.
- [27] Alexandra Henzinger, Matthew M. Hong, Henry Corrigan-Gibbs, Sarah Meiklejohn, and Vinod Vaikuntanathan. One server for the price of two: Simple and fast single-server private information retrieval. In USENIX Security Symposium, pages 3889–3905. USENIX Association, 2023.
- [28] Zhicong Huang, Wen-jie Lu, Cheng Hong, and Jiansheng Ding. Cheetah: Lean and fast secure two-party deep neural network inference. In USENIX Security Symposium, pages 809–826. USENIX Association, 2022.
- [29] Andrey Kim, Yuriy Polyakov, and Vincent Zucca. Revisiting homomorphic encryption schemes for finite fields. In ASIACRYPT (3), volume 13092 of Lecture Notes in Computer Science, pages 608–639. Springer, 2021.
- [30] Eyal Kushilevitz and Rafail Ostrovsky. Replication is NOT needed: SINGLE database, computationally-private information retrieval. In FOCS, pages 364–373. IEEE Computer Society, 1997.
- [31] David Lazar, Yossi Gilad, and Nickolai Zeldovich. Karaoke: Distributed private messaging immune to passive traffic analysis. In OSDI, pages 711–725. USENIX Association, 2018.
- [32] Baiyu Li, Daniele Micciancio, Mark Schultz, and Jessica Sorrell. Securing approximate homomorphic encryption using differential privacy. In CRYPTO (1), volume 13507 of Lecture Notes in Computer Science, pages 560–589. Springer, 2022.
- [33] John X. Morris, Volodymyr Kuleshov, Vitaly Shmatikov, and Alexander M. Rush. Text embeddings reveal (almost) as much as text. In EMNLP, pages 12448–12460. Association for Computational Linguistics, 2023.
- [34] Raphael R. Toledo, George Danezis, and Ian Goldberg. Lower-cost -private information retrieval. Proc. Priv. Enhancing Technol., 2016(4):184–201, 2016.
- [35] Nirvan Tyagi, Yossi Gilad, Derek Leung, Matei Zaharia, and Nickolai Zeldovich. Stadium: A distributed metadata-private messaging system. In SOSP, pages 423–440. ACM, 2017.
- [36] Salil Vadhan. The complexity of differential privacy. Tutorials on the Foundations of Cryptography: Dedicated to Oded Goldreich, pages 347–450, 2017.
- [37] Jelle van den Hooff, David Lazar, Matei Zaharia, and Nickolai Zeldovich. Vuvuzela: scalable private messaging resistant to traffic analysis. In SOSP, pages 137–152. ACM, 2015.

## Appendix A Optimizations

Here we present our optimizations for both use cases: approximate nearest neighbor search and exact retrieval (PIR).
Our optimizations revolve around the BFV [[9](https://arxiv.org/html/2406.06761v4#bib.bib9), [18](https://arxiv.org/html/2406.06761v4#bib.bib18)] and BGV [[10](https://arxiv.org/html/2406.06761v4#bib.bib10)]
SHE schemes. Further, we describe several optimizations to the MulPIR scheme [[4](https://arxiv.org/html/2406.06761v4#bib.bib4)].
First, we describe the standard RNS optimization in SHE [[21](https://arxiv.org/html/2406.06761v4#bib.bib21)]
and a method to compress ciphertexts by dropping LSBs as described in
Cheetah [[28](https://arxiv.org/html/2406.06761v4#bib.bib28)].

#### RNS form.

Often is larger than machine-size words and we use as the product of machine-sized primes . This allows us to store a ciphertext as two polynomials each stored as an matrix of integers by the Chinese remainder theorem (CRT) on . Further, we require each to be NTT friendly, . This allows us to use the number theoretic transform (NTT) to efficiently switch between each evaluation form and coefficient form in time , since the NTT is a modular version of the fast Fourier transform over a prime modulus. We can efficiently compress a ciphertext by modulus-switching down to a smaller modulus, where , e.g., , without affecting the ciphertext’s noise budget.

#### Dropping ciphertext LSBs.

We use Cheetah’s [[28](https://arxiv.org/html/2406.06761v4#bib.bib28)] method to compress
ciphertexts after homomorphic computation: we modulus switch down
to the smallest RNS modulus, , then drop the least significant
bits of the ciphertext. This technique compresses the response size further
than simply modulus-switching down, but it also adds noise.
Cheetah incorrectly models the ciphertext as noiseless
(Appendix F in [[27](https://arxiv.org/html/2406.06761v4#bib.bib27)]), but
we derive the proper analysis as follows. Dropping
the LSBs of a BFV ciphertext
can be analyzed by expressing the polynomials
as high and low bit polynomials
.
Then, the new decryption equation is

for

We have correctness as long as . Concretely, we are able to drop around kB from the response size in approximate nearest neighbors search to a response size of kB when combined with our BFV plaintext CRT optimization described in the next subsection.

### A.1 Approximate Nearest Neighbors Optimizations

The homomorphic computation in the approximate nearest neighbors use case is inner products over real embedding vectors satisfying , normalized to in our use case, where is the maximum cluster size. We scale ’s entries to integers, round them to a vector , and perform the inner product over the integers. The computation is correct as long as the inner product does not wrap around mod . We define plaintext precision as since the inner product has a multiplicative depth of one.

#### Minimal rotation keys and bandwidth.

Wally uses the “baby-step giant-step” (BSGS) optimization [[24](https://arxiv.org/html/2406.06761v4#bib.bib24)]
to minimize the number of rotation keys: for -dimensional inner products, BSGS
requires rotations for step sizes of (baby) and (giant).
See Algorithm 1 in [[24](https://arxiv.org/html/2406.06761v4#bib.bib24)] for the BSGS algorithm. Additionally, we
are able to use two rotation keys since in our use case. This optimization leads us to
a query size of one ciphertext and two rotation keys .
For key-switching, and relinearization in PIR below,
we use the hybrid-GHS [[21](https://arxiv.org/html/2406.06761v4#bib.bib21)] key-switching strategy described
in-detail by Kim et al. [[29](https://arxiv.org/html/2406.06761v4#bib.bib29)].

Say we require a plaintext modulus of for bits of plaintext precision.
The smallest BFV ring dimension supporting this is which requires a evaluation key modulus of ,
ciphertext modulus of
for 128 bits of post-quantum security [[3](https://arxiv.org/html/2406.06761v4#bib.bib3)]333[https://github.com/malb/lattice-estimator](https://github.com/malb/lattice-estimator).
A query consists of polynomials for the ciphertext and polynomials for the
evaluation keys, or kB and kB respectively, for a total query size of
kB for these parameters.

#### Re-using BFV evaluation keys via the plaintext CRT.

Wally achieves minimal query bandwidth per client query by a novel use of the Chinese remainder theorem (CRT) on the BFV plaintext space. The CRT on plaintexts allows increase the plaintext precision without increasing evaluation key size since BFV’s evaluation keys are independent of the plaintext modulus. Therefore, we encrypt a vector as and for NTT-friendly primes . The computation is correct if the inner products do not wrap around modulo , but the individual ciphertexts can have their computation wrap around modulo each .

In general, plaintext CRT is preferable to increasing the ring dimension since the evaluation key sizes dominate the ciphertext size: 6 polynomials versus 2 polynomials. This is true in the bandwidth-optimal key-switching strategy for hybrid GHS key-switching. Another advantage of the plaintext CRT is that it allows for very high precision computations which do not wrap around mod . One limitation of this optimization is that we run out of NTT-friendly plaintext primes for small parameter sets, like or .

### A.2 PIR Optimizations

#### Uneven dimensions.

In general, the cost of a ciphertext-ciphertext multiplication is much higher
than a ciphertext rotation and both are much higher than addition
or plaintext multiplication. For example, Table [1](https://arxiv.org/html/2406.06761v4#S2.T1) shows ciphertext addition and plaintext multiplication
as less than while ciphertext rotation is and
ciphertext multiplication is .

Therefore, we structure the database (cluster) as a rectangle with uneven dimensions and . For any fixed HE parameter set, the server’s compute time is dominated by ciphertext multiplications and rotations and that the former is a constant factor more than the latter. This simplification yields a compute time of where and are the times to multiply and rotate ciphertexts, respectively. More simply, the total compute time, measured in terms of rotations, is

rotations. Minimizing this as a function in gives .

This optimization saw an improvement of in MulPIR run times. We chose this concrete analysis since SHE parameter regimes are restricted per use case and it is much simpler than an asymptotic analysis.

#### Linearizing parts of query expansion

MulPIR is an optimized query expansion which originated with Angel et al. [[5](https://arxiv.org/html/2406.06761v4#bib.bib5)].
In short, a query index is encoded in a plaintext polynomial then expanded
into ciphertexts by calling ciphertext rotation operations
(Galois automorphisms followed by key-switching). We noticed that
some of these expansions can be substituted with linear operations:
call where is rotated. In general,
we saw a improvement in MulPIR’s expansion from our optimization.

#### Lazy rescaling in BFV multiplication.

We apply the lazy rescaling technique of Kim et al [[29](https://arxiv.org/html/2406.06761v4#bib.bib29)]
in MulPIR’s last step, the inner product between ciphertexts .
The main idea here is that BFV multiplications first multiply polynomials over
the integers, then scale and round back to integers modulo .
Kim et al [[29](https://arxiv.org/html/2406.06761v4#bib.bib29), Appendix F] noticed that one
can multiply over the integers, add over the integers, then scale and round
after the additions, from the dimension number of scaling operations to one.
Lazy rescaling yielded a improvement in our MulPIR implementation.

#### Optimization for very large entries

In MulPIR the database is represented as a plaintext matrix . Conventionally, the response is computed as

This approach results in ciphertext-plaintext multiplications and ciphertext-ciphertext multiplications, where is the number of plaintexts used to encode one entry. The number of ciphertext-ciphertext multiplications grows linearly with and remains a concretely small value when entries are not large. However, it will blow up with extremely large entries (e.g., when they are high-resolution photos).

To overcome this challenge, we can swap the order of the computation as

The outer-product takes ciphertext-ciphertext multiplications to compute, which is independent of the entry size, while the inner products still take ciphertext-plaintext multiplications. Therefore, this optimization can reduce the computation overhead when the entry size ( times the plaintext size) is larger than the first dimension size .

#### Keyword PIR.

MulPIR’s keyword PIR functionality is given by using cuckoo hashing to find the entry’s proper index. We noticed for our cluster sizes , we are able to split the cluster into two hash tables and perform -hash cuckoo hashing on each without increasing the (empirical) failure probability. This resulted in a improvement in query size and server computation time.

#### Low-level SHE Optimizations

BFV’s multiplication step over the integers is done by extending the
modulus to a larger modulus so the multiplication does not
wrap around. We use Bajard et al.’s method to extend the basis,
“fast basis conversion” in [[8](https://arxiv.org/html/2406.06761v4#bib.bib8)]
and re-use the basis elements in for a improvement
in BGV multiplication.

We add a conditional, lazy modular reduction to Harvey’s NTT [[25](https://arxiv.org/html/2406.06761v4#bib.bib25)].
The main idea is that we only reduce during the butterfly if the integers would
exceed the machine word size.
This saw a improvement in forward NTT times
and improvement in inverse NTT times for -bit primes. Note,
we saw no improvement on primes near -bits.
