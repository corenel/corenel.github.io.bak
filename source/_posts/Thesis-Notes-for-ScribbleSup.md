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

这篇文章讲了一个弱监督的场景分割的算法 ScribbleSup, 主要是先通过 Graph Cut 将输入的 scribble 信息广播到没有标注的像素, 然后用 FCN 来做像素级别的预测. 令人遗憾的是 Github 上并没有人实现 (不能偷懒了TAT).

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

最后把上边这些合起来, 就成了一个对于以下式子进行最优化的问题:
$$
\sum\_i \psi^{scr}\_i (y\_i |X, S) + \sum\_i -log P(y\_i  | X, \Theta) + \sum\_{i,j} \psi\_{ij} (y\_i, y\_j | X)
$$
其中有两组变量, 一个是所有超像素的标签$Y=\{y_i\}$, 另一个是 FCN 的参数 $\Theta$.

 ![ScribbleSup_grapgical_model](/images/ScribbleSup_grapgical_model.png)

### Optimization

论文里采用的是一种交替优化的方法:

* $\Theta$固定, 优化$Y$, slover 基于 scribbles, appearance 以及 FCN 网络的预测, 将标签传播到未标记的像素中
* $Y$固定, 优化$\Theta$, slover 对 pixel-wise 的语义分割的 FCN 进行学习

具体的来说就是

* **Propagating scribble information to unmarked pixels**

  当$\Theta$固定时, 一元项$\psi \_i = \psi^{scr} \_i + \psi^{net} \_i$能够用列举所有可能的标签$0 \le y_i \le C$得到, 成对项也能够预先计算生成一个 look-up table. 因此, 优化问题就能用 graph cut 的方法来解决. 论文里用的是[这一篇文章](http://www.csd.uwo.ca/faculty/yuri/Papers/pami04.pdf)的[现成代码](http://vision.csd.uwo.ca/code/gco- v3.0.zip).

* **Optimizing network parameters**

  前一步做完后, 所有超像素的标签都已经定好了, 也就是说$Y$固定了. 之后优化$\Theta$就相当于用$Y$做为监督来训练 FCN. $Y$有了, 那么每个像素的标签就有了, 然后 FCN 面对的就是一个 pixel-wise 的回归问题. FCN 的最后一层输出的就是每个像素的分类的对数概率, 可以用来更新 graph 上的一元项.


训练的时候有几点需要注意:

* 初始化的时候没有 network prediction, 因此就是直接用 graph cut 初始化的. 之后则是在两步之间不断迭代.
* 每次 network optimizing step 的时候, 前50k次用0.0003的 learning rate, 后10k次用0.0001的 learning rate, batch size 为 8.
* 每次 network optimizing step 都是从一个 pre-trained 的 model (比如 VGG-16) 重新初始化的. 作者也试过复用上一次迭代后的权重, 但是效果不是很理想. 似乎是由于本来标签就不可靠, 导致训练的时候参数被调到了不太好的局部最优里面.
* 基本上3次迭代就能得到比较好的效果了, 再多得到的提升微乎其微.

迭代结果如下:

 ![ScribbleSup_training](/images/ScribbleSup_training.png)


(To be continued...)