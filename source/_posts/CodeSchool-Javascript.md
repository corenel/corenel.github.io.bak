---
title: Notes for Code School - JavaScript Road Trip
date: 2016-04-09 12:37:07
categories:
- Notes
tags:
  - CodeSchool
  - JavaScript
---

# Closures

**Closures help in function "construction zones"**

A closure can make the creation of very similar functions ultra-efficient.

```javascript
function buildCoveTicketMaker( transport ) {
  return function ( name ) {
    alert("Here is your transportation ticket via the " + transport + ".\n" + 
          "Welcome to the Cold Closures Cove, " + name + "!");
  }
}

var getSubmarineTicket = buildCoveTicketMaker("Submarine");
var getBattleshipTicket = buildCoveTicketMaker("Battleship");
var getGiantSeagullTicket = buildCoveTicketMaker("Giant Seagull");
```

<!-- more -->

**Closure functions can even modify bound variables in the background**

```javascript
function buildCoveTicketMaker( transport ) {
  return function ( name ) {
    alert("Here is your transportation ticket via the " + transport + ".\n" + 
          "Welcome to the Cold Closures Cove, " + name + "!" + 
          "You are passenger #" + passengerNumber + "." );
  }
}

var getSubmarineTicket = buildCoveTicketMaker("Submarine");
// passengerNumber is incremented to 1.
getSubmarineTicket("Mario"); 
// Another call to getSubmarineTicket has passengerNumber incremented to 2! 
// Wow, even though the function's local scope disappeared after Mario's ticket, 
// it KEPT the progress of passengerNumber!
getSubmarineTicket("Toad"); 
```



**LOOPS WITH CLOSURES: a cautionary tale**

We have to pay close attention to return times and final variable states.

* Way before torpedoAssignment isreturned, the i loop counter hasprogressed in value to 8 andstopped the loop.
* The function's actual return is the true "moment of closure", when the environment andall necessary variables are packaged up. 

```javascript
function assignTorpedo ( name, passengerArray ){
  var torpedoAssignment;
  for (var i = 0; i<passengerArray.length; i++) {
    if (passengerArray[i] == name) {
      torpedoAssignment = function () {
        alert("Ahoy, " + name + "!\n" + "Man your post at Torpedo #" + (i+1) + "!");
      };
    }
  }
  return torpedoAssignment;
}

var subPassengers = ["Luke", "Leia", "Han", "Chewie", "Yoda", "R2-D2", "C-3PO", "Boba"];
var giveAssignment = assignTorpedo("Chewie", subPassengers);
giveAssignment(); 
// Outputs:
// Ahoy, Chewie!
// Man your post at Torpedo #9!
```

Several options exist for timing closures correctly

```javascript
function assignTorpedo ( name, passengerArray ){
  for (var i = 0; i<passengerArray.length; i++) {
    if (passengerArray[i] == name) {
      // Now the function will be immediately returned when the right name is found, locking i in place.
      return function () {
        alert("Ahoy, " + name + "!\n" + 
              "Man your post at Torpedo #" + (i+1) + "!");
      };
    }
  }
}
```

```javascript
function makeTorpedoAssigner ( passengerArray ) {
  return function ( name ) {
    for (var i = 0; i<passengerArray.length; i++) {
      if (passengerArray[i] == name) {
        alert("Ahoy, " + name + "!\n" +
              "Man your post at Torpedo #" + (i+1) + "!");
      }
    }
  };
}
```



# Hoisting

* Ensuring that every line of code can execute when it's needed

  ![program_load_order](/images/program_load_order.png)


* First, memory is set aside for all necessary variables and declared functions. Then the operations in order.

   ![stuff_declare](/images/stuff_declare.png)


* Some examples of the impact of hoisting![the_impact_of_hoisting](/images/the_impact_of_hoisting.png)


* Function Expressions are never hoisted! They are treated as assignments.

  ![function_expressions_are_never_hoisted](/images/function_expressions_are_never_hoisted.png)

  ![function_expressions_are_never_hoisted_2](/images/function_expressions_are_never_hoisted_2.png)

**Example** ![how_might_this_affect_our_EARLIER_train_system](/images/how_might_this_affect_our_EARLIER_train_system.png)

![how_might_this_affect_our_EARLIER_train_system_result](/images/how_might_this_affect_our_EARLIER_train_system_result.png)

**Solution**

* Exchange the order![how_might_this_affect_our_EARLIER_train_system_solution_1](/images/how_might_this_affect_our_EARLIER_train_system_solution_1.png)


* Don't use function expression ![how_might_this_affect_our_EARLIER_train_system_solution_2](/images/how_might_this_affect_our_EARLIER_train_system_solution_2.png)



# Prototype

* The Object's parent is called its "prototype"
  * When a generic Object is created, its prototype passes it many important properties 
* Passing down properties is called "inheritance"
  * Inheritance helps avoid over-coding multiple properties and methods into similar objects.
  * Object Prototype
    * valueOf()
    * constructor()
    * toLocaleString()
    * toString()
    * isPrototypeOf()
    * propertyIsEnumerable()
    * hasOwnProperty()
  * Array Prototype
    * length
    * pop()
    * push()
    * shift()
    * reverse()
    * sort()
    * join()
    * reduce()
    * slice()
  * String Prototype
    * length
    * charAt()
    * trim()
    * concat()
    * indexOf()
    * replace()
    * toLowerCase()
    * toUpperCase()
    * substring()
  * Number Prototype
    * toFixed()
    * toExponential()
    * toPrecision()
  * Function Prototype
    * name
    * call()
    * bind()
    * apply()
* Though properties are inherited, they are still "owned" by prototypes, not the inheriting Object

## Inheritance and Constructors

**Adding inheritable Properties to prototypes**

```javascript
String.prototype.countAll = function (){
  var letterCount = 0;
  for (var i = 0; i<this.length; i++) {
    if ( this.charAt(i).toUpperCase() == letter.toUpperCase() ) {
      letterCount++;
    }
  }
  return letterCount;
};
```

**Build objects using Object.create()**

Using inheritance, we can create new Objects with our existing Objects as prototypes

```javascript
var shoe = { size: 6, gender: "women", construction: "slipper"};
var magicShoe = Object.create(shoe);
```

**Examining the inheritance**

```javascript
Object.prototype .isPrototypeOf(shoe); // true
shoe.isPrototypeOf(magicShoe); //true
Object.prototype .isPrototypeOf(magicShoe); //true
```

**Build a prototype with empty properties**

* Determine common properties of a class

  * A class is a set of Objects that all share and inherit from the same basic prototype.

* Building a constructor function for an Object

  * A constructor allows us to set up inheritance while also assigning specific property values.

    ```javascript
    function Shoe (shoeSize, shoeColor, forGender, constructStyle) {
      this.size = shoeSize;
      this.color = shoeColor;
      this.gender = forGender;
      this.construction = constructStyle;
      this.putOn = function () { alert("Shoe's on!"); };
      this.takeOff = function () { alert("Uh, what's that smell?"); };
    }
    ```

* Use constructor

  * JavaScript's ?new' keyword produces a new Object of the class, or "instantiates" the class

    ```javascript
    var beachShoe = new Shoe( 10, "blue", "women", "flipflop" );
    ```

**Assigning a prototype to a constructor**

By setting a constructor's prototype property, every new instance will refer to it for extra properties!

```javascript
function Shoe (shoeSize, shoeColor, forGender, constructStyle) {
  this.size = shoeSize;
  this.color = shoeColor;
  this.gender = forGender;
  this.construction = constructStyle;
}

Shoe.prototype = {
  putOn: function () { alert("Shoe's on!"); };
  takeOff: function () { alert("Uh, what's that smell?"); };

beachShoe.hasOwnProperty("construction"); // true
```

**Prototypes can also refer back to the instance**

```javascript
function Shoe (shoeSize, shoeColor, forGender, constructStyle) {
  this.size = shoeSize;
  this.color = shoeColor;
  this.gender = forGender;
  this.construction = constructStyle;
}

Shoe.prototype = {
  putOn: function () { alert ("Your " + this.construction + "'s" + "on!"); },
  takeOff: function () { alert ("Phew! Somebody's size " + this.size + "'s" + " are fragrant! "); }
};
```

## Overriding Prototypal Methods

### valueOf()

```javascript
var x = 4;
var y = "4";

x.valueOf(); // 4
y.valueOf(); // "4"

x.valueOf() == y.valueOf(); // true
x.valueOf() === y.valueOf(); // false
```

* The "value "in `valueOf()` isn't looking for numbers necessarily, but instead returns whatever primitive type is associated with the object
* Be careful! The `==` tries to help us out by using "typecoercion", which turns a number contained within a stringinto an actual number. Here, the `"4"` we got back from `y.valueOf()` became `4` when the `==` examined it.
* The `===` operator does **NOT** ignore the type of thevalue, and gives us a more detailed interpretation ofequality. JavaScript experts often prefer this comparator exclusively over `==` for this reason.

**valueOf( ) on custom objects**

The `valueOf()` function for custom Objects just defaults to a list of their properties, just like logging them out.

```javascript
var Tornado = function (category, affectedAreas, windGust) {
 this.category = category;
 this.affectedAreas = affectedAreas;
 this.windGust = windGust;
};

var cities = [ ["Kansas City", 464310], ["Topeka", 127939], ["Lenexa", 49398] ]; 
var twister = new Tornado( "F5", cities, 220 );

twister.valueOf();
// Tornado {category: "F5", affectedAreas: Array[3], windGust: 220}
```

**Overriding prototypal properties**

* Many situations require special functionality that's different from the first available property

  ```javascript
  Tornado.prototype.valueOf = function( ) {
    var sum = 0;
    for (var i = 0; i < this.affectedAreas.length; i++) {
      sum += this.affectedAreas[i][1];
    }
    return sum;
  };

  twister.valueOf(); // 641647
  ```

* Each Tornado's 'affectedAreas' property can be updated outside the object with no loss of accuracy.

### toString( )

```javascript
var x = 4;
var y = "4";
var a = [ 3, "blind", "mice" ];
var double = function ( param ){
  return param *2;
};

x.toString(); // "4"
y.toString(); // "4"
a.toString(); // "3,blind,mice"
double.toString(); 
// "function ( param ){
//   return param *2;
// }"
```

* A call to `toString` on an Array will just string-ify and concatenate all the contents, separating each entry by a comma withoutany whitespace. Overriding `toString` in the Array prototype is often desirable.

### Finding constructor and prototype

Some inherited properties provide ways to find an Object's nearest prototype ancestor

```javascript
var cities = [ ["Kansas City", 464310], ["Topeka", 127939], ["Lenexa", 49398] ]; 
var twister = new Tornado( "F5", cities, 220 );
cities.push( ["Olathe", 130045] );

twister.constructor;
// function (category, affectedAreas, windGust) {
//   this.category = category;
//   this.affectedAreas = affectedAreas;
//   this.windGust = windGust;
//}

twister.constructor.prototype;
// Object {valueOf: function, toString: function}

twister.__proto__;
// Object {valueOf: function, toString: function}
```

### HasOwnProperty()

Searching prototype chains for potential overridden properties becomes easy with this function

```javascript
Object.prototype.findOwnerOfProperty = function ( propName ) {
  var currentObject = this;
  while (currentObject !== null){
    if (currentObject.hasOwnProperty(propName)) {
    	return currentObject;
    }
    else {
      currentObject = currentObject.__proto__;
    }
  }
  return "No property found!";
};

```

