"use strict";
function addNumbers(a, b) {
    return a + b;
}
function printMessage(message) {
    console.log(message);
}
const multiplyNumbers = (a, b) => {
    return a * b;
};
const printMessageArrow = (message) => {
    console.log(message);
};
function greetings(firstName, lastName) {
    if (lastName) {
        return `Hello, ${firstName} ${lastName}!`;
    }
    else {
        return `Hello, ${firstName}!`;
    }
}
let fullNameGreeting = greetings("John", "Doe");
console.log(fullNameGreeting);
let firstNameGreeting = greetings("Alice");
console.log(firstNameGreeting);
