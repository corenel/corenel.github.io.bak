---
title: 'Notes: From Faster-RCNN to Mask-RCNN by Shaoqing Ren'
date: 2017-04-27 12:55:33
categories:
- Notes
tags:
  - Object Detection
  - Semantic Segmentation
  - Faster-RCNN
  - Mask-RCNN
---

That's my notes for the lecture "From Faster-RCNN to Mask-RCNN" by Shaoqing Ren on April 26th, 2017.

## Yesterday – background and pre-works of Mask R-CNN

### Key functions

* **Classification** - What are in the image?
* **Localization** - Where are they?
* **Mask (per pixel) classification** - Where+ ?
  * More precise to bounding box
* **Landmarks localization** - What+, Where+ ?
  * Not only per-pixel mask, but also key points in the objects

<!-- more -->

### Mask R-CNN Architecture

![Mask R-CNN Architecture](/images/architecture_of_mask_r-cnn.png)

### Classification

![CNN for classification](/images/classification_cnn.png)

> Please ignoring the bounding box in the image

$$
\text{class} = Classifier(\text{image})
$$

#### Problems

* High-level semantic concepts
* High efficiency

#### Solutions

* **SIFT** or **HOG** (about 5 or 10 years ago)
  * Based on edge feature (low- level semantic infomations)
  * Sometimes mistake two objects which people can distinguish easily
    * e.g.  mark the telegraph pole as a man
* **CNN** (nowadays)
  * Based on high-level semantic concepts
    * Rarely mistake objects. If it do so, people are likely to mix up them, too.
  * Translation invariance
  * Scale invariance



### Detection

![Detection Concept](/images/detection_concept.png)
$$
\text{location}=Classifier(\text{all patches of an image)} \\
\text{precise_location}=Regressor(\text{image}, \text{rough_location})
$$

#### Problems

* High efficiency


#### Solutions

* **Traverse** all patches of an image and apply image classifier on them, then patches with highest scores are looked as locations of objects.
  * As long as the classifier is precise enough, and we are able to traverse millions of patches in an image, we can always get a satisfactory result.
  * But the amount of calculations is too large. (about 1 or 10 millon) 
* Do **Regression** cosntantlty, starting from a rough location of an object, and finally we'll get the precise object location.
  * Low amount of calculations. (about 10 or 100 times)
  * Hard to locate many adjacent and similar objects
* The state-of-the-art methods tend to use exhaustion on large-scale, and refine the rough localtions by regression on small-scale.

#### R-CNN

![RCNN](/images/detection_rcnn.png)

* Use **region proposal** to decline millions of patches into 2~10k.
* Use classifier to determine the class of a patch
* Use BBox regression to refine the location

#### SPP-net / Fast R-CNN

![SPP-net 1](/images/SPP_net_1.png)

![SPP-net 2](/images/SPP_net_2.png)

* Use **Pyramid Pooling / RoI-Pooling** to generate a fixed-length representation regardless of image size/scale 


#### Faster R-CNN

![Faster-RCNN](/images/Faster-RCNN_1.png)

* Use **RPN** (Region Proposal Network) that shares full-image convolutional features with the detection network, thus enabling nearly cost-free region proposals. 
  * An RPN is a fully convolutional network that simultaneously predicts object bounds and objectness scores at each position.
  * The RPN is trained end-to-end to generate high-quality region proposals, which are used by Fast R-CNN for detection.
  * We further merge RPN and Fast R-CNN into a single network by sharing their convolutional features---using the recently popular terminology of neural networks with 'attention' mechanisms, the RPN component tells the unified network where to look. 
* Number of patches: $width \times height \times scales \times ratios$
  * `scale` stands for the size of image and objects
  * `ratio` stands for the aspect ratio of filter

![Multiple scales / ratios](/images/multiple_scales_ratios.png)

Different schemes for addressing multiple scales and sizes.

* Pyramids of images and feature maps are built, and the classifier is run at all scales.
* Pyramids of filters with multiple scales/sizes are run on the feature map.
* Faster R-CNN use pyramids of reference boxes in the regression functions, which avoids enumerating images or filters of multiple scales or aspect ratios.

#### SSD / FPN

![SSD and FPN](/images/ssd_fpn.png)

* **FPN (Feature Pyramid Network)** exploit the inherent multi-scale, pyramidal hierarchy of deep convolutional networks to construct feature pyramids with marginal extra cost. A top-down architecture with lateral connections is developed for building high-level semantic feature maps at all scales.

### Instance Segmentation

![Instance Segmentation](/images/instance_segmentation.png)

* Use **Mask Regression** to predict instance segmentation based on object bounding box.
* Replace RoI Pooling with **RoI Align**

### Keypoint Detection

![Keypoint Detection](/images/keypoint_detection.png)

* We make minor modifications to the segmentation system when adapting it for keypoints.
* For each of the $K$ keypoints of an instance, the training target is a one-hot $m \times m$ binary mask where only a single pixel is labeled as foreground.

## Today - details about Mask-RCNN and comparisons

(to be continued)

## Future - discussions

(to be continued)