
// Complex Examples of JavaScript Math Functions

// Example 1: Random number generation
let min = 5;
let max = 15;
let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(`Random number between ${min} and ${max}:`, randomNumber);

// Example 2: Calculating the area of a circle using Math.PI
let radius = 7;
let area = Math.PI * Math.pow(radius, 2);
console.log(`Area of a circle with radius ${radius}:`, area);

// Example 3: Hypotenuse calculation using Math.sqrt and Math.pow
let a = 3;
let b = 4;
let hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
console.log(`Hypotenuse of a triangle with sides ${a} and ${b}:`, hypotenuse);

// Example 4: Converting degrees to radians and calculating sine
let degrees = 30;
let radians = (degrees * Math.PI) / 180;
console.log(`Sine of ${degrees} degrees:`, Math.sin(radians));

// Example 5: Rounding numbers
let number = 4.567;
console.log("Original number:", number);
console.log("Rounded (Math.round):", Math.round(number));
console.log("Rounded up (Math.ceil):", Math.ceil(number));
console.log("Rounded down (Math.floor):", Math.floor(number));

// Example 6: Natural logarithm and exponentiation
let num = 10;
console.log(`Natural logarithm of ${num}:`, Math.log(num));
console.log(`Exponent of ${num}:`, Math.exp(1) ** Math.log(num));

// Example 7: Finding the maximum and minimum in an array
let numbers = [15, 42, 7, 23, 99, 3];
console.log("Maximum value:", Math.max(...numbers));
console.log("Minimum value:", Math.min(...numbers));

// Example 8: Generating random RGB colors
let randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
console.log("Random RGB Color:", randomColor);

// Example 9: Using Math.sign to check if a number is positive, negative, or zero
let testNumber = -25;
console.log(`Sign of ${testNumber}:`, Math.sign(testNumber));
