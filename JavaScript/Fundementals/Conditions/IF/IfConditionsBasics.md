
# JavaScript Notes: If Conditions

The `if` statement is a fundamental feature of JavaScript that allows conditional execution of code. It enables decision-making based on the evaluation of conditions.

---

## 1. Basic Syntax of If Conditions

### Syntax:
```javascript
if (condition) {
  // Code to execute if the condition evaluates to true
}
```

### Example:
```javascript
let age = 20;

if (age >= 18) {
  console.log("You are eligible to vote.");
}
```
- **Explanation**:
  - The condition `age >= 18` checks if the `age` is greater than or equal to 18.
  - If true, the message `"You are eligible to vote."` is printed.

---

## 2. If...Else Statement

The `if...else` statement provides an alternative code block to execute if the condition evaluates to false.

### Syntax:
```javascript
if (condition) {
  // Code to execute if the condition evaluates to true
} else {
  // Code to execute if the condition evaluates to false
}
```

### Example:
```javascript
let isStudent = false;

if (isStudent) {
  console.log("You are a student.");
} else {
  console.log("You are not a student.");
}
```
- **Explanation**:
  - If the variable `isStudent` is true, it prints `"You are a student."`.
  - If false, it prints `"You are not a student."`.

---

## 3. If...Else If...Else Statement

The `if...else if...else` statement allows for checking multiple conditions in sequence.

### Syntax:
```javascript
if (condition1) {
  // Code to execute if condition1 is true
} else if (condition2) {
  // Code to execute if condition1 is false and condition2 is true
} else {
  // Code to execute if none of the above conditions are true
}
```

### Example:
```javascript
let score = 75;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
```
- **Explanation**:
  - The conditions are evaluated in order.
  - If `score >= 90`, it prints `"Grade: A"`.
  - If `score >= 80` but less than 90, it prints `"Grade: B"`.
  - If `score >= 70` but less than 80, it prints `"Grade: C"`.
  - If none of the conditions are true, the `else` block executes and prints `"Grade: F"`.

---

## 4. Nested If Statements

You can nest `if` statements to handle more complex logic.

### Example:
```javascript
let age = 25;
let isMember = true;

if (age >= 18) {
  if (isMember) {
    console.log("Welcome to the members' lounge.");
  } else {
    console.log("Please register to become a member.");
  }
} else {
  console.log("You must be 18 or older to enter.");
}
```
- **Explanation**:
  - The outer `if` checks if the `age` is 18 or older.
  - The inner `if` checks if the user is a member.

---

## 5. Logical Operators in If Conditions

### AND Operator (`&&`)
- Ensures all conditions are true.
```javascript
if (age >= 18 && isMember) {
  console.log("Access granted.");
}
```

### OR Operator (`||`)
- Ensures at least one condition is true.
```javascript
if (age < 18 || !isMember) {
  console.log("Access denied.");
}
```

### NOT Operator (`!`)
- Negates the truth value of a condition.
```javascript
if (!isMember) {
  console.log("You are not a member.");
}
```

---

## 6. Edge Cases to Consider

### Evaluating Non-Boolean Values
- Non-boolean values are converted to boolean when used in `if` conditions.
```javascript
if ("") {
  console.log("This won't execute."); // Empty strings are falsy.
}

if ("hello") {
  console.log("This will execute."); // Non-empty strings are truthy.
}
```

### Comparing `==` vs `===`
- `==` compares values for equality, performing type coercion.
- `===` compares values and types, ensuring strict equality.

---

## Summary

- Use `if` conditions for decision-making.
- Combine `if...else if...else` for multiple conditions.
- Leverage logical operators (`&&`, `||`, `!`) to create complex conditions.
- Always prefer `===` over `==` for precise comparison.
