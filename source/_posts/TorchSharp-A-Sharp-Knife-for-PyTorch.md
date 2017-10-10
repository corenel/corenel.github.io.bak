---
title: TorchSharp - A Sharp Knife for PyTorch
date: 2017-10-10 21:53:36
categories:
  - Projects
tags:
  - PyTorch
  - Deep Learning
---

Recently I code several projects with PyTorch, and find it really a light-weight and easy-to-use deep learning framework. After coding thousands of lines, a thought emerges in my mind about what we can do for improving code re-use and accelerating programming. That's why I try to introduce [*torchsharp*](https://github.com/corenel/torchsharp), a sharp knife for PyTorch.

Note that this package is still **under early development**, and I'll add features continously in future. Issues ans Pull Requests are extremely welcomed.

<!-- more -->

## TorchSharp

[*torchsharp*](https://github.com/corenel/torchsharp) is a framework for PyTorch which provides a set of sharp utilities aiming at speeding up programming and encouraging code re-use. The repository consists of:

- [torchsharp.data](https://github.com/corenel/torchsharp#data) : Useful stuff about data operation such as dummy datasets and  image tranforms for data argumentation, etc.
- [torchsharp.model](https://github.com/corenel/torchsharp#data) : Helpful fucntions about model training process such as initializer and metrics, etc.
- [torchsharp.utils](https://github.com/corenel/torchsharp#data) : Other tools like logger and timer, etc.

Apart from *torchsharp*, there're also two auxiliary libraries for PyTorch - `torchzoo` and `pytorch-starter-kit`.

## TorchZoo

[*torchzoo*](https://github.com/corenel/torchzoo) is a zoo of models and datasets for PyTorch. Most of them are used frequently in my research life but not provided by `torchvision`.

This repository consists of:

- [torchzoo.datasets](#datasets) : Data loaders for popular vision datasets.
- [torchzoo.models](#models) : Definitions for popular model architectures.

## PyTorch Starter Kit

[*pytorch-starter-kit*](https://github.com/corenel/pytorch-starter-kit) is a demo project and quick starter kit for PyTorch.

