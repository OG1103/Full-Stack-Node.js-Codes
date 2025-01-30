
// Complex Examples of JavaScript Strings and String Manipulation

// Example 1: Counting Vowels in a String
let text = "JavaScript is amazing!";
let vowels = text.match(/[aeiou]/gi)?.length || 0;
console.log(`Vowel Count:`, vowels);
// Output: Vowel Count: 7

// Example 2: Extracting Domain from Email
let email = "example@gmail.com";
let domain = email.slice(email.indexOf("@") + 1);
console.log("Domain:", domain);
// Output: gmail.com

// Example 3: Capitalizing Words in a Sentence
let sentence = "this is a test sentence.";
let capitalized = sentence
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
console.log("Capitalized:", capitalized);
// Output: This Is A Test Sentence.

// Example 4: Finding the Most Frequent Character
let str = "abbcccddddeee";
let charCounts = {};
for (let char of str) {
    charCounts[char] = (charCounts[char] || 0) + 1;
}
let mostFrequent = Object.entries(charCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
console.log(`Most Frequent Character:`, mostFrequent[0]);
// Output: d

// Example 5: Masking Credit Card Numbers
let creditCard = "1234-5678-9876-5432";
let masked = creditCard.slice(-4).padStart(creditCard.length, "*");
console.log("Masked Credit Card:", masked);
// Output: ************5432

// Example 6: Replacing All Spaces with Underscores
let spacedText = "Replace spaces with underscores.";
let underscored = spacedText.replace(/\s+/g, "_");
console.log("Underscored:", underscored);
// Output: Replace_spaces_with_underscores.

// Example 7: Checking if a String Starts with a Capital Letter
let word = "JavaScript";
console.log(`Starts with Capital?`, /^[A-Z]/.test(word));
// Output: true

// Example 8: Generating Random String of Fixed Length
let randomString = Math.random().toString(36).substring(2, 12);
console.log("Random String:", randomString);
// Output: Random String: (random alphanumeric)
