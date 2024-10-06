"use strict";
let name1 = "Alice";
let age = 25;
let isStudent = true;
let scores = [90, 85, 88];
let arr1 = [1, 2, 3, "A"];
let arr2 = [1, 2, 3, 4, "a", ["ss", "ss1"], [true, false]];
let person = ["Alice", 25];
let employees = [
    ["Alice", 101],
    ["Bob", 102],
    ["Charlie", 103],
];
console.log(employees[0]);
console.log(employees[1][0]);
let varMix = 2;
varMix = "Omar";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
let move = Direction.Up;
let randomValue = "Hello";
randomValue = 10;
function logMessage() {
    console.log("Logging a message");
}
const arrowfunc = () => {
    console.log("test");
};
let emptyValue = null;
let uninitializedValue = undefined;
