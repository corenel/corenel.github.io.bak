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

## Filters and a new Directive

### Filters

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

## Tabs Inside Out

* `ng-click`
* `ng-init`
* `ng-class`

```html
<section ng-conrtoller="PanelController as panel">
  <ul class="nav nav-pills">
    <li ng-class="{active:panel.isSelected(1)}">
      <a herf ng-click="panel.selectTab(1)">Description</a>
    </li>
    <li ng-class="{active:panel.isSelected(3)}">
      <a herf ng-click="panel.selectTab(1)">Specifications</a>
    </li>
    <li ng-class="{active:panel.isSelected(3)}">
      <a herf ng-click="panel.selectTab(3)">Reviews</a>
    </li> 
  </ul>
  <div class="panel" ng-show="panel.isSelected(1)">
    <h4>Description </h4>
    <p>{{product.description}}</p>
  </div>
</section>
```

```javascript
app.controller("PanelController", function(){
  this.tab = 1;
  this.selectTab = function(setTab) {
    this.tab = setTab;
  };
  this.isSelected = function(checkTab){
    return this.tab === checkTab;
  };
});
```



# Forms, Models, and Validations

## Forms and Models

### Introducing ng-model

`ng-model` binds the form element value to the property.

So we can have live previrew.

```html
<form name="reviewForm">
  <blockquote>
    <b>Stars: {{review.stars}}</b>
    {{review.body}} 
    <cite>by: {{review.author}}</cite> 
  </blockquote>
  <select ng-model="review.stars">
    <option value="1">1 star</option>
    <option value="2">2 stars</option>
    . . .
  </select>
  <textarea ></textarea>
  <label>by:</label>
  <input ng-model="review.body" type="email" />
  <input ng-model="review.author" type="submit" value="Submit" />
</form>
```

**Two More Binding Examples**

```html
<!-- With a Checkbox -->
<!-- Sets value to true or false -->
<input ng-model="review.terms" type="checkbox" /> I agree to the terms

<!-- With Radio Buttons -->
<!-- Sets the proper value based on which is selected -->
What color would you like? 
<input ng-model="review.color" type="radio" value="red" /> Red 
<input ng-model="review.color" type="radio" value="blue" /> Blue 
<input ng-model="review.color" type="radio" value="green" /> Green
```

## Accepting Submissions

`ng-submit` directive.

```javascript
app.controller("ReviewController", function(){
  this.review = {};
  this.addReview = function(product) {
    product.reviews.push(this.review);
    this.review = {};
  };
});
```

```html
<form name="reviewForm" ng-controller="ReviewController as reviewCtrl"
ng-submit="reviewCtrl.addReview(product)">
  <blockquote>
    <b>Stars: {{reviewCtrl.review.stars}}</b>
    {{reviewCtrl.review.body}}
    <cite>by: {{reviewCtrl.review.author}}</cite>
  </blockquote>
```

## Form Validations 101

We don?t want the form to submit when it?s invalid.

**Turn Off Default HTML Validation**

* `novalidate`: Turn Off Default HTML Validation
* `required`: Mark Required Fields

```html
<form name="reviewForm" ng-controller="ReviewController as reviewCtrl"
ng-submit="reviewCtrl.addReview(product)" >
  <select ng-model="reviewCtrl.review.stars" required>
    <option value="1">1 star</option>
    ...
  </select>
  
  <textarea name="body" ng-model="reviewCtrl.review.body" required></textarea>
  <label>by:</label>
  <input name="author" ng-model="reviewCtrl.review.author" type="email" required/>
  <div> reviewForm is {{reviewForm.$valid}} </div>
  <input type="submit" value="Submit" />
</form>
```

**Preventing the Submit**

If valid is `false` , then `addReview` is never called.

```html
<form name="reviewForm" ng-controller="ReviewController as reviewCtrl"
ng-submit="reviewForm.$valid && reviewCtrl.addReview(product)" novalidate>
```

**Doesn?t Submit an Invalid Form**

How might we give a hint to the user why their form is invalid?

```html
<input name="author" ng-model="reviewCtrl.review.author" type="email" required />
```

```css
.ng-invalid.ng-dirty {
  border-color: #FA787E;
}

.ng-valid.ng-dirty {
  border-color: #78FA89;
}
```

* Source before typing email

  ```html
  <input name="author" . . . class="ng-pristine ng-invalid">
  ```

* Source after typing, with invalid email

  ```html
  <input name="author". . . class="ng-dirty ng-invalid">
  ```

* Source after typing, with valid email

  ```html
  <input name="author" . . . class="ng-dirty ng-valid">
  ```

**HTML5-based type validations**

Web forms usually have rules around valid input:

* Angular JS has built-in validations for common input types:

```html
<input type="email" name="email">
<input type="url" name="homepage">
<input type="number" min=1 max=10 name="quantity">
```



