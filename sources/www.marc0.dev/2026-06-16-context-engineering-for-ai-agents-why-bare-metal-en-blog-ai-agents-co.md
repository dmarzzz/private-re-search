---
url: https://www.marc0.dev/en/blog/ai-agents/context-engineering-bare-metal-agents-why-less-abstraction-wins-1772633100000
title: Context Engineering for AI Agents: Why Bare Metal Wins
fetched_at: 2026-06-16T16:58:23
content_hash: sha1:b339f37ff4a67a7f8e73a04c05ab52aeea84247e
extractor: trafilatura
---

Everyone's talking about context engineering. Most people think it means writing better prompts. It doesn't.

Context engineering is about what data reaches the agent, in what format, through what pipes. It's API design for AI. And here's what nobody's saying: the best context engineering removes layers. It doesn't add them.

I've been building agent systems for the past year, and the single biggest performance improvement didn't come from better prompts, smarter models, or more sophisticated retrieval. It came from removing the framework.

Here's why: frameworks need documentation files because agents don't understand them. Bare metal uses patterns the agent already knows from training data. That's the whole insight. And there's now research backing it up.

## What Context Engineering Actually Means

Context engineering is not prompt engineering. Prompt engineering is what you say to the model. Context engineering is what the model can see when it starts working.

Think of it this way: prompt engineering is the job description. Context engineering is the desk, the tools, the data access, the systems the agent gets to work with. I've written about [why the environment matters more than the prompt](https://www.marc0.dev/en/blog/ai-agents/why-prompt-engineering-doesnt-scale-and-what-actually-does-1772625780952) — context engineering is the practical implementation of that thesis.

Building effective agents starts here. The agent is only as good as the context it receives. Three dimensions matter:

**What data to inject.** Not everything — the right things. Schema, business rules, live state, constraints. The actual data the agent needs for this specific task, not a general knowledge dump.

**When to inject it.** At runtime, not at training time. The agent needs the world state right now, not a cached summary from yesterday.

**How to structure it.** Raw, structured, machine-readable. Not human-friendly documentation — agent-friendly data. JSON, not prose. Schema, not description.

This is, at its core, an API design problem.

## Context Engineering is API Design

Every context engineering decision is an API design decision. What endpoints to expose. What data to return. What format to use. What to include, what to leave out.

Good API design for agents means raw data, structured responses, no lossy compression. The agent gets the actual database schema, not a description of the schema. It gets the real API response, not a summary of what the API typically returns.

Bad API design for agents means summarized endpoints, pre-filtered results, and abstraction layers that hide data from the agent. Every layer between the agent and the data is information loss.

This is where frameworks break down. Frameworks add abstraction by design — that's their entire value proposition. They abstract away complexity so you don't have to deal with it. But when the agent is the one doing the work, abstraction becomes the problem. The agent can't reason about what it can't see.

## How LLM Agents Actually Process Context

Here's something most framework advocates miss: LLM agents process everything in the context window equally. They can't distinguish between "important context" and "framework overhead." It's all tokens.

When a framework injects its routing configurations, schema wrappers, tool definitions, state management metadata, and abstraction layer instructions into the context — the agent processes all of it. It reasons about noise alongside signal. Every token spent on framework overhead is a token not available for reasoning about the actual problem.

The ETH Zurich study from February 2026 proved this directly. Researchers tested whether AGENTS.md files — context files that explain tools, frameworks, and project structure to the agent — actually help performance. The result: automatically generated context files reduced success rates by roughly 3% while increasing inference costs by over 20%.

The agents were too obedient — they followed unnecessary instructions from context files, making tasks harder instead of easier. Codebase overviews and directory listings — a staple of most context files — didn't help agents navigate faster. The agents were already good at discovering things on their own when working with patterns they understand.

This leads directly to the core insight.

## The Framework Knowledge Gap

Here's what nobody's saying: frameworks like LangChain, CrewAI, and their equivalents introduce their own abstractions, their own APIs, their own patterns. The LLM has never seen these during training — or at best, has seen early versions that no longer match the current API.

So what do you do? You write .md files. You write documentation. You inject instructions explaining how the framework works. You're teaching the agent a new language it doesn't speak natively.

Bare metal — raw API calls, fetch(), direct HTTP, standard libraries — the agent already knows these. They're in the training data. The LLM has seen millions of examples of fetch() calls, REST APIs, JSON parsing, standard patterns. It doesn't need a manual. It doesn't need .md files explaining how to use them.

This is the whole thing: **frameworks create a knowledge gap that you then have to fill with context.** That context bloats the window. That bloat degrades performance. You're spending tokens teaching the agent how to use your framework instead of letting it reason about the actual problem.

The ETH Zurich study validates this precisely. Context files that describe tools and frameworks to the agent hurt more than they help. The best-performing setups kept context files under 60 lines. Professional teams keep their context files as small as possible — because more instructions means worse performance.

The irony: framework makers tell you "it makes building agents easier." Then you spend days writing .md files explaining the framework to the agent. If you have to explain your tool to the AI, maybe the tool is the problem.

Weekly insights on AI Architecture. No spam.

## Why Context Bloat Kills Agent Performance

The research on context window degradation is clear and consistent. More context doesn't just fail to help — it actively hurts.

Chroma Research's technical report on "Context Rot" tested 18 LLMs and found that model performance degrades as input length grows, often in surprising and non-uniform ways. Adding full conversation history — roughly 113,000 tokens — dropped accuracy by 30% compared to a focused 300-token version of the same task. The performance degradation isn't gradual. It's unpredictable, model-specific, and often catastrophic.

The NoLiMa benchmark from Adobe Research tested 12 LLMs that claim to support at least 128K tokens of context. At short contexts under 1,000 tokens, models like GPT-4o achieved 99.3% accuracy. At 32,000 tokens, that dropped to 69.7%. Ten out of twelve models fell below 50% of their short-context performance at 32K tokens.

The practical reality: a model advertising 200,000 tokens of context typically becomes unreliable around 130,000. Effective capacity is 60-70% of the advertised maximum. Frameworks push you past this threshold by injecting overhead context — routing configurations, schema wrappers, tool definitions, state management metadata — before the agent even starts working on your actual problem.

Bare metal keeps you under the cliff. When the agent doesn't need framework documentation, routing configs, or abstraction layer instructions in its context window, you have more room for the data that actually matters. I've written about [why the environment, not the model, prevents agent hallucinations](https://www.marc0.dev/en/blog/ai-agents/agent-hallucinations-not-the-model-its-the-environment-1772627451138) — context engineering is how you build that environment.

## The Bare Metal Agent Architecture

What does bare metal actually look like? Raw API calls. Direct data access. No abstraction layer between the agent and the systems it works with.

The architecture is straightforward: direct API calls + context injection. The agent calls APIs directly — the same APIs you'd call manually. It gets raw JSON responses. It sees the actual data. No framework pre-processing. No summarization layer. No abstraction hiding what's really happening.

Why this works: the agent sees every byte flowing through the system. Full visibility means full reasoning capability. The agent doesn't need someone to explain the data format — it reads JSON natively. It doesn't need documentation for REST APIs — it's been trained on millions of them.

The counter-intuitive insight: **bare metal agents need LESS context because they have FULL data visibility.** Frameworks force you to inject more context to compensate for what the abstraction hides. When the agent works with patterns it already understands — standard HTTP, JSON, REST — you don't need to explain anything. You just give it the data and let it work.

This connects to how I think about [context injection as a pillar of autonomous agent architecture](https://www.marc0.dev/en/blog/ai-agents/fully-autonomous-agent-architecture-autonomy-levels-l1-l5-guide-1772631133969). The less overhead between the agent and reality, the more autonomous it can be.

Agent coordination works the same way. Instead of framework-managed message passing between agents — which adds overhead and hides data — use the environment as the message bus. Event-driven coordination. Agents react to environment changes, not to each other. No abstraction layer managing the conversation. Just shared data state.

## Building Agents Without Frameworks

What does building agents from scratch actually look like in practice?

The stack is simple: raw API calls + context injection + verification. Data in, logic, data out. The shortest path between the agent and the data wins.

The comparison tells the story. 4 lines of fetch() versus 200 lines of LangChain abstraction spaghetti. Both accomplish the same thing — sending a prompt with context to a model. But the fetch() version has zero overhead. Zero framework documentation needed. Zero extra tokens consumed teaching the agent how to use a tool it doesn't understand.

Does this mean frameworks never make sense? No. If you need to ship a proof of concept in 48 hours and you don't care about performance, a framework gets you there faster. If you have a large team that needs standardized patterns and you're willing to pay the performance tax, frameworks provide that structure.

But if agent performance matters — if reasoning quality matters, if context efficiency matters, if you want to build effective agents that actually work at scale — bare metal is the architecture. Not because it's trendy. Because it's the shortest path between the agent and reality.

The migration path isn't even a rewrite. It's removing layers. Strip the framework. Keep the logic. Let the agent work with patterns it already understands.

## The Context Engineering Thesis

Context engineering isn't about writing better prompts. It's about giving the agent better data through cleaner pipes.

Frameworks create a knowledge gap. You fill that gap with documentation. That documentation bloats the context. That bloat kills performance. The ETH Zurich study proves it. The Chroma Research data confirms it. The architecture explains why.

Bare metal means the agent works with training data it already understands. No .md files needed. No framework documentation consuming your context window. More room for actual work. Better results.

The best abstraction layer is no abstraction layer. Your job is to build the shortest pipe between the agent and reality.
