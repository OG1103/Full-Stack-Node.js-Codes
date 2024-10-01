//Passing Rest Parameter to a function.

//rest parameter collect arguments and put it in array
// so i have to declare the type as an array of a certain data type
function addAll(...nums: number[]): number {
  let result = 0;
  //   for (let i = 0; i < nums.length; i++) {
  //     result += nums[i];
  //   }
  nums.map((num) => (result += num));
  return result;
}
console.log(addAll(10, 20));
console.log(addAll(10, 20, 30));
console.log(addAll(10, 20, 30, 100));
// console.log(addAll(10, 20, 30, 100, true));
console.log(addAll(10, 20, 30, 100, +true));
