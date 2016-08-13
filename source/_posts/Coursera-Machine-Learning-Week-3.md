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

In order to get our discrete 0 or 1 classification, we can suppose

* $h_\theta(x) \geq 0.5 \rightarrow y = 1$
* $h_\theta(x) < 0.5 \rightarrow y = 0$

The way our logistic function $g$ behaves is that when its input is greater than or equal to zero, its output is greater than or equal to 0.5:

* $g(z) \ge 0.5$ when $z\ge 0$, i.e., $\theta ^T x \ge 0$

In conclusion, we can now say:

* $\theta^T x \geq 0 \Rightarrow y = 1$
* $\theta^T x < 0 \Rightarrow y = 0$

### Decision boundaries

The **decision boundary** is the line that separates the area where $y=0$ and where $y=1$. It is created by our hypothesis function $\theta^T x = 0$.

![Disicion Boundary](/images/dicision_boundary.png)

The decision boundary is a property, not of the trading set, but of the hypothesis $h_\theta(x)$ under the parameters. As long as we're given parameter vector $\theta$, that defines the decision boundary. <u>But the training set is not what we use to define the decision boundary.</u>

### Non-linear decision boundaries

The input to the sigmoid function $g(z)$ (e.g. $\theta ^T x$) doesn't need to be linear, and could be a function that describes a circle (e.g. $z = \theta_0 + \theta _1 x_1 + \theta _2 x_2 + \theta _3 x_1^2 + \theta _4 x_2^2$) or any shape to fit our data.

![nonlinear decision boundary](/images/nonlinear_decision_boundary.png)

## Cost Function

We cannot use the same cost function that we use for linear regression because the Logistic Function will cause the output to be wavy, causing many local optima. In other words, it will not be a convex function (凸函数).

![non-convex and convex function](/images/non-convex_and_convex_function.png)

Instead, our cost function for logistic regression looks like:

$J(\theta) = \dfrac{1}{m} \sum\_{i=1}^m \mathrm{Cost}(h\_\theta(x^{(i)}),y^{(i)})$

$\mathrm{Cost}(h\_\theta(x),y) = \begin{cases}-\log(h\_\theta(x)) ,&\text{if y = 1}\newline -\log(1-h_\theta(x)) ,&\text{if y = 0}\end{cases}$

* $\mathrm{Cost} = 0$ if $y=1, h_\theta (x)=1$
* But as $h_\theta (x) \to 0, \mathrm{Cost} \to \infty$
  * Captures intuition that if $h_\theta (x) = 0$ (predict $P(y=1|x;\theta ) = 0$), but $y=1$, we'll **penalise** learning algorithm by a very large cost.

![Logistic_regression_cost_function_positive_class](/images/Logistic_regression_cost_function_positive_class.png)

![Logistic_regression_cost_function_negative_class](/images/Logistic_regression_cost_function_negative_class.png)

## Simplified Cost Function and Gradient Descent

