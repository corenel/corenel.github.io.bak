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

（To be continued）