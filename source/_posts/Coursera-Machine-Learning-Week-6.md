---
title: Notes for Machine Learning - Week 6
date: 2016-09-10 15:18:41
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Advice for Applying Machine Learning

## Evaluating a Learning Algorithm

### Deciding What to Try Next

Errors in your predictions can be troubleshooted by:

* Getting more training examples
* Trying smaller sets of features
* Trying additional features
* Trying adding polynomial features
* Increasing or decreasing $\lambda$

Don't just pick one of these avenues at random. We'll explore diagnostic techniques for choosing one of the above solutions in the following sections.

In the next few sections, We'll first talk about how evaluate your learning algorithms and after that we'll talk about some of these diagnostics which will hopefully let you much more effectively select more of the useful things to try mixing if your goal to improve the machine learning system. 

<!--more-->

### Evaluating a Hypothesis

A hypothesis may have low error for the training examples but still be inaccurate (because of overfitting). And it may fail to generalize to new examples not in training set.

With a given dataset of training examples, we can split up the data into two sets: a **training set** and a **test set**.

The training/testing procedure using these two sets is then:

1. Learn $\Theta$ and minimize $J\_{train}(\Theta)$ using the training set

2. Compute the test set error $J\_{test}(\Theta)$

   * For linear regression: $J\_{test}(\Theta) = \dfrac{1}{2m\_{test}} \sum\_{i=1}^{m\_{test}}(h\_\Theta(x^{(i)}\_{test}) - y^{(i)}\_{test})^2$

   * For classification ~ Misclassification error (aka 0/1 misclassification error): 

     $err(h\_\Theta(x),y) = \begin{cases} 1 & \mbox{if } h\_\Theta(x) \geq 0.5\ and\ y = 0\ or\ h\_\Theta(x) < 0.5\ and\ y = 1 \\\\ 0 & otherwise \end{cases}$

     *  This gives us a binary 0 or 1 error result based on a misclassification.

   * The average test error for the test set is

     $\text{Test Error} = \dfrac{1}{m\_{test}} \sum^{m\_{test}}\_{i=1} err(h\_\Theta(x^{(i)}\_{test}), y^{(i)}\_{test})$

     * This gives us the proportion of the test data that was misclassified.