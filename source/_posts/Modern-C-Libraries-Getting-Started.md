---
title: 'Modern C++ Libraries: Getting Started'
date: 2017-04-25 21:06:39
categories:
- Notes
tags:
  - Pluralsight
  - C++
  - C++11
---
This post is a note for Modern C++ Libraries in Pluralsight.

<!-- more -->

## Assertions

### Course content

An **Assertion** may be a function, but usually a macro, that brings your application to an immediate standstill if an assumption is broken.

Assertions **document the assumptions** such that those assumptions can be **validated** usually at run time, but also increasingly at compile time.

- Check pointers before using them (at run time):

  ```c++
  assert(pointer);
  ```

- Confirm the  validity of some input at the boundary of application or component (at run time):

- Confirm some expressions at compile time (no need to execute)

  ```c++
  static_assert(sizeof(float) == 4, "I can’t float like that!");
  ```

**Static or compile time Assertions** are checked staticially during build. And **Runtime Assertions** are typically conditionally complied and included owning debug builds and stripped out of release or free builds.

> Runtime Assertions must not include expression that the application relies upon. It should not change the application state in any way.

### C++ documentation

#### assert

The definition of the macro `assert` depends on another macro, **`NDEBUG`**, which is not defined by the standard library.

If `NDEBUG` is defined as a macro name at the point in the source code where `<cassert>` is included, then `assert` does nothing.

If `NDEBUG` is not defined, then `assert` checks if its argument (which must have scalar type) compares equal to zero. If it does, `assert` outputs implementation-specific diagnostic information on the standard error output and calls *std::abort*.

##### Notes

Because `assert` is a *function-like macro*, commas anywhere in condition that are not protected by parentheses are interpreted as macro argument separators. Such commas are often found in template argument lists:

```c++
assert(std::is_same_v<int, int>); // error: assert does not take two arguments
assert((std::is_same_v<int, int>)); // OK: one argument
static_assert(std::is_same_v<int, int>); // OK: not a macro
```

##### Example

```c++
#include <iostream>
// uncomment to disable assert()
// #define NDEBUG
#include <cassert>
 
int main()
{
    assert(2+2==4);
    std::cout << "Execution continues past the first assert\n";
    assert(2+2==5);
    std::cout << "Execution continues past the second assert\n";
}
```

Possible output:

```
Execution continues past the first assert
test: test.cc:10: int main(): Assertion `2+2==5' failed.
Aborted
```

#### Static Assertion

Performs compile-time assertion checking

##### Note

Since message has to be a string literal, it cannot contain dynamic information or even a constant expression that is not a string literal itself. In particular, it cannot contain the name of the template type argument.

##### Example

```c++
#include <type_traits>
 
template <class T>
void swap(T& a, T& b)
{
    static_assert(std::is_copy_constructible<T>::value,
                  "Swap requires copying");
    static_assert(std::is_nothrow_move_constructible<T>::value
               && std::is_nothrow_move_assignable<T>::value,
                  "Swap may throw");
    auto c = b;
    b = a;
    a = c;
}
 
template <class T>
struct data_structure
{
    static_assert(std::is_default_constructible<T>::value,
                  "Data Structure requires default-constructible elements");
};
 
struct no_copy
{
    no_copy ( const no_copy& ) = delete;
    no_copy () = default;
};
 
struct no_default
{
    no_default () = delete;
};
 
int main()
{
    int a, b;
    swap(a, b);
 
    no_copy nc_a, nc_b;
    swap(nc_a, nc_b); // 1
 
    data_structure<int> ds_ok;
    data_structure<no_default> ds_error; // 2
}
```

Possible output:

```
1: error: static assertion failed: Swap requires copying
2: error: static assertion failed: Data Structure requires default-constructible elements
```



## VERIFY

`Verify` behaves exactly the same as Assert in debug builds. Indeed it is an Assertion. But in release builds it drops the verification, but keeps the expression. 

Unlike runtime Assertions the Verify macro is used for those cases where the expression is essential to the applications operation and cannot simply be stripped out of release builds.

```c++
#ifndef NDEBUG
#define VERIFY assert
#else
#define VERIFY(experssion) (expression)
#endif
```



## TRACE

`Trace` macro is to provide formatted output for the debugger to display, but that can be stripped out of release builds. 

Following code works only in VC++:

```c++
#include <stdio.h>
#include <windows.h>

#ifdef _DEBUG
inline auto Trace(wchar_t const * format, ...) -> void
{
    va_list args;
    va_start(args, format);

    wchar_t buffer [256];

    ASSERT(-1 != _vsnwprintf_s(buffer,
                               _countof(buffer) -1,
                               format,
                               args));

    va_end(args);

    OutputDebugString(buffer);
}

struct Tracer
{
    char const * m_filename;
    unsigned m_line;

    Tracer(char const * filename, unsigned const line) :
        m_filename { filename },
        m_line { line }
    {

    }

    template <typename... Args>
    auto operator()(wchar_t const * format, Args... args) const -> void
    {
        wchar_t buffer [256];

        auto count = swprintf_s(buffer,
                                L"%S(%d): ",
                                m_filename,
                                m_line);

        ASSERT(-1 != count);

        ASSERT(-1 != _snwprintf_s(buffer + count,
                                  _countof(buffer) - count,
                                  _countof(buffer) - count - 1,
                                  format,
                                  args...));

        OutputDebugString(buffer);
    }
};

#endif

#ifdef _DEBUG
#define TRACE Tracer(__FILE__, __LINE__)
#else
#define TRACE __noop
#endif

auto main() -> int
{
    TRACE(L"1 + 2 = %d\n", 1 + 2);
}
```

## My point

Assertions are useful, however, `VERIFY` and `TRACE` can be repalced by other logging libaries.