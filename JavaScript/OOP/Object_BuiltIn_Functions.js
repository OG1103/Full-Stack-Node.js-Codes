/**
 * JavaScript Object Built-in Functions
 * ------------------------------------
 * JavaScript provides several built-in functions for the `Object` class
 * that allow you to manipulate and interact with objects in various ways.
 *
 * Below are some of the most commonly used built-in methods for objects.
 */

// 1. Object.keys()
// ----------------
// Returns an array of the object's own enumerable property names (keys).
const obj = { a: 1, b: 2, c: 3 };
const keys = Object.keys(obj);
console.log(keys); // Output: ['a', 'b', 'c']

/**
 * Notes:
 * - The method only returns enumerable (iterable) properties.
 * - It doesn't include inherited properties from the object's prototype.
 */

// 2. Object.values()
// ------------------
// Returns an array of the object's own enumerable property values.
const values = Object.values(obj);
console.log(values); // Output: [1, 2, 3]

/**
 * Notes:
 * - Similar to `Object.keys()`, but returns the values of the properties instead of the keys.
 */

// 3. Object.entries()
// -------------------
// Returns an array of key-value pairs from the object.
const entries = Object.entries(obj);
console.log(entries); // Output: [['a', 1], ['b', 2], ['c', 3]]

/**
 * Notes:
 * - Useful for iterating over both keys and values at the same time.
 * - You can loop through this array using a `for...of` loop.
 */

// 4. Object.assign()
// ------------------
// Copies all enumerable properties from one or more source objects to a target object.
const target = { d: 4 };
const source = { a: 1, b: 2 };
const merged = Object.assign(target, source);
console.log(merged); // Output: { d: 4, a: 1, b: 2 }

/**
 * Notes:
 * - Mutates the target object by copying properties from the source object(s).
 * - Only copies enumerable and own properties.
 * - Does a shallow copy, not a deep copy.
 */

// 5. Object.freeze()
// ------------------
// Freezes an object, making it immutable (can't be changed or added to).
const frozenObj = Object.freeze({ e: 5 });
frozenObj.e = 10; // This will silently fail in non-strict mode
console.log(frozenObj.e); // Output: 5

/**
 * Notes:
 * - After freezing an object, no new properties can be added, and existing properties can't be changed.
 * - The object becomes immutable, but this is a shallow freeze. If the object contains nested objects, those nested objects can still be modified.
 */

// 6. Object.seal()
// ----------------
// Seals an object, preventing new properties from being added or existing properties from being deleted.
const sealedObj = Object.seal({ f: 6 });
sealedObj.f = 7; // Allowed (modifying existing properties)
delete sealedObj.f; // Not allowed (deleting properties)
console.log(sealedObj.f); // Output: 7

/**
 * Notes:
 * - Sealed objects allow modification of existing properties but do not allow the addition or removal of properties.
 */

// 7. Object.create()
// ------------------
// Creates a new object with the specified prototype object and properties.
const proto = { g: 8 };
const newObj = Object.create(proto);
console.log(newObj.g); // Output: 8

/**
 * Notes:
 * - Creates a new object with `proto` as its prototype.
 * - The new object can access properties and methods from its prototype.
 */

// 8. Object.is()
// --------------
// Compares two values to determine if they are the same value (similar to `===` but with some differences).
console.log(Object.is(NaN, NaN)); // Output: true
console.log(Object.is(0, -0)); // Output: false

/**
 * Notes:
 * - Unlike `===`, `Object.is()` considers `NaN` to be equal to `NaN`, and distinguishes between `+0` and `-0`.
 */

// 9. Object.getPrototypeOf()
// --------------------------
// Returns the prototype (internal [[Prototype]] property) of the specified object.
const prototype = Object.getPrototypeOf(newObj);
console.log(prototype === proto); // Output: true

/**
 * Notes:
 * - Returns the object's prototype, which is the object that was used as the prototype when the object was created (using `Object.create()` or through class inheritance).
 */

// 10. Object.setPrototypeOf()
// ---------------------------
// Sets the prototype (internal [[Prototype]]) of an object.
const newProto = { h: 9 };
Object.setPrototypeOf(newObj, newProto);
console.log(Object.getPrototypeOf(newObj) === newProto); // Output: true

/**
 * Notes:
 * - This method sets the prototype of an existing object to another object.
 * - It allows you to dynamically change the prototype chain, but be careful with performance implications.
 */

// 11. Object.defineProperty()
// ---------------------------
// Defines a new property on an object, or modifies an existing property with more control over attributes.
const configurableObj = {};
Object.defineProperty(configurableObj, "i", {
  value: 10,
  writable: false, // Cannot modify this property
  configurable: false, // Cannot delete this property
});
console.log(configurableObj.i); // Output: 10
configurableObj.i = 20; // Silent fail in non-strict mode
console.log(configurableObj.i); // Output: 10

/**
 * Notes:
 * - Provides more control over property descriptors, including `writable`, `enumerable`, and `configurable` attributes.
 * - Useful for defining read-only, non-enumerable, or other specialized properties.
 */

// 12. Object.defineProperties()
// -----------------------------
// Defines multiple properties on an object.
Object.defineProperties(configurableObj, {
  j: {
    value: 20,
    writable: true,
    configurable: true,
  },
  k: {
    value: 30,
    writable: false,
  },
});
console.log(configurableObj.j); // Output: 20
console.log(configurableObj.k); // Output: 30

/**
 * Notes:
 * - Similar to `Object.defineProperty()`, but allows defining multiple properties at once.
 */

// 13. Object.getOwnPropertyDescriptor()
// -------------------------------------
// Returns an object describing the attributes of a property on the object.
const descriptor = Object.getOwnPropertyDescriptor(configurableObj, "i");
console.log(descriptor);
// Output: { value: 10, writable: false, enumerable: false, configurable: false }

/**
 * Notes:
 * - Useful to retrieve the property descriptor object for a specific property, which includes attributes like `writable`, `enumerable`, and `configurable`.
 */

// 14. Object.getOwnPropertyNames()
// --------------------------------
// Returns an array of all properties' names (including non-enumerable properties).
const allProperties = Object.getOwnPropertyNames(configurableObj);
console.log(allProperties); // Output: ['i', 'j', 'k']

/**
 * Notes:
 * - Unlike `Object.keys()`, this method returns both enumerable and non-enumerable property names.
 */

// 15. Object.preventExtensions()
// ------------------------------
// Prevents new properties from being added to an object (but existing properties can still be modified or deleted).
const extensibleObj = { l: 1 };
Object.preventExtensions(extensibleObj);
extensibleObj.m = 2; // Not allowed (adding new properties)
console.log(extensibleObj.m); // Output: undefined

/**
 * Notes:
 * - After calling this method, you can modify or delete existing properties but can't add new properties to the object.
 */

/**
 * Summary:
 * ---------
 * These built-in functions for the `Object` class allow you to work with objects efficiently, providing methods for:
 * - Retrieving keys, values, or entries (`Object.keys()`, `Object.values()`, `Object.entries()`).
 * - Freezing, sealing, or preventing extensions (`Object.freeze()`, `Object.seal()`, `Object.preventExtensions()`).
 * - Copying or merging properties (`Object.assign()`).
 * - Working with prototypes (`Object.getPrototypeOf()`, `Object.setPrototypeOf()`).
 * - Defining and controlling property attributes (`Object.defineProperty()`, `Object.defineProperties()`).
 */
