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

The for...of statement iterates over property values, and it's a better way to loop over arrays and other iterable objects.

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

// Objects That Don't Work With for...of
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

`Maps` are iterable, so they can be used in a `for...of` loop. Each run of the loop returns a [key, value] pair for an entry in the Map.

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

* **All available methods on a WeakMap require access to an object used as a key.**

  ```javascript
  let user = {};

  let mapSettings = new WeakMap();
  mapSettings.set( user, );

  console.log( mapSettings.get(user) ); // ES2015
  console.log( mapSettings.has(user) ); // true
  console.log( mapSettings.delete(user) ); // true
  ```

* **WeakMaps are not iterable, therefore they can't be used with for...of**

  ```javascript
  for(let [key,value] of mapSettings){
    console.log(`${key} = ${value}`);
    // mapSettings[Symbol.iterator] is not a function
  }
  ```

* **WeakMaps Are Better With Memory**

  Individual entries in a WeakMap can be garbage collected while the WeakMap itself still exists.

## Sets

### Sets and Arrays

**Limitations With Arrays**

Arrays don't enforce uniqueness of items. Duplicate entries are allowed.

```javascript
let tags = [];

tags.push( "JavaScript" );
tags.push( "Programming" );
tags.push( "Web" );
tags.push( "Web" ); // Duplicate entry

console.log( "Total items ", tags.length ); // Total items 4
```

**Using Set**

The `Set` object stores unique values of any type, whether primitive values or object references.

```javascript
let tags = new Set();

tags.add("JavaScript");
// Both primitive values and objects are allowed
tags.add("Programming");
tags.add({ version: "2015" });
tags.add("Web");
tags.add("Web"); // Duplicate entries are ignored

console.log("Total items ", tags.size); // Total items 4
```

**Using Set as Enumerable Object**

`Set` objects are iterable, which means they can be used with `for...of` and destructuring.

```javascript
let tags = new Set();

tags.add("JavaScript");
tags.add("Programming");
tags.add({ version: "2015" });
tags.add("Web");

for(let tag of tags){
  console.log(tag);
}
// OUTPUTS:
// JavaScript
// Programming
// { version: '2015' }
// Web

let [a,b,c,d] = tags;
console.log(a, b, c, d);
// OUTPUTS:
// JavaScript Programming { version: '2015' } Web
```

### WeakSet

* The `WeakSet` is a type of Set where **only objects** are allowed to be stored.


* `WeakSets` don't prevent the garbage collector from collecting entries that are no longer used in other parts of the system


* `WeakSets` cannot be used with `for...of` and they offer **no methods for reading values from it**.

**Using WeakSets to Show Unread Posts**

* We want to add a different background color to posts that have not yet been read.


* We can use WeakSets to create special groups from existing objects without mutating them.


* Favoring immutable objects allows for much simpler code with no unexpected side effects.

```javascript
let readPosts = new WeakSet();

//...when post is clicked on
postList.addEventListener('click', (event) => {
  // ...
  // Adds object to a group of read posts
  readPosts.add(post);
});

// ...rendering posts
for(let post of postArray){
  // The has() method checks whether 
  // an object is present in the WeakSet
  if(!readPosts.has(post)){
    _addNewPostClass(post.element);
  }
}
```



# Classes and Modules

## Classes

**Using a Function Approach**

A common approach to encapsulation in JavaScript is using a constructor function.

```javascript
function SponsorWidget(name, description, url){
  this.name = name;
  this.description = description;
  this.url = url;
}

// Too verbose!
SponsorWidget.prototype.render = function(){
  //...
};

// Invoking the SponsorWidget function looks like this:
let sponsorWidget = new SponsorWidget(name, description, url);
sponsorWidget.render();
```

**Using the New Class Syntax**

To define a class, we use the class keyword followed by the name of the class. The body of a class is the part between curly braces.

```javascript
class SponsorWidget {
  // Runs every time a new instance is created with the new operator
  constructor(name, description, url){
    // ...
    // Don't forget to use this to access instance properties and methods
    this.url = url;
  }
  
  // Can access previously assigned instance variables
  render(){
    let link = this._buildLink(this.url);
    // ...
  }

  // Prefixing a method with an underscore is a
  // convention for indicating that it should not
  // be invoked from the public API
  _buildLink(url){
    // ...
  }
}

let sponsorWidget = new SponsorWidget(name, description, url);
sponsorWidget.render();
```

**Class Inheritance**

We can use class inheritance to reduce code repetition. Child classes inherit and specialize behavior defined in parent classes.

![cass_inheritance](/images/class_inheritance.png)

**Using extends to Inherit From Base Class**

The `extends` keyword is used to create a class that inherits methods and properties from another class. The `super` method runs the constructor function from the parent class.

```javascript
// Parent Class
class Widget {
  constructor(){
    this.baseCSS = "site-widget";
  }
  parse(value){
    //...
  }
}

// Child Class
class SponsorWidget extends Widget {
  constructor(name, description, url){
    // runs parent's setup code
    super();
    //...
  }
  render(){
    let parsedName = this.parse(this.name);
    let css = this._buildCSS(this.baseCSS);
    //...
  }
}
```

**Overriding Inherited Methods**

Child classes can invoke methods from their parent classes via the super object.

```javascript
// Parent Class
class Widget {
  constructor(){
    this.baseCSS = "site-widget";
  }
  parse(value){
    //...
  }
}

// Child Class
class SponsorWidget extends Widget {
  constructor(name, description, url){
    super();
    //...
  }
  parse(){
    // Calls the parent version of the parse() method
    let parsedName = super.parse(this.name);
    return `Sponsor: ${parsedName}`;
  }
  render(){
    //...
  }
}
```

## Modules

### Function Modules

**Polluting the Global Namespace**

The common solution for modularizing code relies on using global variables. This increases the chances of unexpected side effects and potential naming conflicts.

```html
<!DOCTYPE html>
<body>
  <!-- Libraries add to the global namespace -->
  <script src="./jquery.js"></script>
  <script src="./underscore.js"></script>
  <script src="./flash-message.js"></script>
</body>
```

```javascript
// Global variables can cause naming conflicts
let element = $("...").find(...);
let filtered = _.each(...);
flashMessage("Hello");
```

**Creating Modules**

```javascript
// flash-message.js
// The export keyword exposes this function to the module system
// The default type export is the simplest way to export a function
export default function(message){
  alert(message);
}
  
// app.js
// Can be named anything because it's default export
import flashMessage from './flash-message';
flashMessage("Hello");
```

```html
<!DOCTYPE html>
<body>
  <!-- Not adding to the global namespace -->
  <script src="./flash-message.js"></script>
  <script src="./app.js"></script>
</body>
```

**Using Named Exports**

In order to export multiple functions from a single module, we can use the named export.

```javascript
// flash-message.js
export function (message){
  alert(message);
}
export function logMessage(message){
  console.log(message);
}

// app.js
import { alertMessage, logMessage } from './flash-message';
alertMessage('Hello from alert');
logMessage('Hello from log');
```

**Importing a Module as an Object**

```javascript
// app.js
import * as flash from './flash-message';

flash.alertMessage('Hello from alert');
falsh.logMessage('Hello from log');
```

**Removing Repeated Export Statements**

```javascript
// flash-message.js
function alertMessage(message){
  alert(message);
}
function logMessage(message){
  console.log(message);
}
// export can take multiple function names between curly braces
export { alertMessage, logMessage };

// app.js
// Imported just like before
import { alertMessage, logMessage } from './flash-message';
alertMessage('Hello from alert');
logMessage('Hello from log');
```

### Export and import Constants

**Extracting Hardcoded Constants**

Redefining constants across our application is unnecessary repetition and can lead to bugs.

```javascript
// load-profiles.js
function loadProfiles(userNames){
  const MAX_USERS = 3;
  if(userNames.length > MAX_USERS){
    //...
  }
  const MAX_REPLIES = 3;
  if(someElement > MAX_REPLIES){
    //...
  }
}
export { loadProfiles }

// list-replies.js
function listReplies(replies=[]){
  const MAX_REPLIES = 3;
  if(replies.length > MAX_REPLIES){
    //...
  }
}
export { listReplies }

// display-watchers.js
function displayWatchers(watchers=[]){
  const MAX_USERS = 3;
  if(watchers.length > MAX_USERS){
    //...
  }
}
export { displayWatchers }
```

**Export Constants**

Placing constants on their own module allows them to be reused across other modules and hides implementation details (a.k.a., encapsulation).

```javascript
// constants.js
const MAX_USERS = 3;
const MAX_REPLIES = 3;
export { MAX_USERS, MAX_REPLIES };
```

**Import Constants**

To import constants, we can use the exact same syntax for importing functions.

We can now import and use our constants from other places in our application.

```javascript
// load-profiles.js
import { MAX_REPLIES, MAX_USERS } from './constants';
function loadProfiles(userNames){
  if(userNames.length > MAX_USERS){
    //...
  }
  if(someElement > MAX_REPLIES){
    //...
  }
}

// list-replies.js
import { MAX_REPLIES } from './constants';
function listReplies(replies = []){
  if(replies.length > MAX_REPLIES){
    //...
  }
}

// display-watchers.js
import { MAX_USERS } from './constants';
function displayWatchers(watchers = []){
  if(watchers.length > MAX_USERS){
    //...
  }
}
```

### Class Modules

* Exporting Class Modules With Default Export
* Using Class Modules With Named Export

```javascript
// flash-message.js
class FlashMessage {
  constructor(message){
    this.message = message;
  }
  renderAlert(){
    alert(`${this.message} from alert`);
  }
  renderLog(){
    console.log(`${this.message} from log`);
  }
}
export { FlashMessage }

// app.js
import { FlashMessage } from './flash-message';
let flash = new FlashMessage("Hello");
flash.renderAlert();
flash.renderLog();
```

# Promises, Iterators, and Generators

## Promises

**Fetching Poll Results From the Server**

It?s very important to understand how to work with JavaScript?s single-thread model.

Otherwise, we might accidentally freeze the entire app, to the detriment of user experience.

![fetching-poll-results-from-the-server](/images/fetching-poll-results-from-the-server.png)

**Avoiding Code That Blocks**

Once the browser blocks executing a script, it stops running other scripts, rendering elements, and responding to user events like keyboard and mouse interactions.

```javascript
// Synchronous style functions wait for return values
// Page freezes until a value is returned from this function
let results = getPollResultsFromServer("Sass vs. LESS");
ui.renderSidebar(results);
```

In order to avoid blocking the main thread of execution, we write non-blocking code like this:

```javascript
// Asynchronous style functions pass callbacks
getPollResultsFromServer("Sass vs. Less", function(results){
  ui.renderSidebar(results);
});
```

**Passing Callbacks to Continue Execution**

In continuation-passing style (CPS) async programming, we tell a function how to continue execution by passing callbacks. It can grow to complicated nested code.

```javascript
// When nested callbacks start to grow, our code becomes harder to understand
getPollResultsFromServer(pollName, function(error, results){
  if(error){ //.. handle error }
    //...
    ui.renderSidebar(results, function(error){
      if(error){ //.. handle error }
        //...
        sendNotificationToServer(pollName, results, function(error, response){
          if(error){ //.. handle error }
            //...
            doSomethingElseNonBlocking(response, function(error){
              if(error){ //.. handle error }
                //...
            })
        });
    });
});
```

**Using Promises**

A Promise is a new abstraction that allows us to write async code in an easier way.

```javascript
// Still non-blocking, but not using nested callbacks anymore
getPollResultsFromServer("Sass vs. LESS")
  .then(ui.renderSidebar)
  .then(sendNotificationToServer)
  .then(doSomethingElseNonBlocking)
  .catch(function(error){
    console.log("Error: ", error);
  });
```

**The Lifecycle of a Promise Object**

Creating a new Promise automatically sets it to the pending state. Then, it can do 1 of 2 things: become fulfilled or rejected.

![the-lifecycle-of a promise-object](/images/the-lifecycle-of a promise-object.png)

**Creating a New Promise Object**

The Promise constructor function takes an anonymous function with 2 callback arguments known as handlers.

```javascript
function getPollResultsFromServer(pollName){
  // Handlers are responsible for either resolving or rejecting the Promise
  return new Promise( function(resolve, reject) {
    //...
    // Called when the non-blocking code is done executing
    resolve(someValue);
    //...
    // Called when an error occurs
    reject(someValue);
  });
};
```

**Resolving a Promise**

Let?s wrap the XMLHttpRequest object API within a Promise. Calling the resolve() handler moves the Promise to a fulfilled state.

```javascript
function getPollResultsFromServer(pollName){
  return new Promise(function(resolve, reject){
    let url = `/results/${pollName}`;
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // We call the resolve() handler upon a successful response
        // Resolving a Promise moves it to a fulfilled state
        resolve(JSON.parse(request.response));
      }
    };
    //...
    request.send();
  });
};
```

**Reading Results From a Promise**

We can use the then() method to read results from the Promise once it?s resolved. This method takes a function that will only be invoked once the Promise is resolved.

```javascript
getPollResultsFromServer("Sass vs. Less")
  .then(function(results){ 
    ui.renderSidebar(results);
  });
```

**Chaining Multiple Thens**

We can also chain multiple calls to then() ? the return value from 1 call is passed as argument to the next.

```javascript
getPollResultsFromServer("Sass vs. Less")
  .then(function(results){
    // Only returns poll results from Orlando
    return results.filter((result) => result.city === "Orlando");
  })
  // The return value from one call to then
  // becomes the argument to the following call to then.
  .then(function(resultsFromOrlando){
    ui.renderSidebar(resultsFromOrlando);
  });
```

**Rejecting a Promise**

```javascript
function getPollResultsFromServer(pollName){
  return new Promise(function(resolve, reject){
    //...
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.response);
      } else {
        // We call the reject() handler,passing it a new Error object
        // Rejecting a Promise moves it to a rejected state
        reject(new Error(request.status));
      }
    };
    request.onerror = function() {
      reject(new Error("Error Fetching Results"));
    };
    //...
```

**Catching Rejected Promises**

Once an error occurs, execution moves immediately to the catch() function. None of the remaining then() functions are invoked.

```javascript
// When an error occurs here
getPollResultsFromServer("Sass vs. Less")
  // then none of these run
  .then(function(results){
    return results.filter((result) => result.city === "Orlando");
  })
  .then(function(resultsFromOrlando){
    ui.renderSidebar(resultsFromOrlando);
  })
  // and execution moves straight here.
  .catch(function(error){
    console.log("Error: ", error);
  });
```

**Passing Functions as Arguments**

We can make our code more succinct by passing function arguments to then, instead of using anonymous functions.

```javascript
function filterResults(results){ //... }
let ui = {
  renderSidebar(filteredResults){ //... }
};
  
getPollResultsFromServer("Sass vs. Less")
  // Passing function arguments make this code easier to read
  .then(filterResults)
  .then(ui.renderSidebar)
  // Still catches all errors from previous calls
  .catch(function(error){
    console.log("Error: ", error);
  });
```

