---
url: https://www.csail.mit.edu/event/snoopy-surpassing-scalability-bottleneck-oblivious-storage
title: Snoopy: Surpassing the Scalability Bottleneck of Oblivious Storage
fetched_at: 2026-05-30T17:07:35
content_hash: sha1:648bd4947c48933bdfa7ced0aa4eb8d0d7b71b30
extractor: trafilatura
---

# Snoopy: Surpassing the Scalability Bottleneck of Oblivious Storage

#### Speaker

Emma Datuerman

UC Berkeley

#### Host

Henry Corrigan-Gibbs

Assistant Professor, MIT EECS

Existing oblivious storage systems provide strong security by hiding access patterns, but do not scale to sustain high throughput as they rely on a central point of coordination. To overcome this scalability bottleneck, we present Snoopy, an object store that is both oblivious and scalable such that adding more machines increases system throughput. Snoopy contributes techniques tailored to the high-throughput regime to securely distribute and efficiently parallelize every system component without prohibitive coordination costs. These techniques enable Snoopy to scale similarly to a plaintext storage system. Snoopy achieves 13.7x higher throughput than Obladi, a state-of-the-art oblivious storage system. Specifically, Obladi reaches a throughput of 6.7K requests/s for two million 160-byte objects and cannot scale beyond a proxy and server machine. For the same data size, Snoopy uses 18 machines to scale to 92K requests/s with average latency under 500ms. This work appeared at SOSP '21 and is joint work with Vivian Fang, Ioannis Demertzis, Natacha Crooks, and Raluca Ada Popa.
