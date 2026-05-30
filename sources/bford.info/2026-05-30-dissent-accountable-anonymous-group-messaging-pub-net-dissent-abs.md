---
url: https://bford.info/pub/net/dissent-abs
title: Dissent: Accountable Anonymous Group Messaging
fetched_at: 2026-05-30T15:59:19
content_hash: sha1:35277bd46a81d9478cbc1ff44c687f67fb0931fc
extractor: trafilatura
---

# Dissent: Accountable Anonymous Group Messaging

**
**
Henry Corrigan-Gibbs and Bryan Ford

*Yale University*

[Winner of ACM CCS Test-of-Time Award](https://www.sigsac.org/ccs/CCS2020/awards.html)

[
17th ACM Conference on Computer and
Communications Security (CCS 2010)](http://www.sigsac.org/ccs/CCS2010/)

October 4-8, 2010, Chicago, IL, USA


### Abstract:

Users often wish to participate in online groups anonymously,
but misbehaving users may abuse this anonymity to
disrupt the group's communication.
Existing messaging protocols such as DC-nets leave groups
vulnerable to denial-of-service and Sybil attacks,
Mix-nets are difficult to protect against
traffic analysis,
and accountable voting protocols
are unsuited to general anonymous messaging.

We present the first general messaging protocol
that offers provable anonymity with accountability
for moderate-size groups,
and efficiently handles unbalanced loads
where few members wish to transmit in a given round.
The N group members first cooperatively shuffle
an N×N matrix of pseudorandom seeds,
then use these seeds in N “pre-planned” DC-nets protocol runs.
Each DC-nets run transmits the variable-length bulk data
comprising one member's message,
using the minimum number of bits required for anonymity
under our attack model.
The protocol preserves message integrity
and one-to-one correspondence between members and messages,
makes denial-of-service attacks by members traceable to the culprit,
and efficiently handles large, unbalanced message loads.
A working prototype demonstrates the protocol's practicality
for anonymous messaging in groups of 40+ members.

### Full Paper:
[PDF](../dissent.pdf)
