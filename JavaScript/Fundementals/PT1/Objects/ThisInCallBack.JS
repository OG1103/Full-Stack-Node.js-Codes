//------------------------
// Using a Callback Function Inside a Method inside and the `this` Keyword.( Inside object methods)
//------------------------

/*
When using `this` inside a callback function that is itself inside an object method, the behavior of `this` can sometimes be tricky.
The value of `this` inside the callback function depends on how the callback is defined (regular function vs arrow function).
When you're working with callback functions inside an object's method, and you want this keyword in the call back function to reference the object itself, using an arrow function is often the easiest and most reliable solution.*/

// Example 1: Issue with `this` in a regular callback function inside a method

const team = {
  name: "Developers",
  members: ["Alice", "Bob", "Charlie"],
  teamDetails: function () {
    this.members.forEach(function (member) {
      // Here, `this` does NOT refer to the `team` object as you might expect
      console.log(`${member} is part of team ${this.name}`); // `this.name` will be undefined
    });
  },
};

team.teamDetails();
/*
  Output:
  Alice is part of team undefined
  Bob is part of team undefined
  Charlie is part of team undefined
  
  Explanation:
  - Inside the `forEach()` callback, the `this` keyword does not refer to the `team` object as you might expect.
  - This happens because in regular functions (like the one passed to `forEach()`), `this` depends on how the function is called, and it is not lexically bound.
  - In this case, `this` refers to the global object (or `undefined` in strict mode), not the `team` object.
  */

//------------------------
// Fixing the Issue with Arrow Functions
//------------------------

/*
  Arrow Functions and `this` in JavaScript:
  -----------------------------------------
  - Arrow functions **do not have their own `this`**. Instead, they capture and inherit `this` from their surrounding (lexical) scope.
  - This means that when you use an arrow function as a callback inside a method, the `this` keyword will refer to the object that contains the method.
  - Regular functions, on the other hand, have their own `this`, which is determined dynamically based on how the function is called.
  
  Why is this important?
  ----------------------
  In many cases, such as with callbacks inside methods (like `forEach()`), you want the `this` keyword to refer to the surrounding object. Arrow functions make this easy because they automatically inherit `this` from the method where they are defined, preventing issues that can arise when using regular functions, where `this` may point to something unexpected.
*/

const teamWithArrowFunction = {
  name: "Developers", // `name` is a property of the `teamWithArrowFunction` object
  members: ["Alice", "Bob", "Charlie"], // `members` is an array of team members
  teamDetails() {
    // Method to print team member details
    // Using an arrow function for the callback inside `forEach`
    this.members.forEach((member) => {
      /*
        Explanation of `this` in Arrow Functions:
        -----------------------------------------
        - The arrow function `(member) => { ... }` does not have its own `this`. 
        - Instead, it inherits `this` from the surrounding context aka the function in which its defined in, which is the `teamDetails` method.
        - Since `this.teamDetails()` is a method on the `teamWithArrowFunction` object, 
          `this` refers to the `teamWithArrowFunction` object itself inside the `teamDetails()` method.
        - Therefore, when the arrow function is executed inside `forEach()`, 
          `this.name` correctly refers to the `name` property of the `teamWithArrowFunction` object, 
          which is `"Developers"`.
        */
      console.log(`${member} is part of team ${this.name}`);
      // `${this.name}` refers to "Developers" because `this` is inherited from the method
    });
  },
};

// Calling the method `teamDetails()` to execute the arrow function inside the method
teamWithArrowFunction.teamDetails();

/*
    Output:
    Alice is part of team Developers
    Bob is part of team Developers
    Charlie is part of team Developers
  
    Why does it work this way?
    --------------------------
    - By using an arrow function inside `forEach()`, the `this` keyword refers to the `teamWithArrowFunction` object.
    - This happens because arrow functions **lexically inherit `this` from their surrounding scope**, 
      which in this case is the `teamDetails()` method.
    - `teamDetails()` is a method of the `teamWithArrowFunction` object, so `this` inside the arrow function
      refers to the same object. This ensures that `this.name` correctly points to `"Developers"`.
    
    How would this behave with a regular function?
    ----------------------------------------------
    If we used a regular function instead of an arrow function inside `forEach()`, 
    the value of `this` inside the regular function would be `undefined` (or the global object in non-strict mode), 
    because `this` in regular functions is determined dynamically at runtime based on how the function is called.
    
    Example of incorrect behavior with a regular function:
    ------------------------------------------------------
    If you replaced the arrow function with a regular function, it would look like this:
    
    this.members.forEach(function(member) {
      console.log(`${member} is part of team ${this.name}`);
    });
    
    In this case, `this` inside the regular function would not refer to the `teamWithArrowFunction` object.
    Instead, it would refer to the global object (or `undefined` in strict mode), 
    which means `this.name` would not point to the `name` property of the object.
  
    Fixing the issue:
    -----------------
    You could fix this issue in two ways if using a regular function:
    1. **Use `bind(this)`** to explicitly bind `this` to the `teamWithArrowFunction` object:
       this.members.forEach(function(member) {
         console.log(`${member} is part of team ${this.name}`);
       }.bind(this));
    
    2. **Assign `this` to a variable** (commonly called `self` or `that`) before entering the callback:
       const self = this;
       this.members.forEach(function(member) {
         console.log(`${member} is part of team ${self.name}`);
       });
  
    Why are arrow functions better in this scenario?
    ------------------------------------------------
    Arrow functions automatically handle the `this` binding, 
    making the code cleaner and less prone to bugs related to the incorrect context of `this`.
  */

//------------------------
// Example: Using a Regular Function with `bind()` to Correct the `this` Reference
//------------------------

/*
  If you cannot or prefer not to use arrow functions, another solution is to use `bind()` to explicitly set the value of `this` for the callback function.
  */

const teamWithBind = {
  name: "Developers",
  members: ["Alice", "Bob", "Charlie"],
  teamDetails: function () {
    this.members.forEach(
      function (member) {
        // Using `bind(this)` ensures that `this` inside the callback refers to the `teamWithBind` object
        console.log(`${member} is part of team ${this.name}`);
      }.bind(this)
    ); // Bind the current value of `this` to the callback function
  },
};

teamWithBind.teamDetails();
/*
  Output:
  Alice is part of team Developers
  Bob is part of team Developers
  Charlie is part of team Developers
  
  Explanation:
  - `bind(this)` creates a new function where `this` is explicitly set to the `teamWithBind` object.
  - This approach works even with regular functions, ensuring that `this` inside the callback behaves as expected.
  */

//------------------------
// Conclusion on `this` in Callback Functions
//------------------------

/*
  Key takeaways:
  1. **Arrow Functions**: 
     - Arrow functions inherit `this` from their surrounding (lexical) context.
     - This makes them useful for situations where you want to maintain the `this` value of the surrounding method or object.
  
  2. **Regular Functions**: 
     - In regular callback functions, the value of `this` depends on how the function is called.
     - In methods, regular functions inside callbacks can cause `this` to refer to the global object or `undefined`, unless handled correctly.
  
  3. **Using `bind()`**:
     - To explicitly set `this` in a regular function, you can use `bind(this)` to bind the correct context.
     - This approach ensures that `this` inside the callback refers to the correct object.
  
  Best Practice:
  - In modern JavaScript, using arrow functions for callbacks inside methods is generally more concise and less error-prone because they automatically capture the correct `this` context.
  */
