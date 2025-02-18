// Computed Property Names & Dynamic Assignment in JavaScript

// 1️⃣ Basic Example
const keyName = "username";
const user = {
  [keyName]: "Omar",
};
console.log(user); // { username: "Omar" }

// 2️⃣ Using a Function to Create Dynamic Objects
function createUser(field, value) {
  return { [field]: value };
}
console.log(createUser("email", "omar@example.com")); // { email: "omar@example.com" }

// 3️⃣ Updating an Object Dynamically
const userProfile = { name: "Omar" };
const field = "email";
const value = "omar@example.com";

const updatedProfile = { ...userProfile, [field]: value };
console.log(updatedProfile); // { name: "Omar", email: "omar@example.com" }

// 4️⃣ Using Computed Properties in Loops
const fields = ["username", "email", "age"];
const values = ["Omar", "omar@example.com", 25];

const userData = fields.reduce((obj, field, index) => {
  obj[field] = values[index];
  return obj;
}, {});
console.log(userData); // { username: "Omar", email: "omar@example.com", age: 25 }

// 5️⃣ Computed Property Names in Classes
class User {
  constructor(property, value) {
    this[property] = value;
  }
}
const admin = new User("role", "admin");
console.log(admin); // { role: "admin" }

// 6️⃣ Using Computed Properties for Nested Objects
const category = "settings";
const subKey = "theme";

const appConfig = {
  [category]: {
    [subKey]: "dark",
  },
};
console.log(appConfig); // { settings: { theme: "dark" } }

// 7️⃣ Dynamic Object Assignment in React
const handleChange = (event) => {
  setFormData((prev) => ({
    ...prev,
    [event.target.id]: event.target.value,
  }));
};
