/*
  JavaScript: Pass by Value and Pass by Reference

  In JavaScript, function parameters are passed either by value or by reference depending on the type of data.

  1. Pass by Value
  -----------------
  - When a primitive data type (Number, String, Boolean, etc.) is passed to a function, 
    JavaScript copies the actual value to the function parameter.
  - Changes to this parameter within the function do not affect the original variable.

  Examples of Pass by Value:
*/

function changeValue(val) {
  val = 100; // This change is local to the function scope
  console.log("Inside function, val:", val); // Output: 100
}

let num = 50;
console.log("Before function call, num:", num); // Output: 50
changeValue(num);
console.log("After function call, num:", num); // Output: 50

/*
    Explanation:
    - 'num' is a primitive data type (Number).
    - When 'num' is passed to 'changeValue', a copy of its value (50) is passed.
    - Inside the function, changing 'val' does not affect 'num' outside the function.
  */

/*
    2. Pass by Reference
    ---------------------
    - When an object (including arrays, functions, etc.) is passed to a function, 
      JavaScript passes a reference to the original object, not a copy.
    - Changes to the object within the function affect the original object outside the function.
  
    Examples of Pass by Reference:
  */

function changeObject(obj) {
  obj.name = "Alice"; // This modifies the original object
  console.log("Inside function, obj:", obj); // Output: { name: "Alice" }
}

let person = { name: "Bob" };
console.log("Before function call, person:", person); // Output: { name: "Bob" }
changeObject(person);
console.log("After function call, person:", person); // Output: { name: "Alice" }

/*
    Explanation:
    - 'person' is an object.
    - When 'person' is passed to 'changeObject', a reference to the original object is passed.
    - Inside the function, modifying 'obj' affects the original 'person' object.
  */

/*
    3. Pass by Reference with Arrays
    ---------------------------------
    - Arrays are objects in JavaScript, so they are passed by reference to functions.
    - Changes to the array within the function will affect the original array.
  
    Examples of Pass by Reference with Arrays:
  */

function changeArray(arr) {
  arr.push(4); // This modifies the original array
  //or changing an index
  console.log("Inside function, arr:", arr); // Output: [1, 2, 3, 4]
}

let myArray = [1, 2, 3];
console.log("Before function call, myArray:", myArray); // Output: [1, 2, 3]
changeArray(myArray);
console.log("After function call, myArray:", myArray); // Output: [1, 2, 3, 4]

/*
    Explanation:
    - 'myArray' is an array, which is an object in JavaScript.
    - When 'myArray' is passed to 'changeArray', a reference to the original array is passed.
    - Inside the function, modifying 'arr' (e.g., using 'push') affects the original 'myArray' outside the function.
  */

/*
    Important Note:
    ----------------
    - Even though objects are passed by reference, reassigning an object parameter inside a function does not affect the original object.
    - This is because the reference itself is passed by value, meaning the reference is copied, but not the object it points to.
  
    Example:
  */

function reassignObject(obj) {
  obj = { name: "Charlie" }; // This reassigns 'obj' to a new object locally
  console.log("Inside function, obj:", obj); // Output: { name: "Charlie" }
}

let anotherPerson = { name: "David" };
console.log("Before function call, anotherPerson:", anotherPerson); // Output: { name: "David" }
reassignObject(anotherPerson);
console.log("After function call, anotherPerson:", anotherPerson); // Output: { name: "David" }

/*
    Explanation:
    - 'anotherPerson' is an object.
    - When passed to 'reassignObject', the function receives a reference to the original object.
    - Reassigning 'obj' inside the function does not change 'anotherPerson' outside because only the local copy of the reference is reassigned.
  */

/*
    Summary:
    --------
    - Primitive types are passed by value: Changes within functions do not affect the original.
    - Objects (including arrays) are passed by reference: Changes to object properties within functions affect the original object.
    - However, reassigning an object parameter inside a function does not affect the original reference outside the function.=> I'm referring to the scenario where you reassign the entire object to a new object inside the function.
  */
