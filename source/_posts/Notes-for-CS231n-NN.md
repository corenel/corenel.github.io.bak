---
title: Notes for CS231n Neural Network
date: 2016-10-16 21:04:26
categories:
  - Notes
tags:
  - CS231n
  - Neural Network
  - Deep Learning
---

> 本文主要对于 CS231n 课程自带的 Lecture Notes 的一些补充与总结. 建议先看原版的 Lecture Notes:
>
> * [Neural Networks Part 1: Setting up the Architecture](http://cs231n.github.io/neural-networks-1/)
> * [Neural Networks Part 2: Setting up the Data and the Loss](http://cs231n.github.io/neural-networks-2/)
> * [Neural Networks Part 3: Learning and Evaluation](http://cs231n.github.io/neural-networks-3/)
>
> 或者可以看知乎专栏中的中文翻译:
>
> * [CS231n课程笔记翻译：神经网络笔记1（上）](https://zhuanlan.zhihu.com/p/21462488?refer=intelligentunit)
> * [CS231n课程笔记翻译：神经网络笔记1（下）](https://zhuanlan.zhihu.com/p/21513367?refer=intelligentunit)
> * [CS231n课程笔记翻译：神经网络笔记2 ](https://zhuanlan.zhihu.com/p/21560667?refer=intelligentunit)
> * [CS231n课程笔记翻译：神经网络笔记3（上）](https://zhuanlan.zhihu.com/p/21741716?refer=intelligentunit)
> * [CS231n课程笔记翻译：神经网络笔记3（下）](https://zhuanlan.zhihu.com/p/21798784?refer=intelligentunit)
>
> 另外, 本文主要根据讲课的 Slides 上的顺序来, 与 Lecture Notes 的顺序略有不同.

<!-- more -->

# Lecture 5

## Activation Functions 

课程中主要讲了Sigmoid, tanh, ReLU, Leaky ReLU, Maxout 以及 ELU 这几种激活函数. 

![activation_functions](/images/activation_functions.png)

* Sigmoid 由于以下原因, 基本不使用
  * 函数饱和使得梯度消失(Saturated neurons “kill” the gradients)
  * 函数并非以零为中心(zero-centered)
  * 指数运算消耗大量计算资源
* tanh 相对于 Sigmoid 来说, 多了零中心这一个特性, 但还是不常用
* 重头戏 ReLU (Rectified Linear Unit):
  * 在正半轴上没有饱和现象
  * 线性结构省下了很多计算资源, 可以直接对矩阵进行阈值计算来实现, 速度是 sigmoid/tanh 的6倍
  * 然而由于负半轴直接是0, 训练的时候会"死掉"(die), 因此就有了 Leaky ReLU 和 ELU (Exponential Linear Units), 以及更加通用的 Maxout (代价是消耗两倍的计算资源)

**实践中一般就直接选 ReLU, 同时注意 Learning Rate 的调整. 实在不行用 Leaky ReLU 或者 Mahout 碰碰运气. 还可以试试 tanh. 坚决别用 Sigmoid.**

## Data Preprocessing

有很多数据预处理的方法, 比如零中心化(zero-centering), 归一化(normalization), PCA(Principal Component Analysis, 主成分分析)和白化(Whitening).

* 零中心化(zero-centering): 主要方法就是均值减法, 将数据的中心移到原点上

  ```python
  # Assume X [NxD] is data matrix, each example in a row
  X -= np.mean(X, axis=0)
  ```

  零中心化主要有两种做法(e.g. consider CIFAR-10 example with [32,32,3] images):

  * Subtract the mean image (e.g.AlexNet)  (mean image = [32,32,3] array)


*   Subtract per-channel mean (e.g.VGGNet)  (mean along each channel = 3 numbers)

*   归一化(normalization): 使得数据所有维度的范围基本相等, 当然由于图像像素的数值范围本身基本是一致的(一般为0-255), 所以不一定要用.

    ```python
          X /= np.std(X, axis=0)
    ```

*   PCA 和白化在 CNN 中并没有什么用, 就不介绍了.

 ![data_preprocessing](/images/data_preprocessing.png)

**实践中一般就只做零中心化, 其他几样基本都不用做.**

> 以下引自知乎专栏[智能单元]所翻译的课程讲义:
>
> **常见错误。**进行预处理很重要的一点是：任何预处理策略（比如数据均值）都只能在训练集数据上进行计算，算法训练完毕后再应用到验证集或者测试集上。例如，如果先计算整个数据集图像的平均值然后每张图片都减去平均值，最后将整个数据集分成训练/验证/测试集，那么这个做法是错误的。**应该怎么做呢？应该先分成训练/验证/测试集，只是从训练集中求图片平均值，然后各个集（训练/验证/测试集）中的图像再减去这个平均值。**
>
> **译者注：此处确为初学者常见错误，请务必注意！**

## Weight Initialization

由于各种原因, 将 Weight 全部初始化为0, 或者是小随机数的方法都不大好(一个是由于对称性, 另一个是由于梯度信号太小). 建议使用的是下面这个(配合 ReLU):

```python
w = np.random.randn(n) * sqrt(2.0/n)
```

另外就是还推荐 **Batch Normalization** (批量归一化), 通常应用在全连接层之后, 激活函数之前. 具体参见论文([Ioffe and Szegedy, 2015]). 

![batch_normalizaition](/images/batch_normalizaition.png)

- Improves gradient flow through thenetwork
- Allows higher learning rates
- Reduces the strong dependence oninitialization
- Acts as a form of regularization in afunny way, and slightly reduces the need for dropout, maybe

## Babysitting the Learning Process

### Double check that the loss is reasonable

* 首先不使用 regularization, 观察 loss 是否合理(下例中对于 CIFAR-10 的初始 loss 应近似等于$log(0.1)=2.31$)
* 然后再开启 regularization, 观察 loss 是否上升

 ![loss_double_check](/images/loss_double_check.png)

### Other sanity check tips

* 首先在一个小数据集上进行训练(可先设 regualrization 为0), 看看是否过拟合, 确保算法的正确性.

  ![overfit_on_a_small_portion_of_training_data](/images/overfit_on_a_small_portion_of_training_data.png)

* 之后再从一个小的 regularization 开始, 寻找合适的能够使 loss 下降的 learning rate.

  * 如果几次 epoch 后, loss 没没有下降, 说明 learning rate 太小了

     ![loss_barely_changing](/images/loss_barely_changing.png)

  * 如果 loss 爆炸了, 那么说明 learning rate 太大了

     ![loss_exploding](/images/loss_exploding.png)

  * 通常 learning rate 的范围是$[1e-3, 1e-5]$

## Hyperparameter Optimization

* **从粗放(coarse)到细致(fine)地分段搜索**, 先大范围小周期(1-5 epoch足矣), 然后再根据结果小范围长周期

  * First stage: only a few epochs to get rough idea of what params work
  * Second stage: longer running time, finer search
  * … (repeat as necessary)

  > If the cost is ever > 3 * original cost, break out early

* **在对数尺度上进行搜索**, 例如`learning_rate = 10 ** uniform(-6, 1)`. 当然有些超参数还是按原来的, 比如 `dropout = uniform(0,1)`

* **小心边界上的最优值**, 否则可能会错过更好的参数搜索范围.

   ![coarse_search](/images/coarse_search.png)

   ![finer_search](/images/finer_search.png)

* **随机搜索优于网格搜索**

   ![random_search_vs_grid_search ](/images/random_search_vs_grid_search .png)

(To be continued...)