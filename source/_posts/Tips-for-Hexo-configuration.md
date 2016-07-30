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

## 将源文件托管到Github

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
$ git remote add upstream git@github.com:iissnan/hexo-theme-next.git
$ git checkout yuthon
$ git pull upstream master
```

##  使用gulp压缩静态资源

Hexo引擎在解析md时生成html的代码里会包含大量的无用空白，为了提高加载速度，用gulp压缩public目录的静态资源。

当然你也可以用[hexo-all-minifier](https://github.com/unhealthy/hexo-all-minifier)来精简。

1. 安装gulp及其插件

   ```bash
   $ npm install gulp -g
   $ npm install gulp-minify-css gulp-uglify gulp-htmlmin gulp-htmlclean --save
   ```

2. 编写gulpfile.js

   ```javascript
   var gulp = require('gulp');
   var minifycss = require('gulp-minify-css');
   var uglify = require('gulp-uglify');
   var htmlmin = require('gulp-htmlmin');
   var htmlclean = require('gulp-htmlclean');

   gulp.task('minify-css', function() {
       return gulp.src(["public/**/*.css","!public/**/*.min.css"])
           .pipe(minifycss({compatibility: 'ie8'}))
           .pipe(gulp.dest('./public'));
   });

   gulp.task('minify-html', function() {
     return gulp.src("public/**/*.html")
       .pipe(htmlclean())
       .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
       }))
       .pipe(gulp.dest('./public'))
   });

   gulp.task('minify-js', function() {
       return gulp.src(["public/**/*.js","!public/**/*.min.js"])
           .pipe(uglify())
           .pipe(gulp.dest('./public'));
   });

   gulp.task('default', [
       'minify-html','minify-css','minify-js'
   ],function(){
       console.log("gulp task ok!");
   });
   ```

之后在使用`hexo g`生成静态页面后，再执行`gulp`即可对静态资源进行压缩，压缩完成后再用`hexo d`部署即可。

## 给 Next 主题添加文章更新时间

修改`themes/next/layout/_macro/post.swig`文件，在`<span class="post-time">`标签后（即对应的`</span>`后）添加

```
{%if post.updated and post.updated > post.date%}
  <span class="post-updated">
	&nbsp; | &nbsp; {{ __('post.updated') }}
	<time itemprop="dateUpdated" datetime="{{ moment(post.updated).format() }}" content="{{ date(post.updated, config.date_format) }}">
	  {{ date(post.updated, config.date_format) }}
	</time>
  </span>
{% endif %}
```

而后修改语言配置文件`themes/next/languages/en.yml`（根据语言环境，文件有所不同）

```
post:
  updated: Updated on
```

修改主题配置文件`themes/next/_config.yml`，增加一行

```
display_updated: true
```

之后即可直接在文章开头设置更新时间（默认用文章`.md`文档的修改时间）

```
updated: 2016-07-30 22:52:54
```

