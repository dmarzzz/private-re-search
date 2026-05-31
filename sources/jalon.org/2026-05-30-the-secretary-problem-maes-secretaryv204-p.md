---
url: http://jalon.org/MAES/SECRETARYv204.pdf
title: The Secretary Problem
fetched_at: 2026-05-30T20:23:42
content_hash: sha1:e7ea0cbd0787849c177df534141096e82d7d058e
extractor: jina
---

Title: The Secretary Problem

URL Source: http://jalon.org/MAES/SECRETARYv204.pdf

Published Time: Mon, 19 Mar 2018 23:19:17 GMT

Number of Pages: 24

Markdown Content:
Outline Classical Problem Variants 

## The Secretary Problem 

David Jalon 

http: // jalon. org 

David Jalon The Secretary Problem Outline Classical Problem Variants 

## Outline 

1 Classical Secretary Problem 

Introduction 

Case of three candidates 

Generalization to n >3

2 Variants and other similar problems: 

Unknown number of candidates. 

Cardinal payoff variant 

Choosing more than one candidate   

> David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

## Statement of the classical problem 

There is only one vacancy available. 

The candidates can be ordered from worst to best with no ties but they arrive in random order. 

We can only determine the relative ranks of the candidates as they arrive (We cannot tell their absolute values). 

The goal is to choose the very best candidate, no one else will do. 

Once an candidate is rejected, she is gone forever and cannot be recalled. 

The total number of candidates n is known beforehand.  

> David Jalon The Secretary Problem

Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

## Let’s look into the particular case n = 3 

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

Probability of success versus n (using the optimal threshold kn): 

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

Given n = 100, probability of success depending on the threshold k:

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

1x is the number of candidates, n the threshold. 

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

For an arbitrary threshold k, the probability of choosing the best candidate is: 

P(k) = 

> n

∑

> j=1

P (candidate j is the best ∩ candidate j is selected) =

> n

∑

> j=1

P (candidate j is selected |candidate j is the best) × P (candidate j is the best) =

[k−1

∑

> j=1

0 × 1

n

]

++

[ n∑

> j=k

P

( the best of the firsts j − 1 candidates is in the firsts k − 1 candidates 

∣∣∣ candidate j is the best 

)

× 1

n

]

=

> n

∑

> j=k

k − 1

j − 1 × 1

n = k − 1

n

> n

∑

> j=k

1

j − 1 .  

> David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

P(k) = k−1

n

∑nj=k 1

j−1

Simply letting n tend to infinity, writing x as the limit of k/n,denoting j/n as t and 1 /n as dt , the sum above can be approximated by the integral: 

P(x ) = x ∫ 1

x 1

t dt = −x log( x ).

Deriving P(x ) with respect to x , positioning it at 0, and solving for 

x , we find that the optimal x is equal to e−1. Thus, the optimal threshold tends to n/e as n increases, and the best candidate is selected with a probability of e−1. 

> David Jalon The Secretary Problem

Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

The black dots represent ( n, kn): 

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Introduction Case of three candidates Generalization to n >3

David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate 

## Number of candidates n not known. 

Unknown number of candidates. 

If the value of n is not known beforehand. One way to remedy this is to assume that the number of candidates N is a random variable with a known distribution P(N = k)k=1 ,2,... (Presman and Sonin, 1972). 

The essence of the model is based on that the problems in the real world appear in real time and it is easier to estimate times when events happen (arrival of candidates) than estimate the distribution of the specific number of events that will happen in total.  

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

The model 

A candidate must be selected in a time interval [0 , T ] from an unknown number of valued candidates. The aim is to maximize the probability of selecting the best. Let’s assume that all the candidates arrive independently with the same arrival time density 

f in [0 , T ], and let F be the corresponding distribution function of the arrival time: 

F (t) = ∫ t

0 f (s)ds , 0 ≤ t ≤ T . 

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

The 1/e-law (1984) 

Let τ be such that F (τ ) = e−1. Consider the strategy to wait and observe all applicants up to time τ and then to select, if possible, the first candidate after time τ which is better than all preceding ones. Then this strategy, called 1/e-strategy, has the following properties:  

> 1

for all N, there is a success probability of at least e−1 

> 2

is the unique strategy guaranteeing this lower success probability bound e−1, and the bound is optimal.  

> 3

selects, if there is at least one applicant, none at all with probability exactly e−1 

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

## Cardinal pay-off variant 

In this version the recruiter’s pay-off is given by the true value of the selected applicant.The interviewer’s objective is to maximize the expected value of the selected applicant. Just as in the classical problem, the optimal policy is given by a threshold, which for this problem we will denote by c, at which the interviewer should begin accepting candidates. Bearden (2006) showed that c is: 

c = b√nc or c = d√ne (In fact, whichever is closest)  

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

## Number of secretaries to choose greater than one 

For another variant, the interviewer is not hiring just one secretary but rather is, say, admitting a class of students from an applicant pool. Under the assumption that success is achieved if and only if all the selected candidates are superior to all of the not-selected candidates, n is even and the desire is to select exactly half the candidates, in Vanderbei 1980 it was shown that the optimal strategy yields a success probability of 1

n/2+1  

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

## Experimental studies 

Experimental psychologists and economists have studied the decision behavior of actual people in secretary problem situations. In large part, this work has shown that people tend to stop searching too soon. This may be explained, at least in part, by the cost of evaluating candidates. In real world settings, this might suggest that people do not search enough whenever they are faced with problems where the decision alternatives are encountered sequentially.  

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

How many people should we get to know before we choose our definitive partner? 

Professor of the University of Sidney, Clio Creswell in her book “Mathematics and Sex”, asks: How many people should we know, at least, before we choose our definitive partner? The answer, as she says, is 12. That is, the best strategy is to choose as partner the next person that is “better” than those 12 candidates.  

> David Jalon The Secretary Problem Outline Classical Problem Variants Unknown number of candidates. Cardinal payoff variant Choosing more than one candidate

## Basic Bibliography 

J.N. Bearden, A new secretary problem with rank-based selection and cardinal payoffs , Journal of Mathematical Psychology 50 (2006) 58–59. 

T. Grams, Lieses Verehrer oder das ”Sekret¨ arinnen-Problem“ ,Eine Aufgabe zur stochastischen Simulation und deren analytische L¨ osung, revisado (Dec, 2008), disponible en 

http://www2.hs-fulda.de/˜grams/ .

K. Siegrist, The Secretary Problem ,

http://www.math.uah.edu/stat/urn/Secretary.html .

N. J. A. Sloane, Sequences A007676/M0869, A007677/M2343, A054404 and A068985 , en ”The On-Line Encyclopedia of Integer Sequences.”
