---
title: Notes for Code School - Shaping up with Angular.js
date: 2016-04-14 21:19:22
categories:
- Notes
tags:
  - CodeSchool
  - JavaScript
---

# Flatlander's Gem Store

## Ramp up

**Why Angular?**

If you?re using JavaScript to create a dynamic website, Angular is a good choice.

* Angular helps you organize your JavaScript
* Angular helps create responsive (as in fast) websites.
* Angular plays well with jQuery.
* Angular is easy to test.

<!-- more -->

**Traditional Page-Refresh**

 ![traditional-page-refresh](/images/traditional-page-refresh.png)

**A "responsive "website using Angular**

 ![a-responsive-website-using-angular](/images/a-responsive-website-using-angular.png)

**What is Angular JS?**

A client-side JavaScript Framework for adding interactivity to HTML.

### Directives

A Directive is a marker on a HTML tag that tells Angular to run or reference some JavaScript code.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<body ng-controller="StoreController">
...
</body>
</html>
```

```javascript
// app.js
function StoreController(){
  alert('Welcome, Gregg!');
}
```

### Modules

* Where we write pieces of our Angular application.


* Makes our code more maintainable, testable, and readable.


* Where we define dependencies for our app.

```html
<!-- index.html -->
<!DOCTYPE html>
<html ng-app="store">
  <head>
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
  </head>
  <body>
    <script type="text/javascript" src="angular.min.js"></script>
    <script type="text/javascript" src="app.js"></script>
  </body>
</html>
```

```javascript
// app.js
// Application Name and Dependencies
var app = angular.module('store', [ ]);
```

### Expressions

Allow you to insert dynamic values into your HTML.

```html
<!-- Numerical Operations -->
<p>
  I am {{4 + 6}}
</p>

<!-- String Operations -->
<p>
  {{"hello" + " you"}}
</p>
```

## Index HTML Setup

### Controllers

Controllers are where we define our app?s behavior by defining functions and values.

```javascript
// app.js
// Wrapping your Javascript in a closure is a good habit!
(function(){
  var app = angular.module('store', [ ]);
  // Notice that controller is attached to (inside) our app.
  app.controller('StoreController', function(){
    this.product = gem;
  });
  
  var gem = {
    name: 'Dodecahedron',
    price: 2.95,
    description: '. . .',
  }.
})();
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html ng-app="store">
  <head>
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
  </head>
  <body>
    <div ng-controller="StoreController as store">
      <h1> {{ore.product.name}} </h1>
      <h2> ${{store.product.price}} </h2>
      <p> {{store.product.description}} </p>
    </div>
    <script type="text/javascript" src="angular.min.js"></script>
    <script type="text/javascript" src="app.js"></script>
  </body>
</html>
```

## Using Built-in Directives

### ng-show Directive

```html
<!-- index.html -->
<!DOCTYPE html>
<html ng-app="store">
  <head>
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
  </head>
  <body>
    <div ng-controller="StoreController as store">
      <h1> {{store.product.name}} </h1>
      <h2> ${{store.product.price}} </h2>
      <p> {{store.product.description}} </p>
      <!-- Will only show the element if the value of the Expression is
true -->
      <button ng-show="store.product.canPurchase"> Add to Cart </button>
    </div>
    <script type="text/javascript" src="angular.min.js"></script>
    <script type="text/javascript" src="app.js"></script>
  </body>
</html>
```

```javascript
// app.js
var gem = {
  name: 'Dodecahedron',
  price: 2.95,
  description: '. . .',
}.
```

### ng-hide Directive

```html
<!-- index.html -->
<body ng-controller="StoreController as store">
  <div ng-hide="store.product.soldOut">
    <h1> {{store.product.name}} </h1>
    <h2> ${{store.product.price}} </h2>
    <p> {{store.product.description}} </p>
    <button ng-show="store.product.canPurchase"> Add to Cart </button>
  </div>
  . . .
</body>
```

```javascript
// app.js
var gem = {
  name: 'Dodecahedron',
  price: 2.95,
  description: '. . .',
  canPurchase: true,
  // If the product is sold out, we want to hide it.
  soldOut: true,
}.
```

### ng-repeat Directive

```html
<!-- index.html -->
<body ng-controller="StoreController as store">
  <div ng-repeat="product in store.products">
    <h1> {{product.name}} </h1>
    <h2> ${{product.price}} </h2>
    <p> {{product.description}} </p>
    <button ng-show="product.canPurchase">Add to Cart</button>
  </div>
  . . .
</body>
```

```javascript
// app.js
app.controller('StoreController', function(){
  this.products = gems;
});

var gems = [
  {
    name: "Dodecahedron",
    price: 2.95,
    description: ". . .",
    canPurchase: true,
  },
  {
    name: "Pentagonal Gem",
    price: 5.95,
    description: ". . .",
    canPurchase: false,
  }
];
```

# Build-in Directives

## Filters
{% raw %}
{{ data | filter:options }}
{% endraw %}
```javascript
// date
{{'1388123412323' | date:'MM/dd/yyyy @ h:mma'}} // 12/27/2013 @ 12:50AM

// uppercase & lowercase
{{'octagon gem' | uppercase}} // OCTAGON GEM

// limitTo
{{'My Description' | limitTo:8}} // My Descr
<li ng-repeat="product in store.products | limitTo:3">
  
// orderBy
// Will list products by descending price.
// Without the  - products would list in ascending order.
<li ng-repeat="product in store.products | orderBy:'-price'">
```

### Using ng-src for Images

Using Angular Expressions inside a src attribute causes an error! Because the browser tries to load the image before the Expression evaluates.

```javascript
<body ng-controller="StoreController as store">
  <ul class="list-group">
    <li class="list-group-item" ng-repeat="product in store.products">
      <h3> 
        {{product.name}}
        <em class="pull-right"> {{product.price | currency}} </em>
        // NG-SOURCEto the rescue!
        <img ng-src="{{product.images[0].full}}"/>
      </h3>
    </li>
  </ul>
</body>
```



