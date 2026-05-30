---
url: https://cw.fel.cvut.cz/old/_media/courses/ae3m33ui/lectures/seqanal-slides_en.pdf
title: seqanal-slides_en.pdf
fetched_at: 2026-05-30T19:09:55
content_hash: sha1:0abfe70989c6a93810f5782a10004f7f3875f0fa
extractor: jina
---

Title: seqanal-slides_en.pdf

URL Source: https://cw.fel.cvut.cz/old/_media/courses/ae3m33ui/lectures/seqanal-slides_en.pdf

Published Time: Tue, 31 Mar 2015 10:15:20 GMT

Number of Pages: 22

Markdown Content:
CZECH TECHNICAL UNIVERSITY IN PRAGUE
Faculty of Electrical Engineering
Department of Cybernetics
P. Poˇs´ık c© 2015 Artificial Intelligence – 1 / 14
Sequential pattern recognition. Wald’s analysis.
Petr Poˇs´ık
Czech Technical University in Prague
Faculty of Electrical Engineering
Dept. of CyberneticsMotivation: Statistical sampling plans
(Statistick ´a pˇrej´ımka)
P. Poˇs´ık c© 2015 Artificial Intelligence – 2 / 14Sampling plans
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 3 / 14
Example situation:
n Our company builds machines. From our subcontractor, we buy spindles with the
nominal diameter 7.5 mm in batches containing 10 thousands pieces. The real
diameters of the components are surely different from the nominal value. How can
we decide whether the batch is of acceptable quality, or that we decline to accept it
and return it to the manufacturer?Sampling plans
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 3 / 14
Example situation:
n Our company builds machines. From our subcontractor, we buy spindles with the
nominal diameter 7.5 mm in batches containing 10 thousands pieces. The real
diameters of the components are surely different from the nominal value. How can
we decide whether the batch is of acceptable quality, or that we decline to accept it
and return it to the manufacturer?
Options:
n 100% control: not economical, impossible when destructive tests needed.Sampling plans
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 3 / 14
Example situation:
n Our company builds machines. From our subcontractor, we buy spindles with the
nominal diameter 7.5 mm in batches containing 10 thousands pieces. The real
diameters of the components are surely different from the nominal value. How can
we decide whether the batch is of acceptable quality, or that we decline to accept it
and return it to the manufacturer?
Options:
n 100% control: not economical, impossible when destructive tests needed.
n Statistical sampling plans:
n Measure (test) only a limited number of pieces.
n Induce the quality of the whole batch from these measurements.
n We save time, labour, and money.
n Fundamental question question: How to determine the required sample size to test,
to be sufficiently sure to accept/decline the batch?
n Two possible errors:
n We decline a good batch (error of the 1st kind, probability α)
n We accept a bad batch (error of the 2nd kind, probability β)Sampling plans (cont.)
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 4 / 14
Classic hypothesis testing puts in relation
n the effect size, i.e. the difference between
n the null hypothesis H0 (agreement with the specifications, e.g. D = 7.5 mm) and
n the alternative hypothesis H1 (unacceptable difference, e.g. D = 7.505 mm),
n the acceptable probabilities of errors of the 1st and 2nd kind (α a β) and
n the sample size N.Sampling plans (cont.)
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 4 / 14
Classic hypothesis testing puts in relation
n the effect size, i.e. the difference between
n the null hypothesis H0 (agreement with the specifications, e.g. D = 7.5 mm) and
n the alternative hypothesis H1 (unacceptable difference, e.g. D = 7.505 mm),
n the acceptable probabilities of errors of the 1st and 2nd kind (α a β) and
n the sample size N.
The relations:
n The lower number of errors we require, the larger sample size we need (to be 100%
sure, we would need to check the whole batch).
n The smaller the difference we want to detect, the larger sample size is required.Sampling plans (cont.)
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 4 / 14
Classic hypothesis testing puts in relation
n the effect size, i.e. the difference between
n the null hypothesis H0 (agreement with the specifications, e.g. D = 7.5 mm) and
n the alternative hypothesis H1 (unacceptable difference, e.g. D = 7.505 mm),
n the acceptable probabilities of errors of the 1st and 2nd kind (α a β) and
n the sample size N.
The relations:
n The lower number of errors we require, the larger sample size we need (to be 100%
sure, we would need to check the whole batch).
n The smaller the difference we want to detect, the larger sample size is required.
Fixed sampling plan:
n Based on classic hypothesis testing.
n Given the difference from specification we want to detect, and the probabilities α (and
possibly β), it is possible to derive the sample size N we need to test.
n Based on N measurements we decide, whether the batch is acceptable or not.Sampling plans (cont.)
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
• Sampling plans
• CUSUM diagrams
Sequential analysis
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 4 / 14
Classic hypothesis testing puts in relation
n the effect size, i.e. the difference between
n the null hypothesis H0 (agreement with the specifications, e.g. D = 7.5 mm) and
n the alternative hypothesis H1 (unacceptable difference, e.g. D = 7.505 mm),
n the acceptable probabilities of errors of the 1st and 2nd kind (α a β) and
n the sample size N.
The relations:
n The lower number of errors we require, the larger sample size we need (to be 100%
sure, we would need to check the whole batch).
n The smaller the difference we want to detect, the larger sample size is required.
Fixed sampling plan:
n Based on classic hypothesis testing.
n Given the difference from specification we want to detect, and the probabilities α (and
possibly β), it is possible to derive the sample size N we need to test.
n Based on N measurements we decide, whether the batch is acceptable or not.
Sequential sampling plan:
n A single measurement is carried out.
n If the measurements accumulated so far provide sufficient evidence, accept/decline
the batch, otherwise, obtain a measurement for another piece.CUSUM diagrams
P. Poˇs´ık c© 2015 Artificial Intelligence – 5 / 14
Two-sided sequential test of hypothesis about the
mean:
n The cumulative sum (CUSUM) of the
differences can increase and decrease (the
differences from specifications may be both
positive and negative).
One-sided sequential test of hypothesis about the
population probability:
n The cumulative sum of the differences may
only grow (the number of non-conforming
units).Sequential analysis
P. Poˇs´ık c© 2015 Artificial Intelligence – 6 / 14Sequential analysis
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 7 / 14
n Subfield of statistics and machine learning.
n The way the analysis is carried out depends in some way on the results of previous
steps:
1. selection of the experiment, measurement, or test that should be carried out next,
2. terminate/continue with the analysis
Advantages:
n Testing can be shorter than using the classic analysis of the whole sample.
n The individual tests do not have to be of the same type!
n The diagnostic plan may be modified depending on the results of preceding steps.
Compare:
n We would like to determine if a patient suffers from cancer. We carry out all the
following tests: blood analysis, X-ray scan, CT, magnetic resonance, ultrasound
scan, . . . Based on the results of all these measurements we decide if it is the
cancer or not.
n We would like to determine if a patient suffers from cancer. We carry out the
blood analysis. If there are no abnormalities, we decide the patient does not have
cancer. Otherwise, depending on the type of abnormality, we perform either a
X-ray scan, CT, magnetic resonance, . . . 1
1This plan is not correct from the medicine point of view; it is just used as an example.Sequential decision problem
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 8 / 14
n Object x belongs to one of two classes {−1, +1}.
n We are given an ordering of measurements (x1, . . . , xm ) on object x.
n A sequential decision strategy is a set of decision functions S = {S1, . . . , Sm }.
n Each decision function Si : {x1, . . . , xi } → {−1, +1, #}.Sequential decision problem
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 8 / 14
n Object x belongs to one of two classes {−1, +1}.
n We are given an ordering of measurements (x1, . . . , xm ) on object x.
n A sequential decision strategy is a set of decision functions S = {S1, . . . , Sm }.
n Each decision function Si : {x1, . . . , xi } → {−1, +1, #}.
Sequential decision strategy S:
n In step i, it uses the function Si which on the basis of measurements x1, . . . , xi either
decides that x belongs to one of the two classes {−1, +1}, or provides decision # (“I
do not know yet”).
n If Si decides for #, the strategy carries out the next measurement xi+1 and uses the
next function Si+1.
n It is characterized by the errors of the 1st and 2nd kind (αS and βS) and by the
expected time to decision
TS = E(TS (x)),
where the time to decision TS is given as
TS (x) = arg min
i (Si (x) 6 = #).Sequential decision problem
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 8 / 14
n Object x belongs to one of two classes {−1, +1}.
n We are given an ordering of measurements (x1, . . . , xm ) on object x.
n A sequential decision strategy is a set of decision functions S = {S1, . . . , Sm }.
n Each decision function Si : {x1, . . . , xi } → {−1, +1, #}.
Sequential decision strategy S:
n In step i, it uses the function Si which on the basis of measurements x1, . . . , xi either
decides that x belongs to one of the two classes {−1, +1}, or provides decision # (“I
do not know yet”).
n If Si decides for #, the strategy carries out the next measurement xi+1 and uses the
next function Si+1.
n It is characterized by the errors of the 1st and 2nd kind (αS and βS) and by the
expected time to decision
TS = E(TS (x)),
where the time to decision TS is given as
TS (x) = arg min
i (Si (x) 6 = #).
Optimal sequential decision strategy:
S∗ = arg min
S TS (1) subject to αS ≤ α and
βS ≤ β.SPRT (Sequential Probability Ratio Test)
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 9 / 14
n Basic and the most important method of sequential analysis [Wal47].
n Object x has a hidden state (class) y ∈ {−1, +1}; this state is not known and we shall
estimate it based on a sequence of measurements x1, . . . , xm.
n We know all joint probability distributions p(x1, . . . , xm |y = c).
n Let’s specify the hypotheses and their corresponding errors:
H0 : y = +1 α = P(S(x) = −1|y = +1)
H1 : y = −1 β = P(S(x) = +1|y = −1)
n Let’s define a likelihood ratio Rm:
Rm (x) = p(x1, . . . , xm |y = −1)
p(x1, . . . , xm |y = +1) (2)
n SPRT is the following sequential strategy:
S∗
m (x) =



−1, if Rm (x) ≥ A,
+1, if Rm (x) ≤ B,
#, if B < Rm (x) < A.
(3)
n The thresholds A and B are parameters of the test and are determined using the
required errors α and β.
n It can be shown that SPRT with optimal thresholds A∗ and B∗ is the optimal sequential test
in the sense of criterion (1).SPRT: Thresholds A and B
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 10 / 14
Upper bound for A∗:
Assume that SPRT decides S∗
m (x) = −1. Thus, the following must have been fulfilled:
Rm (x) = p(x1, . . . , xm |y = −1)
p(x1, . . . , xm |y = +1) ≥ A∗, or
p(x1, . . . , xm |y = −1) ≥ A∗ · p(x1, . . . , xm |y = +1).
Because the above holds for all sequences x such that S∗
m (x) = −1, for the sum over all
such x the following must hold:
∫
x:S∗
m (x)=−1
p(x1, . . . , xm |y = −1)dx ≥ A∗
∫
x:S∗
m (x)=−1
p(x1, . . . , xm |y = +1)dx
P(S∗
m (x) = −1|y = −1)
︸ ︷︷ ︸
1−β
≥ A∗ · P(S∗
m (x) = −1|y = +1)
︸ ︷︷ ︸
α
The upper bound A′ for A∗ is
1 − β
α = A′ ≥ A∗. (4)SPRT: Thresholds A and B
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 10 / 14
Upper bound for A∗:
1 − β
α = A′ ≥ A∗. (4)
Lower bound for B∗:
Assume that SPRT decides S∗
m (x) = +1. Thus, the following must have been fulfilled:
Rm (x) = p(x1, . . . , xm |y = −1)
p(x1, . . . , xm |y = +1) ≤ B∗, or
p(x1, . . . , xm |y = −1) ≤ B∗ · p(x1, . . . , xm |y = +1).
Because the above holds for all sequences x such that S∗
m (x) = +1, for the sum over all
such x the following must hold:
∫
x:S∗
m (x)=+1
p(x1, . . . , xm |y = −1)dx ≤ B∗
∫
x:S∗
m (x)=+1
p(x1, . . . , xm |y = +1)dx
P(S∗
m (x) = +1|y = −1)
︸ ︷︷ ︸
β
≤ B∗ · P(S∗
m (x) = +1|y = +1)
︸ ︷︷ ︸
1−α
The lower bound B′ for B∗ is
β
1 − α = B′ ≤ B∗. (5)SPRT: Final suggestions
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
• Sequential analysis
• Sequential decision
problem
• SPRT (Sequential
Probability Ratio Test)
• SPRT: Thresholds A
and B
• SPRT: Final
suggestions
Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 11 / 14
n Optimal thresholds A∗ and B∗ are not easy to find. In practice, Wald suggests to use
the bounds instead of the optimal values,
A = A′ = 1 − β
α B = B′ = β
1 − α
in other words, to use stricter thresholds than needed.
n It can be shown that by using such thresholds the error probabilities change to α′ and
β′ such that α′ + β′ ≤ α + β, i.e. only one kind of error my get worse, one kind of
error must get better.
Not solved by Wald:
1. Optimal ordering of individual measurements:
n In Wald’s applications, all measurements are i.i.d. (independent and identically
distributed), so that their ordering does not matter.
2. Estimation of the likelihood ratio from the training data:
n again, thanks to the i.i.d. assumption
p(x1, . . . , xm |y = c) =
m
∏
i=1
p(xi |y = c), (6)
so that Rm can be computed incrementally from 1D distributions.Conclusions
P. Poˇs´ık c© 2015 Artificial Intelligence – 12 / 14Summary
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
Conclusions
• Summary
• Reference
P. Poˇs´ık c© 2015 Artificial Intelligence – 13 / 14
Sequential analysis
n allows to decide the object class using a smaller number of measurements (features)
than other methods,
n has plenty of applications, especially where
n the time to decision must be minimized, and/or
n individual measurements are not cheap.
Applications:
n Sequential sampling plans: measurements are homogeneous, their ordering does not
matter.
n Clinical studies of drug effectivity: sequential testing by groups – if a measurement
on a sample of n people is sufficient, the study is terminated, otherwise another batch
of n people is used . . .
n Real-time face detection in photos and videos [ˇS09]:
n Individual measurements are differences in brightness in various places of the
picture.
n Time to decision is a critical factor, the classifier shall be usable in real-time!!!
n Measurements are not independent!!!
n AdaBoost: creates the ordering of measurements and estimates the likelihood
ratio.
n The face/no face/# decision is made by SPRT.
n The resulting combination: WaldBoost.
n . . .Reference
Motivation: Statistical
sampling plans
(Statistick´a pˇrej´ımka)
Sequential analysis
Conclusions
• Summary
• Reference
P. Poˇs´ık c© 2015 Artificial Intelligence – 14 / 14
[Fu68] K. S. Fu. Sequential methods in pattern recognition and machine learning (Mathematics
in science and engineering). Academic Press, 1st edition, 1968.
[ˇS09] Jan ˇSochman. Learning for Sequential Classification. PhD thesis, Czech Technical
University in Prague, Prague, Czech Republic, December 2009. Available online at
http://cyber.felk.cvut.cz/phd/completed/Sochman-PhD12 2009.pdf.
[Wal47] Abraham Wald. Sequential Analysis. Wiley, New York, 1947.
