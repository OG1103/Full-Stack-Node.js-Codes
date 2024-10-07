// Creating an empty object
const restaurant = {};

// Constants for static keys
const NAME_KEY = "name";
const LOCATION_KEY = "location";
const RATING_KEY = "rating";
const CUISINE_KEY = "cuisine";

// Static Assignment: Dot Notation (for known keys)
// Dot notation is used when you know the key/property name ahead of time (statically).
// The property name is hardcoded and does not change dynamically.
restaurant.name = "Gourmet Kitchen"; // Static assignment using dot notation
restaurant.location = "Downtown"; // Static assignment using dot notation
restaurant.rating = 4.5; // Static assignment using dot notation

console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5 }

// Static Assignment: Bracket Notation
// Bracket notation can also be used for static assignments, but it is typically used for more complex cases.
// Here, we are using a constant key instead of a hardcoded string.
// You can think of this as an alternative to dot notation, though it's more flexible.
restaurant[CUISINE_KEY] = "Italian"; // Static assignment using bracket notation

console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian' }

// Constants for dynamic keys
const SPECIAL_OFFER_KEY = "specialOffer";

// Dynamic Assignment: Bracket Notation
// Bracket notation is necessary when the property name is not known ahead of time.
// If the key is stored in a variable (like `SPECIAL_OFFER_KEY`), you must use bracket notation.
// Dot notation cannot be used in such cases because it expects a static, known property name.
restaurant[SPECIAL_OFFER_KEY] = "10% off"; // Dynamic assignment using bracket notation

console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian', specialOffer: '10% off' }

// Trying dynamic assignment with dot notation will not work because it expects a fixed key
// If you try to use dot notation with a variable key, it will not work as intended.
restaurant.SPECIAL_OFFER_KEY = "This won't work as expected"; // Incorrect use of dot notation
// The above line will literally create a property named 'SPECIAL_OFFER_KEY', not "specialOffer".

console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian', specialOffer: '10% off', SPECIAL_OFFER_KEY: "This won't work as expected" }

// Correct use of bracket notation for dynamic keys:
console.log(restaurant[SPECIAL_OFFER_KEY]); // Output: "10% off"

// Explanation of Key Differences:
// - **Dot Notation**:
//   - Used when you **know the property name ahead of time** (statically).
//   - The property name is **hardcoded** in the dot notation (e.g., `restaurant.name`).
//   - Cannot be used when the property name is in a variable or contains special characters like spaces.
//   - Example: `restaurant.name = "Gourmet Kitchen";`

// - **Bracket Notation**:
//   - Used when you **don't know the property name ahead of time** (dynamically).
//   - You can assign a key stored in a **variable** (e.g., `restaurant[SPECIAL_OFFER_KEY]`).
//   - It also allows for keys that contain **special characters** or spaces (e.g., `restaurant["special offer"]`).
//   - More flexible for dynamic scenarios but slightly more verbose.
//   - Example: `restaurant[SPECIAL_OFFER_KEY] = "10% off";`
