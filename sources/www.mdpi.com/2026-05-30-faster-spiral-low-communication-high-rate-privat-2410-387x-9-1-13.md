---
url: https://www.mdpi.com/2410-387X/9/1/13
title: Faster Spiral: Low-Communication, High-Rate Private Information Retrieval
fetched_at: 2026-05-30T16:57:56
content_hash: sha1:d48045c4a22da440b62a7d5d0cfa8dd474c49111
extractor: jina
---

Title: Faster Spiral: Low-Communication, High-Rate Private Information Retrieval

URL Source: https://www.mdpi.com/2410-387X/9/1/13

Markdown Content:
Loading web-font Gyre-Pagella/Normal/Regular
Journals Topics Information Author Services Initiatives About
Sign In / Sign Up Submit
 
Search for Articles:
Cryptography
All Article Types
Advanced
 
Journals  Cryptography  Volume 9  Issue 1  10.3390/cryptography9010013 
Submit to this Journal Review for this Journal Propose a Special Issue
Article Menu
Academic Editors
Hanlin Zhang
Zengpeng Li
Dou An
Recommended Articles
Related Info Link
More by Authors Links
Article Views
2906
Citations
2
Table of Contents
Abstract
Introduction
Preliminary
Our Improvement
The Full Protocol
Implementation and Evaluation
Recent Works
Author Contributions
Funding
Data Availability Statement
Conflicts of Interest
Appendix A
References
Altmetric
share
Share
announcement
Help
format_quote
Cite
question_answer
Discuss in SciProfiles
first_page
settings
Order Article Reprints
Open AccessArticle
Faster Spiral: Low-Communication, High-Rate Private Information Retrieval
by Ming Luo 1,2,* andMingsheng Wang 1
1
Key Laboratory of Cyberspace Security Defense, Institute of Information Engineering, School of Cyber Security, University of Chinese Academy of Sciences, Beijing 100085, China
2
School of Cyber Security, University of Chinese Academy of Sciences, Beijing 101408, China
*
Author to whom correspondence should be addressed.
Cryptography 2025, 9(1), 13; https://doi.org/10.3390/cryptography9010013
Submission received: 31 December 2024 / Revised: 9 February 2025 / Accepted: 17 February 2025 / Published: 21 February 2025
(This article belongs to the Special Issue Privacy-Enhancing Technologies for the Digital Age)

Download
keyboard_arrow_down
 Browse Figure Versions Notes

Abstract
Private information retrieval (PIR) enables a client to retrieve a specific element from a server’s database without disclosing the index that was queried. This work introduces three improvements to the efficient single-server PIR protocol Spiral. We found that performing a modulus switching towards expanded ciphertexts can improve the server throughput. Secondly, we apply two techniques called the composite 
NTT
 algorithm and approximate decomposition to Spiral to further improve it. We conduct comprehensive experiments to evaluate the concrete performance of our protocol, and the results confirm an approximately 1.7 times faster overall throughput than Spiral.
Keywords: private information retrieval; fully homomorphic encryption

1. Introduction
The private information retrieval (PIR) protocol [1] involves a server holding a database 
DB
 and a client wishing to retrieve a record from the 
DB
 without revealing which record they are querying. PIR protocols are widely applied in various domains, including but not limited to anonymous messaging [2,3], private contact tracing [4], safe browsing [5,6], and more [7].
Chor et al. [1] introduced the concept of PIR and in recent years, homomorphic encryption (HE)-based PIR protocols have become highly efficient. Homomorphic encryption enables the hiding of the query message but performs meaningful computations. Specifically, the server holds a database 
DB
 and the client encrypts an index to query the database homomorphically, ensuring that the response is encrypted for the client to decrypt locally.
Kushilevitz and Ostrovsky [8] proposed the first construction of single-server PIR. Their construction applies a linearly homomorphic encryption scheme to fetch records. The database of N records is structured as a v-dimension hypercube. The communication of this construction is roughly 
𝑁
1
/
𝑣
𝐹
𝑣
−
1
 where F is the expansion factor of the encryption scheme. The server has to perform roughly 
𝑁
·
𝐹
𝑣
−
1
 homomorphic operations to answer each query from the client.
To instantiate Kushilevitz–Ostrovsky construction, PIR protocols in recent years have applied a well-known, highly efficient and post-quantum safe scheme called Ring Learning with Errors (
RLWE
) encryption. For example, XPIR [9] instantiates 
𝑣
=
2
 to achieve a balance between communication and computation costs. However, in this case, the communication reaches tens of MB per online query for a database of hundreds of MB, for the client has to upload 
2
𝑁
 
RLWE
 ciphertexts. Large comunication limits the practical deployment of PIR.
This issue was not solved until Chen et al. [3] introduced an 
RLWE
 expansion algorithm. They found that automorphism can eliminate some interval coefficients of the message polynomial in 
RLWE
 ciphertext. The coefficients of the polynomial can also be rotated by i positions if this 
RLWE
 ciphertext is multiplied by a monomial 
𝑥
−
𝑖
. By iteratively running the automorphism algorithm and rotation (on coefficients), the server obtains many 
RLWE
 ciphertexts that encrypt each coefficient of the input message polynomial. The 
RLWE
 expansion algorithm greatly reduces the online query size to around tens of KB, which is roughly one thousand times smaller than prior construction. As a trade-off, the server needs to store some client-dependent key-switching keys for these automorphisms.
Subsequently, MulPIR [10], OnionPIR [11], and Spiral [12] additionally use fully homomorphic encryption [13] to further reduce the communication cost by a factor of F, and improve the server throughput, i.e., database size divided by server response time. For example, the query size of Spiral is only around 14 KB, and the server throughput reaches more than 300 MB/s. Spiral leverages a series of works, including the 
RLWE
 expansion algorithm [3], Kushilevitz–Ostrovsky’s dimension folding [8] as well as the Gentry–Halevi blueprint [14], and 
RGSW
 multiplication [15], and thus outperforms previous solutions, e.g., SealPIR [3], MulPIR [10], and OnionPIR [11]. The workflow in Spiral primarily includes a query expansion algorithm and two folding algorithms. Specifically, the server expands the query to a sequence of 
RLWE
 ciphertexts and a sequence of 
RGSW
 ciphertexts. The 
RLWE
 ciphertexts are used for multiplying the database 
DB
, which is inherent. The 
RGSW
 multiplication is for subsequent folding and ultimately returns a smaller response.
Spiral is applicable to a wide range of scenarios, e.g., small and large records, and small and large databases. It also has significant small communication and client computation, and the highest rate, where rate refers to plaintext size divided by response ciphertext size. This allows it to be deployed in most application scenarios where private information retrieval is required. Recently, Li et al. [16] proposed HintlessPIR and Menon and Wu [17] proposed YPIR. These two PIR protocols eliminate the need to store a hint in the client side as in Simple/Double PIR [6], and they outperform Spiral in terms of server throughput. Moreover, Luo et al. [18] proposed a novel 
RLWE
-based PIR protocol called KsPIR that also outperform Spiral in terms of server throughput. However, HintlessPIR [16], YPIR [17] and KsPIR [16] do not outperform Spiral in all aspects, especially in terms of communication. We believe that Spiral still offers its unique advantages for applications when the client is resource constrained, or the communication is very expensive.
Our Contribution
The start point of our work is Spiral. Following the design of Spiral [12], we propose three optimizations that can accelerate the server’s computation.
First, we found that the noise introduced by query expansion would impact the subsequent plaintext–plaintext multiplications and ciphertext–ciphertext multiplications. Therefore, we add a modulus switching towards those expanded 
RLWE
 ciphertexts and 
RGSW
 ciphertexts. In this way, we propose a Residue Number System (RNS) variant of Spiral.
Secondly, we apply two existing techniques called the composite 
NTT
 algorithm [19] and approximate decomposition [15]. The former is used to execute the 
NTT
 algorithm on a composite modulus of two 
NTT
-friendly moduli. The latter is first proposed for the torus variant of 
LWE
 and 
RLWE
 samples in TFHE [15] and it works well in our protocol.
We implement our scheme in C++ with library [20] to evaluate the concrete performances. Particularly, our protocol confirms an approximately 
1.7
×
 faster online runtime than that of Spiral. This demonstrates the practicality of our work, and more details are presented in Section 5.
Those three optimizations are easy to understanding and highly efficient. Our work improve Spiral’s server throughput while retaining its advantages, i.e., its significant small communication and client computation, and its high rate, which demonstrates its unique advantages even when compared with other recent state-of-the-art PIR protocols such as HintlessPIR [16], YPIR [17], and KsPIR [18].
2. Preliminary
2.1. Notations
We use 
𝑁
, 
𝑍
, and 
𝑅
 to denote the set of natural numbers, integers and real numbers, respectively. log refers to the base-2 logarithm. For a positive 
𝑘
∈
𝑍
, let 
[
𝑘
]
 be the set of integers 
{
0
,
…
,
𝑘
−
1
}
 and let 
[
𝑎
,
𝑏
]
 be the set 
[
𝑎
,
𝑏
]
∩
𝑍
 for any integers 
𝑎
≤
𝑏
. For 
𝑥
∈
𝑅
, 
⌊
𝑥
⌋
 and 
⌊
𝑥
⌉
 denote the rounding to the lower and closest integer, respectively.
In this paper, a vector is always a column vector by default and is denoted by a bold lower-case letter, e.g., 
𝑥
. We use 
𝑥
[
𝑖
]
 to denote the i-th element of 
𝑥
. For a vector 
𝑥
 with k entries, we start the index from 0, i.e., 
𝑥
[
0
]
, and the last element is 
𝑥
[
𝑘
−
1
]
. For convenience, we let 
𝑥
[
𝑘
]
=
𝑥
[
0
]
. For a v-dimensional hypercube (
𝑣
0
×
𝑣
1
×
⋯
×
𝑣
𝑣
−
1
) 
𝑋
, 
𝑋
[
𝑖
0
,
𝑖
1
,
⋯
,
𝑖
𝑣
−
1
]
 indexes the 
(
𝑖
𝑗
)
𝑗
∈
[
𝑣
]
-th position, where 
𝑖
𝑗
 starts from 0.
We use 
∥
𝑥
∥
∞
 to denote the 
𝑙
∞
-norm of 
𝑥
, i.e., 
∥
𝑥
∥
∞
=
𝑚
𝑎
𝑥
𝑖
{
∥
𝑥
[
𝑖
]
∥
}
. For a matrix 
𝑋
, 
𝑥
𝑖
 denotes its i-th column vector without extra instructions, 
𝑋
⊤
 denotes the transpose of 
𝑋
, 
∥
𝑋
∥
∞
:
=
𝑚
𝑎
𝑥
𝑖
{
∥
𝑥
𝑖
∥
∞
}
. Given some set S, 
𝑆
𝑚
×
𝑛
 denotes the set of all 
𝑚
×
𝑛
 matrices with entries in S.
For a set A and a probability distribution 
𝑃
, we use 
𝑎
←
𝐴
 to denote that a is uniformly chosen from A and 
𝑎
←
𝑃
 to denote that a is chosen according to the distribution 
𝑃
.
2.2. Lattice-Based Encryptions
Regev introduced the Learning with Errors (
LWE
) problem [21], whose hardness can be based on some lattice problems. Consider the distribution 
𝐴
𝑠
,
𝜒
, where 
𝜒
 is a distribution over 
𝑍
 and 
𝑠
∈
𝑍
𝑞
𝑑
 for modulus 
𝑞
∈
𝑁
. A sample from the distribution 
𝐴
𝑠
,
𝜒
 is of the form 
(
𝑏
,
𝑎
)
∈
𝑍
𝑞
×
𝑍
𝑞
𝑑
, where 
𝑎
←
𝑍
𝑞
𝑑
, 
𝑒
←
𝜒
 and 
𝑏
=
〈
𝑎
,
𝑠
〉
+
𝑒
mod
𝑞
.
Definition 1 (
LWE
). Let 
𝜒
 be a distribution over 
𝑍
, and let 
𝑞
≥
2
 be an integer modulus. The decision version of 
LWE
 is given m samples with the form of 
(
𝑏
′
,
𝑎
′
)
∈
𝑍
𝑞
×
𝑍
𝑞
𝑛
 and decides whether these pairs are from the uniform distribution or 
𝐴
𝑠
,
𝜒
.
Another important variant is 
LWE
 in the ring setting, known as the Ring Learning with Errors (
RLWE
) problem [22]. In this work, we only focus on the polynomial ring 
𝑅
=
𝑍
[
𝑋
]
/
(
𝑋
𝑑
+
1
)
, where d is a power of 2, also known as the 
2
𝑑
-th cyclotomic ring.
For the 
RLWE
 problem, now we present the distribution 
𝐴
𝑠
,
𝜒
. Let 
𝜒
 be a distribution over 
𝑅
 and 
𝑠
∈
𝑅
𝑞
=
𝑅
/
𝑞
𝑅
, and a sample from 
𝐴
𝑠
,
𝜒
 is of the form 
(
𝑏
,
𝑎
)
∈
𝑅
𝑞
×
𝑅
𝑞
,
 where 
𝑎
←
𝑅
𝑞
, 
𝑒
←
𝜒
 and 
𝑏
=
𝑠
·
𝑎
+
𝑒
mod
𝑞
. Then, the problem 
RLWE
 is presented as:
Definition 2 (
RLWE
). For security parameter 
𝜆
, let 
𝑞
=
𝑞
(
𝜆
)
≥
2
 be an integer modulus and 
𝜒
=
𝜒
(
𝜆
)
 be a distribution over 
𝑅
. The task of decision 
RLWE
 is given m pairs of 
(
𝑏
′
,
𝑎
′
)
∈
𝑅
𝑞
×
𝑅
𝑞
, and decides whether these pairs are from the uniform distribution or 
𝐴
𝑠
,
𝜒
.
The hardness of the above two problems have been extensively studied in the NIST’s post-quantum standardization process in recent years. There are a number of plausible encryption schemes based on 
LWE
 or 
RLWE
 [23,24].
In the following, we use two basic encryption schemes based on the 
RLWE
— (1) 
RLWE
 and (2) 
RGSW
. For convenience, we denote 
RLWE
(
𝜇
)
 as a message hidden by an 
RLWE
 sample, and sometimes the secret s is specified by 
RLWE
𝑠
(
𝜇
)
. The similar notation 
RGSW
(
𝜇
)
 is applied to 
RGSW
 encryption. Further, we denote 
Err
(
𝑏
,
𝑎
)
 as the noise of ciphertext 
(
𝑏
,
𝑎
)
, and the same is true for 
Err
(
RGSW
(
𝜇
)
)
. Clearly, the security of these schemes can be based on the hard problems of (Ring) Learning with Errors. These schemes have been widely used in the lattice-based cryptography [23,24] and FHE [15,25,26,27], which imply various homomorphic operations.
2.3. Useful Algorithms
Here, we present some useful notations and algorithms for our PIR protocol. Let 
𝑅
=
𝑍
[
𝑋
]
/
(
𝑋
𝑑
+
1
)
 where d is a power of two.
2.3.1. Plaintext–Ciphertext Multiplication
Given a plaintext 
𝜇
1
∈
𝑅
𝑝
, and an 
RLWE
 ciphertext 
RLWE
(
Δ
𝜇
2
)
 where 
𝜇
2
∈
𝑅
𝑝
 and 
Δ
=
⌊
𝑞
/
𝑝
⌋
, the plaintext–ciphertext multiplication is defined as 
𝜇
1
·
RLWE
(
Δ
𝜇
2
)
. The output is an 
RLWE
 ciphertext 
RLWE
(
Δ
𝜇
1
𝜇
2
)
 with a noise growth.
2.3.2. Ciphertext–Ciphertext Multiplication
Given an 
RGSW
 ciphertext 
RGSW
(
𝜇
1
)
∈
𝑅
𝑞
2
×
2
ℓ
 and an 
RLWE
 ciphertext 
RLWE
(
Δ
𝜇
2
)
∈
𝑅
𝑞
2
 where 
𝜇
1
,
𝜇
2
∈
𝑅
𝑝
 and 
Δ
=
⌊
𝑞
/
𝑝
⌋
, the external product of ciphertext–ciphertext multiplication [15] is defined as 
RGSW
(
𝜇
1
)
⊠
RLWE
(
Δ
𝜇
2
)
:
=
RGSW
(
𝜇
1
)
·
𝑔
−
1
RLWE
(
Δ
𝜇
2
)
. The output is an 
RLWE
 ciphertext 
RLWE
(
Δ
𝜇
1
𝜇
2
)
 with a noise growth.
Here, we recall several useful algorithms for Spiral [12] and our design: (1) key-switching, (2) 
RLWE
 sxpansion, and (3) Conversion from 
RLWE
(s) to 
RGSW
.
2.3.3. Key-Switching
The procedure is denoted as 
KS
 (Key-switching) with the following algorithms:
KS
(
KSkey
,
(
𝑏
,
𝑎
)
). Given an 
RLWE
 ciphertext 
(
𝑏
,
𝑎
)
∈
RLWE
𝑠
(
𝜇
)
 and key-switching key 
KSkey
 as input, the algorithm outputs an 
RLWE
 ciphertext 
(
𝑏
′
,
𝑎
′
)
∈
RLWE
𝑠
′
(
𝜇
)
 by computing
(
𝑏
′
,
𝑎
′
)
⊤
=
(
𝑏
,
0
)
⊤
−
KSkey
·
𝑔
−
1
(
𝑎
)
	
and outputting 
(
𝑏
′
,
𝑎
′
)
 accordingly.
This idea was proposed by [28] and was later used widely in the research of FHE [15,25,26,27].
2.3.4. 
RLWE
 Expansion
Given an 
RLWE
 ciphertext 
(
𝑏
,
𝑎
)
∈
RLWE
𝑠
(
𝜇
)
, there is an algorithm that expands it to an r
RLWE
 ciphertext 
(
𝑏
𝑖
,
𝑎
𝑖
)
∈
RLWE
𝑠
(
𝜇
𝑖
)
𝑖
∈
[
𝑟
]
, where 
𝜇
=
𝜇
0
+
𝜇
1
𝑥
𝑡
+
⋯
+
𝜇
𝑟
−
1
𝑥
(
𝑟
−
1
)
𝑡
 and 
𝑡
=
𝑑
/
𝑟
. Through the 
RLWE
 expansion algorithm, the server obtains many 
RLWE
 ciphertexts that encrypt each coefficient of the input message polynomial 
𝜇
. We use 
𝑒
𝑥
𝑝
𝑎
𝑛
𝑑
(
(
𝑏
,
𝑎
)
,
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
,
𝑡
)
 to denote this expansion process, where 
pk
.
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
 is a proper key-switching key for these automorphisms.
2.3.5. Conversion from 
RLWE
(s) to 
RGSW
According to [12], there is an algorithm that given ℓ 
RLWE
 ciphertexts, namely 
(
𝑏
0
,
𝑎
0
)
∈
RLWE
𝑠
(
𝜇
)
,
⋯
,
(
𝑏
ℓ
−
1
,
𝑎
ℓ
−
1
)
∈
RLWE
𝑠
(
𝐵
ℓ
ℓ
−
1
·
𝜇
)
 and a proper key-switching key, outputs an 
RGSW
 ciphertext 
(
𝑏
⊤
;
𝑎
⊤
)
∈
RGSW
𝑠
(
𝜇
)
, where 
𝐵
ℓ
 is the decomposition base. We simply call this algorithm 
RLWE
s-to-
RGSW
.
2.4. Private Information Retrieval
Here, we describe the syntax of private information retrieval (PIR). PIR is a protocol between two stateful machines, namely the server and the client with the following structure. The server holds a database 
DB
 of size 
𝑁
∈
𝑁
, i.e., the number of entries, while the client would like to retrieve 
DB
[
index
]
 for some private 
index
∈
[
𝑁
]
. Implicitly, the security parameter 
1
𝜆
 is taken in all procedures below.
Setup (
DB
): This phase is run one time per database. Particularly, the client receives nothing and the server receives a database 
DB
 of size 
𝑁
∈
𝑁
. The server can preprocess to generate some public things, e.g., preprocess the database 
DB
 to a preprocessed 
hint
, thus it can accelerate the online computation.
Keygen: The client generates a public and secret key pair 
(
pk
,
sk
)
. Next, the client sends the public key 
pk
 to the server while privately storing the corresponding secret key 
sk
. Generally speaking, the 
pk
 usually consists of some key-switching keys and the 
sk
 is used for encryption and decryption.
Query (
sk
,
index
): Once given an indice 
index
∈
[
𝑁
]
, the client computes an online query 
qu
 and sends the query to the server.
Response 
(
qu
,
pk
,
hint
)
: Input, an online query 
qu
 and the public key 
pk
 from the client, and preprocessed 
hint
, the server computes a response 
𝑟
 and sends it back to the client.
Recover 
(
ans
,
sk
)
: Input an answer 
ans
 and the secret key 
sk
, the client outputs the desired record d.
In general, the Setup phase is run one time per database for all clients, i.e., 
hint
 is generated based on the database 
DB
, which is not relevant with client’s 
pk
. A PIR protocol formed by the above algorithms should satisfy the following two basic properties: correctness and security.
2.4.1. Correctness
The correctness is satisfied if the client always recovers the desired record, i.e., regardless of the database and indices, and only a negligible probability of decryption failure is allowed. The formal definition of correctness is as follows.
For all configurable 
𝜆
∈
𝑁
, and database size 
𝑁
=
𝑁
(
𝜆
)
, for all databases 
DB
=
{
𝑑
0
,
⋯
,
𝑑
𝑁
−
1
}
 and all indices 
index
∈
[
𝑁
]
, we say that the PIR protocol is correct if and only if it satisfies
Prob
[
Recover
(
ans
,
sk
)
≠
𝑑
index
]
≤
𝑛
𝑒
𝑔
𝑙
(
𝜆
)
,
	
where 
ans
←
Response
(
qu
,
pk
,
hint
)
, 
qu
←
Query(
sk
,
index
∈
[
𝑁
]
), 
(
pk
,
sk
)
←
Keygen and 
hint
←
Setup(
DB
).
2.4.2. Security
We define that a single-server PIR scheme satisfies security if and only if for any probabilistic polynomial-time (PPT) adversary 
𝐴
 (such as the server), for any 
DB
 of size 
𝑁
∈
𝑁
, the adversary’s view is computationally indistinguishable for the following experiments: If the query 
qu
 is the encryption of 
index
∈
[
𝑁
]
, the adversary outputs 1, otherwise it outputs 0. Given a correct plaintext–ciphertext pair or an unmatched pair, the adversary’s advantage is negligible. Next, we can give the formal definition of security, as follows.
For all integer 
𝑁
=
𝑁
(
𝜆
)
 and all adversaries 
𝐴
, there exists a negligible function 
𝑛
𝑒
𝑔
𝑙
(
·
)
 such that for all configurable 
𝜆
∈
𝑁
 and all index 
𝑖
,
𝑗
∈
[
𝑁
]
, we say that the PIR protocol is safe if and only if the advantage of the adversary satisfies
|
Prob
[
𝐴
1
𝜆
,
𝑁
,
DB
,
pk
,
𝑖
,
Query
(
sk
,
𝑖
∈
[
𝑁
]
)
=
1
]
−
	
Prob
[
𝐴
1
𝜆
,
𝑁
,
DB
,
pk
,
𝑖
,
Query
(
sk
,
𝑗
∈
[
𝑁
]
)
=
1
]
|
≤
𝑛
𝑒
𝑔
𝑙
(
𝜆
)
,
	
where 
sk
 and other materials are generated as above.
2.5. Spiral Protocol
The single-server PIR scheme Spiral [12] follows the Gentry–Halevi [14] blueprint. They rely on two basic encryption schemes: the 
RLWE
 encryption scheme and the 
RGSW
 encryption scheme. After a query expansion phase, the server performs plaintext–ciphertext multiplications in the first dimension folding. Then, the server uses an external product to perform ciphertext–ciphertext multiplications, which is also called the subsequent dimensions folding. Thanks to the expansion algorithm and the low noise growth of the external product, Spiral as well as its family outperforms prior PIR protocols, e.g., SealPIR [3], FastPIR [29], MulPIR [10], and OnionPIR [11].
Spiral structured its database of 
𝑁
=
2
𝑣
1
×
𝑣
2
 records as a 
2
𝑣
1
×
2
×
⋯
×
2
 hypercube. Each record is a ring element in 
𝑅
𝑝
𝑛
×
𝑛
, where p is the plaintext modulus, and n is the dimension of the matrix. In the following, we only let 
𝑛
=
1
 for simplicity. In the following, we give a brief description about how Spiral works, as in Figure 1.
Figure 1. A sketch of Spiral protocol. The server in Spiral performs query expansion, a first dimension folding and a subsequent dimension folding to fetch the desired record.
2.5.1. Setup and Keygen Phase
In these two phases, the server preprocesses database 
DB
 and the client prepares 
sk
 and 
pk
, and then sends 
pk
 to the server.
2.5.2. Query Generation Phase
In this phase, the client would like to retrieve 
DB
[
index
]
 for some private 
index
∈
[
𝑁
]
. The client parses 
index
 into 
𝜋
(
index
)
=
(
𝑢
,
𝑤
⊤
)
∈
[
2
𝑣
1
]
×
{
0
,
1
}
𝑣
2
 such that 
index
=
𝑢
+
2
𝑣
1
·
𝑤
⊤
𝑏
, where 
𝑏
=
[
1
,
2
,
4
,
⋯
,
2
𝑣
2
−
1
]
⊤
. The client encodes indicator vector 
Δ
𝑢
 where the u-th element is 1 and the others are 0, and 
𝑤
⊗
𝑔
. Then, the client encrypts it to an 
RLWE
 ciphertext and sends it to the server.
2.5.3. Response Phase
In this phase, the server would like to process the query and response. The server only receives an 
RLWE
 ciphertext so that it sees nothing about 
index
. This phase can be divided into three sub-stages as follow:
(Query expansion). Once it receives the online query 
qu
, the server expands it to a series of 
RLWE
 ciphertexts that can be divided into two groups. The first group consists of 
2
𝑣
1
 
RLWE
 ciphertexts that only the u-th ciphertext encrypts as 1 and the remaining encrypt as 0. The second group consists of 
𝑣
2
×
ℓ
 
RLWE
 ciphertexts, which are the input of the 
RLWE
s-to-
RGSW
 algorithm. The sever converts these ciphertexts belonging to the second group to 
𝑣
2
 
RGSW
 cipertexts that encrypt 
𝑤
.
(First dimension folding). Once given 
2
𝑣
1
 
RLWE
 ciphertexts, that only one of them encrypts as 1 and the others encrypt as 0, the server can do plaintext–ciphertext multiplications and ciphertext–ciphertext additions for each column in the database. For each column, the server obtains one 
RLWE
 ciphertext. Consequently, the output 
2
𝑣
2
 
RLWE
 ciphertexts encrypt the u-th row of the database.
(Subsequent dimension folding). Once given 
2
𝑣
2
 
RLWE
 ciphertexts (generated in the first dimension-folding phase) and 
𝑣
2
 
RGSW
 ciphertexts (generated in the query expansion phase), the server evaluates many homomorphic 
𝐶
𝑚
𝑢
𝑥
 functions, i.e., 
𝑚
𝑖
=
𝐶
𝑚
𝑢
𝑥
(
𝑖
,
𝑚
0
,
𝑚
1
)
 for 
𝑖
∈
{
0
,
1
}
. Consequently, the server outputs one 
RLWE
 ciphertext that encrypts the desired record, and relays it to the client.
2.5.4. Recover Phase
In this phase, the client would like to decrypt the answer 
ans
 to recover the desired message 
DB
[
index
]
.
Remark 1.  The concept of a simpler database structure is a 
2
𝑣
1
×
2
𝑣
2
 two-dimension matrix. In other words, the server generates 
2
𝑣
1
 
RLWE
 ciphertexts and 
2
𝑣
2
 
RGSW
 ciphertexts so that the subsequent dimension folding is performed like the first dimension folding, but in a ciphertext–ciphertext manner. Compared with homomorphic 
𝐶
𝑚
𝑢
𝑥
 function, this way is simpler in concept and faster to computate. However, this setting enables the server to reduce the computation of a subsequent dimension folding from 
2
𝑣
2
+
1
 external product operations to 
2
𝑣
2
, but it increases the number of expansion 
RGSW
 from 
𝑣
2
 to 
2
𝑣
2
, thus increasing query expansion cost.
3. Our Improvement
Following the design of Spiral [12], we propose three optimizations that can accelerate the server’s computation. We found that performing a modulus switching before the first dimension folding will improve the server’s throughput, so we propose a Residue Number System (RNS) variant of Spiral. Then, we apply two existing techniques called the composite 
NTT
 algorithm and approximate decomposition to further improve it. These two techniques are independent of PIR protocols, but are compatible with Spiral and work well. We suggest to use them in any application where they can be used.
3.1. RNS Variant of Spiral
The server of the Spiral protocol performs the 
RLWE
 expansion algorithm and the 
RLWE
s-to-
RGSW
 algorithm to obtain a series of 
RLWE
 and 
RGSW
 ciphertexts. Through the select large decomposition dimension ℓ, Spiral protocol controls the noise growth of the query expansion phase. However, the noise growth introduced by the query expansion phase would consume some space, thereby influencing the subsequent computation, i.e., the first dimension folding and the subsequent dimension folding. The database is multiplied by not only the valid message but also the growth noise introduced by the query expansion phase, which seems to not be worthwhile.
We propose an RNS variant of Spiral, with the core goal to construct nearly fresh expanded ciphertexts. The core technique we used is modulus switching [26]. Given an 
RLWE
 ciphertext 
(
𝑏
,
𝑎
)
∈
𝑅
𝑄
2
, modulus switching is defined as
(
𝑏
¯
,
𝑎
¯
)
=
𝑞
·
(
𝑏
,
𝑎
)
𝑄
mod
𝑞
,
	
where q is a smaller modulus than Q. The noise growth is 
Err
(
𝑏
¯
,
𝑎
¯
)
=
𝑞
·
Err
(
𝑏
,
𝑎
)
/
𝑄
+
𝑒
 where e is a very small noise introduced by modulus switching. The squared sub-Gaussian parameter of 
Err
(
𝑏
¯
,
𝑎
¯
)
 is 
𝑠
𝑜
2
=
𝑞
2
𝑠
𝑖
2
/
𝑄
2
+
2
𝜋
(
ℎ
+
1
)
/
4
, where h is the Hamming weight of the secret, and 
𝑠
𝑖
 is the sub-Gaussian parameter of 
Err
(
𝑏
,
𝑎
)
.
The origin of Spiral works on ring 
𝑅
𝑞
 where q is around 56 bits. We select a big modulus 
𝑄
=
𝑞
·
𝑞
˜
 as the parameter of the initial work ring 
𝑅
𝑄
=
𝑍
𝑄
[
𝑥
]
/
(
𝑥
𝑑
+
1
)
 where d is a power of two. At a later appropriate time, the server can perform a modulus switching operation to reduce the noise of the ciphertexts. Specifically, the server performs the modulus switching algorithm towards those expanded ciphertexts before the first dimension-folding phase, so that the growth noise introduced by query expansion does not influence the subsequent computation. This method can improve the server’s throughput.
The security level of 
RLWE
 cryptography mainly depends on the ring dimension d and the modulus Q, and a bigger ring dimension and a smaller modulus lead to higher security [30]. We have to double the ring dimension to retain the same level of security if we use a bigger modulus Q. Our experiments show that this leads to a slightly bigger query size, but no reduction to the server throughput. For more details about parameter selection and concrete performance, the reader can refer to Secition Section 5.
At the same time, Q is more than 64 bits, so we split it into two smaller rings, 
𝑅
𝑞
 and 
𝑅
𝑞
˜
, to align with computations on uint64_t that are used in most computer systems. The additions and multiplications on 
𝑅
𝑄
 can be performed by additions and multiplications on two smaller rings, 
𝑅
𝑞
 and 
𝑅
𝑞
˜
, respectively. The modulus switching is performed in its RNS variant [31]. To be precise, it is performed as 
(
𝑏
0
−
𝑏
1
)
·
𝑞
˜
−
1
mod
𝑞
,
(
𝑎
0
−
𝑎
1
)
·
𝑞
˜
−
1
mod
𝑞
∈
𝑅
𝑞
2
, where 
(
𝑏
0
,
𝑎
0
)
,
(
𝑏
1
,
𝑎
1
)
∈
𝑅
𝑞
2
×
𝑅
𝑞
˜
2
 is the input ciphertext. The output ciphertext is in ring 
𝑅
𝑞
2
 and it is a nearly fresh ciphertext, i.e., with a very small amount of noise. In our construction, the server performs RNS modulus switching towards those expanded ciphertexts to improve server throughput. The readers can refer to the full protocol in Section 4 and the concise performance in Section 5.
3.2. Improvement by Composite 
NTT
 Algorithm
In the Spiral protocol, the work ring 
𝑅
𝑞
 is divided into two smaller rings, 
𝑅
𝑞
1
 and 
𝑅
𝑞
2
, where 
𝑞
=
𝑞
1
𝑞
2
. This strategy contributes to plaintext–ciphertext multiplications and ciphertext–ciphertext additions in the first dimension-folding phase. When we perform a large number of plaintext–ciphertext multiplications and then add them up, the server does not have to always have module q. Instead, the server adds the multiplied numbers first and then module q. Modular reduction is a heavier operation compared with addition and multiplication, so reducing the amount of modular reduction can be seen as a more efficient strategy. Specifically, the modulus 
𝑞
1
 and 
𝑞
2
 are around 28 bits in Spiral so that the multiplication of two elements in 
𝑍
𝑞
1
 (resp. 
𝑍
𝑞
2
) will never be beyond 56 bits. Spiral adds many multiplied numbers and then module 
𝑞
1
 (resp. 
𝑞
2
), ensuring that they will not reach 
2
64
.
Spiral performs standard 
NTT
s in 
𝑅
𝑞
1
 and 
𝑅
𝑞
2
, respectively. The computation is twice that of a single one. We apply a technique called the composite 
NTT
 algorithm [19] to reduce the computation without any other cost. In the following, we recall the standard 
NTT
 algorithm first and show how to apply the composite 
NTT
 algorithm to Spiral.
The standard 
NTT
 algorithm works on cyclotomic ring 
𝑅
𝑞
 only when the 
2
𝑑
-th primitive root exists. There is a well-known fact [32] that, when 
𝑞
≡
1
(
mod
2
𝑑
)
 and q is a prime, the 
2
𝑑
-th primitive root 
𝜁
∈
𝑍
𝑞
 exists. At this time, cyclotomic polynomial 
(
𝑥
𝑑
+
1
)
 can be divided into a series of monomials 
(
𝑥
𝑑
+
1
)
=
(
𝑥
−
𝜁
)
(
𝑥
−
𝜁
3
)
⋯
(
𝑥
−
𝜁
2
𝑑
−
1
)
. Then, we have
𝑅
𝑞
=
𝑍
𝑞
[
𝑥
]
/
(
𝑥
𝑑
+
1
)
≅
𝑍
𝑞
[
𝑥
]
(
𝑥
−
𝜁
)
×
𝑍
𝑞
[
𝑥
]
(
𝑥
−
𝜁
3
)
×
⋯
×
𝑍
𝑞
[
𝑥
]
(
𝑥
−
𝜁
2
𝑑
−
1
)
.
	
The standard 
NTT
 algorithm [32] coverts the element 
𝑎
∈
𝑅
𝑞
 to its 
NTT
 form 
𝑎
^
∈
𝑍
𝑞
𝑑
, and the inv-
NTT
 algorithm coverts it back. The input of 
NTT
 and the inv-
NTT
 algorithm include 
𝑎
∈
𝑅
𝑞
 and 
𝑎
^
∈
𝑍
𝑞
𝑑
, respectively, as well as a 
2
𝑑
-th primitive root 
𝜁
.
The composite 
NTT
 algorithm [19] reduces the condition of q which is a prime, i.e., in fact, it is not a necessary condition to implement an 
NTT
 algorithm. Supposing that 
𝑞
=
𝑞
1
𝑞
2
 where 
𝑞
1
 and 
𝑞
2
 are primes, and 
𝑞
1
≡
1
(
mod
2
𝑑
)
, 
𝑞
2
≡
1
(
mod
2
𝑑
)
, we know that the 
2
𝑑
-th primitive root 
𝜁
1
∈
𝑍
𝑞
1
 and 
𝜁
2
∈
𝑍
𝑞
2
 exist. In fact, there is a 
𝜁
∈
𝑍
𝑞
 that exists such that 
𝜁
1
≡
𝜁
mod
𝑞
1
 and 
𝜁
2
≡
𝜁
mod
𝑞
2
. The value 
𝜁
 can by solved by the Chinese Remainder Theorem (CRT) algorithm, i.e., 
𝜁
=
CRT
−
1
(
𝜁
1
,
𝜁
2
)
. At this time, we know that 
𝜁
 is the 
2
𝑑
-th primitive root in 
𝑍
𝑞
=
𝑞
1
𝑞
2
. Therefore,
𝑅
𝑞
≅
𝑅
𝑞
1
×
𝑅
𝑞
2
≅
(
𝑍
𝑞
1
)
𝑑
×
(
𝑍
𝑞
2
)
𝑑
≅
𝑍
𝑞
𝑑
.
	
We can implement a standard 
NTT
 algorithm over 
𝑅
𝑞
, where 
𝑞
1
 and 
𝑞
2
 are two 
NTT
-friendly moduli, by inputing a composite 
2
𝑑
-th primitive root 
𝜁
=
CRT
−
1
(
𝜁
1
,
𝜁
2
)
. Whether the input primitive root is composite or not does not affect the computation cost. Therefore, the composite 
NTT
 algorithm is a completely lossless improvement and will never bring other extra costs to the server and the client.
3.3. Improvement by Approximate Decomposition
We recall the following lemma which states an algorithm 
𝑔
−
1
 that is heavily used in homomorphic operations over ciphertexts, especially in key-switching-type operations including automorphic transformation and an external product.
Lemma 1 (Adapted from [15,33,34]).  For a given integer q and a base integer 
𝐵
ℓ
, let 
ℓ
=
log
𝐵
ℓ
𝑞
 and 
𝑔
=
(
1
,
𝐵
ℓ
,
.
.
,
𝐵
ℓ
ℓ
−
1
)
⊤
. Then, there is a randomized, efficiently computable algorithm denoted as 
𝑔
−
1
: 
𝑍
𝑞
→
𝑍
ℓ
 such that the output of the algorithm, 
𝑥
←
𝑔
−
1
(
𝑎
)
, is a sub-Gaussian with parameter 
𝑂
(
𝐵
ℓ
)
, satisfying 
〈
𝑔
,
𝑥
〉
=
𝑎
mod
𝑞
.
We use another variant of algorithm 
𝑔
−
1
 in our implementation. The high-level insight is that 
𝑔
−
1
 need not always be exact. 
〈
𝑔
,
𝑔
−
1
(
𝑎
)
〉
 can be approximately equal to 
𝑎
mod
𝑞
 and the difference 
𝑎
−
〈
𝑔
,
𝑔
−
1
(
𝑎
)
〉
mod
𝑞
 is counted into noise growth. For distinguishing this, we denote the approximate variant as 
𝑔
˜
−
1
 in the following.
Given a modulus q and 
ℓ
:
=
⌈
log
𝐵
ℓ
𝑞
/
𝐵
𝑒
⌉
, we denote the gadget vector as 
𝑔
˜
=
𝐵
𝑒
·
(
1
,
𝐵
ℓ
,
…
,
𝐵
ℓ
ℓ
−
1
)
⊤
 for some base 
𝐵
ℓ
,
𝐵
𝑒
∈
𝑁
. Then, we use the algorithm 
𝑔
˜
−
1
: 
𝑍
𝑞
→
𝑍
ℓ
, such that the output of the algorithm 
𝑥
←
𝑔
˜
−
1
(
𝑎
)
 satisfies 
〈
𝑔
˜
,
𝑥
〉
≈
𝑎
mod
𝑞
. The approximate gadget decomposition is first used for the torus variant of 
LWE
 and 
RLWE
 samples in TFHE [15]. It also works well in our protocol. In the following, we call ℓ, 
𝐵
ℓ
 and 
𝐵
𝑒
 a decomposition dimension, a decomposition base and an approximate base, respectively.
The advantage of approximate decomposition is a smaller decomposition dimension compared with its standard counterpart. A smaller decomposition dimension ℓ leads to a smaller number of 
NTT
, therefore accelerating the key-switching-type operations, e.g., automorphic transformation and the external product. The growth noise introduced by an approximate is added to the origin noise, which will never lead to a high compact when parameters are reasonably set.
For example, when inputing an 
RLWE
 ciphertext 
(
𝑏
,
𝑎
)
∈
𝑅
𝑞
2
 and a key-switching key 
KSkey
∈
𝑅
𝑞
2
ℓ
, the key-switching operation is performed as
(
𝑏
¯
,
𝑎
¯
)
⊤
=
(
𝑏
,
0
)
⊤
−
KSkey
·
𝑔
−
1
(
𝑎
)
.
	
The decomposed vector 
𝑔
−
1
(
𝑎
)
 and b should be converted to the 
NTT
 form, and finally, two inv-
NTT
 are required after some Hadmard multiplications and additions in the 
NTT
 form. Therefore, these are total 
(
3
+
ℓ
)
 
NTT
/inv-
NTT
 transformations. The noise growth of 
(
𝑏
¯
,
𝑎
¯
)
 is 
Err
(
𝑏
¯
,
𝑎
¯
)
=
Err
(
𝑏
,
𝑎
)
+
𝑔
−
1
(
𝑎
)
·
𝑒
 where 
𝑒
 is the initial error of key-switching key 
KSkey
. The squared sub-Gaussian parameter is 
𝑠
𝑜
2
=
𝑠
𝑖
2
+
𝑑
ℓ
𝐵
ℓ
2
𝑠
𝜎
2
/
4
, where 
𝑠
𝑖
, 
𝑠
𝑜
 and 
𝑠
𝜎
 are the sub-Gaussian parameters of 
Err
(
𝑏
,
𝑎
)
, 
Err
(
𝑏
¯
,
𝑎
¯
)
 and 
Err
(
𝑒
)
, respectively.
When origin decomposition is substituted by approximate decomposition, a key-switching operation consumes 
(
3
+
ℓ
˜
)
 
NTT
/inv-
NTT
 transformations where commonly 
ℓ
˜
 is smaller than ℓ. The noise growth is 
Err
(
𝑏
¯
,
𝑎
¯
)
=
Err
(
𝑏
,
𝑎
)
+
𝑔
˜
−
1
(
𝑎
)
·
𝑒
+
(
𝑎
−
〈
𝑔
˜
,
𝑔
˜
−
1
(
𝑎
)
〉
)
. The squared sub-Gaussian parameter is 
𝑠
𝑜
2
=
𝑠
𝑖
2
+
𝑑
ℓ
˜
𝐵
ℓ
˜
2
𝑠
𝜎
2
/
4
+
2
𝜋
(
ℎ
+
1
)
𝐵
𝑒
2
/
4
.
In the Spiral protocol, we can apply approximate decomposition in the 
RLWE
 expansion algorithm, the 
RLWE
s-to-
RGSW
 algorithm, and the external product, thus improving server throughput.
4. The Full Protocol
In this section, we detail the construction of the full protocol. The basic structure and design principle are the same as those for Spiral, other than the three improvements described in Section 3. For readers who are familiar with Spiral [12], we recommend reading Remarks 2 and 3 below to get the differences between our construction and Spiral’s without getting bogged down in details.
4.1. The Description of Full Protocol
Spiral structures its database of 
𝑁
=
2
𝑣
1
×
𝑣
2
 records as a 
2
𝑣
1
×
2
×
⋯
×
2
 hypercube. Each record is a ring element in 
𝑅
𝑝
𝑛
×
𝑛
, where p is the plaintext modulus, and n is the dimension of the plaintext matrix. For simplicity and better server throughput, we only let 
𝑛
=
1
 and treat each record as a ring element in 
𝑅
𝑝
.
Let 
𝑄
=
𝑞
·
𝑞
˜
 and 
𝑞
=
𝑞
1
𝑞
2
 be a multiplied modulus of two 
NTT
-friendly moduli, 
𝑞
1
 and 
𝑞
2
. The initial work ring is 
𝑅
𝑄
=
𝑍
𝑄
[
𝑥
]
/
(
𝑥
𝑑
+
1
)
 where d is a power of two. Let p be a plaintext modulus, and 
Δ
=
⌊
𝑞
/
𝑝
⌋
 be the encode factor.
4.1.1. Setup Phase
In this phase, the server inputs security parameter 
(
1
𝜆
)
 and database 
DB
∈
𝑅
𝑝
𝑁
, and outputs the structure form 
DB
˜
∈
𝑅
𝑝
2
𝑣
1
×
2
×
2
×
⋯
×
2
. The 
index
∈
[
𝑁
]
 is parsed into 
𝜋
(
index
)
=
(
𝑢
,
𝑤
⊤
)
∈
[
2
𝑣
1
]
×
{
0
,
1
}
𝑣
2
 such that 
index
=
𝑢
+
2
𝑣
1
·
𝑤
⊤
𝑏
, where 
𝑏
=
[
1
,
2
,
4
,
⋯
,
2
𝑣
2
−
1
]
⊤
. Therefore, the record 
DB
[
index
]
 is equal to 
DB
˜
[
𝑢
,
𝑤
⊤
]
. Next, the server preprocesses them to 
NTT
 forms and stores them as 
hint
∈
𝑅
𝑞
2
𝑣
1
×
2
×
2
×
⋯
×
2
, i.e., preprocess each record 
𝑑
𝑖
∈
𝑅
𝑝
 to its 
NTT
 form 
𝑑
˜
𝑖
∈
𝑅
𝑞
.
4.1.2. Keygen Phase
In this phase, the client inputs security parameter 
(
1
𝜆
)
, and outputs 
𝑠
←
RLWE
.
𝐾
𝑒
𝑦
𝐺
𝑒
𝑛
(
1
𝜆
)
. The client then generates the key-switching keys 
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
, 
𝑟
2
𝑔
𝐾
𝑒
𝑦
 and 
𝑝
𝑎
𝑐
𝑘
𝐾
𝑒
𝑦
, which will be used in the 
RLWE
 expansion algorithm, the 
RLWE
s-to-
RGSW
 algorithm, and packing the 
RLWE
s to the matrix Regev algorithm [12], respectively.
4.1.3. Query Generation Phase
In this phase, the client would like to retrieve 
DB
[
index
]
 for some private 
index
∈
[
𝑁
]
. The client parses 
index
 into 
𝜋
(
index
)
=
(
𝑢
,
𝑤
⊤
)
∈
[
2
𝑣
1
]
×
{
0
,
1
}
𝑣
2
 such that 
index
=
𝑢
+
2
𝑣
1
·
𝑤
⊤
𝑏
, where 
𝑏
=
[
1
,
2
,
4
,
⋯
,
2
𝑣
2
−
1
]
⊤
. The client encodes indicator vector 
Δ
𝑢
 and 
𝑤
˜
=
𝑤
⊗
𝑔
˜
, where the u-th element of 
𝑢
 is 1 and others are zeros, and 
𝑔
˜
 is the approximate gadget vector.
The client encodes the indicator vector 
Δ
𝑢
 (that will be used in the first dimension folding) as polynomial 
𝑚
1
(
𝑥
)
 and 
𝑤
⊗
𝑔
˜
 (that will be used in the subsequent dimension folding) as polynomial 
𝑚
2
(
𝑥
)
, as
𝑚
1
(
𝑥
)
=
Δ
𝑞
˜
·
∑
𝑖
=
0
2
𝑣
1
−
1
𝑢
[
𝑖
]
𝑥
𝑖
𝑡
1
,
	
𝑚
2
(
𝑥
)
=
𝑞
˜
·
∑
𝑖
=
0
𝑣
2
ℓ
−
1
𝑤
˜
[
𝑖
]
𝑥
𝑖
𝑡
2
,
	
where 
𝑡
1
=
𝑑
/
2
𝑣
1
+
1
, 
𝑡
2
=
𝑑
/
(
2
𝜌
)
, and 
𝜌
=
𝑚
𝑎
𝑥
(
2
⌈
log
2
(
𝑣
2
ℓ
)
⌉
,
𝑣
2
ℓ
)
 is the smallest power of two that is bigger than or equal to 
𝑣
2
ℓ
. We assume that 
2
𝑣
1
+
𝜌
≤
𝑑
 so that only one query ciphertext is required.
Then, the client encodes the packing polynomial
𝑚
(
𝑥
)
=
2
−
(
𝑣
1
+
1
)
·
𝑚
1
(
𝑥
)
+
(
2
𝜌
)
−
1
·
𝑚
2
(
𝑥
)
·
𝑥
𝑚
𝑖
𝑛
(
𝑡
1
,
𝑡
2
)
/
2
.
	
The client encrypts 
𝑚
(
𝑥
)
 to 
qu
=
RLWE
(
𝑚
)
∈
𝑅
𝑄
2
 and sends it to the server.
4.1.4. Response Phase
In this phase, the server would like to process the query and response. The server only receives an 
RLWE
 ciphertext so that it sees nothing about 
index
. This phase can be divided into three sub-stages as follows:
(Query expansion). Upon receiving the online query 
qu
, the server first expands it to two 
RLWE
 ciphertexts
(
𝑐
𝑡
1
,
𝑐
𝑡
2
)
=
expand
qu
,
pk
.
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
,
𝑚
𝑖
𝑛
(
𝑡
1
,
𝑡
2
)
/
2
.
	
For the property of the 
RLWE
 expansion algorithm, we know that 
(
𝑐
𝑡
1
,
𝑐
𝑡
2
)
=
(
RLWE
(
𝑚
1
)
,
 
RLWE
(
𝑚
2
)
)
.
Then, the server continues to expand them to
qu
𝑟
𝑙
𝑤
𝑒
=
expand
(
𝑐
𝑡
1
,
pk
.
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
,
𝑡
1
)
,
	
qu
1
=
expand
(
𝑐
𝑡
2
,
pk
.
𝑎
𝑢
𝑡
𝑜
𝐾
𝑒
𝑦
,
𝑡
2
)
.
	
We further know that 
qu
𝑟
𝑙
𝑤
𝑒
=
RLWE
(
Δ
𝑞
˜
·
𝑢
[
𝑖
]
)
𝑖
∈
[
2
𝑣
1
]
∈
(
𝑅
𝑄
2
)
2
𝑣
1
 and 
qu
1
=
RLWE
(
𝑞
˜
·
𝑤
˜
[
𝑖
]
)
𝑖
∈
[
𝑣
2
ℓ
]
∈
(
𝑅
𝑄
2
)
𝑣
2
ℓ
.
For each 
𝑖
∈
[
𝑣
2
]
, compute
qu
𝑟
𝑔
𝑠
𝑤
[
𝑖
]
=
RLWE
s
-
to
-
RGSW
qu
1
[
𝑖
ℓ
:
(
𝑖
+
1
)
ℓ
)
,
pk
.
𝑟
2
𝑔
𝐾
𝑒
𝑦
,
	
where 
qu
1
[
𝑖
ℓ
:
(
𝑖
+
1
)
ℓ
)
 is an 
RLWE
 ciphertexts vector.
For the property of the 
RLWE
s-to-
RGSW
 algorithm, we know that 
qu
𝑟
𝑔
𝑠
𝑤
=
RGSW
(
𝑤
[
𝑖
]
)
𝑖
∈
[
𝑣
2
]
∈
(
𝑅
𝑄
2
×
2
ℓ
)
𝑣
2
.
The server performs modulus-switching operations for all expanded 
RLWE
 ciphertexts 
qu
𝑟
𝑙
𝑤
𝑒
∈
(
𝑅
𝑄
2
)
2
𝑣
1
 and 
RGSW
 ciphertexts 
qu
𝑟
𝑔
𝑠
𝑤
∈
(
𝑅
𝑄
2
×
2
ℓ
)
𝑣
2
, as
qu
𝑟
𝑙
𝑤
𝑒
=
𝑞
·
qu
𝑟
𝑙
𝑤
𝑒
𝑄
mod
𝑞
∈
(
𝑅
𝑞
2
)
2
𝑣
1
,
	
qu
𝑟
𝑔
𝑠
𝑤
=
𝑞
·
qu
𝑟
𝑔
𝑠
𝑤
𝑄
mod
𝑞
∈
(
𝑅
𝑞
2
×
2
ℓ
)
𝑣
2
.
	
Consequently, 
qu
𝑟
𝑙
𝑤
𝑒
 consists of 
2
𝑣
1
 
RLWE
 ciphertexts that only the u-th ciphertext encrypts as 1 and the remaining encrypt as 0, while 
qu
𝑟
𝑔
𝑠
𝑤
 consists of 
𝑣
2
 
RGSW
 cipertexts that encrypt 
𝑤
.
Remark 2.  There are two main differences from the original Spiral in the query generation and query expansion phases. The first one is that we work on a bigger ring 
𝑅
𝑄
=
𝑞
𝑞
˜
 instead of ring 
𝑅
𝑞
, and we implement the modulus switching algorithm towards those expanded ciphertexts before the first dimension-folding phase. The other is that we use the composite 
NTT
 algorithm and approximate decomposition, instead of the standard 
NTT
 algorithm and exact decomposition in the original Spiral.
(First dimension folding). Once given 
2
𝑣
1
 
RLWE
 ciphertexts that only one of them encrypts as 1 and the others encrypt as 0, the server can do plaintext–ciphertext multiplications and ciphertext–ciphertext additions for each column of database. For each column, the server obtains one 
RLWE
 ciphertext, and the output 
2
𝑣
2
 
RLWE
 ciphertexts encrypt the u-th row of the database.
For each 
𝑗
∈
[
2
𝑣
2
]
, the server computes
𝑐
𝑡
𝑗
=
∑
𝑖
=
0
2
𝑣
1
−
1
qu
𝑟
𝑙
𝑤
𝑒
[
𝑖
]
·
hint
[
𝑖
,
𝑗
⊤
]
,
	
where 
𝑗
 is the bit decomposition of j, i.e., 
𝑗
=
𝑏
−
1
(
𝑗
)
∈
{
0
,
1
}
𝑣
2
.
In total, there are 
𝑁
=
2
𝑣
1
×
2
𝑣
2
 plaintext–ciphertext multiplications and 
(
2
𝑣
1
−
1
)
×
2
𝑣
2
 ciphertext–ciphertext additions.
(Subsequent dimension folding). Once given 
𝑣
2
 
RGSW
 ciphertexts and 
2
𝑣
1
 
RLWE
 ciphertexts generated in the first dimension-folding phase, the server can do a ciphertext–ciphertext 
𝐶
𝑚
𝑢
𝑥
 function, i.e., 
𝑚
𝑖
=
𝐶
𝑚
𝑢
𝑥
(
𝑖
,
𝑚
0
,
𝑚
1
)
 for 
𝑖
∈
{
0
,
1
}
. Specifically, inputing two 
RLWE
 ciphertexts 
𝑐
𝑡
1
=
RLWE
(
𝑚
1
)
, 
𝑐
𝑡
2
=
RLWE
(
𝑚
2
)
, and an 
RGSW
 ciphertext 
𝐶
=
RGSW
(
𝑖
)
 where 
𝑖
∈
{
0
,
1
}
, the 
𝐶
𝑚
𝑢
𝑥
 is defined as
𝐶
𝑚
𝑢
𝑥
(
𝐶
,
𝑐
𝑡
0
,
𝑐
𝑡
1
)
:
=
(
𝑔
˜
⊗
𝐼
2
−
𝐶
)
⊠
𝑐
𝑡
0
+
𝐶
⊠
𝑐
𝑡
1
.
	
For each 
𝑖
∈
[
𝑣
2
]
, let 
𝑖
𝑛
𝑡
𝑒
𝑟
𝑣
𝑎
𝑙
=
2
𝑖
;
For each 
𝑗
∈
[
0
,
2
×
𝑖
𝑛
𝑡
𝑒
𝑟
𝑣
𝑎
𝑙
,
4
×
𝑖
𝑛
𝑡
𝑒
𝑟
𝑣
𝑎
𝑙
,
⋯
,
2
𝑣
2
−
2
×
𝑖
𝑛
𝑡
𝑒
𝑟
𝑣
𝑎
𝑙
]
, the server computes
𝑐
𝑡
𝑗
=
𝐶
𝑚
𝑢
𝑥
(
qu
𝑟
𝑔
𝑠
𝑤
[
𝑖
]
,
𝑐
𝑡
𝑗
,
𝑐
𝑡
𝑗
+
𝑖
𝑛
𝑡
𝑒
𝑟
𝑣
𝑎
𝑙
)
.
	
Finally, let 
ans
=
(
ans
.
𝑏
,
ans
.
𝑎
)
=
𝑐
𝑡
0
∈
𝑅
𝑞
2
. In order to reduce the communication, the server computes a modulus switching
ans
=
𝑞
𝑚
𝑜
𝑑
1
·
ans
.
𝑏
𝑞
mod
𝑞
𝑚
𝑜
𝑑
1
,
𝑞
𝑚
𝑜
𝑑
2
·
ans
.
𝑎
𝑞
mod
𝑞
𝑚
𝑜
𝑑
2
∈
𝑅
𝑞
𝑚
𝑜
𝑑
1
×
𝑅
𝑞
𝑚
𝑜
𝑑
2
,
	
where 
𝑞
𝑚
𝑜
𝑑
1
 and 
𝑞
𝑚
𝑜
𝑑
2
 are two smaller moduli compared with q. Using two unequal moduli contributes to a smaller ciphertext size compared with the original modulus switching which uses one modulus. Finally, the server relays it to the client.
Remark 3.  There is no difference in the first dimension-folding phase compared with Spiral. In the subsequent dimension-folding phase, we use the composite 
NTT
 algorithm and approximate decomposition.
4.1.5. Recover Phase
In this phase, the client would like to decrypt the answer 
ans
 to an element 
𝑅
𝑝
. The server computes 
𝑟
=
RLWE
.
𝐷
𝑒
𝑐
(
ans
)
.
4.2. Additional Analysis
We present the noise growth, correctness and security analysis in Appendix A.
4.3. Pack and Stream Variant
Menon and Wu [12] also introduce three variants of Spiral, including SpiralPack, SpiralStream and SpiralPackStream. SpiralPack does not apply a matrix Regev ciphertext in the query expansion phase, the first dimension-folding phase and the second dimension-folding phases, i.e., set 
𝑛
=
1
. The server in SpiralPack performs multiple first-dimension foldings and second-dimension foldings using the same expanded ciphertexts, and obtains multiple 
RLWE
 ciphertexts. Finally, the server converts them to a matrix Regev ciphertext. SpiralStream directly uploads 
RLWE
 ciphertexts and 
RGSW
 ciphertexts, instead of applying the query expansion algorithm. Therefore, the throughput of SpiralStream is much better than tat of Spiral and SpiralPack, but the query size is much worse. SpiralPackStream is similar to SpiralStream, except that it incorporates the insight of SpiralPack.
All three improvements are compatible with SpiralPack. Due to the fact that SpiralStream and SpiralPackStream do not apply the query expansion algorithm, we do not apply the RNS variant to SpiralStream and SpiralPackStream. Certainly, we use the remaining improvements including the composite 
NTT
 algorithm and approximate decomposition to improve SpiralStream and SpiralPackStream.
5. Implementation and Evaluation
We implement our protocols in C++ to evaluate their concrete efficiency. Our implementations do not use any existing FHE libraries but adopt the Intel HEXL library (v1.2.5) [35] to implement the 
NTT
s. The source code is available at [20].
5.1. Parameter Selection
In this section, we present how we select parameters for our protocol.
5.1.1. Lattice Parameters
Our protocol always works over a power-of-two cyclotomic ring. In order to ensure 128 bits of classical security and take the noise growth into account, we set ring dimension 
𝑑
=
4096
, which is twice that of Spiral. Each secret is sampled as a uniform ternary secret, and all the initial noise is sampled from a discrete Gaussian distribution with standard deviation 
𝜎
=
3.19
. We set the bigger modulus 
𝑄
=
𝑞
𝑞
˜
, where 
𝑞
˜
≈
2
24
 and 
𝑞
≈
2
56
, 
𝑞
=
𝑞
1
𝑞
2
 is a multiplied modulus of two close 
NTT
-friendly primes 
𝑞
1
 and 
𝑞
2
, as in Spiral.
5.1.2. Parameters Compared with Spiral
We add three improvements to Spiral [12]. Therefore, our parameter set is different from that of Spiral. All the notations are taken from the full protocol in Section 4. p is the plaintext modulus. Q and q are the ciphertext moduli. 
(
𝑣
1
,
𝑣
2
)
 refer to the numbers of the first dimension and the subsequent dimension of database 
DB
, respectively. Roughly speaking, our plaintext modulus is much bigger while the decomposition dimension is smaller, i.e., this implies the reason why our server throughput is better than Spiral. Taking the 
2
20
×
256
 B (256 MB) database as an example, we can achieve around a 
1.7
×
 better overall throughput, as shown in Table 1 and Table 2.
Table 1. Parameter sets for 
2
20
×
256
 B (256 MB) database. 
(
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
𝑒
𝑥
𝑝
𝑟
)
 stand for the decomposition dimension, decomposition base and approximate base used in the 
RLWE
 expansion algorithm, respectively. 
(
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
𝑒
𝑥
𝑝
𝑟
)
 stand for that of the 
RLWE
s-to-
RGSW
 algorithm while 
(
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
𝑒
𝑥
𝑝
𝑟
)
 stand for that of the external product. 
𝑝
𝑓
 stands for the probability of decryption failure. “Server Time” refers to the server response time.
Table 2. Compared with other PIR protocols. “Server preproc.” stands for the server preprocessing time. “Server resp.” stands for the server response time. “Client comp.” stands for the sum of query generation time and recovery time. “Through.” stands for the server throughput, i.e., the database size/server response time. “Ours-Stream” stands for the stream variant of our protocol.
5.2. Concrete Performances for Our PIR Protocol
In this section, we report the concrete performances of our protocol. Our computing environment is a server with Intel(R) Xeon(R) Gold 6230R CPU @ 2.10 GHz and 256 GB RAM, running Ubuntu 22.04.1. The compiler we used is clang++ 14.0.0.
5.2.1. Compared with Spiral and Prior Works
For a fair comparison with Spiral, we use their C++ implementation [36], which adapts procedure from the SEAL library [37] and the HEXL library [35] to implement 
NTT
s. Moreover, we selected a pre-Spiral PIR protocol, FastPIR [29], as another comparison object. The comparison results are given in Table 2. Taking the performance of the 256 MB database as an example, our server’s overall throughput is around 
1.7
×
 faster than that of Spiral. Our online computations are 1.7–2.8× better than those of FastPIR [29] and our online communications are much better. We also found that our three optimizations slightly increase the query and response size, but the increase is acceptable. This allows our protocol to perform well even for resource-constrained clients.
5.2.2. Compared with KsPIR
Recently, Luo et al. [18] proposed a novel PIR protocol called KsPIR. Instead of applying the 
RLWE
 expansion algorithm like most 
RLWE
-based PIR protocols, they use a BSGS (baby-step giant-step) algorithm to perform multiple homomorphic matrix vector multiplications, and finally they pack these 
RLWE
 ciphertexts through an 
RLWE
 packing algorithm. The server throughput of KsPIR is faster than that of Spiral; therefore, it seems to have better application prospects. However, the query of KsPIR consists of an 
RLWE
 ciphertext and an 
RGSW
 ciphertext, so the query size is at least 
2
×
 bigger than that of Spiral as well as ours. Taking the performance of the 256 MB database as an example, our server’s overall throughput is worse than that of KsPIR [18], but our communication is 
2.5
×
 better than that of KsPIR. Moreover, our server storage is around 
1.3
×
 better than that of KsPIR.
6. Recent Works
6.1. 
LWE
-Based PIR Protocols
Henzinger et al. [6] proposed two efficient 
LWE
-based PIR protocols called Simple PIR and Double PIR. They can achieve high throughput while the drawback of them is that the client must download and store an around 124 MB (Simple PIR) and 16 MB (Double PIR) hint, respectively. Recently, Li et al. [16] proposed HintlessPIR and Menon and Wu [17] proposed YPIR. These two PIR protocols eliminate the need to store a hint on the client side, and they outperform Spiral in terms of server throughput. However, their communications, client computations and rate are much worse than those of Spiral. For example, when the database reaches 1 GB, the query and response sizes of Spiral are 
14
+
20
 KB (40 + 22 KB for ours) while those of HintlessPIR are 
443
+
3008
 KB and those of YPIR are 
846
+
12
 KB. Therefore, Spiral is still the state-of-the-art low-communication, high-rate PIR solution at present, which makes it still have important application value when the client resources are limited. As PIR is an essential privacy-preserving technology, it is critical to have various options available for users to determine the best tradeoff based on their specific scenarios.
6.2. Efficient Sublinear PIR Protocols
Two-server PIR protocols [5] have received widespread attention for they can achieve a sublinear server computation cost. However, two-server PIR protocols require the two servers to store two copies of the same database, which brings difficulties to real-world deployment. Recently, there has been a breakthrough in how to convert a two-server PIR into a single-server PIR [38]. Piano [38] utilizes lightweight cryptography such as PRFs to achieve sublinear server computation. However, their current solution is not optimal. In the preprocessing phase, the communication size is the same as the size of the entire database, although the client does not need to store it. In addition, the client needs to do more than hundreds of seconds of preprocessing. This would not be suitable for clients who are computing-resource constrained.
6.3. Keyword PIR Protocols
Sometimes index PIR cannot meet the requirements of some applications, and keyword PIR is more general. Fortunately, there are some methods to convert an index PIR into a keyword PIR. Refs. [10,39,40] are all using some probabilistic data structure to encode the database; specifically, they are using cuckoo hashing, a random band matrix and a binary fuse filter, respectively. The cuckoo hashing approach is more generic, ref. [39] is suitable for some 
RLWE
-based protocols, and ref. [40] is suitable for some 
LWE
-based protocols. Additionally, these are also other methods that are not based on an index PIR, e.g., ref. [41] is based on an equality operator.
Author Contributions
Conceptualization, M.L. and M.W.; Methodology, M.L. and M.W.; Software, M.L.; Writing—original draft, M.L.; Writing—review and editing, M.W. All authors have read and agreed to the published version of the manuscript.
Funding
This research was funded by National Key R&D Program grant number 2020YFA0712303.
Data Availability Statement
No new data were created or analyzed in this study. Data sharing is not applicable to this article.
Conflicts of Interest
The authors declare no conflicts of interest. The funders had no role in the design of the study; in the collection, analyses, or interpretation of data; in the writing of the manuscript; or in the decision to publish the results.
Appendix A
Appendix A.1. Correctness and Security
Our protocol is similar to Spiral, other than three improvements detailed in Section 3. Modulus switching towards expanded ciphertexts does not impact the correctness. The composite 
NTT
 algorithm and approximate decomposition can be seen as two small tracks on implementation, thus they have nothing to do with the correctness of the full protocol if the two techniques are correct in themselves.
We say that the PIR is correct if the client always recovers the desired record, and only a negligible probability of decryption failure is allowed. We calculate the probability of decryption failure by heuristic noise analysis. To be more precise, we calculate concrete heuristic noise analysis with sub-Gaussian variables inside of those ciphertexts first, and calculate the probability of decryption failure by formula 
𝑃
𝑟
[
|
𝑋
|
>
𝑡
]
<
2
𝑒
𝑥
𝑝
(
−
𝜋
𝑡
2
/
𝑠
𝑡
2
)
 where 
𝑡
=
Δ
/
2
 and 
𝑠
𝑡
 is the sub-Gaussian parameter of the final ciphertext. We say that the PIR protocol is correct if the probability of decryption failure is smaller than 
2
−
40
, i.e., in fact, our protocol is much better than that.
In general, security of an FHE-based PIR construction follows directly from the semantic security of the encryption schemes, as the query from the client is just one 
RLWE
 ciphertext, and the setup just consists of some public key-switching/evaluation keys. For our setting, we just need to securely instantiate the underlying 
RLWE
 and a circular security assumption (key-dependent message security in key-switching keys), and the security of our PIR scheme is simply implied.
Appendix A.2. Heuristic Noise Analysis
In our protocol, all errors in the encryption algorithm are sampled from discrete Gaussian distribution with standard deviation 
𝜎
=
3.19
. The Gaussian with deviation 
𝜎
 is a sub-Gaussian with parameter 
𝑠
𝜎
=
𝜎
2
𝜋
. All of the secret is sampled from a uniform ternary distribution, so the Hamming weight is 
ℎ
=
⌊
2
𝑑
/
3
⌉
. Then, we can calculate the probability of decryption failure by concrete heuristic noise analysis with sub-Gaussian variables. Below, we give the heuristic noise analysis (a rise of sub-Gaussian variables) of our PIR protocol.
Appendix A.2.1. Query Expansion Phase
In the query expansion phase, the server implements the 
RLWE
 expansion algorithm and the 
RLWE
s-to-
RGSW
 algorithm. Firstly, the server implements the 
RLWE
 expansion algorithm to obtain 
qu
𝑟
𝑙
𝑤
𝑒
 and 
qu
1
. Let 
ℓ
𝑒
𝑥
𝑝
𝑟
, 
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
 and 
𝐵
𝑒
𝑥
𝑝
𝑟
 be the decomposition dimension, the decomposition base and the approximate base used in the 
RLWE
 expansion algorithm, respectively. The squared sub-Gaussian parameter of 
Err
(
qu
𝑟
𝑙
𝑤
𝑒
)
 is 
𝑠
1
2
=
2
𝑣
1
+
1
·
(
1
+
𝑑
ℓ
𝑒
𝑥
𝑝
𝑟
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
2
𝑠
𝜎
2
/
4
+
2
𝜋
(
ℎ
+
1
)
𝐵
𝑒
𝑥
𝑝
𝑟
2
/
4
)
. The squared sub-Gaussian parameter of 
Err
(
qu
1
)
 is 
𝑠
2
2
=
2
𝜌
·
(
1
+
𝑑
ℓ
𝑒
𝑥
𝑝
𝑟
𝐵
ℓ
𝑒
𝑥
𝑝
𝑟
2
𝑠
𝜎
2
/
4
+
2
𝜋
(
ℎ
+
1
)
𝐵
𝑒
𝑥
𝑝
𝑟
2
/
4
)
. Note that the decomposition dimension to generate 
qu
𝑟
𝑙
𝑤
𝑒
 and 
qu
1
 can be different but we use the same one for simplicity.
Next, the server impements the 
RLWE
s-to-
RGSW
 algorithm to obtain 
qu
𝑟
𝑔
𝑠
𝑤
. Let 
ℓ
𝑟
2
𝑔
, 
𝐵
ℓ
𝑟
2
𝑔
 and 
𝐵
𝑟
2
𝑔
 be the decomposition dimension, the decomposition base and the approximate base used in the 
RLWE
s-to-
RGSW
 algorithm, respectively. The squared sub-Gaussian parameter of 
Err
(
qu
𝑟
𝑔
𝑠
𝑤
)
 is 
𝑠
3
2
=
𝑑
ℓ
𝑟
2
𝑔
𝐵
ℓ
𝑟
2
𝑔
2
𝑠
𝜎
2
/
2
+
2
𝜋
(
ℎ
+
1
)
𝐵
𝑟
2
𝑔
2
/
4
+
(
ℎ
+
1
)
𝑠
2
2
, where 
(
ℎ
+
1
)
𝑠
2
2
 is generated by the multiplication of secret s and the noise in 
qu
1
.
Finally, the server performs modulus switching towards those expanded 
RLWE
 and 
RGSW
 ciphertexts. Therefore, the squared sub-Gaussian parameter of the updated 
Err
(
qu
𝑟
𝑙
𝑤
𝑒
)
 is 
𝑠
4
=
𝑞
2
𝑠
1
2
/
𝑄
2
+
2
𝜋
(
ℎ
+
1
)
/
4
. Similarly, the squared sub-Gaussian parameter of the updated 
Err
(
qu
𝑟
𝑔
𝑠
𝑤
)
 is 
𝑠
5
=
𝑞
2
𝑠
3
2
/
𝑄
2
+
2
𝜋
(
ℎ
+
1
)
/
4
.
Appendix A.2.2. First Dimension-Folding Phase
In the first dimension-folding phase, the server performs plaintex–ciphertext multiplications and ciphertext–ciphertext additions to obtain 
2
𝑣
2
 
RLWE
 ciphertexts 
(
𝑐
𝑡
𝑗
)
𝑗
∈
[
2
𝑣
2
]
. We have that the squared sub-Gaussian parameter of 
Err
(
𝑐
𝑡
𝑗
)
 is 
𝑠
6
2
=
2
𝑣
1
·
𝑝
2
𝑠
4
2
/
4
.
Appendix A.2.3. Second Dimension-Folding Phase
In the second dimension-folding phase, the server performs some homomorphic 
𝐶
𝑀
𝑢
𝑥
 functions and a modulus switching to obtain an 
RLWE
 ciphertext 
𝑐
𝑡
. Let 
ℓ
𝑒
𝑃
, 
𝐵
ℓ
𝑒
𝑃
 and 
𝐵
𝑒
𝑃
 be the decomposition dimension, the decomposition base and the approximate of the external product, respectively. We have that the squared sub-Gaussian parameter of 
Err
(
𝑐
𝑡
)
 is 
𝑠
7
2
=
2
𝑣
2
+
1
·
𝑠
6
2
+
𝑑
ℓ
𝑒
𝑃
𝐵
ℓ
𝑒
𝑃
2
𝑠
5
2
/
2
+
2
𝜋
(
ℎ
+
1
)
𝐵
𝑒
𝑃
2
/
4
. Finally, the server performs a modulus switching so that the squared sub-Gaussian parameter of 
Err
(
𝑐
𝑡
)
 is 
𝑠
𝑡
2
=
𝑞
𝑚
𝑜
𝑑
2
2
𝑠
7
2
/
𝑞
2
+
2
𝜋
(
ℎ
+
1
)
𝑞
𝑚
𝑜
𝑑
1
2
/
(
4
𝑞
𝑚
𝑜
𝑑
2
2
)
.
Consequently, we calculate 
𝑃
𝑟
[
|
𝑋
|
>
𝑡
]
<
2
𝑒
𝑥
𝑝
(
−
𝜋
𝑡
2
/
𝑠
𝑡
2
)
 as the probability of decryption failure 
𝑝
𝑓
, where 
𝑡
=
Δ
/
2
.
References
Chor, B.; Goldreich, O.; Kushilevitz, E.; Sudan, M. Private Information Retrieval. In Proceedings of the 36th FOCS, Milwaukee, WI, USA, 23–25 October 1995; IEEE Computer Society Press: Washington, DC, USA, 1995; pp. 41–50. [Google Scholar] [CrossRef]
Angel, S.; Setty, S.T.V. Unobservable Communication over Fully Untrusted Infrastructure. In Proceedings of the 12th USENIX Symposium on Operating Systems Design and Implementation, OSDI 2016, Savannah, GA, USA, 2–4 November 2016; Keeton, K., Roscoe, T., Eds.; USENIX Association: Berkeley, CA, USA, 2016; pp. 551–569. [Google Scholar]
Angel, S.; Chen, H.; Laine, K.; Setty, S.T.V. PIR with Compressed Queries and Amortized Query Processing. In Proceedings of the 2018 IEEE Symposium on Security and Privacy, San Francisco, CA, USA, 21–23 May 2018; IEEE Computer Society Press: Washington, DC, USA, 2018; pp. 962–979. [Google Scholar] [CrossRef]
Trieu, N.; Shehata, K.; Saxena, P.; Shokri, R.; Song, D. Epione: Lightweight Contact Tracing with Strong Privacy. IEEE Data Eng. Bull. 2020, 43, 95–107. [Google Scholar]
Kogan, D.; Corrigan-Gibbs, H. Private Blocklist Lookups with Checklist. In Proceedings of the USENIX Security 2021, Virtual, 11–13 August 2021; Bailey, M., Greenstadt, R., Eds.; USENIX Association: Berkeley, CA, USA, 2021; pp. 875–892. [Google Scholar]
Henzinger, A.; Hong, M.M.; Corrigan-Gibbs, H.; Meiklejohn, S.; Vaikuntanathan, V. One Server for the Price of Two: Simple and Fast Single-Server Private Information Retrieval. In Proceedings of the USENIX Security 2023, Anaheim, CA, USA, 9–11 August 2023; Calandrino, J.A., Troncoso, C., Eds.; USENIX Association: Berkeley, CA, USA, 2023; pp. 3889–3905. [Google Scholar]
Wu, D.J.; Zimmerman, J.; Planul, J.; Mitchell, J.C. Privacy-Preserving Shortest Path Computation. In Proceedings of the NDSS 2016, San Diego, CA, USA, 21–24 February 2016; The Internet Society: Reston, VA, USA, 2016. [Google Scholar] [CrossRef]
Kushilevitz, E.; Ostrovsky, R. Replication is NOT Needed: SINGLE Database, Computationally-Private Information Retrieval. In Proceedings of the 38th FOCS, Miami Beach, FL, USA, 19–22 October 1997; IEEE Computer Society Press: Washington, DC, USA, 1997; pp. 364–373. [Google Scholar] [CrossRef]
Melchor, C.A.; Barrier, J.; Fousse, L.; Killijian, M. XPIR: Private Information Retrieval for Everyone. Proc. Priv. Enhancing Technol. 2016, 2016, 155–174. [Google Scholar] [CrossRef]
Ali, A.; Lepoint, T.; Patel, S.; Raykova, M.; Schoppmann, P.; Seth, K.; Yeo, K. Communication-Computation Trade-offs in PIR. In Proceedings of the USENIX Security 2021, Virtual, 11–13 August 2021; Bailey, M., Greenstadt, R., Eds.; USENIX Association: Berkeley, CA, USA, 2021; pp. 1811–1828. [Google Scholar]
Mughees, M.H.; Chen, H.; Ren, L. OnionPIR: Response Efficient Single-Server PIR. In Proceedings of the ACM CCS 2021, Virtual, 15–19 November 2021; Vigna, G., Shi, E., Eds.; ACM Press: New York, NY, USA, 2021; pp. 2292–2306. [Google Scholar] [CrossRef]
Menon, S.J.; Wu, D.J. SPIRAL: Fast, High-Rate Single-Server PIR via FHE Composition. In Proceedings of the 2022 IEEE Symposium on Security and Privacy, San Francisco, CA, USA, 22–26 May 2022; IEEE Computer Society Press: Washington, DC, USA, 2022; pp. 930–947. [Google Scholar] [CrossRef]
Gentry, C. Fully homomorphic encryption using ideal lattices. In Proceedings of the 41st ACM STOC, Bethesda, MD, USA, 31 May–2 June 2009; Mitzenmacher, M., Ed.; ACM Press: New York, NY, USA, 2009; pp. 169–178. [Google Scholar] [CrossRef]
Gentry, C.; Halevi, S. Compressible FHE with Applications to PIR. In Proceedings of the TCC 2019, Nuremberg, Germany, 1–5 December 2019; Hofheinz, D., Rosen, A., Eds.; Part II, LNCS. Springer: Cham, Switzerland, 2019; Volume 11892, pp. 438–464. [Google Scholar] [CrossRef]
Chillotti, I.; Gama, N.; Georgieva, M.; Izabachène, M. Faster Fully Homomorphic Encryption: Bootstrapping in Less Than 0.1 Seconds. In Proceedings of the ASIACRYPT 2016, Hanoi, Vietnam, 4–8 December 2016; Cheon, J.H., Takagi, T., Eds.; Part I, LNCS. Springer: Berlin/Heidelberg, Germany, 2016; Volume 10031, pp. 3–33. [Google Scholar] [CrossRef]
Li, B.; Micciancio, D.; Raykova, M.; Schultz, M. Hintless Single-Server Private Information Retrieval. In Proceedings of the CRYPTO 2024, Santa Barbara, CA, USA, 18–22 August 2024; Reyzin, L., Stebila, D., Eds.; Part IX, LNCS. Springer: Cham, Switzerland, 2024; Volume 14928, pp. 183–217. [Google Scholar] [CrossRef]
Menon, S.J.; Wu, D.J. YPIR: High-Throughput Single-Server PIR with Silent Preprocessing. In Proceedings of the USENIX Security 2024, Philadelphia, PA, USA, 14–16 August 2024; Balzarotti, D., Xu, W., Eds.; USENIX Association: Berkeley, CA, USA, 2024. [Google Scholar]
Luo, M.; Liu, F.H.; Wang, H. Faster FHE-Based Single-Server Private Information Retrieval. In Proceedings of the ACM CCS 2024, Salt Lake City, UT, USA, 14–18 October 2024; ACM Press: New York, NY, USA, 2024; pp. 1405–1419. [Google Scholar] [CrossRef]
Li, Z.; Liu, Y.; Lu, X.; Wang, R.; Wei, B.; Chen, C.; Wang, K. Faster Bootstrapping via Modulus Raising and Composite NTT. IACR Trans. Cryptogr. Hardw. Embed. Syst. 2024, 2024, 563–591. [Google Scholar] [CrossRef]
Luo, M.; Wang, M. Faster Spiral: Low-Communication, High-Rate Private Information Retrieval. 2024. Available online: https://github.com/mmingluo/fspiral (accessed on 16 February 2025).
Regev, O. On lattices, learning with errors, random linear codes, and cryptography. In Proceedings of the 37th ACM STOC, Baltimore, MD, USA, 22–24 May 2005; Gabow, H.N., Fagin, R., Eds.; ACM Press: New York, NY, USA, 2005; pp. 84–93. [Google Scholar] [CrossRef]
Lyubashevsky, V.; Peikert, C.; Regev, O. On Ideal Lattices and Learning with Errors over Rings. In Proceedings of the EUROCRYPT 2010, French Riviera, France, 30 May–3 June 2010; Gilbert, H., Ed.; LNCS. Springer: Berlin/Heidelberg, Germany, 2010; Volume 6110, pp. 1–23. [Google Scholar] [CrossRef]
Bos, J.W.; Costello, C.; Ducas, L.; Mironov, I.; Naehrig, M.; Nikolaenko, V.; Raghunathan, A.; Stebila, D. Frodo: Take off the Ring! Practical, Quantum-Secure Key Exchange from LWE. In Proceedings of the ACM CCS 2016, Vienna, Austria, 24–28 October 2016; Weippl, E.R., Katzenbeisser, S., Kruegel, C., Myers, A.C., Halevi, S., Eds.; ACM Press: New York, NY, USA, 2016; pp. 1006–1018. [Google Scholar] [CrossRef]
Bos, J.W.; Ducas, L.; Kiltz, E.; Lepoint, T.; Lyubashevsky, V.; Schanck, J.M.; Schwabe, P.; Seiler, G.; Stehlé, D. CRYSTALS-Kyber: A CCA-Secure Module-Lattice-Based KEM. In Proceedings of the 2018 IEEE European Symposium on Security and Privacy, EuroS&P 2018, London, UK, 24–26 April 2018; IEEE: Piscataway, NJ, USA, 2018; pp. 353–367. [Google Scholar] [CrossRef]
Fan, J.; Vercauteren, F. Somewhat Practical Fully Homomorphic Encryption. Cryptology ePrint Archive, Paper 2012/144. 2012. Available online: https://eprint.iacr.org/2012/144 (accessed on 1 December 2024).
Brakerski, Z.; Gentry, C.; Vaikuntanathan, V. (Leveled) fully homomorphic encryption without bootstrapping. In Proceedings of the ITCS 2012, Cambridge, MA, USA, 8–10 January 2012; Goldwasser, S., Ed.; ACM: New York, NY, USA, 2012; pp. 309–325. [Google Scholar] [CrossRef]
Ducas, L.; Micciancio, D. FHEW: Bootstrapping Homomorphic Encryption in Less Than a Second. In Proceedings of the EUROCRYPT 2015, Sofia, Bulgaria, 26–30 April 2015; Oswald, E., Fischlin, M., Eds.; Part I, LNCS. Springer: Berlin/Heidelberg, Germany, 2015; Volume 9056, pp. 617–640. [Google Scholar] [CrossRef]
Brakerski, Z.; Vaikuntanathan, V. Efficient Fully Homomorphic Encryption from (Standard) LWE. In Proceedings of the 52nd FOCS, Palm Springs, CA, USA, 22–25 October 2011; Ostrovsky, R., Ed.; IEEE Computer Society Press: Washington, DC, USA, 2011; pp. 97–106. [Google Scholar] [CrossRef]
Ahmad, I.; Yang, Y.; Agrawal, D.; Abbadi, A.E.; Gupta, T. Addra: Metadata-private voice communication over fully untrusted infrastructure. In Proceedings of the 15th USENIX Symposium on Operating Systems Design and Implementation, OSDI 2021, Virtual, 14–16 July 2021; Brown, A.D., Lorch, J.R., Eds.; USENIX Association: Berkeley, CA, USA, 2021. [Google Scholar]
Albrecht, M.R.; Player, R.; Scott, S. On the concrete hardness of learning with errors. J. Math. Cryptol. 2015, 9, 169–203. [Google Scholar] [CrossRef]
Kim, A.; Polyakov, Y.; Zucca, V. Revisiting Homomorphic Encryption Schemes for Finite Fields. In Proceedings of the ASIACRYPT 2021, Virtual, 6–10 December 2021; Tibouchi, M., Wang, H., Eds.; Part III, LNCS. Springer: Cham, Switzerland, 2021; Volume 13092, pp. 608–639. [Google Scholar] [CrossRef]
Seiler, G. Faster AVX2 Optimized NTT Multiplication for Ring-LWE Lattice Cryptography. Cryptology ePrint Archive, Paper 2018/039. 2018. Available online: https://eprint.iacr.org/2018/039 (accessed on 1 December 2024).
Micciancio, D.; Peikert, C. Trapdoors for Lattices: Simpler, Tighter, Faster, Smaller. In Proceedings of the EUROCRYPT 2012, Cambridge, UK, 15–19 April 2012; Pointcheval, D., Johansson, T., Eds.; LNCS. Springer: Berlin/Heidelberg, Germany, 2012; Volume 7237, pp. 700–718. [Google Scholar] [CrossRef]
Alperin-Sheriff, J.; Peikert, C. Faster Bootstrapping with Polynomial Error. In Proceedings of the CRYPTO 2014, Santa Barbara, CA, USA, 17–21 August 2014; Garay, J.A., Gennaro, R., Eds.; Part I, LNCS. Springer: Berlin/Heidelberg, Germany, 2014; Volume 8616, pp. 297–314. [Google Scholar] [CrossRef]
Boemer, F.; Kim, S.; Seifu, G.; de Souza, F.D.M.; Gopal, V. Intel HEXL: Accelerating Homomorphic Encryption with Intel AVX512-IFMA52. In Proceedings of the 9th on Workshop on Encrypted Computing & Applied Homomorphic Cryptography, Virtual, Republic of Korea, 15 November 2021. Cryptology ePrint Archive Paper 2021/420. [Google Scholar]
Menon, S.J.; Wu, D.J. SPIRAL: Fast, High-Rate Single-Server PIR via FHE Composition. 2023. Available online: https://github.com/menonsamir/spiral/commit/361ee4 (accessed on 1 December 2024).
Chen, H.; Laine, K.; Player, R. Simple Encrypted Arithmetic Library-SEAL v2.1. In Proceedings of the FC 2017 Workshops, Sliema, Malta, 7 April 2017; Brenner, M., Rohloff, K., Bonneau, J., Miller, A., Ryan, P.Y.A., Teague, V., Bracciali, A., Sala, M., Pintore, F., Jakobsson, M., Eds.; LNCS. Springer: Cham, Switzerland, 2017; Volume 10323, pp. 3–18. [Google Scholar] [CrossRef]
Zhou, M.; Park, A.; Shi, E.; Zheng, W. Piano: Extremely Simple, Single-Server PIR with Sublinear Server Computation. Cryptology ePrint Archive, Paper 2023/452. 2023. Available online: https://eprint.iacr.org/2023/452 (accessed on 1 December 2024).
Patel, S.; Seo, J.Y.; Yeo, K. Don’t be Dense: Efficient Keyword PIR for Sparse Databases. In Proceedings of the USENIX Security 2023, Anaheim, CA, USA, 9–11 August 2023; Calandrino, J.A., Troncoso, C., Eds.; USENIX Association: Berkeley, CA, USA, 2023; pp. 3853–3870. [Google Scholar]
Celi, S.; Davidson, A. Call Me by My Name: Simple, Practical Private Information Retrieval for Keyword Queries. In ACM CCS 2024; ACM Press: New York, NY, USA, 2024; pp. 4107–4121. [Google Scholar] [CrossRef]
Mahdavi, R.A.; Kerschbaum, F. Constant-weight PIR: Single-round Keyword PIR via Constant-weight Equality Operators. In Proceedings of the USENIX Security 2022, Boston, MA, USA, 10–12 August 2022; Butler, K.R.B., Thomas, K., Eds.; USENIX Association: Berkeley, CA, USA, 2022; pp. 1723–1740. [Google Scholar]
	
Disclaimer/Publisher’s Note: The statements, opinions and data contained in all publications are solely those of the individual author(s) and contributor(s) and not of MDPI and/or the editor(s). MDPI and/or the editor(s) disclaim responsibility for any injury to people or property resulting from any ideas, methods, instructions or products referred to in the content.

© 2025 by the authors. Licensee MDPI, Basel, Switzerland. This article is an open access article distributed under the terms and conditions of the Creative Commons Attribution (CC BY) license (https://creativecommons.org/licenses/by/4.0/).
Share and Cite
      
MDPI and ACS Style

Luo, M.; Wang, M. Faster Spiral: Low-Communication, High-Rate Private Information Retrieval. Cryptography 2025, 9, 13. https://doi.org/10.3390/cryptography9010013

AMA Style

Luo M, Wang M. Faster Spiral: Low-Communication, High-Rate Private Information Retrieval. Cryptography. 2025; 9(1):13. https://doi.org/10.3390/cryptography9010013

Chicago/Turabian Style

Luo, Ming, and Mingsheng Wang. 2025. "Faster Spiral: Low-Communication, High-Rate Private Information Retrieval" Cryptography 9, no. 1: 13. https://doi.org/10.3390/cryptography9010013

APA Style

Luo, M., & Wang, M. (2025). Faster Spiral: Low-Communication, High-Rate Private Information Retrieval. Cryptography, 9(1), 13. https://doi.org/10.3390/cryptography9010013

Article Metrics
Citations
Crossref
 
2
Scopus
 
1
Web of Science
 
1
Google Scholar
 
[click to view]
Article Access Statistics
Article access statistics
Article Views
3. Mar
4. Mar
5. Mar
6. Mar
7. Mar
8. Mar
9. Mar
10. Mar
11. Mar
12. Mar
13. Mar
14. Mar
15. Mar
16. Mar
17. Mar
18. Mar
19. Mar
20. Mar
21. Mar
22. Mar
23. Mar
24. Mar
25. Mar
26. Mar
27. Mar
28. Mar
29. Mar
30. Mar
31. Mar
1. Apr
2. Apr
3. Apr
4. Apr
5. Apr
6. Apr
7. Apr
8. Apr
9. Apr
10. Apr
11. Apr
12. Apr
13. Apr
14. Apr
15. Apr
16. Apr
17. Apr
18. Apr
19. Apr
20. Apr
21. Apr
22. Apr
23. Apr
24. Apr
25. Apr
26. Apr
27. Apr
28. Apr
29. Apr
30. Apr
1. May
2. May
3. May
4. May
5. May
6. May
7. May
8. May
9. May
10. May
11. May
12. May
13. May
14. May
15. May
16. May
17. May
18. May
19. May
20. May
21. May
22. May
23. May
24. May
25. May
26. May
27. May
28. May
29. May
30. May
31. May
0k
1k
2k
3k
4k
For more information on the journal statistics, click here.
Multiple requests from the same IP address are counted as one view.
Cryptography, EISSN 2410-387X, Published by MDPI
RSS Content Alert
Further Information
Article Processing Charges
Pay an Invoice
Open Access Policy
Contact MDPI
Jobs at MDPI
Guidelines
For Authors
For Reviewers
For Editors
For Librarians
For Publishers
For Societies
For Conference Organizers
MDPI Initiatives
Sciforum
MDPI Books
Preprints.org
Scilit
SciProfiles
Encyclopedia
JAMS
Proceedings Series
Follow MDPI
LinkedIn
Facebook
X

Subscribe to receive issue release notifications and newsletters from MDPI journals

Select options
 Subscribe
© 1996-2026 MDPI (Basel, Switzerland) unless otherwise stated
Disclaimer Legal Notice Terms and Conditions Privacy Policy Privacy Settings Accessibility
