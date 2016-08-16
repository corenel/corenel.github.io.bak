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