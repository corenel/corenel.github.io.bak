---
title: B-Human Code 浅析 - LineScanner
date: 2016-10-07 21:58:08
categories:
  - Code Anaylsis
tags:
  - RoboCup
  - C++
---

> 由于 ZJUDancer 组内需要重写视觉相关部分的代码, 因此最近开始看其他组视觉方面的实现. 而 B-Human 是标准组的老牌强队, 常年冠军, 很有借鉴价值.
>
> 本系列的文章主要是根据他们的开源代码库`CodeRelease2015`以及历年的 Team Description Paper 写成. 由于个人的 C++ 水平有限, 难免有缺漏之处, 望发现后不吝赐教.

# B-Human Code 浅析

## Perception

### LineScanner

> The file declares a class that creates colored regions on a single vertical scanline.
>
> The class is based on Arne Böckmann's original implementation of this idea.
>
> @author Thomas Röfer

这个类提供了以竖线的形式扫描图像, 并且找出线上具有相同颜色的区域的功能. 对于之后对场地边缘, 球, 机器人, 球门等的检测提供了基础.

![vertical_scan.png](/images/vertical_scan.png)

<!-- more -->

在`LineScanner.h`中的类定义:

```C++
class LineScanner
{
private:
  const ColorTable& colorTable;
  const Image& image;
  const ScanGrid& scanGrid;

public:
  LineScanner(const ColorTable& colorTable,
              const Image& image,
              const ScanGrid& scanGrid)
  : colorTable(colorTable),
    image(image),
    scanGrid(scanGrid) {}

  /**
   * Scan vertically and add a new scanline with colored regions.
   * @param line Description of the line to be scanned.
   * @param top Upper bound for the pixels scanned (exclusive).
   * @param minColorRatio The ratio of pixels of a different color that is expected 
   *                      after an edge (relative to the step width).
   * @param scanlineRegions A new scanline containing the regions found will be added
   *                        to this object.
   */
  void scan(const ScanGrid::Line& line, const int top, const float minColorRatio, ScanlineRegions& scanlineRegions) const;
};
```

主要看`scan` 这个成员函数. 这个函数有四个输入参数, 分别是

* 要扫描的线`line`
* 扫描的线的上界`top`(与场地边界检测有关)
* 对于不同颜色的区分度的比值`minColorRatio`(与之后判断隔了几个不同颜色的点的两个区域是否要连在一起有关)
* 扫描后得到的区域`scanlineRegions`

然后来看看具体的实现.首先是一些变量的指定:

```C++
  // 当前竖线的横坐标
  const int x = line.x;
  // std::deque::emplace_back Appends a new element to the end of the container.
  // 在区域 scanlineRegions 的 scanlines 向量容器的最后加一个用 x 初始化的元素. 
  scanlineRegions.scanlines.emplace_back(x); 
  // std::array::back Returns reference to the last element in the container.
  // 前面新建的元素内的 regions 向量
  auto& regions = scanlineRegions.scanlines.back().regions; 

  // 竖线的起始纵坐标
  auto y = scanGrid.y.begin() + line.yMaxIndex;
  // 竖线的终止纵坐标
  const auto yEnd = scanGrid.y.end();
  //  扫描步长
  const int widthStep = image.widthStep;
```

(TBD… 今天要写自动化综合实验的开题报告, 头都大了)