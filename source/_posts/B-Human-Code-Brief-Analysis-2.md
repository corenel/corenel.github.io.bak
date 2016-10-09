---
title: B-Human Code 浅析 - ScanGridProvider
date: 2016-10-08 19:18:19
categories:
  - Code Anaylsis
tags:
  - RoboCup
  - C++
---

> 本系列的文章主要是根据 B-Human 的开源代码库`CodeRelease2015`以及历年的 Team Description Paper 写成. 由于个人的 C++ 水平有限, 难免有缺漏之处, 望发现后不吝赐教.

# B-Human Code 浅析

## Perception

### ScanGrid

首先来看一个基础的类` ScanGrid`, 里面定义了由扫描线组成的网格. 这个类在`ScanGridProvider`以及`LineScanner` 中都有用到. 

<!-- more -->

头文件如下:

```C++
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

首先是一段初始化以及是否继续生成网格的判断:

* 摄像头参数矩阵未给定
* 场地边界上的最远点不在视野内
* 场地边界高度超过图像高度(视野完全在场地之内?)
* 不能将图像左下与右下两点射影到场地上(视野完全在场地之外?)

```C++
void ScanGridProvider::update(ScanGrid& scanGrid)
{
  // 初始化网格信息
  scanGrid.y.clear();
  scanGrid.lines.clear();

  if(!theCameraMatrix.isValid)
    return; // Cannot compute grid without camera matrix

  // Compute the furthest point away that could be part of the field given an unknown own position.
  Vector2f pointInImage;
  const float fieldDiagional = Vector2f(theFieldDimensions.boundary.x.getSize(), theFieldDimensions.boundary.y.getSize()).norm();
  if(!Transformation::robotWithCameraRotationToImage(Vector2f(fieldDiagional, 0), theCameraMatrix, theCameraInfo, pointInImage))
    return; // Cannot project furthest possible point to image -> no grid in image

  scanGrid.fieldLimit = std::max(static_cast<int>(pointInImage.y()), -1);
  if(scanGrid.fieldLimit >= theCameraInfo.height)
    return; // Image is above field limit -> no grid in image

  // Determine the maximum distance between scanlines at the bottom of the image not to miss the ball.
  Vector2f leftOnField;
  Vector2f rightOnField;
  if(!Transformation::imageToRobotWithCameraRotation(Vector2i(0, theCameraInfo.height - 1), theCameraMatrix, theCameraInfo, leftOnField) ||
     !Transformation::imageToRobotWithCameraRotation(Vector2i(theCameraInfo.width, theCameraInfo.height - 1), theCameraMatrix, theCameraInfo, rightOnField))
    return; // Cannot project lower image border to field -> no grid
```

接下来是要设置 x 方向的最大步长, 主要的考虑因素是扫描线的最小数量, 以及底部预计球的大小.

```C++
  const int xStepUpperBound = theCameraInfo.width / minNumOfLowResScanlines;
  const int maxXStep = std::min(xStepUpperBound,
                                static_cast<int>(theCameraInfo.width *
                                                 theFieldDimensions.ballRadius * 2.f * 
                                                 ballWidthRatio / 
                                                 (leftOnField - rightOnField).norm()));
```

之后自下而上选取能够用来采样的 y 的值

```C++
  Vector2f pointOnField = (leftOnField + rightOnField) / 2.f;

  // Determine vertical sampling points of the grid
  scanGrid.y.reserve(theCameraInfo.height);
  const float fieldStep = theFieldDimensions.fieldLinesWidth * lineWidthRatio;
  bool singleSteps = false;
  // scanGrid.fieldLimit: Upper bound for all scanlines (exclusive).
  for(int y = theCameraInfo.height - 1; y > scanGrid.fieldLimit;)
  {
    scanGrid.y.emplace_back(y);
    // Calc next vertical position for all scanlines.
    if(singleSteps)
      --y;
    else
    {
      pointOnField.x() += fieldStep;
      if(!Transformation::robotWithCameraRotationToImage(pointOnField, theCameraMatrix, theCameraInfo, pointInImage))
        break;
      const int y2 = y;
      y = std::min(y2 - 1, static_cast<int>(pointInImage.y() + 0.5));
      singleSteps = y2 - 1 == y;
    }
  }
```

接下来是要设置 x 方向的最小步长, 主要的考虑因素是图像顶部预计球的大小.

```C++
  // Determine the maximum distance between scanlines at the top of the image not to miss the ball. Do not go below minStepSize.
  int minXStep = minStepSize;
  if(Transformation::imageToRobotWithCameraRotation(Vector2i(0, 0), theCameraMatrix, theCameraInfo, leftOnField) &&
     Transformation::imageToRobotWithCameraRotation(Vector2i(theCameraInfo.width, 0), theCameraMatrix, theCameraInfo, rightOnField))
    minXStep = std::max(minXStep, static_cast<int>(theCameraInfo.width *
                                                   theFieldDimensions.ballRadius *
                                                   2.f * ballWidthRatio / 
                                                   (leftOnField - rightOnField).norm()));
  minXStep = std::min(xStepUpperBound, minXStep);
```

然后是确认一个 x 方向的次大步长, 主要是满足$maxXStep2 = minXStep * 2^n, maxXStep2 <= maxXStep$

```C++
  // Determine a max step size that fulfills maxXStep2 = minXStep * 2^n, maxXStep2 <= maxXStep.
  // Also compute lower y coordinates for the different lengths of scanlines.
  int maxXStep2 = minXStep;
  std::vector<int> yStarts;
  while(maxXStep2 * 2 <= maxXStep)
  {
    float distance = Geometry::getDistanceBySize(theCameraInfo, theFieldDimensions.ballRadius * ballWidthRatio, static_cast<float>(maxXStep2));
    VERIFY(Transformation::robotWithCameraRotationToImage(Vector2f(distance, 0), theCameraMatrix, theCameraInfo, pointInImage));
    yStarts.push_back(static_cast<int>(pointInImage.y() + 0.5f));
    maxXStep2 *= 2;
  }
  yStarts.push_back(theCameraInfo.height);
```

根据上一步计算出的`maxXStep2`, 建立一个2为比值的等比数列作为扫描线的长度.

```C++
  // Determine a pattern with the different lengths of scan lines, in which the longest appears once,
  // the second longest twice, etc. The pattern starts with the longest.
  std::vector<int> yStarts2(maxXStep2 / minXStep);
  for(size_t i = 0, step = 1; i < yStarts.size(); ++i, step *= 2)
    for(size_t j = 0; j < yStarts2.size(); j += step)
      yStarts2[j] = yStarts[i];
```

初始化扫描线与颜色区域的信息

```C++
  // Initialize the scan states and the regions.
  const int xStart = theCameraInfo.width % (theCameraInfo.width / minXStep - 1) / 2;
  scanGrid.lines.reserve((theCameraInfo.width - xStart) / minXStep);
  size_t i = yStarts2.size() / 2; // Start with the second longest scanline.
  for(int x = xStart; x < theCameraInfo.width; x += minXStep)
  {
    int yMax = std::min(yStarts2[i++], theCameraInfo.height);
    i %= yStarts2.size();
    theBodyContour.clipBottom(x, yMax);
    const size_t yMaxIndex = std::upper_bound(scanGrid.y.begin(), scanGrid.y.end(), yMax + 1, std::greater<int>()) - scanGrid.y.begin();
    scanGrid.lines.emplace_back(x, yMax, static_cast<unsigned>(yMaxIndex));
  }
```

设置低分辨率的扫描线的信息

```C++
  // Set low resolution scanline info
  scanGrid.lowResStep = maxXStep2 / minXStep;
  scanGrid.lowResStart = scanGrid.lowResStep / 2;
```

