---
url: https://mbrenndoerfer.com/writing/retrieval-augmented-training-retro-architecture-context-integration
title: Retrieval-Augmented Training: RETRO Architecture and Context Integration - Interactive | Michael Brenndoerfer
fetched_at: 2026-05-30T19:29:13
content_hash: sha1:29a1bc48ab722f58d18a5f4a3993fb3600ccdeb7
extractor: trafilatura
---

How RETRO trains language models with retrieval from scratch, using chunked cross-attention to integrate a 2T-token database and cut parameter needs 25x.

Choose your expertise level to adjust how many terms are explained. Beginners see more tooltips, experts see fewer to maintain reading flow. Hover over underlined terms for instant definitions.

Language models face a fundamental tension: the knowledge they contain is frozen at training time. No matter how large the model or how extensive its pretraining corpus, it cannot know about events that happened after the data cutoff, cannot access information that was never included in its training set, and must compress everything it has learned into billions of static parameters. This creates both a knowledge staleness problem and a storage efficiency problem. Every fact the model needs to recall must somehow be encoded in its weights, competing for capacity with the syntactic patterns, reasoning strategies, and linguistic regularities it also needs to internalize.

Retrieval-augmented generation ([RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag)), which you saw in earlier chapters on inference-time techniques, addresses this by supplying retrieved context to the model at inference time. The model reads relevant passages alongside the query and generates its response by conditioning on both. This works remarkably well, but it treats retrieval as an afterthought: the model was trained without any exposure to the retrieval interface, so it must cope with injected context through [in-context learning](https://mbrenndoerfer.com/writing/in-context-learning-llm-examples) rather than through internalized patterns for processing retrieved material.

Retrieval-augmented training takes a different approach. Instead of bolting retrieval onto a frozen model at inference time, the model is trained from the ground up with retrieval as an integral part of the forward pass. The model learns to read and use retrieved neighbors as part of its core computation, not as an incidental prompt prefix. The result is a model architecture and training regime where the boundary between "memory in weights" and "memory in retrieval database" is deliberately and efficiently managed.

The most influential architecture in this space is RETRO (Retrieval-Enhanced [Transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need)), introduced by Borgeaud et al. at DeepMind in 2021. RETRO showed that models with roughly 7 billion parameters could match the [perplexity](https://mbrenndoerfer.com/writing/perplexity-language-model-evaluation-metric) of [GPT-3](https://mbrenndoerfer.com/writing/gpt-3-scale-few-shot-in-context-learning)-scale models (175 billion parameters) when given access to a 2 trillion token retrieval database. The implication was provocative: a 25-fold reduction in parameter count with no quality loss, achieved by offloading factual storage to an external database rather than into model weights. This chapter unpacks how RETRO achieves this, why retrieval during training matters, and what the architecture teaches us about the separation of compute and memory in language modeling.

Advertisement

To understand why training with retrieval is qualitatively different from inference-time [RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag), consider what a model must learn in each setting.

In standard pretraining, the model is exposed to text tokens and must predict each next token. Over trillions of tokens, it learns to encode factual associations in its weights: that Paris is the capital of France, that Einstein developed the theory of relativity, that the boiling point of water at sea level is 100 degrees Celsius. These facts become [distributed representations](https://mbrenndoerfer.com/writing/neural-probabilistic-language-model-distributed-word-representations-neural-language-modeling) entangled with all the other knowledge in the network. Recalling a specific fact requires routing computation through the right layers and [attention heads](https://mbrenndoerfer.com/writing/multi-head-attention-transformers), with no guarantee that rarely-seen facts are reliably stored or that common facts have not been overwritten by more frequent patterns.

In inference-time RAG, a frozen model receives retrieved text prepended to its context. The model must figure out how to use this external context purely through [in-context learning](https://mbrenndoerfer.com/writing/in-context-learning-llm-examples). It was never explicitly trained to extract and integrate retrieved information, so the integration quality depends on how well the retrieved text resembles the kind of context the model saw during pretraining. If the model has never been shown a pattern like "Here is a retrieved passage: [passage]. Now answer: [question]," it must generalize from loosely related training examples.

Training with retrieval changes this entirely. The model sees retrieved neighbors during every training step and learns to compute loss conditioned on both the local context and the retrieved material. It develops specialized architectural mechanisms for reading retrieved text and integrating it into its representations. The training objective directly rewards the model for using retrieved context well. By the time the model is deployed, it has internalized a general strategy for leveraging retrieval rather than trying to adapt a strategy developed for a different setting.

There is also a compression argument. When a model must store facts in its weights, those parameters must simultaneously encode the facts and participate in general language understanding and reasoning. These roles may not be perfectly compatible. A parameter that stores "the capital of France" cannot simultaneously be optimal for representing syntactic agreement patterns. Retrieval-augmented training lets the model specialize its parameters more heavily toward language understanding and reasoning, while delegating factual storage to the retrieval database where it can be stored verbatim and accessed precisely.

Advertisement

RETRO introduces a specific architectural pattern for integrating retrieved sequences into the forward pass of a [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) language model. Understanding it requires first understanding how the retrieval interface is structured.

The core insight in RETRO is that a long sequence can be processed in fixed-length chunks, and each chunk can be enriched with retrieved material that is relevant to the local context up to that point. Rather than trying to process the entire sequence against a global retrieved set, RETRO maintains alignment between local sequence segments and their retrieved neighbors.

Formally, given an input sequence of tokens , RETRO splits it into non-overlapping chunks of size (typically 64 tokens):

where:

- is the -th chunk
- is the chunk length (64 tokens in the original paper)
- ranges from 1 to

For each chunk , RETRO retrieves neighbor sequences from the database using the chunk as a query. Each neighbor consists of two parts: the retrieved passage itself (the "neighbor") plus a continuation (the "neighbor-plus") which is the text that follows the neighbor in the original document. This continuation provides additional context that is informative but was not the direct retrieval target.

During training, the model processes chunks sequentially, but crucially, the retrieval for chunk is based on all tokens seen up to and including chunk . This is a causal constraint: you cannot use chunk itself to retrieve its neighbors, because at inference time you would be retrieving before you have generated those tokens. The retrieval query for chunk is formed from the prefix .

The chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers) (CCA) mechanism is the architectural innovation that implements this integration. At specific layers in the [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) stack, the representation of each token in chunk attends to the encoded representations of the retrieved neighbors . This is different from standard [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept) in several ways:

- The keys and values come from a separate encoder that processes the retrieved sequences
- Only tokens within the same chunk attend to the same retrieved set
- The cross-attention is causally masked: tokens in chunk can only attend to retrieved neighbors computed from the prefix

The CCA operation for a token at position within chunk computes:

where:

- is the
[query vector](https://mbrenndoerfer.com/writing/query-key-value-attention-mechanism)for token derived from its[hidden state](https://mbrenndoerfer.com/writing/rnn-architecture-recurrent-neural-networks-guide) - and are the key and value matrices derived from the encoded neighbor sequences for chunk
- is the key dimension

The encoder that produces and is a [bidirectional transformer](https://mbrenndoerfer.com/writing/encoder-architecture-bidirectional-transformers-understanding) (since the neighbors are fully observed and do not need [causal masking](https://mbrenndoerfer.com/writing/attention-masking-transformers)). It processes each retrieved neighbor independently and produces a sequence of hidden states that the main model can attend to through CCA.

The full RETRO model interleaves two types of [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) layers.

A standard [transformer layer](https://mbrenndoerfer.com/writing/transformer-block-assembly) applies multi-head self-attention followed by a feed-forward network in the usual way. No retrieved context is used in these layers.

A RETRO layer contains three sub-components applied in sequence. First, standard [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept) over the input sequence. Second, chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers) over the encoded neighbors. Third, a feed-forward network. The CCA step is inserted between self-attention and the feed-forward network, after the self-attention has already contextualized the token representations within the sequence.

Not every layer is a RETRO layer. Typically, CCA is only applied in every third or fourth layer, allowing the model to first build up contextualized representations through self-attention before integrating the retrieved material. This design reflects the intuition that retrieval integration is most effective when the model already has a rich understanding of the local context.

The encoder used to process neighbors is significantly smaller than the main model. In the original RETRO paper, the main model has up to 7 billion parameters while the encoder uses approximately the same architecture as a standard 600 million parameter [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need). The encoder is frozen during much of the training process in some configurations, though the original paper trains the full system end-to-end.

Advertisement

The retrieval component is a massive key-value store. In the original RETRO experiments, this database contains 2 trillion tokens drawn from MassiveText, which is the same corpus used to train Gopher and other DeepMind models. The database is split into 64-token chunks, and each chunk is associated with a dense embedding vector computed by a frozen sentence encoder ([BERT](https://mbrenndoerfer.com/writing/bert-bidirectional-pretraining-revolutionizes-language-understanding)-based in the original paper).

At retrieval time, the query embedding is computed from the [prefix tokens](https://mbrenndoerfer.com/writing/prefix-tuning-virtual-tokens-efficient-fine-tuning) and compared to all chunk [embeddings](https://mbrenndoerfer.com/writing/long-term-knowledge-storage-and-retrieval) using approximate nearest-neighbor search (specifically, SCaNN in the original implementation). The top- neighbors by embedding similarity are retrieved, along with their continuations.

The choice to use frozen embeddings for retrieval rather than training the retrieval system end-to-end with the model is a practical compromise. Training a retrieval system that indexes trillions of tokens requires recomputing and reindexing embeddings periodically as the encoder changes, which is computationally expensive. Using a frozen retriever eliminates this cost at the expense of some potential quality.

Advertisement

The headline result from the RETRO paper is that a 7.5 billion parameter RETRO model achieves lower [perplexity](https://mbrenndoerfer.com/writing/perplexity-language-model-evaluation-metric) on language modeling benchmarks than a 175 billion parameter [GPT-3](https://mbrenndoerfer.com/writing/gpt-3-scale-few-shot-in-context-learning). This is roughly a 25x parameter reduction, which requires some unpacking because raw parameter counts can be misleading.

The RETRO model, while small in parameter count, is supplemented by the 2 trillion token retrieval database. If we ask how much "information capacity" the full RETRO system has, we need to account for both the model weights and the retrieval database. The database itself is large: 2 trillion tokens at roughly 2 bytes per token is about 4 terabytes of raw text. In that sense, RETRO is better described as differently organized than simply more efficient.

What is genuinely surprising is that the performance advantage holds even at high numbers of retrieved tokens. The perplexity curves for RETRO as a function of database size and model size show a consistent pattern: doubling the database size improves perplexity more cheaply (in compute) than doubling model parameters. This suggests that much of what large language models store in their weights is effectively a compressed lookup table for world knowledge, and that externalizing this lookup table into a database is more efficient than encoding it in weights.

The comparison also reveals something about the nature of [perplexity](https://mbrenndoerfer.com/writing/perplexity-language-model-evaluation-metric) as a metric. Perplexity on [the Pile](https://mbrenndoerfer.com/writing/the-pile-open-source-training-dataset-large-language-models) and similar benchmarks is strongly influenced by the model's ability to predict rare and specific facts: proper nouns, technical terminology, numerical quantities. These are exactly the kinds of tokens where retrieval provides the most benefit, because they are hard to memorize in weights but easy to find in a database. Reasoning and syntax, by contrast, are less directly aided by retrieval because they require computation rather than lookup.

Advertisement

Training RETRO from scratch involves several considerations that differ from standard pretraining.

Every training step requires actual retrieval operations. For each training batch, the input sequences must be split into chunks, each chunk must be encoded into a [query vector](https://mbrenndoerfer.com/writing/query-key-value-attention-mechanism), and the nearest neighbors must be retrieved from the database. This adds a non-trivial overhead to each training step compared to a standard dense [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need).

In practice, RETRO mitigates this overhead by pre-computing retrievals offline before training begins. A retrieval index is built once from the training corpus, and for each training sequence, the neighbors are retrieved and cached alongside the training examples. During the actual training forward pass, the retrieved neighbors are simply looked up from this cache rather than computed dynamically. This converts the online retrieval problem into a storage problem: you need to store the cached neighbors for all training sequences, which is significant but manageable.

This pre-computation has an interesting implication: the retrievals are static during training. As the main model's parameters change, the optimal neighbors for each query might change, but the cached neighbors do not update. In the original RETRO paper, the retrievals are computed once and held fixed throughout training. This is a further trade-off that likely reduces quality somewhat but is necessary for practical training.

The RETRO training objective is standard [autoregressive language modeling](https://mbrenndoerfer.com/writing/causal-language-modeling-foundation-generative-ai) loss. The model is trained to predict the next token given all previous tokens, conditioned on the retrieved neighbors for the relevant chunk. Formally:

where:

- denotes all tokens preceding position
- denotes the retrieved neighbors computed from the prefix up to chunk
- is the chunk length
- represents all model parameters

The key point is that for tokens in the first chunk (), there are no previous chunks to use as a retrieval query, so the model must predict those tokens without any retrieved context. The retrieval benefit only kicks in starting from the second chunk. This is analogous to how inference-time [RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag) typically requires a full query before retrieval can occur.

Advertisement

The original RETRO paper trains the full architecture from scratch with retrieval. However, a subsequent line of work has explored "retrofitting" a standard [pretrained model](https://mbrenndoerfer.com/writing/transfer-learning-nlp-pre-training-fine-tuning) to use the [RETRO architecture](https://mbrenndoerfer.com/writing/rag-architecture-retriever-generator-design-patterns), a process called RETROfit. In this approach, a standard [GPT](https://mbrenndoerfer.com/writing/gpt1-gpt2-autoregressive-pretraining-transfer-learning)-style model is extended with the CCA layers and encoder, and these new components are trained while the original model weights are frozen or lightly fine-tuned.

RETROfit is appealing because it avoids the enormous cost of pretraining from scratch. A 7 billion parameter model trained from scratch with RETRO requires the same compute as pretraining a 7 billion parameter GPT model, plus the overhead of retrieval during training. RETROfit allows reuse of existing pretrained weights.

The trade-off is quality. When trained from scratch, the model can develop retrieval-aware representations in its [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept) layers from the very beginning, integrating retrieval knowledge throughout the network. In RETROfit, the existing self-attention weights were optimized without any retrieval signal, so they may not be ideal for the CCA integration. Empirically, RETROfit achieves most but not all of the quality benefit of full RETRO training, with substantially lower training cost.

Advertisement

Understanding how retrieved text is actually used in the forward pass requires working through the architecture in detail.

The neighbor encoder is a [bidirectional transformer](https://mbrenndoerfer.com/writing/encoder-architecture-bidirectional-transformers-understanding) that processes each retrieved sequence independently. Given a retrieved neighbor of length tokens (typically 128 tokens: 64 for the neighbor plus 64 for the continuation), the encoder produces a sequence of hidden states:

where is the encoder hidden dimension. These hidden states are the keys and values that the main model attends to through CCA.

Because the encoder is bidirectional, each token in the neighbor sequence attends to all other tokens, including those that come after it. This is appropriate because the neighbor is fully observed at inference time. The model is not generating the neighbor; it is reading it.

The encoder processes all neighbors in parallel. Their outputs are concatenated along the sequence dimension to form the full key-value matrix that the main model attends to for a given chunk.

When the main model reaches a CCA layer, it performs [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers) from the token representations in chunk to the encoded neighbor representations. Each token in can attend to all tokens across all encoded neighbors.

The cross-attention mechanism computes:

where:

- is the main model's
[hidden state](https://mbrenndoerfer.com/writing/rnn-architecture-recurrent-neural-networks-guide)for tokens in chunk - is the concatenated encoded representation of all neighbors for chunk
- are learned projection matrices
- is the key dimension

The output of CCA is combined with the main model's [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept) output through a residual connection and [layer normalization](https://mbrenndoerfer.com/writing/layer-normalization-transformers-implementation), before being passed to the feed-forward sublayer.

This design has a natural interpretation. The self-attention over allows tokens to contextualize themselves relative to the current local and global sequence context. The cross-attention to neighbors then allows those contextualized representations to be enriched with retrieved information. The feed-forward network integrates these two sources of information into the final token representations.

Advertisement

The causal constraint in RETRO creates a one-chunk lag in retrieval. When predicting tokens in chunk , the model uses retrieved neighbors queried from the prefix ending at chunk . This means the model never retrieves information that is directly relevant to the tokens it is currently predicting based on those same tokens, which preserves [autoregressive](https://mbrenndoerfer.com/writing/autoregressive-generation-gpt-text-generation) causality.

In practice, this lag is small (64 tokens) and the retrieved neighbors are typically relevant because they were retrieved using the preceding context, which is closely related to the current context in most natural text. A text that discusses the French Revolution in one chunk will almost certainly continue to discuss it in the next chunk, so neighbors retrieved for the preceding context remain relevant.

The lag does create a theoretical gap at sequence boundaries, where the very beginning of a new topic might not have optimal retrievals because the preceding context established a different topic. This is a known limitation of the chunked approach.

Advertisement

To make the chunked retrieval process concrete, walk through how RETRO processes a passage about climate science.

Suppose the model is processing the following 256-token passage (represented schematically as four 64-token chunks):

**Chunk 1**: "The Earth's average surface temperature has risen approximately 1.1 degrees Celsius since the late 19th century. This warming is primarily driven by increased atmospheric concentrations of greenhouse gases such as carbon dioxide and methane..."**Chunk 2**: "Carbon dioxide levels have increased from 280 parts per million in pre-industrial times to over 420 parts per million today. This increase is primarily attributable to the burning of fossil fuels, deforestation, and industrial processes..."**Chunk 3**: "The consequences of this warming include rising sea levels, more frequent extreme weather events, and disruptions to agricultural systems. Arctic sea ice extent has declined significantly, and permafrost regions are beginning to thaw..."**Chunk 4**: "International agreements such as the Paris Agreement aim to limit warming to 1.5 degrees Celsius above pre-industrial levels. Achieving this target requires substantial reductions in global greenhouse gas emissions by 2030..."

At the start of processing, the model has seen no context, so Chunk 1 is processed without any retrieved neighbors. This is unavoidable: there is no prefix to query against.

When the model begins processing Chunk 2, it encodes Chunk 1 as a retrieval query. The query embedding is a dense vector representation computed from the tokens in Chunk 1. The nearest-neighbor search finds database chunks that discuss similar material: passages about temperature measurements, greenhouse gas warming, historical climate records. These retrieved chunks, along with their continuations, become the CCA input for Chunk 2. The model can now predict tokens in Chunk 2 with access to related facts from elsewhere in the training corpus, for example data tables of historical temperature records or scientific explanations of the greenhouse effect that may not appear verbatim in the current passage.

When processing Chunk 3, the query is formed from the full prefix up to the end of Chunk 2. Now the model has more context to work with: the passage is clearly about climate science, specifically focusing on CO2 concentrations and their sources. The retrieved neighbors are likely to be even more relevant, potentially including passages about sea level rise data, extreme weather attribution studies, or Arctic observation reports.

This chunk-by-chunk retrieval rhythm means the model gets progressively better retrievals as the sequence unfolds and the topic becomes clearer. The first chunk is the weakest point, but for any passage of reasonable length, the majority of tokens are predicted with high-quality retrieved context.

The worked example also illustrates why the neighbor continuation matters. If the retrieval database contains a chunk beginning with "Arctic sea ice extent reached a record minimum in..." and the query from Chunk 2 matches this chunk, the model receives that chunk and the following text: "...2012, covering only 3.41 million square kilometers, roughly half the average from 1979-2000." This continuation, which extends beyond what was directly retrieved, gives the model access to specific quantitative facts that would be relevant for predicting tokens in Chunk 3 about Arctic conditions. Without the continuation, the model gets the beginning of a fact but not its resolution.

RETRO belongs to a family of architectures called semi-parametric models. A purely parametric model (like a standard GPT) stores all knowledge in its weights, which are fixed after training. A purely non-parametric model (like a k-nearest-neighbor classifier) stores all knowledge in a database and has no learned parameters at all. Semi-parametric models combine both: a neural network with learned weights handles computation and pattern recognition, while a database handles factual storage and retrieval. The key design question is how to allocate responsibility between the two components, which is exactly what RETRO's chunked cross-attention architecture addresses.

Advertisement

Let us build a simplified but complete implementation of the RETRO components to develop concrete intuition for the architecture. We will implement the core building blocks: the chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers) mechanism, a toy retrieval system, and a miniature RETRO-style [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need).

```
import numpy as np
import torch
# Set reproducibility
torch.manual_seed(42)
np.random.seed(42)
```


We will create a simple retrieval system using cosine similarity over dense [embeddings](https://mbrenndoerfer.com/writing/long-term-knowledge-storage-and-retrieval). In a full RETRO implementation, this would be approximate nearest-neighbor search over trillions of chunks, but the interface is identical.

```
import torch.nn.functional as F
class ToyRetrievalDatabase:
"""Simple retrieval database using cosine similarity over embeddings."""
def __init__(
self, n_chunks: int = 200, embed_dim: int = 64, vocab_size: int = 100
):
self.n_chunks = n_chunks
self.embed_dim = embed_dim
self.vocab_size = vocab_size
# Simulate chunk embeddings (in practice, computed by a frozen encoder)
self.embeddings = F.normalize(torch.randn(n_chunks, embed_dim), dim=-1)
def retrieve(self, query_embedding: torch.Tensor, k: int = 2) -> list:
"""Retrieve k nearest neighbors by cosine similarity."""
query_norm = F.normalize(query_embedding.unsqueeze(0), dim=-1)
similarities = torch.matmul(query_norm, self.embeddings.T).squeeze(0)
top_k_indices = torch.topk(similarities, k=k).indices.tolist()
return top_k_indices
def get_chunk_tokens(self, idx: int, chunk_len: int = 8) -> torch.Tensor:
"""Return a token tensor for the chunk at index idx."""
# In practice, these would be the actual tokenized chunks
gen = torch.Generator()
gen.manual_seed(idx)
return torch.randint(0, self.vocab_size, (chunk_len,), generator=gen)
```


Advertisement

The core RETRO mechanism is chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers). This module computes attention from main-sequence tokens to encoded neighbor tokens:

```
import math
import torch.nn as nn
import torch.nn.functional as F
class ChunkedCrossAttention(nn.Module):
"""Chunked cross-attention as in RETRO."""
def __init__(self, d_model: int, n_heads: int):
super().__init__()
self.d_model = d_model
self.n_heads = n_heads
self.d_k = d_model // n_heads
self.q_proj = nn.Linear(d_model, d_model, bias=False)
self.k_proj = nn.Linear(d_model, d_model, bias=False)
self.v_proj = nn.Linear(d_model, d_model, bias=False)
self.out_proj = nn.Linear(d_model, d_model, bias=False)
def forward(
self,
chunk_hidden: torch.Tensor, # (batch, chunk_len, d_model)
neighbor_hidden: torch.Tensor, # (batch, k * neighbor_len, d_model)
) -> torch.Tensor:
B, L, _ = chunk_hidden.shape
M = neighbor_hidden.shape[1]
Q = (
self.q_proj(chunk_hidden)
.view(B, L, self.n_heads, self.d_k)
.transpose(1, 2)
)
K = (
self.k_proj(neighbor_hidden)
.view(B, M, self.n_heads, self.d_k)
.transpose(1, 2)
)
V = (
self.v_proj(neighbor_hidden)
.view(B, M, self.n_heads, self.d_k)
.transpose(1, 2)
)
scale = math.sqrt(self.d_k)
attn_weights = torch.matmul(Q, K.transpose(-2, -1)) / scale
attn_probs = F.softmax(attn_weights, dim=-1)
attended = torch.matmul(attn_probs, V)
attended = attended.transpose(1, 2).contiguous().view(B, L, -1)
return self.out_proj(attended)
```


Advertisement

The encoder processes retrieved neighbors bidirectionally. In RETRO, this is a smaller [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) that produces hidden states for the retrieved text:

```
class NeighborEncoder(nn.Module):
"""Bidirectional transformer encoder for retrieved neighbors."""
def __init__(
self, vocab_size: int, d_model: int, n_heads: int, n_layers: int
):
super().__init__()
self.embedding = nn.Embedding(vocab_size, d_model)
encoder_layer = nn.TransformerEncoderLayer(
d_model=d_model,
nhead=n_heads,
dim_feedforward=d_model * 4,
batch_first=True,
norm_first=True,
)
self.transformer = nn.TransformerEncoder(
encoder_layer, num_layers=n_layers
)
self.d_model = d_model
def forward(self, neighbor_tokens: torch.Tensor) -> torch.Tensor:
"""
neighbor_tokens: (batch, k, neighbor_len)
Returns: (batch, k * neighbor_len, d_model)
"""
B, k, L = neighbor_tokens.shape
flat_tokens = neighbor_tokens.reshape(B * k, L)
embeds = self.embedding(flat_tokens) * math.sqrt(self.d_model)
encoded = self.transformer(embeds)
return encoded.reshape(B, k * L, self.d_model)
```


Advertisement

Now we put it together: a RETRO [transformer layer](https://mbrenndoerfer.com/writing/transformer-block-assembly) that combines [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept) with chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers):

```
class RETROLayer(nn.Module):
"""A single RETRO transformer layer: self-attention + CCA + FFN."""
def __init__(self, d_model: int, n_heads: int, is_retro_layer: bool = True):
super().__init__()
self.is_retro_layer = is_retro_layer
self.d_model = d_model
self.self_attn = nn.MultiheadAttention(
d_model, n_heads, batch_first=True
)
self.norm1 = nn.LayerNorm(d_model)
if is_retro_layer:
self.cca = ChunkedCrossAttention(d_model, n_heads)
self.norm_cca = nn.LayerNorm(d_model)
self.ffn = nn.Sequential(
nn.Linear(d_model, d_model * 4),
nn.GELU(),
nn.Linear(d_model * 4, d_model),
)
self.norm2 = nn.LayerNorm(d_model)
def forward(
self,
x: torch.Tensor,
attn_mask: torch.Tensor,
neighbor_hidden: torch.Tensor,
chunk_size: int,
) -> torch.Tensor:
B, S, D = x.shape
# 1. Self-attention
x_normed = self.norm1(x)
sa_out, _ = self.self_attn(
x_normed,
x_normed,
x_normed,
attn_mask=attn_mask,
need_weights=False,
)
x = x + sa_out
# 2. Chunked cross-attention (only in RETRO layers)
if self.is_retro_layer and neighbor_hidden is not None:
n_chunks = S // chunk_size
cca_outputs = []
for u in range(n_chunks):
start = u * chunk_size
end = start + chunk_size
chunk_normed = self.norm_cca(x[:, start:end, :])
cca_out = self.cca(chunk_normed, neighbor_hidden)
cca_outputs.append(cca_out)
x = x + torch.cat(cca_outputs, dim=1)
# 3. Feed-forward
x = x + self.ffn(self.norm2(x))
return x
```


```
class MiniRETRO(nn.Module):
"""A small RETRO-style language model. Every other layer includes CCA."""
def __init__(
self,
vocab_size: int = 100,
d_model: int = 64,
n_heads: int = 4,
n_layers: int = 4,
chunk_size: int = 8,
k: int = 2,
neighbor_len: int = 8,
):
super().__init__()
self.vocab_size = vocab_size
self.d_model = d_model
self.chunk_size = chunk_size
self.k = k
self.neighbor_len = neighbor_len
self.token_emb = nn.Embedding(vocab_size, d_model)
self.pos_emb = nn.Embedding(512, d_model)
# Neighbor encoder: smaller than main model
self.encoder = NeighborEncoder(
vocab_size, d_model // 2, n_heads // 2, n_layers=1
)
self.enc_proj = nn.Linear(d_model // 2, d_model)
# Alternate standard and RETRO layers
self.layers = nn.ModuleList(
[
RETROLayer(d_model, n_heads, is_retro_layer=(i % 2 == 1))
for i in range(n_layers)
]
)
self.norm_final = nn.LayerNorm(d_model)
self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
def forward(
self,
input_ids: torch.Tensor, # (batch, seq_len)
neighbor_ids: torch.Tensor, # (batch, n_chunks, k, neighbor_len)
) -> torch.Tensor:
B, S = input_ids.shape
device = input_ids.device
positions = torch.arange(S, device=device).unsqueeze(0)
x = self.token_emb(input_ids) + self.pos_emb(positions)
causal_mask = torch.triu(
torch.full((S, S), float("-inf"), device=device), diagonal=1
)
# Encode neighbors for the first chunk (demo simplification)
chunk_neighbors = neighbor_ids[:, 0, :, :] # (B, k, neighbor_len)
enc_out = self.encoder(chunk_neighbors) # (B, k * neighbor_len, d//2)
neighbor_h = self.enc_proj(enc_out) # (B, k * neighbor_len, d)
for layer in self.layers:
if layer.is_retro_layer:
x = layer(x, causal_mask, neighbor_h, self.chunk_size)
else:
x = layer(x, causal_mask, None, self.chunk_size)
return self.lm_head(self.norm_final(x))
```


Advertisement

Let us train this model on a simple synthetic language modeling task and compare it against a standard [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) baseline:

```
def make_causal_lm_data(
vocab_size: int = 100,
n_samples: int = 500,
seq_len: int = 32,
chunk_size: int = 8,
k: int = 2,
neighbor_len: int = 8,
):
input_ids = torch.randint(0, vocab_size, (n_samples, seq_len))
n_chunks = seq_len // chunk_size
neighbor_ids = torch.randint(
0, vocab_size, (n_samples, n_chunks, k, neighbor_len)
)
labels = torch.cat(
[input_ids[:, 1:], torch.zeros(n_samples, 1, dtype=torch.long)], dim=1
)
return input_ids, neighbor_ids, labels
class StandardLM(nn.Module):
"""Standard GPT-like transformer for comparison."""
def __init__(
self,
vocab_size: int = 100,
d_model: int = 64,
n_heads: int = 4,
n_layers: int = 4,
):
super().__init__()
self.token_emb = nn.Embedding(vocab_size, d_model)
self.pos_emb = nn.Embedding(512, d_model)
layer = nn.TransformerEncoderLayer(
d_model=d_model,
nhead=n_heads,
dim_feedforward=d_model * 4,
batch_first=True,
norm_first=True,
)
self.transformer = nn.TransformerEncoder(layer, num_layers=n_layers)
self.norm = nn.LayerNorm(d_model)
self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
B, S = input_ids.shape
pos = torch.arange(S, device=input_ids.device).unsqueeze(0)
x = self.token_emb(input_ids) + self.pos_emb(pos)
mask = torch.triu(
torch.full((S, S), float("-inf"), device=input_ids.device),
diagonal=1,
)
x = self.transformer(x, mask=mask, is_causal=True)
return self.lm_head(self.norm(x))
VOCAB_SIZE = 100
SEQ_LEN = 32
CHUNK_SIZE = 8
K = 2
NEIGHBOR_LEN = 8
BATCH_SIZE = 32
N_EPOCHS = 40
input_ids, neighbor_ids, labels = make_causal_lm_data(
vocab_size=VOCAB_SIZE,
n_samples=500,
seq_len=SEQ_LEN,
chunk_size=CHUNK_SIZE,
k=K,
neighbor_len=NEIGHBOR_LEN,
)
retro_model = MiniRETRO(
vocab_size=VOCAB_SIZE,
d_model=64,
n_heads=4,
n_layers=4,
chunk_size=CHUNK_SIZE,
k=K,
neighbor_len=NEIGHBOR_LEN,
)
standard_model = StandardLM(VOCAB_SIZE)
retro_opt = torch.optim.Adam(retro_model.parameters(), lr=3e-3)
standard_opt = torch.optim.Adam(standard_model.parameters(), lr=3e-3)
retro_losses = []
standard_losses = []
n_batches = len(input_ids) // BATCH_SIZE
for epoch in range(N_EPOCHS):
perm = torch.randperm(len(input_ids))
epoch_retro_loss = 0.0
epoch_standard_loss = 0.0
for b in range(n_batches):
idx = perm[b * BATCH_SIZE : (b + 1) * BATCH_SIZE]
x_batch = input_ids[idx]
n_batch = neighbor_ids[idx]
y_batch = labels[idx]
retro_opt.zero_grad()
retro_logits = retro_model(x_batch, n_batch)
retro_loss = F.cross_entropy(
retro_logits.view(-1, VOCAB_SIZE), y_batch.view(-1)
)
retro_loss.backward()
retro_opt.step()
epoch_retro_loss += retro_loss.item()
standard_opt.zero_grad()
std_logits = standard_model(x_batch)
std_loss = F.cross_entropy(
std_logits.view(-1, VOCAB_SIZE), y_batch.view(-1)
)
std_loss.backward()
standard_opt.step()
epoch_standard_loss += std_loss.item()
retro_losses.append(epoch_retro_loss / n_batches)
standard_losses.append(epoch_standard_loss / n_batches)
final_retro_loss = retro_losses[-1]
final_standard_loss = standard_losses[-1]
```


Final training loss (RETRO): 0.0034 Final training loss (Standard): 1.9145 RETRO parameter count: 296,672 Standard parameter count: 245,632

On this synthetic task with random neighbors, both models learn to reduce loss [over training](https://mbrenndoerfer.com/writing/inference-scaling-llm-deployment-optimization). Note that the RETRO model has additional parameters from the encoder and CCA modules. On real data where the retrieved neighbors are semantically related to the query sequence, the benefit of CCA becomes much more pronounced: the model can leverage actual factual content from the database rather than random neighbors. The synthetic demo captures the architectural mechanics but not the representational benefit.

Advertisement

One of the most instructive things we can examine is what the chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers) actually attends to. If the cross-attention is working correctly, tokens in a chunk should develop non-uniform attention patterns over neighbor tokens:

```
def get_cca_attention_weights(model, input_ids, neighbor_ids):
"""Extract CCA attention weights from the first RETRO layer."""
model.eval()
with torch.no_grad():
B, S = input_ids.shape
positions = torch.arange(S).unsqueeze(0)
x = model.token_emb(input_ids) + model.pos_emb(positions)
chunk_neighbors = neighbor_ids[:, 0, :, :]
enc_out = model.encoder(chunk_neighbors)
neighbor_h = model.enc_proj(enc_out)
causal_mask = torch.triu(torch.full((S, S), float("-inf")), diagonal=1)
# Forward through standard layer first (layer 0)
x = model.layers[0](x, causal_mask, None, model.chunk_size)
# Manually extract CCA weights from layer 1 (first RETRO layer)
retro_layer = model.layers[1]
x_normed = retro_layer.norm1(x)
sa_out, _ = retro_layer.self_attn(
x_normed,
x_normed,
x_normed,
attn_mask=causal_mask,
need_weights=False,
)
x = x + sa_out
chunk_h = x[:, : model.chunk_size, :]
chunk_normed = retro_layer.norm_cca(chunk_h)
cca = retro_layer.cca
chunk_len = chunk_h.shape[1]
neighbor_len = neighbor_h.shape[1]
Q = (
cca.q_proj(chunk_normed)
.view(B, chunk_len, cca.n_heads, cca.d_k)
.transpose(1, 2)
)
K = (
cca.k_proj(neighbor_h)
.view(B, neighbor_len, cca.n_heads, cca.d_k)
.transpose(1, 2)
)
scale = math.sqrt(cca.d_k)
attn = F.softmax(torch.matmul(Q, K.transpose(-2, -1)) / scale, dim=-1)
attn_weights = attn.mean(dim=(0, 1)).cpu().numpy()
return attn_weights
sample_input = input_ids[:1]
sample_neighbors = neighbor_ids[:1]
attn_weights = get_cca_attention_weights(
retro_model, sample_input, sample_neighbors
)
```


CCA attention weight matrix shape: (8, 16) rows = chunk tokens (8) cols = neighbor tokens (16): 2 neighbors x 8 tokens each Attention weight statistics: Mean: 0.0625 (uniform baseline = 0.0625) Max: 0.3371 Std: 0.0714 Attention entropy (mean): 2.2442 / max 2.7726 Entropy ratio: 0.809 (1.0 = fully uniform, lower = more focused)

The attention [entropy](https://mbrenndoerfer.com/writing/cart-decision-trees-classification-regression-mathematical-foundations-python-implementation) ratio tells us how selective the CCA is. A ratio near 1.0 means the model attends roughly equally to all neighbor tokens (not useful). After training, the attention becomes more structured, with the model assigning higher weights to specific positions in the retrieved sequences that are more relevant to the current chunk's tokens.

Advertisement

Retrieval-augmented training is a powerful paradigm but carries substantial engineering and conceptual challenges.

The training pipeline for RETRO is significantly more complex than standard [transformer](https://mbrenndoerfer.com/writing/transformer-attention-is-all-you-need) pretraining. Building and maintaining a 2 trillion token retrieval index requires specialized infrastructure. Pre-computing retrievals for all training sequences requires storing the retrieved neighbors alongside the training data, multiplying storage requirements. The encoder adds compute to each forward pass. Reindexing the retrieval database as the model evolves requires repeated embedding computation over the entire database.

In practice, few organizations outside of large research labs have deployed full-scale retrieval-augmented training. The infrastructure requirements are substantial: approximate nearest-neighbor indices over trillions of [embeddings](https://mbrenndoerfer.com/writing/long-term-knowledge-storage-and-retrieval) are nontrivial to build, query, and maintain.

The quality of the learned model is bounded by the quality of retrieval. If the nearest-neighbor search returns irrelevant neighbors, the CCA mechanism must learn to ignore them or, worse, may propagate irrelevant information through the network. In the original RETRO paper, using a fixed [BERT](https://mbrenndoerfer.com/writing/bert-bidirectional-pretraining-revolutionizes-language-understanding)-based retriever that was not updated during training means the retrieval quality may not be optimal for the task at hand.

The retrieval quality problem is especially acute for rare topics. Well-represented topics in the retrieval database yield good neighbors; obscure or specialized topics may not have relevant entries, leaving the model to fall back on its parametric knowledge for those queries.

Advertisement

Pre-computing retrievals and caching them throughout training creates a subtle mismatch: the cached retrievals were computed by a retriever that does not co-evolve with the main model. As the main model's representations change, the optimal retrieved neighbors might change, but the cached neighbors remain fixed. This is analogous to using stale gradients in asynchronous distributed training: it works in practice but introduces noise relative to the ideal.

Joint training of the retriever and main model is theoretically superior but requires periodic reindexing of the retrieval database, which is expensive. Some follow-up work has explored online retrieval with periodic index refreshes, but this remains an active research area.

Advertisement

At inference time, RETRO requires a retrieval step for each chunk of the generated sequence. This adds latency that standard dense models do not have. For conversational applications where low latency is important, the retrieval overhead can be significant, requiring careful optimization of the nearest-neighbor search pipeline. Batched inference with retrieval caching can mitigate this, but it adds engineering complexity.

Advertisement

While retrieval-augmented training solves the knowledge staleness problem at inference time (by allowing the database to be updated), the model's ability to use the retrieved information is still governed by its training-time distribution. If a new type of knowledge structure appears in the database that was not represented during training, the model may not know how to integrate it optimally.

Advertisement

A retrieval database used in production must be continuously maintained: new documents added, stale or incorrect documents removed, [embeddings](https://mbrenndoerfer.com/writing/long-term-knowledge-storage-and-retrieval) recomputed for changed documents. For a 2 trillion token database, this is a substantial ongoing engineering effort. The operational cost of maintaining a retrieval database is often underestimated in research settings.

Advertisement

RETRO and retrieval-augmented training represent a broader shift in how the field thinks about the relationship between model parameters and external memory.

The traditional view of a language model was a self-contained system: all knowledge in weights, all computation in the forward pass. RETRO demonstrated that this is not optimal. Some knowledge, particularly factual and encyclopedic knowledge, is more efficiently stored in databases than in weights. Model parameters can be specialized toward the kinds of computation that are genuinely hard to offload: reasoning, syntactic understanding, stylistic generation.

To appreciate why this matters, consider what happens when a model must store a fact like "the 2019 Nobel Prize in Physics was awarded for theoretical discoveries in physical cosmology." This fact appears infrequently in text, so the gradient signal pushing the model to remember it is weak. The memory will compete with millions of other rare facts for weight capacity. The fact may be partially encoded in several [attention heads](https://mbrenndoerfer.com/writing/multi-head-attention-transformers), none of which has it with high fidelity. When the model is asked to recall it, the retrieval succeeds sometimes and fails others. Contrast this with a retrieval database: the fact is stored verbatim in a Wikipedia article, searchable by any query about Nobel Prizes, cosmology, or 2019 physics achievements. Retrieval is deterministic and exact.

This comparison highlights that "storing facts in weights" is a fundamentally lossy and unreliable process. Weights encode [probability distributions](https://mbrenndoerfer.com/writing/probability-distributions-guide-data-science) over tokens, not discrete facts. Facts that are rarely co-occurring with queries lose fidelity [over training](https://mbrenndoerfer.com/writing/inference-scaling-llm-deployment-optimization). RETRO's insight is that this lossy encoding is not necessary for factual knowledge, which can be stored losslessly in a database.

This connects to a broader research program on semi-parametric models: systems that combine a parametric component (the neural network) with a non-parametric component (a database, a retrieval system, or an external tool). Inference-time [RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag), explored in previous chapters, is the most widely deployed instance of this paradigm. RETRO shows that the integration can be made much tighter by training with retrieval from the start.

The ideas in RETRO have influenced subsequent work in several directions. Atlas (Izacard et al., 2022) showed that jointly fine-tuning the retriever and the reader for specific tasks could substantially outperform RETRO on knowledge-intensive benchmarks. The key innovation in Atlas was allowing gradients to flow through the retrieval system during fine-tuning, so the model could learn to retrieve the specific kinds of information it needed for a given task. Toolformer (Schick et al., 2023) extended the idea of training with [external tools](https://mbrenndoerfer.com/writing/why-ai-agents-need-tools) beyond retrieval to calculators, search engines, and translation systems, with the model learning to call these tools through its own generation. Internet-augmented language models explore querying live web search during inference, generalizing the static database to the entire indexed web.

A related but distinct development is the use of retrieval during fine-tuning for knowledge-intensive tasks. Rather than training with retrieval from scratch (as in RETRO) or adapting frozen models to use retrieval at inference time (as in standard [RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag)), intermediate approaches train a base model normally and then fine-tune it with retrieval using task-specific supervision. This "retrieval-augmented fine-tuning" has shown strong results on tasks like open-domain [question answering](https://mbrenndoerfer.com/writing/ibm-watson-jeopardy-open-domain-question-answering-nlp-information-retrieval), where the model must retrieve relevant passages before generating an answer.

The long-term trajectory of this research direction points toward models that are deliberately designed for open-world operation: models that know how to use external information sources, that can identify when their parametric knowledge is insufficient and defer to retrieval, and that can integrate retrieved content with their own learned representations seamlessly. RETRO provides the foundational architectural blueprint for this kind of system.

Looking ahead to topics we will cover in the following chapters on long-form generation, the lessons from retrieval-augmented training inform how we think about maintaining coherence when producing extended text: retrieval can ground each section in relevant content from earlier parts of the document or from external sources. The decomposition between computation and memory that RETRO exemplifies is increasingly central to efficient language model design.

Advertisement

The key parameters for RETRO-style retrieval-augmented training are:

**chunk_size**: The number of tokens per chunk, controlling the granularity of retrieval alignment. RETRO uses 64 tokens. Smaller chunks mean more frequent retrieval and finer alignment, at higher computational cost.**k**: The number of retrieved neighbors per chunk. RETRO retrieves 2 neighbors. More neighbors provide more context but increase the[cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers)cost and may introduce noise.**neighbor_len**: The length of each retrieved neighbor sequence, including the continuation. RETRO uses 128 tokens (64 neighbor + 64 continuation).**retro_layer_frequency**: How frequently CCA layers appear in the stack. More RETRO layers provide more integration opportunities but increase computation.**database_size**: The total number of tokens in the retrieval database. RETRO demonstrates that doubling database size consistently improves[perplexity](https://mbrenndoerfer.com/writing/perplexity-language-model-evaluation-metric), suggesting diminishing but meaningful returns.

Advertisement

Retrieval-augmented training integrates external memory into the model at training time rather than as an inference-time add-on. The key insight is that language models trained with retrieval develop specialized mechanisms for reading and integrating retrieved content, making them more effective at using external knowledge than models trained without retrieval that are given retrieved context at inference time.

The [RETRO architecture](https://mbrenndoerfer.com/writing/rag-architecture-retriever-generator-design-patterns) achieves this through chunked [cross-attention](https://mbrenndoerfer.com/writing/cross-attention-encoder-decoder-transformers): splitting input sequences into fixed-length chunks, retrieving relevant neighbors for each chunk from a massive database, and attending to those neighbors through dedicated cross-attention layers interspersed with standard [self-attention](https://mbrenndoerfer.com/writing/self-attention-concept). The 25x parameter reduction demonstrated by RETRO, relative to [GPT-3](https://mbrenndoerfer.com/writing/gpt-3-scale-few-shot-in-context-learning) at matched [perplexity](https://mbrenndoerfer.com/writing/perplexity-language-model-evaluation-metric), suggests that much of what large models store in their weights is effectively a compressed fact database that can be more efficiently stored externally.

The paradigm raises important engineering challenges: maintaining large retrieval databases, pre-computing and caching retrievals for training, managing the mismatch between static cached retrievals and evolving model representations, and handling inference latency. These challenges explain why retrieval-augmented training remains primarily a research direction rather than a widely deployed production technique, though inference-time [RAG](https://mbrenndoerfer.com/writing/dense-passage-retrieval-retrieval-augmented-generation-rag) has seen broad adoption.

The broader lesson is architectural: model parameters and external databases have different strengths. Parameters excel at encoding procedural knowledge, reasoning patterns, and linguistic structure. Databases excel at storing and precisely retrieving factual content. Designing systems that allocate each type of knowledge to its most efficient storage medium is a productive direction for continued research.

Ready to test your understanding? Take this quick quiz to [reinforce](https://mbrenndoerfer.com/writing/policy-gradient-methods-reinforce-algorithm) what you've learned about retrieval-augmented training and the [RETRO architecture](https://mbrenndoerfer.com/writing/rag-architecture-retriever-generator-design-patterns).

### Retrieval-Augmented Training Quiz

## Reference

Advertisement

## Stay up to date.

Get articles, book updates, and news delivered to your inbox.

No spam, unsubscribe anytime.

## Join the community.

Sign in to remove popups, track your reading progress, and join the discussion.

## Comments
