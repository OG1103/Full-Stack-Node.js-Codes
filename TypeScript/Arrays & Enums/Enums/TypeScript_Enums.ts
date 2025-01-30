
// Enums in TypeScript: Examples with Detailed Comments

// 1. Numeric Enum
enum Direction {
    North, // Default value is 0
    East,  // Default value is 1
    South, // Default value is 2
    West,  // Default value is 3
}

console.log(Direction.North); // Output: 0
console.log(Direction.South); // Output: 2
console.log(Direction[0]);    // Output: 'North'

// 2. String Enum
enum Colors {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE",
}

console.log(Colors.Red); // Output: 'RED'

// 3. Heterogeneous Enum
enum Mixed {
    Yes = 1,
    No = "NO",
}

console.log(Mixed.Yes); // Output: 1
console.log(Mixed.No);  // Output: 'NO'

// 4. Reverse Mapping (only for numeric enums)
enum Status {
    Active,
    Inactive,
}

console.log(Status[0]); // Output: 'Active'

// 5. Computed and Constant Enums
enum ComputedEnum {
    A = 2,        // Constant value
    B = A * 3,    // Computed value (6)
    C = A + B,    // Computed value (8)
}

console.log(ComputedEnum.B); // Output: 6
console.log(ComputedEnum.C); // Output: 8

// 6. Enum as Types
enum Roles {
    Admin = "ADMIN",
    User = "USER",
}

function getRole(role: Roles) {
    console.log(`The role is ${role}`);
}

getRole(Roles.Admin); // Output: 'The role is ADMIN'

// 7. Enum with Functions
enum HttpStatus {
    OK = 200,
    NotFound = 404,
    InternalServerError = 500,
}

function getErrorMessage(status: HttpStatus) {
    switch (status) {
        case HttpStatus.OK:
            return "Request was successful";
        case HttpStatus.NotFound:
            return "Resource not found";
        case HttpStatus.InternalServerError:
            return "Server error occurred";
    }
}

console.log(getErrorMessage(HttpStatus.NotFound)); // Output: 'Resource not found'
