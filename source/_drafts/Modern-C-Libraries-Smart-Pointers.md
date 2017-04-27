---
title: 'Modern C++ Libraries: Smart Pointers'
date: 2017-04-25 21:57:43
categories:
- Notes
tags:
  - Pluralsight
  - C++
  - C++11
---

This post is a note for Modern C++ Libraries in Pluralsight.

And following is Module 2: Smart Pointers.

<!-- more -->

## The Pointer Landscape

**The raw or naked pointers are bad news.** So you should always strive to **wrap resources** of any kind in some suitable C++ classes with a constructor/destructor pair **to maintain ownership of those resources**.

* `T*` (be careful)

The Standard C++ Library provides a few types of **Smart Pointers** along with supporting helper functions and classes. These are well worth mastering as they come in handy all the time, but still require some care and understanding of the Modern C++ Language to use them correctly. 

* `unique_ptr`

* `shared_ptr`

* `weak_ptr`

* `auto_ptr` (don’t use)

  > `auto_ptr` is a Smart Pointer with strict ownership semantics much like `unique_ptr`, but it was ahead of its time and is fundamentally broken and quite unsafe. Just don't use it. Anything you could do with `auto_ptr` you can and should do with `unique_ptr` instead. 

* `ComPtr` (Windows COM operations only)


## unique_ptr

- Exclusively owns object to which it points
- Can’t be copied

- Can be moved

- make_unique 