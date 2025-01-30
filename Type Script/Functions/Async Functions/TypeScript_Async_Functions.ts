
// 1. Async Named Function
async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

// Usage of async named function
fetchData("https://jsonplaceholder.typicode.com/todos/1").then(data => {
    console.log(data); // Output: The content of the fetched URL
});

// 2. Async Arrow Function
const fetchDataArrow = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify(data);
};

// Usage of async arrow function
fetchDataArrow("https://jsonplaceholder.typicode.com/todos/1").then(data => {
    console.log(data); // Output: The JSON content of the fetched URL
});

// 3. Handling Errors in Async Functions
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

// Example with error handling
fetchWithErrorHandling("https://invalid.url").then(data => {
    console.log(data); // Output: An error occurred message
});

// 4. Returning Complex Types
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

// Example with complex return types
fetchTodo("https://jsonplaceholder.typicode.com/todos/1").then(todo => {
    console.log(todo); // Output: { userId: 1, id: 1, title: "...", completed: false }
});

// 5. Async with Multiple Promises
const fetchMultiple = async (urls: string[]): Promise<string[]> => {
    const responses = await Promise.all(urls.map(url => fetch(url).then(res => res.text())));
    return responses;
};

const urls = [
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2"
];

// Example with multiple promises
fetchMultiple(urls).then(data => {
    console.log(data); // Output: Array of fetched content
});
