---
title: Train YOLO on our own dataset
date: 2016-11-12 11:20:22
tags:
  - YOLO
  - Deep Learning
  - Object detection
  - Darknet
categories:
  - Experience
---

之前到手 TX1 之后试了一下 YOLO 的 Demo, 感觉很是不错, 帧数勉强达到实时要求, 因此就萌生了使用自己的数据集来训练看看效果的想法. 

<!-- more -->

## Dataset

### Get The ImageNet Data

为了最大限度地利用资源 (其实是为了偷懒, 但是之后发现给自己挖了个大坑), 我用的是从 ImageNet 上的图片与 Bounding Box 标注. 本次使用了两个类别, 分别是 [ball](http://imagenet.stanford.edu/synset?wnid=n04254680#) 和 [goal](http://imagenet.stanford.edu/synset?wnid=n03820318).

> * 在`Downloads`内可以可以下到`images in the synset`以及`Bounding Boxes`
> * ImageNet 里的图片看起来多, 实际上摊到每个子类上的就1000多张, 能下下来的就500多, 能直接和 Bounding Box 标注匹配的只剩此案100多了TAT. 果然还是需要自己标注, 自力更生.
> * 另外 ImageNet 上的 Bounding Box 信息只有当前类别的. 比如说我下了 goal 的 Bounding Box, 其实某张图片里还有 ball 等 Object, 但是并不会被标出来. 这对于之后的训练有一定影响.
> * 注意如果要从 ImageNet 上下原始图片的话是需要注册账号, 并且通过邮箱认证的 (还不能是 Gmail 这类的可以免费注册的邮箱, 需要机构或者学校邮箱才行).

下好的文件结构如下:

```
.
├── Annotation
│   ├── n03820318
│   └── n04254680
└── images
    ├── n03820318
    └── n04254680
```

其中`Annotation`目录下放标注, `images`目录下放图片.

### Convert labels for darknet

ImageNet 上下下来的 Bounding Box 信息是 Pascal VOC 的 xml 格式:

```xml
<annotation>
	<folder>n03820318</folder>
	<filename>n03820318_101</filename>
	<source>
		<database>ImageNet database</database>
	</source>
	<size>
		<width>500</width>
		<height>333</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	<object>
		<name>n03820318</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>19</xmin>
			<ymin>43</ymin>
			<xmax>499</xmax>
			<ymax>214</ymax>
		</bndbox>
	</object>
</annotation>
```

而 darknet 需要的标注文件是 txt 格式:

```
<object-class> <x> <y> <width> <height>
```

于是就需要对于 labels 进行转换. 我写了[一份 Python 脚本](https://github.com/corenel/darknet/blob/yuthon/scripts/imagenet_bb_label.py), 将其放在数据集的根目录下执行即可:

```bash
$ python imagenet_bb_label.py
```

之后得到目录结构如下:

```
.
├── Annotation
│   ├── n03820318
│   └── n04254680
├── imagenet_bb_label.py
├── images
│   ├── n03820318
│   └── n04254680
├── labels
│   ├── n03820318
│   └── n04254680
└── train.txt
```

其中, `labels`目录保存着转换后的 Bounding Box 信息, `train.txt`则包含了所有图片文件的绝对路径.

## Modify darknet

由于 class 的数量和名字都变了, 因此需要修改下 YOLO 的源代码.

首先是从 clone repository. 可以选择 clone [官方的](https://github.com/pjreddie/darknet), 也可以直接下[我修改好的](https://github.com/corenel/darknet). 此处里官方 repo 为例.

```bash
$ git clone https://github.com/pjreddie/darknet.git
```

由于最新的 commit 修改了 label image 的显示方法, 并且改变了源文件里类别的定义, 因此需要先切回之前的 commit:

```bash
$ git checkout 73f7aacf35ec9b1d0f9de9ddf38af0889f213e99
```

首先修改`Makefile`:

```
GPU=1
CUDNN=1
OPENCV=1
```

之后是`src/yolo.c`, 主要是类别名称和数量, 以及`train.txt`与`backup`的地址.(`backup`目录用来存放训练得到的weights)

```c
// ...
#define NUM_CLASS 2
char *voc_names[] = {"ball", "goal"};
image voc_labels[NUM_CLASS];

void train_yolo(char *cfgfile, char *weightfile)
{
    char *train_images = "/home/m/workspace/dataset/train.txt";
    char *backup_directory = "/home/m/workspace/backup/";
}
// ...
void test_yolo(char *cfgfile, char *weightfile, char *filename, float thresh)
{
  // ...
  draw_detections(im, l.side*l.side*l.n, thresh, boxes, probs, voc_names, voc_labels, NUM_CLASS);
  // ...
}
void run_yolo(int argc, char **argv)
{
  // ...
  for(i = 0; i < NUM_CLASS; ++i){
    // ...
  }
  // ...
  else if(0==strcmp(argv[2], "demo")) demo(cfg, weights, thresh, cam_index, filename, voc_names, voc_labels, NUM_CLASS, frame_skip);
}
```

接着是`yolo_kernels.cu`:

```c
// ...
#define NUM_CLASS 2
// ...
void *detect_in_thread(void *ptr)
{
  // ...
  draw_detections(det, l.side*l.side*l.n, demo_thresh, boxes, probs, voc_names, voc_labels, NUM_CLASS);
  // ...
}
// ...
```

然后是`cfg`(建议新建一个, 我的[配置](https://github.com/corenel/darknet/blob/yuthon/cfg/tiny-yolo.train.cfg)可作为参考):

```ini
# ...
[connected]
# output = Side x Side x (2x5 + class_num)
output= 588
activation=linear

[detection]
# modify the class num
classes=2
coords=4
rescore=1
side=7
num=2
softmax=0
sqrt=1
jitter=.2

object_scale=1
noobject_scale=.5
class_scale=1
coord_scale=5
```

最后, 如果使用了新的 class 的话, 需要在`data/labels`里修改`make_labels.py`并执行来生成新的 label image:

```python
import os

l = ["ball", "goal"]

for word in l:
    os.system("convert -fill black -background white -bordercolor white -border 4 -font ubuntu-mono -pointsize 18 label:\"%s\" \"%s.png\""%(word, word))
```

至此前期准备完成, 可以开始训练了.

## Training

首先还需要下载 pre-trained weights.

* 全尺寸的 YOLO 使用[这个](http://pjreddie.com/media/files/extraction.conv.weights)
* tiny-YOLO 使用[这个](http://pjreddie.com/media/files/darknet.conv.weights)

之后就是慢慢训练之路了:

```bash
$ cd darknet
$ make -j8
$ ./darknet yolo train cfg/tiny-yolo.train.cfg darknet.conv.weights
```

我用上述的 dataset 训练 tiny-YOLO, 从 22:43 一直到 05:12, 总计 6 个小时左右, 最终得到`tiny-yolo_final.weights`文件.

之后就可以拿来 test 或者 demo 了:

```bash
$ ./darknet yolo test cfg/tiny-yolo.train.cfg tiny-yolo_final.weights
```

or

```bash
$ ./darknet yolo demo cfg/tiny-yolo.train.cfg tiny-yolo_final.weights
```

## Results

![yolo-tiny_on_TX1_ball](/images/yolo-tiny_on_TX1_ball.png)

![yolo-tiny_on_TX1_goal](/images/yolo-tiny_on_TX1_goal.png)

## Reference

* [Start Training YOLO with Our Own Data](http://guanghan.info/blog/en/my-works/train-yolo/)
* [Training YOLO](http://pjreddie.com/darknet/yolo/#train)