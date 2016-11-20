#!/bin/bash
hexo clean && hexo g && gulp && cp -r -f public/ ../corenel.github.io && hexo s
