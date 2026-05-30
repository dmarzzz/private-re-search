---
url: https://en.wikipedia.org/wiki/Sequential_analysis
title: Sequential analysis - Wikipedia
fetched_at: 2026-05-30T19:09:51
content_hash: sha1:04f16455b1d76ec4013f80c25489606e179b2684
extractor: trafilatura
---

# Sequential analysis

In [statistics](https://en.wikipedia.org/wiki/Statistics), **sequential analysis** or **sequential hypothesis testing** is [statistical analysis](https://en.wikipedia.org/wiki/Statistical_analysis) where the [sample size](https://en.wikipedia.org/wiki/Sample_size) is not fixed in advance. Instead data is evaluated as it is collected, and further sampling is stopped in accordance with a pre-defined [stopping rule](https://en.wikipedia.org/wiki/Stopping_rule) as soon as significant results are observed. Thus a conclusion may sometimes be reached at a much earlier stage than would be possible with more classical [hypothesis testing](https://en.wikipedia.org/wiki/Hypothesis_testing) or [estimation](https://en.wikipedia.org/wiki/Estimation), at consequently lower financial and/or human cost.

## History

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=1)]

The method of sequential analysis is first attributed to [Abraham Wald](https://en.wikipedia.org/wiki/Abraham_Wald) [1] with

[Jacob Wolfowitz](https://en.wikipedia.org/wiki/Jacob_Wolfowitz),

[W. Allen Wallis](https://en.wikipedia.org/wiki/W._Allen_Wallis), and

[Milton Friedman](https://en.wikipedia.org/wiki/Milton_Friedman)


[[2]](https://en.wikipedia.org#cite_note-2)while at

[[3]](https://en.wikipedia.org#cite_note-3)[Columbia University's](https://en.wikipedia.org/wiki/Columbia_University)

[Statistical Research Group](https://en.wikipedia.org/wiki/Applied_Mathematics_Panel)as a tool for more efficient industrial

[quality control](https://en.wikipedia.org/wiki/Quality_control)during

[World War II](https://en.wikipedia.org/wiki/World_War_II). Its value to the war effort was immediately recognised, and led to its receiving a "restricted"

[classification](https://en.wikipedia.org/wiki/Classified_information).

At the same time,

[[4]](https://en.wikipedia.org#cite_note-4)[George Barnard](https://en.wikipedia.org/wiki/George_Alfred_Barnard)led a group working on optimal stopping in Great Britain. Another early contribution to the method was made by

[K.J. Arrow](https://en.wikipedia.org/wiki/Kenneth_Arrow)with

[D. Blackwell](https://en.wikipedia.org/wiki/David_Blackwell)and

[M.A. Girshick](https://en.wikipedia.org/wiki/Meyer_Abraham_Girshick).


[[5]](https://en.wikipedia.org#cite_note-5)A similar approach was independently developed from first principles at about the same time by [Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing), as part of the [Banburismus](https://en.wikipedia.org/wiki/Banburismus) technique used at [Bletchley Park](https://en.wikipedia.org/wiki/Bletchley_Park), to test hypotheses about whether different messages coded by German [Enigma](https://en.wikipedia.org/wiki/Enigma_machine) machines should be connected and analysed together. This work remained secret until the early 1980s.[[6]](https://en.wikipedia.org#cite_note-6)

[Peter Armitage](https://en.wikipedia.org/wiki/Peter_Armitage_(statistician)) introduced the use of sequential analysis in medical research, especially in the area of clinical trials. Sequential methods became increasingly popular in medicine following [Stuart Pocock](https://en.wikipedia.org/wiki/Stuart_Pocock)'s work that provided clear recommendations on how to control [Type 1 error](https://en.wikipedia.org/wiki/Type_1_error) rates in sequential designs.[[7]](https://en.wikipedia.org#cite_note-7)

## Alpha spending functions

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=2)]

When researchers repeatedly analyze data as more observations are added, the probability of a [Type 1 error](https://en.wikipedia.org/wiki/Type_1_error) increases. Therefore, it is important to adjust the alpha level at each interim analysis, such that the overall Type 1 error rate remains at the desired level. This is conceptually similar to using the [Bonferroni correction](https://en.wikipedia.org/wiki/Bonferroni_correction), but because the repeated looks at the data are dependent, more efficient corrections for the alpha level can be used. Among the earliest proposals is the [Pocock boundary](https://en.wikipedia.org/wiki/Pocock_boundary). Alternative ways to control the Type 1 error rate exist, such as the [Haybittle–Peto](https://en.wikipedia.org/wiki/Haybittle%E2%80%93Peto_boundary) bounds, and additional work on determining the boundaries for interim analyses has been done by [O'Brien & Fleming](https://en.wikipedia.org/wiki/O%27Brien%E2%80%93Fleming_boundary) [8] and Wang & Tsiatis.


[[9]](https://en.wikipedia.org#cite_note-9)A limitation of corrections such as the Pocock boundary is that the number of looks at the data must be determined before the data is collected, and that the looks at the data should be equally spaced (e.g., after 50, 100, 150, and 200 patients). The alpha spending function approach developed by Demets & Lan [10] does not have these restrictions, and depending on the parameters chosen for the spending function, can be very similar to Pocock boundaries or the corrections proposed by O'Brien and Fleming. Another approach that has no such restrictions at all is based on

[e-values and e-processes](https://en.wikipedia.org/wiki/E-values).

## Applications of sequential analysis

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=3)]

### Clinical trials

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=4)]

In a randomized trial with two treatment groups, group sequential testing may for example be conducted in the following manner: After n subjects in each group are available an interim analysis is conducted. A statistical test is performed to compare the two groups and if the [null hypothesis](https://en.wikipedia.org/wiki/Null_hypothesis) is rejected the trial is terminated; otherwise, the trial continues, another n subjects per group are recruited, and the statistical test is performed again, including all subjects. If the null is rejected, the trial is terminated, and otherwise it continues with periodic evaluations until a maximum number of interim analyses have been performed, at which point the last statistical test is conducted and the trial is discontinued.[[11]](https://en.wikipedia.org#cite_note-11)

### Other applications

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=5)]

Sequential analysis also has a connection to the problem of * gambler's ruin* that has been studied by, among others,

[Huygens](https://en.wikipedia.org/wiki/Christiaan_Huygens)in 1657.


[[12]](https://en.wikipedia.org#cite_note-12)[Step detection](https://en.wikipedia.org/wiki/Step_detection) is the process of finding abrupt changes in the mean level of a [time series](https://en.wikipedia.org/wiki/Time_series) or signal. It is usually considered as a special kind of statistical method known as [change point detection](https://en.wikipedia.org/wiki/Change_detection). Often, the step is small and the time series is corrupted by some kind of noise, and this makes the problem challenging because the step may be hidden by the noise. Therefore, statistical and/or signal processing algorithms are often required. When the algorithms are run *online* as the data is coming in, especially with the aim of producing an alert, this is an application of sequential analysis.

## Bias

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=6)]

Trials that are terminated early because they reject the null hypothesis typically overestimate the true effect size. [13] This is because in small samples, only large effect size estimates will lead to a significant effect, and the subsequent termination of a trial. Methods to correct effect size estimates in single trials have been proposed.

Note that this bias is mainly problematic when interpreting single studies. In meta-analyses, overestimated effect sizes due to early stopping are balanced by underestimation in trials that stop late, leading Schou & Marschner to conclude that "early stopping of clinical trials is not a substantive source of bias in meta-analyses".

[[14]](https://en.wikipedia.org#cite_note-14)

[[15]](https://en.wikipedia.org#cite_note-15)The meaning of p-values in sequential analyses also changes, because when using sequential analyses, more than one analysis is performed, and the typical definition of a p-value as the data “at least as extreme” as is observed needs to be redefined. One solution is to order the p-values of a series of sequential tests based on the time of stopping and how high the test statistic was at a given look, which is known as stagewise ordering, [13] first proposed by

[Armitage](https://en.wikipedia.org/wiki/Peter_Armitage_(statistician)).

## See also

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=7)]

## Notes

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=8)]

[^](https://en.wikipedia.org#cite_ref-1)[Wald, Abraham](https://en.wikipedia.org/wiki/Abraham_Wald)(June 1945).["Sequential Tests of Statistical Hypotheses"](https://doi.org/10.1214%2Faoms%2F1177731118).*The Annals of Mathematical Statistics*.**16**(2): 117–186.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1214/aoms/1177731118](https://doi.org/10.1214%2Faoms%2F1177731118).[JSTOR](https://en.wikipedia.org/wiki/JSTOR_(identifier))[2235829](https://www.jstor.org/stable/2235829).[^](https://en.wikipedia.org#cite_ref-2)[Berger, James](https://en.wikipedia.org/wiki/James_Berger_(statistician))(2008).["Sequential Analysis"](http://www.dictionaryofeconomics.com/article?id=pde2008_S000098).*The New Palgrave Dictionary of Economics*(2nd ed.). pp. 438–439.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1057/9780230226203.1513](https://doi.org/10.1057%2F9780230226203.1513).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-333-78676-5](https://en.wikipedia.org/wiki/Special:BookSources/978-0-333-78676-5).[^](https://en.wikipedia.org#cite_ref-3)["The Statistical Research Group, 1942–1945"](https://gwern.net/doc/statistics/decision/1980-wallis.pdf), Wallis 1980 (doi:10.1080/01621459.1980.10477469)Weigl, Hans Günter (2013).[^](https://en.wikipedia.org#cite_ref-4)(PDF) (Doctoral thesis). University of Hamburg.*Abraham Wald : a statistician as a key figure for modern econometrics*[^](https://en.wikipedia.org#cite_ref-5)[Kenneth J. Arrow](https://en.wikipedia.org/wiki/Kenneth_Arrow),[David Blackwell](https://en.wikipedia.org/wiki/David_Blackwell)and M.A. Girshick (1949). "Bayes and minimax solutions of sequential decision problems".*Econometrica*.**17**(3/4): 213–244.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.2307/1905525](https://doi.org/10.2307%2F1905525).[JSTOR](https://en.wikipedia.org/wiki/JSTOR_(identifier))[1905525](https://www.jstor.org/stable/1905525).[^](https://en.wikipedia.org#cite_ref-6)[Randell, Brian](https://en.wikipedia.org/wiki/Brian_Randell)(1980), "The Colossus",*A History of Computing in the Twentieth Century*, p. 30Jennison, Christopher; Turnbull, Bruce W. (1999-09-15).[^](https://en.wikipedia.org#cite_ref-7)*Group Sequential Methods with Applications to Clinical Trials*. Boca Raton, Fla.: Chapman and Hall/CRC.[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-8493-0316-6](https://en.wikipedia.org/wiki/Special:BookSources/978-0-8493-0316-6).O'Brien, Peter C.; Fleming, Thomas R. (1979-01-01). "A Multiple Testing Procedure for Clinical Trials".[^](https://en.wikipedia.org#cite_ref-8)*Biometrics*.**35**(3): 549–556.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.2307/2530245](https://doi.org/10.2307%2F2530245).[JSTOR](https://en.wikipedia.org/wiki/JSTOR_(identifier))[2530245](https://www.jstor.org/stable/2530245).[PMID](https://en.wikipedia.org/wiki/PMID_(identifier))[497341](https://pubmed.ncbi.nlm.nih.gov/497341).Wang, Samuel K.; Tsiatis, Anastasios A. (1987-01-01). "Approximately Optimal One-Parameter Boundaries for Group Sequential Trials".[^](https://en.wikipedia.org#cite_ref-9)*Biometrics*.**43**(1): 193–199.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.2307/2531959](https://doi.org/10.2307%2F2531959).[JSTOR](https://en.wikipedia.org/wiki/JSTOR_(identifier))[2531959](https://www.jstor.org/stable/2531959).[PMID](https://en.wikipedia.org/wiki/PMID_(identifier))[3567304](https://pubmed.ncbi.nlm.nih.gov/3567304).[^](https://en.wikipedia.org#cite_ref-10)[Demets, David L.](https://en.wikipedia.org/wiki/David_DeMets); Lan, K. K. Gordon (1994-07-15). "Interim analysis: The alpha spending function approach".*Statistics in Medicine*.**13**(13–14): 1341–1352.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1002/sim.4780131308](https://doi.org/10.1002%2Fsim.4780131308).[ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier))[1097-0258](https://search.worldcat.org/issn/1097-0258).[PMID](https://en.wikipedia.org/wiki/PMID_(identifier))[7973215](https://pubmed.ncbi.nlm.nih.gov/7973215).[^](https://en.wikipedia.org#cite_ref-11)[Korosteleva, Olga](https://en.wikipedia.org/wiki/Olga_Korosteleva)(2008).*Clinical Statistics: Introducing Clinical Trials, Survival Analysis, and Longitudinal Data Analysis*(First ed.).[Jones and Bartlett Publishers](https://en.wikipedia.org/wiki/Jones_and_Bartlett_Publishers).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-7637-5850-9](https://en.wikipedia.org/wiki/Special:BookSources/978-0-7637-5850-9).Ghosh, B. K.;[^](https://en.wikipedia.org#cite_ref-12)[Sen, P. K.](https://en.wikipedia.org/wiki/Pranab_K._Sen)(1991).*Handbook of Sequential Analysis*. New York:[Marcel Dekker](https://en.wikipedia.org/wiki/Marcel_Dekker).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[9780824784089](https://en.wikipedia.org/wiki/Special:BookSources/9780824784089).[][page needed](https://en.wikipedia.org/wiki/Wikipedia:Citing_sources)- ^
**a**Proschan, Michael A.; Lan, K. K. Gordan;**b**[Wittes, Janet Turk](https://en.wikipedia.org/wiki/Janet_Wittes)(2006).*Statistical monitoring of clinical trials : a unified approach*. Springer.[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[9780387300597](https://en.wikipedia.org/wiki/Special:BookSources/9780387300597).[OCLC](https://en.wikipedia.org/wiki/OCLC_(identifier))[553888945](https://search.worldcat.org/oclc/553888945). Liu, A.; Hall, W. J. (1999-03-01).[^](https://en.wikipedia.org#cite_ref-14)["Unbiased estimation following a group sequential test"](https://academic.oup.com/biomet/article-abstract/86/1/71/255103/Unbiased-estimation-following-a-group-sequential).*Biometrika*.**86**(1): 71–78.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1093/biomet/86.1.71](https://doi.org/10.1093%2Fbiomet%2F86.1.71).[ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier))[0006-3444](https://search.worldcat.org/issn/0006-3444).Schou, I. Manjula; Marschner, Ian C. (2013-12-10). "Meta-analysis of clinical trials with early stopping: an investigation of potential bias".[^](https://en.wikipedia.org#cite_ref-15)*Statistics in Medicine*.**32**(28): 4859–4874.[doi](https://en.wikipedia.org/wiki/Doi_(identifier)):[10.1002/sim.5893](https://doi.org/10.1002%2Fsim.5893).[ISSN](https://en.wikipedia.org/wiki/ISSN_(identifier))[1097-0258](https://search.worldcat.org/issn/1097-0258).[PMID](https://en.wikipedia.org/wiki/PMID_(identifier))[23824994](https://pubmed.ncbi.nlm.nih.gov/23824994).[S2CID](https://en.wikipedia.org/wiki/S2CID_(identifier))[22428591](https://api.semanticscholar.org/CorpusID:22428591).

## References

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=9)]

[Wald, Abraham](https://en.wikipedia.org/wiki/Abraham_Wald)(1947).. New York:*Sequential Analysis*[John Wiley and Sons](https://en.wikipedia.org/wiki/John_Wiley_and_Sons).- Bartroff, J., Lai T.L., and Shih, M.-C. (2013) Sequential Experimentation in Clinical Trials: Design and Analysis. Springer.
[Ghosh, Bhaskar Kumar](https://en.wikipedia.org/wiki/Bhaskar_Kumar_Ghosh)(1970).. Reading:*Sequential Tests of Statistical Hypotheses*[Addison-Wesley](https://en.wikipedia.org/wiki/Addison-Wesley).[Chernoff, Herman](https://en.wikipedia.org/wiki/Herman_Chernoff)(1972).*Sequential Analysis and Optimal Design*.[SIAM](https://en.wikipedia.org/wiki/Society_for_Industrial_and_Applied_Mathematics).[Siegmund, David](https://en.wikipedia.org/wiki/David_Siegmund)(1985).*Sequential Analysis*. Springer Series in Statistics. New York:[Springer-Verlag](https://en.wikipedia.org/wiki/Springer-Verlag).[ISBN](https://en.wikipedia.org/wiki/ISBN_(identifier))[978-0-387-96134-7](https://en.wikipedia.org/wiki/Special:BookSources/978-0-387-96134-7).- Bakeman, R., Gottman, J.M., (1997) Observing Interaction: An Introduction to Sequential Analysis, Cambridge: Cambridge University Press
- Jennison, C. and Turnbull, B.W (2000) Group Sequential Methods With Applications to Clinical Trials. Chapman & Hall/CRC.
- Whitehead, J. (1997). The Design and Analysis of Sequential Clinical Trials, 2nd Edition. John Wiley & Sons.

## External links

[[edit](https://en.wikipedia.org/w/index.php?title=Sequential_analysis&action=edit§ion=10)]

[R Package: Wald's Sequential Probability Ratio Test](https://cran.r-project.org/web/packages/SPRT/SPRT.pdf)by[OnlineMarketr.com](http://onlinemarketr.com:)[Software for conducting sequential analysis](http://myweb.fsu.edu/ajeong/dat/)and[applications of sequential analysis](https://web.archive.org/web/20060501235736/http://garnet.fsu.edu/~ajeong/index.htm)in the study of group interaction in computer-mediated communication by Dr. Allan Jeong at Florida State University[SAMBO Optimization](https://sambo-optimization.github.io)– a[Python](https://en.wikipedia.org/wiki/Python_(programming_language))framework for sequential,[model-based](https://en.wikipedia.org/wiki/Surrogate_model)optimization.

- Commercial

[PASS Sample Size Software](https://en.wikipedia.org/wiki/PASS_Sample_Size_Software)includes features for the setup of group sequential designs.
