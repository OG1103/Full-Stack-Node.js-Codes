/*
1. Regular Function as a Method (Inside an Object):
When you define a regular function inside an object as a method, the this keyword refers to the object itself. 
This works as expected because when you call the method on the object, this is dynamically bound to that object.

2. Arrow Function as a Method (Inside an Object):
If you define a method using an arrow function inside an object, 
this does not refer to the object. Arrow functions inherit this from the lexical scope (the context where the function was defined), 
which in this case would be the surrounding scope outside the object (often the global object or undefined in strict mode). 
This is why using an arrow function to define a method results in this being undefined or pointing to the wrong context.

3. Arrow Function Inside a Method (Nested) (Inside an Object):
When you use an arrow function inside a regular method (e.g., as a callback within the method), the this keyword inherits from the method’s this context, 
which refers to the object. This is because arrow functions do not have their own this, so they use the this from the method they are nested within. 
In this scenario, this will refer to the object correctly.

Summary:
Regular functions defined as methods have this bound to the object itself.
Arrow functions defined as methods will not work as expected because they don't have their own this.
Arrow functions nested inside regular methods (e.g., as callbacks) will inherit this from the method, which correctly refers to the object.
 */
