
### Shorthand Property Names in Objects

In JavaScript, when creating an object, if the **property name** and the **variable name** are the same, you can use **shorthand property names** to simplify the syntax.

#### What is Shorthand Property Names?

When creating an object, you can omit the key and value when both the key and value have the same name. This shorthand allows you to write cleaner and more concise code.

#### Example:

```javascript
const content = "Hello world";
const post = 123;
const createdBy = 456;

const obj = { content, post, createdBy };

console.log(obj);
```

##### Output:
```javascript
{
  content: "Hello world",
  post: 123,
  createdBy: 456
}
```

- In the example above, `content`, `post`, and `createdBy` are the **variables** being used as both the **property names** and **values** of the object.
- This is **equivalent** to:

```javascript
const obj = {
  content: content,
  post: post,
  createdBy: createdBy
};
```

#### Why Use Shorthand Property Names?

- **Simplifies code**: If the variable name and the property name are the same, you can avoid repeating them, making your code more readable and concise.
- **Reduces redundancy**: You only need to write the variable name once, which is especially useful when working with large objects or in situations where you need to pass multiple variables into an object.

#### Using Shorthand Property Names with Destructuring
- Shorthand properties are often used in combination with **destructuring** when passing objects to functions. In these cases, you can destructure the object inside the function and pass the properties with the same name.

#### Example: Passing Destructured Object to Function

```javascript
const person = {
    name: "John",
    age: 30,
    details: {
        occupation: "Engineer",
        city: "New York"
    }
};

const { name, age, details } = person;
greet({ name, age, details });

// Equivalent to:
greet({ name: "John", age: 30, details: { occupation: "Engineer", city: "New York" } });
```

In this example:
- We destructure the `person` object into `name`, `age`, and `details` variables.
- We then pass the destructured variables (`name`, `age`, `details`) into the `greet()` function using shorthand property names. The function receives an object where the property names match the variable names.

This is a great way to pass around an object without having to manually construct the object by repeating the variable names.
