
# Enums as Objects in JavaScript

Enums (short for "enumerations") are a way to define a set of named constants in JavaScript. Although JavaScript does not have built-in enum support like other languages (e.g., TypeScript or C#), you can use objects to achieve similar functionality.

## 1. Defining Enums Using Objects
In JavaScript, you can use plain objects to create enums.

### Example
```javascript
const Colors = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue"
};

console.log(Colors.RED); // Output: red
```

## 2. Using `Object.freeze` to Make Enums Immutable
You can use `Object.freeze` to make your enums immutable.
```javascript
const Directions = Object.freeze({
    NORTH: "north",
    SOUTH: "south",
    EAST: "east",
    WEST: "west"
});

console.log(Directions.NORTH); // Output: north
```

## 3. Enum-Like Behavior with Numeric Values
Enums can also map to numeric values.
```javascript
const Status = {
    ACTIVE: 1,
    INACTIVE: 0,
    SUSPENDED: -1
};

console.log(Status.ACTIVE); // Output: 1
```

## 4. Reverse Mapping for Numeric Enums
You can add reverse mapping to allow lookup by value as well.
```javascript
const UserRole = {
    ADMIN: 1,
    USER: 2,
    GUEST: 3,
    1: "ADMIN",
    2: "USER",
    3: "GUEST"
};

console.log(UserRole.ADMIN); // Output: 1
console.log(UserRole[1]);    // Output: ADMIN
```

## 5. Enum Iteration
You can iterate over an enum using `Object.keys` or `Object.values`.

### Example
```javascript
const Colors = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue"
};

Object.keys(Colors).forEach(key => {
    console.log(`${key}: ${Colors[key]}`);
});
// Output:
// RED: red
// GREEN: green
// BLUE: blue
```

## 6. Enums for Bitwise Flags
Enums can represent flags using bitwise operators.
```javascript
const Permissions = {
    READ: 1,       // 001
    WRITE: 2,      // 010
    EXECUTE: 4     // 100
};

let userPermissions = Permissions.READ | Permissions.WRITE;
console.log((userPermissions & Permissions.READ) === Permissions.READ); // Output: true
console.log((userPermissions & Permissions.EXECUTE) === Permissions.EXECUTE); // Output: false
```

## Summary
Enums as objects in JavaScript provide a way to define and organize constants in your code. Using `Object.freeze` and reverse mapping, you can mimic traditional enum behavior while maintaining immutability and flexibility.
