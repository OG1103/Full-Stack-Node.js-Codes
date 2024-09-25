// SYNTAX EXAMPLE:
const promise = new Promise((resolve, reject) => {
  // Perform an async operation (e.g., fetching data)

  let success = true; // Example condition

  if (success) {
    resolve("Operation successful!"); // When the async operation is successful
  } else {
    reject("Operation failed!"); // When the async operation fails
  }
});
//resolve(value): This is called when the async operation completes successfully, passing the result.
//reject(reason): This is called when the operation fails, passing the error.

//USING A PROMISE
//BASIC SYNTAX
promise
  .then(function (data) {
    // Handle success
    console.log("Success:", data);
  })
  .catch(function (error) {
    // Handle error
    console.log("Error:", error);
  })
  .finally(function () {
    // Runs regardless of success or failure
    console.log("Promise settled.");
  });

//EXAMPLE
promise
  .then((result) => {
    console.log(result); // Operation successful!, since we pass by the value thats in the resolve. result variable contains the data inside the resolve
  })
  .catch((error) => {
    console.log(error); // Operation failed!, since we pass by the value thats in the reject. error variable contains the data inside the reject
  })
  .finally(() => {
    console.log("Promise settled.");
  });

// Handling both fulfillment and rejection
promise.then(
  (result) => {
    console.log("Success:", result); // This runs if the promise is fulfilled
  },
  (error) => {
    console.log("Error:", error); // This runs if the promise is rejected
  }
);

/*EXPLAINATION
.then(onFulfilled()): This method is used to handle the promise when it is either resolved or rejected.  it receives the value that was passed to resolve() in the case of onfullfilled.
.catch(onRejected): This method is used to handle promise rejection (failure). it recieves the value that was passed to the reject()
.finally(): This method is called after the promise is settled, whether fulfilled or rejected.

*/

// CHAINING PROMISES
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data fetched");
  }, 1000);
});
fetchData
  .then((result) => {
    console.log(result); // "Data fetched"
    return "Processing data";
  })
  .then((processedData) => {
    console.log(processedData); // "Processing data"
  })
  .catch((error) => {
    console.log(error); // Handle any error in the chain
  });
//In the above example, the first .then() returns a value, which is passed as the argument to the next .then() in the chain.

//PROMISE.ALL()
const promise1 = Promise.resolve("Promise 1 resolved");
const promise2 = new Promise((resolve) =>
  setTimeout(resolve, 2000, "Promise 2 resolved")
);
const promise3 = Promise.resolve("Promise 3 resolved");

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log(results); // ["Promise 1 resolved", "Promise 2 resolved", "Promise 3 resolved"]
  })
  .catch((error) => {
    console.log(error);
  });

//Promise.all(): waits for all promises to resolve.

//PROMISE.RACE()
const fastPromise = new Promise((resolve) =>
  setTimeout(resolve, 1000, "Fast Promise resolved")
);
const slowPromise = new Promise((resolve) =>
  setTimeout(resolve, 3000, "Slow Promise resolved")
);

Promise.race([fastPromise, slowPromise]).then((result) => {
  console.log(result); // "Fast Promise resolved"
});
//Promise.race(): waits for the first promise to resolve or reject.

//ADVANCED EXAMPLE
function watchTutorialPromise() {
  let userLeft = false;
  let userWatchingCatMeme = false;
  return new Promise((resolve, reject) => {
    if (userLeft) {
      reject({
        name: "User Left",
        message: ":(",
      });
    } else if (userWatchingCatMeme) {
      reject({
        name: "User Watching Cat Meme",
        message: "WebDevSimplified < Cat",
      });
    } else {
      resolve("Thumbs up and Subscribe");
    }
  });
}

watchTutorialPromise()
  .then((message) => {
    console.log(message); // "Thumbs up and Subscribe" AS ITS PASSED IN THE RESOLVE
  })
  .catch((error) => {
    console.log(error.name + " " + error.message); // DEPENDS ON WHATS PASSED IN THE REJECT
  });

// .all() & .race()
const recordVideoOne = new Promise((resolve, reject) => {
  resolve("Video 1 Recorded");
});

const recordVideoTwo = new Promise((resolve, reject) => {
  resolve("Video 2 Recorded");
});

const recordVideoThree = new Promise((resolve, reject) => {
  resolve("Video 3 Recorded");
});

// Runs all these promises and once done runs the .then and .catch, If one promise rejects then the entire promise.all(rejects)  and the rejection reason (the error from the rejected promise) is returned.
Promise.all([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
  (messages) => {
    console.log(messages); // sends an array of all the successfull messages in all the promises that resolved
  }
);

// As soon as one promise is done then thats the one returned in the .then() or .catch() instead of waiting for all of them to finish
Promise.race([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
  (message) => {
    console.log(message); // will print the message of the first promise done, not all messages.
  }
);
