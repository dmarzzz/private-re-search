---
url: https://link.springer.com/article/10.1186/s42400-026-00601-7
title: FlashPIR: low-latency FHE-based single-server PIR with low client overhead - Cybersecurity
fetched_at: 2026-05-30T16:02:33
content_hash: sha1:90f10892faf936ce56803c0dbc5ba47e90b6bb01
extractor: trafilatura
---

## Abstract

Toward practical and client-friendly single-server private information retrieval, we introduce FlashPIR, a scheme achieving both low client overhead and high server throughput. Constructed based on fully homomorphic encryption, our protocol possesses two distinct advantages: First, a majority of the resource-intensive computations can be performed in an offline phase, prior to query reception, significantly reducing the online response time. Second, database updates operate independently of clients, with low client computational overhead remaining nearly constant regardless of the database scale. We conducted comprehensive experiments to evaluate the performance of FlashPIR. The results demonstrate that for database sizes of 256 MB, our scheme achieves a throughput \(2.6\times\) greater than KsPIR (Luo et al., CCS 2024) and \(18.5\times\) greater than Spiral (Menon and Wu, S&P 2022).

### Similar content being viewed by others

## Introduction

Originally introduced by Chor et al. ([1995a](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR18)), private information retrieval (PIR) enables clients to obtain specific database elements from servers while keeping query indices confidential. PIR protocols are broadly classified into two categories: multi-server protocols (Chor et al. [1995b](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR19); Dvir and Gopi [2016](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR23); Corrigan-Gibbs and Kogan [2020](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR21); Kogan and Corrigan-Gibbs [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR34)) that require database replication across servers , and single-server protocols (Kushilevitz and Ostrovsky [1997](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR35); Cachin et al. [1999](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR10); Chang [2004](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR12); Gentry and Ramzan [2005](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR27); Angel et al. [2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR3); Ahmad et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR1); Corrigan-Gibbs et al. [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR20)) operating on a centralized database, both of which have seen significant theoretical and practical research advances.

Despite its efficiency challenges, the single-server PIR offers greater practicality by avoiding the strong trust assumption of multiple non-colluding servers. Recent lattice-based single-server PIR protocols (Melchor et al. [2016](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR43); Gentry and Halevi [2019](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR26); Ali et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR2); Mughees et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR48); Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44); Henzinger et al. [2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR31); Davidson et al. [2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR22); Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36); Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)) have made significant progress in addressing this efficiency limitation, showing markedly better performance than trivial retrieval approaches. Based on their fundamental design philosophies toward client resource management, existing PIR protocols fall into two categories:

**Category I: High Client Overhead**. These designs leverage heavy client-side resources, combining intensive offline processing with significant hint storage requirements. Using this strategy, current state-of-the-art single-server PIR schemes (Kogan and Corrigan-Gibbs [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR34); Davidson et al. [2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR22); Henzinger et al. [2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR31); Zhou et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR55); Ren et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR52); Wang and Ren [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR53)) achieve exceptional online throughput through query-independent offline hints, with performance approaching the limits of system memory bandwidth. Nevertheless, this high performance comes at the cost of substantial client-side storage, with overhead that may approach the scale of the database in extreme cases, while its efficiency advantage diminishes significantly when handling large records.

**Category II: Low Client Overhead**. This approach minimizes client load by employing a stateless operation requiring no database-dependent hints and supporting client-independent database updates. Recent FHE-based (fully homomorphic encryption) schemes such as Spiral (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)), KsPIR (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)), and other notable schemes (Ahmad et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR1); Ali et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR2); Mughees et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR48); Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36); Menon and Wu [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR45); Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11)) have advanced efficient implementations of this paradigm. Leveraging its efficient expansion algorithm and low-noise external products, the Spiral PIR family (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)) achieves a superior rate compared to other FHE-based PIR schemes, delivering compact 14 KB queries and 20KB responses. While most schemes in this category achieve exceptional communication efficiency, this advantage is attained at the cost of substantially increased computational time on both the server and client sides.

These two categories of schemes, however, resist direct comparison as they optimize fundamentally different performance trade-offs. The first category targets clients with substantial computational power and storage capacity. These clients actively participate in computations and can store larger server-side hints, thereby achieving significantly faster response times. This second architecture offers an optimal solution for lightweight clients with limited resources, combining the advantages of bandwidth-efficient communication with the flexibility of server-stateless operations that support on-demand database updates. Each approach offers distinct advantages in specific deployment scenarios, making continued advancements in both categories valuable for practical applications.

To systematically evaluate these trade-offs, our study of low client-overhead PIR schemes focuses on the following key performance metrics: (1) Server throughput, defined as the ratio between database size and server computation time, quantifies the PIR query response speed relative to database scale. (2) Rate, defined as the response size divided by the actual retrieved record size, quantifies the communication overhead in server-client data transmission. (3) Query size, defined as the byte length of the encrypted query transmitted from the client to the server. (4) Response time, defined as the duration between server query reception and completion of online response generation. (5) Response size, defined as the byte length of the response transmitted from the server to the client. Together, these metrics form a holistic view of scheme performance, essential for practical deployment.

These metrics enable a systematic evaluation of PIR schemes. Applying them to existing Category II designs reveals a consistent bottleneck: high server online latency. While these schemes achieve excellent communication efficiency, the server’s online response time remains substantial. For Spiral, this latency is dominated by expensive homomorphic operations during query expansion and folding. High online latency directly limits achievable throughput and makes these schemes less suitable for interactive applications that require fast response times.

Why is it difficult to reduce online latency in Category II schemes? The computationally heavy parts of query processing are inherently tied to the client’s secret key, including key-switching and expansion operations. A naive approach would precompute all possible queries, but this would require server-side state proportional to the database size, which is infeasible. The core challenge is therefore to identify and isolate the computationally heavy portion of query processing that is independent of the client’s online query. This would allow us to move that work to an offline phase without compromising security.

Within Category II, two primary optimization paths have emerged. The first pursues a stateless design with minimal client load (Burton et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR9); Yang et al. [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR54); Lin and Tian [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR37); Chen and Ren [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR15); Kang and Schild [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR32)). The second seeks to enhance server throughput under a low-client-load constraint (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44); Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36); Menon and Wu [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR45); Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11); Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)). However, neither path achieves low server online latency while maintaining low client overhead. Schemes in the first path accept higher latency as a trade-off for stateless operation. Schemes in the second path reduce latency but remain limited by expensive online homomorphic operations, as seen in Spiral. Thus, achieving low server online latency without increasing client overhead remains an open problem.

Our solution, FlashPIR, precisely tackles this challenge. Our novel protocol for resource-constrained clients significantly reduces this latency, thereby directly enhancing server throughput. Table [1](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab1) provides a concise comparison of the core performance metrics between Category II schemes and our solution.

### Contribution

We present FlashPIR, a new single-server PIR scheme that simultaneously delivers low client overhead and low-latency online response. Our design builds upon the dimensional folding framework of Spiral (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)) and introduces two key innovations:

First, we restructure the key-switching operations within the Spiral-style folding pipeline. By moving the expensive multiplications to an offline phase triggered by a client-provided seed, we eliminate the computational bottleneck from the online path. Since both query expansion and dimension folding rely heavily on key-switching, this restructuring directly addresses the core challenge of isolating the index-independent portion of query processing and significantly shortens the server’s online response time.

Second, we encrypt the two query components with distinct plaintext encodings, endowing them with different homomorphic semantics. This reduces the multiplicative cost of second-dimensional folding and further cuts the server’s online computational load.

We implemented FlashPIR in C++ with Intel’s HEXL library. On a 256 MB database, FlashPIR achieves a throughput of 2844 MB/s, outperforming Spiral by \(18.5\times\) and KsPIR (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)) by \(2.6\times\). This performance gain comes with minimal client overhead and maintains low communication cost. More details are presented in Section 5.2.

### Technical overview

Our scheme follows the standard FHE-based PIR framework: The client encrypts the query index and sends it to the server. Holding the entire database, the server performs homomorphic computations that produce the encrypted target record and returns it. Finally, the client decrypts this response to retrieve the desired record. We encode the database as a two-dimensional matrix \(\textrm{DB}\in \mathbb {Z}^{n\times n}_q\) and apply two different FHE encryptions to processes the query index \((u,w)\in [n]\times [n]\): \(\textrm{RLWE}.\textsf {Enc}(u)\) for rows and \(\textrm{RGSW}.\textsf {Enc}(X^{-w})\) for columns.

**Generalized Preprocessing**. To minimize server’s online computation time, we develop the following key techniques based on fundamental observations: During preprocessing, the random component *a* of the ciphertext (*b*, *a*) is pre-multiplied with the keyswitch key, enabling nearly cost-free ciphertext key-switching during the online phase.

\(\textsf {KeySwitch}((b,a),ksk):=(b,0)^\top +\underbrace{ksk\cdot \mathfrak {g}^{-1}(a)}_{preprocessed}\)

Originally proposed in Henzinger et al. ([2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR31)); Davidson et al. ([2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR22)), this method has inspired many follow-up implementations (Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36); Menon and Wu [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR45); Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11); Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)). We generalize this preprocessing technique to homomorphic algorithms centered around key-switching, such as query expansion, plain-ciphertext multiplication, and ciphertext packing.

**Offline Preprocessing**. During the offline phase (i.e., before the client receives the index), the client sends an offline query to the server. Utilizing the database and public key, the server preprocesses the dummy ciphertexts from the offline query to generate two hints: (1) Process the dummy RLWE ciphertext through query expansion, first-dimension folding, and ciphertext packing, producing an RLWE ciphertext hint. (2) Apply query expansion to the dummy \(\textrm{RLWE}'\) ciphertext, yielding an RGSW ciphertext hint.

**Fast Response**. Upon receiving a client’s online query, the server leverages the precomputed hints and the database to compute the response. This process requires only one ciphertext multiplication, supplemented by several scalar multiplications and additions/subtractions. This high efficiency is achieved for two main reasons. Firstly, although the operational sequence mirrors the offline phase, the omission of time-consuming multiplicative operations renders the cost negligible, leaving only lightweight scalar computations. Secondly, the server needs to perform just a single external product to achieve second-dimensional folding. The process culminates in the return of an LWE ciphertext corresponding to the queried index. Figure [1](https://link.springer.com/article/10.1186/s42400-026-00601-7#Fig1) illustrates this complete workflow.

**Response Packing**. To support larger databases and enable cross-database queries, we propose a two-layer response packing technique. In the first layer, multiple LWE ciphertexts are packed into a single RLWE ciphertext. The second layer then converts a set of these RLWE ciphertexts, which are under the same secret key, into a new form where they share identical random components while being encrypted under different secret keys. Consequently, the final response ciphertext comprises message components and only one random component. A schematic overview of this process is presented in Figure [2](https://link.springer.com/article/10.1186/s42400-026-00601-7#Fig2).

### Related works

Several concurrent works in Category II have each achieved breakthroughs in different performance metrics: Spiral (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)), Hintless PIR (Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36)), YPIR (Menon and Wu [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR45)), WhisPIR (Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11)) and KsPIR (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)). Notably, each scheme demonstrates unique strengths in different application scenarios. Below, we analyze their performance trade-offs and contrast them with our proposed approach.

In both the original Spiral protocol (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)) and its RNS variant (Luo and Wang [2025](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR39)), each client’s PIR query is encrypted using an FHE scheme (Gentry [2009](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR25); Brakerski et al. [2012](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR6)), after which the query function is homomorphically evaluated over the encrypted index. After query expansion, the server executes first dimension folding through plaintext-ciphertext multiplications, followed by subsequent dimensions folding via the external product (Chillotti et al. [2016](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR17)). The strengths of Spiral, which include scalable database processing, low communication overhead, lightweight client requirements, and high rate efficiency, make it an ideal foundational framework for our work. Our approach retains the advantages of Spiral while significantly reducing online latency through computational workflow optimizations.

Both HintlessPIR (Li et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR36)) and YPIR (Menon and Wu [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR45)) build upon classical PIR frameworks, Simple PIR and Double PIR (Henzinger et al. [2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR31)) respectively, while eliminating client-side hint storage through advanced homomorphic algorithms. More precisely, the approaches differ in their cryptographic implementations: HintlessPIR employs homomorphic RLWE-based matrix–vector multiplication (Halevi and Shoup [2014](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR28)), whereas YPIR leverages LWEs-to-RLWE packing algorithm (Chen et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR14)) to compress multiple LWE ciphertexts into a single RLWE response. While achieving throughput levels similar to Simple/Double PIR during large database retrievals, these protocols incur higher online communication costs. In comparison, our scheme achieves throughput comparable to YPIR while maintaining low online communication costs.

WhisPIR (Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11)) significantly optimizes the key-switching key size during query expansion compared to prior protocols (Angel et al. [2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR3); Mughees et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR48); Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)), achieving both low communication overhead and high throughput. As a fully stateless protocol, WhisPIR demonstrates particular suitability for real-world deployment scenarios requiring both large-scale client support and frequent database updates. Although our protocol is not completely stateless, it achieves significantly higher throughput and superior rate compared to WhisPIR.

KsPIR (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)) differs from previous schemes by directly encoding indices into plaintext slots rather than coefficient-based encoding, enabling efficient homomorphic matrix–vector multiplication through the BSGS (baby-step giant-step) algorithm (Lu et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR38); Halevi and Shoup [2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR30), [2015](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR29)). Within the category of schemes prioritizing client computation (Category II), KsPIR achieves the second-highest throughput, surpassed solely by YPIR. Despite this strong performance, our scheme achieves a \(2.6\times\) higher throughput than KsPIR with only a modest increase in online communication.

## Preliminaries

### Notations

We use bold uppercase letters to denote matrices (e.g., *A*, *B*) and bold lowercase letters to denote column vectors (e.g., \({\textbf {u}}\), \({\textbf {v}}\)). For a \(n \times m\) matrix *A*, we define \(A=[a_0,...,a_{m-1}]\) where the *i*-th column vector is \(a_i\) of length *n*, \(A^\top\) denotes the transpose of *A*. We use *a*[*i*] to denote the *i*-th element of *a*, and *A*[*i*, *j*] denote the *i*-th row and *j*-th column element of *A*.

We use \(\mathbb {N}, \mathbb {Z}, \mathbb {R}\) to denote the set of natural numbers, integers and real numbers, respectively. For positive integers \(n, a, b \in \mathbb {Z}\), [*n*] denotes the set \(\{0,1,...,n-1\}\) and [*a*, *b*] denotes the set \(\{a,a+1,...,b-1\}\). For \(x\in \mathbb {R}\), \(\lfloor x \rceil\) denotes the nearest integer to *x*. We use \(\Vert \cdot \Vert _\infty\) denotes the \(l_\infty\)-norm, i.e., \(\Vert a \Vert _\infty =max_i\{a[i]\}\), \(\Vert A \Vert _\infty :=max_i\{\Vert a_i \Vert _\infty \}\).

For a positive integer \(q\in \mathbb {N}\), we write \(\mathbb {Z}_q=\mathbb {Z}/q\mathbb {Z}\) to denote the quotient ring of integers modulo *q*. For *n* a power of two and \(q \ge 2\), we define the polynomial ring \(R = \mathbb {Z}[X]/(X^n + 1)\) and quotient ring \(R_q = R/qR\). We use \(a\leftarrow R\) denote that *a* is uniformly chosen from *R*. Let \(a(X)=a_0+a_1X+...+a_{n-1}X^{n-1} \in R\), we define \(\textsf {coef}(a)\) as the coefficient vector \((a_0, a_1,..., a_{n-1})\).

Let \(\mathfrak {g}=(B^{0},B^{1}...,B^{d-1})\in \mathbb {Z}^d_B\) be a gadget vector, and its inverse process \(\mathfrak {g}^{-1}: \mathbb {Z}_q\rightarrow \mathbb {Z}^d_B\) be a gadget decomposition map in base *B*. For any \(a\in R_q\), the decomposition vector \(\mathfrak {g}^{-1}(a)=(a_0,a_1,...,a_{d-1})\in R^d_B\) such that \(a=\Sigma ^{d-1}_{i=0} a_i\cdot B^i\) where \(d=\lfloor log_Bq\rceil\) and \(a_i\in (-B/2,B/2]\). For a small constant \(\epsilon>0\), we have \(|\langle \mathfrak {g}^{-1}(a),\mathfrak {g}\rangle -a|\le \epsilon\). A property that will be used throughout our work is that \(\mathfrak {g}^{-1}(-a)=-\mathfrak {g}^{-1}(a)\) when using the signed base decomposition algorithm. Table [2](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab2) summarizes the essential notations and definitions used throughout this paper.

### Lattice-based encryptions

The Learning with Errors (LWE) problem (Regev [2005](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR50)) was introduced by Regev, and its hardness can be based on some lattice problems.

### Definition 1

*(Decision-LWE problem*Regev ([2009](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR51))) For positive integers *q*, *n* and an error distribution \(\chi \in \mathbb {Z}\), the decision version of LWE problem is to determine whether a given sample \(({\textbf {a}},b)\in \mathbb {Z}_q^{n+1}\) is a randomly uniform distribution over \(\mathbb {Z}_q^{n+1}\) or generated by sampling \({\textbf {a}} \leftarrow \mathbb {Z}_q^n\), \(e \leftarrow \chi\) and computing \(b=\langle {\textbf {a}},{\textbf {s}}\rangle +e\mod q\) for some secret vector \({\textbf {s}} \in \mathbb {Z}_q^n\).

The LWE assumption is that solving the above Decision-LWE problem is computationally hard. The Ring Learning with Errors (RLWE) problem (Lyubashevsky et al. [2010](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR41)) is an important variant of LWE in the ring setting.

### Definition 2

*(Decision-RLWE problem*Lyubashevsky et al. ([2012](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR42))) For positive integers *q*, *n* and an error distribution \(\chi \in R=\mathbb {Z}[X]/[X^n+1]\), the decision version of RLWE problem is to determine whether a given sample \((a,b)\in R_q^2\) is a randomly uniform distribution over \(R_q^2\) or generated by sampling \(a \leftarrow R_q\), \(e \leftarrow \chi\) and computing \(b=a\cdot s+e\mod q\) for some secret \(s \in R_q\).

Under these assumptions, we formally define the (R)LWE-based cryptosystem and extend it to the RGSW encryption scheme.

### Definition 3

*(The LWE Encryption Scheme*Brakerski and Vaikuntanathan ([2011](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR7))) For a security parameter \(\lambda\), let \(n \in \mathbb {N}\), and \(q, p \in \mathbb {N}\) be the ciphertext and plaintext moduli, respectively. Let \(\chi\) be an error distribution over \(\mathbb {Z}\), and define the scaling factor as \(\Delta = \lfloor q/p \rfloor\). The LWE encryption scheme is defined by the following tuple of algorithms:

-
\(\textrm{LWE}.\textsf {KeyGen}(1^\lambda )\): Sample \({\textbf {s}} \leftarrow \mathbb {Z}_q^n\) and return it.

-
\(\textrm{LWE}.\textsf {Enc}(m,{\textbf {s}})\): To encrypt a message \(m \in \mathbb {Z}_p\), sample \({\textbf {a}} \leftarrow \mathbb {Z}_q^n\), \(e \leftarrow \chi\), and output the ciphertext: \((b,{\textbf {a}})=(\langle {\textbf {a}},{\textbf {s}}\rangle +\Delta m+e\mod q, {\textbf {a}})\in \mathbb {Z}_q^{n+1}\).

-
\(\textrm{LWE}.\textsf {Dec}((b,{\textbf {a}}),{\textbf {s}})\): Compute and output \(\lfloor \frac{b-\langle {\textbf {a}},{\textbf {s}}\rangle }{\Delta }\rceil\).


### Definition 4

*(The RLWE Encryption Scheme*Brakerski et al. ([2012](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR6))) For a security parameter \(\lambda\), let \(n \in \mathbb {N}\), and \(q, p \in \mathbb {N}\) be the ciphertext and plaintext moduli, respectively. Let \(\chi\) be an error distribution over \(R=\mathbb {Z}[X]/[X^n+1]\), and define the scaling factor as \(\Delta = \lfloor q/p \rfloor\). The RLWE encryption scheme is defined by the following tuple of algorithms:

-
\(\textrm{RLWE}.\textsf {KeyGen}(1^\lambda )\): Sample \(s\leftarrow R_q\) and return it.

-
\(\textrm{RLWE}.\textsf {Enc}(m,s)\): To encrypt a message \(m \in R_p\), sample \(a \leftarrow R_q\), \(e \leftarrow \chi\), and output the ciphertext: \((b,a)=(a\cdot s+\Delta m+e\mod q,a)\in R_q^2\).

-
\(\textrm{RLWE}.\textsf {Dec}((b,a),s)\): Compute and output \(\lfloor \frac{b-a\cdot s}{\Delta }\rceil\).


We adapt the definitions of \(\textrm{RLWE}'\) and RGSW from Micciancio and Polyakov ([2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR46)). Let \(\mathfrak {g}=(1,B,\ldots ,B^{d-1})\) be a gadget vector, where \(d=\log _B q\) is the decomposition dimension for ciphertext modulus *q*. The \(\textrm{RLWE}'_s(m)\) and \(\textrm{RGSW}_s(m)\) are defined as follows:

We use \(\otimes\) to denote the homomorphic external product between an RGSW ciphertext and an RLWE ciphertext. Its formal definition is as follows:

### Definition 5

*(External Product*Chillotti et al. ([2016](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR17))) Let \(ct\in R_q^2\) be an RLWE ciphertext encrypting *m* under secret key *s*, \({\textbf {C}}\in R_q^{2\times 2d}\) be an RGSW ciphertext encrypting \(m'\) under secret key *s* and \(\mathfrak {g}^{-1}\) be the inverse process of gadget vector. The homomorphic external product \(\otimes\): \(R_q^2\times R_q^{2\times 2d} \rightarrow R_q^2\) is defined as

\(ct'= ct\otimes {\textbf {C}}=\mathfrak {g}^{-1}(ct)\cdot {\textbf {C}} (mod \ q)\)

where \(ct'\) is an RLWE ciphertext encrypting \(mm'\) under secret key *s*.

### Useful algorithms

In this section, we recall several algorithms that are useful for our protocol, including a basic key-switching algorithm and methods for converting between different ciphertext structures.

#### KeySwitch

Key-switching indicates that the secret key is changed without changing the encrypted message, which was first proposed by Brakerski and Vaikuntanathan ([2011](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR7)). We present the ring version of this algorithm as follows:

-
\(\textsf {KSKGen}(s, z)\): Given two secret keys

*s*and*z*, sample \(a\leftarrow R, e\leftarrow R\) and output a \(\textrm{RLWE}'\) ciphertext*ksk*encrypted*z*under secret key*s*.$$\begin{aligned} ksk=\textrm{RLWE}'_s(z)\in R^{2\times d} \end{aligned}$$ -
\(\textsf {KeySwitch}((b,a),ksk)\): Given a RLWE ciphertext \((b,a)\in R^2_q\) under secret key

*s*and a key-switching key \(ksk \in R^{2d} \leftarrow \textsf {KSKGen}(s, z)\), output a RLWE ciphertext \((b',a')\in R^2_q\) under secret key*z*: \((b',a')^\top =(b,0)^\top +ksk\cdot \mathfrak {g}^{-1}(a)\).

#### RLWE to LWE(s)

We define Algorithm \(\textsf {Expand}\) by composing two primitives. First, the RLWE expansion algorithm from Angel et al. ([2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR3)); Chen et al. ([2019](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR13)) takes an RLWE ciphertext \({\textbf {ct}}\) encrypting \(\mu (X)=\sum _{i=0}^{n-1}\mu _i X^i\) and key-switching keys \(\{aksk_{j}\}_{j\in [r]}\) as input, and outputs \(2^r\) (\(2^r \le n\)) RLWE ciphertexts \({\textbf {ct}}'_{0}, {\textbf {ct}}'_1,\cdots ,{\textbf {ct}}'_{2^r-1}\) each encrypting the coefficients \(\mu _0, \dots , \mu _{2^r-1}\), respectively. Then, by processing each \({\textbf {ct}}'_i\) with the \(\textsf {Extract}\) algorithm (which outputs an LWE ciphertext encrypting a polynomial’s constant term), we obtain LWE ciphertexts respectively encrypting \(\{\mu _i\}_{i\in [2^r]}\).

-
\(\textsf {Extract}({\textbf {ct}}\in R^2_q)\): Given a RLWE ciphertext \({\textbf {ct}}=(b,a)\in R^2_q\) encrypted \(\mu =\mu _0+\mu _1X+...+\mu _{n-1}X^{n-1}\), output an LWE ciphertext \({\textbf {ct}}'\) encrypted \(\mu _0\): \({\textbf {ct}}'=(b[0],{\textbf {a}}')\in \mathbb {Z}^{n+1}_q,\) \({\textbf {a}}'=(a[0],-a[n-1],...,-a[1])\in \mathbb {Z}_q^n\). where

*a*[*i*] denotes the i-th coefficient of the polynomial \(a\in R_q\) for any \(i\in [n]\).

#### LWE(s) to RLWE

Given \(2^r (2^r\le n)\) LWE ciphertexts \(\{{\textbf {ct}}_i=(b_i,{\textbf {a}}_i)\}_{i\in [2^r]}\) that encrypts \(\{\mu _i\}_{i\in [2^r]}\), there is an algorithm (Micciancio and Sorrell [2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR47); Chen et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR14)) that packages them into a RLWE ciphertext \({\textbf {ct}}'=(b', a')\) that encrypts \(\mu =\mu _0+\mu _1X+...+\mu _{k-1}X^{k-1}\in R\). We use \(\textsf {LWEstoRLWE}(\{{\textbf {ct}}_i=(b_i,{\textbf {a}}_i)\}_{i\in [2^r]} \in \mathbb {Z}^{n+1}_Q; \{aksk_j\}_{j\in [r]})\) to denote this packing process, where \(\{aksk_j\}_{j\in [r]}\) are key-switching keys for the corresponding automorphisms.

#### RLWE(s) to RGSW

The \(\textsf {RLWEstoRGSW}\) algorithm from Kim et al. ([2023](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR33)) transforms the expanded ciphertext \(\textrm{RLWE}'_s(m) = (\textrm{RLWE}_s(m), \dots , \textrm{RLWE}_s(B^{d-1} \cdot m)) \in R_q^{2 \times d}\) into an RGSW ciphertext \(\textrm{RGSW}_s(m)\), using a key-switching key \(cvk \leftarrow \textsf {KSKGen}(s, s^2)\). We denote the transformation by \(\textsf {RLWEstoRGSW}(\textbf{ct}, cvk)\), where \(\textbf{ct}\) is the \(\textrm{RLWE}'\) ciphertext.

#### Share-S to share-A

We define RLWE ciphertexts with the same secret key \(\{(b_i=a_i\cdot s+e_i+\Delta m_i \mod q,a_i)\}_{i\in [k]}\) as the share-S ciphertexts. Similarly, let the RLWE ciphertexts in the form of \((b'_1,a'),(b'_2,a')\), ..., \((b'_k,a')\) be denoted as the share-A ciphertexts where \(b'_i=a'\cdot s_i+e'_i+\Delta m_i \mod q\) for \(i\in [k]\). Given *k* share-S ciphertexts \({\textbf {ct}}_i=(b_i,a_i)\in R^2_q\) encrypted under a common secret key *s*, the algorithm \(\textsf {shareStoA}\) from Bae et al. ([2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR4)) converts them into *k* share-A ciphertexts \({\textbf {ct}}'_i=(b'_i,a')\in R^2_q\). This process requires a proper key-switching key *tksk* as an input.

### Private information retrieval

In this subsection, we describe the syntax of a single-server Private Information Retrieval (PIR) (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40); Zhou et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR55)). PIR is a protocol between two stateful machines, namely the server and the client with the following structure. Let the server hold a database \(\textrm{DB}\) of size \(N\in \mathbb {N}\) and client want to retrieve \(\textrm{DB}[idx]_{idx\in [N]}\) but keep index *idx* private. Implicitly, the security parameter \(1^\lambda\) is taken in all procedures below.

-
\(\textsf {SetUp}(\textrm{DB})\): The server receives a database \(\textrm{DB}\) of size \(N\in \mathbb {N}\) and may perform preprocessing to generate public auxiliary information. In particular, this phase is run once per database.

-
\(\textsf {KeyGen}\): The client generates a public-secret key pair (

*pk*,*sk*), securely storing the secret key*sk*while sending the corresponding public key*pk*to the server. In general, this phase is run one-time per client. -
\(\textsf {Query}(sk, idx)\): This phase can be partitioned into two stages based on whether the client receives the index.

-
(offline) Prior to knowing the query index, the client can offline generate an index-independent query and send it to the server. Upon receiving the offline query, the server can perform offline pre-computation based on the database \(\textrm{DB}\) and public key

*pk*. -
(online) Once given an indice \(idx\in [N]\), the client generates an online query

*qu*and sends it to the server.

-
-
\(\textsf {Response}(qu, pk, \textrm{DB})\): Given a online query

*qu*(Unless explicitly stated otherwise,*qu*represents an online query), the server computes a response*ans*with database \(\textrm{DB}\) and sends it back to the client. -
\(\textsf {Recover}(ans, sk)\): Using the response

*ans*and its secret key*sk*, the client recovers the desired record \(\textrm{DB}[idx]\).

A PIR protocol formed by the above algorithms should satisfy the following two basic properties:

-
1.
**Correctness**: A PIR protocol is correct if for all \(\lambda \in \mathbb {N}\), all databases \(\textsf {DB}\) of size \(N = N(\lambda )\), and all indices \(idx \in [N]\), the following holds: \(\Pr [\textsf {Recover}(sk, \textsf {Response}(pk, \textrm{DB},\textsf {Query}(sk, idx) ) )\ne \textrm{DB}[idx]]\le negl(\lambda )\), where the probability is taken over the random coins of \(\textsf {KeyGen}(1^\lambda ) \rightarrow (pk, sk)\), \(\textsf {Query}\), and \(\textsf {Response}\). -
2.
**Query Privacy**: A single-server PIR scheme achieves query privacy if for any probabilistic polynomial-time (PPT) adversary \(\mathcal {A}\), there exists a negligible function \(\textsf {negl}(\lambda )\) such that for any database size \(N> 0\) and any two indices \(i, j \in [N]\), the adversary’s advantage in distinguishing the queries is negligible. Formally, the following must hold: \(\Vert \Pr [\mathcal {A}(1^\lambda , pk,\textsf {Query}(sk,i))=1]-\) \(\Pr [\mathcal {A}(1^\lambda , pk,\textsf {Query}(sk, j))=1]\Vert \le negl(\lambda )\) where the probability is taken over the random coins of the key generation, query algorithm, and the adversary \(\mathcal {A}\).

## Our PIR construction

This section presents our full protocol construction. We build our scheme using the \(\textsf {RLWE}\) and \(\textsf {GSW}\) building blocks and adopt the high-level framework of Spiral (Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)) for its advantages in achieving high-rate private queries and controlled noise growth.

In our construction, we propose two optimizations to reduce the online computation time of the server:

First, we observe that key-switching multiplication is independent of the ciphertext message part. Therefore, we delegate its computation to the server’s offline phase. Consequently, during the query expansion phase, the primary computational overhead of the \(\textsf {Expand}\) and \(\textsf {RLWEstoRGSW}\) algorithms arises solely from key-switching operations, which are now performed offline. Similarly, first-dimensional folding and ciphertext packing can also leverage the offline computation of key-switching multiplications and other message-independent operations, thereby reducing the online computational load.

Second, we apply a recent technique from FHE called \(\textsf {LWEstoRLWE}\) to package the results of first-dimensional folding, enabling the second dimension folding to only require one external product.

### Operating model

In our protocol, the offline phase is defined as index-independent computation that can be executed before the client receives a query index. Specifically, the client sends the PRG seed \(\sigma\) to the server during an idle period (e.g., application startup or between queries). The server precomputes \(\textrm{hint}_u\) and \(\textrm{hint}_w\) and caches them. Each seed is used for exactly one query and discarded afterwards, ensuring no linkability across queries. When the user later submits an index *idx*, the client uses \(\sigma\) to generate the online query \((b_1, \textbf{b}_2)\), and the server responds using the precomputed hints.

Under this operating model, the user-perceived end-to-end latency for each query consists only of the online phase and network round-trip:

where \(RTT_{\text {online}}\) is the round-trip time for the online query and response, and \(T_{\text {online}}\) is the server’s online computation time. The offline computation \(T_{\text {offline}}\) is not included because it is completed before the user initiates the query.

### The description of full protocol

Let \(\textrm{DB}=\{\textrm{DB}[i,j]\in \mathbb {Z}_p\}_{i\in [2^{v_1}],j\in [2^{v_2}]}\) be a database of \(N = 2^{v_1\times v_2}\) entries represented as a two-dimensional matrix, *p* be the plaintext modulus, *q* be the ciphertext modulus, and \(\Delta =\lfloor q/p \rceil\) be the encode factor.

#### Setup phase

Both the client and the server receive the security parameter \(1^\lambda\). The server additionally receives the database \(\textrm{DB}\).

#### Key generation phase

The client generates secret key and the accompanying key-switching keys required for the protocol. Specifically, it generates an RLWE secret key *s* and derives the RGSW secret key \(sk = (1, -s)^\top\). These public keys include *cvk* for \(\textsf {RLWEstoRGSW}\) conversions and \(\{aksk_j\}_{j\in [\log n]}\) for \(\textsf {Expand}\) and \(\textsf {LWEstoRLWE}\). The client sends them to the server. The full procedure is detailed in Algorithm 1.

#### Query phase

The query phase is split into an offline hint generation step on the server and an online query generation step on the client. The offline step involves only index-independent computations and prepares the server to answer future queries efficiently. The online step produces a compact encrypted query for a specific index.

**(Offline)** The client samples a Pseudorandom Generator (PRG) seed \(\sigma \leftarrow \{0,1\}^\lambda\) and sends it to the server. The server expands \(\sigma\) to generate dummy ciphertexts, then performs a series of homomorphic operations to precompute two hints: \(\textrm{hint}_u\) for packing first-dimensional folding results, and \(\textrm{hint}_w\) for second-dimensional query expansion. These hints will be used to accelerate the online response generation for the current query. Algorithm 2 details the offline hint generation.

**(Online)** The client receives a index \(idx\in [N]\) and parses it to \(\pi (idx)=(u,w)\in [2^{v_1}]\times [2^{v_2}]\) such that \(idx=u+2^{v_1}\cdot w\). Using the same seed \(\sigma\), it expands the required randomness \(a_1\) and \(\textbf{a}_2\), then encrypts the first-dimension indicator *u* as an RLWE ciphertext \((b_1, a_1)\) and the second-dimension indicator *w* as an \(\textrm{RLWE}'\) ciphertext \((\textbf{b}_2, \textbf{a}_2)\). Here, the first-dimension indicator is encoded as a polynomial \(m_1(X)=\Delta \cdot \sum _{i\in 2^{v_1}} {\textbf {u}}[i]X^i\), where \({\textbf {u}}\) is a one-hot vector with \({\textbf {u}}[u]=1\) and all other entries zero. The online query \(qu = (b_1, \textbf{b}_2)\) is sent to the server. Algorithm 3 presents the complete procedure.

#### Response phase

Upon receiving the online query \(qu = (b_1, \textbf{b}_2)\), the server generates a response ciphertext *r* by combining the query with the precomputed hints and the database. The process consists of three steps: query expansion, first-dimension folding, and second-dimension folding.

In the query expansion step, the server expands the first component \(b_1\) into a set of LWE ciphertexts \(\{b_i'\}\), and combines the second component \(\textbf{b}_2\) with the precomputed hint \(\textrm{hint}_w\) to obtain *C*, an RGSW ciphertext representing the second-dimension query.

The first-dimension folding step then multiplies each expanded ciphertext \(b_i'\) with the corresponding database column \(\textrm{DB}[i,j]\) and aggregates the results across *i*. The aggregated values are packed into an RLWE ciphertext using \(\textrm{hint}_u\), producing \((\hat{b}, \hat{a})\).

Finally, the second-dimension folding step performs an external product \(C \otimes (\hat{b}, \hat{a})\) to combine the two dimensions, and extracts the constant term to obtain the response *r*, which is sent back to the client. Algorithm 4 presents the complete procedure.

#### Recover phase

After receiving the response ciphertext *r* from the server, the client decrypts it using the secret key *s*. The decryption extracts the constant term of the RLWE ciphertext and recovers the requested database record \(d = \textrm{DB}[idx]\). Algorithm 5 details the decryption process.

### Analysis

To illustrate the protocol flow and the separation of offline and online phases, Figure [3](https://link.springer.com/article/10.1186/s42400-026-00601-7#Fig3) presents a timing diagram of the full protocol.

**Correctness**. We begin by analyzing the underlying plaintext at each step of the homomorphic computation in our construction. Note that the first dimensional query ciphertext \((b_1,a_1)\) is a RLWE ciphertext encrypting indicator vector \(\Delta \cdot {\textbf {u}}\) with secret key *s*. By the \(\textsf {Expand}\) algorithm, we get \(2^{v_1}\) LWE ciphertexts \(\{{\textbf {ct}}_i'\}_{i\in [2^{v_1}]}\) encrypting \({\textbf {u}}[i]\in \{0,1\}\). We then compute first-dimensional folding \(\{{\textbf {ct}}_j''=\Sigma ^{2^{v_1}-1}_{i=0} {\textbf {ct}}_i'\cdot D[i,j]\}_{j\in [2^{v_2}]}\) and obtain \({\textbf {ct}}_j''\) encrypting \(\Delta \cdot D[u,j]\). To perform the second dimension folding, we pack these LWE ciphertexts into an RLWE ciphertext encrypting polynomial \(\Delta \cdot D[u,0]+\Delta \cdot D[u,1]X+...+\Delta \cdot D[u,2^{v_2}-1]X^{2^{v_2}-1}\). Finally, the server performs an external product to get an RLWE ciphertext encrypted \(X^{-w}\cdot (\Sigma _i \Delta \cdot D[u,i]X^i)\), and then extracts the constant term of the RLWE ciphertext to obtain an LWE ciphertext that encrypts \(\Delta \cdot D[u,w]\). The client decrypts the LWE ciphertext and gets \(d=D[u,w]\) by the correctness of \(\textsf {LWE.Dec}\).

According to the above analysis, we present the correctness statement of our scheme in the following theorem.

### Theorem 1

(Correctness) The protocol ensures that for any input query (*u*, *w*),if the ciphertext modulus *q* preserves the correctness of LWE decryption, then the final output *d* satisfies \(d=D[u,w]\).

In addition, we estimated the noise analysis in Appendix A. When the client and the server faithfully execute the PIR protocol, the client should restore the required database records with an almost negligible probability in the implicit correctness parameters.

**Security**. The query privacy of our PIR protocol reduces to the semantic security of the underlying FHE scheme, which in turn rests on the standard Ring-LWE assumption and the circular security of the key-switching keys. Under these assumptions, the server’s view of the protocol can be simulated without the query index, ensuring that no PPT adversary can distinguish queries for any two indices. A formal security argument is provided in Appendix B.

## Extensions and optimizations

To enhance system scalability and achieve substantial performance improvements in practical deployments, this section presents several optimization strategies.

### Packing optimization

To minimize online communication between the client and server while enabling queries over larger databases, this section introduces a response packing technique. For a query that spans multiple databases, the server generates multiple response ciphertexts in share-S form. Before transmission, we convert these share-S ciphertexts into share-A form, a compact ciphertext format defined in Section [Share-S to share-A](https://link.springer.com/article/10.1186/s42400-026-00601-7#Sec13). This conversion allows the server to send only the message components of each share-A ciphertext plus a single shared random component to the client, significantly reducing communication overhead. We first review the \(\textsf {ShareStoA}\) algorithm, then describe how it is applied to pack multiple responses.

#### shareStoA algorithm

Given *k* share-s ciphertexts \({\textbf {ct}}_i=(b_i,a_i)\in R^2_q\) with the same secret key *s*, there is an algorithm (Bae et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR4)) that convert them to *k* share-a ciphertexts \({\textbf {ct}}'_i=(b'_i,a')\in R^2_q\) as follows:

-
\(\textsf {StoAKSKGen}(s, \{s_i'\}_{i\in [k]})\): Given secret keys \(\{s_i'\}_{i\in [k]},s\in R\), sample \({\textbf {a}}_{StoA} \leftarrow R^k_{qP}\) for some auxiliary integer

*P*and output a transformation key: \(tksk=({\textbf {a}}_{StoA}, {\textbf {B}}_{StoA})\in R^k_{qP}\times R^{k\times k}_{qP}\), \({\textbf {B}}_{StoA}={\textbf {a}}_{StoA}\cdot (s_0',...,s_{k-1}')+{\textbf {E}}+P\cdot s\cdot {\textbf {I}}_k \mod qP\), where*P*,*q*are ciphertext modulus with \(P\ge q\). -
\(\textsf {shareStoA}(\{{\textbf {ct}}_i\}_{i\in [k]},tksk)\): Given

*k*ciphertexts \({\textbf {ct}}_i=(b_i,a_i)\in R^2_q\) encrypted \(m_i\in R\) under secret key*s*and a transformation key*tksk*as input, output as follow: \(a'=\lfloor \frac{1}{P}(\langle (a_0,...,a_{k-1})^\top ,{\textbf {a}}_{StoA}\rangle \mod qP)\rceil\), \((b_0',...,b_{n-1}')=(b_0,...,b_{k-1})+\lfloor \frac{1}{P}((a_0,...,a_{k-1})\cdot {\textbf {B}}_{StoA}\mod qP)\rceil\), where \(\{(b_i',a')\}_{i\in [k]}\) are ciphertexts encrypted \(m_i\) under secret key \(s'_i\).

Note that the cost of \(\textsf {shareStoA}\) algorithm is dominated by the number of ciphertexts *k* and a total of \(O(k^2)\) multiplications are required.

#### Packing responses from multiple databases

When a client queries multiple databases in a single request, the server generates multiple response ciphertexts. To reduce communication overhead, we apply a packing technique that compresses these responses into a compact form. The key idea is to compress a batch of LWE ciphertexts into a smaller number of RLWE ciphertexts that share a common random component, so that this component is transmitted only once.

When the server returns *k* responses to the client, we consider how to pack them efficiently. Given *k* responses \(\{r_0,...,r_{k-1}\}\) where \(k=m_1m_2\) and \(m_1,m_2 \le n\). These *k* responses are the LWE ciphertexts described in Section [The description of full protocol](https://link.springer.com/article/10.1186/s42400-026-00601-7#Sec17). The packing process consists of two steps. First, the \(\textsf {LWEstoRLWE}\) algorithm compresses \(m_1\) LWE ciphertexts into one RLWE ciphertext. Second, the \(\textsf {shareStoA}\) algorithm further transforms \(m_2\) such RLWE ciphertexts into a new form where they share identical randomness \(\bar{a}\), while each is encrypted under a distinct derived secret key. The resulting packed response is \((\{\bar{b}_j\}_{j\in [m_2]}, \bar{a})\), where \(\bar{a}\) is sent once for the entire batch. Algorithm 6 details this procedure.

#### Client-side processing for share-a response

To support the packed response format, the client performs an extended key generation step before any queries. It samples a set of derived secret keys \(\{s'_j\}_{j\in [m_2]}\) and generates a transformation key *tksk* that allows the server to convert ciphertexts under the master secret *s* to ciphertexts under these derived keys. The transformation key *tksk* is sent to the server. Algorithm 7 summarizes this extended key generation.

Upon receiving the packed response \((\{\bar{b}_j\}_{j\in [m_2]}, \bar{a})\), the client decrypts each component using the corresponding derived secret key \(s'_j\). For each *j*, the decryption yields a ring element \(d_j\), whose coefficients contain the answers for a batch of \(m_1\) queries. The client then extracts the first \(m_1\) coefficients from each \(d_j\) to recover the complete set of *k* query results. Algorithm 8 describes the decryption and unpacking process.

The communication advantage of this packing method is that the random component \(\bar{a}\) is common to all \(m_2\) ciphertexts and transmitted only once. The client-side storage of the derived keys \(\{s'_j\}_{j \in [m_2]}\) is a one-time offline cost that enables this online communication efficiency.

#### Analysis

**Security**. The semantic security of our packing algorithm, even when reusing the public polynomial *a* across multiple ciphertexts \({(b_i, a)}_{i\in [k]}\), follows directly from the Ring-LWE assumption (Peikert et al. [2008](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR49)). In this setting, each \(b_i = a \cdot s_i + e_i + m_i \mod q\) constitutes an independent RLWE sample. Given that the secrets \(s_i\) and noises \(e_i\) are freshly and independently sampled for each ciphertext, distinguishing any \(b_i\) from random is as hard as solving the Decision-RLWE problem. Following the methodology of Peikert et al. ([2008](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR49)), the security proof of our Share-A packaging algorithm can be constructed, and we defer it to Appendix C.

**Performance**. This response packing algorithm is pivotal for scaling our scheme to larger databases and batched queries. It allows a client to query across up to \(n^2\) basic databases (each of size \(N \times \log p\) bits), where *n* is the ring dimension. In a batch-query scenario, the server can leverage this algorithm to compress \(n^2\) LWE responses down to the size of *n*/2 RLWE responses, dramatically optimizing client–server communication.

This communication gain is achieved at a cost. From the server’s perspective, packing \(k = m_1 m_2\) responses requires a total of \(d[(m_1-1) + \log (n/m_1)] + m_2^2\) multiplications, where *d* is the gadget dimension (Chen et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR14); Bae et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR4)). From the client’s perspective, it must now decrypt \(m_2\) ciphertexts (increasing decryption time by a factor of \(m_2\)) and store \(m_2\) distinct secret keys generated during setup.

This cost breakdown reveals a fundamental trade-off: choosing a smaller \(m_2\) (relative to *d*) favors computational speed, while a larger \(m_2\) leads to greater communication reduction. In our implementation (Section 5), we prioritize computational speed as the primary goal.

### General optimization techniques

Our scheme supports the following general optimization techniques, thereby improving practical performance in practical implementations.

**Approximate Gadget Decomposition**. The approximate gadget decomposition, first introduced in TFHE (Chillotti et al. [2016](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR17)), achieves a smaller decomposition dimension than exact decomposition at the cost of introducing additional noise, while simultaneously reducing both runtime and storage requirements. In our implementation, we dynamically select between approximate and exact gadget decomposition based on specific parameter configurations.

**Modulus Switching**. While modulus switching was originally proposed to manage noise growth in homomorphic multiplication (Brakerski et al. [2012](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR6)), its primary application in PIR protocols (Ali et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR2); Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44); Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)) has shifted toward ciphertext size reduction for optimizing online communication. In our protocol, the server performs modulus switching to reduce the response size by converting ciphertexts from a larger modulus to a smaller one.

**Memory Optimization**. For large-scale computation scenarios (e.g., with 1 GB or 8 GB databases), we introduce a coordinated optimization strategy to accelerate scalar multiplication, specifically the plaintext-ciphertext multiplication in the first-dimensional query. By restructuring the computational workflow to better align with the data access patterns of computer architectures, we significantly reduce memory latency and improve the efficiency of scalar multiplication.

## Implementation and evaluation

Our protocol implementation is developed in C++ and utilizes the Intel HEXL library (version 1.2.5) (Boemer et al. [2021](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR5)) for efficient computation of the Number Theoretic Transform (NTT). This setup is chosen to ensure a fair comparison with KsPIR (Luo et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR40)), which is implemented under the same conditions.

### Parameter selection

**Lattice Parameters**. Our lattice-based protocols utilize power-of-two cyclotomic rings with dimension \(n = 4096\), providing 128-bit classical security with controlled noise growth. Regarding secret distribution, all secret keys are generated as ternary secrets with constrained Hamming weight *h*. The noise components follow a discrete Gaussian distribution characterized by \(\sigma = 3.19\) for their standard deviation. The ciphertext modulus for query generation is \(q_{que} = 2^{50}\), and the ciphertext modulus for the response is \(q_{res} = 2^{42}\). All implementations in our paper meet the decryption failure rate of \(2^{-40}\).

**Database Configurations**. For comparison with existing schemes, we evaluated three database sizes: 256 MB, 1 GB, and 8 GB. We use a record size of 8 KB for our scheme, consistent with Spiral and KsPIR. For other baseline protocols, we adopt the most recommended record size configuration as specified in their respective implementations.

-
For all database sizes, YPIR uses a record size of 1 B, SimplePIR uses 16 KB, while Spiral, KsPIR, and our scheme each employ a record size of 8 KB.

-
For the 256 MB database, HintlessPIR uses a record size of 16 KB, while for the 1 GB and 8 GB databases, it employs a record size of 32 KB.


#### Server-side state analysis

The server maintains four categories of state. "One-time setup" refers to the evaluation keys sent by the client, which consist of \(\textrm{RLWE}'\) ciphertexts. "Per-database preprocessing" is a simple reordering of the database that does not change its size. "Per-client state" is not maintained by the server, as each client stores its own secret key locally. "Per-query offline artifacts" are the hints \(\textrm{hint}_u\) and \(\textrm{hint}_w\) precomputed for each query. Because each query uses a freshly generated seed and the seed is never reused, these artifacts are a per-query cost rather than a one-time database preprocessing cost.

Table [3](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab3) summarizes the sizes and lifecycles of these categories for a 256 MB database. For larger databases, the hint size scales approximately linearly with the database size.

Our evaluation assumes a single client. For multi-client concurrency, the server must store evaluation keys for each client persistently, as these are generated per client and remain valid throughout the client’s session. Additionally, per-query hints are stored temporarily for each concurrent query and discarded after the online response is sent. In our experimental comparison with baseline schemes, we report the total cost per query for all schemes, consistent with standard practice in the PIR literature.

### Experimental comparison

Our protocol targets scenarios where low client-side computation, small online communication, and low per-query latency are critical. To evaluate its performance, we compare against state-of-the-art publicly available single-server PIR implementations: Spiral, HintlessPIR, YPIR, and KsPIR (Category II), as well as SimplePIR (Category I). These baselines are selected not because they target the same operating regime, but because each represents a different design point, allowing us to demonstrate different aspects of our scheme’s performance:

-
Spiral and KsPIR support similar record sizes and focus on low online latency, making them direct competitors for our target scenario.

-
HintlessPIR eliminates client precomputation entirely, providing a baseline for comparing client-side overhead.

-
YPIR is optimized for very small records and high throughput, representing a different extreme of the design space.

-
SimplePIR minimizes server computation at the cost of high communication, offering a contrasting trade-off.


By including this range of baselines, we aim to show that our scheme achieves low client overhead and online latency not only against direct competitors but also across a broader spectrum of PIR designs.

Our experiments were conducted on a machine equipped with an AMD Ryzen Threadripper 3970X @ 3.7 GHz with 128 GB RAM, running Ubuntu 20.04 and compiled with clang++ 17.0.6. For a fair comparison, all protocols were evaluated under the same computational setup and executed on a single thread. Table [4](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab4) presents a comparative evaluation between our scheme and these baselines.

#### End-to-end latency

Following the operating model defined in Section [Operating model](https://link.springer.com/article/10.1186/s42400-026-00601-7#Sec16), the user-perceived end-to-end latency per query is \(L_{\text {perceived}} = \text {RTT} + T_{\text {online}}\), where \(T_{\text {online}}\) is the server’s response time measured in our local environment, and RTT is the round-trip time for transmitting the query and response. We assume a typical WAN RTT of 50 ms, which includes both propagation delay and the transmission time of the 125 KB query and 21 KB response under common WAN bandwidth conditions such as 100 Mbps. Under this assumption, the transmission of the total 146 KB contributes approximately 12 ms to the RTT, which is well within the 50 ms budget. Table [5](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab5) reports \(T_{\text {online}}\) for different database sizes and the resulting \(L_{\text {perceived}}\).

#### Comparison with category II schemes

This section evaluates the performance of our proposed PIR scheme against state-of-the-art Category II schemes. The comparison results are given in Table [4](https://link.springer.com/article/10.1186/s42400-026-00601-7#Tab4) and Figure [4](https://link.springer.com/article/10.1186/s42400-026-00601-7#Fig4).

**Spiral**. Spiral serves as the direct technical foundation for FlashPIR. It achieves the lowest communication overhead of 36 KB and the optimal rate efficiency of 0.4. Our protocol intentionally shifts the design trade-off. By investing in more substantial server-side precomputation, FlashPIR achieves a dramatic acceleration in online query latency. For an 8GB database, this means increasing preprocessing time from Spiral’s 531 s to 619 s and requiring server-side hint storage of 268MB, compared to Spiral’s 15.5MB. Specifically, FlashPIR achieves a \(10 \times\) acceleration in the server’s online response time, reducing it from 21 s to 2.4 s, while also boosting throughput from 390 MB/s to 3410 MB/s. Crucially, FlashPIR largely preserves Spiral’s communication advantages. It maintains a low and constant total communication overhead of 146 KB, consisting of a 125KB query and a 21KB response, and achieves a high rate of 0.38.

**HintlessPIR**. A comparison across database scales reveals FlashPIR’s consistent advantage in online efficiency over HintlessPIR. For a 256MB database, FlashPIR’s server response time is 90 milliseconds, which is \(6.3 \times\) faster than HintlessPIR’s 568 milliseconds. This lead narrows but persists for a 1GB database, where FlashPIR takes 349 milliseconds compared to HintlessPIR’s 954 milliseconds, making FlashPIR \(2.7 \times\) faster. At 8GB, the response times become comparable, with FlashPIR at 2.4 s and HintlessPIR at 2.2 s. More critically, HintlessPIR’s design incurs prohibitive costs elsewhere. Its communication overhead is an order of magnitude larger. For an 8GB database, HintlessPIR’s total communication is 4347KB, while FlashPIR requires only 146KB. Furthermore, HintlessPIR’s client computation time becomes utterly impractical at scale, escalating to 37.1 s, whereas FlashPIR maintains a constant 6.7 milliseconds. Thus, FlashPIR achieves consistently low latency across all database sizes, while HintlessPIR pays a severe penalty in communication overhead and client-side efficiency.

**YPIR**. YPIR achieves fast server response times by making a fundamental trade-off: it optimizes for scenarios with small record sizes of only 1 to 8 bits. This design choice results in exorbitant query sizes that scale linearly with the database. For an 8GB database, the query size reaches 1.4MB, leading to a catastrophically low rate of \(8.1\times 10^{-5}\). In stark contrast, FlashPIR is designed for practical record sizes of 8KB as used in our experiments. It maintains a near-constant and low total communication overhead of 146 KB across all database sizes, achieving a rate of 0.38, which is \(4750 \times\) higher than that of YPIR. Furthermore, FlashPIR’s client computation takes only 6.7 milliseconds, making it three orders of magnitude faster than YPIR’s 5.6 s. Therefore, compared to YPIR, FlashPIR is a dramatically more efficient and broadly applicable solution.

**KsPIR**.

As a highly competitive high-throughput scheme in Category II, KsPIR serves as a key benchmark. Most notably, FlashPIR delivers a substantially faster server response time. For an 8GB database, FlashPIR takes 2.4 s while KsPIR takes 6.2 s, making FlashPIR \(2.6\times\) quicker. This advantage directly translates to a \(2.6\times\) higher online throughput. In terms of communication, FlashPIR also shows a consistent, albeit smaller, advantage. It maintains lower query and response sizes of 125KB and 21KB respectively, compared to KsPIR’s 140KB and 26KB. This results in a higher rate of 0.38 versus KsPIR’s 0.31, due to the additional Share-A packing optimization. Therefore, while maintaining equally low client overhead, FlashPIR achieves a decisive advantage in online server response time, being \(2.6\times\) faster than KsPIR.

**WhisPIR**. The recent WhisPIR scheme (Castro et al. [2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11)) is a highly relevant work to ours, as it also focuses on low communication overhead. As the implementation of WhisPIR is not publicly available, a precise performance comparison under identical experimental conditions is infeasible. Nevertheless, an approximate comparison can be drawn based on the data reported in its original paper. For a 1 GB database, WhisPIR achieves a throughput of approximately 1024 MB/s, which increases to around 1154 MB/s for an 8 GB database, as reported in Fig. 4 of Castro et al. ([2024](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR11)). Our scheme outperforms it by a significant margin, with corresponding throughputs that are \(2.6\times\) and \(3.0\times\) higher, respectively. This robust advantage suggests our scheme’s superior performance, even when accounting for potential variations across computational environments.

#### Comparison with category I scheme

Although SimplePIR is categorized under Category I due to its requirement for significant client-side hint storage, we include it here for a critical reason. As a canonical example of its category, it provides a concrete baseline to illustrate the practical benefits of our Category II design.

SimplePIR’s high throughput requires clients to pre-store a significant portion of the database, forcing a fundamental trade-off. While it achieves high throughput, its client hint storage grows linearly with the database. For an 8GB database, this hint storage is 224 MB. Consequently, its online query size becomes large at 512KB, resulting in a low rate of 0.07. Furthermore, as the database scales, its throughput advantage over FlashPIR diminishes from \(3.5 \times\) at 256MB to \(2 \times\) at 8GB.

In contrast, FlashPIR maintains a small and constant query size of 125KB and achieves a high rate of 0.38. Critically, FlashPIR delivers a competitively high throughput of 3410 MB/s without imposing any client-side storage to store hint, whereas SimplePIR requires substantial client resources to reach 6676 MB/s. Additionally, FlashPIR’s client online computation is over \(285 \times\) faster, taking only 6.7 milliseconds compared to SimplePIR’s 1.9 s.

Therefore, FlashPIR emerges as a client-friendly solution that delivers competitively high throughput without the client-side storage burden inherent to Category I designs like SimplePIR.

#### Summary and trade-off analysis

The experimental comparison above reveals that no single PIR scheme dominates across all metrics. Instead, each scheme makes distinct trade-offs that suit different deployment scenarios.

**Positioning FlashPIR.** FlashPIR occupies a unique point in the design space. It achieves the lowest online latency among Category II schemes while maintaining client computation comparable to SimplePIR. The main trade-off is server-side storage. This includes one-time keys generated during the setup phase and per-query hints that require 268MB per query. The offline precomputation cost is 619 s for an 8GB database. This cost is incurred per query and does not amortize across multiple queries. For typical WAN deployments with resource-constrained clients, session-based query patterns, and practical record sizes, FlashPIR provides the best combination of low client overhead, low online latency, and reasonable communication efficiency.

**When to use other schemes.**

-
**Spiral**remains the best choice when communication bandwidth is extremely limited and the client can tolerate higher latency. -
**HintlessPIR**is suitable for scenarios where server-side storage is prohibited and the client has sufficient computational resources. -
**YPIR**is only competitive for very small record sizes, where its specialized optimizations pay off. -
**KsPIR**offers a balanced alternative when offline precomputation is undesirable, though with higher online latency than FlashPIR. -
**SimplePIR**achieves the highest raw throughput but requires the client to store a large hint, making it less suitable for resource-constrained clients.

## Conclusion

This paper addresses the critical challenge of balancing client overhead and online performance in existing single-server Private Information Retrieval (PIR) schemes. We propose FlashPIR, a novel PIR scheme that effectively reconciles low client burden with high server response efficiency. The core innovation lies in re-architecting the homomorphic computation workflow, specifically by offloading the computationally intensive key-switching operations to an offline preprocessing phase, while leveraging the distinct semantic properties of different encryption schemes to optimize the online folding process. This approach achieves an organic integration of theoretical advancement and engineering optimization.

Experimental evaluations demonstrate that FlashPIR achieves significant performance breakthroughs while preserving the inherent advantage of Category II PIR schemes that require no client-side database preprocessing. Particularly for medium-scale databases (256MB and 1GB), the scheme delivers outstanding throughput while maintaining client-side computation overhead at the millisecond level, offering a technically viable solution for practical deployment. Notably, FlashPIR’s performance advantage remains stable as the database scales to 8GB, demonstrating strong scalability.

Several research directions remain open. First, reducing the time and storage costs of preprocessing represents a critical next step for practical large-scale deployment. Second, extending FlashPIR to efficiently support a large number of concurrent clients while managing the linear growth in server storage per user is an important direction for its practical adoption in multi-user environments.

## Data Availability

Data is available with the author; it will be made available to researchers as per demand.

## References

Ahmad I, Yang Y, Agrawal D, Abbadi AE, Gupta T (2021) Addra: Metadata-private voice communication over fully untrusted infrastructure. In: Proc. 15th USENIX Symp. Oper. Syst. Des. Implement. (OSDI). USENIX Association, Berkeley, CA, USA.

[https://www.usenix.org/conference/osdi21/presentation/ahmad](https://www.usenix.org/conference/osdi21/presentation/ahmad)Ali A, Lepoint T, Patel S, Raykova M, Schoppmann P, Seth K, Yeo K (2021) Communication-computation trade-offs in PIR. In: Proc. 30th USENIX Secur. Symp., pp. 1811–1828. USENIX Association, Berkeley, CA, USA.

[https://www.usenix.org/conference/usenixsecurity21/presentation/ali](https://www.usenix.org/conference/usenixsecurity21/presentation/ali)Angel S, Chen H, Laine K, Setty (2018) STV.: PIR with compressed queries and amortized query processing. In: Proc. IEEE Symp. Secur. Priv. (SP), pp. 962–979. IEEE Comput. Soc., Washington, DC, USA .

[https://doi.org/10.1109/SP.2018.00062](https://doi.org/10.1109/SP.2018.00062)Bae Y, Cheon JH, Hanrot G, Park JH, Stehlé D (2024) Plaintext-ciphertext matrix multiplication and FHE bootstrapping: Fast and fused. In: Adv. Cryptol. - CRYPTO 2024, Part III. Lect. Notes Comput. Sci., vol. 14922, pp. 387–421. Springer, Cham.

[https://doi.org/10.1007/978-3-031-68382-4_12](https://doi.org/10.1007/978-3-031-68382-4_12)Boemer F, Kim S, Seifu G, Souza FDM, Gopal V (2021) Intel HEXL: accelerating homomorphic encryption with intel AVX512-IFMA52. In: Proc 9th Workshop Encrypt Comput Appl Homomorph Cryptogr (WAHC), pp. 57–62. ACM, New York, NY, USA.

[https://doi.org/10.1145/3474366.3486926](https://doi.org/10.1145/3474366.3486926)Brakerski Z, Gentry C, Vaikuntanathan V (2012) (leveled) fully homomorphic encryption without bootstrapping. In: Proc. Innov. Theor. Comput. Sci. (ITCS), pp. 309–325. ACM, New York, NY, USA.

[https://doi.org/10.1145/2090236.2090262](https://doi.org/10.1145/2090236.2090262)Brakerski Z, Vaikuntanathan V (2011) Efficient fully homomorphic encryption from (standard) LWE. In: Proc 52nd Annu IEEE Symp Found Comput Sci (FOCS), pp. 97–106. IEEE Comput. Soc., Washington, DC, USA.

[https://doi.org/10.1109/FOCS.2011.12](https://doi.org/10.1109/FOCS.2011.12)Brakerski Z, Vaikuntanathan V (2014) Lattice-based FHE as secure as PKE. In: Naor, M. (ed.) Innovations in Theoretical Computer Science, ITCS’14, Princeton, NJ, USA, January 12-14, 2014, pp. 1–12. ACM, New York, NY, USA.

[https://doi.org/10.1145/2554797.2554799](https://doi.org/10.1145/2554797.2554799)Burton A, Menon SJ, Wu DJ (2024) Respire: High-rate PIR for databases with small records. In: Luo, B., Liao, X., Xu, J., Kirda, E., Lie, D. (eds.) Proceedings of the 2024 on ACM SIGSAC Conference on Computer and Communications Security, CCS 2024, Salt Lake City, UT, USA, October 14-18, 2024, pp. 1463–1477. ACM, New York, NY, USA.

[https://doi.org/10.1145/3658644.3690328](https://doi.org/10.1145/3658644.3690328)Cachin C, Micali S, Stadler M (1999) Computationally private information retrieval with polylogarithmic communication. In: Adv. Cryptol. - EUROCRYPT 1999. Lect. Notes Comput. Sci., vol. 1592, pp. 402–414. Springer, Berlin, Heidelberg .

[https://doi.org/10.1007/3-540-48910-X_28](https://doi.org/10.1007/3-540-48910-X_28)Castro L, Lewi K, Suh E (2024) Whispir: Stateless private information retrieval with low communication. IACR Cryptol. ePrint Arch., 266

Chang Y-C (2004) Single database private information retrieval with logarithmic communication. In: Inf. Secur. Priv. - ACISP 2004. Lect. Notes Comput. Sci., vol. 3108, pp. 50–61. Springer, Berlin, Heidelberg .

[https://doi.org/10.1007/978-3-540-27800-9_5](https://doi.org/10.1007/978-3-540-27800-9_5)Chen H, Chillotti I, Ren L (2019) Onion ring ORAM: efficient constant bandwidth oblivious RAM from (leveled) TFHE. In: Proc ACM SIGSAC Conf Comput Commun Secur. (CCS), pp. 345–360. ACM, New York, NY, USA.

[https://doi.org/10.1145/3319535.3354226](https://doi.org/10.1145/3319535.3354226)Chen H, Dai W, Kim M, Song Y (2021) Efficient homomorphic conversion between (ring) LWE ciphertexts. In: Appl. Cryptogr. Netw. Secur. - ACNS 2021, Part I. Lect. Notes Comput. Sci., vol. 12726, pp. 460–479. Springer, Cham.

[https://doi.org/10.1007/978-3-030-78372-3_18](https://doi.org/10.1007/978-3-030-78372-3_18)Chen Y, Ren L (2025) OnionPIRv2: Efficient Single-Server PIR. Cryptology ePrint Archive, Paper 2025/1142 .

[https://eprint.iacr.org/2025/1142](https://eprint.iacr.org/2025/1142)Chillotti I, Gama N, Georgieva M, Izabachène M (2020) TFHE: fast fully homomorphic encryption over the torus. J Cryptol 33(1):34–91.

[https://doi.org/10.1007/s00145-019-09319-x](https://doi.org/10.1007/s00145-019-09319-x)Chillotti I, Gama N, Georgieva M, Izabachène M (2016) Faster fully homomorphic encryption: Bootstrapping in less than 0.1 seconds. In: Adv. Cryptol. - ASIACRYPT 2016, Part I. Lect. Notes Comput. Sci., vol. 10031, pp. 3–33.

[https://doi.org/10.1007/978-3-662-53887-6_1](https://doi.org/10.1007/978-3-662-53887-6_1)Chor B, Goldreich O, Kushilevitz E, Sudan M (1995) Private information retrieval. In: Proc. 36th Annu. IEEE Symp. Found. Comput. Sci. (FOCS), pp. 41–50. IEEE Comput. Soc., Washington, DC, USA.

[https://doi.org/10.1109/SFCS.1995.492461](https://doi.org/10.1109/SFCS.1995.492461)Chor B, Goldreich O, Kushilevitz E, Sudan M (1995) Private information retrieval. In: Proc. 36th Annu. IEEE Symp. Found. Comput. Sci. (FOCS), pp. 41–50. IEEE Comput. Soc., Washington, DC, USA.

[https://doi.org/10.1109/SFCS.1995.492461](https://doi.org/10.1109/SFCS.1995.492461)Corrigan-Gibbs H, Henzinger A, Kogan D (2022) Single-server private information retrieval with sublinear amortized time. In: Adv. Cryptol. - EUROCRYPT 2022, Part II. Lect. Notes Comput. Sci., vol. 13276, pp. 3–33. Springer, Cham.

[https://doi.org/10.1007/978-3-031-07085-3_1](https://doi.org/10.1007/978-3-031-07085-3_1)Corrigan-Gibbs H, Kogan D (2020) Private information retrieval with sublinear online time. In: Adv. Cryptol. - EUROCRYPT 2020, Part I. Lect. Notes Comput. Sci., vol. 12105, pp. 44–75. Springer, Cham.

[https://doi.org/10.1007/978-3-030-45721-1_3](https://doi.org/10.1007/978-3-030-45721-1_3)Davidson A, Pestana G, Celi S (2023) Frodopir: Simple, scalable, single-server private information retrieval. Proc Priv Enhancing Technol. 2023(1), 365–383.

[https://doi.org/10.56553/popets-2023-0022](https://doi.org/10.56553/popets-2023-0022)Dvir Z, Gopi S (2016) 2-server PIR with subpolynomial communication. J ACM 63(4):39–13915.

[https://doi.org/10.1145/2968443](https://doi.org/10.1145/2968443)Genise N, Micciancio D (2018) Faster gaussian sampling for trapdoor lattices with arbitrary modulus. In: Nielsen, J.B., Rijmen, V. (eds.) Advances in Cryptology - EUROCRYPT 2018 - 37th Annual International Conference on the Theory and Applications of Cryptographic Techniques, Tel Aviv, Israel, April 29 - May 3, 2018 Proceedings, Part I. Lecture Notes in Computer Science, pp. 174–203. Springer, Cham .

[https://doi.org/10.1007/978-3-319-78381-9_7](https://doi.org/10.1007/978-3-319-78381-9_7)Gentry C (2009) A fully homomorphic encryption scheme. PhD thesis, Stanford University

[https://searchworks.stanford.edu/view/8493082](https://searchworks.stanford.edu/view/8493082)Gentry C, Halevi S (2019) Compressible FHE with applications to PIR. In: Theory Cryptogr. - TCC 2019, Part II. Lect. Notes Comput. Sci., vol. 11892, pp. 438–464. Springer, Cham.

[https://doi.org/10.1007/978-3-030-36033-7_17](https://doi.org/10.1007/978-3-030-36033-7_17)Gentry C, Ramzan Z (2005) Single-database private information retrieval with constant communication rate. In: Autom. Lang. Program. - ICALP 2005. Lect. Notes Comput. Sci., vol. 3580, pp. 803–815. Springer, Berlin, Heidelberg .

[https://doi.org/10.1007/11523468_65](https://doi.org/10.1007/11523468_65)Halevi S, Shoup V (2014) Algorithms in HElib. In: Adv. Cryptol. - CRYPTO 2014, Part I. Lect. Notes Comput. Sci., vol. 8616, pp. 554–571. Springer, Cham.

[https://doi.org/10.1007/978-3-662-44371-2_31](https://doi.org/10.1007/978-3-662-44371-2_31)Halevi S, Shoup V (2015) Bootstrapping for HElib. In: Adv. Cryptol. - EUROCRYPT 2015, Part I. Lect. Notes Comput. Sci., vol. 9056, pp. 641–670. Springer, Cham.

[https://doi.org/10.1007/978-3-662-46800-5_25](https://doi.org/10.1007/978-3-662-46800-5_25)Halevi S, Shoup V (2018) Faster homomorphic linear transformations in HElib. In: Adv. Cryptol. - CRYPTO 2018, Part I. Lect. Notes Comput. Sci., vol. 10991, pp. 93–120. Springer, Cham.

[https://doi.org/10.1007/978-3-319-96884-1_4](https://doi.org/10.1007/978-3-319-96884-1_4)Henzinger A, Hong MM, Corrigan-Gibbs H, Meiklejohn S, Vaikuntanathan V (2023) One server for the price of two: Simple and fast single-server private information retrieval. In: Proc. 32nd USENIX Secur. Symp., pp. 3889–3905. USENIX Association, Berkeley, CA, USA

Kang J, Schild L (2025) Pirouette: Query efficient single-server PIR. IACR Cryptol. ePrint Arch., 680

Kim A, Lee Y, Deryabin M, Eom J, Choi R (2023) LFHE: fully homomorphic encryption with bootstrapping key size less than a megabyte. IACR Cryptol. ePrint Arch., 767

Kogan D, Corrigan-Gibbs H (2021) Private blocklist lookups with checklist. In: Proc. 30th USENIX Secur. Symp., pp. 875–892. USENIX Association, Berkeley, CA, USA .

[https://www.usenix.org/conference/usenixsecurity21/presentation/kogan](https://www.usenix.org/conference/usenixsecurity21/presentation/kogan)Kushilevitz E, Ostrovsky R (1997) Replication is NOT needed: SINGLE database, computationally-private information retrieval. In: Proc. 38th Annu. IEEE Symp. Found. Comput. Sci. (FOCS), pp. 364–373. IEEE Comput. Soc., Washington, DC, USA .

[https://doi.org/10.1109/SFCS.1997.646125](https://doi.org/10.1109/SFCS.1997.646125)Li B, Micciancio D, Raykova M, Schultz M (2024) Hintless single-server private information retrieval. In: Adv. Cryptol. - CRYPTO 2024, Part IX. Lect. Notes Comput. Sci., vol. 14928, pp. 183–217. Springer, Cham.

[https://doi.org/10.1007/978-3-031-68400-5_6](https://doi.org/10.1007/978-3-031-68400-5_6)Lin Y, Tian H (2025) Efficient updatable private information retrieval from simulatable homomorphic ciphertexts. In: Proceedings of the 20th ACM Asia Conference on Computer and Communications Security, pp. 45–57

Lu W-j, Huang Z, Hong C, Ma Y, Qu H (2021) PEGASUS: bridging polynomial and non-polynomial evaluations in homomorphic encryption. In: Proc. IEEE Symp. Secur. Priv. (SP), pp. 1057–1073. IEEE, Piscataway, NJ, USA.

[https://doi.org/10.1109/SP40001.2021.00043](https://doi.org/10.1109/SP40001.2021.00043)Luo M, Wang M (2025) Faster spiral: Low-communication, high-rate private information retrieval. Cryptogr 9(1):13.

[https://doi.org/10.3390/cryptography9010013](https://doi.org/10.3390/cryptography9010013)Luo M, Liu F-H, Wang H (2024) Faster fhe-based single-server private information retrieval. In: Proc. ACM SIGSAC Conf. Comput. Commun. Secur. (CCS), pp. 1405–1419. ACM, New York, NY, USA.

[https://doi.org/10.1145/3658644.3690233](https://doi.org/10.1145/3658644.3690233)Lyubashevsky V, Peikert C, Regev O (2010) On ideal lattices and learning with errors over rings. In: Adv. Cryptol. - EUROCRYPT 2010. Lect. Notes Comput. Sci., vol. 6110, pp. 1–23. Springer, Berlin, Heidelberg .

[https://doi.org/10.1007/978-3-642-13190-5_1](https://doi.org/10.1007/978-3-642-13190-5_1)Lyubashevsky V, Peikert C, Regev O (2012) On ideal lattices and learning with errors over rings. IACR Cryptol. ePrint Arch., 230

Melchor CA, Barrier J, Fousse L, Killijian M-O (2016) XPIR:Private information retrieval for everyone. Proc Priv Enhancing Technol 2016(2):155–174.

[https://doi.org/10.1515/popets-2016-0010](https://doi.org/10.1515/popets-2016-0010)Menon SJ, Wu DJ (2022) SPIRAL: fast, high-rate single-server PIR via FHE composition. In: Proc. IEEE Symp. Secur. Priv. (SP), pp. 930–947. IEEE, Piscataway, NJ, USA.

[https://doi.org/10.1109/SP46214.2022.9833700](https://doi.org/10.1109/SP46214.2022.9833700)Menon SJ, Wu DJ (2024) YPIR: high-throughput single-server PIR with silent preprocessing. In: Proc. 33rd USENIX Secur. Symp. USENIX Association, Berkeley, CA, USA

Micciancio D, Polyakov Y (2021) Bootstrapping in fhew-like cryptosystems. In: Proc 9th Workshop Encrypt Comput Appl Homomorph Cryptogr. (WAHC), pp. 17–28. ACM, New York, NY, USA.

[https://doi.org/10.1145/3474366.3486924](https://doi.org/10.1145/3474366.3486924)Micciancio D, Sorrell J (2018) Ring packing and amortized FHEW bootstrapping. In: Proc Int Colloq Autom Lang Program (ICALP). LIPIcs, vol. 107, pp. 100–110014. Schloss Dagstuhl - Leibniz-Zentrum für Informatik, Dagstuhl, Germany.

[https://doi.org/10.4230/LIPIcs.ICALP.2018.100](https://doi.org/10.4230/LIPIcs.ICALP.2018.100)Mughees MH, Chen H, Ren L (2021) Onionpir: Response efficient single-server PIR. In: Proc. ACM SIGSAC Conf. Comput. Commun. Secur. (CCS), pp. 2292–2306. ACM, New York, NY, USA.

[https://doi.org/10.1145/3460120.3485381](https://doi.org/10.1145/3460120.3485381)Peikert C, Vaikuntanathan V, Waters B (2008) A framework for efficient and composable oblivious transfer. In: Adv Cryptol - CRYPTO 2008. Lect. Notes Comput. Sci., vol. 5157, pp. 554–571. Springer, Berlin, Heidelberg.

[https://doi.org/10.1007/978-3-540-85174-5_31](https://doi.org/10.1007/978-3-540-85174-5_31)Regev O (2005) On lattices, learning with errors, random linear codes, and cryptography. In: Proc. 37th Annu. ACM Symp. Theory Comput. (STOC), pp. 84–93 .

[https://doi.org/10.1145/1060590.1060603](https://doi.org/10.1145/1060590.1060603)Regev O (2009) On lattices, learning with errors, random linear codes, and cryptography. J ACM 56(6):34–13440.

[https://doi.org/10.1145/1568318.1568324](https://doi.org/10.1145/1568318.1568324)Ren L, Mughees MH, Sun I (2024) Simple and practical amortized sublinear private information retrieval using dummy subsets. In: Proc ACM SIGSAC Conf Comput Commun Secur. (CCS), pp. 1420–1433. ACM, New York, NY, USA.

[https://doi.org/10.1145/3658644.3690266](https://doi.org/10.1145/3658644.3690266)Wang Z, Ren L (2025) Single-server client preprocessing PIR with tight space-time trade-off. In: Adv Cryptol - EUROCRYPT 2025, Part VI. Lect. Notes Comput Sci, vol. 15606, pp. 94–122. Springer, Cham.

[https://doi.org/10.1007/978-3-031-91095-1_4](https://doi.org/10.1007/978-3-031-91095-1_4)Yang X, Wang R, Peng D, Liu K, Lu X, Tang X (2025) PIRCOR: communication-optimal hintless single-server PIR via homomorphic rotation. IACR Cryptol. ePrint Arch., 756

Zhou M, Park A, Zheng W, Shi E (2024) Piano: Extremely simple, single-server PIR with sublinear server computation. In: Proc IEEE Symp Secur Priv (SP), pp. 4296–4314. IEEE, Piscataway, NJ, USA.

[https://doi.org/10.1109/SP54263.2024.00055](https://doi.org/10.1109/SP54263.2024.00055)

## Acknowledgements

The authors thank the anonymous reviewers and editors for detailed and useful feedback.

## Funding

This work is supported by the Strategic Priority Research Program of Chinese Academy of Sciences (Grant No. XDB0690200),

the National Key Research and Development Program of China (Grant No. 2023YFB4503203),

and the National Natural Science Foundation of China (Grant No. 62372447).

## Author information

### Authors and Affiliations

### Contributions

Yiran Dai is the main contributor to this paper, and is primarily responsible for the constructions, proofs, and drafting the manuscript. Binwu Xiang and Lang Qin participated in the discussion and development of constructions and proofs, as well as the refinement of the manuscript. Yi Deng and Jiang Zhang provided valuable guidance, suggestions and insight. All authors read and approved the final manuscript.

### Corresponding author

## Ethics declarations

### Availability of data and materials

Data is available with the author; it will be made available to researchers as per demand.

### Conflict of interest

None of the authors have any conflict of interest in the manuscript.

## Additional information

### Publisher's Note

Springer Nature remains neutral with regard to jurisdictional claims in published maps and institutional affiliations.

## Appendices

### Appendix A noise analysis

For noise growth analysis, we adopt the standard heuristic in lattice-based FHE schemes (Chillotti et al. [2020](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR16); Menon and Wu [2022](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR44)) by modeling all rounding errors as independent subgaussian variables. This approach simplifies noise propagation analysis while preserving conservative worst-case bounds. Then, we can calculate the probability of decryption failure by concrete heuristic noise analysis with sub-Gaussian variables. Below, we give the heuristic noise analysis of our PIR protocol.

### A.1 Query expansion

Let all errors in the encryption algorithm of our protocol be sampled from a subgaussian with parameter \(\sigma _e\). The server implements query expansion by calling the \(\textsf {Expand}\) algorithm and the \(\textsf {RLWEstoRGSW}\) algorithm both online and offline. Let \(d_{ext}\), \(B_{ext}\) be the the decomposition dimension and the decomposition base in the \(\textsf {Expand}\) algorithm. The noise variance of output is \(\sigma ^2_{ext}=2^{v_1}\sigma _e^2(1+nd_{ext}B_{ext}^2/3)\). The noise variance of \(\textsf {RLWEstoRGSW}\) algorithm is \(\sigma ^2_{rgsw}=\sigma _e^2(1+nd_{r2g}B_{r2g}^2/2)\) with \(d_{r2g}\), \(B_{r2g}\) are the the decomposition dimension and the decomposition base in \(\textsf {RLWEstoRGSW}\).

### A.2 First dimension folding

The server completes the first-dimension query folding by performing number multiplication and accumulation operations on the ciphertext. In this case, the noise variance of the ciphertext is \(\sigma ^2_{fir}=2^{v_1}\sigma _{ext}^2\cdot p^2/4\). In order to perform the second dimensional query folding, the server packs these LWE ciphertexts into a RLWE ciphertext by \(\textsf {LWEstoRLWE}\) algorithm. Let \(d_{pack}\), \(B_{pack}\) be the the decomposition dimension and the decomposition base in the \(\textsf {LWEstoRLWE}\) algorithm. Then, the noise variance of the RLWE ciphertext is \(\sigma ^2_{pack}=2^{v_2}(\sigma _{fir}^2+\sigma _{e}^2nd_{pack}B_{pack}^2/3)\).

### A.3 s dimension folding

The server completes the second dimensional query process through one ciphertext multiplication. Let \(d_{sec}\), \(B_{sec}\) be the the decomposition dimension and the decomposition base in the external product , and finally return the noise variance of the response ciphertext as \(\sigma ^2_{res}=nd_{sec}B_{sec}^2\sigma _{rgsw}^2/2+\sigma ^2_{pack}\).

### Appendix B formal security proof of our protocol

The key-switching keys in our construction are \(\textrm{RLWE}'\) ciphertexts that encrypt functions of the secret key, including \(s^2\) and \(s(X^l)\) for \(l \in \mathbb {Z}_{2n}\), under the same key *s*. In the hybrid argument below, we will replace these ciphertexts with encryptions of zero. This step is not justified by standard RLWE or IND-CPA security alone, because the encrypted messages depend on the same secret key used for encryption. We therefore assume circular security for the RLWE-based scheme: encryptions of functions of the secret key under the same secret key are computationally indistinguishable from encryptions of zero. This assumption is standard in FHE constructions that publish key-switching keys (Genise and Micciancio [2018](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR24); Brakerski and Vaikuntanathan [2014](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR8)).

**Game 0**: This is the real query privacy experiment. The challenger runs \(\textsf {KeyGen}(1^\lambda )\) to generate secret key *s* and gives key-switching keys to \(\mathcal {A}\). \(\mathcal {A}\) then submits two indices \(idx_0, idx_1\). The challenger randomly selects a bit \(b \leftarrow {0,1}\), generates the query for \(idx_b\) using \(\textsf {Query}(s, idx_b)\), and gives the query ciphertexts to \(\mathcal {A}\). Finally, \(\mathcal {A}\) outputs a guess \(b'\).

**Game 1**: This game is identical to Game 0, except that the challenger replaces all ciphertexts in the challenge query with uniformly random elements in the ciphertext space.

**Game 2**: This game is identical to Game 1, except that the challenger replaces all key-switching keys with encryptions of zero. Recall that the key-switching keys are \(\textrm{RLWE}'\) ciphertexts encrypting \(s^2\) and \(s(X^l)\) for \(l \in \mathbb {Z}_{2n}\) under the same secret key *s*. Under the circular security assumption stated above, Game 1 and Game 2 are computationally indistinguishable.

In Game 2, the adversary’s view is entirely independent of the challenge index *idx*. Thus, the adversary’s advantage in guessing *b* is zero. Since each consecutive pair of games is computationally indistinguishable, the adversary’s advantage in Game 0 is negligible.

### Appendix C semantic security of share-A ciphertexts

### Lemma 1

(Adapted from Peikert et al. ([2008](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR49)))

For a security parameter \(\lambda\), let \(n \in \mathbb {N}\), and \(q, p \in \mathbb {N}\) be the ciphertext and plaintext moduli, respectively. Let \(\chi\) be an error distribution over \(R=\mathbb {Z}[X]/[X^n+1]\), and define the scaling factor as \(\Delta = \lfloor q/p \rfloor\). For any positive integer *k*, consider the sequence of ciphertexts \(\{(b_i, a)\}_{i\in [k]}\) generated as follows:

-
Sample \(a \leftarrow R_q\) as a common randomness.

-
For each \(i \in [k]\), independently sample a secret \(s_i \leftarrow R_q\) and noise \(e_i \leftarrow \chi\), and compute \(b_i = a \cdot s_i + e_i + \Delta m_i \pmod {q}\), where \(m_i \in R_p\) is the message to be encrypted.


Then for any probabilistic polynomial-time adversary \(\mathcal {A}\), its advantage in distinguishing the above distribution from the uniform random distribution \(\{(b_i', a)\}_{i\in [k]}\) (where \(b_i' \leftarrow R_q\)) is negligible. Formally:

where the probability is taken over all samplings and the random coins of \(\mathcal {A}\).

We prove the lemma using a hybrid argument, directly adapting the framework of Lemma 7.3 in Peikert et al. ([2008](https://link.springer.com/article/10.1186/s42400-026-00601-7#ref-CR49)) by replacing matrix LWE with its ring-based variant RLWE while preserving the proof structure.

### Proof

Let \(\mathcal {A}\) be any PPT adversary. Define a sequence of hybrid distributions \(H_0, H_1, \dots , H_k\) as follows:

-
\(H_0\): The real distribution \(\{(b_i, a)\}_{i \in [k]}\) where \(b_i = a \cdot s_i + e_i + \Delta m_i\) for each

*i*. -
\(H_t\) (for \(1 \le t \le k\)): The first

*t*components \(b_1, \dots , b_t\) are replaced by uniformly random elements \(b'_1, \dots , b'_t \leftarrow R_q\), while the remaining \(b_{t+1}, \dots , b_k\) are generated as in \(H_0\). -
\(H_k\): All components are uniform in \(R_q\), i.e., \(\{(b'_i, a)\}_{i \in [k]}\).


Assume for contradiction that \(\mathcal {A}\) distinguishes \(H_{t-1}\) from \(H_t\) with non-negligible advantage. We construct a simulator \(\mathcal {S}\) that breaks the RLWE assumption.

-
\(\mathcal {S}\) receives a challenge \((a, b^*)\) from an RLWE oracle, where either \(b^* = a \cdot s + e\) (RLWE sample) or \(b^* \leftarrow R_q\) (uniform).

-
\(\mathcal {S}\) sets the common randomness to

*a*.-
1.
For \(i < t\), \(\mathcal {S}\) picks uniform \(b'_i \leftarrow R_q\).

-
2.
For \(i = t\), \(\mathcal {S}\) sets \(b_t = b^* + \Delta m_t \pmod {q}\).

-
3.
For \(i> t\), \(\mathcal {S}\) samples fresh \(s_i \leftarrow R_q\), \(e_i \leftarrow \chi\), and computes \(b_i = a \cdot s_i + e_i + \Delta m_i\).


-
1.
-
\(\mathcal {S}\) gives \(\{(b_i, a)\}_{i \in [k]}\) to \(\mathcal {A}\) and outputs whatever \(\mathcal {A}\) outputs.


If \(b^*\) is an RLWE sample, the view of \(\mathcal {A}\) is identical to \(H_{t-1}\); if \(b^*\) is uniform, the view is identical to \(H_t\). Hence, any non-negligible advantage of \(\mathcal {A}\) translates directly to breaking RLWE.

Since RLWE is assumed hard, we have \(H_{t-1} \approx _c H_t\) for every *t*. By transitivity,

so the real distribution is computationally indistinguishable from the uniform distribution. This completes the proof. \(\square\)

## Rights and permissions

**Open Access** This article is licensed under a Creative Commons Attribution 4.0 International License, which permits use, sharing, adaptation, distribution and reproduction in any medium or format, as long as you give appropriate credit to the original author(s) and the source, provide a link to the Creative Commons licence, and indicate if changes were made. The images or other third party material in this article are included in the article’s Creative Commons licence, unless indicated otherwise in a credit line to the material. If material is not included in the article’s Creative Commons licence and your intended use is not permitted by statutory regulation or exceeds the permitted use, you will need to obtain permission directly from the copyright holder. To view a copy of this licence, visit [http://creativecommons.org/licenses/by/4.0/](http://creativecommons.org/licenses/by/4.0/).

## About this article

### Cite this article

Dai, Y., Xiang, B., Qin, L. *et al.* FlashPIR: low-latency FHE-based single-server PIR with low client overhead.
*Cybersecurity* **9**, 171 (2026). https://doi.org/10.1186/s42400-026-00601-7

Received:

Accepted:

Published:

Version of record:

DOI: https://doi.org/10.1186/s42400-026-00601-7
