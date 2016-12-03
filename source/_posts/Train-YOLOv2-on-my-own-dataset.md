---
title: Train YOLOv2 on my own dataset
date: 2016-12-03 11:29:04
tags:
  - YOLO
  - Deep Learning
  - Object detection
  - Darknet
categories:
  - Experience
---

最近在看 Darkflow 的时候, 发现连 YOLOv2 都出了, 据称 mAP 和速度都提升了不少, 立马 clone 下来试了一番.

<!-- more -->

## Instruction

### Comparison

下面是[官网](http://pjreddie.com/darknet/yolo/)挂出来的一个对比表, 可以看出, YOLOv2 有 76.8 的mAP, 和 SSD500 相同, 但是 FPS 不知比 SSD 高到哪里去了. YOLOv2 544x544 提升到了 78.6 mAP, 比 Faster-RCNN 的 Baseline (ResNet-101, VOC07+12) 的 76.4 mAP 高, 但是比其 Baseline+++ (ResNet-101, COCO+VOC2007+VOC2012) 的 85.6 mAP 还是逊色了不少. 不过官网没有挂出来 training on Pascal + COCO data and testing on Pascal data 的数据, 想见应该也会在 80 mAP 以上.

更加可喜的是, Tiny-YOLOv2比之前的Tiny-YOLO高出了52FPS, 达到了惊人的207FPS, 想必在 TX1 上跑的话应该也能上20FPS.

| Model          | Train         | Test     | mAP  | FLOPS    | FPS  |
| -------------- | ------------- | -------- | ---- | -------- | ---- |
| Old YOLO       | VOC 2007+2012 | 2007     | 63.4 | 40.19 Bn | 45   |
| SSD300         | VOC 2007+2012 | 2007     | 74.3 | -        | 46   |
| SSD500         | VOC 2007+2012 | 2007     | 76.8 | -        | 19   |
| YOLOv2         | VOC 2007+2012 | 2007     | 76.8 | 34.90 Bn | 67   |
| YOLOv2 544x544 | VOC 2007+2012 | 2007     | 78.6 | 59.68 Bn | 40   |
| Tiny YOLO      | VOC 2007+2012 | 2007     | 57.1 | 6.97 Bn  | 207  |
| SSD300         | COCO trainval | test-dev | 41.2 | -        | 46   |
| SSD500         | COCO trainval | test-dev | 46.5 | -        | 19   |
| YOLOv2 544x544 | COCO trainval | test-dev | 44.0 | 59.68 Bn | 40   |

### What's New in Version 2

具体的文章还没在 Arxiv 上挂出来, 按照目前透露的信息, 主要是像 SSD 和 Overfeat 那样全部都用了卷积层, 而不是后面还跟着全连接层. 但是不同的是, 仍然是对整个图像进行训练. 同时还借鉴了 Faster-RCNN, 调整了 Bounding Box 的优先级, 不直接预测`w`, `h`, 但是仍然是直接预测`x`, `y`坐标.

### Video

官网还挂了一个用 YOLOv2 识别过的 007 的 Trailer, 配乐+Bounding Box 使得这个视频莫名其妙地非常搞笑, 建议去[看看](https://youtu.be/VOC3huqHrss).

## Training

下面讲讲使用 YOLOv2 在我自己做的数据集 ROBdevkit 上的训练过程.

### Make

```bash
$ git clone https://github.com/pjreddie/darknet
$ cd darknet
$ make -j8
```

在`make`之前, 为了最大发挥机器的性能, 还需要修改`Makefile`:

```diff
diff --git a/Makefile b/Makefile
index 3d3d5e4..dd7a33d 100644
--- a/Makefile
+++ b/Makefile
@@ -1,6 +1,6 @@
-GPU=0
-CUDNN=0
-OPENCV=0
+GPU=1
+CUDNN=1
+OPENCV=1
 DEBUG=0

 ARCH= -gencode arch=compute_20,code=[sm_20,sm_21] \
@@ -10,47 +10,47 @@ ARCH= -gencode arch=compute_20,code=[sm_20,sm_21] \
       -gencode arch=compute_52,code=[sm_52,compute_52]

 # This is what I use, uncomment if you know your arch and want to specify
-# ARCH=  -gencode arch=compute_52,code=compute_52
+ARCH=  -gencode arch=compute_61,code=compute_61
```

### Prepare

YOLOv2这次不用改`yolo.c`源文件了, 只需要修改一些配置文件即可, 大大方便了我们用自己的数据集训练.

首先修改`data/voc.names`, 另存为`data/rob.names`:

```ini
ball
goal
robot
```

修改`cfg/voc.data`, 另存为`cfg/rob.names`:

```Ini
classes= 3
train  = /home/m/data/ROBdevkit/train.txt
valid  = /home/m/data/ROBdevkit/2017_test.txt
names = data/rob.names
backup = /home/m/workspace/backup/
```

其次修改`script/voc_label.py`, 另存为`script/rob_label.py`:

```python
import xml.etree.ElementTree as ET
import pickle
import os
from os import listdir, getcwd
from os.path import join

sets = [('2017', 'train'), ('2017', 'val'), ('2017', 'test')]

classes = ['ball', 'goal', 'robot']

...
```

然后在`ROBdevkit`的根目录下执行`python rob_label.py`来生成 label 文件, 并用`cat 2017_* > train.txt`生成`train.txt`. 最终目录结构为:

```
.
├── ROBdevkit
│   ├── 2017_test.txt
│   ├── 2017_train.txt
│   ├── 2017_val.txt
│   ├── results
│   ├── ROB2017
│   ├── scripts
│   ├── train.txt
│   └── VOC0712
├── rob_label.py
```

最后, 修改`cfg/voc.data`, 另存为`cfg/rob.names`:

```diff
diff --git a/cfg/tiny-yolo-voc.cfg b/cfg/tiny-yolo-rob.cfg
-- a/cfg/tiny-yolo-voc.cfg
++ b/cfg/tiny-yolo-rob.cfg
[convolutional]
size=1
stride=1
pad=1
-filters=250
+filters=40
activation=linear

[region]
anchors = 1.08,1.19,  3.42,4.41,  6.63,11.38,  9.42,5.11,  16.62,10.52
bias_match=1
-classes=20
+classes=3
coords=4
num=5
softmax=1
jitter=.2
rescore=1

object_scale=5
noobject_scale=1
class_scale=1
coord_scale=1

absolute=1
thresh = .6
random=1
```

> 注意`region`的前一层的`filter`值的计算方法为$num \times (classes+coords+1)$.

### Train

```bash
$ ./darknet detector train cfg/rob.data cfg/tiny-yolo-rob.cfg darknet.conv.weights
```

