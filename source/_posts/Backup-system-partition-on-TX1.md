---
title: Backup system partition on TX1
date: 2016-12-18 18:18:59
categories:
  - Experience
tags:
  - Tensorflow
  - NVIDIA
  - Jetson TX1
  - Ubuntu
  - Deep Learning
---

由于实验室只有要用到多块 TX1 开发板, 然而一个个都用 JetPack 刷机, 再用自动化脚本装软件和依赖实在是太麻烦了, 因此我和梅老板就开始研究怎么直接备份 TX1 上的 Ubuntu 系统.

<!-- more -->

## Failed attempts

最开始想的是直接用`dd`来备份整块 eMMC到外置的存储上, 于是尝试了

```bash
$ sudo dd if=/dev/mmcblk0p1 of=/media/ubuntu/backup/backup.img
```

后来还发现可以用`ssh`来远程`dd`

* **run from remote computer**:

```bash
$ dd if=/dev/mmcblk0p1 | gzip -1 - | ssh yuthon@mac dd of=image.gz
```

* **run from local computer**:

```bash
$ ssh ubuntu@tx1 "dd if=/dev/mmcblk0p1 | gzip -1 -" | dd of=image.gz
```

之后, 我们发现`64_TX1/Linux_for_Tegra_64_tx1/rootfs`目录中应该就是之后需要拷到 TX1 的`/`目录下的内容. 因此我们直接将之前备份好的`bakcup.img`解压到了此目录下, 并使用 JetPack 重新 Flash OS.

最后的结果是 TX1 在重启后卡在了登录界面, 经典的 login-loop.

此方案, 扑街.

## Using `tegraflash.py`

Then we found a [post](https://devtalk.nvidia.com/default/topic/898999/tx1-r23-1-new-flash-structure-how-to-clone-/) on NVIDIA Developer Forums, and method in this post works for us.

> Assumed we're in `64_TX1/Linux_for_Tegra_64_tx1/bootloader` directory.

### Backup an image

```bash
$ sudo ./tegraflash.py --bl cboot.bin --applet nvtboot_recovery.bin --chip 0x21 --cmd "read APP my_backup_image_APP.img"
```

### Restore an image

```bash
$ sudo ./tegraflash.py --bl cboot.bin --applet nvtboot_recovery.bin --chip 0x21 --cmd "write APP my_backup_image_APP.img"
```

### One more thing

It's recommended in the post to use `flash.py` front-end instead of `tegraflash.py` to make sure you use the same L4T release version.

```bash
# Backup
$ sudo flash.sh -S 14580MiB jetson-tx1 mmcblk0p1
# Restore
$ sudo flash.sh -r -S 14580MiB jetson-tx1 mmcblk0p1
```

Note that the `-r`  param re-uses `system.img` in `bootloader` directory, and if a clone file is there in place, that installs the clone.
**I haven't tried this method, maybe you could have a try and report.**