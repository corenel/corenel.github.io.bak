---
title: Train Caffe-YOLO on our own dataset
date: 2016-11-26 18:11:14
tags:
  - YOLO
  - Deep Learning
  - Object detection
  - Darknet
categories:
  - Experience
---

经过这几天不断地测试, YOLO 在 TX1 上跑得还是挺不错的, 符合我们实验室的要求. 但是 YOLO 依赖的 Darknet 框架还是太原始了, 不如 TensorFlow 或者 Caffe 用着顺手. 另外, 我负责的目标检测这一块还需要和梅老板写的新框架相结合, 所以更加需要把 YOLO 移植到一个成熟的框架上去.

很幸运的是, YOLO 在各个框架上的移植都有前人做过了, 比如 [darktf](https://github.com/thtrieu/darktf) 和 [caffe-yolo](https://github.com/yeahkun/caffe-yolo). 今天以 caffe-yolo 为例, 谈一下在其上使用自己的数据集来训练.

<!-- more -->

## Reformat our dataset as PASCAL VOC style

为了之后的方便起见, 首先将我们的数据集转成 PASCAL VOC 的标准的目录格式.

### Structure of PASCAL VOC dataset

其目录结构如下:

```
.
├── VOC2007
│   ├── Annotations
│   ├── ImageSets
│   ├── JPEGImages
│   ├── SegmentationClass
│   └── SegmentationObject
└── VOC2012
    ├── Annotations
    ├── ImageSets
    ├── JPEGImages
    ├── SegmentationClass
    └── SegmentationObject
```

其中`Annotations`目录放的是`.xml`文件, `JPEGImages`目录中存放的是对应的`.jpg`图像. 由于我们不做语义分割, 所以`SegmentationClass`与`SegmentationObject`对我们没什么用.

 `ImageSets`目录中结构如下, 主要关注的是`Main`文件夹中的`trainval.txt`, `train.txt` , `val.txt`以及`test.txt`四个文件.

```
.
├── Layout
│   ├── test.txt
│   ├── train.txt
│   ├── trainval.txt
│   └── val.txt
├── Main
│   ├── aeroplane_test.txt
│   ├── aeroplane_train.txt
│   ├── aeroplane_trainval.txt
│   ├── aeroplane_val.txt
│   ├── ...
│   ├── test.txt
│   ├── train.txt
│   ├── trainval.txt
│   └── val.txt
└── Segmentation
    ├── test.txt
    ├── train.txt
    ├── trainval.txt
    └── val.txt
```

###  Reformat our dataset

首先是把之前杂乱的图片文件名重新整理, 如下所示:

```
.
├── image00001.jpg
├── image00002.jpg
├── image00012.jpg
├── ...
├── image04524.jpg
├── image04525.jpg
└── image04526.jpg
```

随后用`labelImg`重新标注这些图. 标注完成后, 建立我们自己的数据集的结构, 并且将图片和标注放到对应的文件夹里:

```
.
├── ROB2017
│   ├── Annotations
│   ├── ImageSets
│   ├── JPEGImages
│   └── JPEGImages_original
└── scripts
    ├── clean.py
    ├── conf.json
    ├── convert_png2jpg.py
    └── split_dataset.py
```

之后写了几个脚本, 其中`clean.py`用来清理未标注的图片; `split_dataset.py`用来分割训练集验证集测试集, 并且保存到`ImageSets/Main`中.

至此, 把我们的数据集转成 PASCAL VOC 标准目录的工作就完成了, 可以进行下一步的训练工作.

## Train YOLO on Caffe

### Clone & Make

```bash
$ git clone https://github.com/yeahkun/caffe-yolo.git
$ cd caffe-yolo
$ cp Makefile.config.example Makefile.config
$ make -j8
```

若是出现`src/caffe/net.cpp:8:18: fatal error: hdf5.h: No such file or directory`这一错误, 可以照下文修改`Makefile.config`文件:

```diff
diff --git a/Makefile.config b/Makefile.config
index a873502..88828cc 100644
--- a/Makefile.config.example
+++ b/Makefile.config.example
@@ -69,8 +69,8 @@ PYTHON_LIB := /usr/lib
 # WITH_PYTHON_LAYER := 1

 # Whatever else you find you need goes here.
-INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include
-LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib
+INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include /usr/include/hdf5/serial/
+LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib /usr/lib/x86_64-linux-gnu/hdf5/serial/

 # If Homebrew is installed at a non standard location (for example your home directory) and you use it for general dependencies
 # INCLUDE_DIRS += $(shell brew --prefix)/include
```

同时还可以开启 cuDNN 以及修改 compute, 充分发挥 GTX1080 的性能:

```diff
## Refer to http://caffe.berkeleyvision.org/installation.html
# Contributions simplifying and improving our build system are welcome!

# cuDNN acceleration switch (uncomment to build with cuDNN).
-# USE_CUDNN := 1
+USE_CUDNN := 1

# CPU-only switch (uncomment to build without GPU support).
# CPU_ONLY := 1
...
# CUDA architecture setting: going with all of them.
# For CUDA < 6.0, comment the *_50 lines for compatibility.
CUDA_ARCH := -gencode arch=compute_20,code=sm_20 \
                -gencode arch=compute_20,code=sm_21 \
                -gencode arch=compute_30,code=sm_30 \
                -gencode arch=compute_35,code=sm_35 \
                -gencode arch=compute_50,code=sm_50 \
-                -gencode arch=compute_50,code=compute_50
+                -gencode arch=compute_50,code=compute_50 \
+                -gencode arch=compute_61,code=compute_61
```

### Data preparation

```bash
 $ cd data/yolo
 $ ln -s /your/path/to/VOCdevkit/ .
 $ python ./get_list.py
 # change related path in script convert.sh
 $ sudo rm -r lmdb
 $ mkdir lmdb
 $ ./convert.sh 
```

有一些注意点:

* 记得将`ln -s /your/path/to/VOCdevkit/ .`中的`/your/path/to/VOCdevkit/`换成自己数据集的路径, 例如`ln -s ~/data/ROBdevkit/ .`

* 修改`./get_list.py`:

  ```diff
  diff --git a/data/yolo/get_list.py b/data/yolo/get_list.py
  index f519f1a..73b9858 100755
  --- a/data/yolo/get_list.py
  +++ b/data/yolo/get_list.py
  @@ -3,12 +3,15 @@ import os

   trainval_jpeg_list = []
   trainval_xml_list = []
  -test07_jpeg_list = []
  -test07_xml_list = []
  -test12_jpeg_list = []
  -
  -for name in ["VOC2007", "VOC2012"]:
  -  voc_dir = os.path.join("VOCdevkit", name)
  +test_jpeg_list = []
  +test_xml_list = []
  +
  +for name in ['ROB2017']:
  +  # voc_dir = os.path.join("VOCdevkit", name)
  +  voc_dir = os.path.join('ROBdevkit', name)
     txt_fold = os.path.join(voc_dir, "ImageSets/Main")
     jpeg_fold = os.path.join(voc_dir, "JPEGImages")
     xml_fold = os.path.join(voc_dir, "Annotations")
  @@ -23,35 +26,49 @@ for name in ["VOC2007", "VOC2012"]:
             print trainval_jpeg_list[-1], "not exist"
           if not os.path.exists(trainval_xml_list[-1]):
             print trainval_xml_list[-1], "not exist"
  -  if name == "VOC2007":
  -    file_path = os.path.join(txt_fold, "test.txt")
  -    with open(file_path, 'r') as fp:
  -      for line in fp:
  -        line = line.strip()
  -        test07_jpeg_list.append(os.path.join(jpeg_fold, "{}.jpg".format(line)))
  -        test07_xml_list.append(os.path.join(xml_fold, "{}.xml".format(line)))
  -        if not os.path.exists(test07_jpeg_list[-1]):
  -          print test07_jpeg_list[-1], "not exist"
  -        if not os.path.exists(test07_xml_list[-1]):
  -          print test07_xml_list[-1], "not exist"
  -  elif name == "VOC2012":
  +  if name == "ROB2017":
       file_path = os.path.join(txt_fold, "test.txt")
       with open(file_path, 'r') as fp:
         for line in fp:
           line = line.strip()
  -        test12_jpeg_list.append(os.path.join(jpeg_fold, "{}.jpg".format(line)))
  -        if not os.path.exists(test12_jpeg_list[-1]):
  -          print test12_jpeg_list[-1], "not exist"
  +        test_jpeg_list.append(os.path.join(jpeg_fold, "{}.jpg".format(line)))
  +        test_xml_list.append(os.path.join(xml_fold, "{}.xml".format(line)))
  +        if not os.path.exists(test_jpeg_list[-1]):
  +          print test_jpeg_list[-1], "not exist"
  +        if not os.path.exists(test_xml_list[-1]):
  +          print test_xml_list[-1], "not exist"

   with open("trainval.txt", "w") as wr:
     for i in range(len(trainval_jpeg_list)):
       wr.write("{} {}\n".format(trainval_jpeg_list[i], trainval_xml_list[i]))

  -with open("test_2007.txt", "w") as wr:
  -  for i in range(len(test07_jpeg_list)):
  -    wr.write("{} {}\n".format(test07_jpeg_list[i], test07_xml_list[i]))
  -
  -with open("test_2012.txt", "w") as wr:
  -  for i in range(len(test12_jpeg_list)):
  -    wr.write("{}\n".format(test12_jpeg_list[i]))
  +with open("test.txt", "w") as wr:
  +  for i in range(len(test_jpeg_list)):
  +    wr.write("{} {}\n".format(test_jpeg_list[i], test_xml_list[i]))
  ```

* 修改`convert.sh`

  ```diff
  diff --git a/data/yolo/convert.sh b/data/yolo/convert.sh
  index 8a52525..a06eb69 100755
  --- a/data/yolo/convert.sh
  +++ b/data/yolo/convert.sh
  @@ -1,7 +1,7 @@
   #!/usr/bin/env sh

   CAFFE_ROOT=../..
  -ROOT_DIR=/your/path/to/vocroot/
  +ROOT_DIR=/home/m/data/
   LABEL_FILE=$CAFFE_ROOT/data/yolo/label_map.txt

   # 2007 + 2012 trainval
  @@ -10,13 +10,15 @@ LMDB_DIR=./lmdb/trainval_lmdb
   SHUFFLE=true

   # 2007 test
  -# LIST_FILE=$CAFFE_ROOT/data/yolo/test_2007.txt
  -# LMDB_DIR=./lmdb/test2007_lmdb
  +# LIST_FILE=$CAFFE_ROOT/data/yolo/test.txt
  +# LMDB_DIR=./lmdb/test_lmdb
   # SHUFFLE=false

   RESIZE_W=448
   RESIZE_H=448

   $CAFFE_ROOT/build/tools/convert_box_data --resize_width=$RESIZE_W --resize_height=$RESIZE_H \
     --label_file=$LABEL_FILE $ROOT_DIR $LIST_FILE $LMDB_DIR --encoded=true --encode_type=jpg --shuffle=$SHUFFLE
  ```

* 修改`label_map.txt`:

  ```diff
  diff --git a/data/yolo/label_map.txt b/data/yolo/label_map.txt
  index 1fe873a..bee8f82 100644
  --- a/data/yolo/label_map.txt
  +++ b/data/yolo/label_map.txt
  @@ -1,20 +1,3 @@
  -aeroplane 0
  -bicycle 1
  -bird 2
  -boat 3
  -bottle 4
  -bus 5
  -car 6
  -cat 7
  -chair 8
  -cow 9
  -diningtable 10
  -dog 11
  -horse 12
  -motorbike 13
  -person 14
  -pottedplant 15
  -sheep 16
  -sofa 17
  -train 18
  -tvmonitor 19
  +ball 0
  +goal 1
  +robot 2
  ```

### Train

```
  cd examples/yolo
  # change related path in script train.sh
  mkdir models
  nohup ./train.sh &
```

也有一些注意点:

* 修改`gnet_train.prototxt`:

  ```diff
  diff --git a/examples/yolo/gnet_train.prototxt b/examples/yolo/gnet_train.prototxt
  index 8483a32..da01daf 100644
  --- a/examples/yolo/gnet_train.prototxt
  +++ b/examples/yolo/gnet_train.prototxt
  @@ -36,7 +36,7 @@ layer {
       mean_value: 123
     }
     data_param {
  -    source: "../../data/yolo/lmdb/test2007_lmdb"
  +    source: "../../data/yolo/lmdb/test_lmdb"
       batch_size: 1
       side: 7
       backend: LMDB
  ```

* 修改`train.sh`:

  ```diff
  diff --git a/examples/yolo/train.sh b/examples/yolo/train.sh
  index 416e2b0..ecd0872 100755
  --- a/examples/yolo/train.sh
  +++ b/examples/yolo/train.sh
  @@ -3,8 +3,7 @@
   CAFFE_HOME=../..

   SOLVER=./gnet_solver.prototxt
  -WEIGHTS=/your/path/to/bvlc_googlenet.caffemodel
  +WEIGHTS=/home/m/workspace/caffe-yolo/models/bvlc_googlenet/bvlc_googlenet.caffemodel

   $CAFFE_HOME/build/tools/caffe train \
  -    --solver=$SOLVER --weights=$WEIGHTS --gpu=0,1
  +    --solver=$SOLVER --weights=$WEIGHTS --gpu=0
  ```

* 注意还要预先下载 GoogleNet 的[预训练权重文件](http://dl.caffe.berkeleyvision.org/bvlc_googlenet.caffemodel), 并且放在`caffe-yolo/models/bvlc_googlenet/`(当然放哪里是随便的, 注意改`train.sh`中的相应地址即可).

### Test

```
  # if everything goes well, the map of gnet_yolo_iter_32000.caffemodel may reach ~56.
  cd examples/yolo
  ./test.sh model_path gpu_id
```
(To be continued)