---
url: https://docs.getdynamiq.ai/low-code-builder/llm-agents/guide-to-implementing-llm-agents-react-and-simple-agents
title: Guide to Implementing LLM Agents: ReAct and Simple Agents | Dynamiq Docs
fetched_at: 2026-05-30T19:31:07
content_hash: sha1:c9966445258e74316fddd7ec0d85e8bb0e97abe5
extractor: trafilatura
---

# Guide to Implementing LLM Agents: ReAct and Simple Agents

In this guide, we will walk through the configuration and usage of two main types of LLM-based agents: **ReAct Agent** and **Simple Agent**. We will discuss their unique features, configuration steps, and best practices, along with how to use tool integrations to enhance their capabilities.

#### 1. ReAct Agent: Reasoning + Action

**Overview**

The ReAct Agent combines reasoning and tool-based actions to handle complex, dynamic tasks. This agent operates in a loop-based framework that iteratively uses external tools, makes decisions, and processes feedback to achieve its goals.

**How It Works**

The ReAct approach is inspired by human reasoning and action, utilizing Chain-of-Thought (CoT) prompting to guide the agent's decision-making. By incorporating external data through tools, ReAct overcomes limitations like knowledge cutoff and hallucination issues, allowing the agent to update its knowledge and respond accurately.

**Key Configuration Options**

**Name**: Unique identifier for the agent**Tools**: External services the agent can leverage (search engines, scrapers, etc.)**LLM**: The large language model powering the agent**Role**: Defines the agent's persona and behavior guidelines**Memory**: Optional configuration for persistent knowledge retention**Advanced Settings**:**Max Loop**: Maximum number of reasoning-action cycles (default: 10)**Behavior on Max Loops**: Action when max loops is reached (Return/Continue)**Inference Mode**: Response format (XML recommended)**Streaming**: Toggle for incremental response generation**Streaming Mode**: Controls how streaming responses are delivered (Final/Incremental)**By Tokens**: Stream responses token by token**Tool Params**: Whether to include tool parameters in streaming responses


**Step-by-Step Setup**

**Basic Configuration**Start by defining the**name**,**role**, and selecting an**LLM**for the agent.**Tool Integration**Select and configure tools like**ScaleSerp**or**ZenRows**. These tools are employed in the reasoning-action loop to fetch external data and assist with decision-making.**Example Tool Setup**: Use ScaleSerp for web search and ZenRows for structured data extraction from web pages.Agents equipped with search tools can access real-time information, improving response accuracy.


**Execution Flow**The ReAct Agent works in a cycle of thinking, acting, and evaluating results. The agent:Receives an input query

Determines the necessary actions

Utilizes the appropriate tools

Assesses the gathered data

Loops if additional information or reasoning is needed

Concludes with a formatted response


**Testing the Agent**Test the ReAct agent with a series of queries to evaluate its decision-making, data handling, and loop termination when reaching**max_loops**.

**Best Practices**

Set reasonable

`max_loops`

value based on task complexityDefine clear roles with specific behavioral guidelines

Configure appropriate error handling for loop termination

Use tool combinations that complement each other


#### 2. Simple Agent: Direct Prompt-Response

**Overview**

The Simple Agent is designed for straightforward tasks, focusing on single-turn, prompt-response interactions without the need for external tools. It is ideal for content generation, summarization, or any task that requires minimal context and processing.

**Key Configuration Options**

**Name**: Unique identifier for the agent**LLM**: The language model powering the agent**Role**: Detailed instructions guiding the agent's responses**Memory**: Optional but typically not needed for simple agents

**Step-by-Step Setup**

**Basic Configuration**Define the**name**, select the**LLM**, and set up the**role**.**Role Definition**Provide detailed instructions in the role field to ensure the agent’s responses align with your requirements. Example role definition:**Execution Flow**The Simple Agent’s flow is straightforward:Receives input

Processes based on role

Directly generates a response



**Best Practices for Simple Agent**

**Role Specificity**: A well-defined role ensures the agent’s responses are aligned with expectations.**Usage Suitability**: Ideal for tasks that do not require tool usage or iterative reasoning, such as content modification or summarization.**Reflection Strategy**: Use the role section for reflective tasks, where the agent can assess or refine content based on role instructions

#### 3. Reflection Agent

**Overview** The Reflection Agent extends the ReAct paradigm by adding self-assessment capabilities. It evaluates its own responses before finalizing outputs, improving accuracy and reducing hallucinations.

**Key Features**

Self-criticism loop for quality control

Can backtrack and revise responses

Higher accuracy on complex reasoning tasks

Uses the same configuration options as ReAct Agent


**Best Practices**

Use for high-stakes or fact-sensitive applications

Set appropriate max loops as reflection adds processing cycles

Define clear evaluation criteria in the role description


### Memory Systems

Memory enables agents to retain information across interactions, providing context and continuity for complex workflows.

#### Memory Types

**Pinecone**Vector database for semantic search

Configuration options:

Connection: Select existing or create new

Index name: Name of the memory store (e.g., "conversations")

Namespace: Logical division within index (e.g., "default")

Dimension: Vector size (typically 1536 for OpenAI embeddings)

Index type: Serverless or Cloud-based

Region: Geographic location for data storage



**Qdrant**Alternative vector database

Similar configuration options to Pinecone

Better for certain specialized use cases



#### Embedder Configuration

Select the embedding model for converting text to vectors

Options typically include OpenAI, Cohere, or custom embedders

Dimension size must match the selected embedder's output


#### Memory Best Practices

Use memory for multi-turn conversations

Consider privacy implications and data retention policies

Test memory retrieval with various query types

Implement regular memory maintenance to prevent vector store bloat


### Agent Comparison

Use Case

Complex tasks, research, data gathering

Content generation, formatting, summarization

Fact-sensitive, high-accuracy needs

Tool Integration

Extensive

None

Extensive

Processing Steps

Multiple loops

Single-turn

Multiple loops with self-assessment

Memory Requirements

Often beneficial

Rarely needed

Often beneficial

Configuration Complexity

High

Low

High

Response Time

Longer

Quick

Longest

#### Workflow Examples

**ReAct Agent Workflow**

**Objective**: Create a search assistant that finds real-time information on the web.**Execution**:User inputs a query

ReAct agent engages

**ScaleSerp**to searchExtracts, processes, and verifies data

Provides a formatted, factual response



**Simple Agent Workflow**

**Objective**: Summarize a provided document.**Execution**:User provides document text

Simple agent processes the text based on its summarization role

Returns a concise summary, maintaining a professional tone as specified in the role.



#### Conclusion

LLM agents provide a powerful framework for building AI applications with varying levels of complexity. By understanding the strengths and configuration options of each agent type, you can design workflows that effectively solve real-world problems.

The key to success lies in proper configuration, clear role definitions, and appropriate tool selection. Start with simpler implementations and gradually incorporate more advanced features as you become familiar with the platform's capabilities

Last updated
