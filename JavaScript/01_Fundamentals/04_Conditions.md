# Conditional Statements in JavaScript

Conditional statements control the flow of execution based on whether conditions evaluate to `true` or `false`. JavaScript provides several mechanisms for branching logic: `if...else`, `switch`, the ternary operator, and short-circuit evaluation patterns.

---

## Table of Contents

1. [if / else if / else Statements](#1-if--else-if--else-statements)
2. [Nested Conditions](#2-nested-conditions)
3. [Switch Statements](#3-switch-statements)
4. [Ternary Operator](#4-ternary-operator)
5. [Short-Circuit Evaluation as Conditional Logic](#5-short-circuit-evaluation-as-conditional-logic)
6. [Truthy and Falsy Values in Conditions](#6-truthy-and-falsy-values-in-conditions)
7. [Patterns and Best Practices](#7-patterns-and-best-practices)

---

## 1. if / else if / else Statements

The `if` statement is the most fundamental conditional construct. It executes a block of code only if a specified condition evaluates to a truthy value.

### Basic Syntax

```js
if (condition) {
  // Executes when condition is truthy
}
```

### if...else

```js
const age = 20;

if (age >= 18) {
  console.log("You are an adult.");
} else {
  console.log("You are a minor.");
}
// Output: "You are an adult."
```

### if...else if...else

Evaluates conditions **top-to-bottom** and executes the first truthy block. Only **one block** executes.

```js
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");  // This executes
} else if (score >= 70) {
  console.log("Grade: C");
} else if (score >= 60) {
  console.log("Grade: D");
} else {
  console.log("Grade: F");
}
// Output: "Grade: B"
```

### Single-Line if (No Braces)

If the body is a single statement, braces are optional. However, **always use braces** in production code for clarity and to avoid bugs.

```js
// Valid but discouraged
if (age >= 18) console.log("Adult");

// This is a common bug:
if (age >= 18)
  console.log("Adult");
  console.log("Can vote"); // This ALWAYS runs! It is NOT part of the if block.

// Safe version:
if (age >= 18) {
  console.log("Adult");
  console.log("Can vote");
}
```

### Multiple Conditions with Logical Operators

```js
const age = 25;
const hasLicense = true;
const hasInsurance = true;

// AND: all conditions must be true
if (age >= 18 && hasLicense && hasInsurance) {
  console.log("You can drive.");
}

// OR: at least one condition must be true
const isWeekend = false;
const isHoliday = true;

if (isWeekend || isHoliday) {
  console.log("Day off!");
}

// NOT: inverts the condition
const isLoggedIn = false;

if (!isLoggedIn) {
  console.log("Please log in.");
}

// Complex conditions
const user = { age: 25, role: "admin", isActive: true };

if ((user.role === "admin" || user.role === "moderator") && user.isActive) {
  console.log("Access granted.");
}
```

---

## 2. Nested Conditions

Conditions can be nested inside each other. While sometimes necessary, deeply nested conditions reduce readability.

### Basic Nesting

```js
const user = { name: "Alice", age: 25, isVerified: true };

if (user) {
  if (user.age >= 18) {
    if (user.isVerified) {
      console.log(`Welcome, ${user.name}!`);
    } else {
      console.log("Please verify your account.");
    }
  } else {
    console.log("You must be 18 or older.");
  }
} else {
  console.log("No user found.");
}
```

### Refactoring Nested Conditions with Early Returns (Guard Clauses)

Guard clauses eliminate nesting by handling failure cases first and returning early.

```js
function processUser(user) {
  if (!user) {
    console.log("No user found.");
    return;
  }

  if (user.age < 18) {
    console.log("You must be 18 or older.");
    return;
  }

  if (!user.isVerified) {
    console.log("Please verify your account.");
    return;
  }

  // Happy path -- no nesting!
  console.log(`Welcome, ${user.name}!`);
}
```

### Nested Conditions with Logical Operators (Flattened)

```js
// Instead of nesting:
if (a) {
  if (b) {
    if (c) {
      doSomething();
    }
  }
}

// Flatten with &&:
if (a && b && c) {
  doSomething();
}
```

---

## 3. Switch Statements

The `switch` statement evaluates an expression and matches it against multiple `case` clauses. It uses **strict equality** (`===`) for comparison.

### Basic Syntax

```js
const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of the work week.");
    break;
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
    console.log("Midweek.");
    break;
  case "Friday":
    console.log("Almost the weekend!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Invalid day.");
}
// Output: "Start of the work week."
```

### Fall-Through Behavior

Without `break`, execution **falls through** to the next case. This is sometimes intentional but often a bug.

```js
// Intentional fall-through: grouping cases
const fruit = "apple";

switch (fruit) {
  case "apple":
  case "pear":
  case "plum":
    console.log("This is a pome or stone fruit.");
    break;
  case "banana":
  case "mango":
    console.log("This is a tropical fruit.");
    break;
  default:
    console.log("Unknown fruit.");
}
// Output: "This is a pome or stone fruit."
```

```js
// Accidental fall-through (bug)
const color = "red";

switch (color) {
  case "red":
    console.log("Red"); // This runs
  case "blue":          // No break above! Execution falls through.
    console.log("Blue"); // This ALSO runs
  case "green":
    console.log("Green"); // This ALSO runs
    break;
  default:
    console.log("Unknown");
}
// Output:
// "Red"
// "Blue"
// "Green"
```

### The default Clause

`default` is optional and handles any value not matched by a `case`. It can appear anywhere in the switch block, but is conventionally placed last.

```js
const status = 999;

switch (status) {
  case 200:
    console.log("OK");
    break;
  case 404:
    console.log("Not Found");
    break;
  case 500:
    console.log("Server Error");
    break;
  default:
    console.log(`Unknown status: ${status}`);
}
// Output: "Unknown status: 999"
```

### Expressions in case Clauses

`case` values can be expressions, not just literals. However, this is uncommon and can be harder to read.

```js
const x = 10;

switch (true) {  // Note: switching on `true`
  case x < 0:
    console.log("Negative");
    break;
  case x === 0:
    console.log("Zero");
    break;
  case x > 0 && x <= 10:
    console.log("Between 1 and 10");
    break;
  case x > 10:
    console.log("Greater than 10");
    break;
}
// Output: "Between 1 and 10"
```

### Switch with Return (in Functions)

When a `switch` is inside a function, `return` can replace `break`.

```js
function getStatusText(code) {
  switch (code) {
    case 200: return "OK";
    case 301: return "Moved Permanently";
    case 400: return "Bad Request";
    case 401: return "Unauthorized";
    case 403: return "Forbidden";
    case 404: return "Not Found";
    case 500: return "Internal Server Error";
    default:  return "Unknown";
  }
}

console.log(getStatusText(404)); // "Not Found"
```

### Switch vs if...else if

| Aspect | `switch` | `if...else if` |
|---|---|---|
| Comparison type | **Strict equality** (`===`) only | Any expression/operator |
| Best for | Matching a single variable against discrete values | Complex conditions, ranges, multiple variables |
| Readability | Better with many discrete values | Better with few conditions or ranges |
| Fall-through | Possible (intentional or accidental) | Not applicable |

### Switch vs Object Lookup

For simple value mapping, an **object lookup** is often cleaner than a switch.

```js
// Switch approach
function getDayType(day) {
  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      return "Weekday";
    case "Saturday":
    case "Sunday":
      return "Weekend";
    default:
      return "Unknown";
  }
}

// Object lookup approach (cleaner)
function getDayType(day) {
  const dayTypes = {
    Monday: "Weekday", Tuesday: "Weekday", Wednesday: "Weekday",
    Thursday: "Weekday", Friday: "Weekday",
    Saturday: "Weekend", Sunday: "Weekend"
  };
  return dayTypes[day] || "Unknown";
}
```

---

## 4. Ternary Operator

The ternary operator (`condition ? valueIfTrue : valueIfFalse`) is a concise way to express simple `if...else` logic as an **expression** (it returns a value).

### Basic Usage

```js
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"

// Equivalent if...else
let status2;
if (age >= 18) {
  status2 = "Adult";
} else {
  status2 = "Minor";
}
```

### Ternary in Different Contexts

```js
// In template literals
const count = 5;
console.log(`${count} item${count === 1 ? "" : "s"} found`);
// "5 items found"

// In function arguments
console.log(true ? "yes" : "no"); // "yes"

// In JSX-like contexts (React)
// return <div>{isLoggedIn ? <Dashboard /> : <Login />}</div>;

// In variable assignment
const greeting = isMorning ? "Good morning" : "Good evening";

// In array elements
const items = [
  "always included",
  isAdmin ? "admin panel" : null,
].filter(Boolean); // removes null/false/undefined
```

### Nested Ternary

Nested ternaries can replace `if...else if...else`, but should be used carefully for readability.

```js
const score = 85;

// Nested ternary (format carefully for readability)
const grade =
  score >= 90 ? "A" :
  score >= 80 ? "B" :
  score >= 70 ? "C" :
  score >= 60 ? "D" :
                "F";

console.log(grade); // "B"
```

### Ternary with Side Effects

While possible, using ternary for side effects (rather than value selection) is discouraged.

```js
// Discouraged (use if...else for side effects)
isLoggedIn ? showDashboard() : showLogin();

// Preferred
if (isLoggedIn) {
  showDashboard();
} else {
  showLogin();
}
```

### Ternary with Logical Operators

```js
// Combine with &&
const message = user && user.name ? `Hello, ${user.name}` : "Hello, Guest";

// Combine with ??
const displayName = user?.name ?? "Anonymous";

// Multiple conditions
const access =
  !user ? "denied" :
  !user.isActive ? "suspended" :
  user.role === "admin" ? "full" :
  "limited";
```

---

## 5. Short-Circuit Evaluation as Conditional Logic

JavaScript's `&&` and `||` operators can serve as concise conditional constructs due to their short-circuit behavior.

### && as "if truthy, then..."

`&&` returns the first falsy value it encounters, or the last value if all are truthy.

```js
// Conditional execution
const isLoggedIn = true;
isLoggedIn && console.log("Welcome back!"); // "Welcome back!" (executes)

const isAdmin = false;
isAdmin && console.log("Admin panel");      // false (does NOT execute)

// Conditional rendering (common in React)
const user = { name: "Alice" };
const greeting = user && `Hello, ${user.name}`;
console.log(greeting); // "Hello, Alice"

const noUser = null;
const greeting2 = noUser && `Hello, ${noUser.name}`;
console.log(greeting2); // null (short-circuits, avoids error)
```

### || as "if falsy, then..."

`||` returns the first truthy value it encounters, or the last value if all are falsy.

```js
// Default values
const name = "" || "Anonymous";
console.log(name); // "Anonymous" (because "" is falsy)

const port = 0 || 3000;
console.log(port); // 3000 (because 0 is falsy -- might be a bug!)

// Chaining defaults
const color = userColor || themeColor || "black";
```

### ?? as "if null/undefined, then..."

More precise than `||` -- only triggers on `null` or `undefined`.

```js
const port = 0 ?? 3000;
console.log(port); // 0 (0 is NOT null/undefined)

const label = "" ?? "Untitled";
console.log(label); // "" ("" is NOT null/undefined)

const value = null ?? "default";
console.log(value); // "default"
```

### Combining Short-Circuit Patterns

```js
// Guard with && then provide default with ??
const user = { settings: { theme: null } };
const theme = user?.settings?.theme ?? "light";
console.log(theme); // "light"

// Conditional assignment
let config = {};
config.debug ??= false;  // Only assigns if debug is null/undefined
config.debug ||= true;   // Assigns if debug is any falsy value
```

---

## 6. Truthy and Falsy Values in Conditions

Every value in JavaScript is either **truthy** or **falsy** when evaluated in a boolean context.

### The Complete Falsy List

```js
if (false)     { } // false
if (0)         { } // false
if (-0)        { } // false
if (0n)        { } // false (BigInt zero)
if ("")        { } // false (empty string)
if (null)      { } // false
if (undefined) { } // false
if (NaN)       { } // false
```

**Everything else is truthy**, including:

```js
if ("0")           { } // true (non-empty string, even if it contains "0")
if ("false")       { } // true (non-empty string)
if ([])            { } // true (empty array is an object)
if ({})            { } // true (empty object)
if (function(){})  { } // true (function is an object)
if (-1)            { } // true (any non-zero number)
if (Infinity)      { } // true
if (new Date())    { } // true
if (new Boolean(false)) { } // true! (a Boolean OBJECT wrapping false is still an object)
```

### Common Patterns Using Truthiness

```js
// Check if string is non-empty
const name = getUserInput();
if (name) {
  console.log(`Hello, ${name}`);
}

// Check if array has elements
const items = getItems();
if (items.length) {  // 0 is falsy, any positive number is truthy
  console.log(`Found ${items.length} items`);
}

// Check if object exists
const user = findUser(id);
if (user) {
  console.log(user.name);
}
```

### Gotchas with Truthy/Falsy in Conditions

```js
// Gotcha 1: "0" is truthy
if ("0") {
  console.log("This runs!"); // "0" is a non-empty string
}

// Gotcha 2: Empty array is truthy
if ([]) {
  console.log("This runs!"); // [] is an object
}
// But empty array equals false with ==
console.log([] == false); // true (abstract equality triggers coercion)

// Gotcha 3: Checking for property existence
const obj = { count: 0 };
if (obj.count) {
  // This does NOT run because 0 is falsy
  console.log("Has count");
}
// Better check:
if ("count" in obj) {
  console.log("Has count property"); // This runs
}
// Or:
if (obj.count !== undefined) {
  console.log("Count is defined"); // This runs
}
```

---

## 7. Patterns and Best Practices

### Guard Clauses (Early Return)

Exit early for invalid cases instead of wrapping logic in deeply nested conditions.

```js
// BAD: deep nesting
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // ... process order
      } else {
        throw new Error("Order not paid");
      }
    } else {
      throw new Error("Order has no items");
    }
  } else {
    throw new Error("No order provided");
  }
}

// GOOD: guard clauses
function processOrder(order) {
  if (!order) throw new Error("No order provided");
  if (order.items.length === 0) throw new Error("Order has no items");
  if (!order.isPaid) throw new Error("Order not paid");

  // ... process order (clean, no nesting)
}
```

### Lookup Tables Instead of Long if/else Chains

```js
// BAD: long if/else chain
function getAnimalSound(animal) {
  if (animal === "dog") return "woof";
  else if (animal === "cat") return "meow";
  else if (animal === "cow") return "moo";
  else if (animal === "duck") return "quack";
  else return "unknown";
}

// GOOD: object lookup
function getAnimalSound(animal) {
  const sounds = {
    dog: "woof",
    cat: "meow",
    cow: "moo",
    duck: "quack"
  };
  return sounds[animal] ?? "unknown";
}
```

### Conditional Object Properties

```js
const isAdmin = true;
const user = {
  name: "Alice",
  age: 30,
  ...(isAdmin && { role: "admin", permissions: ["read", "write", "delete"] })
};
console.log(user);
// { name: "Alice", age: 30, role: "admin", permissions: [...] }
```

### Conditional Array Elements

```js
const isVIP = true;
const features = [
  "basic",
  "standard",
  ...(isVIP ? ["premium", "priority-support"] : [])
];
console.log(features); // ["basic", "standard", "premium", "priority-support"]
```

### Avoid Yoda Conditions in JavaScript

```js
// Yoda condition (common in C to prevent accidental assignment)
if ("admin" === role) { }

// Normal condition (preferred in JavaScript)
if (role === "admin") { }
// In modern JS, using === prevents the assignment bug that Yoda conditions guard against.
```

---

## Summary

- Use `if...else if...else` for general conditional logic with complex expressions.
- Use `switch` when comparing a single value against many discrete cases.
- Use the **ternary operator** for concise value selection (not side effects).
- Use `&&` and `||` for short-circuit conditional patterns.
- Use `??` when `0`, `""`, or `false` are valid (non-nullish) values.
- Prefer **guard clauses** (early returns) over deeply nested conditions.
- Consider **object lookups** for mapping values instead of long switch/if chains.
- Always be aware of **truthy/falsy** quirks, especially with `0`, `""`, `[]`, and `"0"`.
