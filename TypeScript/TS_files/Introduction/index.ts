/*
Typescript is a strongly typed programming language that build on javascript
Typescript is javascript with types
Typescript add features to javascript without changing it
*/

/*
Detect the errors without running the code 'static type checking', Eg:trying to access object property that doesn't exist
let a = {
  key1: 2,
  key2: "",
};
console.log(a.key1);
console.log(a.key5);


Analyze the code as you type
Every JS file is valid TS file

TS compiler compile TS code into JS code "This is called Transpilation"
*/
// boilerplate
/* To begin
    1-install node js //runtime environment for js code outside browser
    2-check if node js is installed  (node -v)
    3-install typescript (npm i -g typescript) (tsc -v)
    4-create ts file
    5-compile to js file (tsc index.ts) (check the js file created)
    6-check example below
*/

/* Introduction
    console.log(Math.floor()) // not valid TS code //expecyed 1 argument but got 0
    console.log(Math.floor(10.5));
*/

/* use watch mode
    use (tsc -w index.ts) to compile file on save (for development)
*/

/* TS configuration file

    [1] write "tsc --init" to generate config file
    [2] check the config file, and change the rootDir (location to read from) option to "./src"
    [3] change the outDir to "./dest"
    [4] also change removeComments to true
    [5] now you can use "tsc -w"
    [6] console.log(Math.floor(10.5));
*/
/* Statically Typed Language

    [1] statically typed language like C++
    [2] variables types are static, once you declare it you cannot change it
    [3] Type of variable is known at compile time
    [4] have better performance at run time (errors detected earlier)
*/

/* Dynamically Typed Language

    [1] variables types are dynamic, you can always change it.
    [2] type checking at execution time.
    [3] error can be detected after execution
*/

/* Valid JS code
    let num=10
    num='test'
    console.log(num)
*/

/* Not Valid TS code
    let num = 10;
    num = 'test;
    console.log(num);
*/

/* Gives error in ts, but works in js and gives error in runtime
    let age=40
    if(age>30){
        console.log('Good')
    }else{
        console.log(age.repeat(3))
    }
*/
// 1st concept
/* Type Annotations || Signature
        [1] indicate the data type of variables
        [2] indicate the data type of functions` input/output
        [3] objects, etc.
*/

/*
    let userName: string = "test";
    let age: number = 30;
    let hire: boolean = true;
    let all:any=100
    let myVariable; //any type
    userName=100;
    all="string"
*/
//-------------------------------------------------------------//
//-------------------------------------------------------------//
/* Valid JS Function
    function add(n1, n2) {
    return n1 + n1;
    }

    console.log(add(10,20))
    console.log(typeof add(10,20))

    console.log(add(10,"20"))
    console.log(typeof add(10,"20"))
*/

/* Error: implicit any type 
    function add(n1, n2) {
    return n1 + n2;
    }

    console.log(add(10,20))
    console.log(typeof add(10,20))

    console.log(add(10,"20"))
    console.log(typeof add(10,"20"))
*/

/*
We set both arguments types to number, Error:Argument of type string not assignable to parameter of type number
    function add(n1:number, n2:number) {
    return n1 + n2;
    }

    console.log(add(10,"20"))
    console.log(typeof add(10,"20"))
*/

/* Fix
    function add(n1:number, n2:number) {
    return n1 + n2;
    }

    console.log(add(10,20))
    console.log(typeof add(10,20))

*/
//-------------------------------------------------------------//
//-------------------------------------------------------------//
/* Type annotations with array

    let all
    all="A"
    all=100
    all=true
*/

/* 

    let all:string | number; 
    all="A"
    all=100
    all=true

*/

/* 

    let all:string | number | boolean; 
    all="A"
    all=100
    all=true

*/

/* Type annotations with array

    let myFriends=['Ahmed',"osama","Mina"] // type => string[], from type inference
*/

/* Type annotations with array

    let myFriends = ["Ahmed", "osama", "Mina", 10]; // type => (string | number)[], from type inference
    myFriends.forEach((elem) => {
    console.log(elem.repeat(3)); // AhmedAhmedAhmed , osamaosamaosama MinaMinaMina
    });
*/

/* Type annotations with array
    let myFriends: string[] = ["Ahmed", "osama", "Mina", 10]; // type => (string)[]
    myFriends.forEach((elem) => {
    console.log(elem.repeat(3));
    });
*/

/* Type annotations with MD-Array
    let arr1:number[]=[1,2,3,4,5]
    let arr2:string[]=["A","B","C"]
    let arr3:(string | number)[]=[1,2,3,4,"A","B","C"]

    let arr4:(string|number|string[])[]=[1,2,3,4,"A","B",["C","D"]]
    let arr5:(string|number|string[]|boolean[])[]=[1,2,3,4,"A","B",["C","D"],[true,false]]
    let arr5:(string|number|string[]|boolean)[]=[1,2,3,4,"A","B",["C","D"],true,false]
*/

/* What if I can't write type of arr4, hover and see

    let arr4=[1,2,3,4,"A","B",["C","D"]]
*/

/* Type annotations with function
    noImplicitAny      // if true shows an error, if false it doesn't
    noImplicitReturns  // if true, Enable error reporting for codepaths that do not explicitly return in a function
    noUnusedLocals     // report errors on unused local variables
    noUnusedParameters // report errors on unused parameters in function

*/
//-------------------------------------------------------------------------//
// Passing 2 arguments instead of 3

// let showMsg = true;
// function showDetails(name, age, salary) {
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is`;
//   }
// }
// console.log(showDetails("Ahmed", 40)); //expected 3, got 2

//-------------------------------------------------------------------------//
// Adding the 3rd argument, then hover on showDetails, it has implicit any type

// let showMsg = true;
// function showDetails(name, age, salary) {
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is`;
//   }
// }
// console.log(showDetails("Ahmed", 40, 5000));
//-------------------------------------------------------------------------//
// Go to tsconfig.json, set noImplicitAny=false, hover again on showDetails

// let showMsg=true
// function showDetails(name,age,salary){
//     if(showMsg){
//     return `Hello ${name} Age is ${age} Salary is`
//     }
// }
// console.log(showDetails("Ahmed",40,5000))
//-------------------------------------------------------------------------//
// This function has only 1 path
// Go to tsconfig.json, set noImplicitReturn=true, hover on showDetails

// let showMsg = true;
// function showDetails(name: string, age: number, salary: number) {
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is`;
//   }
// }
// console.log(showDetails("Ahmed", 40, 5000));
//-------------------------------------------------------------------------//
// In tsconfig.json, set noUnusedLocals =true, to show error when local variables are not used

// let showMsg = true;
// function showDetails(name: string, age: number, salary: number) {
//   let test = 10;
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is`;
//   }
//   return "no data to show";
// }
// console.log(showDetails("Ahmed", 40, 5000));

//-------------------------------------------------------------------------//
// In tsconfig.json, set noUnusedParameters=true, to show error when function parameters are not used

// let showMsg = true;
// function showDetails(name: string, age: number, salary: number) {
//   let test = 10;
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is`;
//   }
//   return "no data to show";
// }

// console.log(showDetails("Ahmed", 40, 5000));
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//Function returns type is string, so number is not assignable to type string

// let showMsg = true;
// function showDetails(name: string, age: number, salary: number): string {
//   let test = 10;
//   if (showMsg) {
//     return `Hello ${name} Age is ${age} Salary is ${salary}`;
//   }
//   return 100;
// }

// console.log(showDetails("Ahmed", 40, 5000));
//-------------------------------------------------------------------------//
//Typescript optional and default parameters
//In JS, every parameter is optional => undefined if you didn't use it
//In Ts, "?" means optional
//-------------------------------------------------------------------------//
//In JS the following code is fine. age and country will be undefined

// function showData(name, age, country) {
//   return `${name}-${age}-${country}`;
// }
// console.log(showData("amr"));

//-------------------------------------------------------------------------//
//In TS it won't work
// function showData(name: string, age: number, country: string) {
//   return `${name}-${age}-${country}`;
// }
// console.log(showData("amr"));
//-------------------------------------------------------------------------//
// All arguments should be passed
// function showData(name: string, age: number, country: string) {
//   return `${name}-${age}-${country}`;
// }
// console.log(showData("amr", 40, "EG"));
//-------------------------------------------------------------------------//
//Setting default values for arguments
// function showData(name: string = "Ahmed", age: number = 0, country: string = "EG") {
//   return `${name}-${age}-${country}`;
// }

// console.log(showData("Fady", 40, undefined));
// console.log(showData("Fady", 40));

// console.log(showData("Mohamed", 40, "Saudi"));
// console.log(showData(undefined, 40, "Saudi"));
//-------------------------------------------------------------------------//
//Optional parameters
// function showData(name: string = "un", age: number, country?: string = "test") {
//   return `${name}-${age}-${country}`;
// }
// console.log(showData(undefined, 40, "Egypt"));
// console.log(showData("ahmed", 40));
//-------------------------------------------------------------------------//
//Required parameter cannot follow optional parameter
// function showData(name?: string, age: number, country: string) {
//   return `${name}-${age}-${country}`;
// }
// console.log(showData("ahmed", 40, "EG"));
//-------------------------------------------------------------------------//
//Function rest parameter
//rest parameter collect arguments and put it in array
// function addAll(...nums: number[]):number {
//   let result = 0;
//   //   for (let i = 0; i < nums.length; i++) {
//   //     result += nums[i];
//   //   }
//   nums.map((num) => (result += num));
//   return result;
// }
// console.log(addAll(10, 20));
// console.log(addAll(10, 20, 30));
// console.log(addAll(10, 20, 30, 100));
// // console.log(addAll(10, 20, 30, 100, true));
// console.log(addAll(10, 20, 30, 100, +true));
//-------------------------------------------------------------------------//
//Anonymous & Arrow functions
// const add = function (num1: number, num2: number): number {
//   return num1 + num2;
// };
// console.log(add(10, 20));

// const addWithArrow = (num1: number, num2: number): number => num1 + num2;
// console.log(addWithArrow(10, 20));
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//Type Alias
/*
    type st = string;
    let theName: st = "test";
    theName = "test2";
    theName = 2;
*/

/*
    type standnum = string | number;
    let all: standnum = 10;
    all = "test";
    all = true;
*/

/*
    type Buttons = {
    up: string;
    right: string;
    left: string;
    down: string;
    };

    function getActions(btns: Buttons) {
    console.log(`Action for button up is ${btns.up}`);
    console.log(`Action for button right is ${btns.right}`);
    console.log(`Action for button left is ${btns.left}`);
    console.log(`Action for button down is ${btns.down}`);
    }

    getActions({ up: "jump", right: "go right", left: "go left", down: "down" });
*/

/*
    type Buttons = {
    up: string;
    right: string;
    left: string;
    down: string;
    };

    type Last = Buttons & {
    x: boolean;
    };


    function getActions(btns: Last) {
        console.log(`Action for button up is ${btns.up}`);
        console.log(`Action for button right is ${btns.right}`);
        console.log(`Action for button left is ${btns.left}`);
        console.log(`Action for button down is ${btns.down}`);
    }

    getActions({ up: "jump", right: "go right", left: "go left", down: "down",x:true });
*/
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//-------------------------------------------------------------------------//
//Literal types, hover on the function to see return type
// function compare(n1: number, n2: number) {
//   if (n1 === n2) {
//     return 0;
//   } else if (n1 > n2) {
//     return 1;
//   } else {
//     return -1;
//   }
// }
// console.log(compare(20, 20)); //0
// console.log(compare(20, 15)); //1
// console.log(compare(20, 30)); //-1
//-------------------------------------------------------------------------//
// function compare(n1: number, n2: number): 0 | 1 | -1 {
//   if (n1 === n2) {
//     return 0;
//   } else if (n1 > n2) {
//     return 1;
//   } else {
//     return -1;
//   }
// }
// console.log(compare(20, 20)); //0
// console.log(compare(20, 15)); //1
// console.log(compare(20, 30)); //-1
//-------------------------------------------------------------------------//
// Define new data type, and use it
// type nums = 0 | 1 | -1;
// function compare(n1: number, n2: number): nums {
//   if (n1 === n2) {
//     return 0;
//   } else if (n1 > n2) {
//     return 1;
//   } else {
//     return -1;
//   }
// }
// console.log(compare(20, 20)); //0
// console.log(compare(20, 15)); //1
// console.log(compare(20, 30)); //-1

// let myNum1: nums = 100; //type 100 is not assignable to type nums
// let myNum2: nums = 1;
//-------------------------------------------------------------------------//
/* Data type => tuple
    [1] is another sort of array type
    [2] we know exactly how many elements it contains
    [3] we know which types it contains at specific positions
*/

// let article: [number, string, boolean] = [11, "test", true]; //is tuple
// let article2: (string | number | boolean)[] = ["test", 11, true]; //is array
// let article3: [number, string, boolean] = [11, "test", true, 100]; //wrong
// let article4: [number, string, boolean] = ["11", "test", true, 100]; //wrong
// article[0].toFixed();
// article[1].endsWith("st");
// article = [12, "anything", false];
// article.push(100); //we still can push to array
// console.log(article);
//-------------------------------------------------------------------------//
//use readonly to disable modification
// let article: readonly [number, string, boolean] = [11, "test", true];
// article.push(100);
// console.log(article);
//-------------------------------------------------------------------------//
//destructuring
// const [id, title, published] = article;
//-------------------------------------------------------------------------//
//Data Types (Void)
//  Function that will return nothing
//  Function in JS that not return a value will show undefined
//  Undefined is not void
//---------------------------------EX1-------------------------------------//
// return type is string, use tsc, node dest/index.js to run the same function in js
// function showMsg(msg: string) {
//   console.log(msg);
//   return msg;
// }

// console.log(showMsg("test"));
//---------------------------------EX2-------------------------------------//
//hover to see the return type = void, use tsc, node dest/index.js, to run the same function in js
// function showMsg(msg: string) {
//   console.log(msg);
// }

// console.log(showMsg("test"));
//---------------------------------EX3-------------------------------------//
// return type is set to void, an error appears at "return msg" (type string not assignable to type void)
// function showMsg(msg: string): void {
//   console.log(msg);
//   return msg
// }

// console.log(showMsg("test"));
//---------------------------------EX4-------------------------------------//
// return type is explicity set to void, the return statement returns nothing, the function still returns
// function showMsg(msg: string): void {
//   console.log(msg);
//   return;
// }
// console.log(showMsg("test"));
// console.log("another command here");
//-------------------------------------------------------------------------//
//  Data Type (never)
//  Function doesn't have normal completion
//  The function never finishes running at all like (loops)
//---------------------------------EX1-------------------------------------//
// The logging function always logs, so the return statement is unreachable
// you can allowUnreachableCode in tsconfig.json
// function alwaysLog(msg: string) {
//   while (true) {
//     console.log(msg);
//   }
//   return; //mlhash lazma
// }
// alwaysLog("test");
//---------------------------------EX2-------------------------------------//
// Set return type explicitly to never, this will mark the next statement after function call as unreachable
// function alwaysLog(msg: string): never {
//   while (true) {
//     console.log(msg);
//   }
//   return;
// }
// alwaysLog("test"); //run for infinity
// console.log("another command here");
//=========================================================================//
//=========================================================================//
//=========================================================================//

//Data Type (Enums)
//  Allow us to declare set of named constants
//  Used for logical grouping collection of constants "collection of related values"
//  It organize your code
//  By default, enums are number-based, first element is 0
//  There is numeric enums
//  There is string-based enums
//  There is heterogenous enums [string + number]
//---------------------------------EX1-------------------------------------//
//imagine the difficulty level of typing speed test measured seconds
// enum levels {
//   kids = 15,
//   easy = 9,
//   medium = 6,
//   hard = 3,
//   insane = "insane",
// }

// let lvl: string = "Easy";
// if (lvl === "Easy") {
//   console.log(`The level is ${lvl} and number of seconds is ${levels.easy}`);
// }
// levels.kids=5  //cannot be modified once declared
//------------------------------------------------------------------------//
//Enum can refer to another Enum
//Enum can refer to same Enum
//Enum can have calculations
//Enum can have functions
//---------------------------------EX2-------------------------------------//
// enum kids {
//   five = 25,
//   seven = 20,
//   ten = 15,
// }

// enum levels {
//   kid = kids.ten, //referring to another enum
//   easy = 9,
//   medium = easy - 3, // enum can have calculations
//   hard = levels.easy - 6, //enum can refer to same Enum
//   insane = (function (): number {
//     return 1;
//   })(), //enum can have functions
// }

// // let lvl: string = "Hard";
// // if (lvl === "Hard") {
// //   console.log(`The level is ${lvl} and number of seconds is ${levels.hard}`);
// // }

// let lvl: string = "Insane";
// if (lvl === "Insane") {
//   console.log(`The level is ${lvl} and number of seconds is ${levels.insane}`);
// }
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Type Assertions
//  Sometimes the compiler doesn't know the information we have
//---------------------------------EX1-------------------------------------//
// let myImg= document.getElementById('my-img')
// console.log(myImg.src)

// let myImg = document.getElementById("my-img") as HTMLImageElement;
// console.log(myImg.src);

// let myImg = document.getElementById("my-img") as HTMLImageElement;
// console.log(myImg.value);

// let myInput = document.getElementById("my-input") as HTMLInputElement;
// console.log(myInput.value);

// let myInput = document.getElementById("my-input") as HTMLInputElement;
// console.log(myInput.href);

//HTMLImageElement is a ready made interface  ===  ready made type
//recall type alias, where we can define custom type.
//unlike type alias, interfaces are more flexible to deal with.
//they both can make what you really need
//have a look on the HTMLImageElement, HTMLInputElement interface and see that it extends HTMLElement Interface

// let myImg = <HTMLImageElement>document.getElementById("my-img");
// console.log(myImg.src);

//---------------------------------EX2-------------------------------------//
//Typescript is not performing any check to make sure type assertion is valid
// let data: any = "1000";
// console.log((data as string).repeat(3));

// let data1: any = 1000;
// console.log((data1 as string).repeat(3));
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Union & Intersection Types
//---------------------------------EX1-------------------------------------//
// let all: number | string = "test";
//---------------------------------EX2-------------------------------------//
// let all: number | string = true;
//---------------------------------EX3-------------------------------------//
// type A = {
//   one: String;
//   two: number;
//   three: boolean;
// };

// function getActions(btns: A) {
//   console.log(`Hello ${btns.one}`);
//   console.log(`Hello ${btns.two}`);
//   console.log(`Hello ${btns.three}`);
// }

// getActions({ one: "test", two: 1, three: true });
//---------------------------------EX4-------------------------------------//
// type A = {
//   one: String;
//   two: number;
//   three: boolean;
// };

// type B = A & {
//   four: number;
// };

// function getActions(btns: B) {
//   console.log(`Hello ${btns.one}`);
//   console.log(`Hello ${btns.two}`);
//   console.log(`Hello ${btns.three}`);
//   console.log(`Hello ${btns.four}`);
// }

// getActions({ one: "test", two: 1, three: true, four: 100 });
//---------------------------------EX5-------------------------------------//
// type A = {
//   one: String;
//   two: number;
//   three: boolean;
// };

// type B = A & {
//   four: number;
// };

// type C = {
//   five: boolean;
// };

// type mix = A & C;
// function getActions(btns: mix) {
//   console.log(`Hello ${btns.one}`);
//   console.log(`Hello ${btns.two}`);
//   console.log(`Hello ${btns.three}`);
//   console.log(`Hello ${btns.four}`); //four doesn't exist on type mix
//   console.log(`Hello ${btns.five}`);
// }

// getActions({ one: "test", two: 1, three: true, four: 100, five: false }); //four doesn't exist on type mix
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Type Annotations with objects
//---------------------------------EX1-------------------------------------//
// let user: { name: string; id: number; hire: boolean } = { name: "ahmed", id: 1, hire: true };

// user.name = "new name";
// user.id = 2;
// user.hire = false;

// console.log(user.name);
// console.log(user.id);
// console.log(user.hire);
//---------------------------------EX2-------------------------------------//
//nesting an object
// let user: { name: string; id: number; hire: boolean; skills: { one: string; two: string } } = {
//   name: "ahmed",
//   id: 1,
//   hire: true,
//   skills: { one: "html", two: "css" },
// };

// user.name = "new name";
// user.id = 2;
// user.hire = false;

// console.log(user.name);
// console.log(user.id);
// console.log(user.hire);
//---------------------------------EX3-------------------------------------//
//Adding readonly before name
// let user: {
//   readonly name: string;
//   id: number;
//   hire: boolean;
//   skills: {
//     one: string;
//     two: string;
//   };
// } = {
//   name: "ahmed",
//   id: 1,
//   hire: true,
//   skills: {
//     one: "html",
//     two: "css",
//   },
// };

// user.name = "new name";
// user.id = 2;
// user.hire = false;

// console.log(user.name);
// console.log(user.id);
// console.log(user.hire);
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Interfaces
//  Serve like types
//  The interface describe the shape of an object
//  It defines the syntax to follow
//  Use with objects
//  Use with functions
//  Use readonly and optional operator
//---------------------------------EX1-------------------------------------//
// interface User {
//   id: number;
//   name: String;
//   country: string;
// }

// let user: User = {
//   id: 1,
//   name: "amr",
//   country: "Eg",
// };
// console.log(user);
//---------------------------------EX2-------------------------------------//
// interface User {
//   id: number;
//   name: String;
//   country: string;
// }

// function getData(data: User) {
//   console.log(`id is ${data.id}`);
//   console.log(`number is ${data.name}`);
//   console.log(`country is ${data.country}`);
// }

// getData({ id: 1, name: "my name", country: "Sweden" });
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Interface Methods

// interface User {
//   id: number;
//   name: String;
//   country: string;
//   sayHello(): string; // a method that returns a string
//   getDouble(num: number): number; // a method that return double of a number
//   sayWelcome: () => string; //a method that returns string, defined by arrow syntax
// }

// let user: User = {
//   id: 1000,
//   name: "test",
//   country: "eg",
//   sayHello() {
//     return `Hello ${this.name}`;
//   },
//   getDouble(n) {
//     return n * 2;
//   },
//   sayWelcome: () => {
//     return `Hello ${user.name}`;
//   },
// };
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Interface Reopen is applicable only on interfaces not types
//It cannot be applied to types, if type is declared once, it cannot be opened and edited (it will give error duplicate identifier)
//inside homepage
// interface Settings {
//   theme: boolean;
//   font: string;
// }

// //articles page
// interface Settings {
//   sidebar: boolean;
// }

// let userSettings: Settings = {
//   theme: true,
//   font: "open sans",
//   sidebar: true,
// };
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Extending Interfaces
//---------------------------------EX1-------------------------------------//
// interface User {
//   id: number;
//   username: string;
//   country: string;
// }

// interface moderator {
//   id: number;
//   username: string;
//   country: string;
//   role: string | number;
// }

// let user1: User = {
//   id: 100,
//   username: "Amr",
//   country: "Egypt",
// };
// let user2: moderator = {
//   id: 101,
//   username: "Omar",
//   country: "Egypt",
//   role: 2,
// };
// console.log(user1.id);
// console.log(user2.id);
//---------------------------------EX2-------------------------------------//
// interface User {
//   id: number;
//   username: string;
//   country: string;
// }

// interface moderator extends User {
//   role: string | number;
// }

// let user1: User = {
//   id: 100,
//   username: "Amr",
//   country: "Egypt",
// };
// let user2: moderator = {
//   id: 101,
//   username: "Omar",
//   country: "Egypt",
//   role: 2,
// };
// console.log(user1.id);
// console.log(user2.id);
//---------------------------------EX3-------------------------------------//
// interface User {
//   id: number;
//   username: string;
//   country: string;
// }

// interface Moderator extends User {
//   role: string | number;
// }

// interface Admin extends User, Moderator {
//   protect: boolean;
// }
// let user1: User = {
//   id: 100,
//   username: "Amr",
//   country: "Egypt",
// };
// let user2: Moderator = {
//   id: 101,
//   username: "Omar",
//   country: "Egypt",
//   role: 2,
// };
// let user3: Admin = {
//   id: 102,
//   username: "Omar",
//   country: "Egypt",
//   role: 2,
//   protect: false,
// };
// console.log(user1.id);
// console.log(user2.id);
// console.log(user3.protect);
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Class type annotation
// class User {
//   constructor(username, salary) {
//     this.u = username;
//     this.salary = salary;
//     this.msg = function () {
//       return `Hello ${this.u} your salary is ${this.salary}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.u} your salary is ${this.salary}`;
//   }
// }
// let user = new User("Test", 5000);
//---------------------------------------------------------------------------//
//solving above errors
// class User {
//   u: String;
//   s: number;
//   msg: () => string;

//   constructor(username: string, salary: number) {
//     this.u = username;
//     this.s = salary;
//     this.msg = function () {
//       return `Hello ${this.u} your salary is ${this.s}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.u} your salary is ${this.s}`;
//   }
// }
// let user = new User("Test", 5000);
// console.log(user.u);
// console.log(user.s);
// console.log(user.msg());
// console.log(user.sayHello());
//---------------------------------------------------------------------------//
//class access modifiers
//  public
//      All members of a class in typescript are public
//      All public members can be accessed anywhere without restrictions
//  private
//      Members are visible only to that class and are not accessible outside that class
//  protected
//      same like private but can be accessed using the derived class
//---------------------------------EX1-------------------------------------//
// class User {
//   private username: String;
//   protected salary: number;
//   msg: () => string;

//   constructor(username: string, salary: number) {
//     this.username = username;
//     this.salary = salary;
//     this.msg = function () {
//       return `Hello ${this.username} your salary is ${this.salary}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.username} your salary is ${this.salary}`;
//   }
// }
// let user = new User("Test", 5000);
// // console.log(user.u); //cannot be accessed
// // console.log(user.s); //cannot be accessed
// console.log(user.msg());
// console.log(user.sayHello());

//Note:If you take a look at the js file, you can see that private and protected are not supported by ES6
//------------------------------------------------------------------------//
//In ES2020, private properties were supported, recall
// class Foo {
//   #x; // declare a private field
//   constructor() {
//       this.#x = 42;
//       this.y = 100;
//   }
//   publicMethod() {
//       return this.#x - this.y;
//   }
// }

// let a = new Foo();
// a.y; // => 100
// a.publicMethod(); // => -58
// a.#x; // => 💥 SyntaxError: Private field '#x' must be declared in an enclosing class
//------------------------------------------------------------------------//
//We can write the above class definition in the following way in TS
// class User {
//   msg: () => string;

//   constructor(private username: string, protected salary: number) {
//     this.msg = function () {
//       return `Hello ${this.username} your salary is ${this.salary}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.username} your salary is ${this.salary}`;
//   }
// }
// let user = new User("Test", 5000);
// // console.log(user.username); //cannot be accessed
// // console.log(user.salary); //cannot be accessed
// console.log(user.msg());
// console.log(user.sayHello());
//------------------------------------------------------------------------//
// Adding new property to constructor function
// class User {
//   msg: () => string;
//   constructor(
//     private username: string,
//     protected salary: number,
//     public readonly address: string
//   ) {
//     this.msg = function () {
//       return `Hello ${this.username} your salary is ${this.salary}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.username} your salary is ${this.salary}`;
//   }
// }
// let user = new User("Test", 5000, "Shehab street");
// // console.log(user.username); //cannot be accessed
// // console.log(user.salary); //cannot be accessed
// console.log(user.msg());
// console.log(user.sayHello());
// user.address = "a";
//------------------------------------------------------------------------//
//Class Accessors
// private and protected properties are not accessible from global, so use accessors
// class User {
//   msg: () => string;
//   constructor(private username: string, protected salary: number, public readonly address: string) {
//     this.msg = function () {
//       return `Hello ${this.username} your salary is ${this.salary}`;
//     };
//   }
//   sayHello() {
//     return `Hello ${this.username} your salary is ${this.salary}`;
//   }

//   get name(): string {
//     return this.username;
//   }

//   set name(value: string) {
//     this.username = value;
//   }
// }
// let user = new User("Test", 5000, "Shehab street");
// // console.log(user.username) //cannot be accessed or set, because it's private
// //console.log(user.salary) //cannot be accessed or set, because it's protected
// console.log(user.name);
// user.name = "another name";
// console.log(user.name);

// class Admin extends User {
//   constructor(username: string, salary: number, address: string, public readonly role: string) {
//     super(username, salary, address);
//   }

//   //define public setter
//   set Salary(newValue: number) {
//     this.salary = newValue; //unlike private properties, protected property can be accessed from derived class
//     // console.log(user.username); //wrong: accessing private property inside derived class
//     // console.log(user.name); // right: accessing private property through getter defined in base class
//   }
//   //define public getter
//   get Salary(): number {
//     return this.salary; //protected property accessed from derived class
//   }
// }

// let admin = new Admin("Test", 5000, "Shehab street", "Admin");
// console.log(admin.Salary);
// admin.Salary = 8000;
// console.log(admin.Salary);
// console.log(admin.role);
//------------------------------------------------------------------------//
//Class Static Members
// class User {
//   static created: number = 0;
//   static getCount(): void {
//     console.log(`${this.created} Objects created`);
//   }
//   constructor(public username: String) {
//     User.created++;
//   }
// }

// let u1 = new User("ahmed");
// let u2 = new User("moh");
// let u3 = new User("samy");
// User.getCount();
// // modifying the created directly, and printing it directly
// User.created = 5;
// console.log(User.created);
//------------------------------------------------------------------------//
//Class Private Static Members, adding private before created field
// class User {
//   private static created: number = 0;
//   static getCount(): void {
//     console.log(`${this.created} Objects created`);
//   }
//   constructor(public username: String) {
//     User.created++;
//   }
// }

// let u1 = new User("ahmed");
// let u2 = new User("moh");
// let u3 = new User("samy");
// User.getCount();
// // modifying the created directly, and printing it directly
// User.created = 5;
// console.log(User.created);
//------------------------------------------------------------------------//
//Class Implements Interface
//-------------------------------EX1---------------------------------------//
// interface Settings {
//   theme: boolean;
//   font: string;
//   save(): void;
// }

// class User implements Settings{
//     constructor(public theme:boolean){

//     }
// }
//-------------------------------EX2---------------------------------------//
// interface Settings {
//   theme: boolean;
//   font?: string;
//   save(): void;
// }

// class User implements Settings {
//   constructor(public theme: boolean) {}
// }
//-------------------------------EX3---------------------------------------//
// interface Settings {
//   theme: boolean;
//   font?: string;
//   save(): void;
// }

// class User implements Settings {
//   constructor(public theme: boolean) {}
//   save(): void {
//     console.log("saved");
//   }
// }
//-------------------------------EX4---------------------------------------//
// interface Settings {
//   theme: boolean;
//   font?: string;
//   save(): void;
// }

// class User implements Settings {
//   constructor(public username: string, public theme: boolean) {}
//   save(): void {
//     console.log("saved");
//   }
//   update(): void {
//     console.log("updated");
//   }
// }

// let user1 = new User("Ahmed", true);
//-------------------------------EX5---------------------------------------//
// interface Settings {
//   theme: boolean;
//   font: string;
//   save(): void;
// }

// class User implements Settings {
//   constructor(public username: string, public theme: boolean, public font: string) {}
//   save(): void {
//     console.log("saved");
//   }
//   update(): void {
//     console.log("updated");
//   }
// }

// let user1 = new User("Ahmed", true, "open sans");
// console.log(user1.username);
// console.log(user1.font);
// console.log(user1.theme);
// user1.save();
// user1.update();
//----------------------------------------------------------------------------//
//Abstract Class
//  We cannot create an instance of abstract class
//  All abstract methods must be implemented in derived class
//---------------------------------EX1-----------------------------------------//
// abstract class Food {
//   constructor(public title: string) {}
//   abstract getCookingTime(): void;
// }
// class Pizza extends Food {}
//---------------------------------EX2-----------------------------------------//
// abstract class Food {
//   constructor(public title: string, public price: number) {}
//   abstract getCookingTime(): void;
// }

// class Pizza extends Food {
//   constructor(title: string, price: number) {
//     super(title, price);
//   }
//   getCookingTime(): void {
//     console.log(`cooking time is 1H`);
//   }
// }

// class Burger extends Food {
//   constructor(public title: string, price: number) {
//     super(title, price);
//   }
//   getCookingTime(): void {
//     console.log(`cooking time is 2H`);
//   }
// }

// let pizza1 = new Pizza("Awesome pizza", 100);
// console.log(pizza1.title);
// console.log(pizza1.price);
// pizza1.getCookingTime();
//----------------------------------------------------------------------------//
//Polymorphism & method override
//  Classes have the same methods but different implementations
//  Allowing the child class to provide implementation of a method in parent class
//  A method in the child class must have same name as parent class
//---------------------------------EX1-----------------------------------------//
// class Player {
//   constructor(public name: string) {}
//   attack(): void {
//     console.log("Attacking now");
//   }
// }

// class European extends Player {
//   constructor(name: string, public spears: number) {
//     super(name);
//   }
//   attack(): void {
//     super.attack();
//     console.log("Attacking with spear");
//     this.spears -= 1;
//   }
// }

// class Chinese extends Player {
//   constructor(name: string, public axeDurbability: number) {
//     super(name);
//   }
//   attack(): void {
//     super.attack();
//     console.log("Attacking with spear");
//     this.axeDurbability -= 1;
//   }
// }

// let player1 = new European("Sam", 250);
// console.log(player1.name);
// console.log(player1.spears);
// player1.attack();
// console.log(player1.spears);

// let player2 = new Chinese("Sam", 100);
// console.log(player2.name);
// console.log(player2.axeDurbability);
// player2.attack();
// console.log(player2.axeDurbability);
//=========================================================================//
//=========================================================================//
//=========================================================================//
//Generics
//  Help write a reusable code
//  Allow to pass type as a parameter to function
//  You will be able to deal with multiple types without using "any" type
//  we can create:
//      [1] Generic functions
//      [2] Generic classes-Generic Methods
//      [3] Generic Interfaces
//-----------------------------------------------------------------------//
// function returnNumber(val: number): number {
//   return val;
// }

// function returnString(val: string): string {
//   return val;
// }

// function returnBoolean(val: boolean): boolean {
//   return val;
// }

// console.log(returnNumber(100));
// console.log(returnString("Test"));
// console.log(returnBoolean(false));
//-----------------------------------------------------------------------//
// function returnWithAny(val: any): any {
//   return val;
// }

// console.log(returnWithAny(100));
// console.log(returnWithAny("Test"));
// console.log(returnWithAny(false));
// console.log(returnWithAny([1, 2, 3, 4]));
//-----------------------------------------------------------------------//
//what if we can build generic function, and let TS detect the type and pass the type as parameter, it's more dynamic
// function returnType<GenericType>(val: GenericType): GenericType {
//   return val;
// }

// console.log(returnType<number>(100));
// console.log(returnType<string>("Test"));
// console.log(returnType<boolean>(false));
// console.log(returnType<number[]>([1, 2, 3, 4]));
//-----------------------------------------------------------------------//
// const returnTypeWithArrowSyntax = <T>(val: T): T => val;
// returnTypeWithArrowSyntax<number>(100);
// returnTypeWithArrowSyntax<string>("Test");
//-----------------------------------------------------------------------//
//Check the error below
// function returnWithAny<T>(val: T): T {
//   return `The value is ${val} and of type ${typeof val}`;
// }

// console.log(returnWithAny(100));
//-----------------------------------------------------------------------//
//Fix
// function returnWithAny<T>(val: T): string {
//   return `The value is ${val} and of type ${typeof val}`;
// }

// console.log(returnWithAny(100));
//-----------------------------------------------------------------------//
// function multipleTypes<T, S>(val1: T, val2: S): string {
//   return `The first value is ${val1} with type ${typeof val1}, and second value is ${val2} with type ${typeof val2}`;
// }

// console.log(multipleTypes<string, number>("Test", 100));
// console.log(multipleTypes<string, boolean>("Test", true));
//-----------------------------------------------------------------------//
//Generic classes
// We have a problem here
// class User {
//   constructor(public value: string) {}
//   show(msg: string): void {
//     console.log(`${msg}-${this.value}`);
//   }
// }
// let user1 = new User("Test user");
// console.log(user1.value);
// user1.show("Message");

// let user2 = new User(100);
// console.log(user2.value);
// user2.show("Message");
//-----------------------------------------------------------------------//
// Fix
// class User<T> {
//   constructor(public value: T) {}
//   show(msg: T): void {
//     console.log(`${msg}-${this.value}`);
//   }
// }

// let user1 = new User("Test user");
// user1.show("Message");

// let user2 = new User(1000);
// user2.show(1000);
//-----------------------------------------------------------------------//
//type T can have default value
// class User<T = string> {
//   constructor(public value: T) {}
//   show(msg: T): void {
//     console.log(`${msg}-${this.value}`);
//   }
// }

// let user1 = new User(100);
//-----------------------------------------------------------------------//
//type T can have default value
//now user2 has a problem
// class User<T = string> {
//   constructor(public value: T) {}
//   show(msg: T): void {
//     console.log(`${msg}-${this.value}`);
//   }
// }

// let user2 = new User(100);
// user2.show("string");
//-----------------------------------------------------------------------//
//type T can have default value
//now user2 has a problem
// class User<T = string> {
//   constructor(public value: T) {}
//   show(msg: T): void {
//     console.log(`${msg}-${this.value}`);
//   }
// }

// let user2 = new User<string | number>(100);
// user2.show("string");
//-----------------------------------------------------------------------//
//Generics with interfaces
// interface Book {
//   itemType: string;
//   title: string;
//   isbn: number;
// }

// interface Game {
//   itemType: string;
//   title: string;
//   style: string;
//   price: number;
// }

// class Collection<T> {
//   public data: T[] = [];
//   add(item: T): void {
//     this.data.push(item);
//   }
// }

// let booksCollection = new Collection<Book>();
// booksCollection.add({ itemType: "book", title: "1st book", isbn: 100536 });
// booksCollection.add({ itemType: "book", title: "2nd book", isbn: 650650 });
// console.log(booksCollection.data);

// let gamesCollection = new Collection<Game>();
// gamesCollection.add({ itemType: "game", title: "1st game", style: "action", price: 100 });
// gamesCollection.add({ itemType: "game", title: "2nd game", style: "horror", price: 200 });
// console.log(gamesCollection.data);
