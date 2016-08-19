---
title: Notes for Machine Learning - Week 5
date: 2016-08-17 11:57:03
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Neural Networks: Learning

## Cost Function and Backpropagation

### Cost Function

Let's first define a few variables that we will need to use:

* $L$ = total number of layers in the network
* $s\_l$ = number of units (not counting bias unit) in layer $l$
* $K$ = number of output units/classes

Recall that the cost function for regularized logistic regression was:

$J(\theta) = - \frac{1}{m} \sum\_{i=1}^m \large[ y^{(i)}\ \log (h\_\theta (x^{(i)})) + (1 - y^{(i)})\ \log (1 - h\_\theta(x^{(i)}))\large] + \frac{\lambda}{2m}\sum\_{j=1}^n \theta\_j^2$

For neural networks, it is going to be slightly more complicated:

$J(\Theta) = - \frac{1}{m} \sum\_{i=1}^m \sum\_{k=1}^K \left[y^{(i)}\_k \log ((h\_\Theta (x^{(i)}))\_k) + (1 - y^{(i)}\_k)\log (1 - (h\_\Theta(x^{(i)}))\_k)\right] + \frac{\lambda}{2m}\sum\_{l=1}^{L-1} \sum\_{i=1}^{s\_l} \sum\_{j=1}^{s\_{l+1}} ( \Theta\_{j,i}^{(l)})^2$

<!-- more -->

* $h\_\Theta (x) \in R^K$, $(h\_\Theta (x))\_i$ = $i^{th}$ output
* <u>In the first part of the equation</u>, the double sum simply adds up the logistic regression costs calculated for each cell in the output layer
* <u>In the regularization part</u>, the triple sum simply adds up the squares of all the individual $\Theta$s in the entire network.
  * <u>The number of columns</u> in our current theta matrix is equal to the number of nodes in our current layer (<u>including</u> the bias unit).
  * <u>The number of rows</u> in our current theta matrix is equal to the number of nodes in the next layer (<u>excluding</u> the bias unit).
    * This is like a bias unit and by analogy to what we were doing for logistic progression, we won't sum over those terms in our regularization term because <u>we don't want to regularize them</u> and string their values as zero. 

