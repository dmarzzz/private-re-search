---
url: https://stanford-cs221.github.io/autumn2023-extra/modules/search/a-star.pdf
title: a-star.pdf
fetched_at: 2026-05-30T19:15:25
content_hash: sha1:3be2a3b1211b8e0809b548d172f55dcafecb8d85
extractor: jina
---

Title: a-star.pdf

URL Source: https://stanford-cs221.github.io/autumn2023-extra/modules/search/a-star.pdf

Published Time: Wed, 08 Nov 2023 04:38:12 GMT

Number of Pages: 26

Markdown Content:
# Search: A* A* algorithm 

UCS in action: 

A* in action:  

> CS221 2

# Can uniform cost search be improved? 

sstart send Wasted effort? 

Problem: UCS orders states by cost from sstart to s

Goal: take into account cost from s to send  

> CS221 4

• Now our goal is to make UCS faster. If we look at the UCS algorithm, we see that it explores states based on how far they are away from the start state. As a result, it will explore many states which are close to the start state, but in the opposite direction of the end state. 

• Intuitively, we’d like to bias UCS towards exploring states which are closer to the end state, and that’s exactly what A* does. Exploring states 

UCS: explore states in order of PastCost (s)

sstart s send 

PastCost (s) FutureCost (s)

Ideal: explore in order of PastCost (s) + FutureCost (s)

A*: explore in order of PastCost (s) + h(s)

Definition: Heuristic function 

A heuristic h(s) is any estimate of FutureCost (s). 

> CS221 6

• First, some terminology: PastCost (s) is the minimum cost from the start state to s, and FutureCost (s) is the minimum cost from s to an end state. Without loss of generality, we can just assume we have one end state. (If we have multiple ones, create a new official goal state which is the successor of all the original end states.) 

• Recall that UCS explores states in order of PastCost (s). It’d be nice if we could explore states in order of PastCost (s) + FutureCost (s), which would definitely take the end state into account, but computing FutureCost (s) would be as expensive as solving the original problem. 

• A* relies on a heuristic h(s), which is an estimate of FutureCost (s). For A* to work, h(s) must satisfy some conditions, but for now, just think of h(s) as an approximation. We will soon show that A* will explore states in order of PastCost (s) + h(s). This is nice, because now states which are estimated (by h(s)) to be really far away from the end state will be explored later, even if their PastCost (s) is small. A* search 

Algorithm: A* search [Hart/Nilsson/Raphael, 1968] 

Run uniform cost search with modified edge costs :Cost ′(s, a ) = Cost (s, a ) + h(Succ (s, a )) − h(s)

Intuition: add a penalty for how much action a takes us away from the end state Example: A B C D E

sstart send 

4 3 2 1 0h(s) =           

> 2200
> Cost ′(C, B ) = Cost (C, B ) + h(B)−h(C) = 1 + (3 −2) = 2
> CS221 8

• Here is the full A* algorithm: just run UCS with modified edge costs. 

• You might feel tricked because we promised you a shiny new algorithm, but actually, you just got a refurbished version of UCS. (This is a slightly unorthodox presentation of A*. The normal presentation is modifying UCS to prioritize by PastCost (s)+ h(s) rather than PastCost (s).) But I think the modified edge costs view shows a deeper connection to UCS, and we don’t even have to modify the UCS code at all. 

• How should we think of these modified edge costs? It’s the same edge cost Cost (s, a ) plus an additional term. This term is difference between the estimated future cost of the new state Succ (s, a ) and that of the current state s. In other words, we’re measuring how much farther from the end state does action a take us. If this difference is positive, then we’re penalizing the action a more. If this difference is negative, then we’re favoring this action a.

• Let’s look at a small example. All edge costs are 1. Let’s suppose we define h(s) to be the actual FutureCost (s), the minimum cost to the end state. In general, this is not the case, but let’s see what happens in the best case. The modified edge costs are 2 for actions moving away from the end state and 0 for actions moving towards the end state. 

• In this case, UCS with original edge costs 1 will explore all the nodes. However, A* (UCS with modified edge costs) will explore only the three nodes on the path to the end state. An example heuristic 

Will any heuristic work? No. Counterexample: ABCD001000 0Doesn’t work because of negative modified edge costs ! 

> CS221 10

• So far, we’ve just said that h(s) is just an approximation of FutureCost (s). But can it be any approximation? 

• The answer is no, as the counterexample clearly shows. The modified edge costs would be 1 (A to B), 1002 (A to C), 5 (B to D), and -999 (C to D). UCS would go to B first and then to D, finding a cost 6 path rather than the optimal cost 3 path through C. 

• If our heuristic is lying to us (bad approximation of future costs), then running A* (UCS on modified costs) could lead to a suboptimal solution. Note that the reason this heuristic doesn’t work is the same reason UCS doesn’t work when there are negative action costs. Consistent heuristics 

Definition: consistency 

A heuristic h is consistent if 

• Cost ′(s, a ) = Cost (s, a ) + h(Succ (s, a )) − h(s) ≥ 0

• h(send ) = 0 .

Condition 1: needed for UCS to work (triangle inequality). 

ssend 

Cost (s, a )

h(s)

h(Succ (s, a )) 

Condition 2: FutureCost (send ) = 0 so match it.  

> CS221 12

• We need h(s) to be consistent , which means two things. First, the modified edge costs are non-negative (this is the main property). This is important for UCS to find the minimum cost path (remember that UCS only works when all the edge costs are non-negative). 

• Second, h(send ) = 0 , which is just saying: be reasonable. The minimum cost from the end state to the end state is trivially 0, so just use 0.

• We will come back later to the issue of getting a hold of a consistent heuristic, but for now, let’s assume we have one and see what we can do with it. Correctness of A* 

Proposition: correctness 

If h is consistent, A* returns the minimum cost path.  

> CS221 14

• The main theoretical result for A* is that if we use any consistent heuristic, then we will be guaranteed to find the minimum cost path. Proof of A* correctness 

• Consider any path [s0, a 1, s 1, . . . , a L, s L]:

· · · 

s0 s1 s2        

> Cost (s0, a 1) + h(s1)−h(s0)Cost (s1, a 2) + h(s2)−h(s1)
> Cost ′(s0, a 1)Cost ′(s1, a 2)

• Key identity: 

> L

∑

> i=1

Cost ′(si−1, a i)

︸ ︷︷ ︸

> modified path cost

=

> L

∑

> i=1

Cost (si−1, a i)

︸ ︷︷ ︸

> original path cost

+ h(sL) − h(s0)

︸ ︷︷ ︸

> constant

• Therefore, A* (finding the minimum cost path using modified costs) solves the original problem (even though edge costs are all different!)  

> CS221 16

• To show the correctness of A*, let’s take any path of length L from s0 = sstart to sL = send . Let us compute the modified path cost by just adding up the modified edge costs. Just to simplify notation, let ci = Cost (si−1, a i) and hi = h(si). The modified path cost is 

(c1 + h1 − h0) + ( c2 + h2 − h1) + · · · + ( cL + hL − hL−1). Notice that most of the hi’s actually cancel out (this is known as telescoping sums ). 

• We end up with ∑Li=1 ci, which is the original path cost plus hL − h0. First, notice that hL = 0 because sL is an end state and by the second condition of consistency, h(sL) = 0 . Second, h0 is just a constant (in that it doesn’t depend on the path at all), since all paths must start with the start state. 

• Therefore, the modified path cost is equal to the original path cost plus a constant. A*, which is running UCS on the modified edge costs, is equivalent to running UCS on the original edge costs, which minimizes the original path cost. 

• This is kind of remarkable: all the edge costs are modified in A*, but yet the final path cost is the same (up to a constant)! Efficiency of A* 

Theorem: efficiency of A* 

A* explores all states s satisfying PastCost (s) ≤ PastCost (send ) − h(s)

Interpretation: the larger h(s), the better Proof: A* explores all s such that PastCost (s) + h(s)

# ≤

PastCost (send ) 

> CS221 18

• We’ve proven that A* is correct (finds the minimum cost path) for any consistent heuristic h. But for A* to be interesting, we need to show that it’s more efficient than UCS (on the original edge costs). We will measure speed in terms of the number of states which are explored prior to exploring an end state. 

• Our second theorem is about the efficiency of A*: recall that UCS explores states in order of past cost, so that it will explore every state whose past cost is less than the past cost of the end state. 

• A* explores all states for which PastCost ′(s) = PastCost (s)+ h(s)−h(sstart ) is less than PastCost ′(send ) = PastCost (send )+ h(send )−h(sstart ),or equivalently PastCost (s) + h(s) ≤ PastCost (send ) since h(send ) = 0 .

• From here, it’s clear that we want h(s) to be as large as possible so we can push as many states over the PastCost (send ) threshold, so that we don’t have to explore them. Of course, we still need h to be consistent to maintain correctness. 

• For example, suppose PastCost (s1) = 1 and h(s1) = 1 and PastCost (send ) = 2 . Then we would have to explore s1 (1 + 1 ≤ 2). But if we were able to come up with a better heuristic where h(s1) = 2 , then we wouldn’t have to explore s1 (1 + 2 > 2). Amount explored     

> h= 0 (UCS)
> h=FutureCost

sstart send 

• If h(s) = 0 , then A* is same as UCS. 

• If h(s) = FutureCost (s), then A* only explores nodes on a minimum cost path. 

• Usually h(s) is somewhere in between.  

> CS221 20

• In this diagram, each ellipse corresponds to the set of states which are explored by A* with various heuristics. In general, any heuristic we come up with will be between the trivial heuristic h(s) = 0 which corresponds to UCS and the oracle heuristic h(s) = FutureCost (s) which is unattainable. A* search 

Key idea: distortion 

A* distorts edge costs to favor end states.  

> CS221 22

• What exactly is A* doing to the edge costs? Intuitively, it’s biasing us towards the end state. Admissibility 

Definition: admissibility 

A heuristic h(s) is admissible if 

h(s) ≤ FutureCost (s)

Intuition: admissible heuristics are optimistic 

Theorem: consistency implies admissibility 

If a heuristic h(s) is consistent , then h(s) is admissible .Proof: use induction on FutureCost (s) 

> CS221 24

• So far, we’ve just assumed that FutureCost (s) is the best possible heuristic (ignoring for the moment that it’s impractical to compute). Let’s actually prove this now. 

• To do this, we just have to show that any consistent heuristic h(s) satisfies h(s) ≤ FutureCost (s) (since by the previous theorem, the larger the heuristic, the better). In fact, this property has a special name: we say that h(s) is admissible . In other words, an admissible heuristic 

h(s) underestimates the future cost: it is optimistic. 

• The proof proceeds by induction on increasing FutureCost (s). In the base case, we have 0 = h(send ) ≤ FutureCost (send ) = 0 by the second condition of consistency. 

• In the inductive case, let s be a state and let a be an optimal action leading to s′ = Succ (s, a ) that achieves the minimum cost path to the end state; in other words, FutureCost (s) = Cost (s, a ) + FutureCost (s′). Since Cost (s, a ) ≥ 0, we have that FutureCost (s′) ≤ FutureCost (s),so by the inductive hypothesis, h(s′) ≤ FutureCost (s′). To show the same holds for s, consider: h(s) ≤ Cost (s, a ) + h(s′) ≤ Cost (s, a ) + 

FutureCost (s′) = FutureCost (s), where the first inequality follows by consistency of h(s), the second inequality follows by the inductive hypothesis, and the third equality follows because a was chosen to be the optimal action. Therefore, we conclude that h(s) ≤ FutureCost (s).

• Aside: People often talk about admissible heuristics. Using A* with an admissible heuristic is only guaranteed to find the minimum cost path for tree search algorithms, where we don’t use an explored list. However, the UCS and A* algorithms we are considering in this class are graph search algorithms, which require consistent heuristics, not just admissible heuristics, to find the minimum cost path. There are some admissible heuristics which are not consistent, but most natural ones are consistent.
