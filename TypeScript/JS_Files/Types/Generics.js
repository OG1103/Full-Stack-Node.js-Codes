"use strict";
function identity(arg) {
    return arg;
}
let num = identity(10);
let str = identity("Hello");
let arr = identity([1, 2, 3]);
console.log(num);
console.log(str);
console.log(arr);
const getFirstElement = (arr) => {
    return arr[0];
};
let firstNum = getFirstElement([10, 20, 30]);
let firstStr = getFirstElement(["apple", "banana", "cherry"]);
console.log(firstNum);
console.log(firstStr);
let numberBox = { content: 100 };
let stringBox = { content: "A box of chocolates" };
console.log(numberBox.content);
console.log(stringBox.content);
class Container {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        this.value = newValue;
    }
}
let numberContainer = new Container(123);
let stringContainer = new Container("Hello, World!");
console.log(numberContainer.getValue());
console.log(stringContainer.getValue());
numberContainer.setValue(456);
console.log(numberContainer.getValue());
function logLength(item) {
    console.log(item.length);
}
logLength("Hello!");
logLength([1, 2, 3, 4]);
function pair(first, second) {
    return [first, second];
}
let mixedPair = pair(1, "One");
console.log(mixedPair);
function createList() {
    return [];
}
let defaultList = createList();
defaultList.push("apple", "banana");
console.log(defaultList);
let numberList = createList();
numberList.push(1, 2, 3);
console.log(numberList);
