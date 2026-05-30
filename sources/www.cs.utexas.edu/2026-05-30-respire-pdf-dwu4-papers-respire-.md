---
url: https://www.cs.utexas.edu/~dwu4/papers/Respire.pdf
title: Respire.pdf
fetched_at: 2026-05-30T15:52:04
content_hash: sha1:d4a5e711431b907ece16e0ff27e3ee3eeda33aff
extractor: jina
---

Title: Respire.pdf

URL Source: https://www.cs.utexas.edu/~dwu4/papers/Respire.pdf

Published Time: Thu, 18 Jul 2024 17:23:06 GMT

Number of Pages: 54

Markdown Content:
# Respire : High-Rate PIR for Databases with Small Records 

## Alexander Burton UT Austin 

## amacburton@gmail.com 

## Samir Jordan Menon Blyss 

## samir@blyss.dev 

## David J. Wu UT Austin 

## dwu4@cs.utexas.edu 

Abstract 

Private information retrieval (PIR) is a key building block in many privacy-preserving systems, and recent works have made significant progress on reducing the concrete computational costs of single-server PIR. However, existing constructions have high communication overhead, especially for databases with small records. In this work, we introduce Respire , a lattice-based PIR scheme tailored for databases of small records. To retrieve a single record from a database with over a million 256-byte records, the Respire protocol requires just 6.1 KB of online communication; this is a 5.9× reduction compared to the best previous lattice-based scheme. Moreover, Respire naturally extends to support batch queries. Compared to previous communication-efficient batch PIR schemes, Respire achieves a 3.4-7.1×

reduction in total communication while maintaining comparable throughput (200-400 MB/s). The design of Respire re-lies on new query compression and response packing techniques based on ring switching in homomorphic encryption. 

# 1 Introduction 

A private information retrieval (PIR) protocol [CGKS95] enables a client to retrieve a record from a database without revealing to the database server which record she requested. In recent years, there have been significant advance-ments in constructing fast and practical PIR protocols and using PIR to realize applications to private certificate transparency auditing [HHC +23], password breach checking [LPA +19, TPY +19, ALP +21], metadata-hiding commu-nication [MOT +11, KLDF16, AS16, ACLS18], private web search [HDCZ23], and many more. 

The communication overhead of PIR. While recent works [DPC23, HHC +23, MSR23, LMRS24, ZPSZ24, MW24] have taken great strides in reducing the concrete computational costs of (single-server) PIR, existing constructions still incur high communication costs. For instance, retrieving a bit from a 1 GB database using the state-of-the-art SimplePIR protocol [HHC +23] requires 240 KB of online communication. A protocol like Piano [ZPSZ24] requires 

32 KB of online communication. These protocols additionally require the client to download a 121 MB hint (SimplePIR) or stream a 1 GB hint ( Piano ) in an offline phase. Number-theoretic schemes such as Gentry-Ramzan [GR05] achieve smaller communication overhead (e.g., 2-18 KB of communication to retrieve a 288-byte record from a 1 MB database), but with high computational costs [ALP +21]. In this setting, the server processes the database at a throughput of 20-350 KB/s, whereas the best lattice-based constructions have a server throughput ranging from hundreds of MB per second [MCR21, MW22a, DPC23] to multiple GB per second [HHC +23, LMRS24, MW24]. In settings where records are large (tens of KB), protocols like OnionPIR [MCR21] and Spiral [MW22a] have low communication overhead. However, for many applications of PIR (e.g., anonymous messaging, private DNS, password breach checking, and more), the size of the payload the client is interested in ranges from tens of bytes (e.g., a hash value) to a few hundred bytes. In this regime, we do not have concretely-efficient PIR protocols with high server throughput and low communication costs. 

The Respire protocol. This work introduces the Respire protocol, a lattice-based single-server PIR protocol for databases with small records (e.g., 256-byte records). Like recent PIR protocols based on the ring learning with errors (RLWE) problem [MBFK16, ACLS18, AYA +21, ALP +21, MCR21, MW22a, LMRS24, MW24], Respire works over polyno-mial rings. A key feature in the design of Respire is working over small subrings of the main polynomial ring. Working 1over a subring enables better query compression and response compression compared to all previous lattice-based schemes. For instance, retrieving a record from a database of over a million 256-byte records, Respire only needs 6.1 KB of online communication. Notably, the total communication is smaller than the size of even a single RLWE ciphertext in previous schemes. On the same configuration, the previous best lattice-based scheme ( Spiral [MW22a]) requires 36 KB of communication (over 5.9 × larger). In fact, the required communication in Respire is comparable to those based on group-based or factoring-based assumptions [ALP +21], but with 1000 × higher server throughput. The throughput of Respire is 200-400 MB/s, which is just 26% slower than Spiral . Compared to high-throughput schemes like Sim-plePIR [HHC +23], Respire is 27 -50 × slower, but has 21 -42 × less communication; SimplePIR also requires the client to download a (reusable) hint (a few hundred MB) whereas Respire requires the client to upload a (reusable) hint (3.9 MB). 

Batch queries. Combined with (probabilistic) batch codes [IKOS04, ACLS18] and a new response packing technique, 

Respire also extends to give a batch PIR protocol. Compared to previous lattice-based batch PIR protocols [MR23], 

Respire achieves a 3.4-7.1 × reduction in total communication, and has higher throughput for small batch sizes (e.g., batch size up to 128 for a database with over 4 million 256-byte records). For larger batch sizes, there is a modest computational overhead ( ≈ 2.2×) compared to previous protocols. Thus, Respire is well-suited for applications where the client is making a handful of queries simultaneously (e.g., blocklist lookup or DNS queries). 

## 1.1 Our Techniques 

The communication overhead in lattice-based PIR is due to the large lattice parameters needed for security. The aforementioned PIR schemes based on RLWE work over polynomial rings with dimension 𝑑 ≥ 2048 . Typically, each coefficient of the polynomial is an element of Z𝑞 where 𝑞 ≥ 232 . This means that communicating even a single ring element (i.e., as needed to encode or encrypt a query index or a response) already requires 8 KB of communication. When the record size is only a few hundred bytes or smaller, sending even a single element introduces non-trivial communication overhead. For this reason, all previous lattice-based PIR schemes have query and response sizes that are over 10 KB. While it is tempting to use rings of smaller dimension to mitigate the communication overhead, this is often infeasible as the modulus 𝑞 has to be chosen large enough to account for the noise accumulation inherent to lattice-based cryptosystems. In some sense, correctness imposes a minimum modulus 𝑞 , which for security, translates to a minimal ring dimension 𝑑 .

Leveraging subrings. The key technical idea underlying the design of Respire is that we can leverage ring switching techniques from homomorphic encryption [BV11, BGV12, GHPS12] to reduce query size and response size with only modest computational overhead. In the context of response compression, the approach we take in Respire 

is have the server perform most of its computations over the main ring 𝑅 1 (of dimension 𝑑 1 = 2048 and 𝑞 ≈ 256 ). However, before sending back the response, the server first projects the response into a subring 𝑅 2 ⊆ 𝑅 1 of much smaller dimension 𝑑 2 = 512 (and also with respect to a smaller modulus). Critically, this approach only works when the records are small (as the projection operation necessarily loses some information about the value encoded over the big ring). Since 𝑑 1/𝑑 2 = 4, this yields a 4× reduction in response size. Note that we are unable to directly work over the small ring due to the constraints on the dimension 𝑑 and the modulus 𝑞 imposed by correctness and security (see Remark 3.1). 

Query compression. Working over subrings also provides us a way to achieve query compression. Many RLWE-based PIR protocols leverage the query packing techniques from [ACLS18, CCR19] to pack multiple scalars into a 

single encoded polynomial. In this work, we show that the projection operations used for response compression can also be used for query compression. Namely, while a single element of the big ring 𝑅 1 can encode 𝑑 1 = 2048 scalars, if the protocol only needs ℎ ≪ 𝑑 1 values, then there is again wasted space. In this work, we show that if we embed the ℎ coefficients in a subring 𝑅 2 ⊂ 𝑅 1, then it suffices to send ≈ ℎ coefficients to the server. This allows us to reduce the query size from 14 KB to 4 KB. Notably, the query is now smaller than even a single element in the big ring 𝑅 1.All previous RLWE-based PIR schemes required communicating at least one complete ring element in the query. Our work shows that this is not essential. We believe this technique will be independently useful in other settings that apply the query packing technique [ACLS18, CCR19] to a small number of inputs. 2Starting point: the Spiral protocol. The Respire protocol builds on top of the Spiral protocol [MW22a] (the lattice-based PIR protocol with the best communication). Very briefly, the Spiral protocol arranges the database as a (1 + 𝜈 2)-dimensional hypercube, where the first dimension has size 2𝜈 1 and the remaining dimensions have size 

2. A record is indexed by a tuple (𝛼, 𝛽 1, . . . , 𝛽 𝜈 2 ) where 𝛼 ∈ [ 2𝜈 1 ] and 𝛽 1, . . . , 𝛽 𝜈 2 ∈ { 0, 1}. The query consists of an RLWE encryption [Reg05, LPR10] of 2𝜈 1 (as a one-hot vector) and encryptions of 𝛽 1, . . . , 𝛽 𝜈 2 using the GSW encryption scheme [GSW13]. The server homomorphically uses the query ciphertexts to select along each dimension and the final output is an RLWE encryption of the record of interest. 

The Respire protocol. The Respire protocol integrates our query compression and response compression tech-niques within Spiral (see Section 3). On a 256 MB database (with a million 256-byte records), our compression techniques reduces the query size by 3.9 × and the response size by 10 × while maintaining the same server throughput. On larger databases (with the same record size), we reduce the total communication by 4.5× at a cost of an 1.3×

increase in server response time. We provide more details in Section 4. Note that the Respire query compression and response compression techniques are tailored for the setting of small database elements. When the database elements are sufficiently large (concretely, on the order of a few KB), then our compression techniques no longer provide any savings and the Respire protocol is equivalent to Spiral (or the SpiralPack variant of Spiral ). 

Supporting batch queries. When the client seeks to retrieve a batch of 𝑇 records from the database, we can achieve better communication by packing multiple responses into a single ring element. In Section 3.2, we show how the subring embedding and projection machinery we developed can also be used to homomorphically repack multiple responses into a single ciphertext. We then compose with probabilistic batch codes [IKOS04, ACLS18] (which allow us to amortize some of the server processing costs). Our scheme is particularly well-suited for small batches of queries (e.g., 𝑇 = 16 ), whereas previous lattice-based batch PIR schemes [MR23, LLWR24] are more efficient for large batch sizes. We refer to Remark 3.5 (and Section 4.3) for a more detailed comparison. 

# 2 Preliminaries 

We write 𝜆 to denote the security parameter. For an integer 𝑛 ∈ N, we write [𝑛 ] B {1, . . . , 𝑛 }. For integers 𝑎, 𝑏 ∈ N,we write [𝑎, 𝑏 ] B {𝑎, . . . , 𝑏 }. For integers 𝑥, 𝑦 ∈ N, we write 𝑥 | 𝑦 to denote that 𝑥 divides 𝑦 . We use bold lowercase letters to denote vectors (e.g., u, v) and bold uppercase letters (e.g., A, B) to denote matrices. We write u𝑖 to denote the 

𝑖 th elementary basis vector. For a dimension 𝑑 ∈ N, we write I𝑑 to denote the 𝑑 -by-𝑑 identity matrix. For a distribution 

D, we write 𝑥 ← D to denote drawing a sample 𝑥 from D. For a finite set 𝑆 , we write 𝑥 r

← 𝑆 to denote a uniform random sample from 𝑆 .

Private information retrieval. We recall the definition of a single-server two-message private information re-trieval (PIR) protocol [CGKS95] in the “client hint” model (where the client uploads a reusable query key in an offline phase prior to making queries). We also allow a (silent) server preprocessing step where the server prepares the database so as to be able to efficiently answer queries in the online phase. 

Definition 2.1 (Private Information Retrieval [CGKS95, adapted]) . Let 𝜆 be a security parameter, 𝑁 = 𝑁 (𝜆 ) be the number of records in the database, and M = {M 𝜆 } be the space of possible record values. A two-message single-server private information retrieval (PIR) protocol in the client-hint model is a tuple of efficient algorithms 

(Setup , SetupDB , Query , Answer , Extract ) with the following syntax: 

• Setup (1𝜆 ) → ( pp , qk ): On input a security parameter 𝜆 , the setup algorithm outputs parameters pp and a query key qk .

• SetupDB (1𝜆 , {𝑑 𝑖 }𝑖 ∈ [ 𝑁 ] ) → db : On input the security parameter 𝜆 and a collection of records 𝑑 1, . . . , 𝑑 𝑁 ∈ M 𝜆 ,the database setup algorithm outputs a (preprocessed) database db .

• Query (qk , idx ) → q: On input the query key qk and an index idx , the query algorithm outputs a query q.3• Answer (pp , db , q) → a: On input the parameters pp , a preprocessed database db , and the query q, the answer algorithm outputs an answer a.

• Extract (qk , a) → 𝑑 𝑖 : On input the query key qk and the answer a, the extract algorithm outputs a record 𝑑 𝑖 .The algorithms must satisfy the following properties: 

• Correctness: For all security parameters 𝜆 ∈ N, all sets of records 𝑑 1, . . . , 𝑑 𝑁 ∈ M 𝜆 , and all indices idx ∈ [ 𝑁 ],

Pr 



Extract (qk , a) = 𝑑 idx :

(pp , qk ) ← Setup (1𝜆 )

db ← SetupDB (1𝜆 , 𝑑 1, . . . , 𝑑 𝑁 )

q ← Query (qk , idx )

a ← Answer (pp , db , q)



≥ 1 − 𝑐. 

We refer to 𝑐 as the correctness error. 

• Query privacy: For a bit 𝑏 ∈ { 0, 1} and an adversary A, we define the query privacy game as follows: 

– The challenger starts by sampling (pp , qk ) ← Setup (1𝜆 ) and gives pp to A.

– Algorithm A can now make (arbitrarily many) queries on pairs of indices (idx 0, idx 1) where idx 0, idx 1 ∈[𝑁 ]. On each query, the challenger responds with Query (qk , idx 𝑏 ).

– When A is done making queries, it outputs a bit 𝑏 ′ ∈ { 0, 1}, which is the output of the experiment. We say that the scheme satisfies query privacy if for all efficient adversaries A, there exists a negligible function 

negl (·) such that for all 𝜆 ∈ N,

|Pr [𝑏 ′ = 1 : 𝑏 = 0] − Pr [𝑏 ′ = 1 : 𝑏 = 1]| = negl (𝜆 ).

Remark 2.2 (Batch PIR) . Definition 2.1 considers a setting where the client queries for a single record at a time. In batch PIR [BIM00, IKOS04], the client can make a query for a batch of 𝑘 records, given by indices (idx 1, . . . , idx 𝑘 ),and receives a single answer a from which all 𝑘 records can be extracted. While this functionality can be realized by running 𝑘 (parallel) invocations of the single-query protocol, there are many techniques [BIM00, IKOS04, GKL10, AS16, LG15, Hen16, ACLS18, MR23, Yeo23, BPSY24] to reduce the communication and computation costs in the batch setting. 

## 2.1 Lattice Preliminaries 

Like many previous lattice-based PIR protocols [MBFK16, ACLS18, GH19, MCR21, MW22a, MR23, MW24], we work over polynomial rings. In this section, we provide a high-level description of the lattice algorithms we use and defer the formal details to Appendix A. Throughout this work, we write 𝑅 𝑑 to denote the polynomial ring 𝑅 𝑑 B Z[𝑥 ]/( 𝑥 𝑑 + 1).For an integer 𝑞 ∈ N, we write 𝑅 𝑑,𝑞 B Z𝑞 [𝑥 ]/( 𝑥 𝑑 + 1). When 𝑞 = 1 mod 2𝑑 , we can use the number-theoretic transform (NTT) to efficiently implement polynomial multiplication over 𝑅 𝑑,𝑞 [LMPR08, LN16]. 

Rounding. We write ⌊·⌋ : R → Z to denote the floor function and ⌊·⌉ : R → Z to denote the function that rounds the input to the nearest integer. For positive integers 𝑞 > 𝑝 , we write ⌊·⌉ 𝑞,𝑝 : Z𝑞 → Z𝑝 to denote the function that takes as input 𝑥 ∈ Z𝑞 , lifts it to an integer 𝑥 ′ ∈ (− 𝑞 /2, 𝑞 /2], and outputs ⌊𝑝 /𝑞 · 𝑥 ′⌉. We extend each of these operations to the ring 𝑅 𝑑 by component-wise evaluation on the coefficients of the input 𝑟 ∈ 𝑅 𝑑 . We also extend the operation to vectors and matrices via component-wise evaluation. 

Gadget matrices. For a modulus 𝑞 ∈ N and a decomposition base 𝑧 ∈ N, the gadget vector [MP12] is g𝑧 B

[1, 𝑧, 𝑧 2, . . . , 𝑧 𝑡 −1] ∈ Z𝑡 𝑞 where 𝑡 = ⌊log 𝑧 𝑞 ⌋ + 1. For a dimension 𝑛 ∈ N, the gadget matrix is G𝑛,𝑧 B I𝑛 ⊗ gT 

> 𝑧

∈ Z𝑛 ×𝑛𝑡 𝑞 .We write g−1 

> 𝑧

: Z𝑞 → Z𝑡 𝑞 and G−1 

> 𝑛,𝑧

: Z𝑛 𝑞 → Z𝑛𝑡 𝑞 to denote the base-𝑧 digit decomposition operator that takes the input and expands each component into its base-𝑧 representation with each digit in the centered interval (− 𝑧 /2, 𝑧 /2]. We extend g−1 

> 𝑧

and G−1 

> 𝑛,𝑧

to operate on vectors and matrices, respectively, by column-wise evaluation. Both g𝑧 and G𝑛,𝑧 

are defined identically over the ring 𝑅 𝑑,𝑞 .4𝑓 0 𝑓 1 𝑓 2 𝑓 3 𝑓 2 𝑓 3 −𝑓 0 −𝑓 1

Multiply by 𝑥 −2

Figure 1: Illustration of the rotation operation over the polynomial ring 𝑅 4 = Z[𝑥 ]/( 𝑥 4 + 1). We model polynomials 

𝑓 (𝑥 ) = Í𝑖 ∈ [ 0,3] 𝑓 𝑖 𝑥 𝑖 as a vector of coefficients (𝑓 0, 𝑓 1, 𝑓 2, 𝑓 3) ∈ Z4.

Ring learning with errors. The security of Respire relies on the ring learning with errors (RLWE) assump-tion [Reg05, LPR10]: 

Definition 2.3 (Ring Learning With Errors [Reg05, LPR10]) . Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1) where 𝑑 = 𝑑 (𝜆 ) is a power of two. Let 𝑚 = 𝑚 (𝜆 ) be the number of samples, 𝑞 = 𝑞 (𝜆 ) be the modulus, and 𝜒 𝑠 , 𝜒 𝑒 = 𝜒 (𝜆 ) be distributions over 

𝑅 𝑑,𝑞 . The ring learning with errors (RLWE) assumption RLWE 𝑑,𝑚,𝑞,𝜒 𝑠 ,𝜒 𝑒 states that the following distributions are computationally indistinguishable: 

n

(a, 𝑠 a + e) : a r

← 𝑅 𝑚 𝑑,𝑞 , 𝑠 ← 𝜒 𝑠 , e ← 𝜒 𝑚 𝑒 

o

and 

n

(a, u) : a, u r

← 𝑅 𝑚 𝑑,𝑞 

o

.

RLWE encodings. We say that c =  𝑎 𝑠𝑎 +𝑒 +𝜇 

 ∈ 𝑅 2 

> 𝑑,𝑞

is an RLWE encoding of a scalar 𝜇 ∈ 𝑅 𝑑,𝑞 with respect to a secret key s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

and error 𝑒 ∈ 𝑅 𝑑,𝑞 if sTc = 𝜇 + 𝑒 mod 𝑞 . Under the RLWE assumption, the encoding c is pseudorandom and hides the encoded value 𝜇 . When we write c = [𝑐 1, 𝑐 2]T, we refer to 𝑐 1 as the “random” component of the encoding and 𝑐 2 as the “message-embedding” component of the encoding. RLWE encodings are additively homomorphic: if c1, c2 are RLWE encodings of 𝜇 1, 𝜇 2 with respect to the same secret key s and errors 𝑒 1, 𝑒 2, then c1 ± c2

is an RLWE encoding of 𝜇 1 ± 𝜇 2 with respect to the same secret key s and error 𝑒 1 ± 𝑒 2. In many cases, 𝜇 = ⌊𝑞 /𝑝 ⌋ 𝑚 for some value 𝑚 ∈ 𝑅 𝑑,𝑝 . Given ⌊𝑞 /𝑝 ⌋ 𝑚 + 𝑒 , it is possible to recover 𝑚 , provided that |𝑒 | is small. We state the following theorem adapted from [MW22a]: 

Theorem 2.4 (Message Decoding [MW22a, Theorem 2.11]) . Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1). Suppose 𝑧 = ⌊𝑞 /𝑝 ⌋ 𝑚 + 𝑒 ∈ 𝑅 𝑑,𝑞 

where |𝑚 | < 𝑝 and |𝑒 | < 𝑞  

> 2𝑝

− ( 𝑞 mod 𝑝 ). Then, ⌊𝑧 ⌉𝑞,𝑝 = 𝑚 .

GSW encodings. Like several recent PIR protocols [GH19, MCR21, MW22a] our construction also relies on the en-cryption scheme of Gentry, Sahai, and Waters (GSW) [GSW13]. Let 𝑧 ∈ N be a decomposition base, 𝑚 = 2(⌊ log 𝑧 𝑞 ⌋ + 1),and G2,𝑧 ∈ 𝑅 2×𝑚 𝑑,𝑞 be the gadget matrix. We say that C ∈ 𝑅 2×𝑚 𝑑,𝑞 is a GSW encoding of a bit 𝜇 ∈ { 0, 1} with respect to a secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, error e ∈ 𝑅 𝑚 𝑑,𝑞 , and decomposition base 𝑧 ∈ N if sTC = 𝜇 sTG2,𝑧 + eT mod 𝑞 .

Homomorphic selection. The external product [CGGI18, CGGI20] operation provides a way to homomorphically multiply an RLWE encoding with a GSW encoding. The external product implies a lightweight homomorphic selection operation used in several previous PIR protocols [GH19, MCR21, MW22a]. Specifically, given a GSW encoding of a selection bit 𝑏 ∈ { 0, 1} and RLWE encodings of messages 𝜇 0, 𝜇 1 ∈ 𝑅 𝑑,𝑞 , the homomorphic selection operation outputs an RLWE encoding of 𝜇 𝑏 by homomorphically computing 𝜇 𝑏 B 𝜇 0 + 𝑏 (𝜇 1 − 𝜇 0). We model the algorithm as follows and give the full details in Appendix A: 

• Select (CGSW , c0, c1) → c′: On input a GSW encoding CGSW ∈ 𝑅 2×𝑚 𝑑,𝑞 and RLWE encodings c0, c1 ∈ 𝑅 2 

> 𝑑,𝑞

, the selection algorithm outputs an RLWE encoding c′.

Rotations. We associate polynomials 𝑓 (𝑥 ) = Í𝑖 ∈ [ 0,𝑑 −1] 𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 with their coefficient vector [𝑓 0, 𝑓 1, . . . , 𝑓 𝑑 −1] ∈ Z𝑑 .Then, multiplication by a monomial 𝑥 𝑘 corresponds to a (nega)-cyclic left rotation of the coefficient vector. Namely, if 𝑔 = 𝑥 𝑘 𝑓 , then the coefficient vector of 𝑔 is [𝑓 𝑘 , . . . , 𝑓 𝑑 −1, −𝑓 0, . . . , −𝑓 𝑘 −1]. We illustrate this procedure in Fig. 1. Thus, given an RLWE encoding c of a polynomial 𝑓 , the encoding 𝑥 𝑘 c encodes the polynomial 𝑔 = 𝑥 𝑘 𝑓 . Note that this operation does not affect the norm of the noise in the resulting encoding. 5𝑓 0 𝑓 1 𝑓 0 0 𝑓 1 0      

> (a) The subring embedding 𝜅 :𝑅 2→𝑅 4from Eq. (3.1).

𝑓 0 𝑓 1 𝑓 2 𝑓 3 𝑓 0 𝑓 2      

> (b) The dimension-reduction map 𝜅 −1:𝑅 4→𝑅 2from Eq. (3.2).

Figure 2: Illustrations of the ring embedding and dimension reduction between 𝑅 4 = Z[𝑥 ]/( 𝑥 4 + 1) and 

𝑅 2 = Z[𝑥 ]/( 𝑥 2 + 1) We model polynomials 𝑓 (𝑥 ) = Í𝑖 ∈ [ 0,𝑑 −1] 𝑓 𝑖 𝑥 𝑖 as a vector of coefficients (𝑓 0, . . . , 𝑓 𝑑 −1) ∈ Z𝑑 .

# 3 The Design of Respire 

In this section we introduce the Respire protocol. We start by providing a high-level overview of the main building blocks we use in Respire . We then give the full Respire protocol in Section 3.1 and a generalization to batch queries in Section 3.2. For ease of exposition, throughout this section, we elect to focus on the syntax and functionality of the main algorithms we use and elide their implementation details. The formal description of these algorithms along with their analysis are provided in Appendices A to C. 

Respire design. Like many RLWE-based PIR protocols [MBFK16, ACLS18, AYA +21, ALP +21, MCR21, MW22a, LMRS24, MW24], Respire works over a power-of-two cyclotomic ring 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1). This means that plaintext elements (e.g., a record) and RLWE encodings both have dimension 𝑑 . The combination of correctness and security constraints limit the choices for the ring dimension, and recent RLWE-based schemes all use rings where 𝑑 ≥ 2048 .Since the focus of Respire is PIR for databases with short records, a single ring element is generally (much) larger than a single record. For instance, if we use a 4-bit plaintext modulus 𝑝 , then each element of 𝑅 𝑑,𝑝 B Z𝑝 [𝑥 ]/( 𝑥 𝑑 + 1)

is at least 1 KB. When the database records are much smaller than 1 KB, it is wasteful for both computation and communication to use a single element of 𝑅 𝑑,𝑝 to represent a single database record. In Respire , we use record packing together with dimension reduction to reduce this overhead. 

• Record packing: In Respire , we consider two different rings: a “large” ring 𝑅 𝑑 1 of dimension 𝑑 1 for the RLWE encodings and a subring 𝑅 𝑑 2 ⊂ 𝑅 𝑑 1 for individual database records. We pack multiple database records (specifically, 𝑘 = 𝑑 1/𝑑 2 records) into each RLWE encoding. 

• Dimension reduction: While encoding multiple records in a single RLWE encoding reduces the number of RLWE encodings the server needs to operate on when answering a query, it does not help with communication. The encoded response is still an RLWE encoding, which resides in the large ring 𝑅 𝑑 1 . To reduce the communi-cation, we leverage the “ring switching” techniques from [BV11, BGV12, GHPS12] to reduce this overhead. Specifically, the encoded queries (and the bulk of the server processing) occur over 𝑅 𝑑 1 , but before sending the encoded response back to the client, the server switches the response to an RLWE encoding over the subring 

𝑅 𝑑 2 . To distinguish this operation from other transformations that translate encodings between rings, we refer to this operation as dimension reduction . As we note in Remark 3.1, the constraints on the parameters prevent us from using RLWE encodings over 𝑅 𝑑 2 throughout the protocol; thus, dimension reduction is critical for reducing the communication costs in Respire .Dimension reduction must lose information about the underlying encoded plaintext (since it projects onto a ring of smaller dimension). Thus, it is essential that the records are packed in a way that still allows efficient recovery of any of the packed records. To discuss how, let 𝑘 = 𝑑 1/𝑑 2; we introduce the following two functions: 

• Subring embedding: The subring embedding function 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 is the mapping 

𝜅 ©«∑︁ 𝑖 ∈ [ 0,𝑑 2 −1]

𝑓 𝑖 𝑥 𝑖 ª®¬

B∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑓 𝑖 𝑥 𝑘 ·𝑖 . (3.1) The subring embedding of 𝑓 sends the 𝑖 th coefficient of the input polynomial onto the (𝑘 · 𝑖 )th coefficient of the output polynomial. We illustrate this in Fig. 2a. 6𝑟 0,0 𝑟 0,1

𝑟 1,0 𝑟 1,1

𝑟 2,0 𝑟 2,1

𝑟 3,0 𝑟 3,1

𝑟 0,0 𝑟 1,0 𝑟 2,0 𝑟 3,0 𝑟 0,1 𝑟 1,1 𝑟 2,1 𝑟 3,1

Individual database records 

Packed representation 

(a) Representation of a single packed database element 

Π(𝑟 0, 𝑟 1, 𝑟 2, 𝑟 3). Each record 𝑟 𝑖 = (𝑟 𝑖, 0, 𝑟 𝑖, 1) consists of two elements of Z𝑝 . The database records are packed in the clear during database preprocessing. 

𝑟 0,0 𝑟 0,1𝑟 1,0 𝑟 1,1𝑟 2,0 𝑟 2,1𝑟 3,0 𝑟 3,1

𝑟 0,0𝑟 0,1𝑟 1,0 𝑟 1,1𝑟 2,0 𝑟 2,1𝑟 3,0 𝑟 3,1

𝑟 1,0 𝑟 1,1

Rotation Dimension reduction (b) Extracting the correct record from an RLWE encoding of a packed database element. This is implemented homomorphically 

during Answer . The coefficients in “striped” boxes (i.e. those not in the initial position of the packed representation) are lost during dimension reduction (i.e., response compression). In this example, the client wants record 𝑟 1, so the server first applies a (homomorphic) rotation to the encoded coefficient vector followed by dimension reduction. For simplicity, we omit the sign changes from the rotation. 

Figure 3: Illustration of how Respire packs small database records in such a way that they can be retrieved homomorphically. In this example, the main ring dimension is 𝑑 1 = 8, and the reduced dimension/record dimension is 𝑑 2 = 2. Elements with a bold blue border are encrypted .

• Dimension reduction: We define the dimension-reduction mapping 𝜅 −1 : 𝑅 𝑑 1 → 𝑅 𝑑 2 to be the mapping 

𝜅 −1 ©«∑︁ 𝑖 ∈ [ 0,𝑑 1 −1]

𝑓 𝑖 𝑥 𝑖 ª®¬

B∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑓 𝑘 ·𝑖 𝑥 𝑖 . (3.2) This operation sends the (𝑘 · 𝑖 )th coefficient of the input to the 𝑖 th coefficient of the output, and drops all other coefficients. We illustrate the dimension-reduction function in Fig. 2b. Note that 𝜅 −1 is only a one-sided inverse of 𝜅 : namely 𝜅 −1 (𝜅 (𝑓 )) = 𝑓 for all 𝑓 ∈ 𝑅 𝑑 2 , the converse does not hold. 

Ring packing. The subring embedding gives a natural way to pack multiple records (from the subring 𝑅 𝑑 2 ) into a single element of the full ring 𝑅 𝑑 1 . Specifically, we define the ring packing function Π : 𝑅 𝑘 𝑑 2 → 𝑅 𝑑 1 that takes as input a set of 𝑘 records 𝑟 0, . . . , 𝑟 𝑘 −1 ∈ 𝑅 𝑑 2 and outputs a single element over 𝑅 𝑑 1 as follows: 

Π(𝑟 0, . . . , 𝑟 𝑘 −1) B∑︁   

> 𝑖 ∈ [ 0,𝑘 −1]

𝑥 𝑖 · 𝜅 (𝑟 𝑖 ). (3.3) We provide a visual depiction of how we use Π to pack multiple database records into a single record in Fig. 3a. 

Manipulating packed ring elements. Given a packed record ˜𝑟 = Π(𝑟 0, . . . , 𝑟 𝑘 −1) ∈ 𝑅 𝑑 1 , we refer to 𝑟 𝑗 as the record at position 𝑗 within ˜𝑟 . We refer to record 𝑟 0 as the record at the initial position. There are two operations we perform on packed encodings: 

• Extracting the record in the initial position: By construction, the dimension-reduction mapping (Eq. (3.2)) can be applied to a packed element to recover the element at the initial position: namely, 𝜅 −1 (Π(𝑟 0, . . . , 𝑟 𝑘 −1)) =

𝑟 0. This follows by inspection, and we defer to Appendix A.2 for a formal analysis. 

• Rotating the elements: As noted in Section 2, multiplying a polynomial 𝑓 by 𝑥 −ℓ implements a nega-cyclic rotation on the coefficients of 𝑓 (see Fig. 1). In particular, for all ℓ ∈ [ 0, 𝑘 − 1], we have that 𝑥 −ℓ · ˜𝑟 =

Π(𝑟 ℓ , . . . , 𝑟 𝑘 −1, −𝑟 0, . . . , −𝑟 ℓ −1).7We can compose rotation and dimension reduction to extract the record at any position ℓ ∈ [ 0, 𝑘 − 1] from a packed record ˜𝑟 (see Fig. 3b). Moreover, if both operations can be implemented homomorphically on an RLWE encoding of the packed record ˜𝑟 , then the server can homomorphically extract the requested record. Namely, given an RLWE encoding of the packed record ˜𝑟 as well as an encoding of the index ℓ, the server homomorphically derives an encoding of 𝜅 −1 (𝑥 −ℓ · ˜𝑟 ), which is precisely an encoding of the desired record 𝑟 ℓ .

Homomorphic rotation. As shown in Fig. 3b, to extract the client’s record of interest from an RLWE encoding of a packed record ˜𝑟 , the server must first homomorphically compute the product 𝑥 −ℓ · ˜𝑟 . Since the index ℓ is private, the client must provide it in encoded form. One possibility is to have the client send a GSW encoding of 𝑥 −ℓ as part of its query; then the server can use the external product to compute an RLWE encoding of the product 𝑥 −ℓ · ˜𝑟 . However, GSW encodings are large and our query compression technique only gives us the ability to compress GSW encodings of bits (and not monomials). Thus, in Respire , we take a different approach. Let ℓ𝑡 · · · ℓ0 be the binary representation of ℓ. Then we can write 𝑥 −ℓ = Î𝑖 ∈ [ 0,𝑡 ] 𝑥 −ℓ𝑖 2𝑖 

. The client now provides as GSW encodings of the bits ℓ0, . . . , ℓ 𝑡 in its query. These are GSW encodings of bits , so they can be packed into a small number of RLWE encodings (see below and also Appendix B). During the evaluation phase, the server uses the encodings of each ℓ𝑖 to homomorphically select between either ˜𝑟 (if ℓ𝑖 = 0) or ˜𝑟 · 𝑥 −2𝑖 

(if ℓ𝑖 = 1). We can implement the homomorphic rotations using 𝑡 + 1 calls to Select and communicating 𝑡 + 1 (compressed) GSW encodings (see Construction 3.2). 

Homomorphic dimension reduction. Next, we use the ring-switching technique from [BV11, BGV12, GHPS12] to homomorphically apply dimension reduction. Specifically, these works show how to transform an RLWE encoding of a polynomial 𝑓 1 over 𝑅 𝑑 1,𝑞 1 (under a key s1 ∈ 𝑅 2 

> 𝑑 1,𝑞 1

) to an RLWE encoding of the polynomial 𝜅 −1 (𝑓 2) over 𝑅 𝑑 2,𝑞 2

(under a key s2 ∈ 𝑅 2 

> 𝑑 2,𝑞 2

), where 𝜅 −1 is the dimension-reduction map (Eq. (3.2)). To do so, one essentially publishes an encryption of the components of the source key s1 under the target key s2; this is the “key-switching matrix” for translating from 𝑅 𝑑 1,𝑞 1 to 𝑅 𝑑 2,𝑞 2 . It is critical that the target modulus 𝑞 2 be much smaller than the source modulus 𝑞 1.This is because the key-switching parameters consist of an RLWE encoding over the smaller ring 𝑅 𝑑 2 , and security relies on the hardness of RLWE in the smaller ring. Thus, to perform dimension reduction, we apply the following two steps: 1. Modulus switching: We first perform modulus reduction to scale the input RLWE modulus from 𝑞 1 to 𝑞 2.This operations transforms an encoding over 𝑅 𝑑 1,𝑞 1 to one over 𝑅 𝑑 1,𝑞 2 .2. Dimension reduction: Then, we apply dimension reduction to scale the dimension from 𝑑 1 to 𝑑 2. This operation transforms an encoding over 𝑅 𝑑 1,𝑞 2 to one over 𝑅 𝑑 2,𝑞 2 .To achieve better compression, we use the “split” modulus switching approach from [MW22a], where the message-embedding component of an RLWE encoding is further scaled to a smaller modulus 𝑞 3 < 𝑞 2. As such, the resulting message-embedding component is an element of 𝑅 𝑑 2,𝑞 3 . Taken together, we refer to the combined modulus switching and dimension reduction procedure as response compression. We give the syntax of our response compression algorithm below, but defer their formal description and analysis to Construction C.3 and Appendix C.2. In the formal description in Appendix C.2, we extend these algorithms to work over RLWE encodings of vectors (defined formally in Appendix C.1), as the generalization will be useful when considering batch queries. 8Box 1: Response Compression Algorithms 

• CompressSetup (1𝜆 , s1, s2) → pp comp : On input a security parameter 𝜆 , a source key s1 ∈ 𝑅 2 

> 𝑑 1,𝑞 2

and a target key s2 ∈ 𝑅 2 

> 𝑑 2,𝑞 2

, the setup algorithm outputs a set of compression parameters pp comp .

• Compress (pp comp , c): On input the compression parameters pp comp and an encoding c ∈ 𝑅 2 

> 𝑑 1,𝑞 1

, the compression algorithm outputs a new encoding (𝑐 ′

> 1

, 𝑐 ′

> 2

) where 𝑐 ′ 

> 1

∈ 𝑅 𝑑 2,𝑞 2 and 𝑐 ′ 

> 2

∈ 𝑅 𝑑 2,𝑞 3 . This algorithm interleaves split modulus switching with dimension reduction. In particular, the message-embedding component 𝑐 ′ 

> 2

of the output encoding is over the ring 𝑅 𝑑 2,𝑞 3 where 𝑞 3 ≤ 𝑞 2 ≤ 𝑞 1.

• CompressRecover (s2, (𝑐 ′

> 1

, 𝑐 ′

> 2

)) → 𝑧 : On input a secret key s2 and a compressed encoding (𝑐 ′

> 1

, 𝑐 ′

> 2

), the compression algorithm outputs a value 𝑧 ∈ 𝑅 𝑑 2,𝑞 3 . This algorithm recovers the encoded value from the RLWE encoding. 

Remark 3.1 (The Need for Dimension Reduction) . An alternative to working over a large ring 𝑅 𝑑 1 and translating the output to the smaller ring 𝑅 𝑑 2 is to just perform all of the operations over the small ring 𝑅 𝑑 2 . However, working over a smaller ring 𝑅 𝑑 2 limits us to a smaller modulus 𝑞 2 (since we need to rely on RLWE hardness over the small ring). This is insufficient for correctness (i.e., the noise accumulated from query processing is too high). Indeed, previous PIR schemes based on RLWE (e.g., [ACLS18, MCR21, MW22a]) required a ring dimension of at least 𝑑 1 ≥ 2048 . By combining (split) modulus reduction with dimension reduction, we are able to use the larger ring for query processing (e.g., 𝑑 1 = 2048 ), but reduce to a smaller ring when communicating the final response (e.g., 𝑑 2 = 512 ). This allows us to achieve substantially smaller responses in Respire compared to previous constructions. 

Query compression. The queries in Respire consist of RLWE encodings and GSW encodings of the client’s desired index. To reduce communication, we need a way to “compress” these query encodings. Here, we rely on the approach of Angel et al. [ACLS18] who showed how to homomorphically expand an RLWE encoding of a polynomial 

𝑓 (𝑥 ) = Í𝑖 ∈ [ 𝑑 ] 𝜇 𝑖 𝑥 𝑖 −1 ∈ 𝑅 𝑑,𝑞 into 𝑑 RLWE encodings of the coefficients 𝜇 1, . . . , 𝜇 𝑑 . The procedure can be further adapted to “pack” GSW encodings into a small number of RLWE encodings [CCR19, MCR21, MW22a]. This packing procedure avoids the need to communicate large GSW encodings at the expense of a modest amount of computation on the server to unpack the queries. In this work, we abstract out these compression algorithms as follows: 

Box 2: Query Packing Algorithms 

• QueryPackSetup (1𝜆 , s) → pp qpk : On input a security parameter 𝜆 and a secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, the setup algorithm outputs a set of packing parameters pp qpk .

• QueryPack (s, v, μ) → enc : On input a secret key s ∈ 𝑅 2 

> 𝑑,𝑞

and inputs v ∈ Z𝑘 𝑞 , μ ∈ { 0, 1}ℓ , the query packing algorithm outputs a packed encoding enc .

• QueryUnpack (pp qpk , enc ) → ( c1, . . . , c𝑘 ), (C1, . . . , Cℓ ): On input the public parameters pp qpk , a packed encoding enc , the query unpacking algorithm outputs a tuple of RLWE encodings c1, . . . , c𝑘 and a tuple of GSW encodings C1, . . . , Cℓ .If enc ← QueryPack (s, v, μ), then the RLWE encodings c1, . . . , c𝑘 output by QueryUnpack (pp qpk , enc ) encode 

𝑣 1, . . . , 𝑣 𝑘 ∈ Z𝑞 while the GSW encodings C1, . . . , Cℓ output by QueryUnpack encode 𝜇 1, . . . , 𝜇 ℓ ∈ { 0, 1}. Both sets of encodings are with respect to the secret key s and have a small error. We refer to Construction B.6 in Appendix B for the details of these algorithms. 

Further compression using subrings. The Angel et al. query compression approach can be used to compress 

𝑑 RLWE encodings into a single RLWE encoding. This means the query still consists of at least a single ring element 9(i.e., an element of 𝑅 𝑑,𝑞 ). 1 When the number of RLWE encodings ℎ we seek to pack is much smaller than 𝑑 , then communicating even a single ring element incurs high overhead. In this work we show that it is not necessary to send the full RLWE encoding. When ℎ ≪ 𝑑 , the client can instead embed ℎ into the coefficients of a polynomial that lives in a subring of 𝑅 𝑑,𝑞 . Instead of sending a full RLWE encoding of the polynomial, the client can send an smaller encoding that only retains information about the polynomial’s coefficients in the subring. Formally, this is the encoding obtained by applying the dimension-reduction mapping (Eq. (3.2)) to the packed encoding. As such, to pack ℎ coefficients into an RLWE encoding, the client now only needs to send roughly ℎ coefficients to the server. For our parameter sets, this yields a substantial concrete reduction in query size: 𝑑 /ℎ ≈ 3.5 (e.g., from 14 KB to 4 KB). We defer the formal details of our approach to Appendix B. 

## 3.1 The Respire Protocol 

We now describe the Respire protocol. At a high level, Respire combines the general approach from [GH19, MCR21, MW22a] with our improved query compression and response compression techniques to reduce communication (with modest impact to throughput). In particular, Respire uses the approach from [GH19, MCR21, MW22a] to retrieve a packed record (this is the first-dimension processing and folding steps in Construction 3.2), and then applies the homomorphic rotation and dimension reduction techniques to return the desired record. 

Database structure. In Respire , the RLWE encodings are over the ring 𝑅 𝑑 1,𝑞 1 B Z𝑞 1 [𝑥 ]/( 𝑥 𝑑 1 + 1) and the database are elements of the ring 𝑅 𝑑 2,𝑝 B Z𝑝 [𝑥 ]/( 𝑥 𝑑 2 + 1). We require that 𝑑 1 = 2𝛿 1 and 𝑑 2 = 2𝛿 2 and 𝑑 1 ≥ 𝑑 2. We view the database as a hypercube with 1 + 𝜈 2 + 𝜈 3 dimensions where the first dimension has size 2𝜈 1 , the remaining 𝜈 2 + 𝜈 3

dimensions each have size 2, and 𝜈 3 = 𝛿 1 − 𝛿 2. In the protocol, we represent the database as 2𝜈 1+𝜈 2 elements of 

𝑅 𝑑 1,𝑝 B Z𝑝 [𝑥 ]/( 𝑥 𝑑 1 + 1), where each element of 𝑅 𝑑 1,𝑝 is a packed representation of 2𝜈 3 = 𝑑 1/𝑑 2 individual database records (see Fig. 3a). 

Construction 3.2 (Respire ). Let 𝜆 be a security parameter. The Respire scheme is parameterized by the following: 

• Lattice parameters: Let 𝑑 1 = 𝑑 1 (𝜆 ) and 𝑑 2 = 𝑑 2 (𝜆 ) denote the full ring dimension and the reduced ring dimension, respectively. We require that 𝑑 1 = 2𝛿 1 and 𝑑 2 = 2𝛿 2 for some 𝛿 1, 𝛿 2 ∈ N and 𝑑 1 ≥ 𝑑 2. Let 𝑞 1 = 𝑞 1 (𝜆 ),

𝑞 2 = 𝑞 2 (𝜆 ), and 𝑞 3 = 𝑞 3 (𝜆 ) be moduli where 𝑞 1 ≥ 𝑞 2 ≥ 𝑞 3. Let 𝜒 1,𝑒 = 𝜒 1,𝑒 (𝜆 ) and 𝜒 1,𝑠 = 𝜒 1,𝑠 (𝜆 ) be distributions over 𝑅 𝑑 1,𝑞 1 . Let 𝜒 2,𝑒 = 𝜒 2,𝑒 (𝜆 ), 𝜒 2,𝑠 = 𝜒 2,𝑠 (𝜆 ) be distributions over 𝑅 𝑑 2,𝑞 2 .

• Plaintext modulus: Let 𝑝 be the plaintext modulus. Each database record is an element of 𝑅 𝑑 2,𝑝 .

• Database configuration: Let 𝑁 = 2𝜈 1+𝜈 2+𝜈 3 where 𝜈 1, 𝜈 2 ∈ N and 𝜈 3 B 𝛿 1 − 𝛿 2 be (a bound on) the number of records in the database. The choices of the initial dimension 𝜈 1 and the folding dimension 𝜈 2 can be arbitrary (we refer to Section 4 for our parameter-selection methodology). We index the database records by a triple 

(𝛼, 𝛽, 𝛾 ) where 𝛼 ∈ [ 2𝜈 1 ], 𝛽 ∈ [ 2𝜈 2 ], and 𝛾 ∈ [ 2𝜈 3 ].

• Query packing: Let (QueryPackSetup , QueryPack , QueryUnpack ) be the query packing algorithms from Box 2 instantiated using Construction B.6 with 𝜒 1,𝑒 as the error distribution. 

• Response compression: Let (Compress , CompressRecover ) be the response compression algorithms from Box 1 instantiated using Construction C.3 with 𝜒 2,𝑒 as the error distribution. We describe how to instantiate the underlying parameters (e.g., decomposition bases, encoding modulus, etc.) for the underlying algorithms in Section 4. We now give the Respire construction: 

• Setup (1𝜆 ): On input the security parameter 𝜆 , the setup algorithm proceeds as follows: 

– Sample secret keys ˜𝑠 1 ← 𝜒 1,𝑠 and ˜𝑠 2 ← 𝜒 2,𝑠 . Define s1 = [− ˜𝑠 1 | 1]T ∈ 𝑅 2 

> 𝑑 1,𝑞 1

and s2 = [− ˜𝑠 2 | 1]T ∈ 𝑅 2 

> 𝑑 2,𝑞 2

.

– Sample parameters pp qpk ← QueryPackSetup (1𝜆 , s1) and pp comp ← CompressSetup (1𝜆 , s1, s2).  

> 1Technically, an RLWE encoding (see Section 2) consists of two elements of 𝑅 𝑑,𝑞 , but one of them is random and can be derived by applying a pseudorandom generator (PRG) to a short seed (and appealing to the random oracle heuristic).

10 Output the query key qk = (s1, s2) and the public parameters pp = (pp qpk , pp comp ).

• SetupDB  1𝜆 , {𝑟 𝛼,𝛽,𝛾 }𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ],𝛾 ∈ [ 2𝜈 3 ]

: On input the security parameter 𝜆 and a collection of 𝑁 records 

𝑟 𝛼,𝛽,𝛾 ∈ 𝑅 𝑑 2,𝑝 , the setup algorithm computes for each 𝛼 ∈ [ 2𝜈 1 ] and 𝛽 ∈ [ 2𝜈 2 ] the packed record 

˜𝑟 𝛼,𝛽 = Π  𝑟 𝛼,𝛽, 1, . . . , 𝑟 𝛼,𝛽, 2𝜈 3

 ∈ 𝑅 𝑑 1,𝑝 , (3.4) where Π : 𝑅 2𝜈 3 

> 𝑑 2,𝑝

→ 𝑅 𝑑 1,𝑝 is the packing function from Eq. (3.3) (see also Fig. 3a). Output db =  ˜𝑟 𝛼,𝛽 𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ] .

• Query (qk , idx ): Given the query key qk = (s1, s2) and the index idx = (𝛼, 𝛽, 𝛾 ) ∈ [ 2𝜈 1 ] × [ 2𝜈 2 ] × [ 2𝜈 3 ], let 

ˆ𝛼 𝑖 = 1 if 𝑖 = 𝛼 and 0 otherwise. Let ˆ𝛽 1 · · · ˆ𝛽 𝜈 2 be the binary representation of 𝛽 − 1 and ˆ𝛾 1 · · · ˆ𝛾 𝜈 3 be the binary representation of 𝛾 − 1. It outputs the query 

q ← QueryPack  s1, (⌊ 𝑞 1/𝑝 ⌋ · ˆ𝛼 1, . . . , ⌊𝑞 1/𝑝 ⌋ · ˆ𝛼 2𝜈 1 ), ( ˆ𝛽 1, . . . , ˆ𝛽 𝜈 2 , ˆ𝛾 1, . . . , ˆ𝛾 𝜈 3 ). (3.5) 

• Answer (pp , db , q): On input the public parameters pp = (pp qpk , pp comp ), a preprocessed database db =

 ˜𝑟 𝑖,𝑗 𝑖 ∈ [ 2𝜈 1 ],𝑗 ∈ [ 2𝜈 2 ] , and the query q, the answer algorithm proceeds as follows: 1. Query expansion: Compute the expanded query 

 

c(1) 

> 1

, . . . , c(1) 

> 2𝜈 1

)



,



C(2) 

> 1

, . . . , C(2) 

> 𝜈 2

, C(3) 

> 1

, . . . , C(3)

> 𝜈 3

 

← QueryUnpack (pp qpk , q).

2. First dimension: For each 𝛽 ∈ [ 2𝜈 2 ], compute ˆc(1) 

> 𝛽

= Í𝛼 ∈ [ 2𝜈 1 ] ˜𝑟 𝛼,𝛽 · c(1) 

> 𝛼

.3. Folding: Let ˆc(2) 

> 0,𝑗

= ˆc(1) 

> 𝑗

for each 𝑗 ∈ [ 2𝜈 2 ]. Then, for each 𝑟 ∈ [ 𝜈 2] and 𝑗 ∈ [ 2𝜈 2 −𝑟 ], compute 

ˆc(2) 

> 𝑟,𝑗

= Select 



C(2) 

> 𝑟

, ˆc(2)  

> 𝑟 −1,𝑗

, ˆc(2)  

> 𝑟 −1,𝑗 +2𝜈 2−𝑟



,

where Select is the homomorphic selection algorithm defined in Section 2. 4. Rotation: Let ˆc(3) 

> 0

= ˆc(2)

> 𝜈 2,1

. Then, for each 𝑟 ∈ [ 𝜈 3], compute 

ˆc(3) 

> 𝑟

= Select 



C(3) 

> 𝑟

, ˆc(3) 

> 𝑟 −1

, 𝑥 −2𝜈 3 −𝑟 

· ˆc(3) 

> 𝑟 −1



.

Let c(out ) = ˆc(3) 

> 𝜈 3

.5. Compression: Output the (compressed) response a ← Compress  pp comp , c(out ) .

• Extract (qk , a): On input the query key qk = (s1, s2) and the answer a, output ⌊CompressRecover (s2, a)⌉ 𝑞 3,𝑝 .

Correctness. We formally analyze the correctness error in Respire as a function of the scheme parameters in Appendix D.1. In Section 4.1, we describe how we choose the scheme parameters concretely (to achieve a target error rate of 2−40 ). 

Security. In the Respire protocol (Construction 3.2), the server’s view consists of the public parameters along with the client’s query. The public parameters consist of RLWE encodings together with key-switching matrices for the underlying transformations, and the query consists of additional RLWE encodings. Assuming the RLWE assumption (Definition 2.3) along with a “circular security” assumption (for the key-switching parameters), we can show that the public parameters and the client’s queries are pseudorandom. The circular security assumption we use is similar to those used in many previous PIR protocols [ACLS18, AYA +21, MCR21, MW22a, MR23, LMRS24, MW24]. We give a precise statement of the assumption and a formal security proof in Appendix D.2. 11 3.2 Extending Respire to the Batch Setting 

For security, the dimension 𝑑 2 of the smaller ring in Respire cannot be arbitrarily small. Essentially, this means that the client must always download at least 𝑑 2 integers, irrespective of the size of a single record. In particular, when the record can be described by 𝑑 3 elements of Z𝑝 where 𝑑 3 ≪ 𝑑 2, we again incur a high communication penalty. The problem essentially boils down to the fact that RLWE encodings of short plaintexts have very poor rate. One approach to achieve better rate is in the batch setting where instead of fetching a single record, the client instead fetches 𝑘 

elements (see Remark 2.2). In this section, we describe how to extend Respire (Construction 3.2) to more efficiently support batch queries with low communication overhead. Our packing approach relies on two key ingredients which we describe below: (1) homomorphic repacking and (2) vectorization. 

Database configuration. In the multi-query version of Respire , we model each database record as an element of 𝑅 𝑑 3,𝑝 where 𝑑 3 ≤ 𝑑 2 is a power-of-two. In the single-query protocol, the record dimension coincides with the small ring dimension 𝑑 2, and moreover, we need to choose 𝑑 2 to be sufficiently large that the RLWE assumption holds. This in turn limits the range of possible values for 𝑑 2, and by extension, the dimension of each plaintext record. In the batched setting, we support any power-of-two 𝑑 3 ≤ 𝑑 2. As in Respire , each packed database element contains multiple (i.e., 𝑑 1/𝑑 3, where 𝑑 1 is the large ring dimension) individual records (see Fig. 3a). 

Coefficient projections over 𝑅 𝑑 . Our homomorphic repacking procedure (described below) relies on way to project away coefficients of a polynomial 𝑓 ∈ 𝑅 𝑑 . Specifically, for an integer 𝑗 ∈ [ 0, 𝛿 ] where 𝑑 = 2𝛿 , we define the coefficient projection map 𝜋 𝑗 : 𝑅 𝑑 → 𝑅 𝑑 to be the mapping 

𝜋 𝑗 ©«∑︁ 𝑖 ∈ [ 0,𝑑 −1]

𝑓 𝑖 𝑥 𝑖 ª®¬

B∑︁    

> 𝑖 ∈ [ 0,𝑑 −1]:2 𝑗 |𝑖

𝑓 𝑖 𝑥 𝑖 . (3.6) In words, the projection 𝜋 𝑗 zeroes out every coefficient 𝑓 𝑖 of the input polynomial associated with a monomial 𝑥 𝑖 

where 𝑖 is not a multiple of 2𝑗 . For instance, 𝜋 1 outputs the polynomial that only contains the even powers of 𝑥 . We illustrate the coefficient projection operation in Fig. 4a. If we work over 𝑅 𝑑,𝑞 for odd 𝑞 , the projection maps 𝜋 0, . . . , 𝜋 𝛿 can be efficiently implemented using the Frobenius automorphisms on 𝑅 𝑑 (i.e., the mapping 𝑥 ↦ → 𝑥 ℓ with ℓ ∈ Z). Using techniques to homomorphically evaluate automorphisms on RLWE encodings [BGV12, GHS12a], we obtain an algorithm to homomorphically evaluate the coefficient projection map on RLWE encodings. We model the coefficient projection procedure as follows: 

Box 3: Coefficient Projection Algorithms 

• ProjectSetup (1𝜆 , s) → pp : On input the security parameter 𝜆 and an RLWE secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, the projection setup algorithm outputs a set of projection public parameters pp proj .

• Project (pp proj , c, 𝑗 ) → c′: On input the projection parameters pp proj , an RLWE encoding c ∈ 𝑅 2 

> 𝑑,𝑞

, and the projection index 𝑗 ∈ [ 𝛿 ], the projection algorithm outputs a new RLWE encoding c′.The property we require is that if c is an RLWE encoding of a polynomial 𝑓 ∈ 𝑅 𝑑 with respect to s, then Project (pp , c)

outputs an RLWE encoding of the projected polynomial 𝜋 𝑗 (𝑓 ). We provide the formal description in Appendix A.1. 

Homomorphic repacking. The main ingredient in the batched construction of Respire is a repacking algorithm. At a high level, the (homomorphic) repacking algorithm takes a batch of 𝑘 = 𝑑 3/𝑑 2 responses and compresses them into a single response (i.e., a single RLWE encoding). More formally, suppose the client makes a batch of 𝑘 queries for records 𝑟 1, . . . , 𝑟 𝑘 ∈ 𝑅 𝑑 3,𝑝 . Let 𝑠 1, . . . , 𝑠 𝑘 ∈ 𝑅 𝑑 1,𝑝 be the packed database elements that contain the records 𝑟 1, . . . , 𝑟 𝑘 .The repacking algorithm takes 𝑠 1, . . . , 𝑠 𝑘 and outputs 𝑠 ′ that encodes Π(𝑟 1, . . . , 𝑟 𝑘 ) where Π : 𝑅 𝑘 𝑑 3,𝑝 → 𝑅 𝑑 2,𝑝 is the ring packing function from Eq. (3.3). Essentially, the repacking procedure first extracts the desired record 𝑟 𝑖 from its 12 𝑓 0 𝑓 1 𝑓 2 𝑓 3 𝑓 0 0 𝑓 2 0

Apply projection map 𝜋 1

(a) Illustration of the projection operation over the polynomial ring 𝑅 4 = Z[𝑥 ]/( 𝑥 4 + 1). The projection map 𝜋 1 zeroes out all coefficients associated with odd powers of 𝑥 . We model polynomials 𝑓 (𝑥 ) = Í𝑖 ∈ [ 0,3] 𝑓 𝑖 𝑥 𝑖 as a vector of coefficients 

(𝑓 0, 𝑓 1, 𝑓 2, 𝑓 3) ∈ Z4.

𝑟 0,0 𝑟 0,1𝑟 1,0 𝑟 1,1𝑟 2,0 𝑟 2,1𝑟 3,0 𝑟 3,1

𝑟 3,0 𝑟 0,1 𝑟 1,1 𝑟 2,1 𝑟 3,1 𝑟 0,0 𝑟 1,0 𝑟 2,0

𝑟 3,0 0 0 0 𝑟 3,1 0 0 0

Rotation (i.e., multiply by 𝑥 −3)Projection ( 𝜋 2)(b) The rotation step aligns the desired record ( 𝑟 3) into the initial position, just as in the single-query case. The subsequent projec-tion step zeroes out all components other than the desired one. For simplicity, we ignore the sign changes from the rotation. 

𝑟 3,0 0 0 0 𝑟 3,1 0 0 0

𝑟 0,0 0 0 0 𝑟 0,1 0 0 0

𝑟 3,0 0 0 0 𝑟 3,1 0 0 0

0 0 𝑟 0,0 0 0 0 𝑟 0,1 0

𝑟 3,0 0 𝑟 0,0 0 𝑟 3,1 0 𝑟 0,1 0

𝑟 3,0 𝑟 0,0 𝑟 3,1 𝑟 0,1

Align encodings (rotations) Sum encodings Dimension reduction (c) After applying the rotation and projection mappings to each response, the packing algorithm realigns and sums them together to obtain the final encoding. Finally, we apply the same dimension reduction algorithm (as in vanilla Respire ) to obtain the final repacked encoding. Components that are lost after dimension reduction are indicated by the striped pattern. 

Figure 4: Illustration of the core operations underlying the Respire (homomorphic) repacking algorithm. In Figs. 4b and 4c, the main ring dimension is 𝑑 1 = 8, the reduced ring dimension is 𝑑 2 = 4, and the record dimension is 𝑑 3 = 2.We pack 𝑘 = 2 records in each output encoding. Each record 𝑟 𝑖 is a pair (𝑟 𝑖, 0, 𝑟 𝑖, 1).packed representation 𝑠 𝑖 and then repacks the extracted records into a single element of 𝑅 𝑑 1,𝑝 . We describe the main steps of our approach below and illustrate the key steps in Figs. 4b and 4c. 

• Rotation: Let ℓ = 𝑑 1/𝑑 3 and let 𝑗 𝑖 ∈ [ 0, ℓ − 1] be the position of 𝑟 𝑖 within 𝑠 𝑖 . The repacking algorithm first computes 𝑥 − 𝑗 𝑖 · 𝑠 𝑖 . By construction, 𝑟 𝑖 is in the initial position within 𝑥 − 𝑗 𝑖 · 𝑠 𝑖 .

• Projection: Next, the repacking algorithm projects away all records other than the initial record using the projection map 𝜋 𝛿 1 −𝛿 3 where 𝑑 3 = 2𝛿 3 and 𝑑 1 = 2𝛿 1 . Namely, the repacking algorithm computes 𝑡 𝑖 =

𝜋 𝛿 1 −𝛿 3 (𝑥 − 𝑗 𝑖 · 𝑠 𝑖 ), where 𝜋 𝛿 1 −𝛿 3 is the projection function from Eq. (3.6). This yields a packed encoding with 𝑟 𝑖 in the initial position and 0 in all other positions. 

• Repacking: Given 𝑡 1, . . . , 𝑡 𝑘 ∈ 𝑅 𝑑 1,𝑝 , the algorithm now aggregates the packed encoding by computing 

𝑡 = Í𝑖 ∈ [ 0,𝑘 −1] 𝑡 𝑖 · 𝑥 𝑖 ·𝑑 1/𝑑 2 . This is shown in Fig. 4c. Finally, we observe that each of the underlying operations (rotation, projection, and repacking) can be described in terms of scalar multiplications, additions, and automorphisms; thus, we can implement these homomorphically on RLWE encodings. This yields the homomorphic repacking approach in the batched version of Respire .

Vectorization. With repacking, a single Respire response can encode 𝑘 = 𝑑 2/𝑑 3 queries. When the client makes more than 𝑘 queries, then the response necessarily contains more than a single RLWE encoding. In this setting, we can leverage the response packing approach from Spiral [MW22a] and pack the individual RLWE encodings into a single vector encoding. In this way, each of the RLWE encodings in the response share a common “random” component. Moreover, with split modulus switching, the modulus associated with the “random” component is much 13 larger than those of the message-embedding component. Concretely, our use of vectorization reduces the response size by a factor of ≈ 2.7× when the batch size is 32 .We start by introducing the notion of a vector RLWE encoding. We say that 

c =

 𝑎 

s𝑎 + e + μ



∈ 𝑅 𝑛 +1

> 𝑑,𝑞

is an RLWE encoding of a vector μ ∈ 𝑅 𝑛 𝑑,𝑞 with respect to a secret key S = [− s | I𝑛 ]T ∈ 𝑅 (𝑛 +1) × 𝑛 𝑑,𝑞 and error e ∈ 𝑅 𝑛 𝑑,𝑞 if 

STc = μ+e. Similar to a (scalar) RLWE encoding, when c =  𝑐 1

> c2

, we often refer to 𝑐 1 as the “random” component of the encoding and c2 as the “message-embedding” component of the encoding. Notably, the compression from using vector RLWE encodings comes from the fact that random component is only a single ring element. In contrast, 𝑛 scalar RLWE encodings would include 𝑛 random components, one for each encoding. We now recall the syntax from [MW22a]: 

Box 4: Vectorization Algorithms 

• VecSetup (1𝜆 , s1, S2) → pp vec : On input a security parameter 𝜆 and two secret keys s1 ∈ 𝑅 2 

> 𝑑,𝑞

and 

S2 ∈ 𝑅 (𝑛 +1) × 𝑛 𝑑,𝑞 , the setup algorithm outputs a set of vectorizing parameters pp vec .

• Vectorize (pp vec , (c1, . . . , c𝑛 )) → c′: On input the vectorization parameters pp vec and a tuple of encodings 

c1, . . . , c𝑛 ∈ 𝑅 2 

> 𝑑,𝑞

, the vectorization algorithm outputs a ciphertext c′ ∈ 𝑅 𝑛 +1 

> 𝑑,𝑞

.If c1, . . . , c𝑛 are RLWE encodings of the scalars 𝜇 1, . . . , 𝜇 𝑛 ∈ 𝑅 𝑑,𝑞 with respect to s1, then Vectorize (pp vec , (c1, . . . , c𝑛 )) 

outputs an encoding μ = (𝜇 1, . . . , 𝜇 𝑛 ) with respect to s2 (and slightly larger noise). We refer to Appendix C.1 for the formal description and correctness analysis. 

Batching queries in Respire . We now give the formal description of Respire tailored for the batch setting. 

Construction 3.3 (Respire for Batch Queries) . Let 𝜆 be a security parameter. The batched version of Respire is param-eterized by a similar set of components as the base version of Respire (Construction 3.2). We enumerate these below: 

• Lattice parameters: As in Respire , let 𝑑 1 = 𝑑 1 (𝜆 ) and 𝑑 2 = 𝑑 2 (𝜆 ) denote the full ring dimension and the reduced ring dimension, respectively. We require that 𝑑 1 = 2𝛿 1 and 𝑑 2 = 2𝛿 2 where 𝛿 1, 𝛿 2 are non-negative in-tegers and 𝑑 1 ≥ 𝑑 2. Let 𝑞 1 = 𝑞 1 (𝜆 ), 𝑞 2 = 𝑞 2 (𝜆 ), and 𝑞 3 = 𝑞 3 (𝜆 ) be moduli where 𝑞 1 ≥ 𝑞 2 ≥ 𝑞 3. Let 𝜒 1,𝑒 = 𝜒 1,𝑒 (𝜆 ),

𝜒 1,𝑠 = 𝜒 1,𝑠 (𝜆 ), 𝜒 ′ 

> 1,𝑒

= 𝜒 ′ 

> 1,𝑒

(𝜆 ), and 𝜒 ′ 

> 1,𝑠

= 𝜒 ′ 

> 1,𝑠

(𝜆 ) be distributions over 𝑅 𝑑 1,𝑞 1 . Let 𝜒 2,𝑒 = 𝜒 2,𝑒 (𝜆 ), 𝜒 2,𝑠 = 𝜒 2,𝑠 (𝜆 ) be distributions over 𝑅 𝑑 2,𝑞 2 .

• Plaintext dimension modulus: Let 𝑑 3 = 𝑑 3 (𝜆 ) be the record dimension and 𝑝 be the plaintext modulus. Each database record is an element of 𝑅 𝑑 3,𝑝 B Z𝑝 [𝑥 ]/( 𝑥 𝑑 3 + 1). We require that 𝑑 3 = 2𝛿 3 where 𝛿 3 is a non-negative integer and 𝑑 2 ≥ 𝑑 3.

• Database configuration: Let 𝑁 = 2𝜈 1+𝜈 2+𝜈 3 where 𝜈 1, 𝜈 2 ∈ N and 𝜈 3 B 𝛿 1 − 𝛿 3 be (a bound on) the number of records in the database. The choices of the initial dimension 𝜈 1 and the folding dimension 𝜈 2 can be arbitrary. 

• Query packing parameters: Let (QueryPackSetup , QueryPack , QueryUnpack ) be the query packing algo-rithms from Box 2 instantiated using Construction B.6 with 𝜒 1,𝑒 as the error distribution. 

• Projection parameters: Let (ProjectSetup , Project ) be the homomorphic projection algorithms from Box 3 instantiated using Construction A.7 with 𝜒 1,𝑒 as the error distribution. 

• Vectorization parameters: Let (VecSetup , Vectorize ) be the vectorization algorithms from Box 4 instantiated using Construction C.1) with 𝜒 ′ 

> 1,𝑒

as the error distribution. Let 𝑛 vec = 𝑛 vec (𝜆 ) be the vector length used for vectorization. 

• Response compression parameters: Let (Compress , CompressRecover ) be the response compression algo-rithms from Box 1 instantiated using Construction C.3 with 𝜒 2,𝑒 as the error distribution. 14 We describe how to instantiate the underlying parameters (e.g., decomposition bases, encoding modulus) for the underlying algorithms in Section 4. We now describe a scheme that supports a maximum batch size of 𝑇 = 𝑛 vec (𝑑 2/𝑑 3).

• Setup (1𝜆 ): On input the security parameter 𝜆 , the setup algorithm proceeds as follows: 

– Sample a source key ˜𝑠 1 ← 𝜒 1,𝑠 and two target keys ˜s′ 

> 1

← ( 𝜒 ′ 

> 1,𝑠

)𝑛 vec and ˜s2 ← 𝜒 𝑛 vec  

> 2,𝑠

. Define 

s1 = [− ˜𝑠 1 | 1]T ∈ 𝑅 2 

> 𝑑 1,𝑞 1

and S′ 

> 1

= [− ˜s′ 

> 1

| I𝑛 vec ]T ∈ 𝑅 (𝑛 vec +1) × 𝑛 vec  

> 𝑑 1,𝑞 1

and S2 = [− ˜s2 | I𝑛 vec ]T ∈ 𝑅 (𝑛 vec +1) × 𝑛 vec  

> 𝑑 2,𝑞 2

.

– Next, sample parameters for query packing, projection, vectorization, and response packing: 

∗ pp qpk ← QueryPackSetup (1𝜆 , s1).

∗ pp proj ← ProjectSetup (1𝜆 , s1).

∗ pp vec ← VecSetup (1𝜆 , s1, S′

> 1

).

∗ pp comp ← CompressSetup (1𝜆 , S′

> 1

, S2).The setup algorithm outputs the query key qk = (s1, S2) and the parameters pp = (pp qpk , pp proj , pp vec , pp comp ).

• SetupDB  1𝜆 , {𝑟 𝛼,𝛽,𝛾 }𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ],𝛾 ∈ [ 2𝜈 3 ]

: On input the security parameter 𝜆 and a collection of 𝑁 records 

𝑟 𝛼,𝛽,𝛾 ∈ 𝑅 𝑑 3,𝑝 , the database preprocessing algorithm constructs the packed records as in Respire (Construc-tion 3.2). Namely, for all 𝛼 ∈ [ 2𝜈 1 ] and 𝛽 ∈ [ 2𝜈 2 ], it computes ˜𝑟 𝛼,𝛽 according to Eq. (3.4), except the ring packing function Π now maps 𝑅 2𝜈 3 

> 𝑑 3,𝑝

to 𝑅 𝑑 1,𝑝 . The algorithm then outputs the packed elements db =  ˜𝑟 𝛼,𝛽 𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ] .

• Query (qk , (idx 1, . . . , idx 𝑇 )) : On input the query key qk = (s1, S2) and a tuple of 𝑇 queries idx 1, . . . , idx 𝑇 where 

idx 𝑡 = (𝛼 (𝑡 ) , 𝛽 (𝑡 ) , 𝛾 (𝑡 ) ) ∈ [ 2𝜈 1 ] × [ 2𝜈 2 ] × [ 2𝜈 3 ], the query algorithm computes q𝑡 according to Eq. (3.5) for each 

𝑡 ∈ [ 𝑇 ]. It outputs the query q = (q1, . . . , q𝑇 ).

• Answer (pp , db , q): On input the parameters pp = (pp qpk , pp proj , pp vec , pp comp ), a preprocessed database db =

 ˜𝑟 𝑖,𝑗 𝑖 ∈ [ 2𝜈 1 ],𝑗 ∈ [ 2𝜈 2 ] , and a query q = (q1, . . . , q𝑇 ), the answer algorithm proceeds as follows: 1. Run Respire for each query: For each 𝑡 ∈ [ 𝑇 ], run Steps 1 to 4 of the Answer algorithm in Respire 

(Construction 3.2) using the query expansion parameters pp qpk , the preprocessed database db , and the query q𝑡 . Let c(out ) 

> 𝑡

be the output of Step 4 of the Answer algorithm on the 𝑡 th query. 2. Projection: For each 𝑡 ∈ [ 𝑇 ], homomorphically project each response: 

c(proj ) 

> 𝑡

← Project  pp proj , c(out ) 

> 𝑡

, 𝛿 1 − 𝛿 3

.

3. Repacking: For each 𝑗 ∈ [ 𝑛 vec ], compute the repacked encoding 

c(repack ) 

> 𝑗

=∑︁   

> 𝑖 ∈ [ 𝑑 2/𝑑 3]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · c(proj )(𝑑 2/𝑑 3 ) · ( 𝑗 −1)+ 𝑖 .

4. Vectorizing: Next, the answer algorithm packs the encodings into a single vector RLWE encoding: 

c(vec ) ← Vectorize 



pp vec ,  c(repack ) 

> 1

, . . . , c(repack )

> 𝑛 vec



.

5. Compression: Output the (compressed) response a ← Compress  pp comp , c(vec ) .

• Extract (qk , a): On input the query key qk = (s1, S2) and the response a, compute the packed responses 



ˆ𝑟 1

...

ˆ𝑟 𝑛 vec 



← ⌊ CompressRecover (S2, a)⌉ 𝑞 3,𝑝 ∈ 𝑅 𝑛 vec 

> 𝑑 2,𝑝

For each 𝑖 ∈ [ 𝑑 2/𝑑 3] and 𝑗 ∈ [ 𝑛 vec ], set 𝑟 (𝑑 2/𝑑 3 ) · ( 𝑗 −1)+ 𝑖 = 𝜅 −1 

> 𝑑 3,𝑑 2

(𝑥 − ( 𝑖 −1) · ˆ𝑟 𝑗 ) ∈ 𝑅 𝑑 3,𝑝 , where 𝜅 −1 

> 𝑑 3,𝑑 2

: 𝑅 𝑑 2 → 𝑅 𝑑 3 is the dimension reduction mapping from Eq. (3.2). Finally, output the records 𝑟 1, . . . , 𝑟 𝑇 .15 Remark 3.4 (Packing Responses from Different Databases) . The first step of the Answer algorithm in Construction 3.3 runs 𝑇 independent executions of the Respire protocol to obtain 𝑇 responses c(out ) 

> 1

, . . . , c(out ) 

> 𝑇

which are then packed together. In Construction 3.3, each of these queries were applied to the same preprocessed database db . However, this does not have to be the case. In particular, each query q𝑖 could be applied over a different preprocessed database 

db 𝑖 of the same dimension. The rest of the packing algorithm is agnostic to this choice. This allows us to compose this approach with (probabilistic) batch codes [IKOS04, ACLS18] to reduce the computational costs of answering 𝑇 

queries. Instead of needing to make a pass over the full database to answer each query in the batch, the server in this case applies query q𝑖 to a much smaller sub-database db 𝑖 . We use this approach to obtain a batch PIR scheme. We refer to Section 4.3 for implementation details and benchmarks. 

Remark 3.5 (Comparison with Vectorized BatchPIR) . The response packing approach described here may seem similar to other batch PIR schemes such as Vectorized BatchPIR [MR23] and Piranha [LLWR24]. However, there is a critical difference: both Vectorized BatchPIR and Piranha leverage SIMD support in FHE [GHS12a] to support batch queries, and specifically, they use the Brakerski-Fan-Vercauteren (BFV) encryption scheme [Bra12, FV12]. In the BFV scheme, the noise grows exponentially with the multiplicative depth of the computation, leading to larger parameters. Moreover, SIMD packing is not compatible with the query compression techniques from [ACLS18, CCR19], which leads to larger queries and responses. The approach taken in Respire is to first build a communication-efficient single-query PIR scheme (Construction 3.2) that leverages the RLWE-GSW external product [CGGI18, CGGI20] to implement homomorphic multiplication (following [GH19, MCR21, MW22a]). This allows better noise growth (scaling 

linearly with the multiplicative depth) and allows us to leverage techniques for query and response compression. On the flip side, Respire does not support SIMD operations, so the server cost is higher with Respire for large batch sizes. For small batch sizes (e.g., issuing 32 queries on a 1 GB database), Respire is 16% faster than Vectorized BatchPIR and requires 4.9× less communication. We refer to Section 4.3 for the full breakdown. 

# 4 Implementation and Evaluation 

The Respire protocol is designed for databases with small records. In our evaluation, we focus on the setting where each database record is 256 bytes; this is a typical setting used in applications of PIR to metadata-hiding communication [AS16, ALP +21, AYA +21]. 

## 4.1 Parameter Selection 

In our evaluation, we use two different sets of parameters. The first set is tailored for the single-query case while the second has better support for batch queries. For our evaluation, we view the single-query Respire (Construction 3.2) as a special case of the batch version of Respire (Construction 3.3), where we set the vectorization length to 𝑛 vec = 1

and the record dimension 𝑑 3 to the reduced ring dimension 𝑑 2 (i.e., 𝑑 2 = 𝑑 3). In this case, the batched version of 

Respire essentially corresponds to the single-query version described in Construction 3.2. 

Parameter selection methodology. We choose the scheme parameters to tolerate a correctness error of at most 

2−40 (based on the formal analysis given in Appendix D.1). Simultaneously, we choose the lattice parameters to ensure that each of the underlying RLWE assumptions which we require for security (see Appendix D.2) has 128 bits of classical security. We use the lattice estimator tool [APS15a] for our security estimates. 2 Here, we describe how we select the primary parameters of our scheme and list our parameter choices in Appendix E. 

Lattice parameters. In Respire , we rely on three different RLWE assumptions: 

• RLWE over the main ring 𝑅 𝑑 1,𝑞 1 (with error distribution 𝜒 1,𝑒 and secret key distribution 𝜒 1,𝑠 ). The queries (and many of the key-switching matrices) are encoded over the large ring. We set the ring dimension to be 𝑑 1 = 2048 

and 𝑞 1 to be a 56 -bit modulus (where 𝑞 1 = 1 mod 2𝑑 to support fast NTT evaluation over 𝑅 𝑑 1,𝑞 1 ). Since the noise in the initial GSW encodings (output by the query expansion procedure) scales with the norm of the   

> 2We used commit 7ea215a4d55f (April 8, 2024) from [APS15b] for our security estimates.

16 secret key (as opposed to its variance), we take 𝜒 1,𝑠 to be the uniform distribution on the interval [− 7, 7]. The error distribution 𝜒 1,𝑒 is a discrete Gaussian distribution with width parameter 𝜎 1,𝑒 = 9.9. We note that using a norm-bounded secret key distribution is common in lattice-based cryptographic systems, and for instance, is used both in standardized lattice-based key-agreement protocols [ABD +21] (specifically, the Kyber protocol uses a binomial distribution on the interval [− 3, 3]) or FHE schemes (many schemes use a ternary secret key distribution [GHS12b, CKKS17, ACC +18]). 

• RLWE over the main ring 𝑅 𝑑 1,𝑞 1 (with error distribution 𝜒 ′ 

> 1,𝑒

and secret key distribution 𝜒 ′ 

> 1,𝑠

). We consider a secondary instantiation of RLWE over the main ring for sampling the vectorization parameters where the secret key and the error are both sampled from a discrete Gaussian distribution with width 𝜎 ′ 

> 1

= 9.9. Compared to the previous instantiation, we substitute a discrete Gaussian distribution in place of the uniform distribution since the former has a smaller subgaussian width parameter. This allows better control of noise growth in the vectorization step (see Appendix D.1). 

• RLWE over the small ring 𝑅 𝑑 2,𝑞 2 (with error distribution 𝜒 2,𝑒 and 𝜒 2,𝑠 ). We rely on this assumption to publish the key-switching matrices needed for dimension reduction. In the single-query setting, we take the reduced ring dimension to be 𝑑 2 = 512 and sample both the secret key and the error from a discrete Gaussian distribution with width 𝜎 2 = 253 .6.Each of these instantiations provides 128 bits of classical security according to the lattice estimator tool [APS15a]. 

Database configuration. We choose the dimension of the reduced ring to be 𝑑 2 = 512 . This is the smallest (power-of-two) ring dimension that we could find which provides 128-bits of security and a correctness error of 

2−40 for the database configurations of interest. We set 𝑝 = 16 so each plaintext element (in 𝑅 𝑑 2,𝑝 ) can encode 256 

bytes of data. Since 𝑑 1 = 2048 , we can pack 𝜈 3 = 𝑑 1/𝑑 2 = 4 records into each ring element. We choose the remaining database dimensions 𝜈 1 and 𝜈 2 to be roughly equal; this achieves a good balance between the noise growth and the computational costs of the protocol. 

Gadget decomposition parameters. The different sub-algorithms in Respire (query packing, projection, vec-torization, and compression) are parameterized by different gadget decomposition bases 𝑧 . Smaller decomposition bases (corresponding to a wider gadget matrix) reduce the noise growth but incurs more computational costs and larger public parameters. In many settings, the noise growth from a sub-algorithm introduces an additive increase in the noise rather than a multiplicative factor. As such, we opt to pick the largest gadget decomposition base that does not significantly increase the noise accumulation. This leads to smaller public parameters (and computational overhead). We enumerate the decomposition bases we use in Table 5 in Appendix E. 

Modulus choice. Similar to Spiral [MW22a], we choose the main encoding modulus 𝑞 1 to be a product of two 28-bit primes: 𝑞 1 = 𝑞 1,1 · 𝑞 1,2, where 𝑞 1,1, 𝑞 1,2 = 1 mod 2 𝑑 1. This allows us to use the (negacyclic) NTT for fast ring multiplication [LMPR08, LN16], which we accelerate using the AVX2 SIMD instructions (c.f., [BKS +21]). We implement arithmetic modulo 𝑞 1 using 64-bit native integer arithmetic modulo 𝑞 1,1 and 𝑞 1,2 (with deferred modular reductions), and combine the results using the Chinese remainder theorem. Similarly, we choose 𝑞 2 = 1 mod 2 𝑑 2 so we can also use NTTs for polynomial arithmetic over the ring 𝑅 𝑑 2,𝑞 2 . Finally, we choose 𝑞 2 and 𝑞 3 to be the smallest values possible while still ensuring correctness. Concretely, for the single-query scheme, 𝑞 2 ≈ 224 and 𝑞 3 = 24.

PRG compression. We use a standard optimization [ALP +21, MCR21, HHC +23, MW22a, MR23, LMRS24, MW24] to reduce the query size, wherein the client sends a PRG seed in place of the random component of the RLWE encodings in the query. We instantiate the PRG using ChaCha20 [Ber08]. 

Sharing public parameters. Several of the public parameters in Respire (Constructions 3.2 and 3.3) rely on a set of automorphism key-switching matrices (Construction A.4). These include the public parameters pp coeff ,RLWE ,

pp coeff ,GSW used for query expansion as well as the public parameters pp proj used for projections. When choosing parameters, we use the same decomposition base for the GSW query expansion and the projection step; this allows 17 us to use the same set of key-switching matrices for both steps (see Table 5 in Appendix E for the full breakdown). This reduces the size of the public parameters. As noted in Remark B.8, we use different decomposition bases in 

pp coeff ,RLWE and pp coeff ,GSW to balance the noise in the resulting RLWE and GSW encodings. 

## 4.2 Respire Benchmarks and Evaluation 

Our implementation of Respire contains roughly 8,000 lines of Rust. 3 We use an AWS EC2 r7i.8xlarge instance with 32 vCPUs (Intel Xeon Platinum 8488C @ 2.4GHz), 256 GB of memory, and running Ubuntu 22.04.4 for our experiments. We use rustc 1.77.0 as our Rust compiler and gcc 11.4.0 as our C++ compiler. The processor supports the AVX2 and AVX-512 instruction sets and we enable SIMD instruction set support for all schemes. Our implementation of Respire only uses AVX2, and not AVX-512. We use a single-threaded execution environment for all measurements. All measured running times were averaged over at least 5 trials and have a standard deviation of at most 1% of the average value. Throughout, we write KB, MB, GB to denote 210 , 220 , and 230 bytes, respectively. 

Comparison schemes. Among the single-query PIR protocols, Respire is most similar to Spiral [MW22a]. Both protocols operate in the model with client-specific public parameters. The Spiral family of protocols represents the current state-of-the-art in this setting. In our evaluation, we benchmark against the reference implementation of 

Spiral [MW22b], which selects the different Spiral variants (e.g., Spiral , SpiralPack , SpiralStream ) depending on the database configuration. For the database configurations we consider (databases with small records), the implementation defaults to SpiralPack . For our evaluation, we focus on databases with small records (e.g., 256-byte records). For databases with larger records, the query compression and response compression techniques in Respire 

are no longer applicable, and the performance of Respire essentially converges to that of Spiral (or SpiralPack ). To illustrate the new computation/communication trade-offs achieved by Respire , we also report benchmarks against the state-of-the art protocols in other models. This includes the SimplePIR protocol, which operates in a different model where the client first downloads a database-dependent hint in the offline phase. SimplePIR achieves extremely high throughput at the expense of needing a large hint (and larger query/response sizes). 4 Finally, we also compare against HintlessPIR [LMRS24] and YPIR [MW24]. These schemes achieve silent preprocessing where there is no client-side or server-side state, but have higher communication costs. We refer to Section 5 for further discussion of other PIR constructions. Finally, for the batch setting, we compare against Vectorized BatchPIR [MR23]. For each of these schemes, we measure their performance using their reference implementations on our benchmarking setup. 

Macrobenchmarks. Table 1 compares the performance of Respire to other PIR protocols. On a 256 MB database, a Respire query is just 4.1 KB and the response is 2 KB. This is a 3.9× reduction in query size and 10 × reduction in response size compared to Spiral . Compared to protocols like SimplePIR, HintlessPIR, and YPIR, the Respire scheme achieves over a 20 × reduction in total communication. Over an 8 GB database, the online communication in Respire 

is 4.5× smaller than Spiral , and over 40 × smaller than SimplePIR. The reduction in query size and response size in Respire is due to the query compression and response compression techniques described in Section 3 (see also Appendices B and C for the formal description of our algorithms). Notably, in Respire , we avoid having to communicate a complete RLWE encoding over the large ring 𝑅 𝑑 1,𝑞 1 , and indeed the total online communication in Respire is smaller than the size of a single element of 𝑅 𝑑 1,𝑞 1 . Previous RLWE-based PIR schemes (e.g., [MBFK16, ACLS18, AYA +21, MCR21, MW22a]) all communicated at least one (large) RLWE encoding, which results in larger queries and responses. In fact, the query and response size of Respire on databases with small records is comparable to those using traditional number-theoretic assumptions [ALP +21] (e.g., schemes based on ElGamal or Gentry-Ramzan [GR05]). The advantage of these traditional number-theoretic schemes has been small communication. For example, the Gentry-Ramzan scheme can have communication as low as 1.8 KB when considering a 1 MB database with 5000 records (288 bytes per record), but at the price of a server throughput of roughly 20 KB/s [ALP +21, Table 5]. By modestly increasing communication to 5.4 KB, the throughput can be increased to roughly 186 KB/s. In contrast, with Respire , we can  

> 3Our implementation is available here: https://github.com/AMACB/respire/ .
> 4There are faster schemes with sublinear server computation [ZPSZ24, MSR23, GZS24], but they require the client to stream the full database in an offline phase. For our comparisons, we focus on schemes whose total communication is sublinear in the database size.

18 Database Metric Spiral SimplePIR HintlessPIR YPIR Respire 

220 × 256 B(256 MB) Offline Comm. 7.8 MB 102.9 MB — — 3.9 MB 

Query Size 16.0 KB 32.0 KB 424 KB 574 KB 4.1 KB 

Response Size 20.0 KB 102.0 KB 964 KB 60 KB 2.0 KB 

Computation 1.28 s 0.024 s 0.658 s 0.17 s 1.26 s 

Throughput 200 MB/s 10.4 GB/s 389 MB/s 1.49 GB/s 204 MB/s 

222 × 256 B(1 GB) Offline Comm. 7.8 MB 211.1 MB — — 3.9 MB 

Query Size 16.0 KB 64.0 KB 488 KB 686 KB 7.7 KB 

Response Size 20.0 KB 211.2 KB 1.71 MB 120 KB 2.0 KB 

Computation 2.94 s 0.093 s 1.242 s 0.40 s 3.48 s 

Throughput 348 MB/s 10.8 GB/s 825 MB/s 2.50 GB/s 295 MB/s 

225 × 256 B(8 GB) Offline Comm. 10.0 MB 445.1 MB — — 3.9 MB 

Query Size 16.0 KB 256.0 KB 1.35 MB 1.33 MB 14.8 KB 

Response Size 60.0 KB 445.0 KB 1.71 MB 228 KB 2.0 KB 

Computation 15.44 s 0.772 s 3.698 s 1.71 s 20.84 s 

Throughput 530 MB/s 10.4 GB/s 2.16 GB/s 4.69 GB/s 393 MB/s Table 1: Comparison of Respire to Spiral [MW22a], SimplePIR [HHC +23], HintlessPIR [LMRS24], and YPIR [MW24] for retrieving a single record from databases of various sizes. For each scheme, we report the offline communication (i.e., the public parameters in the case of Spiral and Respire and the server hint in the case of SimplePIR). We define the throughput to be the ratio of the database size to the server’s computation time. achieve comparable communication (6.1 KB), but with a throughput of several hundred MB/s (over 1000 × faster than the number-theoretic constructions). Thus, Respire provides a new data point in communication-computation trade-offs. Compared to other lattice-based PIR schemes, Respire trades off server throughput for smaller queries and re-sponses. Compared to Spiral , Respire is about 26% slower on an 8 GB database (but requires 4.5× less communication and a 2.5× smaller public parameters). Compared to protocols like SimplePIR, HintlessPIR, and YPIR, the Respire 

protocol is up to 27 × smaller on the 8 GB database. These protocols have substantially larger queries (over 90 × larger for HintlessPIR) or hints (SimplePIR requires downloading a 445 MB hint). 

Server throughput. Fig. 5 shows the query-processing in Respire as a function of the database size. We compare with Spiral , the current state-of-the-art scheme in the model with client-specific parameters. For small databases, the query processing time of Spiral and Respire are quite comparable, but the gap widens with larger database. The difference is likely due to parameter choices: our response compression approach in Respire (Construction C.3) requires using a smaller plaintext modulus compared to Spiral ; as such, this increases the cost of the initial linear scan over the database (i.e., the protocol must process more RLWE encodings). Overall, we observe a 1.3× increase in processing time on an 8 GB database (but 4.5× less communication). 

Microbenchmarks. Fig. 6 provides a fine-grained breakdown of the server computation time in Respire . The first dimension requires a linear scan over the database and thus, the running time scales linearly with the size of the database. The rest of the cost is split between the folding and the query expansion steps. The peculiar “zig-zag” behavior of query unpacking and folding is due to our parameter selection methodology. As described in Section 4.1, we choose parameters that balance the size of the first dimension 2𝜈 1 and the size of the second dimension 2𝜈 2 . Incrementing 𝜈 1

doubles the number of coefficients that need to be expanded using query expansion while incrementing 𝜈 2 double the amount of work in the folding step. Since we alternate incrementing 𝜈 1 and 𝜈 2, we obtain the behavior shown in Fig. 6. Finally, while the final response compression step is critical for reducing the size of the response (by a 14 × factor in the single-query case), it is applied to a fixed number of RLWE encodings (independent of the database size). As such, it constitutes almost a negligible fraction of the overall server computational cost (less than 0.1% in all settings). 19 220 221 222 223 224 225 

0

5

10 

15 

20 

Number of Records 

> Total Time (s)

Respire Spiral 

Figure 5: Total query processing time for Respire and Spiral [MW22a] as a function of the number of records in the database. Each record is 256 bytes. 

Client computation. The client-side costs in Respire are minimal. In our experiments, the setup time takes a maximum of 80 ms, the query-generation time takes at most 148 ms, and response decoding takes at most 7 ms. 

Server preprocessing. In Respire , we allow the server to perform client-independent server preprocessing (i.e. 

SetupDB ). In Respire , this consists of packing the database records into ring elements and applying the NTT trans-formation to the packed ring elements. The preprocessing cost scales linearly with the size of the database. This precomputation takes 16 .8 s for a 256 MB database, and 569 s for an 8 GB database. 

## 4.3 Supporting Batch Queries 

In this section, we show how to combine the batched version of Respire (Section 3.2) with probabilistic batch codes [IKOS04, ACLS18] to support small batches of queries. Our goal in this comparison is to show that the base ver-sion of Respire readily extends to support batch queries, and composition with more recent PIR-to-batch-PIR transfor-mations [BPSY24] should only offer further improvements. We describe our general methodology and evaluation below. 

Cuckoo hashing. To improve server throughput in the batch setting, we use the (probabilistic) batch codes technique from [IKOS04, ACLS18]. In the approach from [ACLS18], the server starts by creating 𝐵 (empty) buckets and samples ℎ independent hash functions. The server hashes each element of the database into ℎ buckets using the 

ℎ hash functions. The hash functions are public and known to the client. To query for a batch of 𝑇 indices 𝑖 1, . . . , 𝑖 𝑇 ,the client uses cuckoo hashing [PR01] (with the ℎ hash functions) to associate a distinct bucket index for each index. The client then performs a standard PIR query on each bucket to request the record of interest. The observation is that each of these PIR queries is over an individual bucket, which is significantly smaller than the overall size of the database. Thus, the server no longer needs to perform a linear scan over the full database to respond to each of the 𝑖 𝑇 

queries; instead, it needs to perform a linear scan over the entries in each bucket. Concretely, the work of [ACLS18] shows that when ℎ = 3 and the number of buckets is roughly 𝐵 ≈ 3𝑇 /2, the probability of a cuckoo hashing failure (i.e., that the client is unable to associate a unique index with each desired index) is at most 2−40 . With 𝐵 ≈ 3𝑇 /2 buckets, and modeling the hash functions as random (as in [ACLS18]), the expected size of each bucket will be ≈ 2𝑁 /𝑇 . Taken together, the server can answer a batch of 𝑇 queries by performing 3𝑇 /2 vanilla PIR queries, each over a database of size 2𝑁 /𝑇 . For simplicity in our implementation, we choose the smallest value of 𝐵 ≥ 3𝑇 /2 such that every bucket has at most 𝐾 ≤ 2𝑁 /𝑇 , where 𝐾 is a power-of-two. To support batch queries, we now run the batched version of 

Respire (Construction 3.3) (with the modification in Remark 3.4) with batch size 𝐵 (i.e. the number of buckets) and database size 𝐾 (i.e. the maximum size of each bucket). We provide sample parameters in Table 4 of Appendix E. 20 Batch Size T = 32 Batch Size T = 256 

Database Metric VBPIR Respire VBPIR Respire 

220 × 256 B(256 MB) Offline Comm. 9.3 MB 4.6 MB 9.3 MB 4.6 MB 

Query Size 578 KB 67.0 KB 1156 KB 326 KB 

Response Size 128 KB 31.8 KB 1028 KB 234 KB 

Computation 8.83 s 15.02 s 27.59 s 60.04 s 

222 × 256 B(1 GB) Offline Comm. 9.3 MB 4.6 MB 9.3 MB 4.6 MB 

Query Size 578 KB 113 KB 1735 KB 513 KB 

Response Size 128 KB 31.8 KB 771 KB 230 KB 

Computation 32.54 s 28.12 s 44.53 s 86.90 s Table 2: Comparison of batched Respire and Vectorized BatchPIR [MR23] (denoted “VBPIR”) for two different database configurations and batch sizes 𝑇 . Each database record is 256 bytes. The reference implementation of Vectorized BatchPIR does not report the size of their public parameters, so we report the number from the paper [MR23]. 

Parameter selection. We follow a similar methodology as described in Section 4.1 to choose parameters for 

Respire to support batch queries. To allow a common basis of comparison in the batch setting, we choose parameters to ensure the per-query correctness error is at most 2−40 . We choose the vectorization dimension 𝑛 vec to balance the public parameter size and the response size. Namely, the size of the vectorization parameters pp vec scales linearly with 𝑛 vec , whereas the size of the response scales with ⌈𝑇 /( 𝑛 vec · ( 𝑑 2/𝑑 3)⌉ , where 𝑑 2 is the reduced ring dimension and 𝑑 3 is the dimension of the record. In the batch setting, we set 𝑑 2 = 2048 and 𝑑 3 = 512 , and adjust 𝑛 vec to balance the response size and public parameter size. We refer to Table 4 in Appendix E for a list of our parameter choices. 

Macrobenchmarks. Table 2 provides a breakdown of the batch version of Respire to the Vectorized BatchPIR scheme [MR23]. Compared to Vectorized BatchPIR (a scheme tailored for batch queries), Respire achieves a 3.4-8.5×

reduction in query size and 3.4-4.4× reduction in response size (and 3.4-7.1× reduction in total communication). For small batches of queries and larger databases, Respire is also slightly (16%) faster than Vectorized BatchPIR. However, for larger databases and batch sizes, there is about a 2.2× performance overhead with Respire . As mentioned before, the improvements in communication is due to the new query and response compression techniques in Respire and the ability to use smaller parameters due to better control of noise growth (see Remark 3.5). Fig. 7 compares the computational costs of Respire vs. Vectorized BatchPIR as a function of the database size and the batch size. For small batch sizes, Respire outperforms Vectorized BatchPIR (batch size up to 16 for a 256 MB database and up to 128 for a 1 GB database). In applications where the client only makes a handful of queries at once (e.g., private blocklist checking, private DNS lookups), Respire is preferred in both communication and computation. For large batch sizes, Respire has smaller communication, but larger computational overheads. Schemes like Vectorized BatchPIR or Piranha [LLWR24] are better-suited for large batch sizes (hundreds to thousands in the case of Piranha) because they take advantage of SIMD support in FHE [GHS12a] to process the query. In contrast, 

Respire starts from a communication-efficient single-query scheme and composes with batch codes and ring packing (for better communication). The batch codes approach allows us to amortize the cost of the linear scan over the database, but not the cost of query expansion (which scales linearly with the batch size). As we show below, the cost of query expansion becomes the dominating factor in our scheme, which makes it less suitable for very large batch sizes. 

Microbenchmarks. Fig. 8 provides a breakdown of the server computation costs of batched Respire as a function of the batch size 𝑇 . The use of batch codes [IKOS04, ACLS18] allows us to amortize the cost of the linear scan (i.e., the first dimension processing) and essentially keeps it fixed as the batch size grows. However, the preprocessing (e.g., query expansion) and post-processing (e.g., folding and response compression) must still be applied individually to each query. As a result, these costs increase with the batch size. As noted above, for large batch sizes, query expansion dominates the 21 220 221 222 223 224 225 

10 −3

10 −2

10 −1

10 0

10 1

Number of Records 

> Time (s)

Query Unpacking First Dimension 

Folding Response Compression 

Figure 6: Server computation breakdown for Respire as a function of the number of records. Each record is 256 bytes. overall cost of the computation. As such, Respire is better-suited for applications with small to moderate batch sizes. 

# 5 Related Work 

Chor et al. [CGKS95] first introduced private information retrieval in the multi-server setting where the database is replicated across multiple non-colluding servers. The multi-server model allows lightweight information-theoretic constructions [BIKR02, BIK05, WY05, Yek07, Efr09, BIKO12] as well as highly-efficient constructions based on com-putational assumptions [GI14, BGI16, HH19]. While this model yields schemes with excellent concrete efficiency, the reliance on multiple non-colluding servers raises challenges for deployment. Our focus in this work is on the single-server setting. 

Single-server PIR. Starting from the seminal work of Kushilevitz and Ostrovsky [KO97], many works have con-structed single-server PIR from different number-theoretic assumptions [CMS99, Cha04, GR05, OI07, DGI +19, BV11, CGH +21, ALP +21, BCM22]. The most concretely-efficient schemes are those based on lattice assumptions [MBFK16, AS16, ACLS18, GH19, PT20, ALP +21, AYA +21, MCR21, MW22a, MR23, DPC23, HHC +23, LMRS24, MW24, dCLS24]. The recent lattice-based schemes can be partitioned into three broad categories: (1) schemes with a client-specific hint [AS16, ACLS18, GH19, PT20, ALP +21, AYA +21, MCR21, MW22a]; (2) schemes with a database-specific hint [DPC23, HHC +23]; and (3) hintless schemes [LMRS24, MW24, dCLS24]. In the first category, clients first upload a small public key (typically, a set of key-switching matrices) to the server. The server uses these parameters for both query expansion and response compression; as such, the communication requirements on these protocols is much smaller than their counterparts. Conversely, in schemes with a database-specific hint, clients first download a (large) database-dependent hint in an offline phase. These schemes support extremely high throughput (comparable to the memory-bandwidth of the system) and are the fastest constructions to date. However, the offline computation in these schemes are often high and moreover, clients will have to refresh their hints whenever the database changes. Recently, several works have shown how to eliminate the hint altogether with a modest cost in communication and throughput. However, these schemes still incur substantial communication overhead (due to the lack of support for query and response compression); see Section 4.2 and Table 1. Several works have also studied augmenting PIR with stronger security in the presence of malicious servers [WZ18, BKP22, CNC +23, DT24, dCL24]. 

Sublinear PIR. Several recent works [MSR23, GZS24, ZPSZ24] have shown how to construct single-server PIR schemes in the preprocessing model where in an offline phase, the client first streams the entire database (and precom-22 22 23 24 25 26 27 28

0

10 

20 

30 

40 

50 

60 

70 

80 

90 

Batch Size 

> Time (s)

Respire (256 MB) VBPIR (256 MB) 

Respire (1 GB) VBPIR (1 GB) 

Figure 7: Comparison of batched Respire and Vectorized BatchPIR (VBPIR) end-to-end execution times per query. We fix the size of each record to 256 bytes and the database size to be either 256 MB or 1 GB (indicated in the legend). putes an 𝑂 (√𝑁 )-size hint, where 𝑁 is the size of the database). Then in the online phase, the server can answer queries in sublinear time. More recently, Lin et al. [LMW23] showed how to construct doubly-efficient PIR [CHR17, BIPW17] from the RLWE assumption. In this model, the server first encodes the database in a way that allows it to answer queries in sublinear time; impressively, no communication is needed in the offline phase. Doubly-efficient PIR is a powerful primitive, but is still far from being concretely efficient [OPPW23]. 

# Acknowledgments 

We thank Steph Cheng for her help in an initial implementation of the Respire protocol. David J. Wu is supported in part by NSF CNS-2140975, CNS-2318701, a Microsoft Research Faculty Fellowship, a Google Research Scholar award, and a grant from Protocol Labs. 

# References 

[ABD +21] Roberto Avanzi, Joppe Bos, Léo Ducas, Eike Kiltz, Tancrède Lepoint, Vadim Lyubashevsky, John M. Schanck, Peter Schwabe, Gregor Seiler, and Damien Stehlé. CRYSTALS-kyber algorithm specifications and supporting documentation (version 3.02). NIST PQC Round , 2021. [ACC +18] Martin Albrecht, Melissa Chase, Hao Chen, Jintai Ding, Shafi Goldwasser, Sergey Gorbunov, Shai Halevi, Jeffrey Hoffstein, Kim Laine, Kristin Lauter, Satya Lokam, Daniele Micciancio, Dustin Moody, Travis Morrison, Amit Sahai, and Vinod Vaikuntanathan. Homomorphic encryption security standard. Technical report, HomomorphicEncryption.org, 2018. [ACLS18] Sebastian Angel, Hao Chen, Kim Laine, and Srinath T. V. Setty. PIR with compressed queries and amortized query processing. In IEEE S&P , 2018. [ALP +21] Asra Ali, Tancrède Lepoint, Sarvar Patel, Mariana Raykova, Phillipp Schoppmann, Karn Seth, and Kevin Yeo. Communication-computation trade-offs in PIR. In USENIX Security Symposium , 2021. [APS15a] Martin R. Albrecht, Rachel Player, and Sam Scott. On the concrete hardness of learning with errors. J. Math. Cryptol. , 9(3), 2015. 23 22 23 24 25 26 27 28

10 −3

10 −2

10 −1

10 0

10 1

10 2

Batch Size 

> Time (s)

Query Unpacking First Dimension 

Folding Response Compression 

Figure 8: Microbenchmarks for the batched Respire protocol as a function of the batch size. We consider a database with 220 records, each 256 bytes. [APS15b] Martin R. Albrecht, Rachel Player, and Sam Scott. On the concrete hardness of learning with errors, 2015. 

https://github.com/malb/lattice-estimator .[AS16] Sebastian Angel and Srinath T. V. Setty. Unobservable communication over fully untrusted infrastructure. In OSDI , 2016. [AYA +21] Ishtiyaque Ahmad, Yuntian Yang, Divyakant Agrawal, Amr El Abbadi, and Trinabh Gupta. Addra: Metadata-private voice communication over fully untrusted infrastructure. In OSDI , 2021. [BCM22] Elette Boyle, Geoffroy Couteau, and Pierre Meyer. Sublinear secure computation from new assumptions. In TCC , 2022. [Ber08] Daniel J. Bernstein. ChaCha, a variant of Salsa20. In Workshop record of SASC , volume 8, pages 3–5, 2008. [BGI16] Elette Boyle, Niv Gilboa, and Yuval Ishai. Function secret sharing: Improvements and extensions. In 

ACM CCS , 2016. [BGV12] Zvika Brakerski, Craig Gentry, and Vinod Vaikuntanathan. (Leveled) fully homomorphic encryption without bootstrapping. In ITCS , 2012. [BIK05] Amos Beimel, Yuval Ishai, and Eyal Kushilevitz. General constructions for information-theoretic private information retrieval. J. Comput. Syst. Sci. , 71(2), 2005. [BIKO12] Amos Beimel, Yuval Ishai, Eyal Kushilevitz, and Ilan Orlov. Share conversion and private information retrieval. In CCC , 2012. [BIKR02] Amos Beimel, Yuval Ishai, Eyal Kushilevitz, and Jean-François Raymond. Breaking the o(n1/(2k-1)) barrier for information-theoretic private information retrieval. In FOCS , 2002. [BIM00] Amos Beimel, Yuval Ishai, and Tal Malkin. Reducing the servers computation in private information retrieval: PIR with preprocessing. In CRYPTO , 2000. [BIPW17] Elette Boyle, Yuval Ishai, Rafael Pass, and Mary Wootters. Can we access a database both locally and privately? In TCC , 2017. 24 [BKP22] Shany Ben-David, Yael Tauman Kalai, and Omer Paneth. Verifiable private information retrieval. In 

TCC , 2022. [BKS +21] Fabian Boemer, Sejun Kim, Gelila Seifu, Fillipe D. M. de Souza, and Vinodh Gopal. Intel HEXL: accelerating homomorphic encryption with intel AVX512-IFMA52. In WAHC , 2021. [BPSY24] Alexander Bienstock, Sarvar Patel, Joon Young Seo, and Kevin Yeo. Batch PIR and labeled PSI with oblivious ciphertext compression. In USENIX Security , 2024. [Bra12] Zvika Brakerski. Fully homomorphic encryption without modulus switching from classical GapSVP. In CRYPTO , 2012. [BV11] Zvika Brakerski and Vinod Vaikuntanathan. Efficient fully homomorphic encryption from (standard) LWE. In FOCS , 2011. [CCR19] Hao Chen, Ilaria Chillotti, and Ling Ren. Onion ring ORAM: efficient constant bandwidth oblivious RAM from (leveled) TFHE. In ACM CCS , 2019. [CDKS21] Hao Chen, Wei Dai, Miran Kim, and Yongsoo Song. Efficient homomorphic conversion between (ring) LWE ciphertexts. In ACNS , 2021. [CGGI18] Ilaria Chillotti, Nicolas Gama, Mariya Georgieva, and Malika Izabachène. TFHE: fast fully homomorphic encryption over the torus. IACR Cryptol. ePrint Arch. , 2018. [CGGI20] Ilaria Chillotti, Nicolas Gama, Mariya Georgieva, and Malika Izabachène. TFHE: fast fully homomorphic encryption over the torus. J. Cryptol. , 33(1), 2020. [CGH +21] Melissa Chase, Sanjam Garg, Mohammad Hajiabadi, Jialin Li, and Peihan Miao. Amortizing rate-1 OT and applications to PIR and PSI. In TCC , 2021. [CGKS95] Benny Chor, Oded Goldreich, Eyal Kushilevitz, and Madhu Sudan. Private information retrieval. In FOCS ,1995. [Cha04] Yan-Cheng Chang. Single database private information retrieval with logarithmic communication. In 

ACISP , 2004. [CHR17] Ran Canetti, Justin Holmgren, and Silas Richelson. Towards doubly efficient private information retrieval. In TCC , 2017. [CKKS17] Jung Hee Cheon, Andrey Kim, Miran Kim, and Yong Soo Song. Homomorphic encryption for arithmetic of approximate numbers. In ASIACRYPT , 2017. [CMS99] Christian Cachin, Silvio Micali, and Markus Stadler. Computationally private information retrieval with polylogarithmic communication. In EUROCRYPT , 1999. [CNC +23] Simone Colombo, Kirill Nikitin, Henry Corrigan-Gibbs, David J. Wu, and Bryan Ford. Authenticated private information retrieval. In USENIX Security Symposium , 2023. [dCL24] Leo de Castro and Keewoo Lee. VeriSimplePIR: Verifiability in SimplePIR at no online cost for honest servers. USENIX Security Symposium , 2024. [dCLS24] Leo de Castro, Kevin Lewi, and Edward Suh. WhisPIR: Stateless private information retrieval with low communication. IACR Cryptol. ePrint Arch. , 2024. [DGI +19] Nico Döttling, Sanjam Garg, Yuval Ishai, Giulio Malavolta, Tamer Mour, and Rafail Ostrovsky. Trapdoor hash functions and their applications. In CRYPTO , 2019. [DPC23] Alex Davidson, Gonçalo Pestana, and Sofía Celi. FrodoPIR: Simple, scalable, single-server private information retrieval. Proc. Priv. Enhancing Technol. , 2023(1), 2023. 25 [DT24] Marian Dietz and Stefano Tessaro. Fully malicious authenticated PIR. In CRYPTO , 2024. [Efr09] Klim Efremenko. 3-query locally decodable codes of subexponential length. In STOC , 2009. [FV12] Junfeng Fan and Frederik Vercauteren. Somewhat practical fully homomorphic encryption. IACR Cryptol. ePrint Arch. , 2012. [GH19] Craig Gentry and Shai Halevi. Compressible FHE with applications to PIR. In TCC , 2019. [GHPS12] Craig Gentry, Shai Halevi, Chris Peikert, and Nigel P. Smart. Ring switching in BGV-style homomorphic encryption. In SCN , 2012. [GHS12a] Craig Gentry, Shai Halevi, and Nigel P. Smart. Fully homomorphic encryption with polylog overhead. In EUROCRYPT , 2012. [GHS12b] Craig Gentry, Shai Halevi, and Nigel P. Smart. Homomorphic evaluation of the AES circuit. In CRYPTO ,2012. [GI14] Niv Gilboa and Yuval Ishai. Distributed point functions and their applications. In EUROCRYPT , 2014. [GKL10] Jens Groth, Aggelos Kiayias, and Helger Lipmaa. Multi-query computationally-private information retrieval with constant communication rate. In PKC , 2010. [GR05] Craig Gentry and Zulfikar Ramzan. Single-database private information retrieval with constant communication rate. In ICALP , 2005. [GSW13] Craig Gentry, Amit Sahai, and Brent Waters. Homomorphic encryption from learning with errors: Conceptually-simpler, asymptotically-faster, attribute-based. In CRYPTO , 2013. [GZS24] Ashrujit Ghoshal, Mingxun Zhou, and Elaine Shi. Efficient pre-processing PIR without public-key cryptography. In EUROCRYPT , 2024. [HDCZ23] Alexandra Henzinger, Emma Dauterman, Henry Corrigan-Gibbs, and Nickolai Zeldovich. Private web search with Tiptoe. In SOSP , 2023. [Hen16] Ryan Henry. Polynomial batch codes for efficient IT-PIR. Proc. Priv. Enhancing Technol. , 2016(4), 2016. [HH19] Syed Mahbub Hafiz and Ryan Henry. A bit more than a bit is more than a bit better: Faster (essentially) optimal-rate many-server PIR. Proc. Priv. Enhancing Technol. , 2019(4), 2019. [HHC +23] Alexandra Henzinger, Matthew M. Hong, Henry Corrigan-Gibbs, Sarah Meiklejohn, and Vinod Vaikuntanathan. One server for the price of two: Simple and fast single-server private information retrieval. In USENIX Security Symposium , 2023. [IKOS04] Yuval Ishai, Eyal Kushilevitz, Rafail Ostrovsky, and Amit Sahai. Batch codes and their applications. In 

STOC , 2004. [KLDF16] Albert Kwon, David Lazar, Srinivas Devadas, and Bryan Ford. Riffle: An efficient communication system with strong anonymity. Proc. Priv. Enhancing Technol. , 2016(2), 2016. [KO97] Eyal Kushilevitz and Rafail Ostrovsky. Replication is NOT needed: SINGLE database, computationally-private information retrieval. In FOCS , 1997. [LG15] Wouter Lueks and Ian Goldberg. Sublinear scaling for multi-client private information retrieval. In 

Financial Cryptography and Data Security , 2015. [LLWR24] Jian Liu, Jingyu Li, Di Wu, and Kui Ren. PIRANA: Faster multi-query PIR via constant-weight codes. In IEEE S&P , 2024. 26 [LMPR08] Vadim Lyubashevsky, Daniele Micciancio, Chris Peikert, and Alon Rosen. SWIFFT: A modest proposal for FFT hashing. In Fast Software Encryption , 2008. [LMRS24] Baiyu Li, Daniele Micciancio, Mariana Raykova, and Mark Schultz. Hintless single-server private information retrieval. In CRYPTO , 2024. [LMW23] Wei-Kai Lin, Ethan Mook, and Daniel Wichs. Doubly efficient private information retrieval and fully homomorphic RAM computation from ring LWE. In STOC , 2023. [LN16] Patrick Longa and Michael Naehrig. Speeding up the number theoretic transform for faster ideal lattice-based cryptography. In CANS , 2016. [LPA +19] Lucy Li, Bijeeta Pal, Junade Ali, Nick Sullivan, Rahul Chatterjee, and Thomas Ristenpart. Protocols for checking compromised credentials. In ACM CCS , 2019. [LPR10] Vadim Lyubashevsky, Chris Peikert, and Oded Regev. On ideal lattices and learning with errors over rings. In EUROCRYPT , 2010. [MBFK16] Carlos Aguilar Melchor, Joris Barrier, Laurent Fousse, and Marc-Olivier Killijian. XPIR : Private information retrieval for everyone. Proc. Priv. Enhancing Technol. , 2016(2), 2016. [MCR21] Muhammad Haris Mughees, Hao Chen, and Ling Ren. Onionpir: Response efficient single-server PIR. In ACM CCS , 2021. [MOT +11] Prateek Mittal, Femi G. Olumofin, Carmela Troncoso, Nikita Borisov, and Ian Goldberg. Pir-tor: Scalable anonymous communication using private information retrieval. In USENIX Security Symposium , 2011. [MP12] Daniele Micciancio and Chris Peikert. Trapdoors for lattices: Simpler, tighter, faster, smaller. In 

EUROCRYPT , 2012. [MR23] Muhammad Haris Mughees and Ling Ren. Vectorized batch private information retrieval. In IEEE S&P , 2023. [MSR23] Muhammad Haris Mughees, I Sun, and Ling Ren. Simple and practical amortized sublinear private information retrieval. Cryptology ePrint Archive , 2023. [MW22a] Samir Jordan Menon and David J. Wu. SPIRAL: fast, high-rate single-server PIR via FHE composition. In IEEE S&P , 2022. [MW22b] Samir Jordan Menon and David J. Wu. SPIRAL: fast, high-rate single-server PIR via FHE composition. In IEEE S&P , 2022. Available at https://github.com/blyssprivacy/sdk/tree/c93fff0 .[MW24] Samir Jordan Menon and David J. Wu. YPIR: High-throughput single-server PIR with silent preprocessing. In USENIX Security Symposium , 2024. [OI07] Rafail Ostrovsky and William E. Skeith III. A survey of single-database private information retrieval: Techniques and applications. In PKC , 2007. [OPPW23] Hiroki Okada, Rachel Player, Simon Pohmann, and Christian Weinert. Towards practical doubly-efficient private information retrieval. IACR Cryptol. ePrint Arch. , 2023. [PR01] Rasmus Pagh and Flemming Friche Rodler. Cuckoo hashing. In ESA , 2001. [PT20] Jeongeun Park and Mehdi Tibouchi. SHECS-PIR: somewhat homomorphic encryption-based compact and scalable private information retrieval. In ESORICS , 2020. [Reg05] Oded Regev. On lattices, learning with errors, random linear codes, and cryptography. In STOC , 2005. 27 [TPY +19] Kurt Thomas, Jennifer Pullman, Kevin Yeo, Ananth Raghunathan, Patrick Gage Kelley, Luca Invernizzi, Borbala Benko, Tadek Pietraszek, Sarvar Patel, Dan Boneh, and Elie Bursztein. Protecting accounts from credential stuffing with password breach alerting. In USENIX Security Symposium , 2019. [WY05] David P. Woodruff and Sergey Yekhanin. A geometric approach to information-theoretic private information retrieval. In CCC , 2005. [WZ18] Xingfeng Wang and Liang Zhao. Verifiable single-server private information retrieval. In ICICS , 2018. [Yek07] Sergey Yekhanin. Towards 3-query locally decodable codes of subexponential length. In STOC , 2007. [Yeo23] Kevin Yeo. Cuckoo hashing in cryptography: Optimal parameters, robustness and applications. In 

CRYPTO , 2023. [ZPSZ24] Mingxun Zhou, Andrew Park, Elaine Shi, and Wenting Zheng. Piano: Extremely simple, single-server PIR with sublinear server computation. In IEEE S&P , 2024. 

# A Details on Lattice Algorithms 

In this section, we give a formal description and the noise analysis for the different lattice algorithms we use in the construction of Respire .

Terminology. Throughout, we say an algorithm is efficient if it runs in probabilistic polynomial time in the length of its input. We say a function is negligible (denoted negl (𝜆 )) if it is 𝑜 (𝜆 −𝑐 ) for all 𝑐 ∈ N. We say two families of distributions D1 and D2 are computationally indistinguishable if no efficient algorithm can distinguish them except with negligible probability. 

Discrete Gaussians. The Gaussian function with width parameter 𝜎 > 0 is the function 𝜌 𝜎 : R → R+ where 

𝜌 𝜎 (𝑥 ) = exp  −𝜋𝑥 2/𝜎 2. The discrete Gaussian distribution 𝐷 Z,𝜎 over Z of width 𝜎 is defined by the probability mass function 𝐷 Z,𝜎 (𝑥 ) = 𝜌 𝜎 (𝑥 )/ Í𝑦 ∈Z 𝜌 𝜎 (𝑦 ). We say that a random variable 𝑋 is subgaussian with parameter 𝜎 if for all 

𝑡 ≥ 0, Pr [| 𝑋 | ≥ 𝑡 ] ≤ 2 exp  −𝜋𝑡 2/𝜎 2. We refer to 𝜎 2 as the variance of the subgaussian distribution. If 𝑋 is sampled from a discrete Gaussian distribution with width 𝜎 , then it is subgaussian with parameter 𝜎 (and variance 𝜎 2). 5

If 𝑋 1, 𝑋 2 are independent subgaussian random variables with variances 𝜎 21 , 𝜎 22 , respectively, then for all 𝑐 1, 𝑐 2 ∈ R,

𝑐 1𝑋 1 + 𝑐 2𝑋 2 is subgaussian with variance 𝑐 21𝜎 21 + 𝑐 22𝜎 22 .

Polynomial rings. Throughout this section, we write 𝑅 𝑑 to denote the polynomial ring 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1), where 

𝑑 is a power of two. For a modulus 𝑞 , we write 𝑅 𝑑,𝑞 = Z𝑞 [𝑥 ]/( 𝑥 𝑑 + 1). For an element 𝑓 = Í𝑖 ∈ [ 𝑑 ] 𝛼 𝑖 𝑥 𝑖 −1 ∈ 𝑅 𝑑 , we write ∥𝑓 ∥∞ to denote the ℓ∞ norm of the coefficient vector [𝛼 1, . . . , 𝛼 𝑑 ]. When 𝑓 ∈ 𝑅 𝑑,𝑞 , we write ∥𝑓 ∥∞ to denote the ℓ∞ norm of the coefficient vector of 𝑓 where each coefficient is associated with its integer representative in the interval (− 𝑞 /2, 𝑞 /2]. Similarly, we write ∥𝑓 ∥2 to denote the ℓ2 norm of the coefficient vector of 𝑓 . For all polynomials 

𝑓 , 𝑔 ∈ 𝑅 𝑑 , it holds that ∥𝑓 𝑔 ∥∞ ≤ 𝑑 ∥𝑓 ∥∞ ∥𝑔 ∥∞. For a vector f = (𝑓 1, . . . , 𝑓 𝑡 ) ∈ 𝑅 𝑡 𝑑,𝑞 , we write ∥f ∥∞ to denote the ℓ∞

norm of the vector of the concatenation of the coefficient vectors of (𝑓 1, . . . , 𝑓 𝑡 ). We define ∥f ∥2 analogously. We define the discrete Gaussian distribution of width 𝜎 over 𝑅 𝑑 to be the distribution that samples each coefficient 𝛼 𝑖 

independently from 𝐷 Z,𝜎 and outputting 𝑓 = Í𝑖 ∈ [ 𝑑 ] 𝛼 𝑖 𝑥 𝑖 −1. We say 𝑓 is sampled from a subgaussian distribution with parameter 𝜎 if each coefficient of 𝑓 is sampled from a subgaussian distribution with parameter 𝜎 . We say a distribution D over 𝑅 𝑑 is 𝐵 -bounded if Pr [∥ 𝑟 ∥∞ ≤ 𝐵 : 𝑟 ← D] = 1. In our analysis, we use the following bound: 

Lemma A.1 (Subgaussian Polynomial Product) . Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1). Take any vector of polynomials g ∈ 𝑅 𝑡 𝑑 . Let 

f = (𝑓 1, . . . , 𝑓 𝑡 ) ∈ 𝑅 𝑡 𝑑 be a vector where the coefficients of each 𝑓 𝑖 is sampled independently from a subgaussian distribution with variance 𝜎 2. Then the distribution of each coefficient of fTg is subgaussian with parameter ∥g∥22 · 𝜎 2.                 

> 5In this context, 𝜎 is the width of the discrete Gaussian, and not its standard deviation. The standard deviation 𝑠 of the Gaussian distribution is related to the width parameter by the relation 𝑠 =𝜎 /√2𝜋 . Correspondingly, the “variance” of the Gaussian distribution (as defined in the usual sense by the relation E[ ( 𝑋 −E[𝑋 ] ) 2]) is 𝑠 2=𝜎 2/2𝜋 . In this work, we will always write variance to denote the square of the subgaussian width parameter.

28 Proof. We start with the case where 𝑡 = 1. Let 𝑓 = Í𝑖 ∈ [ 0,𝑑 −1] 𝑓 𝑖 𝑥 𝑖 and 𝑔 = Í𝑖 ∈ [ 0,𝑑 −1] 𝑔 𝑖 𝑥 𝑖 . Let ℎ = 𝑓 𝑔 = Í𝑖 ∈ [ 0,𝑑 −1 ℎ𝑖 𝑥 𝑖 ∈

𝑅 𝑑 . By definition, for all 𝑖 ∈ [ 0, 𝑑 − 1],

ℎ𝑖 =∑︁   

> 𝑗 ∈ [ 0,𝑑 −1]

(− 1)𝑐 𝑗 𝑓 𝑗 𝑔 𝑖 − 𝑗 mod 𝑑 ,

for some choice of 𝑐 𝑗 ∈ { 0, 1}. Since each 𝑓 𝑗 is independent and subgaussian with variance 𝜎 2, the distribution of ℎ𝑖 

is subgaussian with variance Í𝑗 ∈ [ 0,𝑑 −1] 𝑔 2 

> 𝑗

𝜎 2 = ∥𝑔 ∥22 · 𝜎 2. When 𝑡 > 1, fTg = Í𝑖 ∈ [ 𝑡 ] 𝑓 𝑖 𝑔 𝑖 . The coefficients of each 𝑓 𝑖 𝑔 𝑖 

is subgaussian with variance ∥𝑔 𝑖 ∥22 · 𝜎 2. Since each component is independent, the sum is subgaussian with variance 

Í𝑖 ∈ [ 𝑡 ] ∥𝑔 𝑖 ∥22𝜎 2 = ∥g∥22 · 𝜎 2. □

Independence heuristic. Similar to previous lattice-based PIR schemes based on polynomial rings [ACLS18, GH19, MCR21, MW22a, LMRS24, MW24], we rely on the independence heuristic [GHS12b, CGGI18, CGGI20] when analyzing the error accumulated during homomorphic computations. Under the independence heuristic, we model the (subgaussian) error terms arising in the homomorphic operations as being independent. Moreover, instead of bounding the absolute magnitude (i.e., the worst-case error), we analyze the variance of the subgaussian error distribution instead. Since the variance is additive for independent subgaussian random variables, bounding the variance yields a square-root improvement in the error analysis compared to the worst-case bound (when considering sums of subgaussian random variables). We stress that the use of the independence heuristic only impacts the correctness error in the protocol (and not the security of the protocol). Empirically, we observe that there is still slack between the magnitude of the error predicted based on our analysis (assuming the independence heuristic) and the actual measured noise magnitude. Thus, we believe that our estimates for the correctness error computed under the independence heuristic is still an overestimate of the actual correctness error. 

External product. We now recall the external product from [CGGI18, CGGI20]. We define the algorithm and state the correctness property below. Our presentation is adapted from that of [MW22a]: 

• Multiply (CGSW , cRLWE ): On input a GSW encoding CGSW ∈ 𝑅 2×𝑚 𝑑,𝑞 with decomposition base 𝑧 ∈ N and an RLWE encoding cRLWE ∈ 𝑅 2 

> 𝑑,𝑞

, output CGSW G−12,𝑧 (cRLWE ) ∈ 𝑅 2 

> 𝑑,𝑞

.

Theorem A.2 (External Product [CGGI18, CGGI20, adapted]) . Let s ∈ 𝑅 2 

> 𝑑,𝑞

be a secret key. Suppose CGSW ∈ 𝑅 2×𝑚 𝑑,𝑞 is a GSW encoding of a message 𝜇 ∈ { 0, 1} with respect to s, error eGSW ∈ 𝑅 𝑚 𝑑,𝑞 , and decomposition base 𝑧 . Suppose cRLWE ∈ 𝑅 2

> 𝑑,𝑞

is an RLWE encoding of a scalar 𝑣 ∈ 𝑅 𝑑,𝑞 with respect to the secret key s and error 𝑒 ∈ 𝑅 𝑑 . Let c ← Multiply (CGSW , cRLWE ).Then, c is an RLWE encoding of 𝜇𝑣 ∈ 𝑅 𝑑,𝑞 with respect to the secret key s and error 𝑒 = 𝜇𝑒 RLWE + eT

> GSW

G−12,𝑧 (cRLWE ) ∈ 𝑅 𝑑,𝑞 .

Homomorphic selection. We now define the homomorphic selection algorithm: 

• Select (CGSW , c0, c1) → c′: On input a GSW encoding CGSW ∈ 𝑅 2×𝑚 𝑑,𝑞 and RLWE encodings c0, c1 ∈ 𝑅 2 

> 𝑑,𝑞

, output 

c0 + Multiply (CGSW , c1 − c0).

Theorem A.3 (Homomorphic Selection) . Let s ∈ 𝑅 2 

> 𝑑,𝑞

be a secret key. Let c0, c1 be RLWE encodings of 𝜇 0, 𝜇 1 ∈ 𝑅 𝑑,𝑞 

with respect to the secret key s and errors 𝑒 0, 𝑒 1 ∈ 𝑅 𝑑 , respectively. Let CGSW be a GSW encoding of a bit 𝑏 ∈ { 0, 1} with respect to the secret key s and error e ∈ 𝑅 𝑚 𝑑,𝑞 . Suppose 𝑒 0, 𝑒 1 are subgaussian with variance 𝜎 2 

> RLWE

and the components of e are subgaussian with variance 𝜎 2

> GSW

. Let c′ ← Select (CGSW , c0, c1). Then c′ ∈ 𝑅 2 

> 𝑑,𝑞

is an RLWE encoding of 𝜇 𝑏 with respect to the secret key s and error 𝑒 ′. Moreover, 𝑒 ′ is subgaussian with variance 𝜎 2 ≤ 𝜎 2 

> RLWE

+ 𝑚𝑑𝑧 2𝜎 2

> GSW

/4.Proof. Let ˆc′ ← Multiply (CGSW , c1 − c0). By Theorem A.2, ˆc′ is an RLWE encoding of 𝑏 (𝜇 1 − 𝜇 0) with error 

ˆ𝑒 ′ = 𝜇 (𝑒 1 − 𝑒 0) + eT

> GSW

G−12,𝑧 (c1 − c0).

By the additively homomorphism of RLWE encodings, we conclude that c′ = c0 + ˆc′ is an RLWE encoding of 

𝜇 0 + 𝑏 (𝜇 1 − 𝜇 0) = 𝜇 𝑏 with error 𝑒 ′ = 𝑒 0 + ˆ𝑒 ′ = 𝑒 𝑏 + eT

> GSW

G−12,𝑧 (c1 − c0). Since ∥G−12,𝑧 (c1 − c0)∥ 22 ≤ 𝑚𝑑𝑧 2/4 and appealing to the independence heuristic, the variance 𝜎 2 of 𝑒 ′ satisfies the given bound. □

29 A.1 Coefficient Projection 

In this section, we describe how to homomorphically apply a coefficient projection to an encoded polynomial (i.e., instantiate the algorithms in Box 3). This is an adaptation of the procedure used in [ACLS18, CCR19, CDKS21] for query expansion and packing RLWE encodings. The construction relies on the ability to homomorphically evaluate automorphisms on RLWE encodings [BGV12, GHS12a]. 

Automorphisms over 𝑅 𝑑 . For a positive integer ℓ ∈ N, we write 𝜏 ℓ : 𝑅 𝑑 → 𝑅 𝑑 to denote the Frobenius automor-phism that maps 𝑓 (𝑥 ) ↦ → 𝑓 (𝑥 ℓ ). For a modulus 𝑞 ∈ N, we define the automorphism over 𝑅 𝑑,𝑞 in the same manner, and for ease of notation, write 𝜏 ℓ to denote both automorphisms. We extend 𝜏 ℓ to operate on vectors and matrices by component-wise evaluation. Previously, [BGV12, GHS12a] showed how to homomorphically apply automorphisms to RLWE encodings. We summarize the main algorithms here for the special case of scalar RLWE encodings (following the presentation from [MW22a, MW24]): 

Construction A.4 (Automorphisms on RLWE Encodings [GHS12a, BGV12, adapted]) . Let 𝜆 be a security parameter and 𝑑 = 𝑑 (𝜆 ), 𝑞 = 𝑞 (𝜆 ) be lattice parameters where 𝑑 = 2ℓ is a power of two. Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1) and 𝜒 = 𝜒 (𝜆 )

be an error distribution over 𝑅 𝑑 . The construction is also parameterized by a decomposition base 𝑧 ∈ N. We now define the following algorithms: 

• AutomorphSetup (1𝜆 , 𝑠, 𝜏 ): On input the security parameter 𝜆 , a secret key s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

, and an auto-morphism 𝜏 : 𝑅 𝑑,𝑞 → 𝑅 𝑑,𝑞 , first define 𝑡 = ⌊log 𝑧 𝑞 ⌋ + 1. Then, the setup algorithm samples a r

← 𝑅 𝑡 𝑑,𝑞 and 𝑒 ← 𝜒 𝑡 

and outputs a key-switching matrix 

W𝜏 =

 aT

𝑠 aT + eT − 𝜏 (𝑠 ) · gT

> 𝑧



∈ 𝑅 2×𝑡 𝑑,𝑞 . (A.1) 

• Automorph (W, c, 𝜏 ): On input the key-switching matrix W ∈ 𝑅 2×𝑡 𝑑,𝑞 , an RLWE encoding c = (𝑐 0, 𝑐 1) ∈ 𝑅 2 

> 𝑑,𝑞

, an automorphism 𝜏 : 𝑅 𝑑,𝑞 → 𝑅 𝑑,𝑞 , and a decomposition base 𝑧 ∈ N, the automorph algorithm outputs 

c′ = W · g−1 

> 𝑧

(𝜏 (𝑐 0)) + 

 0

𝜏 (𝑐 1)



∈ 𝑅 2 

> 𝑑,𝑞

. (A.2) 

Theorem A.5 (Homomorphic Evaluation of Automorphisms [GHS12a, BGV12, adapted]) . For a positive integer ℓ ∈ N,let 𝜏 ℓ : 𝑅 𝑑,𝑞 → 𝑅 𝑑,𝑞 be the automorphism 𝑝 (𝑥 ) ↦ → 𝑝 (𝑥 ℓ ) and 𝑧 ∈ N be a decomposition base. Let s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

be a secret key and c ∈ 𝑅 2 

> 𝑑,𝑞

be any encoding. Let W𝜏 ← AutomorphSetup (1𝜆 , 𝑠, 𝜏 ℓ ) and c′ ← Automorph (W𝜏 , c, 𝜏 ℓ ). Then, 

sTc′ = 𝜏 (sTc) + 𝑒 ′ where 𝑒 ′ is subgaussian with variance (𝜎 ′)2 ≤ 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4 and 𝑡 = ⌊log 𝑧 𝑞 ⌋ + 1.

Coefficient projections. Recall from Section 3.2 (Eq. (3.6)) that the coefficient projection map 𝜋 𝑗 : 𝑅 𝑑 → 𝑅 𝑑 takes as input a polynomial 𝑓 = Í𝑖 ∈ [ 0,𝑑 −1] 𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 and outputs Í𝑖 ∈ [ 0,𝑑 −1]:2 𝑗 |𝑖 𝑓 𝑖 𝑥 𝑖 . We define the homomorphic projection map in terms of automorphisms as follows: 

Lemma A.6 (Coefficient Projection using Automorphisms) . Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1) where 𝑑 = 2ℓ for some ℓ ∈ N.Define 𝜋 0 (𝑓 ) = 𝑓 . Then, for all 𝑗 ∈ [ ℓ],

• 2 · 𝜋 𝑗 (𝑓 ) = 𝜋 𝑗 −1 (𝑓 ) + 𝜏 𝑑 /2𝑗 −1+1 (𝜋 𝑗 −1 (𝑓 )) .

• 2 · 𝜋 𝑗 (𝑓 · 𝑥 −2𝑗 −1

) = 𝑥 −2𝑗 −1

·  𝜋 𝑗 −1 (𝑓 ) − 𝜏 𝑑 /2𝑗 −1+1 (𝜋 𝑗 −1 (𝑓 )) .Proof. Recall that 𝜏 ℓ : 𝑅 𝑑 → 𝑅 𝑑 is the automorphism that maps 𝑓 (𝑥 ) ↦ → 𝑓 (𝑥 ℓ ). Over the ring 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1),observe that for all 𝑗 ∈ [ 0, ℓ − 1] and all integers 𝑐 ∈ N,

𝜏 𝑑 /2𝑗 +1

 𝑥 𝑐 ·2𝑗  = 𝑥 𝑐𝑑 +𝑐 ·2𝑗 

= (𝑥 𝑑 )𝑐 · 𝑥 𝑐 ·2𝑗 

= (− 1)𝑐 · 𝑥 𝑐 ·2𝑗 

. (A.3) 30 Take any polynomial 𝑓 = Í𝑖 ∈ [ 0,𝑑 −1] 𝑓 𝑖 𝑥 𝑖 . By Eq. (A.3), we have for all 𝑗 ∈ [ ℓ],

𝜏 𝑑 /2𝑗 +1

 𝜋 𝑗 (𝑓 ) = 𝜏 𝑑 /2𝑗 +1

©«∑︁ 𝑖 ∈ [ 0,𝑑 −1]:2 𝑗 |𝑖 

𝑓 𝑖 𝑥 𝑖 ª®¬

= 𝜏 𝑑 /2𝑗 +1

©«∑︁ 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

𝑓 𝑐 ·2𝑗 𝑥 𝑐 ·2𝑗 ª®¬

=∑︁   

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

(− 1)𝑐 · 𝑓 𝑐 ·2𝑗 𝑥 𝑐 ·2𝑗 

.

We now consider each of the properties: 

• For the first property, we have 

𝜋 𝑗 −1 (𝑓 ) + 𝜏 𝑑 /2𝑗 −1+1

 𝜋 𝑗 −1 (𝑓 ) =∑︁    

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1−1]

𝑓 𝑐 ·2𝑗 −1 · 𝑥 𝑐 ·2𝑗 −1

+∑︁    

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1−1]

(− 1)𝑐 · 𝑓 𝑐 ·2𝑗 −1 · 𝑥 𝑐 ·2𝑗 −1

=∑︁    

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1−1]:2 |𝑐

2𝑓 𝑐 ·2𝑗 −1 · 𝑥 𝑐 ·2𝑗 −1

= 2 · 𝜋 𝑗 (𝑓 ).

• The second property follows by a similar calculation: 

𝜋 𝑗 −1 (𝑓 ) − 𝜏 𝑑 /2𝑗 −1+1

 𝜋 𝑗 −1 (𝑓 ) =∑︁    

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1−1]

𝑓 𝑐 ·2𝑗 −1 · 𝑥 𝑐 ·2𝑗 −1

−∑︁    

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1−1]

(− 1)𝑐 · 𝑓 𝑐 ·2𝑗 −1 · 𝑥 𝑐 ·2𝑗 −1

=∑︁   

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

2𝑓 (2𝑐 +1) · 2𝑗 −1 · 𝑥 (2𝑐 +1) · 2𝑗 −1

.

Thus, 

𝑥 −2𝑗 −1

·  𝜋 𝑗 −1 (𝑓 ) − 𝜏 𝑑 /2𝑗 −1+1 (𝜋 𝑗 −1 (𝑓 ))  =∑︁   

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

2𝑓 (2𝑐 +1) · 2𝑗 −1 · 𝑥 𝑐 ·2𝑗 

.

Finally, 

2 · 𝜋 𝑗 

 𝑓 · 𝑥 −2𝑗 −1  =∑︁   

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

2𝑓 𝑐 ·2𝑗 +2𝑗 −1 · 𝑥 𝑐 ·2𝑗 

=∑︁   

> 𝑐 ∈ [ 0,𝑑 /2𝑗 −1]

2𝑓 (2𝑐 +1) · 2𝑗 −1 · 𝑥 𝑐 ·2𝑗 

= 𝑥 −2𝑗 −1

·  𝜋 𝑗 −1 (𝑓 ) − 𝜏 𝑑 /2𝑗 −1+1 (𝜋 𝑗 −1 (𝑓 )) ,

as required. □

Evaluating coefficient projections on RLWE encodings. We now describe the (ProjectSetup , Project ) algo-rithms from Box 3. The construction and analysis are similar to the algorithms from [ACLS18, CCR19, CDKS21]. 

Construction A.7 (Coefficient Projection on RLWE Encodings) . Let 𝜆 be a security parameter and 𝑑 = 𝑑 (𝜆 ), 𝑞 = 𝑞 (𝜆 )

be lattice parameters where 𝑑 = 2ℓ is a power of two. Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 +1) and 𝜒 = 𝜒 (𝜆 ) be an error distribution over 

𝑅 𝑑 . We require that the modulus 𝑞 satisfy 𝑞 = 1 mod 2. The construction is also parameterized by a decomposition base 

𝑧 ∈ N. The construction relies on the (AutomorphSetup , Automorph ) algorithms from Construction A.4 instantiated with the same lattice parameters (𝑑, 𝑞, 𝜒 ) and decomposition base 𝑧 . We define the algorithms (ProjectSetup , Project )

as follows: 

• ProjectSetup (1𝜆 , s): On input the security parameter 𝜆 and the secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, the setup algorithm starts by sampling W𝑗 ← AutomorphSetup (1𝜆 , s, 𝜏 𝑑 /2𝑗 +1) for each 𝑗 ∈ [ 0, ℓ − 1]. It outputs the projection key 

pp proj = (W0, . . . , Wℓ −1).

• Project (pp proj , c, 𝑗 ): On input a projection key pp proj = (W0, . . . , Wℓ −1), an RLWE encoding c ∈ 𝑅 2 

> 𝑑,𝑞

and an index 𝑗 ∈ [ 0, ℓ ], the projection algorithm proceeds as follows: 

– Compute c0 = 2− 𝑗 · c ∈ 𝑅 2 

> 𝑑,𝑞

. Note that 𝑞 = 1 mod 2 so 2 is invertible modulo 𝑞 .31 – For each 𝑖 ∈ [ 𝑗 ], compute c𝑖 = c𝑖 −1 + Automorph (W𝑖 −1, c𝑖 −1, 𝜏 𝑑 /2𝑖 −1+1).At the end of the process, output c𝑗 .

Theorem A.8 (Coefficient Projection on RLWE Encodings) . Let 𝜆 be a security parameter and 𝑑, ℓ, 𝑞, 𝜒, 𝑧 be the parame-ters in Construction A.7. Suppose 𝜒 is subgaussian with variance 𝜎 2 

> 𝜒

. Let s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

be a secret key and c ∈ 𝑅 2 

> 𝑑,𝑞

be any encoding. Take any 𝑗 ∈ [ ℓ]. Let pp proj ← ProjectSetup (1𝜆 , s) and c′ ← Project (pp proj , c, 𝑗 ). Then sTc′ = 𝜋 𝑗 (sTc) + 𝑒 ′

and under the independence heuristic, 𝑒 ′ is subgaussian with variance (𝜎 ′)2 = (4𝑗 − 1)/ 12 · 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

and 𝑡 = ⌊log 𝑧 𝑞 ⌋ + 1.Proof. Let pp proj ← ProjectSetup (1𝜆 , s). Then pp proj = (W0, . . . , Wℓ −1) where W𝑗 ← AutomorphSetup (1𝜆 , s, 𝜏 𝑑 /2𝑗 +1).Let c0, . . . , c𝑗 be the encodings constructed by Project (pp proj , c, 𝑗 ). We now show that for all 𝑖 ∈ [ 0, 𝑗 ],

sTc𝑖 = 2− 𝑗 +𝑖 𝜋 𝑖 (sTc) + 𝑒 𝑖 ,

where 𝑒 0 = 0 and 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑖

= Í𝑘 ∈ [ 𝑖 ] 4𝑘 −1𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4. We proceed by induction on 𝑖 :

• Suppose 𝑖 = 0. By definition, c0 = 2− 𝑗 · c and the claim holds (since 𝜋 0 (𝑟 ) = 𝑟 for all 𝑟 ∈ 𝑅 𝑑 ). 

• For the inductive step, let c′ 

> 𝑖

= Automorph (W𝑖 , c𝑖 , 𝜏 𝑑 /2𝑖 +1). By Theorem A.5 and the inductive hypothesis, 

sTc′ 

> 𝑖

= 𝜏 𝑑 /2𝑖 +1 (sTc𝑖 ) + ˜𝑒 𝑖 +1 = 𝜏 𝑑 /2𝑖 +1

 2− 𝑗 +𝑖 𝜋 𝑖 (sTc) + 𝑒 𝑖 

 + ˜𝑒 𝑖 +1,

where ˜𝑒 𝑖 +1 is subgaussian with variance 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4. Since c𝑖 +1 = c𝑖 + c′ 

> 𝑖

, and appealing to Lemma A.6, we have 

sTc𝑖 +1 = 2− 𝑗 +𝑖  𝜋 𝑖 (sTc) + 𝜏 𝑑 /2𝑖 +1 (𝜋 𝑖 (sTc))  + 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1

= 2− 𝑗 +𝑖 +1𝜋 𝑖 +1 (sTc) + 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1.

Let 𝑒 𝑖 +1 B 𝑒 𝑖 +𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 )+ ˜𝑒 𝑖 +1. Since 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑖

and appealing to the independence heuris-tic (to argue that the key-switching error ˜𝑒 𝑖 +1 is independent of 𝑒 𝑖 ), we have that 𝑒 𝑖 +1 is subgaussian with variance 

𝜎 2 

> 𝑖 +1

= 4𝜎 2 

> 𝑖

+ 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4 = 4 ·∑︁   

> 𝑘 ∈ [ 𝑖 −1]

4𝑘 −1𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4 + 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4 =∑︁   

> 𝑘 ∈ [ 𝑖 ]

4𝑘 −1𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4.

Finally, the claim follows since 𝑒 ′ = 𝑒 𝑗 which has variance 

(𝜎 ′)2 = 𝜎 2 

> 𝑗

= 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4 ·∑︁    

> 𝑘 ∈ [ 𝑗 ]

4𝑘 −1 = 4𝑗 − 112 𝑡𝑑𝑧 2𝜎 2 

> 𝜒

. □

## A.2 Subring Embeddings and Dimension Reduction 

In this section, we formally define the subring embedding (Eq. (3.1)) and dimension reduction (Eq. (3.2)) mappings from Section 3. We then show some basic algebraic properties on these functions that will be useful in the subsequent analysis. 

Definition A.9 (Subring Embedding and Dimension Reduction) . Let 𝑅 𝑑 1 = Z[𝑥 ]/( 𝑥 𝑑 1 + 1) and 𝑅 𝑑 2 = Z[𝑥 ]/( 𝑥 𝑑 2 + 1)

where 𝑑 2 divides 𝑑 1. Define the embedding function 𝜅 𝑑 1,𝑑 2 : 𝑅 𝑑 2 → 𝑅 𝑑 1 to be the mapping ∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 2 ↦ →∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑓 𝑖 𝑥 𝑖 ·𝑑 1/𝑑 2 ∈ 𝑅 𝑑 1 . (A.4) We also define the dimension-reduction mapping 𝜅 −1 

> 𝑑 1,𝑑 2

: 𝑅 𝑑 1 → 𝑅 𝑑 2 to be the mapping ∑︁   

> 𝑖 ∈ [ 0,𝑑 1−1]

𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 2 ↦ →∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑓 𝑖 ·𝑑 1/𝑑 2 𝑥 𝑖 ∈ 𝑅 𝑑 1 . (A.5) When the dimensions 𝑑 1, 𝑑 2 are clear from context, we simply write 𝜅 and 𝜅 −1 to denote 𝜅 𝑑 1,𝑑 2 and 𝜅 −1 

> 𝑑 1,𝑑 2

, respectively. We extend 𝜅, 𝜅 −1 to operate on vectors and matrices in a component-wise manner. For a modulus 𝑞 ∈ N, we define 

𝜅 : 𝑅 𝑑 2,𝑞 → 𝑅 𝑑 1,𝑞 and 𝜅 −1 : 𝑅 𝑑 1,𝑞 → 𝑅 𝑑 2,𝑞 in an analogous manner. 32 Lemma A.10 (Subring Embedding) . Let 𝑅 𝑑 1 = Z[𝑥 ]/( 𝑥 𝑑 1 +1) and 𝑅 𝑑 2 = Z[𝑥 ]/( 𝑥 𝑑 2 +1) where 𝑑 2 divides 𝑑 1. Let 𝜅 : 𝑅 𝑑 2 →

𝑅 𝑑 1 and 𝜅 −1 : 𝑅 𝑑 1 → 𝑅 𝑑 2 be the subring embedding and dimension reduction functions from Definition A.9, respectively. Then 𝜅 is an injective ring homomorphism (i.e., an embedding function). Specifically, the following properties hold: 

• One-sided inverse: For all 𝑟 ∈ 𝑅 𝑑 2 , it holds that 𝜅 −1 (𝜅 (𝑟 )) = 𝑟 . In particular, 𝜅 is injective. 

• Linearity: For all 𝛼, 𝛽 ∈ Z and 𝑟, 𝑠 ∈ 𝑅 𝑑 2 , 𝜅 (𝛼𝑟 + 𝛽𝑠 ) = 𝛼𝜅 (𝑟 ) + 𝛽𝜅 (𝑠 ).

• Multiplicative homomorphism: For all 𝑟, 𝑠 ∈ 𝑅 𝑑 2 , 𝜅 (𝑟𝑠 ) = 𝜅 (𝑟 )𝜅 (𝑠 ).

• Scaling by rationals: For 𝛼 ∈ Q and 𝑟 ∈ 𝑅 𝑑 2 , 𝜅 (⌊ 𝛼𝑟 ⌉) = ⌊𝛼𝜅 (𝑟 )⌉ , where the multiplication and rounding operations are performed over the rationals. Proof. The one-sided inverse, linearity, and scaling-by-rationals properties of 𝜅 follow immediately from the definition of 𝜅 (Eq. (A.4)). It suffices to show the multiplicative property. We first show that this hold for products of monomials. The claim then follows by linearity. Take any 𝑖, 𝑗 ∈ [ 0, 𝑑 2 − 1]. Let 𝑐 = 0 if 𝑖 + 𝑗 < 𝑑 2 and 𝑐 = 1 if 𝑖 + 𝑗 ≥ 𝑑 2. Then, 

𝜅  𝑥 𝑖 𝑥 𝑗  = 𝜅  (− 1)𝑐 𝑥 𝑖 +𝑗 mod 𝑑 2  = (− 1)𝑐 𝑥 (𝑖 +𝑗 mod 𝑑 2 ) · 𝑑 1/𝑑 2 ∈ 𝑅 𝑑 1 .

Similarly, 

𝜅 (𝑥 𝑖 ) · 𝜅 (𝑥 𝑗 ) = 𝑥 𝑖 ·𝑑 1/𝑑 2 𝑥 𝑗 ·𝑑 1/𝑑 2 = (− 1)𝑐 𝑥 (𝑖 +𝑗 mod 𝑑 2 ) · 𝑑 1/𝑑 2 = 𝜅  𝑥 𝑖 𝑥 𝑗 . (A.6) Next, take any 𝑠 = Í𝑗 ∈ [ 0,𝑑 −1] 𝑠 𝑗 𝑥 𝑗 where 𝑠 𝑗 ∈ Z. By linearity and Eq. (A.6), we have 

𝜅  𝑥 𝑖 𝑠  = 𝜅 ©«∑︁ 𝑗 ∈ [ 0,𝑑 −1]

𝑠 𝑗 𝑥 𝑖 𝑥 𝑗 ª®¬

=∑︁   

> 𝑗 ∈ [ 0,𝑑 −1]

𝑠 𝑗 𝜅 (𝑥 𝑖 )𝜅 (𝑥 𝑗 ) = 𝜅 (𝑥 𝑖 )∑︁   

> 𝑗 ∈ [ 0,𝑑 −1]

𝜅 (𝑠 𝑗 𝑥 𝑗 ) = 𝜅 (𝑥 𝑖 )𝜅 (𝑠 ).

Finally, let 𝑟 = Í𝑗 ∈ [ 0,𝑑 −1] 𝑟 𝑗 𝑥 𝑗 where 𝑟 𝑗 ∈ Z. Again by linearity, we have 

𝜅 (𝑟𝑠 ) =∑︁   

> 𝑗 ∈ [ 0,𝑑 −1]

𝜅 (𝑟 𝑗 𝑥 𝑗 𝑠 ) =∑︁   

> 𝑗 ∈ [ 0,𝑑 −1]

𝜅 (𝑟 𝑗 𝑥 𝑗 )𝜅 (𝑠 ) = 𝜅 (𝑟 ) · 𝜅 (𝑠 ). □

Lemma A.11 (Subring Projection) . Suppose 𝑑 1 = 2𝛿 1 and 𝑑 2 = 2𝛿 2 for non-negative integers 𝑑 1 ≥ 𝑑 2. Let 𝑅 𝑑 1 =

Z[𝑥 ]/( 𝑥 𝑑 1 + 1) and 𝑅 𝑑 2 = Z[𝑥 ]/( 𝑥 𝑑 2 + 1) where 𝑑 2 divides 𝑑 1. Let 𝜈 = 𝛿 1 − 𝛿 2 and 𝜋 𝜈 : 𝑅 𝑑 1 → 𝑅 𝑑 1 be the coefficient projection map from Eq. (3.6) . Let 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 and 𝜅 −1 : 𝑅 𝑑 1 → 𝑅 𝑑 2 be the subring embedding and dimension reduction mappings from Definition A.9. Then for all 𝑟 ∈ 𝑅 𝑑 1 , it follows that 

𝜋 𝜈 (𝑟 ) = 𝜅 (𝜅 −1 (𝑟 )) 

Moreover, the projection mapping 𝜋 𝜈 satisfies the following properties: 

• Linearity: For all 𝑟, 𝑠 ∈ 𝑅 𝑑 1 , it holds that 𝜋 𝜈 (𝑟 + 𝑠 ) = 𝜋 𝜈 (𝑟 ) + 𝜋 𝜈 (𝑠 ).

• Projection: For all 𝑟 ∈ 𝑅 𝑑 2 , 𝜋 𝜈 (𝜅 (𝑟 )) = 𝜅 (𝑟 ). In particular, this means that for all 𝑟 ∈ 𝑅 𝑑 1 , 𝜋 𝜈 (𝜋 𝜈 (𝑟 )) = 𝜋 𝜈 (𝑟 ).In addition, for all 𝑟 ∈ 𝑅 𝑑 2 and 𝑠 ∈ 𝑅 𝑑 1 , it holds that 𝜋 𝜈 (𝜅 (𝑟 )𝑠 ) = 𝜅 (𝑟 )𝜋 𝜈 (𝑠 ).

• Scaling by rationals: For 𝛼 ∈ Q and 𝑟 ∈ 𝑅 𝑑 1 , 𝜋 𝜈 (⌊ 𝛼𝑟 ⌉) = ⌊𝛼𝜋 𝜈 (𝑟 )⌉ where the multiplication and rounding are performed over the rationals. Proof. We first show that 𝜋 𝜈 (𝑟 ) = 𝜅 (𝜅 −1 (𝑟 )) . Take any 𝑟 = Í𝑖 ∈ [ 0,𝑑 1 −1] 𝑟 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 1 . Then, 

𝜅 (𝜅 −1 (𝑟 )) = 𝜅 ©«∑︁ 𝑖 ∈ [ 0,𝑑 2 −1]

𝑟 𝑖 · ( 𝑑 1/𝑑 2 ) 𝑥 𝑖 ª®¬

=∑︁   

> 𝑖 ∈ [ 0,𝑑 2−1]

𝑟 𝑖 · ( 𝑑 1/𝑑 2 ) 𝑥 𝑖 · ( 𝑑 1/𝑑 2 ) =∑︁    

> 𝑖 ∈ [ 0,𝑑 1−1]:2 𝜈 |𝑖

𝑟 𝑖 𝑥 𝑖 = 𝜋 𝜈 (𝑖 ),

33 since 2𝜈 = 2𝛿 1 −𝛿 2 = 𝑑 1/𝑑 2. Linearity of 𝜋 𝜈 and the scaling-by-rationals property now follow by the corresponding properties of 𝜅 (Lemma A.10) and the same properties of 𝜅 −1 (immediate from the definition). It suffices to show that 

𝜋 𝜈 satisfies the projection property. First, take any 𝑟 ∈ 𝑅 𝑑 2 . Since 𝜅 −1 (𝜅 (𝑟 )) = 𝑟 , we have 

𝜋 𝜈 (𝜅 (𝑟 )) = 𝜅 (𝜅 −1 (𝜅 (𝑟 ))) = 𝜅 (𝑟 ).

For the additional property, take 𝑟 ∈ 𝑅 𝑑 2 and 𝑠 ∈ 𝑅 𝑑 1 . We start by showing that 𝜅 −1 (𝜅 (𝑟 )𝑠 ) = 𝑟𝜅 −1 (𝑠 ). Since this equation is linear in both 𝑟 and 𝑠 , it suffices to prove the case where 𝑟 = 𝑥 𝑖 and 𝑠 = 𝑥 𝑗 are monomials (and then appeal to linearity of 𝜅 −1). Indeed, 

𝜅 −1 (𝜅 (𝑟 )𝑠 ) = 𝜅 −1  𝑥 𝜈𝑖 +𝑗  =

(

𝑥 𝑖 +𝑗 /𝜈 if 𝜈 | 𝑗 

0 otherwise =

(

𝑟 · 𝑥 𝑗 /𝜈 if 𝜈 | 𝑗 

0 otherwise = 𝑟𝜅 −1 (𝑠 ).

Since 𝜅 −1 (𝜅 (𝑟 )𝑠 ) = 𝑟𝜅 −1 (𝑠 ), we have that 

𝜅 (𝜅 −1 (𝜅 (𝑟 )𝑠 )) = 𝜅 (𝑟𝜅 −1 (𝑠 )) .

Using the fact that 𝜋 𝜈 (𝑟 ) = 𝜅 (𝜅 −1 (𝑟 )) and linearity of 𝜅 , we conclude that 

𝜋 𝜈 (𝜅 (𝑟 )𝑠 ) = 𝜅 (𝑟𝜅 −1 (𝑠 )) = 𝜅 (𝑟 )𝜅 (𝜅 −1 (𝑠 )) = 𝜅 (𝑟 )𝜋 𝜈 (𝑠 ). □

Ring packing. We now recall the definition of ring packing from Eq. (3.3). Here, we model the inputs as (arbitrary) ring elements (rather than database records). 

Definition A.12 (Ring Packing) . Suppose 𝑑 1 ≥ 𝑑 2 where 𝑑 2 divides 𝑑 1. Let 𝑅 𝑑 1 = Z[𝑥 ]/( 𝑥 𝑑 1 + 1) and 𝑅 𝑑 2 =

Z[𝑥 ]/( 𝑥 𝑑 2 +1). Let 𝑘 = 𝑑 1/𝑑 2 and suppose 𝑟 0, . . . , 𝑟 𝑘 −1 ∈ 𝑅 𝑑 2 . Then we define the ring packing function Π : 𝑅 𝑘 𝑑 2 → 𝑅 𝑑 1 as 

Π(𝑟 0, . . . , 𝑟 𝑘 −1) B∑︁   

> 𝑖 ∈ [ 0,𝑘 −1]

𝑥 𝑖 · 𝜅 (𝑟 𝑖 ),

where 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 is the subring embedding function from Definition A.9. 

Lemma A.13 (Ring Packing Extraction) . With the notation of Definition A.12, we have 

𝜅 −1 (𝑥 −𝑡 · Π(𝑟 0, . . . , 𝑟 𝑘 −1)) = 𝑟 𝑡 

for any 𝑟 0, . . . , 𝑟 𝑘 −1 ∈ 𝑅 𝑑 2 and 𝑡 ∈ [ 0, 𝑘 − 1].Proof. For 𝑖 ∈ [ 0, 𝑘 − 1], let 𝑟 𝑖 = Í𝑗 ∈ [ 0,𝑑 2 −1] 𝑥 𝑗 𝑟 𝑖,𝑗 ∈ 𝑅 𝑑 2 where each 𝑟 𝑖,𝑗 ∈ Z. Then, we can write 

Π(𝑟 0, . . . , 𝑟 𝑘 −1) =∑︁   

> 𝑖 ∈ [ 0,𝑘 −1]

𝑥 𝑖 𝜅 (𝑟 𝑖 ) =∑︁   

> 𝑖 ∈ [ 0,𝑘 −1]

∑︁ 𝑗 ∈ [ 0,𝑑 2 −1]

𝑟 𝑖,𝑗 𝑥 𝑖 +𝑘 𝑗 =∑︁   

> 𝑖 ∈ [ 0,𝑑 1−1]

𝑥 𝑖 𝑟 𝑖 mod 𝑘, ⌊𝑖 /𝑘 ⌋ .

Let 𝑠 = 𝑥 −𝑡 · Π(𝑟 0, . . . , 𝑟 𝑘 −1) and write 𝑠 = Í𝑖 ∈ [ 0,𝑑 1 −1] 𝑠 𝑖 . Then we have 

𝑥 −𝑡 · Π(𝑟 0, . . . , 𝑟 𝑘 −1) =∑︁   

> 𝑖 ∈ [ 0,𝑑 1−1]

𝑥 𝑖 −𝑡 𝑟 𝑖 mod 𝑘, ⌊𝑖 /𝑘 ⌋ =∑︁   

> 𝑖 ∈ [ 0,𝑑 1−1]

𝑥 𝑖 𝑠 𝑖 .

In particular, this means 𝑠 𝑖 = 𝑟 𝑖 +𝑡 mod 𝑘, ⌊ ( 𝑖 +𝑡 )/ 𝑘 ⌋ . Since 𝑡 ∈ [ 0, 𝑘 − 1], we have 

𝜅 −1 (𝑠 ) =∑︁   

> 𝑗 ∈ [ 0,𝑑 2−1]

𝑥 𝑗 𝑠 𝑘 𝑗 =∑︁   

> 𝑗 ∈ [ 0,𝑑 2−1]

𝑥 𝑗 𝑟 𝑡,𝑗 = 𝑟 𝑡 . □

34 Repacking. Finally, to analyze the repacking step in the batch version of Respire (Construction 3.3 and Ap-pendix D.1), we will rely on the following lemma: 

Lemma A.14 (Repacking) . Suppose 𝑑 1 ≥ 𝑑 2 ≥ 𝑑 3 are powers of two, and let 𝑅 𝑑 1 = Z[𝑥 ]/( 𝑥 𝑑 1 + 1), 𝑅 𝑑 2 = Z[𝑥 ]/( 𝑥 𝑑 2 + 1),and 𝑅 𝑑 3 = Z[𝑥 ]/( 𝑥 𝑑 3 + 1). Then for any 𝑟 0, . . . , 𝑟 𝑑 2/𝑑 3 −1 ∈ 𝑅 𝑑 3 ,∑︁   

> 𝑖 ∈ [ 0,𝑑 2/𝑑 3−1]

𝑥 𝑖 · ( 𝑑 1/𝑑 2 )𝜅 𝑑 1,𝑑 3 (𝑟 𝑖 ) = 𝜅 𝑑 1,𝑑 2

 Π(𝑟 0, . . . , 𝑟 𝑑 2/𝑑 3 −1),

where 𝜅 𝑑 1,𝑑 3 : 𝑅 𝑑 3 → 𝑅 𝑑 1 and 𝜅 𝑑 1,𝑑 2 : 𝑅 𝑑 2 → 𝑅 𝑑 1 are the subring embedding functions (Definition A.9) and Π : 𝑅 𝑑 2/𝑑 3 

> 𝑑 3

→ 𝑅 𝑑 2

is the ring packing function (Definition A.12). Proof. Let 𝜅 𝑑 2,𝑑 3 : 𝑅 𝑑 3 → 𝑅 𝑑 2 be the subring embedding function from 𝑅 𝑑 3 to 𝑅 𝑑 2 . By construction, for all 𝑟 =Í𝑖 ∈ [ 0,𝑑 3 −1] 𝑟 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 3 , it follows that 

𝜅 𝑑 1,𝑑 3 (𝑟 ) =∑︁   

> 𝑖 ∈ [ 0,𝑑 3−1]

𝑟 𝑖 𝑥 𝑖 · ( 𝑑 1/𝑑 3 ) =∑︁   

> 𝑖 ∈ [ 0,𝑑 3−1]

𝑟 𝑖 𝑥 𝑖 · ( 𝑑 1/𝑑 2 ) ( 𝑑 2/𝑑 1 ) = 𝜅 𝑑 1,𝑑 2 (𝜅 𝑑 2,𝑑 3 (𝑟 )) . (A.7) Now, take any 𝑟 0, . . . , 𝑟 𝑑 2/𝑑 3 −1 ∈ 𝑅 𝑑 3 . Then, ∑︁   

> 𝑖 ∈ [ 0,𝑑 2/𝑑 3−1]

𝑥 𝑖 · ( 𝑑 1/𝑑 2 )𝜅 𝑑 1,𝑑 3 (𝑟 𝑖 ) =∑︁   

> 𝑖 ∈ [ 0,𝑑 2/𝑑 3−1]

𝜅 𝑑 1,𝑑 2 (𝑥 𝑖 ) · 𝜅 𝑑 1,𝑑 2 (𝜅 𝑑 2,𝑑 3 (𝑟 𝑖 )) by Eq. (A.7) 

= 𝜅 𝑑 1,𝑑 2

©«∑︁ 𝑖 ∈ [ 0,𝑑 2/𝑑 3 −1]

𝑥 𝑖 · 𝜅 𝑑 2,𝑑 3 (𝑟 𝑖 )ª®¬

by Lemma A.10 

= 𝜅 𝑑 1,𝑑 2

 Π(𝑟 0, . . . , 𝑟 𝑑 2/𝑑 3 −1). by Definition A.12 . □

# B Query Compression 

In this section, we give the formal description of the query packing algorithm used in Respire (i.e., the algorithms in Box 2). The approach we take is a combination of the corresponding procedures in [ACLS18, CCR19] (for packing multiple scalar RLWE encodings into a single RLWE encoding) and in [CCR19, MW22a] (for packing GSW encodings into RLWE encodings). 

Coefficient packing. We start by describing the coefficient packing procedure adapted from [ACLS18, CCR19]. As a high level, the coefficient packing procedure from [ACLS18, CCR19] takes an RLWE encoding of a polynomial 

𝑓 = Í𝑖 ∈ [ 0,𝑑 ] 𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑,𝑞 and expands it into 𝑑 RLWE encodings of its coefficients 𝑓 0, . . . , 𝑓 𝑑 −1 ∈ Z𝑞 . Our construction incorporates the dimension-reduction approach described in Section 3 to further reduce the query size. Specifically, if we only need to pack ℎ values into a single RLWE encoding, we would embed the ℎ values into the coefficients of a polynomial that lives in a subring of 𝑅 𝑑,𝑞 . The size of the packed encoding then scales with ℎ (rather than the ring dimension 𝑑 ). In exchange for the shorter queries, our approach increases the noise by a modest amount (the variance is higher by a factor of (𝑑 /ℎ)2) and a small increase in the size of the public parameters (i.e., we need to communicate log 𝑑 key-switching matrices as opposed to log ℎ key-switching matrices). Practically speaking, the public parameter size difference is not significant (at most 22% for the scenarios considered in Section 4). However, the additional noise growth does introduce some challenges to ensure correctness. To compensate, we have to choose a smaller plaintext modulus (e.g. 𝑝 = 16 instead of the 𝑝 = 256 used in the Spiral system [MW22a]), which in turn decreases throughput (for large databases). We now describe the approach. 

Construction B.1 (Coefficient Packing) . Let 𝜆 be a security parameter and 𝑑 1 = 𝑑 1 (𝜆 ), 𝑞 = 𝑞 (𝜆 ) be lattice parameters where 𝑑 1 = 2𝛿 1 is a power of two. We require that 𝑞 = 1 mod 2. Let 𝑅 𝑑 1 = Z𝑞 [𝑥 ]/( 𝑥 𝑑 1 + 1). Let 𝜒 = 𝜒 (𝜆 ) be an error distribution over 𝑅 𝑑 1 and 𝑧 ∈ N be a decomposition base. Let (AutomorphSetup , Automorph ) be the algorithms from Construction A.4 with parameters (𝑑 1, 𝑞, 𝜒, 𝑧 ). The coefficient packing procedure consists of a tuple of algorithms 

(CoeffPackSetup , CoeffPack , CoeffUnpack ) defined as follows: 35 • CoeffPackSetup (1𝜆 , s): On input the security parameter 𝜆 and the secret key s ∈ 𝑅 2 

> 𝑑 1

, the setup algorithm samples 

W𝑗 ← AutomorphSetup (1𝜆 , s, 𝜏 𝑑 /2𝑗 +1)

for each 𝑗 ∈ [ 0, 𝛿 1 − 1]. It outputs the coefficient packing parameters pp coeff = (W0, . . . , W𝛿 1 −1).

• CoeffPack (s, (𝑓 0, . . . , 𝑓 𝑑 2 −1)) : On input the secret key s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑 1

and a tuple of coefficients 𝑓 0, . . . , 𝑓 𝑑 2 −1 ∈

Z𝑞 where 𝑑 2 = 2𝛿 2 ≤ 𝑑 1 for some non-negative integer 𝛿 2, the packing algorithm defines the following quan-tities: 6

– Let 𝑅 𝑑 2 = Z𝑞 [𝑥 ]/( 𝑥 𝑑 2 + 1) and 𝜈 = 𝛿 1 − 𝛿 2. Let 𝑓 (𝑥 ) = Í𝑖 ∈ [ 0,𝑑 2 −1] 𝑓 𝑖 𝑥 𝑖 ∈ 𝑅 𝑑 2 .

– Let 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 be the subring embedding and 𝜅 −1 : 𝑅 𝑑 1 → 𝑅 𝑑 2 be the dimension-reduction mapping from Definition A.9. The packing algorithm now samples 𝑎 r

← 𝑅 𝑑 1 and 𝑒 ← 𝜒 . It computes the encoding 

c =

𝑐 1

𝑐 2



=

 𝑎 𝑠𝑎 + 𝑒 + 𝜅 (𝑓 )



∈ 𝑅 2 

> 𝑑 1

.

The packing algorithm computes 𝑐 ′ 

> 2

= 𝜅 −1 (𝑐 2) ∈ 𝑅 𝑑 2 and outputs (𝑐 1, 𝑐 ′

> 2

). Note that the component 𝑐 1 is random and can be compressed by deriving it from a PRG (and appealing to the random oracle heuristic). 

• CoeffUnpack (pp coeff , (𝑐 1, 𝑐 ′

> 2

)) : On input the public parameters pp coeff = (W0, . . . , W𝛿 1 −1) and a compressed encoding (𝑐 1, 𝑐 ′

> 2

) where 𝑑 2 ∈ N, 𝑐 1 ∈ 𝑅 𝑑 1 , and 𝑐 ′ 

> 2

∈ 𝑅 𝑑 2 , the unpacking algorithm proceeds as follows 

– Let 𝜈 = 𝛿 1 − 𝛿 2, where 𝛿 2 = log 𝑑 2. Initialize c(0) 

> 0

= 2−𝛿 1 · [ 𝑐 1 | 𝜅 (𝑐 ′

> 2

)] T ∈ 𝑅 2 

> 𝑑 1

, where 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 is the subring embedding. 

– Then, for each 𝑖 ∈ [ 𝜈 ], compute c(𝑖 ) 

> 0

= c(𝑖 −1) 

> 0

+ Automorph  W𝑖 −1, c(𝑖 −1) 

> 0

, 𝜏 𝑑 /2𝑖 −1+1

.

– For each 𝑖 ∈ [ 𝜈 + 1, 𝛿 1] and each 𝑗 ∈ [ 0, 2𝑖 −𝜈 − 1], let c′ 

> 𝑖,𝑗

= Automorph  W𝑖 −1, c(𝑖 −1) 

> 𝑗

, 𝜏 𝑑 /2𝑖 −1+1

 and compute 

c(𝑖 ) 

> 2𝑗

= c(𝑖 −1) 

> 𝑗

+ c′

> 𝑖,𝑗

c(𝑖 ) 

> 2𝑗 +1

= 𝑥 −2𝑖 −1

·  c(𝑖 −1) 

> 𝑗

− c′

> 𝑖,𝑗

.

For a bit-length 𝑖 and an integer 𝑗 ∈ [ 0, 2𝑖 − 1] with binary representation 𝑏 𝑖 𝑏 𝑖 −1 · · · 𝑏 1, let rev 𝑖 ( 𝑗 ) ∈ [ 0, 2𝑖 − 1]

be the bit-reversal function that outputs the integer whose binary representation is the string 𝑏 1𝑏 2 · · · 𝑏 𝑖 (i.e., the bits of 𝑗 in reverse order). For each 𝑖 ∈ [ 0, 𝑑 2 − 1], let ˆc𝑖 = c(𝛿 1 )   

> rev 𝛿 2(𝑖 )

. The unpacking algorithm outputs the encodings ˆc0, . . . , ˆc𝑑 2 −1.

Theorem B.2 (Coefficient Packing) . Let 𝜆 be a security parameter and 𝑑 1, 𝛿 1, 𝑞, 𝜒, 𝑧 be the parameters in Construc-tion A.7. Suppose 𝜒 is subgaussian with variance 𝜎 2 

> 𝜒

. Let s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑 1

be a secret key. Take any 𝑑 2 ≤ 𝑑 1 where 

𝑑 2 = 2𝛿 2 for some non-negative integer 𝛿 2 and any collection of coefficients 𝑓 0, . . . , 𝑓 𝑑 2 −1 ∈ Z𝑞 . Then, sample the following: 

• pp coeff ← CoeffPackSetup (1𝜆 , s);

• (𝑐 1, 𝑐 ′

> 2

) ← CoeffPack (s, (𝑓 0, . . . , 𝑓 𝑑 2 −1)) ;

• (ˆc0, . . . , ˆc𝑑 2 −1) ← CoeffUnpack  pp coeff , (𝑐 1, 𝑐 ′

> 2

).Then, for all 𝑗 ∈ [ 0, 𝑑 2 − 1], sT ˆc𝑗 = 𝑓 𝑗 + ˆ𝑒 𝑗 , where ˆ𝑒 𝑗 is subgaussian with variance ˆ𝜎 2 

> 𝑗

= 𝜎 2

> 𝜒

 1 + 𝑡𝑑 31𝑧 2/12 .    

> 6Note that the assumption that 𝑑 2is a power of two is not necessary (Remark B.3), and it is possible to generically dispense with this restriction by padding. However, assuming 𝑑 2is a power of two simplifies the description and analysis considerably. We make this simplifying assumption here to streamline the exposition.

36 Proof. Let pp coeff ← CoeffPackSetup (1𝜆 , s) and (𝑐 1, 𝑐 ′

> 2

) ← CoeffPack (s, (𝑓 0, . . . , 𝑓 𝑑 2 − 1)) . By definition, pp proj =

(W0, . . . , Wℓ −1) where W𝑗 ← AutomorphSetup (1𝜆 , s, 𝜏 𝑑 /2𝑗 +1). Moreover, 𝑐 ′ 

> 2

= 𝜅 −1 (𝑐 2) = 𝜅 −1 (𝑠𝑎 + 𝑒 + 𝜅 (𝑓 )) . Consider the encodings c(𝑖 ) 

> 0

for 𝑖 ∈ [ 0, 𝜈 ] computed by CoeffUnpack . We show inductively that these encodings satisfy 

sTc(𝑖 ) 

> 0

= 2−𝛿 1+𝑖 𝜋 𝑖 (𝑢 ) + 𝑒 𝑖 , (B.1) where 𝑒 0 = 0, 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑖

= Í𝑘 ∈ [ 𝑖 ] 4𝑘 −1𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4, 𝜋 𝑖 is the projection map from Eq. (3.6), and 

𝑢 = −𝑠𝑎 + 𝜋 𝜈 (𝑠𝑎 + 𝑒 + 𝜅 (𝑓 )) . (B.2) We proceed by induction on 𝑖 :

• Consider 𝑖 = 0. By definition, 

sTc(0) 

> 0

= 2−𝛿 1 (− 𝑠𝑐 1 + 𝜅 (𝑐 ′

> 2

)) = 2−𝛿 1 (− 𝑠𝑎 + 𝜅 (𝜅 −1 (𝑠𝑎 + 𝑒 + 𝜅 (𝑓 )))) 

= 2−𝛿 1 (− 𝑠𝑎 + 𝜋 𝜈 (𝑠𝑎 + 𝑒 + 𝜅 (𝑓 ))) by Lemma A.11 

= 2−𝛿 1 𝜋 0 (𝑢 ) + 𝑒 0,

since 𝑒 0 = 0, 𝜋 0 (𝑟 ) = 𝑟 for all 𝑟 ∈ 𝑅 𝑑 1 , and the definition of 𝑢 from Eq. (B.2). 

• For the inductive step, let c′ 

> 𝑖

= Automorph (W𝑖 , c(𝑖 ) 

> 0

, 𝜏 𝑑 /2𝑖 +1). By Theorem A.5 and the inductive hypothesis (Eq. (B.1)), 

sTc′ 

> 𝑖

= 𝜏 𝑑 /2𝑖 +1

 sTc(𝑖 )

> 0

 + ˜𝑒 𝑖 +1 = 𝜏 𝑑 /2𝑖 +1

 2−𝛿 1+𝑖 𝜋 𝑖 (𝑢 ) + 𝑒 𝑖 

 + ˜𝑒 𝑖 +1,

where ˜𝑒 𝑖 +1 is subgaussian with variance 𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4. Since c𝑖 +1 = c𝑖 + c′ 

> 𝑖

, and appealing to Lemma A.6, we have 

sTc(𝑖 +1) 

> 0

= sTc(𝑖 ) 

> 0

+ sTc′

> 𝑖

= 2−𝛿 1+𝑖  𝜋 𝑖 (𝑢 ) + 𝜏 𝑑 /2𝑖 +1 (𝜋 𝑖 (𝑢 ) + 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1

= 2−𝛿 1+𝑖 +1𝜋 𝑖 +1 (𝑢 ) + 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1.

Let 𝑒 𝑖 +1 B 𝑒 𝑖 +𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 )+ ˜𝑒 𝑖 +1. Since 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑖

and appealing to the independence heuris-tic (to argue that the key-switching error ˜𝑒 𝑖 +1 is independent of 𝑒 𝑖 ), we have that 𝑒 𝑖 +1 is subgaussian with variance 

𝜎 2 

> 𝑖 +1

= 4𝜎 2 

> 𝑖

+ 𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4 = 4 ·∑︁   

> 𝑘 ∈ [ 𝑖 −1]

4𝑘 −1𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4 + 𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4 =∑︁   

> 𝑘 ∈ [ 𝑖 ]

4𝑘 −1𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4. (B.3) Thus, by induction on 𝑖 , we conclude that sTc(𝜈 ) 

> 0

= 2−𝛿 1+𝜈 𝜋 𝜈 (𝑢 ) + 𝑒 𝜈 . Using the definition of 𝑢 from Eq. (B.2) and Lemma A.11, we have 

𝜋 𝜈 (𝑢 ) = 𝜋 𝜈 (− 𝑠𝑎 ) + 𝜋 𝜈 (𝜋 𝜈 (𝑠𝑎 + 𝑒 + 𝜅 (𝑓 ))) = 𝜋 𝜈 (𝜅 (𝑓 ) + 𝑒 ).

This means that 

sTc(𝜈 ) 

> 0

= 2−𝛿 1+𝜈 𝜋 𝜈 

 𝜅 (𝑓 ) + 𝑒  + 𝑒 𝜈 . (B.4) For each 𝑖 ∈ [ 𝜈, 𝛿 1] and 𝑗 ∈ [ 0, 2𝑖 −𝜈 − 1], define 

𝑤 𝑖,𝑗 B 𝑥 −2𝜈 ·rev 𝑖 −𝜈 ( 𝑗 ) ·  𝜅 (𝑓 ) + 𝑒  (B.5) We now show that for each 𝑖 ∈ [ 𝜈, 𝛿 1] and 𝑗 ∈ [ 0, 2𝑖 −𝜈 − 1],

sTc(𝑖 ) 

> 𝑗

= 2−𝛿 1+𝑖 𝜋 𝑖 (𝑤 𝑖,𝑗 ) + 𝑒 𝑖 , (B.6) where 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑖

= Í𝑘 ∈ [ 𝑖 ] 4𝑘 −1𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4. Again, we proceed by induction on 𝑖 . The base case where 𝑖 = 𝜈 (and 𝑗 = 0) follows from Eq. (B.4). Consider the inductive step. Take any 𝑗 ∈ [ 0, 2𝑖 −𝜈 − 1] and let 

c′ 

> 𝑖,𝑗

= Automorph  W𝑖 , c(𝑖 ) 

> 𝑗

, 𝜏 𝑑 /2𝑖 +1

. By Theorem A.5 and the inductive hypothesis (Eq. (B.6)), 

sTc′ 

> 𝑖,𝑗

= 𝜏 𝑑 /2𝑖 +1

 sTc(𝑖 )

> 𝑗

 + ˜𝑒 𝑖 +1 = 𝜏 𝑑 /2𝑖 +1

 2−𝛿 1+𝑖 𝜋 𝑖 (𝑤 𝑖,𝑗 ) + 𝑒 𝑖 

 + ˜𝑒 𝑖 +1,

where ˜𝑒 𝑖 +1 is subgaussian with variance 𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4. We now consider the encodings c(𝑖 +1) 

> 2𝑗

and c(𝑖 +1) 

> 2𝑗 +1

:37 • First, consider c(𝑖 +1) 

> 2𝑗

. By definition of the bit-reversal function, we have that rev 𝑖 −𝜈 ( 𝑗 ) = rev 𝑖 +1−𝜈 (2𝑗 ). In particular, this means that 

𝑤 𝑖 +1,2𝑗 = 𝑥 −2𝜈 ·rev 𝑖 +1−𝜈 (2𝑗 ) ·  𝜅 (𝑓 ) + 𝑒  = 𝑥 −2𝜈 ·rev 𝑖 −𝜈 ( 𝑗 ) ·  𝜅 (𝑓 ) + 𝑒  = 𝑤 𝑖,𝑗 .

Now we can write 

sTc(𝑖 +1) 

> 2𝑗

= sTc(𝑖 ) 

> 𝑗

+ sTc′

> 𝑖,𝑗

= 2−𝛿 1+𝑖  𝜋 𝑖 (𝑤 𝑖,𝑗 ) + 𝜏 𝑑 /2𝑖 +1 (𝜋 𝑖 (𝑤 𝑖,𝑗 ))  + 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1

= 2−𝛿 1+𝑖 +1𝜋 𝑖 +1 (𝑤 𝑖,𝑗 ) + 𝑒 𝑖 +1

= 2−𝛿 1+𝑖 +1𝜋 𝑖 +1 (𝑤 𝑖 +1,2𝑗 ) + 𝑒 𝑖 +1.

where 𝑒 𝑖 +1 = 𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1. Under the independence heuristic (applied to 𝑒 𝑖 and ˜𝑒 𝑖 +1), the variance of 

𝑒 𝑖 +1 satisfies the desired relation via the same calculation as Eq. (B.3). 

• Next, consider c(𝑖 +1) 

> 2𝑗 +1

. In this case, by definition of the bit-reversal function, rev 𝑖 +1−𝜈 (2𝑗 + 1) = 2𝑖 −𝜈 + rev 𝑖 −𝜈 ( 𝑗 ).This means 

𝑤 𝑖 +1,2𝑗 +1 = 𝑥 −2𝜈 ·rev 𝑖 +1−𝜈 (2𝑗 +1) ·  𝜅 (𝑓 ) + 𝑒  = 𝑥 −2𝑖 

𝑤 𝑖,𝑗 .

Now we can write 

sTc(𝑖 +1) 

> 2𝑗 +1

= 𝑥 −2𝑖  sTc(𝑖 ) 

> 𝑗

− sTc′

> 𝑖,𝑗



= 𝑥 −2𝑖  2−𝛿 1+𝑖  𝜋 𝑖 (𝑤 𝑖,𝑗 ) − 𝜏 𝑑 /2𝑖 +1 (𝜋 𝑖 (𝑤 𝑖,𝑗 ))  + 𝑒 𝑖 − 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1



= 2−𝛿 1+𝑖 +1𝜋 𝑖 +1

 𝑤 𝑖,𝑗 · 𝑥 −2𝑖  + 𝑒 𝑖 +1

= 2−𝛿 1+𝑖 +1𝜋 𝑖 +1 (𝑤 𝑖 +1,2𝑗 +1) + 𝑒 𝑖 +1,

where 𝑒 𝑖 +1 = 𝑥 −2𝑖  𝑒 𝑖 + 𝜏 𝑑 /2𝑖 +1 (𝑒 𝑖 ) + ˜𝑒 𝑖 +1

. Under the independence heuristic (applied to 𝑒 𝑖 and ˜𝑒 𝑖 +1), the variance of 𝑒 𝑖 +1 satisfies the desired relation via the same calculation as Eq. (B.3). Note that multiplying a polynomial by 

𝑥 −2𝑖 

corresponds to applying a (nega)-cyclic rotation to the coefficients of the polynomial and does not change the magnitude of any of the coefficients. By induction on 𝑖 , Eq. (B.6) holds for 𝑖 = 𝛿 1 and all 𝑗 ∈ [ 0, 𝑑 2 − 1]. Thus, for all 𝑗 ∈ [ 0, 𝑑 2 − 1], we have that 

sTc(𝛿 1 ) 

> 𝑗

= 𝜋 𝛿 1 (𝑤 𝛿 1,𝑗 ) + 𝑒 𝛿 1 .

By Eq. (B.5) and the fact that 𝛿 1 − 𝜈 = 𝛿 2, we have 

𝜋 𝛿 1 (𝑤 𝛿 1,𝑗 ) = 𝜋 𝛿 1

 𝑥 −2𝜈 ·rev 𝛿 1 −𝜈 ( 𝑗 ) ·  𝜅 (𝑓 ) + 𝑒  = 𝑓 rev 𝛿 2 ( 𝑗 ) + 𝜋 𝛿 1

 𝑥 −2𝜈 ·rev 𝛿 2 ( 𝑗 ) · 𝑒 .

Since rev 𝛿 2 (rev 𝛿 2 ( 𝑗 )) = 𝑗 , we have 

sT ˆc𝑗 = sTc(𝛿 1 )    

> rev 𝛿 2(𝑗 )

= 𝑓 𝑗 + 𝜋 𝛿 1

 𝑥 −2𝜈 · 𝑗 · 𝑒  + 𝑒 𝛿 1 = 𝑓 𝑗 + ˆ𝑒 𝑗 ,

where ˆ𝑒 𝑗 = 𝜋 𝛿 1

 𝑥 −2𝜈 · 𝑗 ·𝑒  +𝑒 𝛿 1 . Since 𝑒 is sampled independently of 𝑒 𝛿 1 , we conclude that ˆ𝑒 𝑗 is subgaussian with variance 

ˆ𝜎 2 

> 𝑗

= 𝜎 2 

> 𝜒

+∑︁   

> 𝑘 ∈ [ 𝛿 1]

4𝑘 −1𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/4 = 𝜎 2 

> 𝜒

+ 4𝛿 1 𝑡𝑑 1𝑧 2𝜎 2 

> 𝜒

/12 = 𝜎 2

> 𝜒

 1 + 𝑡𝑑 31𝑧 2/12 . □

Remark B.3 (Packing an Arbitrary Number of Coefficients) . As defined, Construction B.1 assumes that the packing algorithm CoeffPack takes 𝑑 2 coefficients (𝑓 0, . . . , 𝑓 𝑑 2 −1), where 𝑑 2 is a power of two. It is straightforward to generalize 

CoeffPack to take in an arbitrary number of coefficients. One approach is to simply pad the input to the nearest power of two, which incurs at most a 2× overhead. In fact, it is possible to avoid padding altogether by having 

CoeffPack embed the coefficients (𝑓 0, . . . , 𝑓 𝑑 2 −1) into the polynomial 𝑓 in bit-reversed order (rather than deferring the bit-reversal to the very end). With this optimization, we avoid the need to expand “unused” coefficients. This is the approach we take in our implementation. In the subsequent description, we will assume that the coefficient-packing algorithm CoeffPack can take an arbitrary number of inputs (up to the ring dimension 𝑑 1). 38 Packing GSW encodings. The second ingredient we use is the approach for packing GSW encodings into a small number of RLWE encodings (which can in turn be further packed using the coefficient packing approach described above). Here, we recall the approach from [CCR19, MW22a]: 

Construction B.4 (RLWE-to-GSW [CCR19, MW22a, adapted]) . Let 𝜆 be a security parameter and 𝑑 = 𝑑 (𝜆 ), 𝑞 = 𝑞 (𝜆 )

be lattice parameters where 𝑑 is a power of two. Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1) and 𝜒 = 𝜒 (𝜆 ) be an error distribution over 

𝑅 𝑑 . The GSW packing algorithm is parameterized by two decomposition bases: a conversion base 𝑧 conv ∈ N and the decomposition base 𝑧 GSW ∈ N for the resulting GSW encodings. Let 𝑡 GSW = ⌊log 𝑧 GSW 𝑞 ⌋ + 1 and 𝑡 conv = ⌊log 𝑧 conv 𝑞 ⌋ + 1.We define the algorithms (RLWEToGSWSetup , RLWEToGSW ) as follows: 

• RLWEToGSWSetup (1𝜆 , s): On input the security parameter 𝜆 and the secret key s = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

, the setup algorithm samples a r

← 𝑅 2𝑡 conv  

> 𝑑,𝑞

and e ← 𝜒 2𝑡 conv and output the conversion parameters 

pp conv = V =

 aT

𝑠 aT + eT − 𝑠 (sT ⊗ gT 

> 𝑧 conv

)



∈ 𝑅 2×2𝑡 conv  

> 𝑑,𝑞

.

• RLWEToGSW (pp conv , (c1, . . . , c𝑡 GSW )) : On input the conversion parameters pp conv = V ∈ 𝑅 2×2𝑡 conv  

> 𝑑,𝑞

, and RLWE encodings c1, . . . , c𝑡 GSW ∈ 𝑅 2 

> 𝑑,𝑞

, let ˆc = [c1 | · · · | c𝑡 GSW ] ∈ 𝑅 2×𝑡 GSW  

> 𝑑,𝑞

and output the GSW encoding 

C = [Vg −1 

> 𝑧 conv

(ˆc) | ˆc] ∈ 𝑅 2×2𝑡 GSW  

> 𝑑,𝑞

.

Theorem B.5 (RLWE-to-GSW [CCR19, MW22a, adapted]) . Let 𝜆 be a security parameter and 𝑑, 𝑞, 𝜒, 𝑧 conv , 𝑧 GSW be the parameters from Construction B.4. Suppose 𝜒 is subgaussian with variance 𝜎 2 

> 𝜒

. Let s = [− 𝑠, 1]T be a secret key. For each 

𝑖 ∈ [ 𝑡 GSW ], let c𝑖 ∈ 𝑅 2 

> 𝑑,𝑞

be an encoding of 𝜇𝑧 𝑖 −1 

> GSW

with error 𝑒 𝑖 (i.e., sTc𝑖 = 𝜇𝑧 𝑖 −1 

> GSW

+ 𝑒 𝑖 ). Suppose each 𝑒 𝑖 is subgaussian with variance 𝜎 2 

> 𝑒

. Then, sample pp conv ← RLWEToGSWSetup (1𝜆 , s) and C ← RLWEToGSW (pp conv , (c1, . . . , c𝑡 GSW )) .Then C is a GSW encoding of 𝜇 with respect to s with error e (i.e., sTC = sTG2,𝑧 GSW + eT) where the components of e are subgaussian with variance 𝑑𝜎 2 

> 𝑒

∥s∥2 

> ∞

+ 𝑡 conv 𝑑𝑧 2conv 𝜎 2 

> 𝜒

/2.

Query packing. The query packing algorithm in Respire is obtained by composing the coefficient expansion algo-rithm with the RLWE-to-GSW conversion algorithms. To have finer control over the noise, we allow for two separate bases for coefficient packing: one for packing/expanding the RLWE ciphertexts, and one for packing/expanding the GSW ciphertexts. We give the full description of the algorithms from Box 2 below: 

Construction B.6 (Query Packing) . Let 𝜆 be a security parameter and 𝑑 1 = 𝑑 1 (𝜆 ), 𝑞 = 𝑞 (𝜆 ) be lattice parameters where 𝑑 1 = 2𝛿 1 is a power of two. We require that 𝑞 = 1 mod 2. Let 𝑅 𝑑 1 = Z[𝑥 ]/( 𝑥 𝑑 1 + 1). Let 𝜒 be an error distribution over 𝑅 𝑑 1 . The main query packing algorithm uses the coefficient packing and RLWE-to-GSW conversion algorithms from Constructions B.1 and B.4. The scheme is additionally parameterized by four decomposition bases: 𝑧 coeff ,RLWE for expanding the RLWE encodings, 𝑧 coeff ,GSW for expanding the GSW encodings, 𝑧 conv for the RLWE-to-GSW conversion, and 𝑧 GSW for the GSW decomposition base. 

• Let (CoeffPackSetup RLWE , CoeffPack RLWE , CoeffUnpack RLWE ) be the coefficient packing algorithms from Con-struction B.1 instantiated with parameters (𝑑 1, 𝑞, 𝜒, 𝑧 coeff ,RLWE ).

• Let (CoeffPackSetup GSW , CoeffPack GSW , CoeffUnpack GSW ) be the coefficient packing algorithms from Con-struction B.1 instantiated with parameters (𝑑 1, 𝑞, 𝜒, 𝑧 coeff ,GSW ).

• Let (RLWEToGSWSetup , RLWEToGSW ) be the RLWE-to-GSW conversion algorithms from Construction B.4 instantiated with parameters (𝑑 1, 𝑞, 𝜒, 𝑧 conv , 𝑧 GSW ). Let 𝑡 GSW = ⌊log 𝑧 GSW 𝑞 ⌋ + 1.We now define the algorithms (QueryPackSetup , QueryPack , QueryUnpack ):

• QueryPackSetup (1𝜆 , s): On input a security parameter 𝜆 and the secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, the setup algorithm samples 39 – pp coeff ,RLWE ← CoeffPackSetup RLWE (1𝜆 , s);

– pp coeff ,GSW ← CoeffPackSetup GSW (1𝜆 , s); and 

– pp conv ← RLWEToGSWSetup (1𝜆 , s).It outputs the query packing parameters pp qpk = (pp coeff ,RLWE , pp coeff ,GSW , pp conv ).

• QueryPack (s, v, μ): On input the secret key s ∈ 𝑅 2 

> 𝑑,𝑞

, a collection of values v = (𝑣 1, . . . , 𝑣 𝑘 ) ∈ Z𝑘 𝑞 where 𝑘 ≤ 𝑑 1,and μ = (𝜇 1, . . . , 𝜇 ℓ ) ∈ { 0, 1}ℓ where ℓ𝑡 GSW ≤ 𝑑 1, the query packing algorithm computes 

enc RLWE ← CoeffPack RLWE (s, (𝑣 1, . . . , 𝑣 𝑘 )) 

enc GSW ← CoeffPack GSW (s, (𝜇 1, 𝜇 1𝑧 GSW , . . . , 𝜇 1𝑧 𝑡 GSW −1 

> GSW

, . . . , 𝜇 ℓ , 𝜇 ℓ𝑧 GSW , . . . , 𝜇 ℓ𝑧 𝑡 GSW −1 

> GSW

)) .

It outputs the packed encoding enc = (enc RLWE , enc GSW ).

• QueryUnpack (pp qpk , enc ): On input the packing key pp qpk = (pp coeff ,RLWE , pp coeff ,GSW , pp conv ) and the packed encoding enc = (enc RLWE , enc GSW ), the unpacking algorithm computes 

(c1, . . . , c𝑘 ) ← CoeffUnpack RLWE (pp coeff ,RLWE , enc RLWE )(ˆc1, . . . , ˆcℓ𝑧 GSW ) ← CoeffUnpack GSW (pp coeff ,GSW , enc GSW ).

Then, for each 𝑖 ∈ [ ℓ], it computes C𝑖 ← RLWEToGSW (pp conv , (ˆc(𝑖 −1) · 𝑧 GSW +1, . . . , ˆc𝑖 ·𝑧 GSW )) . It outputs the RLWE encodings (c1, . . . , c𝑘 ) together with the GSW encodings (C1, . . . , Cℓ ).

Theorem B.7 (Query Packing) . Let s ∈ 𝑅 2 

> 𝑑,𝑞

be a secret key. Let 𝑧 coeff ,RLWE , 𝑧 coeff ,GSW , 𝑧 conv , 𝑧 GSW ∈ N be the decom-position bases from Construction B.6. Let 

𝑡 coeff ,RLWE = ⌊log 𝑧 coeff ,RLWE 𝑞 ⌋+ 1 , 𝑡 coeff ,GSW = ⌊log 𝑧 coeff ,GSW 𝑞 ⌋+ 1 , 𝑡 conv = ⌊log 𝑧 conv 𝑞 ⌋+ 1 , 𝑡 GSW = ⌊log 𝑧 GSW 𝑞 ⌋+ 1

be the corresponding lengths. Suppose the error distribution 𝜒 is subgaussian with variance 𝜎 2 

> 𝜒

. Take any vector v ∈ Z𝑘 𝑞 

and μ ∈ { 0, 1}ℓ . Suppose pp qpk ← QueryPackSetup (𝑠 ), enc ← QueryPack (𝑠, v, μ), and  (c1, . . . , c𝑘 ), (C1, . . . , Cℓ ) ←

QueryUnpack (pp qpk , enc ). Then, the following hold: 

• For all 𝑖 ∈ [ 𝑘 ], c𝑖 is an RLWE encoding of 𝑣 𝑖 with respect to secret key 𝑠 and error 𝑒 𝑖 .

• For all 𝑗 ∈ [ ℓ], C𝑗 is a GSW encoding of 𝜇 𝑗 with respect to secret key 𝑠 and error e𝑗 .Under the independence heuristic, the errors 𝑒 1, . . . , 𝑒 𝑘 are subgaussian with variance 𝜎 21 = 𝜎 2 

> 𝜒

(1+𝑡 coeff ,RLWE 𝑑 31𝑧 2

> coeff ,RLWE

/12 ),and the components of e1, . . . , eℓ are subgaussian with variance 𝜎 22 = 𝜎 2 

> 𝜒

(𝑑 1 ∥𝑠 ∥2 

> ∞

(1 + 𝑡 coeff ,GSW 𝑑 31𝑧 2

> coeff ,GSW

/12 ) + 

𝑡 conv 𝑑 1𝑧 2

> conv

/2).Proof. Let (c1, . . . , c𝑘 ) and (ˆc1, . . . , ˆcℓ𝑧 GSW ) be the results of CoeffUnpack in running QueryUnpack . By Theorem B.2, the following hold: 

• For each 𝑖 ∈ [ 𝑘 ], c𝑖 is an RLWE encoding of 𝑣 𝑖 with error 𝑒 𝑖 where 𝑒 𝑖 is subgaussian with variance 𝜎 2

> 𝜒

 1 +

𝑡 coeff ,RLWE 𝑑 31𝑧 2

> coeff ,RLWE

/12 .

• For each 𝑖 ∈ [ ℓ𝑡 GSW ], the tuple (ˆc(𝑖 −1) · 𝑧 GSW +1, . . . , ˆc𝑖 ·𝑧 GSW ) is an RLWE encoding of  𝜇 𝑖 · 𝑧 0

> GSW

, . . . , 𝜇 𝑖 · 𝑧 𝑡 GSW −1

> GSW

,where the error in each encoding is subgaussian with variance 𝜎 2

> 𝜒

 1 + 𝑡 coeff ,GSW 𝑑 31𝑧 2

> coeff ,GSW

/12 .By Theorem B.5, we know that for each 𝑖 ∈ [ ℓ], C𝑖 is a GSW encoding of 𝜇 𝑖 with error e𝑖 and the components of 

e𝑖 are subgaussian with variance 𝜎 2

> 𝜒

 𝑑 1 ∥s∥2 

> ∞

(1 + 𝑡 coeff ,GSW 𝑑 31𝑧 2

> coeff ,GSW

/12 ) + 𝑡 conv 𝑑 1𝑧 2

> conv

/2. □

Remark B.8 (Different Decomposition Bases for Query Unpacking) . The QueryUnpack algorithm in Construction B.6 uses two different decomposition bases 𝑧 coeff ,RLWE and 𝑧 coeff ,GSW to expand the packed encoding. We use two different decomposition bases because the RLWE-to-GSW conversion procedure (Construction B.4) introduces additional noise. It is advantageous to use a smaller decomposition base when expanding the RLWE encodings that will be assembled into GSW encodings. This way, the noise in the resulting RLWE encodings and the GSW encodings output by QueryUnpack will be on a comparable footing. We illustrate our parameter choices in Table 5. 40 C Response Compression 

In this section, we provide the full details of the (homomorphic) dimension reduction algorithm in Respire (i.e., the algorithms in Box 1). As described in Section 3.2, we compose dimension reduction with vectorization (which is helpful in the batched setting). We recall vectorization (i.e., the algorithms from Box 4) in Appendix C.1 and then give our response compression approach (i.e., the algorithms from Box 1) in Appendix C.2. 

## C.1 Vectorizing RLWE Encodings 

In this section, we describe the approach from [MW22a] for packing multiple scalar RLWE encodings into a single vector RLWE encoding, which we call vectorization. These correspond to the algorithms in Box 4. While [MW22a] shows how to pack scalar encodings into a matrix RLWE encoding, we only consider the case where the target is a vector RLWE encoding, since vector encodings yield the best compression. Vectorization yields shorter packed ciphertexts (i.e., achieves higher rate), but requires larger public parameters (proportional to the vector length). Concretely, vectorization packs 2𝑛 ring elements into 𝑛 + 1 ring elements, thus achieving a ≈ 2× reduction in encoding size. Now, we present the (adapted) construction from [MW22a] for vectorizing a collection of scalar RLWE encodings into a vector RLWE encoding (i.e., the algorithms in Box 4) and then state the associated correctness guarantee: 

Construction C.1 (Vectorizing RLWE Encodings [MW22a, adapted]) . Let 𝜆 be a security parameter and 𝑑 = 𝑑 (𝜆 ), 𝑞 =

𝑞 (𝜆 ) be lattice parameters where 𝑑 is a power of two. Let 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1) and 𝜒 = 𝜒 (𝜆 ) be an error distribution over 𝑅 𝑑 . The construction is also parameterized by a decomposition base 𝑧 . Let 𝑡 = ⌊log 𝑧 𝑞 ⌋ + 1. We define the vectorization algorithms (VecSetup , Vectorize ) as follows: 

• VecSetup (1𝜆 , s1, S2): On input a security parameter 𝜆 and two secret keys s1 = [− 𝑠 1 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

and 

S2 = [− s2 | I𝑛 ]T ∈ 𝑅 (𝑛 +1) × 𝑛 𝑑,𝑞 , the setup algorithm samples a𝑖 r

← 𝑅 𝑡 𝑑,𝑞 , E𝑖 ← 𝜒 𝑛 ×𝑡 , and sets 

V𝑖 =

 aT

> 𝑖

s2aT 

> 𝑖

+ E𝑖 − 𝑠 1u𝑖 gT

> 𝑧



∈ 𝑅 (𝑛 +1) × 𝑡 𝑑,𝑞 

for each 𝑖 ∈ [ 𝑛 ] and where u𝑖 ∈ 𝑅 𝑛 𝑑,𝑞 denotes the 𝑖 th canonical basis vector. Finally, the algorithm outputs the parameters pp vec = (V1, . . . , V𝑛 ).

• Vectorize (pp vec , (c1, . . . , c𝑛 )) : On input the parameters pp vec = (V1, . . . V𝑛 ) and a collection of RLWE encodings 

c1, . . . , c𝑛 where cT 

> 𝑖

= [𝑐 𝑖, 0 | 𝑐 𝑖, 1], compute and output 

c =∑︁  

> 𝑖 ∈ [ 𝑛 ]



V𝑖 g−1 

> 𝑧

(𝑐 𝑖, 0) + 

 0

𝑐 𝑖, 1u𝑖 

  

∈ 𝑅 𝑛 +1 

> 𝑑,𝑞

.

Theorem C.2 (Vectorizing RLWE Encodings [MW22a, adapted]) . Let 𝜆 be a parameter and 𝑑, 𝑞, 𝜒, 𝑧 be the param-eters in Construction C.1. Let s1 = [− 𝑠 | 1]T ∈ 𝑅 2 

> 𝑑,𝑞

and S2 = [− s | I𝑛 ]T ∈ 𝑅 (𝑛 +1) × 𝑛 𝑑,𝑞 be secret keys. Suppose 𝜒 is subgaussian with variance 𝜎 2 

> 𝜒

. Take any collection of encodings c1, . . . , c𝑛 ∈ 𝑅 2 

> 𝑑,𝑞

. Let pp vec ← VecSetup (1𝜆 , s1, S2) and 

c′ ← Vectorize (pp vec , (c1, . . . , c𝑛 )) . Then 

ST

> 2

c′ =



sT

> 1

c1

...

sT

> 1

c𝑛 



+ e′,

where the components of e′ are subgaussian with variance (𝜎 ′)2 ≤ 𝑛𝑡𝑑𝑧 2𝜎 2 

> 𝜒

/4.

## C.2 Response Compression 

We now provide the full details of the response compression scheme in Respire (i.e., the algorithms in Box 1). As outlined in Section 3.2, our approach combines (split) modulus switching [BGV12, MW22a] with ring switch-ing [BGV12, GHPS12]. 41 Construction C.3 (Response Compression) . Let 𝑑 1 ≥ 𝑑 2 be ring dimensions, and let 𝑘 = 𝑑 1/𝑑 2. Let 𝑅 𝑑 1 =

Z[𝑥 ]/( 𝑥 𝑑 1 + 1) and 𝑅 𝑑 2 = Z[𝑥 ]/( 𝑥 𝑑 2 + 1). Let Π : 𝑅 𝑘 𝑑 2 → 𝑅 𝑑 1 be the ring packing function (defined in Eq. (3.3) and Definition A.12). Let 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 be the subring embedding and 𝜅 −1 : 𝑅 𝑑 1 → 𝑅 𝑑 2 be the dimension-reduction mappings (defined in Definition A.9). Let 𝜒 be an error distribution over 𝑅 𝑑 2 , 𝑞 1 ≥ 𝑞 2 ≥ 𝑞 3 be ring moduli, 𝑧 ∈ N be a decomposition base, 𝑛 be the input dimension, and 𝑡 = ⌊log 𝑧 𝑞 2⌋ + 1.

• CompressSetup (1𝜆 , S1, S2): On input a source key S1 = [− ˜s1 | I𝑛 ] ∈ 𝑅 𝑛 × ( 𝑛 +1) 

> 𝑑 1

and a target key S2 = [− ˜s2 | I𝑛 ] ∈ 

𝑅 𝑛 × ( 𝑛 +1) 

> 𝑑 2,𝑞 2

, sample a1, . . . , a𝑘 r

← 𝑅 𝑡 𝑑 2,𝑞 2 and E1, . . . , E𝑘 ← 𝜒 𝑛 ×𝑡 . Note that we do not specify the modulus for S1. Let 

a = Π(a1, . . . , a𝑘 ) ∈ 𝑅 𝑡 𝑑 1,𝑞 2 and B = Π(˜s2aT 

> 1

+ E1, . . . , ˜s2aT 

> 𝑘

+ E𝑘 ) ∈ 𝑅 𝑛 ×𝑡 𝑑 1,𝑞 2 .

Output the key-switching matrix 

W =

aT

B



+

 01×𝑡 

−( ˜s1 mod 𝑞 2) · gT

> 𝑧



∈ 𝑅 (𝑛 +1) × 𝑡 𝑑 1,𝑞 2 .

• Compress (W, c): On input the key-switching matrix W =

h wT

> 1
> W2

i

where w1 ∈ 𝑅 𝑡 𝑑 1,𝑞 2 and W2 ∈ 𝑅 𝑛 ×𝑡 𝑑 1,𝑞 2 and an encoding c =  𝑐 1

> c2

 ∈ 𝑅 𝑛 +1 

> 𝑑 1,𝑞 1

, compute 

ˆ𝑐 1 = 𝜅 −1 

wT

> 1

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

∈ 𝑅 𝑑 2,𝑞 2

ˆc2 = 𝜅 −1  j 𝑞 3 

> 𝑞 1

c2 + 𝑞 3 

> 𝑞 2

W2g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

m 

mod 𝑞 3



∈ 𝑅 𝑛 𝑑 2,𝑞 3 .

The computations inside “ ⌊·⌉ mod 𝑞 𝑖 ” are performed over the rationals. 7 Output the encoding ( ˆ𝑐 1, ˆc2).

• CompressRecover (S2, ( ˆ𝑐 1, ˆc2)) : On input a secret key S2 = [− ˜s2 | I𝑛 ] ∈ 𝑅 𝑛 × ( 𝑛 +1) 

> 𝑑 2,𝑞 2

and a compressed encoding 

( ˆ𝑐 1, ˆc2) ∈ 𝑅 𝑑 2,𝑞 2 × 𝑅 𝑛 𝑑 2,𝑞 3 , output 

z =



−𝑞 3

𝑞 2

(˜s2 · ˆ𝑐 1)



mod 𝑞 3 + ˆc2 ∈ 𝑅 𝑛 𝑑 2,𝑞 3 . (C.1) The computations inside “ ⌊·⌉ mod 𝑞 𝑖 ” are performed over the rationals, in the same way as in Compress .

Theorem C.4 (Response Compression Correctness) . Let 𝑞 1 ≥ 𝑞 2 ≥ 𝑞 3 ≥ 𝑝 be ring moduli. Let 𝑑 1 = 2𝛿 1 ≥ 𝑑 2 = 2𝛿 2

be (power-of-two) ring dimensions. Let 𝑘 = 𝑑 1/𝑑 2 and let 𝜈 = 𝛿 1 − 𝛿 2. Let 𝜒 be an error distribution over 𝑅 𝑑 2 , 𝑧 ∈ N be a decomposition base, and 𝑛 ∈ N be the vector dimension. Let 𝑡 = ⌊log 𝑧 𝑞 2⌋ + 1. Define the following: 

• Suppose c =  𝑐 1

> c2

 ∈ 𝑅 𝑛 +1 

> 𝑑 1,𝑞 1

is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ m for some message m ∈ 𝑅 𝑛 𝑑 1,𝑝 with respect to S1 (when viewed as a secret key over 𝑅 𝑑 1,𝑞 1 ) and error e ∈ 𝑅 𝑛 𝑑 1 .

• Suppose S2 = [− ˜s2 | I𝑛 ] ∈ 𝑅 𝑛 × ( 𝑛 +1) 

> 𝑑 2,𝑞 2

is the target key. 

• Suppose W ← CompressSetup (S1, S2), ( ˆ𝑐 1, ˆc2) ← Compress (W, c), and z ← CompressRecover (S2, ( ˆ𝑐 1, ˆc2)) .Then z = ⌊𝑞 3/𝑝 ⌋ 𝜅 −1 (m) + ˜e ∈ 𝑅 𝑛 𝑑 2,𝑞 3 , where ˜e = ˜e1 + ˜e2 and 

• ∥ ˜e1 ∥∞ ≤ 12



2 + ( 𝑞 3 mod 𝑝 ) + 𝑞 3 

> 𝑞 1

(𝑞 1 mod 𝑝 )



.

> 7

More explicitly, we first lift the quantities inside “ ⌊·⌉ mod 𝑞 𝑖 ” to the rationals by associating the coefficients of each ring element (i.e., each polynomial) with its unique integer representative in the interval [− 𝑞 𝑖 /2, 𝑞 𝑖 /2]. We then perform all operations over the rationals. After evaluating the arithmetic operations on the polynomials with rational coefficients, rounding yields a polynomial with integer coefficients and taking the result mod 𝑞 𝑖 yields an element of 𝑅 𝑑 1,𝑞 𝑖 .

42 • Suppose the components of e are subgaussian with parameter 𝜎 𝑒 , the components of ˜s1 are subgaussian with parameter 𝜎 𝑠 , and the distribution 𝜒 is subgaussian with parameter 𝜎 𝜒 . Then, under the independence heuristic, the components of ˜e2 are subgaussian with variance 

˜𝜎 2 = 𝑞 23

𝑞 21

𝜎 2 

> e

+ 𝑞 23

4𝑞 22

𝑑 1𝜎 2 

> 𝑠

+ 𝑞 23

𝑞 22

𝜎 2 

> 𝜒

𝐵 2,

where 𝐵 = g−1 

> 𝑧

(⌊ 𝑞 2/𝑞 1 · 𝑐 1⌉ mod 𝑞 2) 2. Note that a trivial bound for 𝐵 is the bound 𝐵 ≤ √𝑡𝑑 1 · 𝑧 /2.Proof. Let 𝜅 : 𝑅 𝑑 2 → 𝑅 𝑑 1 be the subring embedding (Definition A.9), and let 𝜋 𝜈 : 𝑅 𝑑 1 → 𝑅 𝑑 1 be the projection map (i.e., the mapping 𝑟 ↦ → 𝜅 (𝜅 −1 (𝑟 )) from Lemma A.11). We will show that 

𝜅 (z) = ⌊𝑞 3/𝑝 ⌋ 𝜅 (𝜅 −1 (m)) + 𝜅 (e′) = ⌊𝑞 1/𝑝 ⌋ 𝜋 𝜈 (m) + 𝜅 (e′).

The claim then follows by the fact that 𝜅 is an injective ring homomorphism (Lemma A.10). First, write W =

h wT

> 1
> W2

i

where w1 ∈ 𝑅 𝑡 𝑑 1,𝑞 2 and W2 ∈ 𝑅 𝑛 ×𝑡 𝑑 1,𝑞 2 and let c =  𝑐 1

> c2

 where 𝑐 1 ∈ 𝑅 𝑑 1,𝑞 1 and c2 ∈ 𝑅 𝑛 𝑑 1,𝑞 1 . Let 

ˆ𝑐 ′ 

> 1

= wT

> 1

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



∈ 𝑅 𝑑 2,𝑞 2

ˆc′ 

> 2

=

j 𝑞 3 

> 𝑞 1

c2 + 𝑞 3 

> 𝑞 2

W2g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

m 

mod 𝑞 3 ∈ 𝑅 𝑛 𝑑 2,𝑞 3 .

(C.2) Then, ˆ𝑐 1 = 𝜅 −1 ( ˆ𝑐 ′

> 1

) and ˆc2 = 𝜅 −1 (ˆc′

> 2

). By Lemmas A.10 and A.11 and using the definition of z from Eq. (C.1), we have 

𝜅 (z) =

j

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · 𝜅 ( ˆ𝑐 1)m

mod 𝑞 3 + 𝜅 (ˆc2) =

j

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · 𝜋 𝜈 ( ˆ𝑐 ′

> 1

)m

mod 𝑞 3 + 𝜋 𝜈 (ˆc′

> 2

)

= 𝜋 𝜈 

 j 

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 3 + ˆc′

> 2



∈ 𝑅 𝑛 𝑑 1,𝑞 3 .

(C.3) Substituting in the values of ˆ𝑐 ′ 

> 1

and ˆc′ 

> 2

from Eq. (C.2) and working over the rationals , we have: 

j

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 3 + ˆc′ 

> 2

=

j

−𝑞 3

> 𝑞 2



𝜅 (˜s2) · wT

> 1

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

m 

+

j 𝑞 3 

> 𝑞 1

c2 + 𝑞 3 

> 𝑞 2

W2g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

m 

+ ξ1𝑞 3

= −𝑞 3

𝑞 2

𝜅 (˜s2) · wT

> 1

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ e⌊·⌉ ,1

+ 𝑞 3

𝑞 1

c2 + 𝑞 3

𝑞 2

W2g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ e⌊·⌉ ,2 + ξ1𝑞 3

= 𝑞 3

𝑞 2

 −𝜅 (˜s2)wT 

> 1

+ W2

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ 𝑞 3

𝑞 1

c2 + ξ1𝑞 3 + e⌊·⌉ ,1 + e⌊·⌉ ,2,

(C.4) where e⌊·⌉ ,1 and e⌊·⌉ ,2 are the error terms introduced by the rounding operations, and ξ1 ∈ 𝑅 𝑛 𝑑 1 . By definition, the norms of e⌊·⌉ ,1 and e⌊·⌉ ,2 are bounded by 1/2. Since W ← CompressSetup (S1, S2), we know that 

W =

 wT

> 1

W2



=

 aT

B − ˜s1 · gT

> 𝑧



∈ 𝑅 (𝑛 +1) × 𝑡 𝑑 1,𝑞 2 ,

and by definition of Π, we have a = Í𝑖 ∈ [ 𝑘 ] 𝑥 𝑖 −1𝜅 (a𝑖 ) and B = Í𝑖 ∈ [ 𝑘 ] 𝑥 𝑖 −1𝜅 (˜s2aT 

> 𝑖

+ E𝑖 ) where a1, . . . , a𝑘 ∈ 𝑅 𝑡 𝑑 2,𝑞 2 and 

E1, . . . , E𝑘 ← 𝜒 𝑛 ×𝑡 . Since 𝜅 is a ring homomorphism (Lemma A.10), we can write 

−𝜅 (˜s2)wT 

> 1

+ W2 = −( ˜s1 mod 𝑞 2) · gT 

> 𝑧

+∑︁   

> 𝑖 ∈ [ 𝑘 ]

𝑥 𝑖 −1  −𝜅 (˜s2)𝜅 (aT 

> 𝑖

) + 𝜅 (˜s2aT 

> 𝑖

+ E𝑖 ) = −( ˜s1 mod 𝑞 2) · gT 

> 𝑧

+∑︁   

> 𝑖 ∈ [ 𝑘 ]

𝑥 𝑖 −1E𝑖 ∈ 𝑅 𝑛 ×𝑡 𝑑 1,𝑞 2

Let E = Í𝑖 ∈ [ 𝑘 ] 𝑥 𝑖 −1E𝑖 . Then, over the rationals, we have 

−𝜅 (˜s2)wT 

> 1

+ W2 = −˜s1 · gT 

> 𝑧

+ E + 𝚵 𝑞 2,

43 where 𝚵 ∈ 𝑅 𝑛 ×𝑡 𝑑 1 . Substituting back into Eq. (C.4), we have over the rationals, 

j

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 3 + ˆc′ 

> 2

= 𝑞 3

𝑞 2

 −𝜅 (˜s2)wT 

> 1

+ W2

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ 𝑞 3

𝑞 1

c2 + ξ1𝑞 3 + e⌊·⌉ ,1 + e⌊·⌉ ,2

= 𝑞 3

𝑞 2

 −˜s1gT 

> 𝑧

+ E + 𝚵 𝑞 2

g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ 𝑞 3

𝑞 1

c2 + ξ1𝑞 3 + e⌊·⌉ ,1 + e⌊·⌉ ,2

= 𝑞 3

𝑞 2



−˜s1

j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



+ 𝑞 3

𝑞 1

c2 +



ξ1 + 𝚵 g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

𝑞 3

+ 𝑞 3

𝑞 2



Eg −1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

+ e⌊·⌉ ,1 + e⌊·⌉ ,2

= 𝑞 3

𝑞 2



−˜s1

j 𝑞 2 

> 𝑞 1

𝑐 1

m 

+ 𝑞 3

𝑞 1

c2 +



ξ1 + ξ2 + 𝚵 g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

𝑞 3

+ 𝑞 3

𝑞 2



Eg −1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

+ e⌊·⌉ ,1 + e⌊·⌉ ,2,

(C.5) where ξ2 ∈ 𝑅 𝑛 𝑑 1 . Still working over the rationals, we can write 

𝑞 3

𝑞 2



−˜s1

j 𝑞 2 

> 𝑞 1

𝑐 1

m 

+ 𝑞 3

𝑞 1

c2 = 𝑞 3

𝑞 2



−˜s1

 𝑞 2 

> 𝑞 1

𝑐 1 + 𝑒 ⌊·⌉ ,3

 

+ 𝑞 3

𝑞 1

c2, (C.6) where |𝑒 ⌊·⌉ ,3 | ≤ 1/2 is another rounding error. By assumption, c is a RLWE encoding of ⌊𝑞 1/𝑝 ⌋ m with respect to 

S1 and error e. This means −˜s1𝑐 1 + c2 = ⌊𝑞 1/𝑝 ⌋ m + e ∈ 𝑅 𝑛 𝑑 1,𝑞 1 . Equivalently, over 𝑅 𝑑 1 , we can write 

−˜s1𝑐 1 + c2 = ⌊𝑞 1/𝑝 ⌋ m + e + ξ3𝑞 1,

where ξ3 ∈ 𝑅 𝑛 𝑑 1 . Thus, we can rewrite Eq. (C.6) (over the rationals) as 

𝑞 3

𝑞 2



−˜s1

j 𝑞 2 

> 𝑞 1

𝑐 1

m 

+ 𝑞 3

𝑞 1

c2 = 𝑞 3

𝑞 2



−˜s1

 𝑞 2 

> 𝑞 1

𝑐 1 + 𝑒 ⌊·⌉ ,3

 

+ 𝑞 3

𝑞 1

c2

= 𝑞 3

𝑞 1

(− ˜s1𝑐 1 + c2) − 𝑞 3

𝑞 2

˜s1𝑒 ⌊·⌉ ,3

= 𝑞 3

𝑞 1

(⌊ 𝑞 1/𝑝 ⌋m + e + ξ3𝑞 1) − 𝑞 3

𝑞 2

˜s1𝑒 ⌊·⌉ ,3

= 𝑞 3

𝑞 1

⌊𝑞 1/𝑝 ⌋m + 𝑞 3

𝑞 1

e + ξ3𝑞 3 − 𝑞 3

𝑞 2

˜s1𝑒 ⌊·⌉ ,3

Let ˆξ =



ξ1 + ξ2 + ξ3 + 𝚵 g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

∈ 𝑅 𝑛 𝑑 1 . Then, Eq. (C.5) becomes (over the rationals) 

j

−𝑞 3

> 𝑞 3

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 2 + ˆc′ 

> 2

= 𝑞 3

𝑞 2



−˜s1

j 𝑞 2 

> 𝑞 1

𝑐 1

m 

+ 𝑞 3

𝑞 1

c2 +



ξ1 + ξ2 + 𝚵 g−1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

𝑞 3

+ 𝑞 3

𝑞 2



Eg −1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

+ e⌊·⌉ ,1 + e⌊·⌉ ,2

= 𝑞 3

𝑞 1

⌊𝑞 1/𝑝 ⌋m + ˆξ𝑞 3 + 𝑞 3

𝑞 1

e − 𝑞 3

𝑞 2

˜s1𝑒 ⌊·⌉ ,3

+ 𝑞 3

𝑞 2



Eg −1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2

 

+ e⌊·⌉ ,1 + e⌊·⌉ ,2

= 𝑞 3

𝑞 1

𝑞 1

𝑝 



m + ˆξ𝑞 3 + 𝑞 3

𝑞 1

e + 𝑞 3

𝑞 2



Eg −1

> 𝑧

 j 𝑞 2 

> 𝑞 1

𝑐 1

m

mod 𝑞 2



− ˜s1𝑒 ⌊·⌉ ,3

| {z }

> e′
> 2

+e⌊·⌉ ,1 + e⌊·⌉ ,2.

(C.7) 44 Finally, we can write ⌊𝑞 1/𝑝 ⌋ = 𝑞 1/𝑝 − ( 𝑞 1 mod 𝑝 )/ 𝑝 . Then Eq. (C.7) becomes (over the rationals) 

j

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 3 + ˆc′ 

> 2

= 𝑞 3

𝑞 1

𝑞 1

𝑝 



m + ˆξ𝑞 3 + e′ 

> 2

+ e⌊·⌉ ,1 + e⌊·⌉ ,2

=

𝑞 3

𝑞 1

· 𝑞 1

𝑝 − 𝑞 3

𝑞 1

· 𝑞 1 mod 𝑝 𝑝 



m + ˆξ𝑞 3 + e′ 

> 2

+ e⌊·⌉ ,1 + e⌊·⌉ ,2

=

𝑞 3

𝑝 



m + ˆξ𝑞 3 +

𝑞 3 mod 𝑝 𝑝 − 𝑞 3 (𝑞 1 mod 𝑝 )

𝑝𝑞 1



m + e⌊·⌉ ,1 + e⌊·⌉ ,2

| {z }

> e′
> 1

+e′

> 2

.

(C.8) Furthermore, the terms in Eq. (C.8) are all in 𝑅 𝑑 1 , so the equation holds over 𝑅 𝑑 1 , and thus over 𝑅 𝑑 1,𝑞 3 as well. Combining Eqs. (C.3) and (C.8) and using linearity of 𝜋 𝜈 (Lemma A.11), we have (over 𝑅 𝑑 1,𝑞 3 now) 

𝜅 (z) = 𝜋 𝜈 

 j 

−𝑞 3

> 𝑞 2

 𝜅 (˜s2) · ˆ𝑐 ′

> 1

m

mod 𝑞 3 + ˆc′

> 2



=

𝑞 3

𝑝 



𝜋 𝜈 (m) + 𝜋 𝜈 (e′

> 1

) + 𝜋 𝜈 (e′

> 2

) ∈ 𝑅 𝑛 𝑑 1,𝑞 3 .

Applying the inversion map 𝜅 −1 to both sides and appealing to Lemma A.11 (i.e., for all 𝑟 ∈ 𝑅 𝑑 1 , 𝜅 −1 (𝜋 𝜈 (𝑟 )) =

𝜅 −1 (𝜅 (𝜅 −1 (𝑟 ))) = 𝜅 −1 (𝑟 )), we have 

z =

𝑞 3

𝑝 



𝜅 −1 (m) + 𝜅 −1 (e′

> 1

) + 𝜅 −1 (e′

> 2

).

The claim now holds by setting ˜e1 = 𝜅 −1 (e′

> 1

) and ˜e2 = 𝜅 −1 (e′

> 2

). By construction of 𝜅 −1, for all 𝑟 ∈ 𝑅 𝑑 1 , the coefficients of the polynomial 𝜅 −1 (𝑟 ) are a subset of the coefficients of 𝑟 . Since ∥m∥∞ ≤ 𝑝 /2, we can bound ∥ ˜e1 ∥∞ from Eq. (C.8) by 

∥ ˜e1 ∥∞ ≤ ∥ e′ 

> 1

∥∞ ≤ 12



𝑞 3 mod 𝑝 + 𝑞 3 (𝑞 1 mod 𝑝 )

𝑞 1

+ 2



.

Next, consider the components of e′ 

> 2

from Eq. (C.7). Since the components of E are subgaussian with parameter 𝜎 𝜒 and moreover, 𝐵 = ∥g−1 

> 𝑧

(⌊ 𝑞 2/𝑞 1 · 𝑐 1⌉ mod 𝑞 2)∥ 2, we conclude by Lemma A.1 that the components of Eg −1 

> 𝑧

(⌊ 𝑞 2/𝑞 1 · 𝑐 1⌉ mod 

𝑞 2) are subgaussian with variance 𝜎 2 

> 𝜒

𝐵 2. Then, under the independence heuristic, the components of e′ 

> 2

are subgaussian with variance 

˜𝜎 2 = 𝑞 23

𝑞 21

𝜎 2 

> 𝑒

+ 𝑞 23

4𝑞 22

𝑑 1𝜎 2 

> 𝑠

+ 𝑞 23

𝑞 22

𝜎 2 

> 𝜒

𝐵 2.

Again by construction of 𝜅 −1, the same then holds for the coefficients of ˜e2 = 𝜅 −1 (e2). □

Remark C.5 (Tighter Gadget Bound) . In Theorem C.4, the final error variance is stated in terms of the bound 

𝐵 = g−1 

> 𝑧

(⌊ 𝑞 2/𝑞 1 · 𝑐 1⌉ mod 𝑞 2) 2. The trivial bound is 𝐵 ≤ √𝑡𝑑 1 · 𝑧 /2. However, in many cases, this bound will be loose since “many” of the coefficients of g−1 

> 𝑧

(·) will be much smaller than 𝑧 /2. Concretely, suppose 𝑧 = 2 and consider the distribution of uT B g−1 

> 𝑧

(𝑦 ) where 𝑦 r

← 𝑅 𝑑 1,𝑞 2 . First, consider the case where 𝑞 2 is a power-of-two. In this case, the coefficients in each component 𝑢 1, . . . , 𝑢 𝑡 ∈ 𝑅 𝑑 1 is an independent Bernoulli variable with probability 1/2.Correspondingly, the ℓ2 norm of u is a sum of 𝑑 1𝑡 independent Bernoulli random variables (i.e., a binomial random variable). In this case, it is easy to calculate the exact probability that ∥u∥2 exceeds a certain threshold. Concretely, when 𝑑 1 = 2048 , we can show that with probability at least 1 − 2−48 .4, ∥u∥2 ≤ √𝑡 · 2048 · 𝜂 where 𝜂 = 1200 /2048 .Next, observe that in the case where 𝑞 2 is not a power-of-two, then the coefficients of 𝑦 r

← 𝑅 𝑑 1,𝑞 2 can only decrease ,which can only reduce the probability that ∥u∥2 exceeds the bound 𝐵 = √𝑡 · 2048 · 𝜂 . We use this tighter bound in the final step of our correctness analysis (Appendix D.1). Note that this analysis assumes that the distribution of 𝑦 

(in the scheme, the distribution of ⌊𝑞 2/𝑞 1 · 𝑐 1⌉ mod 𝑞 2) is uniform over 𝑅 𝑛 𝑑 2,𝑞 2 . We can ensure this by “re-randomizing” 

𝑐 1. Namely, we include in the public parameters a fresh encoding 𝑐 ′ of 0 (which is pseudorandom under RLWE). The algorithm then applies the compression algorithm to the encoding 𝑐 1 + 𝑐 ′, which encodes the same underlying value, but whose distribution is computationally indistinguishable from uniform. 45 D Correctness and Security of Respire 

In this section, we prove the correctness and security of the Respire protocol (Construction 3.3). Since the base version of Respire (Construction 3.2) is a special case (in fact, a sub-protocol) of the batched version of Respire 

(Construction 3.3), we focus exclusively on the batched version in our correctness and security analysis. 

## D.1 Correctness Analysis for Respire 

We use the parameters from Construction 3.3. In the following, for (𝑖, 𝑗 ) ∈ {( 1, 2), (1, 3), (2, 3)} , we write 𝜅 𝑑 𝑖 ,𝑑 𝑗 : 𝑅 𝑑 𝑗 →

𝑅 𝑑 𝑖 and 𝜅 −1  

> 𝑑 𝑖 ,𝑑 𝑗

: 𝑅 𝑑 𝑖 → 𝑅 𝑑 𝑗 to denote the subring embedding and the dimension-reduction mappings, respectively (Definition A.9). Let 𝑁 be the number of database records and 𝑇 = 𝑛 vec · ( 𝑑 2/𝑑 3) be the batch size. Assume the plaintext modulus 𝑝 divides 𝑞 3. Suppose the following properties hold for the error distributions appearing in Construction 3.3: 

• Suppose 𝜒 1,𝑒 , 𝜒 ′

> 1,𝑒

, 𝜒 2,𝑒 are subgaussian with variances 𝜎 21,𝑒 , (𝜎 ′ 

> 1,𝑒

)2, and 𝜎 22,𝑒 , respectively. 

• Suppose 𝜒 1,𝑠 is 𝐵 1,𝑠 -bounded and 𝜒 ′ 

> 1,𝑠

is subgaussian with variance (𝜎 ′ 

> 1,𝑠

)2.We also define the decomposition bases used in each of the underlying algorithms: 

• Let 𝑧 GSW be the GSW decomposition base and 𝑡 GSW = ⌊log 𝑧 GSW 𝑞 1⌋ + 1.

• Let 𝑧 coeff ,RLWE , 𝑧 coeff ,GSW , 𝑧 conv be the decomposition bases for query packing (Construction B.6) and 𝑡 coeff ,RLWE =

⌊log 𝑧 coeff ,RLWE 𝑞 1⌋ + 1, 𝑡 coeff ,GSW = ⌊log 𝑧 coeff ,GSW 𝑞 1⌋ + 1, and 𝑡 conv = ⌊log 𝑧 conv 𝑞 1⌋ + 1.

• Let 𝑧 proj be the decomposition base used for projection (Construction A.7) and 𝑡 proj = ⌊log 𝑧 proj 𝑞 1⌋ + 1.

• Let 𝑧 vec be the decomposition base used for vectorization (Construction C.1) and 𝑡 vec = ⌊log 𝑧 vec 𝑞 1⌋ + 1.

• Let 𝑧 comp be the decomposition base used for response compression (Construction C.3) and 𝑡 comp = ⌊log 𝑧 comp 𝑞 2⌋ + 

1.Take any collection of records 𝑟 𝛼,𝛽,𝛾 ∈ 𝑅 𝑑 3,𝑝 where 𝛼 ∈ [ 2𝜈 1 ], 𝛽 ∈ [ 2𝜈 2 ], and 𝛾 ∈ [ 2𝜈 3 ]. Take any collection of indices 

idx 1, . . . , idx 𝑇 , where idx 𝑘 = (𝛼 𝑘 , 𝛽 𝑘 , 𝛾 𝑘 ). Suppose we now sample the following: 

 (pp qpk , pp proj , pp vec , pp comp ), (s1, S2) ← Setup (1𝜆 )

db =  ˜𝑟 𝛼,𝛽 𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ] ← SetupDB  1𝜆 , {𝑟 𝛼,𝛽,𝛾 }𝛼 ∈ [ 2𝜈 1 ],𝛽 ∈ [ 2𝜈 2 ],𝛾 ∈ [ 2𝜈 3 ]



q = (q1, . . . , q𝑇 ) ← Query (qk , idx 1, . . . , idx 𝑏 )

a ← Answer (pp , q)(resp 1, . . . , resp 𝑇 ) ← Extract (qk , a).

We now show that with high probability for a given 𝑘 ∈ [ 𝑇 ], the decoded response resp 𝑘 satisfies resp 𝑘 = 𝑟 𝛼 𝑘 ,𝛽 𝑘 ,𝛾 𝑘 .Take any index 𝑘 ∈ [ 𝑇 ]. Our analysis follows the steps of the Answer algorithm in Construction 3.3. Specifically, we analyze the variance of the error in the encodings after each step of the computation (under the independence heuristic). In the following, we will say that an RLWE encoding (resp., a GSW encoding) has error variance 𝜎 2 if the error associated with the encoding is distributed according to a subgaussian with variance at most 𝜎 2. Following the definitions in the Query algorithm, let ˆ𝛼 𝑖 = 1 if 𝑖 = 𝛼 𝑘 and ˆ𝛼 = 0 otherwise. Let ˆ𝛽 1 · · · ˆ𝛽 𝜈 2 be the binary representation of 𝛽 𝑘 − 1 and ˆ𝛾 1 · · · ˆ𝛾 𝜈 3 be the binary representation of 𝛾 𝑘 − 1. We now consider each step of the Answer algorithm. 1. Query expansion: Let 

 

c(1) 

> 1

, . . . , c(1)

> 2𝜈 1



,



C(2) 

> 1

, . . . , C(2) 

> 𝜈 2

, C(3) 

> 1

, . . . , C(3)

> 𝜈 3

 

← QueryUnpack (pp qpk , q𝑘 ).

be the output of the query expansion algorithm on query q𝑘 . By Theorem B.7, the following holds: 46 • For all 𝑖 ∈ [ 2𝜈 1 ], c(1) 

> 𝑖

is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · ˆ𝛼 𝑖 with error variance 

𝜎 2 

> RLWE

= 𝜎 21,𝑒 (1 + 𝑡 coeff ,RLWE 𝑑 31𝑧 2

> coeff ,RLWE

/12 ).

• Each C(2) 

> 𝑖

is a GSW encoding of ˆ𝛽 𝑖 with error variance 

𝜎 2 

> GSW

= 𝜎 21,𝑒 (𝑑 1𝐵 21,𝑠 (1 + 𝑡 coeff ,GSW 𝑑 31𝑧 2

> coeff ,GSW

/12 ) + 𝑡 conv 𝑑 1𝑧 2

> conv

/2).

• Each C(3) 

> 𝑖

is a GSW encoding of ˆ𝛾 𝑖 with error variance 𝜎 2

> GSW

.All of these encodings are with respect to the secret key s1. Unless otherwise noted, all encodings in the subsequent description are with respect to s1.2. First dimension: The Answer algorithm computes ˆc(1) 

> 𝛽

= Í𝛼 ∈ [ 2𝜈 1 ] ˜𝑟 𝛼,𝛽 · c(1) 

> 𝛼

for each 𝛽 ∈ [2𝜈 2 ]. Since 

∥𝑟 𝛼,𝛽 ∥∞ ≤ 𝑝 /2, this means that ˆc(1) 

> 𝛽

is an encoding of ⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 with error variance 

𝜎 2 

> first

= 2𝜈 1𝑑 1 (𝑝 /2)2𝜎 2

> RLWE

.

3. Folding: Next, the Answer algorithm sets ˆc(2) 

> 0,𝑗

= ˆc(1) 

> 𝑗

for each 𝑗 ∈ [ 2𝜈 2 ]. Then, for each 𝑟 ∈ [ 𝜈 2] and 𝑗 ∈ [ 2𝜈 2 −𝑟 ],it computes 

ˆc(2) 

> 𝑟,𝑗

= Select 



C(2) 

> 𝑟

, ˆc(2)  

> 𝑟 −1,𝑗

, ˆc(2)  

> 𝑟 −1,𝑗 +2𝜈 2−𝑟



.

Thus, the following properties hold: 

• From the previous step, we have that ˆc(2) 

> 0,𝑗

is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 with error variance 𝜎 2

> first

.

• From Theorem A.3, for each 𝑟 ∈ [ 𝜈 2] and 𝑗 ∈ [ 2𝜈 2 −𝑟 ], we have that ˆc(2) 

> 𝑟,𝑗

is an RLWE encoding of 

⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝑗 +Í𝑖 ∈ [ 𝑟 ] ˆ𝛽 𝑖 2𝜈 2 −𝑖 

with error variance 𝜎 2 

> first

+ 𝑟 · 2𝑡 GSW 𝑑 1𝑧 2

> GSW

𝜎 2

> GSW

/4 = 𝜎 2 

> first

+ 𝑟𝑡 GSW 𝑑 1𝑧 2

> GSW

𝜎 2

> GSW

/2.Since ˆ𝛽 1 · · · ˆ𝛽 𝜈 2 is the binary representation of 𝛽 𝑘 − 1, we have that 1 + Í𝑖 ∈ [ 𝜈 2 ] ˆ𝛽 𝑖 2𝜈 2 −𝑖 = 𝛽 𝑘 . This means that 

ˆc(2) 

> 𝜈 2,1

is an encoding of ⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 with error variance 

𝜎 2 

> fold

= 𝜎 2 

> first

+ 𝜈 2𝑡 GSW 𝑑 1𝑧 2

> GSW

𝜎 2

> GSW

/2.

4. Rotation: Next, the Answer algorithm sets ˆc(3) 

> 0

= ˆc(2)

> 𝜈 2,1

, and for each 𝑟 ∈ [ 𝜈 3], it computes 

ˆc(3) 

> 𝑟

= Select 



C(3) 

> 𝑟

, ˆc(3) 

> 𝑟 −1

, 𝑥 −2𝜈 3 −𝑟 

· ˆc(3) 

> 𝑟 −1



.

Similar to the previous case, we can appeal to Theorem A.3: 

• First, ˆc(3) 

> 0

is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 .

• From Theorem A.3, for each 𝑟 ∈ [ 𝜈 2], we have that ˆc(3) 

> 𝑟

is an RLWE encoding of 

⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 ·

Ö  

> 𝑖 ∈ [ 𝑟 ]

𝑥 − ˆ𝛾 𝑖 2𝜈 3 −𝑖 

= ⌊𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 · 𝑥 Í𝑖 ∈ [ 𝑟 ] − ˆ𝛾 𝑖 2𝜈 3 −𝑖 

with error variance 𝜎 2 

> fold

+ 𝑟 · 2𝑡 GSW 𝑑 1𝑧 2

> GSW

𝜎 2

> GSW

/4 = 𝜎 2 

> fold

+ 𝑟𝑡 GSW 𝑑 1𝑧 2

> GSW

𝜎 2

> GSW

/2.47 Since ˆ𝛾 1 · · · ˆ𝛾 𝜈 3 is the binary representation of 𝛾 𝑘 − 1, we have that Í𝑖 ∈ [ 𝜈 3 ] ˆ𝛾 𝑖 2𝜈 3 −𝑖 = 𝛾 𝑘 − 1. Thus, we conclude that ˆc(3)

𝜈 3 is an encoding of 𝑥 − ( 𝛾 𝑘 −1) · ⌊ 𝑞 1/𝑝 ⌋ · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 with error variance 

𝜎 2

rot = 𝜎 2

fold + 𝜈 3𝑡 GSW 𝑑 1𝑧 2

GSW 𝜎 2

GSW /2

= 𝜎 2

first + ( 𝜈 2 + 𝜈 3)𝑡 GSW 𝑑 1𝑧 2

GSW 𝜎 2

GSW /2.

5. Projection: Thus far, we have established that for all 𝑘 ∈ [ 𝑇 ], c(out )

𝑘 is an RLWE encoding of 𝑥 − ( 𝛾 𝑘 −1) · ⌊ 𝑞 1/𝑝 ⌋ · 

˜𝑟 𝛼 𝑘 ,𝛽 𝑘 with error 𝑒 single ,𝑘 , where 𝑒 single ,𝑘 is subgaussian with variance 𝜎 2

rot . In other words, it holds that 

sT

1c(out )

𝑘 = ⌊𝑞 1/𝑝 ⌋ · 𝜇 𝑘 + 𝑒 single ,𝑘 ,

where 𝜇 𝑘 = 𝑥 − ( 𝛾 𝑘 −1) · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 ∈ 𝑅 𝑑 1,𝑝 . Now, the projection algorithm computes for each 𝑘 ∈ [ 𝑇 ],

c(proj )

𝑘 ← Project  pp proj , c(out )

𝑘 , 𝛿 1 − 𝛿 3

.

By Theorem A.8 and linearity of 𝜋 𝛿 1 −𝛿 3 (see Lemma A.11), we conclude that c(proj )

𝑘 is an RLWE encoding of 

𝜋 𝛿 1 −𝛿 3 (𝜇 𝑘 ) with error 𝜋 𝛿 1 −𝛿 3 (𝑒 single ,𝑘 ) + 𝑒 proj ,𝑘 , and 𝑒 proj ,𝑘 is subgaussian with variance 

𝜎 2

proj = (4𝛿 1 −𝛿 3 − 1)/ 12 · 𝑡 proj 𝑑 1𝑧 2

proj 𝜎 21,𝑒 .

Define ˜𝜇 𝑘 B 𝜅 −1

𝑑 1,𝑑 3 (𝜇 𝑘 ) ∈ 𝑅 𝑑 3,𝑝 . By Lemma A.11, we have 

𝜅 𝑑 1,𝑑 3 ( ˜𝜇 𝑘 ) = 𝜋 𝛿 1 −𝛿 3 (𝜇 𝑘 ). (D.1) By definition of SetupDB and Lemma A.13, 

˜𝜇 𝑘 = 𝜅 −1

𝑑 1,𝑑 3 (𝜇 𝑘 ) = 𝜅 −1

𝑑 1,𝑑 3

 𝑥 − ( 𝛾 𝑘 −1) · ˜𝑟 𝛼 𝑘 ,𝛽 𝑘 

 = 𝜅 −1

𝑑 1,𝑑 3

 𝑥 − ( 𝛾 𝑘 −1) · Π  𝑟 𝛼 𝑘 ,𝛽 𝑘 ,1, . . . , 𝑟 𝛼 𝑘 ,𝛽 𝑘 ,2𝜈 3

 = 𝑟 𝛼 𝑘 ,𝛽 𝑘 ,𝛾 𝑘 . (D.2) We can similarly define ˜𝑒 single ,𝑘 B 𝜅 −1

𝑑 1,𝑑 3 (𝑒 single ,𝑘 ) so that 𝜅 𝑑 1,𝑑 3 ( ˜𝑒 single ,𝑘 ) = 𝜋 𝛿 1 −𝛿 3 (𝑒 single ,𝑘 ). By construction of the projection map, ˜𝑒 single ,𝑘 is also subgaussian with variance 𝜎 2

rot .6. Repacking: Next, for each 𝑗 ∈ [ 𝑛 vec ], the Answer algorithm computes 

c(repack )

𝑗 =∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · c(proj )(𝑑 2/𝑑 3 ) · ( 𝑗 −1)+ 𝑖 .

Define 𝜌 𝑗 ∈ 𝑅 𝑑 1,𝑝 as follows: 

𝜌 𝑗 =∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · 𝜋 𝛿 1 −𝛿 3 (𝜇 (𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 𝑖 ) ∈ 𝑅 𝑑 1,𝑝 .

Then, we have the following: 

𝜌 𝑗 =∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · 𝜋 𝛿 1 −𝛿 3 (𝜇 (𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 𝑖 )

=∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · 𝜅 𝑑 1,𝑑 3 ( ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 𝑖 ) by Eq. (D.1) 

= 𝜅 𝑑 1,𝑑 2

 Π( ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 1, . . . , ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑗 −1) ) by Lemma A.14. (D.3) By the linear homomorphism of RLWE encodings, this means c(repack )

𝑗 is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · 𝜌 𝑗 

with error 

𝑒 repack ,𝑗 =∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑥 (𝑖 −1) · ( 𝑑 1/𝑑 2 ) · 𝜅 𝑑 1,𝑑 3 ( ˜𝑒 single ,(𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 1)

| {z }

𝑒 (1)

> repack ,𝑗

+∑︁ 

𝑖 ∈ [ 𝑑 2/𝑑 3 ]

𝑒 proj ,(𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 𝑖 

| {z }

𝑒 (2)

> repack ,𝑗

.

48 Again by Lemma A.14, we know that 

𝑒 (1) 

> repack ,𝑗

= 𝜅 𝑑 1,𝑑 2

 Π( ˜𝑒 single ,(𝑑 2/𝑑 3 ) ( 𝑗 −1)+ 1, . . . , ˜𝑒 single ,(𝑑 2/𝑑 3 ) 𝑗 ),

so it follows that 𝑒 (1) 

> repack ,𝑗

is subgaussian with variance 𝜎 2

> rot

. Also, 𝑒 (2) 

> repack ,𝑗

is subgaussian with variance 

(𝑑 2/𝑑 3)𝜎 2

> proj

. Under the independence heuristic, we conclude that each c(repack ) 

> 𝑗

is an RLWE encoding of 

⌊𝑞 1/𝑝 ⌋ · 𝜌 𝑗 with error variance 

𝜎 2 

> pack

= 𝜎 2 

> rot

+ ( 𝑑 2/𝑑 3)𝜎 2

> proj

.

7. Vectorizing: The Answer algorithm now computes 

c(vec ) ← Vectorize 



pp vec ,  c(repack ) 

> 1

, . . . , c(repack )

> 𝑛 vec



.

Let ρ B [𝜌 1 | · · · | 𝜌 𝑛 vec ]T ∈ 𝑅 𝑛 vec  

> 𝑑 1,𝑝

. By Theorem C.2, c(vec ) is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · ρ with error variance 

𝜎 2 

> vec

= 𝜎 2 

> pack

+ 𝑛 vec 𝑡 vec 𝑑 1𝑧 2 

> vec

(𝜎 ′ 

> 1,𝑒

)2/4.

Finally, the Answer algorithm sets a ← Compress (pp comp , c(vec ) ). Consider now the value of (resp 1, . . . , resp 𝑇 ) output by Extract (qk , a). By construction, the Extract algorithm first computes 

ˆr =



ˆ𝑟 1

...

ˆ𝑟 𝑛 vec 



← CompressRecover (S2, a) ∈ 𝑅 𝑛 vec  

> 𝑑 2,𝑝

.

Suppose first that 

ˆr = 𝜅 −1 

> 𝑑 1,𝑑 2

(ρ). (D.4) Fix some 𝑘 ∈ [ 𝑇 ]. Since 𝑇 = 𝑛 vec (𝑑 2/𝑑 3), we can write 𝑘 = (𝑑 2/𝑑 3)( 𝑘 2 − 1) + 𝑘 1 for some 𝑘 1 ∈ [ 𝑑 2/𝑑 3] and 𝑘 2 ∈ [ 𝑛 vec ].Then, we have 

resp 𝑘 = 𝜅 −1

> 𝑑 2,𝑑 3



𝑥 − ( 𝑘 1 −1) · ˆ𝑟 𝑘 2



= 𝜅 −1

> 𝑑 2,𝑑 3



𝑥 − ( 𝑘 1 −1) · 𝜅 −1 

> 𝑑 1,𝑑 2

(𝜌 𝑘 2 )



by Eq. (D.4) 

= 𝜅 −1

> 𝑑 2,𝑑 3



𝑥 − ( 𝑘 1 −1 · 𝜅 −1

> 𝑑 1,𝑑 2

 𝜅 𝑑 1,𝑑 2

 Π   ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑘 2 −1)+ 1, . . . , ˜𝜇 (𝑑 2/𝑑 3 )𝑘 2

 

by Eq. (D.3) 

= 𝜅 −1

> 𝑑 2,𝑑 3



𝑥 − ( 𝑘 1 −1) · Π   ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑘 2 −1)+ 1, . . . , ˜𝜇 (𝑑 2/𝑑 3 )𝑘 2



by Lemma A.10 

= ˜𝜇 (𝑑 2/𝑑 3 ) ( 𝑘 2 −1)+ 𝑘 1 by Lemma A.13 

= ˜𝜇 𝑘 = 𝑟 𝛼 𝑘 ,𝛽 𝑘 ,𝛾 𝑘 by Eq. (D.2) .

Thus, when Eq. (D.4) holds, the recovered response resp 𝑘 is the desired record. 

Bounding the probability of Eq. (D.4). Now, we determine the probability that Eq. (D.4) holds. Let z ←

CompressRecover (S2, a) ∈ 𝑅 𝑛 vec  

> 𝑑 2,𝑞 3

. First, c(vec ) is an RLWE encoding of ⌊𝑞 1/𝑝 ⌋ · ρ with error variance 𝜎 2

> vec

. Then, by Theorem C.4, z = ⌊𝑞 3/𝑝 ⌋ · 𝜅 −1 

> 𝑑 1,𝑑 2

(ρ) + ˜e1 + ˜e2 where 

∥ ˜e1 ∥∞ ≤ 12

 2 + ( 𝑞 3 mod 𝑝 ) + 𝑞 3

𝑞 1

(𝑞 1 mod 𝑝 ) = 12

 2 + 𝑞 3 

> 𝑞 1

(𝑞 1 mod 𝑝 )| {z }

> 𝐵 final

,

49 since we assume that 𝑝 divides 𝑞 3. In addition, ˜e2 is subgaussian with variance 

𝜎 2 

> resp

= 𝑞 23

𝑞 21

𝜎 2 

> vec

+ 𝑞 23

4𝑞 22

𝑑 1 (𝜎 ′ 

> 1,𝑠

)2 + 𝑞 23

𝑞 22

𝜎 22,𝑒 𝐵 2

> comp

,

and 𝐵 comp is a bound on g−1 

> 𝑧 comp

(⌊ 𝑞 2/𝑞 1 · 𝑐 (vec ) 

> 1

⌉ mod 𝑞 2) 2, where 𝑐 (vec ) 

> 1

∈ 𝑅 𝑑 1,𝑞 1 is the first component of c(vec ) .8 Finally, by Theorem 2.4, Eq. (D.4) holds as long as ∥ ˜e1 + ˜e2 ∥∞ < 𝑞 3 

> 2𝑝

− ( 𝑞 3 mod 𝑝 ) = 𝑞 3 

> 2𝑝

. By the triangle inequality, it suffices to bound the probability that ∥ ˜e2 ∥ < 𝑞 3 

> 2𝑝

− 𝐵 final . Since ˜e2 ∈ 𝑅 𝑛 vec  

> 𝑑 2

is subgaussian with variance 𝜎 2

> resp

, we use a subgaussian tail bound together with a union bound to conclude that 

Pr ∀𝑘 ∈ [ 𝑇 ] : resp 𝑘 = 𝑟 𝛼 𝑘 ,𝛽 𝑘 ,𝛾 𝑘 

 ≤ Pr 



∥ ˜e2 ∥∞ < 𝑞 3

2𝑝 − 𝐵 final 



≤ 1 − 2𝑑 2𝑛 vec exp −𝜋 (𝑞 3/2𝑝 − 𝐵 final )2

𝜎 2

> resp

!

. (D.5) We can also consider the single-query correctness error (i.e., the probability that the record for a specific index 𝑘 ∗ ∈ [ 𝑇 ]

is correct). In this case, we only require the 𝑑 3 coefficients that determine resp 𝑘 ∗ to be correct. Thus, for any 𝑘 ∗ ∈ [ 𝑇 ],we have 

Pr resp 𝑘 ∗ = 𝑟 𝛼 𝑘 ∗ ,𝛽 𝑘 ∗ ,𝛾 𝑘 ∗

 ≤ 1 − 2𝑑 3 exp −𝜋 (𝑞 3/2𝑝 − 𝐵 final )2

𝜎 2

> resp

!

. (D.6) In our evaluation of Respire for batch queries (Section 4.3), we choose our parameters to target a fixed single-query 

error rate (specifically, a single-query error rate of at most 2−40 ). This provides a common baseline to compare the performance for instantiations with different batch sizes. 

## D.2 Security of Respire 

Similar to previous PIR protocols [ACLS18, AYA +21, MCR21, MW22a, MR23, LMRS24, MW24] based on the RLWE assumption, the security of Respire relies on a circular security or key-dependent message (KDM) security where RLWE encodings are pseudorandom even given encodings of functions of the secret key. We state the specific assumption we use below (adapted from [MW24]): 

Definition D.1 (Key-Dependent Pseudorandomness of RLWE Encodings) . Let 𝜆 be a security parameter, 𝑑 = 𝑑 (𝜆 ) be a power-of-two, 𝑚 = 𝑚 (𝜆 ) be the number of samples, 𝑞 = 𝑞 (𝜆 ) be an encoding modulus, and 𝜒 𝑠 = 𝜒 𝑠 (𝜆 ), 𝜒 𝑒 = 𝜒 𝑒 (𝜆 )

be error distributions over 𝑅 𝑑 = Z[𝑥 ]/( 𝑥 𝑑 + 1). Let F be an efficiently-computable set of functions from 𝑅 𝑑,𝑞 to 𝑅 𝑑,𝑞 .For a bit 𝑏 ∈ { 0, 1} and an adversary A, let 

𝑊 𝑏 B Pr 

"

A O (·) (1𝜆 , a, t𝑏 ) : 𝑠 ← 𝜒 𝑠 , a r

← 𝑅 𝑛 𝑑,𝑞 , e ← 𝜒 𝑚 𝑒 

t0 = 𝑠 a + e, t1 r

← 𝑅 𝑚 𝑑,𝑞 

#

,

where the oracle O takes as input a function 𝑓 ∈ F and outputs (𝑎, 𝑠𝑎 + 𝑒 + 𝑓 (𝑠 )) where 𝑎 r

← 𝑅 𝑑,𝑞 and 𝑒 ← 𝜒 𝑒 . We say that the key-dependent pseudorandomness of RLWE encodings holds with parameters (𝑑, 𝑚, 𝑞, 𝜒 𝑠 , 𝜒 𝑒 ) if for all efficient adversaries A, there exists a negligible function negl (·) such that for all 𝜆 ∈ N, |𝑊 0 − 𝑊 1 | = negl (𝜆 ).

Function families. The security of Respire relies on RLWE with key-dependent pseudorandomness with respect to the family of automorphisms (since the public parameters in Respire consists of encodings of automorphisms of the se-cret key) as well as the family of quadratic functions (since the RLWE-to-GSW conversion parameters consists of an en-coding of an encoding of a quadratic function of the secret key). 9 We define the two function families we consider below:               

> 8A trivial bound for 𝐵 comp is √︁ 𝑡 comp 𝑑 1·𝑧 comp /2. When 𝑐 (vec )
> 1is pseudorandom and 𝑧 comp =2, we can get a tighter bound on 𝐵 comp . We refer to Remark C.5 for more details.
> 9Note that we could also modify the scheme to use different keys for the RLWE and the GSW encodings. In this case, we would only need key-dependent pseudorandomness against linear functions.

50 Definition D.2 (Scaled Automorphisms) . Let 𝑅 𝑑,𝑞 = Z𝑞 [𝑥 ]/( 𝑥 𝑑 + 1) be a polynomial ring with modulus 𝑞 and dimension 𝑑 . We define the family of (scaled) automorphisms over 𝑅 𝑑,𝑞 to be 

Fauto B 𝑟 ↦ → 𝑘 · 𝜏 ℓ (𝑟 ) : 𝑘 ∈ Z𝑞 , ℓ ∈ N ,

where 𝜏 ℓ : 𝑅 𝑑,𝑞 → 𝑅 𝑑,𝑞 is the Frobenius automorphism that maps 𝑓 (𝑥 ) ↦ → 𝑓 (𝑥 ℓ ).

Definition D.3 (Quadratic Functions) . Let 𝑅 𝑑,𝑞 = Z𝑞 [𝑥 ]/( 𝑥 𝑑 + 1) be a polynomial ring with modulus 𝑞 and dimension 

𝑑 . We define the family of quadratic functions over 𝑅 𝑑,𝑞 to be 

Fquad B 𝑟 ↦ → 𝛼 0 + 𝛼 1𝑟 + 𝛼 2𝑟 2 : 𝛼 0, 𝛼 1, 𝛼 2 ∈ Z𝑞 .

Security of Respire . We now give the formal security proof for the Respire protocol. 

Theorem D.4 (Respire Security) . Let 𝑑 1, 𝑑 2, 𝑞 1, 𝑞 2, 𝑞 3, 𝜒 1,𝑒 , 𝜒 1,𝑠 , 𝜒 ′

> 1,𝑒

, 𝜒 ′

> 1,𝑠

, 𝜒 2,𝑒 , 𝜒 2,𝑠 be the lattice parameters from Con-struction 3.3. We also define the decomposition bases used in each of the underlying algorithms: 

• Let 𝑧 GSW be the GSW decomposition base and 𝑡 GSW = ⌊log 𝑧 GSW 𝑞 1⌋ + 1.

• Let 𝑧 coeff ,RLWE , 𝑧 coeff ,GSW , 𝑧 conv be the decomposition bases for query packing (Construction B.6) and 𝑡 coeff ,RLWE =

⌊log 𝑧 coeff ,RLWE 𝑞 1⌋ + 1, 𝑡 coeff ,GSW = ⌊log 𝑧 coeff ,GSW 𝑞 1⌋ + 1, and 𝑡 conv = ⌊log 𝑧 conv 𝑞 1⌋ + 1.

• Let 𝑧 proj be the decomposition base used for projection (Construction A.7) and 𝑡 proj = ⌊log 𝑧 proj 𝑞 1⌋ + 1.

• Let 𝑧 vec be the decomposition base used for vectorization (Construction C.1) and 𝑡 vec = ⌊log 𝑧 vec 𝑞 1⌋ + 1.

• Let 𝑧 comp be the decomposition base use for compression (Construction C.3) and 𝑡 comp = ⌊log 𝑧 comp 𝑞 2⌋ + 1.Let 𝑛 vec be the vector length used for vectorization. Let 𝑄 be a bound on the number of queries the adversary makes in the query privacy game. Suppose that the following assumptions hold: 

• Key-dependent pseudorandomness of RLWE with parameters (𝑑 1, 2𝑄, 𝑞 1, 𝜒 1,𝑠 , 𝜒 1,𝑒 ) and with respect to the family of automorphisms Fauto (Definition D.2) and quadratic functions Fquad (Definition D.3). 

• RLWE 𝑑 1,𝑛 vec 𝑡 vec , 𝑞 1, 𝜒 ′

> 1,𝑠

, 𝜒 ′ 

> 1,𝑒

.

• RLWE 𝑑 2,𝑘𝑡 comp ,𝑞 2,𝜒 2,𝑠 ,𝜒 2,𝑒 , where 𝑘 = 𝑑 1/𝑑 2.Then, Construction 3.3 satisfies query privacy for all adversaries making at most 𝑄 queries. Proof. We start by defining a sequence of hybrid experiments, each parameterized by a bit 𝑏 ∈ { 0, 1}:

• Hyb (𝑏 ) 

> 0

: This is the normal query privacy experiment with bit 𝑏 ∈ { 0, 1}. Namely, the challenger first samples 

(pp , qk ) ← Setup (1𝜆 ) and gives pp to A. Specifically, the challenger samples ˜𝑠 1 ← 𝜒 1,𝑠 and two target keys 

˜s′ 

> 1

← ( 𝜒 ′ 

> 1,𝑠

)𝑛 vec and ˜s2 ← 𝜒 𝑛 vec  

> 2,𝑠

. Define 

s1 = [− ˜𝑠 1 | 1]T ∈ 𝑅 2 

> 𝑑 1,𝑞 1

and S′ 

> 1

= [− ˜s′ 

> 1

| I𝑛 vec ]T ∈ 𝑅 (𝑛 vec +1) × 𝑛 vec  

> 𝑑 1,𝑞 1

and S2 = [− ˜s2 | I𝑛 vec ]T ∈ 𝑅 (𝑛 vec +1) × 𝑛 vec  

> 𝑑 2,𝑞 2

.

The challenger then samples parameters for query packing, projection, vectorization, and response packing: 

– pp qpk ← QueryPackSetup (1𝜆 , s1).

– pp proj ← ProjectSetup (1𝜆 , s1).

– pp vec ← VecSetup (1𝜆 , s1, S′

> 1

).

– pp comp ← CompressSetup (1𝜆 , S′

> 1

, S2).Concretely, the challenger samples the following: 51 – pp qpk : The query compression parameters pp qpk consists of three additional sets of public parame-ters pp coeff ,RLWE , pp coeff ,GSW , and pp conv . Specifically, for each 𝑗 ∈ [ 0, 𝛿 1 − 1], the challenger samples 

Wcoeff ,RLWE ,𝑗 ← AutomorphSetup  1𝜆 , s1, 𝜏 𝑑 1/2𝑗 +1

 and Wcoeff ,GSW ,𝑗 ← AutomorphSetup  1𝜆 , s1, 𝜏 𝑑 1/2𝑗 +1

.The coefficient-expansion parameters are then 

pp coeff ,RLWE =  Wcoeff ,RLWE ,0, . . . , Wcoeff ,RLWE ,𝛿 1 −1



pp coeff ,GSW =  Wcoeff ,GSW ,0, . . . , Wcoeff ,GSW ,𝛿 1 −1

.

Finally, the challenger computes 

pp conv = Vconv =

 aT

> conv

˜𝑠 1aT 

> conv

+ eT 

> conv

− ˜𝑠 1 (sT 

> 1

⊗ gT 

> 𝑧 conv

)



∈ 𝑅 2×2𝑡 conv  

> 𝑑 1,𝑞 1

.

– pp proj : For each 𝑗 ∈ [ 0, 𝛿 1 − 1], the challenger samples Wproj ,𝑗 ← AutomorphSetup  1𝜆 , s1, 𝜏 𝑑 1/2𝑗 +1

 and sets pp proj = (Wproj ,0, . . . , Wproj ,𝛿 1 −1).

– pp vec : For each 𝑖 ∈ [ 𝑛 vec ], the challenger sets 

Vvec ,𝑖 =

 aT

> vec ,𝑖

˜s′

> 1

aT 

> vec ,𝑖

+ Evec ,𝑖 − ˜𝑠 1u𝑖 gT

> 𝑧 vec



∈ 𝑅 (𝑛 vec +1) × 𝑡 vec  

> 𝑑 1,𝑞 1

.

– pp comp : The challenger samples a1, . . . , a𝑘 r

← 𝑅 𝑡 comp  

> 𝑑 2,𝑞 2

and E1, . . . , E𝑘 ← 𝜒 𝑛 vec ×𝑡 comp  

> 2,𝑒

, where 𝑘 = 𝑑 2/𝑑 1. It then sets 

Wcomp =

 Π(aT

> 1

, . . . , aT 

> 𝑘

)

Π(˜s2aT 

> 1

+ E1, . . . , ˜s2aT 

> 𝑘

+ E𝑘 ) − ( ˜s′ 

> 1

mod 𝑞 2) · gT

> 𝑧 comp



∈ 𝑅 (𝑛 vec +1) × 𝑡 comp  

> 𝑑 1,𝑞 2

.

The challenger sets qk = (s1, S2) and pp = (pp qpk , pp proj , pp vec , pp comp ). When algorithm A makes a query on a pair of indices (idx 0, idx 1), the challenger replies with q ← Query (qk , idx 𝑏 ).10 Specifically, the challenger parses idx 𝑏 = (𝛼, 𝛽, 𝛾 ) ∈ [ 2𝜈 1 ] × [ 2𝜈 2 ] × [ 2𝜈 3 ], let ˆ𝛼 𝑖 = 1 if 𝑖 = 𝛼 and 0 otherwise. Let ˆ𝛽 1 · · · ˆ𝛽 𝜈 2 be the binary representation of 𝛽 − 1 and ˆ𝛾 1 · · · ˆ𝛾 𝜈 3 be the binary representation of 𝛾 − 1. It sets the query to be 

q ← QueryPack  s1, (⌊ 𝑞 1/𝑝 ⌋ · ˆ𝛼 1, . . . , ⌊𝑞 1/𝑝 ⌋ · ˆ𝛼 2𝜈 1 ), ( ˆ𝛽 1, . . . , ˆ𝛽 𝜈 2 , ˆ𝛾 1, . . . , ˆ𝛾 𝜈 3 ).

The query q = (enc 1, enc 2) where enc 1 = c1 ∈ 𝑅 2 

> 𝑑 1,𝑞 1

and enc 2 = c2 ∈ 𝑅 2 

> 𝑑 1,𝑞 1

are RLWE encodings under s1. After 

A finishes making queries, it outputs a bit 𝑏 ′ ∈ { 0, 1}, which is the output of the experiment. 

• Hyb (𝑏 ) 

> 1

: Same as Hyb (𝑏 ) 

> 0

, except the challenger samples Wcomp r

← 𝑅 (𝑛 vec +1) × 𝑡 comp  

> 𝑑 1,𝑞 2

.

• Hyb (𝑏 ) 

> 2

: Same as Hyb (𝑏 ) 

> 1

, except the challenger samples Vvec ,𝑖 r

← 𝑅 (𝑛 vec +1) × 𝑡 vec  

> 𝑑 1,𝑞 1

for all 𝑖 ∈ [ 𝑛 vec ].

• Hyb (𝑏 ) 

> 3

: Same as Hyb (𝑏 ) 

> 2

, except the challenger samples 

Vconv r

← 𝑅 2×2𝑡 conv  

> 𝑑 1,𝑞 1

, Wcoeff ,RLWE ,𝑖 r

← 𝑅 2×𝑡 coeff ,RLWE  

> 𝑑 1,𝑞 1

, Wcoeff ,GSW ,𝑖 r

← 𝑅 2×𝑡 coeff ,GSW  

> 𝑑 1,𝑞 1

, Wproj ,𝑖 r

← 𝑅 2×𝑡 proj  

> 𝑑 𝑞 ,𝑞 1

.

In response to each query, the challenger also samples c1, c2 r

← 𝑅 2 

> 𝑑 1,𝑞 1

.For an adversary A, we write Hyb (𝑏 ) 

> 𝑖

(A) to denote the output distribution of an execution of Hyb (𝑏 ) 

> 𝑖

with adversary A.Since the challenger’s behavior in Hyb (𝑏 ) 

> 3

is independent of the bit 𝑏 , we have that for all adversaries A, Hyb (0) 

> 3

(A) ≡ 

Hyb (1) 

> 3

(A) . Thus, it suffices to show that each adjacent pair of distributions are computationally indistinguishable: 

> 10

Technically, in the batch setting, the adversary can specify two lists of 𝑇 queries. However, since the real scheme generates the batch queries using 𝑇 independent invocations of the single-query scheme, we can assume without loss of generality that the adversary only queries on one index at a time. The adversary can always simulate a single query on 𝑇 indices using 𝑇 individual queries, each on a single index. 

52 Database Size ν1 ν2 ν3

256 MB 9 9 2

512 MB 9 10 2

1 GB 10 10 2

2 GB 10 11 2

4 GB 11 11 2

8 GB 11 12 2

Table 3: Database dimensions 𝜈 1, 𝜈 2, and 𝜈 3 for Respire (Construction 3.2) as a function of the database size. Each record is 256 bytes. In all of our instantiations, we set 𝑑 1 = 2048 , 𝑑 2 = 𝑑 3 = 512 , 𝑝 = 24, 𝑞 1 = 268369921 · 249561089 ≈ 256 ,

𝑞 2 = 16760833 ≈ 224 , 𝑞 3 = 28, and 𝜈 3 = log 2 (𝑑 1/𝑑 3) = 2.

• First Hyb (𝑏 ) 

> 0

(A) and Hyb (𝑏 ) 

> 1

(A) are computationally indistinguishable under the RLWE 𝑑 2,𝑘𝑡 comp ,𝑞 2,𝜒 2,𝑠 ,𝜒 2,𝑒 as-sumption. The only difference between these experiments is the distribution of Wcomp . Thus, under the 

RLWE 𝑑 2,𝑘𝑡 comp ,𝑞 2,𝜒 2,𝑠 ,𝜒 2,𝑒 assumption, we have that for ˜𝑠 2,𝑖 ← 𝜒 2,𝑠 , the distributions of 

˜𝑠 2,𝑖 

aT 

> 1

| · · · | aT

> 𝑘

 + eT 

> 1

| · · · | eT

> 𝑘

 ,

where e𝑖 ← 𝜒 𝑡 comp  

> 2,𝑒

is pseudorandom. By a hybrid argument over each component of ˜𝑠 2,𝑖 , we conclude that 

˜s2aT 

> 𝑖

+ E𝑖 is computationally indistinguishable from uniform for all 𝑖 ∈ [ 𝑘 ]. By definition of the ring packing function Π (Eq. (3.3) and Definition A.12), this means that Π(˜s2aT 

> 1

+ E1, . . . , ˜s2aT 

> 𝑘

+ E𝑘 ) is computationally indistinguishable from uniform. This is the distribution in Hyb (𝑏 ) 

> 1

(A) .

• Hybrids Hyb (𝑏 ) 

> 1

(A) and Hyb (𝑏 ) 

> 2

(A) are computationally indistinguishable under the RLWE 𝑑 1,𝑛 vec 𝑡 vec ,𝑞 1,𝜒 ′ 

> 1,𝑠 ,𝜒 ′
> 1,𝑒

assumption. By a hybrid argument (over the 𝑛 vec components of ˜s′

> 1

), we have that for all 𝑖 ∈ [ 𝑛 vec ], ˜s′

> 1

aT 

> vec ,𝑖

+Evec ,𝑖 

is computationally indistinguishable from uniform. In this case, the distribution of each Vvec ,𝑖 is uniform over 

𝑅 (𝑛 vec +1) × 𝑡 vec  

> 𝑑 1,𝑞 1

. This is the distribution in Hyb (𝑏 ) 

> 2

(A) .

• Hybrids Hyb (𝑏 ) 

> 2

(A) and Hyb (𝑏 ) 

> 3

(A) are computationally indistinguishable assuming key-dependent pseudo-randomness of RLWE with parameters (𝑑 1, 2𝑄, 𝑞 1, 𝜒 1,𝑠 , 𝜒 1,𝑒 ) and with respect to the family of automorphisms 

Fauto (Definition D.2) and quadratic function Fquad (Definition D.3), where 𝑄 is the number of queries the adversary makes in the query privacy game. First, we observe that the matrices Wcoeff ,RLWE ,𝑖 , Wcoeff ,GSW ,𝑖 ,and Wproj ,𝑖 are matrices sampled using AutomorphSetup . From Eq. (A.1), each of these matrices is an RLWE encoding of a scaled automorphism of ˜𝑠 1 under s1. The reduction can simulate these components using the key-dependent pseudorandomness oracle (by querying on functions in Fauto ). Next, the encodings Vconv is an RLWE encoding of a quadratic function of ˜𝑠 1 under s1. Again, this can be simulated using the key-dependent pseudorandomness oracle (by querying on functions in Fquad ). Finally, the challenger’s response to each of the adversary’s queries consists of two RLWE encodings (c1, c2) under s1, which can be simulated using the RLWE challenge itself. We conclude that the output of the two distributions are computationally indistinguishable. Since each pair of adjacent distributions are computationally indistinguishable, query privacy holds. □

# E Respire Parameters 

In this section, we give the concrete lattice/batching parameters we use in both the single-query version (Table 3) and the batched version (Table 4) of the Respire protocol. We also give the (shared) gadget parameters in Table 5. 53 Hashing Parameters Database Size Batch Size # Buckets B Bucket Size K ν1 ν2 ν3 nvec 

256 MB 4 7 128 MB 9 8 2 28 13 64 MB 8 8 2 416 25 32 MB 8 7 2 732 49 16 MB 7 7 2 864 98 8 MB 7 6 2 8128 197 4 MB 6 6 2 8256 398 2 MB 6 5 2 81 GB 4 7 512 MB 10 9 2 28 13 256 MB 9 9 2 416 25 128 MB 9 8 2 732 49 64 MB 8 8 2 864 97 32 MB 8 7 2 8128 194 16 MB 7 7 2 8256 391 8 MB 7 6 2 8Table 4: Database dimensions 𝜈 1, 𝜈 2, 𝜈 3, and hashing parameter breakdown for the batched version of Respire 

(Construction 3.3) as a function of the database size and the batch size. Specifically, for each batch size and database configuration, we partition the database into 𝐵 buckets, each of size 𝐾 (see Section 4.3 for more details of the construction). Each of the sub-databases has dimension (𝜈 1, 𝜈 2, 𝜈 3). The size of each record is fixed to be 256 bytes. In all of our instantiations, we set the lattice parameters as follows: 𝑑 1 = 𝑑 2 = 2048 , 𝑑 3 = 512 , 𝑝 = 24,

𝑞 1 = 268369921 · 249561089 ≈ 256 , 𝑞 2 = 249857 ≈ 218 , 𝑞 3 = 28, and 𝜈 3 = log 2 (𝑑 1/𝑑 3) = 2.

Parameters Description Length ( 𝑡 ) Base ( 𝑧 )

𝑡 GSW , 𝑧 GSW GSW encodings (Section 2) 8 127 

𝑡 coeff ,RLWE , 𝑧 coeff ,RLWE RLWE encoding packing (Constructions B.1 and B.6) 4 16088 

𝑡 coeff ,GSW , 𝑧 coeff ,GSW GSW encoding packing (Constructions B.1 and B.6) 20 7

𝑡 conv , 𝑧 conv RLWE to GSW conversion (Constructions B.4 and B.6) 4 16088 

𝑡 proj , 𝑧 proj Projection (Construction A.7) 20 7

𝑡 vec , 𝑧 vec Vectorization (Construction C.1) 2 258794687 

𝑡 comp , 𝑧 comp Compression (Construction C.3) ⌊log (𝑞 2)⌋ + 1 2

Table 5: Respire decomposition bases ( 𝑧 ) and decomposition lengths ( 𝑡 ) for the underlying sub-algorithms. 54
