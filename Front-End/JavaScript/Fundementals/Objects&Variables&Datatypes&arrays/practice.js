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
    // this is accessible since it is still considered an object
    model: "Toyota",
    year: 2018,
    type: "SUV",
  },
  person,
];

console.log(collection);

