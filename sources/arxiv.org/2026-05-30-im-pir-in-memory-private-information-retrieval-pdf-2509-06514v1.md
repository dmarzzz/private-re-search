---
url: https://arxiv.org/pdf/2509.06514v1
title: IM-PIR: In-Memory Private Information Retrieval
fetched_at: 2026-05-30T16:02:35
content_hash: sha1:87b7a39301cd9365ad6a17ada8ea10c119f39db9
extractor: jina
---

Title: IM-PIR: In-Memory Private Information Retrieval

URL Source: https://arxiv.org/pdf/2509.06514v1

Published Time: Tue, 09 Sep 2025 01:45:15 GMT

Number of Pages: 15

Markdown Content:
# IM-PIR: In-Memory Private Information Retrieval 

## Mpoki Mwaisela 

University of Neuchâtel Neuchâtel, Switzerland 

peterson.yuhala@unine.ch 

## Peterson Yuhala 

University of Neuchâtel Neuchâtel, Switzerland 

peterson.yuhala@unine.ch 

## Pascal Felber 

University of Neuchâtel Neuchâtel, Switzerland 

pascal.felber@unine.ch 

## Valerio Schiavoni 

University of Neuchâtel Neuchâtel, Switzerland 

valerio.schiavoni@unine.ch 

## Abstract 

Private information retrieval (PIR) is a cryptographic primitive that allows a client to securely query one or multiple servers without revealing their specific interests. In spite of their strong security guar-antees, current PIR constructions are computationally costly. Specifi-cally, most PIR implementations are memory-bound due to the need to scan extensive databases (in the order of GB), making them inher-ently constrained by the limited memory bandwidth in traditional processor-centric computing architectures. Processing-in-memory (PIM) is an emerging computing paradigm that augments memory with compute capabilities, addressing the memory bandwidth bottle-neck while simultaneously providing extensive parallelism. Recent research has demonstrated PIM’s potential to significantly improve performance across a range of data-intensive workloads, including graph processing, genome analysis, and machine learning. In this work, we propose the first PIM-based architecture for multi-server PIR. We discuss the algorithmic foundations of the latter and show how its operations align with the core strengths of PIM architectures: extensive parallelism and high memory bandwidth. Based on this observation, we design and implement IM-PIR, a PIM-based multi-server PIR approach on top of UPMEM PIM, the first openly commercialized PIM architecture. Our evaluation demonstrates that a PIM-based multi-server PIR implementation significantly improves query throughput by more than 3.7× when compared to a standard CPU-based PIR approach. 

> ©2025 ACM. Personal use of this material is permitted. Permission from ACM must be obtained for all other uses, in any current or future media, including reprinting/republishing this material for advertising or promotional purposes, creating new collective works, for resale or redistribution to servers or lists, or reuse of any copyrighted component of this work in other works. This is the author’s version of the work. The final version is published in the proceedings of the 26th International Middleware Conference.

## 1 Introduction 

Private information retrieval (PIR) [ 17 , 60 ] is a cryptographic prim-itive that enables a client to retrieve data from a public database without revealing the query content nor the accessed data. It can ei-ther be single-server PIR [ 15 , 32 , 50 , 60 ], where cryptographic tech-niques like fully homomorphic encryption (FHE) [ 13 , 14 , 28 , 31 ] are leveraged to achieve query privacy, or multi-server PIR [ 35 ], where the database is replicated across multiple non-colluding servers and techniques such as secret sharing [ 12 ] are used to retrieve data obliv-iously. PIR has been explored as a critical building block for a wide range of privacy-preserving applications including medical record re-trieval [ 43 ], certificate transparency [ 50 , 57 ], private blocklist lookup [ 59 ], private media streaming [ 44 ] and verification of compromised credentials [42], among others. In spite of their strong security guarantees, PIR schemes incur significant computational overhead: to preserve query privacy, the server typically processes the entirety of the database for each query [ 2, 6, 50 ], making PIR a fundamentally memory-bound primi-tive [ 67 ]. As such, scaling PIR to support large databases efficiently remains challenging. While several research efforts [ 2, 6, 42 , 50 , 61 ]have been made to address the computational costs associated with PIR, the proposed methods are based on processor-centric compute architectures ( i.e., CPUs and GPUs) which remain constrained by the memory wall – the bottleneck stemming from the mismatch between CPU processing speed and memory bandwidth [85]. A promising approach to mitigating the memory wall in modern computing architectures is processing-in-memory (PIM) [ 23 , 26 ,37 , 78 ], a computing paradigm that aims to integrate computational logic, ranging from simple logic units [ 82 ] to general-purpose cores [ 20 ], directly into memory chips, enabling data to be processed in memory. A wide range of PIM architectures have been proposed in the literature [ 4 , 48 , 49 , 74 , 86 , 87 ], but only recently has the first openly commercialized PIM architecture emerged: UPMEM PIM [ 20 ]. The latter associates each 64 MB chunk of DRAM with a low-power core called a DRAM processing unit (DPU), yielding an aggregate memory bandwidth of up to 2 TB/s [ 45 ]. In addition, the large number of DPUs deployed across the memory system enables extensive parallelism. Recent studies have exploited UPMEM PIM for data-intensive applications including graph processing [ 33 , 45 ], genome analysis [ 5, 21 ], machine learning [ 56 ] showing large per-formance improvements. In this work, we focus on designing a PIR scheme on top of a PIM architecture, addressing the memory bandwidth problem inherent in current processor-centric PIR schemes. We specifically target multi-server PIR instead of the single-server variant based on FHE, as FHE involves complex algorithms like the number theoretic transform (NTT) [ 1, 65 , 81 ] which are poorly suited to current PIM architectures like UPMEM PIM. This was shown by previous studies [ 56 , 75 ] that explored UPMEM PIM for FHE acceleration. In contrast, multi-server PIR schemes are typically built upon linear secret-sharing techniques [ 35 ] which involve relatively lightweight operations such as bitwise XORs and dot products, which naturally map to the strengths of PIM architectures: extensive parallelism and high memory bandwidth. We propose IM-PIR, 1 a PIM-based multi-server PIR design which leverages the strengths of PIM architectures by offloading the core PIR server-side computations: XOR-based computations and inner products, directly onto UPMEM PIM DPUs, thereby en-abling in-place query processing over large databases. This reduces data movement between memory and compute units, and enhances performance for multi-server PIR schemes. By aligning algorithmic structure with architectural strengths, our PIM-based multi-server 

> 1Pronounced "impire".
> arXiv:2509.06514v1 [cs.DC] 8 Sep 2025 Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni

PIR demonstrates the potential of emerging memory-centric plat-forms like UPMEM’s for practical privacy-preserving processing operations. To the best of our knowledge, our work is the first to propose a thorough PIM-based design for multi-server PIR. Overall, our paper provides the following contributions: 

• We design IM-PIR, a high-throughput PIM-based approach for accelerating multi-server PIR query processing. 

• We implement and evaluate IM-PIR on UPMEM PIM, the first commercialized architecture. Our experimental results show IM-PIR improves query throughput and latency by more than 3.7× compared to state-of-the-art processor-centric multi-server PIR designs. 

Roadmap. The remainder of this paper is structured as follows: §2 introduces key concepts, including private information retrieval protocols and the UPMEM processing-in-memory architecture. §3 discusses our PIM-based multi-server PIR design, while §4 outlines the corresponding implementation details. We evaluate IM-PIR in §5, providing a performance comparison of our solution againsts current processor-centric PIR designs. We then discuss related work in §6 and conclude our paper in §7. 

## 2 Background 

In this section, we provide a thorough background on private in-formation retrieval techniques and discuss the issues faced with traditional processor-centric PIR implementations (§2.1). We then provide an overview of processing-in-memory, and UPMEM’s PIM architecture (§2.4). 

2.1 Private Information Retrieval 

Private information retrieval (PIR) [ 17 , 60 ] is a fundamental privacy-preserving primitive that allows a client to retrieve a specific item from a public database without the database server learning any information about the client’s query nor the item being accessed. In a typical PIR setting, we consider a database 𝐷 consisting of 

𝑁 items; the goal is to obtain the 𝑖 -th element 𝐷 [𝑖 ] while keeping the index 𝑖 confidential. This privacy guarantee is of paramount importance in a variety of applications that require the privacy of user queries [7, 43, 44, 57, 59]. PIR techniques are broadly classified into two categories: single-server PIR and multi-server PIR. In single-server PIR, query privacy is achieved by relying on cryptographic hardness assumptions, i.e., ring learning-with-errors problem (RLWE) [ 68 ] and techniques like fully homomorphic encryption (FHE) [ 13 , 14 , 28 , 31 ] which build upon these assumptions. On the other hand, in multi-server PIR the database is replicated across multiple non-colluding servers. The client then sends different queries to each of the servers and derives the requested item by (mathematically) combining the responses from the servers. The privacy of the user’s query is achieved through the non-collusion assumption, rather than cryptographic hardness. A central aspect of PIR protocols is the so-called all-for-one 

principle [ 2, 6, 10 , 17 ], which requires that the server (or servers) process the entire database for every query. This exhaustive pro-cessing is not an incidental detail but a deliberate design choice to ensure that the data access pattern remains statistically independent of the specific query being made. By requiring a full sweep of the database, the PIR protocols prevent any leakage of information that could otherwise be exploited to infer the user’s interest by the un-trusted server. While the extensive data processing inherent in the 1

> 2
> 3
> 4
> 5
> 7
> 6

Figure 1. Single-server PIR with fully homomorphic encryption. To fetch record 7 from a 4-entry database 𝐷 = [2, 6, 7, 5], the client homomorphically encrypts a one-hot query vector into a query ci-phertext which is sent to the database server. The server first ho-momorphically multiplies the query ciphertext with the entire DB, and then homomorphically adds the resulting ciphertexts to obtain 

Enc (7). This is sent back to the client who decrypts it to obtain the record of interest, 7, obliviously. 

all-for-one approach is critical for achieving strong privacy, it si-multaneously poses significant challenges in terms of computational load and memory bandwidth, issues that are particularly pronounced in large-scale deployments. Consequently, a considerable body of research is devoted to optimizing this trade-off, striving to enhance system efficiency while preserving the robust privacy characteristics that define PIR systems [2, 6, 12, 42, 44, 50, 57, 61, 67]. 

Basic notation. In the remainder of this work, we adopt the fol-lowing notations. 𝐷 represents a public PIR database with 𝑁 items. When used, 𝐿 is the vector length ( e.g., number of bits) of each database entry, and F𝑝 is an integer field with modulus 𝑝 . Vectors are formatted in bold, e.g., v and the i-th index is denoted by v[𝑖 ]. ⊕

represents the exclusive-OR, i.e., XOR bitwise operation. 2 Hence-forth, we use the terms database and DB interchangeably. We use the symbols KB, MB, and GB to denote 210 , 220 , and 230 bytes respectively. 

2.2 Single-Server PIR 

Figure 1 presents an overview of a simple FHE-based single-server PIR. Given a public database 𝐷 = [2, 6, 7, 5] containing four items, a client wishes to retrieve the 3𝑟𝑑 item from D, i.e., 𝐷 [2] = 7

in a privacy-preserving way. The client generates a query 𝑞 =

[0, 0, 1, 0] ➊ which is a one-hot vector ( i.e., indicator vector) of length 4, where the 3𝑟𝑑 slot in the vector is 1 and the rest 0. To preserve query privacy, the client encrypts ( Enc ) each slot of the vec-tor using FHE ➋ to produce a vector of ciphertexts [𝑐 0, 𝑐 1, 𝑐 2, 𝑐 3] =

[Enc (0), Enc (0), Enc (1), Enc (0)] . The client then sends this query ciphertext to the server ➌, which cannot learn anything about the actual item being requested. The server homomorphically multiplies each 𝑐 𝑖 by the corresponding DB item 𝐷 [𝑖 ] to obtain a vector of 

> 2XOR represents the addition operation in a binary field. IM-PIR : In-Memory Private Information Retrieval Client 1
> 2
> 3
> 4

Figure 2. Multi-server PIR with 𝑛 = 2 non-colluding servers. To fetch record 10 from the replicated database [00 , 10 , 01 , 11 ], the client generates (random) bit vectors which XOR to 1 only at index of in-terest ( i.e., 2 in this case). The servers XOR elements of the database where the bit vectors have value 1. The results are sent to the client which obtains the desired item by XORing both results: 01 ⊕ 11 = 10 .ciphertexts ➍, each encrypting either 0 or the desired DB item. That is, the server does: 

[𝑐 0, 𝑐 1, 𝑐 2, 𝑐 3] ◦ [ 2, 6, 7, 5] = [Enc (0), Enc (0), Enc (7), Enc (0)] 

where ◦ represents a point-wise FHE multiplication of both vectors. 3

The server then homomorphically adds the ciphertexts ➎, resulting in a single ciphertext encrypting the desired DB item: Enc (0)+ Enc (0)+ 

Enc (7) + Enc (0) = Enc (7), where + represents FHE addition. This single ciphertext result, Enc (7) is sent to the client ➏ which decrypts (Dec ) the ciphertext ➐ to obtain the desired plaintext item, 𝐷 [2] =

Dec (Enc (7)) = 7.

Computational complexity. Following from the illustrative exam-ple above, the main computations in single-server PIR are FHE multiplication and addition operations. FHE addition is simple, and results in a time complexity O( 𝑁 ) for vectors of size 𝑁 . In contrast, FHE multiplication is more costly, requiring expensive convolution operations. The number theoretic transform (NTT) [ 81 ] is commonly used to achieve such homomorphic multiplications with a time com-plexity of O( 𝑁𝑙𝑜𝑔𝑁 ) for vectors of length 𝑁 . Since the PIR protocol performs computations on the entire database for each query ( i.e., all-for-one principle), the resulting computational overhead is very large. 

2.3 Multi-Server PIR 

In a multi-server PIR setting, cryptographic techniques like FHE are not used to guarantee query privacy. Rather, the database is replicated across 𝑛 servers ( 𝑛 ≥ 2) and query privacy is obtained under the assumption that these servers do not collude. In practice,               

> 3In fully homomorphic encryption, if a ciphertext 𝑐 1encrypts a plaintext 𝑝 1and we have another plaintext 𝑝 2, then 𝑐 ′=𝑐 1∗𝑝 2encrypts the value 𝑝 1∗𝑝 2

these servers should be operated by distinct entities with differing interests to comply with the PIR scheme’s security. Formally, in multi-server PIR, we consider a client C who seeks to privately access item 𝐷 [𝑖 ] ∈ F𝐿 𝑝 from a database (or table) 𝐷 ∈ F𝑁 ×𝐿 𝑝 

which is replicated (or duplicated) across two non-colluding servers, 

𝑆 1 and 𝑆 2. A simple (naive) approach for the client to proceed is encode their query as two random vectors v1 ∈ F𝑁 𝑝 and v2 ∈ F𝑁 𝑝 

such that v1 ⊕ v2 is a one-hot indicator vector whose entries are all 0, except at the index of interest 𝑖 , where it is 1. Upon receiving the vectors, 𝑆 1 and 𝑆 2 individually compute a linear combination of the the database entries weighted by their query vectors ( v1 or v2), yielding two subresults 𝑟 1 and 𝑟 2 which are sent back to the client. The client then obtains the desired time as 𝐷 [𝑖 ] = 𝑟 1 + 𝑟 2.Figure 2 presents an overview of this simple multi-server PIR scheme in F2. Given a public database 𝐷 containing four items represented as bit strings: [00 , 10 , 01 , 11 ] replicated across two non-colluding servers 𝑆 1 and 𝑆 2, a client wishes to retrieve the 2𝑛𝑑 item from D, i.e., 𝐷 [1] = 10 , in a privacy-preserving way. First, the client generates two random bit vectors: v1 ∈ F42 and v2 ∈ F42 ➀

such that v1 [𝑖 ] ⊕ v2 [𝑖 ] = 0 at all entries, except at the index/slot of interest, 2 in this case, where v1 [𝑖 ] ⊕ v2 [𝑖 ] = 1. For example, if v1 = [1, 0, 1, 0], then v2 = [1, 1, 1, 0]. The client sends v1 to 𝑆 1

and v2 to 𝑆 2 ➁. Each server XORs all values in 𝐷 where its bit vector is 1 ➂: thus, 𝑆 1 computes 𝑟 1 = 00 ⊕ 01 = 01 and 𝑆 2 computes 

𝑟 2 = 00 ⊕ 10 ⊕ 01 = 11 . The subresults are then sent to the client, which XORs both subresults received ➃ to retrieve the item of interest: 𝐷 [1] = 𝑟 1 ⊕ 𝑟 2 = 01 ⊕ 11 = 10 .This idea is formalized using the notion of a distributed point function (DPF) [35], which we explain in the following. Given 2 values 𝑎 and 𝑏 , a point function 𝑃 𝑎,𝑏 (𝑥 ) is given by: 

𝑃 𝑎,𝑏 (𝑥 ) =

(

𝑏, if 𝑥 = 𝑎 

0, otherwise That is, P is 0 everywhere except at 𝑎 , where its value is 𝑏 .A distributed point function (DPF) allows secret-sharing of a point function. It represents a point function 𝑃 𝑎,𝑏 using two keys 

𝑘 1 and 𝑘 2. Each key individually hides 𝑎 and 𝑏 , but there exists an efficient algorithm Eval such that: 

Eval (𝑘 1, 𝑥 ) ⊕ Eval (𝑘 2, 𝑥 ) = 𝑃 𝑎,𝑏 (𝑥 ), ∀𝑥 

If we let 𝑓 𝑘 denote the function Eval (𝑘, ·) , the functions 𝑓 𝑘 0 and 𝑓 𝑘 1

can be viewed as an additive secret sharing of 𝑃 𝑎,𝑏 [35]. Based on the above discussion, we can formally define a DPF as a pair of functions (Gen , Eval ), where Gen is a key generation function which takes values 𝑎 and 𝑏 as inputs: Gen (𝑎, 𝑏 ), and outputs DPF keys ( i.e., secret shares) 𝑘 1, 𝑘 2 such that no individual key reveals either 𝑎 or 𝑏 . The evaluation function, Eval , then takes a key 𝑘 and an input 𝑥 , producing a share of the function 𝑓 𝑘 (𝑥 ) = Eval (𝑘, 𝑥 ).To achieve multi-server PIR ( e.g., for 𝑛 = 2 servers), the client can encode their query using a DPF. Given a database 𝐷 containing 

𝑁 items (bit strings), suppose a client wishes to retrieve the item at index 𝑖 ∗ = 𝐷 [𝑖 ∗]. The client encodes their query as a point function 

𝑃 𝑖 ∗,1 (essentially a one-hot vector) such that: 

𝑃 𝑖 ∗,1 ( 𝑗 ) =

(

1, if 𝑗 = 𝑖 ∗

0, otherwise The client uses a DPF generation function to produce two keys: 

Gen (𝑖 ∗, 1) = (𝑘 1, 𝑘 2), such that: Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni 

𝑃 𝑖 ∗,1 ( 𝑗 ) = Eval (𝑘 1, 𝑗 ) ⊕ Eval (𝑘 2, 𝑗 ), ∀𝑗 

The client sends 𝑘 1 to the first server and 𝑘 2 to the second server. As discussed previously, Eval (𝑘, 𝑗 ) can be seen as a function share 𝑓 𝑘 

of the point function. Each server thus runs the Eval function with their respective keys on each database index 𝑗 ∈ [ 0, 𝑁 − 1] to obtain a vector 𝑞 = [𝑓 𝑘 (0), 𝑓 𝑘 (1), . . . 𝑓 𝑘 (𝑁 − 1)] , and then computes a linear combination, e.g., XOR, of the database entries weighted by this vector to obtain a subresult 𝑟 :

𝑟 = 𝑓 0 · 𝐷 [0] ⊕ · · · ⊕ 𝑓 𝑁 −1 · 𝐷 [𝑁 − 1]

= Eval (𝑘, 0) · 𝐷 [0] ⊕ · · · ⊕ Eval (𝑘, 𝑁 − 1) · 𝐷 [𝑁 − 1]

= 

> 𝑁 −1

Ê

> 𝑗 =0

Eval (𝑘, 𝑗 ) · 𝐷 [ 𝑗 ]

Each subresult is sent to the client which XORs them to reconstruct the desired item: 𝐷 [𝑖 ∗] = 𝑟 1 ⊕ 𝑟 2

Going back to the illustrative example described in Figure 2 with 𝐷 = [00 , 10 , 01 , 11 ] and the client wishing to obtain 𝐷 [1] =

10 , the one-hot vector representing the query is [0, 1, 0, 0] which corresponds to the point function 𝑃 1,1. A DPF = (Gen , Eval ) can be used to generate keys and function shares as follows: 

(𝑘 1, 𝑘 2) ← Gen (1, 1)

𝑃 1,1 (𝑥 ) = Eval (𝑘 1, 𝑥 ) ⊕ Eval (𝑘 2, 𝑥 ), ∀𝑥 ∈ { 0, 1, 2, 3}

v1 = [Eval (𝑘 1, 𝑥 )] 3 

> 𝑥 =0

= [1, 0, 1, 0]

v2 = [Eval (𝑘 2, 𝑥 )] 3 

> 𝑥 =0

= [1, 1, 1, 0]

v1 ⊕ v2 = [0, 1, 0, 0]

These shares of the query vector are then used as previously described to obtain the XOR-derived subresults which are used by the client to reconstruct the desired DB item. 

Computational complexity. The key generation function Gen is a relatively lightweight computation with complexity of O( 𝑙𝑜𝑔 (𝑁 )) ,where N is the size of the DB. This function is performed on the client. On the contrary, the key evaluation function Eval is more expensive, as it evaluates all indices of the database. However, the most expensive operations are the dot/inner product and XORing (henceforth dpXOR ) of database items which (in general) require 

O( 𝑁 ) computation since every entry of the database is processed. These computations represent the major bottleneck in multi-server PIR [42] which our work aims to tackle. In Figure 3, we analyze the computational overhead of these DPF-based PIR operations across databases of varying sizes. While client-side key generation remain relatively lightweight, the server side operations: key evaluation and dpXOR operations become signif-icantly more demanding as the database size increases. For example, a single query on a 4 GB database reveals that dpXOR operations take ≈ 10 × longer than key evaluation, which itself is ≈ 1000 × than key generation. Overall, processing a 4 GB database takes about 3son the server, with the bulk of the time spent on dpXOR operations which involve accessing the entire database. The roofline model in Figure 3 (b) indicates that these XOR-based operations achieve low operational intensity, meaning they are memory-bound. 4      

> 4Memory bound workloads have low operational intensity, and compute bound work-loads have high operational intensity. 050 100 150 200 250 300 350 400 450 124Time (ms) Size (GB) Gen Eval dpXOR
> (a) Execution Time
> 0.5 124816 0.01 0.1 110 50 memory bound region Performance (GFLOPS) Operational Intensity (OP/B) Peak compute dpXOR Eval
> (b) Roo fl ine Model

Figure 3. Breakdown of execution times for DPF-based multi-server PIR operations. Memory-bound (low operational intensity) XOR-based operations represent the primary bottleneck, motivating the need for memory-centric compute solutions. Host    

> CPU
> DPU
> WRAM I RAM
> DM A
> M RAM
> x8
> PI M Chip PI M Chip
> PI M Chip PI M Chip
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> DPU
> Bank
> Standar d
> M emor y
> PI M M emor y

Figure 4. High-level overview of the UPMEM PIM hardware archi-tecture. The host CPU interacts with both standard main memory and PIM-enabled memory. The latter contains low-power DRAM processing units (DPUs), enabling computation in memory. In processor-centric architectures, such operations are primar-ily bottlenecked by memory bandwidth limitations and the cost of moving data between the processor and memory [ 50 ]. These perfor-mance constraints underscore the importance of addressing memory bottlenecks for practical deployment of PIR systems handling large and frequently queried databases [27, 39, 79]. 

2.4 Processing-in-memory 

Processing-in-memory (PIM) [ 23 , 26 , 37 , 78 ] is a memory-centric computing paradigm that integrates either general-purpose cores or specialized accelerators close to or within memory arrays. This design helps alleviate the data movement bottleneck caused by the costly data transfers between processors and memory in tra-ditional processor-centric architectures, which lead to significant performance losses and energy overhead [ 11 , 46 ]. Additionally, PIM addresses the growing performance gap between fast processors and slower memory modules. Several PIM architectures exist, including HBM-PIM [ 25 ], UPMEM-PIM [ 20 , 83 ], Samsung AxDIMM [ 24 ], and SK Hynix AiM [ 54 ]. In our work, we focus on the UPMEM PIM architecture, but the ideas can be extended to other PIM archi-tectures. 

UPMEM PIM architecture. A UPMEM PIM-enabled system, as depicted in Figure 4, consists of a host CPU (a standard multicore processor), standard DRAM modules, and PIM-enabled memory modules. Each PIM module comprises two DRAM ranks, with each IM-PIR : In-Memory Private Information Retrieval 

rank containing eight PIM chips. Each PIM chip integrates eight DRAM Processing Units (DPUs), where each DPU is associated with 64 MB of private main RAM (MRAM). In an 8 GB memory module, this architecture results in a total of 128 DPUs. At the time of this writing, a UPMEM PIM-enabled system can scale to support up to 20 PIM-enabled modules, which collectively accommodate 2,560 DPUs with a total memory capacity of 160 GB. Though a UPMEM PIM-enabled system incorporates two distinct types of memory modules (PIM-enabled or standard DRAM), it retains the standard DRAM as main memory for the host CPU. The host CPU offloads computations to PIM-enabled memory. Initially, data to be processed in PIM modules is stored in standard DRAM. It is then explicitly copied to PIM memory via the CPU. Once PIM computations are complete, the results can be retrieved by the host CPU back into standard DRAM. 

DPU architecture. Each DPU is a general-purpose 32-bit in-order core which implements a RISC-style instruction set architecture. It contains 88 KB of SRAM which is split into 24KB instruction mem-ory called instruction RAM (IRAM), and 64KB scratchpad memory called working RAM (WRAM). Data is exchanged between WRAM and MRAM via DMA. The DPU supports up to 24 hardware threads to achieve scaling, with all threads sharing WRAM space. At the time of this writing, UPMEM PIM-DPUs can operate either a 350 MHz or 400 MHz. The maximum possible MRAM-WRAM bandwidth for each configurations is respectively, 700 MB/s and 800 MB/s, result-ing in an aggregate memory bandwidth of up to 2 TB/s (for DPUs at 350 MHz) or 1.79 TB/s (for DPUs at 400 MHz) [45, 58]. 

UPMEM PIM programming model. A UPMEM PIM program consists of a host program and a DPU program. The host program executes on the CPU while the DPU program runs on the DPUs. UPMEM provides a software development kit (SDK) allowing de-velopers to write PIM-based software. The program to be executed on the DPUs must be written in the C programming language, but UPMEM has announced support for Rust in the near future. On the other hand, the host program can be written in C/C++, Python, and Java. The primary roles of the host program include: allocat-ing DPUs, loading the compiled DPU binaries, and initiating DPU execution. DPUs follow the single program multiple data (SIMD) program-ming model, and 24 software threads called tasklets map to the DPU’s hardware threads. Developers are responsible for partitioning the workloads and managing synchronization across these tasklets. Due to architectural and design constraints related to memory access, UPMEM PIM maintains a separate address space for PIM memory and standard DRAM memory. As a result, data to be pro-cessed by PIM DPUs must be explicity copied from DRAM to DPU MRAM. Also, DPUs have no memory management unit (MMU), so programmers must derive the physical memory addresses in MRAM of data to be copied to the DPU [63]. 

This work. We aim to leverage PIM to tackle the data movement problem in PIR schemes, which as we have seen, are highly memory-bound. We recall that single-server PIR computational overhead is dominated by FHE. Recent studies [ 56 , 75 ] have explored using PIM architectures like UPMEM’s to accelerate FHE, but their findings indicate that current PIM architectures like UPMEM PIM are poorly adapted for FHE. This is due to complex operations like the num-ber theoretic transform [ 1 , 65 , 81 ] which induce costly inter-DPU communication [ 56 , 75 ]. In contrast, multi-server PIR protocols typ-ically rely on lightweight operations like XORs, dot products, and basic linear algebra which align well with the highly parallel and high-bandwidth design provided by current PIM architectures. For this reason, our work focuses on accelerating multi-server PIR using PIM. 

Take-away 1 : Multi-server PIR algorithms are better adapted for PIM than their single-server PIR counterparts. 

## 3 Design of IM-PIR 

In this section we present the design of IM-PIR, a multi-server PIR solution that leverages a PIM architecture to overcome the limitations of current processor-centric multi-server PIR solutions. We consider a DPF-based multi-server PIR scheme and describe how we align its algorithmic structure with the architectural strengths of both PIM and traditional CPUs. Our design strategically partitions the core server-side PIR workload between the CPU and PIM cores: the host CPU handles initial DPF key evaluation, while the memory-bound linear operations, such as inner products and bitwise XOR operations on the entire database, are offloaded to PIM DPUs for efficient in-place parallel processing. We consider a DPF-based multi-server PIR scheme where a client aims to retrieve an item from a public database 𝐷 = [𝑑 0, . . . , 𝑑 𝑁 ]

replicated across two servers 𝑆 1 and 𝑆 2. We adopt the DPF con-struction described in [ 61 ], which in turn builds upon the DPF con-struction from [ 35 ]. These DPF constructions leverage a Goldreich-Goldwasser-Micali (GGM) [ 38 ]-based pseudorandom function (PSF) for computing DPF function shares. While our work considers a two-server PIR construction, i.e., 𝑛 = 2, the details are easily gen-eralizable to multi-server PIR constructions where 𝑛 > 2. Figure 5 illustrates the overall system design of IM-PIR, and we detail its key steps in the rest of this section. 

3.1 DPF key generation 

Key generation is the first step in multi-server PIR and allows the client to encode their query into keys which will be used to create function secret shares used on the database servers. In IM-PIR, key generation function Gen generates the two DPF keys ➊ from two inputs, the database index of interest 𝑖 and a security parameter 𝜆 to produce two keys: 

Gen (1𝜆 , 𝑖 ∈ 0, . . . , 𝑁 − 1) → ( 𝑘 1, 𝑘 2)

The security parameter, 𝜆 , typically corresponds to the bit-length of a cryptographic key. Each key consists of two 2-dimensional codewords [61]: 

{𝐶 0 ∈ F2× ( 𝑙𝑜𝑔 (𝑁 )+ 1) 

> 2𝜆

, 𝐶 1 ∈ F2× ( 𝑙𝑜𝑔 (𝑁 )+ 1) 

> 2𝜆

}

These keys are then sent to the respective servers ➋.

3.2 DPF evaluation 

In the DPF construction of [ 35 ], DPF evaluation is based on a GGM PSF computation tree, a binary tree where pseudorandom values are expanded at each level, staring from a root seed. The goal is to obtain a vector v = [Eval (𝑘, 0), Eval (𝑘, 1), . . . Eval (𝑘, 𝑁 − 1)] where 

𝑘 ∈ { 𝑘 1, 𝑘 2 }. To evaluate the function shares: Eval (𝑘, ·) , the GGM PSF tree uses a recursive function 𝑅 as follows: Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni 1

> 2
> 3
> 5
> 7
> 6
> 4

Figure 5. Multi-server PIR with IM-PIR. Server-side computations are partitioned between the host CPU and PIM DPUs: the host performs initial DPF key evaluation, while the more costly memory-bound linear dpXOR operations are performed on PIM DPUs. 

Eval (𝑘, 𝑗 ) = 𝑅 (𝑑 = 𝑙𝑜𝑔 (𝑁 ), 𝑗 ) (1) 

𝑅 (0, 0) = 𝐶 0 [0, 0] (2) 

𝑅 (𝑑, 𝑗 ) = PRF 𝑅 (𝑑 −1,⌊ 𝑗   

> 2⌋ )

( 𝑗 𝑚𝑜𝑑 2)+ 

𝐶 𝑅 (𝑑 −1,⌊ 𝑗     

> 2⌋ ) 𝑚𝑜𝑑 2

[ 𝑗 𝑚𝑜𝑑 2, 𝑑 ] (3) 

𝑑 represents the depth of a node in the tree: 0 for the root node and 

𝑙𝑜𝑔 (𝑁 ) for the leaf nodes; 𝑗 is the index of the node within each depth(0 being the leftmost index); and PRF 𝑠 (𝑥 ) is a pseudorandom function which encrypts a value 𝑥 with an encryption key 𝑠 . A com-monly used PSF (also used in this work) is AES-128. For example, to query a database containing four items, each server computes: 

Eval (𝑘, 0), Eval (𝑘, 1), Eval (𝑘, 2), Eval (𝑘, 3) for their respective keys. Following from (1): 

Eval (𝑘, 𝑗 ) = 𝑅 (𝑑 = 𝑙𝑜𝑔 (𝑁 ), 𝑗 ) = 𝑅 (𝑙𝑜𝑔 (4), 𝑗 ) = 𝑅 (2, 𝑗 )

This means the servers must compute: 𝑅 (2, 0), 𝑅 (2, 1), 𝑅 (2, 2) and 

𝑅 (2, 3). Figure 6 illustrates the binary tree construction needed for computing these values. 

DPF Eval parallelization. On preliminary investigation, we ob-serve that the DPF evaluation tree is amenable to parallelization. Two common approaches for proceeding are a branch-parallel and a 

level-by-level approach, illustrated in Figure 7. In the branch-parallel approach, each thread is responsible for computing one or more leaf nodes, i.e., Eval (𝑘, 𝑗 )), in the DPF evaluation tree. However, in this approach, each thread redundantly performs the full path from the root node to the leaf, leading to wasteful computations. On the other hand, in the level-by-level approach, computation threads are assigned to tree levels ( i.e., tree depths), with each thread computing all nodes at a single level and saving the intermediate results. While this approach eliminates the redundant path computations in the 

Figure 6. GGM computation tree for 𝑁 = 4. Each node invokes a PRF, seeded with values from previous nodes. The leaf nodes correspond to Eval (𝑘, 𝑗 ).branch-parallel approach, it requires extensive synchronization be-tween threads at each level, and consumes a large amount of memory for storing intermediate results for each level. A previous study on GPU-based DPF evaluation [ 61 ] provides an extensive discussion of the tradeoffs between branch-parallel and level-by-level approaches for computing the DPF evaluation tree. They proceed with a more efficient technique called memory-bounded tree traversal, which is similar to the level-by-level approach, but computes smaller chunks of nodes per level, rather than the full level. We discuss these parallelization techniques from a UPMEM PIM DPU perspective. IM-PIR : In-Memory Private Information Retrieval 

Figure 7. Common parallelization approaches for DPF evaluation. 

Branch-parallel. Although this approach introduces computational redundancy, it remains the most intuitive method and can still be considered for PIM-based processing by leveraging the massive par-allelism offered by UPMEM PIM DPUs. Nevertheless, architectural details of UPMEM PIM, specifically the limited WRAM size of DPUs ( 64 KB), make this approach infeasible on the current UP-MEM PIM architecture. To understand why, consider a hypothetical scenario where a database containing 𝑁 = 232 one byte items, i.e., 

4 GB in total, is being queried. For a PIM server with 2048 = 211 

DPUs, if we assume an equal partitioning of the database across the DPUs, we have 232 /211 = 221 items per DPU. In our considered DPF construction, Eval (𝑘, 𝑗 ), 𝑗 ∈ { 0, . . . , 𝑁 − 1} values are bits ( i.e., 0 or 

1). This means for a branch-parallel DPF evaluation approach, all threads/tasklets on the DPU together compute 221 one-bit Eval (𝑘, 𝑗 )

items, totalling 221 /213 = 256 KB of data, in parallel. However, all tasklets running in parallel on a DPU share the limited 64 KB of WRAM, which cannot accommodate 256 KB of data. 5 There exist complex workarounds involving synchronization of the DPU tasklets to compute each branch up to a specific tree depth such that the total WRAM usage never exceeds 64 KB, storing the intermediate results back in MRAM (which has a larger capacity), and resuming till the entire branch from the root node to the leaf ( Eval (𝑘, 𝑗 )) is computed. However, its sheer complexity and proneness to error, combined with the issue of computational redundancy, make it a highly unattractive approach for UPMEM PIM DPUs. 

Level-by-level. As regards the level-by-level and memory-bounded tree traversal approaches, they both require significant inter-DPU communication to share intermediate results among DPUs. Unfortu-nately, the current UPMEM PIM architecture does not support direct DPU-DPU communication, and all inter-DPU data copying must go through the host CPU. Several studies [ 30 , 55 , 56 , 75 ] discuss the overhead of inter-DPU communication, showing how its cost alone can largely outweigh any benefits obtained from offloading these highly parallelizable operations on DPUs. Lastly, in the GGM-based DPF evaluation, each node invokes a pseudorandom function, AES-128 in this case. PSFs like AES-128 involve multiple rounds of compute-intensive operations not suitable for lightweight cores like 32-bit RISC DPUs. Moreover, unlike CPUs which feature dedicated cryptographic instructions such as AES-NI [ 41 ], UPMEM PIM DPUs lack any crypto acceleration primitives, making them unsuitable for state-of-the-art PSFs. These points suggest that PIM DPUs are not good options for offloading the tree-based operations in DPF evaluation. As a result, IM-PIR offloads this work to the host-side CPU, which performs   

> 5In practice, the actual usable WRAM by all tasklets is even less than 64 KB.

DPF evaluations ➋ using cryptographic hardware-accelerated AES-NI instructions. To parallelize the DPF evaluations, we partition the DPF evalua-tion tree into subtrees (each a perfect binary tree 6) and assign each subtree to a CPU worker thread. For example, suppose we have 𝑁 𝑡 

CPU worker threads, where 𝑁 𝑡 is a power of two: 2, 4, 8, etc. We choose a (non-leaf) level L of the DPF tree such that 𝑁 𝑡 = 2𝐿 . The nodes at this level are roots of 𝑁 𝑡 (perfect) binary trees, which are then evaluated in parallel by the 𝑁 𝑡 worker threads. A master thread performs the DPF evaluation (following a breadth first traversal approach) from the root down to level L. Each worker thread then takes over and completes DPF evaluation on its subtree following a similar breadth first traversal approach to obtain a subset of the 

Eval (𝑘, ·) function shares. 

AES-NI optimization. Cryptographic hardware instructions like AES-NI provide a pipelined approach enabling execution of multiple AES operations in parallel. At each level of a subtree, we batch AES calls across multiple nodes to maximize utilization of this pipeline. Once the host CPU computes the function shares i.e., Eval (𝑘, ·) ,these values are copied in chunks to the DPUs ➌. In the following, we outline how this chunking is done. 

3.3 PIR linear operations: dpXOR 

Here, we explain how data is distributed across the DPUs, and how the latter perform linear operations ( dpXOR ) to produce the subresults required for obtaining the desired DB item client-side. 

Database preloading. As previously discussed, efficiently offload-ing computations to DPUs hinges on minimizing data transfer (CPU-DPU and DPU-DPU) overhead; excessive data movement can un-dermine the benefits of in-memory processing. Consequently, the performance gains of the PIR acceleration algorithms rely on reduc-ing both the frequency and volume of data transfers between the host CPU and the DPUs. To perform PIM-based PIR evaluations, the database as well as the bit arrays, i.e., DPF secret shares evaluated using the GGM computation tree, must be in DPU MRAM memory. Because the database is typically large, frequent CPU-DPU data transfers in-curs significant overhead. To mitigate this, IM-PIR preloads the database into DPU MRAM before query processing. In our setup, the database is loaded following a linear (one-dimensional) layout, with each DPU’s MRAM accommodating a chunk/block 𝐵 𝑑 of the database items, with 𝐵 𝑑 = ⌈𝑁 /𝑃 ⌉, where 𝑃 is the number of PIM DPUs. For example, for a system with 2048 DPUs and database containing 𝑁 = 232 one byte items, we have: 𝐵 𝑑 = ⌈232 /2048 ⌉ = 221 

database items per DPU. So for 𝐷 = [𝑑 0, 𝑑 1, . . . , 𝑑 𝑁 ], the first DPU gets the DB chunk [𝑑 0, . . . , 𝑑 𝐵 𝑑 −1], the second DPU gets DB chunk 

[𝑑 𝐵 𝑑 , . . . , 𝑑 2𝐵 𝑑 −1] and so on. Each database block/chunk is then copied to a DPU. The results from the DPF evaluations in the pre-vious step are distributed across the DPUs in the same fashion as database chunks. So the first DPU receives the first 𝐵 𝑑 DPF eval-uation results: {𝐸𝑣𝑎𝑙 (𝑘, 0), . . . , 𝐸𝑣𝑎𝑙 (𝑘, 𝐵 𝑑 − 1)} , the second DPU 

{𝐸𝑣𝑎𝑙 (𝑘, 𝐵 𝑑 ), . . . , 𝐸𝑣𝑎𝑙 (𝑘, 2𝐵 𝑑 − 1)} and so on. One key consideration with this approach is the memory capacity of PIM-enabled hardware. Current UPMEM PIM-enabled servers support up to 20 UPMEM modules (expected to increase in the fu-ture). This configuration provides up to 160 GB of MRAM, which is 

> 6A perfect binary tree is one in which every level is completely filled and all leaf nodes are at the same level. Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni

sufficient to accommodate mid- to large-scale PIR databases. Larger datasets may require a minor adaptation of our "one-shot" ( i.e., single pass) database evaluation: for example, by evaluating the linear op-erations on database items in batches, copying unprocessed chunks into DPUs in each batch. Nevertheless, as PIM technology continues to evolve, the memory capacities and capabilities are expected to expand, opening new possibilities for efficient and scalable data processing. 

Inner products and XORing operations. The goal of this stage is to compute a linear combination of the database entries weighted by the query vector (represented by the function shares Eval (𝑘, ·) ) so as to obtain two subresults: 𝑟 1 and 𝑟 2 at both servers 1 and 2 respectively ➍.To obtain a subresult 𝑟 (i.e., 𝑟 1 or 𝑟 2), a server proceeds by doing: 

𝑟 = 

> 𝑁 −1

Ê

> 𝑗 =0

Eval (𝑘, 𝑗 ) · 𝐷 [ 𝑗 ]

Since the database is distributed across 𝑃 DPUs, each DPU performs only a part of the above operation to obtain a subresult 𝑠 𝑑 where 

𝑑 ∈ { 0, 𝑃 −1}. Assuming the start and end index of a DPU’s database block are respectively 𝑑𝑠𝑡𝑎𝑟𝑡 and 𝑑𝑒𝑛𝑑 , the DPU computes 𝑠 𝑑 as follows: 

𝑠 𝑑 =

> 𝑑𝑒𝑛𝑑

Ê

> 𝑗 =𝑑𝑠𝑡𝑎𝑟𝑡

Eval (𝑘, 𝑗 ) · 𝐷 [ 𝑗 ]

We exploit the PIM system’s inherent two-tiered parallelism by utilizing both multiple DPUs and multiple DPU threads, i.e., tasklets, to perform PIR operations within each DPU. 

Parallel reduction (PR). Within each DPU, the workload is further partitioned among tasklets, and a two-stage parallel reduction strat-egy is employed to perform the XORing operations on each DPU’s database chunk 𝐵 𝑑 . Parallel reduction [ 47 ] is a divide-and-conquer technique where a large dataset is processed concurrently by mul-tiple threads to derive a single result. In the first stage of parallel reduction, the MRAM-resident database chunk 𝐵 𝑑 is split among the DPU’s tasklets such that each tasklet processes 𝐵 𝑡 = ⌈𝐵 𝑑 /𝑇 ⌉

items, where 𝑇 represents the number of tasklets per DPU. Similarly, the subset of 𝐵 𝑑 Eval (𝑘, 𝑗 ) items from the DPF evaluation copied to each DPU is equally split among the DPU’s tasklets, with each obtaining 𝐵 𝑡 entries. Each tasklet 𝑇 𝑖 then computes a partial result, 

𝑡 𝑖 by XORing the relevant DB items. The DB items included in the XOR result are determined by the corresponding DPF evaluation result, which acts as a selector for the DB item: if Eval (𝑘, 𝑗 ) bit is set (1), then 𝐷 [ 𝑗 ] is included in the XORed result, otherwise 𝐷 [ 𝑗 ]

is ignored. A master tasklet (tasklet 0) waits until the 𝑇 assigned tasklets have computed their partial results, and in the second stage of parallel reduction, this master tasklet then XORs the partial results from all tasklets to obtain a final subresult 𝑠 𝑖 for DPU-i. Once computed, the subresults are copied from each DPU back to the host ➎, and aggregated to obtain the server’s subresult 𝑟 =

É𝑃 −1 

> 𝑑 =0

𝑠 𝑑 ➏. Each server’s subresult is sent back to the client who combines the subresults 𝑟 1 and 𝑟 2 ➐ to retrieve the requested DB item 𝐷 [𝑖 ] = 𝑟 1 ⊕ 𝑟 2.The end-to-end operation of IM-PIR, beginning with the client’s key/query generation and ending with result retrieval, is summarized in Algorithm 1. 

Algorithm 1 End-to-end operation of IM-PIR.  

> 1:

Global variables:  

> 2:

P: num. of DPUs  

> 3:

𝐵 𝑑 : num. of DB items per DPU  

> 4:

T: num. of DPU tasklets  

> 5:

𝐵 𝑡 : num. of DB items per tasklet  

> 6:

Client: ⊲ Executes on the client  

> 7:

procedure GENERATE AND SEND KEYS (i) ➊ 

> 8:

(𝑘 1, 𝑘 2) ← Gen (𝑖, 1) 

> 9:

Send 𝑘 1 to Server 1 and 𝑘 2 to Server 2 

> 10:

end procedure  

> 11: 12:

Host: ⊲ Executes on the host CPU of each DB server  

> 13:

function EVALUATE DPF( 𝑘 ∈ { 𝑘 1, 𝑘 2 }) ➋ 

> 14:

for 𝑗 = 0 to 𝑁 − 1 do  

> 15:

Eval (𝑘, 𝑗 ) ← R(𝑑 = 𝑙𝑜𝑔 (𝑁 ), 𝑗 ) ⊲ Uses AES-NI  

> 16:

end for  

> 17:

return v ← [ Eval (𝑘, 0), . . . , Eval (𝑘, 𝑁 − 1)]  

> 18:

end function  

> 19:

procedure SPLIT DPF( [Eval (𝑘, 0), . . . , Eval (𝑘, 𝑁 − 1)] ) ➌ 

> 20:

for 𝑖 = 0 to 𝑃 − 1 do  

> 21:

chunk i ← [ Eval (𝑘, 𝑖 ∗ 𝐵 𝑑 ), . . . , Eval (𝑘, 𝑖 ∗ 𝐵 𝑑 + 𝐵 𝑑 − 1)]  

> 22:

Copy (chunk i) to DPU i 

> 23:

end for  

> 24:

end procedure  

> 25:

DPU: ⊲ Executes on a PIM DPU of the DB server  

> 26:

𝐷 𝑑 = [𝑑 𝑑𝑠𝑡𝑎𝑟𝑡 , . . . , 𝑑 𝑑𝑒𝑛𝑑 ] ⊲ Preloaded DPU DB block  

> 27:

v = [Eval (𝑘, 𝑑𝑠𝑡𝑎𝑟𝑡 ), . . . , Eval (𝑘, 𝑑𝑒𝑛𝑑 )]  

> 28:

function TASKLET XOR( v, 𝐷 𝑑 ) ➍ ⊲ PR: stage 1  

> 29:

⊲ All tasklets execute this function on parts of the DB.  

> 30:

𝑡 𝑖 ← 0 ⊲ Tasklet’s partial result  

> 31:

𝑡𝑖𝑑 ← GET TASKLET ID() ⊲ 𝑡𝑖𝑑 ∈ { 0, . . . ,𝑇 − 1} 

> 32:

for 𝑖 = 𝑡𝑖𝑑 ∗ 𝐵 𝑡 to 𝑡𝑖𝑑 ∗ 𝐵 𝑡 + 𝐵 𝑡 − 1 do  

> 33:

if v[ 𝑗 ] = 1 then  

> 34:

𝑡 𝑖 ← 𝑡 𝑖 ⊕ 𝐷 𝑑 [ 𝑗 ] 

> 35:

end if  

> 36:

end for  

> 37:

return 𝑡 𝑖 ⊲ All 𝑡 𝑖 s will produce t = [𝑡 0, . . . , 𝑡 𝑇 −1] 

> 38:

end function  

> 39:

function MASTER XOR( t = [𝑡 0, . . . , 𝑡 𝑇 −1]) ➍ ⊲ PR: stage 2  

> 40:

𝑠 ← 0 

> 41:

for 𝑖 = 0 to 𝑇 − 1 do  

> 42:

𝑠 ← 𝑠 ⊕ t[𝑖 ] 

> 43:

end for  

> 44:

return 𝑠  

> 45:

end function  

> 46:

𝑠 = [𝑠 1, . . . , 𝑠 𝑃 −1] ← Copy (𝑠𝑢𝑏𝑟𝑒𝑠𝑢𝑙𝑡𝑠 ) from P DPUs ➎ 

> 47:

procedure AGGREGATE SUBRESULTS ([𝑠 1, . . . , 𝑠 𝑃 −1]) 

> 48:

𝑟 ← 0 

> 49:

for 𝑖 = 0 to 𝑃 − 1 do ➏ 

> 50:

𝑟 ← 𝑟 ⊕ 𝑠 𝑖  

> 51:

end for  

> 52:

Send 𝑟 ∈ { 𝑟 1, 𝑟 2 } to Client  

> 53:

end procedure  

> 54:

Client:  

> 55:

𝐷 [𝑖 ] = 𝑟 1 ⊕ 𝑟 2 ➐ ⊲ Reconstruct DB item IM-PIR : In-Memory Private Information Retrieval 1

> 2
> 3
> 3

Figure 8. Workflow for multi-query processing with IM-PIR: worker threads compute per-key DPF evaluations and add their results to a task queue. Dedicated threads assign queries, represented by Eval (𝑘, ·) function shares to specific DPU clusters for processing, and aggregate results as described in Algorithm 1. 

3.4 Batching client queries 

A PIR server often handles multiple queries simultaneously, i.e., query batching; this requires an efficient strategy to maximize query throughput. In our multi-server PIR approach, this translates to send-ing multiple keys (instead of a single one) to each DB server, and the latter handling the queries in a concurrent fashion. To support concurrent processing of multiple queries, IM-PIR partitions the host- and PIM-side computational resources, i.e., CPU and DPUs respectively, across the different queries; this is summarized in Fig-ure 8 On the host CPU side, a set of 𝑊 worker threads are created to simultaneously manage DPF evaluations for the keys ( i.e., queries) received from the client ➊. The keys are split across these worker threads which perform DPF evaluations for the received keys. On the PIM-side, the DPUs are organized into clusters of 𝑃 𝑐 DPUs, each cluster handling a single PIR query ( i.e., key). As a host-side worker thread completes DPF evaluations for a key 𝑘 𝑖 , it adds the result 

vi = [Eval (𝑘 𝑖 , 0), . . . , Eval (𝑘 𝑖 , 𝑁 − 1) to a shared task queue ➋. IM-PIR dedicates some host-side CPU threads for DPU management: these threads are responsible for fetching tasks from the task queue and scheduling DPU clusters to handle the associated queries in parallel ➌-a. The DPU clusters perform the dpXOR operations as described in Algorithm 1 ➍-➎, and the scheduling threads aggregate the partial results from the clusters following Algorithm 1 ➏. Also, queries can be handled sequentially such that all DPUs are deployed for a single query ➌-b. The choice between sequential query pro-cessing (using all DPUs) or parallel query processing on multiple smaller DPU clusters simultaneously depends on factors such as the size of the database and the number of queries. For very large databases, the sequential strategy could be preferred as this allows for in-place processing on the entire DB, rather than on chunks of the DB (if all 𝑃 𝑐 DPUs cannot accommodate the entire DB). For smaller databases where a smaller DPU cluster with 𝑃 𝑐 DPUs can accommodate the full DB, the clustered approach will be preferred. 

## 4 Implementation 

IM-PIR is implemented on UPMEM PIM, the first openly com-mercialized PIM architecture. The client-side and server-side code (≈ 2500 LoC) are implemented in C++, except for the DPU code (≈ 200 LoC) which is implemented in C. The DPF implementation use AES-128 as its pseudorandom function (PRF). On the host CPU of the PIR server, we leverage Intel AES-NI cryptographic exten-sions and advanced vector extensions (AVX) for 256-bit operations to accelerate DPF evaluation. 

## 5 Evaluation 

In this section, we describe our experimental evaluation of IM-PIR and compare its performance against traditional processor-centric PIR implementations: CPU- and GPU-based. The CPU-based PIR (our baseline) is a DPF-PIR implementation from Google Re-search [ 40 ], while the GPU-based PIR is prior work by Meta AI and Harvard [61]. We aim to answer the following questions: 

Q1 : How does IM-PIR improve PIR query latency and through-put compared to a traditional CPU-based PIR baseline? (§5.3) 

Q2 : What are the benefits of IM-PIR’s DPU clustering strategy for batch execution of queries? (§5.4) 

Q3 : How does IM-PIR compare against related work [ 61 ] on GPU-based PIR acceleration? (§5.5 ) 

5.1 Evaluation methodology 

We evaluate the performance of IM-PIR across multiple dimensions, including latency, throughput (queries per second), and scalability using a real UPMEM PIM server with a host side CPU and PIM DPUs. We consider a CPU-based multi-server PIR implementation as our baseline. Because the PIM server’s PIM-equipped DIMMs oc-cupy memory channels that could otherwise have been occupied by standard DRAM, it is unfair to run the baseline CPU PIR implemen-tation on this server, as the presence of PIM memory limits the total potential (DRAM) memory bandwidth of the server. For this reason, we run the CPU PIR baseline on a separate server without any PIM support. This "dual-server" setup for fairness is well-founded, as shown in past studies [ 45 , 58 , 66 ] which compare PIM-based so-lutions to their purely CPU-based counterparts on separate servers. The CPU PIR baseline uses a single CPU thread for each query, but leverages Intel AVX for acceleration. In our PIM-based PIR implementation, the PIR database is preloaded once into PIM MRAM memory. As such data transfer time for this data is not part of our evaluations. On the other hand, we discuss data transfer times for DPF function shares as well as DPU subresults, since these are part of every PIR query evaluation. Our experimental results include only PIR server-side evaluations, as our contribution, IM-PIR, is entirely server-side. As such, our results do not include time for key generation or final result recon-struction at the client; these are trivial low-latency operations which do not require PIM-based acceleration. Similarly, client-server com-munication latency is not included since IM-PIR has no effect on these. Since the server-side evaluations are (theoretically) identical for all the PIR database servers in a multi-server PIR setup, our results simply focus on one PIR database server. Unless otherwise stated, we report the mean over 10 runs. 

5.2 Evaluation setup UPMEM PIM platform. We evaluate IM-PIR on a UPMEM PIM enabled server equipped with 20 PIM-enabled memory modules, totaling 2560 DPUs, each operating at 350 MHz. This represents a total of 160 GB of MRAM memory. The actual memory bandwidth between each DPU and its associated MRAM bank is ≈ 700 MB/s, resulting in an aggregate memory bandwidth of ≈ 1.79 TB/s. The Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni 

PIM server has two 8-core Intel(R) Xeon(R) Silver 4110 CPUs clocked at 2.10 GHz with hyper-threading enabled; each CPU has a last-level cache of size 11 MB. The CPUs support AVX for 256 bit operations. The server equally has 256 GB of standard DRAM. We configure each DPU to run 16 tasklets concurrently, which is an acceptable number of tasklets to fully utilize the DPU pipeline (above 11 tasklets is recommended [ 46 , 83 ]). Unless stated other-wise, our experiments use a total of 2048 DPUs. 7

Traditional machine w/o PIM. This server is used to run the stan-dard CPU-based PIR design, which is our baseline PIR approach. The server is equipped with two 16-core Intel(R) Xeon(R) E5-2683 v4 CPUs clocked at 2.10 GHz with hyper-threading enabled; each CPU has a last-level cache of size 40 MB. The server has 128 GB of standard DRAM memory. 

GPU platform. We run all GPU-based experiments on an NVIDIA GeForce RTX 4090 GPU operating at 2235 MHz with a last-level cache of size 72 MB. It has a memory (VRAM) size of 24 GB and a total memory bandwidth of 1.01 TB/s. 

PIR database. To emulate the behavior of real PIR databases/use cases, we generate a PIR database where each record is a random records 32-byte (256-bit) hash. This data format is widely used across various security- and integrity-critical applications. For exam-ple, Certificate Transparency (CT) auditing [ 50 , 72 ] uses SHA-256 to store records of issued SSL/TLS certificates, allowing organiza-tions to detect fraudulent or misissued certificates [ 39 , 79 ]. Also, compromised credential verification services, such as Have I Been Pwned [ 52 ] and enterprise password managers, use SHA-256 hashes to store and compare leaked password hashes against user-submitted credentials [29, 52, 77]. 

5.3 Impact of IM-PIR on PIR query throughput and latency 

Here, we evaluate the impact of our PIM-based PIR design (using different numbers of DPUs per query) on query throughput (number of queries per second, QPS) and latency (total computation time for all queries), and compare these against a CPU-based approach (henceforth CPU-PIR). Figure 9 illustrates the results. 

Throughput/latency with varying DB sizes. In Figure 9 (a) and Figure 9 (c), we maintain a batch of 32 queries (encoded as PIR keys) and show the resulting throughputs and latencies respectively, after performing these queries to completion on the PIR server for varying DB sizes. That is, from DPF evaluation using the input keys to aggregation of DPU subresults, i.e., Algorithm 1 ➋ to ➏. For small databases ( i.e., 0.5 GB), the query throughput in IM-PIR is 

1.7× larger when compared to the CPU-based PIR baseline. While the actual throughput decreases with larger DB sizes, the overall throughput improvement with IM-PIR increases to over 3.7× for a DB size of 8 GB. The throughput improvement in IM-PIR is mainly as a result of the massively parallel in-place processing of the PIR database, in contrast to the CPU-based approach where the DB items must be moved from memory to the CPU for processing. As the DB size increases, the advantage of IM-PIR becomes more apparent since CPU-PIR suffers from extensive data movement overhead between DRAM and the CPU. We note that in this experiment, a single DPU cluster is used (see Figure 8 ➌-b), while the maximum number of threads (32) is used in CPU-PIR. As such, in IM-PIR, all the DPUs are used for each                                             

> 7It is usually easier to work with powers of 2. 10 010 110 210 3012345678Throughput (QPS) DB Size (GB) CPU-PIR IM-PIR
> (a) Throughput vs DB Size (Batch = 32)
> 10 110 210 34816 32 64 128 256 512 Throughput (QPS) Batch Size CPU-PIR IM-PIR
> (b) Throughput vs Batch Size (DB = 1 GiB)
> 10 -1 10 010 1012345678Latency (s) DB Size (GB) CPU-PIR IM-PIR
> (c) Latency vs DB Size (Batch = 32)
> 10 -2 10 -1 10 010 14816 32 64 128 256 512 Latency (s) Batch Size CPU-PIR IM-PIR
> (d) Latency vs Batch Size (DB = 1 GiB)

Figure 9. Comparison of query throughput and latency between IM-PIR and a CPU-based PIR design across different database sizes and number of queries (batch sizes). Each database record is 

32 bytes in size. The CPU version is accelerated with AES-NI and AVX instructions and has each query handled by a CPU thread. The plots are in log scale. query in the batch, meaning each query (specifically the dpXOR 

operations) is processed sequentially. This, unfortunately, leads to limited parallelism and does not showcase the full potential of IM-PIR. We defaulted to this setup so as to accommodate larger DB sizes. However, with smaller DB sizes (or larger number of DPUs), the queries’s dpXOR operations can all be handled in parallel by creating DPU clusters which hold the entire DB and can each process a query concurrently. This will lead to an even larger throughput improvement in IM-PIR with respect to CPU-PIR. We showcase the advantage of this clustering approach in §5.4. 

Take-away 2 : IM-PIR significantly improves query throughput, by up to 3.7× compared to the baseline CPU PIR design. This is due to the massively parallel in-place processing of the PIR database in IM-PIR .

From Figure 9 (c), we observe that for both IM-PIR and CPU-PIR, query latency increases linearly with database size, which is expected. However, IM-PIR scales much better (the slope is smaller) compared to CPU-PIR. As the database size increases, CPU-PIR suf-fers more cache misses as its last-level cache cannot accommodate the large DB; hence performance degrades more sharply. In contrast, IM-PIR can process the entire DB in-place, leading to much better performance. 

Speedup factor. To better quantify the performance gain of IM-PIR relative to CPU-PIR, we define the speedup factor as the ratio of CPU-PIR query latency to IM-PIR query latency. We observe that PIM achieves a speedup of ≈ 2× at 0.5 GB, which increases to over 3.7× at 8 GB. This trend suggests that larger database sizes aggravate the CPU’s memory bandwidth limitations, while DPUs, IM-PIR : In-Memory Private Information Retrieval                

> PIR approach DPF Eval CPU →DPU copy dpXOR DPU →CPU copy Aggreg.
> IM-PIR 76.45% 7.17% 16.20% 0.18% 0.00002% CPU-PIR 16.64% N/A 83.36% N/A N/A

Table 1. Average percentage contribution to overall query latency of server-side PIR execution phases for IM-PIR and CPU-PIR. despite having relatively limited computation ability, provide im-proved performance due to the capability of in-place DB processing with minimal data movement. Similarly, we note that these results are achieved while running multiple queries on a single DPU clus-ter, i.e., using all DPUs for each query. For smaller databases, e.g., 1 GB, IM-PIR has potential for even larger speedup with respect to (wrt.) CPU-PIR as queries may be processed in parallel across the DPU clusters. These results indicate multi-server PIR operations are indeed better adapted to a PIM execution model, as opposed to a CPU-centric model. 

Take-away 3 : IM-PIR provides up to 3.7× latency speedup wrt. a CPU-centric multi-server PIR design. This performance gain is mainly due to the ability to process large databases in-place via PIM, as opposed to a CPU-centric design where the relatively small last-level cache cannot hold the entire DB, leading to costly data movement between memory and CPU. 

Throughput/latency with varying batch sizes. In Figure 9 (b) and Figure 9 (d), we fix the DB size at 1 GB while varying the query batch size, and show the resulting throughputs and latencies (respec-tively) after evaluating the queries to completion on the database. As the query batch size increases, IM-PIR’s throughput remains fairly constant, but is 2.6× higher on average wrt. CPU-PIR. As explained previously, this experiment uses a single DPU cluster with all DPUs for processing each query, which explains the fairly constant throughput across batch sizes. Nevertheless, with more DPU clusters, the overall throughput is expected to increase as more queries will be processed in parallel over the DPUs (see §5.4). This means a much larger throughput improvement is expected compared to the CPU-based PIR approach. Similarly, the query latencies in IM-PIR and CPU-PIR increase linearly with batch size as more DPF evaluations and dpXOR operations are done in total. But IM-PIR has overall lower latencies due to in-place DB processing, as explained before. 

Latency breakdown for IM-PIR query execution phases. Here, we perform a breakdown of IM-PIR’s query execution time into the following phases: DPF evaluation, data transfer from CPU to DPU of function shares Eval (k, ·) , dpXOR operations on DB items, copying of subresults from DPU to CPU, and finally aggregation of these subresults on the host CPU; these phases correspond to Figure 5 (and Algorithm 1) steps ➋, ➌, ➍, ➎, and ➏, respectively. This component-wise analysis provides important insights regarding the primary performance bottlenecks in our approach. Figure 10 illustrates the results of this component-wise analysis for IM-PIR and a CPU-based PIR approach and Table 1 summarizes the average percentage contributions of each phase We observe that in CPU-PIR, the primary performance bottle-neck is dpXOR (83 .36% of total query execution time), whereas the primary performance bottleneck in IM-PIR is DPF evaluation oper-ations ( 76 .45% percent of total query execution time). In CPU-PIR, the dpXOR operations are highly constrained by the limited memory 0100 200 300 400 500 600 700 1 2 4 8 16 32 Latency (ms) Size (GB) Eval copy(cpu →pim) dpXOR copy(pim →cpu) aggregation      

> (a) Latency breakdown for IM-PIR phases
> 0500 1000 1500 2000 2500 3000 3500 124816 32 Latency (ms) Size (GB) Eval dpXOR
> (b) Latency breakdown for CPU-PIR phases

Figure 10. Latency breakdown showing cost of all server-side phas-es/steps in IM-PIR and CPU-PIR. In CPU-PIR, the memory band-width limitations make dpXOR operations on the DB the primary bottleneck. In IM-PIR, in-place DB processing significantly im-proves the memory-bound dpXOR operations, making the CPU-side DPF evaluation the primary bottleneck. 050 100 150 200 250 4 8 16 32 64 128 256 Throughput (QPS) Batch Size 1 Cluster 2 Clusters 4 Clusters 8 Clusters       

> (a) DPU Clusters: Throughput
> 00.1 0.2 0.3 0.4 0.5 0.6 0.7 4816 32 64 128 256 Latency (s) Batch Size 1 Cluster 2 Clusters 4 Clusters 8 Clusters
> (b) DPU Clusters: Latency

Figure 11. Effect of DPU clustering on query throughput and latency in IM-PIR for different query batch sizes. For a single cluster, all 2048 DPUs are used; for two clusters, each cluster has 2048 /2 =

1024 DPUs, etc . The database size is kept constant a 1 GB. bandwidth, as the entire DB needs to be processed for each query. IM-PIR addresses this memory bandwidth limitation, providing ex-tensive scaling of compute resources with memory, thus resulting in improved performance for the DB dpXOR operations (only 16 .20% 

of total query execution time). Meanwhile, the compute-intensive DPF evaluation becomes the primary bottleneck. Data copy over-head between the CPU and DPUs contributes to less than 8% of the total cost because the the DPF function shares (bit vectors) and DPU subresults are relatively lightweight. Moreover, the DB is preloaded in DPU MRAM, and thus DB copy overhead has no impact on query latency. 

Take-away 4 : In a CPU-based PIR, the dpXOR operations on the database constitute the primary performance bottleneck. However, in a PIM-based approach, the extensive parallelism and in-place 

dpXOR operations on the in-memory DB significantly accelerates the dpXOR operations. As a result, the host-side CPU-based DPF evaluation becomes the primary PIR bottleneck. 

5.4 DPU clustering 

Here, we illustrate the effect of IM-PIR’s DPU clustering approach on query throughput and latency for different query batch sizes, while maintaining the DB size at 1 GB. One cluster means a total of Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni 050 100 150 200 250 300 350 400 450 500 0 0.2 0.4 0.6 0.8 1Throughput (QPS) DB Size (GB) CPU-PIR IM-PIR GPU-PIR      

> (a) CPU vs PIM vs GPU: Throughput
> 0123456700.2 0.4 0.6 0.8 1Latency (s) DB Size (GB) CPU-PIR IM-PIR GPU-PIR
> (b) CPU vs PIM vs GPU: Latency

Figure 12. Throughput/latency comparison between IM-PIR, CPU-PIR, and a GPU-based PIR from previous work [ 61 ] on varying DB sizes. Overall, IM-PIR shows both throughput and latency improvements with respect to these processor-centric approaches. 2048 ( i.e., all) DPUs; with two clusters, the DPUs are evenly split across all clusters, resulting in 2048 /2 = 1024 DPUs per cluster, and so forth. Figure 11 illustrates the results. We observe that for a given batch size, overall query throughput increases with a larger number of DPU clusters; with up to 1.35 ×

throughput improvement with 8 DPU clusters compared to a single cluster. Conversely, the smallest number of clusters where all DPUs are used presents the lowest throughput in general. This is due to the fact that larger numbers of clusters allows for more queries to be processed in parallel. That is, once host-side CPU threads in IM-PIR perform DPF evaluations on keys and add their results (Eval (k, ·) ) to the task queue (see Figure 8), each DPU cluster can perform dpXOR operations over the entire database. This improved parallelism leads to better throughput. In the single cluster approach, each query’s dpXOR operations must be performed serially: i.e., all 

dpXOR operations from one query must be completed before the next one is processed, resulting in poorer performance. Similarly, as shown in Figure 11 (b), we have lower overall query latency for larger DPU clusters due to the improved parallelism. 

Take-away 5 : DPU clustering can improve query throughput by up to 1.35 × by enabling parallel query execution across DPU clusters, each holding a full copy of the DB, unlike the single cluster setup which processes queries serially on a DB split across all DPUs. 

5.5 Comparison with GPU-based PIR 

In this section, we aim to compare IM-PIR to a GPU-based PIR approach. The latter is based on the PIR implementation from [ 61 ]which equally uses a multi-server PIR construction based on dis-tribute point functions. The corresponding code for this work is open-source; we executed the code on a GPU for varing DB sizes. Figure 12 illustrates the results obtained. We observe that IM-PIR achieves up to 1.34 × throughput and 

1.3× latency improvement compared to the GPU-based approach described in [ 61 ] (GPU-PIR). Also, compared to the CPU-PIR, the GPU-based approach achieves up to 1.36 × throughput and 1.3×

latency improvement. Though GPUs provide higher parallelism and memory bandwidth compared to CPUs, GPUs still follow a processor-centric approach and can be bottlenecked by limited mem-ory bandwidth. On the other hand, PIM-based setup provides even more parallelism, memory bandwidth, and better scaling of its com-pute resources with memory compared to the GPU-based setup. Nevertheless, as discussed in [ 76 ], GPUs are expected to perform much better compared to DPUs on workloads where memory band-width is not the main bottleneck. 

Take-away 6 : Compared to GPUs, PIM architectures like UP-MEM’s provide more parallelism, memory bandwidth, and better scaling of their compute resources with memory, allowing for higher query throughput improvements in multi-server PIR de-signs, especially when dealing with large databases. 

## 6 Related work 

Single and multi-server PIR. Private information retrieval was first introduced in [ 17 ], which considered the multi-server model where the database is replicated across non-colluding servers. Kushilevitz and Ostrovsky [ 60 ] proposed the first single-server PIR construction based on additive homomorphic encryption, removing the reliance on non-colluding servers. Building upon these works, several subse-quent works proposed both single-server [ 2, 3, 6, 50 , 73 ] and multi-server [ 12 , 19 , 44 , 57 ] PIR schemes, providing algorithmic methods for improving both computational and communication complexity. Specifically, several of these multi-server schemes have shown that the memory-bound XOR operations on the entire database are a major performance bottleneck. 

Hardware-accelerated PIR. Several studies have proposed hardware-acceleration for both single- and multi-server PIR. 

Single-server acceleration. Melchor et al. [ 70 ] proposed the first GPU-accelerated PIR scheme to mitigate the computational over-head in a lattice-based single-server PIR scheme [ 71 ]. Maruseac 

et al. [69 ] leverage GPUs to speed up large integer multiplications and modulo products which form the basis of several single-server cryptographic algorithms. Dai et al. [18 ] use GPUs to accelerate a somewhat homomorphic encryption (SWHE)-based single-server PIR scheme [ 22 ]. Their work offloads expensive modular multipli-cations and modulus switching, which are the main bottleneck of many single-server PIR protocols, to GPUs. INSPIRE [ 67 ] proposes an in-storage (SSD) processing architecture to accelerate FHE in single-server PIR. Our work shares similarities with this work as it addresses bandwidth limitations. However, IM-PIR leverages in-memory processing/PIM (not in-storage processing) in the multi-server setting to accelerate lightweight XOR operations; the PIM architecture we use is not adapted for FHE and single-server PIR in general. 

Multi-server acceleration. Günther et al. [ 42 ] use GPUs to improve the computational costs of the XOR operations in a multi-server PIR setup. They equally introduce client-independent preprocessing (CIP) which move some server computations to an offline phase. Lam et al. [ 61 ] propose a GPU-accelerated multi-server PIR scheme for machine learning inference. Contrary to these works which leverage processor-centric com-pute architectures, our work introduces a memory-centric multi-server PIR design as a solution to memory-bound server-side opera-tions ( e.g., XORs) which, as shown by previous studies, are a major bottleneck for multi-server PIR. Our design mitigates the memory bandwidth limitations of processor-centric solutions based on GPUs and CPUs. IM-PIR : In-Memory Private Information Retrieval 

PIM-based acceleration for workloads. While our work is the first to propose PIM-based acceleration for multi-server PIR, several prior studies have showcased the advantages of PIM in accelerating data intensive workloads including graph processing [ 4, 8, 16 , 51 , 84 ], genomic analysis [ 5, 53 , 62 ], machine learning [ 34 , 36 , 80 ], and database operations [ 9, 64 , 66 ]. Recent studies [ 56 , 75 ] explored PIM-based acceleration for fully homomorphic encryption and their results showed that current PIM architectures like UPMEM are not well adapted for FHE-based algorithms. Our work leveraged the insights gained from these studies to propose a solution which mitigates the overhead of memory-bound multi-server PIR operations. 

## 7 Conclusion 

In this work, we show how the algorithmic foundations of (memory-bound) multi-server PIR computations align with the core strengths of processing-in-memory architectures, and propose IM-PIR, the first multi-server PIR design based on real PIM hardware. Our evaluation demonstrates that IM-PIR significantly improves query throughput by more than 3.7× when compared to a standard CPU-based PIR approach. To the best of our knowledge, our work repre-sents the first effort to accelerate PIR using PIM, and we believe our results mark an important step toward the broader adoption of PIM for PIR-based solutions. 

## References 

[1] Ramesh C. Agarwal and C. Sidney Burrus. 1975. Number theoretic transforms to implement fast digital convolution. Proc. IEEE 63 (1975), 550–560. https: //api.semanticscholar.org/CorpusID:23579059 

[2] Carlos Aguilar Melchor, Joris Barrier, Laurent Fousse, and Marc-Olivier Killijian. 2016. XPIR : Private Information Retrieval for Everyone. Proceedings on Privacy Enhancing Technologies avril 2016 (April 2016), 155–174. https: //doi.org/10.1515/popets-2016-0010 

[3] Ishtiyaque Ahmad, Yuntian Yang, Divyakant Agrawal, Amr El Abbadi, and Trinabh Gupta. 2021. Addra: Metadata-private voice communication over fully untrusted infrastructure. In 15th USENIX Symposium on Operating Sys-tems Design and Implementation (OSDI 21) . USENIX Association, 313–329. 

https://www.usenix.org/conference/osdi21/presentation/ahmad 

[4] Junwhan Ahn, Sungpack Hong, Sungjoo Yoo, Onur Mutlu, and Kiyoung Choi. 2015. A scalable processing-in-memory accelerator for parallel graph process-ing. In 2015 ACM/IEEE 42nd Annual International Symposium on Computer Architecture (ISCA) . 105–117. https://doi.org/10.1145/2749469.2750386 

[5] Mohammed Alser, Zülal Bingöl, Damla Senol Cali, Jeremie Kim, Saugata Ghose, Can Alkan, and Onur Mutlu. 2020. Accelerating genome analysis: A primer on an ongoing journey. IEEE Micro 40, 5 (2020), 65–75. [6] Sebastian Angel, Hao Chen, Kim Laine, and Srinath Setty. 2018. PIR with Compressed Queries and Amortized Query Processing . In 2018 IEEE Symposium on Security and Privacy (SP) . IEEE Computer Society, Los Alamitos, CA, USA, 962–979. https://doi.org/10.1109/SP.2018.00062 

[7] D. Asonov. 2004. Querying Databases Privately: A New Approach to Pri-vate Information Retrieval . Springer. https://books.google.ch/books?id= 9mvp2mhPN0QC 

[8] Lorenzo Asquini, Manos Frouzakis, Juan Gómez-Luna, Mohammad Sadrosadati, Onur Mutlu, and Francesco Silvestri. 2025. Accelerating Triangle Counting with Real Processing-in-Memory Systems. arXiv preprint arXiv:2505.04269 (2025). [9] Alexander Baumstark, Muhammad Attahir Jibril, and Kai-Uwe Sattler. 2023. Accelerating Large Table Scan using Processing-In-Memory Technology. In 

BTW 2023 . Gesellschaft für Informatik e.V., Bonn, 797–814. https://doi.org/10. 18420/BTW2023-51 

[10] Amos Beimel, Yuval Ishai, and Tal Malkin. 2004. Reducing the Servers’ Compu-tation in Private Information Retrieval: PIR with Preprocessing. J. Cryptol. 17, 2 (March 2004), 125–151. https://doi.org/10.1007/s00145-004-0134-y 

[11] Amirali Boroumand, Saugata Ghose, Youngsok Kim, Rachata Ausavarungnirun, Eric Shiu, Rahul Thakur, Daehyun Kim, Aki Kuusela, Allan Knies, Parthasarathy Ranganathan, and Onur Mutlu. 2018. Google Workloads for Consumer Devices: Mitigating Data Movement Bottlenecks. In Proceedings of the Twenty-Third International Conference on Architectural Support for Programming Languages and Operating Systems (Williamsburg, VA, USA) (ASPLOS ’18) . Association for Computing Machinery, New York, NY, USA, 316–331. https://doi.org/10. 1145/3173162.3173177 

[12] Elette Boyle, Niv Gilboa, and Yuval Ishai. 2016. Function Secret Sharing: Im-provements and Extensions. In Proceedings of the 2016 ACM SIGSAC Con-ference on Computer and Communications Security (Vienna, Austria) (CCS ’16) . Association for Computing Machinery, New York, NY, USA, 1292–1303. 

https://doi.org/10.1145/2976749.2978429 

[13] Zvika Brakerski. 2012. Fully Homomorphic Encryption without Modulus Switch-ing from Classical GapSVP. In Advances in Cryptology – CRYPTO 2012 , Rei-haneh Safavi-Naini and Ran Canetti (Eds.). Springer Berlin Heidelberg, Berlin, Heidelberg, 868–886. [14] Zvika Brakerski, Craig Gentry, and Vinod Vaikuntanathan. 2012. (Leveled) fully homomorphic encryption without bootstrapping. In Proceedings of the 3rd Inno-vations in Theoretical Computer Science Conference (Cambridge, Massachusetts) 

(ITCS ’12) . Association for Computing Machinery, New York, NY, USA, 309–325. 

https://doi.org/10.1145/2090236.2090262 

[15] Christian Cachin, Silvio Micali, and Markus Stadler. 1999. Computationally private information retrieval with polylogarithmic communication. In Advances in Cryptology—EUROCRYPT’99: International Conference on the Theory and Application of Cryptographic Techniques Prague, Czech Republic, May 2–6, 1999 Proceedings 18 . Springer, 402–414. [16] Shuangyu Cai, Boyu Tian, Huanchen Zhang, and Mingyu Gao. 2024. PimPam: Efficient Graph Pattern Matching on Real Processing-in-Memory Hardware. Proc. ACM Manag. Data 2, 3, Article 161 (May 2024), 25 pages. https://doi.org/10. 1145/3654964 

[17] B. Chor, O. Goldreich, E. Kushilevitz, and M. Sudan. 1995. Private information retrieval. In Proceedings of IEEE 36th Annual Foundations of Computer Science .41–50. https://doi.org/10.1109/SFCS.1995.492461 

[18] Wei Dai, Yarkın Doröz, and Berk Sunar. 2015. Accelerating swhe based pirs using gpus. In International Conference on Financial Cryptography and Data Security . Springer, 160–171. [19] Daniel Demmler, Amir Herzberg, and Thomas Schneider. 2014. RAID-PIR: Practical Multi-Server PIR. In Proceedings of the 6th Edition of the ACM Work-shop on Cloud Computing Security (Scottsdale, Arizona, USA) (CCSW ’14) .Association for Computing Machinery, New York, NY, USA, 45–56. https: //doi.org/10.1145/2664168.2664181 

[20] Fabrice Devaux. 2019. The true Processing In Memory accelerator. In 2019 IEEE Hot Chips 31 Symposium (HCS) . 1–24. https://doi.org/10.1109/HOTCHIPS. 2019.8875680 

[21] Safaa Diab, Amir Nassereldine, Mohammed Alser, Juan Gómez Luna, Onur Mutlu, and Izzat El Hajj. 2023. A framework for high-throughput sequence alignment using real processing-in-memory systems. Bioinformatics 39, 5 (2023), btad155. [22] Yarkın Doröz, Berk Sunar, and Ghaith Hammouri. 2014. Bandwidth efficient PIR from NTRU. In International Conference on Financial Cryptography and Data Security . Springer, 195–207. [23] Jeff Draper, Jacqueline Chame, Mary Hall, Craig Steele, Tim Barrett, Jeff LaCoss, John Granacki, Jaewook Shin, Chun Chen, Chang Woo Kang, Ihn Kim, and Gokhan Daglikoca. 2002. The architecture of the DIVA processing-in-memory chip. In Proceedings of the 16th International Conference on Supercomputing 

(New York, New York, USA) (ICS ’02) . Association for Computing Machinery, New York, NY, USA, 14–25. https://doi.org/10.1145/514191.514197 

[24] Samsung Electronics. 2021. Open Innovation Contest for AXDIMM Technology. (2021). https://semiconductor.samsung.com/emea/news-events/events/ open-innovation-contest/ Accessed: 2025-02-25. [25] Samsung Electronics. 2021. Samsung Develops Industry’s First High Bandwidth Memory with AI Processing Power. (2021). https: //news.samsung.com/global/samsung-develops-industrys-first-high-bandwidth-memory-with-ai-processing-power Accessed: 2025-02-25. [26] D.G. Elliott, W.M. Snelgrove, and M. Stumm. 1992. Computational Ram: A Memory-simd Hybrid And Its Application To Dsp. In 1992 Proceedings of the IEEE Custom Integrated Circuits Conference . 30.6.1–30.6.4. https://doi.org/10. 1109/CICC.1992.591879 

[27] Etherscan. 2024. Ethereum Blockchain Explorer. https://etherscan.io/ Ac-cessed: Feb 24, 2025. [28] Junfeng Fan and Frederik Vercauteren. 2012. Somewhat Practical Fully Ho-momorphic Encryption. Cryptology ePrint Archive, Paper 2012/144. https: //eprint.iacr.org/2012/144 https://eprint.iacr.org/2012/144 .[29] OWASP Foundation. 2024. Password Storage Cheat Sheet. https: //cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_ Sheet.html Accessed: Feb 24, 2025. [30] Birte Friesel, Marcel Lütke Dreimann, and Olaf Spinczyk. 2023. A Full-System Perspective on UPMEM Performance. In Proceedings of the 1st Workshop on Disruptive Memory Systems (Koblenz, Germany) (DIMES ’23) . Association for Computing Machinery, New York, NY, USA, 1–7. https://doi.org/10.1145/ 3609308.3625266 

[31] Craig Gentry. 2009. Fully homomorphic encryption using ideal lattices. In 

Proceedings of the Forty-First Annual ACM Symposium on Theory of Computing 

(Bethesda, MD, USA) (STOC ’09) . Association for Computing Machinery, New York, NY, USA, 169–178. https://doi.org/10.1145/1536414.1536440 

[32] Craig Gentry and Zulfikar Ramzan. 2005. Single-database private informa-tion retrieval with constant communication rate. In Proceedings of the 32nd Mpoki Mwaisela, Peterson Yuhala, Pascal Felber, and Valerio Schiavoni 

International Conference on Automata, Languages and Programming (Lisbon, Portugal) (ICALP’05) . Springer-Verlag, Berlin, Heidelberg, 803–815. https: //doi.org/10.1007/11523468_65 

[33] Christina Giannoula, Ivan Fernandez, Juan Gómez Luna, Nectarios Koziris, Georgios Goumas, and Onur Mutlu. 2022. SparseP: Towards Efficient Sparse Matrix Vector Multiplication on Real Processing-In-Memory Architectures. 

Proc. ACM Meas. Anal. Comput. Syst. 6, 1, Article 21 (Feb. 2022), 49 pages. 

https://doi.org/10.1145/3508041 

[34] Christina Giannoula, Peiming Yang, Ivan Fernandez, Jiacheng Yang, Sankeerth Durvasula, Yu Xin Li, Mohammad Sadrosadati, Juan Gomez Luna, Onur Mutlu, and Gennady Pekhimenko. 2024. PyGim : An Efficient Graph Neural Network Library for Real Processing-In-Memory Architectures. Proc. ACM Meas. Anal. Comput. Syst. 8, 3, Article 43 (Dec. 2024), 36 pages. https://doi.org/10.1145/ 3700434 

[35] Niv Gilboa and Yuval Ishai. 2014. Distributed Point Functions and Their Appli-cations. In EUROCRYPT . Springer, 640–658. https://doi.org/10.1007/978-3-642-55220-5_35 

[36] Kailash Gogineni, Sai Santosh Dayapule, Juan Gómez-Luna, Karthikeya Gogi-neni, Peng Wei, Tian Lan, Mohammad Sadrosadati, Onur Mutlu, and Guru Venkataramani. 2024. SwiftRL: Towards Efficient Reinforcement Learning on Real Processing-In-Memory Systems. In 2024 IEEE International Sympo-sium on Performance Analysis of Systems and Software (ISPASS) . 217–229. 

https://doi.org/10.1109/ISPASS61541.2024.00029 

[37] M. Gokhale, B. Holmes, and K. Iobst. 1995. Processing in memory: the Terasys massively parallel PIM array. Computer 28, 4 (1995), 23–31. https://doi.org/10. 1109/2.375174 

[38] Oded Goldreich, Shafi Goldwasser, and Silvio Micali. 1986. How to construct random functions. J. ACM 33, 4 (Aug. 1986), 792–807. https://doi.org/10. 1145/6490.6503 

[39] Google. 2024. Certificate Transparency. https://certificate.transparency.dev/ 

Accessed: Feb 24, 2025. [40] Google Research. 2025. An Implementation of Incremental Distributed Point Functions in C++. https://github.com/google/distributed_point_functions 

Accessed: June 3, 2025. [41] Shay Gueron. 2010. Intel advanced encryption standard (AES) new instructions set. Intel Corporation 128 (2010). [42] Daniel Günther, Maurice Heymann, Benny Pinkas, and Thomas Schneider. 2022. GPU-accelerated PIR with Client-Independent Preprocessing for Large-Scale Ap-plications. In 31st USENIX Security Symposium (USENIX Security 22) . USENIX Association, Boston, MA, 1759–1776. https://www.usenix.org/conference/ usenixsecurity22/presentation/gunther 

[43] Daniel Günther, Marco Holz, Benjamin Judkewitz, Helen Möllering, Benny Pinkas, Thomas Schneider, and Ajith Suresh. 2022. Poster: Privacy-Preserving Epidemiological Modeling on Mobile Graphs. In Proceedings of the 2022 ACM SIGSAC Conference on Computer and Communications Security (Los Angeles, CA, USA) (CCS ’22) . Association for Computing Machinery, New York, NY, USA, 3351–3353. https://doi.org/10.1145/3548606.3563497 

[44] Trinabh Gupta, Natacha Crooks, Whitney Mulhern, Srinath Setty, Lorenzo Alvisi, and Michael Walfish. 2016. Scalable and Private Media Consump-tion with Popcorn. In 13th USENIX Symposium on Networked Systems De-sign and Implementation (NSDI 16) . USENIX Association, Santa Clara, CA, 91–107. https://www.usenix.org/conference/nsdi16/technical-sessions/ presentation/gupta-trinabh 

[45] Juan Gómez-Luna, Izzat El Hajj, Ivan Fernandez, Christina Giannoula, Geraldo F. Oliveira, and Onur Mutlu. 2022. Benchmarking a New Paradigm: Experimental Analysis and Characterization of a Real Processing-in-Memory System. IEEE Access 10 (2022), 52565–52608. https://doi.org/10.1109/ACCESS.2022. 3174101 

[46] Juan Gómez-Luna, Izzat El Hajj, Ivan Fernandez, Christina Giannoula, Geraldo F. Oliveira, and Onur Mutlu. 2022. Benchmarking a New Paradigm: Experimental Analysis and Characterization of a Real Processing-in-Memory System. IEEE Access 10 (2022), 52565–52608. https://doi.org/10.1109/ACCESS.2022. 3174101 

[47] Mark Harris et al . 2007. Optimizing parallel reduction in CUDA. Nvidia developer technology 2, 4 (2007), 70. [48] Milad Hashemi, Khubaib, Eiman Ebrahimi, Onur Mutlu, and Yale N. Patt. 2016. Accelerating Dependent Cache Misses with an Enhanced Memory Controller. In 

2016 ACM/IEEE 43rd Annual International Symposium on Computer Architecture (ISCA) . 444–455. https://doi.org/10.1109/ISCA.2016.46 

[49] Milad Hashemi, Onur Mutlu, and Yale N. Patt. 2016. Continuous runahead: Transparent hardware acceleration for memory intensive workloads. In 2016 49th Annual IEEE/ACM International Symposium on Microarchitecture (MICRO) .1–12. https://doi.org/10.1109/MICRO.2016.7783764 

[50] Alexandra Henzinger, Matthew M. Hong, Henry Corrigan-Gibbs, Sarah Meikle-john, and Vinod Vaikuntanathan. 2023. One server for the price of two: simple and fast single-server private information retrieval. In Proceedings of the 32nd USENIX Conference on Security Symposium (Anaheim, CA, USA) (SEC ’23) .USENIX Association, USA, Article 218, 17 pages. [51] Yu Huang, Long Zheng, Pengcheng Yao, Jieshan Zhao, Xiaofei Liao, Hai Jin, and Jingling Xue. 2020. A Heterogeneous PIM Hardware-Software Co-Design for Energy-Efficient Graph Processing. In 2020 IEEE International Parallel and Distributed Processing Symposium (IPDPS) . 684–695. https://doi.org/10.1109/ IPDPS47924.2020.00076 

[52] Troy Hunt. 2024. Have I Been Pwned - Breach Database. https:// haveibeenpwned.com/ Accessed: Feb 24, 2025. [53] Rotem Ben Hur, Orian Leitersdorf, Ronny Ronen, Lidor Goldshmidt, Idan Ma-gram, Lior Kaplun, Leonid Yavitz, and Shahar Kvatinsky. 2024. Accelerating DNA Read Mapping with Digital Processing-in-Memory. ArXiv abs/2411.03832 (2024). https://api.semanticscholar.org/CorpusID:273850423 

[54] SK Hynix. 2021. SK Hynix Develops World’s First GDDR6-PIM (Processing In Memory) DRAM. (2021). https://news.skhynix.com/sk-hynix-develops-worlds-first-gddr6-pim-processing-in-memory-dram/ Accessed: 2025-02-25. [55] Bongjoon Hyun, Taehun Kim, Dongjae Lee, and Minsoo Rhu. 2024. Pathfinding Future PIM Architectures by Demystifying a Commercial PIM Technology. In 

2024 IEEE International Symposium on High-Performance Computer Architec-ture (HPCA) . 263–279. https://doi.org/10.1109/HPCA57654.2024.00029 

[56] Gilbert Jonatan, Haeyoon Cho, Hyojun Son, Xiangyu Wu, Neal Livesay, Evelio Mora, Kaustubh Shivdikar, José L. Abellán, Ajay Joshi, David Kaeli, and John Kim. 2024. Scalability Limitations of Processing-in-Memory using Real System Evaluations. Proc. ACM Meas. Anal. Comput. Syst. 8, 1, Article 5 (Feb. 2024), 28 pages. https://doi.org/10.1145/3639046 

[57] Daniel Kales, Olamide Omolola, and Sebastian Ramacher. 2019. Revisiting User Privacy for Certificate Transparency. In 2019 IEEE European Symposium on Security and Privacy (EuroS&P) . 432–447. https://doi.org/10.1109/EuroSP. 2019.00039 

[58] Hongbo Kang, Yiwei Zhao, Guy E. Blelloch, Laxman Dhulipala, Yan Gu, Charles McGuffey, and Phillip B. Gibbons. 2022. PIM-Tree: A Skew-Resistant Index for Processing-in-Memory. Proc. VLDB Endow. 16, 4 (Dec. 2022), 946–958. 

https://doi.org/10.14778/3574245.3574275 

[59] Dmitry Kogan and Henry Corrigan-Gibbs. 2021. Private Blocklist Lookups with Checklist. In 30th USENIX Security Symposium (USENIX Security 21) . USENIX Association, 875–892. https://www.usenix.org/conference/usenixsecurity21/ presentation/kogan 

[60] E. Kushilevitz and R. Ostrovsky. 1997. Replication is not needed: single database, computationally-private information retrieval. In Proceedings 38th Annual Symposium on Foundations of Computer Science . 364–373. https: //doi.org/10.1109/SFCS.1997.646125 

[61] Maximilian Lam, Jeff Johnson, Wenjie Xiong, Kiwan Maeng, Udit Gupta, Yang Li, Liangzhen Lai, Ilias Leontiadis, Minsoo Rhu, Hsien-Hsin S. Lee, Vijay Janapa Reddi, Gu-Yeon Wei, David Brooks, and Edward Suh. 2024. GPU-based Private Information Retrieval for On-Device Machine Learning Inference. In Proceed-ings of the 29th ACM International Conference on Architectural Support for Programming Languages and Operating Systems, Volume 1 (La Jolla, CA, USA) 

(ASPLOS ’24) . Association for Computing Machinery, New York, NY, USA, 197–214. https://doi.org/10.1145/3617232.3624855 

[62] Dominique Lavenier, Jean-Francois Roy, and David Furodet. 2016. DNA mapping using Processor-in-Memory architecture. In 2016 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) . 1429–1435. https://doi.org/10. 1109/BIBM.2016.7822732 

[63] Dongjae Lee, Bongjoon Hyun, Taehun Kim, and Minsoo Rhu. 2024. PIM-MMU: A Memory Management Unit for Accelerating Data Transfers in Commercial PIM Systems . In 2024 57th IEEE/ACM International Symposium on Microarchitecture (MICRO) . IEEE Computer Society, Los Alamitos, CA, USA, 627–642. https: //doi.org/10.1109/MICRO61859.2024.00053 

[64] Suhyun Lee, Chaemin Lim, Jinwoo Choi, Heelim Choi, Chan Lee, Yongjun Park, Kwanghyun Park, Hanjun Kim, and Youngsok Kim. 2024. SPID-Join: A Skew-resistant Processing-in-DIMM Join Algorithm Exploiting the Bank- and Rank-level Parallelisms of DIMMs. Proc. ACM Manag. Data 2, 6, Article 251 (Dec. 2024), 27 pages. https://doi.org/10.1145/3698827 

[65] Zhichuang Liang and Yunlei Zhao. 2022. Number Theoretic Transform and Its Ap-plications in Lattice-based Cryptosystems: A Survey. arXiv:2211.13546 [cs.CR] [66] Chaemin Lim, Suhyun Lee, Jinwoo Choi, Jounghoo Lee, Seongyeon Park, Hanjun Kim, Jinho Lee, and Youngsok Kim. 2023. Design and Analysis of a Processing-in-DIMM Join Algorithm: A Case Study with UPMEM DIMMs. Proc. ACM Manag. Data 1, 2, Article 113 (June 2023), 27 pages. https://doi.org/10.1145/ 3589258 

[67] Jilan Lin, Ling Liang, Zheng Qu, Ishtiyaque Ahmad, Liu Liu, Fengbin Tu, Trinabh Gupta, Yufei Ding, and Yuan Xie. 2022. INSPIRE: in-storage private information retrieval via protocol and architecture co-design. In Proceedings of the 49th Annual International Symposium on Computer Architecture (New York, New York) (ISCA ’22) . Association for Computing Machinery, New York, NY, USA, 102–115. https://doi.org/10.1145/3470496.3527433 

[68] Vadim Lyubashevsky, Chris Peikert, and Oded Regev. 2013. On Ideal Lattices and Learning with Errors over Rings. J. ACM 60, 6, Article 43 (nov 2013), 35 pages. 

https://doi.org/10.1145/2535925 

[69] Mihai Maruseac, Gabriel Ghinita, Ming Ouyang, and Razvan Rughinis. 2015. Hardware acceleration of Private Information Retrieval protocols using GPUs. In 2015 IEEE 26th International Conference on Application-specific Systems, Architectures and Processors (ASAP) . 120–127. https://doi.org/10.1109/ASAP. 2015.7245719 IM-PIR : In-Memory Private Information Retrieval 

[70] Carlos Aguilar Melchor, Benoit Crespin, Philippe Gaborit, Vincent Jolivet, and Pierre Rousseau. 2008. High-Speed Private Information Retrieval Computation on GPU. In 2008 Second International Conference on Emerging Security Information, Systems and Technologies . 263–272. https://doi.org/10.1109/SECURWARE. 2008.55 

[71] Carlos Aguilar Melchor and Philippe Gaborit. 2007. A lattice-based computationally-efficient private information retrieval protocol. Cryptology ePrint Archive (2007). [72] Samir Jordan Menon and David J. Wu. 2024. YPIR: high-throughput single-server PIR with silent preprocessing. In Proceedings of the 33rd USENIX Conference on Security Symposium (Philadelphia, PA, USA) (SEC ’24) . USENIX Association, USA, Article 335, 18 pages. [73] Muhammad Haris Mughees, Hao Chen, and Ling Ren. 2021. OnionPIR: Re-sponse Efficient Single-Server PIR. In Proceedings of the 2021 ACM SIGSAC Conference on Computer and Communications Security (Virtual Event, Republic of Korea) (CCS ’21) . Association for Computing Machinery, New York, NY, USA, 2292–2306. https://doi.org/10.1145/3460120.3485381 

[74] Onur Mutlu. 2018. Processing data where it makes sense in modern computing systems: Enabling in-memory computation. In 2018 7th Mediterranean Confer-ence on Embedded Computing (MECO) . 8–9. https://doi.org/10.1109/MECO. 2018.8405955 

[75] Mpoki Mwaisela, Joel Hari, Peterson Yuhala, Jämes Ménétrey, Pascal Felber, and Valerio Schiavoni. 2024. Evaluating the Potential of In-Memory Processing to Accelerate Homomorphic Encryption: Practical Experience Report. In 2024 43rd International Symposium on Reliable Distributed Systems (SRDS) . 92–103. 

https://doi.org/10.1109/SRDS64841.2024.00019 

[76] Joel Nider, Craig Mustard, Andrada Zoltan, and Alexandra Fedorova. 2020. Pro-cessing in Storage Class Memory. In 12th USENIX Workshop on Hot Topics in Storage and File Systems (HotStorage 20) . USENIX Association. https: //www.usenix.org/conference/hotstorage20/presentation/nider 

[77] National Institute of Standards and Technology (NIST). 2024. NIST Special Publication 800-63B - Digital Identity Guidelines: Authentication and Lifecycle Management. https://pages.nist.gov/800-63-3/sp800-63b.html Accessed: Feb 24, 2025. [78] D. Patterson, T. Anderson, N. Cardwell, R. Fromm, K. Keeton, C. Kozyrakis, R. Thomas, and K. Yelick. 1997. A case for intelligent RAM. IEEE Micro 17, 2 (1997), 34–44. https://doi.org/10.1109/40.592312 

[79] Chromium Project. 2024. Certificate Transparency Logs. https: //chromium.googlesource.com/chromium/src/+/master/net/docs/ certificate-transparency.md Accessed: Feb 24, 2025. [80] Steve Rhyner, Haocong Luo, Juan Gómez-Luna, Mohammad Sadrosadati, Ji-awei Jiang, Ataberk Olgun, Harshita Gupta, Ce Zhang, and Onur Mutlu. 2024. PIM-Opt: Demystifying Distributed Optimization Algorithms on a Real-World Processing-In-Memory System. In Proceedings of the 2024 International Con-ference on Parallel Architectures and Compilation Techniques (Long Beach, CA, USA) (PACT ’24) . Association for Computing Machinery, New York, NY, USA, 201–218. https://doi.org/10.1145/3656019.3676947 

[81] Ardianto Satriawan, Infall Syafalni, Rella Mareta, Isa Anshori, Wervyan Sha-lannanda, and Aleams Barra. 2023. Conceptual Review on Number Theoretic Transform and Comprehensive Review on Its Implementations. IEEE Access 11 (2023), 70288–70316. https://doi.org/10.1109/ACCESS.2023.3294446 

[82] Vivek Seshadri, Kevin Hsieh, Amirali Boroum, Donghyuk Lee, Michael A. Kozuch, Onur Mutlu, Phillip B. Gibbons, and Todd C. Mowry. 2015. Fast Bulk Bitwise AND and OR in DRAM. IEEE Computer Architecture Letters 14, 2 (2015), 127–131. https://doi.org/10.1109/LCA.2015.2434872 

[83] UPMEM. 2025. UPMEM. https://www.upmem.com/ Accessed: February 17, 2025. [84] Xueyan Wang, Jianlei Yang, Yinglin Zhao, Yingjie Qi, Meichen Liu, Xingzhou Cheng, Xiaotao Jia, Xiaoming Chen, Gang Qu, and Weisheng Zhao. 2020. TCIM: Triangle Counting Acceleration With Processing-In-MRAM Architecture. In 2020 57th ACM/IEEE Design Automation Conference (DAC) . 1–6. https://doi.org/10. 1109/DAC18072.2020.9218660 

[85] Wm. A. Wulf and Sally A. McKee. 1995. Hitting the memory wall: implications of the obvious. SIGARCH Comput. Archit. News 23, 1 (March 1995), 20–24. 

https://doi.org/10.1145/216585.216588 

[86] Dongping Zhang, Nuwan Jayasena, Alexander Lyashevsky, Joseph L. Greathouse, Lifan Xu, and Michael Ignatowski. 2014. TOP-PIM: throughput-oriented pro-grammable processing in memory. In Proceedings of the 23rd International Symposium on High-Performance Parallel and Distributed Computing (Vancou-ver, BC, Canada) (HPDC ’14) . Association for Computing Machinery, New York, NY, USA, 85–98. https://doi.org/10.1145/2600212.2600213 

[87] Qiuling Zhu, Tobias Graf, H Ekin Sumbul, Larry Pileggi, and Franz Franchetti. 2013. Accelerating sparse matrix-matrix multiplication with 3D-stacked logic-in-memory hardware. In 2013 IEEE High Performance Extreme Computing Conference (HPEC) . IEEE, 1–6.
