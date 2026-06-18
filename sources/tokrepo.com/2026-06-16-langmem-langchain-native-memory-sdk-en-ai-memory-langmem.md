---
url: https://tokrepo.com/en/ai-memory/langmem
title: LangMem — LangChain-Native Memory SDK
fetched_at: 2026-06-16T16:56:49
content_hash: sha1:299ec1bfabec6f578ae27f63aada5c29a33cf33a
extractor: trafilatura
---

# LangMem — LangChain-Native Memory SDK

LangMem is LangChain’s official memory SDK. It provides memory management tools (semantic, episodic, procedural) that plug into LangGraph agents and LangChain chains.

## Why LangMem

If your stack already lives in LangChain/LangGraph, **LangMem is the path of least resistance**. It exposes memory tools with the same signature as every other LangChain tool — an agent binds them alongside search, retrieval, and action tools, and writes/reads memory as a regular tool call.

LangMem distinguishes three memory types, borrowed from cognitive psychology: **semantic** (facts about the user/domain), **episodic** (specific past events), and **procedural** (learned workflows). Different tools target different types, letting you model memory with slightly more structure than a single flat store.

Its ceiling is lower than [Zep](https://tokrepo.com/en/ai-memory/zep) or [Letta](https://tokrepo.com/en/ai-memory/letta) — no native graph, no built-in summarization service — but the LangChain integration is so tight that the overall DX is hard to beat inside that ecosystem.

## Quick Start — LangGraph + LangMem

The two tools (manage + search) are the complete LangMem write/read API. The agent decides when to call them via the React pattern. Swap InMemoryStore for Postgres or Redis stores in production — LangGraph ships adapters for both.

```
# pip install langmem langgraph langchain-openai
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.store.memory import InMemoryStore
from langmem import create_manage_memory_tool, create_search_memory_tool
store = InMemoryStore(index={"dims": 1536, "embed": "openai:text-embedding-3-small"})
llm = ChatOpenAI(model="gpt-4o-mini")
agent = create_react_agent(
llm,
tools=[
create_manage_memory_tool(namespace=("facts",)),
create_search_memory_tool(namespace=("facts",)),
],
store=store,
)
for out in agent.stream({"messages": [{"role": "user",
"content": "Remember that I prefer dark mode and use Vim."}]}):
print(out)
for out in agent.stream({"messages": [{"role": "user",
"content": "What editor and theme should I recommend to a new hire like me?"}]}):
print(out)
```


## Key Features

### LangGraph Store integration

LangMem tools write through LangGraph’s Store abstraction, so the same memory code works with in-memory, Postgres, Redis, or custom store backends.

### Three memory types

Semantic (stable facts), episodic (specific events with timestamps), procedural (learned workflows / rules). Each has dedicated tool helpers.

### Namespaced memory

Memory is addressed by namespace tuples: ("user_id", "profile") vs. ("user_id", "events"). Trivial to partition and query.

### ReAct-style tool calls

Memory reads/writes are regular tool calls, not background extraction. Tight control over when and what the agent remembers, but more LLM turns than mem0’s extraction model.

### Hot / background paths

LangMem supports both on-demand memory management (agent calls tools live) and scheduled background extraction (a separate process periodically summarizes threads).

### LangSmith tracing

Every memory tool call shows up in LangSmith with full arguments. Debugging memory behavior is just scrolling the trace.

## Comparison

| Ecosystem Fit | Extraction Model | Storage | Overhead | |
|---|---|---|---|---|
| LangMemthis | LangChain / LangGraph | Agent-directed or scheduled | LangGraph Store (any backend) | Medium |
| mem0 | Framework-agnostic | Automatic extraction | Vector DB of choice | Low |
| Letta | Stateful agent server | Agent-directed (paged) | Postgres-backed | High |
| Zep | Framework-agnostic | Automatic + hybrid search | Postgres + pgvector | Low-medium |

## Use Cases

### 01. LangGraph-native agents

If your agent is already a LangGraph StateGraph, LangMem drops in with a single tool import. Minimal new abstractions to learn.

### 02. Structured memory separation

When you want distinct spaces for user profile vs event log vs learned procedures, the namespace + memory-type split is cleaner than cramming everything into one store.

### 03. Team standardization on LangChain

Organizations that have already invested in LangChain tooling (LangSmith, LangServe) get observability, deployment, and memory in one coherent stack.

## Pricing & License

**LangMem:** MIT open source. No license cost. You pay for your LangGraph Store backend (Postgres, Redis) plus LLM API usage for embeddings and any background extraction you enable.

**LangSmith** (optional tracing): free tier + paid plans at [smith.langchain.com](https://smith.langchain.com/pricing). Not required for LangMem to function.

**Operational cost:** same order as mem0 or Zep if you do automatic background extraction; lower if the agent only writes memory on demand via tool calls.

## Frequently Asked Questions

## LangMem vs mem0 — which is better?+

Neither is strictly better — they pick different trade-offs. LangMem requires LangChain and gives you explicit tool-call control. mem0 works with any framework and handles extraction automatically. Choose based on your stack.

## Do I need LangGraph to use LangMem?+

LangMem’s sweet spot is LangGraph agents, but the underlying store API can be used from plain LangChain chains or even raw Python. You lose some of the integration benefits (React loop, Store adapters) outside LangGraph.

## Can LangMem do cross-session memory?+

Yes — namespace memories by user_id instead of thread_id. Different threads by the same user share the ("user_id", "profile") namespace and therefore the same stored facts.

## Does LangMem support summarization?+

LangMem itself doesn’t run a summarization service. Use LangGraph’s built-in message filtering + a summary node in your graph. Or pair with Motorhead/Zep for dedicated session summarization.

## Is LangMem stable enough for production?+

It’s newer than mem0/Zep (released 2024) but backed by LangChain’s engineering team and already used in production by LangChain users. API is stabilizing; watch the changelog for minor breaks during the 0.x series.
