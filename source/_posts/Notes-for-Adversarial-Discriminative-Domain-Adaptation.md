---
title: Notes for Adversarial Discriminative Domain Adaptation
date: 2017-08-15 20:19:46
categories:
- Thesis Notes
tags:
  - Domain Adaptation
  - GANs
  - Deep Learning
---

## About this paper

- **Title**: Adversarial Discriminative Domain Adaptation
- **Authors**: Eric Tzeng, Judy Hoffman, Kate Saenko, Trevor Darrell
- **Topic**: Domain Adaptation
- **From**: [arXiv:1702.05464](https://arxiv.org/abs/1702.05464), appearing in CVPR 2017

## Contributions

- 将之前的论文里提到的一些方法，例如weight sharing、base models、adversarial loss等，归入了统一的框架之中，并进行了测试；
- 提出了一种新的框架ADDA，主要思想是先用labelled source data训练一个encoder和classifier出来，而后用GANs训练target encoder使其映射unlabelled target data到source data的feature space，最后就可以用source classifier来判别经过target encoder的target data了。

<!-- more -->

（填坑中）