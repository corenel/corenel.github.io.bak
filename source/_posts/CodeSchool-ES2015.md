---
title: Notes for Code School - ES2015
date: 2016-04-10 12:09:29
categories:
- Notes
tags:
  - CodeSchool
  - JavaScript
  - ES2015

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
  // tags is an Array, e.g., ["programming", "web", "HTML"] ...
  let tags = data.tags;
  // but displayTags expects to be called with individual arguments
  displayTags(tags);
})
```

**Using the Spread Operator**

The spread operator allows us to split an Array argument into individual elements.

```javascript
getRequest("/topics/17/tags", function( ){
  let tags = data.tags;
  // The displayTags function is now receiving individual arguments, 
  // not an Array
  displayTags(...tags);
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

// The scope of the TagComponent object is not the same as 
// the scope of the anonymous function
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



# Objects, Strings, and Object.assign

## Objects

**The Object Initializer Shorthand**

We can remove duplicate variable names from object properties when those properties have the same name as the variables being assigned to them.

```javascript
function buildUser(first, last){
  let fullName = first + " " + last;
  return { first, last, fullName };
  // EQUAL TO
  // return { first: first, last: last, fullName: fullName};
}
```

**Object Destructuring**

We can use shorthand to assign properties from objects to local variables with the same name.

```javascript
let { first, last, fullName } = buildUser("Sam", "Williams");
// EQUAL TO
// let user = buildUser("Sam", "Williams");
// let first = user.first;
// let last = user.last;
// let fullName = user.fullName;

// Destructuring Selected Elements
let { fullName } = buildUser("Sam", "Williams");
```

**Using the Method Initializer Shorthand**

A new shorthand notation is available for adding a method to an object where the keyword function is no longer necessary.

```javascript
function buildUser(first, last, postCount){
  let fullName = first + " " + last;
  const ACTIVE_POST_COUNT = 10;
  return {
    first,
    last,
    fullName, 
    isActive(){ // EQUAL TO isActive: function(){}
      return postCount >= ACTIVE_POST_COUNT;
    }
  }
}
```

## Strings

**Template Strings**

Template strings are string literals allowing embedded expressions. This allows for a much better way to do string interpolation.

```javascript
function buildUser(first, last, postCount){
  let fullName = `${first} ${last}`;
  // EQUAL TO
  // let fullName = first + " " + last;
  const ACTIVE_POST_COUNT = 10;
  //...
}
```

**Writing Multi-line Strings**

Template strings offer a new - and much better - way to write multi-line strings.

```javascript
let userName = "Sam";
let admin = { fullName: "Alex Williams" };
let veryLongText = `Hi ${userName},
  this is a very
  very
  veeeery
  long text.
  Regards,
    ${admin.fullName}
`;
```

> Template Strings use **back-ticks (\`\`)** rather than the single or double quotes we're used to with regular strings.

## Object.assign

**Using Too Many Arguments Is Bad**

For functions that need to be used across different applications, it's okay to accept an options object instead of using named parameters

```javascript
// Too many named arguments make this function harder to read
function countdownTimer(target, timeLeft,
                         { container, timeUnit, clonedDataAttribute,
                         timeoutClass, timeoutSoonClass, timeoutSoonSeconds 
                         } = {}){
  //...
}

// Easier to customize to different applications
function countdownTimer(target, timeLeft, options = {}){
  //...
}
```

**Using Local Values and || Is Bad for Defaults**

Some options might not be specified by the caller, so we need to have default values.

```javascript
function countdownTimer(target, timeLeft, options = {}){
  // Default strings and numbers are all over the place... Yikes!
  let container = options.container || ".timer-display";
  let timeUnit = options.timeUnit || "seconds";
  let clonedDataAttribute = options.clonedDataAttribute || "cloned";
  let timeoutClass = options.timeoutClass || ".is-timeout";
  let timeoutSoonClass = options.timeoutSoonClass || ".is-timeout-soon";
  let timeoutSoonTime = options.timeoutSoonSeconds || 10;
  //...
}
```

**Using a Local Object to Group Defaults**

Using a local object to group default values for user options is a common practice and can help write more idiomatic JavaScript.

```javascript
function countdownTimer(target, timeLeft, options = {}){
  let defaults = {
    container: ".timer-display",
    timeUnit: "seconds",
    clonedDataAttribute: "cloned",
    timeoutClass: ".is-timeout",
    timeoutSoonClass: ".is-timeout-soon",
    timeoutSoonTime: 10
  };
  //...
}
```

**Merging Values With Object.assign**

The `Object.assign` method copies properties from one or more source objects to a target object specified as the very first argument.

```javascript
function countdownTimer(target, timeLeft, options = {}){
  let defaults = {
    //...
  };

  // Merged properties from defaults and options
  // Target object is modified and used as return value
  // Source objects remain unchanged
  let settings = Object.assign({}, defaults, options);
  //...
}
```

**Merging Objects With Duplicate Properties**

In case of duplicate properties on source objects, the value from the last object on the chain always prevails.

```javascript
function countdownTimer(target, timeLeft, options = {}){
  let defaults = {
    //...
  };

  // Duplicate properties from options3 override those on options2, 
  // which override those on options, etc.
  let settings = Object.assign({}, defaults, options, options2, options3);
  //...
}
```

**Using Object.assign**

There are a couple incorrect ways we might see Object.assign being used.

```javascript
// NOT recommanded
// defaults is mutated, so we can't go back and access original default
// values after the merge
Object.assign(defaults, options);

// Recommanded
// Can access original default values and looks functional
let settings = Object.assign({}, defaults, options);

// NOT recommanded
// Default values are not changed, but settings is passed as a reference
let settings = {};
// Not reading return value
Object.assign(settings, defaults, options);
```

**Reading Initial Default Values**

Preserving the original default values gives us the ability to compare them with the options passed and act accordingly when necessary.

```javascript
function countdownTimer(target, timeLeft, options = {}){
  let defaults = {
    //...
  };
  
  let settings = Object.assign({}, defaults, options);
  
  // Runs when value passed as argument for timeUnit is different than the original value
  if(settings.timeUnit !== defaults.timeUnit){
    _conversionFunction(timeLeft, settings.timeUnit)
  }
}
```



# Arrays, Maps, and Sets

## Arrays

### Array Destructuring

**Reading Values With Array Destructuring**

We can use destructuring to assign multiple values from an array to local variables.

```javascript
let users = ["Sam", "Tyler", "Brook"];
let a b c [ ] , , = users;
console.log( a, b, c ); // Sam Tyler Brook
```

Values can be discarded

```javascript
let [a, , b] = users;
console.log( a, b ); // Sam Brook 
```

**Combining Destructuring With Rest Params**

We can combine destructuring with rest parameters to group values into other arrays.

```javascript
let users = ["Sam", "Tyler", "Brook"];
let [ first, ...rest ] = users;
console.log( first, rest ); // Sam ["Tyler", "Brook"] 
```

**Destructuring Arrays From Return Values**

When returning arrays from functions, we can assign to multiple variables at once.

```javascript
function activeUsers(){
  let users = ["Sam", "Alex", "Brook"];
  return users;
}

let active = activeUsers();
console.log( active ); // ["Sam", "Alex", "Brook"] 

let [a, b, c] = activeUsers();
console.log( a, b, c ); // Sam Alex Brook 
```

### for...of

**Using for...of to Loop Over Arrays**

The for...of statement iterates over property values, and it?s a better way to loop over arrays and other iterable objects.

```javascript
let names = ["Sam", "Tyler", "Brook"];

// Uses index to read actual element
for(let index in names){
  console.log( names[index] ); // Sam Tyler Brook 
}

// Reads element directly and with less code involved
for(let name of names){
  console.log( name ); // Sam Tyler Brook 
}
```

**Limitations of  for...of and Objects**

The for...of statement cannot be used to iterate over properties in plain JavaScript objects out-of-the-box.

In order to work with for...of, objects need a special function assigned to the Symbol.iterator 
property. The presence of this property allows us to know whether an object is iterable.

```javascript
// Objects That Work With for...of
let names = ["Sam", "Tyler", "Brook"];
console.log( typeof names[Symbol.iterator] ); // function
for(let name of names){
  console.log( name ); // Sam Tyler Brook 
}

// Objects That Don?t Work With for...of
let post = {
  title: "New Features in JS",
  replies: 19,
  lastReplyFrom: "Sam"
};
console.log( typeof post[Symbol.iterator] ); // undefined
for(let property of post){
  console.log( property );
  // TypeError: post[Symbol.iterator] is not a function
}
```

### Array.find

**Finding an Element in an Array**

Array.find returns the first element in the array that satisfies a provided testing function.

```javascript
let users = [
  { login: "Sam",   admin: false },
  { login: "Brook", admin: true  },
  { login: "Tyler", admin: true  }
];

// Returns first object for which user.admin is true
let admin = users.find( (user) => {
  return user.admin;
});
console.log( admin ); // { "login" : "Brook", "admin" : true }

// One-liner arrow function
let admin = users.find( user => user.admin );
console.log( admin ); // { "login" : "Brook", "admin" : true }
```

## Maps

### Maps and Objects

**The Map Data Structure**

![the_map_data_strcture](/images/the_map_data_strcture.png)

**Issues With Using Objects as Maps**

When using Objects as maps, its keys are always converted to strings.

```javascript
// Two different objects
let user1 = { name: "Sam" };
let user2 = { name: "Tyler" };

// Both objects are converted to the string "[object Object]"
let totalReplies = {};
totalReplies[user1] = 5;
totalReplies[user2] = 42;

console.log( totalReplies[user1] ); // 42
console.log( totalReplies[user2] ); // 42
console.log( Object.keys(totalReplies) ); //  ["[object Object]"]
```

**Storing Key/Values With Map**

The Map object is a simple key/value data structure. Any value may be used as either a key or a value, and objects are not converted to strings.

```javascript
let user1 = { name: "Sam" };
let user2 = { name: "Tyler" };

let totalReplies = new Map();
totalReplies.set( user1, 5 );
totalReplies.set( user2, 42 );

console.log( totalReplies.get(user1) ); // 5
console.log( totalReplies.get(user2) ); // 42
```

> We use the `get()` and `set()` methods to access values in Maps

**Use Maps When Keys Are Unknown Until Runtime**

```javascript
let recentPosts = new Map();
createPost(newPost, (data) => {
  // Keys unknown until runtime, so... Map!
  recentPosts.set( data.author, data.message );
});

const POSTS_PER_PAGE = 15;
let userSettings = {
  // Keys are previously defined, so... Object!
  perPage: POSTS_PER_PAGE,
  showRead: true,
};
```

**Use Maps When Types Are the Same**

```javascript
let recentPosts = new Map();
createPost(newPost, (data) => {
  recentPosts.set( data.author, data.message );
});
// ...somewhere else in the code
socket.on('new post', function(data){
  // All keys are the same type, 
  // and all values are the same type, so Map!
  recentPosts.set( data.author, data.message );
});

const POSTS_PER_PAGE = 15;
let userSettings = {
  // Some values are numeric, others are boolean, so Object!
  perPage: POSTS_PER_PAGE,
  showRead: true,
};
```

**Iterating Maps With for...of**

Maps are iterable, so they can be used in a for?of loop. Each run of the loop returns a [key, value] pair for an entry in the Map.

```javascript
let mapSettings = new Map();

mapSettings.set( "user", "Sam" );
mapSettings.set( "topic", "ES2015" );
mapSettings.set( "replies", ["Can't wait!", "So Cool"] );

for(let [key, value] of mapSettings){
  console.log(`${key} = ${value}`);
  // user = Sam
  // topic = ES2015
  // replies = Can't wait!,So Cool
}
```

### WeakMap

The WeakMap is a type of Map where only objects can be passed as keys. Primitive data types - such as strings, numbers, booleans, etc. - are not allowed.

```javascript
let user = {};
let comment = {};

let mapSettings = new WeakMap();
mapSettings.set( user, "user" );
mapSettings.set( comment, "comment" );

console.log( mapSettings.get(user) ); //  user
console.log( mapSettings.get(comment) ); // comment

mapSettings.set("title", "ES2015"); // Invalid value used as weak map key
```

* All available methods on a WeakMap require access to an object used as a key.

  ```javascript
  let user = {};

  let mapSettings = new WeakMap();
  mapSettings.set( user, );

  console.log( mapSettings.get(user) ); // ES2015
  console.log( mapSettings.has(user) ); // true
  console.log( mapSettings.delete(user) ); // true
  ```

* WeakMaps are not iterable, therefore they can?t be used with for...of

  ```javascript
  for(let [key,value] of mapSettings){
    console.log(`${key} = ${value}`);
    // mapSettings[Symbol.iterator] is not a function
  }
  ```

  ?