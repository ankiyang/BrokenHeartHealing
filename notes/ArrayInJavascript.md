# Array In Javascript


* Author:  Anki Yang
* Date:  10 Jan, 2020
- - - -


**Array** is built-in object in Javascript.But in fact, it is a _function_. In console, we input _Array_,and will get 
```
> Array
< ƒ Array() { [native code] }
```

So since it is actually a function, it has a “prototype” (原型属性 in Chinese).
 (By the way, every function we build in Javascript has a prototype. It is actually a pointer towards an object and this object is used to conclude all attributes and methods for all instances.) 

We print all values of prototype of Array. We  find there are more than 30 functions.
```
> Array.prototype
< [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ, …]
```

Basically, there are two different ways to create **Array**. One is through _[]_ and another is through new Array. 
```
let names = new Array('anki', 'rain’);
let countries = ['China', 'New Zealand'];
```
Elements in an array could be any type (like Python or other object-oriented languages) :
```
let aaa = new Array('anki','yang', 77, {'aut': 'mcis'});
```

Now we could learn how to utilise API in prototype to manipulate our arrays.
* concat: to combine values in multi arrays (like _extend_ in Python)
```
>let countries = ['China', 'New Zealand'];
>countries.concat(['USA', 'UK'], ['Japan']);
>(5) ["China", "New Zealand", "USA", "UK", "Japan"]
```
* copyWithin(target, start[, end = **this**.length])
copies elements to another position in the array, overwriting the existing values. (**overwrites** the original array.)
```
> var fruits = ["Banana", "Orange", "Apple", "Mango"];
> fruits.copyWithin(2, 0);
< (4) ["Banana", "Orange", "Banana", "Orange"]
```
an example from [stackoverflow](https://stackoverflow.com/questions/44254865/javascript-array-copywithin-method)
```
[1, 2, 3, 4, 5].copyWithin(-3, 0, -1); // [1, 2, 1, 2, 3] 
```
```
[1, 2, 3, 4, 5]         values
 0  1  2  3  4          indices from start
-5 -4 -3 -2 -1          indices from end
 ^     ^     ^          needed indices
 |     |     +————————  end
 |     +——————————————  target      
 +--------------------  start
 [1, 2, 3, 4, 5]        given array
 [      1, 2, 3, 4, 5]  copied values
 [1, 2, 1, 2, 3]        result array, keeping the same length

```
* fill (value, start, end):  fills the specified elements in an array with a static value.
```
> let nums = Array(5);
> nums.fill(1, 0);
< (5) [1, 1, 1, 1, 1]
```
* find: Get the value of the first element in the array.
* findIndex(function(currentValue, index, arr), thisValue): search the first element in the array that satisfies our provided function and return the index of the first elements in the array. Otherwise, it returns -1.
```
> let nums = [1, 2, 7, 7, 7, 9];
> nums.find(e => e > 2);
< 7
> nums.findIndex(e => e > 2);
< 2
```
* forEach(callBack(currentValue [,   index   [, array]]),  [, thisArg])
iterate through each item in an array, executes the provided function once for each array item.
* includes: check if an array include an element or not. Return true or false.
* indexOf:  returns the first index at which the given item can be found in an array, or -1 if it is not in that array.
* join:
* lastIndexOf:
* map:  creates an new array with the results of a provided function on every item in the calling array.
```
let numbers = [1, 2, 3];
let squares = numbers.map(item => item * item);  // [1, 4, 9]
```
* pop
* push
* reverse
* shift
* slice
* some
* splice
* unshift
