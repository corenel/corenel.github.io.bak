---
title: Thesis Notes for ScribbleSup
date: 2016-11-20 18:26:24
tags:
  - ScribbleSup
  - Deep Learning
  - Scene Segmentation
categories:
  - Thesis Notes
---

毕设需要写一个图像标注的软件, 来给场景分割的数据集做标注. 经学长推荐, 看了今年的这篇文章, 作者中竟然还有 Kaiming He 大神, 给微软膜一秒.

这篇文章讲了一个弱监督的场景分割的算法 ScribbleSup, 主要是先通过 GrubCut 将输入的 scribble 信息广播到没有标注的像素, 然后用 FCN 来做像素级别的预测. 令人遗憾的是 Github 上并没有人实现 (不能偷懒了TAT).

<!-- more -->

## Introduction

TBD

## Scribble-Supervised Learning

### Objective Functions

主要用到的记号如下:

| Symbol           | Name                               | Note                                     |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| $X$              | training image                     |                                          |
| $\{x_i\}$        | set of non-overlapping superpixles | $\cup_i x_i = X; x_i \cap x_j = \varnothing, \forall i,j$ |
| $S$              | scribble annotations of image      | $S=\{s_k, c_k\}$                         |
| $s_k$            | the pixels of a scribble $k$       |                                          |
| $c_k$            | the scribble’s category label      | $0 \le c_k \le C$; $c_k=0$ for background |
| $Y$ or $\{y_i\}$ | the category label of $\{x_i\}$    | provides full annotations of the image   |


定义目标函数为

$$\sum\_i \psi\_i (y\_i | X,S) + \sum\_{i,j} \psi\_{ij} (y\_i, y\_j | X)$$

其中$\psi\_i$是一个关于$x\_i$的一元项 (unary term), 而$\psi\ _{ij}$是关于$x\_i$与$x\_j$的成对项 (pairwise term).

* $\psi \_i$由两个部分组成, 一个是$\psi ^{scr}\_i$, 另一个是$\psi^{net}\_i$.两者权重相同, $\psi \_i = \psi^{scr} \_i + \psi^{net} \_i$.

  * $\psi ^{scr}\_i$ 基于 scribble, 定义如下:
    $$
    \psi ^{scr}\_i=
    \begin{aligned}
    &0 & \text{if $y\_i=c\_k$ and $x\_i \cap s\_k \ne \varnothing$}\\\\
    &-log(\frac{1}{|c\_k|}) & \text{if $y\_i \in \{c\_k\}$ and $x\_i \cap S = \varnothing$} \\\\
    &\infty & \text{otherwise} \\\\
    \end{aligned}
    $$

    * 当$x_i$与$s_k$有交集, 且标签是分到$c_k$时, 则$cost=0$
    * 当$x_i$与所有 scribble 都没有交集, 则它可以被等概率地分给任何标签. 当然, $y_i$需要在$\{c_k\}$之内. 此处$|\{c_k\}|$表示标签集内元素个数.
    * 如果不是以上两种情况, 则$cost= \infty$

  * $\psi ^{net}_i$基于 FCN 的输出, 定义为
    $$
    \psi^{net}\_i (y\_i) = -log P(y\_i|X, \Theta)
    $$

    * $\Theta$表示网络的参数
    * $log P(y_i|X, \Theta)$表示了$x_i$属于标签$y_i$的对数概率, 实际上是$x_i$内所有像素的对数概率之和.

* $\psi\_{ij}$用以衡量相邻的两个超像素的相似程度, 主要是用色彩直方图与纹理直方图来量化 (均已归一化).
  $$
  \psi\_{ij} (y\_i, y\_j | X) = [y\_i \ne y\_j] exp \left( -\frac{||h\_c(x\_i) - h\_c(x\_j)||^2\_2}{\delta\_c^2} - \frac{||h\_t(x\_i) - h\_t(x\_j)||^2\_2}{\delta\_t^2} \right)
  $$

  * $h_c(x_i)$ 表示RGB三个 channel 每个 channel 分成 25 bins 的色彩直方图
  * $h_t(x_i)$ 表示横向与纵向的梯度直方图, 每个方向 10 bins
  * $[\cdot]$表示一个符号函数, 条件为真则为$1$, 否则为$0$
  * $\delta_c=5, \delta_t = 10$
  * 对于不是同一个标签的临近超像素来说, 它们间的外观越相似, 则 cost 越大

(To be continued...)