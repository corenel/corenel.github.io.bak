---
title: Notes for Code School - ES2015
date: 2016-04-10 12:09:29
tags:
---

# Declaration

## Using let

**Understanding Hoisting**

Prior to executing our code, JavaScript moves var declarations all the way up to the top of the scope. This is known as hoisting.

```javascript
function loadProfiles(userNames){
  if(userNames.length > 3){
    var loadingMessage = "This might take a while..."; 
    _displaySpinner(loadingMessage);
    console.log(flashMessage); // undefined
  }else{
    var flashMessage = "Loading Profiles";
    _displayFlash(flashMessage);
  }
  console.log(flashMessage); // undefined
}

// The function above will be hoisted by JavaScript as follows
function loadProfiles(userNames){
  // Automatically moved here by the JavaScript runtime
  var loadingMessage, flashMessage;
  if(userNames.length > 3){
    loadingMessage = "This might take a while..."; 
    _displaySpinner(loadingMessage);
  }else{
    flashMessage = "Loading Profiles";
    _displayFlash(flashMessage);
  }
}
```

<!-- more -->

**Declaring Variables With let**

`let` variables are scoped to the nearest block and are NOT hoisted.

> A block is any code section within curly braces, like `if`, `else`, `for`, `while`, etc.

Using `let`, variables are "trapped "inside their respective if and else blocks.

```javascript
function loadProfiles(userNames){
  if(userNames.length > 3){
    let loadingMessage = "This might take a while..."; 
    _displaySpinner(loadingMessage);
    console.log(flashMessage); // ReferenceError: flashMessage is not defined
  }else{
    let flashMessage = "Loading Profiles";
    _displayFlash(flashMessage);
  }
  console.log(flashMessage); // ReferenceError: flashMessage is not defined 
}
```



## Using let in for loops

**Loop Values in Callbacks**

```javascript
function loadProfiles(userNames){
  for (var i in userNames){
    _fetchProfile("/users/" + userNames[i], function(){
      console.log("Fetched for ", userNmaes[i]);
    });
  }
}

loadProfiles(["Sam", "Tyler", "Brook", "Alex"]);
// Outputs:
// Fetched for Alex
// Fetched for Alex
// Fetched for Alex
// Fetched for Alex
```

* **Reason**

  1. variable `i` is hoisted to the top of the function and shared across each iteration of the loop.

  2. `fetchProfile` is called 4 times, before any of the callbacks are invoked.

  3. `i` is incremented on each iteration, finally it gets to `3`.

  4. When callbacks begin to run, `i` holds the last value assigned to it from the for loop.

  5. So callbacks prints `userNames[3]` all 4 times.

     ```javascript
     // By hoisting, The function above will be changed by JavaScript as follows
     function loadProfiles(userNames){
       var i;
       for (i in userNames){
         _fetchProfile("/users/" + userNames[i], function(){
           console.log("Fetched for ", userNmaes[i]);
         });
       }
     }
     ```

* **Soluition**: Using `let` in for Loops
  * With `let`, there's no sharing in for loops. A new variable is created on each iteration.
  * Each callback function now holds a reference to their own version of `i`.

    ```javascript
    function loadProfiles(userNames){
      for (let i in userNames){
        _fetchProfile("/users/" + userNames[i], function(){
          console.log("Fetched for ", userNmaes[i]);
        });
      }
    }

    loadProfiles(["Sam", "Tyler", "Brook", "Alex"]);
    // Outputs:
    // Fetched for Sam
    // Fetched for Tyler
    // Fetched for Brook
    // Fetched for Alex
    ```


**`let` Cannot Be Redeclared**

Variables declared with `let` can be reassigned, but cannot be redeclared within the same scope.

## Using const

**Issues With Magic Numbers**

> Magic Numbers: A magic number is a literal value without a clear meaning.

When used multiple times, magic numbers introduce unnecessary duplication, which can lead to bad code!

```javascript
function loadProfiles(userNames){
  if(userNames.length > 3){
    //...
  } else {
    //...
  }
  
  // Hard to tell whether both numbers serve the same purpose
  if(someValue > 3){
    //...
  }
}
```

**Replacing Magic Numbers With Constants**

* The const keyword creates read-only named constants.
* Once assigned, constants cannot be assigned a new value.
* Variables declared with const must be assigned an initial value.
* Variables declared with const are scoped to the nearest block.

```javascript
function loadProfiles(userNames){
  const MAX_USERS = 3;
  if(userNames.length > MAX_USERS){
    //...
  }else{
    //...
  }
  
  const MAX_REPLIES = 3;
  if(someElement > MAX_REPLIES){
    //...
  }
}
```

**let vs. const**

In most cases, let and const will behave very similarly. Consider the semantics when choosing 
one over the other.

* Use let when variables could be reassigned new values
* Use const when new variables are not expected to be reassigned new values



# Functions

## Function Defaults

**Issues With Flexible Function Arguments**

Unexpected arguments might cause errors during function execution.

```javascript
function loadProfiles(userNames){
  let namesLength = userNames.length;
  //...
}

loadProfiles(["Sam", "Tyler", "Brook"]); // OK
// Breaks when called with no arguments
loadProfiles(); // TypeError: Cannot read property 'length' of undefined
loadProfiles(undefined); // TypeError: Cannot read property 'length' of undefined
```

* **Manual Argument Checks Don't Scale Well**

  A common practice is to check for presence of arguments as the very first thing in the function.

  ```javascript
  function loadProfiles(userNames){
    let names = typeof userNames !== 'undefined' ? userNames : [];
    let namesLength = names.length;
    // ...
  }
  ```

* **Using Default Parameter Values**

  Default parameter values help move default values from the function body to the function signature.

  ```javascript
  // Uses empty array as default valuewhen no argument is passed
  function loadProfiles(userNames = []){
    let namesLength = userNames.length;
    console.log(namesLength);
  }

  // Does not break when invoked with no arguments
  loadProfiles(); // 0
  // Nor with explicit undefined as argument
  loadProfiles( ); // 0
  ```


**The Options Object**

The options object is a widely used pattern that allows user-defined settings to be passed to a function in the form of properties on an object.

```javascript
setPageThread("New Version out Soon!", {
  popular: true,
  expires: 10000,
  activeClass: "is-page-thread"
});

function setPageThread(name, options = {}){
  let popular = options.popular;
  let expires = options.expires;
  let activeClass = options.activeClass;
  //...
}
```

* **Issues With the Options Object**

  The options object makes it hard to know what options a function accepts.


* **Using Named Parameters**

  Using named parameters for optional settings makes it easier to understand how a function should be invoked.

* **Omitting Certain Arguments on Call**

  * It's okay to omit some options when invoking a function with named parameters.
  * It's NOT okay to omit the options argument altogether when invoking a function with named parameters when no default value is set for them.

  ```javascript
  function setPageThread(name, { popular, expires, activeClass } = {}){
    console.log("Name: ", name);
    console.log("Popular: ", popular);
    console.log("Expires: ", expires);
    console.log("Active: " , activeClass);
  }

  setPageThread("New Version out Soon!");
  // Outputs:
  // Name: New Version out Soon!
  // Popular: undefined
  // Expires: undefined
  // Active: undefined
  ```

## Rest Params, Spread Op, Arrow Func

### Rest Parameters

**Issues With the arguments Object**

The `arguments` object is a built-in, Array-like object that corresponds to the arguments of a function. Here's why relying on this object to read arguments is not ideal:

```javascript
// Hard to tell which parameters this function expects to be called with
function displayTags(){
  // Where did this come from?!
  for(let i in arguments){
    let tag = arguments[i];
    _addToTopic(tag);
  }
}

// If we add an argument
function displayTags(targetElement){
  let target = _findElement(targetElement);
  // We'll break the loop, since the first argument is no longer a tag
  for(let i in arguments){ 
    let tag = arguments[i];
    _addToTopic(target, tag);
  }
}
```

**Using Rest Parameters**

The new rest parameter syntax allows us to represent an indefinite number of arguments as an Array. This way, changes to function signature are less likely to break code.

```javascript
function displayTags(...tags){
  // tags is an Array object
  for(let i in tags){
    let tag = [i];
    _addToTopic(tag);
  }
}.

// ...tags must always go last
function displayTags(targetElement, ...tags){
  let target = _findElement(targetElement);
  for(let i in tags){
    let tag = [i];
    _addToTopic(target, tag);
  }
}
```

### Spread Operator

**Splitting Arrays Into Individual Arguments**

We need a way to convert an Array into individual arguments upon a function call.

```javascript
getRequest("/topics/17/tags", function( ){
  let tags = data.tags;  // tags is an Array, e.g., ["programming", "web", "HTML"] ...
  displayTags(tags); // but displayTags expects to be called with individual arguments
})
```

**Using the Spread Operator**

The spread operator allows us to split an Array argument into individual elements.

```javascript
getRequest("/topics/17/tags", function( ){
  let tags = data.tags;
  displayTags(...tags);  // The displayTags function is now receiving individual arguments, not an Array
})
```

**Rest and Spread look the same**

Rest parameters and the spread operator look the same, but the former is used in **function definition**s and the latter in **function invocations**.

### Arrow Functions

**Issues With Scope in Callback Functions**

Anonymous functions passed as callbacks to other functions create their own scope.

```javascript
function TagComponent(target, urlPath){
  this.targetElement = target;
  this.urlPath = urlPath;
}.

// The scope of the TagComponent object is not the same as the scope of the anonymous function
TagComponent.prototype.render = function(){
  getRequest(this.urlPath, function(data){
    let tags = data.tags;
    displayTags(this.targetElement, ...tags); // Returns undefined
  });
}

let tagComponent = new TagComponent(targetDiv, "/topics/17/tags");
tagComponent.render();
```

**Using Arrow Functions to Preserve Scope**

Arrow functions bind to the scope of where they are defined, not where they are called. (also known as lexical binding)

```javascript
function TagComponent(target, urlPath){
  this.targetElement = target;
  this.urlPath = urlPath;
}.

TagComponent.prototype.render = function(){
  // Arrow functions bind to the lexical scope
  getRequest(this.urlPath, (data) => {
    let tags = data.tags;
    // this now properly refers to the TagComponent object
    displayTags(this.targetElement, ...tags);
  });
}

let tagComponent = new TagComponent(targetDiv, "/topics/17/tags");
tagComponent.render();
```

