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

- [arXiv:1705.01262](https://arxiv.org/abs/1705.01262)
- [Poster & Slides](http://www.ece.iisc.ernet.in/~divsymposium/EECS2017/slides_posters/EECS_2017_paper_31.pdf)

<!-- more -->

## Introduction

CRF属于判别式的图模型，通常被用来标注或分析序列资料。2014年左右的时候，CRF也被用来做图像分割。但是随着深度学习的兴起，CRF慢慢就沦为了进行post-precessing的工具，以优化结果。一般的做法就是用分割网络输出的pixel-level的各类的概率分布作为CRF的unary potential，然后用*Efficient inference in fully connected CRFs with Gaussian edge potentials*里面的方法来设置pairwise potential。

强监督的语义分割用这个方法当然很好，但是弱监督的话，因为没有pixel-level的标签，要把image-level的标签有选择地广播到所有像素还是一个很艰苦的工作。通常用的方法是基于localization cues的，比如说用saliency maps、objectness priors或者bounding boxes等等，就像之前介绍的[SEC](http://www.yuthon.com/2017/04/28/Thesis-Notes-for-SEC/)一样。

不过这篇文章里面用的不是localization cues的那一套，而是**把pixel-level的标签作为CRF的latent variables（隐变量），然后把图像本身以及image-level的标签作为observed variables（观测变量）**。然后想通过训练inference network以估计在给定observed variables的情况下latent variables的后验分布（posterior distribution）这样的方法，把latent variables的inference cost分摊到整个数据集中。值得注意的是，这种方法并没有学习CRF的uanry potential，而是要训练inference network，使其输出的pixel-level标签在全局上与image-level标签一致，在局部上与附近的标签一致。

> 讲真上边这一句话我也读着不是很懂，慢慢看之后的说明就能理解了。

这种方法的好处在于，inference network（也就是分割网络）的训练可以是end-to-end的，并不需要另外去生成localization cues。此外，用这种方法训练出来的模型也不需要post-processing步骤。

这种方法的预测精度与使用了saliency masks的方法（比如说SEC）相近，也算是一种新的研究方向。

## The proposed model

|         Symbol         | Description             | Note                                     |
| :--------------------: | :---------------------- | :--------------------------------------- |
|       $x^{(i)}$        | 第$i$幅图像                 | $1\le i \le n$                           |
|       $y^{(i)}$        | 第$i$幅图像对应的image-level标签 | Each $y^{(i)}$ is a boolean vector whose length equals the number of classes used for training. |
| $z^{(i)}=(z^{(i)}\_j)$ | 第$i$幅图像对应pixel-level标签  | $1\le j\le m$, and we use one-hot encoding for $z^{(i)}\_j$ |

本文的目标是，给定$(x^{(i)}, y^{(i)}), 1\le i \le n$的情况下，本算法希望能够学习到一个从$x^{(i)}$到$y^{(i)}$的映射关系，其能够对pixel-level的标注$z^{(i)}$做出推断。

![the_latent_CRF](/images/the_latent_CRF.png)

当给定图像$x$的时候，image-level的标签$y$的条件分布如下所示，目标则是能最大化$\sum^n\_{i=1} log p(y^{(i)}|x^{(i)})$。
$$
p(y|x) = \sum\_z p(z|x)p(y|z,x)
$$
定义$p(z|x)$为CRF的pairwise项，同时也是**先验概率（Prior）**：
$$
p(z|x) \propto exp \left(-\sum\_{j<j'} k(t\_j, t\_{j'})\mu (z\_j, z\_{j'}))\right)
$$
其中$t\_j$为位置$j$处像素的feature vector，$\mu (z\_j, z\_{j'})$为两个标签之间的compatibility。$p(z|x)$的意义在于**使得相邻且色彩相似的像素具有同一标签。**需要注意的是$p(z|x)$并不用训练，相反，需要学习的是作为CRF的unary potential的$p(y|z,x)$。

不过由于从$p(z|x,y)$进行采样在计算上十分困难，因此不能用EM法来最大化$\log p(y|z,x)$，具体分析可见原论文。因此需要用其他方法来达成目的。该文章使用的方法是最大化$p(y|x)$的下界，来使得$p(y|x)$最大。

### Variational Lower Bound

(To be continued...)