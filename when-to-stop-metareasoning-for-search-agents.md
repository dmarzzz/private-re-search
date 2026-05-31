# When to stop: bounded-optimal metareasoning for search agents

## 1. The problem

In the search-episode model `P = < B, b0, T, A, RESULT, U, c, π, σ >` developed in the companion formalization, two policies are chosen by the searcher. The object-level policy π decides which external action to take next: which query to issue, which document to read, which node to expand. The meta-level stopping rule σ decides something categorically different: whether to keep deliberating at all, or to terminate the episode and commit to an answer. The objective the searcher is trying to maximize couples both choices,

```
J(π, σ) = E [ U(bτ, T) − Σ_{t<τ} c(b_{t−1}, a_t) ],
```

where τ is the random stopping time induced by σ. The terminal value U(bτ, T) rewards having gathered enough to satisfy the need; the summed cost penalizes every action taken to get there. σ is the component that decides where on this tradeoff the episode lands.

For a search agent, σ is the hardest and most under-specified part of P, for a structural reason. The object level has an external check on it: a query either returns relevant documents or it does not, a read either updates the belief state usefully or it does not, and a ranking function can be evaluated against relevance judgments (the Cranfield/TREC apparatus). The meta level has no such check available at decision time. To know whether to stop, the agent must estimate the value of an action it has not yet taken: how much would the next query, read, or reasoning step improve the answer it will eventually give? That estimate is a counterfactual about the future of its own computation, the one quantity the agent cannot read off the world. It can only model it.

Stop too early and U(bτ, T) is low: the agent answers from an impoverished belief state, hallucinating or missing the decisive source. Stop too late and the cost term dominates: it burns tokens, compute, latency, and money re-confirming what it already knew. Every wrong stopping decision is paid for in one of these two currencies, and the agent has no ground-truth signal telling it which way it erred until after it has committed. In the companion report's terms, π is mostly an object-level theory with feedback; σ is a meta-level theory that must act on a self-prediction. The rest of this report develops what the correct self-prediction is (§2), when it collapses into a clean closed form (§3), why those closed forms do not survive contact with a retrieval agent (§4), what today's agents do instead and whether their confidence signals can ground the right decision (§5), and how to assemble a stopping rule that is bounded-optimal rather than merely heuristic (§6).

## 2. The metareasoning ideal

The normative answer to "when to stop" comes from treating computation itself as an action with a utility. This is the program of metareasoning, founded in its modern form by [Russell and Wefald (1991)](https://doi.org/10.1016/0004-3702(91)90015-C) and, in the resource-bounded-inference framing, by [Horvitz (1987, extended 1989)](https://erichorvitz.com/u87.htm).

The construction is exactly parallel to value of information, but applied to the agent's own deliberation rather than to the world. Partition the agent's actions into two levels. Object-level actions change the external world or the answer the agent will give. Meta-level actions, written `S_j` (expand a node, issue a query, read a document, run another reasoning step), change only the agent's beliefs, plus one special meta-action: **stop and act**. Let α be the external action the agent currently favors given its present belief state, and let U(α) be its expected utility under that belief. A computation `S_j` has value only insofar as it changes which external action the agent will eventually take. The **value of computation (VOC)** is the expected improvement in the utility of the eventually-chosen action:

```
V(S_j) = E [ U( action chosen after S_j ) ] − U(α now).
```

The net value subtracts the cost of running the computation, which is typically the opportunity cost of the elapsed time or the consumed resources:

```
netV(S_j) = V(S_j) − Cost(S_j).
```

The meta-level stopping rule is then a single inequality. Map it onto σ in P:

```
σ(b) =  CONTINUE   if   max_j netV(S_j) > 0,
        STOP & act  otherwise.
```

The agent keeps searching iff some available computation has positive expected net value, that is, iff the best next computation is expected to improve the utility of its final answer by more than that computation costs. A computation that cannot change α has zero value, however interesting it is: this is the metareasoning version of the principle that information you will not act on is worthless.

There is an immediate obstacle, and it is the central difficulty of the whole field: computing `V(S_j)` exactly is itself a computation, and evaluating *its* value is another, so the meta level recurses without bound. The field's standard escape is the **myopic** (also called meta-greedy or single-step) assumption: estimate each computation's value as if it were the last one before the agent acts. Complete deliberation sequences are then assembled out of these single-step estimates. Russell and Wefald show this is the tractable core of metareasoning, and it is the assumption every practical stopping rule inherits, including the agent stopping rules of §5.

[Hay, Russell, Tolpin and Shimony (2012)](https://arxiv.org/abs/1207.5879) sharpen the structure of the meta-level decision in a way that matters directly for search agents. They prove that choosing computations is a **selection** problem, not a **bandit** problem. In a multi-armed bandit you accrue reward from every pull, so you must trade exploration against exploitation. In metareasoning the computations (samples, queries, reads) carry no external reward; only the single final committed action earns utility. The meta level is therefore isomorphic to statistical ranking-and-selection: allocate computations so as to best identify the top object-level action, then stop. This yields clean stopping criteria and asymptotic regret bounds for sample-based search, and it shows that importing UCB-style bandit allocation to decide "search more or answer now" optimizes the wrong objective. For an LLM agent deciding whether to run one more retrieval, the correct frame is "have I gathered enough to pick the best answer," not "am I exploring enough."

Two further pillars make this ideal operational rather than merely definitional. First, [Dean and Boddy (1988)](https://cdn.aaai.org/AAAI/1988/AAAI88-009.pdf) introduced **anytime algorithms**: procedures interruptible at any time t that return a result whose quality is a non-decreasing function of t. [Zilberstein (1996)](https://onlinelibrary.wiley.com/doi/abs/10.1609/aimag.v17i3.1232) formalized the **performance profile** `Q_A(t)`, the expected output quality after compute t, and the meta-level control problem of choosing run time to maximize net value. Given a cost-of-delay function C(t) and the profile, the optimal stopping point is where marginal quality gain equals marginal cost:

```
d U(Q_A(t)) / dt  =  d C(t) / dt.
```

This is the concrete, differentiable form of the VOC inequality: stop when the next increment of search buys less answer-quality than it costs. It is the same marginal-value condition the human searcher's scent-exhaustion rule approximates and the agent's step budget crudely caps.

Second, [Russell and Subramanian (1995)](https://www.jair.org/index.php/jair/article/view/10134) supply the right normative target with **bounded optimality**. An agent program l* is bounded-optimal if it maximizes expected utility over the class of programs runnable on the agent's actual architecture M in its environment E,

```
l* = argmax_{ l ∈ L_M }  E_E [ U( Agent(l, M) ) ].
```

Unlike perfect rationality (optimal action ignoring deliberation cost) or calculative rationality (optimal given unlimited time), bounded optimality folds the cost of metareasoning into the optimization itself. This reframes the whole enterprise: we should not ask a search agent to compute exact VOC, which is infeasible, but to run the best stopping policy implementable under its resource limits. A good heuristic stopping rule is not a failure to be rational; under the right architecture it *is* the rational object. [Gershman, Horvitz and Tenenbaum (2015)](https://doi.org/10.1126/science.aac6076) generalize this into **computational rationality**, a unifying paradigm spanning AI, cognitive science, and neuroscience: identify decisions of highest expected utility while accounting for the cost of computation. It is the bridge between the agent searcher of §5 and the bounded human searcher of the companion report; both are computationally rational agents whose stopping rules approximate the same VOC inequality under different cost currencies.

The ideal, then, is unambiguous. **Continue searching iff the expected value of the best next computation exceeds its cost.** The remaining sections ask when this inequality can be evaluated in closed form, why it usually cannot for a retrieval agent, and what to do about that.

## 3. When a clean optimal stopping rule exists

For certain highly structured search problems, the VOC inequality collapses into a closed-form index or threshold that can be computed without recursion. These are the cases worth knowing precisely, because they mark the boundary of what is tractable and supply the templates that approximate stopping rules imitate.

**Weitzman's Pandora's Box.** The cleanest case is [Weitzman (1979)](https://www.jstor.org/stable/1910412). There are n boxes, each with a known reward distribution `F_i` and a known inspection cost `c_i`; rewards are independent across boxes; the searcher has free recall (any opened reward can be taken later at no penalty); the objective is `E[ max selected reward − Σ inspection costs ]`. Define each box's **reservation value** `z_i` implicitly by

```
c_i  =  E[ (X_i − z_i)^+ ]  =  ∫_{z_i}^∞ (x − z_i) dF_i(x),
```

the value at which the expected gain from inspecting box i exactly equals its inspection cost. Weitzman proves the optimal policy decomposes into an index rule plus a stopping rule. Index: among unopened boxes, always inspect the one with the largest `z_i`. **Stopping rule σ:** stop inspecting and take the best reward already in hand as soon as that best-in-hand value `y*` is at least the reservation value `z_j` of the next (highest-index) unopened box j. Equivalently, treat each box by its capped value `min(X_i, z_i)` and the problem reduces to a one-step Gittins-style index. This is the canonical optimal form of σ for costly sequential search: it renders accumulated search cost and expected reward directly commensurable through a single threshold on the *next* option's value, and it maps cleanly onto an agent deciding which of several candidate searches or documents to open next. **Its assumptions are load-bearing: independence across options and free recall.**

**The secretary problem.** The pure no-recall, ordinal, zero-explicit-cost limit is the secretary problem ([Lindley 1961](https://academic.oup.com/jrsssc/article/10/1/39/6872835); the clean asymptotic results from [Dynkin 1963](https://en.wikipedia.org/wiki/Secretary_problem) and [Gilbert and Mosteller 1966](https://en.wikipedia.org/wiki/Secretary_problem)). Candidates arrive in random order, are observed only by relative rank, and must be accepted or rejected irrevocably on arrival. To maximize the probability of selecting the single best, the optimal rule is a **threshold time** `r*`: reject (observe only) the first `r* − 1` candidates, then accept the first candidate that is better than all seen so far. As n grows, `r*/n → 1/e` and the optimal win probability `→ 1/e ≈ 0.368`. The threshold sits where the marginal value of one more observation equals its option cost. This learn-then-leap shape (explore a prefix, then take the first good-enough record) is the formal cousin of the human searcher's satisficing and scent-exhaustion stopping.

**Bruss's odds theorem.** [Bruss (2000)](https://projecteuclid.org/journals/annals-of-probability/volume-28/issue-3/Sum-the-odds-to-one-and-stop/10.1214/aop/1019160340.full) generalizes the secretary result to any sequence of independent indicator events `I_1, …, I_n` with success probabilities `p_k`, failure `q_k = 1 − p_k`, and odds `r_k = p_k / q_k`. To stop on the last success, sum the odds backward, `r_n + r_{n−1} + …`, until the partial sum first reaches 1, at index s; then stop at the first `k ≥ s` with `I_k = 1`. The optimal win probability is `V = (∏_{j=s}^n q_j)(Σ_{j=s}^n r_j)` in closed form. This is the most general clean threshold rule for best-choice stopping, and it gives the shortest proof of the 1/e result. Its assumption is **independence of the indicators**.

**Wald's SPRT.** The active-evidence, confidence-gate archetype is [Wald's (1945)](https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-16/issue-2/Sequential-Tests-of-Statistical-Hypotheses/10.1214/aoms/1177731118.full) sequential probability ratio test. Given i.i.d. observations and a test of H0 against H1 with target error rates α (type I) and β (type II), accumulate the cumulative log-likelihood ratio `Λ_n = Σ_{i≤n} log[ f_{θ1}(X_i) / f_{θ0}(X_i) ]`. **Stopping rule σ:** continue while `log B < Λ_n < log A`; stop and accept H1 when `Λ_n ≥ log A`, accept H0 when `Λ_n ≤ log B`, with boundaries `A ≈ (1−β)/α` and `B ≈ β/(1−α)`. Wald and Wolfowitz (1948) proved the SPRT minimizes expected sample size under both hypotheses among all tests meeting the error targets. This is the rigorous ideal behind every "stop when confident" gate: stop collecting evidence the instant accumulated log-evidence crosses a threshold set by the error rate you are willing to tolerate. Its assumptions are **i.i.d. observations and two known, fully specified hypotheses.**

**Best-arm identification with fixed confidence.** The modern multi-option generalization of the SPRT is [Garivier and Kaufmann (2016)](https://proceedings.mlr.press/v49/garivier16a.html). Given K arms with unknown means μ, return `argmax_a μ_a` with error at most δ while minimizing expected stopping time. The information-theoretic lower bound is governed by a **characteristic time** `T*(μ)` with

```
T*(μ)^{-1}  =  sup_{w ∈ Δ_K}  inf_{λ ∈ Alt(μ)}  Σ_a  w_a · d(μ_a, λ_a),
```

a max over sampling proportions w of the min over confusing alternatives λ of summed KL divergences. The **Chernoff/GLR stopping rule** stops at the first time t where the generalized-likelihood-ratio statistic `Z(t)` exceeds a threshold `β(t, δ) ≈ log(2t / δ)`, while the sampling rule tracks the optimal proportions `w*(μ̂)`. The resulting Track-and-Stop algorithm is asymptotically optimal: `E[τ] / log(1/δ) → T*(μ)` as `δ → 0`. Confidence-interval variants give the same fixed-confidence guarantee through overlap tests, for example [Jamieson, Malloy, Nowak and Bubeck (2014)](https://proceedings.mlr.press/v35/jamieson14.html) lil'UCB, which calibrates anytime bounds to the law of the iterated logarithm and stops when one arm's lower confidence bound dominates all others' upper bounds. These give the state-of-the-art formal answer to "how much sampling before I can commit to the best option," and they are the rigorous form of the confidence gates current agents use heuristically. Their assumptions: a **fixed finite set of options, repeated independent samples from each, and a stationary mean per option.**

The pattern across all five: a clean reservation/index/threshold rule exists only under strong structure. Independence plus free recall plus commensurable costs gives Pandora's Box; pure ordinal no-recall structure gives the secretary and odds rules; i.i.d. observations from known or stationary distributions gives the SPRT and Track-and-Stop. Break any of these and σ stops being an index you can read off and becomes a coupled dynamic program. Correlation, order constraints, or non-obligatory inspection already push the Pandora variant into NP-hardness ([Chawla, Gergatsouli, Teng, Tzamos and Zhang 2020](https://arxiv.org/abs/1911.01632); [Boodaghians, Fusco, Lazos and Leonardi 2020](https://dl.acm.org/doi/10.1145/3391403.3399501)). The next section argues a retrieval agent breaks all of them at once.

## 4. Why those assumptions break for a retrieval agent

Each closed-form rule of §3 buys its tractability with assumptions that a real retrieval agent violates structurally, not incidentally. Four breakages compound.

**Options are correlated and their distributions are unknown.** Pandora's Box, the odds theorem, the SPRT, and Track-and-Stop all assume independence (across boxes, indicators, or arms) and a known or estimable reward distribution per option. A retrieval agent's options are documents and queries whose values are massively correlated: the top results for a query are near-duplicates, mirror sites repeat the same passage, and a reformulated query returns an overlapping set. Reading the third paraphrase of the same claim has near-zero marginal VOC even though, treated as an independent draw, it would look as valuable as the first. Worse, the agent does not know the value distribution `F_i` of an unread document before reading it; it has only a snippet-derived prior, itself produced by the same kind of model whose calibration is in question (§5). Weitzman's `z_i` requires the integral `∫ (x − z_i) dF_i(x)`, which the agent cannot compute because it does not have `F_i`. The correlation breakage is exactly the one that makes Pandora's Box NP-hard and only constant-factor approximable ([Chawla et al. 2020](https://arxiv.org/abs/1911.01632)); the unknown-distribution breakage is what pushes the problem from optimal-stopping into the learning-while-stopping regime that best-arm identification only solves under stationarity.

**The belief state is non-stationary, and reading changes the value function.** Best-arm identification assumes each arm has a fixed mean that repeated sampling estimates with shrinking variance. A retrieval agent's "arms" do no such thing. Reading a document does not produce another noisy sample of a static quantity; it changes the belief state b, which changes which other documents are now relevant, which changes the value of every remaining option. A source that was worthless five reads ago becomes decisive once the agent learns the term of art that unlocks it. This is non-stationarity by construction: the value landscape the agent is searching is rewritten by the act of searching it. The SPRT's i.i.d. assumption and Track-and-Stop's stationary-mean assumption both fail, and with them the optimality guarantees. The marginal-value curve `Q_A(t)` of §2 is not the smooth concave profile the anytime-algorithm theory assumes; it is bumpy, with sudden jumps when a key source lands, which makes "stop when the marginal gain falls below cost" a rule that can fire spuriously in a flat stretch just before a cliff.

**The action space is effectively unbounded.** All the clean rules assume a fixed, enumerable option set: n boxes, n candidates, K arms. A retrieval agent's action set includes "issue an arbitrary new query," and the space of queries is unbounded and combinatorial. There is no finite K over which to compute a characteristic time, no list of boxes to sort by reservation value. The agent can always manufacture one more plausibly-relevant query, which means the "next option" in a Weitzman-style stop test is never well-defined: its reservation value depends on a query the agent has not yet thought to write. This is the formal counterpart of the human searcher's open-ended berrypicking, and it is why the secretary problem's "first record after the prefix" rule has no clean analogue: there is no fixed n and no last candidate.

**The need T is itself uncertain.** Every rule in §3 assumes a fixed objective: a known reward metric, a known pair of hypotheses, a known best-arm criterion. The companion report already establishes that the query is a lossy projection of the information need and that relevance is stratified and dynamic. For the stopping decision this is fatal in a specific way: the agent cannot evaluate `U(bτ, T)` because it does not fully know T. It may stop confident it has answered the question it parsed, while the question actually posed needed a different sub-need it never surfaced. The VOC inequality `V(S_j) = E[U(action after S_j)] − U(α)` is defined relative to U, and if U is itself uncertain because T is uncertain, then VOC is being estimated against a moving target. The agent's stopping confidence and its answer correctness can decouple entirely: it can be calibrated about "did I answer the question I think I was asked" and badly wrong about "was that the question."

The upshot: a retrieval agent sits squarely in the regime where no closed-form σ exists. It faces correlated options with unknown distributions, a non-stationary belief state, an unbounded action space, and an uncertain objective, all at once. The clean rules of §3 are not wrong; they are the special cases the agent never gets to inhabit. What the agent can do is approximate the VOC inequality of §2 with whatever value-of-continued-search estimate it can actually compute. The question is whether the estimates it computes today are any good.

## 5. What agents do today, and is it calibrated?

Current retrieval agents do not estimate VOC. They use one of three families of heuristic stopping rule, each a recognizable approximation to the §2 inequality, and each resting on a confidence signal whose calibration determines whether the approximation is sound.

**Confidence-triggered retrieval.** [Jiang et al. (2023)](https://arxiv.org/abs/2305.06983), FLARE (Forward-Looking Active REtrieval), is the most direct mapping of model confidence onto a when-to-retrieve control. The agent predicts the next sentence `s_t` with per-token probabilities `p_i`; if any lookahead token falls below a threshold θ, it treats that as a signal of insufficient knowledge, issues a query from `s_t`, retrieves, and regenerates; otherwise it proceeds without retrieving. This is a per-step retrieve-or-proceed σ keyed on token confidence. As an approximation to VOC it is appealing in spirit: low token confidence is a proxy for "the next computation could change my output." But θ is hand-tuned, not derived from any cost-benefit balance, and token probability is a proxy for output uncertainty, not for the *value* of the retrieval that would resolve it. A token can be low-probability and irrelevant to the final answer (zero VOC) or high-probability and catastrophically wrong (the model is confidently mistaken).

**Learned reflection-token gating.** [Asai et al. (2024)](https://arxiv.org/abs/2310.11511), Self-RAG, internalizes the decision. A single LM is trained to emit reflection tokens: a Retrieve token deciding whether to retrieve at each step, and IsRel / IsSup / IsUse tokens grading retrieved passages for relevance, support, and usefulness. The retrieve-or-stop decision and the relevance judgment U become a learned token policy rather than a hand-set threshold. This is closer to the bounded-optimal stance of §2: the stopping policy is trained, in principle, toward the architecture's best achievable behavior. But its calibration is only as good as the critic training data, and the IsSup / IsUse grades are themselves model self-judgments subject to the same overconfidence as any other generation.

**Fixed budgets and self-consistency.** The most common production rule is the crudest: a fixed step or token budget that caps the number of search-reason iterations regardless of the belief state, optionally paired with self-consistency (sample multiple reasoning paths, answer by majority). A fixed budget is a degenerate σ: it ignores VOC entirely and stops at a constant τ, which is bounded-optimal only by accident, when the budget happens to match the need's difficulty. Self-consistency adds a stability check (stop when sampled answers agree) that approximates "the next computation will not change my answer," which is genuinely VOC-flavored, but agreement among samples measures the model's internal consistency, not its correctness, and correlated errors make a confidently-wrong answer agree with itself.

All three families reduce to a confidence signal feeding a threshold. So the empirical question is whether an LLM's confidence is calibrated well enough to ground a VOC threshold. The evidence is split by *how* the confidence is read out.

[Kadavath et al. (2022)](https://arxiv.org/abs/2207.05221), from Anthropic, is the strongest case that it can. They show two introspective signals are well-calibrated and improve with scale: **P(True)**, the model's self-assessed probability that a proposed answer is correct, read from a True-token probability; and **P(IK)**, a trained head predicting "do I know the answer" from the question alone. P(True) tracks accuracy with low expected calibration error, and P(IK) is usable as a *pre-search* estimate of whether retrieval is even needed. In the §2 frame, P(IK) is a direct estimate of the value of the entire search before it begins, and a calibrated P(True) is a candidate stopping signal: stop when the self-assessed probability of a correct answer is high enough that further search cannot improve expected utility by more than its cost.

The counterweight is [Xiong et al. (2024)](https://arxiv.org/abs/2306.13063), who show that **verbalized** confidence (asking the model to state a confidence number in free text) is systematically overconfident and a poor failure predictor, with large calibration error in their evaluations. (The specific figure of ECE often exceeding 0.37 should be confirmed against the paper body before being quoted as exact; it is carried here as a prior claim from the corpus.) The lesson is sharp and consequential for σ: calibrated confidence exists, but only for specific readout methods. Trained or probability-based introspection (P(True), P(IK)) can ground a stopping threshold; free-text "I'm 90% sure" cannot, and an agent that gates on verbalized confidence is building its stopping rule on a signal known to be miscalibrated.

So the honest answer to "are today's agents' stopping rules calibrated" is: the *signals* needed to calibrate them exist (P(True), P(IK)), but the *rules deployed* mostly do not use them in a VOC-grounded way. FLARE gates on token probability with a hand-tuned threshold; Self-RAG gates on learned but uncalibrated critic tokens; fixed budgets ignore confidence entirely. None of them estimate the value of continued search and compare it to its cost. They estimate a confidence proxy and compare it to a constant. The gap between those two operations is exactly the gap between a heuristic stopping rule and a bounded-optimal one.

## 6. Toward a bounded-optimal σ for search agents

Pulling the threads together: the ideal σ is the VOC inequality of §2 (continue iff the expected value of the best next computation exceeds its cost); no closed-form instance of it survives the retrieval agent's regime (§4); and today's agents approximate it with confidence proxies that are calibratable in principle but mostly ungrounded in practice (§5). The constructive target is a σ that is explicitly a VOC threshold built from a *calibrated value-of-continued-search estimate*, accepting bounded optimality (§2) as the standard rather than unattainable exactness.

Concretely, a bounded-optimal stopping rule for a search agent should compute, at each step, an estimate of the value of continued search and stop when it falls below the per-step cost:

```
σ(b) =  CONTINUE   if   V̂(continue | b)  >  ĉ(next computation | b),
        STOP & act  otherwise,
```

where `V̂(continue | b)` is a calibrated, myopic (§2) estimate of how much the agent's eventual answer utility would improve from one more search action, and `ĉ` is the action's cost in the agent's currency (tokens, latency, money). Three design moves make this more than a restatement.

First, **ground V̂ in a calibrated answerability signal, not a raw confidence number.** Kadavath et al.'s P(True) and P(IK) are the natural primitives. P(IK) supplies the pre-search estimate (is this need answerable from parametric memory, or is search worth starting at all). The step-to-step change in P(True) supplies a myopic VOC proxy: if the last retrieval barely moved P(True), the marginal value of continuing is low. This converts the anytime performance profile `Q_A(t)` of §2 into something the agent can actually read off its own state, using the one confidence readout the evidence says is calibrated, and explicitly *not* using verbalized confidence (Xiong et al.).

Second, **adopt the selection framing of Hay et al., not a bandit framing.** The agent is not trying to explore the corpus to accrue reward; it is trying to gather enough to commit to the best answer. The stopping criterion should therefore be a confidence-to-commit test in the spirit of the SPRT and Track-and-Stop GLR rule: stop when the accumulated evidence makes the favored answer α distinguishable from its best alternative at the agent's tolerated error rate. The fixed-confidence machinery of §3 does not transfer verbatim (the assumptions broke in §4), but its *shape* (stop when a likelihood-ratio-like statistic crosses an error-calibrated boundary) is the right template, with the GLR statistic replaced by a calibrated P(True)-style margin between the top answer and its closest competitor among sampled reasoning paths.

Third, **make the cost term real and the budget a fallback, not the rule.** The bounded-optimality framing of Russell and Subramanian says the cost of deliberation belongs inside the optimization. An agent paying per token and per second of latency has a genuine `ĉ` it can plug into the inequality; the VOC threshold then automatically tightens as a query gets expensive, which is the correct behavior and is invisible to a fixed step budget. The budget survives only as a safety cap for the pathological case where V̂ is itself unreliable.

The open problems are substantial and worth stating plainly, because they are where the next round of work lives.

- **Estimating non-myopic VOC under non-stationarity.** The myopic assumption (value each computation as if it were the last) is exactly the assumption §4's "reading changes the value function" breaks. A single retrieval can have low myopic VOC but unlock a high-value chain; a bounded-optimal σ needs a cheap estimate of *multi-step* value that does not require the intractable full lookahead. This is the metareasoning recursion problem in its sharpest applied form.

- **Calibration under distribution shift and adversarial corpora.** P(True) and P(IK) are calibrated in-distribution. A web-search agent reads untrusted, partially adversarial content (the corpus already flags scraped material as untrusted), and a confident-but-poisoned source can corrupt the very signal the stopping rule depends on. Calibration of the stopping signal under retrieval of adversarial documents is open and safety-relevant.

- **Stopping under uncertain T.** No confidence signal computed against the agent's *parsed* need protects against having parsed the need wrong (§4). A bounded-optimal σ may need a second, orthogonal check on need-coverage (have I addressed the sub-needs implied by the question) distinct from answer-confidence, because the two failure modes are independent.

- **The privacy coupling.** The companion corpus studies IP anonymization for search. A VOC-grounded σ that issues fewer, better-targeted queries directly shrinks the agent's query footprint, which is the quantity that query-log deanonymization attacks (the AOL case) and traffic analysis exploit. A bounded-optimal stopping rule is, incidentally, a privacy mechanism: every query not issued because its VOC fell below cost is a query that never enters a log. Quantifying the stopping-rule / query-footprint tradeoff is an open and unusually clean intersection of this report's thread with the rest of the corpus.

The synthesis is that σ for a search agent should stop being a hand-tuned threshold on a possibly-miscalibrated confidence number and become an explicit, calibrated, cost-aware approximation of the value-of-computation inequality, with the closed-form rules of §3 as the limiting templates it imitates and the bounded-optimality of §2 as the standard it is held to. We will not get exact VOC; that was never the target. We can get a stopping rule that is the best one implementable on the agent's architecture, grounded in the one confidence signal the evidence says we can trust, and that is the right thing to ask for.

## References

Asai, A., Wu, Z., Wang, Y., Sil, A., and Hajishirzi, H. (2024). Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection. ICLR 2024 (arXiv October 2023). https://arxiv.org/abs/2310.11511

Boodaghians, S., Fusco, F., Lazos, P., and Leonardi, S. (2020). Pandora's Box Problem with Order Constraints. ACM EC 2020 (Proc. 21st ACM Conf. on Economics and Computation). https://dl.acm.org/doi/10.1145/3391403.3399501

Bruss, F. T. (2000). Sum the Odds to One and Stop. The Annals of Probability 28(3): 1384–1391. https://projecteuclid.org/journals/annals-of-probability/volume-28/issue-3/Sum-the-odds-to-one-and-stop/10.1214/aop/1019160340.full

Chawla, S., Gergatsouli, E., Teng, Y., Tzamos, C., and Zhang, R. (2020). Pandora's Box with Correlations: Learning and Approximation. FOCS 2020, pp. 1214–1225. https://arxiv.org/abs/1911.01632

Dean, T., and Boddy, M. (1988). An Analysis of Time-Dependent Planning. AAAI-88, pp. 49–54. https://cdn.aaai.org/AAAI/1988/AAAI88-009.pdf

Dynkin, E. B. (1963). The Optimum Choice of the Instant for Stopping a Markov Process. (Secretary-problem 1/e asymptotic.) See survey: https://en.wikipedia.org/wiki/Secretary_problem

Garivier, A., and Kaufmann, E. (2016). Optimal Best Arm Identification with Fixed Confidence. COLT 2016, PMLR 49: 998–1027. https://proceedings.mlr.press/v49/garivier16a.html

Gershman, S. J., Horvitz, E. J., and Tenenbaum, J. B. (2015). Computational Rationality: A Converging Paradigm for Intelligence in Brains, Minds, and Machines. Science 349(6245): 273–278. https://doi.org/10.1126/science.aac6076

Gilbert, J., and Mosteller, F. (1966). Recognizing the Maximum of a Sequence. Journal of the American Statistical Association 61(313): 35–73.

Hay, N., Russell, S., Tolpin, D., and Shimony, S. E. (2012). Selecting Computations: Theory and Applications. UAI 2012, pp. 346–355 (companion tech report Hay and Russell, UCB/EECS-2011-119). https://arxiv.org/abs/1207.5879

Horvitz, E. J. (1989). Reasoning about Beliefs and Actions under Computational Resource Constraints. In Uncertainty in Artificial Intelligence 3 (Elsevier), pp. 301–324 (original conference version UAI 1987, pp. 429–444). https://erichorvitz.com/u87.htm

Jamieson, K., Malloy, M., Nowak, R., and Bubeck, S. (2014). lil' UCB: An Optimal Exploration Algorithm for Multi-Armed Bandits. COLT 2014, PMLR 35: 423–439. https://proceedings.mlr.press/v35/jamieson14.html

Jiang, Z., Xu, F. F., Gao, L., Sun, Z., Liu, Q., Dwivedi-Yu, J., Yang, Y., Callan, J., and Neubig, G. (2023). Active Retrieval Augmented Generation (FLARE). EMNLP 2023. https://arxiv.org/abs/2305.06983

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., Schiefer, N., Hatfield-Dodds, Z., et al. (2022). Language Models (Mostly) Know What They Know. arXiv:2207.05221. https://arxiv.org/abs/2207.05221

Lindley, D. V. (1961). Dynamic Programming and Decision Theory. Journal of the Royal Statistical Society, Series C (Applied Statistics) 10(1): 39–51. https://academic.oup.com/jrsssc/article/10/1/39/6872835

Russell, S., and Wefald, E. (1991). Principles of Metareasoning. Artificial Intelligence 49(1–3): 361–395. https://doi.org/10.1016/0004-3702(91)90015-C

Russell, S. J., and Subramanian, D. (1995). Provably Bounded-Optimal Agents. Journal of Artificial Intelligence Research 2: 575–609. https://www.jair.org/index.php/jair/article/view/10134

Wald, A. (1945). Sequential Tests of Statistical Hypotheses. Annals of Mathematical Statistics 16(2): 117–186. (Optimality with Wald and Wolfowitz, 1948.) https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-16/issue-2/Sequential-Tests-of-Statistical-Hypotheses/10.1214/aoms/1177731118.full

Weitzman, M. L. (1979). Optimal Search for the Best Alternative. Econometrica 47(3): 641–654. https://www.jstor.org/stable/1910412

Xiong, M., Hu, Z., Lu, X., Li, Y., Fu, J., He, J., and Hooi, B. (2024). Can LLMs Express Their Uncertainty? An Empirical Evaluation of Confidence Elicitation in LLMs. ICLR 2024 (arXiv June 2023). https://arxiv.org/abs/2306.13063

Zilberstein, S. (1996). Using Anytime Algorithms in Intelligent Systems. AI Magazine 17(3): 73–83. https://onlinelibrary.wiley.com/doi/abs/10.1609/aimag.v17i3.1232
