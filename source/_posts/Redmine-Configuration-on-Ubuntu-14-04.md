---
title: Redmine configuration on Ubuntu 14.04
date: 2016-09-15 19:02:37
categories:
  - Experience
tags:
  - Redmine
  - Apache2
  - MySQL
---

最近实验室要搞团队协作与项目管理，所以梅老板派我去装个 Redmine。不过这东西看着确实有些年头了，跟现在流行的 SPA (单页应用) 一点都不搭。当然，抱怨归抱怨，东西还是得装……

本文参考了 [HowTo Install Redmine on Ubuntu step by step]([http://www.redmine.org/projects/redmine/wiki/HowTo_Install_Redmine_on_Ubuntu_step_by_step](http://www.redmine.org/projects/redmine/wiki/HowTo_Install_Redmine_on_Ubuntu_step_by_step)) 这篇官网的文章，并且根据实际情况有所改动。

# 安装

首先自然是安装 Redmine 以及相关依赖：

```shell
$ sudo apt-get install apache2 libapache2-mod-passenger
$ sudo apt-get install mysql-server mysql-client
$ sudo apt-get install redmine redmine-mysql
```

只得注意的是，安装 MySQL 的时候会要求设置数据库`root`用户的密码，这个密码在之后安装 Redmine 的时候需要。

<!-- more -->

同时注意安装`bundler`

```shell
$ sudo gem update
$ sudo gem install bundler
```

这时候 Redmine 应该已经可用了，可以到`/usr/share/redmine`下直接用 WEBrick 来测试

```shell
$ sudo bundle exec ruby script/rails server webrick -e production
=> Booting WEBrick
=> Rails 3.2.16 application starting in production on http://0.0.0.0:3000
=> Call with -d to detach
=> Ctrl-C to shutdown server
[2016-09-15 00:18:34] INFO  WEBrick 1.3.1
[2016-09-15 00:18:34] INFO  ruby 1.9.3 (2013-11-22) [x86_64-linux]
[2016-09-15 00:18:34] INFO  WEBrick::HTTPServer#start: pid=12337 port=3000
```

能用的话，我们接下来来配置 Apache。

# 配置

1. 首先打开`/etc/apache2/mods-available/passenger.conf`，加一行`PassengerDefaultUser www-data`。之后整个文件看起来是这样：

   ```
   <IfModule mod_passenger.c>
     PassengerDefaultUser www-data
     PassengerRoot /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini
     PassengerDefaultRuby /usr/bin/ruby
   </IfModule>
   ```

2. 然后创建软链接，把 Redmine 的文件目录和 Apache 的根目录连起来

   ```shell
   $ sudo ln -s /usr/share/redmine/public /var/www/html/redmine
   ```

3. 接下来编辑`/etc/apache2/sites-available/000-default.conf`，把以下内容插在`<VirtualHost>...</VirtualHost>`之间。

   ```
   <Directory /var/www/html/redmine>
       RailsBaseURI /redmine
       PassengerResolveSymlinksInDocumentRoot on
   </Directory>
   ```

   由于我手上的这台服务器的 80 端口被 Gitlab 占着，所以还需要换个端口，比如1234（不要忘了同时修改`/etc/apache2/ports.conf`中的监听端口号）：

   ```
   <VirtualHost *:1234>
   ```

   同时，还可以设置服务器的地址：

   ```
   ServerName localhost
   ```

   最后改完的`/etc/apache2/sites-available/000-default.conf`看起来如下：

   ```
   <VirtualHost *:1234>
           ServerAdmin webmaster@localhost
           DocumentRoot /var/www
           ServerName localhost
           
           ErrorLog ${APACHE_LOG_DIR}/error.log
           CustomLog ${APACHE_LOG_DIR}/access.log combined
           
           <Directory /var/www/html/redmine>
                   RailsBaseURI /redmine
                   PassengerResolveSymlinksInDocumentRoot on
           </Directory>
   </VirtualHost>
   ```

4. 创建并修改Gemfile.lock的权限：

   ```shell
   $ sudo touch /usr/share/redmine/Gemfile.lock
   $ sudo chown www-data:www-data /usr/share/redmine/Gemfile.lock
   ```

5. 修改`/etc/apache2/apache2.conf`，添加一行设置 Passenger 的根目录。不然只能访问到 Redmine 下的文件目录。

   ```
   PassengerAppRoot /usr/share/redmine
   ```

6. 重启 Apache：

   ```
   sudo service apache2 restart
   ```

7. 此时已经可以直接通过浏览器访问 http://127.0.0.1:1234 了。



后续配置持续更新中