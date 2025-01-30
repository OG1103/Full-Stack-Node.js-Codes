
// Complex Examples of Enums as Objects in JavaScript

// Example 1: Basic Enum Usage
const Colors = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue"
};
console.log("Color RED:", Colors.RED); // Output: Color RED: red

// Example 2: Immutable Enums with Object.freeze
const Days = Object.freeze({
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday"
});
console.log("Day:", Days.MONDAY); // Output: Day: Monday

// Example 3: Numeric Enums with Reverse Mapping
const Status = {
    ACTIVE: 1,
    INACTIVE: 0,
    PENDING: -1,
    1: "ACTIVE",
    0: "INACTIVE",
    "-1": "PENDING"
};
console.log("Status Code for ACTIVE:", Status.ACTIVE); // Output: 1
console.log("Status Name for Code 1:", Status[1]);    // Output: ACTIVE

// Example 4: Iterating Over an Enum
const Directions = {
    NORTH: "north",
    SOUTH: "south",
    EAST: "east",
    WEST: "west"
};
Object.keys(Directions).forEach(key => {
    console.log(`${key}: ${Directions[key]}`);
});
// Output:
// NORTH: north
// SOUTH: south
// EAST: east
// WEST: west

// Example 5: Using Enums for Conditional Logic
const UserRole = {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest"
};

function checkAccess(role) {
    if (role === UserRole.ADMIN) {
        console.log("Access granted to admin features.");
    } else if (role === UserRole.USER) {
        console.log("Access granted to user features.");
    } else {
        console.log("Guest access only.");
    }
}
checkAccess(UserRole.ADMIN); // Output: Access granted to admin features.

// Example 6: Enum for Bitwise Flags
const Permissions = {
    READ: 1,    // 001
    WRITE: 2,   // 010
    EXECUTE: 4  // 100
};

let userPermissions = Permissions.READ | Permissions.WRITE;
console.log("Can Read:", (userPermissions & Permissions.READ) === Permissions.READ); // Output: true
console.log("Can Execute:", (userPermissions & Permissions.EXECUTE) === Permissions.EXECUTE); // Output: false

// Example 7: Adding Methods to Enums
const PaymentStatus = Object.freeze({
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    isFinal(status) {
        return status === this.COMPLETED || status === this.FAILED;
    }
});
console.log("Is 'Completed' Final:", PaymentStatus.isFinal(PaymentStatus.COMPLETED)); // Output: true
console.log("Is 'Pending' Final:", PaymentStatus.isFinal(PaymentStatus.PENDING));     // Output: false
