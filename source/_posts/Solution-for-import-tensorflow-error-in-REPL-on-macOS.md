---
title: Solution for 'import tensorflow' error in REPL on macOS
date: 2016-11-02 11:32:01
categories:
  - Experience
tags:
  - Python
  - Tensorflow
  - macOS
---

## Description

使用 pip 安装 Tensorflow 之后, 在 REPL 中执行`import tensorflow as tf`之后, 报出以下错误:

<!-- more -->

```python
Python 2.7.10 (default, Oct 23 2015, 19:19:21)
[GCC 4.2.1 Compatible Apple LLVM 7.0.0 (clang-700.0.59.5)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import tensorflow as tf
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/Library/Python/2.7/site-packages/tensorflow/__init__.py", line 23, in <module>
    from tensorflow.python import *
  File "/Library/Python/2.7/site-packages/tensorflow/python/__init__.py", line 53, in <module>
    from tensorflow.core.framework.graph_pb2 import *
  File "/Library/Python/2.7/site-packages/tensorflow/core/framework/graph_pb2.py", line 16, in <module>
    from tensorflow.core.framework import node_def_pb2 as tensorflow_dot_core_dot_framework_dot_node__def__pb2
  File "/Library/Python/2.7/site-packages/tensorflow/core/framework/node_def_pb2.py", line 16, in <module>
    from tensorflow.core.framework import attr_value_pb2 as tensorflow_dot_core_dot_framework_dot_attr__value__pb2
  File "/Library/Python/2.7/site-packages/tensorflow/core/framework/attr_value_pb2.py", line 16, in <module>
    from tensorflow.core.framework import tensor_pb2 as tensorflow_dot_core_dot_framework_dot_tensor__pb2
  File "/Library/Python/2.7/site-packages/tensorflow/core/framework/tensor_pb2.py", line 16, in <module>
    from tensorflow.core.framework import tensor_shape_pb2 as tensorflow_dot_core_dot_framework_dot_tensor__shape__pb2
  File "/Library/Python/2.7/site-packages/tensorflow/core/framework/tensor_shape_pb2.py", line 22, in <module>
    serialized_pb=_b('\n,tensorflow/core/framework/tensor_shape.proto\x12\ntensorflow\"z\n\x10TensorShapeProto\x12-\n\x03\x64im\x18\x02 \x03(\x0b\x32 .tensorflow.TensorShapeProto.Dim\x12\x14\n\x0cunknown_rank\x18\x03 \x01(\x08\x1a!\n\x03\x44im\x12\x0c\n\x04size\x18\x01 \x01(\x03\x12\x0c\n\x04name\x18\x02 \x01(\tB2\n\x18org.tensorflow.frameworkB\x11TensorShapeProtosP\x01\xf8\x01\x01\x62\x06proto3')
TypeError: __init__() got an unexpected keyword argument 'syntax'
```

## Solution

经检查是`protobuf`的锅. TF 需要`protobuf>=3.0.0a3`, 而macOS里似乎有两份`protobuf`, 一份是之前装的2.6.1, 另外一份是随着 TF 装的. 默认似乎是调用到了 2.6.1 的那个版本.

找到原因就好办了, 卸掉重装呗:

```shell
$ sudo pip uninstall protobuf
$ sudo pip uninstall tensorflow
$ brew uninstall protobuf
$ sudo pip install --upgrade $TF_BINARY_URL
```

之后就好了, 确认一下是不是调用了3.0.0的版本:

```python
>>> import google.protobuf
>>> google.protobuf.__file__
'/Library/Python/2.7/site-packages/google/protobuf/__init__.pyc'
>>> google.protobuf.__version__
'3.0.0'
```

## Reference

* [Error in python after 'import tensorflow': TypeError: __init__() got an unexpected keyword argument 'syntax'](http://stackoverflow.com/questions/33622842/error-in-python-after-import-tensorflow-typeerror-init-got-an-unexpect)