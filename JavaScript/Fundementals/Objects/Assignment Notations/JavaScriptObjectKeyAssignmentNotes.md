
# JavaScript Object Property Assignment: Dot Notation vs Bracket Notation

JavaScript objects store data as key-value pairs. Properties can be assigned and accessed using **dot notation** or **bracket notation**. Each has specific use cases and limitations.

---

## 1. Dot Notation

### Syntax:
```javascript
object.property = value;
```

- **Use Case**: When the property name (key) is known and static.
- **Limitation**: Cannot handle dynamic property names or special characters.

### Example:
```javascript
const restaurant = {};
restaurant.name = "Gourmet Kitchen";
restaurant.location = "Downtown";
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown' }
```

---

## 2. Bracket Notation

### Syntax:
```javascript
object[key] = value;
```

- **Use Case**: When the property name (key) is dynamic or stored in a variable.
- **Flexibility**: Handles keys with special characters or spaces.
- **Limitation**: Slightly more verbose than dot notation.

### Example:
```javascript
const restaurant = {};
const CUISINE_KEY = "cuisine";
restaurant[CUISINE_KEY] = "Italian";
console.log(restaurant);
// Output: { cuisine: 'Italian' }
```

---

## 3. Dynamic Keys

When the property name is stored in a variable, **bracket notation** must be used.

### Example:
```javascript
const restaurant = {};
const SPECIAL_OFFER_KEY = "specialOffer";
restaurant[SPECIAL_OFFER_KEY] = "10% off";
console.log(restaurant);
// Output: { specialOffer: '10% off' }
```

Attempting to use dot notation with a dynamic key:
```javascript
restaurant.SPECIAL_OFFER_KEY = "This won't work";
console.log(restaurant);
// Output: { specialOffer: '10% off', SPECIAL_OFFER_KEY: "This won't work" }
```

- The key `SPECIAL_OFFER_KEY` is interpreted literally, not as a variable.

---

## 4. Differences Between Dot and Bracket Notation

| Feature                  | Dot Notation               | Bracket Notation              |
|--------------------------|----------------------------|--------------------------------|
| **Static Keys**          | Supported                 | Supported                     |
| **Dynamic Keys**         | Not Supported             | Supported                     |
| **Special Characters**   | Not Supported             | Supported                     |
| **Usage**                | Simple and concise        | More flexible but verbose     |

---

## 5. Key Points

- Use **dot notation** for known, simple property names.
- Use **bracket notation** for dynamic keys, variable keys, or keys with special characters.
- Mixing both notations is common depending on the situation.

---

## Full Example:
```javascript
const restaurant = {};

// Static Assignment
restaurant.name = "Gourmet Kitchen";
restaurant.location = "Downtown";

// Dynamic Assignment
const CUISINE_KEY = "cuisine";
const SPECIAL_OFFER_KEY = "specialOffer";
restaurant[CUISINE_KEY] = "Italian";
restaurant[SPECIAL_OFFER_KEY] = "10% off";

console.log(restaurant);
// Output:
// {
//   name: 'Gourmet Kitchen',
//   location: 'Downtown',
//   cuisine: 'Italian',
//   specialOffer: '10% off'
// }
```
