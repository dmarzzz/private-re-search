---
url: https://people.eecs.berkeley.edu/~russell/research-bo.html
title: Stuart Russell -- Foundations: Rationality and Intelligence
fetched_at: 2026-05-30T19:17:56
content_hash: sha1:77eabaa4feed2f16e878c0f4c3cb1a0e84b82e01
extractor: trafilatura
---

The classical notion of rationality as maximization of expected utility is often seen as a solid theoretical foundation for AI. Unfortunately, it is a non-existent foundation: rational behavior in this sense is computationally infeasible in all but the simplest cases. My research in this area is aimed at building a different foundation that is both normative and achievable. Put simply, I address the question, "If it's not possible to calculate the right thing to do, what's the right thing to do?"

Herbert Simon wrote at length about this problem of *bounded rationality*; his suggested solution was to propose various simplified decision procedures
that might or might not bear some resemblance to human decision procedures. He did not, however, develop any normative theory and the question
of how to choose among many possible non-rational decision procedures was left open.

I.J. Good proposed "Type II rationality" according to which an agent selects its *computations* rationally and thereby generates good decisions quickly.
Beginning in 1988 and working with PhD student Eric Wefald, I formulated this approach as *rational metareasoning*: selecting computation steps according to their
expected value in improving the quality of the agent's next decision in the physical world. These computation steps are taken in a *metalevel MDP* with a joint state space in which each state is composed
of a computational state (e.g., a partially constructed game tree) and a physical state (e.g., a chess board and its clock). We showed that even a very simple, greedy decision prcoedure in this
metalevel MDP generates very effective search behavior in two-player games, often far more effective than alpha-beta search.
To go beyond greedy metalevel decisions, we also developed the idea of *metalevel reinforcement learning* (Harada and Russell, 1999; Hay and Russell, 2011).
To allow metalevel RL systems to operate without waiting billions of steps for a final reward signal in the physical MDP, we
developed the theory of *reward shaping* (Ng, Harada, and Russell, 1999).

A similar approach to metalevel control appeared a few years later in the UCT algorithm for controlling Monte Carlo tree search (Kocsis and Szepesvari, 2006). Whereas that work formulates the metalevel decision as a bandit problem, we showed that it is in fact a selection problem rather than bandit problem, leading to very different theoretical properties (Hay, Russell, Shimony, and Tolpin, 2012). With Nick Hay, I developed a completely rigorous formulation of the metalevel decision problem and proved the basic result that an optimal computational policy spends no more time (in expectation) than the decision is worth.

Decision procedures using some form of approximate metalevel control are very interesting and still hold enormous promise as elements of generally intelligent systems, but as a foundational framework for AI they fail in two ways: first, Type II rationality is even less feasible than classical perfect rationality, because the metalevel state space of computational states is usually far larger than the underlying physical state space; and second, there is no theoretical reason to pick any particular approximate metalevel controller over any other, or indeed over any other form of decision procedure.

This brings us back to the question, "If it's not possible to calculate the right thing to do, what's the right thing to do?"
The answer is that this is the wrong question, because by its very formulation it cannot have an answer. In fact, the entire project
of imposing normative constraints of rationality on individual *actions* of the agent is hopeless. The designer of an AI system does not control
the agent's individual actions, only its program. There is no program that acts rationally, in the classical sense, at every moment in time.
We can, however, rank programs according to how well they function in an environment when running on a given machine, and this leads to the idea of *bounded optimality*:
given a fixed machine, which program produces the best expected performance?
With PhD student Shlomo Zilberstein, I studied this question for programs composed from so-called *anytime algorithms* (algorithms whose output quality
varies with the amount of time allocated). Devika Subramanian and I developed the general theory of bounded optimality as well as an asympotic version
(analogous to big-O notation in classical complexity theory) that allows one to ignore implementation details.

Bounded optimality offers a normative definition of intelligence that is both rigorous and feasible. Recently several research groups
have begun to pursue its implications, including [ Richard Lewis and Satinder Singh](http://www-personal.umich.edu/~rickl/bounded-optimality.html) at Michigan, [Andrew Howes](https://www.cs.bham.ac.uk/~howesa/) at Birmingham, [Falk Lieder](https://www.is.mpg.de/~flieder) at Tubingen, and [Tom Griffiths](https://www.edge.org/response-detail/27148) at Princeton.

-
Stuart Russell and Shlomo Zilberstein
``Composing Real-Time Systems.''
In
*Proceedings of the Twelfth International Joint Conference on Artificial Intelligence*, Sydney, Australia: Morgan Kaufmann, 1991. -
Shlomo Zilberstein and Stuart Russell
``Reasoning about optimal allocation of time using conditional
performance profiles.'' In
*Proc. AAAI-92 Workshop on Implementations of Temporal Reasoning*, San Jose, CA, July, 1992. -
Shlomo Zilberstein and Stuart Russell
``Efficient Resource-Bounded Reasoning in AT-RALPH.''
In
*Proceedings of the First International Conference on AI Planning Systems*, College Park, Maryland: Morgan Kaufmann, 1992. -
Stuart Russell and Devika Subramanian
``Constructing bounded optimal systems.''
In
*Proc. AAAI Spring Symposium on AI and NP-hard problems*, Stanford, CA, March 1993. -
Stuart Russell and Devika Subramanian ``On Provably RALPHs.''
In E. Baum (Ed.)
*Computational Learning and Cognition: Proceedings of the Third NEC Research Symposium*. SIAM Press, 1993. -
Stuart Russell, Devika Subramanian, and Ronald Parr,
``
[Provably bounded optimal agents.](https://people.eecs.berkeley.edu/papers/ijcai93-bo.pdf)'' In*Proc. Thirteenth International Joint Conference on Artificial Intelligence*, Chambery, France, 1993. -
S. Zilberstein and S. J. Russell.
``Anytime Sensing, Planning and Action: A Practical Model for Robot Control.''
In
*Proc. Thirteenth International Joint Conference on Artificial Intelligence*, Chambery, France, 1993. -
Stuart Russell and Devika Subramanian
``
[Provably bounded-optimal agents.](https://people.eecs.berkeley.edu/papers/jair-bo.pdf)''*Journal of Artificial Intelligence Research*, 2, 1995. -
Stuart Russell,
``
[Rationality and Intelligence.](https://people.eecs.berkeley.edu/papers/ijcai95-cnt.pdf)'' Invited paper (Computers and Thought Award), in*Proc. Fourteenth International Joint Conference on Artificial Intelligence*, Montreal, Canada, 1995. -
Shlomo Zilberstein and Stuart Russell
``
[Optimal composition of real-time systems.](https://people.eecs.berkeley.edu/papers/aij-anytime.pdf)''*Artificial Intelligence*, 82(1-2), pp.181-213, 1996. -
Stuart Russell,
``
[Rationality and Intelligence.](https://people.eecs.berkeley.edu/papers/aij-cnt.pdf)''*Artificial Intelligence*,**94**, 57--77, 1997. - Stuart Russell,
``
[Rationality and Intelligence.](https://people.eecs.berkeley.edu/papers/aij-cnt.pdf)'' In Renee Elio (Ed.),*Common sense, reasoning, and rationality*, Oxford University Press, 2002. - Stuart Russell,
``
[Rationality and Intelligence: A Brief Update.](https://people.eecs.berkeley.edu/papers/ptai13-intelligence.pdf)'' In Vincent C. Müller (ed.), Fundamental Issues of Artificial Intelligence (Synthese Library). Berlin: Springer, 2014.

-
Stuart Russell and Eric Wefald ``Multi-Level Decision-Theoretic
Search.'' In
*AAAI Symposium on Computer Game-Playing*, Stanford, March, 1988. - Stuart Russell and Eric Wefald, ``Decision-Theoretic Search Control: General Theory and an Application to Game-Playing.'' Computer Science Division Technical Report 88/435, University of California, Berkeley, CA, 1988.
-
Stuart Russell and Eric Wefald ``Principles of Meta-Reasoning.''
In
*Proceedings of the First International Conference on Principles of Knowledge Representation and Reasoning*, Toronto, Ontario: Morgan Kaufmann, 1989. -
Stuart Russell and Eric Wefald ``On optimal game-tree search using
rational metareasoning.''
In
*Proceedings of the Eleventh International Joint Conference on Artificial Intelligence*, Detroit, MI: Morgan Kaufmann, 1989. -
Eric Wefald and Stuart Russell
``Adaptive Learning of Decision-Theoretic Search Control Knowledge.''
In
*Proceedings of the Sixth International Workshop on Machine Learning*, Ithaca, NY: Morgan Kaufmann, 1989. -
Eric Wefald and Stuart Russell,
``Estimating the value of computation: The case of real-time search.''
In
*Proceedings of the AAAI Symposium on AI and Limited Rationality*, Stanford, March, 1989. -
Stuart Russell ``An Architecture for Bounded Rationality.''
In
*Proceedings of the AAAI Symposium on Integrated Architectures for Intelligent Agents*, Stanford, March, 1991. Also in*Proceedings of the IJCAI Workshop on Theoretical and Practical Design of Rational Agents*, Sydney, August, 1991. -
Stuart Russell and Eric H. Wefald
*Do the Right Thing: Studies in Limited Rationality*. Cambridge, MA: MIT Press, 1991. -
Stuart Russell and Eric Wefald ``
[Principles of Metareasoning.](https://people.eecs.berkeley.edu/papers/aij-principles.ps)''*Artificial Intelligence*49, 1991. - Daishi Harada and Stuart Russell, ``
[Extended abstract: Learning search strategies](https://people.eecs.berkeley.edu/papers/mini99s-mlrl.ps).'' In*Proc. AAAI Spring Symposium on Search Techniques for Problem Solving under Uncertainty and Incomplete Information*, Stanford, CA, 1999. - Nicholas J. Hay and Stuart Russell,
``
[Metareasoning for Monte Carlo Tree Search](http://www.eecs.berkeley.edu/Pubs/TechRpts/2011/EECS-2011-119.html).'' Technical Report No. UCB/EECS-2011-119, EECS Department, University of California, Berkeley, 2011. - Nicholas Hay, Stuart Russell, Solomon Eyal Shimony, and David Tolpin,
``
[Selecting Computations: Theory and Applications](https://people.eecs.berkeley.edu/papers/uai12-meta.pdf).'' In*Proc. UAI-12*, Catalina Island, 2012. - F. Lieder, D. Plunkett, J. Hamrick, S. Russell, N. Hay, T. Griffiths,
[Algorithm selection by rational metareasoning as a model of human strategy selection](https://people.eecs.berkeley.edu/papers/nips14-meta.pdf). In*Advances in Neural Information Processing Systems 23*, MIT Press, 2015. - Hay, Nicholas,
. PhD thesis, Computer Science Division, University of California, Berkeley, CA, 2016.*Principles of Metalevel Control*
