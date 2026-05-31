---
url: https://www.analyticsvidhya.com/blog/2025/01/self-rag
title: Self-RAG: AI That Knows When to Double Check
fetched_at: 2026-05-30T20:34:16
content_hash: sha1:55c7b7de8cc2b251944e649b81fccf5fced7e79f
extractor: trafilatura
---

[Large language models ](https://www.analyticsvidhya.com/blog/2023/03/an-introduction-to-large-language-models-llms/) possess transformative capabilities across various tasks but often produce responses with factual inaccuracies due to their reliance on parametric knowledge. [Retrieval-Augmented Generation](https://www.analyticsvidhya.com/blog/2023/09/retrieval-augmented-generation-rag-in-ai/) was introduced to address this by incorporating relevant external knowledge. However, conventional RAG methods retrieve a fixed number of passages without adaptability, leading to irrelevant or inconsistent outputs. To overcome these limitations, Self-Reflective Retrieval-Augmented Generation (Self-RAG) was developed. Self-RAG enhances LLM quality and factuality through adaptive retrieval and self-reflection using reflection tokens, allowing models to tailor their behavior to diverse tasks. This article explores Self-RAG, its working, advantages, and implementation using LangChain.

- Understand the limitations of standard Retrieval-Augmented Generation (RAG) and how they impact LLM performance.
- Learn how Self-RAG enhances factual accuracy using on-demand retrieval and self-reflection mechanisms.
- Explore the role of reflection tokens (ISREL, ISSUP, ISUSE) in improving output quality and relevance.
- Discover the advantages of customizable retrieval and adaptive behavior in Self-RAG.
- Gain insights into implementing Self-RAG with LangChain and LangGraph for real-world applications.

**This article was published as a part of the ****Data Science Blogathon.**

While RAG mitigates factual inaccuracies in LLMs using external knowledge, but has limitations. Standard RAG approaches suffer from several key problems:

**Indiscriminate Retrieval:**RAG retrieves a fixed number of documents, regardless of relevance or need. This wastes resources and can introduce irrelevant information which causes lower-quality outputs.**Lack of Adaptability:**Standard RAG methods don’t adjust to different task requirements. They lack the control to determine when and how much to retrieve, unlike Self-RAG which can adapt retrieval frequency.**Inconsistency with Retrieved Passages:**The generated output often fails to align with the retrieved information because the models lack explicit training to use it.**No Self-Evaluation or Critique:**RAG doesn’t evaluate the quality or relevance of retrieved passages, nor does it critique its output. It blindly incorporates passages, unlike Self-RAG which does a self-assessment.**Limited Attribution:**Standard RAG doesn’t offer detailed citations or indicate if the generated text is supported by the sources. Self-RAG, in contrast, provides detailed citations and assessments.

In short, standard RAG’s rigid approach to retrieval, lack of self-evaluation, and inconsistency limit its effectiveness. highlighting the need for a more adaptive and self-aware method like Self-RAG.

Self-reflective retrieval-augmented Generation (Self-RAG) improves the quality and factuality of LLMs by incorporating retrieval and self-reflection mechanisms. Unlike traditional RAG methods, Self-RAG trains an arbitrary LM to adaptively retrieve passages on demand. It generates text informed by these passages and critiques its output using special reflection tokens.

Here are the key components and characteristics of Self-RAG:

**On-Demand Retrieval:**It retrieves passages on-demand using a “retrieve token,” only when needed, which makes it more efficient than standard RAG.**Use Reflection Tokens:**It uses special reflection tokens (both retrieval and critique tokens) to assess its generation process. Retrieval tokens signal the need for retrieval. Critique tokens evaluate the relevance of retrieved passages (ISREL), the support provided by passages to the output (ISSUP), and the overall utility of the response (ISUSE).**Self-Critique and Evaluation:**Self-RAG critiques its own output, assessing the relevance and support of retrieved passages, and the overall quality of the generated response.**Train End-to-End:**The model generates both the output and reflection tokens by using a critic model offline to create reflection tokens, which it then incorporates into the training data. This eliminates the need for a critic during inference.**Enable Customizable Decoding:**Self-RAG allows for flexible adjustment of retrieval frequency and adaptation to different tasks, enabling hard or soft constraints via reflection tokens. This allows for test-time customizations (e.g. balancing citation precision and completeness) without retraining.

Let us now dive deeper into how self RAG works:

Self-RAG starts by evaluating the input prompt (*x*) and any preceding generations (*y<t*) to determine if external knowledge is necessary. Unlike standard RAG, which always retrieves documents, Self-RAG uses a retrieve token to decide whether to retrieve, not to retrieve, or to continue using previously retrieved evidence.

This on-demand retrieval makes Self-RAG more efficient by only retrieving when needed and proceeding directly to output generation if retrieval is unnecessary.

If the model decides retrieval is needed (Retrieve = Yes), it fetches relevant passages from a large-scale collection of documents using a retriever model (R).

- The retrieval is based on the input prompt and the preceding generations.
- The retriever model (
*R*) is typically an off-the-shelf model like Contriever-MS MARCO. - The system retrieves multiple passages (
*K passages*) in parallel, which is unlike standard RAG that uses a fixed number of passages.

The generator model processes each retrieved passage in parallel, generating multiple continuation candidates.

- For each passage, the model generates the next response segment, along with its critique tokens.
- This step results in K different continuation candidates, each associated with a retrieved passage and critique tokens.

For each retrieved passage, Self-RAG generates critique tokens to evaluate its own predictions. These critique tokens include:

**Relevance token (ISREL):**Evaluates whether the retrieved passage provides useful information to solve the input (x). The output is either Relevant or Irrelevant.**Support token (ISSUP):**This token evaluates whether the generated segment (yt) is supported by the retrieved passage (d), with the output indicating full support, partial support, or no support.**Utility token (ISUSE):**Judges if the response is a useful answer to the input (x), independent of the retrieved passages. The output is on a scale of 1 to 5, with 5 being the most useful.

The model generates reflection tokens as part of its next token prediction process and uses the critique tokens to assess and rank the generated segments.

Self-RAG uses a segment-level beam search to identify the best output sequence. The score of each segment is adjusted using a critic score that is based on the weighted probabilities of the critique tokens.

These weights can be adjusted for different tasks. For example, a higher weight can be given to ISSUP for tasks requiring high factual accuracy. The model can also filter out segments with undesirable critique tokens.

The Self-RAG model is trained in an end-to-end manner, with two stages:

**Critic Model Training:**First, researchers train a critic model (C) to generate reflection tokens based on input, retrieved passages, and generated text. They train this critic model on data collected by prompting GPT-4 and use it offline during generator training.**Generator Model Training:**The generator model (M) is trained using a standard next token prediction objective, using data augmented with reflection tokens from the critic (C) and retrieved passages. The generator learns to predict both task outputs and the reflection tokens.

There are several key advantages of Self-RAG, including:

- On-demand retrieval reduces factual errors by retrieving external knowledge only when needed.
- By evaluating its own output and selecting the best segment, it achieves higher factual accuracy compared to standard LLMs and RAG models.
- Self-RAG maintains the versatility of LMs by not always relying on retrieved information.
- Adaptive retrieval with a threshold allows the model to dynamically adjust retrieval frequency for different applications.
- Self-RAG cites each segment and assesses whether the output is supported by the passage, making fact verification easier.
- Training with a critic model offline eliminates the need for a critic model during inference, reducing overhead.
- The use of reflection tokens enables controllable generation during inference, allowing the model to adapt its behavior.
- The model’s use of a segment-level beam search allows for the selection of the best output at each step, combining generation with self-evaluation.

Below we will follow the steps of self-RAG using LangChain and LangGraph:

The system requires several key libraries:

- `duckdeckgo-search`: For web search capabilities
- `langgraph`: For building workflow graphs
- `faiss-gpu`: For vector similarity search
- `langchain` and `langchain-openai`: For LLM operations
- Additional utilities: `pydantic` and `typing-extensions`

```
!pip install langgraph pypdf langchain langchain-openai pydantic typing-extensions
!pip install langchain-community
!pip install faiss-cpu
```


```
Collecting langgraph
Downloading langgraph-0.2.62-py3-none-any.whl.metadata (15 kB)
Requirement already satisfied: langchain-core (from langgraph) (0.3.29)
Collecting langgraph-checkpoint<3.0.0,>=2.0.4 (from langgraph)
Downloading langgraph_checkpoint-2.0.10-py3-none-any.whl.metadata (4.6 kB)
Collecting langgraph-sdk<0.2.0,>=0.1.42 (from langgraph)
.
.
.
.
.
Downloading langgraph-0.2.62-py3-none-any.whl (138 kB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 138.2/138.2 kB 4.0 MB/s eta 0:00:00
Downloading langgraph_checkpoint-2.0.10-py3-none-any.whl (37 kB)
Downloading langgraph_sdk-0.1.51-py3-none-any.whl (44 kB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 44.7/44.7 kB 2.6 MB/s eta 0:00:00
Installing collected packages: langgraph-sdk, langgraph-checkpoint, langgraph tiktoken, langchain-openai faiss-cpu-1.9.0.post1
Successfully installed langgraph-0.2.62 langgraph-checkpoint-2.0.10 langgraph-sdk-0.1.51 langchain-openai-0.3.0 tiktoken-0.8.0
```


Imports necessary libraries for typing, data handling:

```
import os
from google.colab import userdata
from typing import List, Optional
from typing_extensions import TypedDict
from pprint import pprint
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import OpenAIEmbeddings
from langchain.document_loaders import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langgraph.graph import END, StateGraph, START
```


Sets up OpenAI API key from user data:

```
# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = userdata.get('OPENAI_API_KEY')
```


Creates three evaluator classes using Pydantic:

- `SourceEvaluator`: Assesses if documents are relevant to the question
- `AccuracyEvaluator`: Checks if generated answers are factually grounded
- `CompletionEvaluator`: Verifies if answers fully address questions

Also defines `WorkflowState` to maintain workflow state including:

- Question text
- Generated response
- Retrieved documents

```
# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = userdata.get('OPENAI_API_KEY')
# Step 3: Define Data Models
from langchain_core.pydantic_v1 import BaseModel, Field
class SourceEvaluator(BaseModel):
"""Evaluates document relevance to the question"""
score: str = Field(description="Documents are relevant to the question, 'yes' or 'no'")
class AccuracyEvaluator(BaseModel):
"""Evaluates whether generation is grounded in facts"""
score: str = Field(description="Answer is grounded in the facts, 'yes' or 'no'")
class CompletionEvaluator(BaseModel):
"""Evaluates whether answer addresses the question"""
score: str = Field(description="Answer addresses the question, 'yes' or 'no'")
class WorkflowState(TypedDict):
"""Defines the state structure for the workflow graph"""
question: str
generation: Optional[str]
documents: List[str]
```


Implements document handling pipeline:

- Initializes OpenAI embeddings
- Download the
[dataset](https://docs.google.com/spreadsheets/d/1_l4Cb5C36k3NwjEFJAlIokPf1MPka_LbAv5m_0Ied0I/edit?usp=drive_link). - Loads documents from CSV file
- Splits documents into manageable chunks
- Creates FAISS vector store for efficient retrieval
- Sets up document retriever

```
# Initialize embeddings
embeddings = OpenAIEmbeddings()
# Load and process documents
loader = CSVLoader("/content/data.csv")
documents = loader.load()
# Split documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
documents = text_splitter.split_documents(documents)
# Create vectorstore
vectorstore = FAISS.from_documents(documents, embeddings)
retriever = vectorstore.as_retriever()
```


Sets up three evaluation chains:

**Document Relevance Evaluator:**- Assesses keyword and semantic relevance
- Produces binary yes/no scores

**Accuracy Evaluator:**- Checks if generation is supported by facts
- Uses retrieved documents as ground truth

**Completion Evaluator:**- Verifies answer completeness
- Ensures question is fully addressed


```
# Document relevance evaluator
source_system_prompt = """You are an evaluator assessing relevance of retrieved documents to user questions.
If the document contains keywords or semantic meaning related to the question, grade it as relevant.
Give a binary score 'yes' or 'no' to indicate document relevance."""
source_evaluator = (
ChatPromptTemplate.from_messages([
("system", source_system_prompt),
("human", "Retrieved document: \n\n {document} \n\n User question: {question}")
]) | llm.with_structured_output(SourceEvaluator)
)
# Accuracy evaluator
accuracy_system_prompt = """You are an evaluator assessing whether an LLM generation is grounded in retrieved facts.
Give a binary score 'yes' or 'no'. 'Yes' means the answer is supported by the facts."""
accuracy_evaluator = (
ChatPromptTemplate.from_messages([
("system", accuracy_system_prompt),
("human", "Set of facts: \n\n {documents} \n\n LLM generation: {generation}")
]) | llm.with_structured_output(AccuracyEvaluator)
)
# Completion evaluator
completion_system_prompt = """You are an evaluator assessing whether an answer addresses/resolves a question.
Give a binary score 'yes' or 'no'. 'Yes' means the answer resolves the question."""
completion_evaluator = (
ChatPromptTemplate.from_messages([
("system", completion_system_prompt),
("human", "User question: \n\n {question} \n\n LLM generation: {generation}")
]) | llm.with_structured_output(CompletionEvaluator)
)
```


Creates the core RAG pipeline:

- Defines template for context and question
- Chains template with LLM
- Implements string output parsing

```
# Step 6: Set Up RAG Chain
from langchain_core.output_parsers import StrOutputParser
template = """You are a helpful assistant that answers questions based on the following context:
Context: {context}
Question: {question}
Answer:"""
rag_chain = (
ChatPromptTemplate.from_template(template) |
llm |
StrOutputParser()
)
```


Implements key workflow functions:

- `retrieve`: Gets relevant documents for query
- `generate`: Produces answer using RAG
- `evaluate_documents`: Filters relevant documents
- `check_documents`: Decision point for generation
- `evaluate_generation`: Quality assessment of generation

```
# Step 7: Define Workflow Functions
def retrieve(state: WorkflowState) -> WorkflowState:
"""Retrieve relevant documents for the question"""
print("---RETRIEVE---")
documents = retriever.get_relevant_documents(state["question"])
return {"documents": documents, "question": state["question"]}
def generate(state: WorkflowState) -> WorkflowState:
"""Generate answer using RAG"""
print("---GENERATE---")
generation = rag_chain.invoke({
"context": state["documents"],
"question": state["question"]
})
return {**state, "generation": generation}
def evaluate_documents(state: WorkflowState) -> WorkflowState:
"""Evaluate document relevance"""
print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
filtered_docs = []
for doc in state["documents"]:
score = source_evaluator.invoke({
"question": state["question"],
"document": doc.page_content
})
if score.score == "yes":
print("---EVALUATION: DOCUMENT RELEVANT---")
filtered_docs.append(doc)
else:
print("---EVALUATION: DOCUMENT NOT RELEVANT---")
return {"documents": filtered_docs, "question": state["question"]}
def check_documents(state: WorkflowState) -> str:
"""Decide whether to proceed with generation"""
print("---ASSESS EVALUATED DOCUMENTS---")
if not state["documents"]:
print("---DECISION: NO RELEVANT DOCUMENTS FOUND---")
return "no_relevant_documents"
print("---DECISION: PROCEED WITH GENERATION---")
return "generate"
def evaluate_generation(state: WorkflowState) -> str:
"""Evaluate generation quality"""
print("---CHECK ACCURACY---")
accuracy_score = accuracy_evaluator.invoke({
"documents": state["documents"],
"generation": state["generation"]
})
if accuracy_score.score == "yes":
print("---DECISION: GENERATION IS ACCURATE---")
completion_score = completion_evaluator.invoke({
"question": state["question"],
"generation": state["generation"]
})
if completion_score.score == "yes":
print("---DECISION: GENERATION ADDRESSES QUESTION---")
return "acceptable"
print("---DECISION: GENERATION INCOMPLETE---")
return "not_acceptable"
print("---DECISION: GENERATION NEEDS IMPROVEMENT---")
return "retry_generation"
```


Builds workflow graph:

- Creates StateGraph with defined state structure
- Adds processing nodes
- Defines edges and conditional paths
- Compiles workflow into executable app

```
# Build workflow
workflow = StateGraph(WorkflowState)
# Add nodes
workflow.add_node("retrieve", retrieve)
workflow.add_node("evaluate_documents", evaluate_documents)
workflow.add_node("generate", generate)
# Add edges
workflow.add_edge(START, "retrieve")
workflow.add_edge("retrieve", "evaluate_documents")
workflow.add_conditional_edges(
"evaluate_documents",
check_documents,
{
"generate": "generate",
"no_relevant_documents": END,
}
)
workflow.add_conditional_edges(
"generate",
evaluate_generation,
{
"retry_generation": "generate",
"acceptable": END,
}
)
# Compile
app = workflow.compile()
```


Tests system with two scenarios:

- Relevant query (mortgage-related)
- Unrelated query (quantum computing)

```
# Step 9: Test the System
# Test with mortgage-related query
test_question1 = "explain the different components of mortgage interest"
print("\nTesting question 1:", test_question1)
print("=" * 80)
for output in app.stream({"question": test_question1}):
for key, value in output.items():
pprint(f"Node '{key}':")
pprint("\n---\n")
if "generation" in value:
pprint(value["generation"])
else:
pprint("No relevant documents found or no generation produced.")
# Test with unrelated query
test_question2 = "describe the fundamentals of quantum computing"
print("\nTesting question 2:", test_question2)
print("=" * 80)
for output in app.stream({"question": test_question2}):
for key, value in output.items():
pprint(f"Node '{key}':")
pprint("\n---\n")
if "generation" in value:
pprint(value["generation"])
else:
pprint("No relevant documents found or no generation produced.")
```


**Output:**

```
Testing question 1: explain the different components of mortgage interest
================================================================================
---RETRIEVE---
"Node 'retrieve':"
'\n---\n'
---CHECK DOCUMENT RELEVANCE TO QUESTION---
---EVALUATION: DOCUMENT RELEVANT---
---EVALUATION: DOCUMENT RELEVANT---
---EVALUATION: DOCUMENT RELEVANT---
---EVALUATION: DOCUMENT RELEVANT---
---ASSESS EVALUATED DOCUMENTS---
---DECISION: PROCEED WITH GENERATION---
"Node 'evaluate_documents':"
'\n---\n'
---GENERATE---
---CHECK ACCURACY---
---DECISION: GENERATION IS ACCURATE---
---DECISION: GENERATION ADDRESSES QUESTION---
"Node 'generate':"
'\n---\n'
('The different components of mortgage interest include interest rates, '
'origination fees, discount points, and lender-charges. Interest rates are '
'the percentage charged by the lender for borrowing the loan amount. '
'Origination fees are fees charged by the lender for processing the loan, and '
'sometimes they can also be used to buy down the interest rate. Discount '
'points are a form of pre-paid interest where one point equals one percent of '
'the loan amount, and paying points can help reduce the interest rate on the '
'loan. Lender-charges, such as origination fees and discount points, are '
'listed on the HUD-1 Settlement Statement.')
Testing question 2: describe the fundamentals of quantum computing
================================================================================
---RETRIEVE---
"Node 'retrieve':"
'\n---\n'
---CHECK DOCUMENT RELEVANCE TO QUESTION---
---EVALUATION: DOCUMENT NOT RELEVANT---
---EVALUATION: DOCUMENT NOT RELEVANT---
---EVALUATION: DOCUMENT NOT RELEVANT---
---EVALUATION: DOCUMENT NOT RELEVANT---
---ASSESS EVALUATED DOCUMENTS---
---DECISION: NO RELEVANT DOCUMENTS FOUND---
"Node 'evaluate_documents':"
'\n---\n'
'No relevant documents found or no generation produced.'
```


While the Self-RAG has various benefits over standard RAG and but there also some limitations:

**Outputs may not be fully supported:**Self-RAG can produce outputs that are not completely supported by the cited evidence, even with its self-reflection mechanisms.**Potential for factual inaccuracies:**Like other LLMs, Self-RAG is still prone to making factual errors despite its improvements in factuality and citation accuracy.**Smaller models may produce shorter outputs:**Smaller Self-RAG models can sometimes outperform larger ones on factual precision due to their tendency to produce shorter, more grounded outputs.**Customization trade-offs:**Adjusting the model’s behavior using reflection tokens can lead to trade-offs; for example, prioritizing citation support may reduce the fluency of the generated text.

SELF-RAG improves LLMs through on-demand retrieval and self-reflection. It selectively retrieves external knowledge when needed, unlike standard RAG. The model uses reflection tokens (ISREL, ISSUP, ISUSE) to critique its own generations, assessing the relevance, support, and utility of retrieved passages and generated text. This improves accuracy and reduces factual errors. SELF-RAG can be customized at inference by adjusting reflection token weights. It offers better citation and verifiability, and has demonstrated superior performance over other models. The training is done offline for efficiency.

- Self-RAG addresses RAG limitations by enabling on-demand retrieval, adaptive behavior, and self-evaluation for more accurate and relevant outputs.
- Reflection tokens enhance output quality by critiquing retrieval relevance, generation support, and utility, ensuring better factual accuracy.
- Customizable inference allows Self-RAG to tailor retrieval frequency and output behavior to meet specific task requirements.
- Efficient offline training eliminates the need for a critic model during inference, reducing overhead while maintaining performance.
- Improved citation and verifiability make Self-RAG outputs more reliable and factually grounded compared to standard LLMs and RAG systems.

A. Self-RAG (Self-Reflective Retrieval-Augmented Generation) is a framework that improves LLM performance by combining on-demand retrieval with self-reflection to enhance factual accuracy and relevance.

A. Unlike standard RAG, Self-RAG retrieves passages only when needed, uses reflection tokens to critique its outputs, and adapts its behavior based on task requirements.

A. Reflection tokens (ISREL, ISSUP, ISUSE) evaluate retrieval relevance, support for generated text, and overall utility, enabling self-assessment and better outputs.

A. Self-RAG improves accuracy, reduces factual errors, offers better citations, and allows task-specific customization during inference.

A. No, while Self-RAG reduces inaccuracies significantly, it is still prone to occasional factual errors like any LLM.

**The media shown in this article is not owned by Analytics Vidhya and is used at the Author’s discretion.**
