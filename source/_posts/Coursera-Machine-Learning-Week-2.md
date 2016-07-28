---
title: Notes for Machine Learning - Week 2
date: 2016-07-27 10:30:35
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Linear Regression with Multiple Variables

## Multivariate Linear Regression

* Multiple features (variables)
  * $n$ = number of features
  * $x^{(i)}$ = input (features) of $i^{th}$ training example.
  * $x^{(i)}_j$ = value of feature $j$ in $i^{th}$ training example.
* Hypotesis
  * Previously: $h_\theta (x) = \theta_0 + \theta_1 x$
  * $h_\theta (x) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n$
    * For convenience of notation, define $x_0=1$
    * $x=\begin{bmatrix}x_0 \\\\ x_1 \\\\ x_2 \\\\ \vdots \\\\ x_n \end{bmatrix}, \theta = \begin{bmatrix}\theta_0 \\\\ \theta_1 \\\\ \theta_2 \\\\ \vdots \\\\ \theta\_n \end{bmatrix}, h\_\theta (x) = \theta^T x$

<!-- more -->

## Gradient Descent for Multiple Variables

* Hypothesis: $h_\theta(x)=\theta^Tx=\theta_0 x_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n$

* Parameters: $\theta_0, \theta_1, \dots ,\theta_n$

* Cost function: $J(\theta_0, \theta_1, \dots, \theta\_n) = \frac{1}{2m} \sum^m\_{i=1}\left(h_\theta (x^{(i)})-y^{(i)}\right)^2$

  * or $J(\theta) = \frac{1}{2m}\sum_{i=1}^{m}(\theta^T x^{(i)} - y^{(i)})^2$

* Gradient descent

  > repeat {
  >
  >   $\theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta_0, \dots ,\theta_n)$
  >
  >   (simultaneously update for every $j=0,\dots,n$)
  >
  > }

  or

  > repeat {
  >
  >   $\theta_j := \theta\_j - \alpha \frac{1}{m} \sum^m\_{i=1}\left(h_\theta(x^{(i)})-y^{(i)}\right) x^{(i)}_j$ 
  >
  >   (simultaneously update for every $j=0,\dots,n$)
  >
  > }

## Gradient Descent in Practice

### Feature Scaling

