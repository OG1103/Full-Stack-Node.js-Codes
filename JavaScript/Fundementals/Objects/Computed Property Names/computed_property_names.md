# Computed Property Names & Dynamic Assignment in JavaScript

## What Are Computed Property Names?
Computed property names allow you to define object keys dynamically using variables or expressions.

### **Syntax:**
```js
const key = "name";
const obj = {
  [key]: "Omar",
};

console.log(obj); // { name: "Omar" }
```
- Instead of writing `{ name: "Omar" }` manually, we use a variable (`key`) to dynamically create the property.

---

## **Why Use Computed Property Names?**
1. **Dynamic Assignment:** Useful when object keys need to be determined at runtime.
2. **Efficient State Updates:** Common in frameworks like React for form handling.
3. **Avoiding Redundant Code:** Helps eliminate repetitive hardcoded keys.

---

## **Using Computed Property Names in Object Creation**

### **1️⃣ Assigning Dynamic Keys**
```js
const field = "age";
const person = {
  [field]: 25,
};

console.log(person); // { age: 25 }
```
- Here, `field` is `"age"`, so the resulting object becomes `{ age: 25 }`.

### **2️⃣ Dynamic Assignment in Functions**
```js
function createUser(field, value) {
  return { [field]: value };
}

console.log(createUser("email", "omar@example.com"));
// { email: "omar@example.com" }
```
- The function creates an object with a dynamically set key.

### **3️⃣ Updating an Object**
```js
const obj = { username: "Omar" };
const key = "email";
const value = "omar@example.com";

const updatedObj = { ...obj, [key]: value };
console.log(updatedObj);
// { username: "Omar", email: "omar@example.com" }
```
- The `email` key is dynamically added without modifying the original object.

---

## **Using Computed Properties in Loops**
```js
const keys = ["username", "email", "age"];
const values = ["Omar", "omar@example.com", 25];

const user = keys.reduce((acc, key, index) => {
  acc[key] = values[index];
  return acc;
}, {});

console.log(user);
// { username: "Omar", email: "omar@example.com", age: 25 }
```
- This approach is useful when dynamically constructing objects from arrays.

---

## **Computed Property Names in Classes**
```js
class User {
  constructor(property, value) {
    this[property] = value;
  }
}

const user = new User("role", "admin");
console.log(user);
// { role: "admin" }
```
- The key is assigned dynamically at runtime.

---

## **Using Computed Properties for Nested Objects**
```js
const category = "settings";
const subKey = "theme";

const config = {
  [category]: {
    [subKey]: "dark",
  },
};

console.log(config);
// { settings: { theme: "dark" } }
```
- Useful when creating **nested dynamic properties**.

---

## **Using Computed Properties in React (Example)**
```js
const handleChange = (event) => {
  setFormData((prev) => ({
    ...prev,
    [event.target.id]: event.target.value,
  }));
};
```
- This is a common React pattern to dynamically update state values.

---

## **Conclusion**
Computed property names allow you to dynamically set object keys, making your code more flexible and reusable. They are widely used in JavaScript for object manipulation, dynamic forms, and API responses.
