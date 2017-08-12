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