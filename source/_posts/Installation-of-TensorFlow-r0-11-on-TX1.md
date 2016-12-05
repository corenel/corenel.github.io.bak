---
title: Installation of TensorFlow r0.11 on TX1
date: 2016-12-04 20:53:55
categories:
  - Experience
tags:
  - Tensorflow
  - NVIDIA
  - Jetson TX1
  - Ubuntu
  - Deep Learning
---

今天折腾了一个下午, 特此记录一下其中遇到的坑, 主要还是因为 TX1 的 aarch64 架构, 以及小得可怜的内存与存储容量.

<!-- more -->

## Environment

* **Hardware**: NVIDIA Jetson TX1 Developer Kit
* **Software**: JetPack 2.3.1
  * Ubuntu 16.04 64-bit (aarch64)
  * CUDA 8.0
  * cuDNN 5.1

## Installation

建议全程开HTTP/HTTPS代理, 否则国内下载速度堪忧.

### Install Java

```bash
$ sudo add-apt-repository ppa:webupd8team/java
$ sudo apt-get update
$ sudo apt-get install oracle-java8-installer
```

### Install dependencens

```bash
$ sudo apt-get install git zip unzip autoconf automake libtool curl zlib1g-dev maven
$ sudo apt-get install python-numpy swig python-dev python-wheel
```

### Build protobuf

这里测 Protobuf 要编译两份, 分别给 grpc 和 Bazel 用.

```bash
# For grpc-java build
$ git clone https://github.com/google/protobuf.git
$ cd protobuf
$ git checkout master
$ ./autogen.sh
$ git checkout v3.0.0-beta-3
$ ./autogen.sh
$ LDFLAGS=-static ./configure --prefix=$(pwd)/../
$ sed -i -e 's/LDFLAGS = -static/LDFLAGS = -all-static/' ./src/Makefile
$ make -j 4
$ make install

# For bazel build
$ git checkout v3.0.0-beta-2
$./autogen.sh
$ LDFLAGS=-static ./configure --prefix=$(pwd)/../
$ sed -i -e 's/LDFLAGS = -static/LDFLAGS = -all-static/' ./src/Makefile
$ make -j 4
$ cd ..
```

> 注意: 给 Bazel 用的不用`make install`, 之后直接`cp`过去.

### Build grpc-java compiler

```bash
$ git clone https://github.com/neo-titans/odroid.git
$ git clone https://github.com/grpc/grpc-java-git
$ cd grpc-java/
$ git checkout v0.15.0
$ patch -p0 < ../odroid/build_tensorflow/grpc-java.v0.15.0.patch
$ CXXFLAGS="-I$(pwd)/../include" LDFLAGS="-L$(pwd)/../lib" ./gradlew java_pluginExecutable -Pprotoc=$(pwd)/../bin/protoc
$ cd ..
```

### Build bazel

```bash
$ git clone https://github.com/bazelbuild/bazel.git
$ cd bazel
$ git checkout 0.3.2
$ cp ../protobuf/src/protoc third_party/protobuf/protoc-linux-arm32.exe
$ cp ../grpc-java/compiler/build/exe/java_plugin/protoc-gen-grpc-java third_party/grpc/protoc-gen-grpc-java-0.15.0-linux-arm32.exe
```

在编译 Bazel 之前, 还需要改一些配置, 使得 Bazel 将 aarch64 认作 arm64, 以便编译成功.

```diff
diff --git a/compile.sh b/compile.sh
index 53fc412..11035d9 100755
--- a/compile.sh
+++ b/compile.sh
@@ -27,7 +27,7 @@ cd "$(dirname "$0")"
 # Set the default verbose mode in buildenv.sh so that we do not display command
 # output unless there is a failure.  We do this conditionally to offer the user
 # a chance of overriding this in case they want to do so.
-: ${VERBOSE:=no}
+: ${VERBOSE:=yes}

 source scripts/bootstrap/buildenv.sh

diff --git a/scripts/bootstrap/compile.sh b/scripts/bootstrap/compile.sh
index 77372f0..657b254 100755
--- a/scripts/bootstrap/compile.sh
+++ b/scripts/bootstrap/compile.sh
@@ -48,6 +48,7 @@ linux)
   else
     if [ "${MACHINE_IS_ARM}" = 'yes' ]; then
       PROTOC=${PROTOC:-third_party/protobuf/protoc-linux-arm32.exe}
+      GRPC_JAVA_PLUGIN=${GRPC_JAVA_PLUGIN:-third_party/grpc/protoc-gen-grpc-java-0.15.0-linux-arm32.exe}
     else
       PROTOC=${PROTOC:-third_party/protobuf/protoc-linux-x86_32.exe}
       GRPC_JAVA_PLUGIN=${GRPC_JAVA_PLUGIN:-third_party/grpc/protoc-gen-grpc-java-0.15.0-linux-x86_32.exe}
@@ -150,7 +151,7 @@ function java_compilation() {

   run "${JAVAC}" -classpath "${classpath}" -sourcepath "${sourcepath}" \
       -d "${output}/classes" -source "$JAVA_VERSION" -target "$JAVA_VERSION" \
-      -encoding UTF-8 "@${paramfile}"
+      -encoding UTF-8 "@${paramfile}" -J-Xmx500M

   log "Extracting helper classes for $name..."
   for f in ${library_jars} ; do
diff --git a/src/main/java/com/google/devtools/build/lib/util/CPU.java b/src/main/java/com/google/devtools/build/lib/util/CPU.java
index 41af4b1..4d80610 100644
--- a/src/main/java/com/google/devtools/build/lib/util/CPU.java
+++ b/src/main/java/com/google/devtools/build/lib/util/CPU.java
@@ -26,7 +26,7 @@ public enum CPU {
   X86_32("x86_32", ImmutableSet.of("i386", "i486", "i586", "i686", "i786", "x86")),
   X86_64("x86_64", ImmutableSet.of("amd64", "x86_64", "x64")),
   PPC("ppc", ImmutableSet.of("ppc", "ppc64", "ppc64le")),
-  ARM("arm", ImmutableSet.of("arm", "armv7l")),
+  ARM("arm", ImmutableSet.of("arm", "armv7l", "aarch64")),
   UNKNOWN("unknown", ImmutableSet.<String>of());

   private final String canonicalName;
diff --git a/third_party/grpc/BUILD b/third_party/grpc/BUILD
index 2ba07e3..c7925ff 100644
--- a/third_party/grpc/BUILD
+++ b/third_party/grpc/BUILD
@@ -29,7 +29,7 @@ filegroup(
         "//third_party:darwin": ["protoc-gen-grpc-java-0.15.0-osx-x86_64.exe"],
         "//third_party:k8": ["protoc-gen-grpc-java-0.15.0-linux-x86_64.exe"],
         "//third_party:piii": ["protoc-gen-grpc-java-0.15.0-linux-x86_32.exe"],
-        "//third_party:arm": ["protoc-gen-grpc-java-0.15.0-linux-x86_32.exe"],
+        "//third_party:arm": ["protoc-gen-grpc-java-0.15.0-linux-arm32.exe"],
         "//third_party:freebsd": ["protoc-gen-grpc-java-0.15.0-linux-x86_32.exe"],
     }),
 )
diff --git a/third_party/protobuf/BUILD b/third_party/protobuf/BUILD
index 203fe51..4c2a316 100644
--- a/third_party/protobuf/BUILD
+++ b/third_party/protobuf/BUILD
@@ -28,6 +28,7 @@ filegroup(
         "//third_party:darwin": ["protoc-osx-x86_32.exe"],
         "//third_party:k8": ["protoc-linux-x86_64.exe"],
         "//third_party:piii": ["protoc-linux-x86_32.exe"],
+        "//third_party:arm": ["protoc-linux-arm32.exe"],
         "//third_party:freebsd": ["protoc-linux-x86_32.exe"],
     }),
 )
diff --git a/tools/cpp/cc_configure.bzl b/tools/cpp/cc_configure.bzl
index aeb0715..688835d 100644
--- a/tools/cpp/cc_configure.bzl
+++ b/tools/cpp/cc_configure.bzl
@@ -150,7 +150,12 @@ def _get_cpu_value(repository_ctx):
     return "x64_windows"
   # Use uname to figure out whether we are on x86_32 or x86_64
   result = repository_ctx.execute(["uname", "-m"])
-  return "k8" if result.stdout.strip() in ["amd64", "x86_64", "x64"] else "piii"
+  machine = result.stdout.strip()
+  if machine in ["arm", "armv7l", "aarch64"]:
+   return "arm"
+  elif machine in ["amd64", "x86_64", "x64"]:
+   return "k8"
+  return "piii"


 _INC_DIR_MARKER_BEGIN = "#include <...>"
```

之后编译安装:

```bash
$ ./compile.sh 
$ sudo cp output/bazel /usr/local/bin
$ cd ..
```

### Build Tensorflow

```
$ git clone https://github.com/tensorflow/tensorflow.git
$ git checkout r0.11
```

同样地, 修改配置文件:

```diff
diff --git a/tensorflow/core/kernels/BUILD b/tensorflow/core/kernels/BUILD
index 2e04827..867aaca 100644
--- a/tensorflow/core/kernels/BUILD
+++ b/tensorflow/core/kernels/BUILD
@@ -1184,7 +1184,7 @@ tf_kernel_libraries(
         "segment_reduction_ops",
         "scan_ops",
         "sequence_ops",
-        "sparse_matmul_op",
+       #DC "sparse_matmul_op",
     ],
     deps = [
         ":bounds_check",
diff --git a/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc b/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc
index 02058a8..880252c 100644
--- a/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc
+++ b/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc
@@ -43,8 +43,14 @@ struct BatchSelectFunctor<GPUDevice, T> {
     const int all_but_batch = then_flat_outer_dims.dimension(1);

 #if !defined(EIGEN_HAS_INDEX_LIST)
-    Eigen::array<int, 2> broadcast_dims{{ 1, all_but_batch }};
-    Eigen::Tensor<int, 2>::Dimensions reshape_dims{{ batch, 1 }};
+    // Eigen::array<int, 2> broadcast_dims{{ 1, all_but_batch }};
+    Eigen::array<int, 2> broadcast_dims;
+    broadcast_dims[0] = 1;
+    broadcast_dims[1] = all_but_batch;
+    // Eigen::Tensor<int, 2>::Dimensions reshape_dims{{ batch, 1 }};
+    Eigen::Tensor<int, 2>::Dimensions reshape_dims;
+    reshape_dims[0] = batch;
+    reshape_dims[1] = 1;
 #else
     Eigen::IndexList<Eigen::type2index<1>, int> broadcast_dims;
     broadcast_dims.set(1, all_but_batch);
diff --git a/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc b/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc
index a177696..75b67ba 100644
--- a/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc
         ":bounds_check",
diff --git a/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc b/tensorflow/core/kernels/cwise_op_gpu_sele
ct.cu.cc
index 02058a8..880252c 100644
--- a/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc
+++ b/tensorflow/core/kernels/cwise_op_gpu_select.cu.cc
@@ -43,8 +43,14 @@ struct BatchSelectFunctor<GPUDevice, T> {
     const int all_but_batch = then_flat_outer_dims.dimension(1);

 #if !defined(EIGEN_HAS_INDEX_LIST)
-    Eigen::array<int, 2> broadcast_dims{{ 1, all_but_batch }};
-    Eigen::Tensor<int, 2>::Dimensions reshape_dims{{ batch, 1 }};
+    // Eigen::array<int, 2> broadcast_dims{{ 1, all_but_batch }};
+    Eigen::array<int, 2> broadcast_dims;
+    broadcast_dims[0] = 1;
+    broadcast_dims[1] = all_but_batch;
+    // Eigen::Tensor<int, 2>::Dimensions reshape_dims{{ batch, 1 }};
+    Eigen::Tensor<int, 2>::Dimensions reshape_dims;
+    reshape_dims[0] = batch;
+    reshape_dims[1] = 1;
 #else
     Eigen::IndexList<Eigen::type2index<1>, int> broadcast_dims;
     broadcast_dims.set(1, all_but_batch);
diff --git a/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc b/tensorflow/core/kernels/spa
rse_tensor_dense_matmul_op_gpu.cu.cc
index a177696..75b67ba 100644
--- a/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc
+++ b/tensorflow/core/kernels/sparse_tensor_dense_matmul_op_gpu.cu.cc
@@ -104,9 +104,17 @@ struct SparseTensorDenseMatMulFunctor<GPUDevice, T, ADJ_A, ADJ_B> {
     int n = (ADJ_B) ? b.dimension(0) : b.dimension(1);

 #if !defined(EIGEN_HAS_INDEX_LIST)
-    Eigen::Tensor<int, 2>::Dimensions matrix_1_by_nnz{{ 1, nnz }};
-    Eigen::array<int, 2> n_by_1{{ n, 1 }};
-    Eigen::array<int, 1> reduce_on_rows{{ 0 }};
+    // Eigen::Tensor<int, 2>::Dimensions matrix_1_by_nnz{{ 1, nnz }};
+    Eigen::Tensor<int, 2>::Dimensions matrix_1_by_nnz;
+    matrix_1_by_nnz[0] = 1;
+    matrix_1_by_nnz[1] = nnz;
+    // Eigen::array<int, 2> n_by_1{{ n, 1 }};
+    Eigen::Tensor<int, 2>::Dimensions matrix_1_by_nnz;
+    matrix_1_by_nnz[0] = 1;
+    matrix_1_by_nnz[1] = nnz;
+    // Eigen::array<int, 2> n_by_1{{ n, 1 }};
+    Eigen::array<int, 2> n_by_1;
+    n_by_1[0] = n;
+    n_by_1[1] = 1;
+    // Eigen::array<int, 1> reduce_on_rows{{ 0 }};
+    Eigen::array<int, 1> reduce_on_rows;
+    reduce_on_rows[0]= 0;
 #else
     Eigen::IndexList<Eigen::type2index<1>, int> matrix_1_by_nnz;
     matrix_1_by_nnz.set(1, nnz);
diff --git a/tensorflow/stream_executor/cuda/cuda_gpu_executor.cc b/tensorflow/stream_executor/cuda/cuda_gpu_executor.cc
index 52256a7..1d027b9 100644
--- a/tensorflow/stream_executor/cuda/cuda_gpu_executor.cc
+++ b/tensorflow/stream_executor/cuda/cuda_gpu_executor.cc
@@ -888,6 +888,9 @@ CudaContext* CUDAExecutor::cuda_context() { return context_; }
 // For anything more complicated/prod-focused than this, you'll likely want to
 // turn to gsys' topology modeling.
 static int TryToReadNumaNode(const string &pci_bus_id, int device_ordinal) {
+// DC - make this clever later. ARM has no NUMA node, just return 0
+LOG(INFO) << "ARM has no NUMA node, hardcoding to return zero";
+return 0;
 #if defined(__APPLE__)
   LOG(INFO) << "OS X does not support NUMA - returning NUMA node zero";
   return 0;
```

之后即可编译:

```bash
$ ./configure
$ bazel build -c opt --jobs 2 --local_resources 1024,4.0,1.0 --config=cuda //tensorflow/tools/pip_package:build_pip_package
$ bazel-bin/tensorflow/tools/pip_package/build_pip_package /tmp/tensorflow_pkg
# The name of the .whl file will depend on your platform.
$ sudo pip install /tmp/tensorflow_pkg/tensorflow-0.11.0-py2-none-any.whl
```

这里有我自己编译好的 [tensorflow_gpu-0.11.0-py2-none-aarch64.whl](https://drive.google.com/open?id=0B0AsKkiz_kZRZG9BbFRxZ1FYWTg), 可供使用.

## Tips

### Swap Memory

如果编译失败, 很有可能是内存不足的原因, 因此可以外接U盘或是SSD等, 并且将一部分缓存放在上面.

```bash
$ cd /path/to/your/storage
$ fallocate -l 8G swapfile
$ chmod 600 swapfile
$ mkswap swapfile
$ sudo swapon swapfile
$ swapon -s
```

8G的 swap 空间应该是够用了, 如果还嫌不够可以再设个大点的.

之后再运行 Bazel 编译:

```bash
$ bazel build -c opt --local_resources 3072,4.0,1.0 --verbose_failures --config=cuda //tensorflow/tools/pip_package:build_pip_package
```

### Build on external storage

整个安装过程所需的空间大概是3G以上, 而 TX1 装完系统之后只剩下了 4G 的剩余空间. 所以最好将安装时的根目录选在外置的存储上, 以免因为内置存储空间不足而导致失败.

## References

- [http://stackoverflow.com/questions/39783919/tensorflow-on-nvidia-tx1/](http://stackoverflow.com/questions/39783919/tensorflow-on-nvidia-tx1/)
- https://github.com/tensorflow/tensorflow/issues/851
- [https://www.neotitans.net/install-tensorflow-on-odroid-c2.html](https://www.neotitans.net/install-tensorflow-on-odroid-c2.html)