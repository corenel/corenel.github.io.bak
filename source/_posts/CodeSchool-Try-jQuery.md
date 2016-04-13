---
title: Notes for Code School - Try jQuery
date: 2016-04-13 17:24:09
categories:
- Notes
tags:
  - CodeSchool
  - JavaScript
---

# Introduction to jQuery

## What's jQuery

**jQuery makes it easy to**

* find elements in an HTML document
* change HTML content
* listen to what a user does and react accordingly
* animate content on the page
* talk over the network to fetch new content

<!-- more -->

**Document Object Model**

A tree-like structure created by browsers so we can quickly find HTML Elements using JavaScript.

> "DOM"

![dom-structure](/images/dom-structure.png)

**How jQuery Accesses The DOM**

```javascript
jQuery(document);
```

**Using the jQuery function to find nodes**

```javascript
// jQuery selectors
// Use short & sweet syntax
$("h1"); // EQUALS TO jQuery("h1");
$("p"); // EQUALS TO jQuery("p");
```

**Modifying an element's text**

```javascript
$("h1").text("Where to?");
```

**Listening for document ready**

JavaScript may execute before the DOM loads, so we need to make sure the DOM has finished loading the HTML content before we can reliably use jQuery.

```javascript
jQuery(document).ready(function(){
  // code
});
```

## Using jQuery

**Getting started**

1. download jQuery

2. load it in your HTML document

   ```html
   <script src="jquery.min.js"></script>
   ```

3. start using it

   ```html
   <script src="application.js"></script>
   ```

**We can find elements by ID or Class**

```html
<h1>Where do you want to go?</h1>
<h2>Travel Destinations</h2>
<p>Plan your next adventure.</p>
<ul id="destinations">
  <li>Rome</li>
  <li>Paris</li>
  <li class='promo'>Rio</li>
</ul>
```

```javascript
$("#destinations");
$(".promo");
```



# Traversing the DOM

## Searching the DOM

**Selecting descendants**

```html
<h1>Where do you want to go?</h1>
<h2>Travel Destinations</h2>
<p>Plan your next adventure.</p>
<ul id="destinations">
  <li>Paris</li>
  <li>Rome</li>
  <li class='promo'>Rio</li>
</ul>
```

```javascript
// we select the <li> elements that are
// inside of the <ul> with a "destinations" ID
$("#destinations li");
```

 **Selecting direct children**

```html
<h1>Where do you want to go?</h1>
<h2>Travel Destinations</h2>
<p>Plan your next adventure.</p>
<ul id="destinations">
  <li>Rome</li>
  <li>
    <ul id="france">
      <li>Paris</li>
    </ul>
  </li>
  <li class='promo'>Rio</li>
</ul>
```

```javascript
// we select only the <li> elements that are
// children of the "destinations" <ul>
$("#destinations > li");
```

**Selecting multiple elements**

```javascript
$(".promo, #france");
```

**CSS-like pseudo classes**

```javascript
$("#destinations li:first");
$("#destinations li:last");

// watch out, the index starts at 0
$("#destinations li:odd");
$("#destinations li:even");
```

## Traversing the DOM

**Filtering by traversing**

```javascript
// EQUALS TO $("#destinations li");
$("#destinations").find("li");

// EQUALS TO $("li:first");
$("li").first();

// EQUALS TO $("li:last");
$("li").last();
```

**Walking the DOM**

```javascript
$("li").first();
$("li").first().next();
$("li").first().next().prev();
```

**Walking up the DOM**

```javascript
$("li").first().parent();
```

**Walking down the DOM**

```javascript
$("#destinations").children("li");
```



# Working with the DOM

## Manipulating the DOM

### Appending to the DOM

```javascript
$(document).ready(function() {
  var price = $('<p>From $399.99</p>');
  $('.vacation').append(price);
  // OR
  // price.appendTo($('.vacation'));
});
```

Ways to add this price node to the DOM

* `.append(<element>)`
* `.prepend(<element>)`
* `.after(<element>) `
* `.before(<element>)`
* `.appendTo(<element>)`
* `.prependTo(<element>)`
* `.insertAfter(<element>) `
* `.insertBefore(<element>)`

### Removing from the DOM

```javascript
$(document).ready(function() {
  var price = $('<p>From $399.99</p>');
  $('.vacation').append(price);
  // Removes the <button> from the DOM
  $('button').remove();
});
```

## Acting on Interaction

**Watching for Click**

```javascript
$(document).ready(function() {
  $('button').on('click', function() {
    var price = $('<p>From $399.99</p>');
    $('.vacation').append(price);
    $('button').remove();
  });
});
```

## Refactor Using Traversing

* **Traversing from $(this)**
* **Using .closest(<selector>)**

```javascript
$(document).ready(function() {
  $('button').on('click', function() {
    var price = $('<p>From $399.99</p>');
    $(this).closest('.vacation').append(price);
    $(this).remove();
  });
});
```

## Traversing and Filtering

**jQuery Object Methods**

```html
<li class="vacation onsale" data-price='399.99'>
  <h3>Hawaiian Vacation</h3>
  <button>Get Price</button>
  <ul class='comments'>
    <li>Amazing deal!</li>
    <li>Want to go!</li>
  </ul>
</li>
```

* `.data(<name>)`
* `.data(<name>, <value>)`

```javascript
$(document).ready(function() {
  // Only target a 'button' if it's inside a '.vacation'
  $('.vacation').on('click', 'button', function() {
    // Reusing jQuery Objects
    var vacation = $(this).closest('.vacation');
    var amount = vacation.data('price');
    var price = $('<p>From $'+amount+'</p>');
    vacation.append(price);
    $(this).remove();
  });
});
```

**Filtering for Vacations On sale**

```html
<div id='filters'>
  ...
  <button class='onsale-filter'>On Sale Now</button>
  <button class='expiring-filter'>Expiring</button>
  ...
</div>
```

```javascript
$('#filters').on('click', '.onsale-filter', function() {
  $('.highlighted').removeClass('highlighted');
  $('.vacation').filter('.onsale').addClass('highlighted');
});
```



# Listening to DOM Events

## On DOM Load

```html
<li class="confirmation">
  ...
  // Clicking this button
  <button>FLIGHT DETAILS</button>
  // will show the ticket
  <ul class="ticket">...</ul>
</li>
```

```css
.ticket {
  display: none;
}
```

```javascript
$(document).ready(function() {
  $('.confirmation').on('click', 'button', function() {
   // Using slideDown to Show Elements
    $(this).closest('.confirmation').find('.ticket').slideDown();
  });
});
```

