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
    //if the promise is rejected it immediatly goes to the catch block
    const response = await makeRequestPromise(location);
    return response;
  } catch (error) {
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
    console.log(result);
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
