---
title: CUDA and Tensorflow Installation on Ubuntu 16.04
date: 2016-10-25 20:53:50
categories:
  - Experience
tags:
  - CUDA
  - Tensorflow
  - Ubuntu
  - Deep Learning
---

昨天折腾了一个下午开发环境的配置，记录一下其中遇到的坑。

<!-- more -->

## 硬件配置

我的硬件配置(XPS 15 9550):

* CPU: i5 6300HQ
* GPU: GTX960M 2G
* 内存: 16G DDR4 2133
* 硬盘: 512G SM951 NVMe

> 基本上就只处于玩票的状态, 实验室快给我配1080啊~~~

上一个 NVIDIA 钦定的 DevBox [配置](http://www.nvidia.com/object/deep-learning-system.html):

| Name                        | Description                              |
| :-------------------------- | ---------------------------------------- |
| GPUs                        | 8x Tesla P100                            |
| TFLOPS (GPU FP16 /CPU FP32) | 170/3                                    |
| GPU Memory                  | 16 GB per GPU                            |
| CPU                         | Dual 20-core Intel® Xeon®E5-2698 v4 2.2 GHz |
| NVIDIA CUDA® Cores          | 28672                                    |
| System Memory               | 512 GB 2133 MHz DDR4                     |
| Storage                     | 4x 1.92 TB SSD RAID 0                    |
| Network                     | Dual 10 GbE, 4 IB EDR                    |
| Software                    | Ubuntu Server Linux OSDGX-1 Recommended GPUDriver |
| System Weight               | 134 lbs                                  |
| System Dimensions           | 866 D x 444 W x 131 H (mm)               |
| Packing Dimensions          | 1180 D x 730 W x 284 H (mm)              |
| Maximum Power Requirements  | 3200W                                    |
| Operating Temperature Range | 10 - 30°C                                |

这简直是吾辈梦想神机啊… 然而要 **$129000** !

## 系统环境

推荐是用 Ubuntu 最新的 LTS 版本 16.04.1, 对 Skylake 系列的 CPU 和主板的支持都很不错. 关于在 XPS 15 9550 上的详细配置过程, 我计划稍后专门写一篇.

本来想在 macOS 上跑的, 奈何黑苹果不支持独显.

## 安装 CUDA

[CUDA](https://developer.nvidia.com/cuda-downloads) 与 [cuDNN](https://developer.nvidia.com/cudnn) 的安装在 NVIDIA 与 Tensorflow的官网上都有[详细说明](https://www.tensorflow.org/versions/r0.11/get_started/os_setup.html#optional-install-cuda-gpus-on-linux), 此处仅就一些关键环节作出说明.

* 禁用开源的 Nouveau 驱动

  * 首先看看有没有在使用这个开源驱动:

    ```shell
     $ lsmod | grep nouveau
    ```

  * 创建`/etc/modprobe.d/blacklist-nouveau.conf`文件, 并写入以下内容

    ```
    blacklist nouveau
    options nouveau modeset=0
    ```

  * 重启kernel initramfs

    ```shell
    $ sudo update-initramfs -u
    ```

* 从ppa源下载最新版的驱动(>364), 或者使用 CUDA-Toolkit 自带的驱动:

  ```shell
  $ sudo apt-get purge nvidia-*
  $ sudo add-apt-repository ppa:graphics-drivers/ppa
  $ sudo apt-get update
  $ sudo apt-get install nvidia-370
  ```

* 下载 CUDA 的 runfile (local) 版本, 不要使用apt-get 的方式, 保证获取到的是最新的版本 (目前是8.0).

* 安装过程中, 需要`Ctrl+Alt+F1`切换到 tty 界面, 然后关闭 X server:

  ```shell
  $ sudo service lightdm stop
  ```

  之后再执行安装过程

* 安装过程中, 如果是像我一样的 Intel 核显 + NVIDIA 独显的, **绝对不要装 OpenGL**, 否则重启后会陷入 login loop.

* 安装完成之后, 设置环境变量:

  ```shell
  export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64"
  export CUDA_HOME=/usr/local/cuda
  ```

## 安装 cuDNN

从[官网](https://developer.nvidia.com/cudnn)下载之后, 执行以下命令 (目前最新版本5.1):

```shell
tar xvzf cudnn-8.0-linux-x64-v5.1-ga.tgz
sudo cp cuda/include/cudnn.h /usr/local/cuda/include
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn.h /usr/local/cuda/lib64/libcudnn*
```

## 安装Tensorflow

这是最纠结的一步, 之前按照别人教程说最好从源码编译支持 GPU. 但是由于国内的网络环境, 源码编译需要下一堆的依赖包, 速度超级慢. 因此还是使用官网推荐的 pip 安装方式:

```shell
# Get pip
$ sudo apt-get install python-pip python-dev

# Ubuntu/Linux 64-bit, GPU enabled, Python 2.7
# Requires CUDA toolkit 8.0 and CuDNN v5. For other versions, see "Install from sources" below.
$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.11.0rc1-cp27-none-linux_x86_64.whl

# Python 2
$ sudo pip install --upgrade $TF_BINARY_URL
```

>* 可以先把`tensorflow-0.11.0rc1-cp27-none-linux_x86_64.whl`下下来, 本地执行安装命令
>* 可以使用国内的 pip 源, 加快安装依赖的速度

## 测试 Tensorflow

用下面的小例子来测试下 Tensorflow 安装得成不成功:

```shell
$ python
...
>>> import tensorflow as tf
>>> hello = tf.constant('Hello, TensorFlow!')
>>> sess = tf.Session()
>>> print(sess.run(hello))
Hello, TensorFlow!
>>> a = tf.constant(10)
>>> b = tf.constant(32)
>>> print(sess.run(a + b))
42
>>>
```

在 `import`的同时, 还会显示 CUDA 方面与 GPU 方面的信息.

至此大功告成!

## Docker for tensorflow

其实在这期间还试过直接用装了 Tensorflow 的 Docker 镜像, 也有支持 GPU 的版本. 各位如有兴趣可以试试:

* [Github - Using TensorFlow via Docker](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/tools/docker)
* [Github - An all-in-one Docker image for deep learning. Contains all the popular DL frameworks (TensorFlow, Theano, Torch, Caffe, etc.)](https://github.com/saiprashanths/dl-docker)