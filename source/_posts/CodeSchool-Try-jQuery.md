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

**Using slideDown to Show Elements**

* `.slideDown()`
* `.slideUp()`
* `.slideToggle()`
  * Display or hide the matched elements with a sliding motion.

## Expanding on on()

What if we also want to show the ticket when they hover over the `<h3>` tag?

```javascript
function showTicket() {
  $('this').closest('.confirmation').find('.ticket').slideDown();
}
$(document).ready(function() {
  // Don't add () at the end - that would execute the function immediately
  $('.confirmation').on('click', 'button', showTicket);
  $('.confirmation').on('mouseenter', 'h3', showTicket);
});
```

**Mouse Event**

* `click`
* `dblclick`
* `focusin`
* `focusout`
* `mousedown`
* `mouseup`
* `mousemove`
* `mouseout`
* `mouseover`
* `mouseleave`
* `mouseenter`

## Keyboard Events

Changing this "Tickets "input field should recalculate the total price.

```html
<div class="vacation" data-price='399.99'>
  <h3>Hawaiian Vacation</h3>
  <p>$399.99 per ticket</p>
  <p>
    Tickets:
    <!-- When this updates... -->
    <input type='number' class='quantity' value='1' />
  </p>
</div>
<!-- ...we'll update the calculated price here -->
<p>Total Price: $<span id='total'>399.99</span></p>
```

**Keyboard and Form Events**

Keyboard Events

* `keypress`
* `keydown`
* `keyup`

Form Events

* `blur`
* `select`
* `change`
* `focus`
* `submit`

```javascript
$(document).ready(function() {
  $('.vacation').on('keyup', '.quantity', function() {
    // Use + to convert the string to a number
    var price = +$(this).closest('.vacation').data('price');
    var quantity = +$(this).val();
    // You can pass a number or a string to the .text() method
    $('#total').text(price * quantity);
  });
});
```

## Link Layover

Clicking Show Comments will cause them to fade in

```html
<!-- index.html -->
<a href='#' class='expand'>Show Comments</a>
```

```css
/* application.css */
.comments {
  display: none;
}
```

```javascript
// application.js
$(document).ready(function() {
  $('.vacation').on('click', '.expand',function(event) {
    // The click event will "bubble up? but the browser won't handle it
    event.preventDefault();
    $(this).closest('.vacation')
    .find('.comments')
    .fadeToggle();
  }
 );
});
```

**event.stopPropagation()**

The browser will still handle the click event but will prevent it from "bubbling up? to each parent node.

**event.preventDefault()**

The click event will "bubble up? but the browser won't handle it

# Styling

## Taming CSS

**Changing the Style**

```javascript
// application.js
$(document).ready(function() {
  $('#vacations').on('click', '.vacation', function() {
    // NOT RECOMMENDED
    // $(this).css('background-color', '#252b30');
    // $(this).css('border-color', '1px solid #967');
    // $(this).css('background-color', '#252b30')
    //        .css('border-color', '1px solid #967');
    
    // Passing in a JavaScript Object as an argument is a common jQuery pattern
    $(this).css({'background-color': '#252b30',
                 'border-color': '1px solid #967'});
    // Same as CSS syntax, but easier to read and understand
    // $(this).find('.price').css('display', 'block');
    $(this).find('.price').show();
  });
});
```

jQuery Object Methods

* `.css(<attr>, <value>)`
* `.css(<attr>)`
* `.css(<object>)`
* `.show()`
* `.hide()`

**Moving Styles to External CSS**

```css
/* application.css */
.highlighted {
  background-color:#563;
  border-color: 1px solid #967;
}
.highlighted .price {
  display: block;
}
```

```javascript
// application.js
$(document).ready(function() {
  $('#vacations').on('click', '.vacation', function() {
    $(this).toggleClass('highlighted');
  });
});
```

jQuery Object Methods

* `.toggleClass()`
* `.addClass(<class>)`
* `.removeClass(<class>)`

## Animation

What can we do to add a bit more movement to this?

```javascript
$(document).ready(function() {
  $('#vacations').on('click', '.vacation', function() {
    $(this).toggleClass('highlighted');
    // Our vacation package will move up and down
    if ($(this).hasClass('highlighted')) {
      $(this).animate({'top': '-10px'});
    } else {
      $(this).animate({'top': '0px'});
    }
  });
});
```

 **Changing the Speed**

```javascript
// Default speed is 400
$(this).animate({'top': '-10px'}, 400);
// 'fast' equals to 200
$(this).animate({'top': '-10px'}, 'fast');
// 'slow' equals to 600
$(this).animate({'top': '-10px'}, 'slow');
```

