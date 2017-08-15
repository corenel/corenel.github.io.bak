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

这是今年CVPR2017上的一篇用GANs来做Domain Adaptation的文章（[arxiv](https://arxiv.org/abs/1702.05464)），其主要贡献在于

- 将之前的论文里提到的一些方法，例如weight sharing、base models、adversarial loss等，归入了统一的框架之中，并进行了测试；
- 提出了一种新的框架ADDA，主要思想是先用source data训练一个encoder和classifier出来，而后用GANs训练target的encoder使其结果能够近似于source encoder，最后就可以用source classifier来判别经过target encoder转换到特征空间上的target data了。

<!-- more -->

（填坑中）