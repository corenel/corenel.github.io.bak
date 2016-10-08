---
title: B-Human Code 浅析 - ScanGridProvider
date: 2016-10-08 19:18:19
categories:
  - Code Anaylsis
tags:
  - RoboCup
  - C++
---

> 本系列的文章主要是根据他们的开源代码库`CodeRelease2015`以及历年的 Team Description Paper 写成. 由于个人的 C++ 水平有限, 难免有缺漏之处, 望发现后不吝赐教.

# B-Human Code 浅析

## Perception

### ScanGrid

首先来看一个基础的类` ScanGrid`, 里面定义了由扫描线组成的网格. 这个类在`ScanGridProvider`以及`LineScanner` 中都有用到. 

<!-- more -->

头文件如下:

```C++
#pragma once

#include "../../Tools/Streams/AutoStreamable.h"

STREAMABLE(ScanGrid,
{
  STREAMABLE(Line,
  {
    Line() = default;
    Line(int x, int y, unsigned yMaxIndex),

    (int) x, /**< x coordinate of the scanline. */
    (int) yMax, /**< Maximum y coordinate (exclusive). */
    (unsigned) yMaxIndex, /**< Index of the lowest y coordinate relevant for this scanline. */
  });

  void draw() const,

  (std::vector<int>) y, /**< All possible y coordinates of pixels to be scanned. */
  (std::vector<Line>) lines, /**< Decription of all scanlines. */
  (int)(0) fieldLimit, /**< Upper bound for all scanlines (exclusive). */
  (unsigned)(0) lowResStart, /**< First index of low res grid. */
  (unsigned)(1) lowResStep, /**< Steps between low res grid lines. */
});

inline ScanGrid::Line::Line(int x, int yMax, unsigned yMaxIndex) :
  x(x), yMax(yMax), yMaxIndex(yMaxIndex)
{}

```

原本的注释已经很清楚了, 我就不再多说什么.

### ScanGridProvider

这个模块主要是提供了一个由一堆竖线组成的扫描图像的网格. 生成的网格可供`LineScanner`使用. 头文件如下:

```C++
#pragma once

#include "../../../Tools/Module/Module.h"
#include "../../../Representations/Configuration/FieldDimensions.h"
#include "../../../Representations/Infrastructure/CameraInfo.h"
#include "../../../Representations/Perception/BodyContour.h"
#include "../../../Representations/Perception/CameraMatrix.h"
#include "../../../Representations/Perception/ScanGrid.h"

MODULE(ScanGridProvider,
{,
  REQUIRES(BodyContour),
  REQUIRES(CameraInfo),
  REQUIRES(CameraMatrix),
  REQUIRES(FieldDimensions),
  PROVIDES(ScanGrid),
  DEFINES_PARAMETERS(
  {,
    (int)(3) minStepSize, /**< The minimum pixel distance between two neigboring scanlines. */
    (int)(25) minNumOfLowResScanlines, /**< The minimum number of scanlines for low resolution. */
    (float)(0.9f) lineWidthRatio, /**< The ratio of field line width that is sampled when scanning the image. */
    (float)(0.8f) ballWidthRatio, /**< The ratio of ball width that is sampled when scanning the image. */
  }),
});

class ScanGridProvider : public ScanGridProviderBase
{
  void update(ScanGrid& scanGrid);
};

```

看看具体实现.