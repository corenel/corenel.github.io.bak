---
title: Thesis Notes for SLIC
date: 2016-11-01 18:21:04
tags:
  - Superpixel
  - SLIC
categories:
  - Thesis Notes
---


文章介绍了当前 State-of-the-Art 的5种**超像素 (Superpixel)** 的算法, 并主要从其对于图像边缘信息的拟合程度 (their ability to adhere to image boundaries), 速度, 内存利用效率, 以及它们对于图像分割性能的影响 (their impact on segmentation performance) 来综合评价.

同时, 本文还提出了一种 **SLIC (simple linear iterative clustering)** 的算法, 用的是 k-means clustering 的方法.

<!-- more -->

## Introduction

**超像素算法**主要是将一幅图像中, 具有相似颜色, 纹理或者亮度等信息的相邻的像素点聚集起来, 组成一些具有一定视觉意义的像素块, 为后续处理做准备. 这种算法用少量的超像素来代替原来的图像像素, 能够减少图像的冗余度, 为计算图像特征做了很好的铺垫, 并且显著地降低了随后的图像处理步骤的复杂度. 超像素算法作为一个**预处理**的步骤, 现在已经成为了很多计算机视觉算法中的重要一环, 比如说图像分割 (image segmentation), 深度估计(depth estimation), 姿态预估 (body model estimation) 和目标定位 (object localization) 这些领域.

![Images_segmented_using_SLIC_into_superpixels](/images/Images_segmented_using_SLIC_into_superpixels.png)

生成超像素的方法有很多, 各自有各自的优点和缺陷. 在此主要考虑以下方面来评测对比这些算法:

* 超像素必须<u>保持图像的边缘信息</u> (Superpixels should adhere well to image boundaries.)
* 如果超像素是作为一个预处理步骤, 来减少计算复杂度的, 那么就需要考虑<u>计算速度, 内存效率以及是否方便使用</u>等因素 (When used to reduce computational complexity as a pre- processing step, superpixels should be fast to compute, memory efficient, and simple to use.)
* 同时, 如果超像素算法是为了用来给之后的分割做准备的, 那么就要考虑它<u>是否既能加快速度, 又能提升分割的效果</u>. (When used for segmentation purposes, superpixels should both increase the speed and improve the quality of the results.)

## Existing Superpixel Methods

### Graph-Based Algorithms

这类算法主要就是把整个图像看成一张图, 各个像素是节点, 相邻像素之间的相似度作为边上的权值. 超像素就是根据最小化损失函数来构建的.

相关的方法有:

* **[NC05](https://www.cs.sfu.ca/research/groups/VML/pubs/mori-model_search_segmentation-iccv05.pdf)**: 对边缘的保持不好. 时间复杂度$O(N^{\frac{1}{2}})$
  * The Normalized cuts algorithm recursively partitions a graph of all pixels in the image using contour and texture cues, globally minimizing a cost function defined on the edges at the partition boundaries.
* **[GS04](http://link.springer.com/article/10.1023/B:VISI.0000022288.19776.77)**: 对边缘保持较好, 但是生成的超像素大小与形状不规则, 不能严格控制超像素的个数. 时间复杂度$O(NlogN)$
  * It performs an agglomerative clustering of pixels as nodes on a graph such that each superpixel is the minimum spanning tree of the constituent pixels.
* **[SL08](http://ieeexplore.ieee.org/document/4587471/?arnumber=4587471&tag=1)**: 时间复杂度$O(N^{\frac{3}{2}}logN)$, 但是没有算上预先生成边缘图(boundary map)所耗的时间
  * Moore et al. propose a method to generate superpixels that conform to a grid by finding optimal paths, or seams, that split the image into smaller vertical or horizontal regions. Optimal paths are found using a graph cuts method similar to Seam Carving.
* **[GCa10 & GCb10](http://link.springer.com/chapter/10.1007/978-3-642-15555-0_16)**: Veksler et al. use a global optimization approach similar to the texture synthesis work. Superpixels are obtained by stitching together overlapping image patches such that each pixel belongs to only one of the overlapping regions. They suggest two variants of their method, one for generating compact superpixels (GCa10) and one for constant- intensity superpixels (GCb10).

### Gradient-Ascent-Based Algorithms

这类方法生对像素生成一个随机的初始聚类, 然后不断迭代优化, 直到满足收敛条件.

相关的方法有:

* **[MS02](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=1000236)**: 一种比较老的方法, 生成的超像素形状不规整, 而且对于超像素的数量大小等均不能控制. 同时, 时间复杂度是$O(N^2)$, 非常慢.
  * Mean shift, an iterative mode-seeking procedure for locating local maxima of a density function, is applied to find modes in the color or intensity feature space of an image. Pixels that converge to the same mode define the superpixels. MS02
* **[QS08](http://link.springer.com/chapter/10.1007/978-3-540-88693-8_52)**: 对边界的保持比较好, 但是速度相当慢. 时间复杂度$O(dN^2)$.
  * Quick shift also uses a mode-seeking segmentation scheme. It initializes the segmentation using a medoid shift procedure. It then moves each point in the feature space to the nearest neighbor that increases the Parzen density estimate.
* **[WS91](https://pdfs.semanticscholar.org/a381/9dda9a5f00dbb8cd3413ca7422e37a0d5794.pdf)**: 对边界保持不好, 形状不规整, 不能严格控制超像素的数量, 但是速度快. 时间复杂度$O(NlogN)$.
  * The watershed approach performs a gradient ascent starting from local minima to produce watersheds, lines that separate catchment basins. The 
* **[TP09](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=4912213)**: 生成的超像素具有一致的大小, 紧凑性. 宣称时间复杂度$O(N)$, 但是实际上很慢, 而且对边界的保持不好. 
  * The Turbopixel method progressively dilates a set of seed locations using level-set-based geometric flow. The geometric flow relies on local image gradients, aiming to regularly distribute superpixels on the image plane.



## SLIC Superpixels

SLIC (simple linear iterative clustering) 算法是 k-means 在超像素生成方面的一个改写. 主要有以下特性:

* 将搜索域限制在与超像素大小成比例的一个区域内, 从而显著减少优化过程中的距离计算量. 此举将复杂度降到了$N$的级别,并且与超像素数量$k$无关.
* 综合颜色以及空间上的临近关系来构造权边, 同时也能控制超像素的数量.

### Algorithm

1. **聚类初始化**: 按照设定的超像素个数$k$, 采取步长$S=\sqrt{N/k}$, 在图像中均匀采样选取聚类中心$C_i = \begin{bmatrix} l_i & a_i & b_i & x_i & y_i \end{bmatrix}^T$. 然后在聚类中心的$3\times 3$领域内寻找梯度最小的点, 作为新的聚类中心的位置.
   * 图像色彩空间采用 CIELAB
   * 步长$S=\sqrt{N/k}$是为了使得聚类中心分布均匀
   * 移动聚类中心是为了避免把中心建在边缘或者噪点上

2. **像素点分类**: 将每个像素点$i$与离其最近并且搜索域覆盖到它的聚类中心相关联. 若是该像素点在多个聚类中心的搜索域内, 则取距离$D$最小的那个作为其关联的聚类中心.
   * 搜索域为$2S\times 2S$

   * 将搜索域限制在一个较小的范围内, 避免了传统的 k-means 方法里每个像素点要和所有的聚类中心比较的缺点, 使得运行速度大大提高. 这也是本算法速度快的最重要的一个原因.

      ![reducing_the_superpixel_search_regions](/images/reducing_the_superpixel_search_regions.png)

3. **分类更新**: 在所有的像素都已经关联到聚类中心之后, 我们需要调整聚类中心的位置, 使得其位于与其关联的像素点的中心.
   * 这样的分配(assign)然后再更新(update)的步骤可以迭代多次, 直到满足收敛条件为止.
   * 一般来说10次就差不多了

4. **后续处理**: 通过将不相交的点分配给相邻的超像素来增强联通性 (enforces connectivity by reassigning disjoint pixels to nearby superpixels).

伪代码如下：

```C++
/* Initialization */
Initialize cluster centers C_k = [l_k, a_k, b_k, x_k, y_k] by sampling pixels at regular grid steps S.
Move cluster centers to the lowest gradient position in a 3x3 neighborhood.
Set label l(i) = -1 for each pixel i.
Set distance d(i) = \infty for each pixel i

repeat
  /* Assignment */
  for each cluster center C_k do
    for each pixel i in a 2Sx2S region around C_k do
      Compare the distance between C_k and i.
      if D < d_i then
        set d(i) = D
        set l(i) = k
      end if
    end for
  end for
  /* Update */
  Compute new cluster centers.
  Compute residual error E
until E <= threshold
```

### Distance Measure

SLIC 算法用的是 CIELAB 的色彩空间, 再加上像素本身的坐标, 因此一个像素的全部信息需要用一个5维的向量$\begin{bmatrix} l\_i & a\_i & b\_i & x\_i & y\_i \end{bmatrix}^T$来表示, 也可以说是在一个$labxy$的图像空间内.

$(l, a, b)$表示颜色信息, $(x ,y)$表示位置信息, 因此不能简单地用5维空间的欧氏距离来衡量两个像素之间的距离. 为了统一色彩与空间上的接近程度, 需要引入归一化 (normalization).

$d\_c = \sqrt{(l\_j - l\_i)^2 + (a\_j - a\_i)^2 + (b\_j - b\_i)^2}$

$d\_s = \sqrt{(x\_j - x\_i)^2 + (y\_j - y\_i)^2}$

$D' = \sqrt{(d\_c / N\_c)^2 + (d\_s / N\_s)^2}$

其中$N_c$与$N_s$分别代表最大的色彩与空间距离. $N_s$很好确定, 就是超像素的大小, $N_s = S = \sqrt{N/k}$. 然而$N_c$则根据每个聚类区域的不同而不同, 为了方便起见, 将其设定为一个常数值$m$. 因此距离$D$的定义即可表示为:

$D' = \sqrt{(d\_c / m)^2 + (d\_s / S)^2}$

进而可简化为

$D = \sqrt{d\_c^2 + (d\_s / S)^2 m^2}$

> * $m$其实也是用来衡量色彩与空间相似度哪个更加重要的标志. $m$较大时, 表示空间相似度更为重要, 产生的超像素会更为紧凑, 区域/边缘比率较低; 当$m$较小时, 表示色彩相似度更为重要, 产生的超像素会紧贴边缘, 但是大小与形状就不会很规整. 一般来说, 使用 CIELAB 色彩空间时, $m \in [1,40]$.
> * 对于灰阶图像, $d\_c = \sqrt{(l\_j - l\_i)^2}$
> * 对于三维的超体素, $d\_s = \sqrt{(x\_j - x\_i)^2 + (y\_j - y\_i)^2 + (z\_j - z\_i)^2}$

### Postprocessing

SLIC 和其他算法一样并不严格地强制保证连通性 (connectivity). 聚类完成时候, 会有一些与其聚类中心不属于同一个连通单元 (connected component) 的孤立像素存在. 为了对此做出校正, 这些像素会根据某种连通单元算法 (connected components algorithm) 来分配到另外一个最近的聚类中心上.

(To be continued...)