
# JavaScript Notes: Switch Statements

The `switch` statement in JavaScript is used to execute one block of code out of many options based on the evaluation of an expression. It is often used as an alternative to multiple `if...else if` statements for better readability and performance in some cases.

---

## 1. Syntax

```javascript
switch (expression) {
  case value1:
    // Code to execute if expression === value1
    break;
  case value2:
    // Code to execute if expression === value2
    break;
  default:
    // Code to execute if no cases match
}
```

- **`expression`**: The value being compared to each `case`.
- **`case value`**: A value to compare with the `expression`.
- **`break`**: Exits the `switch` block once the matching case is executed.
- **`default`**: Executes if no matching case is found (optional).

---

## 2. Example: Basic Switch Statement

```javascript
let day = 3;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Invalid day");
}
```

- **Explanation**:
  - The `switch` compares `day` with each case.
  - When `day === 3`, it executes `console.log("Wednesday")`.
  - The `break` prevents the execution from continuing to other cases.

---

## 3. Default Case

If no `case` matches the `expression`, the `default` block executes.

```javascript
let fruit = "banana";

switch (fruit) {
  case "apple":
    console.log("This is an apple.");
    break;
  case "orange":
    console.log("This is an orange.");
    break;
  default:
    console.log("Unknown fruit.");
}
```

- Output: `"Unknown fruit."`

---

## 4. Multiple Cases with the Same Code

Multiple cases can execute the same block of code by omitting the `break` between them.

```javascript
let grade = "A";

switch (grade) {
  case "A":
  case "B":
    console.log("Great job!");
    break;
  case "C":
    console.log("Good effort!");
    break;
  default:
    console.log("Needs improvement.");
}
```

- **Explanation**:
  - Both `case "A"` and `case "B"` execute `"Great job!"`.

---

## 5. Using Expressions in Switch Cases

You can use expressions or calculations as cases.

```javascript
let num = 10;

switch (true) {
  case num < 5:
    console.log("Number is less than 5.");
    break;
  case num >= 5 && num <= 15:
    console.log("Number is between 5 and 15.");
    break;
  default:
    console.log("Number is greater than 15.");
}
```

- Output: `"Number is between 5 and 15."`

---

## 6. Nested Switch Statements

Switch statements can be nested, but this can reduce readability.

```javascript
let role = "admin";
let action = "edit";

switch (role) {
  case "admin":
    switch (action) {
      case "edit":
        console.log("Admin can edit.");
        break;
      case "delete":
        console.log("Admin can delete.");
        break;
      default:
        console.log("Admin action not allowed.");
    }
    break;
  case "user":
    console.log("User actions allowed.");
    break;
  default:
    console.log("Role not recognized.");
}
```

---

## 7. Key Points

- Always use `break` to prevent "fall-through" unless intentional.
- The `default` case is optional but recommended for handling unexpected values.
- Consider readability when using switch statements; for complex conditions, `if...else` may be clearer.
