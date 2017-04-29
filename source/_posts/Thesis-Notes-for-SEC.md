---
title: Thesis Notes for SEC
date: 2017-04-28 09:13:33
categories:
- Notes
tags:
  - Semantic Segmentation
  - Deep Learning
---

This is my notes for **Seed, Expand and Constrain: Three Principles for Weakly-Supervised Image Segmentation**.

- arxiv: [https://arxiv.org/abs/1603.06098](https://arxiv.org/abs/1603.06098)
- github: [https://github.com/kolesman/SEC](https://github.com/kolesman/SEC)

<!-- more -->

## Introduction

本篇论文主要是介绍了针对 image-level 弱监督语义分割的一种新的 loss function。这个 loss function 由三部分组成：

* **seeding loss**：针对使用 Image calssification CNN 来进行 object localization 的问题。传统的分类网络（比如 AlexNet 或者说 VGG）能够生成可靠的定位线索（即 **seeds** ），然是在预测物体确切的空间范围上就不怎么样了。这个 seeding loss 主要就是来使得分割网络能够准确地匹配到物体的定位线索（localization cues），但是不要扩展得太开，基本上就是只标出物体的中心位置，而无视图像中的其他不相关的部分。
* **expansion loss**：因为是要用 image-level 的标注来训练份额网络，所以需要考虑用 global pooling 来将预测出的 mask 转换成 image-level label scrores。这个 pooling 层的选择很大程度上决定了最终训练得到的分割网络的预测质量。一般来说，global max-pooling 倾向于低估物体的尺寸，而global average-pooling 则倾向于高估。本文使用了一种叫做 **global weighted rank pooling** 的方法来将物体的 seeds 扩展到一个尺寸比较合适的区域来计分，从而计算 expansion loss。这种方法是 max-pooling 和 average-pooling 的一种泛化版本，并且性能比这两者要高。
* **constrain-to-boundary loss**：根据 image-level label 训练出来的网络很少能够捕捉到图像中物体的精确边缘，而且仅仅在测试的时候在网络后面套一层全连接的 CRF 也往往难以完全克服这个缺陷。这是因为按照传统方法训练出来的网络，即便是对于未标记的区域，也倾向于有比较高的置信度。于是本文提出了一种新的 loss， 能够使得网络在训练的时候就减轻不精确的边缘预测。这一 loss 主要是对预测得到的 mask 进行约束，使其能在一定程度上遵循低层次的图像信息，特别是物体的边缘这样的重要信息。

文中将这一方法称为**SEC**，即 **S**eed，**E**xpand和**C**onstrain。之后将分块介绍其具体实现。

## Related Work

现有的 image-level 弱监督语义分割的方法主要可以分为三类：

* **基于图的方法（graph-based Model）**：根据图像内或图像间的部分（segments）或是超像素（superpixels）的相似性来推断其标签。
* **多实例学习（multiple instance learning）**：使用 per-image loss function 来进行训练，本质上是保持了图像中能够被用来生成 mask 的一种空间表示。
  * 例如 MIL-FCN 以及 MIL-ILP，其区别主要在于 pooling 策略，也就是说它们如何将其内在的空间表示转换到 per-image labels。
* **自学习（self-training）**：模型本身使用基于 EM-like 的方法来生成 pixel-level 的标注，然后再来训练 fully-supervised 的分割网络。
  * 例如 EM-Adapt 以及 CCNN，其区别在于如何将 per-image annotation 转换到 mask 并保持其一致性。
  * SN_B 又增加了额外的步骤来创建于合并多个目标的proposal。

文中介绍的 SEC 包含了后两类方法，即其既使用了 per-image 的 loss，也使用了 per-pixel 的 loss 形式。

## Weakly supervised segmentation from image-level labels

### Table of Symbols

|    Symbol     |               Description                |                Note                 |
| :-----------: | :--------------------------------------: | :---------------------------------: |
|    $\chi$     |           the space of images            |                                     |
|     $X_i$     |                 an image                 |           $X_i \in \chi$            |
|      $N$      |             number of images             |                                     |
|      $Y$      |           a segmentation mask            |        $Y = (y_1 \dots y_n)$        |
|     $y_i$     | a semantic label at $i$ spatial location |                                     |
|      $n$      |       number of spatial locations        |                                     |
|      $u$      |                a location                |       $u\in \{1,2,\dots n\}$        |
|      $C$      |           a set of all labels            | $C=C' \cup \{c^{bg}\}$, size is $k$ |
|     $C'$      |      a set of all foreground labels      |                                     |
|   $c^{bg}$    |            a background label            |                                     |
|      $k$      |        number of kinds of labels         |                                     |
|      $c$      |                 a label                  |              $c\in C$               |
|     $T_i$     | a set of weakly annotated foreground labels in an image |            $T_i \in C'$             |
|     $S_c$     | a set of locations that are labeled with class $c$ by the weak localizatio procdure |                                     |
| $f(X;\theta)$ | segment network, briefly written as $f(X)$ | $f_{u,c}(X;\theta)=p(y_u=c \mid X)$ |

### The SEC loss for weakly supervised image segmentation

本节将介绍 SEC 的 loss function 的三个组成部分，其各自的功用如下：

* $L_{seed}$: 为网络预测提供提示（hint）
* $L_{expand}$: 惩罚太小或者是搞错对象的预测 mask
* $L_{constrain}$: 鼓励分割能够与图像空间以及色彩结构相适应

本文的目标是训练一个参数为$\theta$的一个深度卷积神经网络$f(X;\theta)$，其能够预测在任一位置$u\in \{1,2, \dots , n\}$上任一标签$c\in C$的条件概率，也就是说，$f_{u,c}(X;\theta)=p(y_u=c \mid X)$。

该网络的训练即为下式的优化问题：
$$
min\_{\theta} \sum\_{(X,T)\in D}[L\_{seed}(f(X;\theta), T) + L\_{expand}(f(X;\theta), T) + L\_{constrain}(X, f(X;\theta))]
$$

整个网络的结构如下图所示：

![A schematic illustration of SEC](/images/illustratio_of_SEC.png)

#### Seeding loss with localization cues

Image-level 的标签本身是不能提供语义目标的定位信息的，但是以 CNN 为基础的 Classification Network 却能够提供一个比较弱的定位信息（**weak localization**），如下图所示。

![The schematic illustration of the weak localization procedure](/images/illustration_of_weak_localization.png)

当然，这种 weak location 或者说 location cues 并没有精确到能直接拿来当 full and accurate segmentation masks 的地步。不过还是可以用来指导弱监督分割网络的。文中提到的 *seeding loss* 主要是用来使得网络只匹配 weak localization 的 landmark，而无视图像中的其他部分。*seeding loss* $L\_{seed}$ 的定义如下：
$$
L\_{seed}(f(X), T, S\_c) = - \frac{1}{\sum\_{c\in T} |S\_c|} \sum\_{c\in T} \sum\_{u\in S\_c} log f\_{u,c}(X)
$$
需要注意的是，文章中的 weak location 是预先计算好的，并非在训练过程中生成。前景用的是 *Learning deep features for discriminative localization*，背景用的是 *Deep inside convolutional networks: Visualising image classification models and saliency maps* 中的方法

### Expansion loss with global weighted rank pooling

要度量分割后的 mask 与原来的 image-level 标签的一致程度的话，可以把每个像素的分割的得分合起来形成一个总的分类得分，然后再套上个 loss function 就能用来训练多标签的图像分类了。一般来说，有两种比较常用的方法：

* 一个是 GMP (global max-pooling)，对于一张图像$X$，每个类$c$的得分就是所有像素的该类得分的最大值$max\_{u\in \{1,\dots,n\}} f\_{u,c} (X)$。
* 另外一个就是 GAP (global average-pooling) ，得分是所有像素该类得分的平均值$\frac{1}{n} \sum ^n \_{u=1} f\_{u,c} (X)$

（To be continued）