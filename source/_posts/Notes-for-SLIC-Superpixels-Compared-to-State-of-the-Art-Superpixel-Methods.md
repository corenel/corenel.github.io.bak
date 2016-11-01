---
title: Notes for SLIC Superpixels Compared to State-of-the-Art Superpixel Methods
date: 2016-11-01 18:21:04
tags:
  - Superpixel
categories:
  - Notes
---


文章介绍了当前 State-of-the-Art 的5种**超像素 (Superpixel)** 的算法, 并主要从其对于图像边缘信息的拟合程度 (their ability to adhere to image boundaries), 速度, 内存利用效率, 以及它们对于图像分割性能的影响 (their impact on segmentation performance) 来综合评价.

同时, 本文还提出了一种 **SLIC (simple linear iterative clustering)** 的算法, 用的是 k-means clustering 的方法.

<!-- more -->

## Introduction

**超像素算法**主要是将一幅图像中, 具有相似颜色, 纹理或者亮度等信息的相邻的像素点聚集起来, 组成一些具有一定视觉意义的像素块, 为后续处理做准备. 这种算法用少量的超像素来代替原来的图像像素, 能够减少图像的冗余度, 为计算图像特征做了很好的铺垫, 并且显著地降低了随后的图像处理步骤的复杂度. 超像素算法作为一个**预处理**的步骤, 现在已经成为了很多计算机视觉算法中的重要一环, 比如说图像分割 (image segmentation), 深度估计(depth estimation), 姿态预估 (body model estimation) 和目标定位 (object localization) 这些领域.

![Images_segmented_using_SLIC_into_superpixels](/images/Images_segmented_using_SLIC_into_superpixels.png)

生成超像素的方法有很多, 各自有各自的优点和缺陷. 在此主要考虑以下方面来评测对比这些算法:

* 超像素必须<u>遵循图像的边界</u> (Superpixels should adhere well to image boundaries.)
* 如果超像素是作为一个预处理步骤, 来减少计算复杂度的, 那么就需要考虑<u>计算速度, 内存效率以及是否方便使用</u>等因素 (When used to reduce computational complexity as a pre- processing step, superpixels should be fast to compute, memory efficient, and simple to use.)
* 同时, 如果超像素算法是为了用来给之后的分割做准备的, 那么就要考虑它<u>是否既能加快速度, 又能提升分割的效果</u>. (When used for segmentation purposes, superpixels should both increase the speed and improve the quality of the results.)

## Existing Superpixel Methods

### Graph-Based Algorithms

这类算法主要就是把整个图像看成一张图, 各个像素是节点, 相邻像素之间的相似度作为边上的权值. 超像素就是根据最小化损失函数来构建的.

相关的方法有:

* **[NC05](https://www.cs.sfu.ca/research/groups/VML/pubs/mori-model_search_segmentation-iccv05.pdf)**: 对边缘的遵循不好. 时间复杂度$O(N^{\frac{1}{2}})$
  * The Normalized cuts algorithm recursively partitions a graph of all pixels in the image using contour and texture cues, globally minimizing a cost function defined on the edges at the partition boundaries.
* **[GS04](http://fcv2011.ulsan.ac.kr/files/announcement/413/IJCV(2004)%20Efficient%20Graph-Based%20Image%20Segmentation.pdf)**: 对边缘遵循较好, 但是生成的超像素大小与形状不规则, 不能严格控制超像素的个数. 时间复杂度$O(NlogN)$
  * It performs an agglomerative clustering of pixels as nodes on a graph such that each superpixel is the minimum spanning tree of the constituent pixels.
* **[SL08](http://ieeexplore.ieee.org/document/4587471/?arnumber=4587471&tag=1)**: 时间复杂度$O(N^{\frac{3}{2}}logN)$, 但是没有算上预先生成边缘图(boundary map)所耗的时间
  * Moore et al. propose a method to generate superpixels that conform to a grid by finding optimal paths, or seams, that split the image into smaller vertical or horizontal regions. Optimal paths are found using a graph cuts method similar to Seam Carving.
* **[GCa10 & GCb10](http://link.springer.com/chapter/10.1007/978-3-642-15555-0_16)**: Veksler et al. use a global optimization approach similar to the texture synthesis work. Superpixels are obtained by stitching together overlapping image patches such that each pixel belongs to only one of the overlapping regions. They suggest two variants of their method, one for generating compact superpixels (GCa10) and one for constant- intensity superpixels (GCb10).

### Gradient-Ascent-Based Algorithms

这类方法生对像素生成一个随机的初始聚类, 然后不断迭代优化, 直到满足收敛条件.

相关的方法有:

* MS02
* QS08
* WS91
* TP09

(To be continued...)