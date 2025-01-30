// SYNCHRONOUS CODE EXAMPLE
console.log("Start");

function greet() {
    return "Hello!";
}

const message = greet(); // This task must complete before the next one can run
console.log(message);    // Output: "Hello!"

console.log("End");

//In this example, each line runs one after the other. The greet() function completes before console.log("End") executes.

//ASYNCHRONOUS CODE EXAMPLE
console.log("Start");

setTimeout(() => {
    console.log("Hello after 2 seconds");
}, 2000); // This asynchronous task is scheduled but doesn't block other code.

console.log("End");
/** Output
Start
End
Hello after 2 seconds
 */
//In this example, the setTimeout function starts a timer for 2 seconds but doesn't block the execution of the next line (console.log("End"))
// After 2 seconds, the callback inside setTimeout is executed, printing "Hello after 2 seconds".

