---
title: Notes for Algorithm Design and Analysis - Week 1
date: 2016-10-06 14:27:03
categories:
  - Notes
tags:
  - Coursera
  - Algorithm
  - Data Structure
---

# Introduction

## Why study Algorithm?

* important for all other branches of computer science
* plays a key role in modern technological innovation
* provides novel “lens” on processes outside of computer science and technology
* challenging (i.e., good for the brain!)
* fun

<!-- more -->



## Integer Multiplication

* Input: 2 n-digit numbers $x$ and $y$
* Output: product $x*y$

### The Grade School Algorithm

![The Grade School Algorithm](/images/grade-school-algorithm.png)

* There're roughly $n$ operations per row, and we have $n$ rows. 
* So the number of operations overall is about $n^2$.

### The Algorithm Designer’s Mantra

> “Perhaps the most important principle for the good algorithm designer is to refuse to be content.”
>
> — Aho, Hopcroft, and Ullman, *The Design and Analysis of Computer Algorithms*, 1974

**Can we do better** (than the "obvious" method)?



## Karatsuba Multiplication

### A Recursive Algorithm

* Write $x=10^{n/2}a+b$ and $y=10^{n/2}c+d$
  * Where $a,b,c,d$ are $n/2$-digit numbers
* Then $x\cdot y = (10^{n/2}a+b)(10^{n/2}c+d) = 10^n ac + 10^{n/2} (ad+bc) +bd \ \ \ \ (*)$

**Idea**: recurseively compute $ac, ad, bc, bd$, then compute $(*)$ in the obvious way. 

> Of course, simple base case should be omitted.

### Karatsuba Multiplication

$x\cdot y = 10^n ac + 10^{n/2} (ad+bc) +bd$

* Recursively compute $ac$
* Recursively compute $bd$
* Recursively compute $(a+b)(c+d) = ac+bd+ad+bc$
  * Gauss' Trick: $(3)-(1)-(2)=ad+bc$

**Upshot**: only need 3 recursive multiplications (and some additions)



## About The Course

### Course Topics

* Vocabulary for design and analysisof algorithms
  * E.g., “Big Oh” notation
  * “sweet spot” for highGlevel reasoning about algorithms
* Divide and conquer algorithm design paradigm
  * Will apply to: Integer multiplication, sorting, matrix multiplication, closest pair
  * General analysis methods (“Master Method/Theorem”)
* Randomization in algorithm design
  * Will apply to: QuickSort, primality testing, graph partitioning, hashing.
* Primitives for reasoning about graphs
  * Connectivity information, shortest paths, structure of information and social networks.
* Use and implementation of data structures
  * Heaps, balanced binary search trees, hashing and some variants (e.g., bloom ﬁlters)

### Topics in Sequel Course  

* Greedy algorithm design paradigm
* Dynamic programming algorithm design paradigm
* NP-complete problems and what to do about them
* Fast heuristics with provable guarantees
* Fast exact algorithms for special cases
* Exact algorithms that beat brute-force search

### Skills You’ll Lean

* Become a better programmer
* Sharpen your mathematical and analytical skills
* Start “thinking algorithmically”
* Literacy with computer science’s “greatest hits”
* Ace your technical interviews

### Who Are You?
* It doesn’t really matter.	(It’s a free course, after all.)
* Ideally, you know some programming.
* Doesn’t matter which language(s) you know.
  * But you should be capable of translating high-level algorithm descriptions into working programs in some programming language.
* Some (perhaps rusty) mathematical experience.
  * Basic discrete math, proofs by induction, etc.


### Supporting Materials
* All (annotated) slides available from course site.
* No required textbook.A few of the many good ones:
  * Kleinberg/Tardos, *Algorithm Design*, 2005.
  * Dasgupta/Papadimitriou/Vazirani, *Algorithms*, 2006.
  * Cormen/Leiserson/Rivest/Stein, *Introduction to Algorithms*, 2009 (3rd edition).
  * Mehlhorn/Sanders, *Data Structures and Algorithms: The Basic Toolbox*, 2008.
* No speciﬁc development environment required.
  * But you should be able to write and execute programs.


### Assessment

* No grades per se. (Details on a certiﬁcate of  accomplishment TBA.)
* Weekly homeworks.
  * Test understand of material
  * Synchronize students, greatly helps discussion forum
  * Intellectual challenge
* Assessment tools currently just a “1.0” technology.
  * We’ll do our best!
* Will sometimes propose harder “challenge problems”
  * Will not be graded; discuss solutions via course forum




## Merge Sort: Motivation and Example

### Why Study Merge Sort?

* Good introduction to divide & conquer
  * Improves over Selection, Insertion, Bubble sorts
* Calibrate your preparation
* Motivates guiding principles for algorithm  analysis (worst-case and asymptotic analysis)
* Analysis generalizes to “Master Method”

### The Sorting Problem

* **Input**: array of numbers, unsorted
* **Output**: Same numbers, sorted in increasing or decreasing order.

### Merge Sort: Example

![merge-sort-example.png](/images/merge-sort-example.png)