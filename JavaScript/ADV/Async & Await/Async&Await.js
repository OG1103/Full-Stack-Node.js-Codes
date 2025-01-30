//Function that returns a promise with promise syntax;
const makeRequestPromise = (location) => {
  const promise = new promise((resolve, reject) => {
    console.log("making request");
    if (location === "google") {
      resolve("connection established to google");
    } else {
      reject("can only connect to google");
    }
  });
  return promise;
};

// Calling/handling the promise in normal syntax (.then()&.catch());
makeRequestPromise("google")
  .then((response) => {
    console.log("response recieved");
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });

//-----------------------------------------------------------------------------------------------------
//Using async and await to handle/call a promise
// await : stps execution of current function as it wants for a function returning a promise to reolve/reject
const callmakeRequest = async (location) => {
  try {
    //pause execution of current function while continuing to execute whatever else is running in the background
    // wait for the promise to resolve
    // store the resolved value in the variable response
    //if the promise is rejected it immediatly goes to the catch block passing by the rejected value
    const response = await makeRequestPromise(location);
    console.log("response recieved", response); //" "response recieved" connection established to google"
    return response;
  } catch (error) {
    //error value in the catch block will be "can only connect to google" as thats the reject value of the promise
    throw error; // Propagate the error to the calling function (run)
  }
};

// Note that async functions it self returns a promise, So if i wanna call an async function and wait for it i can put await before it.
//Example:
const run = async () => {
  try {
    // wait for callmakeRequest to resolve
    // The error propagated from callmakeRequest will be caught here
    const result = await callmakeRequest("google");
    console.log(result); //"response recieved"
  } catch (error) {
    console.log("Error in run:", error); // Now it catches the error propagated from callmakeRequest and handles it
  }
};

//-------------------------------------------------------------------------

//running an async func in the background while not awaiting it

// Here the function run() itself is considered a promise as well as its an async function
//You don’t need await before run() unless you want to wait for the run function to complete before executing more code.
//Inside run, the await pauses the run function itself until callmakeRequest resolves, but the outer code calling run() doesn’t wait unless you explicitly use await on run().
run();

// Example:

const runasync = () => {
  console.log("Test1");
  console.log("test2");
  run(); // Calls the async function run, but doesn't wait for it to finish
  console.log("test3");
};

runasync();
/** Explaination of runasync()
 * 1. Calling runasync(): When runasync() is called, the function starts executing synchronously like any normal function.
 * 2.Logs:"Test1" is logged."Test2" is logged.
 * 3.Calling run() (Async Function):
 *  When run() is called inside runasync(), the JavaScript engine does not wait for run() to finish because it's an async function, and run() itself returns a Promise.
 *  At this point, the runasync function continues executing while run() runs asynchronously in the background.
 * 4. "Test3" is logged immediately after calling run() because the main thread is not waiting for run() to complete.
 * 5. Inside run():
 *      Inside run(), the code execution reaches await callmakeRequest("google"). Here, the function run() pauses and waits for the Promise returned by callmakeRequest to resolve or reject.
 *      While run() is paused, the main program continues executing other code, which is why "Test3" was logged already.
 * 6. After run finishes executing "connection established to google" (or whatever the resolved value is) will be logged only after the Promise inside run() resolves.
 * 
 * 
 * 
 * Error handling in run():
        We propagate the error in callmakeRequest() by re-throwing it in the catch block. This is because, if an error occurs in callmakeRequest() 
        (e.g., a failed network request), we want to re-throw the error so that the calling function, run(), can know an error occurred and handle it.

        By re-throwing the error, it allows run() to catch the error in its own catch block, meaning the error will propagate up the chain and enter the catch block of run().
    
    Diagram of Error Flow:
        1. Error occurs inside makeRequestPromise(location) →
        2. Error is caught in callmakeRequest() and re-thrown →
        3. Error propagates to run() as run awaits/calls callmakeRequest →
        4. Error is caught and handled in the catch block of run().
 */

//---------------------------------------------------------------------------------------------------------------------------------------------

// Another example instead of using return promise syntax just like the makeRequestPromise(),  async function by default returns the promise (aka can use it to create a promise):

// Basic syntax of creating a promise with a basis resolve and reject value.
// note i can use throw <whatever message or object> without the new Error keyword

//method3 represents the inital promise
const method3 = async (number) => {
  if (number >= 0) {
    // by default this is the resolve value which will be assigned to the variable calling this asynchronous function
    return `In method 3: ${number} is positive `;
  } else {
    // manual reject value: by throwing an error/something that would represent my error, so it can be caught in a catch block in the function calling this asynchronous function
    throw `In method 3: ${number} is negative`;
  }
};

const method2 = async (number) => {
  try {
    const responseFromMethod3 = await method3(number);
    // the responseFromMethod3 variable = "In method 3 number is positive ", in the case the method3 resolves
    // otherwise if it rejects it catches the error thrown and goes in the catch
    // we await it because any line after it depends on the return of the promise. so we have to wait for it to resolve/reject
    return `In method2: ${responseFromMethod3}`;
  } catch (err) {
    // the err variable = "In method 3 number is negative"
    //propigate the error to last function for it to be handled there
    throw `In method2: ${err}`;
  }
};

const method1 = async (number) => {
  try {
    const responseFromMethod2 = await method2(number);
    // we await it because any line after it depends on the return of the promise. so we have to wait for it to resolve/reject
    console.log(`Success: In method1: ${responseFromMethod2}`);
  } catch (err) {
    console.log(`Error: In method1: ${err}`);
  }
};

// as long as any future line does not depend on an async function or a promise then i don't need to await it.
//await basicaaly waits for a promise to resolev aka return a value or throw an error before continuing to execute the rest of my function.
// if ill use an await keyword it had to be in an async function
//async function it self returns a promise i don't need the newPromise keyword
// any return value represents a resolved value/success and to have a reject value i can throw an error or the value for it to be caught on later in another function awaiting the promise using a try and catch

console.log("test1");
method1(-1);
console.log("test2");
// output test1,test2,Error: In method1: In method2: In method 3: -1 is negative

// SINCE HERE I DIDN'T await the async function method1() due to nothing after it depends on it.
// So it continues to execute the code normally and in the background it runs tyhe async function which will finish at a future time
// if i awaited method 1 then test 2 will come after Error: In method1: In method2: In method 3: -1 is negative, as console.log(("test2")) wouldve been only executed after method1() resolves/rejects.
