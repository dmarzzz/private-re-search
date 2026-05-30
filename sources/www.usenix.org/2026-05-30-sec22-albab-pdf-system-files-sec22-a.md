---
url: https://www.usenix.org/system/files/sec22-albab.pdf
title: sec22-albab.pdf
fetched_at: 2026-05-30T17:02:00
content_hash: sha1:713635ea87fe50516a032de7c67999812638d79b
extractor: jina
---

Title: sec22-albab.pdf

URL Source: https://www.usenix.org/system/files/sec22-albab.pdf

Published Time: Sat, 30 May 2026 21:01:57 GMT

Number of Pages: 19

Markdown Content:
# This paper is included in the Proceedings of the 31st USENIX Security Symposium. August 10–12, 2022 • Boston, MA, USA 

# 978-1-939133-31-1 

# Open access to the Proceedings of the 31st USENIX Security Symposium is sponsored by USENIX. Batched Differentially Private Information Retrieval 

# Kinan Dak Albab, Brown University; Rawane Issa and Mayank Varia, 

# Boston University; Kalman Graffi, Honda Research Institute Europe 

# https://www.usenix.org/conference/usenixsecurity22/presentation/albab Batched Differentially Private Information Retrieval 

# Kinan Dak Albab ∗

# Brown University 

# Rawane Issa ∗

# Boston University 

# Mayank Varia 

# Boston University 

# Kalman Graffi 

# Honda Research Institute Europe 

# Abstract 

Private Information Retrieval (PIR) allows several clients to query a database held by one or more servers, such that the contents of their queries remain private. Prior PIR schemes have achieved sublinear communication and computation by leveraging computational assumptions, federating trust among many servers, relaxing security to permit differentially pri-vate leakage, refactoring effort into an offline stage to reduce online costs, or amortizing costs over a large batch of queries. In this work, we present an efficient PIR protocol that com-bines all of the above techniques to achieve constant amor-tized communication and computation complexity in the size of the database and constant client work. We leverage differ-entially private leakage in order to provide better trade-offs between privacy and efficiency. Our protocol achieves speed-ups up to and exceeding 10x in practical settings compared to state of the art PIR protocols, and can scale to batches with hundreds of millions of queries on cheap commodity AWS machines. Our protocol builds upon a new secret shar-ing scheme that is both incremental and non-malleable, which may be of interest to a wider audience. Our protocol provides security up to abort against malicious adversaries that can corrupt all but one party. 

# 1 Introduction 

Private Information Retrieval (PIR) [29,49] is a cryptographic primitive that allows a client to retrieve a record from a public database held by a single or multiple servers without revealing the content of her query. PIR protocols have been developed for a variety of settings, including information theoretic PIR where the database is replicated across several servers [29], and computational PIR using single server [49]. The differ-ent settings of PIR are limited by various lower bounds on their computation or communication complexity. In essence, a server must “touch” every entry in the database when respond-ing to a query, or else the server learns information about the 

> ∗K. Dak Albab and R. Issa contributed equally to this work.

query, namely what the query is not! Recent PIR protocols [31, 47, 57, 68] achieve sub-linear computation and communication by relying on a prepro-cessing/offline stage that shifts the bulk of computation into off-peak hours [11], relaxing security to allow limited leak-age [72], or batching queries, mostly in the case when they originate from the same client. These advances allowed PIR to be used in a variety of applications including private pres-ence discovery [17, 67], anonymous communication and mes-saging [7, 26, 50, 63], private media and advertisement con-sumption [41, 42], certificate transparency [57], and privacy preserving route recommendation [80]. Existing sublinear PIR protocols are able to handle medium to large databases of size n and still respond to queries rea-sonably quickly. However, they scale poorly as the number of queries increase: the sub-linear cost (e.g. √n for Check-list [47]) of handling each query quickly adds up when the number of queries approaches or exceeds the size of the database into a super-linear overall cost (e.g. n√n). Effi-ciently batching such queries and amortizing their overheads is an open problem when these queries are made by different 

clients: existing work that batches such queries assumes the number of queries is much smaller than the database size [57], burdens clients with making noise queries [72], or requires clients to closely coordinate and share secrets when prepro-cessing is used [11]. This complicates efforts to deploy PIR in a variety of important applications including software updates, contact tracing, content moderation, blacklisting of fake news, software vulnerability look-up, and similar large-scale auto-mated services. We demonstrate this empirically in section 2. In this work, we introduce DP-PIR, a novel differentially private PIR protocol tuned to efficiently handle large batches of queries approaching or exceeding the size of the underlying database. Our protocol batches queries from different non-coordinating clients. DP-PIR is the first protocol to achieve constant amortized server computation and communication, as well as constant client computation and communication. While the details of our protocol are different from earlier work, at a high level our construction combines three ideas:   

> USENIX Association 31st USENIX Security Symposium 3327

1. Offloading public key operations to an offline stage so that the online stage consists only of cheap operations [31,68]. 2. High throughput batched shuffling of messages by mix-nets and secure messaging systems [53, 54, 75, 77]. 3. Relaxing the security of oblivious data structures and protocols to differentially private leakage [61]. 

DP-PIR Overview Our protocol is a batched multi-server PIR protocol optimized for queries approaching or exceeding the database size. DP-PIR is secure up to selective aborts against a dishonest majority of malicious servers, as long as at least one server is honest. Our protocol induces a per-batch overhead linear in the size of the database; this overhead is independent of the number of queries q in that batch, with a total computation complexity of O(n + q) per entire batch. When the number of queries approaches or exceeds the size of the database, the amortized computation complexity per query is constant. Furthermore, our protocol only requires constant computation, communication, and storage on the client side, regardless of amortization. We describe the details of our construction in section 5. Our protocol achieves this by relaxing the security guar-antees of PIR to differential privacy (DP) [35]. Unlike tradi-tional PIR protocols, servers in DP-PIR learn a noised dif-ferentially private histogram of the queries made in a batch. Clients secret share their queries and communicate them to the servers, which are organized in a chain similar to a mixnet. Our servers take turns shuffling these queries and injecting generated noise queries similar to Vuvuzela [77]. The last server reconstructs the queries (both real and noise) revealing a noisy histogram, and looks them up in the database. The servers similarly secret share and de-shuffle responses, while removing responses corresponding to their noise, and then send them to their respective clients for final reconstruction. The noise queries are generated from a particular distribution to ensure that the revealed histogram is (ε, δ)-differentially private, so that the smaller ε and δ get, the more noise queries need to be added. The distribution can be configured to pro-vide privacy at the level of a single query or all queries made by the same client in a single batch or over a period of time. The number of these noise queries is linear in n and 1 

> ε

and independent of the number of queries in a batch. The noise does not affect the accuracy or correctness of any client’s output. Section 3 describes our threat model and provides an interpretation of what this differentially oblivious [23] access pattern privacy means (as compared to traditional PIR). Our protocol offloads all expensive public key operations to a similarly amortizable offline preprocessing stage. This stage produces correlated secret material that our protocol then uses online. Our online stage uses only a cheap information-theoretic secret sharing scheme, consisting solely of a few field operations, which modern CPUs can execute in a hand-ful of cycles. The security of our protocol requires that this secret sharing scheme, which we define in section 4, is both incremental and non-malleable. Finally, section 6 describes how our protocol can be parallelized over additional machines to exhibit linear improvements in latency and throughput. 

Our Contribution We make three main contributions: 1. We introduce a novel PIR protocol that achieves con-stant amortized server complexity with constant client com-putation and communication, including both its offline and online stage, when the number of queries is similar to or larger than the size of the database, even when the queries are made by different clients. Our offline stage performs public key op-erations linear in the database and queries size, and the online stage consists exclusively of cheap arithmetic operations. 2. We achieve a crypto-free online stage via a novel secret sharing scheme that is both incremental and non-malleable, based only on modular arithmetic for both sharing and re-construction. To our knowledge, this is the first information theoretic scheme that exhibits both properties combined. This scheme may be of independent interest in scenarios involv-ing Mixnets, (Distributed) ORAMs, and other shuffling and oblivious data structures. 3. We implement this protocol and demonstrate its perfor-mance and scaling to loads with hundreds of millions queries, while achieving throughput several fold higher than existing state of the art protocols. The experiments identify a criterion describing application settings where our protocol is most effective compared to existing protocols, based on the ratio of the number of queries over the database size. 

# 2 Motivation 

Private Information Retrieval is a powerful primitive that con-ceptually applies to a wide range of privacy preserving appli-cations. Existing PIR protocols are well suited for applications with medium to large databases and small or infrequent num-ber of queries [7,41,66,80]. However, they are impractical for a large class of applications with a large number of queries. 

Motivating example One example that we consider through-out this work is checking for software updates on mobile app stores. The Google Play and iOS app stores contain an es-timated 2.56 and 1.85 million applications each [44], and the number of active Android and iOS devices exceed 3 and 1.65 billion, respectively [32]. These devices perform periodic background checks to ensure that their installed applications are up to date. Currently, these checks are done without pri-vacy: the app store knows all applications installed on a device, and can perform checks to determine if they are up-to-date quickly. However, the installed applications on one’s device constitute sensitive information. They can reveal information about the user’s activity (e.g. which bank they use), or whether the device has applications with known exploits. It is desirable to hide the sensitive application information from the app store as well as potential attackers. A device can send a PIR query for each application installed, and the servers can privately respond with the most up-to-date version   

> 3328 31st USENIX Security Symposium USENIX Association

label of each application. If the installed application is out of date, the device can then download the updated application via some anonymous channel, such as Tor. However, unlike DP-PIR, existing PIR protocols cannot scale to such loads, where the number of devices is about 1000x larger than the size of the database, each with tens of applications installed, given how quickly the sub-linear overheads per query add up. We demonstrate this empirically with three state of the art PIR protocols: Checklist [47], DPF [18], and SealPIR [6]. 

Additional Applications We believe that a large class of applications demonstrate similar properties ideal for DP-PIR. In privacy-preserving automated exposure notification for contact tracing [22, 73, 74], the number of recent cases in a city or region (i.e. the size of the database) is far smaller than the total population of that area (i.e. the number of queries). Similarly, identifying misinformation in end-to-end encrypted messaging systems [48] usually involves a denylist far smaller than the total number of messages exchanged in the system within a reasonable batching time window. Our protocol relies on having two or more non-colluding parties that together constitute the service provider. This is a common assumption used by many other PIR protocols. Se-cure multiparty computation (MPC) has been applied in many real world applications over the last decade. This includes services federated over somewhat-independent subdivisions within the same large organization [1, 71], or additional par-ties that volunteer to participate to promote common social good [30, 69]. A third category, which we believe is most suited for the app store example, involves providers actively seeking out third parties to federate their services [13, 52] under contractual agreements for privacy or compliance rea-sons, usually in exchange for financial or reputation incentives. This has spurred various startups [64, 65] that provide their participation in secure multiparty computations as a service. We believe that the differential privacy guarantees of DP-PIR suffice for applications where the primary focus is pro-tecting the privacy of any given client, but not overall trends or patterns. Such as applications where it is also desirable for the (approximate) overall query distribution to be publicly revealed, e.g. an app store that displays download counts or a private exposure notification service that also identifies infec-tion hotspots. DP-PIR is ideal for such applications, since it reveals a noised version of this distribution, without having to use an additional private heavy hitters protocol [14]. In practice, we emphasize that our relaxed DP guarantees should be viewed as an improvement over the insecure status-quo, rather than a replacement for PIR protocols that have stronger guarantees but impractical overheads in our target settings. 

Comparison to Existing PIR Protocols Private Informa-tion Retrieval (PIR) has been been extensively studied in a variety of settings. Information theoretic PIR replicates the database over several non-colluding servers [10], while com-putational PIR traditionally uses a single database and relies Protocol Computation Communication Online Offline Online Offline BIM04 [11] n0.55 − n0.55 −

CK20 [31] √n n λ2 log n √n

Checklist [47] √n n λ log n √n

Naive † n - n/q∗ -PSIR [68] † q∗n n log c n n/q

CK20 [31] † q∗√n n √n √n/q∗

BIM04 [11] ‡§ qn w 

> 3

− n 13 /q −

LG15 [57] ‡¶ q0.8n − √n −

This work ‡ ‖ cε,δn + q cε,δn + q 1 1†: support batching of queries made by the same client. ‡: supports batching of queries made by different clients. §: amortizes to n w 

> 3

, w ≥ 2 is the matrix mult. exponent. ¶: up to q = √n.

‖: amortizes to a constant when q ∼ n.Table 1: Computation and communication complexity of var-ious existing PIR protocols. Here, n is the database size, q∗

and q are the number of queries made by a single or differ-ent clients. For protocols that support batching, computation complexity represents the total complexity to handle a batch. Communication is always per query on cryptographic hardness assumptions [20, 28, 55]. Naive PIR protocols require a linear amount of computation and communication (e.g. sending the entire database over to the client), and several settings have close-to-linear lower bounds on either computation or communication [56]. Modern PIR protocols commonly introduce an offline pre-processing stage, which either encodes the database for faster online processing using replication [11, 15, 31, 47] and coding theory [19,21,43,68], performs a linear amount of offline work per client to make the online stage sub-linear [21, 31, 47, 47], or performs expensive public key operations so that the on-line stage only consists of cheaper ones [31, 47, 68]. Other protocols rely on homomorphic primitives during online pro-cessing [3, 6, 79]. Finally, some protocols allow batching queries to amortize costs. When combined with preprocessing, batching is only supported for queries originating from the same client [31, 47, 68], or ones that share secret state [11]. Batching queries from different clients without preprocessing is possible [45] but has limitations. Earlier work induces a sublinear (but non constant) amortized computation complexity [11, 57]. Our work amortizes the computation costs of queries made by different queries down to a constant, while also requiring constant client work. In section 8, we discuss ε-PIR [72] which also amortizes such queries but burdens clients with generating the noise queries required for differential privacy. 

Experiment Setup Our experiments measure the server(s) time needed to process a complete set of queries with ε = 0.1and δ = 10 −6. While the trends shown in these results are intrinsic properties of our protocol design, the exact numbers        

> USENIX Association 31st USENIX Security Symposium 3329 10 410 510 610 710 810 9
> Queries
> 10 0
> 10 2
> 10 4
> Completion Time (sec)
> Checklist
> DP-PIR

Figure 1: Checklist and DP-PIR Total completion time (y-axis, logscale) for varying number of queries (x-axis, logscale) against a 2.5M database   

> 10 610 710 8
> Database size
> 0
> 1
> 2
> 3
> 4
> 5
> Queries/Database size  1x
> 2x
> 5x
> 10x

Figure 2: The ratios of queries/database (y-axis) after which DP-PIR outperforms Checklist by the indicated x factor for different database sizes (x-axis, logscale) depend on the setup and protocol parameters. Section 7 dis-cusses our setup and the effects of these parameters in detail. 

Checklist Figure 1 shows the server computation time of Checklist and DP-PIR when processing different number of queries against a database with n = 2.5M elements. Our pro-tocol has constant performance initially, which starts to in-crease with the number of queries q as they exceed 10M. In more detail, the computation time of DP-PIR is proportional to the total count of noise and real queries cε,δn + q, where 

c0.1,10 −6 = 276 . Therefore, the cost induced by q is negligible compared to cε,δn until q becomes relatively significant. On the other hand, Checklist scales linearly with the num-ber of queries throughout, as its computation time is propor-tional to q√n. When the number of queries is small, this cost is far smaller than the initial overhead of our system. As q

approaches n, both systems start getting comparable perfor-mance. DP-PIR achieves identical performance to Checklist at q = 1.9M (slightly below 45 the size of the database), and outperforms Checklist for more queries. Our speedup over Checklist grows with the ratio qn , approaching a maximum speedup determined by √n when the ratio approaches ∞. For a database with 2.5M elements, our experiments demonstrate that we outperform Checklist by at least 2x, 5x, and 10x after the ratio exceeds 1.5, 3.9 and 8.1 respectively. We note that the largest data-point in the two figures are extrapolated. The ratio required for achieving a particular speedup is not identical for all database sizes. As shown in Figure 2, DP-PIR prefers larger databases: the larger the database, the smaller the ratio required by DP-PIR to achieve a particular speedup, and the larger the maximum speedup that DP-PIR can achieve as q → ∞.We extrapolate from our empirical results to three pos-sible scenarios for our Google Play store example, where the database contains roughly 2.5M elements with 3B active users, with the same setup and parameters as above. First, we assume each user makes exactly a single query (corre-sponding to a single app on their phone) resulting in a batch of size q = 3B, and qn = 1200 . In the second scenario, we assume each user checks the updates for all apps on their phone (e.g. say at most 100 apps), but only configure our system to provide DP guarantees only at the level of a single query (i.e. event-DP). In the last scenario, each user similarly makes 100 queries, but we configure our system to provide user-level DP guarantees protecting all the queries of the same user (i.e. user-DP), which results in adding 100 times the amount of noise. Our estimates indicate that our protocol will exhibit speedups of 161 x, 180 x, and 161 x over checklist in these scenarios respectively. We discuss the different DP configurations in section 3. We exhibit similar trends with larger speedups given even less queries over SealPIR [6] and DPF [18], as shown in appendix A. 

# 3 Protocol Overview 

Our protocol consists of c1, ..., cd clients and s1, ..., sm servers. We designate s1 and sm as a special frontend and backend 

server respectively. We assume that every server si has a public encryption key pk i known to all servers and clients, with associated secret key sk i. Every server has a copy of the underlying database T = K → (V, Σ) mapping keys to values and signatures, such that T [k] = ( v, σ), where σ is a 

(m, m)−threshold signature over (k, v) by the m servers. The signatures are only needed for integrity and do not affect the privacy of clients; they allow clients to verify that the responses they received correspond to the correct T agreed upon by the servers, and can be omitted when the backend is assumed to be semi-honest. We refer to the query made by client ci by qi, and its associated response by ri = ( vi, σi).

# 3.1 Setting 

Our protocol is easiest to understand in the case of a sin-gle epoch consisting of an input-independent offline stage followed by an online stage. The client state, created in the offline stage and consumed in the online one, consists exclu-sively of random elements. Clients can store the seed used to produce these elements to achieve constant storage relative to   

> 3330 31st USENIX Security Symposium USENIX Association

the number of queries and number of servers. A client need only submit her secrets to the service during the offline stage, and can immediately leave the protocol afterwards. The client can reconnect at any later time to make a query without any further coordination. The offline stage is more computationally expensive than the online one, since it performs a linear number of public key operations overall. We suggest that the offline stage be carried out during off-peak hours (e.g. overnight), when utilization is low. Furthermore, both our stages are embarrassingly par-allel in the resources of each party. It may be reasonable to run the offline stage with more resources, if these resources are cheaper to acquire overnight (e.g. spot instances). Our offline stage is similar to Vuvuzela [77], which exhibits good throughput. However, the linear number of public key oper-ations performed by Vuvuzela makes it impractical for our online stage. Indeed, our online stage is crypto-free using only a handful of arithmetic operations per query. In practice, services using DP-PIR alternate between col-lecting a batch of queries submitted from clients within some configurable time window, and processing that batch using our online protocol. In section 7, we discuss the effects of this batching window on our performance. Each batch requires corresponding offline processing. Our protocol allows mul-tiple offline stages (e.g. the ones corresponding to an entire day’s worth of batches) to be pooled together into a propor-tionally larger stage executed in one shot during off-peak hours when resources are cheaper (e.g. the night before). The clients can choose to make their queries at any time after pre-processing, but client states from several uncombined offline stages should not be used in a single online batch, to avoid allowing the adversary to identify the origin of the query by diffing out clients that participated in different stages. Our protocol assumes that T and its signatures are provided as input. Thus, the servers must agree on T and produce signatures for it ahead of time. The same T and signatures can be reused by many offline/online stages; servers need only compute new signatures when the underlying database changes, and may rely on timestamps to enable clients to reject expired responses. The servers never sign or verify any signatures during either the offline or online stages, and each client needs to verify one signature per received response. Therefore, the efficiency of signing/verification is secondary. Instead, our protocol prefers signature schemes that produce shorter signatures for lower bandwidth. 

# 3.2 Threat Model 

Our construction operates in the ‘anytrust’ model up to se-lective abort. Specifically, we tolerate up to m − 1 malicious servers and d − 1 malicious clients. In terms of confidentiality , our protocol differs from tra-ditional perfectly-private PIR protocols in that it leaks noisy access patterns over the honest clients’ queries, in the form of a differentially private noisy histogram H (Q) = Hhonest (Q) + 

χ(ε, δ, φ).As for integrity , our protocol is secure up to selective abort, and does not guarantee fairness. Adversarial servers may elect to stop responding to queries, effectively aborting the entire protocol. Furthermore, they can do so selectively: any server can decide to drop queries at random, the frontend server can drop queries based on the identity of their clients, and the backend server can drop queries based on their value. We stress that an adversary cannot drop a query based on the conjunction of the client’s identity and the value, re-gardless of which subset of servers gets corrupted. Also, an adversary can only drop a query, but cannot convince a client to accept an incorrect response, since clients can validate the correctness of received responses locally. 

# 3.3 Interpreting Privacy 

Our protocol can be configured to provide different levels of (ε, δ)-differential privacy by selecting the parameters of the underlying distribution used to sample noise queries. The most efficient (and easiest to understand) configuration is of-ten called event-DP , which provides guarantees at the level of any single honest query. Another DP configuration, com-monly termed user-DP , provides guarantees at the level of all 

queries made by any honest client. We use event-DP through-out the paper except when otherwise noted. We provide either guarantee at the level of a single isolated batch. In particular, we consider two batches of queries Q

and Q′ over the honest clients’ queries to be φ-neighboring batches when they consists of identical queries except for φ

queries. In event-DP, it is enough to consider φ = 1 . While in user-DP, we set φ to the number of queries a client can make within a batch (or an upper bound of it). In either case, the sensitivity is 2φ, which means that for the same ε, δ the expected number of noise queries we add grows linearly in φ.

Definition 1 (Differentially Private PIR Access Patterns) . For any privacy parameters ε, δ, and every two φ−neighboring batches of queries Q, Q′, the probabilities of our protocol pro-ducing identical access pattern histograms are (ε, δ)-similar when run on either set: Pr [H (Q) = H] ≤ eεPr [H (Q′) = H] + δ

Our definition uses the substitution formulation of DP, rather than the more common addition/removal; see [76, §1.6] for details. Substitution is commonly used in secure computa-tion protocols involving DP leakage [61]. We use this variant since our protocol does not hide whether a client made a query in a batch or not: the adversary already knows this e.g. by observing IP addresses associated to queries. Instead, we hide the value of the query itself. Substitution is more conservative adding twice the expected amount of noise queries, since its sensitivity is 2 φ compared to φ in the other.   

> USENIX Association 31st USENIX Security Symposium 3331

So far, we only discussed guarantees within a single on-line stage. In any long running DP system where clients can make unbounded queries, it is impossible to achieve user-DP globally. Instead, practical systems [58] often rely on the user-time-DP model, where the guarantees extend over all queries made by a client over a set moving time window (e.g. a week). We can achieve this by setting φ to the number of queries that a client may make over a time window, regardless of how the client distributes the queries over the batches in that window. This follows from DP’s composition theorem. One way to interpret our DP guarantees (aka “differential obliviousness” [23]) is that they provide any client with plau-sible deniability: a client that made queries q1, ..., qφ over some period of time can claim that her true queries were any different q′

> 1

, ..., q′

> φ

, and external distinguishers cannot falsify this claim since the probability of either case inducing any same observed histogram of access patterns is similar. Whereas traditional differential privacy mechanisms trade privacy for accuracy, differential obliviousness trades privacy for performance while always providing accurate outputs. In DP-PIR, increasing privacy (by lowering ε and δ or increasing 

φ) results in additional noise queries, making our protocol proportionally slower, and requiring a proportionally larger batch of queries to achieve the same amortization, and thus speedup, over other protocols. The amount of noise queries scales linearly in φ and 1 

> ε

and sub-linearly in δ (see Table 3). 

# 4 Incremental Non-Malleable Secret Sharing 

Our protocol relies on shuffling real queries with noise queries by our chain of servers, similar to Vuvuzela and other mixnets where public key onion encryption is used to pass secrets through that chain. However, this induces a large number of public key operations, proportional to m × | batch |. We use a novel cheaper arithmetic-based secret sharing scheme instead of onion encryption during our online stage. The secret sharing scheme provides similar security guar-antees to onion encryption, to ensure that input and output queries are untraceable by external adversaries: 1. Secrecy: As long as one of the shares is unknown, re-construction cannot be carried out by an adversary. 2. Incremental Reconstruction: A server that only knows a single secret share and a running tally must be able to combine them to produce a new tally. The new tally must produce the original secret when combined with the remaining shares. 3. Independence: An adversary cannot link any partially reconstructed output from a set of outputs to any shared input in the corresponding input set. 4. Non-Malleability: An adversary who perturbs any given share cannot guarantee that the output of reconstruction with that perturbed share satisfies any desired relationship. In par-ticular, the adversary cannot perturb shares such that recon-struction yields a specific value (e.g., 0), or a specific function of the original secret (e.g., adding a fixed offset). Formally, we define a secret sharing scheme with incre-mental reconstruction with the usual sharing mechanism but a new method to recover the original secret. 

Definition 2. An incremental secret sharing scheme S over a field F and m parties contains two algorithms. 

• Sh (q) disperses a secret q into a randomly chosen set of shares ~q = q1, . . . , qm ∈ F and some initial tally l 0.

• Rec (li−1, qi) → li performs party i’s partial reconstruc-tion to produce running tally l i.The scheme is correct if for all sharings (~q, l0) ← Sh (q), the overall reconstruction returns l m = q. 

Non-malleability is critical for preserving security when the last (backend) server is corrupted. The backend can observe the final reconstructed values of all queries to identify queries perturbed by earlier colluding servers. If the perturbation can be undone (e.g. by removing a fixed offset), then the backend can learn the value of the query and link it to information known by other servers, such as the identity of its client. We formally define non-malleability through the following indistinguishability game. It guarantees that if an adversarial set of m − 1 parties submits a tampered partial tally l∗ 

> i−1

to the honest party i, then the tally l∗ 

> i

returned by the honest party is uniformly random. As a result, l∗ 

> i

is independent of (and therefore hides) the secret q, and it only completes to a reconstruction of q with probability 1 /|F|.

Definition 3. Consider the following two games that only dif-fer in the final step. Call them Left and Right respectively.  

> Adversary

A Challenger C                     

> secret q ,honest party i ~q,l0=Sh (q)
> calculate all l jadversary shares l 0,{qj}j6=i
> modified tally l ∗
> i−16=li−1
> l∗
> i=Rec (l∗
> i−1,qi)
> r←Fl∗
> ior r
> return bit b

We say that an incremental secret sharing scheme S =(Sh , Rec ) is non-malleable if for all adversaries A, the Left 

and Right games are (perfectly) indistinguishable. 

Several non-malleable secret sharing schemes exist [9, 40]. However, they are not incremental: their reconstruction is a one-shot operation over all shares. Conversely, known incre-mental schemes, such as additive or XOR-based sharing, are vulnerable to malleability. It would have been possible to use different primitives in our protocol that satisfy our desired properties, such as authenticated onion symmetric-key en-cryption. However, these operations remain more expensive than simple information theoretic secret sharing schemes that can be implemented with a handful of arithmetic operations. 

Our Incremental Sharing Construction Given a secret q, a prime modulus z, and an integer m, our scheme produces m +  

> 3332 31st USENIX Security Symposium USENIX Association

Algorithm 1 Client i Offline Stage 

Input: Nothing. 

Output state at the client: a list of anonymous secrets 

[ai

> 0

, ..., aim], one per each of the m servers. The client uses these secrets in the online stage. 

Output to s 1: Onion encryption of ai

> 1

, ..., aim.1. Generate Random Values : For each Server s j, the client generates 4 values all sampled uniformly at ran-dom: (1) A globally unique identifier tij. (2) Two in-cremental pre-shares xij ∈ Zz and yij ∈ Z∗ 

> z

. (3) An addi-tive pre-share eij ∈ [0, 2b). We define ei = Σ eij mod 2 b

which the client uses to reconstruct the response online. 2. Build Shared Anonymous secrets : The client builds 

aij = ( tij,tij+1, xij, yij, eij), for every server 1 ≤ j ≤ m, us-ing the generated random values above, with tim+1 = ⊥.These secrets are stored by the client for later use in the online stage. 3. Onion Encryption : The client onion encrypts the se-crets using the correspond server’s public key, such that 

OEnc im = Enc (sk m, aim) and OEnc ij = Enc (sk j, aij :: 

OEnc ij+1).4. Secrets Submission : The client sends the onion cipher 

OEnc i 

> 1

to server s1. The client can leave the protocol as soon as receipt of this message is acknowledged. 1 pairs q0 = ( x0, y0), q1 = ( x1, y1), ..., qm = ( xm, ym), where each pair represents a single share of q. All x and y values are chosen independently at random from Fz and F∗ 

> z

respectively, except for the very first pair x0, y0, whose values are set to: 

x0 = 〈[( q − xm) × y−1 

> m

] ... − x1〉 × y−11 mod z , y0 = 0. All shares except the first one can be selected prior to know-ing q. This is important for our offline stage. The modulus z

must be as big as the key size in the underlying database (32 bits in our experiments). To reconstruct the secret q, we show below the incremental reconstruction operations Rec (li−1, qi)

to construct the first partial tally and all subsequent ones: 

l0 = y0 × 1 + x0 mod z ,

l j = y j × l j−1 + x j mod z .Correctness (i.e., lm = q) stems from our choice of (x0, y0).Refer to the full version of this work on ePrint [4] for the proof showing that our construction is non-malleable. 

# 5 Our DP-PIR Protocol 

Offline Stage Our offline stage consists of a single sequen-tial pass over the m servers. Clients generate random secrets 

Algorithm 2 Server s j Offline Stage 

Configuration: The underlying database T : K → (V, Σ), and privacy parameters ε, δ, φ.

Input from s j−1 or clients if j = 1: A set of onion ciphers of anonymous secrets, one per each incoming request. 

Output state at s j: A mapping M of unique tag tij to its corresponding shared anonymous secrets aij used to handle incoming queries during the online stage. A list of generated anonymous secrets L used to create noise queries during the online stage. A sampled histogram N of noise queries to use in the online stage. 

Output to server s j+1: A set output onion ciphers corre-sponding to input onion ciphers and noise generated by s j.1. Onion Decryption : For every received onion cipher 

OEnc ij, the server decrypts the cipher with its secret key 

sk j, producing aij and OEnc ij+1.2. Anonymous Secret Installation : For every decrypted secret aij = ( tij,tij+1, xij, yij, eij), the server stores entry 

(tij+1, xij, yij, eij) at M[tij] for later use in the online stage. 

If jjj <<< mmm:

3. Noise Pre-Sampling : The server samples a histogram representing counts of noisy queries to add for every key in the database N ← χ(ε, δ, φ), and computes the total count of this noise S = ∑ N .4. Build shared anonymous secrets for noise : The server generates S many anonymous secrets and onion encrypts them for all s j′ with j′ > j, using the same algorithm as the client. The server stores these secrets in L.5. Shuffling and Forwarding : The server shuffles all onion ciphers, including all OEnc ij+1 decrypted in step (1) or generated by step (4), and sends them over to the next server s j+1.locally, and submit them after onion encryption to the first server in the chain. The first server receives all such incom-ing messages from clients, until a configurable granularity is reached, e.g. after a certain time window passes or a number of messages is received. All incoming messages at that point constitutes the input set for that server. The server outputs a larger set. This set contains both the processed input messages, as well as new messages inserted by the server. The client-side protocol is shown in algorithm 1. Con-cretely, for each server j, client i generates secret aij =(tij,tij+1, xij, yij, eij), where tij and tij+1 are random tags chosen from a sufficiently large domain that the client uses online to point each server to its secret without revealing its identity, xij

and yij are secret shares from our incremental secret sharing   

> USENIX Association 31st USENIX Security Symposium 3333

Algorithm 3 Client i Online Stage 

Input: A query qi.

Input state at the client: a shared anonymous secrets aij =(tij,tij+1, xij, yij, eij) per server s j generated by the offline stage. 

Output: A value vi corresponding to T [qi].1. Compute Final Incremental Secret Share : Client computes li 

> 1

= xi

> 0

, so that (xi

> 0

, 0) combined with 

(xi

> 1

, yi

> 1

), ..., (xim, yim) is a valid sharing of qi, per our incre-mental secret sharing scheme. 2. Query Submission : Client sends (ti

> 1

, li

> 1

) to server s1.3. Response Reconstruction : Client receives response ri

> 1

from s1 and reconstructs (vi, σi) = ri 

> 1

− ei mod 2 b.4. Response verification : The client ensures that σi is a valid signature over (qi, ri) by s1, ..., sm−1.scheme used to reconstruct the query, and Σ eij mod 2 b = ei

are additive secret shares used to mask the response. The exponent b corresponds to the bit size of values and signa-tures (instantiated to 32 +384 in our experiments). Our offline protocol uses onion encryption from CCA-secure public key encryption to pass secrets through the servers (here, :: denotes string concatenation): 

OEnc i 

> 1

= Enc (sk 1, ai 

> 1

:: Enc (sk 2, ai 

> 2

:: ... Enc (sk m, aim) ... )) 

In addition to secrets from clients, each server must inject sufficiently many secrets at subsequent servers to handle all noise queries that the server needs to make in the online stage. This corresponds to steps 3 and 4 in algorithm 2, where the server computes the exact noise amount by pre-sampling. The output set of each server contains onion ciphers, en-crypted under the keys of the subsequent servers in the chain. None of the plaintexts decrypted by the current server sur-vives, they are all consumed and stored in the server’s local mapping for use during the online stage. No linkage between messages in the input and output sets is possible without knowing the server’s secret key, since the ciphers in the input cannot be used to distinguish between (sub-components of) their plaintexts, and since the output set is uniformly shuffled. This is true even if the adversary perturbs onion ciphers prior to passing them to an honest party (by CCA security), which in-essence denies service to the corresponding query. 

Online Stage The client-side online protocol is shown in algorithm 3. The server-side online stage (algorithm 4) is structured similarly to the offline stage. However, it requires going through the chain of servers twice. The first phase (steps 1-4) moves from the clients to the backend server, where every server incrementally reconstructs the values of received queries using the stored secrets (steps 1-2), and injects its noise queries into the running set of queries (step 3). The second phase moves in the opposite direction (steps 5-6), with 

Algorithm 4 Server s j Online Stage 

State at s j: The mapping M, list L, and noise histogram N

stored from the offline stage. 

Input from s j−1 or clients if j = 1: A list of queries (tij, lij).

Output to s j−1 or clients: A list of responses rij correspond-ing to each query i.1. Anonymous Secret Lookup : For every received query 

(tij, lij), the server finds M[tij] = ( tij+1, xij, yij, eij).2. Query Handling : For every received query, the server computes output query (tij+1, Rec (lij, (xij, yij))) , where 

Rec is our scheme’s incremental reconstruction function. 

If jjj <<< mmm:

3. Noise injection : The server makes output queries per stored noise histogram N , using the stored list of anony-mous secrets L and the client’s online protocol. By con-struction, there are exactly as many secrets in L as overall queries in N .4. Shuffling and Forwarding: The server shuffles all out-put queries, both real and noise, and sends them over to the next server s j+1. The server waits until she receives the corresponding responses from s j+1, and de-shuffles them using the inverse permutation. 5. Response Handling: Received responses correspond-ing to noise queries generated by this server are dis-carded. For every remaining received response rij+1,the server computes the output response rij = rij+1 +

eij mod 2 b.6. Response Forwarding: The server sends all output re-sponses rij to s j−1, or the corresponding client ci if j = 1 .

If jjj === mmm:

7. Response Lookup : The backend server does not need to inject any noise or shuffle. By construction, step (2) com-putes (⊥, qi) for each received query. The backend finds the corresponding T [qi] = ( vi, σi). If qi was not found in the database (because a malicious party mishandled it), we return an arbitrary random value. 8. Response Handling: The backend computes responses 

rij = ( vi :: σi) + eij mod 2 b, and sends them to s j−1.every server removing responses to their noise queries, and incrementally reconstructing the received responses, until the final value of a response is reconstructed by its corresponding client. The backend operates differently than the rest of the servers (steps 7-8). It computes the reconstructed query set, and finds their corresponding responses in the database via   

> 3334 31st USENIX Security Symposium USENIX Association

direct look-ups. The backend need not add any noise queries, which alleviates the need for shuffling at the backend. 

Discussion The security of both offline and online stages rely on the same intuition. First, an adversary that observes the input and output sets of an honest server should not be able to link any output message to its input. Second, the adversary must not be able to distinguish outputs corresponding to real queries from noise injected by that server. The honest server shuffles and re-randomizes all its in-put messages, which guarantees that the adversary cannot link input and output messages. In the offline stage this re-randomization is performed with onion-decryption, while the online stage performs it using our non-malleable incremental reconstruction and additive secret sharing for its two phases respectively. We do not need to use a non-malleable secret sharing scheme for response handling, since the adversary cannot observe the final response output, which is only re-vealed to the corresponding client, and thus cannot observe the effects of a perturbation. Shuffling in the noise with the re-randomized messages ensure that they are indistinguishable. A consequence of this is that a server cannot send out any output message until it receives the entirety of its input set from the previous server to avoid leaking information about the permutation used. Idle servers further along the chain can use this time to perform in-put independent components of the protocol, such as sampling the noise, building and encrypting their anonymous secrets, or sampling a shuffling order. A malicious server may deviate from this protocol in a vari-ety of ways: it may de-shuffle responses incorrectly (by using a different order), attach a different tag to a query than the one the offline stage dictates, or set the output value corresponding to a query or response arbitrarily (including via the use of an incorrect pre-share). The offline stage does not provide a malicious server with additional deviation capability: any de-viation in the offline stage can be reformulated as a deviation in the online stage, after carrying out the offline stage hon-estly, with both deviations achieving identical effects. Finally, a backend server may choose to provide incorrect responses to queries by ignoring the underlying database. Each of these deviations has the same effect: the non-malleability of both our sharing scheme and onion encryp-tion ensures that mishandled messages reconstruct to random values, and mishandled responses will not pass client-side verification unless the adversary can forge signatures. In ei-ther case, the affected clients will identify that the output they received is incorrect and reject it. Ergo, servers can only use this approach to selectively deny service to some clients or queries. A malicious frontend can deny service to any desired subset of clients since it knows which queries correspond to which clients, a malicious backend can deny service to any number of client who queried a particular entry in the database, and any server can deny service to random clients. The backend and frontend capabilities cannot be combined 

Algorithm 5 Ideal Functionality F

Input: A set of queries qi, one per client, the underlying database T : K → (V, Σ), and privacy parameters ε, δ, φ.

Output: A set of outputs vi, one per client, either equal to the correct value or ⊥.

Leakage: A noisy histogram H revealed to sm.1. if s1 is corrupted, F receives a list of client identities from the adversary. These clients are excluded from the next steps, and receive ⊥ outputs. 2. F reveals the noised histogram H = Hhonest + N to the backend server sm, where Hhonest is the histogram of queries made by honest clients not excluded by the previous step, and N is sampled at random from the distribution of noise χ(ε, δ, φ).3. if the backend is corrupted, F receives a list of counts 

ci for every entry in the database ki, and outputs ⊥ to 

ci-many clients, randomly chosen among the remaining clients that queried ki.4. if any server, other than sm and s1, is corrupted, F re-ceives a number c, and outputs ⊥ to c-many clients, ran-domly chosen among the remaining clients. 5. if s1 is corrupted, F receives an additional list of client identities to receive ⊥.6. F outputs vi such that T [qi] = ( vi, σi) for every client i

not excluded by any of the steps above. even when colluding since at least one honest server exists be-tween the frontend and backend. These guarantees are similar to those of Vuvuzela [77] and many other mixnet systems. 

Formal Security We rigorously specify our security guar-antee in Theorem 1, which refers to the ideal functionality defined in Algorithm 5. The ideal functionality formalizes our notion of “selective” abort. In particular, it formalizes capabil-ities of the adversary to deny service to a specific query based on at most one of its value or its origin client. A construction for the simulator and proof for Theorem 1 are available in the full version of this work [4]. 

Theorem 1 (Security of our protocol Π). For any set A of adversarial colluding servers and clients, including no more than m − 1 servers, there exists a simulator S , such that for client inputs q 1, ..., qd , we have: View Real (Π, A, (q1, ..., qd )) ≈ View Ideal (F , S, (q1, ..., qd )) 

Differential Privacy Our security theorem contains leakage revealed to the backend server in the form of a histogram over queries made by honest clients and honest servers. Our privacy guarantees hinge on this leakage being differentially   

> USENIX Association 31st USENIX Security Symposium 3335

Algorithm 6 Noise Query Sampling Mechanism χ(ε, δ, φ)

Input: The size of the database |T |, privacy parameters ε, δ,and the number of protected queries φ.

Output: A histogram N over T representing how many noise queries must be issued for each database entry. 1. Clamping threshold B := |CDF −1

> Laplace (0,2φ/ε)

( δ 

> 2

)|.

For every iii ∈∈∈ | ||TTT |||:

2. Sample ε-DP Laplace noise: ui ←− Laplace (0, 2φε ).3. Clamp negative noise: u′ 

> i

:= max [0, B + min (B, ui)]) .4. N [i] = floor (u′

> i

)

private, which entails adding noise to that histogram from a suitable distribution. Algorithm 6 shows the mechanism each server uses to sample the noise queries N , and we prove that it indeed achieves (ε, δ)-differential privacy in our full paper [4]. Step (2) is a Laplace substitution (ε, 0)-DP histogram release, which may produce negative values. Step (3) ensures values are non-negative by clamping into [−B, B] and shifting by B,where B is carefully selected in (1) to yield a privacy loss of exactly δ. Table 3 shows the expected number of noise queries per server and database element for different ε and δ.

# 6 Scaling and Parallelization 

Existing PIR protocols can be trivially scaled over additional resources, by running completely independent parallel in-stances of them on different machines. This approach is not ideal for our protocol: each instance would need to add an independent set of noise queries, since each reveals an inde-pendent histogram of its queries. Instead, our protocol is more suited for parallelizing a single instance over additional re-sources, such that only a single histogram is revealed without needing to add ancillary noise queries. In a non-parallel setting, the notions of a party and a server are identical. For scaling, we allow parties to operate mul-tiple machines. These machines form a single trust domain. This maintains our security guarantees at the level of a party. Particularly, the protocol remains secure if one party (and all its machines) is honest. Machines owned by the same party share all their offline secret state and the noise queries they select. A machine m ji belonging to party j communicates with a single machine m j−1 

> i

and m j+1 

> i

from the preceding and succeeding parties, in order to receive inputs and send outputs respectively. The machine also communicates with all other machines belonging to the same party j for shuffling. 

Distributing Noise Generation Our protocol generates noise independently for each entry in the database, we can parallelize the generation by assigning each machine a subset of database entries to generate noise for, e.g. m ji is respon-sible for generating all noise queries corresponding to keys 

{k| k % j = 0}. This distribution is limited by the size of the database. If parallelizing the noise generation beyond this limit is required, an alternate additive noise distribution (e.g. Poisson [75]) can be used instead, which allows several ma-chines to sample noise for the same database entry from a proportionally smaller distribution. 

Distributed Shuffling Machines belonging to the same party must have identical probability of outputting any input query after shuffling, regardless of which server it was initially sent to. An ideal shuffle guarantees that the number of queries remains uniformly distributed among machines after shuf-fling. We choose one that requires no online coordination to ensure it maintains perfect scaling. Machines belonging to the same party agree on a single secret seed ahead of time. They use this shared seed locally to uniformly sample the same global permutation P using Knuth shuffle. Given a total batch of size l, each machine m ji need only retain P[ i×lm : (i+1)lm ],which determines the new indices of each of its input queries. The target machine that each query q should be sent to can be computed by P[q]% lm . This algorithm performs optimal communication lm per machine but requires each machine to perform CPU work linear in the overall number of queries to sample the overall permutation. This work is independent of the actual queries, and can be done ahead of time (e.g. while queries are being batched or processed by previous parties). 

Distributing Offline Anonymous Secrets We require all machines belonging to the same party to share all secrets they installed during the offline stage, so that any of them can quickly retrieve the needed ones during the online stage. Maintaining a copy of all secrets in the main memory of each machine may be suitable for smaller applications. At larger scales, it may be more appropriate to use shared key-value storage or in-memory distributed file system [8, 51, 62, 81]. 

# 7 Evaluation 

Experiment Setup Our various experiments measure the server completion time for a batch of queries. For the online stage, this is the total wall time taken from the moment the first server receives a complete batch ready for processing, until that batch is completely processed by the entire protocol, and its outputs are ready to be sent to clients. For the offline stage, the measurements start when the complete batch is received by the first server, and ends when all servers finished processing and installing the secrets. Measurements include the time spent in CPU performing various computations from the protocol, as well as time spent waiting for network IO as messages get exchanged between servers. Our measurements do not include client processing or round-trip time. All experiments in the paper use ε = 0.1 and δ = 10 −6.      

> 3336 31st USENIX Security Symposium USENIX Association 10 010 210 410 610 8
> Queries
> 10 0
> 10 2
> 10 4
> Completion Time (sec)
> Offline
> Online

Figure 3: Completion time for varying number of queries against a 100K database (logscale)     

> 10 210 310 410 510 6
> Database Size
> 10 −1
> 10 1
> 10 3
> Completion Time (sec)
> Offline
> Online

Figure 4: Completion time for a batch consisting only of noise queries against varying database sizes (logscale) Keys and values in our database are each 4 bytes, with sig-natures that are 48 bytes long (e.g. BLS [16]). We ran our experiments on AWS r4.xlarge instances that cost around $0.25 per hour, using only one thread. A primary factor in selecting these instances is RAM, since we need sufficient memory to store large query batches. We implemented our protocol using a C++ prototype with about 6.1K lines of code. Our prototype relies on libsodium’s crypto_box_seal [33] for encryption. Our code is available on GitHub [34]. 

Scaling Figures 3 and 4 show how our protocol scales with the number of queries and database size, respectively. Our runtime is dominated by noise queries when the number of queries is smaller than the size of the database, and begins to increase with the number of queries as they exceed it. For a large enough number of queries, our runtime scales linearly as the overhead of noise queries is amortized away over the real queries. Our noise overhead scales linearly with the size of the database. The cost of processing any input query in isolation (without noise) is constant and does not depend on the database size, which only affects the number of noise queries added by our protocol. The offline stage is about 500 xmore expensive than our online stage. This is expected since the offline stage performs a public key operation for each corresponding modular online arithmetic operation. Figure 5 shows how our protocol scales with the number       

> 1000
> 2000
> 3000
> 2.02.53.03.54.04.55.0
> Number of Parties
> 0
> 25
> Completion Time (sec)
> Offline
> Online

Figure 5: Completion time for varying number of parties with 100K queries against a 10K database 

Machines / Party Server time (seconds) Offline Online 

1 5010 11 2 2560 8.2 4 1296 4.0 8 664 2.2 Table 2: Horizontal scaling with 1M queries and a 100K DB of parties. Our protocol is most efficient when only two par-ties are involved. When the number of parties increases, a query has to pass through more servers as it crosses the chain. This is more pronounced in the offline stage, as it additionally increases the size and layers of each onion cipher, causing the offline stage to scale super-linearly in the number of par-ties. In addition, each server naively adds the full amount of noise queries required to independently tolerate up to m − 1corrupted parties. Adding less noise by relying on additional assumptions (e.g., honest majority) is an open problem, which can help improve our scaling with the number of parties, and can have important consequences to mixnets, the DP shuffling model, and DP mechanisms in general. Techniques such as noise verification [53] may be useful to ensure that (partial) noise generated by an honest server is not tampered with by future malicious servers. Table 2 demonstrates how our protocol scales horizontally. Parallelizing the online stage primarily parallelizes communi-cation. However, parallel shuffling introduces an additional round of communication per party. As a result, our online stage speed up when using 2 machines is not 2x. We exhibit linear speedups as the number of machines exceeds 2. Finally, the expected number of noise queries added per database element is a function of ε and δ. Table 3 lists this expected number for various combinations of ε and δ. The expectation increases linearly as ε decreases but scales better with δ. This means that the amount of noise overhead (and thus the number of queries required for that overhead to amor-tize effectively) grows linearly with 1 

> ε

. Our protocol trades security for performance. It can efficiently amortize the cost   

> USENIX Association 31st USENIX Security Symposium 3337

δ ε 1 0.1 0.01 0.0001 10 −5 23 230 2302 23025 

10 −6 27 276 2763 27631 

10 −7 32 322 3223 32236 Table 3: Expected number of noise queries B per database element as a function of different ε (columns) and δ (rows) of independent queries due to its relaxed DP security guar-antees. As ε becomes smaller, this relaxation becomes less meaningful, as the DP security guarantees approach those of computational security. While linear scaling with 1 

> ε

appears to be intrinsic to our protocol, we believe it may be possi-ble to reduce the scaling constant, by using different basis distributions that are inherently non-negative or discrete (e.g. Poisson [75] or Geometric [61]), or by adapting recent work on privacy amplification [27, 36] that achieves the same level of privacy using less noise with oblivious shuffling. 

Latency Latency in Checklist and similar systems includes the computation cost of a single query in isolation (which is low), and any queuing delays experienced by the query after its arrival if the computational resources are busy handling pre-vious queries. This delay depends on the rate at which queries come in, and can be significantly larger than the batching overheads in applications with a large query load. In contrast, our protocol is primarily throughput oriented and its latency is a secondary concern determined by two components: the idle waiting time required to collect the batch of queries from different clients, which we call the batching window , and the active processing time of that batch after collection. The first component depends on the configuration. The later compo-nent is precisely the total computation time measured in the various experiments in earlier parts of the paper. Lowering the batching window beyond a certain point can have a negative impact on latency (and even throughput), since it can result in smaller batches dominated by noise where amortization is not effective. Furthermore, it can introduce queuing delays at the level of batches, where a previous ongoing batch still occupies system resources after the next batch has been collected. We analyze DP-PIR’s latency and the effects of the batch-ing window in our full paper [4]. We summarize three impor-tant observations: (1) Queuing delays in existing systems are significant and can cause them to exhibit latency worse than DP-PIR with a large number of queries. (2) Both DP-PIR and existing systems can be scaled horizontally to exhibit lower latency. Traditional PIR protocols can achieve sub-second la-tencies if given enough resources, but this can be prohibitively expensive when the query rate is high. (3) For our target large query loads, DP-PIR can be configured to exhibit decent la-tency with a much lower budget than existing systems. 

The Offline Stage PIR protocols with an offline stage typ-ically do so to improve their online latency, which is less critical in our target applications. It is possible to combine both DP-PIR stages into a single stage that performs onion-encryption of the query directly, without the need to install anonymous secrets. This combined protocol would exhibit similar trends to our current design, but will be around two orders of magnitude slower than our online protocol on its own. A fair comparison here must also account for the of-fline cost of existing protocols, which can be significantly larger than our offline cost. For example, Checklist relies on an expensive per-client offline stage linear in the size of the database, which we observe takes up to 7 seconds per client in our experiments. In DP-PIR, the offline cost for a single query amortizes to a few milliseconds. One key difference is that a client can reuse the hint produced by Checklist’s offline stage to make many following queries, rather than a fixed number of queries in DP-PIR. However, the hint becomes invalid whenever the database is updated. Checklist provides an updatable offline construction, where a single update to the database can be carried over to a previous offline computation in cost logarithmic in the database size. We believe the that the offline-online design provides bet-ter deployment cost and performance, and allows DP-PIR to meet the availability and liveness requirements of many ap-plications, including our App store example. Concretely, the offline-online design allows greater control over the batch-ing window, which governs the effectiveness of amortization, client latency, and the duration needed for updates to the database to become visible to clients at the next batch. For example, it may be desirable to allow clients to query the App store multiple times a day, e.g. every hour, in order to discover important app updates earlier. A natural way to achieve this is to use a batching window of one hour or less. However, this is only effective if this window includes sufficient queries for amortization, and has sufficient time to complete processing before the next batch. The offline setup lowers both require-ments, making smaller windows practical (or alternatively, cutting the online cost of the same window by 500x). The offline stages for multiple online stages can be pooled together and executed ahead of time. Clients can choose to issue less queries than they signed up for in the pooled offline stage without privacy loss. Service providers can use this to execute the combined offline stages during off-peak hours when resources are cheaper (e.g. overnight). Furthermore, providers can use different setups for each stage to optimize the effectiveness of their budget. The offline stage is CPU-intensive due to its public key operations, while the online stage is entirely network bound. 

# 8 Related Work 

Section 2 discusses existing work on Private Information Retrieval. Here, we discuss related work from other areas. 

Mixnets Traditional mixnets [24] consist of various parties   

> 3338 31st USENIX Security Symposium USENIX Association

that sequentially process a batch of onion-ciphers, and out-put a uniformly random permutation of their corresponding plaintexts. Various Mixnet systems [12, 37] add cover traffic 

to obfuscate various traffic patterns. However, ad-hoc cover traffic is shown to leak information over time [60]. Recent work mitigates this by relying on secure multiparty computation [5] or differential privacy. Vuvuzela [77] adds noise traffic from a suitable distribution to achieve formal differential privacy guarantees over leaked traffic patterns, and Stadium [75] improves on its performance by allowing parallel noise generation and permutation. Similar techniques have been used in private messaging systems [53], and in differential privacy models that utilize shuffling for privacy amplification [36] or for introducing a shuffled model that lies in between the central and the local models [27]. 

Differential Privacy and Access Patterns Using differ-ential privacy to efficiently hide access patterns of various protocols has seen increasing interest in the literature. ε−PIR relaxes the security guarantees of PIR to be differentially pri-vate [72] in the semi-honest setting. Their two AS schemes are closest to our protocol: they require clients (rather than servers) to generate noise queries along with their real queries, and send all of them through an anonymous network for mix-ing. When the number of clients is large enough, this can amortize the number of queries any of them have to generate to a constant. However, this approach generates far more total load on the system. For example, in our app store example with 2 servers, a 2.5M database, and 3B clients, each client needs to generate 282 noise queries to hide a single query with ε = 0.1, which results in close to 850 B queries to the system in total, compared to the < 4B total load on our system (but with δ = 10 −6 6 = 0). These constructions do not provide integrity guarantees, and will require further noise queries to protect against potential malicious or unavailable clients. Others relax the security of Oblivious RAM (ORAM), a primitive where a single client obliviously reads and writes to a private remote database [38, 39], to be differentially pri-vate. Extensions of ORAM address multi-client settings [59]. Differentially oblivious RAM [23, 78] guarantees that neigh-boring access patterns (those that differ in the location of a single access, i.e. event-DP) occur with similar probability. DP access patterns have been studied for searchable encryp-tion [25] and generic secure computation [61]. 

Secret Sharing Shamir Secret Sharing [70] allows a user to split her data among n parties such that any t of them can reconstruct the secret. Secret sharing schemes with additional properties have been studied for use in various applications. Some schemes, such as additive secret sharing, allow the se-cret to be reconstructed incrementally by combining a subset of shares of size k into a single share that can recover the orig-inal secret when combined with the remaining n − k shares. 

Non-malleable secret sharing schemes [9, 40] additionally protect against an adversary that can tamper with shares, and guarantees that tampered shares either reconstruct to the orig-inal message or to some random value. Aggarwal et al. [2] show generic transformations to build non-malleable schemes from secret sharing schemes over the same access structure. 

# 9 Conclusion 

This paper introduces a novel PIR protocol targeted exclu-sively at applications with high query rates relative to the database. This focus is intentional and necessary: DP-PIR handles large batches so well specifically because it handles small ones poorly. Our construction makes PIR usable in scenarios that were previously impractical or unexplored. DP-PIR is primarily geared towards amortizing total server work (i.e. throughput), but not for sub-second client latency, and only provides relaxed differential privacy guarantees. The performance of DP-PIR is closely tied to its configura-tions, which determine the number of noise queries generated by our system, and thus the number of queries required to amortize their overheads effectively. Our experiments meet or extend beyond standard configurations suggested by ex-isting work. Checklist [47] supports exactly two parties, and PIR schemes are rarely instantiated with more than three. For small databases (e.g. n < 100 K), the naive solution of sending the entire DB to the client may be desirable. Vuvuzela [77] recommends ε ∈ [0.1, ln (3)] and sets δ = 10 −4, and other work [61, 72] also mostly focuses on ε ≥ 0.1. The ratio of queries to database size qn is the primary per-formance criteria that governs how effective DP-PIR is com-pared to existing protocols. Within the space of typical con-figurations outlined above, our experiments demonstrate that applications with qn < 110 are unsuited for DP-PIR, while appli-cations with qn > 10 are almost always guaranteed to exhibit speedups of several folds when using DP-PIR. Applications with ratios in [ 110 , 10 ] may or may not be suited to DP-PIR, depending on their exact configurations. For example, we can achieve better performance than existing work for a ratio of 0.8 when the database size is 2.5M, but not when it is of size 1M (section 2). Thus, such applications require individual analysis to determine the best way to realize them. Our protocol shifts expensive public key operations to an offline stage. This allows for more flexibility over the batching window to meet application requirements, and a more efficient allocation of computational resources. However, applications were these factors are not a concern may elect to combine the two stages into a single one, that still exhibits similar trends to our online stage, but is about two orders of magnitude more expensive. Finally, these ratios, and the number of noise queries, also depend on the level (and duration) of protection offered to users (e.g. event-DP vs user-time-DP) as expressed by φ. DP-PIR intentionally relaxes its guarantees for increased performance. This relaxation becomes less meaningful as ε

and φ approach perfect security.   

> USENIX Association 31st USENIX Security Symposium 3339

Acknowledgments The authors are grateful to our help-ful shepherd, Wouter Lueks, and the anoynmous reviewers. We are grateful to Andrei Lapets, Frederick Jansen, Jens Schmuedderich, Malte Schwarzkopf, Ran Canetti, and Adam Smith for their valuable feedback on various versions of this work. This material is supported by Honda Research In-stitutes, by the National Science Foundation under Grants No. 1414119, 1718135, and 1931714, by DARPA under Agreement No. HR00112020021, and by DARPA and the Naval Information Warfare Center (NIWC) under contract No. N66001-15-C-4071. 

# References 

[1] ACDEB. Advisory committee on data for evidence building: Year 1 report. https: //www.bea.gov/system/files/2021-10/acdeb-year-1-report.pdf , 2021. [2] Divesh Aggarwal, Ivan Damgård, Jesper Buus Nielsen, Maciej Obremski, Erick Purwanto, João Ribeiro, and Mark Simkin. Stronger leakage-resilient and non-malleable secret sharing schemes for general access structures. In Alexandra Boldyreva and Daniele Mic-ciancio, editors, Advances in Cryptology – CRYPTO 2019 , pages 510–539, Cham, 2019. Springer Interna-tional Publishing. [3] Carlos Aguilar-Melchor, Joris Barrier, Laurent Fousse, and Marc-Olivier Killijian. XPIR: private information retrieval for everyone. Proceedings on Privacy Enhanc-ing Technologies , 2016(2):155–174, 2016. [4] Kinan Dak Albab, Rawane Issa, Mayank Varia, and Kalman Graffi. Batched differentially private infor-mation retrieval. Cryptology ePrint Archive, Paper 2020/1596, 2020. https://eprint.iacr.org/2020/ 1596 .[5] Nikolaos Alexopoulos, Aggelos Kiayias, Riivo Talviste, and Thomas Zacharias. MCMix: Anonymous messag-ing via secure multiparty computation. In 26th USENIX Security Symposium (USENIX Security 17) , pages 1217– 1234, 2017. [6] Sebastian Angel, Hao Chen, Kim Laine, and Srinath T. V. Setty. PIR with compressed queries and amortized query processing. In IEEE Symposium on Security and Privacy , pages 962–979. IEEE Computer Society, 2018. [7] Sebastian Angel and Srinath Setty. Unobservable com-munication over fully untrusted infrastructure. In 12th USENIX Symposium on Operating Systems Design and Implementation (OSDI 16) , pages 551–569, Savannah, GA, November 2016. USENIX Association. [8] Apache. Apache Ignite. https://github.com/ apache/ignite . Accessed: 2020-12-01. [9] Saikrishna Badrinarayanan and Akshayaram Srinivasan. Revisiting non-malleable secret sharing. In Annual In-ternational Conference on the Theory and Applications of Cryptographic Techniques , pages 593–622. Springer, 2019. [10] Amos Beimel and Yuval Ishai. Information-theoretic private information retrieval: A unified construction. In Fernando Orejas, Paul G. Spirakis, and Jan van Leeuwen, editors, Automata, Languages and Programming , pages 912–926, Berlin, Heidelberg, 2001. Springer Berlin Hei-delberg. [11] Amos Beimel, Yuval Ishai, and Tal Malkin. Reduc-ing the servers’ computation in private information re-trieval: PIR with preprocessing. Journal of Cryptology ,17(2):125–151, 2004. [12] Oliver Berthold and Heinrich Langos. Dummy traffic against long term intersection attacks. In Roger Din-gledine and Paul Syverson, editors, Privacy Enhancing Technologies , pages 110–128, Berlin, Heidelberg, 2003. Springer Berlin Heidelberg. [13] Peter Bogetoft, Dan Lund Christensen, Ivan Damgård, Martin Geisler, Thomas Jakobsen, Mikkel Krøigaard, Janus Dam Nielsen, Jesper Buus Nielsen, Kurt Nielsen, Jakob Pagter, Michael Schwartzbach, and Tomas Toft. Secure multiparty computation goes live. In Roger Din-gledine and Philippe Golle, editors, Financial Cryptog-raphy and Data Security , pages 325–343, Berlin, Hei-delberg, 2009. Springer Berlin Heidelberg. [14] Dan Boneh, Elette Boyle, Henry Corrigan-Gibbs, Niv Gilboa, and Yuval Ishai. Lightweight techniques for private heavy hitters. In IEEE Symposium on Security and Privacy , pages 762–776. IEEE, 2021. [15] Dan Boneh, Kevin Lewi, and David J. Wu. Constrain-ing pseudorandom functions privately. In Public Key Cryptography (2) , volume 10175 of Lecture Notes in Computer Science , pages 494–524. Springer, 2017. [16] Dan Boneh, Ben Lynn, and Hovav Shacham. Short signatures from the weil pairing. In International con-ference on the theory and application of cryptology and information security , pages 514–532. Springer, 2001. [17] Nikita Borisov, George Danezis, and Ian Goldberg. DP5: a private presence service. Proceedings on Privacy Enhancing Technologies , 2015(2):4–24, 2015. [18] Elette Boyle, Niv Gilboa, and Yuval Ishai. Function secret sharing: Improvements and extensions. In Pro-ceedings of the 2016 ACM SIGSAC Conference on Com-puter and Communications Security , CCS ’16, page   

> 3340 31st USENIX Security Symposium USENIX Association

1292–1303, New York, NY, USA, 2016. Association for Computing Machinery. [19] Elette Boyle, Yuval Ishai, Rafael Pass, and Mary Woot-ters. Can we access a database both locally and pri-vately? In Theory of Cryptography Conference , pages 662–693. Springer, 2017. [20] Christian Cachin, Silvio Micali, and Markus Stadler. Computationally private information retrieval with poly-logarithmic communication. In EUROCRYPT , volume 1592 of Lecture Notes in Computer Science , pages 402– 414. Springer, 1999. [21] Ran Canetti, Justin Holmgren, and Silas Richelson. To-wards doubly efficient private information retrieval. In Yael Kalai and Leonid Reyzin, editors, Theory of Cryp-tography , pages 694–726, Cham, 2017. Springer Inter-national Publishing. [22] Justin Chan, Landon P. Cox, Dean P. Foster, Shyam Gol-lakota, Eric Horvitz, Joseph Jaeger, Sham M. Kakade, Tadayoshi Kohno, John Langford, Jonathan Larson, Puneet Sharma, Sudheesh Singanamalla, Jacob E. Sun-shine, and Stefano Tessaro. PACT: privacy-sensitive protocols and mechanisms for mobile contact tracing. 

IEEE Data Eng. Bull. , 43(2):15–35, 2020. [23] T.-H. Hubert Chan, Kai-Min Chung, Bruce M. Maggs, and Elaine Shi. Foundations of differentially oblivious algorithms. In SODA , pages 2448–2467. SIAM, 2019. [24] David L. Chaum. Untraceable electronic mail, return addresses, and digital pseudonyms. Commun. ACM ,24(2):84–90, February 1981. [25] G. Chen, T. Lai, M. K. Reiter, and Y. Zhang. Differen-tially private access patterns for searchable symmetric encryption. In IEEE INFOCOM 2018 - IEEE Confer-ence on Computer Communications , pages 810–818, 2018. [26] Raymond Cheng, William Scott, Elisaweta Masserova, Irene Zhang, Vipul Goyal, Thomas Anderson, Arvind Krishnamurthy, and Bryan Parno. Talek: Private group messaging with hidden access patterns, 2020. [27] Albert Cheu, Adam Smith, Jonathan Ullman, David Ze-ber, and Maxim Zhilyaev. Distributed differential pri-vacy via shuffling. In Yuval Ishai and Vincent Rijmen, editors, Advances in Cryptology – EUROCRYPT 2019 ,pages 375–403, Cham, 2019. Springer International Pub-lishing. [28] Benny Chor and Niv Gilboa. Computationally private information retrieval. In Proceedings of the twenty-ninth annual ACM symposium on Theory of computing , pages 304–313, 1997. [29] Benny Chor, Eyal Kushilevitz, Oded Goldreich, and Madhu Sudan. Private information retrieval. J. ACM ,45(6):965–981, November 1998. [30] Henry Corrigan-Gibbs. Privacy-preserving telemetry in Firefox. Real World Crypto (RWC), 2020. https: //rwc.iacr.org/2020/slides/Gibbs.pdf .[31] Henry Corrigan-Gibbs and Dmitry Kogan. Private in-formation retrieval with sublinear online time. In Anne Canteaut and Yuval Ishai, editors, Advances in Cryptol-ogy – EUROCRYPT 2020 , pages 44–75, Cham, 2020. Springer International Publishing. [32] Alex Cranz. There are over 3 billion active Android devices. https://www.theverge.com/2021/5/ 18/22440813/android-devices-active-number-smartphones-google-2021 . Accessed: 2021-06-02. [33] Frank Denis. The sodium cryptography library, Jun 2013. [34] DP-PIR GitHub repository. https://github.com/ multiparty/DP-PIR/tree/usenix2022 , 2022. [35] Cynthia Dwork and Aaron Roth. The algorithmic foun-dations of differential privacy. Found. Trends Theor. Comput. Sci. , 9(3-4):211–407, 2014. [36] Úlfar Erlingsson, Vitaly Feldman, Ilya Mironov, Ananth Raghunathan, Kunal Talwar, and Abhradeep Thakurta. Amplification by shuffling: From local to central dif-ferential privacy via anonymity. In SODA , pages 2468– 2479. SIAM, 2019. [37] Michael J. Freedman and Robert Morris. Tarzan: A peer-to-peer anonymizing network layer. In Proceedings of the 9th ACM Conference on Computer and Communica-tions Security , CCS ’02, page 193–206, New York, NY, USA, 2002. Association for Computing Machinery. [38] Oded Goldreich. Towards a theory of software pro-tection and simulation by Oblivious RAMs. In STOC ,pages 182–194. ACM, 1987. [39] Oded Goldreich and Rafail Ostrovsky. Software pro-tection and simulation on Oblivious RAMs. J. ACM ,43(3):431–473, May 1996. [40] Vipul Goyal and Ashutosh Kumar. Non-malleable se-cret sharing. In Proceedings of the 50th Annual ACM SIGACT Symposium on Theory of Computing , pages 685–698, 2018. [41] Matthew Green, Watson Ladd, and Ian Miers. A proto-col for privately reporting ad impressions at scale. In 

CCS , pages 1591–1601. ACM, 2016.   

> USENIX Association 31st USENIX Security Symposium 3341

[42] Trinabh Gupta, Natacha Crooks, Whitney Mulhern, Sri-nath Setty, Lorenzo Alvisi, and Michael Walfish. Scal-able and private media consumption with Popcorn. In 

13th USENIX Symposium on Networked Systems Design and Implementation (NSDI 16) , pages 91–107, Santa Clara, CA, March 2016. USENIX Association. [43] Ariel Hamlin, Rafail Ostrovsky, Mor Weiss, and Daniel Wichs. Private anonymous data access. In Yuval Ishai and Vincent Rijmen, editors, Advances in Cryptol-ogy – EUROCRYPT 2019 , pages 244–273, Cham, 2019. Springer International Publishing. [44] Mansoor Iqbal. App download and usage statistics (2020). https://www.businessofapps.com/data/ app-statistics/ . Accessed: 2021-06-02. [45] Yuval Ishai, Eyal Kushilevitz, Rafail Ostrovsky, and Amit Sahai. Cryptography from anonymity. In 2006 47th Annual IEEE Symposium on Foundations of Com-puter Science (FOCS’06) , pages 239–248, 2006. [46] Daniel Kales. Golang DPF library. https://github. com/dkales/dpf-go , 2021. [47] Dmitry Kogan and Henry Corrigan-Gibbs. Private block-list lookups with checklist. In USENIX Security Sympo-sium , pages 875–892. USENIX Association, 2021. [48] Anunay Kulshrestha and Jonathan Mayer. Identifying harmful media in end-to-end encrypted communication: Efficient private membership computation. In USENIX Security Symposium . USENIX Association, 2021. [49] E. Kushilevitz and R. Ostrovsky. Replication is not needed: Single database, computationally-private infor-mation retrieval. In Proceedings of the 38th Annual Symposium on Foundations of Computer Science , FOCS ’97, page 364, USA, 1997. IEEE Computer Society. [50] Albert Kwon, David Lazar, Srinivas Devadas, and Bryan Ford. Riffle: An efficient communication system with strong anonymity. Proceedings on Privacy Enhancing Technologies , 2016(2):115–134, 2016. [51] Michael Labib. Turbocharge Amazon S3 with Amazon ElastiCache for Redis. https://aws.amazon.com/ blogs/storage/turbocharge-amazon-s3-with-amazon-elasticache-for-redis/ . Accessed: 2020-12-01. [52] Andrei Lapets, Frederick Jansen, Kinan Dak Albab, Rawane Issa, Lucy Qin, Mayank Varia, and Azer Bestavros. Accessible privacy-preserving web-based data analysis for assessing and addressing economic inequalities. In Proceedings of the 1st ACM SIGCAS Conference on Computing and Sustainable Societies ,COMPASS ’18, New York, NY, USA, 2018. Associa-tion for Computing Machinery. [53] David Lazar, Yossi Gilad, and Nickolai Zeldovich. Karaoke: Distributed private messaging immune to pas-sive traffic analysis. In 13th USENIX Symposium on Operating Systems Design and Implementation (OSDI 18) , pages 711–725, 2018. [54] David Lazar and Nickolai Zeldovich. Alpenhorn: Boot-strapping secure communication without leaking meta-data. In OSDI , pages 571–586. USENIX Association, 2016. [55] Helger Lipmaa. An oblivious transfer protocol with log-squared communication. In Jianying Zhou, Javier Lopez, Robert H. Deng, and Feng Bao, editors, Informa-tion Security , pages 314–328, Berlin, Heidelberg, 2005. Springer Berlin Heidelberg. [56] Helger Lipmaa. First CPIR protocol with data-dependent computation. In Proceedings of the 12th International Conference on Information Security and Cryptology , ICISC’09, page 193–210, Berlin, Heidel-berg, 2009. Springer-Verlag. [57] Wouter Lueks and Ian Goldberg. Sublinear scaling for multi-client private information retrieval. In Rainer Böhme and Tatsuaki Okamoto, editors, Financial Cryp-tography and Data Security , pages 168–186, Berlin, Hei-delberg, 2015. Springer Berlin Heidelberg. [58] Tao Luo, Mingen Pan, Pierre Tholoniat, Asaf Cidon, Roxana Geambasu, and Mathias Lécuyer. Privacy bud-get scheduling. In 15th USENIX Symposium on Oper-ating Systems Design and Implementation (OSDI 21) ,pages 55–74, 2021. [59] Matteo Maffei, Giulio Malavolta, Manuel Reinert, and Dominique Schröder. Maliciously secure multi-client ORAM. In International Conference on Applied Cryptography and Network Security , pages 645–664. Springer, 2017. [60] Nick Mathewson and Roger Dingledine. Practical traffic analysis: Extending and resisting statistical disclosure. In David Martin and Andrei Serjantov, editors, Privacy Enhancing Technologies , pages 17–34, Berlin, Heidel-berg, 2005. Springer Berlin Heidelberg. [61] Sahar Mazloom and S. Dov Gordon. Secure computa-tion with differentially private access patterns. In CCS ,pages 490–507. ACM, 2018. [62] Christopher Mitchell, Yifeng Geng, and Jinyang Li. Us-ing one-sided RDMA reads to build a fast, CPU-efficient key-value store. In 2013 USENIX Annual Technical Conference (USENIX ATC 13) , pages 103–114, 2013.   

> 3342 31st USENIX Security Symposium USENIX Association

[63] Prateek Mittal, Femi Olumofin, Carmela Troncoso, Nikita Borisov, and Ian Goldberg. PIR-Tor: Scalable anonymous communication using private information re-trieval. In Proceedings of the 20th USENIX Conference on Security , SEC’11, page 31, USA, 2011. USENIX Association. [64] MPC Alliance. https://www.mpcalliance.org/ ,2021. [65] Nth Party. https://www.nthparty.com/ , 2021. [66] Femi Olumofin and Ian Goldberg. Revisiting the com-putational practicality of private information retrieval. In George Danezis, editor, Financial Cryptography and Data Security , pages 158–172, Berlin, Heidelberg, 2012. Springer Berlin Heidelberg. [67] Rahul Parhi, Michael Schliep, and Nicholas Hopper. MP3: a more efficient private presence protocol. In Sarah Meiklejohn and Kazue Sako, editors, Financial Cryptography and Data Security , pages 38–57, Berlin, Heidelberg, 2018. Springer Berlin Heidelberg. [68] Sarvar Patel, Giuseppe Persiano, and Kevin Yeo. Pri-vate stateful information retrieval. In Proceedings of the 2018 ACM SIGSAC Conference on Computer and Communications Security , CCS ’18, page 1002–1019, New York, NY, USA, 2018. Association for Computing Machinery. [69] Anjana Rajan, Lucy Qin, David W Archer, Dan Boneh, Tancrede Lepoint, and Mayank Varia. Callisto: A crypto-graphic approach to detecting serial perpetrators of sex-ual misconduct. In Proceedings of the 1st ACM SIGCAS Conference on Computing and Sustainable Societies ,pages 1–4, 2018. [70] Adi Shamir. How to share a secret. Communications of the ACM , 22(11):612–613, 1979. [71] Stephanie Straus. A federal government pri-vacy preserving technology demonstration, 2021. 

https://mccourt.georgetown.edu/news/a-federal-government-privacy-preserving-technology-demonstration/ .[72] Raphael R Toledo, George Danezis, and Ian Goldberg. Lower-cost ε-private information retrieval. Proceedings on Privacy Enhancing Technologies , 2016(4):184–201, 2016. [73] Ni Trieu, Kareem Shehata, Prateek Saxena, Reza Shokri, and Dawn Song. Epione: Lightweight contact tracing with strong privacy. IEEE Data Eng. Bull. , 43(2):95– 107, 2020. [74] Carmela Troncoso, Mathias Payer, Jean-Pierre Hubaux, Marcel Salathé, James R. Larus, Wouter Lueks, Theresa Stadler, Apostolos Pyrgelis, Daniele Antonioli, Ludovic Barman, Sylvain Chatel, Kenneth G. Paterson, Srdjan Capkun, David A. Basin, Jan Beutel, Dennis Jackson, Marc Roeschlin, Patrick Leu, Bart Preneel, Nigel P. Smart, Aysajan Abidin, Seda Gurses, Michael Veale, Cas Cremers, Michael Backes, Nils Ole Tippenhauer, Reuben Binns, Ciro Cattuto, Alain Barrat, Dario Fiore, Manuel Barbosa, Rui Oliveira, and José Pereira. De-centralized privacy-preserving proximity tracing. IEEE Data Eng. Bull. , 43(2):36–66, 2020. [75] Nirvan Tyagi, Yossi Gilad, Derek Leung, Matei Za-haria, and Nickolai Zeldovich. Stadium: A distributed metadata-private messaging system. In Proceedings of the 26th Symposium on Operating Systems Principles ,pages 423–440, 2017. [76] Salil Vadhan. The complexity of differential privacy. In Yehuda Lindell, editor, Tutorials on the Foundations of Cryptography: Dedicated to Oded Goldreich , pages 347– 450. Springer International Publishing, Cham, 2017. [77] Jelle van den Hooff, David Lazar, Matei Zaharia, and Nickolai Zeldovich. Vuvuzela: Scalable private mes-saging resistant to traffic analysis. In Proceedings of the 25th Symposium on Operating Systems Principles ,SOSP ’15, page 137–152, New York, NY, USA, 2015. Association for Computing Machinery. [78] Sameer Wagh, Paul Cuff, and Prateek Mittal. Differen-tially private Oblivious RAM. Proceedings on Privacy Enhancing Technologies , 2018(4):64–84, 2018. [79] Frank Wang, Catherine Yun, Shafi Goldwasser, Vinod Vaikuntanathan, and Matei Zaharia. Splinter: Practical private queries on public data. In 14th USENIX Sympo-sium on Networked Systems Design and Implementation (NSDI 17) , pages 299–313, Boston, MA, March 2017. USENIX Association. [80] David J. Wu, Joe Zimmerman, Jérémy Planul, and John C. Mitchell. Privacy-preserving shortest path com-putation. In NDSS . The Internet Society, 2016. [81] Jian Yang, Joseph Izraelevitz, and Steven Swanson. Orion: A distributed file system for non-volatile main memory and RDMA-capable networks. In 17th USENIX Conference on File and Storage Technologies (FAST 19) ,pages 221–234, 2019.      

> USENIX Association 31st USENIX Security Symposium 3343 10 210 410 610 8
> Queries
> 10 0
> 10 2
> 10 4
> Completion Time (sec)
> DPF
> DP-PIR

Figure 6: DPF and DP-PIR Total completion time (y-axis, logscale) for varying number of queries (x-axis, logscale) against a 2.5M database 

> 10 6
> Database size
> 0.00
> 0.01
> 0.02
> 0.03
> 0.04
> 0.05
> Queries/Database size  1x
> 2x
> 5x
> 10x

Figure 7: The ratios of queries/database (y-axis) after which DP-PIR outperforms DPF for different database sizes (x-axis, logscale) 

# A DPF and SealPIR 

The setup and parameters in both comparisons below is iden-tical to section 2. 

DPF Boyle, Gilboa, and Ishai [18] propose a PIR proto-col based on distributed point functions (DPF). Unlike the offline-online protocol introduced in Checklist that uses punc-tured pseudorandom sets, DPF requires linear work in the database size to handle user queries. However, DPF requires no offline preprocessing and significantly lower client com-putation and communication than checklist. We compare our system to the DPF implementation provided as an alternative backend for checklist based on the optimized implementa-tion of Kales [46]. Figures 6 and 7 show our results. For a database with 100K elements, DPF outperforms DP-PIR when the number of queries is small relative to the size of the database. When the number of queries q approaches 31 K,with nq = 0.0124 , the two systems exhibit identical comple-tion time, with DP-PIR significantly outperforming DPF as the number of queries grow beyond that. 

SealPIR Figures 8 and 9 show similar results for SealPIR.     

> 10 010 210 410 610 8
> Queries
> 10 0
> 10 2
> 10 4
> Completion Time (sec)
> SealPIR
> DP-PIR

Figure 8: SealPIR and DP-PIR Total completion time (y-axis, logscale) for varying number of queries (x-axis, logscale) against a 10K database   

> 10 310 410 5
> Database size
> 0.00
> 0.01
> 0.02
> 0.03
> 0.04
> Queries/Database size  1x
> 2x
> 5x
> 10x

Figure 9: The ratios of queries/database (y-axis) after which DP-PIR outperforms SealPIR for different database sizes (x-axis, logscale) In the first experiment, we use a database size of only 10K elements, and find that DP-PIR outperforms SealPIR at rel-atively few queries (around 32) with a ratio qn of just 0.003 .Similarly, we achieve 2x, 5x, and 10x speedups for modest ratios all below 0.02 . These ratios decrease as the database size grows, similar to our experiment with Checklist. We out-perform SealPIR with far fewer queries than we do Checklist and DPF, in large part because SealPIR’s uses expensive ho-momorphic operations during its online stage, while checklist offloads expensive linear work to an offline stage. Our pro-tocol goes even further, only executing a couple of modular arithmetic operations per query online.
