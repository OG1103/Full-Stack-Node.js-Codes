
# Async Functions in TypeScript

Asynchronous functions in TypeScript allow you to write asynchronous code that looks and behaves like synchronous code, improving readability and maintainability. TypeScript enhances async/await functionality with type safety, ensuring better development experience.

---

## **What are Async Functions?**

Async functions always return a `Promise`. Inside an async function, you can use the `await` keyword to pause execution until a `Promise` is resolved or rejected.

---

## **1. Async Named Functions**

### Basic Syntax
You can declare an asynchronous named function using the `async` keyword before the `function` keyword.
Inside promise<>; declare type of data that will be returns ex: string, array of users (custom type) or anything

```typescript
async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}
```

### Example Usage
```typescript
fetchData("https://jsonplaceholder.typicode.com/todos/1").then(data => {
    console.log(data);
});
```

---

## **2. Async Arrow Functions**

Arrow functions can also be declared as async by placing the `async` keyword before the parameters.

### Basic Syntax
```typescript
const fetchData = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify(data);
};
```

### Example Usage
```typescript
fetchData("https://jsonplaceholder.typicode.com/todos/1").then(data => {
    console.log(data);
});
```

---

## **3. Handling Errors in Async Functions**

You can use `try...catch` blocks to handle errors inside async functions.

### Example
```typescript
async function fetchWithErrorHandling(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        return `An error occurred: ${(error as Error).message}`;
    }
}
```

---

## **4. Returning Complex Types**

Async functions can return objects, arrays, or custom types wrapped in a `Promise`.

### Example
```typescript
type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

const fetchTodo = async (url: string): Promise<Todo> => {
    const response = await fetch(url);
    return await response.json();
};

fetchTodo("https://jsonplaceholder.typicode.com/todos/1").then(todo => {
    console.log(todo);
});
```

---

## **5. Async with Multiple Promises**

You can use `Promise.all` to handle multiple async operations in parallel.

### Example
```typescript
const fetchMultiple = async (urls: string[]): Promise<string[]> => {
    const responses = await Promise.all(urls.map(url => fetch(url).then(res => res.text())));
    return responses;
};

const urls = [
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2"
];

fetchMultiple(urls).then(data => {
    console.log(data);
});
```

---

## **Summary**

Async functions in TypeScript provide a clean and type-safe way to handle asynchronous operations using `async` and `await`. You can write named or arrow functions, handle errors with `try...catch`, and work with multiple promises efficiently.
