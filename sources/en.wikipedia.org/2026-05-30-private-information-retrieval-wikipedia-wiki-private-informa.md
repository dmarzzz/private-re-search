---
url: https://en.wikipedia.org/wiki/Private_information_retrieval
title: Private information retrieval - Wikipedia
fetched_at: 2026-05-30T16:55:02
content_hash: sha1:03bbbc690c595bdaf96292918f76bca4bfb122e7
extractor: trafilatura
---

# Private information retrieval

In [cryptography](https://en.wikipedia.org/wiki/Cryptography), a **private information retrieval (PIR)** protocol is a protocol that allows a user to retrieve an item from a server in possession of a [database](https://en.wikipedia.org/wiki/Database) without revealing which item is retrieved. PIR is a weaker version of 1-out-of-*n* [oblivious transfer](https://en.wikipedia.org/wiki/Oblivious_transfer), where it is also required that the user should not get information about other database items.

One trivial, but very inefficient way to achieve PIR is for the server to send an entire copy of the database to the user. In fact, this is the only possible protocol (in the classical or the [quantum](https://en.wikipedia.org/wiki/Quantum_cryptography) setting [1]) that gives the user

[information theoretic privacy](https://en.wikipedia.org/wiki/Information_theoretic_security)for their query in a single-server setting.

There are two ways to address this problem: make the server computationally bounded or assume that there are multiple non-cooperating servers, each having a copy of the database.

[[2]](https://en.wikipedia.org#cite_note-ChoKusGolSud98-2)The problem was introduced in 1995 by [Chor](https://en.wikipedia.org/wiki/Benny_Chor), Goldreich, Kushilevitz and Sudan [2] in the information-theoretic setting and in 1997 by Kushilevitz and Ostrovsky in the computational setting.

Since then, very efficient solutions have been discovered. Single database (computationally private) PIR can be achieved with constant (amortized) communication and k-database (information theoretic) PIR can be done with communication

[[3]](https://en.wikipedia.org#cite_note-KusOst97-3)[.

*]*[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed)## Advances in computational PIR

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=1)]

The first single-database computational PIR scheme to achieve [communication complexity](https://en.wikipedia.org/wiki/Communication_complexity) less than was created in 1997 by Kushilevitz and Ostrovsky [3] and achieved communication complexity of for any , where is the number of bits in the database. The security of their scheme was based on the well-studied

[quadratic residuosity problem](https://en.wikipedia.org/wiki/Quadratic_residuosity_problem). In 1999, Christian Cachin,

[Silvio Micali](https://en.wikipedia.org/wiki/Silvio_Micali)and Markus Stadler

achieved poly-logarithmic communication complexity. The security of their system is based on the

[[4]](https://en.wikipedia.org#cite_note-4)[phi-hiding assumption](https://en.wikipedia.org/wiki/Phi-hiding_assumption). In 2004,

[Helger Lipmaa](https://en.wikipedia.org/w/index.php?title=Helger_Lipmaa&action=edit&redlink=1)

achieved log-squared communication complexity , where is the length of the strings and is the

[[5]](https://en.wikipedia.org#cite_note-Lip04-5)[security parameter](https://en.wikipedia.org/wiki/Security_parameter). The security of his system reduces to the

[semantic security](https://en.wikipedia.org/wiki/Semantic_security)of a length-flexible additively homomorphic cryptosystem like the

[Damgård–Jurik cryptosystem](https://en.wikipedia.org/wiki/Damg%C3%A5rd%E2%80%93Jurik_cryptosystem). In 2005 Craig Gentry and

[Zulfikar Ramzan](https://en.wikipedia.org/w/index.php?title=Zulfikar_Ramzan&action=edit&redlink=1)

achieved log-squared communication complexity which retrieves log-square (consecutive) bits of the database. The security of their scheme is also based on a variant of the Phi-hiding assumption. The communication rate was finally brought down to by

[[6]](https://en.wikipedia.org#cite_note-6)[Aggelos Kiayias](https://en.wikipedia.org/wiki/Aggelos_Kiayias),

[Nikos Leonardos](https://en.wikipedia.org/w/index.php?title=Nikos_Leonardos&action=edit&redlink=1),

[Helger Lipmaa](https://en.wikipedia.org/w/index.php?title=Helger_Lipmaa&action=edit&redlink=1),

[Kateryna Pavlyk](https://en.wikipedia.org/w/index.php?title=Kateryna_Pavlyk&action=edit&redlink=1),

[Qiang Tang](https://en.wikipedia.org/w/index.php?title=Qiang_Tang&action=edit&redlink=1), in 2015.


[[7]](https://en.wikipedia.org#cite_note-7)All previous sublinear-communication computational PIR protocol required linear computational complexity of public-key operations. In 2009, [Helger Lipmaa](https://en.wikipedia.org/w/index.php?title=Helger_Lipmaa&action=edit&redlink=1) [8] designed a computational PIR protocol with communication complexity and worst-case computation of public-key operations. Amortization techniques that retrieve non-consecutive bits have been considered by

[Yuval Ishai](https://en.wikipedia.org/w/index.php?title=Yuval_Ishai&action=edit&redlink=1),

[Eyal Kushilevitz](https://en.wikipedia.org/w/index.php?title=Eyal_Kushilevitz&action=edit&redlink=1),

[Rafail Ostrovsky](https://en.wikipedia.org/wiki/Rafail_Ostrovsky)and

[Amit Sahai](https://en.wikipedia.org/wiki/Amit_Sahai).


[[9]](https://en.wikipedia.org#cite_note-9)As shown by Ostrovsky and Skeith, [10] the schemes by Kushilevitz and Ostrovsky

and Lipmaa

[[3]](https://en.wikipedia.org#cite_note-KusOst97-3)use similar ideas based on

[[5]](https://en.wikipedia.org#cite_note-Lip04-5)[homomorphic encryption](https://en.wikipedia.org/wiki/Homomorphic_encryption). The Kushilevitz and Ostrovsky protocol is based on the

[Goldwasser–Micali cryptosystem](https://en.wikipedia.org/wiki/Goldwasser%E2%80%93Micali_cryptosystem)while the protocol by Lipmaa is based on the

[Damgård–Jurik cryptosystem](https://en.wikipedia.org/wiki/Damg%C3%A5rd%E2%80%93Jurik_cryptosystem).

## Advances in information theoretic PIR

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=2)]

Achieving information theoretic security requires the assumption that there are multiple non-cooperating servers, each having a copy of the database. Without this assumption, any information-theoretically secure PIR protocol requires an amount of communication that is at least the size of the database *n*. Multi-server PIR protocols tolerant of non-responsive or malicious/colluding servers are called *robust* or * Byzantine robust* respectively. These issues were first considered by Beimel and Stahl (2002). An ℓ-server system that can operate where only

*k*of the servers respond, ν of the servers respond incorrectly, and which can withstand up to

*t*colluding servers without revealing the client's query is called "

*t*-private ν-Byzantine robust

*k*-out-of-ℓ PIR" [DGH 2012]. In 2012, C. Devet, I. Goldberg, and

[N. Heninger](https://en.wikipedia.org/wiki/Nadia_Heninger)(DGH 2012) proposed an optimally robust scheme that is Byzantine-robust to which is the theoretical maximum value. It is based on an earlier protocol of Goldberg that uses

[Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)to hide the query. Goldberg has released a

[C++](https://en.wikipedia.org/wiki/C%2B%2B)implementation on

[SourceForge](https://en.wikipedia.org/wiki/SourceForge).


[[11]](https://en.wikipedia.org#cite_note-:0-11)## Relation to other cryptographic primitives

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=3)]

[One-way functions](https://en.wikipedia.org/wiki/One-way_function) are necessary, but not known to be sufficient, for nontrivial (i.e., with sublinear communication) single database computationally private information retrieval. In fact, such a protocol was proved by Giovanni Di Crescenzo, [Tal Malkin](https://en.wikipedia.org/wiki/Tal_Malkin) and [Rafail Ostrovsky](https://en.wikipedia.org/wiki/Rafail_Ostrovsky) to imply oblivious transfer (see below).[[12]](https://en.wikipedia.org#cite_note-12)

[Oblivious transfer](https://en.wikipedia.org/wiki/Oblivious_transfer), also called symmetric PIR, is PIR with the additional restriction that the user may not learn any item other than the one she requested. It is termed symmetric because both the user and the database have a privacy requirement.

Collision-resistant [cryptographic hash functions](https://en.wikipedia.org/wiki/Cryptographic_hash_function) are implied by any one-round computational PIR scheme, as shown by Ishai, Kushilevitz and Ostrovsky.[[13]](https://en.wikipedia.org#cite_note-13)

## PIR variations

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=4)]

The basic motivation for private information retrieval is a family of two-party protocols in which one of the parties (the *sender*) owns a database, and the other part (the *receiver*) wants to query it with certain privacy restrictions and warranties. So, as a result of the protocol, if the *receiver* wants the *i-th* value in the database he must learn the *i-th* entry, but the *sender* must learn nothing about *i*. In a general PIR protocol, a computationally unbounded *sender* can learn nothing about *i* so privacy is theoretically preserved. Since the PIR problem was posed, different approaches to its solution have been pursued and some variations were proposed.

A CPIR (computationally private information retrieval) protocol is similar to a PIR protocol: the *receiver* retrieves an element chosen by him from the sender's database, so that the *sender* obtains no knowledge about which element was transferred. [8] The only difference is that privacy is safeguarded against a polynomially bounded sender.


[[14]](https://en.wikipedia.org#cite_note-TR1-14)A CSPIR (computationally symmetric private information retrieval) protocol is used in a similar scenario in which a CPIR protocol is used. If the *sender* owns a database, and the *receiver* wants to get the *i-th* value in this database, at the end of the execution of a SPIR protocol, the *receiver* should have learned nothing about values in the database other than the *i-th* one.[[14]](https://en.wikipedia.org#cite_note-TR1-14)

## PIR implementations

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=5)]

Numerous Computational PIR and Information theoretic PIR schemes in the literature have been implemented. Here is an incomplete list:

- MuchPIR
is a CPIR implementation as a Postgres C/C++ Extension [GitHub, 2021].[[15]](https://en.wikipedia.org#cite_note-15) - SealPIR
is a fast CPIR implementation [ACLS 2018].[[16]](https://en.wikipedia.org#cite_note-16) - Popcorn
is a PIR implementation tailored for media [GCMSAW 2016].[[17]](https://en.wikipedia.org#cite_note-17) - Percy++
includes implementations of [AG 2007, DGH 2012, CGKS 1998, Goldberg 2007, HOG 2011, LG 2015].[[11]](https://en.wikipedia.org#cite_note-:0-11) - RAID-PIR
is an implementation of the ITPIR scheme of [DHS 2014].[[18]](https://en.wikipedia.org#cite_note-18) - XPIR
is a fast CPIR implementation [ABFK 2014].[[19]](https://en.wikipedia.org#cite_note-19) - upPIR
is an ITPIR implementation [Cappos 2013].[[20]](https://en.wikipedia.org#cite_note-20)

### Notes

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=6)]

Baumeler, Ämin;[^](https://en.wikipedia.org#cite_ref-1)[Broadbent, Anne](https://en.wikipedia.org/wiki/Anne_Broadbent)(17 April 2014). "Quantum Private Information Retrieval has Linear Communication Complexity".*Journal of Cryptology*.**28**: 161–175.[arXiv](https://en.wikipedia.org/wiki/ArXiv_(identifier)):[1304.5490](https://arxiv.org/abs/1304.5490).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/s00145-014-9180-2](https://doi.org/10.1007%2Fs00145-014-9180-2).[S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier))[1450526](https://api.semanticscholar.org/CorpusID:1450526).- ^
**a****b**[Chor, Benny](https://en.wikipedia.org/wiki/Benny_Chor); Kushilevitz, Eyal; Goldreich, Oded; Sudan, Madhu (1 November 1998).["Private information retrieval"](http://www.tau.ac.il/~bchor/PIR.pdf)(PDF).*Journal of the ACM*.**45**(6): 965–981.[CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier))[10.1.1.51.3663](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.51.3663).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/293347.293350](https://doi.org/10.1145%2F293347.293350).[S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier))[544823](https://api.semanticscholar.org/CorpusID:544823). - ^
**a****b**Kushilevitz, Eyal; Ostrovsky, Rafail (1997). "Replication is not needed: single database, computationally-private information retrieval".**c***Proceedings of the 38th Annual Symposium on Foundations of Computer Science*. Miami Beach, Florida, USA: IEEE Computer Society. pp. 364–373.[CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier))[10.1.1.56.2667](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.56.2667).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1109/SFCS.1997.646125](https://doi.org/10.1109%2FSFCS.1997.646125).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-8186-8197-4](https://en.wikipedia.org/wiki/Special:BookSources/978-0-8186-8197-4).[S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier))[11000506](https://api.semanticscholar.org/CorpusID:11000506). Cachin, Christian; Micali, Silvio; Stadler, Markus (1999). "Computationally Private Information Retrieval with Polylogarithmic Communication".[^](https://en.wikipedia.org#cite_ref-4)*Advances in Cryptology – EUROCRYPT '99*. Prague, Czech Republic: Springer-Verlag. pp. 402–414.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/3-540-48910-X_28](https://doi.org/10.1007%2F3-540-48910-X_28).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-3-540-48910-8](https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-48910-8).- ^
**a**Lipmaa, Helger (2005). "An Oblivious Transfer Protocol with Log-Squared Communication".**b***Proceedings of the 8th International Conference on Information Security (ISC 2005)*. Lecture Notes in Computer Science. Vol. 3650. Singapore: Springer-Verlag. pp. 314–328.[CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier))[10.1.1.73.8768](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.73.8768).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/11556992_23](https://doi.org/10.1007%2F11556992_23).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-3-540-31930-6](https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-31930-6). Gentry, Craig; Ramzan, Zulfikar (2005). "Single-Database Private Information Retrieval with Constant Communication Rate".[^](https://en.wikipedia.org#cite_ref-6)*ICALP*. LNCS. Vol. 3580. Springer. pp. 803–815.[CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier))[10.1.1.113.6572](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.113.6572).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/11523468_65](https://doi.org/10.1007%2F11523468_65).Kiayias, Aggelos; Leonardos, Nikos; Lipmaa, Helger; Pavlyk, Kateryna; Tang, Qiang (2015). "Optimal Rate Private Information Retrieval from Homomorphic Encryption".[^](https://en.wikipedia.org#cite_ref-7)*Proceedings on Privacy Enhancing Technologies 2015*. Vol. 2015. DE GRUYTER. pp. 222–243.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1515/popets-2015-0016](https://doi.org/10.1515%2Fpopets-2015-0016).[hdl](https://en.wikipedia.org/wiki/Hdl_(identifier)):[20.500.11820/0f84afcb-8ee1-4744-a2ba-4642104c51c5](https://hdl.handle.net/20.500.11820%2F0f84afcb-8ee1-4744-a2ba-4642104c51c5).- ^
**a**Lipmaa, Helger (2010). "First CPIR Protocol with Data-Dependent Computation".**b***Proceedings of the 12th International Conference on Information Security and Cryptology*. Lecture Notes in Computer Science. Vol. 5984. Seoul, Korea: Springer-Verlag. pp. 193–210.[CiteSeerX](https://en.wikipedia.org/wiki/CiteSeerX_(identifier))[10.1.1.215.7768](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.215.7768).[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/978-3-642-14423-3_14](https://doi.org/10.1007%2F978-3-642-14423-3_14).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-3-642-14423-3](https://en.wikipedia.org/wiki/Special:BookSources/978-3-642-14423-3). Ishai, Yuval; Kushilevitz, Eyal; Ostrovsky, Rafail; Sahai, Amit (2004).[^](https://en.wikipedia.org#cite_ref-9)["Batch codes and their applications"](https://web.cs.ucla.edu/~rafail/PUBLIC/62.pdf)(PDF).*STOC'04*. ACM. pp. 262–271.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1145/1007352.1007396](https://doi.org/10.1145%2F1007352.1007396). Retrieved 2015-10-23.Ostrovsky, Rafail; Skeith III; William E. (2007). "A Survey of Single-Database Private Information Retrieval: Techniques and Applications".[^](https://en.wikipedia.org#cite_ref-10)*Proceedings of the 10th International Conference on Practice and Theory in Public-Key Cryptography*. Springer-Verlag. pp. 393–411.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/978-3-540-71677-8_26](https://doi.org/10.1007%2F978-3-540-71677-8_26).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-3-540-71677-8](https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-71677-8).- ^
**a****b**[Percy++ / PIR in C++](https://percy.sourceforge.net)at[SourceForge](https://en.wikipedia.org/wiki/SourceForge) Di Crescenzo, Giovanni; Malkin, Tal; Ostrovsky, Rafail (2000). "Single Database Private Information Retrieval Implies Oblivious Transfer".[^](https://en.wikipedia.org#cite_ref-12)*Eurocrypt 2000*. LNCS. Vol. 1807. Springer. pp. 122–138.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/3-540-45539-6_10](https://doi.org/10.1007%2F3-540-45539-6_10).Ishai, Yuval; Kushilevitz, Eyal; Ostrovsky, Rafail (2005). "Sufficient Conditions for Collision-Resistant Hashing".[^](https://en.wikipedia.org#cite_ref-13)*Proceedings of the Second Theory of Cryptography Conference*. Cambridge, MA, USA: Springer-Verlag. pp. 445–456.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1007/978-3-540-30576-7_24](https://doi.org/10.1007%2F978-3-540-30576-7_24).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-3-540-30576-7](https://en.wikipedia.org/wiki/Special:BookSources/978-3-540-30576-7).- ^
**a**Saint-Jean, Felipe (2005).**b**["A Java Implementation of a Single-Database Computationally Symmetric Private Information Retrieval (cSPIR) protocol"](https://crypto.stanford.edu/portia/papers/TR1333.pdf)(PDF).*Yale University Technical Report YALEU/DCS/TR-1333*. [^](https://en.wikipedia.org#cite_ref-15)["MuchPIR Demo"](https://github.com/ReverseControl/MuchPIR).. 14 September 2021.[GitHub](https://en.wikipedia.org/wiki/GitHub)[^](https://en.wikipedia.org#cite_ref-16)["SealPIR"](https://github.com/pung-project/SealPIR).*Github*. Retrieved 2018-06-07.[^](https://en.wikipedia.org#cite_ref-17)["Popcorn"](https://web.archive.org/web/20160821164304/http://www.cs.utexas.edu/~trinabh/papers/popcorn-PIR-nsdi16.pdf)(PDF). Archived from[the original](http://www.cs.utexas.edu/~trinabh/papers/popcorn-PIR-nsdi16.pdf)(PDF) on 2016-08-21. Retrieved 2016-05-26.[^](https://en.wikipedia.org#cite_ref-18)["encryptogroup/RAID-PIR"](https://github.com/encryptogroup/RAID-PIR).*GitHub*. Retrieved 2016-05-26.[^](https://en.wikipedia.org#cite_ref-19)["XPIR-team/XPIR"](https://github.com/XPIR-team/XPIR).*GitHub*. Retrieved 2016-05-26.[^](https://en.wikipedia.org#cite_ref-20)["upPIR"](https://web.archive.org/web/20160625160724/https://uppir.poly.edu/projects/project).*uppir.poly.edu*. Archived from[the original](https://uppir.poly.edu/projects/project)on 2016-06-25. Retrieved 2016-05-26.

## See also

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=7)]

## References

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=8)]

- A. Beimel, Y. Ishai, E. Kushilevitz, and J.-F. Raymond. Breaking the barrier for information-theoretic private information retrieval.
*Proceedings of the 43rd Annual IEEE Symposium on Foundations of Computer Science*, Vancouver, Canada, pages 261–270, 2002. - A. Beimel and Y. Stahl,
*Robust information-theoretic private information retrieval*, in Proceedings of the 3rd International Conference on Security in Communication Networks (SCN'02), pp. 326–341, 2003. Cite is from DGH 2012, op. cit. - [DGH 2012] Casey Devet,
[Ian Goldberg](https://en.wikipedia.org/wiki/Ian_Goldberg), and[Nadia Heninger](https://en.wikipedia.org/wiki/Nadia_Heninger),, 21st USENIX Security Symposium, August 2012.[Optimally Robust Private Information Retrieval](https://www.cs.uwaterloo.ca/~iang/pubs/orpir-usenix.pdf) - [AG 2007] C. Aguilar-Melchor and P. Gaborit.
*A lattice-based computationally-efficient private information retrieval protocol*, Western European Workshop on Research in Cryptology (WEWoRC), 2007. - [CGKS 1998] B. Chor, O. Goldreich, E. Kushilevitz, and M. Sudan,
*Private information retrieval*, Journal of the ACM, 45(6):965–981, 1998. - [Goldberg 2007] I. Goldberg,
*Improving the robustness of private information retrieval*, IEEE Symposium on Security and Privacy (S&P), 2007. - [HOG 2011] R. Henry, F. Olumofin, and I. Goldberg,
*Practical PIR for electronic commerce*, ACM Conference on Computer and Communications Security (CCS), 2011. - [LG 2015] W. Lueks and I. Goldberg,
*Sublinear scaling for multi-client private information retrieval*, International Conference on Financial Cryptography and Data Security (FC), 2015. - [DHS 2014] D. Demmler, A. Herzberg, and T. Schneider,
*RAID-PIR: Practical multi-server PIR*, In Cloud computing security workshop (CCSW), 2014. - [ABFK 2014] C. Aguilar-Melchor, J. Barrier, L. Fousse, and M.-O. Killijian, "XPIR: Private Information Retrieval for Everyone", Cryptology ePrint Archive, Report 2014/1025, 2014.
- [GCMSAW 2016] T. Gupta, N. Crooks, W. Mulhern, S. Setty, L. Alvisi, and M. Walfish,
USENIX NSDI, March 2016.[[1]](https://web.archive.org/web/20160821164304/http://www.cs.utexas.edu/~trinabh/papers/popcorn-PIR-nsdi16.pdf)Scalable and private[media consumption](https://en.wikipedia.org/wiki/Media_consumption)with Popcorn. - [Cappos 2013] J. Cappos,
*Avoiding theoretical optimality to efficiently and privately retrieve security updates*, International Conference on Financial Cryptography and Data Security (FC), 2013. - Sergey Yekhanin. New locally decodable codes and private information retrieval schemes,
[ECCC](https://en.wikipedia.org/wiki/Electronic_Colloquium_on_Computational_Complexity)[TR06-127](https://eccc.weizmann.ac.il/report/2006/127/), 2006. - [ACLS 2018] S. Angel, H. Chen, K. Laine, S. Setty,
*PIR with compressed queries and amortized query processing*, IEEE Symposium on Security and Privacy (S&P), 2018.

## External links

[[edit](https://en.wikipedia.org/w/index.php?title=Private_information_retrieval&action=edit§ion=9)]
