# Duck Typing in TypeScript

**Duck typing** is a concept in TypeScript (and other languages) that focuses on the behavior or structure of an object rather than its specific type. The term comes from the saying:

> "If it looks like a duck, swims like a duck, and quacks like a duck, then it is probably a duck."

In TypeScript, this means that if an object has the required properties and methods, it can be used where that type is expected, regardless of its explicit type.

This is known as inference: typescript itself tries to infer the type of a variable declaration


---

## **How Duck Typing Works in TypeScript**

TypeScript uses **structural typing**, which is based on the object's shape or structure. As long as an object satisfies the shape of the expected type, TypeScript considers it valid.

### **Example**

```typescript
interface Duck {
  quack: () => void;
}

const duck: Duck = {
  quack: () => console.log("Quack!"),
};

// A different object with the same structure can also be assigned
const anotherDuck = {
  quack: () => console.log("Another quack!"),
};

let myDuck: Duck = anotherDuck; // Valid due to duck typing
```

In this example, `anotherDuck` works because it has the same structure as the `Duck` interface.

---

## **Advantages of Duck Typing**

1. **Flexibility**: Allows working with objects as long as they meet the required structure.
2. **Loose Coupling**: You don't need to strictly tie objects to specific types or classes.
3. **Interoperability**: Makes it easier to integrate third-party libraries or APIs.

---

## **Scenarios and Examples**

### **1. Function Parameter Validation**

You can pass objects that match the required structure without needing them to explicitly implement a type or interface.

```typescript
interface Logger {
  log: (message: string) => void;
}

function writeLog(logger: Logger) {
  logger.log("Logging a message!");
}

// Works because it has a `log` method with the same structure
const simpleLogger = {
  log: (message: string) => console.log(message),
};

writeLog(simpleLogger); // Outputs: Logging a message!
```

### **2. Assigning Objects**

You can assign objects with the same structure to a variable with a specific type.

```typescript
interface Point {
  x: number;
  y: number;
}

const point: Point = { x: 10, y: 20 }; // Valid
const anotherPoint = { x: 15, y: 25, z: 30 }; // Has extra property `z`

const myPoint: Point = anotherPoint; // Valid, extra properties are ignored
```

### **3. Objects with Methods**

If an object has the required method(s), it satisfies the type.

```typescript
interface Greeter {
  greet: () => string;
}

const greeter = {
  greet: () => "Hello, world!",
  extra: "Additional data",
};

let myGreeter: Greeter = greeter; // Valid
console.log(myGreeter.greet()); // Outputs: Hello, world!
```

---

## **Duck Typing vs Explicit Typing**

| **Aspect**      | **Duck Typing**                              | **Explicit Typing**                        |
| --------------- | -------------------------------------------- | ------------------------------------------ |
| **Definition**  | Focuses on structure rather than type name   | Requires explicit implementation of a type |
| **Flexibility** | High                                         | Low                                        |
| **Error Prone** | Potentially higher for mismatched structures | Lower due to strict type checks            |
| **Use Cases**   | Integration with APIs, loose validation      | Strictly typed applications                |

---

## **Best Practices**

1. **Define Interfaces or Types**: Even with duck typing, use interfaces to ensure consistency and readability.
2. **Check Extra Properties**: Be cautious of additional properties that might exist in objects but aren't relevant to the required structure.
3. **Document Expected Shapes**: Clearly document the expected structure of objects for maintainability.

---

Duck typing in TypeScript provides a powerful and flexible way to work with objects, making it easy to handle dynamic and loosely typed data while maintaining type safety.
