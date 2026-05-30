---
url: https://www.rfc-editor.org/rfc/rfc9458
title: RFC 9458: Oblivious HTTP | RFC Editor
fetched_at: 2026-05-30T15:43:03
content_hash: sha1:8462838e9bdd86170287641ff581562568ce1d05
extractor: trafilatura
---

# RFC 9458: Oblivious HTTP

- M. Thomson,
- C. A. Wood

[RFC Tips](https://www.rfc-editor.org/series/rfc-tips/)

[Abstract](https://www.rfc-editor.org#abstract)

This document describes Oblivious HTTP, a protocol for forwarding encrypted HTTP messages.
Oblivious HTTP allows a client to make multiple requests to an origin server without that server
being able to link those requests to the client or to identify the requests as having come from the
same client, while placing only limited trust in the nodes used to forward the messages.[¶](https://www.rfc-editor.org#section-abstract-1)

##
[Status of This Memo](https://www.rfc-editor.org#name-status-of-this-memo)

This is an Internet Standards Track document.[¶](https://www.rfc-editor.org#section-boilerplate.1-1)

This document is a product of the Internet Engineering Task Force
(IETF). It represents the consensus of the IETF community. It has
received public review and has been approved for publication by
the Internet Engineering Steering Group (IESG). Further
information on Internet Standards is available in Section 2 of
RFC 7841.[¶](https://www.rfc-editor.org#section-boilerplate.1-2)

Information about the current status of this document, any
errata, and how to provide feedback on it may be obtained at
[https:// www.rfc-editor.org/info/rfc9458](https://www.rfc-editor.org/info/rfc9458).

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

HTTP requests reveal information about client identities to servers. While the
actual content of the request message is under the control of the client, other
information that is more difficult to control can still be used to identify the
client.[¶](https://www.rfc-editor.org#section-1-1)

Even where an IP address is not directly associated with an individual, the
requests made from it can be correlated over time to assemble a profile of
client behavior. In particular, connection reuse improves performance but
provides servers with the ability to link requests that share a connection.[¶](https://www.rfc-editor.org#section-1-2)

In particular, the source IP address of the underlying connection reveals
identifying information that the client has only limited control over. While
client[¶](https://www.rfc-editor.org#section-1-3)

To overcome these limitations, this document defines Oblivious HTTP, a protocol
for encrypting and sending HTTP messages from a client to a gateway. This uses a
trusted relay service in a manner that mitigates the use of metadata such as IP
address and connection information for client identification, with reasonable
performance characteristics[¶](https://www.rfc-editor.org#section-1-4)

The combination of encapsulation and relaying ensures that Oblivious Gateway
Resource never sees the Client's IP address and that the Oblivious Relay
Resource never sees plaintext HTTP message content.[¶](https://www.rfc-editor.org#section-1-6)

Oblivious HTTP allows connection reuse between the Client and Oblivious Relay
Resource, as well as between that relay and the Oblivious Gateway Resource, so this
scheme represents a performance improvement over using just one request in each
connection. With limited trust placed in the Oblivious Relay Resource (see
[Section 6](https://www.rfc-editor.org#security)), Clients are assured that requests are not uniquely attributed to
them or linked to other requests.[¶](https://www.rfc-editor.org#section-1-7)

##
[2. ](https://www.rfc-editor.org#section-2)[Overview](https://www.rfc-editor.org#name-overview)

An Oblivious HTTP [Client](https://www.rfc-editor.org#dfn-client) must initially know the following:[¶](https://www.rfc-editor.org#section-2-1)

This information allows the Client to send HTTP requests to the Oblivious
Gateway Resource for forwarding to a Target Resource. The Oblivious Gateway
Resource does not learn the Client's IP address or any other identifying
information that might be revealed from the Client at the transport layer, nor
does the Oblivious Gateway Resource learn which of the requests it receives are
from the same Client.[¶](https://www.rfc-editor.org#section-2-3)

In order to forward a request for a [Target Resource](https://www.rfc-editor.org#dfn-target) to the [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway), the following steps occur, as shown in [Figure 1](https://www.rfc-editor.org#fig-overview):[¶](https://www.rfc-editor.org#section-2-5)

The Oblivious Gateway Resource then handles the HTTP request. This typically
involves making an HTTP request using the content of the Encapsulated Request. Once the
Oblivious Gateway Resource has an HTTP response for this request, the following
steps occur to return this response to the Client:[¶](https://www.rfc-editor.org#section-2-7)

This interaction provides authentication and confidentiality protection between
the Client and the Oblivious Gateway, but importantly not between the Client and
the Target Resource. While the Target Resource is a distinct HTTP resource from
the Oblivious Gateway Resource, they are both logically under the control of the
Oblivious Gateway, since the Oblivious Gateway Resource can unilaterally dictate
the responses returned from the Target Resource to the Client. This arrangement
is shown in [Figure 1](https://www.rfc-editor.org#fig-overview).[¶](https://www.rfc-editor.org#section-2-9)

###
[2.1. ](https://www.rfc-editor.org#section-2.1)[Applicability](https://www.rfc-editor.org#name-applicability)

Oblivious HTTP has limited applicability. Importantly, it requires explicit
support from a willing [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) and [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway),
thereby limiting the use of Oblivious HTTP for generic applications;
see [Section 6.3](https://www.rfc-editor.org#server-responsibilities) for more information.[¶](https://www.rfc-editor.org#section-2.1-1)

Many uses of HTTP benefit from being able to carry state between requests, such
as with cookies [[COOKIES](https://www.rfc-editor.org#COOKIES)], authentication ([Section 11](https://rfc-editor.org/rfc/rfc9110#section-11) of [[HTTP](https://www.rfc-editor.org#HTTP)]), or even
alternative services [[RFC7838](https://www.rfc-editor.org#RFC7838)]. Oblivious HTTP removes linkage at the
transport layer, which is only useful for an application that does not carry
state between requests.[¶](https://www.rfc-editor.org#section-2.1-2)

Oblivious HTTP is primarily useful where the privacy risks associated with
possible stateful treatment of requests are sufficiently large that the cost of
deploying this protocol can be justified. Oblivious HTTP is simpler and less
costly than more robust systems, like Prio [[PRIO](https://www.rfc-editor.org#PRIO)] or Tor [[DMS2004](https://www.rfc-editor.org#DMS2004)], which
can provide stronger guarantees at higher operational costs.[¶](https://www.rfc-editor.org#section-2.1-3)

Oblivious HTTP is more costly than a direct connection to a server. Some costs,
like those involved with connection setup, can be amortized, but there are
several ways in which Oblivious HTTP is more expensive than a direct request:[¶](https://www.rfc-editor.org#section-2.1-4)

Examples of where preventing the linking of requests might justify these costs
include:[¶](https://www.rfc-editor.org#section-2.1-6)

- DNS queries:
-
DNS queries made to a recursive resolver reveal information about the requester, particularly if linked to other queries.

[¶](https://www.rfc-editor.org#section-2.1-7.2.1) - Telemetry submission:
-
Applications that submit reports about their usage to their developers might use Oblivious HTTP for some types of moderately sensitive data.

[¶](https://www.rfc-editor.org#section-2.1-7.4.1)

These are examples of requests where there is information in a request that --
if it were connected to the identity of the user -- might allow a server to
learn something about that user even if the identity of the user were
pseudonymous. Other examples include submitting anonymous surveys, making
search queries, or requesting location[¶](https://www.rfc-editor.org#section-2.1-8)

In addition to these limitations, [Section 6](https://www.rfc-editor.org#security) describes operational constraints
that are necessary to realize the goals of the protocol.[¶](https://www.rfc-editor.org#section-2.1-9)

###
[2.2. ](https://www.rfc-editor.org#section-2.2)[Conventions and Definitions](https://www.rfc-editor.org#name-conventions-and-definitions)

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document are to be interpreted as
described in BCP 14 [[RFC2119](https://www.rfc-editor.org#RFC2119)] [[RFC8174](https://www.rfc-editor.org#RFC8174)] when, and only when, they
appear in all capitals, as shown here.[¶](https://www.rfc-editor.org#section-2.2-1)

This document uses terminology from [[HTTP](https://www.rfc-editor.org#HTTP)] and defines several terms as
follows:[¶](https://www.rfc-editor.org#section-2.2-2)

-
Client:
-
A Client originates Oblivious HTTP requests. A Client is also an HTTP client in two ways: for the

[Target Resource](https://www.rfc-editor.org#dfn-target)and for the[Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay). However, when referring to the HTTP definition of client ([Section 3.3](https://rfc-editor.org/rfc/rfc9110#section-3.3)of [[HTTP](https://www.rfc-editor.org#HTTP)]), the term "HTTP client" is used; see[Section 5](https://www.rfc-editor.org#http-usage).[¶](https://www.rfc-editor.org#section-2.2-3.2.1) -
Encapsulated Request:
-
An HTTP request that is encapsulated in an HPKE-encrypted message; see

[Section 4.3](https://www.rfc-editor.org#request).[¶](https://www.rfc-editor.org#section-2.2-3.4.1) -
Encapsulated Response:
-
An HTTP response that is encapsulated in an HPKE-encrypted message; see

[Section 4.4](https://www.rfc-editor.org#response).[¶](https://www.rfc-editor.org#section-2.2-3.6.1) -
Oblivious Relay Resource:
-
An intermediary that forwards

[Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req)and[Responses](https://www.rfc-editor.org#dfn-enc-res)between[Clients](https://www.rfc-editor.org#dfn-client)and a single[Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway). In context, this can be referred to simply as a "relay".[¶](https://www.rfc-editor.org#section-2.2-3.8.1) -
Oblivious Gateway Resource:
-
A resource that can receive an

[Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req), extract the contents of that request, forward it to a[Target Resource](https://www.rfc-editor.org#dfn-target), receive a response, encapsulate that response, and then return the resulting[Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res). In context, this can be referred to simply as a "gateway".[¶](https://www.rfc-editor.org#section-2.2-3.10.1) -
Target Resource:
-
The resource that is the target of an

[Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req). This resource logically handles only regular HTTP requests and responses, so it might be ignorant of the use of Oblivious HTTP to reach it.[¶](https://www.rfc-editor.org#section-2.2-3.12.1)

This document includes pseudocode that uses the functions and conventions
defined in [[HPKE](https://www.rfc-editor.org#HPKE)].[¶](https://www.rfc-editor.org#section-2.2-4)

Encoding an integer to a sequence of bytes in network byte order is described
using the function `encode(n, v)`

, where `n`

is the number of bytes and `v`

is
the integer value. ASCII [[ASCII](https://www.rfc-editor.org#ASCII)] encoding of a string `s`

is
indicated using the function `encode_str(s)`

.[¶](https://www.rfc-editor.org#section-2.2-5)

Formats are described using notation from [Section 1.3](https://rfc-editor.org/rfc/rfc9000#section-1.3) of [[QUIC](https://www.rfc-editor.org#QUIC)]. An extension
to that notation expresses the number of bits in a field using a simple
mathematical function.[¶](https://www.rfc-editor.org#section-2.2-6)

##
[3. ](https://www.rfc-editor.org#section-3)[Key Configuration](https://www.rfc-editor.org#name-key-configuration)

A [Client](https://www.rfc-editor.org#dfn-client) needs to acquire information about the key configuration of the
[Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) in order to send [Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req).
In order to ensure that Clients do not encapsulate messages that other entities
can intercept, the key configuration MUST be authenticated and have integrity
protection.[¶](https://www.rfc-editor.org#section-3-1)

This document does not define how that acquisition occurs. However, in order to
help facilitate interoperabilit[Section 7](https://www.rfc-editor.org#privacy).[¶](https://www.rfc-editor.org#section-3-2)

A Client might have multiple key configurations to select from when
encapsulating a request. Clients are responsible for selecting a preferred key
configuration from those it supports. Clients need to consider both the Key
Encapsulation Method (KEM) and the combinations of the Key Derivation Function
(KDF) and AEAD in this decision.[¶](https://www.rfc-editor.org#section-3-3)

###
[3.1. ](https://www.rfc-editor.org#section-3.1)[Key Configuration Encoding](https://www.rfc-editor.org#name-key-configuration-encoding)

A single [key configuration](https://www.rfc-editor.org#key-configuration) consists of a key identifier, a public key, an
identifier for the KEM that the public key uses, and a set of HPKE symmetric
algorithms. Each symmetric algorithm consists of an identifier for a KDF and an
identifier for an AEAD.[¶](https://www.rfc-editor.org#section-3.1-1)

[Figure 2](https://www.rfc-editor.org#format-key-config) shows a single key configuration.[¶](https://www.rfc-editor.org#section-3.1-2)

That is, a key configuration consists of the following fields:[¶](https://www.rfc-editor.org#section-3.1-4)

- Key Identifier:
-
An 8-bit value that identifies the key used by the

[Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway).[¶](https://www.rfc-editor.org#section-3.1-5.2.1) - HPKE KEM ID:
-
A 16-bit value that identifies the KEM used for the identified key as defined in

[Section 7.1](https://rfc-editor.org/rfc/rfc9180#section-7.1)of [[HPKE](https://www.rfc-editor.org#HPKE)] or the["HPKE KEM Identifiers" registry](https://www.iana.org/assignments/hpke).[¶](https://www.rfc-editor.org#section-3.1-5.4.1) - HPKE Public Key:
-
The public key used by the gateway. The length of the public key is

`Npk`

, which is determined by the choice of HPKE KEM as defined in[Section 4](https://rfc-editor.org/rfc/rfc9180#section-4)of [[HPKE](https://www.rfc-editor.org#HPKE)].[¶](https://www.rfc-editor.org#section-3.1-5.6.1) - HPKE Symmetric Algorithms Length:
-
A 16-bit integer in network byte order that encodes the length, in bytes, of the HPKE Symmetric Algorithms field that follows.

[¶](https://www.rfc-editor.org#section-3.1-5.8.1) - HPKE Symmetric Algorithms:
-
One or more pairs of identifiers for the different combinations of HPKE KDF and AEAD that the Oblivious Gateway Resource supports:

[¶](https://www.rfc-editor.org#section-3.1-5.10.1)- HPKE KDF ID:
-
A 16-bit HPKE KDF identifier as defined in

[Section 7.2](https://rfc-editor.org/rfc/rfc9180#section-7.2)of [[HPKE](https://www.rfc-editor.org#HPKE)] or the["HPKE KDF Identifiers" registry](https://www.iana.org/assignments/hpke).[¶](https://www.rfc-editor.org#section-3.1-5.10.2.2.1) - HPKE AEAD ID:
-
A 16-bit HPKE AEAD identifier as defined in

[Section 7.3](https://rfc-editor.org/rfc/rfc9180#section-7.3)of [[HPKE](https://www.rfc-editor.org#HPKE)] or the["HPKE AEAD Identifiers" registry](https://www.iana.org/assignments/hpke).[¶](https://www.rfc-editor.org#section-3.1-5.10.2.4.1)


###
[3.2. ](https://www.rfc-editor.org#section-3.2)[Key Configuration Media Type](https://www.rfc-editor.org#name-key-configuration-media-typ)

The "application[key configurations](https://www.rfc-editor.org#key-configuration). The content of this media type comprises one
or more key configuration encodings (see [Section 3.1](https://www.rfc-editor.org#key-config)). Each encoded
configuration is prefixed with a 2-byte integer in network byte order that
indicates the length of the key configuration in bytes. The length-prefixed
encodings are concatenated to form a list. See [Section 9.1](https://www.rfc-editor.org#iana-keys) for a definition
of the media type.[¶](https://www.rfc-editor.org#section-3.2-1)

Evolution of the key configuration format is supported through the definition of
new formats that are identified by new media types.[¶](https://www.rfc-editor.org#section-3.2-2)

A [Client](https://www.rfc-editor.org#dfn-client) that receives an "application[¶](https://www.rfc-editor.org#section-3.2-3)

##
[4. ](https://www.rfc-editor.org#section-4)[HPKE Encapsulation](https://www.rfc-editor.org#name-hpke-encapsulation)

This document defines how a binary-encoded HTTP message [[BINARY](https://www.rfc-editor.org#BINARY)] is
encapsulated using HPKE [[HPKE](https://www.rfc-editor.org#HPKE)]. Separate media types are defined to
distinguish request and response messages:[¶](https://www.rfc-editor.org#section-4-1)

Alternative encapsulations or message formats are indicated using the media
type; see Sections [4.5](https://www.rfc-editor.org#req-res-media) and [4.6](https://www.rfc-editor.org#repurposing).[¶](https://www.rfc-editor.org#section-4-3)

###
[4.1. ](https://www.rfc-editor.org#section-4.1)[Request Format](https://www.rfc-editor.org#name-request-format)

A message in "`message`

" format protects a binary HTTP request
message; see [Figure 3](https://www.rfc-editor.org#fig-req-pt).[¶](https://www.rfc-editor.org#section-4.1-1)

This plaintext Request structure is encapsulated into a message in
"`message`

" form by generating an [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req). An
Encapsulated Request comprises a key identifier; HPKE parameters for the chosen
KEM, KDF, and AEAD; the encapsulated KEM shared secret (or `enc`

); and an
HPKE-protected binary HTTP request message.[¶](https://www.rfc-editor.org#section-4.1-3)

An Encapsulated Request is shown in [Figure 4](https://www.rfc-editor.org#fig-enc-request). [Section 4.3](https://www.rfc-editor.org#request) describes
the process for constructing and processing an Encapsulated Request.[¶](https://www.rfc-editor.org#section-4.1-4)

That is, an [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req) comprises a Key Identifier, an HPKE KEM ID, an
HPKE KDF ID, an HPKE AEAD ID, an Encapsulated KEM Shared Secret, and an
HPKE-Protected Request. The Key Identifier, HPKE KEM ID, HPKE KDF ID, and HPKE
AEAD ID fields are defined in [Section 3.1](https://www.rfc-editor.org#key-config). The Encapsulated KEM Shared
Secret is the output of the `Encap()`

function for the KEM, which is `Nenc`

bytes in length, as defined in [Section 4](https://rfc-editor.org/rfc/rfc9180#section-4) of [[HPKE](https://www.rfc-editor.org#HPKE)].[¶](https://www.rfc-editor.org#section-4.1-6)

###
[4.2. ](https://www.rfc-editor.org#section-4.2)[Response Format](https://www.rfc-editor.org#name-response-format)

A message in "`message`

" format protects a binary HTTP response
message; see [Figure 5](https://www.rfc-editor.org#fig-res-pt).[¶](https://www.rfc-editor.org#section-4.2-1)

This plaintext Response structure is encapsulated into a message in
"`message`

" form by generating an [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res). An
Encapsulated Response comprises a nonce and the AEAD-protected binary HTTP
response message.[¶](https://www.rfc-editor.org#section-4.2-3)

An Encapsulated Response is shown in [Figure 6](https://www.rfc-editor.org#fig-enc-response). [Section 4.4](https://www.rfc-editor.org#response) describes
the process for constructing and processing an Encapsulated Response.[¶](https://www.rfc-editor.org#section-4.2-4)

That is, an [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res) contains a Nonce and an AEAD-Protected
Response. The Nonce field is either `Nn`

or `Nk`

bytes long, whichever is
larger. The `Nn`

and `Nk`

values correspond to parameters of the AEAD used in
HPKE, which is defined in [Section 7.3](https://rfc-editor.org/rfc/rfc9180#section-7.3) of [[HPKE](https://www.rfc-editor.org#HPKE)] or [the "HPKE AEAD
Identifiers" IANA
registry](https://www.iana.org/assignments/hpke). `Nn`

and `Nk`

refer to the size of the AEAD nonce and key, respectively, in bytes.[¶](https://www.rfc-editor.org#section-4.2-6)

###
[4.3. ](https://www.rfc-editor.org#section-4.3)[Encapsulation of Requests](https://www.rfc-editor.org#name-encapsulation-of-requests)

[Clients](https://www.rfc-editor.org#dfn-client) encapsulate a request, identified as `request`

, using values from a [key
configuration](https://www.rfc-editor.org#key-configuration):[¶](https://www.rfc-editor.org#section-4.3-1)

The Client then constructs an [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req), `enc_request`

, from a binary-encoded HTTP request [[BINARY](https://www.rfc-editor.org#BINARY)] (`request`

) as follows:[¶](https://www.rfc-editor.org#section-4.3-3)

Note that `enc`

is of fixed length, so there is no ambiguity in parsing this
structure.[¶](https://www.rfc-editor.org#section-4.3-5)

In pseudocode, this procedure is as follows:[¶](https://www.rfc-editor.org#section-4.3-6)

An [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) decrypts an Encapsulated Request by reversing this
process. To decapsulate an Encapsulated Request, `enc_request`

:[¶](https://www.rfc-editor.org#section-4.3-8)

In pseudocode, this procedure is as follows:[¶](https://www.rfc-editor.org#section-4.3-10)

The Oblivious Gateway Resource retains the HPKE context, `rctxt`

, so that it can
encapsulate a response.[¶](https://www.rfc-editor.org#section-4.3-12)

###
[4.4. ](https://www.rfc-editor.org#section-4.4)[Encapsulation of Responses](https://www.rfc-editor.org#name-encapsulation-of-responses)

[Oblivious Gateway Resources](https://www.rfc-editor.org#dfn-gateway) generate an [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res) (`enc_response`

)
from a binary-encoded HTTP response [[BINARY](https://www.rfc-editor.org#BINARY)] (`response`

). The Oblivious
Gateway Resource uses the HPKE receiver context (`rctxt`

) as the HPKE context
(`context`

) as follows:[¶](https://www.rfc-editor.org#section-4.4-1)

In pseudocode, this procedure is as follows:[¶](https://www.rfc-editor.org#section-4.4-3)

[Clients](https://www.rfc-editor.org#dfn-client) decrypt an Encapsulated Response by reversing this process. That is,
Clients first parse `enc_response`

into `response_nonce`

and `ct`

. Then, they
follow the same process to derive values for `aead_key`

and `aead_nonce`

, using
their sending HPKE context, `sctxt`

, as the HPKE context, `context`

.[¶](https://www.rfc-editor.org#section-4.4-5)

The Client uses these values to decrypt `ct`

using the AEAD function `Open`

.
Decrypting might produce an error, as follows:[¶](https://www.rfc-editor.org#section-4.4-6)

###
[4.5. ](https://www.rfc-editor.org#section-4.5)[Request and Response Media Types](https://www.rfc-editor.org#name-request-and-response-media-)

Media types are used to identify Encapsulated Requests and Responses; see
Sections [9.2](https://www.rfc-editor.org#iana-req) and [9.3](https://www.rfc-editor.org#iana-res) for definitions of these media types.[¶](https://www.rfc-editor.org#section-4.5-1)

Evolution of the format of Encapsulated Requests and Responses is supported
through the definition of new formats that are identified by new media types.
New media types might be defined to use a similar encapsulation with a different
HTTP message format than in [[BINARY](https://www.rfc-editor.org#BINARY)]; see [Section 4.6](https://www.rfc-editor.org#repurposing) for guidance on
reusing this encapsulation method. Alternatively, a new encapsulation method
might be defined.[¶](https://www.rfc-editor.org#section-4.5-2)

###
[4.6. ](https://www.rfc-editor.org#section-4.6)[Repurposing the Encapsulation Format](https://www.rfc-editor.org#name-repurposing-the-encapsulati)

The encrypted payload of an Oblivious HTTP request and response is a binary HTTP message
[[BINARY](https://www.rfc-editor.org#BINARY)]. The [Client](https://www.rfc-editor.org#dfn-client) and [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) agree on this encrypted
payload type by specifying the media type "message/bhttp" in the HPKE info
string and HPKE export context string for request and response encryption,
respectively.[¶](https://www.rfc-editor.org#section-4.6-1)

Future specifications may repurpose the encapsulation mechanism described in
this document. This requires that the specification define a new media type.
The encapsulation process for that content type can follow the same process,
using new constant strings for the HPKE info and exporter context inputs.[¶](https://www.rfc-editor.org#section-4.6-2)

For example, a future specification might encapsulate DNS messages, which use
the "application[RFC8484](https://www.rfc-editor.org#RFC8484)]. In creating a new,
encrypted media types, specifications might define the use of string
"application[¶](https://www.rfc-editor.org#section-4.6-3)

##
[5. ](https://www.rfc-editor.org#section-5)[HTTP Usage](https://www.rfc-editor.org#name-http-usage)

A [Client](https://www.rfc-editor.org#dfn-client) interacts with the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) by constructing an
[Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req). This Encapsulated Request is included as the content of a
POST request to the Oblivious Relay Resource. This request only needs those
fields necessary to carry the Encapsulated Request: a method of POST, a target
URI of the Oblivious Relay Resource, a header field containing the content type
(see [Section 9.2](https://www.rfc-editor.org#iana-req)), and the Encapsulated Request as the request content. In the
request to the Oblivious Relay Resource, Clients MAY include additional
fields. However, additional fields MUST be independent of the Encapsulated
Request and MUST be fields that the Oblivious Relay Resource will remove before
forwarding the Encapsulated Request towards the target, such as the `Connection`

or `Proxy`

header fields [[HTTP](https://www.rfc-editor.org#HTTP)].[¶](https://www.rfc-editor.org#section-5-1)

The Client role in this protocol acts as an HTTP client both with respect to the
Oblivious Relay Resource and the [Target Resource](https://www.rfc-editor.org#dfn-target). The request, which the Client
makes to the Target Resource, diverges from typical HTTP assumptions about
the use of a connection (see [Section 3.3](https://rfc-editor.org/rfc/rfc9110#section-3.3) of [[HTTP](https://www.rfc-editor.org#HTTP)]) in that the request and
response are encrypted rather than sent over a connection. The Oblivious Relay
Resource and the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) also act as HTTP clients toward the
Oblivious Gateway Resource and Target Resource, respectively.[¶](https://www.rfc-editor.org#section-5-2)

In order to achieve the privacy and security goals of the protocol, a Client
also needs to observe the guidance in [Section 6.1](https://www.rfc-editor.org#sec-client).[¶](https://www.rfc-editor.org#section-5-3)

The Oblivious Relay Resource interacts with the Oblivious Gateway Resource as an
HTTP client by constructing a request using the same restrictions as the Client
request, except that the target URI is the Oblivious Gateway Resource. The
content of this request is copied from the Client. An Oblivious Relay Resource MAY reject
requests that are obviously invalid, such as a request with no content. The Oblivious Relay
Resource MUST NOT add information to the request without the Client being aware of
the type of information that might be added; see [Section 6.2](https://www.rfc-editor.org#relay-responsibilities) for
more information on relay responsibilitie[¶](https://www.rfc-editor.org#section-5-4)

When a response is received from the Oblivious Gateway Resource, the Oblivious
Relay Resource forwards the response according to the rules of an HTTP proxy;
see [Section 7.6](https://rfc-editor.org/rfc/rfc9110#section-7.6) of [[HTTP](https://www.rfc-editor.org#HTTP)]. In case of timeout or error, the Oblivious Relay
Resource can generate a response with an appropriate status code.[¶](https://www.rfc-editor.org#section-5-5)

In order to achieve the privacy and security goals of the protocol, an Oblivious
Relay Resource also needs to observe the guidance in [Section 6.2](https://www.rfc-editor.org#relay-responsibilities).[¶](https://www.rfc-editor.org#section-5-6)

An Oblivious Gateway Resource acts as a gateway for requests to the Target
Resource (see [Section 7.6](https://rfc-editor.org/rfc/rfc9110#section-7.6) of [[HTTP](https://www.rfc-editor.org#HTTP)]). The one exception is that any
information it might forward in a response MUST be encapsulated, unless it is
responding to errors that do not relate to processing the contents of the
Encapsulated Request; see [Section 5.2](https://www.rfc-editor.org#errors).[¶](https://www.rfc-editor.org#section-5-7)

An Oblivious Gateway Resource, if it receives any response from the Target
Resource, sends a single 200 response containing the [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res).
Like the request from the Client, this response MUST only contain those fields
necessary to carry the Encapsulated Response: a 200 status code, a header field
indicating the content type, and the Encapsulated Response as the response
content. As with requests, additional fields MAY be used to convey information
that does not reveal information about the Encapsulated Response.[¶](https://www.rfc-editor.org#section-5-8)

An Oblivious Gateway Resource that does not receive a response can itself
generate a response with an appropriate error status code (such as 504 (Gateway
Timeout); see [Section 15.6.5](https://rfc-editor.org/rfc/rfc9110#section-15.6.5) of [[HTTP](https://www.rfc-editor.org#HTTP)]), which is then encapsulated in the
same way as a successful response.[¶](https://www.rfc-editor.org#section-5-9)

In order to achieve the privacy and security goals of the protocol, an Oblivious
Gateway Resource also needs to observe the guidance in
[Section 6.3](https://www.rfc-editor.org#server-responsibilities).[¶](https://www.rfc-editor.org#section-5-10)

###
[5.1. ](https://www.rfc-editor.org#section-5.1)[Informational Responses](https://www.rfc-editor.org#name-informational-responses)

This encapsulation does not permit progressive processing of responses.
Though the binary HTTP response format does support the inclusion of
informational (1xx) status codes, the AEAD encapsulation cannot be removed until
the entire message is received.[¶](https://www.rfc-editor.org#section-5.1-1)

In particular, the `Expect`

header field with 100-continue (see [Section 10.1.1](https://rfc-editor.org/rfc/rfc9110#section-10.1.1) of [[HTTP](https://www.rfc-editor.org#HTTP)]) cannot be used. [Clients](https://www.rfc-editor.org#dfn-client) MUST NOT construct a request that includes a
100-continue expectation; the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) MUST generate an error
if a 100-continue expectation is received.[¶](https://www.rfc-editor.org#section-5.1-2)

###
[5.2. ](https://www.rfc-editor.org#section-5.2)[Errors](https://www.rfc-editor.org#name-errors)

A server that receives an invalid message for any reason MUST generate an HTTP
response with a 4xx status code.[¶](https://www.rfc-editor.org#section-5.2-1)

Errors detected by the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) and errors detected by the
[Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) before removing protection (including being unable to
remove encapsulation for any reason) result in the status code being sent
without protection in response to the POST request made to that resource.[¶](https://www.rfc-editor.org#section-5.2-2)

Errors detected by the Oblivious Gateway Resource after successfully removing
encapsulation and errors detected by the [Target Resource](https://www.rfc-editor.org#dfn-target) MUST be sent in an
[Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res). This might be because the [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req) is
malformed or the Target Resource does not produce a response. In either case,
the Oblivious Gateway Resource can generate a response with an appropriate error
status code (such as 400 (Bad Request) or 504 (Gateway Timeout); see Sections [15.5.1](https://rfc-editor.org/rfc/rfc9110#section-15.5.1) and [15.6.5](https://rfc-editor.org/rfc/rfc9110#section-15.6.5) of [[HTTP](https://www.rfc-editor.org#HTTP)], respectively). This response is encapsulated in
the same way as a successful response.[¶](https://www.rfc-editor.org#section-5.2-3)

Errors in the encapsulation of requests mean that responses cannot be
encapsulated. This includes cases where the [key configuration](https://www.rfc-editor.org#key-configuration) is incorrect or
outdated. The Oblivious Gateway Resource can generate and send a response with
a 4xx status code to the Oblivious Relay Resource. This response MAY be
forwarded to the [Client](https://www.rfc-editor.org#dfn-client) or treated by the Oblivious Relay Resource as a failure.
If a Client receives a response that is not an Encapsulated Response, this could
indicate that the Client configuration used to construct the request is
incorrect or out of date.[¶](https://www.rfc-editor.org#section-5.2-4)

###
[5.3. ](https://www.rfc-editor.org#section-5.3)[Signaling Key Configuration Problems](https://www.rfc-editor.org#name-signaling-key-configuration)

The problem type [[PROBLEM](https://www.rfc-editor.org#PROBLEM)] of
"https://[Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) MAY use this problem type in a response
to indicate that an [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req) used an outdated or incorrect [key
configuration](https://www.rfc-editor.org#key-configuration).[¶](https://www.rfc-editor.org#section-5.3-1)

[Figure 7](https://www.rfc-editor.org#fig-key-problem) shows an example response in HTTP/1.1 format.[¶](https://www.rfc-editor.org#section-5.3-2)

As this response cannot be encrypted, it might not reach the [Client](https://www.rfc-editor.org#dfn-client). A Client
cannot rely on the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) using this problem type. A Client
might also be configured to disregard responses that are not encapsulated on the
basis that they might be subject to observation or modification by an Oblivious
Relay Resource. A Client might manage the risk of an outdated key configuration
using a heuristic approach whereby it periodically refreshes its key
configuration if it receives a response with an error status code that has not
been encapsulated.[¶](https://www.rfc-editor.org#section-5.3-4)

##
[6. ](https://www.rfc-editor.org#section-6)[Security Considerations](https://www.rfc-editor.org#name-security-considerations)

In this design, a [Client](https://www.rfc-editor.org#dfn-client) wishes to make a request to an [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway) that is forwarded to a [Target Resource](https://www.rfc-editor.org#dfn-target). The Client wishes to make this
request without linking that request with either of the following:[¶](https://www.rfc-editor.org#section-6-1)

In order to ensure this, the Client selects a relay (that serves the
[Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay)) that it trusts will protect this information
by forwarding the Encapsulated Request and Response without passing it
to the server (that serves the Oblivious Gateway Resource).[¶](https://www.rfc-editor.org#section-6-3)

In this section, a deployment where there are three entities is considered:[¶](https://www.rfc-editor.org#section-6-4)

[Section 6.10](https://www.rfc-editor.org#separate-target) discusses the security implications for a case where
different servers operate the Oblivious Gateway Resource and Target Resource.[¶](https://www.rfc-editor.org#section-6-6)

Requests from the Client to Oblivious Relay Resource and from Oblivious Relay
Resource to Oblivious Gateway Resource MUST use HTTPS in order to provide
unlinkability in the presence of a network observer.[¶](https://www.rfc-editor.org#section-6-7)

To achieve the stated privacy goals, the Oblivious Relay Resource cannot be
operated by the same entity as the Oblivious Gateway Resource. However,
colocation of the Oblivious Gateway Resource and Target Resource simplifies the
interactions between those resources without affecting Client privacy.[¶](https://www.rfc-editor.org#section-6-8)

As a consequence of this configuration, Oblivious HTTP prevents linkability
described above. Informally, this means:[¶](https://www.rfc-editor.org#section-6-9)

Traffic analysis that might affect these properties is outside the scope of this
document; see [Section 6.2.3](https://www.rfc-editor.org#ta).[¶](https://www.rfc-editor.org#section-6-11)

A formal analysis of Oblivious HTTP is in [[OHTTP-ANALYSIS](https://www.rfc-editor.org#OHTTP-ANALYSIS)].[¶](https://www.rfc-editor.org#section-6-12)

###
[6.1. ](https://www.rfc-editor.org#section-6.1)[Client Responsibilitie](https://www.rfc-editor.org#name-client-responsibilities)s

Because [Clients](https://www.rfc-editor.org#dfn-client) do not authenticate the [Target Resource](https://www.rfc-editor.org#dfn-target) when using Oblivious
HTTP, Clients MUST have some mechanism to authorize an [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway) for use with a Target Resource. One possible means of authorization is
an allowlist. This ensures that Oblivious Gateway Resources are not misused to
forward traffic to arbitrary Target Resources. [Section 6.3](https://www.rfc-editor.org#server-responsibilities)
describes similar responsibilitie[¶](https://www.rfc-editor.org#section-6.1-1)

Clients MUST ensure that the [key configuration](https://www.rfc-editor.org#key-configuration) they select for generating
[Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req) is integrity protected and authenticated so that it can
be attributed to the Oblivious Gateway Resource; see [Section 3](https://www.rfc-editor.org#key-configuration).[¶](https://www.rfc-editor.org#section-6.1-2)

Since Clients connect directly to the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) instead of the
Target Resource, application configurations wherein Clients make policy
decisions about target connections, e.g., to apply certificate pinning, are
incompatible with Oblivious HTTP. In such cases, alternative technologies such
as HTTP CONNECT ([Section 9.3.6](https://rfc-editor.org/rfc/rfc9110#section-9.3.6) of [[HTTP](https://www.rfc-editor.org#HTTP)]) can be used. Applications could
implement related policies on key configurations and relay connections, though
these might not provide the same properties as policies enforced directly on
target connections. Instead, when this difference is relevant, applications can
connect directly to the target at the cost of either privacy or performance.[¶](https://www.rfc-editor.org#section-6.1-3)

Clients cannot carry connection[COOKIES](https://www.rfc-editor.org#COOKIES)] are the most obvious feature that might
be used to correlate requests, but any identity information and authentication
credentials might have the same effect. Clients also need to treat information
learned from responses with similar care when constructing subsequent requests,
which includes the identity of resources.[¶](https://www.rfc-editor.org#section-6.1-4)

Clients MUST generate a new HPKE context for every request, using a good source
of entropy [[RANDOM](https://www.rfc-editor.org#RANDOM)] for generating keys. Key reuse not only risks
requests being linked but also could expose request and response contents to the
relay.[¶](https://www.rfc-editor.org#section-6.1-5)

The request the Client sends to the Oblivious Relay Resource only requires
minimal information; see [Section 5](https://www.rfc-editor.org#http-usage). The request that carries the
Encapsulated Request and that is sent to the Oblivious Relay Resource MUST NOT
include identifying information unless the Client can trust that this
information is removed by the relay. A Client MAY include information only for
the Oblivious Relay Resource in header fields identified by the `Connection`

header field if it trusts the relay to remove these, as required by [Section 7.6.1](https://rfc-editor.org/rfc/rfc9110#section-7.6.1) of [[HTTP](https://www.rfc-editor.org#HTTP)]. The Client needs to trust that the relay does not replicate the
source addressing information in the request it forwards.[¶](https://www.rfc-editor.org#section-6.1-6)

Clients rely on the Oblivious Relay Resource to forward Encapsulated Requests
and Responses. However, the relay can only refuse to forward messages; it
cannot inspect or modify the contents of Encapsulated Requests or Responses.[¶](https://www.rfc-editor.org#section-6.1-7)

###
[6.2. ](https://www.rfc-editor.org#section-6.2)[Relay Responsibilitie](https://www.rfc-editor.org#name-relay-responsibilities)s

The relay that serves the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) has a very simple function
to perform. For each request it receives, it makes a request of the [Oblivious
Gateway Resource](https://www.rfc-editor.org#dfn-gateway) that includes the same content. When it receives a response,
it sends a response to the [Client](https://www.rfc-editor.org#dfn-client) that includes the content of the response
from the Oblivious Gateway Resource.[¶](https://www.rfc-editor.org#section-6.2-1)

When forwarding a request, the relay MUST follow the forwarding rules in
[Section 7.6](https://rfc-editor.org/rfc/rfc9110#section-7.6) of [[HTTP](https://www.rfc-editor.org#HTTP)]. A generic HTTP intermediary implementation is suitable
for the purposes of serving an Oblivious Relay Resource, but additional care is
needed to ensure that Client privacy is maintained.[¶](https://www.rfc-editor.org#section-6.2-2)

Firstly, a generic implementation will forward unknown fields. For Oblivious
HTTP, an Oblivious Relay Resource SHOULD NOT forward unknown fields. Though
Clients are not expected to include fields that might contain identifying
information, removing unknown fields removes this privacy risk.[¶](https://www.rfc-editor.org#section-6.2-3)

Secondly, generic implementations are often configured to augment requests with
information about the Client, such as the Via field or the Forwarded field
[[FORWARDED](https://www.rfc-editor.org#FORWARDED)]. A relay MUST NOT add information when forwarding
requests that might be used to identify Clients, except for information that
a Client is aware of; see [Section 6.2.1](https://www.rfc-editor.org#differential).[¶](https://www.rfc-editor.org#section-6.2-4)

Finally, a relay can also generate responses, though it is assumed to not be
able to examine the content of a request (other than to observe the choice of
key identifier, KDF, and AEAD); therefore, it is also assumed that it cannot
generate an [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res).[¶](https://www.rfc-editor.org#section-6.2-5)

####
[6.2.1. ](https://www.rfc-editor.org#section-6.2.1)[Differential Treatment](https://www.rfc-editor.org#name-differential-treatment)

A relay MAY add information to requests if the [Client](https://www.rfc-editor.org#dfn-client) is aware of the nature of
the information that could be added. Any addition MUST NOT include information
that uniquely and permanently identifies the Client, including any pseudonymous identifier.
Information added by the relay -- beyond what is already revealed through
[Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req) from Clients -- can reduce the size of the anonymity set of
Clients at a gateway.[¶](https://www.rfc-editor.org#section-6.2.1-1)

A Client does not need to be aware of the exact value added for each request
but needs to know the range of possible values the relay might use. How
a Client might learn about added information is not defined in this document.[¶](https://www.rfc-editor.org#section-6.2.1-2)

Moreover, relays MAY apply differential treatment to Clients that engage in
abusive behavior, e.g., by sending too many requests in comparison to other
Clients, or as a response to rate limits signaled from the gateway. Any such
differential treatment can reveal information to the gateway that would not be
revealed otherwise and therefore reduce the size of the anonymity set of Clients
using a gateway. For example, if a relay chooses to rate limit or block an
abusive Client, this means that any Client requests that are not treated this
way are known to be non-abusive by the gateway. Clients need to consider the
likelihood of such differential treatment and the privacy risks when using a
relay.[¶](https://www.rfc-editor.org#section-6.2.1-3)

Some patterns of abuse cannot be detected without access to the request that is
made to the target. This means that only the gateway or the target is in a
position to identify abuse. A gateway MAY send signals toward the relay to
provide feedback about specific requests. For example, a gateway could respond
differently to requests it cannot decapsulate, as mentioned in [Section 5.2](https://www.rfc-editor.org#errors). A
relay that acts on this feedback could -- either inadvertently or by design --
lead to Client deanonymization[¶](https://www.rfc-editor.org#section-6.2.1-4)

####
[6.2.2. ](https://www.rfc-editor.org#section-6.2.2)[Denial of Service](https://www.rfc-editor.org#name-denial-of-service)

As there are privacy benefits from having a large rate of requests forwarded by
the same relay (see [Section 6.2.3](https://www.rfc-editor.org#ta)), servers that operate the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway)
might need an arrangement with [Oblivious Relay Resources](https://www.rfc-editor.org#dfn-relay). This arrangement might
be necessary to prevent having the large volume of requests being classified as
an attack by the server.[¶](https://www.rfc-editor.org#section-6.2.2-1)

If a server accepts a larger volume of requests from a relay, it needs to trust
that the relay does not allow abusive levels of request volumes from
[Clients](https://www.rfc-editor.org#dfn-client). That is, if a server allows requests from the relay to be exempt from
rate limits, the server might want to ensure that the relay applies a
rate-limiting policy that is acceptable to the server.[¶](https://www.rfc-editor.org#section-6.2.2-2)

Servers that enter into an agreement with a relay that enables a higher request
rate might choose to authenticate the relay to enable the higher rate.[¶](https://www.rfc-editor.org#section-6.2.2-3)

####
[6.2.3. ](https://www.rfc-editor.org#section-6.2.3)[Traffic Analysis](https://www.rfc-editor.org#name-traffic-analysis)

Using HTTPS protects information about which resources are the subject of
request and prevents a network observer from being able to trivially correlate
messages on either side of a relay. However, using HTTPS does not prevent
traffic analysis by such network observers.[¶](https://www.rfc-editor.org#section-6.2.3-1)

The time at which Encapsulated Request or Response messages are sent can
reveal information to a network observer. Though messages exchanged between the
[Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) and the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) might be sent in a
single connection, traffic analysis could be used to match messages that are
forwarded by the relay.[¶](https://www.rfc-editor.org#section-6.2.3-2)

A relay could, as part of its function, delay requests before forwarding them.
Delays might increase the anonymity set into which each request is
attributed. Any delay also increases the time that a [Client](https://www.rfc-editor.org#dfn-client) waits for a
response, so delays SHOULD only be added with the consent -- or at least
awareness -- of Clients.[¶](https://www.rfc-editor.org#section-6.2.3-3)

A relay that forwards large volumes of exchanges can provide better privacy by
providing larger sets of messages that need to be matched.[¶](https://www.rfc-editor.org#section-6.2.3-4)

Traffic analysis is not restricted to network observers. A malicious Oblivious Relay Resource could
use traffic analysis to learn information about otherwise encrypted requests
and responses relayed between Clients and gateways. An Oblivious Relay Resource terminates
TLS connections from Clients, so they see message boundaries. This privileged
position allows for richer feature extraction from encrypted data, which might
improve traffic analysis.[¶](https://www.rfc-editor.org#section-6.2.3-5)

Clients and Oblivious Gateway Resources can use padding to reduce the
effectiveness of traffic analysis. Padding is a capability provided by binary
HTTP messages; see [Section 3.8](https://rfc-editor.org/rfc/rfc9292#section-3.8) of [[BINARY](https://www.rfc-editor.org#BINARY)]. If the encapsulation method
described in this document is used to protect a different message type (see
[Section 4.6](https://www.rfc-editor.org#repurposing)), that message format might need to include padding support.
Oblivious Relay Resources can also use padding for the same reason but need to
operate at the HTTP layer since they cannot manipulate binary HTTP messages; for
example, see [Section 10.7](https://rfc-editor.org/rfc/rfc9113#section-10.7) of [[HTTP/2](https://www.rfc-editor.org#HTTP2)] or [Section 10.7](https://rfc-editor.org/rfc/rfc9114#section-10.7) of [[HTTP/3](https://www.rfc-editor.org#HTTP3)]).[¶](https://www.rfc-editor.org#section-6.2.3-6)

###
[6.3. ](https://www.rfc-editor.org#section-6.3)[Server Responsibilitie](https://www.rfc-editor.org#name-server-responsibilities)s

The [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) can be operated by a different entity than the
[Target Resource](https://www.rfc-editor.org#dfn-target). However, this means that the [Client](https://www.rfc-editor.org#dfn-client) needs to trust the
Oblivious Gateway Resource not to modify requests or responses. This analysis
concerns itself with a deployment scenario where a single server provides both
the Oblivious Gateway Resource and Target Resource.[¶](https://www.rfc-editor.org#section-6.3-1)

A server that operates both Oblivious Gateway and Target Resources is
responsible for removing request encryption, generating a response to the
[Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req), and encrypting the response.[¶](https://www.rfc-editor.org#section-6.3-2)

Servers should account for traffic analysis based on response size or generation
time. Techniques such as padding or timing delays can help protect against such
attacks; see [Section 6.2.3](https://www.rfc-editor.org#ta).[¶](https://www.rfc-editor.org#section-6.3-3)

If separate entities provide the Oblivious Gateway Resource and Target Resource,
these entities might need an arrangement similar to that between server and
relay for managing denial of service; see [Section 6.2.2](https://www.rfc-editor.org#dos). Moreover, the Oblivious
Gateway Resource SHOULD have some mechanism to ensure that the Oblivious Gateway
Resource is not misused as a relay for HTTP messages to an arbitrary Target
Resource, such as an allowlist.[¶](https://www.rfc-editor.org#section-6.3-4)

Non-secure requests -- such as those with the "http" scheme as opposed to the
"https" scheme -- SHOULD NOT be used if the Oblivious Gateway and Target
Resources are not on the same origin. If messages are forwarded between these
resources without the protections afforded by HTTPS, they could be inspected or
modified by a network attacker. Note that a request could be forwarded without
protection if the two resources share an origin.[¶](https://www.rfc-editor.org#section-6.3-5)

###
[6.4. ](https://www.rfc-editor.org#section-6.4)[Key Management](https://www.rfc-editor.org#name-key-management)

An [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) needs to have a plan for replacing keys. This
might include regular replacement of keys, which can be assigned new key
identifiers. If an Oblivious Gateway Resource receives a request that contains a
key identifier that it does not understand or that corresponds to a key that has
been replaced, the server can respond with an HTTP 422 (Unprocessable Content)
status code.[¶](https://www.rfc-editor.org#section-6.4-1)

A server can also use a 422 status code if the server has a key that corresponds
to the key identifier, but the [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req) cannot be successfully
decrypted using the key.[¶](https://www.rfc-editor.org#section-6.4-2)

A server MUST ensure that the HPKE keys it uses are not valid for any other
protocol that uses HPKE with the "message/bhttp request" label. Designers of
protocols that reuse this encryption format, especially new versions of this
protocol, can ensure key diversity by choosing a different label in their use of
HPKE. The "message/bhttp response" label was chosen for symmetry only as it
provides key diversity only within the HPKE context created using the
"message/bhttp request" label; see [Section 4.6](https://www.rfc-editor.org#repurposing).[¶](https://www.rfc-editor.org#section-6.4-3)

###
[6.5. ](https://www.rfc-editor.org#section-6.5)[Replay Attacks](https://www.rfc-editor.org#name-replay-attacks)

A server is responsible for either rejecting replayed requests or ensuring that
the effect of replays does not adversely affect [Clients](https://www.rfc-editor.org#dfn-client) or resources.[¶](https://www.rfc-editor.org#section-6.5-1)

[Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req) can be copied and replayed by the [Oblivious Relay
Resource](https://www.rfc-editor.org#dfn-relay). The threat model for Oblivious HTTP allows the possibility that an
Oblivious Relay Resource might replay requests. Furthermore, if a Client sends
an Encapsulated Request in TLS early data (see [Section 8](https://rfc-editor.org/rfc/rfc8446#section-8) of [[TLS](https://www.rfc-editor.org#TLS)] and
[[RFC8470](https://www.rfc-editor.org#RFC8470)]), a network-based adversary might be able to cause the request to
be replayed. In both cases, the effect of a replay attack and the mitigations
that might be employed are similar to TLS early data.[¶](https://www.rfc-editor.org#section-6.5-2)

It is the responsibility of the application that uses Oblivious HTTP to either
reject replayed requests or ensure that replayed requests have no adverse
effect on their operation. This section describes some approaches that are
universally applicable and suggestions for more targeted techniques.[¶](https://www.rfc-editor.org#section-6.5-3)

A Client or Oblivious Relay Resource MUST NOT automatically attempt to retry a
failed request unless it receives a positive signal indicating that the request
was not processed or forwarded. The HTTP/2 REFUSED_STREAM error code ([Section 8.1.4](https://rfc-editor.org/rfc/rfc9113#section-8.1.4) of [[HTTP/2](https://www.rfc-editor.org#HTTP2)]), the HTTP/3 H3[Section 8.1](https://rfc-editor.org/rfc/rfc9114#section-8.1) of [[HTTP/3](https://www.rfc-editor.org#HTTP3)]), or a GOAWAY frame with a low enough identifier (in either protocol
version) are all sufficient signals that no processing occurred. HTTP/1.1
[[HTTP/1.1](https://www.rfc-editor.org#HTTP11)] provides no equivalent signal. Connection failures or interruptions
are not sufficient signals that no processing occurred.[¶](https://www.rfc-editor.org#section-6.5-4)

The anti-replay mechanisms described in [Section 8](https://rfc-editor.org/rfc/rfc8446#section-8) of [[TLS](https://www.rfc-editor.org#TLS)] are generally
applicable to Oblivious HTTP requests. The encapsulated keying material (or
`enc`

) can be used in place of a nonce to uniquely identify a request. This
value is a high-entropy value that is freshly generated for every request, so
two valid requests will have different values with overwhelming probability.[¶](https://www.rfc-editor.org#section-6.5-5)

The mechanism used in TLS for managing differences in Client and server clocks
cannot be used as it depends on being able to observe previous interactions.
Oblivious HTTP explicitly prevents such linkability.[¶](https://www.rfc-editor.org#section-6.5-6)

The considerations in [[RFC8470](https://www.rfc-editor.org#RFC8470)] as they relate to managing the risk of
replay also apply, though there is no option to delay the processing of a
request.[¶](https://www.rfc-editor.org#section-6.5-7)

Limiting requests to those with safe methods might not be satisfactory for some
applications, particularly those that involve the submission of data to a
server. The use of idempotent methods might be of some use in managing replay
risk, though it is important to recognize that different idempotent requests
can be combined to be not idempotent.[¶](https://www.rfc-editor.org#section-6.5-8)

Even without replay prevention, the server-chosen `response_nonce`

field
ensures that responses have unique AEAD keys and nonces even when requests are
replayed.[¶](https://www.rfc-editor.org#section-6.5-9)

####
[6.5.1. ](https://www.rfc-editor.org#section-6.5.1)[Use of Date for Anti-replay](https://www.rfc-editor.org#name-use-of-date-for-anti-replay)

[Clients](https://www.rfc-editor.org#dfn-client) SHOULD include a `Date`

header field in [Encapsulated Requests](https://www.rfc-editor.org#dfn-enc-req), unless
the Client has prior knowledge that indicates that the [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway) does not use `Date`

for anti-replay purposes.[¶](https://www.rfc-editor.org#section-6.5.1-1)

Though HTTP requests often do not include a `Date`

header field, the value of
this field might be used by a server to limit the amount of requests it needs to
track if it needs to prevent replay attacks.[¶](https://www.rfc-editor.org#section-6.5.1-2)

An Oblivious Gateway Resource can maintain state for requests for a small window
of time over which it wishes to accept requests. The Oblivious Gateway Resource
can store all requests it processes within this window. Storing just the `enc`

field of a request, which should be unique to each request, is sufficient. The
Oblivious Gateway Resource can reject any request that is the same as one that
was previously answered within that time window or if the `Date`

header field
from the decrypted request is outside of the current time window.[¶](https://www.rfc-editor.org#section-6.5.1-3)

Oblivious Gateway Resources might need to allow for the time it takes requests
to arrive from the Client, with a time window that is large enough to allow for
differences in clocks. Insufficient tolerance of time differences could result
in valid requests being unnecessarily rejected. Beyond allowing for multiple
round-trip times -- to account for retransmission -- network delays are unlikely
to be significant in determining the size of the window, unless all potential
Clients are known to have excellent timekeeping. A specific window size might
need to be determined experimentally.[¶](https://www.rfc-editor.org#section-6.5.1-4)

Oblivious Gateway Resources MUST NOT treat the time window as secret
information. An attacker can actively probe with different values for the `Date`

field to determine the time window over which the server will accept responses.[¶](https://www.rfc-editor.org#section-6.5.1-5)

####
[6.5.2. ](https://www.rfc-editor.org#section-6.5.2)[Correcting Clock Differences](https://www.rfc-editor.org#name-correcting-clock-difference)

An [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) can reject requests that contain a `Date`

value
that is outside of its active window with a 400 series status code. The problem
type [[PROBLEM](https://www.rfc-editor.org#PROBLEM)] of
"https://`Date`

value in the request was unacceptable.[¶](https://www.rfc-editor.org#section-6.5.2-1)

[Figure 8](https://www.rfc-editor.org#fig-date-reject) shows an example response in HTTP/1.1 format.[¶](https://www.rfc-editor.org#section-6.5.2-2)

Disagreements about time are unlikely if both [Client](https://www.rfc-editor.org#dfn-client) and Oblivious Gateway
Resource have a good source of time; see [[NTP](https://www.rfc-editor.org#NTP)]. However, clock
differences are known to be commonplace; see Section 7.1 of
[[CLOCKSKEW](https://www.rfc-editor.org#CLOCKSKEW)].[¶](https://www.rfc-editor.org#section-6.5.2-4)

Including a `Date`

header field in the response allows the Client to correct
clock errors by retrying the same request using the value of the `Date`

field
provided by the Oblivious Gateway Resource. The value of the `Date`

field can
be copied if the response is fresh, with an adjustment based on the `Age`

field
otherwise; see [Section 4.2](https://rfc-editor.org/rfc/rfc9111#section-4.2) of [[HTTP-CACHING](https://www.rfc-editor.org#HTTP-CACHING)]. When retrying a request, the
Client MUST create a fresh encryption of the modified request, using a new HPKE
context.[¶](https://www.rfc-editor.org#section-6.5.2-5)

Retrying immediately allows the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) to measure the
round-trip time to the [Client](https://www.rfc-editor.org#dfn-client). The observed delay might reveal something about
the location of the Client. Clients could delay retries to add some uncertainty
to any observed delay.[¶](https://www.rfc-editor.org#section-6.5.2-7)

Intermediaries can sometimes rewrite the `Date`

field when forwarding responses.
This might cause problems if the Oblivious Gateway Resource and intermediary
clocks differ by enough to cause the retry to be rejected. Therefore, Clients
MUST NOT retry a request with an adjusted date more than once.[¶](https://www.rfc-editor.org#section-6.5.2-8)

Oblivious Gateway Resources that condition their responses on the `Date`

header
field SHOULD either ensure that intermediaries do not cache responses (by
including a `Cache-Control`

directive of `no-store`

) or designate the response
as conditional on the value of the `Date`

request header field (by including the
token "date" in a `Vary`

header field).[¶](https://www.rfc-editor.org#section-6.5.2-9)

Clients MUST NOT use the date provided by the Oblivious Gateway Resource for any
other purpose, including future requests to any resource. Any request that uses
information provided by the Oblivious Gateway Resource might be correlated using
that information.[¶](https://www.rfc-editor.org#section-6.5.2-10)

###
[6.6. ](https://www.rfc-editor.org#section-6.6)[Forward Secrecy](https://www.rfc-editor.org#name-forward-secrecy)

This document does not provide forward secrecy for either requests or
responses during the lifetime of the [key configuration](https://www.rfc-editor.org#key-configuration). A measure of
forward secrecy can be provided by generating a new key configuration
then deleting the old keys after a suitable period.[¶](https://www.rfc-editor.org#section-6.6-1)

###
[6.7. ](https://www.rfc-editor.org#section-6.7)[Post-Compromise Security](https://www.rfc-editor.org#name-post-compromise-security)

This design does not provide post-compromise security for responses.[¶](https://www.rfc-editor.org#section-6.7-1)

A [Client](https://www.rfc-editor.org#dfn-client) only needs to retain keying material that might be used to compromise
the confidentiality and integrity of a response until that response is consumed,
so there is negligible risk associated with a Client compromise.[¶](https://www.rfc-editor.org#section-6.7-2)

A server retains a secret key that might be used to remove protection from
messages over much longer periods. A server compromise that provided access to
the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) secret key could allow an attacker to recover the
plaintext of all requests sent toward affected keys and all of the responses
that were generated.[¶](https://www.rfc-editor.org#section-6.7-3)

Even if server keys are compromised, an adversary cannot access messages
exchanged by the Client with the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) as messages are
protected by TLS. Use of a compromised key also requires that the Oblivious
Relay Resource cooperate with the attacker or that the attacker is able to
compromise these TLS connections.[¶](https://www.rfc-editor.org#section-6.7-4)

The total number of messages affected by server key compromise can be limited by
regular rotation of server keys.[¶](https://www.rfc-editor.org#section-6.7-5)

###
[6.8. ](https://www.rfc-editor.org#section-6.8)[Client Clock Exposure](https://www.rfc-editor.org#name-client-clock-exposure)

Including a `Date`

field in requests reveals some information about the [Client](https://www.rfc-editor.org#dfn-client)
clock. This might be used to fingerprint Clients [[UWT](https://www.rfc-editor.org#UWT)] or to identify Clients
that are vulnerable to attacks that depend on incorrect clocks.[¶](https://www.rfc-editor.org#section-6.8-1)

Clients can randomize the value that they provide for `Date`

to obscure the true
value of their clock and reduce the chance of linking requests over time.
However, this increases the risk that their request is rejected as outside the
acceptable window.[¶](https://www.rfc-editor.org#section-6.8-2)

###
[6.9. ](https://www.rfc-editor.org#section-6.9)[Media Type Security](https://www.rfc-editor.org#name-media-type-security)

The [key configuration](https://www.rfc-editor.org#key-configuration) media type defined in [Section 3.2](https://www.rfc-editor.org#ohttp-keys) represents keying
material. The content of this media type is not active (see [Section 4.6](https://rfc-editor.org/rfc/rfc6838#section-4.6) of [[RFC6838](https://www.rfc-editor.org#RFC6838)]), but it governs how a [Client](https://www.rfc-editor.org#dfn-client) might interact with an [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway). The security implications of processing it are described in
[Section 6.1](https://www.rfc-editor.org#sec-client); privacy implications are described in [Section 7](https://www.rfc-editor.org#privacy).[¶](https://www.rfc-editor.org#section-6.9-1)

The security implications of handling the message media types defined in
[Section 4.5](https://www.rfc-editor.org#req-res-media) is covered in other parts of this section in more detail.
However, these message media types are also encrypted encapsulations of HTTP
requests and responses.[¶](https://www.rfc-editor.org#section-6.9-2)

HTTP messages contain content, which can use any media type. In particular,
requests are processed by an Oblivious [Target Resource](https://www.rfc-editor.org#dfn-target), which -- as an HTTP
resource -- defines how content is processed; see [Section 3.1](https://rfc-editor.org/rfc/rfc9110#section-3.1) of [[HTTP](https://www.rfc-editor.org#HTTP)]. HTTP
clients can also use resource identity and response content to determine how
content is processed. Consequently, the security considerations of [Section 17](https://rfc-editor.org/rfc/rfc9110#section-17) of [[HTTP](https://www.rfc-editor.org#HTTP)] also apply to the handling of the content of these media types.[¶](https://www.rfc-editor.org#section-6.9-3)

###
[6.10. ](https://www.rfc-editor.org#section-6.10)[Separate Gateway and Target](https://www.rfc-editor.org#name-separate-gateway-and-target)

This document generally assumes that the same entity operates the [Oblivious
Gateway Resource](https://www.rfc-editor.org#dfn-gateway) and the [Target Resource](https://www.rfc-editor.org#dfn-target). However, as the Oblivious Gateway
Resource performs generic HTTP processing, the use of forwarding cannot be
completely precluded.[¶](https://www.rfc-editor.org#section-6.10-1)

The scheme specified in the [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req) determines the security
requirements for any protocol that is used between the Oblivious Gateway and
Target Resources. Using HTTPS is RECOMMENDED; see [Section 6.3](https://www.rfc-editor.org#server-responsibilities).[¶](https://www.rfc-editor.org#section-6.10-2)

A Target Resource that is operated on a different server from the Oblivious
Gateway Resource is an ordinary HTTP resource. A Target Resource can privilege
requests that are forwarded by a given Oblivious Gateway Resource if it trusts
the operator of the Oblivious Gateway Resource to only forward requests that
meet the expectations of the Target Resource. Otherwise, the Target Resource
treats requests from an Oblivious Gateway Resource no differently than any
other HTTP client.[¶](https://www.rfc-editor.org#section-6.10-3)

For instance, an Oblivious Gateway Resource might -- possibly with the help of
[Oblivious Relay Resources](https://www.rfc-editor.org#dfn-relay) -- be trusted not to forward an excessive volume of
requests. This might allow the Target Resource to accept a greater volume of
requests from that Oblivious Gateway Resource relative to other HTTP clients.[¶](https://www.rfc-editor.org#section-6.10-4)

An Oblivious Gateway Resource could implement policies that improve the ability
of the Target Resource to implement policy exemptions, such as only forwarding
requests toward specific Target Resources according to an allowlist; see [Section 6.3](https://www.rfc-editor.org#server-responsibilities).[¶](https://www.rfc-editor.org#section-6.10-5)

##
[7. ](https://www.rfc-editor.org#section-7)[Privacy Considerations](https://www.rfc-editor.org#name-privacy-considerations)

One goal of this design is that independent [Client](https://www.rfc-editor.org#dfn-client) requests are only linkable by
their content. However, the choice of Client configuration might be used to
correlate requests. A Client configuration includes the [Oblivious Relay
Resource](https://www.rfc-editor.org#dfn-relay) URI, the Oblivious Gateway [key configuration](https://www.rfc-editor.org#key-configuration), and the [Oblivious Gateway
Resource](https://www.rfc-editor.org#dfn-gateway) URI. A configuration is active if Clients can successfully use it for
interacting with a target.[¶](https://www.rfc-editor.org#section-7-1)

Oblivious Relay and Gateway Resources can identify when requests use the same
configuration by matching the key identifier from the key configuration or the
Oblivious Gateway Resource URI. The Oblivious Gateway Resource might use the
source address of requests to correlate requests that use an Oblivious Relay
Resource run by the same operator. If the Oblivious Gateway Resource is willing
to use trial decryption, requests can be further separated into smaller
groupings based on active configurations that clients use.[¶](https://www.rfc-editor.org#section-7-2)

Each active Client configuration partitions the Client anonymity set. In
practice, it is infeasible to reduce the number of active configurations to
one. Enabling diversity in choice of Oblivious Relay Resource naturally
increases the number of active configurations. More than one configuration
might need to be active to allow for key rotation and server maintenance.[¶](https://www.rfc-editor.org#section-7-3)

Client privacy depends on having each configuration used by many other Clients.
It is critical to prevent the use of unique Client configurations, which might
be used to track individual Clients, but it is also important to avoid
creating small groupings of Clients that might weaken privacy protections.[¶](https://www.rfc-editor.org#section-7-4)

A specific method for a Client to acquire configurations is not included in this
specification. Applications using this design MUST provide accommodations to
mitigate tracking using Client configurations. [[CONSISTENCY](https://www.rfc-editor.org#CONSISTENCY)] provides options
for ensuring that Client configurations are consistent between Clients.[¶](https://www.rfc-editor.org#section-7-5)

The content of requests or responses, if used in forming new requests, can be
used to correlate requests. This includes obvious methods of linking requests,
like cookies [[COOKIES](https://www.rfc-editor.org#COOKIES)], but it also includes any information in either
message that might affect how subsequent requests are formulated. For example,
[[FIELDING](https://www.rfc-editor.org#FIELDING)] describes how interactions that are individually stateless can be
used to build a stateful system when a Client acts on the content of a response.[¶](https://www.rfc-editor.org#section-7-6)

##
[8. ](https://www.rfc-editor.org#section-8)[Operational and Deployment Considerations](https://www.rfc-editor.org#name-operational-and-deployment-)

This section discusses various operational and deployment considerations.[¶](https://www.rfc-editor.org#section-8-1)

###
[8.1. ](https://www.rfc-editor.org#section-8.1)[Performance Overhead](https://www.rfc-editor.org#name-performance-overhead)

Using Oblivious HTTP adds both cryptographic overhead and latency to requests
relative to a simple HTTP request[Clients](https://www.rfc-editor.org#dfn-client) and servers avoids adding significant
additional delay due to network topology. A study of a similar system
[[ODOH-PETS](https://www.rfc-editor.org#ODOH-PETS)] found that deploying proxies close to servers was most effective
in minimizing additional latency.[¶](https://www.rfc-editor.org#section-8.1-1)

###
[8.2. ](https://www.rfc-editor.org#section-8.2)[Resource Mappings](https://www.rfc-editor.org#name-resource-mappings)

This protocol assumes a fixed, one-to-one mapping between the [Oblivious Relay
Resource](https://www.rfc-editor.org#dfn-relay) and the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway). This means that any [Encapsulated
Request](https://www.rfc-editor.org#dfn-enc-req) sent to the Oblivious Relay Resource will always be forwarded to the
Oblivious Gateway Resource. This constraint was imposed to simplify relay
configuration and mitigate against the Oblivious Relay Resource being used as
a generic relay for unknown Oblivious Gateway Resources. The relay will only
forward for Oblivious Gateway Resources that it has explicitly configured and
allowed.[¶](https://www.rfc-editor.org#section-8.2-1)

It is possible for a server to be configured with multiple Oblivious Relay
Resources, each for a different Oblivious Gateway Resource as needed. If the
goal is to support a large number of Oblivious Gateway Resources, [Clients](https://www.rfc-editor.org#dfn-client) might
be provided with a URI template [[TEMPLATE](https://www.rfc-editor.org#TEMPLATE)], from which multiple
Oblivious Relay Resources could be constructed.[¶](https://www.rfc-editor.org#section-8.2-2)

###
[8.3. ](https://www.rfc-editor.org#section-8.3)[Network Management](https://www.rfc-editor.org#name-network-management)

Oblivious HTTP might be incompatible with network interception regimes, such as
those that rely on configuring [Clients](https://www.rfc-editor.org#dfn-client) with trust anchors and intercepting TLS
connections. While TLS might be intercepted successfully, interception
middlebox devices might not receive updates that would allow Oblivious HTTP to
be correctly identified using the media types defined in Sections [9.2](https://www.rfc-editor.org#iana-req)
and [9.3](https://www.rfc-editor.org#iana-res).[¶](https://www.rfc-editor.org#section-8.3-1)

Oblivious HTTP has a simple key management design that is not trivially altered
to enable interception by intermediaries. Clients that are configured to enable
interception might choose to disable Oblivious HTTP in order to ensure that
content is accessible to middleboxes.[¶](https://www.rfc-editor.org#section-8.3-2)

##
[9. ](https://www.rfc-editor.org#section-9)[IANA Considerations](https://www.rfc-editor.org#name-iana-considerations)

IANA has registered the following media types in the "Media Types" registry at
<[https:// iana.org/assignments/media-types](https://iana.org/assignments/media-types)>, following the procedures of
[

[RFC6838](https://www.rfc-editor.org#RFC6838)]: "

`application`/ohttp-keys

" ([Section 9.1](https://www.rfc-editor.org#iana-keys)), "

`message`/ohttp-req

"
([Section 9.2](https://www.rfc-editor.org#iana-req)), and "

`message`/ohttp-res

" ([Section 9.3](https://www.rfc-editor.org#iana-res)).

[¶](https://www.rfc-editor.org#section-9-1)

IANA has added the following types to the "HTTP Problem Types" registry at
<[https:// iana.org/assignments/http-problem-types](https://iana.org/assignments/http-problem-types)>: "date"
(

[Section 9.4](https://www.rfc-editor.org#iana-problem-date)) and "ohttp-key" (

[Section 9.5](https://www.rfc-editor.org#iana-problem-ohttp-key)).

[¶](https://www.rfc-editor.org#section-9-2)

###
[9.1. ](https://www.rfc-editor.org#section-9.1)[application](https://www.rfc-editor.org#name-application-ohttp-keys-medi)/ohttp-keys Media Type

The "`application`

" media type identifies a [key configuration](https://www.rfc-editor.org#key-configuration) used by
Oblivious HTTP.[¶](https://www.rfc-editor.org#section-9.1-1)

- Type name:
-
application

[¶](https://www.rfc-editor.org#section-9.1-2.2.1) - Subtype name:
-
ohttp-keys

[¶](https://www.rfc-editor.org#section-9.1-2.4.1) - Required parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.1-2.6.1) - Optional parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.1-2.8.1) - Encoding considerations:
-
"binary"

[¶](https://www.rfc-editor.org#section-9.1-2.10.1) - Security considerations:
-
See

[Section 6.9](https://www.rfc-editor.org#sec-media)[¶](https://www.rfc-editor.org#section-9.1-2.12.1) - Interoperability considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.1-2.14.1) - Published specification:
-
RFC 9458

[¶](https://www.rfc-editor.org#section-9.1-2.16.1) - Applications that use this media type:
-
This type identifies a key configuration as used by Oblivious HTTP and applications that use Oblivious HTTP.

[¶](https://www.rfc-editor.org#section-9.1-2.18.1) - Fragment identifier considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.1-2.20.1) - Additional information:
-
- Person and email address to contact for further information:
-

See Authors' Addresses section[¶](https://www.rfc-editor.org#section-9.1-2.24.1) - Intended usage:
-
COMMON

[¶](https://www.rfc-editor.org#section-9.1-2.26.1) - Restrictions on usage:
-
N/A

[¶](https://www.rfc-editor.org#section-9.1-2.28.1) - Author:
-
See Authors' Addresses section

[¶](https://www.rfc-editor.org#section-9.1-2.30.1) - Change controller:
-
IETF

[¶](https://www.rfc-editor.org#section-9.1-2.32.1)

###
[9.2. ](https://www.rfc-editor.org#section-9.2)[message](https://www.rfc-editor.org#name-message-ohttp-req-media-typ)/ohttp-req Media Type

The "`message`

" identifies an encrypted binary HTTP request. This
is a binary format that is defined in [Section 4.3](https://www.rfc-editor.org#request).[¶](https://www.rfc-editor.org#section-9.2-1)

- Type name:
-
message

[¶](https://www.rfc-editor.org#section-9.2-2.2.1) - Subtype name:
-
ohttp-req

[¶](https://www.rfc-editor.org#section-9.2-2.4.1) - Required parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.2-2.6.1) - Optional parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.2-2.8.1) - Encoding considerations:
-
"binary"

[¶](https://www.rfc-editor.org#section-9.2-2.10.1) - Security considerations:
-
See

[Section 6.9](https://www.rfc-editor.org#sec-media)[¶](https://www.rfc-editor.org#section-9.2-2.12.1) - Interoperability considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.2-2.14.1) - Published specification:
-
RFC 9458

[¶](https://www.rfc-editor.org#section-9.2-2.16.1) - Applications that use this media type:
-
Oblivious HTTP and applications that use Oblivious HTTP use this media type to identify encapsulated binary HTTP requests.

[¶](https://www.rfc-editor.org#section-9.2-2.18.1) - Fragment identifier considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.2-2.20.1) - Additional information:
-
- Person and email address to contact for further information:
-

See Authors' Addresses section[¶](https://www.rfc-editor.org#section-9.2-2.24.1) - Intended usage:
-
COMMON

[¶](https://www.rfc-editor.org#section-9.2-2.26.1) - Restrictions on usage:
-
N/A

[¶](https://www.rfc-editor.org#section-9.2-2.28.1) - Author:
-
See Authors' Addresses section

[¶](https://www.rfc-editor.org#section-9.2-2.30.1) - Change controller:
-
IETF

[¶](https://www.rfc-editor.org#section-9.2-2.32.1)

###
[9.3. ](https://www.rfc-editor.org#section-9.3)[message](https://www.rfc-editor.org#name-message-ohttp-res-media-typ)/ohttp-res Media Type

The "`message`

" identifies an encrypted binary HTTP response. This
is a binary format that is defined in [Section 4.4](https://www.rfc-editor.org#response).[¶](https://www.rfc-editor.org#section-9.3-1)

- Type name:
-
message

[¶](https://www.rfc-editor.org#section-9.3-2.2.1) - Subtype name:
-
ohttp-res

[¶](https://www.rfc-editor.org#section-9.3-2.4.1) - Required parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.3-2.6.1) - Optional parameters:
-
N/A

[¶](https://www.rfc-editor.org#section-9.3-2.8.1) - Encoding considerations:
-
"binary"

[¶](https://www.rfc-editor.org#section-9.3-2.10.1) - Security considerations:
-
See

[Section 6.9](https://www.rfc-editor.org#sec-media)[¶](https://www.rfc-editor.org#section-9.3-2.12.1) - Interoperability considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.3-2.14.1) - Published specification:
-
RFC 9458

[¶](https://www.rfc-editor.org#section-9.3-2.16.1) - Applications that use this media type:
-
Oblivious HTTP and applications that use Oblivious HTTP use this media type to identify encapsulated binary HTTP responses.

[¶](https://www.rfc-editor.org#section-9.3-2.18.1) - Fragment identifier considerations:
-
N/A

[¶](https://www.rfc-editor.org#section-9.3-2.20.1) - Additional information:
-
- Person and email address to contact for further information:
-

See Authors' Addresses section[¶](https://www.rfc-editor.org#section-9.3-2.24.1) - Intended usage:
-
COMMON

[¶](https://www.rfc-editor.org#section-9.3-2.26.1) - Restrictions on usage:
-
N/A

[¶](https://www.rfc-editor.org#section-9.3-2.28.1) - Author:
-
See Authors' Addresses section

[¶](https://www.rfc-editor.org#section-9.3-2.30.1) - Change controller:
-
IETF

[¶](https://www.rfc-editor.org#section-9.3-2.32.1)

###
[9.4. ](https://www.rfc-editor.org#section-9.4)[Registration of "date" Problem Type](https://www.rfc-editor.org#name-registration-of-date-proble)

IANA has added a new entry in the "HTTP Problem Types" registry established by
[[PROBLEM](https://www.rfc-editor.org#PROBLEM)].[¶](https://www.rfc-editor.org#section-9.4-1)

- Type URI:
-
https://

iana .org /assignments /http -problem -types#date [¶](https://www.rfc-editor.org#section-9.4-2.2.1) - Title:
-
Date Not Acceptable

[¶](https://www.rfc-editor.org#section-9.4-2.4.1) - Recommended HTTP Status Code:
-
400

[¶](https://www.rfc-editor.org#section-9.4-2.6.1) - Reference:
-
[Section 6.5.2](https://www.rfc-editor.org#date-fix)of RFC 9458[¶](https://www.rfc-editor.org#section-9.4-2.8.1)

###
[9.5. ](https://www.rfc-editor.org#section-9.5)[Registration of "ohttp-key" Problem Type](https://www.rfc-editor.org#name-registration-of-ohttp-key-p)

IANA has added a new entry in the "HTTP Problem Types" registry established by
[[PROBLEM](https://www.rfc-editor.org#PROBLEM)].[¶](https://www.rfc-editor.org#section-9.5-1)

- Type URI:
-
https://

iana .org /assignments /http -problem -types#ohttp -key [¶](https://www.rfc-editor.org#section-9.5-2.2.1) - Title:
-
Oblivious HTTP key configuration not acceptable

[¶](https://www.rfc-editor.org#section-9.5-2.4.1) - Recommended HTTP Status Code:
-
400

[¶](https://www.rfc-editor.org#section-9.5-2.6.1) - Reference:
-
[Section 5.3](https://www.rfc-editor.org#ohttp-key-problem)of RFC 9458[¶](https://www.rfc-editor.org#section-9.5-2.8.1)

##
[10. ](https://www.rfc-editor.org#section-10)[References](https://www.rfc-editor.org#name-references)

###
[10.1. ](https://www.rfc-editor.org#section-10.1)[Normative References](https://www.rfc-editor.org#name-normative-references)

- [ASCII]
-
Cerf, V., "ASCII format for network interchange", STD 80, RFC 20, DOI 10
.17487 , , </RFC0020 [https://](https://www.rfc-editor.org/info/rfc20)>.www .rfc -editor .org /info /rfc20 - [BINARY]
-
Thomson, M. and C. A. Wood, "Binary Representation of HTTP Messages", RFC 9292, DOI 10
.17487 , , </RFC9292 [https://](https://www.rfc-editor.org/info/rfc9292)>.www .rfc -editor .org /info /rfc9292 - [HPKE]
-
Barnes, R., Bhargavan, K., Lipp, B., and C. Wood, "Hybrid Public Key Encryption", RFC 9180, DOI 10
.17487 , , </RFC9180 [https://](https://www.rfc-editor.org/info/rfc9180)>.www .rfc -editor .org /info /rfc9180 - [HTTP]
-
Fielding, R., Ed., Nottingham, M., Ed., and J. Reschke, Ed., "HTTP Semantics", STD 97, RFC 9110, DOI 10
.17487 , , </RFC9110 [https://](https://www.rfc-editor.org/info/rfc9110)>.www .rfc -editor .org /info /rfc9110 - [HTTP-CACHING]
-
Fielding, R., Ed., Nottingham, M., Ed., and J. Reschke, Ed., "HTTP Caching", STD 98, RFC 9111, DOI 10
.17487 , , </RFC9111 [https://](https://www.rfc-editor.org/info/rfc9111)>.www .rfc -editor .org /info /rfc9111 - [PROBLEM]
-
Nottingham, M., Wilde, E., and S. Dalal, "Problem Details for HTTP APIs", RFC 9457, DOI 10
.17487 , , </RFC9457 [https://](https://www.rfc-editor.org/info/rfc9457)>.www .rfc -editor .org /info /rfc9457 - [QUIC]
-
Iyengar, J., Ed. and M. Thomson, Ed., "QUIC: A UDP-Based Multiplexed and Secure Transport", RFC 9000, DOI 10
.17487 , , </RFC9000 [https://](https://www.rfc-editor.org/info/rfc9000)>.www .rfc -editor .org /info /rfc9000 - [RFC2119]
-
Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10
.17487 , , </RFC2119 [https://](https://www.rfc-editor.org/info/rfc2119)>.www .rfc -editor .org /info /rfc2119 - [RFC6838]
-
Freed, N., Klensin, J., and T. Hansen, "Media Type Specifications and Registration Procedures", BCP 13, RFC 6838, DOI 10
.17487 , , </RFC6838 [https://](https://www.rfc-editor.org/info/rfc6838)>.www .rfc -editor .org /info /rfc6838 - [RFC8174]
-
Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10
.17487 , , </RFC8174 [https://](https://www.rfc-editor.org/info/rfc8174)>.www .rfc -editor .org /info /rfc8174 - [RFC8470]
-
Thomson, M., Nottingham, M., and W. Tarreau, "Using Early Data in HTTP", RFC 8470, DOI 10
.17487 , , </RFC8470 [https://](https://www.rfc-editor.org/info/rfc8470)>.www .rfc -editor .org /info /rfc8470 - [TLS]
-
Rescorla, E., "The Transport Layer Security (TLS) Protocol Version 1.3", RFC 8446, DOI 10
.17487 , , </RFC8446 [https://](https://www.rfc-editor.org/info/rfc8446)>.www .rfc -editor .org /info /rfc8446

###
[10.2. ](https://www.rfc-editor.org#section-10.2)[Informative References](https://www.rfc-editor.org#name-informative-references)

- [CLOCKSKEW]
-
Acer, M., Stark, E., Felt, A., Fahl, S., Bhargava, R., Dev, B., Braithwaite, M., Sleevi, R., and P. Tabriz, "Where the Wild Warnings Are: Root Causes of Chrome HTTPS Certificate Errors", Proceedings of the 2017 ACM SIGSAC Conference on
Computer and Communications Security, DOI 10
.1145 , , </3133956 .3134007 [https://](https://doi.org/10.1145/3133956.3134007)>.doi .org /10 .1145 /3133956 .3134007 - [CONSISTENCY]
-
Davidson, A., Finkel, M., Thomson, M., and C. A. Wood, "Key Consistency and Discovery", Work in Progress, Internet-Draft, draft
-ietf , , <-privacypass -key -consistency -01 [https://](https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-key-consistency-01)>.datatracker .ietf .org /doc /html /draft -ietf -privacypass -key -consistency -01 - [COOKIES]
-
Barth, A., "HTTP State Management Mechanism", RFC 6265, DOI 10
.17487 , , </RFC6265 [https://](https://www.rfc-editor.org/info/rfc6265)>.www .rfc -editor .org /info /rfc6265 - [DMS2004]
-
Dingledine, R., Mathewson, N., and P. Syverson, "Tor: The Second
-Generation Onion Router" , , <[https://](https://svn.torproject.org/svn/projects/design-paper/tor-design.html)>.svn .torproject .org /svn /projects /design -paper /tor -design .html - [FIELDING]
-
Fielding, R. T., "Architectural Styles and the Design of Network-based Software Architectures", , <
[https://](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)>.www .ics .uci .edu /~fielding /pubs /dissertation /fielding _dissertation .pdf - [FORWARDED]
-
Petersson, A. and M. Nilsson, "Forwarded HTTP Extension", RFC 7239, DOI 10
.17487 , , </RFC7239 [https://](https://www.rfc-editor.org/info/rfc7239)>.www .rfc -editor .org /info /rfc7239 - [HTTP/1.1]
-
Fielding, R., Ed., Nottingham, M., Ed., and J. Reschke, Ed., "HTTP/1.1", STD 99, RFC 9112, DOI 10
.17487 , , </RFC9112 [https://](https://www.rfc-editor.org/info/rfc9112)>.www .rfc -editor .org /info /rfc9112 - [HTTP/2]
-
Thomson, M., Ed. and C. Benfield, Ed., "HTTP/2", RFC 9113, DOI 10
.17487 , , </RFC9113 [https://](https://www.rfc-editor.org/info/rfc9113)>.www .rfc -editor .org /info /rfc9113 - [HTTP/3]
-
Bishop, M., Ed., "HTTP/3", RFC 9114, DOI 10
.17487 , , </RFC9114 [https://](https://www.rfc-editor.org/info/rfc9114)>.www .rfc -editor .org /info /rfc9114 - [NTP]
-
Mills, D., Martin, J., Ed., Burbank, J., and W. Kasch, "Network Time Protocol Version 4: Protocol and Algorithms Specification", RFC 5905, DOI 10
.17487 , , </RFC5905 [https://](https://www.rfc-editor.org/info/rfc5905)>.www .rfc -editor .org /info /rfc5905 - [ODOH]
-
Kinnear, E., McManus, P., Pauly, T., Verma, T., and C.A. Wood, "Oblivious DNS over HTTPS", RFC 9230, DOI 10
.17487 , , </RFC9230 [https://](https://www.rfc-editor.org/info/rfc9230)>.www .rfc -editor .org /info /rfc9230 - [ODOH-PETS]
-
Singanamalla, S., Chunhapanya, S., Hoyland, J., Vavruša, M., Verma, T., Wu, P., Fayed, M., Heimerl, K., Sullivan, N., and C. A. Wood, "Oblivious DNS over HTTPS (ODoH): A Practical Privacy Enhancement to DNS", PoPETS Proceedings Volume 2021, Issue 4, pp. 575-592, DOI 10
.2478 , , </popets -2021 -0085 [https://](https://www.petsymposium.org/2021/files/papers/issue4/popets-2021-0085.pdf)>.www .petsymposium .org /2021 /files /papers /issue4 /popets -2021 -0085 .pdf - [OHTTP-ANALYSIS]
-
Hoyland, J., "Tamarin Model of Oblivious HTTP", commit 6824eee, , <
[https://](https://github.com/cloudflare/ohttp-analysis)>.github .com /cloudflare /ohttp -analysis - [PRIO]
-
Corrigan-Gibbs, H. and D. Boneh, "Prio: Private, Robust, and Scalable Computation of Aggregate Statistics", , <
[https://](https://crypto.stanford.edu/prio/paper.pdf)>.crypto .stanford .edu /prio /paper .pdf - [RANDOM]
-
Eastlake 3rd, D., Schiller, J., and S. Crocker, "Randomness Requirements for Security", BCP 106, RFC 4086, DOI 10
.17487 , , </RFC4086 [https://](https://www.rfc-editor.org/info/rfc4086)>.www .rfc -editor .org /info /rfc4086 - [RFC7838]
-
Nottingham, M., McManus, P., and J. Reschke, "HTTP Alternative Services", RFC 7838, DOI 10
.17487 , , </RFC7838 [https://](https://www.rfc-editor.org/info/rfc7838)>.www .rfc -editor .org /info /rfc7838 - [RFC8484]
-
Hoffman, P. and P. McManus, "DNS Queries over HTTPS (DoH)", RFC 8484, DOI 10
.17487 , , </RFC8484 [https://](https://www.rfc-editor.org/info/rfc8484)>.www .rfc -editor .org /info /rfc8484 - [TEMPLATE]
-
Gregorio, J., Fielding, R., Hadley, M., Nottingham, M., and D. Orchard, "URI Template", RFC 6570, DOI 10
.17487 , , </RFC6570 [https://](https://www.rfc-editor.org/info/rfc6570)>.www .rfc -editor .org /info /rfc6570 - [UWT]
-
Nottingham, M., "Unsanctioned Web Tracking", W3C TAG Finding, , <
[https://](https://www.w3.org/2001/tag/doc/unsanctioned-tracking/)>.www .w3 .org /2001 /tag /doc /unsanctioned -tracking / - [X25519]
-
Langley, A., Hamburg, M., and S. Turner, "Elliptic Curves for Security", RFC 7748, DOI 10
.17487 , , </RFC7748 [https://](https://www.rfc-editor.org/info/rfc7748)>.www .rfc -editor .org /info /rfc7748

##
[Appendix A. ](https://www.rfc-editor.org#appendix-A)[Complete Example of a Request and Response](https://www.rfc-editor.org#name-complete-example-of-a-reque)

A single request and response exchange is shown here. Binary values ([key
configuration](https://www.rfc-editor.org#key-configuration), secret keys, the content of messages, and intermediate values)
are shown in hexadecimal. The request and response here are minimal; the purpose
of this example is to show the cryptographic operations. In this example, the
[Client](https://www.rfc-editor.org#dfn-client) is configured with the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay) URI of
`https://`

, and the proxy is
configured to map requests to this URI to the [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) URI
`https://`

. The [Target Resource](https://www.rfc-editor.org#dfn-target) URI, i.e., the
resource the Client ultimately wishes to query, is `https://`

.[¶](https://www.rfc-editor.org#appendix-A-1)

To begin the process, the Oblivious Gateway Resource generates a key pair.
In this example, the server chooses DHKEM(X25519, HKDF-SHA256) and generates
an X25519 key pair [[X25519](https://www.rfc-editor.org#X25519)]. The X25519 secret key is:[¶](https://www.rfc-editor.org#appendix-A-2)

The Oblivious Gateway Resource constructs a key configuration that includes the
corresponding public key as follows:[¶](https://www.rfc-editor.org#appendix-A-4)

This key configuration is somehow obtained by the Client. Then, when a Client
wishes to send an HTTP GET request to the target `https://`

, it
constructs the following binary HTTP message:[¶](https://www.rfc-editor.org#appendix-A-6)

The Client then reads the Oblivious Gateway Resource key configuration and
selects a mutually supported KDF and AEAD. In this example, the Client selects
HKDF-SHA256 and AES-128-GCM. The Client then generates an HPKE sending context
that uses the server public key. This context is constructed from the following
ephemeral secret key:[¶](https://www.rfc-editor.org#appendix-A-8)

The corresponding public key is:[¶](https://www.rfc-editor.org#appendix-A-10)

The context is created with an `info`

parameter of:[¶](https://www.rfc-editor.org#appendix-A-12)

Applying the Seal operation from the HPKE context produces an encrypted
message, allowing the Client to construct the following [Encapsulated Request](https://www.rfc-editor.org#dfn-enc-req):[¶](https://www.rfc-editor.org#appendix-A-14)

The Client then sends this to the Oblivious Relay Resource in a POST request,
which might look like the following HTTP/1.1 request:[¶](https://www.rfc-editor.org#appendix-A-16)

The Oblivious Relay Resource receives this request and forwards it to the
Oblivious Gateway Resource, which might look like:[¶](https://www.rfc-editor.org#appendix-A-18)

The [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) receives this request, selects the key it
generated previously using the key identifier from the message, and decrypts the
message. As this request is directed to the same server, the Oblivious Gateway
Resource does not need to initiate an HTTP request to the [Target Resource](https://www.rfc-editor.org#dfn-target). The
request can be served directly by the Target Resource, which generates a minimal
response (consisting of just a 200 status code) as follows:[¶](https://www.rfc-editor.org#appendix-A-20)

The response is constructed by exporting a secret from the HPKE context:[¶](https://www.rfc-editor.org#appendix-A-22)

The key derivation for the [Encapsulated Response](https://www.rfc-editor.org#dfn-enc-res) uses both the encapsulated KEM
key from the request and a randomly selected nonce. This produces a salt of:[¶](https://www.rfc-editor.org#appendix-A-24)

The salt and secret are both passed to the `Extract`

function of the selected KDF
(HKDF-SHA256) to produce a pseudorandom key of:[¶](https://www.rfc-editor.org#appendix-A-26)

The pseudorandom key is used with the `Expand`

function of the KDF and an info
field of "key" to produce a 16-byte key for the selected AEAD (AES-128-GCM):[¶](https://www.rfc-editor.org#appendix-A-28)

With the same KDF and pseudorandom key, an info field of "nonce" is used to
generate a 12-byte nonce:[¶](https://www.rfc-editor.org#appendix-A-30)

The AEAD `Seal()`

function is then used to encrypt the response, which is added
to the randomized nonce value to produce the Encapsulated Response:[¶](https://www.rfc-editor.org#appendix-A-32)

The [Oblivious Gateway Resource](https://www.rfc-editor.org#dfn-gateway) constructs a response with the same content:[¶](https://www.rfc-editor.org#appendix-A-34)

The same response might then be generated by the [Oblivious Relay Resource](https://www.rfc-editor.org#dfn-relay), which
might change as little as the `Date`

header. The [Client](https://www.rfc-editor.org#dfn-client) is then able to use the
HPKE context it created and the nonce from the Encapsulated Response to
construct the AEAD key and nonce and decrypt the response.[¶](https://www.rfc-editor.org#appendix-A-36)

##
[Acknowledgments](https://www.rfc-editor.org#name-acknowledgments)

This design is based on a design for Oblivious DNS (queries) over HTTPS (DoH),
described in [[ODOH](https://www.rfc-editor.org#ODOH)]. David Benjamin, Mark Nottingham, and
Eric Rescorla made technical contributions. The authors also thank
Ralph Giles, Lucas Pardue, and Tommy Pauly for invaluable
assistance.[¶](https://www.rfc-editor.org#appendix-B-1)
