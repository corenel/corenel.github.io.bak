---
title: Thesis Notes for Amortized Inference and Learning in Latent CRF
date: 2017-05-10 22:05:31
categories:
  - Thesis Notes
tags:
  - Semantic Segmentation
  - Deep Learning
---

This is my notes for **Amortized Inference and Learning in Latent Conditional Random Fields for Weakly-Supervised Semantic Image Segmentation**.

- arxiv: https://arxiv.org/abs/1705.01262

## Abstract

CRF在图像分割任务中经常被用来作为post-processing步骤，以优化结果。一般的做法就是用分割网络输出的pixel-level的各类的概率分布作为CRF的unary potential，然后用*Efficient inference in fully connected CRFs with Gaussian edge potentials*里面的方法来设置pairwise potential。

强监督的语义分割用这个方法当然很好，但是弱监督的话，因为没有pixel-level的标签，要把image-level的标签有选择地广播到所有像素还是一个很艰苦的工作。通常用的方法是基于localization cues的，比如说用saliency maps、objectness priors或者bounding boxes等等，就像之前介绍的[SEC那篇文章](http://www.yuthon.com/2017/04/28/Thesis-Notes-for-SEC/)一样。

不过这篇文章里面用的不是localization cues的那一套，而是把pixel-level的标签作为CRF的latent variables（隐变量），然后把图像本身以及image-level的标签作为observed variables（观测变量）。然后想通过训练inference network以估计在给定observed variables的情况下latent variables的后验分布（posterior distribution）这样的方法，把latent variables的inference cost分摊到整个数据集中。

> 讲真上边这一句话我也读着不是很懂，慢慢看之后的说明就能理解了。

这种方法的好处在于，inference network（也就是分割网络）的训练可以是end-to-end的，并不需要另外去生成localization cues。此外，用这种方法训练出来的模型也不需要post-processing步骤。

这种方法的预测精度与使用了saliency masks的方法（比如说SEC）相近，也算是一种新的研究方向。

## Introduction

(To be continued...)