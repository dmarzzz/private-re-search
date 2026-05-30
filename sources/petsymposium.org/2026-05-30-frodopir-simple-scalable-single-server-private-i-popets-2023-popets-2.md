---
url: https://petsymposium.org/popets/2023/popets-2023-0022.pdf
title: FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval
fetched_at: 2026-05-30T15:52:04
content_hash: sha1:59d6559bc7a968e4bbe27430a0419a5ce5ba48a1
extractor: jina
---

Title: FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval

URL Source: https://petsymposium.org/popets/2023/popets-2023-0022.pdf

Published Time: Thu, 12 Jan 2023 16:34:25 GMT

Number of Pages: 19

Markdown Content:
# FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval 

# Alex Davidson 

Brave Software alxdavids@brave.com 

# Gonçalo Pestana 

Brave Software gpestana@brave.com 

# Sofía Celi 

Brave Software sceli@brave.com 

## ABSTRACT 

We design FrodoPIR — a highly configurable, stateful , single-server Private Information Retrieval (PIR) scheme that involves an offline phase that is completely client-independent . Coupled with small online overheads, it leads to much smaller amortized financial costs on the server-side than previous approaches. In terms of perfor-mance for a database of 1 million 1KB elements, FrodoPIR requires 

< 1 second for responding to a client query, has a server response size blow-up factor of < 3.6×, and financial costs are ∼ $1 for an-swering 100 , 000 client queries. Our experimental analysis is built upon a simple, non-optimized Rust implementation, illustrating that FrodoPIR is particularly suitable for deployments that involve large numbers of clients. 

## KEYWORDS 

private information retrieval, cryptography, lattices 

## 1 INTRODUCTION 

A Private Information Retrieval (PIR) scheme provides the ability for clients to retrieve items from an online database, without revealing anything about their queries to the untrusted host server(s). Appli-cations of practical PIR schemes include: anonymous communica-tion [ 7, 61 ], anonymous media streaming [ 47 ], privacy-preserving ad-delivery [ 45 , 63 , 68 ], private location discovery [ 37 ], private con-tact discovery [ 16 ], password-checking [ 3], and SafeBrowsing [ 54 ]. PIR schemes are split into those that are information-theoretically secure, but require the database to be shared between multiple non-colluding servers [ 5, 9– 12 , 26 , 28 , 31 , 35 , 36 , 40 , 58 , 72 , 75 ]; and those that are computationally-secure against a single untrusted server [1, 3, 6, 21, 24, 31, 38, 55, 56, 59, 62, 64, 65]. Multi-server PIR constructions are typically more efficient than single-server schemes. However, finding non-colluding servers to jointly fulfill the PIR functionality can be unrealistic and burden-some. To avoid such problems, developing practical single-server PIR schemes is a desirable goal. The most efficient single-server PIR schemes are based on fully homomorphic encryption (FHE), with security derived from the ring learning with errors (RLWE) assumption [ 1, 3, 6 , 59 , 62 , 64 ]. Unfortunately, these schemes incur computational, bandwidth, and consequent financial overheads for answering client queries on standard, cloud-based infrastructure that would make them expensive to run at scale. Even the most  

> This work is licensed under the Creative Commons Attribu-tion 4.0 International License. To view a copy of this license visit https://creativecommons.org/licenses/by/4.0/ or send a
> letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
> Proceedings on Privacy Enhancing Technologies 2023(1), 365–383
> ©2023 Copyright held by the owner/author(s). https://doi.org/10.56553/popets-2023-0022

efficient require several seconds to process a single query on a database of 1 million 1KB elements. To drive down online and financial costs, a recent line of work of single-server PIR moves large proportions of the expensive online computation and communication to an offline phase [ 30 , 62 , 65 ](a technique that also applies in the two-server model [ 31 , 58 ]). In this model, the client and server prepare an offline internal state to be used for making online queries. Such schemes are referred to as offline-online or stateful , as opposed to online-only or stateless .Such works [ 30 , 62 , 65 ] have focused on developing PIR schemes with efficient online phases. The recent work of Corrigan-Gibbs et al. [30], for example, produces a stateful single-server PIR scheme with sublinear efficiency costs. A key difficulty that has gone unsolved is that either the compu-tation or the communication costs induced during the offline phase scale linearly in the number of clients that will make queries [ 30 ,62 , 65 ]. Moreover, previous schemes require each individual client to make large numbers of queries (e.g. √m for m DB elements) to ensure that the amortized costs remain sublinear. Ultimately, this still results in significant financial costs for any server that plans to run a PIR service in standard cloud-based infrastructure, that will answer queries from large numbers of clients. As a con-sequence, single-server PIR remains unusable in many real-world applications. 

Our Results. We build FrodoPIR : a stateful PIR scheme that is built directly upon the learning with errors (LWE) problem only, rather than using RLWE and FHE-based technologies. Similarly to FrodoKEM with respect to lattice-based key exchange [ 17 ], we show that — counter to accepted intuition — eschewing ring lattice structures can lead to flexible and practically efficient PIR schemes. The main benefit of FrodoPIR is that the offline phase of the protocol is performed by the server alone, completely independent of the number of clients or queries that will be made. This results in low amortized computation overheads, and an offline client download size that is a tiny fraction of the entire server database. Our results highlight that the current bottleneck for deploying practical stateful PIR schemes is heavily related to the per-client scalability of the offline preprocessing phase. Previous schemes have optimized primarily for per-client asymptotics, which we show do not necessarily translate into financially cheap real-world systems. To this end, FrodoPIR represents an initial exploration in developing stateful PIR schemes that are suitable for large, real-world deployments, where lowering financial costs for server-side operators is of paramount importance. On top of this, FrodoPIR 

is significantly simpler than previous schemes, making no use of FHE techniques and requiring only modular arithmetic that can be implemented using standard 32-bit unsigned integer instructions. Our formal contributions are as follows.  

> 365 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

(1) A stateful single-server PIR scheme, known as FrodoPIR ,with security derived from LWE. (2) A simple, open-source Rust implementation — containing only a few hundred lines of code. 1

(3) Experimental analysis illustrating that FrodoPIR is cheaper to run in large multi-client deployments than all previous single-server PIR schemes. (4) Detailed analysis of various configuration trade-offs and optimizations for FrodoPIR .

## 2 BACKGROUND 2.1 Overview of Prior Approaches 

PIR was first introduced as a cryptographic primitive by Chor, Gilboa, Kushilevitz, and Sudan [ 28 ]. Information-theoretic PIR (IT-PIR) sees the client interact with multiple non-colluding servers, that each have access to some form of the same database, and the client combines the responses from each server locally [ 5, 9–12 , 26 , 31 , 35 , 36 , 40 , 58 , 72 , 75 ]. Computationally-secure PIR (cPIR) relies only on a single-server, and provides computational security based on cryptographic assumptions [ 1 , 3, 6 , 21 , 24 , 31 , 38 , 55 , 56 , 62 ,64 , 65 ]. While ITPIR schemes are more efficient, real-world systems that provide non-collusion guarantees prove very hard to devise in practice. Thus, we focus on cPIR henceforth. 

Stateless PIR. Initial constructions of PIR schemes followed the framework of Kushilevitz and Ostrowsky [ 55 ], using additively homomorphic encryption (from number-theoretic assumptions) for hiding the client query [ 21 , 24 , 38 , 56 ]. Such schemes are known as online-only or stateless, since the client does not have to store any information in order to launch queries. Stateless single-server PIR schemes of this nature have the following underlying structure. 

• To learn the ith DB element DB [i], a client sends a vector v of 

m additively homomorphic ciphertexts, where v[i] encrypts 

1 and all others encrypt 0.

• The server responds with a vector w, where w[j] = v[j] ∗ 

DB [j] (j ∈ [ m], ∗ denotes scalar multiplication). 

• The client decrypts w[i] and learns DB [i].Sion and Carbunar showed that such schemes actually perform much worse than simply having the client download the entire server database (DB), when the network bandwidth is just a few hundred Kbps [ 69 ]. This is a result of performing O(m) expensive arithmetic operations (modular exponentiations or multiplications) for every client query. The results of [ 69 ] stood as a reference point for nearly a decade, until Aguilar-Melchor et al. [ 1] used lattice-based cryptography (inherently faster than number-theoretic approaches) to construct efficient single-server PIR. In their XPIR scheme the server compu-tation time is approximately > 5 seconds for a DB with m = 220 

elements, even with the aforementioned asymptotic overheads. Ac-cordingly, bandwidth requirements for the client query are 18 MB, and 590 KB for the server response. Various schemes since have used RLWE-based FHE to propose similar schemes or optimizations of these methods, such as [ 3, 6 , 33 , 59 , 62 , 64 ]. In particular, the works of [ 3, 6, 59 , 62 , 64 ] exhibit various optimizations that transform the client query and server database to reduce the size of the query and 

> 1https://github.com/brave-experiments/frodo-pir

server response (to around 64 KB and 128 KB, respectively), whilst maintaining similar or improving computational costs. 

Stateful PIR. Unfortunately, stateless cPIR schemes still require computational overheads that are difficult to justify in a large-scale deployment. For example, to respond to a single client query for a database of 1 million 256 B entries, it takes > 1 second, and requires downloading at least tens of kilobytes of data [ 6, 59 ]. Such approaches are unlikely to scale for large numbers of clients, or in situations that require timely responses. Recent work has observed that online performance can be improved by moving expensive, query-independent computation to an initial offline phase [ 30 , 31 ,62 , 65 ]. This allows reducing the online costs, as well as amortizing the costs of the offline phase across a number of client queries. The scheme of Patel et al., known as PSIR [ 65 ], enjoys a very fast online phase, though this approach requires the client to download the entire server database in an offline phase — which violates fun-damental PIR efficiency criterion: the total client communication re-mains smaller than downloading the entire database (Definition 3.8). The scheme of Mughees et al., known as Stateful OnionPIR (hence-forth SOnionPIR) [ 62 ], provides a (financially) cheaper approach than PSIR, but at the cost of large computational overheads during the offline phase, which is executed as a protocol between each client and the server. Thus, financial costs will scale linearly in the global number of client queries that are launched. While the single-server scheme of Corrigan-Gibbs and Kogan [ 31 ] has similar issues as SOnionPIR, the very recent work of Corrigan-Gibbs et al. [ 30 ] constructs a PIR scheme (henceforth CHKPIR) where all (amortized) asymptotic complexities are sublinear in the number of DB elements m. Specifically, costs are O(√m), when clients make 

√m queries. Previous schemes require O(m) (symmetric) online operations. This reduces further the online costs, but the costs of the offline phase are very similar to the previous works of [ 62 , 65 ]. In summary, the expensive offline phase in each scheme — that only amortizes per a single client’s queries — quickly becomes the main driver of the server-side costs. The general idea behind each of [ 30 , 62 , 65 ] is that each client and the server cooperatively run a private batch sum retrieval pro-tocol that samples c random subsets S1, . . . , Sc of elements DB , and computes the sum si of all of the elements in each Si and provides it to the client. During the online phase, the client that wants to query for the element ej = DB [j] picks the first t ∈ [ c], where 

ej < St . They then construct a partition P = (P1, . . . , Pk ) of the indices of DB , where Pj = S, and send a succinct description of this partition to the server. The server expands each partition into the set of sums sP1 , . . . , sPk . The client uses an underlying single-server PIR scheme to learn the sum sPj , and, finally, outputs sPj − st to learn ej .The PSIR scheme implements the private batch sum retrieval protocol by streaming the entire database to the client, while the SOnionPIR and CHKPIR schemes both involve the client specifying their random subsets as FHE ciphertexts, and having the server construct each of the sums using homomorphic properties. When instantiating the underlying single-server PIR scheme during the online phase using FHE-based schemes (such as SealPIR, or stateless 

OnionPIR), it has been shown that stateful PIR result in much more  

> 366 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

efficient online phases and significantly smaller server costs, when compared with stateless, online-only schemes [62, 65]. 

Other Privacy-Preserving Data Access Primitives. Oblivious RAM (ORAM) provides data access pattern privacy for client queries to a server database [ 42 , 43 ]. This problem is related to PIR, but provides privacy also for the server database: the client learns the queried DB element and nothing more. While recent ORAM schemes enjoy sublinear computation and communication [ 25 , 32 , 67 , 70 ], none are inherently multi-client and this leads to very expensive real-world overheads. The work of Hamlin et al. presents Private Anonymous Data Access (PANDA) [ 48 ], based on a symmetric-key formulation of PIR known as doubly-efficient PIR [ 13 , 19 , 23 ]. Doubly-efficient PIR schemes are similar to stateful schemes, where there is an initial phase that preprocesses the server database, but the online phase is totally stateless. Unfortunately, symmetric-key doubly-efficient PIR is inherently not multi-client. Public-key instantiations use multiple-servers [ 13 ], or are based on expensive cryptographic ob-fuscation [ 19 ]. Batch PIR [ 8 , 49 , 52 , 57 ] uses batch codes to achieve sublinear amortized efficiency, by allowing clients to retrieve mul-tiple items at once. Unfortunately, such savings do not apply in settings where queries are made adaptively — i.e. based on the results of previous queries — which is required in most standard applications. As such, we focus on developing efficient PIR schemes for handling adaptive client queries. 

## 2.2 Limitations of Existing Stateful PIR Schemes 

Expensive Preprocessing. The key limitation of SOnionPIR and CHKPIR is the computational cost of the private batch sum retrieval protocol that takes place during the offline phase. This protocol must be invoked per-client, and involves at least O(m) server-side operations and O(√m) communication ( m = |DB |). These costs are amortized across the number of queries c launched but, even after amortization, the computational costs remain large. For a DB of 220 

1KB elements, the offline phase of SOnionPIR takes 25 seconds per client query .2 For large multi-client systems, the potential for amor-tization diminishes and these costs quickly become prohibitive. In contrast, in PSIR clients simply download the entire server database before only storing O(c) data; this results in multiple issues. First, as shown in [ 62 ], for large numbers of clients the download cost becomes prohibitively large from a financial perspective, and will continue growing for larger databases and items [ 62 ]. Second, the PSIR approach is unable to satisfy the fundamental efficiency criterion required of PIR schemes (Definition 3.8). 

High Online Bandwidth Consumption. As a result of using FHE-based single-server PIR during the online phase, both SOnionPIR and PSIR have online server response sizes that are relatively very large compared to the size of the queried DB element. For exam-ple, for 1KB data elements, the response blow-up in SOnionPIR is 

128 ×, while in PSIR it is 320 ×. The work of CHKPIR uses similar underlying primitives and thus results in similar communication overheads.                  

> 2While CHKPIR has not been implemented, the offline phase is very similar and thus will incur similarly large computational overheads.
> A
> PRG (μ)
> DB
> M
> Each client down-loads ( μ,M)
> (1) Server Offline Pre-processing
> sb=A+e
> PRG (μ){0,±1}{0,±1}
> $$
> sc=M
> (2) Client Offline Pre-processing
> bxi
> 0
> 0
> +ebSend to server
> (3) Client Online Query for Index i
> eb
> DB
> ec
> Return ecto client
> (4) Server Online Response
> ecc−DB [i] Round ≈
> (5) Client Output

Figure 1: An overview of FrodoPIR . In (1), the server com-presses their database DB (represented as a matrix) into M, via multiplication with the global matrix A that is derived randomly from a public seed μ. The client downloads (μ, M),and in (2) they preprocess a query and store (b,c), note that b is an LWE sample and is thus randomly distributed. In the online phase, in (3), the client creates their query by adding an indicator value x to the ith vector entry of eb. In (4), the server multiplies the client query vector with their DB ma-trix and return the result, ec. Finally, in (5), the client sub-tracts c from ec — rounding the result to remove any error terms — and learns the ith row of DB. The full scheme is given in Section 4. 

Practical Security Parameters. PSIR and SOnionPIR provide 115 

and 111 bits of security, respectively [ 62 , 65 ] using the primal-USVP cost model for estimating the hardness of cryptographic lattices, as shown in [ 2 ]. Achieving 128 bits of security can be important in cases where cryptographic tools must satisfy regulatory compli-ance checks. Increasing the concrete security parameters of either scheme would require modifying the LWE parameters that are used which, in turn, will significantly impact the efficiency of both schemes. 

Lack of Simple, Available Implementations. There are no public implementations of stateful PIR schemes. Additionally, no previous scheme implements their stateful PIR scheme as part of their ex-perimental analysis. This means that the computational overheads of running existing schemes are either extrapolated from stateless PIR implementations, or remain unavailable. Having simple, small, and available implementations is a significant advantage when it comes to assessing the efficiency and security guarantees that are provided, during security and scientific auditing processes. 

## 2.3 Overview of FrodoPIR 

Figure 1 gives a diagrammatic overview of the following steps. (1) In the offline phase, the server interprets their own database as a matrix, applies a compression function to said matrix and makes the results available as global public parameters. This compression function shrinks the size of the database by a factor of approximately m/λ, where λ is the security  

> 367 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

Table 1: Asymptotic comparison focusing on the dependency on the number of database elements, m, of practical approaches for realizing single-server PIR with adaptive queries (i.e. not including batch PIR schemes, logarithmic factors are ignored). All costs are amortized according to C clients that launch c = √m queries ( m = |DB | is the total number of elements in the server database). Communication costs relate to the amount of data that is sent to the party. The financial costs are given relative to a database containing 220 1KB elements, are amortized per-query and per-client, and are calculated assuming a server that operates the same AWS EC2 architecture specified in Section 6. †The costs of CHKPIR are assumed to be zero for the online phase, and are thus completely dominated by the offline phase, which can be implemented using techniques from [30, 62, 65].                                                                                            

> Approach Security assumptions Client costs Server costs Communication Computation Storage Communication Computation Financial Offline Online Offline Online Offline Online Offline Online
> Stateless [3, 6, 62] RLWE —m—m——1—m$5 .2×10 −3
> PSIR [65] RLWE —1m√m√m|DB |/ √m1—m$8 .8×10 −5
> SOnionPIR [62] RLWE √m1k· √mk√m√m1√mm$6 .4×10 −4
> CHKPIR [30] RLWE √m√m√m√m√m√m1√m√m∼$8 .8×10 −5†
> FrodoPIR LWE —mm1λλ·m−1/21√m/Cm$(1.9/C×10 −2+1.3×10 −5)

parameter and m is the number of database elements. Thus, the size of the parameters is no longer linear in the size of the database. (2) The client downloads the public parameters, and can com-pute c sets of preprocessed query parameters. (3) In the online phase, the client uses a single set of prepro-cessed query parameters to produce an “encrypted” query vector, which is sent to the server. (4) The server responds to the query by multiplying the vector with their database matrix. (5) The client returns the result by “decrypting” the response using their preprocessed query parameters. The security of the system relies on the decisional LWE prob-lem: 3 each client query is a noisy vector that appears uniformly random to the server. Security conservatively holds up to a global number of client queries that the server witnesses. When this is reached, the server simply reruns the compression function using newly sampled randomness, and the clients download and process the new parameters. 4

While the ideas behind FrodoPIR are fundamentally similar to previous RLWE-based PIR schemes, the key differentiating factor is that it uses a secure, client-independent preprocessing phase. Moreover, the total client download is much smaller than schemes that involve streaming the entire server database. This trade-off results in a scheme that is significantly cheaper than all previous approaches, including those that achieve sublinear computation and communication complexities such as [ 30 ]. FrodoPIR is espe-cially well-suited to operating on databases containing many small elements. Moreover, FrodoPIR consistently achieves low runtimes across various database shapes (see Section 6). The main limitation of the FrodoPIR approach is that online client queries are linear in the size of the database, which can be much larger than previous schemes. Fortunately, we show that 

FrodoPIR is highly configurable and that we are able to reduce client query sizes (as well as server-side online computation) at the cost of increasing the client download size (see Section 5.4 for more  

> 3We base security specifically on a well-known variant of LWE, known as the decisional
> ternary LWE problem (Assumption 3.2).
> 4Less conservative security analyses suggest that the number of queries may not have such a strong impact on security, see Appendix C for wider discussion.

details). Another limitation is that the server database transforma-tion can result in storing a larger amount than the database itself. Roughly speaking, the server database matrix is 3× as large as the original database. Such database transformations are common in PIR: RLWE-based schemes usually store their database in a format that allows using number-theoretic transform operations easily; and store database elements as FHE ciphertexts which can lead to a 2× increase in database storage. We provide a functionality, efficiency, and coarse-level financial comparison between FrodoPIR and previous stateless/stateful PIR schemes in Table 1. We illustrate how amortization of offline com-putation across all client leads to significant efficiency advantages compared with previous stateful PIR schemes in Section 6. 

## 3 PRELIMINARIES 3.1 Notation 

We denote vectors and matrices in lower- and upper-case bold-face, respectively. All vectors v are assumed to be in column orientation, and we write vT to denote the same vector in row orientation. For a set of vectors x1, . . . , xℓ , we write [x1 ∥ · · · ∥ xℓ ] to denote the matrix with the ith column set to equal xi for i ∈ [ ℓ].Let ⌊x⌉ ∈ Z denote rounding x ∈ R to the nearest integer, rounding down in case of a tie. Likewise, we use ⌈x⌉ to indicate explicitly rounding x ∈ R to the next highest integer. For x ∈ Zmq ,we write ⌊x⌉p to denote the computation of ⌊p/q · x⌉, where the rounding is applied to each entry of x individually. For some set X,we write x ←$ X to denote that x is sampled from X uniformly, and we write x ←$ (X) m to denote sampling an m-dimensional vector, with each entry sampled uniformly from X. We write log (x) to denote taking the base-2 logarithm of x. We use λ to denote the security parameter throughout, and say that an algorithm A is PPT if it runs in probabilistic polynomial-time with respect to λ.

## 3.2 Mathematical Preliminaries 

We use the learning with errors (LWE) problem in its decisional version, which is equivalent to its search version as proven by Regev [ 66 ] for prime moduli, and was later shown to be equivalent for all moduli [20, 60]. 

Definition 3.1. (Decisional LWE problem) Let χ be some distri-bution, and let q, n, m > 0 depend on λ. The decision LWE problem  

> 368 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

(LWE q,n,m, χ ) is to distinguish between: 

(A, sT · A + eT ) ∈ Zn×mq × Zmq , (1) 

(A, u) ∈ Zn×mq × Zmq , (2) 

where A ←$ Zn×mq , sT ← ( χ )n , eT ← ( χ )m , and u ←$ Zmq .

Evidence that LWE q,n,m, χ is hard to solve for appropriate choices of χ — for example small Gaussian distributions — and for both clas-sical and quantum adversaries follows via reduction from standard worst-case lattice problems [ 66 ] (as hard as worst case problems on n-dimmesional lattices). 

Variants of LWE. The following assumption states that decisional 

LWE q,n,m, χ remains hard when χ is the uniform distribution over ternary values (i.e. {0, ±1}). 

Assumption 3.2. (Ternary LWE [ 20 ]) The LWE q,n,m, χ problem is hard to solve when χ is the uniform distribution on {− 1, 0, 1} (i.e. the uniform ternary distribution). 

It follows from the work of Brakerski et al. [ 20 ] that Decisional LWE with ternary secrets is as hard as the problem investigated by Regev [ 66 ]. Moreover, many examples of well-established cryp-tographic schemes rely on the hardness of LWE using both se-crets and errors sampled from a uniform ternary distribution, such as [15, 34, 46, 51]. In Definition 3.3 we give a variant of LWE q,n,m, χ known as the Matrix LWE problem (denoted by MatLWE q,n,m, χ ,ℓ ). Corol-lary 3.4 shows that MatLWE q,n,m, χ ,ℓ is hard to solve, with only polynomial security loss compared with LWE q,n,m, χ [17]. 

Definition 3.3. (Decisional Matrix LWE problem [ 17 ]) Let χ be some distribution, and let q, n, m, ℓ > 0 depend on λ. The decisional Matrix LWE problem ( MatLWE q,n,m, χ ,ℓ ) is to distinguish between: 

(A, S · A + E) ∈ Zn×mq × Zℓ×mq , (3) 

(A, U ) ∈ Zn×mq × Zℓ×mq , (4) 

where A ←$ Zn×mq , S ← ( χ )ℓ×n , E ← ( χ )ℓ×m , and U ←$ Zℓ×mq .

Corollary 3.4. (Hardness of MatLWE q,n,m, χ ,ℓ [ 17 ]) Let A be a PPT adversary against MatLWE q,n,m, χ ,ℓ with advantage ϵ, then we can construct a PPT adversary B against LWE q,n,m, χ with advantage 

ϵ/ℓ.

We now state the following as a corollary of the central limit theorem, to provide an upper bound on the size of sums of elements sampled from uniform ternary distributions. 

Corollary 3.5. (Bounds on uniform ternary sums) For sufficiently large m = poly (λ ), the sum of m samples taken from the uniform distribution over ternary values (i.e. {− 1, 0, 1}) is bounded by 4√m

with all but negligible probability. 

## 3.3 Stateful Private Information Retrieval 

As discussed, in this work, we will consider stateful PIR schemes, where the PIR interactions are split into a query-independent offline phase and a query-dependent online phase [ 65 ]. A stateful PIR scheme consists of an offline and an online phase, which are defined as follows. 

Offline phase: 

• ssetup (1λ ): An algorithm run by the server that outputs some initialization parameters ip .

• cinit (ip ): A client initialization algorithm run on parameters 

ip . Outputs a message ms д to be sent to the server during the offline phase. 

• spreproc (ip , DB , ms д): A server preprocessing algorithm run on ip , the server database DB , and client message ms д. Out-puts a set of public parameters pp to be downloaded by the client. 

• cpreproc (ip , pp ): A client preprocessing algorithm run on the server-generated public parameters (ip , pp ), that outputs a state st .Stateful PIR schemes that omit the cinit algorithm are said to have 

client-independent preprocessing phases. 

Online phase: 

• query (st , i): A client algorithm that generates a PIR query 

q for the item in the ith index of the server database, and optionally returns an updated state st ′.

• respond (DB , q): A server algorithm that outputs a response 

r to be returned to the client. 

• process (st , r): A client algorithm that takes the sever re-sponse r, and outputs a database element x.

## 3.4 PIR requirements 

Stateful PIR schemes must guarantee the following. 

Correctness. The following correctness definition ensures that clients receive the correct response with overwhelming probability when interacting with an honest server. 

Definition 3.6. (Correctness) Let DB be the server database, let i

be the index that the client seeks to query during the online phase, and let DB [i] be the ith entry of DB . We say a PIR scheme is correct 

if the following inequality is satisfied. 

Pr 



x = DB [i] 

> ip ←ssetup (1λ)
> pp ←spreproc (ip ,DB ,cinit (ip ))
> st ←cpreproc (ip ,pp )
> q←query (st ,i)
> r←respond (DB ,q)
> x←process (st ,r)



> 1 − negl (λ )

Security. We use the standard definition of security in enforcing the indistinguishability of client queries. As is common throughout PIR literature, this assumes a semi-honest server, that follows the protocol correctly and attempts to learn more based on the client messages that they receive. 

Definition 3.7. (1-query indistinguishability) Let DB be the server database. Generate the server public parameters by running ip ←

ssetup (1λ ), pp ← spreproc (ip , DB , cinit (ip )) . Generate the client state by running st ← cpreproc (ip , pp ). We say that a PIR scheme is secure if, for any PPT adversary A specifying indices i0, i1 that is given qb ← query (st , ib ) for b ←$ {0, 1}, then A has negligible probability in correctly guessing b.

The above definition can be expanded to specify ℓ-query indistin-guishability, in other words that two sets of size ℓ of client queries are indistinguishable from each other [65].  

> 369 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

Efficiency. PIR schemes require communication that is smaller than the overhead of having clients download the entire server database. In the stateful PIR case, it should hold when amortizing costs over the number of client queries. 

Definition 3.8. (Efficiency) For a single client launching c queries, a PIR scheme is efficient if the total client communication overhead is smaller than |DB |/ c.

Therefore, for stateful schemes, the total client communica-tion cost is calculated using the equation: comms (offline ) + c ·

comms (online ).

## 4 OUR SCHEME 

We now describe the FrodoPIR scheme, writing FPIR for short. 

## 4.1 Cryptographic Setup 

Recall that S is the server holding the database DB that each client attempts to learn entries from. DB is an array of m elements, each made up of w bits. Each entry is associated with the index i that corresponds to its position in the array. For now, we will assume that the client knows which index it would like to query during the online phase of the protocol. 5 We assume that there are C clients that will each launch a maximum of c queries against DB . Regarding the LWE instantiation that is used: let n and q be the LWE dimen-sion and modulus, respectively; let 0 < ρ < q; let χ be the uniform distribution over {− 1, 0, 1}; and let λ be the concrete security pa-rameter. Finally, we use PRG (μ, x, y, q) to denote a pseudorandom generator that expands a seed μ ←$ {0, 1}λ into a matrix in Zx ×y 

> q

.

## 4.2 Preprocessing Phase 

We first describe the offline phase which occurs before the client makes any queries to the server. Note that cinit is not required in 

FrodoPIR , and thus we do not define it. 

Server Setup ( FPIR .ssetup ). The server constructs their database containing m elements, and samples a seed μ ∈ { 0, 1}λ .

Server Preprocessing ( FPIR .spreproc ). The server derives a ma-trix A ← PRG (μ, n, m, q), where A ∈ Zn×mq . It then runs D ←

parse (DB , ρ), where parse encodes the DB into a matrix D ∈ Zm×ωρ ,and where ω = ⌈w/log (ρ)⌉ .6 The server stores D.To generate public parameters, the server runs M ← A · D,and then publishes the pair (μ, M) ∈ { 0, 1}λ × Zn×ω 

> q

to a public repository accessible by clients. 

Client Preprocessing ( FPIR .cpreproc ). Each client downloads 

(μ, M) from the public repository, and runs A ← PRG (μ, n, m, q).The client then samples c vectors sj ← ( χ )n and ej ← ( χ )m . Finally, it computes bj ← sj T · A + ej T ∈ Zmq and cj ← sj T · M ∈ Zω 

> q

,for each j ∈ [ c], and stores the pairs internally as the set X =

(bj , cj )j ∈[ c].       

> 5Section 7 discusses options for mapping string-based queries to indices.
> 6Thus, the ith row consists of ωlog (ρ)-bit chunks of DB [i] ∈ Zωρ.

## 4.3 Online Phase 

Client Query Generation ( FPIR .query ). For the index i that the client wishes to query, the client generates the vector: 

fi = (0, . . . , 0, q/ρ, 0, . . . , 0),

i.e. the all-zero vector except where fi [i] = q/ρ. The client then pops a pair (b, c) from the internal state st that it maintains, and computes eb ← b + fi ∈ Zmq , and sends eb to the server. 

Server Response ( FPIR .respond ). The server receives eb from the client, and responds with ec ← ebT · D ∈ Zω 

> q

.

Client Postprocessing ( FPIR .process ). The client receives ec, and outputs x ← ⌊ ec − c⌉ρ ∈ Zωρ .

## 4.4 Correctness 

The output of the client postprocessing phase is x ← ⌊ ec − c⌉ρ .Expanding the right-hand side of the equation gives: 

x = ⌊ec − c⌉ρ

= ⌊( sT · A + eT + fi T ) · D − ( sT · A · D)⌉ ρ

= ⌊( e + fi )T · D⌉ρ .

(5) Noting that ⌊ fi T · D⌉ρ = D[i] where the ith row D[i] ∈ Zωρ is interpreted as a column vector, then proving that 

⌊eT · D + fi T · D⌉ρ = ⌊ fi T · D⌉ρ (6) results in the client learning the correct output. This gives rise to the following theorem. 

Theorem 4.1. (Correctness) If q ≥ 8ρ2√m, then FPIR is correct 

with high probability. 

Proof. See Appendix A.1. □

## 4.5 Security 

To prove security of FrodoPIR , we show that any query eb ←

FPIR .query (i) is distributed uniformly in Zmq from the perspective of S (Theorem 4.2). This general result proves that FPIR satisfies 

1-query indistinguishability (Definition 3.7) and we further show that this holds for ℓ = poly (λ ) client queries in Corollary 4.3. Since, 

χ is the uniform ternary distribution, the proofs therefore follow from the hardness of the decisional ternary LWE problem (Assump-tion 3.2). 

Theorem 4.2. (1-query indistinguishability) FPIR is secure under observation of 1 query, under the assumption that LWE q,n,m, χ is difficult to solve. 

Proof. See Appendix A.2. □

Corollary 4.3. (ℓ-query indistinguishability) FPIR is secure un-der observation of ℓ = poly (λ ) queries, under the assumption that 

MatLWE q,n,m, χ ,ℓ is difficult to solve. 

Proof. See Appendix A.3. □ 

> 370 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

Table 2: Communication overheads (bits) of FrodoPIR .

Offline Online Client upload — m log (q)

Client download λ + nω log (q) ω log (q)

Table 3: Number of operations required in FrodoPIR .                                 

> spreproc cpreproc query respond process
> mod qmults nm ωn(m+ω)—mω—
> mod qadds n(m−1)ω(n−1)( m+ω)1(m−1)ωω
> PRG nm nm ———

Table 4: Storage overheads of FrodoPIR in bits, according to whether client performs any offline preprocessing of queries (where c is the number of preprocessed queries), or not. When no preprocessing is performed, the client storage overhead is logarithmically dependent on the number of el-ements in DB .                   

> with preprocessing without Server storage λ+mωlog (ρ)λ+mωlog (ρ)
> Client storage λ+c(m+ω)log (q)λ+nωlog (q)

## 4.6 Efficiency 

We give the conditions under which FPIR satisfies the efficiency goal of a PIR scheme, as laid out in Definition 3.8. 

Theorem 4.4. (Efficiency) Let c be the upper bound of a single client’s FPIR queries. Then FPIR is efficient when: 

λ + nω log (q) + c(m + ω) log (q) < |DB |.

Proof. This follows from Definition 3.8, considering the com-munication costs of FrodoPIR (see Table 2). □

## 5 PARAMETER SETTINGS AND CONFIGURATIONS 

We now describe parameter settings and potential optimizations that demonstrate the versatility of FrodoPIR . The major parameters of the scheme to be configured are: the concrete security parameter 

λ; the LWE dimension n; the LWE modulus q; the uniform ternary distribution, χ , used for sampling LWE secret and error vectors; the number of bits, ρ, packed into each entry of the DB matrix, D;the number of elements, m, in the server DB ; and the bit-length, w,of each element in the server database. The communication overheads of FrodoPIR are given in Ta-ble 2, the number of required computational operations are given in Table 3, and the storage overheads in Table 4. 7 Clearly, the afore-mentioned parameters all have an impact on the protocol efficiency.     

> 7Recall that ω=w/log (ρ).

Table 5: Database, query, and security parameter settings. 

q 232 232 232 232 232 

n 1774 1774 1774 1774 1774 

m 216 217 218 219 220 

ρ 210 210 210 29 29

κ 13 .028 26 .056 52 .112 93 .802 187 .603 

λ 128 128 128 128 128 

## 5.1 Required Invariants 

Firstly, for efficiency, FrodoPIR must satisfy Theorem 4.4: 

λ + nω log (q) + c(m + ω) log (q) < mw . (7) Secondly, for correctness (Theorem 4.1), we must have that: 

q ≥ 8ρ2√m, (8) holds. Finally, for security, MatLWE q,n,m, χ ,ℓ must provide at least 

128 bits of concrete classical security. We can estimate the concrete security of LWE instances with the lattice security estimator [ 2], see Appendix D. 

## 5.2 Fixing LWE Parameters 

Before configuring FrodoPIR for efficiency, we first fix a set of parameters that provide the necessary concrete security guarantees. We focus on those parameters for MatLWE q,n,m, χ ,ℓ , except for m

which is the number of DB elements. Firstly, χ is the uniform ternary distribution. Secondly, we set 

q = 232 , which allows us to use standard 32-bit unsigned integer operations for the implementation of the Zq operations. Thirdly, we set n = 1774 as the LWE dimension. This choice conserva-tively estimates the security of the MatLWE q,n,m, χ ,ℓ instance, using the work of Albrecht et al. [ 2] to provide the security of 

ν = LWE q,n,m, χ , and then calculate the concrete security param-eter as λ = ν − log ℓ (Corollary 3.4) using the primal-USVP cost model. As ℓ is the total number of queries that the server observes, we set ℓ = 252 queries as a suitable upper bound before rotation of A is required. When A is rotated, the security of the scheme is reset. Therefore, λ = ν − 52 . The code that we eventually run for estimating the security of ν is given in Appendix D. The conservative analysis above dictates that for larger num-bers of queries, the concrete security of the instance will decrease polynomially in the number of queries — until a new LWE matrix 

A is resampled. 8 Note that no attacks currently exist that exploit the security of MatLWE q,n,m, χ ,ℓ in this way. As such, a less con-servative analysis may be valuable in allowing smaller dimensions 

n, by simply estimating the security for smaller values of ℓ, or by estimating the security of ν = LWE q,n,m, χ only. We discuss the performance impact of choosing smaller values of n in Appendix C. 

## 5.3 Recommended Database Parameters 

Let κ = (log (ρ) · m)/( n · log (q)) denote the improvement factor rel-ative to the offline client download when compared to the original 

DB size. In Table 5, we give recommended parameter settings for    

> 8Since PIR is constructed in a semi-honest security model, we safely assume that the server resamples Awhen it is required to do so. 371 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

FrodoPIR . For each parameter set, the concrete security parame-ter is 128 bits for 252 client queries. Security can be increased by increasing the dimension n, though, this reduces κ. The lattice secu-rity estimates that we derive are produced using the code detailed in Appendix D. In Section 6, we consider DB elements of size w = 1KB, which leads to ω ∈ { 820 , 911 }, depending on the value of ρ. In Section 6.3, we also highlight how performance changes when considering DB 

elements of larger sizes. 

## 5.4 Additional Optimizations 

Processing Larger Databases via Sharding. As m increases beyond 

220 , we see a greater relative saving of download costs relative to the fixed n that is used (as parameterized by κ). However, this has undesirable impacts on the performance of the scheme. First, all online server-side computation in the online phase is linearly dependent on m, and so increasing m immediately results in higher latency. The offline work scales similarly for client devices, which are typically constrained and unlikely to cope with vast overheads. Second, the client query size rapidly grows as it is also linearly dependent on m.Overall, we expect that the best approach for operating on larger databases is to shard them into s parallel instances, each using a database of size m/s. Each instance can then independently pro-cess the same single client query. This allows the client to learn the ith index from each of the s shards from only a single query. This allows parallelization of server computation, and careful man-agement of available computing resources. On the client-side, the size of the online query is linear in m/s, rather than m, which can lead to more efficient uploads. However, this comes at the cost of increasing the client download by a factor of s. As a result, sharding allows developing different trade-offs for client upload/download for various situations. Previous work has already highlighted the benefits of performing such sharding on the server database [ 33 ]in terms of increasing amortization factors and allowing further degrees of parallelization. Note that each client must download the public parameters of each of the individual shards. This increases the size of the client download, but with the benefits of reducing the size of their own query and reducing server-side latency. Additionally, noting the independence of each server-side vector-column multiplication in 

FrodoPIR , we could equally leverage sharding by splitting the server database matrix into smaller subsets of columns for handling larger data elements. 

Database Updates. Sharding alone does not reduce the client overhead in preprocessing queries, which remain linear in the total database size. This can become expensive if the server database is updated frequently: each time the client has to regenerate their preprocessed query data. However, coupling sharding with a database updating procedure that touches only few of the shards can reduce database updates to only re-running the ssetup , cpreproc , and spreproc procedures on a small fraction of the database. Specifically, if database updates are confined to a single shard of the database, then these proce-dures need only be run on that particular shard after every update. Updating a single shard of the database results in only requiring the client to download and process an amount of data that is a 

1/( κ · s) fraction of the entire database. Even for large databases, this fraction is likely to be very small. 

Achieving Logarithmic Client-Storage Overhead. Table 4 clearly highlights that storage overheads for clients are dependent on c,the number of preprocessed queries. These costs can be reduced significantly to being logarithmically dependent on m, by simply not performing any preprocessing. The reason that the costs are logarithmic is that the client storage is equal to (λ+nω log (q)) where, as mentioned in Section 5, q is chosen to be equal to 8ρ2√m. This approach requires derivation of the matrix A and query parameters for every online query. Since the derivation of A is fairly costly, computation-constrained clients will benefit from preprocessing client queries. 

## 6 EXPERIMENTAL ANALYSIS 

We provide an experimental analysis of the incurred computa-tional runtimes, bandwidth usage, and financial costs when running 

FrodoPIR . Further, we highlight how such costs amortize over the one-time offline preprocessing phase. Finally, we compare these costs with the previous stateful PIR schemes — PSIR [ 65 ], SOnion-PIR [62], and CHKPIR [30]. 

Performance Benchmarks. We run all experiments as single thread processes on an Amazon t2.2xlarge EC2 instance, with 8 CPU cores and 32 GB of RAM. 9 This is equivalent to the setup that is used in [ 62 ] for comparing SOnionPIR and PSIR. All computational costs correspond to CPU processing time. Bandwidth costs are calculated using the overheads detailed in Table 2, where λ = 128 . Regarding financial cost calculations, transferring data from server to clients costs $0 .09 per GB, the cost of data transfer from clients to server is free, and the cost of computation is $0 .3712 per hour of usage (or 

$0 .0464 per CPU hour). 10 

Parameter Choices. We provide non-amortized communication and computation benchmarks for a single server database using each of the parameter settings provided in Table 5. We choose 

w = 213 bits (i.e. 1KB database elements); and set ρ = 210 for 

m ≤ 218 , and ρ = 29 otherwise. Section 6.3 provides additional benchmarks for different database shapes, such as in cases where database elements are much larger. The parameters we use conservatively provide 128 -bit security for around 252 client queries. In Appendix C, we discuss perfor-mance improvements when the lattice dimension, n, is reduced to account for less conservative security estimations. 

Source Code. Our open-source 11 implementation of FrodoPIR is written in Rust, consists of 735 lines of code, including tests, and requires no external dependencies relating to cryptographic oper-ations. All modular arithmetic is implemented using instructions associated with the 32-bit unsigned integer type included in the Rust standard library.  

> 9Client-based functions are estimated using the same hardware.
> 10 https://aws.amazon.com/ec2/pricing/on-demand/, August 2022.
> 11 https://github.com/brave-experiments/frodo-pir 372 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

Figure 2: Amortized (per-query) cost of server preprocessing (left), according to how many client queries they service, and client offline download size (right). 

Example Application. In Appendix B, we further illustrate how 

FrodoPIR can be applied to real-world use-cases, taking, as an example, the Google SafeBrowsing API [44]. 

## 6.1 Performance Results 

Table 6 displays the non-amortized performance of FrodoPIR . This involves calculating running times and bandwidth usage for run-ning a single-threaded server instance in interaction with a single client. Later, we analyze how the offline costs amortize on a per-query basis. Amortization is calculated over a variable number of clients C, and the number of per-client queries c (where we set 

c = 500 for all experiments). 

Offline Phase. The server generates their database matrix DB 

and public parameters. This is a client-independent operation that scales linearly in m. This process includes pseudorandom derivation of the LWE matrix A ∈ Zn×mq from a single λ-bit seed, which is also be computed by each client. After downloading the public parameters, the client performs query-independent preprocessing for each query that they will make. The results of preprocessing are used during the online phase. These costs grow roughly linearly in 

m.In terms of communication, the server publishes the λ-bit seed, 

μ, and the matrix M ∈ Zn×ω 

> q

, where ω = w/log (ρ). The size of the client download is static for each choice of log (ρ). As a consequence, the total cost only grows when increasing m dictates that ρ must also decrease. 

Online Phase. The client computation consists of performing a single addition operation to modify a single portion of preprocessed data. The client also performs a very small amount of postprocess-ing of servers responses that is almost static across all experiments, as it is linear in ω. The dominant computation cost is the server-side processing of the client query that is ≤ 0.83 s for all database sizes. The dominant communication cost relates to the client query, which is equal to m log (q) bits and scales linearly in the DB size. The server response is significantly smaller — ω log (q) bits — resulting in a < 3.6× overhead in the server response size compared with the original 1KB data element. 

Amortization of Offline Phase. Many of the offline costs in Ta-ble 6 can be amortized significantly over the number of queries 

Figure 3: Total online and amortized (per-query) offline computation costs for the server (left), according to how many client queries they service, and for the client (right). 

Figure 4: Left: Storage costs for clients demonstrating the trade-off between amortization of offline preprocessing and ensuring logarithmic storage overhead relative to m.Right: Comparison of online query costs when preprocess-ing, against performing all query-related computation in the online phase. 

that are launched. In Figure 2, we give an overview of the rate of this amortization for DB preprocessing and parameter generation steps (when servicing between 1K and 1M queries), as well as the cost of the client downloads. The expensive cost of the one-time preprocessing of DB amortizes over all queries globally , i.e. over all clients. The client offline preprocessing and download amortizes over the value of c.The total amortized computation cost (per-query) for the server and clients are given in Figure 3. We display server offline costs that are amortized across all client queries globally for between 1K and 1M queries. The majority of server costs occur during the relatively cheap online phase. The majority of client work is performed during the query-independent offline phase, part of which (the derivation of A) can be amortized over c. Online costs for clients are very small. 

Storage Costs. Figure 4 illustrates the growth of the client storage overhead associated with the database size, when preprocessing c

queries during the offline phase. This becomes fairly large when 

|DB | = 220 , equalling roughly 2GB.  

> 373 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

Table 6: Non-amortized performance analysis of FrodoPIR . The “Client derive matrix” cost refers to the cost of deriving the LWE matrix A from the seed μ, while “Client query preprocessing” refers to the cost of query-independent preprocessing required for a single query. The server offline phase costs can be amortized globally across the number of queries ( C) that are performed, while the client download and parameter derivation costs amortizes across the number of queries ( c) that they individually make. 

Number of DB items ( log (m)) 16 17 18 19 20 

Offline Client download (KB) 5682.47 5682.47 5682.47 6313.07 6313.07 Database preprocessing (s) 104.57 206.26 429.07 936.36 1895.2 Client derive matrix (s) 0.5826 1.1698 2.2118 4.7284 9.25 Client query preprocessing (s) 0.1468 0.2898 0.5795 1.182 2.343 Online Client query (KB) 256 512 1024 2048 4096 Server response (KB) 3.203 3.203 3.203 3.556 3.556 Client query (ms) 0.0213 0.0422 0.0811 0.1648 0.3429 Server response (ms) 45.013 94.505 188.36 417.92 825.37 Client output (ms) 0.359 0.398 0.363 0.42 0.434 

Figure 5: Financial costs (cents) associated with running the server in FrodoPIR . The initial setup cost can be amortized globally across all client queries. 

As mentioned in Section 5.3, it is possible to achieve log (m)

client-side storage overhead, which may be valuable for storage-constrained clients. The downside is that client online query pro-cessing grows noticeably, as seen in the right-side of Figure 4. This is due to having to perform all query-related processing in the on-line phase, including the derivation of A from the public parameters (which can take from between 0.5 to 9.25 seconds, depending on the database size). 12 

Financial Costs. The server-side financial costs given in Figure 5 take into account the expenses associated with both bandwidth and single-threaded computation. The initial preprocessing of the server database is a little higher than 1 cent for a database of 220 .The online per-query cost is tiny in comparison, and approximately 

0.001 of a cent even for the largest DB size. The total per-query cost is calculated as the amortized offline costs, plus the online per-query cost.     

> 12 The matrix Amust be rederived on usage to achieve log (m)storage.

## 6.2 Comparison with Prior Work 

In Figure 6, we compare the performance of FrodoPIR with SO-nionPIR [ 62 ] and PSIR [ 65 ]. Our comparison focuses on three per-formance criteria: computational runtimes, bandwidth usage, and financial cost. Each comparison includes the cost of answering queries in FrodoPIR against the estimated 13 costs of running both SOnionPIR and PSIR. 14 Note that the costs presented in [ 62 ] result from estimating SOnionPIR and PSIR on the same EC2 hardware (t2.2xlarge ) that we used for implementing FrodoPIR . We also provide details on how these costs amortize as the number of clients grows. Our comparison considers the following total database sizes of 

|DB | ∈ { 216 , 218 , 220 }, and element sizes of 1KB. Note that SOnion-PIR and PSIR allow packing of 30 KB and 3KB of data into each server response [ 62 ]. This effectively allows shrinking the server 

DB by a factor of 30 × and 3×, respectively, in kind. Since such costs are linear in the size of DB , we reduce the previously estimated runtime costs of both schemes accordingly. Offline costs for SO-nionPIR are dependent on the number of queries, c, that are made by each client. For each DB size we set c = 500 , the same value as used in [ 62 ]. For the financial costs, we provide costs per CPU hour of server-side computation. The comparison does not cover storage costs or client computation as neither measurement is explicitly provided by the previous schemes. 

Supporting Databases with More Elements. Note that [ 62 ] pro-vides estimated costs of the SOnionPIR and PSIR schemes for a 

DB of size 224 , but RAM overheads of FrodoPIR mean that the 

t2.2xlarge EC2 instance is not powerful enough to process a data-base of this size. This is also likely to be the case for the previous schemes. Building an efficient implementation of FrodoPIR for a database of 224 is possible by sharding, using 16 DB instances with 

220 elements. In the interest of maintaining a fair comparison with-out using parallelization, we do not modify the hardware used or  

> 13 Neither previous stateful scheme has been fully implemented.
> 14 Where PSIR uses SealPIR as the underlying PIR scheme. 374 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

Figure 6: Comparison of per-client computational, communication, and financial costs for the server when running FrodoPIR ,SOnionPIR, and PSIR, assuming that each client makes c = 500 queries. We include amortized costs according to various num-bers of clients C, to indicate the global amortization potential of FrodoPIR . Individual charts: (1) Server offline computation (secs) including amortization potential over C for FrodoPIR ; (2): Server online computation (ms), amortized according to num-ber of DB entries returned; (3): Client offline download (KB); (4): Client online download (KB); (5): Client online query (KB); (6): Server offline financial cost (US cents), compared for different values of C; (7): Server online financial cost (US cents). 

make use of sharding. Thus, we limit the comparison to database sizes ≤ 220 .

Security Levels. We do not modify the security parameters of either SOnionPIR or PSIR: they both offer ≤ 115 bits of security according to [ 2]. In contrast, FrodoPIR offers 128 -bit security for up to 1 billion client queries and higher security levels for lower numbers. SOnionPIR and PSIR could achieve higher security levels by doubling n,15 but while computation times would go unchanged, the server online response size would increase dramatically. 

Computation. In the offline phase (Figure 6 (1)), the server-side computation for PSIR is zero, since the client simply downloads the entire server DB . The overall cost of computation in FrodoPIR 

grows linearly in the database size. While SOnionPIR appears to outperform FrodoPIR for a single client, this cost increases linearly in the number of queries that a client wishes to make. As a conse-quence, if the number of queries per-client ( c) increases, then the cost of SOnionPIR will quickly become greater. More importantly, as the number of clients ( C) in the system grows, this cost will continue to increase. In contrast, all preprocessing in FrodoPIR is client-independent, and thus it is fixed regardless of both c and 

C. Therefore, in a large multi-client deployment, it is clear that 

FrodoPIR is much cheaper than SOnionPIR.     

> 15 Smaller nwould suffice, but nhas to be a power-of-two to ensure the efficiency of NTT-related optimizations.

In the online phase (Figure 6 (2)), PSIR provides the fastest com-putation times. Both FrodoPIR and SOnionPIR still provide com-petitive runtimes. FrodoPIR requires ≤ 0.825 s for responding to a client query on a DB with 220 elements. 

Communication. The offline client download cost (Figure 6 (3)) in SOnionPIR is heavily dependent on the number of queries that will be launched. The cost of PSIR is essentially the cost of downloading the entire server DB . Note that the client download in FrodoPIR 

grows logarithmically in the size of DB . Overall, since the costs of 

FrodoPIR amortize across the number of queries launched by the clients, with a much smaller initial cost than PSIR, it is clear that 

FrodoPIR outperforms the alternatives. In the online phase, the client download (Figure 6 (4)) in FrodoPIR 

is smallest for all captured DB sizes. The server response growth rate, even for |DB | = 220 , is < 3.6×, which is significantly smaller than that of SOnionPIR ( 128 ×) and PSIR ( 320 ×). The major downside of the FrodoPIR approach is that the client query in the online phase (Figure 6 (5)) grows linearly in the size of DB , and is much larger than both SOnionPIR and PSIR — reaching 4MB for client queries when |DB | = 220 . As noted in Section 5.4, this cost can be reduced using database sharding with the additional benefit of reducing server computation times, but at the cost of increasing client download sizes during the offline phase. 

Financial Costs. In the offline phase (Figure 6 (6)), PSIR provides by far the most expensive option, due to the high network band-width usage. The costs of SOnionPIR scale with the number of  

> 375 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

Figure 7: Comparison of total server financial costs in 

FrodoPIR with an online-free PIR scheme that implements the offline phase using SOnionPIR. The costs are compared for: C = 1 (solid line), C = 1000 (dashed line), and C = 1 mil-lion (dotted line) clients; where each client makes c = 500 

queries. 

client queries. The costs of FrodoPIR include a client-independent preprocessing phase, and much lower bandwidth usage than PSIR. Therefore, for large multi-client deployments, the costs of FrodoPIR 

will clearly be much cheaper than both prior schemes. The online financial costs (Figure 6 (7)) for all protocols are much smaller than in the offline phase. By far, PSIR is the most expensive protocol to run in the online phase (again, due to the high communication overhead). The costs of FrodoPIR outperform SOnionPIR, demonstrating that the trade-off between computation and communication in FrodoPIR is concretely cheaper to realize on the server-side. 

Comparison with Online-Free PIR. CHKPIR [ 30 ] constructs a PIR scheme with entirely sublinear (amortized) running times and com-munication costs. However, this depends on each client launching a fairly large number of queries themselves (e.g. √m). As is noted in [ 30 ], the offline phase can be implemented using the methods of PSIR or SOnionPIR, and, regardless, it is still non-amortizable across multiple clients. To illustrate the bottleneck that the offline phase introduces from a financial perspective, we consider a PIR scheme that has zero on-line costs (which is clearly a significant underestimate for CHKPIR), and has the offline costs of SOnionPIR (sublinear in m and generally lower than PSIR). As shown in Figure 7, FrodoPIR is cheaper to run for databases of size ≤ 218 , for c · C queries. The costs are almost identical when |DB | = 220 . We can conclude that these results, coupled with the benefits of a simple and available implementation, make FrodoPIR a very attractive option for implementing fast and scalable PIR for large multi-client systems. 

## 6.3 Stateless PIR and Larger Database Elements 

As mentioned in Section 2, stateless schemes tend to be less effi-cient than stateful schemes. However, the very recent and notably efficient Spiral PIR scheme of Menon and Wu [ 59 ] has been shown to produce low running costs across databases of various sizes and shapes. Spiral demonstrates highly promising performance for both standard PIR use-cases, and those that involve streaming large files. 

Table 7: Comparison of single-threaded server-side perfor-mance between FrodoPIR and Spiral across a variety of data-base sizes on a c5n.2xlarge AWS EC2 instance. †For the database containing 218 × 30 KB elements, we extrapolate 

FrodoPIR compute performance for a database containing 

216 elements instead, since the EC2 instance does not have sufficient memory for storing the preprocessed database of size 218 .Database Metric Spiral FrodoPIR                                                 

> 220 ×256 BOne-time preprocessing —327 sPer-client download 14 MB 1.54 MB Query size 14 KB 4MB Resp. size 20 KB 912 BComputation 1.37 s0.16 sRate 0.0125 0.28
> Throughput 196 MB/s 1.56 GB/s
> 218 ×30 KB †
> One-time preprocessing —7703 sPer-client download 18 MB 166 MB Query size 14 KB 1MB Resp. size 86 KB 96 KB Computation 17 .69 s4.27 sRate 0.3488 0.3125
> Throughput 434 MB/s 1.76 GB/s
> 214 ×100 KB One-time preprocessing —1605 sPer-client download 47 MB 554 MB Query size 14 KB 64 KB Resp. size 188 KB 320 KB Computation 4.58 s0.89 sRate 0.5307 0.3125
> Throughput 358 MB/s 1.76 GB/s

To illustrate the performance of FrodoPIR on different database shapes, Table 7 compares the online computational and bandwidth costs of both FrodoPIR and Spiral for each of the database types considered in [ 59 ], using the same AWS c5n.2xlarge EC2 instance that is used in the original work. 16 In the table, the rate of both schemes is the ratio of the response size to the retrieved database element, and the throughput is the ratio of the database size to the server’s computation time. In both cases, higher values are preferable. Table 7 illustrates that FrodoPIR is very efficient for narrow 

databases, where each data element is relatively small, outper-forming Spiral in almost all criteria. Spiral generally outperforms 

FrodoPIR in cases where database elements are larger: demonstrat-ing smaller bandwidth usage and higher rate. However, FrodoPIR 

demonstrates faster computation across all database sizes than Spi-ral, and this leads to significantly higher throughput in all cases. The offline preprocessing phase of FrodoPIR can be expensive, but recall that this amortized across all clients (and queries) in the global system, and so these costs amortize away fairly quickly. Overall, in cases where database elements are relatively small, or where fast computation is required, then FrodoPIR excels com-pared to the recent state-of-the-art in PIR design. In cases, where database elements are large, and bandwidth and/or client storage are constrained, then Spiral excels.    

> 16 Note that we specifically compare with the single query variant of Spiral (with packing optimizations [ 59 ]), rather than the SpiralStream variant that is optimized for streaming use-cases. 376 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

## 7 DISCUSSION 

Supporting Keyword Queries. In the interest of supporting more realistic database queries, Chor et al. constructed a PIR-by-keyword framework, where the server DB is a key-value store and client queries are keywords that recover the associated values [ 27 ]. Their framework runs multiple instances of index-based PIR as a black-box; FrodoPIR is compatible with this approach. The work of Boyle et al. [ 18 ], based upon multi-server distributed point functions, includes direct support for keyword queries directly, but it does not appear to generalize to other PIR schemes. As well as generic frameworks, FrodoPIR is compatible with external mechanisms for deciding keyword-to-index association. Such mechanisms include the approach detailed by Kogan and Corrigan-Gibbs [ 54 ], that furnishes the client with O(m) hash pre-fixes of each keyword, and associates each with a server DB index. This allows the client to learn the index that they need to query, without running multiple instances of the PIR scheme. It requires sending O(m) data to the client but which, in practice, is a very small fraction of the real database. We discuss practical costs in Appendix B. 

Optimizations for Server Computation. We avoided discussing computational optimizations in this work, in favor of maintaining simplicity and configurability of FrodoPIR . However, asymptotic overheads for computing matrix multiplications have seen a variety of improvements over the last half a century [ 4, 29 , 71 , 74 ]. Such findings have been used in previous PIR schemes to reduce compu-tational workloads [ 41 , 57 ]. The server offline phase in FrodoPIR in-volves a large matrix multiplication with dimensions n×m and m×ω,which would clearly benefit from sub-cubic multiplication meth-ods. The client offline phase, involves preprocessing c queries, each involving a vector-matrix multiplication, which could be batched to-gether into a single matrix multiplication. Furthermore, the server online phase involves a vector-matrix multiplication, for every client query. This optimization can be used by batching a number of queries together. As is observed by Lueks and Goldberg [ 57 ], this enables the server’s work to scale sublinearly in the number of client queries. 

## 7.1 Applications of PIR 

In Appendix B, we illustrate how efficient FrodoPIR can be when applied to the real-world of the SafeBrowsing API [ 44 ]. We list vari-ous other applications below that could also benefit. Valuable future work would identify whether FrodoPIR is a practical candidate for solving such applications. 

Certificate Auditing. Certificate Transparency (CT) is a system created to increase visibility of issued certificates. This system al-lows detection of misissued certificates or other forms of Certificate Authorities (CA) misbehavior, via interaction with one or more pub-lic logs. Clients should check that certificates are indeed included in these logs, but this leads to a potential privacy violation as it means that, over time, the client presents the browsing history of the user. One can apply FrodoPIR to check whether the promise of inclusion is fulfilled. Similar applications of PIR have been highlighted in concurrent work [50]. 

Certificate Revocation Checks. Certificate revocation checks typi-cally use the Online Certificate Status Protocol (OCSP). This mech-anism allows CAs to inform clients if a certificate is revoked by having them query an endpoint. This mechanism, however, can violate privacy as the certificates are revealed to the CA. An alter-native is to have clients download certificate revocation lists (CRLs) from endpoints maintained by CAs. This, though, comes with a huge storage overhead and the need for regular updates. FrodoPIR 

could be used to perform OCSP queries in a privacy-preserving manner. 

PIR for Streaming. PIR schemes such as Popcorn [ 47 ] and Spi-ral [ 59 ] identify PIR as a potential solution for private streaming use-cases, where clients gradually consume chunks of a large data element (such as a video). The capability of FrodoPIR for sharding the server database (Section 5.4) could make it a viable candidate in this setting. 

## 8 CONCLUSION 

In this work, we built FrodoPIR . Via a simple proof-of-concept Rust implementation, 17 we illustrated that FrodoPIR is concretely cheaper than the previous state-of-the-art in building stateful PIR schemes, especially in large multi-client deployments. Overall, we believe that FrodoPIR is the first single-server PIR scheme that is both flexible and efficient enough to be deployed at scale, for a variety of applications. 

## ACKNOWLEDGMENTS 

The authors would like to thank Benjamin Livshits, Hamed Haddadi, Joe Rowell, Muhammad Haris Mughees, Martin Albrecht, Ling Ren, Alexandra Henzinger, Matthew M. Hong, Henry Corrigan-Gibbs, and Sarah Meiklejohn for providing helpful feedback during various stages of this work. This research received no specific grant from any funding agency in the public, commercial, or not-for-profit sectors. 

## REFERENCES                     

> [1] Carlos Aguilar Melchor, Joris Barrier, Laurent Fousse, and Marc-Olivier Killijian. 2016. XPIR: Private Information Retrieval for Everyone. PoPETs 2016, 2 (April 2016), 155–174. [2] Martin R. Albrecht, Rachel Player, and Sam Scott. 2015. On the concrete hardness of Learning with Errors. J. Math. Cryptol. 9, 3 (2015), 169–203. http://www. degruyter.com/view/j/jmc.2015.9.issue-3/jmc-2015-0016/jmc-2015-0016.xml (Es-timates calculated Dec 2021). [3] Asra Ali, Tancrède Lepoint, Sarvar Patel, Mariana Raykova, Phillipp Schoppmann, Karn Seth, and Kevin Yeo. 2021. Communication–Computation Trade-offs in PIR. In 30th USENIX Security Symposium (USENIX Security 21) . USENIX Association, 1811–1828. https://www.usenix.org/conference/usenixsecurity21/presentation/ ali [4] Josh Alman and Virginia Vassilevska Williams. 2021. A Refined Laser Method and Faster Matrix Multiplication. In 32nd SODA , Dániel Marx (Ed.). ACM-SIAM, 522–539. https://doi.org/10.1137/1.9781611976465.32 [5] Andris Ambainis. 1997. Upper Bound on Communication Complexity of Private Information Retrieval. In ICALP 97 (LNCS, Vol. 1256) , Pierpaolo Degano, Roberto Gorrieri, and Alberto Marchetti-Spaccamela (Eds.). Springer, Heidelberg, 401–407. https://doi.org/10.1007/3-540-63165-8_196 [6] Sebastian Angel, Hao Chen, Kim Laine, and Srinath T. V. Setty. 2018. PIR with Compressed Queries and Amortized Query Processing. In 2018 IEEE Symposium on Security and Privacy . IEEE Computer Society Press, 962–979. https://doi.org/ 10.1109/SP.2018.00062 [7] Sebastian Angel and Srinath Setty. 2016. Unobservable Communication over Fully Untrusted Infrastructure. In Proceedings of the 12th USENIX Conference on
> 17 https://github.com/brave-experiments/frodo-pir 377

Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi 

Operating Systems Design and Implementation (Savannah, GA, USA) (OSDI’16) .USENIX Association, USA, 551–569. [8] Sebastian Angel and Srinath Setty. 2016. Unobservable Communication over Fully Untrusted Infrastructure. In 12th USENIX Symposium on Operating Sys-tems Design and Implementation (OSDI 16) . USENIX Association, Savannah, GA, 551–569. https://www.usenix.org/conference/osdi16/technical-sessions/ presentation/angel [9] Richard Beigel, Lance Fortnow, and William Gasarch. 2006. A Tight lower bound for restricted pir protocols. Computational Complexity 15 (05 2006), 82–91. https://doi.org/10.1007/s00037-006-0208-3 [10] Amos Beimel and Yuval Ishai. 2001. Information-Theoretic Private Information Retrieval: A Unified Construction. In ICALP 2001 (LNCS, Vol. 2076) , Fernando Orejas, Paul G. Spirakis, and Jan van Leeuwen (Eds.). Springer, Heidelberg, 912– 926. https://doi.org/10.1007/3-540-48224-5_74 [11] Amos Beimel, Yuval Ishai, Eyal Kushilevitz, and Ilan Orlov. 2012. Share Conver-sion and Private Information Retrieval. In 2012 IEEE 27th Conference on Compu-tational Complexity . 258–268. https://doi.org/10.1109/CCC.2012.23 [12] Amos Beimel, Yuval Ishai, Eyal Kushilevitz, and Jean-François Raymond. 2002. Breaking the O (n1/( 2k −1)) Barrier for Information-Theoretic Private Information Retrieval. In 43rd FOCS . IEEE Computer Society Press, 261–270. https://doi.org/ 10.1109/SFCS.2002.1181949 [13] Amos Beimel, Yuval Ishai, and Tal Malkin. 2000. Reducing the Servers Computa-tion in Private Information Retrieval: PIR with Preprocessing. In CRYPTO 2000 (LNCS, Vol. 1880) , Mihir Bellare (Ed.). Springer, Heidelberg, 55–73. https: //doi.org/10.1007/3-540-44598-6_4 [14] Simon Bell and Peter Komisarczuk. 2020. An Analysis of Phishing Blacklists: Google Safe Browsing, OpenPhish, and PhishTank. In Proceedings of the Aus-tralasian Computer Science Week Multiconference (Melbourne, VIC, Australia) 

(ACSW ’20) . Association for Computing Machinery, New York, NY, USA, Article 3, 11 pages. https://doi.org/10.1145/3373017.3373020 [15] Daniel J. Bernstein, Chitchanok Chuengsatiansup, Tanja Lange, and Christine van Vredendaal. 2017. NTRU Prime: Reducing Attack Surface at Low Cost. In 

SAC 2017 (LNCS, Vol. 10719) , Carlisle Adams and Jan Camenisch (Eds.). Springer, Heidelberg, 235–260. https://doi.org/10.1007/978-3-319-72565-9_12 [16] Nikita Borisov, George Danezis, and Ian Goldberg. 2015. DP5: A Private Presence Service. PoPETs 2015, 2 (April 2015), 4–24. https://doi.org/10.1515/popets-2015-0008 [17] Joppe W. Bos, Craig Costello, Léo Ducas, Ilya Mironov, Michael Naehrig, Valeria Nikolaenko, Ananth Raghunathan, and Douglas Stebila. 2016. Frodo: Take off the Ring! Practical, Quantum-Secure Key Exchange from LWE, See [ 73 ], 1006–1018. https://doi.org/10.1145/2976749.2978425 [18] Elette Boyle, Niv Gilboa, and Yuval Ishai. 2016. Function Secret Sharing: Improve-ments and Extensions, See [ 73 ], 1292–1303. https://doi.org/10.1145/2976749. 2978429 [19] Elette Boyle, Yuval Ishai, Rafael Pass, and Mary Wootters. 2017. Can We Access a Database Both Locally and Privately?, See [ 53 ], 662–693. https://doi.org/10. 1007/978-3-319-70503-3_22 [20] Zvika Brakerski, Adeline Langlois, Chris Peikert, Oded Regev, and Damien Stehlé. 2013. Classical hardness of learning with errors. In 45th ACM STOC , Dan Boneh, Tim Roughgarden, and Joan Feigenbaum (Eds.). ACM Press, 575–584. https: //doi.org/10.1145/2488608.2488680 [21] Christian Cachin, Silvio Micali, and Markus Stadler. 1999. Computationally Private Information Retrieval with Polylogarithmic Communication. In EURO-CRYPT’99 (LNCS, Vol. 1592) , Jacques Stern (Ed.). Springer, Heidelberg, 402–414. https://doi.org/10.1007/3-540-48910-X_28 [22] Luís Caires, Giuseppe F. Italiano, Luís Monteiro, Catuscia Palamidessi, and Moti Yung (Eds.). 2005. ICALP 2005 . LNCS, Vol. 3580. Springer, Heidelberg. [23] Ran Canetti, Justin Holmgren, and Silas Richelson. 2017. Towards Doubly Efficient Private Information Retrieval, See [ 53 ], 694–726. https://doi.org/10.1007/978-3-319-70503-3_23 [24] Yan-Cheng Chang. 2004. Single Database Private Information Retrieval with Logarithmic Communication. In ACISP 04 (LNCS, Vol. 3108) , Huaxiong Wang, Josef Pieprzyk, and Vijay Varadharajan (Eds.). Springer, Heidelberg, 50–61. https: //doi.org/10.1007/978-3-540-27800-9_5 [25] Hao Chen, Ilaria Chillotti, and Ling Ren. 2019. Onion Ring ORAM: Efficient Constant Bandwidth Oblivious RAM from (Leveled) TFHE. In ACM CCS 2019 ,Lorenzo Cavallaro, Johannes Kinder, XiaoFeng Wang, and Jonathan Katz (Eds.). ACM Press, 345–360. https://doi.org/10.1145/3319535.3354226 [26] Benny Chor and Niv Gilboa. 1997. Computationally Private Information Retrieval (Extended Abstract). In 29th ACM STOC . ACM Press, 304–313. https://doi.org/10. 1145/258533.258609 [27] Benny Chor, Niv Gilboa, and Moni Naor. 1998. Private Information Retrieval by Keywords. Cryptology ePrint Archive, Report 1998/003. https://eprint.iacr.org/ 1998/003. [28] Benny Chor, Oded Goldreich, Eyal Kushilevitz, and Madhu Sudan. 1995. Private Information Retrieval. In 36th FOCS . IEEE Computer Society Press, 41–50. https: //doi.org/10.1109/SFCS.1995.492461 [29] Don Coppersmith and Shmuel Winograd. 1990. Matrix Multiplication via Arithmetic Progressions. J. Symb. Comput. 9, 3 (mar 1990), 251–280. https: //doi.org/10.1016/S0747-7171(08)80013-2 [30] Henry Corrigan-Gibbs, Alexandra Henzinger, and Dmitry Kogan. 2022. Single-Server Private Information Retrieval with Sublinear Amortized Time. In Advances in Cryptology – EUROCRYPT 2022 , Orr Dunkelman and Stefan Dziembowski (Eds.). Springer International Publishing, Cham, 3–33. [31] Henry Corrigan-Gibbs and Dmitry Kogan. 2020. Private Information Retrieval with Sublinear Online Time. In EUROCRYPT 2020, Part I (LNCS, Vol. 12105) , Anne Canteaut and Yuval Ishai (Eds.). Springer, Heidelberg, 44–75. https://doi.org/10. 1007/978-3-030-45721-1_3 [32] Srinivas Devadas, Marten van Dijk, Christopher W. Fletcher, Ling Ren, Elaine Shi, and Daniel Wichs. 2016. Onion ORAM: A Constant Bandwidth Blowup Oblivious RAM. In TCC 2016-A, Part II (LNCS, Vol. 9563) , Eyal Kushilevitz and Tal Malkin (Eds.). Springer, Heidelberg, 145–174. https://doi.org/10.1007/978-3-662-49099-0_6 [33] Changyu Dong and Liqun Chen. 2014. A Fast Single Server Private Information Retrieval Protocol with Low Communication Cost. In ESORICS 2014, Part I (LNCS, Vol. 8712) , Miroslaw Kutylowski and Jaideep Vaidya (Eds.). Springer, Heidelberg, 380–399. https://doi.org/10.1007/978-3-319-11203-9_22 [34] Léo Ducas, Alain Durmus, Tancrède Lepoint, and Vadim Lyubashevsky. 2013. Lattice Signatures and Bimodal Gaussians. In CRYPTO 2013, Part I (LNCS, Vol. 8042) , Ran Canetti and Juan A. Garay (Eds.). Springer, Heidelberg, 40–56. https://doi.org/10.1007/978-3-642-40041-4_3 [35] Zeev Dvir and Sivakanth Gopi. 2016. 2-Server PIR with Subpolynomial Commu-nication. J. ACM 63, 4 (2016), 39:1–39:15. https://doi.org/10.1145/2968443 [36] Klim Efremenko. 2012. 3-Query Locally Decodable Codes of Subexponential Length. SIAM J. Comput. 41, 6 (2012), 1694–1703. https://doi.org/10.1137/ 090772721 [37] Eric Fung, Georgios Kellaris, and Dimitris Papadias. 2015. Combining Differential Privacy and PIR for Efficient Strong Location Privacy. In Advances in Spatial and Temporal Databases - 14th International Symposium, SSTD 2015, Hong Kong, China, August 26-28, 2015. Proceedings (Lecture Notes in Computer Science, Vol. 9239) ,Christophe Claramunt, Markus Schneider, Raymond Chi-Wing Wong, Li Xiong, Woong-Kee Loh, Cyrus Shahabi, and Ki-Joune Li (Eds.). Springer, 295–312. https: //doi.org/10.1007/978-3-319-22363-6_16 [38] Craig Gentry and Zulfikar Ramzan. 2005. Single-Database Private Information Retrieval with Constant Communication Rate, See [ 22 ], 803–815. https://doi. org/10.1007/11523468_65 [39] Thomas Gerbet, Amrit Kumar, and Cédric Lauradoux. 2016. A Privacy Analysis of Google and Yandex Safe Browsing. In 2016 46th Annual IEEE/IFIP International Conference on Dependable Systems and Networks (DSN) . 347–358. https://doi.org/ 10.1109/DSN.2016.39 [40] Niv Gilboa and Yuval Ishai. 2014. Distributed Point Functions and Their Appli-cations. In EUROCRYPT 2014 (LNCS, Vol. 8441) , Phong Q. Nguyen and Elisabeth Oswald (Eds.). Springer, Heidelberg, 640–658. https://doi.org/10.1007/978-3-642-55220-5_35 [41] Ian Goldberg. 2007. Improving the Robustness of Private Information Retrieval. In 2007 IEEE Symposium on Security and Privacy . IEEE Computer Society Press, 131–148. https://doi.org/10.1109/SP.2007.23 [42] Oded Goldreich. 1987. Towards a Theory of Software Protection and Simulation by Oblivious RAMs. In 19th ACM STOC , Alfred Aho (Ed.). ACM Press, 182–194. https://doi.org/10.1145/28395.28416 [43] Oded Goldreich and Rafail Ostrovsky. 1996. Software Protection and Simulation on Oblivious RAMs. J. ACM 43, 3 (1996), 431–473. https://doi.org/10.1145/233551. 233553 [44] Google. 2008. SafeBrowsing API. https://safebrowsing.google.com/ URL: https://safebrowsing.google.com/. Accessed Jan. 25, 2022. [45] Matthew Green, Watson Ladd, and Ian Miers. 2016. A Protocol for Privately Reporting Ad Impressions at Scale, See [ 73 ], 1591–1601. https://doi.org/10.1145/ 2976749.2978407 [46] Tim Güneysu, Vadim Lyubashevsky, and Thomas Pöppelmann. 2012. Practical Lattice-Based Cryptography: A Signature Scheme for Embedded Systems. In 

CHES 2012 (LNCS, Vol. 7428) , Emmanuel Prouff and Patrick Schaumont (Eds.). Springer, Heidelberg, 530–547. https://doi.org/10.1007/978-3-642-33027-8_31 [47] Trinabh Gupta, Natacha Crooks, Whitney Mulhern, Srinath Setty, Lorenzo Alvisi, and Michael Walfish. 2016. Scalable and Private Media Consumption with Pop-corn. In Proceedings of the 13th Usenix Conference on Networked Systems Design and Implementation (Santa Clara, CA) (NSDI’16) . USENIX Association, USA, 91–107. [48] Ariel Hamlin, Rafail Ostrovsky, Mor Weiss, and Daniel Wichs. 2019. Private Anonymous Data Access. In EUROCRYPT 2019, Part II (LNCS, Vol. 11477) , Yuval Ishai and Vincent Rijmen (Eds.). Springer, Heidelberg, 244–273. https://doi.org/ 10.1007/978-3-030-17656-3_9 [49] Ryan Henry. 2016. Polynomial Batch Codes for Efficient IT-PIR. PoPETs 2016, 4 (Oct. 2016), 202–218. https://doi.org/10.1515/popets-2016-0036 [50] Alexandra Henzinger, Matthew M. Hong, Henry Corrigan-Gibbs, Sarah Meikle-john, and Vinod Vaikuntanathan. 2022. One Server for the Price of Two: Simple 378 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1) 

and Fast Single-Server Private Information Retrieval. Cryptology ePrint Archive, Paper 2022/949. https://eprint.iacr.org/2022/949 https://eprint.iacr.org/2022/949. [51] Andreas Hülsing, Joost Rijneveld, John M. Schanck, and Peter Schwabe. 2017. High-Speed Key Encapsulation from NTRU. In CHES 2017 (LNCS, Vol. 10529) ,Wieland Fischer and Naofumi Homma (Eds.). Springer, Heidelberg, 232–252. https://doi.org/10.1007/978-3-319-66787-4_12 [52] Yuval Ishai, Eyal Kushilevitz, Rafail Ostrovsky, and Amit Sahai. 2004. Batch codes and their applications. In 36th ACM STOC , László Babai (Ed.). ACM Press, 262–271. https://doi.org/10.1145/1007352.1007396 [53] Yael Kalai and Leonid Reyzin (Eds.). 2017. TCC 2017, Part II . LNCS, Vol. 10678. Springer, Heidelberg. [54] Dmitry Kogan and Henry Corrigan-Gibbs. 2021. Private Blocklist Lookups with Checklist. In 30th USENIX Security Symposium (USENIX Security 21) . USENIX Association, 875–892. https://www.usenix.org/conference/usenixsecurity21/ presentation/kogan [55] Eyal Kushilevitz and Rafail Ostrovsky. 1997. Replication is NOT Needed: SINGLE Database, Computationally-Private Information Retrieval. In 38th FOCS . IEEE Computer Society Press, 364–373. https://doi.org/10.1109/SFCS.1997.646125 [56] Helger Lipmaa. 2005. An Oblivious Transfer Protocol with Log-Squared Commu-nication. In ISC 2005 (LNCS, Vol. 3650) , Jianying Zhou, Javier Lopez, Robert H. Deng, and Feng Bao (Eds.). Springer, Heidelberg, 314–328. [57] Wouter Lueks and Ian Goldberg. 2015. Sublinear Scaling for Multi-Client Private Information Retrieval. In FC 2015 (LNCS, Vol. 8975) , Rainer Böhme and Tatsuaki Okamoto (Eds.). Springer, Heidelberg, 168–186. https://doi.org/10.1007/978-3-662-47854-7_10 [58] Yiping Ma, Ke Zhong, Tal Rabin, and Sebastian Angel. 2021. Incremental Of-fline/Online PIR (extended version). IACR Cryptol. ePrint Arch. (2021), 1438. https://eprint.iacr.org/2021/1438 [59] Samir Jordan Menon and David J. Wu. 2022. SPIRAL: Fast, High-Rate Single-Server PIR via FHE Composition. In 43rd IEEE Symposium on Security and Privacy, SP 2022, San Francisco, CA, USA, May 22-26, 2022 . IEEE, 930–947. https://doi.org/ 10.1109/SP46214.2022.9833700 [60] Daniele Micciancio and Chris Peikert. 2012. Trapdoors for Lattices: Simpler, Tighter, Faster, Smaller. In EUROCRYPT 2012 (LNCS, Vol. 7237) , David Pointcheval and Thomas Johansson (Eds.). Springer, Heidelberg, 700–718. https://doi.org/10. 1007/978-3-642-29011-4_41 [61] Prateek Mittal, Femi G. Olumofin, Carmela Troncoso, Nikita Borisov, and Ian Goldberg. 2011. PIR-Tor: Scalable Anonymous Communication Using Private Information Retrieval. In USENIX Security 2011 . USENIX Association. [62] Muhammad Haris Mughees, Hao Chen, and Ling Ren. 2021. OnionPIR: Response Efficient Single-Server PIR. In Proceedings of the 2021 ACM SIGSAC Conference on Computer and Communications Security (Virtual Event, Republic of Korea) 

(CCS ’21) . Association for Computing Machinery, New York, NY, USA, 2292–2306. https://doi.org/10.1145/3460120.3485381 [63] Muhammad Haris Mughees, Gonçalo Pestana, Alex Davidson, and Benjamin Livshits. 2021. PrivateFetch: Scalable Catalog Delivery in Privacy-Preserving Advertising. CoRR abs/2109.08189 (2021). arXiv:2109.08189 https://arxiv.org/ abs/2109.08189 [64] Jeongeun Park and Mehdi Tibouchi. 2020. SHECS-PIR: Somewhat Homomor-phic Encryption-Based Compact and Scalable Private Information Retrieval. In ESORICS 2020, Part II (LNCS, Vol. 12309) , Liqun Chen, Ninghui Li, Kaitai Liang, and Steve A. Schneider (Eds.). Springer, Heidelberg, 86–106. https: //doi.org/10.1007/978-3-030-59013-0_5 [65] Sarvar Patel, Giuseppe Persiano, and Kevin Yeo. 2018. Private Stateful Information Retrieval. In ACM CCS 2018 , David Lie, Mohammad Mannan, Michael Backes, and XiaoFeng Wang (Eds.). ACM Press, 1002–1019. https://doi.org/10.1145/3243734. 3243821 [66] Oded Regev. 2005. On lattices, learning with errors, random linear codes, and cryptography. In 37th ACM STOC , Harold N. Gabow and Ronald Fagin (Eds.). ACM Press, 84–93. https://doi.org/10.1145/1060590.1060603 [67] Ling Ren, Christopher W. Fletcher, Albert Kwon, Emil Stefanov, Elaine Shi, Marten van Dijk, and Srinivas Devadas. 2015. Constants Count: Practical Improvements to Oblivious RAM. In USENIX Security 2015 , Jaeyeon Jung and Thorsten Holz (Eds.). USENIX Association, 415–430. [68] Sacha Servan-Schreiber, Kyle Hogan, and Srinivas Devadas. 2021. AdVeil: A Private Targeted-Advertising Ecosystem. Cryptology ePrint Archive, Report 2021/1032. https://ia.cr/2021/1032. [69] Radu Sion and Bogdan Carbunar. 2007. On the Practicality of Private Information Retrieval. In NDSS 2007 . The Internet Society. [70] Emil Stefanov, Marten van Dijk, Elaine Shi, T.-H. Hubert Chan, Christopher W. Fletcher, Ling Ren, Xiangyao Yu, and Srinivas Devadas. 2018. Path ORAM: An Extremely Simple Oblivious RAM Protocol. J. ACM 65, 4 (2018), 18:1–18:26. https://doi.org/10.1145/3177872 [71] Volker Strassen. 1969. Gaussian Elimination is Not Optimal. Numer. Math. 13, 4 (aug 1969), 354–356. https://doi.org/10.1007/BF02165411 [72] Stephanie Wehner and Ronald de Wolf. 2005. Improved Lower Bounds for Locally Decodable Codes and Private Information Retrieval, See [ 22 ], 1424–1436. https://doi.org/10.1007/11523468_115 [73] Edgar R. Weippl, Stefan Katzenbeisser, Christopher Kruegel, Andrew C. Myers, and Shai Halevi (Eds.). 2016. ACM CCS 2016 . ACM Press. [74] Virginia Vassilevska Williams. 2012. Multiplying matrices faster than coppersmith-winograd. In 44th ACM STOC , Howard J. Karloff and Toniann Pitassi (Eds.). ACM Press, 887–898. https://doi.org/10.1145/2213977.2214056 [75] Sergey Yekhanin. 2008. Towards 3-query locally decodable codes of subexponen-tial length. J. ACM 55, 1 (2008), 1:1–1:16. https://doi.org/10.1145/1326554.1326555 

## A PROOFS FROM SECTION 4 A.1 Proof of Theorem 4.1 

Let eb ← b + fi , where i is the requested index of DB by the client. As laid out in Section 4.4, we must show that Equation (6) holds, with all but negligible probability. Firstly, note that since e ← ( χ )m ,then by Corollary 3.5, we have that ∥e · D ∥∞ ≤ 4ρ√m with high probability. This follows because the number of samples m is very large and by assuming that each entry in D is equal to ρ = ∥D ∥∞.Consequently: 

⌊( e + fi )T · D⌉ρ = ⌊ρ/q · ( eT · D + fi T · D)⌉ 

= ⌊ρ/q · ( eT · D) + D[i]⌉ 

= ⌊y + D[i]⌉ ,

(9) where y = ρ/q · ( eT · D) and D[i] ∈ Zω

q is the ith row of D (inter-preted as a column vector). Therefore, ∥y∥∞ < 4ρ2√m/q = 1/2 by the statement of the theorem and, as a consequence: 

⌊( e + fi )T · D⌉ρ = D[i], (10) which is the correct output of the protocol. □

## A.2 Proof of Theorem 4.2 

Let ip ← FPIR .ssetup (1λ ), pp ← FPIR .spreproc (DB ) and st ←

FPIR .cpreproc (pp ); let i0, i1 ← A( ip , pp ), let b ←$ {0, 1}, and let 

fbb ← FPIR .query (st , ib ). In particular, we have that fbb = sT ·

A + eT + fib

T ∈ Zmq , for A ∈ st , s ← ( χ )n , e ← ( χ )m , A ←

PRG (μ, n, m, q), and fib the m-dimensional vector of all zeroes ex-cept where fib [ib ] = q/ρ. Clearly, we can show that FPIR is secure if we can show that the output of FPIR .query is distributed uni-formly. Firstly, note that A is sampled as the output of a pseudorandom generator, therefore, it is indistinguishable from A ←$ Zn×mq . There-fore, let A be an adversary in the LWE q,n,m, χ decisional security game (Definition 3.1), receiving (A, u) as the challenge, and let S

be an adversary in the PIR 1-query indistinguishability game (Defi-nition 3.7). When A receives the sample in Equation (1) , b and eb

are distributed identically, and when it receives the sample in Equa-tion (2) , then b ←$ Zmq . Therefore, the adversary A can simulate the client query to S by simply sending eb = u + fib for b ←$ {0, 1}.When S returns their guess b′ ∈ { 0, 1} to A, A checks if b′ ?

= b.Clearly, whatever advantage ϵ that S has in guessing the correct value of b, immediately translates to A having advantage ϵ in the decisional LWE q,n,m, χ security game. Since we assume that 

LWE q,n,m, χ is difficult to solve, we therefore conclude that ϵ ≤

negl (λ ).To conclude, in the case that b is sampled uniformly, then the adversary has no advantage in distinguishing since eb is distributed uniformly. □

379 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi 

## A.3 Proof of Corollary 4.3 

We can construct a matrix eB from each query ebj (j ∈ [ ℓ]) that S

observes with the following structure: 

eB =

h eb1 · · · ebℓ

i

=

h

(s1T · A + e1T )T + fi1 · · · (sℓT · A + eℓT )T + fiℓ

i

= ([ s1 ∥ · · · ∥ sℓ ]T · A + [e1 ∥ · · · ∥ eℓ ]T )T +  fi1 · · · fiℓ



= S · A + E + F ∈ Zℓ×mq .

(11) Using the same proof strategy as in Theorem 4.2, we can use A as an adversary attempting to decide in the decisional MatLWE q,n,m, χ ,ℓ 

security game (Definition 3.3). This illustrates that A has advan-tage equal to that which S has in deciding the uniformity of eB.Furthermore, by Corollary 3.4, we know that ϵ = ℓ · ν, where ν is the max advantage of winning in LWE q,n,m, χ . Since ℓ = poly (λ ),then ϵ = poly (λ ) · negl (λ ) = negl (λ ). □

## B SAFEBROWSING EXAMPLE 

Major browsers such as Google Chrome, Firefox, and Brave inte-grate a security service run by Google and known as the SafeBrows-ing API [ 44 ]. SafeBrowsing allows browsers to verify if online re-sources and webpages that the user requests are “safe”. If a resource has been flagged as “unsafe”, the user is warned by the browser and asked to explicitly consent visiting the website that contains the unsafe resource. The SafeBrowsing service relies on a list of blocked resources maintained by Google, and it exposes an API that informs the browser if a resource is part of the blocked list. The downside of serving queries to the SafeBrowsing API remotely is that clients would effectively reveal their browsing patterns to Google. It is clear that it will be important to build mechanisms that preserve client privacy from third parties (like Google, in this case), while still being able to inform users if they are about to load malicious content. 

## B.1 Current SafeBrowsing Implementation 

Local Storage. In order to avoid calling the remote API for ev-ery resource, the entire SafeBrowsing blocklist could be shipped with each browser, but storing the full blocklist ( > 90 MB) may be beyond some clients. Consequently, every browser instead stores a compressed and probabilistic data structure that contains an ap-proximate view of the SafeBrowsing blocklist. This local data struc-ture allows performing probabilistic checks of inclusion, with non-negligible chances of false-positives occurring and no chance of 

false-negatives . Due to the rate of potential false positives , if an in-clusion check returns positive (i.e. an unsafe resource), the browser remains uncertain. To remove the uncertainty, the browser confirms if the resource is unsafe by calling the remote SafeBrowsing API. Thus, the browser only relies on the remote API call to SafeBrows-ing services when the set inclusion against the local data structure returns a potential false positive. This mechanism reduces consid-erably the number of remote API calls at the expense of storing a compressed, space optimized data structure locally in the browser. The local blocklist is a set of 32-bit hashes of the resource URI, and the full SafeBrowsing blocklist consists of a key-value database mapping a 32-bit hash to a SHA256 hash of a blocked resource URI. The local blocklist results in storage and bandwidth that is 

8× smaller then the full SafeBrowsing blocklist. We summarize the two distinct phases of SafeBrowsing checks in the following. (1) (Phase 1: Local check) First, the browser computes the 32-bit hash of the resource URI that has been requested, and checks if the 32-bit hash is part of the local storage. If the set inclusion operation returns ‘false’ (i.e. the hash of the resource does not exists in the local data structure), then the browser considers the resource safe and proceeds. If the set inclusion operation returns ‘true’ (i.e. the 32-bit resource hash is part of the local block list), the client proceeds to the next phase. (2) (Phase 2: Remote check) When Phase 1 identifies a possi-bly unsafe resource, the browser needs to confirm whether the resource is a false positive or not. To do so, it requests the full SHA256 hash of the resource’s URI by querying the remote SafeBrowsing API for the 32-bit hash of the resource URI computed in Phase 1. If the full SHA256 hash returned by the remote SafeBrowsing API matches with the SHA256 of the resource URI, then the resource is part of the SafeBrows-ing blocklist, and the browser considers the resource unsafe. 

Privacy Considerations. The remote SafeBrowsing resource check (Phase 2) requires the browser to explicitly include the 32-bit hash identifying the resource that is being checked for inclusion on the SafeBrowsing blocklist. As noted by [ 14 , 39 ], this request leaks in-formation about the browsing history of the user, as the SafeBrows-ing API service is able to learn which content a particular user is interested in. Over time, this information can be used by the SafeBrowsing service provider to construct a behavior profiling of web users without their consent. 

## B.2 SafeBrowsing via FrodoPIR 

FrodoPIR can be used to implement the remote SafeBrowsing API service, such that no leakage occurs during the remote SafeBrows-ing API check. The intuition is that, once the index that must be queried is known to the client, the remote check can be performed via a PIR query to a remote FrodoPIR database, that stores all the SHA256 hashes of the unsafe URIs. Given the privacy guarantees of FrodoPIR , the client does not leak which resource ID is being queried. 

Requirements. Based on the estimates provided by [ 54 ], the cur-rent SafeBrowsing blocklist contains about 3 million entries. The blocklist grows at a rate of 30 , 000 new entries per week. Each of the values in the database consists of a SHA256 hash of the content URI. 

Mapping URL Hashes to Query Indices. As in [ 54 ], we will assume that local blocklist is augmented to include the index that must be queried in the online database. That is, when the client finds a match in their local blocklist, they use the corresponding index i

that is included to make a query for element i in the remote server database. 

Database Configuration. As shown in Section 5, FrodoPIR pro-vides a high degree of flexibility, allowing developers to choose  

> 380 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

Table 8: Performance analysis of the FrodoPIR scheme when communicating with a single database shard, using the pa-rameters defined in Section B.2.          

> Offline Client download (KB) 180 Database preprocessing (s) 28.555 Client derive params (s) 2.2281 Client query preprocessing (s) 0.573 Online Client query (KB) 1024 Server response (KB) 0.1 Client query (ms) 0.097 Server response (ms) 5.223 Client output (ms) 0.012

which trade-offs to make when deploying an instance of the PIR database. We now suggest the following database configuration to implement FrodoPIR for SafeBrowsing: 

• We choose q = 232 and n = 1774 , which should be satis-factory for even the large number of clients using major Internet browsers that integrate with the SafeBrowsing API. According to [ 2], this provides 128 -bit security for 252 client queries. In other words, this allows 4 billion clients to each make 1 million queries, which should be more than enough. 

• We require w = 256 bits for storing each URI hash in the server database. 

• Let em be the total number of elements in the SafeBrowsing database. We require that em ≥ 221 to accommodate all the 3 million entries and subsequent updates [ 54 ]. However, we leverage sharding to break down the databases into smaller sub-databases , as explained in Section 5.4. Assuming that 

FrodoPIR is running on a machine with 16 cores, we can split the blocklist into s = 16 sub-databases , resulting in setting 

m = 218 per shard. This provides a database with total size 

222 , which is enough to store the entire blocklist. 

• Given w, m and q, we set ρ = 210 so that the correctness guarantee from Theorem 4.1 holds true. 

• We calculate ω = m/log (ρ) = 26 as described in Section 5. 

• The local blocklist that each client must download contains 

32 · ( m + 1) bits to include each 32 -bit hash prefix plus the corresponding 32 -bit index. We leverage sharding in two different ways. On one hand, to decrease the size of the database by splitting it into sub-databases ,allowing us to reduce the size m of each sub-database, and to op-timize both user and server performance and bandwidth. In ad-dition, sharding is used to implement a low-cost database update mechanism. Updates to the blocklist happen by adding elements to one sub-database only, in turn requiring clients to derive new parameters only for a single shard at every update, as explained in Section 5.4. This is possible in SafeBrowsing because DB updates are typically only additions, and thus deletion of old content in previous shards is rarely required [54]. 

## B.3 Implementation and Raw Costs 

We set up the experimental environment, and report results in Table 8, corresponding to the raw costs of using the FrodoPIR 

scheme on the aforementioned parameters. We run all experiments as single-threaded processes on the same Amazon t2.2xlarge 

EC2 instance, with 8 CPU cores and 32 GB of RAM, as was used in Section 6. 

## B.4 Performance Analysis 

From Table 8, we estimate the performance of instantiating the SafeBrowsing API for a single database shard using FrodoPIR , using the parameter set defined in Section B.2. Our extrapolations are based on the following set of usage model assumptions that are taken from the previous work of Kogan and Corrigan-Gibbs [ 54 ] on exploring usage of PIR for satisfying the demands of SafeBrowsing. 

• On average, clients launch a query every 44 minutes. Assum-ing 12 hours of daily usage, this leads to approximately 16 queries per day. 

• On average, the server database is updated every 94 minutes. This leads to around 16 DB updates per day, with a weekly addition of around 30 , 000 records. 

• The server is a collection of Z replicas that are distributed globally, that each independently possess and process queries on the same database. Any client query can be fulfilled by a single server. 

• Client storage must be, at least, a constant factor smaller than the entire SafeBrowsing database size. 

Database Initialization and Updates. The main server initializes the sub-database, public parameters, and local blocklist for each individual shard. Each of these remain static for a monthly period and are downloaded by each server replica. When the main server initializes, or rotates the matrix A, it posts the public parameters 

pp = (μ, M = {Mi = A · Di }i ∈[ 16 ]) and local blocklists to a public location that clients can access and download from. Note that Mi ∈

Zm×ω 

> q

corresponds to the public parameters made available for each sub-database. Based on our usage model, we will assume that there are 16 

database updates made by the server, each containing 268 records. We assume that clients each download and process 8 updates per day. Each database update touches a single shard DB i , and results in uploading a new value of Mi .

Client Processing. Client preprocessing amounts to preprocess-ing 16 queries per day, using the server provided parameters pp .After every update, the client needs to regenerate the remaining preprocessed state that is associated with the sub-database that was updated. Recall that the client stores: 

X = (bj = sT · A + eT , Cj = {ci = sj T · Mi }i ∈[ 16 ])j ∈[ 16 ]

for each of the j ∈ [ 16 ] queries that the client will launch, and for each of the i ∈ [ 16 ] database shards. The client must also store each 

sj that it samples, for responding to server updates as well as the local blocklist. At the start of each day, the client rederives A ← PRG (μ, n, m, q),and computes the set X . Every time that the client makes a remote query it removes a pair (bj , Cj ) from storage, and sends ebj = b + fι

to the server, for query index ι computed during the local blocklist check. Whenever the server issues a database update for shard i, the client redownloads Mi and the local blocklist, and uses sj to update 

ci = sj T · Mi ∈ Cj , for each remaining j (i.e. unused preprocessed  

> 381 Proceedings on Privacy Enhancing Technologies 2023(1) Alex Davidson, Gonçalo Pestana, and Sofía Celi

query data). According to Table 8, we have the following (per-day) client computational costs. 

• A single derivation of A.

• preprocessing of 16 queries for each of the 16 shards. 

• Updating of 2 Í7 

> a=1

a = 56 queries per day. 

• 16 individual online queries. We ignore the cost of running queries on the 32-bit hashes in the local blocklist, since these are negligible by comparison. Further-more, the per shard cost of updating preprocessed query data is almost zero. Therefore, we calculate the total CPU costs of each client to amount to 32 .96 + 16 · 0.47 + 16 ∗ 0.00025 = 40 .48 seconds per day. 

Client Download. The initial client download of public param-eters is equal to 128 + 16 · ( nω log (q)) = 23 , 615 , 616 bits, which corresponds to around 2.82 MB. The total size of the local block-list is approximately 32 · 3million bits, which is equal to 11 .44 MB. The running download cost per-day is calculated as 16 ω log (q) +

8nω log (q)) + 32 ∗ 268 = 11 , 829 , 632 bits, which is roughly 1.41 MB. 

Client Query. The client query is linear in the size of a single shard, which has a maximum of 218 elements. Therefore, each query is around 1MB in size, based on the costs from Table 6. As a conse-quence, this results in roughly 16 MB of additional communication per-day. 

Client Storage. The client needs ∼ 1MB to store each prepro-cessed query, and each secret vector sj , for j ∈ [ 16 ]. In total, this represents about 16 MB of required storage. Secondly, the client must store the local prefix table for the SafeBrowsing API which amounts to storing a further 11 .44 MB of data. Thirdly, the client stores the public parameters made available by the server, which totals 2.82 MB. Overall, the maximum client storage overhead is 

∼ 30 .69 MB, which is a 91 .55 /30 .26 = 3.0× saving compared with storing the original database. As the client makes queries, it deletes used preprocessed data, and so this storage overhead will decrease as the day progresses. 

Server Processing. The non-private SafeBrowsing API has an av-erage latency of around 90 ms per client query [ 54 ]. This is achieved using Z = 143 servers answering client queries. Note that a single 

FrodoPIR server can answer a single client query in ∼ 5ms (Table 8). We assume that 1 billion queries are received uniformly in 90 ms windows over a 44 minute period. 18 Therefore, in each 90 ms win-dow around 29334 client queries are received. Further, we assume that each server can answer 3 client queries in 90 ms (including time taken to receive and respond to the client HTTP request). To achieve this, we would need at least 9778 individual servers each answering queries on the same FrodoPIR database for servicing 1

billion clients. Clearly, this is much more expensive than running the non-private version of SafeBrowsing, but such a number of servers is still within the realms of practicality, whilst preserving client privacy. 

Comparison with [ 54 ]. The work of Kogan and Corrigan-Gibbs presents two PIR-based constructions for running the SafeBrowsing API, one based on PIR from distributed point functions (dpfPIR),     

> 18 In other words, simulating 1query from every client every 44 minutes.

Table 9: Comparison of instantiating the SafeBrowsing API using either FrodoPIR , or via the two-server PIR schemes of [54]. Estimated costs are marked with asterisks.                                 

> Performance indicators Non-private dpfPIR ooPIR FrodoPIR
> Servers per 1B users 143 9047 1348 9778 ∗
> Latency (ms) 90 122 91 90 ∗
> Client init (sec) 3.12.613 .332 .96 ∗
> Client running (sec/month) 0.50.88.01272 .0∗
> Initial communication (MB) 5.05.010 .32.82
> Online communication (MB/month) 3.03.69.0539 .7
> Max storage (MB) 4.54.526 .130 .69 ∗

and the other based on offline-online PIR (ooPIR). Both schemes require two non-colluding servers. We compare the performance of running the SafeBrowsing API using FrodoPIR against both dpfPIR and ooPIR in Table 9. Clearly, FrodoPIR involves heavier usage costs compared to all known solutions, either non-private or using multi-server PIR. As previously highlighted, a limitation of the FrodoPIR scheme is the client request size, which makes up a large proportion of the total communication ( 496 MB per month, as opposed to 43 .7MB of download). The client computation is also much heavier than in multi-server PIR, due to the requirement for computing high-dimensional cryptographic operations when preprocessing queries. Otherwise, our estimates suggest that FrodoPIR can provide ad-equate performance for operators where non-colluding PIR servers are impossible to set up. However, it is worth noting that the exper-imental analysis of [ 54 ] provides significantly more detail than we do here. Our goal is to give a broad understanding of the increased overheads of using FrodoPIR .

## C ALTERNATIVE LWE PARAMETERS 

Our security analysis assumes that the λ-bit security of the Matrix LWE problem ( MatLWE q,n,m, χ ,ℓ ) is calculated as the ν-bit security of the underlying LWE problem, minus the logarithm of the number of queries that are launched ( ℓ). This analysis is conservative for two reasons: (1) the number of queries that we protect against with our parameter choice ( 252 ) is very large; and (2) it’s not clear that lattice cryptanalysis can exploit the Matrix LWE problem any easier than LWE. Therefore, choosing lattice parameters that are smaller may preserve adequate security, while improving efficiency. Here, we discuss the impact on efficiency of reducing the LWE dimension, n. In particular, Section 5, we chose n = 1774 . If we choose n = 1572 , then this provides 128 -bit security against 1 billion queries, using the same cost model for estimating the hardness of Matrix LWE. However, if we simply focus on achieving 128 -bit security for the underlying Ternary LWE instance, then we can choose n = 1228 instead. 19 

In Table 10, we highlight how costs change as the lattice dimen-sion reduces (for databases of size 216 and 220 ), when compared with the original performance for n = 1774 from Section 6. The online phase is largely unaffected by the lattice dimension, so we omit measurements for such functions. Overall, we see that bandwidth reduces significantly — by over 11% for n = 1572 , and 27% for n = 1288 — which will translate  

> 19 See Appendix D for the lattice estimation outputs that we use for calculating these dimensions. 382 FrodoPIR: Simple, Scalable, Single-Server Private Information Retrieval Proceedings on Privacy Enhancing Technologies 2023(1)

Table 10: Comparison of FrodoPIR overheads when choosing less conservative security parameterizations. 

Number of DB items ( log (m)) 16 20 

Lattice dimension ( n) 1288 1572 1774 1288 1572 1774 Client download (KB) 4125.6 5035.3 5682.5 4583.5 5594.1 6313.1 Database preprocessing (s) 82.705 96.74 104.57 1439.2 1697.5 1895.2 Client derive params (s) 0.47 0.5506 0.5826 7.22 8.79 9.25 Client query preprocessing (s) 0.135 0.147 0.147 1.933 2.149 2.343 into notable financial savings when servicing queries from large numbers of clients. Furthermore, client storage requirements can be reduced by the same amount. Computational workloads are also reduced but less significantly, particularly because the server preprocessing is amortized across all clients anyway. However, client derivation of A sees an approximate 20% reduction, which may be notable when considering low-powered clients. 

## D LATTICE ESTIMATION 

For calculating the security estimates of LWE parameters, we used the lattice estimator of [ 2 ]. Specifically, we used the code avail-able at https://github.com/malb/lattice-estimator, from commit: 

f9dc7c625d93b9c645c56bf9dfd3d4ec202f17d1 . The security es-timations were obtained using the following code and correspond-ing output. 20
