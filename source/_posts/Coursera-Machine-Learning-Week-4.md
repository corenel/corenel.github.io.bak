---
title: Notes for Machine Learning - Week 4
date: 2016-08-15 17:05:54
categories:
  - Notes
tags:
  - Coursera
  - Machine Learning
---

# Neural Networks: Representation

## Motivations

### Non-linear Hypotheses

<u>Performing linear regression with a complex set of data with many features is very unwieldy.</u> For 100 features, if we wanted to make them quadratic we would get 5050 resulting new features.

We can approximate the growth of the number of new features we get with all quadratic terms with $\mathcal{O}(n^2/2)$. And if you wanted to include all cubic terms in your hypothesis, the features would grow asymptotically at $\mathcal{O}(n^3)$. <u>These are very steep growths, so as the number of our features increase, the number of quadratic or cubic features increase very rapidly and becomes quickly impractical</u>.

**Example**: let our training set be a collection of 50x50 pixel black-and-white photographs, and our goal will be to classify which ones are photos of cars. Our feature set size is then n=2500 if we compare every pair of pixels (7500 if RGB). Now let's say we need to make a quadratic hypothesis function. With quadratic features, our growth is $\mathcal{O}(n^2/2)$. So our total features will be about 25002/2=3125000, which is very impractical.

![car example](/images/car-examle.png)

<!-- more -->

### Neurons and the Brain

Origins: Algorithms that try to mimic the brain.

* Was very widely used in 80s and early 90s; popularity diminished in late 90s.
* Recent resurgence: State-of-the-art technique for mant applications

#### The "one learning algorithm" hypothesis

There is evidence that the brain uses only one "learning algorithm" for all its different functions. Scientists have tried cutting (in an animal brain) the connection between the ears and the auditory cortex and rewiring the optical nerve with the auditory cortex to find that the auditory cortex literally learns to see.

![The "one learning algorithm" hypothesis](/images/The_one_learning_algorithm_hypothesis.png)

![Sensor representations in the brain](/images/sensor_representations_in_the_brain.png)

## Neural Networks

### Model Representation I

#### Neuron in the brain

At a very simple level, neurons are basically computational units that take input (**dendrites**, 树突) as electrical input (called "spikes") that are channeled to outputs (**axons**, 轴突).

![neruon_in_the_brain](/images/neruon_in_the_brain.png)

#### Neuron model: Logistic unit

* In our model, our dendrites are like the input features ($x\_1 \cdots x\_n$), and the output is the result of our hypothesis function $h\_\theta (x)$:
* In this model our $x_0$ input node is sometimes called the "**bias unit**." It is always equal to 1.
* In neural networks, we use the same logistic function as in classification: $\frac{1}{1 + e^{-\theta^Tx}}$. In neural networks however we sometimes call it a sigmoid (logistic) **activation function**.
* Our $\theta$ parameters are sometimes instead called "**weights**" in the neural networks model.

![neuron_model_logistic_unit](/images/neuron_model_logistic_unit.png)

#### Neural Network

* The first layer is called the "**input layer**" and the final layer the "**output layer**", which gives the final value computed on the hypothesis.
* We can have intermediate layers of nodes between the input and output layers called the "**hidden layer**".
* $a_i^{(j)}$ = "activation" of unit $i$ in layer $j$
  * $a\_1^{(2)} = g(\Theta\_{10}^{(1)}x\_0 + \Theta\_{11}^{(1)}x\_1 + \Theta\_{12}^{(1)}x\_2 + \Theta\_{13}^{(1)}x\_3)$
  * $a\_2^{(2)} = g(\Theta\_{20}^{(1)}x\_0 + \Theta\_{21}^{(1)}x\_1 + \Theta\_{22}^{(1)}x\_2 + \Theta\_{23}^{(1)}x\_3)$
  * $a\_3^{(2)} = g(\Theta\_{30}^{(1)}x\_0 + \Theta\_{31}^{(1)}x\_1 + \Theta\_{32}^{(1)}x\_2 + \Theta\_{33}^{(1)}x\_3)$
  * $h\_\Theta(x) = a\_1^{(3)} = g(\Theta\_{10}^{(2)}a\_0^{(2)} + \Theta\_{11}^{(2)}a\_1^{(2)} + \Theta\_{12}^{(2)}a\_2^{(2)} + \Theta\_{13}^{(2)}a\_3^{(2)})$
* $\Theta^{(j)}$ = matrix of weights controlling function mapping from layer $j$ to layer $j+1$
  * If network has $s\_j$ units in layer $j$ and $s\_{j+1}$ units in layer $j+1$, then $\Theta ^{(j)}$ will be of dimension $s\_{j+1}×(s\_{j}+1)$.

![neural_network](/images/neural_network.png)

### Model Representation II

