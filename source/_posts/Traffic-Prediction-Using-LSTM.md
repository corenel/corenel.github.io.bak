---
title: Traffic Prediction Using LSTM
date: 2016-10-30 13:53:32
categories:
  - Projects
tags:
  - Traffic Prediction
  - LSTM
  - RNN
  - Deep Learning
---

最近上的一门课 "无线传感器网络" 快要结束了, 于是所谓的大作业的 DDL 也压上来了. TAT

不过这门课虽然说是讲无线传感器网络的, 但是大作业的要求却额外的宽松, 只要是和数据分析有关的就好了. 老师还给了些数据集, 比如说公共自行车的出借与归入记录啊, 出租车在各个路段的行驶速度啊, 或者是顺丰快递途径各个城市需要的时间啊这类的. 当然也可以自己选题. 

我当然是想自己选题的, 然而想了一圈没想到什么好的方案, 于是只好回到了老师给的题目上面来, 选了道路速度预测这样的题目. 刚好之前在 CS231n 上看了 RNN 和 LSTM, 心想这总比传统方法好点吧, 于是就开始干了. (于是就有了之前的那篇装 CUDA 和 TF)

I wanna traffic prediction, I learn LSTM.

ugh, Traffic prediction using LSTM!

(此处应有 PPAP)

<!-- more -->

## RNN 与 LSTM 基本原理

直接看我 CS231n 相关的课程笔记吧

[Notes for CS231n Recurrent Neural Network](http://www.yuthon.com/2016/10/30/Notes-for-CS231n-RNN/)

## 模型结构

详细代码可见我Github上的项目 **[traffic-prediction](https://github.com/corenel/traffic-prediction)**. 为了课堂展示我还做了一个pdf, 可以从此处下载.

本次用了两层的 LSTM, 中间加了 Dropout:

![traffic_prediction_model](/images/traffic_prediction_model.png)

输入是一个 4 元素的向量, 分别是星期几, 是否周末, 小时与分钟. 

$Input = \begin{bmatrix}Weekday & isWeekend & Hour & Minute\end{bmatrix}$

输出自然是道路上此刻的速度

$Output = \begin{bmatrix} Velocity \end{bmatrix}$

> 话说 Keras 竟然能用 graphviz 直接输出模型的结构图, 真是方便

## 数据集

老师给的数据集简直弱爆了, 一条路上总共2000+条数据, 还是按照小时计的, 训练出来的结果惨不忍睹.

于是在网上找到了 [Caltrans Performance Measurement System (PeMS)](http://pems.dot.ca.gov/) 这个网站, 里面数据是每 5 分钟采样一次的, 比前面的那个不知高到哪里去了.

此次选取的是 16444 路段, 时间是 2016-05-01 到 2016-10-26 总共 6 个月 5W+ 条数据.

## 结果

一天(2016-10-26)和一周(2016.10.20 - 2016.10.26)的预测如下:

![traffic_prediction_result_1](/images/traffic_prediction_result_1.png)

![traffic_prediction_result_2](/images/traffic_prediction_result_2.png)

可以看出, 总体的趋势还是不错的, 但是高峰的部分还是有些够不上. 同时, 也确实预测到了周末与工作日的速度的区别.

> matplotlib 可以用 ggplot 的样式, 好看多了

## Deeper

使用了3层LSTM, MSE有一定下降, 但是高峰期跟不上的问题还是没有解决

 ![traffic_prediction_result_4](/images/traffic_prediction_result_4.png)

 ![traffic_prediction_result_5](/images/traffic_prediction_result_5.png)

 ![traffic_prediction_result_6](/images/traffic_prediction_result_6.png)

## 改进

* 加深层数
* 仔细考虑输入向量的长度和内容, 还可加入假日, 天气等(老师给的数据集有, 但是PeMS没)
* 使用 Stateful LSTM 的尝试失败了