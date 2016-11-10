---
title: YOLO on NVIDIA Jetson TX1
date: 2016-11-10 20:36:34
tags:
  - NVIDIA Jetson TX1
  - YOLO
  - Deep Learning
  - Object detection
  - Darknet
categories:
  - Experience

---

实验室昨天到了 NVIDIA 的 [Jetson TX1](http://www.nvidia.com/object/jetson-tx1-module.html), 可以说是移动端比较好的带GPU的开发板子了, 于是可以试试在移动端上用YOLO (You Look Only Once) 来做目标识别.

<!-- more -->

## Specifications

| GPU          | 1 TFLOP/s 256-core with [NVIDIA Maxwell™ Architecture](https://developer.nvidia.com/maxwell-compute-architecture) |
| ------------ | ---------------------------------------- |
| CPU          | 64-bit ARM® A57 CPUs                     |
| Memory       | 4 GB LPDDR4, 25.6 GB/s                   |
| Video decode | 4K 60 Hz                                 |
| Video encode | 4K 30 Hz                                 |
| CSI          | Up to 6 cameras, 1400 Mpix/s             |
| Display      | 2x DSI, 1x eDP 1.4, 1x DP 1.2/HDMI       |
| Connectivity | Connects to 802.11ac Wi-Fi and Bluetooth-enabled devices |
| Networking   | 1 Gigabit Ethernet                       |
| PCIE         | Gen 2 1x1 + 1x4                          |
| Storage      | 16 GB eMMC, SDIO, SATA                   |
| Other        | 3x UART, 3x SPI, 4x I2C, 4x I2S, GPIOs   |

> 标称1TFlops这个比较猛, 都快比得上XPS 15 9550的GTX960M了.

## Environment

到手TX1之后发现是 Ubuntu 14.04 32-bit 的, 果断先用 [JetPack 2.3](https://developer.nvidia.com/embedded/jetpack) 升级到 Ubuntu 16.04 64bit. 用 JetPack 刷机的好处是能够顺便配置一大堆库, 比如说 CUDA, cuDNN, OpenCV4Terga 之类的.

* JetPack 在刷机之前需要下载一大堆 Package, 因此在国内的话最好在运行前配置好代理.

* JetPack 刷完系统后会要求按 reset 键重启进 GUI, 之后就是不断地安装包安装依赖的过程, 因此在国内的话可以趁此机会修改`/etc/apt/source.list`:

  ```
  deb http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-updates main restricted universe multiverse
  deb-src http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-updates main restricted universe multiverse
  deb http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-security main restricted universe multiverse
  deb-src http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-security main restricted universe multiverse
  deb http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-backports main restricted universe multiverse
  deb-src http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial-backports main restricted universe multiverse
  deb http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial main universe restricted
  deb-src http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial main universe restricted
  deb http://mirrors.ustc.edu.cn/ubuntu-ports/ xenial universe
  ```

  > 注意arm64的源与普通的x86-64的源是不一样的.

## Darknet

为了用 Webcam demo, 所以需要 Compiling with CUDA and OpenCV:

```bash
$ git clone https://github.com/pjreddie/darknet.git
$ cd darknet
$ sed 's/GPU=0/GPU=1/g' Makefile
$ sed 's/CUDNN=0/CUDNN=1/g' Makefile
$ sed 's/OPENCV=0/OPENCV=1/g' Makefile
$ make -j4
```

上面编译完了之后输入以下指令, 与输出结果相对应, 那就说明成功了

```bash
$ ./darknet
$ usage: ./darknet <function>
```

## YOLO

先去下训练好的[权重](http://pjreddie.com/darknet/yolo/#models), 建议选 yolo-tiny 的, 吃内存少. (毕竟 TX1 只有 4GB 内存, 还是 CPU 和 GPU 共用的)

之后运行一下命令即可测试 Real-Time Detection on a Webcam:

```bash
$ ./darknet yolo demo cfg/tiny-yolo.cfg tiny-yolo.weights
```

实际效果如下:

 ![yolo-tiny_on_TX1](/images/yolo-tiny_on_TX1.png)

左下为摄像头实拍屏幕的画面, 可以看出检测结果还是很不错的.

帧数有12fps左右, 基本上达到实时要求.

## Re-train

重新训练 YOLO, 使其识别球与球门.

(To be continued...)

## Reference

* [YOLO: Real-Time Object Detection](http://pjreddie.com/darknet/yolo/)
* [Start Training YOLO with Our Own Data](http://guanghan.info/blog/en/my-works/train-yolo/)