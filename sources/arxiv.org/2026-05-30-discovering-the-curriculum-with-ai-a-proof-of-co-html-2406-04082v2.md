---
url: https://arxiv.org/html/2406.04082v2
title: Discovering the curriculum with AI: A proof-of-concept demonstration with an intelligent tutoring system for teaching project selection
fetched_at: 2026-05-30T19:17:57
content_hash: sha1:19ac28e2535130b56e11d9a5096d4f58b70b673e
extractor: trafilatura
---

# Discovering the curriculum with AI:

A proof-of-concept demonstration

with an intelligent tutoring system

for teaching project selection

1Max Planck Institute for Intelligent Systems, Tübingen, Germany

2Department of Psychology, UCLA, Los Angeles, USA

∗E-mail: lovis.heindrich@tuebingen.mpg.de

October 21, 2025)

###### Abstract

The decisions of individuals and organizations are often suboptimal because fully rational decision-making is too demanding in the real world. Recent work suggests that some errors can be prevented by leveraging artificial intelligence to discover and teach clever heuristics. So far, this line of research has been limited to simplified, artificial decision-making tasks. This article is the first to extend this approach to a real-world decision problem, namely, executives deciding which project their organization should launch next. We develop a computational method (MGPS) that automatically discovers project selection strategies that are optimized for real people, and we develop an intelligent tutor that teaches the discovered project selection procedures. We evaluated MGPS on a computational benchmark and tested the intelligent tutor in a training experiment with two control conditions. MGPS outperformed a state-of-the-art method and was more computationally efficient. Moreover, people who practiced with our intelligent tutor learned significantly better project selection strategies than the control groups. These findings suggest that AI could be used to automate the process of discovering and formalizing the cognitive strategies taught by intelligent tutoring systems.

## 1 Introduction

Teaching general cognitive skills is an essential goal of education (Collins et al., [1991](https://arxiv.org/html/2406.04082v2#bib.bib18)). One way to represent cognitive skills is through cognitive strategies. For example, when teaching how to effectively solve math problems, instructors might teach their students metacognitive strategties such as evaluating the effectiveness of different solution methods or breaking problems into smaller subproblems. Prior work has shown that teaching students skills such as carefully evaluating their problem understanding of math problems can significantly improve their test scores (Özsoy and Ataman, [2009](https://arxiv.org/html/2406.04082v2#bib.bib43)). Similarly, students’ writing quality can be improved by teaching them strategies for planning and revising their texts (Graham and Perin, [2007](https://arxiv.org/html/2406.04082v2#bib.bib24)).

The teaching of cognitive strategies can be automated by developing intelligent tutoring systems (Anderson et al., [1985](https://arxiv.org/html/2406.04082v2#bib.bib5), Koedinger et al., [1997](https://arxiv.org/html/2406.04082v2#bib.bib32), Graesser et al., [2012](https://arxiv.org/html/2406.04082v2#bib.bib23)).
In current applications, the strategies the intelligent tutoring systems teach have to be specified manually (Aleven et al., [2009](https://arxiv.org/html/2406.04082v2#bib.bib3), Chi and VanLehn, [2010](https://arxiv.org/html/2406.04082v2#bib.bib15), Özsoy and Ataman, [2009](https://arxiv.org/html/2406.04082v2#bib.bib43)). While hand-crafted strategies can often be effective, they rely on the designer’s intuitions. This constitutes a key bottleneck, as it presumes that designers know the optimal cognitive strategies and can precisely articulate them. While this may be the case in some limited domains, in many domains it is unknown which cognitive strategies are optimal. Expertise in areas such as mathematical problem solving often involves tacit, procedural knowledge that is difficult to verbalize (Anderson, [1982](https://arxiv.org/html/2406.04082v2#bib.bib4)).
One way to overcome this bottleneck is to develop rational process models of human cognition (Lieder and Griffiths, [2020](https://arxiv.org/html/2406.04082v2#bib.bib35)). Recent technical advances have made it possible to automate this process by leveraging AI to discover near-optimal cognitive strategies automatically (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Krueger et al., [2024](https://arxiv.org/html/2406.04082v2#bib.bib34)). Adopting the strategies discovered by these methods consistently allowed people to perform better than the strategies they intuitively used (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)).
Moreover, it is now possible to develop intelligent tutotring systems that use AI to discover the cognitive strategies they teach by themselves (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12)). However, so far, this approach has only been evaluated in artificial decision-making tasks. Therefore, its viability for educational applications is still unclear.

In this article, we present the first proof-of-concept that automatic strategy discovery can inform educational applications in the real world.
We build directly on our prior work (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)), which brought strategy discovery closer to real-world application by introducing a metareasoning model of planning in partially observable environments. Although the planning task was complex, it was still highly artificial and unrealistic. Here, we show that the general approach to combine automatic strategy discovery with an intelligent tutor can be extended to an important class of real-world decisions: deciding which project an organization, team, or individual should pursue next. This class of decision problems is known as project selection.

Corporations and individuals often need to choose a project from multiple alternatives. These project selection problems are usually high-stakes decisions that can be highly impactful for the future of an organization. For example, an organization looking for a sustainable investment project (Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)) can benefit both financially and by improving its public image by selecting an impactful and profitable project, or incur major losses by selecting an unsuitable project.

Previous research on project selection recommends that candidate projects should be evaluated by multiple experts (Coldrick et al., [2002](https://arxiv.org/html/2406.04082v2#bib.bib17), Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31), Liu et al., [2017](https://arxiv.org/html/2406.04082v2#bib.bib38)), and many structured approaches to integrate the experts’ opinions exist (de Souza et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib20)). However, existing project selection techniques are not well utilized in the real world (Schmidt and Freeland, [1992](https://arxiv.org/html/2406.04082v2#bib.bib47), Liu et al., [2017](https://arxiv.org/html/2406.04082v2#bib.bib38), Henriksen and Traynor, [1999](https://arxiv.org/html/2406.04082v2#bib.bib28)). We hypothesize this underutilization is partly caused by the complexity and implementation costs of normative project selection strategies. Scoring approaches, which score alternative projects on several relevant selection criteria, have been proposed as a less complex selection method that can be applied to real-world problems more easily (Henriksen and Traynor, [1999](https://arxiv.org/html/2406.04082v2#bib.bib28), Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31), Coldrick et al., [2002](https://arxiv.org/html/2406.04082v2#bib.bib17), Sadi-Nezhad, [2017](https://arxiv.org/html/2406.04082v2#bib.bib46)). However, even scoring approaches face significant challenges when applied to real-world problems: precisely evaluating projects on multiple criteria can be a time-consuming and expensive process, but existing selection techniques often pay little attention to the information-gathering costs and instead assume expert opinions on all criteria are readily available and instead focus on how to integrate existing expert evaluations into a final project choice (Abdel-Basset et al., [2019](https://arxiv.org/html/2406.04082v2#bib.bib1), Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)).

Due to the limited utilization of complex project selection methods, decision-makers, therefore, often rely on their intuition and much simpler techniques like brainstorming (Kornfeld and Kara, [2013](https://arxiv.org/html/2406.04082v2#bib.bib33)).
This is concerning because the intuitive decisions of groups and individuals are highly susceptible to biases and unsystematic errors (Kahneman et al., [1982](https://arxiv.org/html/2406.04082v2#bib.bib30)), such as weighing one’s own opinion too strongly (Yaniv and Kleinberger, [2000](https://arxiv.org/html/2406.04082v2#bib.bib54)), being overconfident, and weighting the recommendations of advisors by their confidence rather than their competence (Bonaccio and Dalal, [2006](https://arxiv.org/html/2406.04082v2#bib.bib7)).
However, people’s errors in decision-making can partly be prevented by teaching prescriptive decision strategies adapted to humans by taking their cognitive limitations into account (Lieder and Griffiths, [2020](https://arxiv.org/html/2406.04082v2#bib.bib35), Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12)). This approach to improving human decision-making is known as boosting (Hertwig and Grüne-Yanoff, [2017](https://arxiv.org/html/2406.04082v2#bib.bib29)).

To identify appropriate decision strategies, we can score candidate strategies by their resource-rationality, that is, the degree to which they make rational use of people’s limited time and bounded cognitive resources (Lieder and Griffiths, [2020](https://arxiv.org/html/2406.04082v2#bib.bib35)). In the resource-rational framework, the decision operations people can perform to arrive at a decision are modeled explicitly and assigned a cost. The overall efficiency of a decision strategy in an environment can then be computed by subtracting the expected costs of the used decision operations from the expected utility of the resulting decision (see Equation [1](https://arxiv.org/html/2406.04082v2#S1.E1)) (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)). This measure is called resource-rationality score (RR-score) (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)). People are usually not fully resource-rational, and identifying decision strategies would enable people to perform as well as possible is an important open problem (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)).

| (1) |

Recent work has demonstrated that the theory of resource rationality makes it possible to leverage AI to automatically discover and teach decision strategies that enable real people to make their decisions as well as possible (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Becker et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib6), Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)). This approach has been dubbed AI-powered boosting. The first step of AI-powered boosting is to compute resource-rational decision strategies. Automatic strategy discovery methods (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)) can discover efficient decision strategies by solving the metareasoning problem of deciding which decision operations to perform. While recent work has extended automatic strategy discovery methods to larger (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)) and partially observable environments (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)), so far, they have not been applied to real-world decisions such as project selection.

In this article, we present a novel decision support method with the goal of discovering prescriptive decision-strategies that can be taught to people to improve how they select projects. Project selection is challenging because many crucial attributes of the candidate projects, such as their expected profitability, cannot be observed directly. Instead, they have to be inferred from observations that are not fully reliable. We, therefore, formalize project selection strategies as policies for solving a particular class of partially observable Markov Decision Processes (POMDPs). This formulation allows us to develop the first algorithm for discovering resource-rational strategies for human project selection. To achieve this, we model a realistic project selection task as a metareasoning problem. The metareasoning consists in deciding which information one should request from which advisors when information is highly limited, uncertain, and costly. We develop an efficient algorithm for solving this problem based on MGPO, an algorithm for discovering resource-rational strategies for human decision-making in partially observable environments (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)), and apply it to derive a prescriptive decision strategy for a project selection problem a financial institution faced in the real world (Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)). Finally, we develop an intelligent tutor (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12)) that teaches the decision strategy discovered by our method to people. We evaluated our approach by letting our intelligent tutor teach the automatically discovered project selection strategy to about 100 people, and then evaluated the quality of their decisions in realistic project selection problems against two control groups. Our results indicate that our approach can successfully improve human decisions in real-world problems where people are reluctant to let machines decide for them.

## 2 Background

#### Project selection

In the project selection problem, a decision-maker aims to select the best-fitting project out of several candidates (Sadi-Nezhad, [2017](https://arxiv.org/html/2406.04082v2#bib.bib46)). Apart from a project’s profitability, the evaluation usually also considers other factors, such as the alignment with organizational goals (Carazo et al., [2012](https://arxiv.org/html/2406.04082v2#bib.bib14)). This problem can be formalized as multi-criteria decision-making (MCDM) (de Souza et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib20), Mohagheghi et al., [2019](https://arxiv.org/html/2406.04082v2#bib.bib41)). Projects can be evaluated using a scoring technique, which evaluates relevant criteria and then combines them to a weighted sum (Sadi-Nezhad, [2017](https://arxiv.org/html/2406.04082v2#bib.bib46)). Common approaches to solving the project selection problem include techniques such as the analytic hierarchy process, the analytic network process, real options analysis, and TOPSIS (see (de Souza et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib20)) for a review). These methods are commonly combined with fuzzy sets to account for uncertainty (Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)). However, these methods are rarely used in real-world problems because implementing them would require gathering and integrating a lot of information through a time-consuming process, which is often incompatible with the organizational decision process (Schmidt and Freeland, [1992](https://arxiv.org/html/2406.04082v2#bib.bib47), Liu et al., [2017](https://arxiv.org/html/2406.04082v2#bib.bib38)). Instead, organizations often rely on simpler, less structured methods like brainstorming (Kornfeld and Kara, [2013](https://arxiv.org/html/2406.04082v2#bib.bib33)). In addition, while the detailed information required by these methods can be costly and time-consuming to acquire in real-world settings, the methods often don’t take into account how much information is needed to make an efficient decision.

#### Judge-advisor systems

In a Judge Advisor System (JAS) (Bonaccio and Dalal, [2006](https://arxiv.org/html/2406.04082v2#bib.bib7)), typically, a single decision-maker has to make a decision, and multiple advisors support the decision-maker by offering advice. Variations of the task can include costly advice (Yaniv and Kleinberger, [2000](https://arxiv.org/html/2406.04082v2#bib.bib54), Gino, [2008](https://arxiv.org/html/2406.04082v2#bib.bib22)), or advisors with varying reliability (Olsen et al., [2019](https://arxiv.org/html/2406.04082v2#bib.bib42)). This is a common situation when CEOs decide which project their company should launch next. Unfortunately, decision-makers are known to be highly susceptible to systematic errors, such as weighing one’s own opinion too strongly, overconfidence, egocentric advice discounting, and weighting the recommendations of advisors by their confidence rather than their competence (Bonaccio and Dalal, [2006](https://arxiv.org/html/2406.04082v2#bib.bib7), Ronayne et al., [2019](https://arxiv.org/html/2406.04082v2#bib.bib44), Yaniv and Kleinberger, [2000](https://arxiv.org/html/2406.04082v2#bib.bib54)). We model the project selection problem within the JAS framework by letting project evaluators take the role of advisors with varying reliability.

#### Resource rationality

Resource-rational analysis is a cognitive modeling paradigm used to describe optimal decision-making with limited computational resources (Lieder and Griffiths, [2020](https://arxiv.org/html/2406.04082v2#bib.bib35)). The paradigm considers not only the quality of decisions, but also the computational costs of reaching them. According to this paradigm, good decision-making consists in making efficient use of the available computational resources by balancing the competing objectives of maximizing the expected decision quality and minimizing computational costs. Resource rationality can be used to describe the quality of a decision strategy by subtracting the cost of the cognitive operations from the expected reward of the resulting decision. This measure is called resource-rationality score (RR-score) (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)). It will be used throughout this article to evaluate and compare alternative decision strategies. People are usually not fully resource-rational, and figuring out what decision strategies would enable people to perform as well as possible is an important open problem (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)).

#### Strategy discovery methods

Discovering resource-rational planning strategies can be achieved by solving a meta-level Markov decision process (Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26), Callaway et al., [2018a](https://arxiv.org/html/2406.04082v2#bib.bib10), [b](https://arxiv.org/html/2406.04082v2#bib.bib11)), which models the metareasoning process as a Markov Decision Process (MDP), which state represents the current belief about the environment and actions represent decision operations. Performing a decision operation results in a negative cost and results in an update to the belief state. A special termination action represents exiting the metareasoning process and making a real-world decision, guided by the current beliefs (Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26)). Multiple methods for solving meta-level MDPs exist (e.g. (Russell and Wefald, [1991](https://arxiv.org/html/2406.04082v2#bib.bib45), Callaway et al., [2018a](https://arxiv.org/html/2406.04082v2#bib.bib10), Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19))). We refer to these algorithms as strategy discovery methods (Callaway et al., [2018a](https://arxiv.org/html/2406.04082v2#bib.bib10), [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)). They learn or compute policies for selecting sequences of cognitive operations (i.e., computations) people can perform to reach good decisions.

MGPO (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)) is currently the only strategy discovery algorithm that can efficiently approximate resource-rational strategies for decision-making in partially observable environments. MGPO chooses decision operations by approximating their value of computation (Russell and Wefald, [1991](https://arxiv.org/html/2406.04082v2#bib.bib45)) in a myopic manner: it always selects the computation whose execution would yield the highest expected gain in reward if a decision had to be made immediately afterward, without any additional planning.
MGPO makes use of the myopic approximation due to the high computational complexity of partially observable Markov Decision Processes (POMDP). Alternative approaches to modeling information gathering POMDPs are difficult to apply to partially observable meta-level MDPs, as they require carefully designed information rewards (Boutilier, [2002](https://arxiv.org/html/2406.04082v2#bib.bib8)) or simplify the problem by restricting environments to be symmetric (Doshi and Roy, [2008](https://arxiv.org/html/2406.04082v2#bib.bib21)).

#### Intelligent tutoring systems

Intelligent tutoring systems (ITS) are automated computer systems that teach skills in digital learning environments (Graesser et al., [2012](https://arxiv.org/html/2406.04082v2#bib.bib23)). They provide a highly scalable learning environment (Koedinger et al., [1997](https://arxiv.org/html/2406.04082v2#bib.bib32)) that often can be similarly effective or even more effective than human tutors (VanLehn, [2011](https://arxiv.org/html/2406.04082v2#bib.bib52)). ITS achieve this by offering a personalized learning environment in which learners are able to practice skills interactively, often supported through a cognitive model of the learner’s progress that allows to adapt the learning process to their current needs (Woolf, [2010](https://arxiv.org/html/2406.04082v2#bib.bib53)). Recently, ITS have also been applied to teach general cognitive skills such as help-seeking (Aleven et al., [2006](https://arxiv.org/html/2406.04082v2#bib.bib2)) or reading comprehension (Guerra and Mellado, [2017](https://arxiv.org/html/2406.04082v2#bib.bib25)).

#### Cognitive tutors

Past work has developed cognitive tutors that teach automatically discovered planning strategies to people (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)). Training experiments indicated that training with these cognitive tutors could significantly boost the quality of people’s planning and decision-making (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12), Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)). These cognitive tutors teach efficient decision strategies in an automated manner, usually by computing the value of available decision operations using strategy discovery methods, and providing the learner feedback on the quality of the computations they select.
Initially limited to small planning tasks due to the computational complexity of solving meta-level MDPs (Lieder et al., [2019](https://arxiv.org/html/2406.04082v2#bib.bib37), Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12)), recent work has extended existing methods to larger (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19)) and partially observable (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)) settings. However, none of these methods have been applied to naturalistic problems so far.

A crucial obstacle is that these methods are limited to settings where all decision-relevant information comes from the same source. By contrast, in the real world, people have to choose between and integrate multiple different sources of information. In doing so, they have to take into account that some information sources are more reliable than others. Additionally, current strategy discovery methods are limited to artificial settings where each piece of information is an estimate of a potential future reward. By contrast, in the real world, most information is only indirectly related to future rewards, and different pieces of information have different units (e.g., temperature vs. travel time).

## 3 Formalizing optimal decision strategies for human project selection as the solution to a meta-level MDP

In this section, we introduce our general resource-rational model of project selection, which we expect to be widely applicable to concrete, real-world project selection problems.

Our model of project selection consists of two decision problems, an object-level decision-problem and a meta-level MDP (Callaway et al., [2018a](https://arxiv.org/html/2406.04082v2#bib.bib10), Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26)). The two decision problems separate the actions the decision-maker has to choose between (object level), such as executing one project versus another, from decision operations that represent thinking about which of those object-level actions to perform (meta-level), such as gathering information about the projects’ attributes. This allows us to solve both problems separately.
The object-level decision problem is a MCDM problem, where a set of potential projects are evaluated using relevant criteria weighted by fixed predetermined weights . Actions in the object-level problem represent selecting the corresponding project (). The reward of selecting a project is computed by summing the weighted criteria scores of the selected project: (Coldrick et al., [2002](https://arxiv.org/html/2406.04082v2#bib.bib17)).

While the object-level decision is to select a project, the meta-level MDP is our formalization of the problem of discovering resource-rational project selection strategies. A project selection strategy is a systematic procedure for gathering decision-relevant information about various projects and turning it into a decision. We model this information gathering as a sequence of decisions about whether to request additional information and, if so, which information to request next. In each step, the decision-maker can ask one expert to rate one feature of one project. They can then use the resulting information to decide which, if any, additional information to request in the next step. Different project selection strategies differ in 1) which information they request depending on what is already known, and 2) when they stop gathering information and select a project based on what is already known. Resource-rational project selection strategies make these choices near optimally to achieve the best possible trade-off between the quality of the selected project and the cost of the time and information invested to select it.

States in the meta-level MDP are belief states that represent the current information about each project’s attributes. We model belief states using a multivariate Normal distribution to quantify the estimated value and uncertainty about the projects’ scores on the criteria: . The actions (decision operations) of the meta-level MDP gather information about the different attributes of projects by asking one of the experts for their estimate of how one of the projects scores on one of the criteria. Experts provide discrete estimates from to , and expert estimates can differ in their reliability and their cost. Specifically, the available actions are , where the meta-level action represents asking the expert for their estimate of criterion of project .

| (2) | ||||
| (3) |

Equations [2](https://arxiv.org/html/2406.04082v2#S3.E2) and [3](https://arxiv.org/html/2406.04082v2#S3.E3) describe the belief update. After receiving information from an expert, the current belief state is updated by applying the conjugate Gaussian update, which integrates the new observation with standard deviation (the expert’s reliability) into the current belief. Beliefs are scaled by their respective criteria weight throughout.

The reward of these meta-level actions is the negative cost of asking the expert for help. Finally, the meta-level action is the termination action, which corresponds to terminating the decision-making process and selecting a project. The reward of the termination action is the expected reward of selecting the best project according to the current belief state. An optional budget parameter specifies the maximum number of meta-level actions that can be performed before the termination operation is selected.

Meta-level MDPs are notoriously difficult to solve due to their extremely large state space (Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26)). In the project selection task, the meta-level MDP has
possible belief states and possible meta-level actions. Our meta-level MDP introduces multiple new intricacies that current metareasoning methods like MGPO (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)) aren’t equipped to handle, making strategy discovery in this setting especially difficult. Compared to previously formulated meta-level MDPs (Callaway et al., [2018a](https://arxiv.org/html/2406.04082v2#bib.bib10), Hay et al., [2014](https://arxiv.org/html/2406.04082v2#bib.bib26), Consul et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib19), Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27), Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)), our meta-level description of project selection differs in the following ways: (1) the maximum amount of meta-level actions is constrained with a budget, (2) the project selection task features multiple consultants who differ in both the quality of their advice and the cost of their services, (3) consultants in the project selection task offer discrete estimates of each criterion,
requiring that (4) criteria ratings are scaled to allow weighting the criteria according to their importance.

## 4 A new metareasoning algorithm for discovering decision strategies for human project selection

In this section, we present a new metareasoning algorithm based on MGPO (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)). Previous metareasoning methods, including MGPO, are unable to handle some of the intricacies of the project selection problem. Therefore, we developed a new strategy discovery method that overcomes the limitations that prevent MGPO from being applicable to project selection. To reflect the commonalities and innovations, we call our new strategy discovery method MGPS (Meta-Greedy policy for Project Selection; see Algorithm 1). Like MGPO, MGPS approximates the value of computation (VOC) (Russell and Wefald, [1991](https://arxiv.org/html/2406.04082v2#bib.bib45)) by myopically estimating the immediate improvement in decision quality.
Improving upon MGPO, MGPS calculates the myopic approximation to the VOC in a way that accounts for discrete criteria ratings, criteria scaling, and multiple sources of information with different costs and reliabilities.

On a high level, MGPS functions by iterating over all possible meta-level actions, approximating their VOC, and iteratively selecting the computation with the highest VOC. When the selected operation requests additional information, the resulting information is used to update the belief state about the evaluated project according to Bayesian learning (Equations [2](https://arxiv.org/html/2406.04082v2#S3.E2)-[3](https://arxiv.org/html/2406.04082v2#S3.E3)). When the selected operation is the termination operation, the policy selects the project with the highest expected utility according to the current belief state.
The method by which MGPS determines when to perform which operation is described in Algorithm [1](https://arxiv.org/html/2406.04082v2#alg1).

The VOC of requesting a rating is the difference between the expected utility of receiving the resulting information and its cost. MGPS calculates a myopic approximation of the VOC of asking an expert about a specific criterion of a single project according to Lines 1-21. Concretely, this means that the VOC is approximated by the improvement in expected termination reward that would result from receiving the requested piece of information and then selecting a project compared to selecting a project immediately without obtaining any additional information (Lines [22](https://arxiv.org/html/2406.04082v2#alg1.l22)-[26](https://arxiv.org/html/2406.04082v2#alg1.l26)).

The value of requesting a rating depends on the possible posterior belief states that would result from its potential values () and their probabilities. Crucially, for a computation to have a positive myopic VOC, it must be possible for the resulting rating to change the decision-maker’s belief about which project is best. Therefore, the myopic VOC of requesting an expert evaluation chiefly depends on the probability that it will change which project appears to be best. MGPS calculates this probability based on the expected reward of the project that the expert is asked to evaluate () and the expected reward of the best alternative project (Lines [3](https://arxiv.org/html/2406.04082v2#alg1.l3)-[5](https://arxiv.org/html/2406.04082v2#alg1.l5)). If the evaluated project currently has the highest expected reward (see Line [22](https://arxiv.org/html/2406.04082v2#alg1.l22)), the VOC depends on the probability of observing a value that is so low that the currently second-best project would become the most promising option if that value were observed. The potential improvement from selecting a different project is calculated as the difference in expected rewards from the best alternative project and the current best project after integrating the new observation (see Line [23](https://arxiv.org/html/2406.04082v2#alg1.l23)). If the evaluated project does not have the highest expected termination reward, the VOC depends on the probability of observing a value high enough to make the evaluated project the most promising option (see Line [26](https://arxiv.org/html/2406.04082v2#alg1.l26)).

The cost of the requested expert is scaled using a free cost weight parameter and subtracted from the VOC estimate (see Line [29](https://arxiv.org/html/2406.04082v2#alg1.l29)). The cost weight parameter is optimized using Bayesian optimization (Mockus, [2012](https://arxiv.org/html/2406.04082v2#bib.bib40)) and enables MGPS to balance the number of selected computations in cases where a purely myopic approach might lead to suboptimal results.

To account for the fact that the advisor ratings are discrete rather than continuous, MGPS iterates over the discrete set of ratings that the expert might give and estimates the probability of each rating (). Expert ratings are modeled using the cumulative distribution function () of a Normal distribution centered on the current belief state and using the combined standard deviation of the belief and the expert’s reliability (see Line [12](https://arxiv.org/html/2406.04082v2#alg1.l12)). The probability of each discrete observation is then estimated by the probability of a sample from the assumed normal distribution falling into an interval around the observation. Concretely, MGPS uses the following intervals: for lowest possible value, for intermediate values, and for the highest possible value.
For each observation, MGPS also calculates the belief update that would result from it (). The simulated update to the belief state is computed by applying the belief state update equation (Equation [2](https://arxiv.org/html/2406.04082v2#S3.E2)) to integrate the new observation with the prior belief according to the expert’s reliability (see Line [19](https://arxiv.org/html/2406.04082v2#alg1.l19)).

The full meta-greedy policy (Line [31](https://arxiv.org/html/2406.04082v2#alg1.l31)) consists in calculating the VOC for all possible meta-level actions and iteratively performing the meta-level action with the highest VOC until no available expert advice has a positive VOC. At that point, the termination action is chosen and the project with the highest expected reward is selected.

## 5 Improving human project selection

Having developed a general metareasoning method for discovering resource-rational strategies for human project selection, we now extend it to an intelligent cognitive tutor for teaching people how to select better projects. Our goal is to evaluate whether humans can utilize the strategies discovered by MGPS and to provide a proof of concept for a general AI-powered boosting approach that can be used to improve human decision-making across a wide range of project selection problems. We first introduce a general approach for teaching people the project selection strategies discovered by MGPS, and then apply it to a real-world project selection problem.

### 5.1 MGPS Tutor: An intelligent tutor for teaching people how to select better projects

Our intelligent tutor for project selection (MGPS Tutor) trains people to select the near-optimal decision operations identified by MGPS. To achieve this, it lets people practice on a series of project selection problems and gives them feedback. MPGS Tutor leverages MPGS in two ways: i) to pedagogically construct the set of queries the learner is asked to choose from, and ii) to give the learner feedback on their chosen query.

Building on the choice tutor by (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)), our tutor repeatedly asks the learner to choose from a pedagogically chosen set of decision operations (see Figure [1](https://arxiv.org/html/2406.04082v2#S5.F1)) that always includes the query that MGPS would have performed. Moreover, it leverages MGPS’s VOC calculation (Algorithm [1](https://arxiv.org/html/2406.04082v2#alg1)) to score the chosen query, and then provides binary feedback on its quality. If learners select a suboptimal expert, project, or criterion, they receive feedback indicating the correct choice and have to wait for a short time. The unpleasantness of having to wait serves as a penalty (Callaway et al., [2022a](https://arxiv.org/html/2406.04082v2#bib.bib12)).
Otherwise, they receive positive reinforcement and the next choice is displayed. To receive positive reinforcement, the learner must select a query whose VOC is sufficiently close, as determined by a tolerance parameter , to the VOC of the optimal action. We set the tolerance to .

Our tutor teaches the strategy discovered by MGPS using a novel sophisticated training schedule, which fosters learning by incrementally increasing the complexity of the training task. This learning methodology is also known as shaping (Skinner, [1953](https://arxiv.org/html/2406.04082v2#bib.bib50)), and has been successfully applied to teach decision strategies to humans (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)). Our training schedule varies the numbers of projects, how many different expert assessments learners have to choose between, and the specific types of expert assessments offered as choices. In total, our tutor teaches the discovered project selection strategy using ten training trials. The first seven training trials use a smaller version of the project selection task with only two projects, while the last three trials use the full environment with five projects. The number of choices gradually increases throughout training from 1 in the first training trial to 9 in the last three training trials. The tutor varies the types of choices across trials. After an initial trial with only a single choice, the tutor offers choices that focus on different criteria within the same project for two trials. Then, the tutor offers choices that focus on different experts within the same project for two trials. The remaining trials combine both types of highlights while sometimes also featuring queries about different projects and also increasing the overall number of choices.

### 5.2 Evaluating the effectiveness of MGPS Tutor in a training experiment

To evaluate if AI-powered boosting can improve human project selection, we tested the MPGS tutor in a training experiment. We tested if people trained by MPGS tutor learn more resource-rational project selection strategies. To make our assessment task as naturalistic as possible, we modelled it on a real project selection problem that was faced by an Iranian financial institution (Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)). We will first describe how we modeled this real-world problem, and then the training experiment.

#### A project-selection problem from the real world

Khalili-Damghani and Sadi-Nezhad ([2013](https://arxiv.org/html/2406.04082v2#bib.bib31)) worked on the real-world problem of helping a financial institution select between five potential projects with an eye to sustainability. Each project was evaluated by six advisors, who assigned scores from one to five on six different criteria. For our model of the task, we use the same number of experts, criteria, and projects, and the same criteria weights as the financial institution. The remaining parameters of the meta-level MDP were estimated as follows. We initialized the beliefs about the project’s attributes by calculating the mean and the standard deviation of all expert ratings for each criterion according to (Khalili-Damghani and Sadi-Nezhad, [2013](https://arxiv.org/html/2406.04082v2#bib.bib31)). We estimated the reliability of each expert by calculating the standard deviation from the average distance of their ratings from the average rating of all other experts, weighted by the number of occurrences of each guess. We estimated the cost parameter of the meta-level MDP by to align the meta-level MDP’s cost-reward ratio to its real-world equivalent. Using the expected termination reward of the environment and rough estimates for the stakes and expert costs , this led to . While Khalili-Damghani and Sadi-Nezhad ([2013](https://arxiv.org/html/2406.04082v2#bib.bib31)) assumed all expert ratings are available for free, in the real world this is rarely the case. To make our test case more representative, we assumed that advisor evaluations are available on-request for a consulting fee. To capture that real-world decisions often have deadlines that limit how much information can be gathered, we set the maximum number of sequentially requested expert consultations to .

#### Methods of the experiment

We recruited 301 participants for an online training experiment on [Prolific](https://www.prolific.co/). The average participant age was 29 years, and 148 participants identified as female. Participants were paid £3.50 for completing the experiment, plus an average bonus of £0.50. The median duration of the experiment was 22 minutes, resulting in a median pay of £10.9 per hour. Our experiment was preregistered on [AsPredicted](https://aspredicted.org/YNY_H3K) and approved by the ethics commission of
the Medical Faculty of the University of Tübingen
under IRB protocol number 667/2018BO2.

Each participant was randomly assigned to one of three conditions: (1) the No tutor condition, in which participants did not receive any feedback and were free to discover efficient strategies on their own; (2) the MGPS tutor condition, in which participants practiced with our cognitive tutor that provided feedback on the resource-rationality score MGPS assigns to the selected planning actions; and (3) the Dummy tutor condition, an additional control condition in which participants practiced with a dummy tutor comparable to the MGPS tutor, albeit with randomized feedback on which planning actions are correct. All participants practiced their planning strategy in 10 training trials and were then evaluated across 10 test trials. For each trial, a new instance of the project selection environment was randomly generated by first sampling the project’s criteria scores from the initial belief state and then generating each expert’s ratings based on their reliability using a Gaussian distribution centered at the criteria score.

We evaluated the participants’ performance using two measures: their RR-score and click agreement (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)). RR-score’s are normalized by subtracting the average reward of a random baseline algorithm and dividing by the participant scores’ standard deviation. The random baseline algorithm is defined as the policy that chooses meta-level actions at random until the maximum number of decision operations is reached. Click agreement measures, how well participants learned to follow the near-optimal strategy discovered by our method. Specifically, we computed for each participant, which proportion of their information requests matched the action taken by the approximately resource-rational strategy discovered by MGPS.

#### Experiment results

| Condition | RR-score | Click Agreement |
| MGPS Tutor | ||
| No tutor | ||
| Dummy tutor |

Table [1](https://arxiv.org/html/2406.04082v2#S5.T1) shows the results of the experiment. To determine whether the condition of participants had a significant effect on the RR-score and click agreement, we used an ANOVA analysis with Box approximation (Box et al., [1954](https://arxiv.org/html/2406.04082v2#bib.bib9)). The ANOVA revealed a significant effect of condition on both RR-score (, ) and click agreement (, ). We further compared the performance of participants in the *MGPS tutor* condition to participants in the two control conditions with post hoc ANOVA-type statistics and used Cohen’s d (Cohen, [2013](https://arxiv.org/html/2406.04082v2#bib.bib16)) to evaluate the size of the effects. The post hoc tests revealed that participants in the *MGPS tutor* condition achieved a significantly higher RR-score than participants in the *No tutor* (, , ) and *Dummy tutor* (, , ) conditions. Additionally, participants in the *MGPS tutor* reached a higher click agreement with our pre-computed near-optimal strategy than participants in the *No tutor* (, , ) and *Dummy tutor* (, , ) conditions.

When evaluated on the same test trials and normalizing against the baseline reward and the standard deviation of the experiment results, MGPS achieves a mean reward of , demonstrating that MGPS discovers more resource-rational strategies than participants across all conditions. Although participants in the MGPS tutor condition performed significantly the better than participants in the other conditions, they did not learn to follow the strategy taught by the tutor exactly. Participants in the other conditions only discovered strategies with a similar RR-score to the random baseline strategy, with participants in the No tutor condition performing even worse than the random baseline strategy, and participants in the Dummy tutor condition outperforming the random baseline only by a small margin.

#### What strategy did the MGPS Tutor teach?

To understand what participants in the MGPS Tutor condition were taught, we inspected the strategy discovered by MGPS and visualized it as a flowchart in Figure [2](https://arxiv.org/html/2406.04082v2#S5.F2). We found that this strategy systematically asks the most reliable experts ( and ) to evaluate projects on the criterion with the highest decision weight (). It starts by asking expert to rate criterion for a randomly selected project. If that rating is below the maximum score, the same expert is immediately asked to rate the same criterion for a different project. If expert gives project the highest possible score on criterion (), the strategy requests a second opinion about it from expert .
If expert also evaluates the criterion’s value as , the decision process ends and project is selected. If expert provides a rating below , expert is asked about a different project. This process is repeated until a project in which both experts and estimate is found, or the maximum number of decision operations () is reached. It is important to note that while this decision strategy is relatively easy to understand, describe, and execute, the task of discovering this specific strategy as more resource-rational than the vast number of possible other strategies is considerably more difficult.

#### What aspects of the strategy did participants learn?

We further analyzed which aspects of MGPS’ strategy participants learned from the intelligent tutor. Specifically, we investigated in which proportion of the test trials participants managed to (1) start planning with an optimal action and (2) correctly decide whether to continue investigating the same project or switch to requesting information about an alternative project. MGPS’ strategy starts by requesting information about criterion from one of the two most reliable experts. Participants in the MGPS tutor condition did so of the time, whereas participants in the No tutor condition did so only of the time. Looking into why many failed to request this information, we found that more participants learned to request information from the most reliable experts ( for participants in the MGPS tutor condition and for participants in the No tutor condition) than to request information about the most important evaluation criteria ( for participants in the MGPS tutor condition and for participants in the No tutor condition).

A second important aspect of MGPS’s strategy is how it responds to the information revealed. Excluding trials in which participants’ first expert request did not match an action MGPS identifies as optimal, we analyzed whether participants either correctly continued to evaluate the current project (in case of revealing an expert guess of ), or correctly switched to evaluating an alternative project (when revealing an expert guess smaller than ). Participants in the MGPS tutor condition ( of test trials) and participants in the No tutor condition ( of test trials) both learned to accurately switch projects when appropriate. Repeatedly evaluating the current project proved to be the most difficult component of the discovered strategy to learn, with participants in the only MGPS tutor condition following this aspect of the strategy in of test trials and participants of the No tutor condition following the strategy in only of test trials.

## 6 Performance evaluation

The results reported in the previous section show that MPGS can discover project selection strategies that are more effective than the strategies people discover on their own. But how does its performance compare to other strategy discovery algorithms? To answer this question, we evaluated MGPS on a computational benchmark. We chose PO-UCT (Silver and Veness, [2010](https://arxiv.org/html/2406.04082v2#bib.bib48)) for comparisons because it is an established baseline for metareasoning algorithms in partially observable environments (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)) and the more specialized MGPO algorithm is not applicable to project selection. PO-UCT utilizes Monte Carlo tree search to simulate the effects of different actions, resulting in more accurate results with increased computation time, making it a useful baseline for MGPS’s computational efficiency and performance.

#### Method

We evaluated the effectiveness of our method in the project selection task by comparing it against PO-UCT (Silver and Veness, [2010](https://arxiv.org/html/2406.04082v2#bib.bib48)) with different numbers of steps. All methods were evaluated across the same 5000 randomly generated instances of the project selection environment.

Our main performance measure was the resource-rationality score (RR-Score defined in Equation [1](https://arxiv.org/html/2406.04082v2#S1.E1)). To highlight the achieved improvements over a baseline algorithm that performs random meta-level actions, we normalized the reported RR-scores. Specifically, we applied a z-score transformation, subtracting the average reward of the random baseline algorithm (see Section [5.2](https://arxiv.org/html/2406.04082v2#S5.SS2.SSS0.Px2)) from the RR-Scores and dividing by the evaluated algorithm’s RR-Scores’ standard deviation. We analyze the differences in RR-Scores with an ANOVA and evaluate the size of statistical effects with Cohen’s d (Cohen, [2013](https://arxiv.org/html/2406.04082v2#bib.bib16)). Additionally, we compare the computational efficiency of the different methods, which is crucial for being able to provide real-time feedback in our cognitive tutor.

#### Results

| Algorithm | RR-score | Runtime (s) |
| MGPS | ||
| PO-UCT (10 steps) | ||
| PO-UCT (100 steps) | ||
| PO-UCT (1000 steps) | ||
| PO-UCT (5000 steps) |

As shown in Table [2](https://arxiv.org/html/2406.04082v2#S6.T2), MGPS outperformed all tested versions of PO-UCT and the random baseline strategy (as the RR-scores are normalized by subtracting the mean RR-score of the random baseline, the random baseline strategy itself has a normalized RR-score of ).
An ANOVA revealed significant differences in the RR-scores of the strategies discovered by the different methods (, ). Hukey-HSD post-hoc comparisons indicated that the strategies discovered by MGPS are significantly more resource-rational than the strategies discovered by PO-UCT with 10 steps (, ), 100 steps (, ), 1000 steps (, ), or 5000 steps (, ). While MGPS achieves significantly higher RR-scores than all PO-UCT variants, the size of the effect decreases from a very large effect to a small effect when increasing PO-UCT’s computational budget sufficiently. We therefore expect that PO-UCT with a much more than 5000 steps would ultimately achieve comparable RR-scores to MGPO, albeit at a much higher computational cost.
Moreover, MGPS was substantially faster than PO-UCT with a computational budget of 1000 steps or more, which is when PO-UCT’s performance starts to approach that of MGPS. With a computational budget of 100 steps or fewer, PO-UCT is faster than MGPS. However, such a small computational budget is not enough for PO-UCT to discover strategies with a RR-score anywhere near that of the strategy discovered by MGPS.
Critically, the high amount of computation required for PO-UCT to achieve an approximately similar level of resource-rationality would render PO-UCT unusable for a cognitive tutor that computes feedback in real time.

## 7 Conclusion

This article presented a first proof-of-concept demonstration that AI can be applied to discover and teach cognitive strategies enabling people to make better decisions in the real world.

To this end, we introduced a metareasoning method for leveraging AI to discover near-optimal decision strategies for human project selection. Modeling project selection through the lens of resource rationality allowed us to formulate a mathematically precise criterion for the quality of decision strategies for human project selection. We further developed an efficient automatic strategy discovery algorithm that automatically discovers efficient strategies for human project selection. Our algorithm discovered decision strategies that are much more resource-rational than the strategies humans discovered on their own and the strategies discovered by a general-purpose algorithm for solving POMDPs (PO-UCT). Using the decision strategies discovered by our algorithm, we created a cognitive tutor that uses a shaping schedule and metacognitive feedback to teach the strategies to humans. In the training experiment, our cognitive tutor fostered significant improvements in participants’ resource rationality.

Prior work has extended strategy discovery to partially observable environments, a critical advance for utilizing strategy discovery to improve human decision-making in the real world (Heindrich et al., [2025](https://arxiv.org/html/2406.04082v2#bib.bib27)). While the intelligent tutor in prior work proved effective at modeling partially observable problems and improving human decision-making, it shared a key limitation with previous work in the field: it was evaluated on abstract and simplified toy problems. In this article, we demonstrated a viable pathway to bringing strategy discovery into the real world: using real-world data to construct metalevel MDPs of real problems, solving the metalevel MDP with strategy discovery methods, and teaching the discovered strategies to humans with intelligent tutors.

This approach might make it possible to extend the curricula of intelligent tutoring systems beyond the procedural skills that instructional designers are readily able to articulate. Our demonstration that this approach is applicable to a decision-making skill commonly taught in MBA programs could become a milestone on the path to integrating automatic strategy discovery into educational applications of intelligent tutoring systems.

A main limitation of our method is that it is unknown how precisely the environment parameters need to be estimated to construct the metareasoning task. With a highly accurate environment model, it is more likely that people will be able to directly apply the learned strategies to analogous situations in the real world, while a more abstract representation of the real-world task would require significant transfer of the learned strategy. While limited evidence for strategy transfer exists (Callaway et al., [2022b](https://arxiv.org/html/2406.04082v2#bib.bib13)), we believe modeling real-world problems as accurately as possible is the most likely path towards real-world impact. This can prove especially problematic when there isn’t much data on past decisions. Future work could investigate this issue with a sensitivity analysis and potentially address it by extending MGPS with a Bayesian inference approach to estimate uncertain parameters of the environment (Mehta et al., [2022](https://arxiv.org/html/2406.04082v2#bib.bib39)). This extension would make MGPS robust to uncertainties in the underlying distributions of evaluation criteria or expert reliability, and make it possible to discover resource-rational strategies even when data to estimate environment parameters is limited.

Another simplification of the environment model is that all observations are generated by retrieving a noisy sample of the true reward distribution, which is likely overly optimistic of real-world situations. For example, experts in the project evaluation task might have biases that lead to systematic overvaluation of specific criteria. This limitation could be addressed by integrating a model of people’s biases, such as utility weighted sampling (Lieder et al., [2015](https://arxiv.org/html/2406.04082v2#bib.bib36)).

Our method, MGPS, is limited by the assumption that each computation is independent from all other computations. Real-world situations might involve more complex, interdependent planning steps. While it is possible to integrate this into the metalevel-MDP, MGPS’s myopic approximation could fail in more complicated scenarios with interdependent criteria. Such challenges could be addressed by solving meta-level MDPs with methods from deep reinforcement learning, for example, by utilizing AlphaZero (Silver et al., [2017](https://arxiv.org/html/2406.04082v2#bib.bib49)).

Similarly, while our cognitive tutor proved to be effective in teaching humans critical aspects of MGPS’ discovered strategies, we are looking forward to future pedagogical work that improves and further evaluates the mechanisms by which the cognitive tutor teaches strategies. An especially exciting direction could be to expand the tutor with automatically generated natural language descriptions for how to make project selection decisions, such as using AI-Interpret (Skirzyński et al., [2021](https://arxiv.org/html/2406.04082v2#bib.bib51)) or large language models.

While our implementation of project selection demonstrated the viability of improving human decision-making in naturalistic tasks, we did not evaluate our method directly in the real world. The most critical direction of future work is therefore to assess the methodology in a real-world field test. We believe our method to be generally applicable to a wide range of real-world decision-making problems that follow the general structure of being able to improve the quality of a decision (i.e. being able to choose a better project after learning additional information) at the cost of expending additional planning effort (i.e. the cost of requesting an expert opinion). Building upon our project selection model, relevant real-world decisions could be a company deciding which research project to invest in or a charity deciding which initiatives maximize impact and cost-effectiveness.

Our results indicate that it is possible to use resource-rational analysis combined with automatic strategy discovery to improve human decision-making in realistic scenarios. While our main goal was to provide a proof-of-concept demonstration for the general approach, project selection is an important practical skill that is commonly taught in MBA programs. Future work could leverage automatic strategy discovery methods to design of intelligent tutoring systems for training executive and managerial decision making. The resulting educational technologies could be useful for equipping future leaders with more rational, yet practical, project selection strategies. More generally, we view our results as demonstrating the feasibility of (1) modeling good real-world decision-making within the rational metreasoning framework, (2) discovering efficient cognitive strategies for real-world problems, and (3) improving human decision-making by teaching them the discovered strategies. We are optimistic that this general approach can ultimately be applied to teaching cognitive skills, including mathematical problem-solving, decision-making, and computational thinking, in educational settings ranging from high school to executive MBA programs.

### Acknowledgements

This project was funded by grant number CyVy-RF-2019-02 from the Cyber Valley Research Fund.

The authors thank the International Max Planck Research School for Intelligent Systems (IMPRS-IS) for supporting Lovis Heindrich.

The code of the strategy discovery method as well as data and analysis for the simulation and training experiment are available online: [https://github.com/lovis-heindrich/MGPS-project-selection/](https://github.com/lovis-heindrich/MGPS-project-selection/).

## References

-
Abdel-Basset et al. (2019)
M. Abdel-Basset, A. Atef, and F. Smarandache.
A hybrid neutrosophic multiple criteria group decision making approach for project selection.
*Cognitive Systems Research*, 57:216–227, 2019. -
Aleven et al. (2006)
V. Aleven, B. M. McLaren, I. Roll, and K. R. Koedinger.
Toward meta-cognitive tutoring: A model of help seeking with a cognitive tutor.
*Int. J. Artif. Intell. Educ.*, 16(2):101–128, 2006. URL[http://content.iospress.com/articles/international-journal-of-artificial-intelligence-in-education/jai16-2-02](http://content.iospress.com/articles/international-journal-of-artificial-intelligence-in-education/jai16-2-02). -
Aleven et al. (2009)
V. Aleven, B. M. Mclaren, J. Sewall, and K. R. Koedinger.
A new paradigm for intelligent tutoring systems: Example-tracing tutors.
*International Journal of Artificial Intelligence in Education*, 19(2):105–154, 2009. -
Anderson (1982)
J. R. Anderson.
Acquisition of cognitive skill.
*Psychological review*, 89(4):369, 1982. -
Anderson et al. (1985)
J. R. Anderson, C. F. Boyle, and B. J. Reiser.
Intelligent tutoring systems.
*Science*, 228(4698):456–462, 1985. doi: 10.1126/science.228.4698.456. URL[https://www.science.org/doi/abs/10.1126/science.228.4698.456](https://www.science.org/doi/abs/10.1126/science.228.4698.456). -
Becker et al. (2022)
F. Becker, J. Skirzyński, B. van Opheusden, and F. Lieder.
Boosting human decision-making with ai-generated decision aids.
*Computational Brain & Behavior*, pages 1–24, 2022. -
Bonaccio and Dalal (2006)
S. Bonaccio and R. S. Dalal.
Advice taking and decision-making: An integrative literature review, and implications for the organizational sciences.
*Organizational behavior and human decision processes*, 101(2):127–151, 2006. -
Boutilier (2002)
C. Boutilier.
A pomdp formulation of preference elicitation problems.
In
*AAAI/IAAI*, pages 239–246. Edmonton, AB, 2002. -
Box et al. (1954)
G. E. Box et al.
Some theorems on quadratic forms applied in the study of analysis of variance problems, i. effect of inequality of variance in the one-way classification.
*The annals of mathematical statistics*, 25(2):290–302, 1954. -
Callaway et al. (2018a)
F. Callaway, S. Gul, P. M. Krueger, T. L. Griffiths, and F. Lieder.
Learning to select computations.
*Uncertainty in Artificial Intelligence*, 2018a. -
Callaway et al. (2018b)
F. Callaway, F. Lieder, P. Das, S. Gul, P. M. Krueger, and T. Griffiths.
A resource-rational analysis of human planning.
In
*CogSci*, 2018b. -
Callaway et al. (2022a)
F. Callaway, Y. R. Jain, B. van Opheusden, P. Das, G. Iwama, S. Gul, P. M. Krueger, F. Becker, T. L. Grifﬁths, and F. Lieder.
Leveraging artificial intelligence to improve people’s planning strategies.
*Proceedings of the National Academy of Sciences of the United States of America*, Mar. 2022a. doi: 10.1073/pnas.2117432119. URL[https://www.pnas.org/doi/10.1073/pnas.2117432119](https://www.pnas.org/doi/10.1073/pnas.2117432119). -
Callaway et al. (2022b)
F. Callaway, B. van Opheusden, S. Gul, P. Das, P. M. Krueger, T. L. Griffiths, and F. Lieder.
Rational use of cognitive resources in human planning.
*Nature Human Behaviour*, 6(8):1112–1125, 2022b. doi: 10.1038/s41562-022-01332-8. -
Carazo et al. (2012)
A. F. Carazo, I. Contreras, T. Gómez, and F. Pérez.
A project portfolio selection problem in a group decision-making context.
*Journal of Industrial & Management Optimization*, 8(1):243, 2012. Publisher: American Institute of Mathematical Sciences. -
Chi and VanLehn (2010)
M. Chi and K. VanLehn.
Meta-cognitive strategy instruction in intelligent tutoring systems: how, when, and why.
*Journal of Educational Technology & Society*, 13(1):25–39, 2010. -
Cohen (2013)
J. Cohen.
*Statistical power analysis for the behavioral sciences*. Academic press, 2013. -
Coldrick et al. (2002)
S. Coldrick, C. Lawson, P. Ivey, and C. Lockwood.
A decision framework for r&d project selection.
In
*IEEE International Engineering Management Conference*, volume 1, page 413–418. IEEE, 2002. -
Collins et al. (1991)
A. Collins, J. S. Brown, A. Holum, et al.
Cognitive apprenticeship: Making thinking visible.
*American educator*, 15(3):6–11, 1991. -
Consul et al. (2022)
S. Consul, L. Heindrich, J. Stojcheski, and F. Lieder.
Improving human decision-making by discovering efficient strategies for hierarchical planning.
*Computational Brain & Behavior*, 5(2):185–216, 2022. -
de Souza et al. (2021)
D. G. B. de Souza, E. A. dos Santos, N. Y. Soma, and C. E. S. da Silva.
MCDM-Based R&D Project Selection: A Systematic Literature Review.
*Sustainability*, 13(21):11626, 2021. Publisher: MDPI. -
Doshi and Roy (2008)
F. Doshi and N. Roy.
The permutable pomdp: fast solutions to pomdps for preference elicitation.
In
*Proceedings of the 7th international joint conference on Autonomous agents and multiagent systems-Volume 1*, pages 493–500, 2008. -
Gino (2008)
F. Gino.
Do we listen to advice just because we paid for it? the impact of advice cost on its use.
*Organizational Behavior and Human Decision Processes*, 107:234–245, 2008. -
Graesser et al. (2012)
A. C. Graesser, M. W. Conley, and A. Olney.
Intelligent tutoring systems.
*APA educational psychology handbook, Vol 3: Application to learning and teaching.*, pages 451–473, 2012. -
Graham and Perin (2007)
S. Graham and D. Perin.
A meta-analysis of writing instruction for adolescent students.
*Journal of educational psychology*, 99(3):445, 2007. -
Guerra and Mellado (2017)
E. Guerra and G. Mellado.
A-book: A feedback-based adaptive system to enhance meta-cognitive skills during reading.
*Frontiers in Human Neuroscience*, 11:98, 2017. -
Hay et al. (2014)
N. Hay, S. Russell, D. Tolpin, and S. E. Shimony.
Selecting computations: Theory and applications.
*arXiv preprint arXiv:1408.2048*, 2014. -
Heindrich et al. (2025)
L. Heindrich, S. Consul, and F. Lieder.
An intelligent tutor for planning in large partially observable environments.
*International Journal of Artificial Intelligence in Education*, pages 1–33, 2025. -
Henriksen and Traynor (1999)
A. Henriksen and A. Traynor.
A practical r&d project-selection scoring tool.
*IEEE Transactions on Engineering Management*, 46(2):158–170, 1999. doi: 10.1109/17.759144. -
Hertwig and Grüne-Yanoff (2017)
R. Hertwig and T. Grüne-Yanoff.
Nudging and boosting: Steering or empowering good decisions.
*Perspectives on Psychological Science*, 12(6):973–986, 2017. -
Kahneman et al. (1982)
D. Kahneman, S. P. Slovic, P. Slovic, and A. Tversky.
*Judgment under uncertainty: Heuristics and biases*. Cambridge university press, 1982. -
Khalili-Damghani and Sadi-Nezhad (2013)
K. Khalili-Damghani and S. Sadi-Nezhad.
A hybrid fuzzy multiple criteria group decision making approach for sustainable project selection.
*Applied Soft Computing*, 13(1):339–352, 2013. -
Koedinger et al. (1997)
K. R. Koedinger, J. R. Anderson, W. H. Hadley, and M. A. Mark.
Intelligent tutoring goes to school in the big city.
*International Journal of Artificial Intelligence in Education*, 8:30–43, 1997. -
Kornfeld and Kara (2013)
B. Kornfeld and S. Kara.
Selection of Lean and Six Sigma projects in industry.
*International Journal of Lean Six Sigma*, 2013. Publisher: Emerald Group Publishing Limited. -
Krueger et al. (2024)
P. M. Krueger, F. Callaway, S. Gul, T. L. Griffiths, and F. Lieder.
Identifying resource-rational heuristics for risky choice.
*Psychological Review*, 131(4):905, 2024. -
Lieder and Griffiths (2020)
F. Lieder and T. L. Griffiths.
Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources.
*Behavioral and Brain Sciences*, 43, 2020. -
Lieder et al. (2015)
F. Lieder, T. L. Griffiths, and M. Hsu.
Utility-weighted sampling in decisions from experience.
In
*The 2nd Multidisciplinary Conference on Reinforcement Learning and Decision Making*, 2015. -
Lieder et al. (2019)
F. Lieder, F. Callaway, Y. Jain, P. Krueger, P. Das, S. Gul, and T. Griffiths.
A cognitive tutor for helping people overcome present bias.
In
*RLDM 2019*, 2019. -
Liu et al. (2017)
F. Liu, W.-d. Zhu, Y.-w. Chen, D.-l. Xu, and J.-b. Yang.
Evaluation, ranking and selection of R&D projects by multiple experts: an evidential reasoning rule based approach.
*Scientometrics*, 111(3):1501–1519, 2017. Publisher: Springer. -
Mehta et al. (2022)
A. Mehta, Y. R. Jain, A. Kemtur, J. Stojcheski, S. Consul, M. Tošić, and F. Lieder.
Leveraging machine learning to automatically derive robust decision strategies from imperfect knowledge of the real world.
*Computational Brain & Behavior*, 5(3):343–377, 2022. -
Mockus (2012)
J. Mockus.
*Bayesian approach to global optimization: theory and applications*, volume 37. Springer Science & Business Media, 2012. -
Mohagheghi et al. (2019)
V. Mohagheghi, S. M. Mousavi, J. Antuchevičienė, and M. Mojtahedi.
Project portfolio selection problems: a review of models, uncertainty approaches, solution techniques, and case studies.
*Technological and Economic Development of Economy*, 25(6):1380–1412, 2019. -
Olsen et al. (2019)
K. Olsen, A. Roepstorff, and D. Bang.
Knowing whom to learn from: individual differences in metacognition and weighting of social information.
*PsyArXiv*, 2019. -
Özsoy and Ataman (2009)
G. Özsoy and A. Ataman.
The effect of metacognitive strategy training on mathematical problem solving achievement.
*International Electronic Journal of Elementary Education*, 1(2):67–82, 2009. -
Ronayne et al. (2019)
D. Ronayne, D. Sgroi, et al.
*Ignoring good advice*. University of Warwick, Centre for Competitive Advantage in the Global …, 2019. -
Russell and Wefald (1991)
S. Russell and E. Wefald.
Principles of metareasoning.
*Artificial intelligence*, 49(1–3):361–395, 1991. -
Sadi-Nezhad (2017)
S. Sadi-Nezhad.
A state-of-art survey on project selection using mcdm techniques.
*Journal of Project Management*, 2(1):1–10, 2017. -
Schmidt and Freeland (1992)
R. L. Schmidt and J. R. Freeland.
Recent progress in modeling R&D project-selection processes.
*IEEE Transactions on Engineering Management*, 39(2):189–201, 1992. Publisher: IEEE. -
Silver and Veness (2010)
D. Silver and J. Veness.
Monte-carlo planning in large pomdps.
*Advances in neural information processing systems*, 23, 2010. -
Silver et al. (2017)
D. Silver, T. Hubert, J. Schrittwieser, I. Antonoglou, M. Lai, A. Guez, M. Lanctot, L. Sifre, D. Kumaran, T. Graepel, T. P. Lillicrap, K. Simonyan, and D. Hassabis.
Mastering chess and shogi by self-play with a general reinforcement learning algorithm.
*CoRR*, abs/1712.01815, 2017. URL[http://arxiv.org/abs/1712.01815](http://arxiv.org/abs/1712.01815). -
Skinner (1953)
B. Skinner.
*Shaping and maintaining operant behavior*, pages 91–106. Free Press New York, 1953. -
Skirzyński et al. (2021)
J. Skirzyński, F. Becker, and F. Lieder.
Automatic discovery of interpretable planning strategies.
*Machine Learning*, 110:2641–2683, 2021. -
VanLehn (2011)
K. VanLehn.
The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems.
*Educational psychologist*, 46(4):197–221, 2011. -
Woolf (2010)
B. P. Woolf.
*Building intelligent interactive tutors: Student-centered strategies for revolutionizing e-learning*. Morgan Kaufmann, 2010. -
Yaniv and Kleinberger (2000)
I. Yaniv and E. Kleinberger.
Advice taking in decision making: Egocentric discounting and reputation formation.
*Organizational behavior and human decision processes*, 83(2):260–281, 2000.
