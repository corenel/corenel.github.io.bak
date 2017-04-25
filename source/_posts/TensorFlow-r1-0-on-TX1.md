---
title: TensorFlow r1.0 on TX1 (now successful)
date: 2017-03-10 18:12:18
categories:
  - Experience
tags:
  - TensorFlow
  - NVIDIA
  - Jetson TX1
  - Ubuntu
  - Deep Learning
---

TensorFlow r1.0已经发布了不少时间，事实证明1.0版本在内存使用上改善了不少，以前一些在r0.11上内存满报错的程序在r1.0上能够正常运行了。同时，r1.0相较于r0.11在API上做了很大的改动，也有很多新的东西（比如Keras）将要集成进TF。

总而言之，r1.0是未来的方向，所以说我希望将原先在TX1上装的r0.11换成r1.0。不过网上最新的教程还是只有r0.11的。[rwightman](https://github.com/rwightman)这位仁兄编译成功了r1.0alpha版本，并且放出了[whl文件](https://github.com/rwightman/tensorflow/releases/tag/v1.0.0-alpha-tegra-ugly_hack)，不过没有编译正式版。本文将阐述如何在TX1上安装TensorFlow r1.0的正式版本~~，不过目前由于`nvcc`的一个bug，还没有编译成功~~。

Update: 做了一些非常ugly的改动之后编译成功了。

<!-- more -->

## Environment

Thsi article aims to install TensorFlow r1.0 on NVIDIA Jetson TX1 with JetPack 2.3.1:

* Ubuntu 16.04 (aarch64)
* CUDA 8.0
* cuDNN 5.1.5 or 5.1.10

> ~~Note that I still **CAN'T** build TensorFlow r1.0 yet. The reason is explained at the end of this post.~~

## Preparation

Before installation, you need to add swap space for TX1 since this device only has 4G memory and 16GB eMMC Storage. I use an external HDD via USB. Maybe you could use SSD for higher speed. 

Thanks to [jetsonhacks](https://github.com/jetsonhacks), we can simply deal this with a script:

```bash
$ git clone https://github.com/jetsonhacks/postFlashTX1.git
$ sudo ./createSwapfile.sh -d /path/to/swap/ -s 8
```

8G swap is enough for compilation, and ensure you have **>5.5GB** free space on TX1.

## Install Deps

Thanks to [jetsonhacks](https://github.com/jetsonhacks), we can deal with deps more convinently. I forked this repo and modify something to fit TF r1.0. You can just clone mine.

```bash
$ git clone https://github.com/corenel/installTensorFlowTX1.git
$ cd installTensorFlowTX1
# tell the dynamic linker to use /usr/local/lib
$ ./setLocalLib.sh
# install prerequisties
$ ./installPrerequisites.sh
```

> If you meet an error that bazel can't find `cudnn.h` in `/usr/lib/aarch64-linux-gnu/`, just download cuDNN from NVIDIA Developers website and place it into that path.
>
> Or you can just edit `setTensorFlowEV.sh` and replace `default_cudnn_path=/usr/lib/aarch64-linux-gnu/` with `default_cudnn_path=/usr/` since the default `cudnn.h` is in `/usr/include/`.

## Build TensorFlow

```bash
# clone tensorflow r1.0
$ ./cloneTensorFlow.sh
# set environment variables for tensorflow
$ ./setTensorFlowEV.sh
# build tensorflow
$ ./buildTensorFlow.sh
# package builds into a wheel file
$ ./packageTensorFlow.sh
```

Then you'll find your wheel file in your home folder.

## Install and Test

```bash
# install tensorflow
$ pip install ~/tensorflow-1.0.0-py2-none-any.whl
# test tensorflow
$ python -c 'import tensorflow as tf; print(tf.__version__)'
```

## Problems

Until now, I still can't build tensorflow successfully. An error occured:

```bash
ERROR: /home/ubuntu/tensorflow/tensorflow/core/kernels/BUILD:2498:1: output 'tensorflow/core/kernels/_objs/softmax_op_gpu/tensorflow/core/kernels/softmax_op_gpu.cu.pic.o' was not created.
ERROR: /home/ubuntu/tensorflow/tensorflow/core/kernels/BUILD:2498:1: not all outputs were created or valid.
Target //tensorflow/tools/pip_package:build_pip_package failed to build
```

According to [this post](https://devtalk.nvidia.com/default/topic/987306/?comment=5059105), this may due to a bug of `nvcc`. An expert in NVIDIA says they solved it with their internal nvcc compiler, which is not yet available in JetPack. Maybe next release of JetPack (3.0 on March 14) will solve it. So I'll update this post then.

## An ugly hack

Thanks to [rwightman's hack](https://github.com/rwightman/tensorflow/commit/a1cde1d55f76a1d4eb806ba81d7c63fe72466e6d),  I finally compiled TF1.0 successfully. Just following hacks:

* Revert Eigen to revision used in Tensorflow r0.11 to avoid cuda compile error
* Remove expm1 op that was added with new additions to Eigen


My fork for `installTensorFlowTX1` has contained this hack. And my build for TensorFlow r1.0 with Python 2.7 can be find [here](https://www.dropbox.com/s/m6bgd3sq8kggul7/tensorflow-1.0.1-cp27-cp27mu-linux_aarch64.whl?dl=0).

> **Update**: [@barty777](https://github.com/barty777) build TF 1.0.1 with Python 3.5, and his wheel file can be found [here](https://drive.google.com/open?id=0B2jw9AHXtUJ_OFJDV19TWTEyaWc).

## Acknowledgment

Thanks for following posts and issues:

* Github issue: [tensorflow for Nvidia TX1](https://github.com/tensorflow/tensorflow/issues/851)
* NVIDIA forum post: [TensorFlow on Jetson TX1](https://devtalk.nvidia.com/default/topic/901148/jetson-tx1/tensorflow-on-jetson-tx1/)
* My earilier blog post: [Installation of TensorFlow r0.11 on TX1](http://www.yuthon.com/2016/12/04/Installation-of-TensorFlow-r0-11-on-TX1/)