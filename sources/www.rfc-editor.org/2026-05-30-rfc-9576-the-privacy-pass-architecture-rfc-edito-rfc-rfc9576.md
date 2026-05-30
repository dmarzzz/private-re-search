---
url: https://www.rfc-editor.org/rfc/rfc9576
title: RFC 9576: The Privacy Pass Architecture | RFC Editor
fetched_at: 2026-05-30T17:09:30
content_hash: sha1:4bf4a6ee7e551a8ad86e248aae922d13161a1b66
extractor: trafilatura
---

# RFC 9576: The Privacy Pass Architecture

- A. Davidson,
- J. Iyengar,
- C. A. Wood

[RFC Tips](https://www.rfc-editor.org/series/rfc-tips/)

[Abstract](https://www.rfc-editor.org#abstract)

This document specifies the Privacy Pass architecture and requirements for
its constituent protocols used for authorization based on privacy[¶](https://www.rfc-editor.org#section-abstract-1)

##
[Status of This Memo](https://www.rfc-editor.org#name-status-of-this-memo)

This document is not an Internet Standards Track specification; it is
published for informational purposes.[¶](https://www.rfc-editor.org#section-boilerplate.1-1)

This document is a product of the Internet Engineering Task Force
(IETF). It represents the consensus of the IETF community. It has
received public review and has been approved for publication by the
Internet Engineering Steering Group (IESG). Not all documents
approved by the IESG are candidates for any level of Internet
Standard; see Section 2 of RFC 7841.[¶](https://www.rfc-editor.org#section-boilerplate.1-2)

Information about the current status of this document, any
errata, and how to provide feedback on it may be obtained at
[https:// www.rfc-editor.org/info/rfc9576](https://www.rfc-editor.org/info/rfc9576).

[¶](https://www.rfc-editor.org#section-boilerplate.1-3)

##
[Copyright Notice](https://www.rfc-editor.org#name-copyright-notice)

Copyright (c) 2024 IETF Trust and the persons identified as the
document authors. All rights reserved.[¶](https://www.rfc-editor.org#section-boilerplate.2-1)

This document is subject to BCP 78 and the IETF Trust's Legal
Provisions Relating to IETF Documents
([https:// trustee.ietf.org/license-info](https://trustee.ietf.org/license-info)) in effect on the date of
publication of this document. Please review these documents
carefully, as they describe your rights and restrictions with
respect to this document. Code Components extracted from this
document must include Revised BSD License text as described in
Section 4.e of the Trust Legal Provisions and are provided without
warranty as described in the Revised BSD License.

[¶](https://www.rfc-editor.org#section-boilerplate.2-2)

##
[1. ](https://www.rfc-editor.org#section-1)[Introduction](https://www.rfc-editor.org#name-introduction)

Privacy Pass is an architecture for authorization based on privacy[¶](https://www.rfc-editor.org#section-1-1)

Typical approaches for authorizing Clients, such as through the use of long-term
state (cookies), are not privacy friendly, since they allow servers to track
Clients across sessions and interactions. Privacy Pass takes a different
approach: instead of presenting linkable state-carrying information to servers,
e.g., a cookie indicating whether or not the Client is an authorized user or
has completed some prior challenge, Clients present unlinkable proofs that
attest to this information. These proofs, or tokens, are private in the sense
that a given token cannot be linked to the protocol interaction where that
token was initially issued.[¶](https://www.rfc-editor.org#section-1-2)

At a high level, the Privacy Pass architecture consists of two protocols:
redemption and issuance. The redemption protocol, described in
[[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], runs between Clients and
Origins (servers). It allows Origins to challenge Clients to present tokens
for consumption. Origins verify the token to authenticate the Client -- without
learning any specific information about the Client -- and then make an authorization
decision on the basis of the token verifying successfully or not. Depending
on the type of token, e.g., whether or not it can be cached, the Client
either presents a previously obtained token or invokes an issuance protocol,
e.g., the protocols described in [[ISSUANCE](https://www.rfc-editor.org#RFC9578)], to acquire a token to
present as authorization.[¶](https://www.rfc-editor.org#section-1-3)

This document describes requirements for both redemption and issuance
protocols and how they interact. It also provides recommendations on how
the architecture should be deployed to ensure the privacy of Clients and
the security of all participating entities.[¶](https://www.rfc-editor.org#section-1-4)

##
[2. ](https://www.rfc-editor.org#section-2)[Terminology](https://www.rfc-editor.org#name-terminology)

The key words "MUST", "MUST NOT",
"REQUIRED", "SHALL",
"SHALL NOT", "SHOULD",
"SHOULD NOT",
"RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document
are to be interpreted as described in BCP 14
[[RFC2119](https://www.rfc-editor.org#RFC2119)] [[RFC8174](https://www.rfc-editor.org#RFC8174)] when, and only
when, they appear in all capitals, as shown here.[¶](https://www.rfc-editor.org#section-2-1)

The following terms are used throughout this document:[¶](https://www.rfc-editor.org#section-2-2)

- Client:
-
An entity that seeks authorization to an Origin. Using terminology from [

[RFC9334](https://www.rfc-editor.org#RFC9334)], Clients implement the Remote ATtestation procedureS (RATS) Attester role.[¶](https://www.rfc-editor.org#section-2-3.2.1) - Token:
-
A cryptographic authentication message used for authorization decisions, produced as output from an issuance mechanism or protocol.

[¶](https://www.rfc-editor.org#section-2-3.4.1) - Origin:
-
An entity that consumes tokens presented by Clients and uses them to make authorization decisions.

[¶](https://www.rfc-editor.org#section-2-3.6.1) - Token challenge:
-
The mechanism by which Origins request tokens from Clients, often denoted TokenChallenge.

[¶](https://www.rfc-editor.org#section-2-3.8.1) - Token request:
-
A message used by Clients to request a token from an Issuer, often denoted TokenRequest.

[¶](https://www.rfc-editor.org#section-2-3.10.1) - Token response:
-
A message used by Issuers to send tokens to a Client, often denoted TokenResponse.

[¶](https://www.rfc-editor.org#section-2-3.12.1) - Redemption:
-
The mechanism by which Clients present tokens to Origins for the purposes of authorization.

[¶](https://www.rfc-editor.org#section-2-3.14.1) - Issuer:
-
An entity that issues tokens to Clients for properties attested to by the Attester.

[¶](https://www.rfc-editor.org#section-2-3.16.1) - Issuance:
-
The mechanism by which an Issuer produces tokens for Clients.

[¶](https://www.rfc-editor.org#section-2-3.18.1) - Attester:
-
An entity that attests to properties of Clients for the purposes of token issuance. Using terminology from [

[RFC9334](https://www.rfc-editor.org#RFC9334)], Attesters implement the RATS Verifier role.[¶](https://www.rfc-editor.org#section-2-3.20.1) - Attestation procedure:
-
The procedure by which an Attester determines whether or not a Client has the specific set of properties that are necessary for token issuance.

[¶](https://www.rfc-editor.org#section-2-3.22.1)

The trust relationships between each of the entities in this list are further
elaborated upon in [Section 3.3](https://www.rfc-editor.org#privacy-and-trust).[¶](https://www.rfc-editor.org#section-2-4)

##
[3. ](https://www.rfc-editor.org#section-3)[Architecture](https://www.rfc-editor.org#name-architecture)

The Privacy Pass architecture consists of four logical entities --
Client, Origin, Issuer, and Attester -- that work in concert
for token redemption and issuance. This section presents an overview
of Privacy Pass, a high-level description of the threat model and
privacy goals of the architecture, and the goals and requirements of
the redemption and issuance protocols. Deployment variations for the
Origin, Issuer, and Attester in this architecture, including
considerations for implementing these entities, are further discussed
in [Section 4](https://www.rfc-editor.org#deployment).[¶](https://www.rfc-editor.org#section-3-1)

###
[3.1. ](https://www.rfc-editor.org#section-3.1)[Overview](https://www.rfc-editor.org#name-overview)

This section describes the typical interaction flow for Privacy Pass, as shown in [Figure 1](https://www.rfc-editor.org#fig-overview).[¶](https://www.rfc-editor.org#section-3.1-1)

###
[3.2. ](https://www.rfc-editor.org#section-3.2)[Use Cases](https://www.rfc-editor.org#name-use-cases)

Use cases for Privacy Pass are broad and depend greatly on the deployment model
as discussed in [Section 4](https://www.rfc-editor.org#deployment). The initial motivating use case for Privacy Pass
[[Privacy PassCloudflare](https://www.rfc-editor.org#PrivacyPassCloudflare)] was to help rate-limit malicious or otherwise abusive
traffic from services such as Tor [

[DMS2004](https://www.rfc-editor.org#DMS2004)]. The generalized and evolved architecture described in this document also works for this use case. However, for added clarity, some more possible use cases are described below.

[¶](https://www.rfc-editor.org#section-3.2-1)

###
[3.3. ](https://www.rfc-editor.org#section-3.3)[Privacy Goals and Threat Model](https://www.rfc-editor.org#name-privacy-goals-and-threat-mo)

The end-to-end flow for Privacy Pass described in [Section 3.1](https://www.rfc-editor.org#overview) involves three
different types of contexts:[¶](https://www.rfc-editor.org#section-3.3-1)

- Redemption context:
-
The interactions and set of information shared between the Client and Origin, i.e., the information that is provided or otherwise available to the Origin during redemption that might be used to identify a Client and construct a token challenge. This context includes all information associated with redemption, such as the timestamp of the event, Client-visible information (including the IP address), and the Origin name.

[¶](https://www.rfc-editor.org#section-3.3-2.2.1) - Issuance context:
-
The interactions and set of information shared between the Client, Attester, and Issuer, i.e., the information that is provided or otherwise available to the Attester and Issuer during issuance that might be used to identify a Client. This context includes all information associated with issuance, such as the timestamp of the event, any Client-visible information (including the IP address), and the Origin name (if revealed during issuance). This does not include the token challenge in its entirety, as that is kept secret from the Issuer during the issuance protocol.

[¶](https://www.rfc-editor.org#section-3.3-2.4.1) - Attestation context:
-
The interactions and set of information shared between the Client and Attester only, for the purposes of attesting the validity of the Client, that is provided or otherwise available during attestation that might be used to identify the Client. This context includes all information associated with attestation, such as the timestamp of the event and any Client-visible information, including information needed for the attestation procedure to complete.

[¶](https://www.rfc-editor.org#section-3.3-2.6.1)

The privacy goals of Privacy Pass assume a threat model in which Origins trust
specific Issuers to produce tokens, and Issuers in turn trust one or more
Attesters to correctly run the attestation procedure with Clients. This
arrangement ensures that tokens that validate for a given Issuer were only
issued to a Client that successfully completed attestation with an Attester
that the Issuer trusts. Moreover, this arrangement means that if an Origin
accepts tokens issued by an Issuer that trusts multiple Attesters, then a
Client can use any one of these Attesters to issue and redeem tokens for the
Origin. Whether or not these different entities in the architecture collude
for learning redemption, issuance, or attestation contexts, as well as the
necessary preconditions for context unlinkability, depends on the deployment
model; see [Section 4](https://www.rfc-editor.org#deployment) for more details.[¶](https://www.rfc-editor.org#section-3.3-3)

The mechanisms for establishing trust between each entity in this arrangement
are deployment specific. For example, in settings where Clients interact with
Issuers through an Attester, Attesters and Issuers might use
mutually authenticated TLS to authenticate one another. In settings where
Clients do not communicate with Issuers through an Attester, the Attesters
might convey this trust via a digital signature that Issuers can verify.[¶](https://www.rfc-editor.org#section-3.3-4)

Clients explicitly trust Attesters to perform attestation correctly and in a
way that does not violate their privacy. In particular, this means that Attesters
that may be privy to private information about Clients are trusted to not disclose
this information to non-colluding parties. Colluding parties are assumed to have
access to the same information; see [Section 4](https://www.rfc-editor.org#deployment) for more about different
deployment models and non-collusion assumptions. However, Clients assume that Issuers and
Origins are malicious.[¶](https://www.rfc-editor.org#section-3.3-5)

Given this threat model, the privacy goals of Privacy Pass are oriented around
unlinkability based on redemption, issuance, and attestation contexts, as
described below.[¶](https://www.rfc-editor.org#section-3.3-6)

These unlinkability properties ensure that only the Clients are able to correlate
information that might be used to identify them with activity on the Origin.
The Attester, Issuer, and Origin only receive the information necessary to perform
their respective functions.[¶](https://www.rfc-editor.org#section-3.3-8)

The manner in which these unlinkability properties are achieved depends on the
deployment model, type of attestation, and issuance protocol details. For example,
as discussed in [Section 4](https://www.rfc-editor.org#deployment), in some cases it is necessary to use an anonymization
service that hides Client IP addresses, such as Tor [[DMS2004](https://www.rfc-editor.org#DMS2004)]. In general,
anonymization services ensure that all Clients that use the service are indistinguishab[5](https://www.rfc-editor.org#deployment-considerations) and [6](https://www.rfc-editor.org#privacy) for more
information.[¶](https://www.rfc-editor.org#section-3.3-9)

Sections [3.4](https://www.rfc-editor.org#redemption) and [3.5](https://www.rfc-editor.org#issuance-protocol) describe the functional properties and security
requirements of the redemption and issuance protocols in more detail. [Section 3.6](https://www.rfc-editor.org#flow)
describes how information flows between the Issuer, Origin, Client, and Attester
through these protocols.[¶](https://www.rfc-editor.org#section-3.3-10)

###
[3.4. ](https://www.rfc-editor.org#section-3.4)[Redemption Protocol](https://www.rfc-editor.org#name-redemption-protocol)

The Privacy Pass redemption protocol, described in
[[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], is an authorization protocol
wherein Clients present tokens to Origins for authorization. Normally,
redemption is preceded by a challenge, wherein the Origin challenges
Clients for a token with a TokenChallenge ([[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], [Section 2.1](https://rfc-editor.org/rfc/rfc9577#section-2.1)) and,
if possible, Clients present a valid token ([[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], [Section 2.2](https://rfc-editor.org/rfc/rfc9577#section-2.2))
in reaction to the challenge. This interaction is shown below.[¶](https://www.rfc-editor.org#section-3.4-1)

Alternatively, when configured to do so, Clients may opportunistical[¶](https://www.rfc-editor.org#section-3.4-3)

The structure and semantics of the TokenChallenge and token messages depend
on the issuance protocol and token type being used; see [[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)] for
more information.[¶](https://www.rfc-editor.org#section-3.4-4)

The challenge provides the Client with the information necessary to obtain
tokens that the server might subsequently accept in the redemption context.
There are a number of ways in which the token may vary based on this challenge,
including the following:[¶](https://www.rfc-editor.org#section-3.4-5)

Origins that admit cross-Origin tokens bear some risk of allowing tokens
issued for one Origin to be spent in an interaction with another Origin.
In particular, cross-Origin tokens issued based on a challenge for
one Origin can be redeemed at another Origin in the cross-Origin set,
which can make it difficult to regulate token consumption. Depending on the
use case, Origins may need to maintain state to track redeemed tokens. For
example, Origins that accept cross-Origin tokens across shared redemption
contexts SHOULD track which tokens have already been redeemed in those
redemption contexts, since these tokens can be issued and then spent multiple
times for any such challenge. Note that Clients that redeem the
same token to multiple Origins do risk those Origins being able to link
Client activity together, which can disincentivize this behavior. See
[Section 2.1.1](https://rfc-editor.org/rfc/rfc9577#section-2.1.1) of [[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)] for discussion.[¶](https://www.rfc-editor.org#section-3.4-7)

How Clients respond to token challenges can have privacy implications.
For example, if an Origin allows the Client to choose an Issuer, then the choice
of Issuer can reveal information about the Client used to partition anonymity
sets; see [Section 6.2](https://www.rfc-editor.org#rotation-and-consistency) for more information about these privacy
considerations.[¶](https://www.rfc-editor.org#section-3.4-8)

###
[3.5. ](https://www.rfc-editor.org#section-3.5)[Issuance Protocol](https://www.rfc-editor.org#name-issuance-protocol)

The Privacy Pass issuance protocols, such as those described in [[ISSUANCE](https://www.rfc-editor.org#RFC9578)], are two-message
protocols that take as input a TokenChallenge from the redemption protocol
([[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], [Section 2.1](https://rfc-editor.org/rfc/rfc9577#section-2.1)) and produce a token
([[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)], [Section 2.2](https://rfc-editor.org/rfc/rfc9577#section-2.2)), as shown in [Figure 1](https://www.rfc-editor.org#fig-overview).[¶](https://www.rfc-editor.org#section-3.5-1)

The structure and semantics of the TokenRequest and TokenResponse messages
depend on the issuance protocol and token type being used; see [[ISSUANCE](https://www.rfc-editor.org#RFC9578)]
for more information.[¶](https://www.rfc-editor.org#section-3.5-2)

Clients interact with the Attester and Issuer to produce a token for
a challenge. The context in which an Attester vouches for a Client during
issuance is referred to as the attestation context. This context includes all
information associated with the issuance event, such as the timestamp of the
event and Client-visible information, including the IP address or other
information specific to the type of attestation done.[¶](https://www.rfc-editor.org#section-3.5-3)

Each issuance protocol may be different, e.g., in the number and types of
participants, underlying cryptographic constructions used when issuing tokens,
and even privacy properties.[¶](https://www.rfc-editor.org#section-3.5-4)

Clients initiate the issuance protocol using the token challenge, a randomly
generated nonce, and a public key for the Issuer, all of which are the Client's
private input to the protocol and ultimately bound to an output token;
see [Section 2.2](https://rfc-editor.org/rfc/rfc9577#section-2.2) of [[AUTHSCHEME](https://www.rfc-editor.org#RFC9577)] for details. Future specifications
may change or extend the Client's input to the issuance protocol to produce
tokens with a different structure.[¶](https://www.rfc-editor.org#section-3.5-5)

Token properties vary based on the issuance protocol. Important properties
supported in this architecture are described below.[¶](https://www.rfc-editor.org#section-3.5-6)

The issuance protocol itself can be any interactive protocol between the Client,
Issuer, or other parties that produces a valid token bound to the Client's
private input, subject to the following security requirements.[¶](https://www.rfc-editor.org#section-3.5-8)

See [Section 3.5.4](https://www.rfc-editor.org#extensions) for requirements on new issuance protocol variants and
related extensions.[¶](https://www.rfc-editor.org#section-3.5-10)

In the sections below, we describe the Attester and Issuer roles in more
detail.[¶](https://www.rfc-editor.org#section-3.5-11)

####
[3.5.1. ](https://www.rfc-editor.org#section-3.5.1)[Attester Role](https://www.rfc-editor.org#name-attester-role)

In Privacy Pass, attestation is the process by which an Attester bears
witness to, confirms, or authenticates a Client so as to verify properties
about the Client that are required for issuance. Issuers trust Attesters
to perform attestation correctly, i.e., to implement attestation procedures
in such a way that those procedures are not subverted or bypassed by malicious Clients.[¶](https://www.rfc-editor.org#section-3.5.1-1)

[[RFC9334](https://www.rfc-editor.org#RFC9334)] describes an architecture for attestation procedures. Using
that architecture as a conceptual basis, Clients are RATS Attesters that
produce attestation evidence, and Attesters are RATS Verifiers that
appraise the validity of attestation evidence.[¶](https://www.rfc-editor.org#section-3.5.1-2)

The type of attestation procedure is a deployment[¶](https://www.rfc-editor.org#section-3.5.1-3)

Attesters may support different types of attestation procedures.[¶](https://www.rfc-editor.org#section-3.5.1-5)

Each attestation procedure has different security properties. For
example, attesting to having a valid account is different from attesting to
running on trusted hardware. Supporting multiple attestation procedures is
an important step towards ensuring equitable access for Clients; see [Section 5.1](https://www.rfc-editor.org#discrimination).[¶](https://www.rfc-editor.org#section-3.5.1-6)

The role of the Attester in the issuance protocol and its impact on privacy
depend on the type of attestation procedure, issuance protocol, and deployment
model. For instance, increasing the number of required attestation procedures
could decrease the overall anonymity set size. As an example, the number of Clients
that have solved a CAPTCHA in the past day, that have a valid account, and that
are running on a trusted device is less than the number of Clients that have
solved a CAPTCHA in the past day. See [Section 6.2](https://www.rfc-editor.org#rotation-and-consistency) for more discussion
of how the variety of attestation procedures can negatively impact Client privacy.[¶](https://www.rfc-editor.org#section-3.5.1-7)

Depending on the issuance protocol, the Issuer might learn
information about the Origin. To ensure Issuer-Client unlinkability, the Issuer
should be unable to link that information to a specific Client. For such
issuance protocols where the Attester has access to Client-specific
information, such as is the case for attestation procedures that involve
Client-specific information (such as application[Section 4.2](https://www.rfc-editor.org#deploy-joint-issuer)), the Client does not need to explicitly
trust the Attester in this regard.[¶](https://www.rfc-editor.org#section-3.5.1-8)

Issuers trust Attesters to correctly and reliably perform attestation. However,
certain types of attestation procedures can vary in value over time, e.g., if the
attestation procedure is compromised. Broken
attestation procedures are considered exceptional events and require
configuration changes to address the underlying cause. For example, if
an attestation procedure is compromised or subverted because of a zero-day
exploit on devices that implement the attestation procedure, then the
corresponding attestation procedure should be untrusted until the exploit is
patched. Addressing changes in attestation quality is therefore a
deployment[Section 4.4](https://www.rfc-editor.org#deploy-split)), Issuers can choose to remove compromised Attesters from
their trusted set until the compromise is patched.[¶](https://www.rfc-editor.org#section-3.5.1-9)

From the perspective of an Origin, tokens produced by an Issuer with at least
one compromised Attester cannot be trusted, assuming that the Origin does not know
which attestation procedure was used for issuance. This is because the Origin
cannot distinguish between tokens that were issued via compromised Attesters
and tokens that were issued via uncompromised Attesters, absent some
distinguishing information in the tokens themselves or from the Issuer. As a
result, until the attestation procedure is fixed, the Issuer cannot be trusted
by Origins. Moreover, as a consequence, any tokens issued by an Issuer with a
compromised Attester may no longer be trusted by Origins, even if those tokens
were issued to Clients interacting with an uncompromised Attester.[¶](https://www.rfc-editor.org#section-3.5.1-10)

####
[3.5.2. ](https://www.rfc-editor.org#section-3.5.2)[Issuer Role](https://www.rfc-editor.org#name-issuer-role)

In Privacy Pass, the Issuer is responsible for completing the issuance protocol
for Clients that complete attestation through a trusted Attester. As described
in [Section 3.5.1](https://www.rfc-editor.org#attester), Issuers explicitly trust Attesters to correctly and reliably
perform attestation. Origins explicitly trust Issuers to only issue tokens
from trusted Attesters. Clients do not explicitly trust Issuers.[¶](https://www.rfc-editor.org#section-3.5.2-1)

Depending on the deployment model case, issuance may require some form of
Client anonymization service, similar to an IP-hiding proxy, so that Issuers
cannot learn information about Clients. This can be provided by an explicit
participant in the issuance protocol, or it can be provided via external means,
such as through the use of an IP-hiding proxy service like Tor [[DMS2004](https://www.rfc-editor.org#DMS2004)].
In general, Clients SHOULD minimize or remove identifying
information where possible when invoking the issuance protocol.[¶](https://www.rfc-editor.org#section-3.5.2-2)

Issuers are uniquely identifiable by all Clients with a consistent
identifier. In a web context, this identifier might be the Issuer hostname.
Issuers maintain one or more configurations, including issuance key pairs, for
use in the issuance protocol. Each configuration is assumed to have a unique
and canonical identifier, sometimes referred to as a key identifier or key ID.
Issuers can rotate these configurations as needed to mitigate the risk of compromise;
see [Section 6.2](https://www.rfc-editor.org#rotation-and-consistency) for more considerations around configuration
rotation. The Issuer Public Key for each active configuration is made available
to Origins and Clients for use in the issuance and redemption protocols.[¶](https://www.rfc-editor.org#section-3.5.2-3)

####
[3.5.3. ](https://www.rfc-editor.org#section-3.5.3)[Issuance Metadata](https://www.rfc-editor.org#name-issuance-metadata)

Certain instantiations of the issuance protocol may permit public or private
metadata to be cryptographical2(N) bits of metadata. Metadata may be public or private.[¶](https://www.rfc-editor.org#section-3.5.3-1)

Public metadata is metadata that Clients can observe as part of the token
issuance flow. Public metadata can be either transparent or opaque. For
example, transparent public metadata is a value that either the Client
generates itself or the Issuer provides during the issuance flow and that the
Client can check for correctness. Opaque public metadata is metadata
the Client can see but cannot check for correctness. As an example, the
opaque public metadata might be a "fraud detection signal", computed on
behalf of the Issuer, during token issuance. Generally speaking, Clients
cannot determine if this value is generated in a way that permits tracking.[¶](https://www.rfc-editor.org#section-3.5.3-2)

Private metadata is metadata that Clients cannot observe as part of the token
issuance flow. Such instantiations can be built on the private metadata bit
construction from Kreuter et al. [[KLOR20](https://www.rfc-editor.org#KLOR20)]
or the attribute-based Verifiable Oblivious Pseudorandom Function (VOPRF) from Huang et al. [[HIJK21](https://www.rfc-editor.org#HIJK21)].[¶](https://www.rfc-editor.org#section-3.5.3-3)

Metadata can be arbitrarily long or bounded in length. The amount of permitted
metadata may be determined by an application or by the underlying cryptographic
protocol. The total amount of metadata bits included in a token is the sum of
public and private metadata bits. Every bit of metadata can be used to
partition the Client issuance or redemption anonymity sets; see
[Section 6.1](https://www.rfc-editor.org#metadata-privacy) for more information.[¶](https://www.rfc-editor.org#section-3.5.3-4)

####
[3.5.4. ](https://www.rfc-editor.org#section-3.5.4)[Future Issuance Protocol Requirements](https://www.rfc-editor.org#name-future-issuance-protocol-re)

The Privacy Pass architecture and ecosystem are both intended to be receptive
to extensions that expand the current set of functionalities through new
issuance protocols. Each new issuance protocol and extension MUST adhere
to the following requirements:[¶](https://www.rfc-editor.org#section-3.5.4-1)

###
[3.6. ](https://www.rfc-editor.org#section-3.6)[Information Flow](https://www.rfc-editor.org#name-information-flow)

The end-to-end process of redemption and issuance protocols involves information
flowing between the Issuer, Origin, Client, and Attester. That information can
have implications on the privacy goals that Privacy Pass aims to provide
as outlined in [Section 3.3](https://www.rfc-editor.org#privacy-and-trust). In this section, we describe the flow
of information between each party. How this information affects the privacy
goals in particular deployment models is further discussed in [Section 4](https://www.rfc-editor.org#deployment).[¶](https://www.rfc-editor.org#section-3.6-1)

####
[3.6.1. ](https://www.rfc-editor.org#section-3.6.1)[Token Challenge Flow](https://www.rfc-editor.org#name-token-challenge-flow)

To use Privacy Pass, Origins choose an Issuer from which they are willing to
accept tokens. Origins then construct a token challenge using this specified
Issuer and information from the redemption context it shares with the Client.
This token challenge is then delivered to a Client. The token challenge conveys
information about the Issuer and the redemption context, such as whether the
Origin desires a per-Origin or cross-Origin token. Any entity that sees
the token challenge might learn things about the Client as known to the Origin.
This is why input secrecy is a requirement for issuance protocols, as it
ensures that the challenge is not directly available to the Issuer.[¶](https://www.rfc-editor.org#section-3.6.1-1)

####
[3.6.2. ](https://www.rfc-editor.org#section-3.6.2)[Attestation Flow](https://www.rfc-editor.org#name-attestation-flow)

Clients interact with the Attester to prove that they meet some required
set of properties. In doing so, Clients contribute information to the
attestation context, which might include sensitive information such as
application[¶](https://www.rfc-editor.org#section-3.6.2-1)

####
[3.6.3. ](https://www.rfc-editor.org#section-3.6.3)[Issuance Flow](https://www.rfc-editor.org#name-issuance-flow)

Clients use the issuance protocol to produce a token bound to a token
challenge. In doing so, there are several ways in which the issuance protocol
contributes information to the attestation or issuance contexts. For example, a
token request may contribute information to the attestation or issuance
contexts as described below.[¶](https://www.rfc-editor.org#section-3.6.3-1)

Moreover, a token may contribute information to the issuance attestation or
contexts as described below.[¶](https://www.rfc-editor.org#section-3.6.3-3)

Exceptional cases in the issuance protocol, such as when either the
Attester or Issuer aborts the protocol, can contribute information to the
attestation or issuance contexts. The extent to which information in this
context harms the Issuer-Client or Attester-Origin unlinkability goals as discussed in
[Section 3.3](https://www.rfc-editor.org#privacy-and-trust) depends on the deployment model; see [Section 4](https://www.rfc-editor.org#deployment).
Clients can choose whether or not to contribute information to these contexts
based on local policy or preference.[¶](https://www.rfc-editor.org#section-3.6.3-5)

####
[3.6.4. ](https://www.rfc-editor.org#section-3.6.4)[Token Redemption Flow](https://www.rfc-editor.org#name-token-redemption-flow)

Clients send tokens to Origins during the redemption protocol. Any information
that is added to the token during issuance can therefore be sent to the Origin.
Information can be either (1) explicitly passed in a token or (2) implicit
in the way the Client responds to a token challenge. For example, if a Client
fails to complete issuance and consequently fails to redeem a token for
a token challenge, this can reveal information to the Origin that
it might not otherwise have access to. However, an Origin cannot necessarily
distinguish between a Client that fails to complete issuance and one that
ignores the token challenge altogether.[¶](https://www.rfc-editor.org#section-3.6.4-1)

##
[4. ](https://www.rfc-editor.org#section-4)[Deployment Models](https://www.rfc-editor.org#name-deployment-models)

The Origin, Attester, and Issuer portrayed in [Figure 1](https://www.rfc-editor.org#fig-overview) can be
instantiated and deployed in a number of ways. The deployment model directly
influences the manner in which attestation, issuance, and redemption contexts
are separated to achieve Origin-Client, Issuer-Client, and Attester-Origin
unlinkability.[¶](https://www.rfc-editor.org#section-4-1)

This section covers some expected deployment models and their corresponding
security and privacy considerations. Each deployment model is described in
terms of the trust relationships and communication patterns between the Client,
Attester, Issuer, and Origin. Entities drawn within the same bounding box are
assumed to be operated by the same party and are therefore able to collude.
Collusion can enable linking of attestation, issuance, and redemption contexts.
Entities not drawn within the same bounding box (i.e., operated by separate parties) are assumed to not collude. Mechanisms for enforcing non-collusion are out of scope for this architecture.[¶](https://www.rfc-editor.org#section-4-2)

###
[4.2. ](https://www.rfc-editor.org#section-4.2)[Joint Attester and Issuer](https://www.rfc-editor.org#name-joint-attester-and-issuer)

In this model, the Attester and Issuer are operated by the same entity,
separate from the Origin. The Origin trusts the joint Attester
and Issuer to perform attestation and issue tokens. Clients interact
with the joint Attester and Issuer for attestation and issuance. This
arrangement is shown in [Figure 4](https://www.rfc-editor.org#fig-deploy-joint-issuer).[¶](https://www.rfc-editor.org#section-4.2-1)

This model is useful if an Origin wants to offload attestation and issuance to
a trusted entity. In this model, the Attester and Issuer share an attestation
and issuance context for the Client, separate from the Origin's
redemption context.[¶](https://www.rfc-editor.org#section-4.2-3)

Similar to the shared Origin, Attester, Issuer model, Issuer-Client and
Origin-Client unlinkability in this model requires that issuance and redemption
events, respectively, be separated over time or space. Attester-Origin
unlinkability requires that the Attester and Issuer do not learn the Origin
for a particular token request. For this reason, issuance protocols that
require the Issuer to learn information about the Origin, such as the issuance protocol described in [[RATE-LIMITED](https://www.rfc-editor.org#I-D.ietf-privacypass-rate-limit-tokens)], are not
appropriate, since they could lead to Attester-Origin unlinkability violations
through the Origin name.[¶](https://www.rfc-editor.org#section-4.2-4)

###
[4.3. ](https://www.rfc-editor.org#section-4.3)[Joint Origin and Issuer](https://www.rfc-editor.org#name-joint-origin-and-issuer)

In this model, the Origin and Issuer are operated by the same entity, separate
from the Attester, as shown in [Figure 5](https://www.rfc-editor.org#fig-deploy-joint-origin). The Issuer accepts token
requests that come from trusted Attesters. Since the Attester and Issuer are
separate entities, this model requires some mechanism by which Issuers
establish trust in the Attester (as described in [Section 3.3](https://www.rfc-editor.org#privacy-and-trust)).
For example, in settings where the Attester is a Client-trusted service that
directly communicates with the Issuer, one way to establish this trust is via
mutually authenticated TLS. However, alternative authentication mechanisms are
possible. In this model, the Origin and Issuer are operated by the same entity, separate from the Attester, as shown in the figure below.[¶](https://www.rfc-editor.org#section-4.3-1)

This model is useful for Origins that require Client[¶](https://www.rfc-editor.org#section-4.3-3)

In this model, attestation contexts are separate from Issuer and redemption
contexts. As a result, any type of attestation is suitable in this model.[¶](https://www.rfc-editor.org#section-4.3-4)

Moreover, assuming that there is more than one Origin involved, any type of token challenge is suitable, since no single party will have access to the identifying
Client information and unique Origin information. Issuers that produce tokens
for a single Origin are not suitable in this model, since an Attester can
infer the Origin from a token request, as described in [Section 3.6.3](https://www.rfc-editor.org#issue-flow). However,
since the issuance protocol provides input secrecy, the Attester does not learn
details about the corresponding token challenge, such as whether the token
challenge is per Origin or across Origins.[¶](https://www.rfc-editor.org#section-4.3-5)

###
[4.4. ](https://www.rfc-editor.org#section-4.4)[Split Origin, Attester, Issuer](https://www.rfc-editor.org#name-split-origin-attester-issue)

In this model, the Origin, Attester, and Issuer are all operated by different
entities. As with the Joint Origin and Issuer model ([Section 4.3](https://www.rfc-editor.org#deploy-joint-origin)), the Issuer accepts token
requests that come from trusted Attesters, and the details of that trust
establishment depend on the issuance protocol and relationship between the
Attester and Issuer; see [Section 3.3](https://www.rfc-editor.org#privacy-and-trust). This arrangement is shown
in [Figure 1](https://www.rfc-editor.org#fig-overview).[¶](https://www.rfc-editor.org#section-4.4-1)

This is the most general deployment model and is necessary for some
types of issuance protocols where the Attester plays a role in token
issuance; see [[RATE-LIMITED](https://www.rfc-editor.org#I-D.ietf-privacypass-rate-limit-tokens)] for one such type of issuance protocol.[¶](https://www.rfc-editor.org#section-4.4-2)

In this model, the Attester, Issuer, and Origin have a separate view
of the Client: the Attester sees potentially sensitive Client[¶](https://www.rfc-editor.org#section-4.4-3)

As with the Joint Origin and Issuer model ([Section 4.3](https://www.rfc-editor.org#deploy-joint-origin)), and as
described in [Section 3.6.3](https://www.rfc-editor.org#issue-flow), if the Issuer produces tokens for a single Origin,
then per-Origin tokens are not appropriate, since the Attester can infer the
Origin from a token request.[¶](https://www.rfc-editor.org#section-4.4-4)

##
[5. ](https://www.rfc-editor.org#section-5)[Deployment Considerations](https://www.rfc-editor.org#name-deployment-considerations)

[Section 4](https://www.rfc-editor.org#deployment) discusses deployment models that are possible in practice.
Beyond possible implications on security and privacy properties of the
resulting system, Privacy Pass deployments can impact the overall ecosystem
in two important ways: (1) discriminatory treatment of Clients and the gated
access to otherwise open services and (2) centralization. This section
describes considerations relevant to these topics.[¶](https://www.rfc-editor.org#section-5-1)

###
[5.1. ](https://www.rfc-editor.org#section-5.1)[Discriminatory Treatment](https://www.rfc-editor.org#name-discriminatory-treatment)

Origins can use tokens as a signal for distinguishing between (1) Clients
that are capable of completing attestation with one Attester trusted by the
Origin's chosen Issuer and (2) Clients that are not capable of doing the same. A
consequence of this is that Privacy Pass could enable discriminatory treatment
of Clients based on attestation support. For example, an Origin could only
authorize Clients that successfully authenticate with a token, prohibiting access
to all other Clients.[¶](https://www.rfc-editor.org#section-5.1-1)

The types of attestation procedures supported for a particular deployment depend
greatly on the use case. For example, consider a proprietary deployment of Privacy Pass
that authorizes Clients to access a resource such as an anonymization service. In this
context, it is reasonable to support specific types of attestation procedures that
demonstrate that Clients can access the resource, such as with an account or specific
type of device. However, in open deployments of Privacy Pass that are used to
safeguard access to otherwise open or publicly accessible resources, diversity
in attestation procedures is critically important so as to not discriminate against
Clients that choose certain software, hardware, or identity providers.[¶](https://www.rfc-editor.org#section-5.1-2)

In principle, Issuers should strive to mitigate discriminatory behavior by
providing equitable access to all Clients. This can be done by working with a
set of Attesters that are suitable for all Clients. In practice, this may require
trade-offs in what type of attestation Issuers are willing to trust so as to
enable more widespread support. In other words, trusting a variety of Attesters
with a diverse set of attestation procedures would presumably increase support
among Clients, though most likely at the expense of decreasing the overall value
of tokens issued by the Issuer.[¶](https://www.rfc-editor.org#section-5.1-3)

For example, to disallow discriminatory behavior between Clients with and
without device attestation support, an Issuer may wish to support Attesters
that support CAPTCHA-based attestation. This means that the overall attestation
value of a Privacy Pass token is bound by the difficulty in spoofing or
bypassing either one of these attestation procedures.[¶](https://www.rfc-editor.org#section-5.1-4)

###
[5.2. ](https://www.rfc-editor.org#section-5.2)[Centralization](https://www.rfc-editor.org#name-centralization)

A consequence of limiting the number of participants (Attesters or Issuers) in
Privacy Pass deployments for meaningful privacy is that it forces concentrated
centralization among those participants.
[[CENTRALIZATION](https://www.rfc-editor.org#RFC9518)] discusses
several ways in which this might be mitigated. For example, a multi[¶](https://www.rfc-editor.org#section-5.2-1)

Alternatively, Privacy Pass deployments might mitigate this problem through
implementation. For example, rather than centralize the role of attestation
in one or a few entities, attestation could be a distributed function performed
by a quorum of many parties, provided that neither Issuers nor Origins learn
which Attester implementations were chosen. As a result, Clients could have
more opportunities to switch between attestation participants.[¶](https://www.rfc-editor.org#section-5.2-2)

##
[6. ](https://www.rfc-editor.org#section-6)[Privacy Considerations](https://www.rfc-editor.org#name-privacy-considerations)

The previous section discusses the impact of deployment details on
Origin-Client, Issuer-Client, and Attester-Origin unlinkability.
The value these properties afford to end users depends on
the size of anonymity sets in which Clients or Origins are
unlinkable. For example, consider two different deployments, one wherein
there exists a redemption anonymity set of size two and another
wherein there exists a redemption anonymity set of size 232. Although
Origin-Client unlinkability guarantees that the Origin cannot link any two
requests to the same Client based on these contexts, respectively, the
smaller these sets become, the higher the probability of determining the "true" Client.[¶](https://www.rfc-editor.org#section-6-1)

In practice, there are a number of ways in which the size of anonymity sets
may be reduced or partitioned, though they all center around the concept of
consistency. In particular, by definition, all Clients in an anonymity set
share a consistent view of information needed to run the issuance and
redemption protocols. The Issuer Public Key is an example of the type of information needed to run these protocols. When two Clients have inconsistent
information, these Clients effectively have different redemption contexts and
therefore belong in different anonymity sets.[¶](https://www.rfc-editor.org#section-6-2)

The following subsections discuss issues that can influence anonymity set size.
For each issue, we discuss mitigations or safeguards to protect against the
underlying problem.[¶](https://www.rfc-editor.org#section-6-3)

###
[6.1. ](https://www.rfc-editor.org#section-6.1)[Partitioning by Issuance Metadata](https://www.rfc-editor.org#name-partitioning-by-issuance-me)

Any public or private metadata bits of information can be used to further
segment the size of the Client anonymity set. Any Issuer that wanted to
track a single Client could add a single metadata bit to Client tokens. For
the tracked Client, it would set the bit to `1`

, and `0`

otherwise. Adding
additional bits provides an exponential increase in tracking granularity
in a manner similar to introducing more Issuers (though with more potential targeting).[¶](https://www.rfc-editor.org#section-6.1-1)

For this reason, deployments should take the amount of metadata used by an Issuer
in creating tokens, together with the bits of information that Issuers may learn about Clients through other means, into account. Since this
metadata may be useful for practical deployments of Privacy Pass, Issuers
must balance this against the reduction in Client privacy.[¶](https://www.rfc-editor.org#section-6.1-2)

The number of permitted metadata values often depends on deployment[¶](https://www.rfc-editor.org#section-6.1-3)

###
[6.2. ](https://www.rfc-editor.org#section-6.2)[Partitioning by Issuance Consistency](https://www.rfc-editor.org#name-partitioning-by-issuance-co)

Anonymity sets can be partitioned by information used for the issuance
protocol, including metadata, Issuer configuration (keys), and Issuer
selection.[¶](https://www.rfc-editor.org#section-6.2-1)

Any issuance metadata bits of information can be used to partition the Client
anonymity set. For example, any Issuer that wanted to track a single Client
could add a single metadata bit to Client tokens. For the tracked Client, it
would set the bit to `1`

, and `0`

otherwise. Adding additional bits provides an
exponential increase in tracking granularity in a manner similar to introducing more
Issuers (though with more potential targeting).[¶](https://www.rfc-editor.org#section-6.2-2)

The number of active Issuer configurations also contributes to anonymity set
partitioning. In particular, when an Issuer updates their configuration and
the corresponding key pair, any Client that invokes the issuance protocol with
this configuration becomes part of a set of Clients that also ran the
issuance protocol using the same configuration. Issuer configuration updates,
e.g., due to key rotation, are an important part of hedging against long-term
private key compromise. In general, key rotations represent a trade-off between
Client privacy and Issuer security. Therefore, it is important that key
rotations occur on a regular cycle to reduce the harm of an Issuer key
compromise.[¶](https://www.rfc-editor.org#section-6.2-3)

Lastly, if Clients are willing to issue and redeem tokens from a large number
of Issuers for a specific Origin and that Origin accepts tokens from all
Issuers, partitioning can occur. As an example, if a Client obtains tokens from
many Issuers and an Origin later challenges that Client for a token from each
Issuer, the Origin can learn information about the Client. This arrangement
might happen if Clients request tokens from different Issuers, each of which
has different Attester preferences. Each per-Issuer token that a Client holds
essentially corresponds to a bit of information about the Client that the Origin
learns. Therefore, there is an exponential loss in privacy relative to the
number of Issuers.[¶](https://www.rfc-editor.org#section-6.2-4)

The fundamental problem here is that the number of possible issuance
configurations, including the keys in use and the Issuer identities themselves,
can partition the Client anonymity set. To mitigate this problem, Clients
SHOULD bound the number of active issuance configurations per Origin as well as
across Origins. Moreover, Clients SHOULD employ some form of consistency
mechanism to ensure that they receive the same configuration information and
are not being actively partitioned into smaller anonymity sets. See
[[CONSISTENCY](https://www.rfc-editor.org#I-D.ietf-privacypass-key-consistency)] for possible consistency
mechanisms. Depending on the deployment, the Attester might assist the Client
in applying these consistency checks across Clients. Failure to apply a
consistency check can allow Client-specific keys to violate Origin-Client
unlinkability.[¶](https://www.rfc-editor.org#section-6.2-5)

###
[6.3. ](https://www.rfc-editor.org#section-6.3)[Partitioning by Side Channels](https://www.rfc-editor.org#name-partitioning-by-side-channe)

Side-channel attacks, such as those based on timing correlation, could be
used to reduce anonymity set size. In particular,
for interactive tokens that are bound to a Client-specific redemption
context, the anonymity set of Clients during the issuance protocol consists
of those Clients that started issuance between the time of the Origin's
challenge and the corresponding token redemption. Depending on the number
of Clients using a particular Issuer during that time window, the set can
be small. Applications should take such side channels into consideration before
choosing a particular deployment model and type of token challenge and
redemption context.[¶](https://www.rfc-editor.org#section-6.3-1)

##
[7. ](https://www.rfc-editor.org#section-7)[Security Considerations](https://www.rfc-editor.org#name-security-considerations)

This document describes security and privacy requirements for the Privacy Pass
redemption and issuance protocols. It also describes deployment models built
around non-collusion assumptions and privacy considerations for using Privacy
Pass within those models. Ensuring Client privacy -- separation of attestation
and redemption contexts -- requires active work on behalf of the Client,
especially in the presence of malicious Issuers and Origins. Implementing the
mitigations discussed in Sections [4](https://www.rfc-editor.org#deployment) and [6](https://www.rfc-editor.org#privacy) is therefore necessary
to ensure that Privacy Pass offers meaningful privacy improvements to end users.[¶](https://www.rfc-editor.org#section-7-1)

###
[7.1. ](https://www.rfc-editor.org#section-7.1)[Token Caching](https://www.rfc-editor.org#name-token-caching)

Depending on the Origin's token challenge, Clients can request and cache more
than one token using an issuance protocol. Cached tokens help improve privacy by
separating the time of token issuance from the time of token redemption; they
also allow Clients to reduce the overhead of receiving new tokens via the
issuance protocol.[¶](https://www.rfc-editor.org#section-7.1-1)

As a consequence, Origins that send token challenges that are compatible with
cached tokens need to take precautions to ensure that tokens are not replayed.
This is typically done via keeping track of tokens that are redeemed for the
period of time in which cached tokens would be accepted for particular
challenges.[¶](https://www.rfc-editor.org#section-7.1-2)

Moreover, since tokens are not intrinsically bound to Clients, it is possible
for malicious Clients to collude and share tokens in a so-called "hoarding
attack". As an example of this attack, many distributed Clients could obtain
cacheable tokens and then share them with a single Client to redeem the tokens in a way
that would violate an Origin's attempt to limit tokens to any one particular
Client. In general, mechanisms for mitigating hoarding attacks depend on the
deployment model and use case. For example, in the Joint Origin and Issuer model,
comparing the issuance and redemption contexts can help detect hoarding attacks,
i.e., if the distribution of redemption contexts is noticeably different from the
distribution of issuance contexts. Rate-limiting issuance, at either the Client,
Attester, or Issuer, can also help mitigate these attacks.[¶](https://www.rfc-editor.org#section-7.1-3)

##
[8. ](https://www.rfc-editor.org#section-8)[IANA Considerations](https://www.rfc-editor.org#name-iana-considerations)

This document has no IANA actions.[¶](https://www.rfc-editor.org#section-8-1)

##
[9. ](https://www.rfc-editor.org#section-9)[References](https://www.rfc-editor.org#name-references)

###
[9.1. ](https://www.rfc-editor.org#section-9.1)[Normative References](https://www.rfc-editor.org#name-normative-references)

- [AUTHSCHEME]
-
Pauly, T., Valdez, S., and C. A. Wood, "The Privacy Pass HTTP Authentication Scheme", RFC 9577, DOI 10
.17487 , , </RFC9577 [https://](https://www.rfc-editor.org/info/rfc9577)>.www .rfc -editor .org /info /rfc9577 - [RFC2119]
-
Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10
.17487 , , </RFC2119 [https://](https://www.rfc-editor.org/info/rfc2119)>.www .rfc -editor .org /info /rfc2119 - [RFC8174]
-
Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10
.17487 , , </RFC8174 [https://](https://www.rfc-editor.org/info/rfc8174)>.www .rfc -editor .org /info /rfc8174

###
[9.2. ](https://www.rfc-editor.org#section-9.2)[Informative References](https://www.rfc-editor.org#name-informative-references)

- [CENTRALIZATION]
-
Nottingham, M., "Centralization, Decentralizatio
n, and Internet Standards" , RFC 9518, DOI 10.17487 , , </RFC9518 [https://](https://www.rfc-editor.org/info/rfc9518)>.www .rfc -editor .org /info /rfc9518 - [CONSISTENCY]
-
Davidson, A., Finkel, M., Thomson, M., and C. A. Wood, "Key Consistency and Discovery", Work in Progress, Internet-Draft, draft
-ietf , , <-privacypass -key -consistency -01 [https://](https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-key-consistency-01)>.datatracker .ietf .org /doc /html /draft -ietf -privacypass -key -consistency -01 - [DMS2004]
-
Dingledine, R., Mathewson, N., and P. Syverson, "Tor: The Second
-Generation Onion Router" , , <[https://](https://svn.torproject.org/svn/projects/design-paper/tor-design.html)>.svn .torproject .org /svn /projects /design -paper /tor -design .html - [HIJK21]
-
Huang, S., Iyengar, S., Jeyaraman, S., Kushwah, S., Lee, C-K., Luo, Z., Mohassel, P., Raghunathan, A., Shaikh, S., Sung, Y-C., and A. Zhang, "DIT: De-Identified Authenticated Telemetry at Scale", , <
[https://](https://research.fb.com/privatestats)>.research .fb .com /privatestats - [ISSUANCE]
-
Celi, S., Davidson, A., Valdez, S., and C. A. Wood, "Privacy Pass Issuance Protocols", RFC 9578, DOI 10
.17487 , , </RFC9578 [https://](https://www.rfc-editor.org/info/rfc9578)>.www .rfc -editor .org /info /rfc9578 - [KLOR20]
-
Kreuter, B., Lepoint, T., Orrù, M., Raykova, M., and Springer International Publishing, "Anonymous Tokens with Private Metadata Bit", Advances in Cryptology - CRYPTO 2020, pp. 308-336, DOI 10
.1007 , , </978 -3 -030 -56784 -2 _11 [https://](https://doi.org/10.1007/978-3-030-56784-2_11)>.doi .org /10 .1007 /978 -3 -030 -56784 -2 _11 - [OHTTP]
-
Thomson, M. and C. A. Wood, "Oblivious HTTP", RFC 9458, DOI 10
.17487 , , </RFC9458 [https://](https://www.rfc-editor.org/info/rfc9458)>.www .rfc -editor .org /info /rfc9458 - [Privacy
Pass Cloudflare] -
Sullivan, N., "Cloudflare supports Privacy Pass", , <
[https://](https://blog.cloudflare.com/cloudflare-supports-privacy-pass/)>.blog .cloudflare .com /cloudflare -supports -privacy -pass / - [RATE-LIMITED]
-
Hendrickson, S., Iyengar, J., Pauly, T., Valdez, S., and C. A. Wood, "Rate-Limited Token Issuance Protocol", Work in Progress, Internet-Draft, draft
-ietf , , <-privacypass -rate -limit -tokens -06 [https://](https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-rate-limit-tokens-06)>.datatracker .ietf .org /doc /html /draft -ietf -privacypass -rate -limit -tokens -06 - [RFC9334]
-
Birkholz, H., Thaler, D., Richardson, M., Smith, N., and W. Pan, "Remote ATtestation procedureS (RATS) Architecture", RFC 9334, DOI 10
.17487 , , </RFC9334 [https://](https://www.rfc-editor.org/info/rfc9334)>.www .rfc -editor .org /info /rfc9334

##
[Acknowledgements](https://www.rfc-editor.org#name-acknowledgements)

The authors would like to thank Eric Kinnear, Scott Hendrickson, Tommy Pauly,
Christopher Patton, Benjamin Schwartz, Martin Thomson, Steven Valdez, and other
contributors of the Privacy Pass Working Group for many helpful contributions
to this document.[¶](https://www.rfc-editor.org#appendix-A-1)
