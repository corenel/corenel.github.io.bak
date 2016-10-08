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

主要看`scan` 这个成员函数. 

```C++
void LineScanner::scan(const ScanGrid::Line& line, const int top, const float minColorRatio, ScanlineRegions& scanlineRegions) const {...}
```

这个函数有四个输入参数, 分别是

* 要扫描的线`line`
* 扫描的上界`top`
* 对于不同颜色的区分度的比值`minColorRatio`(与之后判断隔了几个不同颜色的点的两个区域是否要连在一起有关)
* 扫描后得到的区域`scanlineRegions`

然后来看看具体的实现. 首先是一些变量的指定:

```C++
void LineScanner::scan(const ScanGrid::Line& line, const int top, const float minColorRatio, ScanlineRegions& scanlineRegions) const
{
  // 当前竖线的横坐标
  const int x = line.x;
  // std::deque::emplace_back Appends a new element to the end of the container.
  // 在区域 scanlineRegions 的 scanlines 向量容器的最后加一个用 x 初始化的元素. 
  scanlineRegions.scanlines.emplace_back(x); 
  // std::array::back Returns reference to the last element in the container.
  // 前面新建的元素内的 regions 向量
  auto& regions = scanlineRegions.scanlines.back().regions; 

  // 竖线的起始纵坐标指针
  // ScanGridProvider.h 实现中
  // const size_t yMaxIndex = std::upper_bound(scanGrid.y.begin(), scanGrid.y.end(), yMax + 1, std::greater<int>()) - scanGrid.y.begin();
  auto y = scanGrid.y.begin() + line.yMaxIndex;
  // 竖线的终止纵坐标指针
  const auto yEnd = scanGrid.y.end();
  // 扫描步长
  const int widthStep = image.widthStep;
  
  if(y != yEnd && *y > top && line.yMax - 1 > top) {...}
}
```

接着是一个条件判断, 主要是看这条竖线能不能用来扫描:

* 起始纵坐标指针`y` 是否已经与终止纵坐标指针` yEnd`重合
* 起始纵坐标`*y`是否高于场地上界`top`
* 竖线纵坐标最大值`yMax` 是否高于场地上界` top`

在这个`if`语句里面, 我们开始进行对于竖线的颜色扫描与区域生成的工作.

首先还是一些变量的指定, 以及操作完成之后将检测到的:

```C++
  if(y != yEnd && *y > top && line.yMax - 1 > top)
  {
    // 前一个点的纵坐标
    // ScanGridProvider.h 实现中 int yMax = std::min(yStarts2[i++], theCameraInfo.height);
    int prevY = line.yMax - 1 > *y ? line.yMax - 1 : *y++;
    // 当前点的纵坐标
    int currentY = prevY + 1;
    // 前一个点的像素信息
    const Image::Pixel* pImg = &image[prevY][x];
    // 前一个点的颜色分类
    ColorTable::Colors currentColor = colorTable[*pImg];
    
    for(; y != yEnd && *y > top; ++y) {...}
    
    ASSERT(currentY > top + 1);
    regions.emplace_back(currentY, top + 1, currentColor);
  }
```

中间是一个` for` 循环, 用来遍历竖线上的所有点.

```C++
    for(; y != yEnd && *y > top; ++y)
    {
      // 下一个点的像素信息
      pImg += (*y - prevY) * widthStep;

      // 下一点的颜色分类
      const ColorTable::Colors& color = colorTable[*pImg];
      // If color changes, determine edge position between last and current scanpoint
      if(color.colors != currentColor.colors)
      {
        // 根据minColorRatio设定不同颜色区域相隔的像素数量阈值
        const int otherColorThreshold = std::max(static_cast<int>((prevY - *y) * minColorRatio), 1);
        // 起始纵坐标向上移阈值个点的纵坐标
        const int yMin = std::max(*y - otherColorThreshold + 1, 0);
        // 不同颜色的像素数量计数器
        int counter = 0;
        // 前两个点的纵坐标
        int yy = std::min(prevY - 1, line.yMax - 1);
        // 遍历从 yy 到 yMin , 计数不同颜色像素的个数
        for(const Image::Pixel* pImg2 = pImg + (yy - *y) * widthStep; yy >= yMin && counter < otherColorThreshold; --yy, pImg2 -= image.widthStep)
          if(colorTable[*pImg2].colors != currentColor.colors)
            ++counter;
          else
            counter = 0;

        // Enough pixels of different colors were found: end previous region and start a new one.
        // 如果发现了足够数量的不同颜色像素, 那么就结束原来的区域, 并开始记录一个新的区域
        if(counter == otherColorThreshold)
        {
          yy += otherColorThreshold + 1;
          ASSERT(currentY > yy);
          regions.emplace_back(currentY, yy, currentColor);
          currentColor = color;
          currentY = yy;
        }
      }
      prevY = *y;
    }
```

(本文中略有缺陷, 待分析了`ScanGridProvider`之后再做补充)