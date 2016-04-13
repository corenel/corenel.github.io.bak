---
title: Notes for Code School - JavaScript Best Practices
date: 2016-04-12 18:19:54
categories:
- Notes
tags:
  - CodeSchool
  - JavaScript
---

# The Sword of Syntax

## Ternary Conditionals

The ternary conditional provides a shortcut over lengthier conditional blocks.

```javascript
someCondition ? pickThisIfTrue : pickThisIfFalse;
```

**Example**

```javascript
var isArthur = false;
var weapon = isArthur ? "Excalibur" : "Longsword";?
console.log("Current weapon: " + weapon); // Longsword
```

<!-- more -->

**Caution**

```javascript
var isArthur = false;
// The output is not as expected
console.log("Current weapon: " + isArthur ? "Excalibur" : "Longsword"); // Excalibur
```

The `+` only knows to evaluate a variable and add it to a string, all before the `?` gets to check a condition.

![using-retnaries-as-expressions](/images/using-retnaries-as-expressions.png)

The `?` now looks for a boolean, but finds a string. Turns out, any JS value that is not `false`, `0`, `undefined`, `NaN`, `""`, or `null` will always evaluate as "truthy".

**Ensure ternaries are isolated**
Use parentheses to ensure the conditional is checked correctly.

```javascript
var isArthur = false;
// The output is as expected
console.log("Current weapon: " + (isArthur ? "Excalibur" : "Longsword")); // Longsword
```

**More Usage**

* We can use compound Boolean expressions to make ternary decisions, too.

  ```javascript
  var isArthur = true;
  var isKing = true;

  console.log("Current weapon: " + (isArthur "Excalibur" : "Longsword"));
  ```

* Any executable statement can serve as a ternary?s response choices.

  ```javascript
  isArthur && isKing ? alert("Hail Arthur, King of the Britons!") : 
                       alert("Charge on, ye Knight, for the glory of the King!") ;
  ```

* Ternaries provide a different format for picking immediately-invoked functions.

  ```javascript
  var isArthur = true;
  var isKing = false;

  isArthur && isKing ? function (){
                         alert("Hail Arthur, King of the Britons!");
                         console.log("Current weapon: Excalibur");
                       // Remember that adding the parentheses calls the function expression.
                       }()
                       :
                       function (){
                         alert("Charge on, ye Knight, for the glory of the King!");
                         console.log("Current weapon: Longsword");
                       }();
  ```

* Each result option provides the opportunity to execute multiple actions.

  ```javascript
  var isArthur = true;
  var isKing = false;
  var weapon;
  var helmet;

  // Multiple statements within a single ternary response 
  // are grouped in parentheses and separated by a comma.
  isArthur && isKing ? ( weapon = "Excalibur", helmet = "Goosewhite" )
                       :
                       ( weapon = "Longsword", helmet = "Iron Helm" );
  ```

* A ternary can hold other ternaries within each of the possible responses.

  ```javascript
  var isArthur = true;
  var isKing = false;
  var weapon;
  var helmet;

  isArthur && isKing ? ( weapon = "Excalibur", helmet = "Goosewhite" )
                       :
                       isArcher ? (weapon = "Longbow", helmet = "Mail Helm")
                                : ( weapon = "Longsword", helmet = "Iron Helm" );
  ```