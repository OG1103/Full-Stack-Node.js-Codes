
# JavaScript Notes: Ternary (Conditional) Operator

The ternary operator, also known as the conditional operator, is a shorthand way of writing `if...else` statements in JavaScript. It evaluates a condition and returns one value if the condition is true and another if the condition is false.

---

## 1. Syntax

```javascript
condition ? expressionIfTrue : expressionIfFalse;
```

- **`condition`**: A boolean expression that evaluates to `true` or `false`.
- **`expressionIfTrue`**: The value or expression returned if the condition is `true`.
- **`expressionIfFalse`**: The value or expression returned if the condition is `false`.

---

## 2. Basic Example

```javascript
let age = 20;
let eligibility = age >= 18 ? "Eligible to vote" : "Not eligible to vote";
console.log(eligibility); // Output: "Eligible to vote"
```

- **Explanation**:
  - The condition `age >= 18` is checked.
  - If `true`, `"Eligible to vote"` is assigned to `eligibility`.
  - If `false`, `"Not eligible to vote"` is assigned.

---

## 3. Nested Ternary Operators

Ternary operators can be nested for more complex conditions. However, this can reduce readability.

### Example:
```javascript
let score = 85;
let grade = score >= 90
  ? "A"
  : score >= 80
  ? "B"
  : score >= 70
  ? "C"
  : "F";
console.log(grade); // Output: "B"
```

- **Explanation**:
  - If `score >= 90`, `grade` is `"A"`.
  - If `score >= 80` but less than 90, `grade` is `"B"`.
  - If `score >= 70` but less than 80, `grade` is `"C"`.
  - Otherwise, `grade` is `"F"`.

---

## 4. Using the Ternary Operator for Assignments

The ternary operator is often used to assign a value based on a condition.

### Example:
```javascript
let isAdmin = true;
let accessLevel = isAdmin ? "Full Access" : "Limited Access";
console.log(accessLevel); // Output: "Full Access"
```

---

## 5. Returning Values from Functions

The ternary operator can be used to return values directly from a function.

### Example:
```javascript
function checkEvenOdd(num) {
  return num % 2 === 0 ? "Even" : "Odd";
}
console.log(checkEvenOdd(4)); // Output: "Even"
console.log(checkEvenOdd(7)); // Output: "Odd"
```

---

## 6. Combining Logical Operators with the Ternary Operator

The ternary operator can be combined with logical operators for more complex conditions.

### Example:
```javascript
let userRole = "editor";
let canEdit = userRole === "admin" || userRole === "editor" ? "Yes" : "No";
console.log(canEdit); // Output: "Yes"
```

---

## 7. Edge Cases

### Assigning Values in a Loop
```javascript
let numbers = [1, 2, 3, 4, 5];
let parity = numbers.map(num => (num % 2 === 0 ? "Even" : "Odd"));
console.log(parity); // Output: ["Odd", "Even", "Odd", "Even", "Odd"]
```

### Avoid Overusing Ternary Operators
- Nested ternaries can reduce readability. Use `if...else` for more complex logic.

---

## Summary

- The ternary operator is a concise way to write conditional expressions.
- It is useful for simple conditions but can become unreadable when overused or nested.
- Always prioritize code readability when deciding between `if...else` and the ternary operator.
