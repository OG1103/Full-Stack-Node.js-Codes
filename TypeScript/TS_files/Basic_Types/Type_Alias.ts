// TypeScript Type Alias Examples

// 1. Basic Type Alias
type Name = string;
let firstName: Name = "Alice"; // 'firstName' is of type 'Name', which is an alias for 'string'

// 2. Object Type Alias
type Person = {
  name: string;
  age: number;
  isStudent: boolean;
};

let student: Person = {
  name: "John",
  age: 21,
  isStudent: true,
}; // 'student' must conform to the 'Person' object structure

// 3. Union Type Alias
type ID = string | number;

let userId: ID;
userId = 101; // valid
userId = "abc123"; // valid

// 4. Function Type Alias
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name) => {
  return `Hello, ${name}`;
};

// 5. Alias for Complex Types (Array of Objects)
type Product = {
  id: number;
  name: string;
  price: number;
};

let products: Product[] = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
]; // Array of objects using the 'Product' type alias

// 6. Alias for Intersection Types
type Admin = {
  role: string;
};

type AdminUser = Person & Admin; // Intersection of 'Person' and 'Admin' types

let admin: AdminUser = {
  name: "Alice",
  age: 30,
  isStudent: false,
  role: "Administrator",
}; // 'admin' combines both 'Person' and 'Admin' properties
