---
title: Solution for matplotlib importing error on macOS
date: 2016-11-01 21:57:58
categories:
  - Experience
tags:
  - Python
  - Matplotlib
  - macOS
---

今天在做 CS231n 的 Assignment #2 的时候遇到了导入 matplotlib.pyplot 的问题, 特此记录.

## 问题描述

打开 IPython Notebook 之后, 执行以下命令:

```python
import matplotlib.pyplot as plt
```

出现错误:

```python
ValueError: unknown locale: UTF-8
```

<!-- more -->

## 问题解决

把下面这些加到`~/.zshrc`或者是`~/.bash_profile`里面:

```shell
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```

同时, 如果用 iTerm 的话, 还需要在 Preference -> Profiles -> Terminal -> Environment 中, 取消选择 `Set locale variables automatically`.

**然而**又出现了下列报错:

```python
ImportError: cannot import name _thread
```

这个问题已经在最新的`six`和`dateutil`库中解决了, 然而 macOS 本身却还在使用旧版本的库. 解决方法如下:

* 执行以下命令安装最新版本的`six`

  ```shell
  $ sudo pip install six -U
  ```

* 开 python 看看是否还在使用旧版本的库:

  ```python
  >>> import six
  >>> six.__file__
  /System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six.pyc
  ```

  显然确实是这样

* 删除旧版本的库

  ```shell
  $ rm -rf /System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six.*
  ```

  这样就可以了, 之后 python 会使用我们之前新装的版本的`six`库

  ```python
  >>> import six
  >>> six.__file__
  '/Library/Python/2.7/site-packages/six.pyc'
  ```

之后再执行`import matplotlib.pyplot as plt`之后就没问题了.

说到底还是 macOS 的锅...