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

本片论文主要是介绍了针对 image-level 弱监督语义分割的一种新的 loss function。这个 loss function 由三部分组成：

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

（To be continued）