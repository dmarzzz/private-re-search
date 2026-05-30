---
url: https://deepwiki.com/anildukkipatty/ai-agents-examples/3.3-tool-integration
title: Tool Integration | anildukkipatty/ai-agents-examples | DeepWiki
fetched_at: 2026-05-30T19:31:07
content_hash: sha1:1f33545521f53d940d1389604be95e28fd166b6f
extractor: trafilatura
---

Loading...

Loading...

Menu

This page documents how to extend AI agents with external tools and services in the ai-agents-examples repository. Tools allow agents to access external functionalities such as web search, data processing, and API interactions beyond their core reasoning capabilities. For information about using these tools within the ReAct pattern, see [ReAct Agents](https://deepwiki.com/anildukkipatty/ai-agents-examples/3.2-react-agents).

This documentation covers:

- How to define tools using the LangChain framework
- Methods for integrating tools with language models
- Implementation examples of direct tool binding and ReAct agent tool usage
- Patterns for building workflows that leverage tools

Sources: [tool.js1-34](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L1-L34) [tool-react.js1-35](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L1-L35)

Tools in LangChain are defined using the `DynamicStructuredTool`

class, which provides a structured way to create callable functions that language models can use.

In the repository, a search tool is implemented as follows:

The search tool implementation uses Zod for schema validation and provides a mock implementation that returns weather information.

Sources: [tool.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L10-L20) [tool-react.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L10-L20)

The repository demonstrates two primary methods for integrating tools with language models:

Tool binding attaches tools directly to a language model, allowing it to decide when to use them based on the conversation context.

The `bindTools()`

method creates a new LLM instance that can use the provided tools when appropriate. When the LLM detects that a tool would be helpful, it automatically formats the request and calls the tool.

Sources: [tool.js28-34](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L28-L34)

The ReAct (Reasoning + Acting) pattern uses a more structured approach where the agent explicitly reasons about when to use tools and interprets their results.

The `createReactAgent()`

function creates an agent that follows the ReAct pattern, which allows for more explicit reasoning about tool usage. This approach shows the agent's thought process, tool selection, and interpretation of results.

Sources: [tool-react.js26-36](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L26-L36)

Both example files define a search tool with similar parameters:

| Component | Description |
|---|---|
| Name | "search" |
| Description | "Use to surf the web, fetch current information, check the weather, and retrieve other information." |
| Schema | Zod object with a "query" string parameter |
| Function | Async function that returns weather information |

Example implementation:

```
DynamicStructuredTool({
name: "search",
description: "Use to surf the web...",
schema: z.object({
query: z.string().describe("The query to use in your search.")
}),
func: async ({}) => {
return "London is Cold, with a low of 13 ℃";
}
})
```


Sources: [tool.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L10-L20) [tool-react.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L10-L20)

The `tool.js`

file demonstrates binding tools directly to a language model:

- Create the tool(s) using
`DynamicStructuredTool`

- Initialize a language model (ChatOpenAI)
- Bind the tools to the LLM using
`bindTools()`

- Invoke the tool-enabled LLM with a query

Sources: [tool.js22-34](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L22-L34)

The `tool-react.js`

file shows creating a ReAct agent with tool integration:

- Create the tool(s) using
`DynamicStructuredTool`

- Initialize a language model (ChatOpenAI)
- Create a ReAct agent using
`createReactAgent()`

- Invoke the agent with a user message

Sources: [tool-react.js22-36](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L22-L36)

The commented-out section in `tool.js`

illustrates a more advanced workflow using StateGraph to manage tool interactions:

This pattern creates a loop where:

- The agent processes input and may generate tool calls
- A conditional function checks if tool calls were made
- If tool calls exist, they're executed by the tool node
- Results are sent back to the agent for further processing
- The cycle continues until the agent produces a response without tool calls

Sources: [tool.js36-75](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L36-L75)

The overall architecture of tool integration in the repository demonstrates how tools connect language models to external functionality:

Sources: [tool.js1-34](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L1-L34) [tool-react.js1-36](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L1-L36) [tool.js36-75](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L36-L75)

When implementing tools in your agent applications:

**Clear Descriptions**: Provide specific descriptions of what each tool does and when it should be used**Proper Parameter Schema**: Use Zod to define clear parameter schemas with descriptions**Error Handling**: Implement robust error handling in tool functions**Tool Selection Strategy**: Choose the appropriate integration method based on your use case:- Direct binding for simple tool usage
- ReAct pattern for complex reasoning with tools
- StateGraph for workflows with conditional tool usage


The pattern shown in these examples can be extended to various real-world scenarios:

| Use Case | Description | Implementation Approach |
|---|---|---|
| Web Search | Retrieving current information from the web | Replace mock function with actual search API |
| Data Retrieval | Fetching data from databases or APIs | Create tools that connect to data sources |
| Calculations | Performing complex calculations | Implement calculation logic in tool functions |
| Multi-API Integration | Combining multiple external services | Create multiple tools, each connecting to different APIs |

Sources: [tool.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool.js#L10-L20) [tool-react.js10-20](https://github.com/anildukkipatty/ai-agents-examples/blob/e2ed549c/tool-react.js#L10-L20)

For more information on related concepts:

[ReAct Agents](https://deepwiki.com/anildukkipatty/ai-agents-examples/3.2-react-agents)- Details on the Reasoning and Acting pattern[Multi-Agent Systems](https://deepwiki.com/anildukkipatty/ai-agents-examples/4.1-multi-agent-systems)- Complex systems with multiple agents using tools[Multi-Turn Conversations](https://deepwiki.com/anildukkipatty/ai-agents-examples/4.2-multi-turn-conversations)- Managing context in conversations with tool usage

Refresh this wiki

[Tool Integration](https://deepwiki.com#tool-integration)[Purpose and Scope](https://deepwiki.com#purpose-and-scope)[Tool Definition Fundamentals](https://deepwiki.com#tool-definition-fundamentals)[Tool Integration Methods](https://deepwiki.com#tool-integration-methods)[1. Direct Tool Binding](https://deepwiki.com#1-direct-tool-binding)[2. ReAct Agent Tool Integration](https://deepwiki.com#2-react-agent-tool-integration)[Tool Implementation Examples](https://deepwiki.com#tool-implementation-examples)[Basic Search Tool Definition](https://deepwiki.com#basic-search-tool-definition)[Direct Tool Binding Example](https://deepwiki.com#direct-tool-binding-example)[ReAct Agent Example](https://deepwiki.com#react-agent-example)[Advanced Tool Integration Workflow](https://deepwiki.com#advanced-tool-integration-workflow)[Tool Architecture and Integration](https://deepwiki.com#tool-architecture-and-integration)[Best Practices for Tool Integration](https://deepwiki.com#best-practices-for-tool-integration)[Common Tool Integration Use Cases](https://deepwiki.com#common-tool-integration-use-cases)[Related Topics](https://deepwiki.com#related-topics)
