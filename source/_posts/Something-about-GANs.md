---
title: Something about GAN
date: 2017-08-12 19:24:14
categories:
- Thesis Notes
tags:
  - Generative Adversarial Networks
  - GANs
  - DCGAN
  - WGAN
  - WGAN-GP
  - Deep Learning
---

最近在看关于GANs的论文，并且自己动手用PyTorch写了一些经典文章的实现，想要稍微总结一下，故有此文。在最后我总结了我自己看过的有关GANs的一些比较好的资源，希望对读者有所帮助。

（待填坑……）

<!-- more -->

## Before Reading: PyTorch

在讲GANs之前，首先推一波PyTorch。就我的使用体验来说，PyTorch是远远超过TensorFlow的。PyTorch作为一个动态图计算的框架，与Python结合得非常好，写出来的代码非常*Pythonic*（反例就是TF的`tf.while_loop`）。同时PyTorch与NumPy结合得非常好，不用在`Tensor`与`ndarray`之间转换来转换去。

总而言之，PyTorch非常适合我这样需要快速开发与快速验证，并且对于运行速度要求并不高的DL研究（讲真，TF的速度也不怎么快，还是吃内存大户）。

## Introduction

**GANs（Generative Adversarial Networks，生成对抗网络）是Generative Models（生成模型）的一种。**所谓生成模型，就是能在一个含有真实数据分布$p\_{data}$样本（samples）的训练集上，学习到真实数据分布的估计的表示$p\_{model}$的模型。学习到的这个表示可以是显式的（explicit），比如说直接就给出了$p\_{model}$；也可以是隐式的（implicit），比如说能够生成符合$p\_{model}$分布的样本。**一般来说，GANs属于第二种，能够进行样本生成。**不过在设计上，GANs其实是两者皆可的。

**那为什么要搞这个生成模型呢？**原因也是有很多的。比如说，训练生成样本是一个用来测试我们表示高维概率分布的能力的好方法，而现实世界的物体往往是具有高维概率分布的，这就对我们用DL来表示与解释现实世界有帮助。同时，很多DL相关的任务也是很需要样本生成的，比如说超分辨率（super resolution）、风格迁移（style transfer）之类的。此外，生成模型对于某些标签甚至是数据缺失的数据集也很有用，比如说可以用在半监督学习（semi-supervised learning）上，不过我倒是没见到过相关的论文。总之，生成模型是很有用的，也是目前DL领域的一大热门方向。

那么问题又来了，**还有哪些生成模型，GANs相比于其他的生成模型有什么优势**，特别是在去年和它几乎同时火起来的VAE？首先谈谈生成模型的分类。说起这个，就不得不谈**极大似然估计（maximum likelihood estimation）**，几乎所有的生成模型都使用了或者可以转换为使用极大似然来进行估计。极大似然估计的基本思想是，定义一个含有参数$\theta$的模型，用它来提供对于一个概率分布的估计，然后寻找一组最优的参数$\theta$来使得模型的概率分布$p\_{model}$最贴合实际数据的概率分布$p\_{data}$。具体地说，对于一个具有$m$个样本$x^{(i)}$的数据集来说，可以用似然（likelihood）来表示模型与数据集中数据的契合概率$\prod^m\_{i=1} p\_{model} (x^{(i)};\theta)$，而我们的最终目的就是找到使得似然最大的参数$\theta$。由于对数函数的优良性质，我们可以将似然取对数。
$$
\begin{align}
\theta ^* &= \arg \max \_{\theta} \prod ^m \_{i=1} p\_{model} (x^{(i)};\theta) \\\\
&= \arg \max  \_{\theta} \log \prod ^m \_{i=1} p\_{model} (x^{(i)};\theta) \\\\
&= \arg \max \sum ^m \_{i=1} \log p\_{model} (x^{(i)};\theta) \\\\
\end{align}
$$

另外一方面，我们也可以将极大似然估计看成是一种最小化真实概率分布与模型概率分布之间的**KL散度（Kullback–Leibler divergence）**的方法。虽然我们通常在实践中并不能直接接触到$p\_{data}$，而是只能够获得服从其分布的$m$个采样。我们可以用这些采样组成的数据集来定义$\hat{p} \_{data}$这么一个经验分布（empirical distribution）来近似$p\_{data}$。可以证明，最小化$\hat{p} \_{data}$与$p \_{model}$之间的KL散度，等价于在数据集上最大化对数似然。
$$
\theta ^*=\arg \min D\_{KL} (p\_{data} (x) \parallel p\_{model} (x;\theta))
$$

好了，说了这么多，让我们再把话题转向生成模型的分类。生成模型可以根据其计算似然及其梯度，或者近似估计这些值的方法来进行分类。

![taxonomy_for_generative_models](/images/taxonomy_for_generative_models.png)


（待填坑……）

<!-- more -->

## Further Reading

最后总结一些我在学习过程中看过的比较好的资料以及代码实现：

- [pytorch-tutorial](https://github.com/yunjey/pytorch-tutorial): 我见到的最好的PyTorch入门教程，简洁清晰明了，有其他DL框架使用经验以及Python基础的朋友适用。一上来看不懂的话，可以先看官方的60分钟入门教程之后，再看这个。
- [NIPS 2016 Tutorial: Generative Adversarial Networks](http://arxiv.org/abs/1701.00160): Iran Goodfellow在NIPS2016上的教程演讲，很好地介绍了GANs的基本思想和应用。前面的数学推导看不懂的话，可以结合[DeepLearningBook](http://www.deeplearningbook.org/)（[中译版](http://www.epubit.com.cn/book/details/4278)已经上市，本人忝为校对之一）。同时，还可以结合slides看，slides上的都写得很简练，tutorial中则做了相似的说明。可惜的是，当时WGAN及其变种还没有出来，因此在这篇tutorial中没有提到。
- 几篇代表论文以及相关的代码实现：
  - GAN: [paper](https://arxiv.org/abs/1406.2661), [code (pytorch-tutorial)](https://github.com/yunjey/pytorch-tutorial/blob/master/tutorials/02-intermediate/generative_adversarial_network/main.py#L34-L50)
  - DCGAN: [paper](https://arxiv.org/abs/1511.06434), [code (PyTorch official example)](https://github.com/pytorch/examples/tree/master/dcgan), [code (pytorch-tutorial)](https://github.com/yunjey/pytorch-tutorial/tree/master/tutorials/03-advanced/deep_convolutional_gan)
  - WGAN: [paper](https://arxiv.org/abs/1701.07875), [code (PyTorch)](https://github.com/martinarjovsky/WassersteinGAN)
  - WGAN-GP: [https://arxiv.org/abs/1704.00028](https://arxiv.org/abs/1704.00028), [code (PyTorch)](https://github.com/caogang/wgan-gp)
- 我自己的代码实现，欢迎指正：[GAN-Zoo](https://github.com/corenel/GAN-Zoo)