# The IP problem: one leak under every privacy use case

Walkthrough spine for the Flashbots Privacy Information Group. Two parts. Part 1
is the anonymous-communication layer and the research questions I am stuck on.
Part 2 is private search, which is where I actually want to spend my time. We go
deep on Part 1 and take a quick stab at Part 2.

What I am not working on: private LLM inference. I told Jonathan this in DM. The
content of the query is rarely the sensitive thing for search. The fact that
**I** asked it is. So this is an unlinkability story, not a confidentiality one.

---

## Part 1: the last-mile IP leak

### The frame

You can win at the application layer and still lose at the network layer. The
same leak shows up under three things this group already cares about:

1. **BuilderNet.** You want to hide your counterparty's IP. If builders can see
   who is connecting, they can play traffic-blocking and discrimination games on
   the network layer that the encrypted-orderflow layer was supposed to prevent.

2. **Private inference.** Assume inference runs in a TEE, so the content is
   secure. The TEE protects the computation. It does nothing for the last mile.
   The connection from user to enclave still carries the user's IP. Secure
   inference is not anonymous inference.

3. **Private search.** Assume an oblivious engine, so the query content is hidden
   under PIR. Hitting the engine still exposes your IP. (And if you hit a *normal*
   engine, it also exposes your raw query. That is Part 2.)

One leak, three use cases. Fix it once.

### The thing you inherit the moment you build anonymous comms

Spam. Call it IP poisoning, Sybil, flooding. It does not matter whether the
transport is Tor, a DC-net, or a mixnet. Anonymity removes the one rate-limit the
internet gives you for free: the IP address. Take away stable identity and you
take away the natural meter. This is transport-independent, which is the point:
the hard problem is not the mix, it is what sits on top of it.

This is the same concern Sarah raised in the last PIG sync. It is not a footnote.
It is the first wall you hit.

### Where I sit relative to the Flashnet line

I am not rebuilding the transport. The Flashbots anonymous-broadcast line (DC-nets
to ZipNet to ADCNet to Flashnet to NAMP, mapped in the tech tree at the end) is
exactly the pipe this needs. My work is two layers that pipe does not give you:

- **The access / anti-Sybil layer** that gates who may use the pipe. That is the
  reputation-gated egress PoC. It is transport-agnostic: it runs on Tor today and
  could run on Flashnet tomorrow.
- **An application** that needs an anonymous pipe underneath: Periscope, oblivious
  search (Part 2).

The interesting research lives in the seams between the Flashbots transport and a
usable application: the return path, payments, and credential issuance.

### Two problems every PoC in this space quietly skips

**A. The return path.** All three use cases need a response to come back to a
client that has no stable identity. The whole Flashbots broadcast line is
**fire-and-forget**, and for good reason: its driving use case is mempool
broadcast, where you publish a transaction and never need a private reply. So the
return path was never forced. Search and inference force it. You ask, you must get
an answer back, privately, to a sender with no address. That makes the return path
a shared gap the mempool use case simply never exposed, not a hole specific to me.
Getting bytes back to an anonymous sender is its own design problem.

Honest status of my own work here:
- For the **synchronous rendezvous** transport, I have a working return path. Tor
  rendezvous routes the response back over the circuit the client built. End to
  end TLS, gateway never sees plaintext. This is live (see below).
- For the **broadcast / mixnet** model that Flashnet actually uses, I have **not**
  built a return path. The known trick (encrypt the response, store it, publish a
  handle the client fetches later, per Mark's point in the sync) is not
  implemented in any PoC. This is the relevant gap for PIG, and I want to be
  precise that it is open, not solved.

**B. Spam and Sybil under anonymity.** This is the one I have the most built on.

### What is actually built (the artifact to demo)

**Reputation-gated egress.** `reputation-gated-onion-egress/`. Built and verified
live (deployed 2026-06-08, benchmarked against real Google queries, p50 1.9s).

- A client proves zero-knowledge membership in a reputation set (Semaphore v4),
  dials a Tor onion service (no exit node), and the gateway tunnels the request
  out from one clean IP. The client's home IP and Tor exit never touch the target.
- Anti-spam is an **RLN-style epoch nullifier**: `nullifier = hash(secret, epoch)`,
  one-hour epochs, a per-nullifier redemption budget at the gateway. Same epoch,
  same nullifier, so the gateway can rate-limit. Different epoch, different
  nullifier, so redemptions are unlinkable across time. Spam reveals the
  nullifier, never the identity.
- Adversary probes (`scripts/probe.mjs`): no-proof, garbage-proof, wrong-group all
  rejected at the gate.

Key files: `gateway/gateway.mjs`, `lib/semaphore.mjs`, `client/shim.mjs`,
`group/enroll.mjs`. Backed by a measured Tor exit-blocking benchmark (392 reqs /
70 exits: niche engines 0% blocked, Cloudflare/Akamai-fronted 87-100%), which is
*why* a clean shared egress beats raw Tor exits for this workload.

### The hard problem I am stuck on now: payments

RLN gives me **metering and anti-spam**. It does not give me **payment**. The two
are not the same, and the gap is where I am stuck.

The obvious move is a zk payment channel. It does not work, because the payment
layer reconstructs the very graph the comms layer hid. Opening and settling a
channel reveals who is paying whom. You anonymize the request and then
deanonymize it at the till.

Specifics of where I am:
- Anonymous metering: **solved** (RLN nullifiers).
- Anonymous payment: **open**. Every rail I know of leaks the counterparty graph.
- Credential portability: RLN credentials can be spent **across** egress points.
  Good for the user (one membership, many egresses). But it means I cannot cleanly
  charge per egress without re-introducing linkage, and a credential spent at two
  points may be correlatable across them.

### Distribution

Do not bootstrap a node set from zero. Ride the ~4000 DAppNode home-staking nodes
that already exist. Package the egress binary, pay operators a small amount for
bandwidth. This turns a cold-start network problem into a packaging-and-incentive
problem against an installed base. (There is a DAppNode contact in the jam.)

### The demo and handout

- Show the live reputation-gated egress PoC.
- Hand out Semaphore membership keys so people can join the set on the spot.
- Link a gist: how to connect and send a message over it (enroll, set secret,
  run the shim, curl through it). The quickstart already exists in the repo README;
  I will lift it into a standalone gist.

---

## The research questions, stated crisply

These are the things I want this group's help on. They are all
**transport-independent**: they live above Tor / mixnet / DC-net, not inside it.

1. **Anonymous return path.** What is the right general primitive for getting a
   response back to a client with no stable identity, in the broadcast/mixnet
   model? Synchronous rendezvous gives it for free; broadcast does not.

2. **Anonymous payment without graph leakage.** How do you charge for anonymous
   service without the payment layer reconstructing who-pays-whom? Can an
   RLN-style credential carry *value*, not just a rate limit, without re-linking?

3. **The Sybil root: credential issuance cost.** RLN rate-limits *given* a
   credential. The actual Sybil resistance is whatever makes a credential
   expensive to mint. What is the right issuance cost function (stake, proof of
   personhood, social vouching) for this setting?

4. **Portability vs. linkage.** When is a credential spendable across egress
   points a feature (one membership, many egresses) and when is it a leak
   (correlating a user across points)? Where is the line?

5. **Where the work belongs.** Because 1-4 are invariant across transports, the
   research target is the credential + payment + return-path layer, not the mix.
   Is that the right place to push?

---

## Part 2 (quick stab): the raw-query leak

Granting everything above. Say we have TEE inference and short- and long-term IP
hiding. Hitting a search engine still exposes your **raw query** to the engine.
IP anonymity does not help; the engine reads the words.

Periscope (`periscope-poc/`) is the oblivious-search answer. Built and
benchmarked.

- Tiptoe / SimplePIR style. Secret-key Regev LWE (n=1024, q=2^32, σ=6.4). The
  client embeds the query locally, encrypts it, and the server computes the
  ranking over the ciphertext. The server never sees the query and never learns
  which record was fetched.
- Real numbers: 234 pages / 6,143 chunks, 20/20 correctness, 49ms median query,
  constant per-query bandwidth (~29 KiB up / ~8 KiB down). A two-node router fans
  encrypted queries to public shard centroids with 0.81 routing accuracy. Live on
  3 DigitalOcean nodes at ~$18/mo.
- TEE belongs in the **build plane** (attesting honest index construction), not
  the query plane. Confidentiality of the query is LWE, not hardware.

Open problems for later: PIR at web scale, hint refresh on every rebuild, and the
agent-era cost blowup (long decomposed/multi-vector queries multiply the linear
scan). We come back to this.

---

---

## The tech tree

One picture to close on. The organizing axis is the **anonymity trilemma** from
the NAMP writeup: low latency, strong anonymity, low overhead, pick about two.
The three classical families sit across the top. The DC-net branch is where the
Flashbots line descends and where the recent work concentrates. My two layers sit
on top of all of it, and the open seams are the research.

```
                         THE ANONYMITY TRILEMMA
            low latency  ·  strong anonymity  ·  low overhead   (pick ~2)

   ONION ROUTING              MIXNETS                  DC-NETS
   Tor                        Nym                      Chaum, 1988
   weak anonymity             strong anonymity         strong anonymity
   low overhead, low latency  high latency + bandwidth moderate latency, high bw
        │                         │                         │
        │                         │                         ▼
        │                         │                   ZipNet  (ia.cr/2024/1227)
        │                         │                   low-bandwidth broadcast from
        │                         │                   (dis)Trusted TEEs: TEE buys
        │                         │                   liveness/bandwidth, anonymity
        │                         │                   holds if >=1 server honest.
        │                         │                   XOR aggregation, random slots.
        │                         │                         │
        │                         │                         ▼
        │                         │                   ADCNet  (flashbots/adcnet)
        │                         │                   Go PoC of ZipNet + IBLT
        │                         │                   auction scheduling. Research,
        │                         │                   hand-rolled crypto.
        │                         │                         │
        │                         │                         ▼
        │                         │                   Flashnet  (collective #5630)
        │                         │                   IBLT knapsack auction replaces
        │                         │                   ZipNet's wasteful random slots;
        │                         │                   TEE = liveness, crypto = anon,
        │                         │                   low latency.
        │                         │                         │
        └─────────────────────────┴─────────────────────────┘
                                   │
                                   ▼
                  NAMP — Network-Anonymized Mempools
                  productization: FOCIL, staking integration
            ============ Flashbots TRANSPORT / BROADCAST layer ============
                  (fire-and-forget: mempool never needs a reply)

   ─────────────────────────────────────────────────────────────────────────
        everything above moves a message OUT. my work gates access to the
        pipe and handles what must come BACK.
   ─────────────────────────────────────────────────────────────────────────

   ACCESS / ANTI-SYBIL LAYER       APPLICATION LAYER         THE OPEN SEAMS
   reputation-gated egress         Periscope                 1 broadcast return path
   Semaphore + RLN nullifiers      oblivious search (LWE)    2 anonymous payment
   transport-agnostic              built + benchmarked       3 credential issuance cost
   BUILT + LIVE                    needs anon transport      4 portability vs linkage
```

Reading it out loud: Flashbots built the pipe and is pushing the DC-net branch
hard (ZipNet to ADCNet to Flashnet to NAMP) because it wins the trilemma for
low-latency strong anonymity. I am building what goes through the pipe (oblivious
search) and what gates access to it (reputation + RLN). The four seams are the
research questions. Two of them, the return path and payments, are forced by my
use cases and not by mempool, which is why they are still open.

A scheduling aside worth raising: Luís asked in the last sync how Flashnet handles
agents firing many queries in parallel. That is exactly what the auction-based
scheduling is for. The IBLT knapsack allocating bandwidth across many messages per
round is the same problem as scheduling an agent swarm's burst. Worth connecting.

---

*Status legend: built+verified = running and measured; designed = specced not
built; open = research question. Payments, broadcast return path, web-scale PIR,
and DAppNode distribution are not yet built and are flagged as such. ZipNet,
ADCNet, Flashnet, and NAMP are Flashbots-line references, not my work; I sit on
top of them.*
