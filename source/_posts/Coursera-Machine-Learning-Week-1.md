---
title: Notes for Machine Learning - Week 1
date: 2016-07-26 11:55:36
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Machine Learning

## Week 1

### Linear Regression with One Variable

#### Model Representation

* **Supervised Learning (监督学习)**: Given the "right answer" for each example in the data.
  * **Regression Problem (回归问题)**: Predict real-valued output. 
  * **Classification Problem (分类问题)**: Predict discrete-valued output.
* **Training set (训练集)**
  * **m**: number of training examples
  * **x**'s: "input" variable / features
  * **y**'s: "output" variable / "target" variable
  * **(x, y)**: one training example
  * **($x^i$, $y^i$)**: $i^{th}$ training example


* Training Set -> Learning Algorithm -> **h(hypothesis, 假设)**
  * h is a function maps from x's to y's
  * e.g. Size of house -> h -> Estimated price


* **Linear regression with one variable**
  * $h_\theta (x) = \theta_0 + \theta_1 x$
    * Shorthand: $h(x)$
  * Or named Univariate linear regression (单变量线性回归)

<!-- more -->

#### Cost function

