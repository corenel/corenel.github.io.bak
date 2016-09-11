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

With a given dataset of training examples, we can split up the data into two sets: a **training set** and a **test set**. (normally 70% for training set and 30% for test set)

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


### Model Selection and Train/Validation/Test Sets
Once parameters $\theta _0, \theta _1, \dots , \theta _4$ were fit to some set of data (training set), the error of the parameters as measured on that data (the training error $J(\theta)$ ) is likely to be lower than the actual generalization error.

* Just because a learning algorithm fits a training set well, that does not mean it is a good hypothesis.
* The error of your hypothesis as measured on the data set with which you trained the parameters will be lower than any other data set.

In order to choose the model of your hypothesis, you can test each degree of polynomial and look at the error result.

**Without the Validation Set (bad method)**

1. Optimize the parameters in $\Theta$ using the training set for each polynomial degree.
2. Find the polynomial degree d with the least error using the test set.
3. Estimate the generalization error also using the test set with $J_{test}(\Theta^{(d)})$, (d = theta from polynomial with lower error);

In this case, we have trained one variable, d, or the degree of the polynomial, using the test set. I.e., our extra parameter is fit to the test set. This will cause our error value to be greater for any other set of data. <u>Then the performance of the fitted model on the training set is not predictive of how well the hypothesis will generalize to new examples.</u>

**Use of the CV set**

To solve this, we can introduce a third set, the **Cross Validation Set** (交叉验证集), to serve as an intermediate set that we can train d with. Then our test set will give us an accurate, non-optimistic error.

One example way to break down our dataset into the three sets is:

* Training set: 60%
* Cross validation set: 20%
* Test set: 20%

We can now calculate three separate error values for the three different sets.

**With the Validation Set (note: this method presumes we do not also use the CV set for regularization)**

1. Optimize the parameters in $\Theta$ using the training set for each polynomial degree.
2. Find the polynomial degree d with the least error using the cross validation set.
3. Estimate the generalization error using the test set with $J\_{test}(\Theta^{(d)})$, (d = theta from polynomial with lower error);

This way, <u>the degree of the polynomial d has not been trained using the test set.</u>

> Be aware that using the CV set to select 'd' means that we cannot also use it for the validation curve process of setting the lambda value.

## Bias vs. Variance

### Diagnosing Bias vs. Variance

We'll examine the relationship between the degree of the polynomial $d$ and the underfitting or overfitting of our hypothesis.

* We need to distinguish whether **bias** (偏差) or **variance** (方差) is the problem contributing to bad predictions.
* <u>High bias is underfitting and high variance is overfitting.</u> We need to find a golden mean between these two.

The training error will tend to **decrease** as we increase the degree d of the polynomial.

At the same time, the cross validation error will tend to **decrease** as we increase d up to a point, and then it will **increase** as d is increased, forming a convex curve.

* **High bias (underfitting)**: both $J\_{train}(\Theta)$ and $J\_{CV}(\Theta)$ will be high, and $J\_{CV}(\Theta) \approx J\_{train}(\Theta)$.
* **High variance (overfitting)**: $J\_{train}(\Theta)$ will be low but $J\_{CV}(\Theta)$ will be high. And $J\_{CV}(\Theta) \gg J\_{train}(\Theta)$.


![Features-and-polynom-degree](/images/Features-and-polynom-degree.png)

### Regularization and Bias/Variance

The relationship of $\lambda$ to the training set and the variance set is as follows:

* **Low $\lambda$ (High variance, overfitting)**: $J\_{train}(\Theta)$ is low and $J\_{CV}(\Theta)$ is high (high variance/overfitting).
* **Intermediate λ**: $J\_{train}(\Theta)$ and $J\_{CV}(\Theta)$ are somewhat low and Jtrain(Θ)≈JCV(Θ).
* **Large $\lambda$ (High bias, underfitting)**: both $J\_{train}(\Theta)$ and $J\_{CV}(\Theta)$ will be high (underfitting/high bias)
  * A large lambda heavily penalizes all the $\Theta$ parameters, which greatly simplifies the line of our resulting function, so causes underfitting.

![Features-and-polynom-degree-fix.png](/images/Features-and-polynom-degree-fix.png)

In order to choose the model and the regularization $\lambda$, we need:

1. Create a list of lambda (i.e. $\lambda \in \{0,0.01,0.02,0.04,0.08,0.16,0.32,0.64,1.28,2.56,5.12,10.24\}$);
2. Select a lambda to compute;
3. Create a model set like degree of the polynomial or others;
4. Select a model to learn $\Theta$;
5. Learn the parameter $\Theta$ for the model selected, using $J\_{train}(\Theta)$ **with** $\lambda$ selected (this will learn $\Theta$ for the next step);
6. Compute the train error using the learned $\Theta$ (computed with λ ) on the $J\_{train}(\Theta)$ **without** regularization or $\lambda = 0$;
7. Compute the cross validation error using the learned $\Theta$ (computed with λ) on the $J\_{CV}(\Theta)​$ **without** regularization or $\lambda = 0$;
8. Do this for the entire model set and lambdas, then <u>select the best combo that produces the lowest error on the cross validation set</u>;
9. Now if you need visualize to help you understand your decision, you can plot to the figure like above with: ($\lambda$ x Cost $J\_{train}(\Theta)$) and ($\lambda$ x Cost $J\_{CV}(\Theta)$);
10. Now using the best combo $\Theta$ and $\lambda$, apply it on Jtest(Θ) to see if it has a good generalization of the problem.
11. To help decide the best polynomial degree and $\lambda$ to use, we can diagnose with the learning curves, that is the next subject.