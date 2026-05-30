---
url: https://developers.google.com/safe-browsing/ohttp/reference
title: Overview | Google Safe Browsing | Google for Developers
fetched_at: 2026-05-30T15:40:57
content_hash: sha1:3fc650034c554134ada55593aa9019d1d183812b
extractor: trafilatura
---

## Page Summary

-
Safe Browsing Oblivious HTTP Gateway API allows client applications to privately check URLs against Google's unsafe web resources lists using the Oblivious HTTP protocol.

-
This API leverages a Relay service to anonymize client requests to Google, enhancing privacy by hiding client identifiers like IP addresses.

-
Clients need to fetch and regularly update the OHTTP public key from a dedicated endpoint for encryption and decryption of requests and responses.

-
The API uses two endpoints: one for obtaining the OHTTP public key and another for handling encapsulated OHTTP requests.

-
Google provides client libraries and sample code to facilitate integration with the API, recommending the use of Quiche for OHTTP and BHTTP functionalities.


## Safe Browsing Oblivious HTTP Gateway API

**Note: This documentation is currently still under development. Expect improvements in the near future.**

Safe Browsing Oblivious HTTP Gateway API is a privacy preserving API built on top of IETF RFC protocol named *Oblivious HTTP*, [RFC 9458](https://www.ietf.org/rfc/rfc9458.html).

### Overview

Safe Browsing Oblivious HTTP Gateway API is a Google service that lets client applications check URLs against Google's constantly updated lists of unsafe web resources with additional privacy protections in place.

This is achieved via a lightweight protocol called *Oblivious HTTP*, or [OHTTP](https://www.ietf.org/rfc/rfc9458.html) for short. This is a stateless protocol that can be used by Safe Browsing clients in order to access [ Google Safe Browsing V5 APIs](https://developers.google.com/safe-browsing/reference), to get robust protections and increased coverage without compromising users' privacy.

**NOTE:** [Google Safe Browsing V4 APIs](https://developers.google.com/safe-browsing/v4) cannot be accessed via this service.

#### Safe Browsing Oblivious HTTP protocol

##### RFC Protocol

Oblivious HTTP is a lightweight protocol defined in [RFC 9458](https://www.ietf.org/rfc/rfc9458.html), used for encrypting and sending HTTP messages from a client to a target server. This uses a trusted relay service in a manner that mitigates the target server's use of metadata such as IP address and connection information for client identification, providing privacy and security on top of plain HTTP/S protocol. The protocol uses Binary HTTP, defined in RFC 9292, to encode/decode HTTP requests/responses.

At a high level, a Relay stands between the Client and Gateway resource that proxies client traffic by removing all client identifiers, including privacy sensitive attributes such as IP addresses, effectively anonymizing incoming HTTP requests to the Gateway service. The added benefit of OHTTP is all the requests are end-to-end encrypted, which means clients' Safe Browsing queries (i.e. truncated hashes of URL expressions) are not visible to the Relay. Refer to the [blogpost](https://security.googleblog.com/2024/03/blog-post.html) for an example implementation in Chrome.

Clients can choose any Relay provider (eg., [Fastly](https://docs.fastly.com/products/oblivious-http-relay)) to integrate with the service. The Relay must use [Oauth 2.0](https://developers.google.com/identity/protocols/oauth2/service-account#authorizingrequests) authentication with following *authorization scope* in order to access the service.


// OAuth Authorization scope:
https://www.googleapis.com/auth/3p-relay-safe-browsing


##### API Endpoints

###### OHTTP Public Key

This endpoint will provide [OHTTP public key configuration](https://www.ietf.org/rfc/rfc9458.html#name-key-configuration) as specified in [RFC 9458](https://www.ietf.org/rfc/rfc9458.html), which will be used by the client to encrypt OHTTP request.


GET https://safebrowsingohttpgateway.googleapis.com/v1/ohttp/hpkekeyconfig?key=<API key>


The API key above is not strictly necessary; the server does *not* vary the OHTTP Public Key based on the supplied API key. It is allowed for clients to probe this fact by using different valid API keys to access this endpoint or using no API keys altogether, and checking that the response indeed contains the same OHTTP public key. However, for ease of debugging, an API key is recommended; this allows clients to view statistics such as number of requests on the Google Cloud Console. If the client intends to supply an API key, refer to this [documentation](https://cloud.google.com/docs/authentication/api-keys) on how to set up API keys.

As stated in the [privacy recommendations](https://www.ietf.org/rfc/rfc9458.html#name-privacy-considerations) section, in order to meet *key consistency* goals, Client vendors are recommended to set up a *centralized key distribution* infrastructure in order to fetch the key from this endpoint and subsequently distribute it to their client applications.

As per the [key management guidance](https://www.ietf.org/rfc/rfc9458.html#name-key-management), keys are rotated regularly on the server. Clients should refresh the key, i.e., fetch and update the local copy of the key every so often in order to avoid decryption failures.

Clients should refresh (fetch and update) the public key once per day. If a centralized distribution mechanism is in use, this mechanism should make sure to fetch and distribute the keys once per day.

###### OHTTP Encapsulated Request

This endpoint will serve the OHTTP request that's included in HTTP body of the POST request, by performing request decryption, and subsequently encrypt the OHTTP response to be forwarded back to Relay in the HTTP response. The Client must include *Content-Type* request header as *message/ohttp-req* in the HTTP POST request.


POST https://safebrowsingohttpgateway.googleapis.com/v1/ohttp:handleOhttpEncapsulatedRequest?key=<API key>


**NOTE:** As per the guidance on RFC, encode the inner request (refer [V5 documentation](https://developers.google.com/safe-browsing/reference) on how to build Safe Browsing request) using *Binary HTTP* protocol, [RFC 9292](https://www.ietf.org/rfc/rfc9292.html).

##### Client Libraries

[Google Quiche](https://github.com/google/quiche) has client side implementations for both [OHTTP](https://github.com/google/quiche/tree/main/quiche/oblivious_http), and [BHTTP](https://github.com/google/quiche/tree/main/quiche/binary_http) protocols. Clients are recommended to use these libraries. Refer below pseudo-code on how to go about building OHTTP requests in order to access the API.

###### Sample client side implementation

Clients fetch the Oblivious HTTP public key from the *public key* endpoint. Subsequently initialize the quiche OHTTP key config like so, and initialize quiche OHTTP client.


auto ohttp_key_cfgs = quiche::ObliviousHttpKeyConfigs::ParseConcatenatedKeys(std::string public_key);
auto key_config = ohttp_key_cfgs->PreferredConfig();
auto public_key = ohttp_key_cfgs->GetPublicKeyForId(key_config.GetKeyId())
auto ohttp_client = quiche::ObliviousHttpClient::Create(public_key, key_config);


Client will use Binary HTTP encoding to create BHTTP Request as a first step before encrypting.


quiche::BinaryHttpRequest::ControlData bhttp_ctrl_data{
.method = "POST",
.scheme = "https",
.authority = "safebrowsing.googleapis.com",
.path = "/v5/hashes:search?key=<API key>&hashPrefixes=<HASH prefix 1>&hashPrefixes=<HASH prefix 2>",
};
quiche::BinaryHttpRequest bhttp_request(bhttp_ctrl_data);


Client will subsequently encrypt the Binary HTTP request created in the above step.


auto bhttp_serialized = bhttp_request.Serialize();
auto ohttp_request = ohttp_client.CreateObliviousHttpRequest(*bhttp_serialized);
// Client must include this in POST body, and add `Content-Type` header as "message/ohttp-req".
auto payload_include_in_post_body = ohttp_request.EncapsulateAndSerialize();


Once the response is received from Relay, client will decrypt the response. The response will include *Content-Type* response header as *ohttp-res*.


auto ctx = std::move(ohttp_request).ReleaseContext();
auto ohttp_response = ohttp_client.DecryptObliviousHttpResponse("data included in body of http_response", ctx);


After decrypting the OHTTP response successfully, decode the output using Binary HTTP like so.


auto bhttp_response = BinaryHttpResponse::Create(ohttp_response.GetPlaintextData());
if (bhttp_response.status_code() == 200) {
auto http_response = bhttp_response.body();
auto response_headers = bhttp_response.GetHeaderFields();
}
