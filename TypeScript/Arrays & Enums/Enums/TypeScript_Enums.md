
# Enums in TypeScript

Enums in TypeScript are a way to define a collection of named constants. Enums make it easier to work with a group of related values and improve code readability and maintainability.

---

## **What are Enums?**
Enums allow you to define a set of named constants that can be used as a type. There are two main types of enums in TypeScript:
1. **Numeric Enums**
2. **String Enums**

TypeScript also provides additional features such as:
- **Computed and Constant Enums**
- **Heterogeneous Enums**
- **Reverse Mapping**

---

## **1. Numeric Enums**
Numeric enums are the default type of enums in TypeScript. By default, the first member of a numeric enum starts at `0`, and subsequent members are incremented by `1`.

### Example
```typescript
enum Direction {
    North,
    East,
    South,
    West,
}

console.log(Direction.North); // Output: 0
console.log(Direction.South); // Output: 2
console.log(Direction[0]);    // Output: 'North'
```

---

## **2. String Enums**
String enums store constant string values for each member. Unlike numeric enums, string enums do not have auto-incremented values.

### Example
```typescript
enum Colors {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE",
}

console.log(Colors.Red); // Output: 'RED'
```

---

## **3. Heterogeneous Enums**
Enums can contain both numeric and string values. This is called a heterogeneous enum.

### Example
```typescript
enum Mixed {
    Yes = 1,
    No = "NO",
}

console.log(Mixed.Yes); // Output: 1
console.log(Mixed.No);  // Output: 'NO'
```

---

## **4. Reverse Mapping**
TypeScript provides reverse mapping for numeric enums. You can get the name of an enum member using its value.

### Example
```typescript
enum Status {
    Active,
    Inactive,
}

console.log(Status[0]); // Output: 'Active'
```

---

## **5. Computed and Constant Enums**
Enums can have computed members where the value is determined by an expression, or constant members with explicitly defined values.

### Example
```typescript
enum ComputedEnum {
    A = 2,
    B = A * 3,
    C = A + B,
}

console.log(ComputedEnum.B); // Output: 6
console.log(ComputedEnum.C); // Output: 8
```

---

## **6. Enum as Types**
Enums can be used as types for function parameters or variables.

### Example
```typescript
enum Roles {
    Admin = "ADMIN",
    User = "USER",
}

function getRole(role: Roles) {
    console.log(`The role is ${role}`);
}

getRole(Roles.Admin); // Output: 'The role is ADMIN'
```

---

## **7. Declaring Enum with Default Values**
You can use enums with default or auto-incremented values.

### Example
```typescript
enum Levels {
    Low,
    Medium,
    High,
}

console.log(Levels.Low);    // Output: 0
console.log(Levels.Medium); // Output: 1
console.log(Levels.High);   // Output: 2
```

---

## **8. Enum with Functions**
You can use enums with functions to improve readability.

### Example
```typescript
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
```

---

## **Summary**
Enums in TypeScript provide a powerful way to group related values with meaningful names. They support numeric and string values, reverse mapping, computed values, and more. By using enums, you can write cleaner, more readable, and type-safe code.
