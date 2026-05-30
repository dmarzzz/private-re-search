---
url: https://www.freehaven.net/anonbib/papers/pets2012/paper_16.pdf
title: paper_16.pdf
fetched_at: 2026-05-30T15:54:02
content_hash: sha1:6eae9e2bd889e69e5f28c26148a6d177604083b1
extractor: jina
---

Title: paper_16.pdf

URL Source: https://www.freehaven.net/anonbib/papers/pets2012/paper_16.pdf

Published Time: Wed, 16 May 2012 21:00:33 GMT

Number of Pages: 20

Markdown Content:
# PRISM – Privacy-Preserving Search in MapReduce 

Erik-Oliver Blass 1, Roberto Di Pietro 2, Refik Molva 3, and Melek ¨ Onen 3 

> 1

Northeastern University, Boston, MA  

> 2

Universit` a di Roma Tre, Rome, Italy  

> 3

EURECOM, Sophia Antipolis, France 

Abstract. We present PRISM, a privacy-preserving scheme for word search in cloud computing. In the face of a curious cloud provider, the main challenge is to design a scheme that achieves privacy while preserving the efficiency of cloud computing. Solutions from related research, like encrypted keyword search or Private Information Retrieval (PIR), fall short of meeting real-world cloud re-quirements and are impractical. PRISM’s idea is to transform the problem of word search into a set of parallel instances of PIR on small datasets. Each PIR instance on a small dataset is efficiently solved by a node in the cloud during the “Map” phase of MapReduce. Outcomes of map computations are then aggregated during the “Reduce” phase. Due to the linearity of PRISM, the simple aggrega-tion of map results yields the final output of the word search operation. We have implemented PRISM on Hadoop MapReduce and evaluated its efficiency using real-world DNS logs. PRISM’s overhead over non-private search is only 11%. Thus, PRISM offers privacy-preserving search that meets cloud computing effi-ciency requirements. Moreover, PRISM is compatible with standard MapReduce, not requiring any change to the interface or infrastructure. 

# 1 Introduction 

Today, users take advantage of public clouds operated by large companies like Google or Amazon. Instead of setting up and maintaining their own data centers, users reduce their costs by outsourcing both storage and processing to a cloud. One prominent exam-ple allowing cloud-based storage and processing is Hadoop MapReduce [3], a variant of Google’s MapReduce system [17]. Hadoop MapReduce is widely used, and public MapReduce clouds are offered by companies such as Amazon [2, 25]. The advantages of cloud computing unfortunately come with a high cost in terms of new security and privacy exposures. Apart from classical security challenges of shared services, outsourcing of data storage and processing raises new challenges in the face of potentially malicious cloud providers. Privacy of outsourced data appears to be a major requirement in this context. Some regulations are already provisioned as to the privacy protection of outsourced governmental documents [11, 12, 18]: these regulations usu-ally aim at assuring privacy against curious clouds or against clouds with data centers located in “rogue” countries or with insufficient security guarantees; they also are de-fined to avoid data leakage in case of operational failures in the cloud. Along these lines, there is also a raising corporate concern about the privacy of sensitive business data stored in the cloud [14]. Although cloud providers thrive to meet the increased privacy demand by certifying their services [24], malicious insiders have still been identified as one of the top threats in cloud computing [15]. While encryption of outsourced data by the users seems to be a viable protection against most privacy problems, traditional data encryption does not suit the require-ments of cloud computing: the cloud not only serves as high capacity memory, but is also involved in data processing such as statistical data analysis, log analysis, index-ing, data mining, and searching [25]. However, data processing performed by the cloud would not be feasible or would be inefficient with encrypted data. Among data processing primitives, word search, i.e., verifying, whether a certain word is part of a dataset, is not only one of the most fundamental operations, but sur-prisingly also one of the most demanded applications in, e.g., MapReduce cloud com-puting [25]. Related work on search in encrypted data, e.g., Boneh et al. [6], Ogata and Kurosawa [32], falls short of meeting cloud computing privacy and performance requirements. These techniques are impractical as they are designed for centralized ex-ecution models that are incompatible with today’s highly parallel cloud architectures. In this paper, we present PRISM, a new scheme for privacy-preserving and efficient word search for MapReduce clouds. PRISM pursues two specific objectives: 1.) pri-vacy against potentially malicious cloud providers and 2.) high efficiency through the integration of security mechanisms with the operations performed in the cloud. In order to achieve efficiency, PRISM takes advantage of the inherent parallelization akin to cloud computing: the word search problem on a very large encrypted dataset is partitioned into several instances of word search in small datasets that are executed in parallel (“Map” phase). The individual word search operations performed in the cloud yield a result amenable to straightforward aggregation in the ultimate phase (“Reduce” phase) of the word search operation. The word search operation builds on a Private Information Retrieval (PIR) [29] technique which is extended in order to generate in-termediate search results that are still encrypted and that can be combined through linear operations to yield the global result of the word search over the entire dataset. Summarizing our contributions, PRISM: 

• is suited to cloud computing: PRISM is the first privacy-preserving search scheme suited to cloud computing; it brings together storage and search privacy with high per-formance by leveraging the efficiency of the MapReduce paradigm. PRISM is paral-lelizable and also allows efficient combination of individual results. Its efficiency has been evaluated through searching in DNS logs provided by an Internet Service Provider. Although PRISM’s overhead within the core Map function is large compared to non-privacy-preserving search (factor of 9), the total system overhead is only 11%. 

• preserves privacy in the face of potentially malicious cloud providers: PRISM allows carrying out these critical operations in the cloud without trusting the cloud. 

• is compatible to standard MapReduce: PRISM only requires a standard MapRe-duce interface without modifications in the underlying system. PRISM can thus be in-tegrated on any cloud that provides a standard MapReduce interface such as Amazon. 

• provides flexible search: In contrast to traditional encrypted keyword search techniques, PRISM is not limited to searching for a fixed set of predetermined key-words to be known in advance, but offers flexible search for any words. 

# 2 Problem Statement and Adversary Model 

Throughout this paper, we will use an application example to motivate our work. In-spired by recent events [31], we envision a data retention scenario. Due to regulatory matters, a small, residential Internet Service Provider (ISP) must retain logs of client accesses. Due to the sheer amount of data to retain, the ISP outsources logfiles to the cloud. Files are encrypted as they contain sensitive data. Still, e.g., law enforcement authorities will contact the ISP to search for words (strings, text, ...) in outsourced files. More concretely, assume service provider U (the cloud “user”) providing DNS ser-vices to clients. U logs each client’s access, i.e., U logs the tuple (timestamp, client ID, hostname queried). Due to the large amount of log data and cost reasons, U outsources its logfiles into a cloud. Regularly, say each day i, U creates a new logfile Li. At the end of a longer period, U wants to (or is forced to) find out, whether there was an interest in a suspicious host w. So, U checks, at which day, i.e., in which logfiles Li, word w

occurs. U queries the cloud for w, and the cloud responses with an answer R telling U

which of the Li contain(s) w.Note that U does not know in advance which word w it has to search for. This au-tomatically disqualifies protocols for predefined keyword search, such as PEKS [6] and derivatives. Also, data retention regulations require outsourced data to be fully recover-able; storing only digests of data in the cloud, e.g., hash values, is insufficient. The cloud is assumed to be untrusted, more precisely semi-honest (“honest-but-curious”). Regulatory matters imply that the cloud must not learn any information about the content it hosts and search queries performed. This implies both, the encryption of data by U before outsourcing it to the cloud and “obliviously” processing queries on encrypted data by the cloud. Before we formalize our privacy requirements, we first define the main components for a cloud word search scheme. 

Definition 1 (Cloud Word Search). Let L denote a sequence of files L := {L1, . . . , L m}

and Σ the set of possible words. Each file Li consists of a sequence of words Li := 

{w(i, 1) , w (i, 2) , . . . , w (i, |Li|)}, w (i,j ) ∈ Σ.A cloud word search scheme comprises the following algorithms: 1. KeyGen (s): using a security parameter s, this algorithm outputs a secret S.2. Encrypt (S, L): uses the secret S to encrypt the content of files Li ∈ L and outputs the set of resulting encryptions E := {EL1 , . . . , E Lm }. Here, ELi denotes the encryption of file Li.3. U pload (E): uploads E to the cloud. 4. P repareQuery (S, w ): takes S, the word w to search for, and produces a query Q.5. P rocess (E, Q ): with encryptions E and query Q, this algorithm produces result R.6. Decode (S, R, w ): taking result R, secret S, and word w, this algorithm outputs the set of indices I := {i1, . . . , i r } such that ∀i ∈ I : Li ∈ L ∧ w ∈ Li, if 

R = P rocess (E, Q ) with Q = P repareQuery (S, w ), and E = Encrypt (S, L).

The basic interaction between user U and the cloud can be summarized as follows: first, user U encrypts and uploads files. Then, U prepares a search query Q for word 

w and sends Q to the cloud. The cloud processes this query using algorithm P rocess 

and produces output R. This output is sent back to U. Using output R and another algorithm Decode , U can compute the list of files containing w. While describing PRISM’s details later in Section 4, we will show how they map to these algorithms. Note that, in a cloud setting, U executes KeyGen , Encrypt , U pload , P repareQuery ,and Decode , while the cloud executes P rocess . The idea is that algorithms KeyGen ,

Encrypt , U pload , P repareQuery , and Decode are computationally very “lightweight” for U compared to P rocess . The main computational burden lies on the cloud side. 

Privacy Requirements 

Intuitively, our application demands for two main types of privacy. The cloud (now called “adversary A”) must neither be able to infer any details about stored files nor learn details about U’s queries and results delivered back to U. This implies not only the secrecy or confidentiality of the content, but also the inability to compute statistics on the content. Informally, in our setting: 

– given E, A must not learn the content of L and must not discover whether files Li

contain a word w, e.g., multiple times; 

– given a set of queries {Qi}, A must not learn the words {wi} U is looking for and must not discover whether the same word is queried multiple times; 

– given the result Ri of a query Qi, U must not learn which file(s) contain the word corresponding to this specific query Wi.Instead, the adversary should only learn “trivial” properties, such as the total number of files, the file size, and the total number of queries. Along the same lines as traditional indistinguishability [23], A should not be able to infer any additional information from encrypted files, queries, and results. We formally define privacy for a cloud word search scheme using a game between adversary A (the cloud) and a challenger (user U). 

Definition 2 (Privacy). Let W denote a sequence of words W := {w1, . . . , w n}. The game GAME is played as follows. 1. The challenger executes KeyGen (s) to derive secret S.2. A selects a distinct pair of sequences of files and words (L0, W0) and (L1, W1),where |L 0| = |L 1|, ∀(L0 

> i

∈ L 0, L 1 

> i

∈ L 1) : |L0 

> i

| = |L1 

> i

|, and |W 0| = |W 1|.

A sends (L0, W0) and (L1, W1) to the challenger. 3. The challenger randomly selects b ∈ { 0, 1} and 

– executes Encrypt (S, Lb), i.e., the challenger computes encrypted files Eb =

{E(S, L i)|Li ∈ L b}.

– executes U pload (Eb) to send encrypted files back to A.

– executes P repareQuery (S, w ) for each w in Wb. This results in the sequence of queries Qb := {Q1, . . . , Q |W b|} that the challenger also sends to A.4. A outputs b′ ∈ { 0, 1}. The outcome of GAME is “1” iff b′ = b.A cloud word search scheme is called privacy-preserving iff 

P r (GAME (A) = 1) ≤ 12 + (s)

for all probabilistic polynomial-time adversaries A. Here, (s) is a negligible function, 

(s) < 1  

> P(s)

for every polynomial P with sufficiently large security parameter s.The specification of the (Li, Wi) in step 2. of Definition 2 reflects the fact that A can learn the total number of files, the size of each file, and the number of queries. 

Limitations: We consider semi-honest clouds. Fully malicious clouds might per-form DoS-attacks or deviate from protocol execution. Similar to “reaction attacks” [26], the cloud might return garbage to U, to observe U’s reaction (e.g., sending the same query). Although realistic, we leave such attacks for future work. Also, our privacy definition does not capture trivial privacy properties, e.g., the size of outsourced files. Mitigation strategies (e.g., padding files) might be contradictory to cloud efficiency. We conjecture that, for many applications, losing “trivial” privacy properties is acceptable. 

# 3 Background 

3.1 MapReduce 

We target a system suited for the MapReduce [3] paradigm. We will now give a con-densed overview of MapReduce, focusing on aspects necessary to understand PRISM. 

Upload. A MapReduce cloud comprises a set of “slave” node computers and a “master” computer. While U uploads files into the MapReduce cloud, each file is au-tomatically split into blocks called InputSplits . InputSplits have a fixed size SInputSplit 

which is a pre-configured system parameter. If SFile denotes the size of an uploaded file, the number of InputSplits c computes to c = SFile  

> SInputSplit

. For each InputSplit, a workload sharing algorithm selects a slave node and places the InputSplit on it. In addition to data, the MapReduce also allows U to upload “operations”, i.e., com-piled Java classes. These classes represent the implementation of three functions. 1.) Scan (INPUT SPLIT ) → [( k, v )]) , a functions that takes an InputSplit as an input, parses it, i.e., scans it and generates a set of key-value pairs [( k, v )] out of it. 2.) M ap (k, v ) → [( k′, v ′)] , a function that takes as an input a single key-value pair 

(k, v ) and outputs a set of “intermediate” key-value pairs [( k′, v ′)] .3.) Reduce ([( k′, v ′)]) → FILE , a function that takes as an input a set of intermediate key-value pairs [( k′, v ′)] and writes arbitrary output into a file. Uploaded Java classes are sent to all slave nodes storing an InputSplit. 

Map Phase. After data and implementations have been uploaded, U specifies one uploaded file and triggers MapReduce operations on that file. The first phase of oper-ation is the “Map” phase. Each slave node becomes a “mapper” node. Each mapper executes U’s Scan function on the InputSplit it stores locally. This generates a set of key-value pairs on each mapper. Furthermore, the mapper node executes U’s M ap func-tion on this generated key-value pairs to produce a set of intermediate key-value pairs. 

Reduce Phase. MapReduce starts the “Reduce” phase. Slave nodes are scheduled to become “reducers”. For each of the intermediate pairs (k′, v ′), MapReduce selects a reducer and sends (k′, v ′) to this reducer. MapReduce selects the same reducer for all pairs (k′, v ′) having the same key. Each reducer executes U’s reduce function on its set of intermediate key-value pairs and writes the output to a file. This file is sent to U.

3.2 Trapdoor Group Private Information Retrieval 

PIR allows a user to retrieve data from a server without revealing which data is re-trieved. For PRISM, we make use of a simple and efficient PIR mechanism as previ-ously suggested by Trostle and Parrish [38]. As this mechanism is just a building block for PRISM, we will only give a summary of its mode of operation and rationale. 

Overview: Matrix M is a t × t matrix of elements in ZN stored at a server. For example, N = 2 for a binary matrix. User U is only interested in receiving elements of the kth row in M, but the server must not learn k. The idea is now that U sends two “types” of values to the server. For each row that U is not interested in, he sends a value of the “first” type. For the one row that U is interested in, he sends a single value of the “second” type. To prevent the server from distinguishing between the two types of values, U blinds each value with a blinding factor b. This blinding factor can later be removed by U. The server now performs simple additions with received values and elements stored in M. The result is sent back to U who removes the blinding factor and determines the values of the row of his interest. 

Preparation: Assume U is interested in row k. U chooses a group Zp, with a prime 

p of m bits. U also chooses a random b ∈ Zp and t random values ai ∈ Zp. Therewith, 

U computes t values ei < pt·(N −1) such that: ek := 1+ ak ·N and ∀i 6 = k : ei := ai ·N. 

Finally, U computes αi := b · ei mod p and sends the αi to the server. Other values (p, m, b, {ei}, {ai}) remain secret. The server treats αi as large integers and performs the following integer operations, i.e., without any modulo. 

Server computation: Let u be the vector u := ( α1, . . . , α t). The server computes the matrix product v and sends it back to U,

v := ( β1, . . . , β t) = u · M = ( 

> t

∑

> i:=1

αi · M i, 1, . . . , 

> t

∑

> i:=1

αi · M i,t ).

Result analysis: Upon receipt, in order to “un-blind” values, U computes the t

inverse values zi := βi · b−1 mod p. Now, U can conclude that zi mod N equals the 

ith element of the kth row in M. Therewith, U has retrieved the t elements of the kth 

row of M in a privacy-preserving fashion. Note the linearity for two βi and β′ 

> i

received during different PIR runs: βi · b−1 + β′ 

> i

· b−1 = ( βi + β′

> i

) · b−1 mod p. That is, the sum of two individually un-blinded vectors equals un-blinding the sum of two received vectors v, v′. We will later use this linearity during PRISM’s reduce phase. 

Security rationale: Security and privacy of this protocol are based on the trapdoor group assumption. With only knowledge of αi, but not secret trapdoor p, it is com-putationally hard for the server to infer any information about low order bits, i.e., the modulo of z or ei, cf., Trostle and Parrish [38]. 

Discussion: Again, we stress that this particular PIR scheme is an exchangeable building block. In general, any of the “traditional” PIR techniques based on group ho-momorphic encryption [29, 34] is suited for use within PRISM. We have chosen Trostle and Parrish [38] only due to the straightforward way to implement it (Section 6). Other PIR schemes might reduce the (already small) overhead, but this is out of scope here. 

# 4 PRISM Protocol 

PRISM comprises three parts: upload of data into the cloud, the MapReduce search ,and the result analysis where the user decides whether the word has been found. We will briefly give an overview about each part. 1.) Upload. During upload, U encrypts each word (of a logfile) using symmetric encryption. Ciphertexts are stored in a file, and this file is sent to the MapReduce cloud. The cloud automatically splits large files and distributes splits ( InputSplits ) among map-per nodes. We use a standard blockcipher (AES) to perform ciphering of words. How-ever, to ensure privacy as of Definition 2, plaintext is modified before encryption using a “stateful cipher” construction. Therewith, U can still search for some word w, but the cloud cannot compute statistics about ciphertexts. 

2.) Search. Eventually, U wants to search his encrypted files for some word w.Therefore, U sends implementations of “algorithms” for the map and reduce phases to the MapReduce cloud, and the cloud executes these on uploaded data. For example, 

U sends Java “.class” files for the mappers and Java “.class” files for reducer nodes. MapReduce distributes these implementations to each mapper and reducer, respectively. PRISM’s rationale is to transform the word search problem into a set of small PIR instances. To do so, each mapper, scanning through its locally stored InputSplit, creates a binary matrix. Ciphertexts in the InputSplit are assigned to individual elements in that matrix. If a ciphertext is present in an InputSplit, its corresponding element in the matrix is set to either “0” or “1”. Using private information retrieval techniques, PRISM can extract the value of a single element in the matrix with the mapper being totally oblivious to which element is extracted. Consequently, U can specify which element to extract in a privacy-preserving way. All mappers send their obliviously extracted elements as key-value pairs to reducers. Reducers simply sum up received values and return sums to U. Therewith, neither mappers nor reducers can learn any information about which ciphertext U was interested in. 

3.) Result analysis. Finally, U receives an encrypted sum for each of the originally uploaded files from reducers. U can decrypt them and decide which of the files contain 

w. However, due to the probability of “collisions” in matrices, i.e., two different cipher-texts can be assigned to the same element, and due to ambiguities of received sums, U’s decision whether w is inside some file might be wrong. Therefore, PRISM repeats the above process in a total of q so called “rounds”. In each of the rounds, a new matrix is generated, elements are set to “1” or “0” depending on the round number, and results are returned as described. This reduces the probability of U making incorrect decisions. 

Initialization: Before the actual uploading, initially, and only once, U has to exe-cute KeyGen . In PRISM, KeyGen outputs secret S := {K, N, p }, where |K|, |N |, |p|

are specified by security parameter s. K is a symmetric key, and N and p are Trapdoor Group PIR parameters as presented in Section 3.2. 

4.1 Upload Overview. In our scenario, cloud user U continuously logs customer access and sends logfiles to the cloud. Each day, U starts using a new logfile. For simplicity, we assume that entries logged by U are simple words. Each logfile is encrypted word by word using a “stateful cipher” EK , and resulting ciphertexts are written to a file, respectively. The encrypted files are sent to the cloud. 

Definition 3 (Stateful Cipher). Given standard symmetric encryption EK with key K,e.g., AES, we extend E to a stateful cipher by adding “counters” γwi that count the history of inputs wi. Each time E encrypts wi, counter γwi is increased by one. Input: words wi                                     

> Output: ciphertexts Ciuploaded to cloud
> 1Initialize all γto 0;
> 2foreach word wido
> 3γwi:= get (wi);//from hash table
> 4γwi:= γwi+ 1 ;
> 5insert (wi, γ wi);//into hash table
> 6Ci:= EKd(wi, γ wi);
> 7upload Ci;
> 8end

Algorithm 1: “Stateful Cipher” example and upload to MapReduce. In conclusion, a stateful cipher is a cipher that knows how often it has encrypted a specific plaintext. The following presents one trivial stateful cipher construction used in PRISM to encrypt before uploading. 

Stateful Cipher Example (see Algorithm 1): For simplicity, user U uses a secret key K to derive a different key for each day d, e.g., Kd := HMAC K (d).For each day, U maintains a hash table containing the list of counters γwi in U’s local storage. At the beginning of each day, U initializes all counters to 0, i.e., γwi = 0 .Now, for each logentry wi that should be stored in the cloud, U computes γwi and increases γwi by 1. Then, U computes ciphertext Ci := EKd (wi, γ wi ). User U sends ciphertext Ci to the cloud that stores it in this day’s file. For the (AES) encryption 

EKd (wi, γ wi ), “,” denotes an unambiguous pairing of inputs. We discuss the reason for using a “stateful cipher” over using, e.g., a CBC mode of encryption in Section 5.1. Summarizing, with respect to Definition 1, Encrypt in PRISM takes K to derive a separate key Kd for each file to be encrypted. Actual encryption of each file is per-formed word by word using the stateful cipher and key Kd, so E := {EL1 , . . . , E Lm }

where ELi := {EKi (w1, γ w1 ), . . . , E Ki (w|Li|, γ w|Li| )}. U pload in PRISM can be re-garded as simply sending the encrypted files E to MapReduce. 

4.2 Search 

User U wants to search a set of files for word w within a period of time. For ease of understanding, we will restrict our description below to PRISM working on a single file specified by the user, i.e., the file of day d. With multiple files, all files will be separately (but in parallel) processed with PRISM exactly like with a single file. 

U sends map and reduce implementations of PRISM to MapReduce, and the map phase starts. In the following, we describe the PRISM algorithms for, first, the mappers and in Section 4.2 the reducers. We would like to stress that the PRISM algorithms, e.g., Java “.class” files, are not encrypted and not specially protected against a curious cloud. Even though mappers and reducers know what operations they perform, they cannot deduce any private information about stored data or details about the search. 

Overview. Before scanning through its local InputSplit, a mapper node creates a matrix with all elements initialized to “0”. PRISM’s main idea is that while the mapper scans the ciphertexts in its InputSplit, each ciphertext is assigned to one position, a certain element in the matrix by computing a hash of the ciphertext. Additionally, for each ciphertext, the mapper computes a single bit hash, and if the hash output bit is “1”, the mapper puts a “1” in the matrix at the assigned position. The idea is that user U can also compute the position in the matrix and the one bit hash output for a word w he is looking for. Roughly speaking, U now queries the mapper for the value of that bit in the matrix using private information retrieval. If the bit retrieved from the mapper differs from the bit computed by U, then U can decide, e.g., that w is not in this InputSplit. Problem is that due to the limited size of the matrix and the properties of the hash function, there might be collisions in the assignment process. That is, by chance there can be two different ciphertexts being assigned with the same position in the matrix. By chance, the bit retrieved by U can therefore be unrelated to w. This problem is amplified by the fact that U does not only receive a single bit for a single InputSplit, but a combination (the sum ) of all bits from all mappers working on InputSplits. To mitigate this problem, PRISM repeats generation and filling of matrices a total of q

rounds. Also, setting an element in a matrix to “1” depends on the round number. After 

q rounds, the probability that the information U retrieved from this mapper is unrelated to w therefore decreases, and U can finally decide whether w is inside this file. 

Definition 4 (PIR Matrix). A binary t × t matrix M with t = 2 i, i ∈ N is called a PIR matrix. The mapper uses M to implicitly perform the privacy-preserving word search. 

Definition 5 (Candidate Position). For each ciphertext Ci in an InputSplit, the can-didate position (Xi, Yi) of Ci in M is computed by (Xi||Y i) := bCic2·log 2 (t) . Here, 

b . . . c2·log 2 (t) denotes truncation after 2 · log 2 (t) bits. So, the first log 2 t bits of Ci de-termine Xi, and the second log 2 t bits determine Yi.

Definition 6 (PIR Input). If U is interested in a specific element (X , Y) in M, he computes PIR input {α1, α2, . . . , αt}, where αX := b · (1 + aX · N ) mod p, and 

∀i 6 = X , α i := b · (ai · N ) mod p. Random values b and ai are chosen as for the Trapdoor Group PIR scheme presented in Section 3.2. 

Definition 7 (Column Sum). The column sum σi of the ith column of PIR matrix M

is defined as 

σi := ∑

> M1≤j≤t,i =1

αj ,

where M1≤j≤t,i = 1 denotes the entries in the ith column of M that are set to 1.

Note that additions in this definition are integer additions. The above computation of column sums is simply a digest of the PIR technique by Trostle and Parrish [38]. In short, if a mapper computes such a column sum on a given PIR matrix M and given PIR inputs αi, it is impossible for the mapper to derive 

(X , Y). U, however, can compute whether MX ,Y = 1 , because MX ,Y = 1 iff (σY ·b−1

mod p) mod 2 = 1 holds. It is important to point out that not only a mapper can compute a candidate posi-tion for some ciphertext in its InputSplit, but also U can compute candidate positions. More precisely, as U is looking for w, he can compute E(w, 1) and candidate position 

(X ||Y ) := bE(w, 1) c2·log 2 (t) . If w has been uploaded into a particular InputSplit at least once, then this InputSplit contains at least E(w, 1) (maybe also E(w, 2) , E(w, 3) , . . . ). Therefore, it is sufficient for U to search for E(w, 1) . We will now give detailed de-scriptions of P RISM ’s Map and Reduce algorithms. Query preparation – User To start, U chooses parameters t, q ∈ N, where t de-termines the size of the PIR matrix and q the number of rounds. For day d that U

wants to search for w, he determines key Kd := HMAC K (d) and the target candidate position ( ˆX || ˆY) := bEKd (w, 1) c2· log 2 (2) . To prepare PIR, U computes t PIR Inputs 

{α1, α 2, . . . , α t} as described above. U sends all α as part of the following map algo-rithm implementation to the cloud. The above preparation of PIR Input depending on w represents P repareQuery of Definition 1 in PRISM. The algorithm’s output Q is the PIR Input. PRISM’s imple-mentation of P rocess , i.e., the cloud’s operation on the encrypted file using a query Q

comprises the following cloud-side Map as well as the whole cloud-side reduce below. 

Map Details – Cloud On the cloud side, all mappers process PRISM in parallel, each of them on its own, locally stored InputSplit of the current file. More precisely, a mapper executes Algorithm 2. Initially, the mapper generates q PIR matrices Ml, where each element is initially set to 0. We will now write Ml, X ,Y to denote an element (X , Y) in matrix Ml.The mapper node scans its local InputSplit consisting of ciphertexts {C1, . . . , C n}.For each ciphertext Ci, the mapper creates a key-value pair (i, C i). Then, the mapper fills matrices Ml, 1 ≤ l ≤ q. For pair (i, C i),

– the mapper computes candidate position (Xi||Y i) := bCic2·log 2 (t) .

– the mapper puts in PIR matrix Mj , in element Mj, Xi,Yi , a “1”, if the bit bit j := 

bh(Ci, j )c1 = 1 . Here, h denotes a cryptographic hash function and “,” again an unambiguous pairing of inputs. If bit j = 0 , element Mj, Xi,Yi remains untouched. This means that entries in Mj can flip from 0 to 1, but never from 1 back to 0. After all q PIR matrices are filled, the mapper computes for each matrix the t column sums σ1≤j≤t, 1≤l≤q based on U’s input {α1, . . . , α t}: values αk with corresponding el-ement Ml,k,j set to “1” are simply added. Finally, the mapper outputs intermediate key-value pairs (k, v ). The key comprises the name of the file of the InputSplit this mapper was working on, e.g., the file name could be day d, and the number of the column sum of Ml. The value consists of a list of the q column sums. These intermediate key-value pairs will now be input for the reducers during the Reduce phase. 

Reduce Phase – Overview Recall that there are c InputSplits and therefore c mappers. A single reducer receives from all the c mappers working on the same file all their q

column sums for the same column. The reducer simply adds these received sums and writes the result into a file which is sent back to U.

Reduce Phase – Details For all key-value pairs [( {FILE , i},{σi, 1, . . . , σ i,q })] using the same {FILE , i} as key, the MapReduce framework designates the same reducer. This reducer receives from all c different mappers working on the same file all intermediate key-value pairs with the same key. That is, a reducer receives c pairs which we rewrite as ({FILE , i }, {σi, 1,1, . . . , σ i,q, 1}), . . . , ({FILE , i }, {σi, 1,c , . . . , σ i,q,c }).

Here, for a given σi,j,k , i, 1 ≤ i ≤ t, denotes the column, j, 1 ≤ j ≤ q, denotes the round, and k, 1 ≤ k ≤ c, the InputSplit. Input: pairs (i, C i), values {α1, . . . , α t}

Output: intermediate key-value pairs (k, v ) 

> 1

for l := 1 to q do  

> 2

INITIALIZE Ml; 

> 3

end  

> 4

SCAN THROUGH INPUT SPLIT ; 

> 5

foreach pair (i, C i) do //Fill matrices  

> 6

(Xi||Y i) := bCic2·log 2 (t) ; 

> 7

for j := 1 to q do  

> 8

bit j := bh(Ci, j )c1 ; 

> 9

if bit j = 1 then  

> 10

Mj, Xi,Yi := 1 ; 

> 11

end  

> 12

end  

> 13

end  

> 14

for l := 1 to q do //q rounds  

> 15

for j := 1 to t do //Compute column sums  

> 16

σj,l := ∑  

> Ml, 1≤k≤t,j =1

αk ; 

> 17

end  

> 18

end  

> 19

for j := 1 to t do //Intermediate (k,v) pairs  

> 20

(k, v ) := ({FILE , j},{σj, 1, . . . , σ j,q }); 

> 21

OUTPUT (k, v ); 

> 22

end 

Algorithm 2: Computation of matrices M

Input: reducers’ files F ILE 

Output: decision whether w ∈ FILE  

> 1

foreach file FILE do  

> 2

for i := 1 to q do  

> 3

if bh(C, i )c1 = 1 then  

> 4

U reads sFILE ,Y,i ; 

> 5

si := ( sFILE ,Y,i · b−1

mod p) mod N 

> 6

// si = bit j , see Alg. 2 

> 7

if si = 0 then  

> 8

OUTPUT w 6 ∈ FILE ;

//Contradiction  

> 9

break ; 

> 10

end  

> 11

end  

> 12

end  

> 13

OUTPUT w ∈ FILE ; 

> 14

end 

Algorithm 3: U decides w ∈ FILE 

Using integer addition, reducer computes q “final P IR sums” sFILE ,i,j := ∑ck=1 σi,j,k ,

1 ≤ j ≤ q, and stores values {sFILE ,i, 1, . . . , s FILE ,i,q } into an output file R. To summa-rize, sFILE ,i,j represents the sum of column sums of all the mappers of one particular column i in PIR matrix j. This concludes the cloud’s P rocess algorithm in PRISM. The output file R is downloaded by U.

4.3 Result Analysis 

The only piece left is the Decode algorithm of Definition 1 which we will describe in the following. For each outsourced file (day d), user U retrieves an output file generated by reducers. Now, U analyzes retrieved files’ content to finally conclude which of the outsourced files contain w (using S). Again for ease of understanding, we restrict our description to the analysis of the result generated from PRISM on a single outsourced file called F ILE . U repeats this process with all other results from the other files accord-ingly. 

Definition 8 (Collision). Assume U is looking for w, so C := EKd (w, 1) . Similar to hash functions, a collision in PIR matrix M denotes the case of an event where the candidate position (X ′, Y′) of another ciphertext C′ 6 = C matches the candidate position ( ˆX || ˆY) = bE(w, 1) c2·log 2 (t) of w in M. That is, bCc2·log 2 (t) = bC′c2·log 2 (t) .Definition 9 (One-Collision). A one-collision is the event where in an InputSplit a ci-phertext C′ 6 = EKd (w, 1) puts a 1 into the same candidate position in M as EKd (w, 1) .

Overview: The rationale for the result analysis protocol of PRISM is to observe the candidate position of C over q rounds to mitigate the effect of one-collisions. Of particular interest will be rounds where bh(C, i )c1 = 1 .First, U un-blinds all values received from reducers. Based on the result, U distin-guishes two cases. 

Case 1.) If a reducer, reducing for a specific file F ILE , has returned the value 0 for 

C’s candidate position, then U knows for sure that all mappers have output 0 for this candidate position. Consequently, the candidate position in matrix M of each mapper is 0. Therefore, C has not been in any of the InputSplits of F ILE , and U reasons w 6 ∈

FILE . If C would have been in one InputSplit, then at least the mapper working on this InputSplit would have returned a 1 in this round. 

Definition 10 (Contradiction). Let w be the word U is looking for, and C its cipher-text. If in some round i, bh(C, i )c1 = 1 holds, and the reducer for file FILE sends U avalue of 0 then this is called a contradiction .

In case of such a contradiction, U for sure knows that w is not in file F ILE .

Case 2.) If, however, this reducer returns a value > 0, then w was in at least one InputSplit or a one-collision has occurred in at least one InputSplit. User U can neither decide w 6 ∈ FILE nor w ∈ FILE with absolute certainty. 

U ’s strategy is to keep the probability for one-collisions low and run multiple rounds 

q, such that eventually a contradiction occurs ( ⇒ U decides w 6 ∈ FILE ), or, if no con-tradiction occurs, U decides w ∈ FILE with only a small error probability Perr .

Details: U executes Algorithm 3. For each file, U is only interested in row ˆY

of matrices M, as they can refer to candidate position ( ˆX , ˆY), only. Therefore, U

keeps values {sFILE , ˆY,1, . . . , s FILE , ˆY,q } only and discards the rest. In each round where 

bh(C, i )c1 = 1 , un-blinds sFILE , ˆX ,i to get value si := ∑cj=1 bit j . If si = 0 , then we have a contradiction, and U can infer w 6 ∈ FILE . If none of the si values has been 0

after all the q rounds, then U will decide w ∈ FILE . U will be wrong with Perr .Note that, although PIR matrices are binary matrices, U sets N > c to cope with the larger possible values that sums might take due to collisions. In conclusion, U’s strategy can be summarized by: output w 6 ∈ FILE , if ∃i, s i = 0 

or output w ∈ FILE , if ∀i, s i 6 = 0 . We will compute U’s error probability Perr for the latter case and dependencies between Perr and values t and q in Section 5.2. 

Saving computation: To save some computation in PRISM, we can modify the hash-based mechanism that determines whether to put a “1” or a “0” in a certain element in M. Recall that the first 2 · log 2(t) bit of a ciphertext C are used to determine its position (element) in M. However, instead of computing an expensive hash function 

bh(Ci, j )c1 to get a single bit in round j, we can simply replace the hash and take C’s bit on position (2 · log 2(t) + j). Assuming that cipher E has good security properties (each bit of C is “1” with probability 12 ), this results in the same property as using the hash: eventually two different ciphertexts that collide in M will differ and lead to a contradiction. We use this computation reduction in our evaluation in Section 6. 5 PRISM Analysis 

5.1 Privacy 

We will now show why PRISM is privacy-preserving. The main rationale behind our proof is to show that pairs of output generated by both our stateful cipher construc-tion EK (wi, γ wi ) (Section 4.1) and the PIR-based search mechanism (Section 4.2) are computationally indistinguishable for A. Below, we assume a sufficiently large security parameter s and probabilistic polynomial time adversaries A.

Theorem 1. PRISM is a privacy-preserving cloud word search scheme assuming pseu-dorandom properties for E and the trapdoor group property of the PIR scheme. Proof (Sketch). Assume there would be an adversary A with P r (GAME (A) = 1) > 

> 12

+ (s), i.e., A has non-negligible advantage over guessing. As PRISM generates Eb

and Qb independently from each other, this would indicate that A has non-negligible advantage over guessing in determining b from either Eb or Qb (or both). We will now show with the following two lemmas that this is impossible. 

Lemma 1. In PRISM, any pair of sequences of ciphertexts (files EL and EL′ ) gen-erated by a pair of sequences of words (files L and L′) is computationally indistin-guishable for A, assuming E is a pseudorandom permutation and “,” an unambiguous pairing of inputs. Proof (Sketch). First, note that our stateful-cipher uses a different random key for each file. In a learning phase, A makes a number of queries to two stateful-cipher oracles encrypting with two different keys K0, K 1. Then, A prepares word w, submits to a challenge oracle and gets back EKb (w, γ b,w ), b ∈ { 0, 1}. A has to output b correctly with only negligible advantage over guessing. However, we now show by using the hybrid argument [28] that the distributions generated by EKi (w, γ i,w ) are computationally indistinguishable for A. That is, pairs 

EK0 (w, γ 0,w ), EK1 (w, γ 1,w ) are distinguishable with only negligible advantage over guessing). As “,” is an unambiguous pairing, we now write w′ 

> i

instead of (w, γ i,w ).Our hybrid distributions are: (1.) P RP K0 (w′

> 0

), (2.) RP K0 (w′

> 0

), (3.) RF K0 (w′

> 0

), (4.) 

RF K1 (w′

> 1

), (5.) RP K1 (w′

> 1

), and (6.) P RP K1 (w′

> 1

). “ P RP ” means pseudorandom per-mutation, “ RP ” random permutation, and “ RF ” random function. (1.) - (2.) and (5.) - (6.): by definition of pseudorandom permutation, the probability to distinguish P RP K (w′

> i

) from RP K (w′

> i

) is negligible. (2.) - (3.) and (4.) - (5.): the probability to distinguish a random permutation from a random function is negligible, cf., Section 3.6.3 in Katz and Lindell [28]. (3.) - (4.): If A observes RF K0 (w′

> 0

) = RF K1 (w′

> 1

) for a pair w′

> 0

, w ′

> 1

, then this only indicates a collision in RF K0 and RF K1 . Even if A queries the same w multiple times, output RF K0 (w, γ 0,w ) or RF K1 (w, γ1,w ) will always be different as counters increase. If RF K0 (or RF K1 ) outputs the same value twice (unlikely), this only indicates a col-lision in RF K0 (or RF K1 ). The advantage over guessing in distinguishing RF K0 (w′

> 0

)

from RF K1 (w′

> 1

) is zero. 

A’s advantage over guessing in distinguishing pairs EL, E L′ is negligible. utLemma 2. Based on the trapdoor group assumption (“ TGA” ), PRISM’s PIR-search produces computationally indistinguishable pairs of queries Qi.Proof (Sketch). Assume A submits two words w1, w 2 to an oracle. The oracle picks 

ˆb ∈ { 0, 1} and returns Qˆb := {αˆb, 1 := b · eˆb, 1 mod p, . . . , α ˆb,t := b · eˆb,t mod p},with eˆb, Xˆb

:= 1+ aXˆb ·N , ∀i 6 = Xˆb : eˆb,i := ai ·N . Here, Xˆb := bEK (wˆb, 1) clog 2 (t) , and 

ai are chosen randomly. A has to output ˆb with non-negligible advantage over guessing. However, we will now show that any pair of sequences of α values is computa-tionally indistinguishable for A. The proof is a direct implication of the security of the PIR protocol, based on TGA : for all adversaries A, P r [A(b · e1, . . . , b · et) = 

LSB (e1, . . . , e t)] = (s). That is, given b · ei, the probability that A computes low order bits of ei mod N (“ LSB ”) is negligible [38]. Assume that A can distinguish sequences Q0 = {α0,i } and Q1 = {α1,i } with non-negligible advantage. This would violate TGA as follows. First, note that besides 

α0,X0 , α 1,X1 all elements in both sequences {α0,i } and {α1,i } are created in the same way (multiplication of b with a random number). Therefore, besides α0,X0 , α 1,X1 , any pair (α, α ′) ∈ { α0,i } ∪ { α1,i } is computationally indistinguishable for A. If A can still distinguish between sequences {α0,i } and {α1,i }, then A can determine with non-ne-gligible probability X0 or X1 and thus value i with ei = 1 mod N , violating TGA . ut

5.2 Statistical Analysis 

We now discuss how U chooses parameters t and q to get a certain error probability 

Perr . This probability describes the chance that, despite w 6 ∈ FILE , U wrongly outputs 

w ∈ FILE after q rounds without a contradiction, cf., Algorithm 3. Let n be the number of ciphertexts in one InputSplit, n := SInputSplit  

> CipherBlockSize

. The total number of ciphertexts stored in the cloud is (c·n). We consider for simplicity only rounds where bh(C, i )c1 =1, cf., Algorithm 3. With h a cryptographic hash, bh(C, i )c1 = 1 in q′ ≈ q 

> 2

rounds. While inserting any ciphertext, the collision probability is Pcollision := 1 

> t2

. The probability for a one-collision is Pone −collision := Pcollision  

> 2

. If w is not inside an Input-Split, the probability that, after inserting the n ciphertexts of that InputSplit into M, the candidate position is not set to 1 is PInputSplit ,no −one −collision := (1 − Pone −collision )n.

If w 6 ∈ FILE , i.e., in none of the InputSplits, the probability that the candidate posi-tion is not set to 1 in any InputSplit is Pcontradiction := ( PInputSplit ,no −one −collision )c.

This is the probability that a contradiction occurs in a single round. If w 6 ∈ FILE , the probability that a contradiction occurs in at least one round is Pcontradiction ,q−rounds := 1 − (1 − Pcontradiction )q .

After q rounds without a contradiction, U automatically decides that w is in F ILE .In case that w 6 ∈ FILE , and no contradiction occurs in q rounds, U is therefore wrong with Perr := 1 − Pcontradiction ,q−rounds = (1 − (1 − 12·t2 )cn )q .

Given a certain file size, the size of InputSplits, and the blocksize of the symmetric cipher, U computes c and n. Therewith, U can target a false-positive probability by ap-propriately selecting t and q. We evaluate this using a real-world scenario in Section 6. 6 Evaluation 

To show its real-world feasibility, we have implemented and evaluated PRISM with the scenario described in the introduction. The source code is available for public down-load [1]. We received 16 days of log data from May 2010 from a small local Internet provider. This provider logs and retains all customers’ DNS resolve requests for possi-ble forensic analysis and intrusion detection. Log data is split into files on a daily basis. Each file contains one day of logged 3-tuples: timestamp, customer IP (anonymized by provider for regulatory matters), hostname. The scenario for our evaluation is to use PRISM to upload this data encrypted to MapReduce and perform a search for specific hostnames in a privacy-preserving manner. This is useful for, e.g., “passive DNS anal-ysis” to determine at which day certain command-and-control centers of botnets have been accessed by customer machines, cf., Bilge et al. [5]. The goal of our experiments was to analyze the computational overhead induced by PRISM’s privacy mechanism, i.e., the additional time consumed by PRISM over non-privacy-preserving MapReduce. 

6.1 Setup 

For the 16 days, the log data contains ≈ 3·10 8 log entries, i.e., ≈ 2·10 7 per file/day. The total space required by all files uploaded into MapReduce using PRISM is 27 GByte, on average 1.7 GByte per file. Our experiments have been performed on a small “cloud” comprising 1 master com-puter and 9 slaves. Computers featured a 2.5 GHz Pentium Dual Core and 4 GByte of RAM, running a standard desktop installation of Fedora 11. With this hardware config-uration, a total of 18 CPUs were available for maps and reduces. We installed Hadoop version 0.20.2 on our cloud. Being aware that tailoring MapReduce’s configuration pa-rameters can have a huge impact on performance, we use the standard, out-of-the-box configuration of Hadoop 0.20.2 without any configuration tweaks. Performance tuning is out of scope of this paper. Similarly, as the InputSplit size is recommended to be be-tween 64 MByte and 128 MByte, we chose SInputSplit = 96 MByte (InputSplits must be dividable by 3 · 32 Byte, since log entries are 3-tuples). In addition to the evaluation with 96 MByte InputSplits, we also performed a second measurement with larger InputSplits of 120 MByte. We expected a slightly improved performance of PRISM due to the fact that for the larger files the total number of Input-Splits c reduced to less than our 18 available CPUs. Therewith, no costly (re-)scheduling takes places, and mappers do not have to process 2 InputSplits sequentially. Finally, to put timing results into perspective, we implemented and measured a triv-ial, non-privacy-preserving MapReduce search called Baseline . Baseline search con-sists of an empty map phase, where mappers simply scan over InputSplits and compare each word of the InputSplit with a predetermined one, but do not generate any key-value pairs. Only at the end of the map phase, a single intermediate key-value pair per map-per (e.g., “found”) is sent to reducers. Reducers discard this key-value pair and write empty files to disk. This trivial baseline only serves in deducing the overhead implied by PRISM, not taking MapReduce specific delays due to rescheduling, speculative exe-cution of backup tasks etc. [17, 35] into account. Note that linear scanning through the entire InputSplit is mandatory, as we assume our data to be unordered and unsorted. Table 1. Parameters t, q to achieve Perr < 0.01 .File size (GByte) 0.45 1.21 1.32 1.36 1.38 1.45 1.52 1.67 1.78 1.93 2.00 2.08 2.09 2.14 2.21 2.25 

t 210 211 212 

q 100 60 80 20 

For the private information retrieval algorithm, we set m = 400 as suggested by Trostle and Parrish [38] for good security. Our Java implementation is a naive, straight-forward implementation using Java’s BigInteger without any performance optimiza-tions. As symmetric encryption cipher, we used AES with 256 Bit blocksize from the GNU Crypto Library V2.0.1 [20]. As individual DNS entries occurred way less than 

216 times per day, we reserved |γ| = 2 Bytes and truncated entries longer than 30 Byte down to the last 30 Byte. Because the size of input |wi|+|γwi | is less than E’s blocksize (using standard padding for wi), concatenation provides an unambiguous pairing. Simulating U, we computed n and c using blocksize, InputSplit size SInputSplit ,,and individual file size SFile . Assuming that U targets an error probability of Perr <

0.01 , we derived t and q. Table 1 summarizes parameters (t, q ) computed for each file individually. Compared to q, we observed that parameter t has a much higher impact on Perr , but a comparatively lower impact on computations. Therefore, we increased preferably t than q. Higher values for (t, q ) will achieve even smaller values for Perr ,but Table 1 shows the computationally “cheapest” combination of (t, q ).

6.2 Results Computational overhead at the cloud is low as indicated by Figure 1 (PRISM’s timing results). We have sorted the 16 files based on their size in an increasing order, i.e, the size of the smallest log file we received from the Internet provider was 0.45 GByte, the largest one was 2.25 GByte. PRISM’s execution time was clocked on each file 6 times, 100  200  300  400  500 

> 0.45
> 1.21
> 1.32
> 1.36
> 1.38
> 1.45
> 1.52
> 1.67
> 1.78
> 1.93
> 2.00
> 2.08
> 2.09
> 2.14
> 2.21
> 2.25
> Time (s) File Size (GByte)
> 0
> PRISM-96
> Baseline-96
> PRISM-120
> Baseline-120

Fig. 1. Wall clock timings for PRISM and Baseline, with SInputSplit = 96 and 120 MByte. respectively, and Fig. 1 shows the average. For each file, Fig. 1 shows two stacked boxes, respectively: the first one for 96 MByte and the second one for 120 MByte InputSplit size. Each of the stacked boxes comprises, first, the baseline timing and, second, the additional time required to run PRISM. To give trust into the evaluation, Fig. 1 also shows 95% confidence intervals drawn right next to each box. Timings shown in Fig. 1 are “wall clock” timings. This captures the complete time elapsed from submitting the PRISM map and reduce classes and starting the job until the end of the reduce phase. In the real-world, wall clock time reflects the time a cloud, e.g., Amazon [2], would charge a user U. In conclusion, the additional overhead over the trivial Baseline MapReduce jobs was on average 11% with a 95% confidence inter-val of ±3. The largest overhead seen was 24% over Baseline. This overhead is mostly computational overhead, as there is no difference in disk access between Baseline and PRISM and network volume increases only little by sending slightly larger values dur-ing “Reduce”. These results do not only show the feasibility of PRISM in practice, but also demonstrate the low overhead implied by PRISM over the non-privacy preserving MapReduce job. We claim that a performance optimized (not based on Java BigInteger) implementation improves performance significantly and furthermore reduces overhead. The simple increase from 96 MByte InputSplit size to 120 MByte InputSplit size has reduced wall clock times for MapReduce jobs by 9% on average (95% confidence interval of ±4). Files of size smaller than 2 GByte are split into ≤ 18 InputSplits, and both jobs, PRISM and Baseline, are processed completely in parallel. This indicates that a careful configuration of Hadoop MapReduce’s many system parameters, hand-crafted and specific to the scenario and jobs to be executed, will lead to substantial performance improvements. This also indicates that in a cloud with more CPUs than in our small setup, the increased number of CPUs will enable to configure way smaller 

InputSplits being processed in parallel. Substantially smaller InputSplits will be benefi-cial for the overall performance of PRISM or any MapReduce job. However, increasing the number of InputSplits also implies a performance penalty due to (re-)scheduling and coordination activities of the central job tracker, cf., Pavlo et al. [35], so a trade-off has to be found. MapReduce configuration optimizations are, however, out of scope. To better understand the cloud’s computational overhead, we also measured the 

computation time for a PRISM mapper . On a single CPU, execution of an isolated PRISM map function on a single InputSplit is ca. 9 times slower than Baseline (9.3 for 96 MByte and 9.1 for 120 MByte, 95% confidence interval of ±0.1). While this seems to be a lot, we remark that 1.) this map overhead is constant for an InputSplit and does not depend on or scale with the total size of the data, 2.) there is a lot of potential to improve our map implementation, 3.) this overhead is obviously amortized by other MapReduce aspects such as the Reduce phase and also disk latency, network overhead etc., and 4.) a user is charged for the total system time, i.e., the wall clock time. 

Computational overhead at the User is also low in PRISM: per file, the prepara-tion of, e.g., 212 α values for the underlying PIR scheme is barely measurable ( ≈ 200 

ms) on a PC with 2.5 GHz CPU. During result analysis, U automatically discards all received values that he is not interested in, i.e., all besides sFILE ,Y,1≤i≤q . For these q

values, a total of q Java BigInteger multiplications with modulo have to be performed. For our examples with q ≤ 100 , this was not measurable at less than 1 ms. Memory consumption for U is, on the one hand, constant; U only stores the 256 bit AES key K. On the other hand however, the cloud user U’s memory consumption scales linearly with O(Σ), i.e., the number of different words. This is due to the construction of our stateful cipher that stores counters γ in a hashtable. In our straightforward im-plementation with Java’s standard Hashtable, memory consumption of this hashtable was 548 MByte for the largest log file. While this is certainly a lot of RAM, we con-jecture this to be available on PC hardware – moreover, as there is a large potential for performance tuning with such data structures. 

Communication overhead for PRISM is dominated by the underlying PIR scheme. 

U sends, besides .class files once, only the t α values per file to the cloud. For example, with t = 2 12 and m = 400 Bit, this computes to 200 KByte per file. The response from the cloud is, for each round, t values of size m. The most expensive configuration in terms of communication in our experiments has been t = 2 10 , q = 100 ; this results in ≈ 5 MByte communication overhead. Note that communication complexity in the underlying PIR scheme by Trostle and Parrish [38] is linear in the square root of the total table size, i.e., O(t). This can be further reduced by using recursive PIR queries to O(t), for any  > 0 [29]. Those optimizations as well as amortization techniques discussed by Ostrovsky and Skeith [34] are out of scope. In conclusion, PRISM is very lightweight for a user using standard PC hardware. 

Discussion: On a larger cluster in a more professional environment (hundreds or even thousands of CPUs [25]), all files will be processed in parallel. As shown in Fig. 1, total time for the 2 GByte file is ≈ 350 s. However, already ≈ 340 s are required by MapReduce just to “scan” through the various InputSplits, see Baseline. Such ineffi-ciency with non-optimal configurations has been observed before, and our results are along the lines of Pavlo et al. [35]. Here, a “grep”-like MapReduce job on 1 TByte of data took ≈ 1, 500 s on 50 CPUs which would be ≈ 20 times faster than our Base-line. However, Pavlo et al. [35] use a slightly tuned configuration and moreover a more efficient scanning through InputSplits (100 Byte text values instead of 32 Byte binary values in our case) which is known to lead to significant performance increases [27]. 

# 7 Related Work 

Private Information Retrieval: Private Information Retrieval (and similarly oblivious transfer and oblivious RAM) has received a lot of attention [9, 13, 19, 22, 29, 33, 34, 36]. In PIR, a user retrieves a specific data from a database. The only “privacy” goal in PIR is access privacy whereby the server should not discover which data a user is interested in. Note that PIR does not ensure privacy of data in the database. PRISM, however, focuses on searching for a word and uses PIR only as a tool. 

Searchable Encryption: With searching on encrypted data techniques [6], user pri-vacy is guaranteed thanks to the encryption of the queries and the stored data. However, PRISM offers higher privacy guarantees since in existing searchable encryption solu-tions [4, 6–8, 10, 16, 21, 32, 37], the result (“found” or “not found”) originating from a query is known to the adversary; therefore as opposed to PRISM, standard searchable encryption techniques do not ensure query privacy . Moreover, existing mechanisms cannot be easily extended to leverage from a parallelized cloud setup: while in theory the search on encrypted data itself could be run in parallel on subsets of data, today’s solution do not support the combination (aggregation ) of results (as in a reduce phase). To conclude, PRISM not only ensures both storage privacy and query privacy , but also enables the aggregation of results originating from intermediate parallelized operations. 

# 8 Conclusion 

PRISM is the first privacy-preserving search scheme suited for cloud computing. That is, PRISM provides storage and query privacy while introducing only limited overhead. PRISM is specifically designed to leverage parallelism and efficiency of the MapRe-duce paradigm. Moreover, PRISM is compatible with any standard MapReduce-based cloud infrastructure (such as Amazon’s), and does not require modifications to the un-derlying system. Thanks to this compatibility, PRISM has been efficiently implemented on an experiemental cloud computing environment using Hadoop MapReduce. Besides a throughout analysis, performance of PRISM has been evaluated on that environment through search operations in DNS logs provided by an ISP. PRISM’s overhead over non-privacy-preserving search is only 11% on average, acertaining its efficiency. 

# References 

[1] PRISM source code, 2012. http://www.ccs.neu.edu/˜blass/prism.tgz .[2] Amazon. Elastic mapreduce, 2010. http://aws.amazon.com/ elasticmapreduce/ .[3] Apache. Hadoop, 2010. http://hadoop.apache.org/ .[4] S.M. Bellovin and W.R. Cheswick. Privacy-enhanced searches using encrypted Bloom filters, 2007. http://mice.cs.columbia.edu/getTechreport.php? techreportID=483 .[5] L. Bilge, E. Kirda, C. Kr¨ ugel, and M. Balduzzi. Exposure: Finding malicious domains using passive dns analysis. In Proceedings of 18th Annual Network and Distributed System Security Symposium , pages 195–211, San Diego, USA, 2011. ISBN 1891562320. [6] D. Boneh, G. DiCrescenzo, R. Ostrovsky, and G. Persiano. Public key encryption with keyword search. In Proceedings of Eurocrypt , pages 506–522, Barcelona, Spain, 2004. [7] D. Boneh, E. Kushilevitz, and R. Ostrovsky. Publickey encryption that allows pir queries. In Proceedings of Advances in Cryptology , pages 50–67, Santa Barbara, USA, 2007. ISBN 978-3-540-74142-8. [8] G. Brassard, C. Cr´ epeau, and J.-M. Robert. All-or-nothing disclosure of secrets. In Pro-ceedings of Advances in Cryptology , pages 234–238, Santa Barbara, USA, 1986. [9] C. Cachin, S. Micali, and M. Stadler. Computationally private information retrieval with polylogarithmic communication. In Proceedings of Advances in Cryptology , pages 402– 414, Prague, Czech Republic, 1999. ISBN 3-540-65889-0. [10] Y.-C. Chang and M. Mitzenmacher. Privacy preserving keyword searches on remote en-crypted data. In Proceedings of Applied Cryptography and Network Security , pages 442– 455, 2005. ISBN 3-540-26223-7. [11] Chief Information Officer’s Council. Proposed security assessment & authorization for u.s. government cloud computing, 2010. http://www.digitalgovernment.com/ media/Knowledge-Centers/asset_upload_file652_2491.pdf .[12] Chief Information Officer’s Council. Privacy recommendations for the use of cloud com-puting by federal departments and agencies, 2010. http://www.cio.gov/ .[13] B. Chor, O. Goldreich, E. Kushilevitz, and M. Sudan. Private information retrieval. In 

Proceedings of Symposium on Foundations of Computer Science , pages 41–51, Milwaukee, USA, 1995. [14] Cloud Security Alliance. Security guidance for critical areas of focus in cloud comput-ing, 2009. https://cloudsecurityalliance.org/guidance/csaguide. v2.1.pdf .[15] Cloud Security Alliance. Top cloud computing threats, 2010. https:// cloudsecurityalliance.org/topthreats/csathreats.v1.0.pdf .[16] R. Curtmola, J. Garay, S. Kamara, and R. Ostrovsky. Searchable symmetric encryption: im-proved definitions and efficient constructions. In Proceedings of Conference on Computer and Communications Security, CCS , pages 79–88, Alexandria, USA, 2006. [17] J. Dean and S. Ghemawat. Mapreduce: Simplified data processing on large clusters. In 

Proceedings of OSDI , pages 137–150, San Francisco, USA, 2004. [18] EU. Eu information management instruments, 2010. http://europa.eu/ .[19] Y. Gertner, Y. Ishai, and E. Kushilevitz. Protecting data privacy in private information retrieval. In Proceedings of Symposium on Theory of Computing , pages 151–160, Dallas, USA, 1998. ISBN 0-89791-962-9. [20] GNU. The gnu crypto project, 2011. http://www.gnu.org/software/ .[21] E.-J. Goh. Secure indexes. Cryptology ePrint Archive Report 2003/216, 2003. http: //eprint.iacr.org/2003/216 .[22] O. Goldreich and R. Ostrovsky. Software protection and simulation on oblivious ram. Jour-nal of the ACM , 45:431–473, May 1996. ISSN 0004-5411. [23] S. Goldwasser and S. Micali. Probabilistic encryption. Journal of Computer and System Sciences , 28(2):270–299, 1984. ISSN 0022-0000. [24] Google. Google apps for government, 2010. http://googleenterprise. blogspot.com/2010/07/google-apps-for-government.html .[25] Hadoop. Powered by hadoop, list of applications using hadoop mapreduce, 2011. http: //wiki.apache.org/hadoop/PoweredBy .[26] C. Hall, I. Goldberg, and B. Schneier. Reaction attacks against several public-key cryp-tosystems. In Proceedings of International Conference on Information and Communication Security , pages 2–12, Sydney, Australia, 1999. ISBN 3-540-66682-6. [27] D. Jian, B.C. Ooi, L. Shi, and S. Wu. The performance of mapreduce: An in-depth study. 

Proceedings of the VLDB Endowment , 3(1):472–483, 2010. [28] J. Katz and Y. Lindell. Introduction to modern cryptography . Chapman & Hall/CRC, 2008. ISBN 978-1-58488-551-1. [29] E. Kushilevitz and R. Ostrovsky. Replication is not needed: single database, computationally-private information retrieval. In Proceedings of Symposium on Founda-tions of Computer Science , pages 364–373, Miami Beach, USA, 1997. [30] J. Li, A. Wang, C. Wang, N. Cao, K. Ren, and W. Lou. Fuzzy keyword search over encrypted data in cloud computing. In Proceedings of INFOCOM Mini-Conference , pages 441–445, San Diego, USA, 2010. ISBN 978-1-4244-5838-7. [31] D. McCullagh. Fbi wants records kept of web sites visited, 2010. http://news.cnet. com/8301-13578_3-10448060-38.html .[32] W. Ogata and K. Kurosawa. Oblivious keyword search. Journal of Complexity – Special issue on coding and cryptography , 20:356–371, April 2004. ISSN 0885-064X. [33] R. Ostrovsky and W. Skeith. Private searching on streaming data. In Proceedings of Ad-vances in Cryptology , pages 223–240, Santa Barbara, USA, 2005. [34] R. Ostrovsky and W.E. Skeith. A survey of single-database private information retrieval: techniques and applications. In Proceedings of conference on Practice and theory in public-key cryptography , pages 393–411, Beijing, China, 2007. ISBN 978-3-540-71676-1. [35] A. Pavlo, E. Paulson, A. Rasin, D.J. Abadi, D.J. DeWitt, S. Madden, and M. Stonebraker. A comparison of approaches to large-scale data analysis. In Proceedings of International Conference on Management of Data , pages 165–178, Rhode Island, USA, 2009. [36] R. Sion and B. Carbunar. On the computational practicality of private information retrieval. In Proceedings of Network and Distributed Systems Security Symposium , pages 1–10, San Diego, USA, 2007. [37] D.X. Song, D. Wagner, and A. Perrig. Practical techniques for searches on encrypted data. In Proceedings of Symposium on Security and Privacy , pages 44–55, Berkeley, USA, 2000. [38] J. Trostle and A. Parrish. Efficient computationally private information retrieval from anonymity or trapdoor groups. In Proceedings of Conference on Information Security , pages 114–128, Boca Raton, USA, 2010. ISBN 978-3-642-18177-1.
