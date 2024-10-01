"use strict";
function addAll(...nums) {
    let result = 0;
    nums.map((num) => (result += num));
    return result;
}
console.log(addAll(10, 20));
console.log(addAll(10, 20, 30));
console.log(addAll(10, 20, 30, 100));
console.log(addAll(10, 20, 30, 100, +true));
