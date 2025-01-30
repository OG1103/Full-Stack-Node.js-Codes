
// Creating an empty object
const restaurant = {};

// Static Assignment: Dot Notation
restaurant.name = "Gourmet Kitchen";
restaurant.location = "Downtown";
restaurant.rating = 4.5;
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5 }

// Static Assignment: Bracket Notation
const CUISINE_KEY = "cuisine";
restaurant[CUISINE_KEY] = "Italian";
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian' }

// Dynamic Key Assignment
const SPECIAL_OFFER_KEY = "specialOffer";
restaurant[SPECIAL_OFFER_KEY] = "10% off";
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian', specialOffer: '10% off' }

// Invalid Dynamic Assignment with Dot Notation
restaurant.SPECIAL_OFFER_KEY = "This won't work";
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian', specialOffer: '10% off', SPECIAL_OFFER_KEY: "This won't work" }

// Using Keys with Spaces or Special Characters
const SPECIAL_CHAR_KEY = "special offer";
restaurant[SPECIAL_CHAR_KEY] = "Free dessert";
console.log(restaurant);
// Output: { name: 'Gourmet Kitchen', location: 'Downtown', rating: 4.5, cuisine: 'Italian', specialOffer: '10% off', SPECIAL_OFFER_KEY: "This won't work", "special offer": "Free dessert" }

// Accessing Values Dynamically
console.log(restaurant[SPECIAL_OFFER_KEY]); // Output: "10% off"
console.log(restaurant["special offer"]); // Output: "Free dessert"

// Final Object Output
console.log(restaurant);
// Output:
// {
//   name: 'Gourmet Kitchen',
//   location: 'Downtown',
//   rating: 4.5,
//   cuisine: 'Italian',
//   specialOffer: '10% off',
//   SPECIAL_OFFER_KEY: "This won't work",
//   "special offer": "Free dessert"
// }
