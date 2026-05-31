---
url: https://jamesmccaffreyblog.com/2016/09/07/the-secretary-problem-2
title: The Secretary Problem - James D. McCaffrey
fetched_at: 2026-05-30T20:23:41
content_hash: sha1:0e1ff0ff2db90f6e683a0fd7e06f50ad06a7da5c
extractor: trafilatura
---

I wrote an article titled “The Secretary Problem” in the September 2016 issue of Microsoft MSDN Magazine. See [https://msdn.microsoft.com/magazine/mt763238](https://msdn.microsoft.com/magazine/mt763238).

Suppose you want to hire a secretary. You have a pool of 100 applicants and you interview one applicant per day. After each interview, you must immediately decide to hire the current applicant or not. If you don’t hire an applicant, you can’t call her back. You don’t have time to interview all 100 candidates, so what algorithm can you use to maximize your chance of selecting the best applicant?

One algorithm is called the 1 / e rule. In words, the 1/e rule is, “Skip over the first N / e applicants, but track the best Candidate (person with highest rating seen to date). Then hire the first Candidate who appears. If no new Candidate appears after the first N / e applicants have been skipped, then fail and hire nobody.”

Here’s an example:

Applicant 0 has a rating of 5.0 and will be interviewed first; applicant 1 has a rating of 2.0 and will be interviewed second; and so on. The best applicant is person 8 with a rating of 9.0.

The number of applicants to skip is N / e = 10 / 2.71828 = 3.6788, which is 3 if truncated, and 4 if rounded. As it turns out, as long as N is not very small it makes very little difference whether you truncate or round. Suppose you truncate to 3.

You interview applicant 0 and find she has a rating of 5.0, so she becomes the Candidate because she has the best rating seen (so far, the only rating seen). Next, you interview applicant 1 and find they have a rating of 2.0 so they don’t become the Candidate because their rating isn’t better than 5.0. You interview applicant 2 and find a rating of 7.0 and they become the new Candidate. At this point you’ve interviewed the first N / e = 3 applicants so you’re now ready to hire the first new Candidate who appears.

You interview applicant 3 and find a rating of 1.0 so they don’t become the Candidate. You interview applicant 5 and find a rating of 0.0 (Ouch! I’ve worked with this person) so they’re not the Candidate, either. You interview applicant 6 and find a rating of 8.0. This is the highest rating seen so they become the Candidate, and because you’re past the first N / e applicants, you immediately hire applicant 6.

Notice that the 1/e algorithm did not find the best applicant in this example, but did find the second best applicant. If you use the 1/e algorithm for the Secretary Problem, the probability that you’ll select the best applicant from N applicants is approximately 1 / e = 1 / 2.71828 = 0.3679.

You must be logged in to post a comment.
