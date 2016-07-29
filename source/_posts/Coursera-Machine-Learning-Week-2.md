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
    * $X=\begin{bmatrix}x_0 \\\\ x_1 \\\\ x_2 \\\\ \vdots \\\\ x_n \end{bmatrix}, \theta = \begin{bmatrix}\theta_0 \\\\ \theta_1 \\\\ \theta_2 \\\\ \vdots \\\\ \theta\_n \end{bmatrix}, h\_\theta (x) = \theta^T x$

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

### Feature Normalization

Idea: Make sure featueres are on a similar scale.

* We can speed up gradient descent by having each of our input values in roughly the same range. This is because $\theta$ will descend quickly on small ranges and slowly on large ranges, and so will oscillate inefficiently down to the optimum when the variables are very uneven.
* The way to prevent this is to modify the ranges of our input variables so that they are all roughly the same.

#### Example

* $x_1$ = size (0-2000 $feet^2$)
* $x_2$ = number of bedrooms (1-5)

$x_1$ has a much larger range of values than $x_2$. So the $J(\theta_1, \theta_2)$ can be a very very skewed elliptical shape. And if you run gradient descents on this cost function, your gradients may end up taking a long time and can oscillate back and forth and take a long time before it can finally find its way to the global minimum. 

#### Feature scaling

Get every feature into approcimately $-1\le x_i \le 1$ range.

* Feature scaling involves dividing the input values by the range (i.e. the maximum value minus the minimum value) of the input variable, resulting in a new range of just 1.
* These aren't exact requirements; we are only trying to speed things up.


* $-3\le x_i \le 3$ or $ -\frac{1}{3} \le x_i \le \frac{1}{3}$ just is fine.

#### Mean normalization

Replace $x_i$ with $x_i - \mu _i$ to make features have approximately zero mean (Do not apply to $x_0 = 1$)

* E.g. $x_1 = \frac{size -1000}{2000}, x_2 = \frac{bedrooms - 2}{5}$
* $x_i = \frac{x_i - \mu _i}{s_i}$
  * $\mu _i$ is the average value of $x_i$ in training set.
  * $s\_i$ is the range ($x\_{imax}-x_{imin}$) or standard deviation ($\sigma$)

### Learning Rate

* "Debugging": **How to make sure gradient descent is working correctly**
  * Make a plot with *number of iterations* on the x-axis. Now plot the cost function, $J(\theta)$ over the number of iterations of gradient descent.
    * For sufficient small $\alpha$, $J(\theta)$ should decreases on every iteration.
    * But if $\alpha$ is too small, gradient descent can be slow to converge.
    * If $J(\theta)$ ever increases, then you probably need to use smaller $\alpha$.
  * Example automatic convergence test
    * Declare convergence if $J(\theta)$ decreases by less than $\epsilon$ (e.g., $10^{-3})$ in one iteration.
* **How to choose learing rate $\alpha$**
  * So just try running gradient descent with a range of values for $\alpha$, like 0.001 and 0.01. And for these different values of $\alpha$ are just plot $J(\theta)$ as a function of number of iterations, and then pick the value of $\alpha$ that seems to be causing $J(\theta)$to decrease rapidly.
  * Andrew Ng recommends decreasing $\alpha$ by multiples of 3. And then try to pick the largest possible value, or just something slightly smaller than the largest reasonable value.
  * E.g. $\dots, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, \dots$

## Features and Polynomial Regression

### Choice of features

* We can improve our features and the form of our hypothesis function in a couple different ways.
* We can **combine** multiple features into one. For example, we can combine $x_1​$ and $x_2​$ into a new feature $x_3​$ by taking $x_1\cdot x_2​$. (E.g. $House Area = Frontage \times Depth​$)

### Polynomial Regression

Our hypothesis function need not be linear (a straight line) if that does not fit the data well.

* We can **change the behavior or curve** of our hypothesis function by making it a quadratic, cubic or square root function (or any other form).
  * For example, if our hypothesis function is $h_\theta(x) = \theta_0 + \theta_1 x_1$ then we can create additional features based on $x\_1$, to get the quadratic function $h_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 x\_1^2$ or the cubic function $h\_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 x_1^2 + \theta_3 x_1^3$.
  * In the cubic version, we have created new features $x_2$ and $x_3$ where $x_2 = x_1^2$ and $x_3=x^3_1$.
  * To make it a square root function, we could do: $h_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 \sqrt{x_1}$
  * Note that at 2:52 and through 6:22 in the "Features and Polynomial Regression" video, the curve that Prof Ng discusses about "doesn't ever come back down" is in reference to the hypothesis function that uses the `sqrt()` function (shown by the solid purple line), not the one that uses $size^2$ (shown with the dotted blue line). The quadratic form of the hypothesis function would have the shape shown with the blue dotted line if $\theta _2$ was negative.
* One important thing to keep in mind is, if you choose your features this way then **feature scaling becomes very important**.
  * E.g. if $x_1$ has range $1 - 1000$ then range of $x^2_1$ becomes $1 - 1000000$ and that of $x^3_1$ becomes $1 - 1000000000$
  * So you should scale $x_1$ before using polynomial regression.