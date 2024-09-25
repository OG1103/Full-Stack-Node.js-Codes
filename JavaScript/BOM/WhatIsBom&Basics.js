//Browser Object Model (refers to interaction of js with browser instead of document)
//Difference between DOM, is that DOM applies to a html document (interacts with a html document as an object),
//however BOM applies to a browser (interacts with a browser as an object)- more broad than DOM.

//------------------------------------------------------------------------------------------------------------

//WINDOW OBJECT

/** The Window Object
 * The window object is supported by all browsers. It represents the browser's window.
 * Global variables are properties of the window object.
 * Global functions are methods of the window object.
 * Even the document object (of the HTML DOM) is a property of the window object:
 * window.open() - open a new window
 * window.close() - close the current window
 * window.moveTo() - move the current window
 * window.resizeTo() - resize the current window
 */

/** Window Location
 * The window.location object can be used to get the current page address (URL) and to redirect the browser to a new page.
 * window.location.href ; returns the href (URL) of the current page
 * window.location.hostname ;returns the domain name of the web host
 * window.location.pathname ;returns the path and filename of the current page
 * window.location.protocol ;returns the web protocol used (http: or https:)
 * window.location.assign(url) loads a new document
 */

//------------------------------------------------------------------------------------------------------------

// POP UP BOXES

/** ALERT BOX
 * When an alert box pops up, the user will have to click "OK" to proceed.
 * SYNTAX: window.alert("sometext");
 */
alert("I am an alert box!");

/** CONFRIM BOX
 * A confirm box is often used if you want the user to verify or accept something.
 * When a confirm box pops up, the user will have to click either "OK" or "Cancel" to proceed.
 * Syntax: window.confirm("sometext");
 * The window.confirm() method can be written without the window prefix.
 */
if (confirm("Press a button!")) {
  // press button is the message in the confrim box
  // if im in this if means i pressed ok
  txt = "You pressed OK!";
} else {
  txt = "You pressed Cancel!";
}

/** PROMPT BOX
 * A prompt box is often used if you want the user to input a value before entering a page.
 * When a prompt box pops up, the user will have to click either "OK" or "Cancel" to proceed after entering an input value.
 * If the user clicks "OK" the box returns the input value. If the user clicks "Cancel" the box returns null.
 * syntax: window.prompt("sometext","defaultText");
 * The window.prompt() method can be written without the window prefix.
 */
let person = prompt("Please enter your name", "Harry Potter");
let text;
if (person == null || person == "") {
  text = "User cancelled the prompt.";
} else {
  text = "Hello " + person + "! How are you today?";
}

//------------------------------------------------------------------------------------------------------------

//TIMING EVENTS

/**SET INTERVAL METHOD
 * The setInterval(function,interval(in ms)) method calls a function at specified intervals (in milliseconds) and returns an id.
 * The setInterval() method continues calling the function until clearInterval() is called, or the window is closed.
 * To execute the function only once, use the setTimeout() method instead.
 * To clear an interval, use the id returned from setInterval() and pass it to the function clearInterval:
 * The clearInterval() method clears a timer set with the setInterval() method.
 * **/

myInterval = setInterval(() => {
  console.log("called");
}, 2000);

clearInterval(myInterval);

// can also set it to window
// the window will call this function every 2 seconds
// in the conmsole every 2 seconds will print called
window.setInterval(() => {
  console.log("called");
}, 2000);

//EXAMPLE CREATING A PROGRESS BAR
function move() {
  const element = document.getElementById("myBar");
  let width = 0;
  // call the function frame every 10 millieseconds
  let id = setInterval(frame, 10);
  function frame() {
    // function called by interval however written in a more understandable way
    if (width == 100) {
      //progres bar finished there fore clear interval aka the fubnction frame will stop being called
      // I CAN CLEAR THE INTERVAL INSIDE THE FUNCTION THAT IS CALLED IN THE INTERVAL
      clearInterval(id);
    } else {
      width++;
      element.style.width = width + "%";
    }
  }
}

/** SET TIMEOUT METHOD
 * The setTimeout() method calls a function after a number of milliseconds.
 * The setTimeout() is executed only once.
 * If you need repeated executions, use setInterval() instead.
 * Use the clearTimeout() m ethod to prevent the function from starting.
 * To clear a timeout, use the id returned from setTimeout():
 * myTimeout = setTimeout(function, milliseconds);
 * clearTimeout(myTimeout);
 */

let timeout;

function myFunction() {
  //Display an alert box after 3 seconds (3000 milliseconds):
  // aka call the alertFunc after 3 seconds
  timeout = setTimeout(alertFunc, 3000);
}

function alertFunc() {
  alert("Hello!");
}

//-------------------------------------------------------------------------------------------------------------

/**
 *
 */

//-------------------------------------------------------------------------------------------------------------
