---
title: 1Password Problem browser could not be verified
date: 2016-12-02 16:41:04
categories:
  - Experience
tags:
  - 1Password
  - macOS
---

最近在 Chrome 上使用 1Password 总是会提示`Browser could not be verified`, 经过查阅资料解决, 特此记录.

<!-- more -->

现象如图:

![1Password-Problem-browser-could-not-be-verified-1](/images/1Password-Problem-browser-could-not-be-verified-1.png)

根据官网[这篇文章](https://support.1password.com/firewall-proxy/), 应该是 Surge 代理的原因. 只要将`127.0.0.1`加入到白名单里面就好了.

## Configure your proxy settings

1. Choose Apple menu () > System Preferences, then click the Network icon.

2. Select your primary network interface (typically Wi-Fi, or Ethernet if you have a wired connection).

3. Click Advanced, then select the Proxies tab.

   ![1Password-Problem-browser-could-not-be-verified-2](/images/1Password-Problem-browser-could-not-be-verified-2.png)

4. Select Web Proxy (HTTP).

5. Under “Bypass proxy settings for these Hosts & Domains”, click to the right of the existing text, and type a comma followed by `127.0.0.1`. Then click OK.

> If "Secure Web Proxy (HTTPS)" is also enabled, select it, and add `127.0.0.1` as above.