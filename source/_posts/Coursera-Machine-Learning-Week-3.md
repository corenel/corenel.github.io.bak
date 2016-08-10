---
title: Notes for Machine Learning - Week 3
date: 2016-08-05 12:16:08
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Logistic Regression

## Classification

* Calssification Problem
  * $y\in {0,1}$
    * 0: "Negative Class",  负类
    * 1: "Positive Class", 正类
  * One method is to use linear regression and map all predictions greater than 0.5 as a 1 and all less than 0.5 as a 0. This method doesn't work well because classification is not actually a linear function.
* Logistic Regression (逻辑回归) : $0\le h_\theta \le 1$


<!-- more -->

## Hypothesis Representation

### Logistic Regression Model

$h_\theta (x) = \frac{1}{1+e^{-\theta ^T x}}$

* Want $0\le h_\theta(x)\le 1$

  * $h_\theta (x) = g(\theta ^T x)$

  * $g(z) = \frac{1}{1+e^{-z}}$

    * Called "Sigmod function" or "Logistic function"

      ![sigmod function](/images/sigmod_function.png)

### Interpretation of Hypothesis Output

* $h_\theta (x)$ = estimated probability that $y=1$ on input $x$
  * $h_\theta (x) = P(y=1|x; \theta)$
    * probability that $y=1$, given $x$, parameterised by $\theta$.
  * $P(y=0|x;\theta ) = 1 - P(y=1|x;\theta )$

## Decision Boundary

