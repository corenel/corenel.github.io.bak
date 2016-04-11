---
title: Tips for Hexo configuration
date: 2016-04-11 00:19:54
tags:
  - hexo
---

## 添加`README.md`文件

由于Hexo会将`source/`目录下的所有`.md`文件渲染成`.html`文件，因此需要将`README.md`排除在外。幸好，Hexo在3.0以上的版本中提供了`skip_render`参数。

1. 在`source/`里创建`README.md`

2. 在`_config.yml`中修改

   ```
   skip_render:
       - README.md
   ```

> skip_render: Paths not to be rendered. You can use [glob expressions](https://github.com/isaacs/minimatch) for path matching

<!-- more -->

## 源文件托管到Github

为了保持多终端撰写Blog的便利，同时为了备份与版本管理，需要将Blog的源文件托管至Github上。目前的思路是在Github Pages的Repo上创建新的分支`source`。由于Hexo在Init之后，根目录下已经有了`.gitignore`文件，我们就不需要自己动手写。

```bash
$ cd hexo
$ git init
$ git checkout -b source
$ git add .
$ git commit -m "Initial"
$ git remote add origin git@github.com:corenel/corenel.github.io.git
$ git push origin source
```

针对使用`git clone`下来第三方主题目录下有`.git`文件夹的情况，其实是不推荐这样做的。因为我们往往要对第三方主题进行修改，而我们不能直接提交到第三方问题的仓库上，这样就对多终端同步主题造成了困扰。

建议的方法是直接fork第三方主题，而后新建分支来作为给之后对主题修改之用，并且使用`git submodule`来管理。

```bash
$ git submodule add git@github.com:corenel/hexo-theme-next.git themes/next
$ git commit -am "Use themes/next"
$ git push origin source
```

注意的是，在使用另一终端时，需要先初始化submodule。

```bash
$ git submodule init
$ git submodule update
```

第三方主题更新时，可以直接更新`master`分支，而后merge到自己的分支上。

```bash
$ git checkout master
$ git pull upstream master
```

