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


### Backpropagation Algorithm

**"Backpropagation" (后向搜索)** is neural-network terminology for minimizing our cost function, just like what we were doing with gradient descent in logistic and linear regression.

Our goal is try to find parameters $\Theta$ to try to minimize $J(\Theta)$. 

In order to use either gradient descent or one of the advance optimization algorithms. What we need to do therefore is to write code that takes this input the parameters theta and computes $J(\Theta)$ and $\dfrac{\partial}{\partial \Theta\_{i,j}^{(l)}}J(\Theta)$.

#### Gradient compuation

Given one training example $(x,y)$

![gradient_computation](/images/gradient_computation.png)

Forward propagation:

* $a^{(1)} = x$
* $z^{(2)} = \Theta ^{(1)} a ^{(1)}$
* $a^{(2)} = g(z^{(2)})\ (add\ a^{(2)}\_0)$
* $z^{(3)} = \Theta ^{(1)} a ^{(2)}$
* $a^{(3)} = g(z^{(3)})\ (add\ a^{(3)}\_0)$
* $z^{(4)} = \Theta ^{(3)} a ^{(3)}$
* $a^{(2)} = h\_\Theta (x) =  g(z^{(3)})$


In backpropagation we're going to compute for every node:

$\delta\_j^{(l)}$ = "error" of node j in layer $l$ ($s\_{l+1}$ elements vector)

For each output unit (layer $L = 4$):

$\delta ^{(4)} = a^{(4)} - y$

To get the delta values of the layers before the last layer, we can use an equation that steps us back from right to left:

$\delta^{(l)} = ((\Theta^{(l)})^T \delta^{(l+1)})\ .*\ g'(z^{(l)})$

The g-prime derivative terms can also be written out as:

$g'(z^{(l)}) = a^{(l)}\ .*\ (1 - a^{(l)})$

There is no $\delta ^{(1)}$ term, because the first layer corresponds to the input layer and that's just the feature we observed in our training sets, so that doesn't have any error associated with that.

It's possible to prove that if you ignore regularation, then the partial derivative terms you want are exactly given by the activations and these delta terms. 

$\dfrac{\partial J(\Theta)}{\partial \Theta\_{i,j}^{(l)}} = a^{(i)}\_j \delta^{(l+1)}\_i\ (\text{ignoring }\lambda)$

#### Backpropagation Algorithm

* Training set $\lbrace (x^{(1)}, y^{(1)}) \cdots (x^{(m)}, y^{(m)})\rbrace$
* Set $\Delta^{(l)}\_{i,j} := 0$ (for all $l, i, j$)
* For $i=1$ to $m$
  * Set $a^{(1)} := x^{(t)}$
  * Perform forward propagation to compute $a^{(l)}$ for $l = 2,3,\dots ,L$
  * Using $y^{(i)}$, compute $\delta^{(L)} = a^{(L)} - y^{(t)}$
  * Compute $\delta^{(L-1)}, \delta^{(L-2)},\dots,\delta^{(2)}$
  * $\Delta^{(l)}\_{i,j} := \Delta^{(l)}\_{i,j} + a\_j^{(l)} \delta\_i^{(l+1)}$  or with vectorization, $\Delta^{(l)} := \Delta^{(l)} + \delta^{(l+1)}(a^{(l)})^T$
* $D^{(l)}\_{i,j} := \dfrac{1}{m}\left(\Delta^{(l)}\_{i,j} + \lambda\Theta^{(l)}\_{i,j}\right)$ **If** $j\ne 0$ 
* $D^{(l)}\_{i,j} := \dfrac{1}{m}\Delta^{(l)}\_{i,j}$ **If** $j = 0$

The capital-delta matrix is used as an "accumulator" to add up our values as we go along and eventually compute our partial derivative.

 the $D\_{i,j}^{(l)}$ terms are the partial derivatives and the results we are looking for:

$\dfrac{\partial J(\Theta)}{\partial \Theta\_{i,j}^{(l)}} = D\_{i,j}^{(l)}$

### Backpropagation Intuition

#### Forward propagation

![forward_propagation_intuition.png](/images/forward_propagation_intuition.png)

#### What's backpropagation doing?

The cost function is:

$J(\theta) = - \frac{1}{m} \sum\_{t=1}^m\sum\_{k=1}^K  \left[ y^{(t)}\_k \ \log (h\_\theta (x^{(t)}))\_k + (1 - y^{(t)}\_k)\ \log (1 - h\_\theta(x^{(t)})\_k)\right] + \frac{\lambda}{2m}\sum\_{l=1}^{L-1} \sum\_{i=1}^{s\_l} \sum\_{j=1}^{s\_l+1} ( \theta\_{j,i}^{(l)})^2$

Focusing on  a single example $x^{(i)}, y^{(i)}$, the case of 1 output unit, and ignoring regularization ($\lambda = 0$), 

$cost(t) =y^{(t)} \ \log (h\_\theta (x^{(t)})) + (1 - y^{(t)})\ \log (1 - h\_\theta(x^{(t)}))$

Intuitively, $\theta ^{(l)}\_j$ is the "error" for $a ^{(l)}\_j$ (unit $j$ in layer $l$). More formally, the delta values are actually the derivative of the cost function:

$\delta\_j^{(l)} = \dfrac{\partial}{\partial z\_j^{(l)}} cost(t)$

![backward_propagation_intuition.png](/images/backward_propagation_intuition.png)

In above, we can compute

$\delta ^{(4)}\_1 = y^{(i)} - a^{(4)}\_1$

$\delta ^{(3)}\_2 = \Theta ^{(3)}\_{12} \delta^{(4)}\_1$

$\delta ^{(2)}\_2 = \Theta ^{(2)}\_{12} \delta^{(3)}\_1 + \Theta ^{(2)}\_{22} \delta^{(3)}\_2$

