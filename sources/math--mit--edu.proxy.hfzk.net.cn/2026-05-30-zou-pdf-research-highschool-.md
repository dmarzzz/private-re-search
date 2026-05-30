---
url: https://math--mit--edu.proxy.hfzk.net.cn/research/highschool/primes/materials/2023/Zou.pdf
title: Zou.pdf
fetched_at: 2026-05-30T16:49:26
content_hash: sha1:abdc8359ebbce0ee5892feb183f0856b659efd48
extractor: jina
---

Title: Zou.pdf

URL Source: https://math--mit--edu.proxy.hfzk.net.cn/research/highschool/primes/materials/2023/Zou.pdf

Published Time: Tue, 23 Jan 2024 19:47:44 GMT

Number of Pages: 8

Markdown Content:
# Intersection Attacks in Non-Uniform Setting 

## Dongchen Zou under the instruction of Simon Langowski January 2024 

Abstract 

Recently consumer demand for privacy has spurred growth in private messaging systems. However, formally, privacy degrades in such systems when users log on and off: this change of status exposes the ongoing conversations. Intersection attacks (also known as statistical disclosure attacks) use messaging patterns or liveness information to reconstruct relationships, deanonymize users, and track user behaviors. Prior attacks assume users have an underlying uniform communication pattern for simplicity, leaving the question open of how effective such attacks would be in a non-uniform real world. We observe that effects like clustering in real social graphs and correlation between repeated conversations change the behavior and potential of such attacks. This paper provides a new approach that can consider some of these additional factors by constructing a polynomial to determine the social graph. We provide an analysis of the performance, accuracy, and convergence rate of our attack. Our attack applies to many existing anonymous communication systems, and our technique can be extended to incorporate additional factors. 

# 1 Introduction 

Anonymity ensures that two parties can converse in a network without leaking information to the network provider or third parties. Most research papers that look into anonymity base themselves on the setting that David Chaum proposed: the mix network[1]. It is a network system that hides the correspondence between the message sender and receiver and attains some degree of privacy. Efforts to take advantage of repeating patterns in the mix network to uncover user relationships and degrade anonymity are called intersection attacks. An example of the aforementioned repeating pattern that the adversary can exploit is the online status. To increase user activity, many platforms willingly display whether users are online, with a green dot, for example. Therefore, the adversary can easily know when a person is online or offline. This information, on its own, might not be a security issue. But when the eavesdropper integrates the activity patterns of many people, they can learn about underlying user relationships. For example, seeing person A frequently online with person B strongly implies that they are friends. Previous papers developed different attacks to utilize this easy-to-obtain information. They use mathematical tools like Bayesian inference [2] and maximum likelihood estimation [3]. However, they all worked with a uniform mix in which every user is identical. This assumption of uniformity is not essentially true in real-world social media where everyone is so different (some are talkative, some are quiet, some like talking about movies, and some like to talk in the middle of the day) and understates the difficulty of extracting information from the patterns. We aim to provide a variant of mix network that is closer to real-life social media while maintaining the original properties. We then provide an intersection attack that works on the variant. Our contributions are 1• Our model of social media better describes real-world users by considering factors like clus-tering (people tend to talk in groups) and correlation between repeated conversations (people tend to keep talking if they have talked before). 

• Our innovative approach can consider these factors by constructing a special polynomial. By solving for the root of the polynomial, we can learn about the social network and its user behaviors. This paper is structured as follows. 1. Setting: The variant of the mix and how it is generated 2. Attack: The description and implementation of the intersection attack 3. Analysis: Analysis of the validity and performance of the attack 4. Result: The output of the attack and comparison to theoretical analysis. 

# 2 Setting 

## 2.1 General Mix Network 

In the mix that David Chaum proposed, there is a chain of proxies that takes in messages from multiple senders, shuffles them, and sends them back out in random order to the next destination (possibly another mix node) until they reach their final destinations: the intended recipients. This process of sending messages, shuffling, and reaching the recipients happens in one epoch, a time period where the messages are sent through the mix and anonymized. Although this is only a simplified description, it is apparent that, for each epoch, the eavesdropper only gets to see who sent messages but doesn’t know to whom the messages go. If we assume that every person sends messages whenever they are online, the adversary only knows who is online for each epoch. Let’s there be N users in the mix network, and for any epoch, the probability that user i and j

talk with each other is denoted as 0 ≤ A[i, j] ≤ 1. As we can see, the N × N matrix A perfectly describes the mix network for this specific problem, so we will only refer to A in the future. The information that the adversary has for each epoch is simply a list of all people who are online. Most papers work with a uniform mix network, which includes uniform A and uniform epochs. We will introduce and analyze both the uniform case and our variant in the following subsections. 

## 2.2 Previous Uniform Mix Networks 

When the mix network is uniform, each entry of A can only be two possible values: 0 or some fixed constant. In other words, two users either talk with a uniform probability or they don’t. In addition to a uniform A, the epochs are also uniform, meaning that it’s simply a coin flip of all 

A[i, j] and if the coin flips to head, user i and j are put into the list. This uniform mix network is easy to analyze but very different from the real world. In the real-world social media, people are different and they prefer to talk to some people more than others. The uniform epoch generation also ignores the tendency of people to continue their conversations. For example, if user i and j talk in the previous epoch, the probability that they talk for the current epoch should be larger than A[i, j]. Such a uniform network oversimplifies the real world and understates the complexity of this problem. 22.3 Our Non-Uniform Variant 

We offer a variant of the mix network that should model the real world better. We observe that it is the common interests that initiate the conversation. That is, it is more likely for someone to talk with someone with more common interests and vice versa. Let Int be a finite set of all the interests. Each user in our variant has a list of interests Int k ⊆ Int and A[i, j] is directly proportional to |Int i ∩ Int j |. The following is the implementation. As we discussed in the previous subsection, people tend to keep talking. If user i and j talked in the previous epoch, the probability that they talk during this epoch should be greater than 

A[i, j]. Therefore, we introduce the idea of correlation. We have a correlation factor 0 ≤ γ ≤ 1. If user i and j talked in the previous epoch, the probability that they talk for the current epoch will be adjusted to (1 − γ)A[i, j] + γ. If γ = 0, the new probability will be A[i, j]; if γ = 1, the new probability will be 1. 

# 3 Intersection Attack 

The adversary wants to find out A, the matrix that describes the mix network, because A tells him who is friends with whom (the larger A[i, j], the closer user i and user j are), which allows him to break the anonymization of the mix. After getting t epochs of information, they can compile an array Count t in which Count t[i, j] is the number of times where user i and user j both appear online (note that this is not necessarily talking to each other because both of them can be online talking to different people) in the first t

epochs. They will use this information to put out a guess, denoted by A′t. This is their guess for how the mix network looks, and they want to get it close to A.

## 3.1 Description of the Attack 

The attack will revolve around one question: what is the probability that user i and j appear online together? Empirically, the adversary observes the probability to be Count t[i,j] 

> t

. They can compute this proba-bility with A′ as well. Note that user i and user j appearing online together does not necessarily imply that they are talking during that epoch. This can also occur when i talks to someone not j

and j talks to someone not i. The probability i is talking to someone not j can be expressed via 

Pr [i talking to someone not j] = 1 − Y 

> k̸=i

(1 − A′[k, j ]) because Q 

> k̸=i

(1 −A′[k, j ]) is the probability that i is not talking to anyone and 1 −Q 

> k̸=i

(1 −A′[k, j ]) is then the probability that i is talking to at least one person who is not j. We can now write out this probability, denoted by F[i,j](A′′ ). If user i and user j are taking directly with each other (probability A′[i, j]), they definitely appear online together; if user i and user j are not talking directly with each other (probability 1 − A′[i, j]), i is talking to someone not j (probability 1 − Q 

> k̸=i

(1 − A′[k, j ]), and j is talking to some not i (probability 1 − Q  

> k̸=j

(1 − A′[i, k ])), they can 3also appear online together. Hence, 

F[i,j](A′) = A′[i, j] + (1 − A′[i, j]) 

1 − Y 

> k̸=i

(1 − A′[k, j ]) 

1 − Y 

> k̸=j

(1 − A′[i, k ]) 



The adversary wants this theoretical probability F[i,j](A′) to match the empirical probability Count t[i,j]

> t

for every [ i, j] because this tells them that his guess A′ is matching the observations. Thus, they will try to minimize the difference between the two probabilities. Mathematically, the adversary is trying to minimize the polynomial 

G(A′) = X

> [i,j]



F[i,j](A′) − Count [i, j]

t

2

and the adversary tries to find the A′ that minimizes G(A′). Since G(A′) is nonnegative, they are finding the root of G.

## 3.2 Validity 

It is expected that lim 

> t→∞

Count [i, j]

t = F[i,j](A)This is because of the law of large numbers, which states that the empirical probability of success in a series of Bernoulli trials, which is Count [i,j] 

> t

, will converge to the theoretical probability F[i,j](A′). This means that lim  

> t→∞

G(A) = 0 However, how do we know that there isn’t another B̸ = A such that lim  

> t→∞

G(A) = lim  

> t→∞

G(B) = 0 ? In other words, how do we know that A is the only solution to G = 0 and minimizing G will indeed give us the right A, instead of just some random B that accidentally satisfies lim t→∞ G(B) = 0? We observe in practice that F is sufficiently smooth such that there is a large region that converges to the true A for large enough t. This is because F is a polynomial in terms of the entries of A, and so there is a region that will be close (in the uniform continuity sense) to each 0. Mathematically speaking, we have observed that a significant portion of the hypercube region [0 , 1] N will be covered by the region converging to A for large t.We have shown that lim t→∞ G(A) = 0 for A and only for A.

# 4 Analysis 

In the previous section, we stated the attack and showed that the adversary’s guess A′ will even-tually converge to A. In this section, we offer an analysis of how fast the convergence happens. In our setting of the mix network, the epochs are not independent because of the correlation. To make the analysis easier, we will assume they are independent. We will later see that this is a reasonable assumption. If the epochs are independent, then Count t[i, j] is approximately binomial 4– with probability F[i,j](A) and t flips. We have that 

E [Count t[i, j]] = E Binomial (t, F[i,j](A))  = t · F[i,j](A)and hence 

E

 Count t[i, j]

t



= F[i,j](A)The variance of the binomial distribution is 

Var [Binomial (t, p[i, j])] = t · F[i,j](A) · (1 − F[i,j](A)) Writing out the same logic with standard deviation, we have 

StdDev  Binomial (t, F[i,j](A))  =

q

t · F[i,j](A) · (1 − F[i,j](A)) and 

StdDev 

 Binomial (t, F[i,j](A)) 

t



= 1

t

q

t · F[i,j](A) · (1 − F[i,j](A)) = 

pF[i,j](A) · (1 − F[i,j](A)) 

√t

Therefore, the standard deviation of Count t[i,j] 

> t

is directly proportional to 1√t because F[i,j](A) is a constant. The standard deviation measures how much variation the random variable will have about its mean. This variation shrinks proportionally to 1√t so we can say that the difference between the guess A′ and the real A shrinks with speed 1√t

We can prove that this is indeed close to the best we can do using Central Limit Theorem. Let C

be a random variable representing the observations with Ci the sample for epoch i. In other words, 

{C1, C2, . . . , Ct} are independent observations of an unknown distribution Dist (μ = F(A), σ 2). We are looking at the sample average which is 



¯C = C1 + C2 + . . . + Ct

t



→ F(A) when t → ∞ 

The central limit theorem states that ( ¯C − F(A)) ∼ N (0 , σ 2)

√t

It essentially says that ¯C − F(A) converges to 0 at the speed of 1√t which proves that the attack is optimal asymptotically within a constant factor. If the adversary gets two times as many epochs, they should expect to be better by a factor of  

> 1√2

≈ 0.707 so they improve by 29%. 

## 4.1 Experiment 

We will measure the accuracy of A′ with the L-2 norm 

dt =

sX

> [i,j]

(A[i, j] − A′t[i, j]) 2

5where A′t is the best guess after integrating information for t epochs. The graphs of dt versus t for different correlation factors γ are shown on the bottom. The blue-purple line is the actual graph and the orange line, which graphs our expectations, is 

y = d1

√t

The first two graphs are for γ = 0 .001 and γ = 0 .002. As we can see, a slight correlation does not perturb the result. For both cases, the two lines match with each other despite initial perturbation. 

Figure 1: γ = 0 .001 

Figure 2: γ = 0 .002 However, when γ = 0 .1, the two lines still basically match, but the purple lines stay on top of 6the orange line. This is because a decent degree of correlation hides information from the adversary as he can’t differentiate whether user i and j are talking because A[i, j] is big or they were simply talking the previous epoch. 

Figure 3: γ = 0 .1Finally, the attack just completely breaks down when γ = 0 .8 as the adversary gets overwhelmed by repeating information. The programmed result strongly implies that our analysis is correct for 

Figure 4: γ = 0 .8small γ values. 

# 5 Acknowledgement 

Finally, I would like to thank (the list is not ordered) 7• my mentor Simon Langowski for his guidance on this topic. This project would not be possible without him. 

• my family for being by my side. 

• my friends like Celine, Michael, and Sufian (ordered alphabetically), to name a few, for their support. 

• games like Baldur’s Gate 3, Civ 6, GTA V (also not ordered) for they give me happiness 

• the MIT PRIMES program for offering such a wonderful opportunity 

# 6 Reference 

[1] Chaum, David L. ”Untraceable electronic mail, return addresses, and digital pseudonyms.” Communications of the ACM 24.2 (1981): 84-90. [2] Danezis, George, and Carmela Troncoso. ”Vida: How to use bayesian inference to de-anonymize persistent communications.” International Symposium on Privacy Enhancing Technologies Sym-posium. Berlin, Heidelberg: Springer Berlin Heidelberg, 2009. [3] P´ erez-Gonz´ alez, Fernando, and Carmela Troncoso. ”Understanding statistical disclosure: Aleast squares approach.” International Symposium on Privacy Enhancing Technologies Sympo-sium. Berlin, Heidelberg: Springer Berlin Heidelberg, 2012. 8
