const person = {
  name: "omar",
  age: 21,
};

console.log(person);

let car = new Object();
car.model = "nissan";
car.year = 2014;

console.log(car);

let numbers = [1, 2, 3, 4, 5, 6];
console.log(numbers);

let collection = [
  {
    name: "Ali",
    age: 30,
    job: "Software Developer",
  },
  {
    name: "Sara",
    age: 25,
    job: "Graphic Designer",
  },
  {
    model: "Toyota",
    year: 2018,
    type: "SUV",
  },
];
collection.push(person);
console.log(collection);
console.log(collection.length);
console.log(collection.length === 4);
