/** COOKIES
 * Cookies let you store user information in web pages.
 * They are stored at the client side
 * Cookies are data, stored in small text files, on your computer.
 * When a user visits a web page, his/her name can be stored in a cookie.
 * Next time the user visits the page, the cookie "remembers" his/her name.
 * Cookies are saved in name-value pairs like:
 * username = John Doe
 * JavaScript can create, read, and delete cookies with the document.cookie property.
 */

//CREATING A COOKIE
document.cookie = "username=John Doe";

//You can also add an expiry date (in UTC time). By default, the cookie is deleted when the browser is closed:
document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";

//With a path parameter, you can tell the browser what path the cookie belongs to. By default, the cookie belongs to the current page.
//By default, if you don't specify the path attribute when creating a cookie, the browser assigns the cookie to the path of the page that set it.
document.cookie =
  "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";

// Cookie available on the entire site
document.cookie = "cookie1=Value1; path=/";

// Cookie available only on "/user/profile"
document.cookie = "cookie2=Value2; path=/user/profile";

// Cookie available only on "/admin"
document.cookie = "cookie3=Value3; path=/admin";

// YOU CAN CREATE A BUNCH OF COOKIES TO THE SAME PATH
// All these cookies are set for the root path ("/")
document.cookie = "username=JohnDoe; path=/";
document.cookie = "sessionToken=abc123; path=/";
document.cookie = "theme=dark; path=/";
console.log(document.cookie);
// Output IF AT ROOT PATH: "username=JohnDoe; sessionToken=abc123; theme=dark"

//---------------------------------------------------------------------------------------------

//READING A COOKIE
let x = document.cookie;
//when you use document.cookie to retrieve the cookies, it only returns the key-value pairs
// It does not return any of the other properties of the cookies, such as expires, path, domain, or Secure attributes.
//document.cookie will return all cookies in one string much like: cookie1=value; cookie2=value; cookie3=value;

//If you're currently on the page https://example.com/user/profile, you will only see the cookies that are accessible to this path (/user/profile and /):
console.log(document.cookie); // Output: "cookie1=Value1; cookie2=Value2"

//If you're on the page https://example.com/admin, you will see cookies accessible to /admin and /:
console.log(document.cookie); // Output: "cookie1=Value1; cookie3=Value3"

//If you're on the homepage https://example.com/, you will only see cookies that have the path / (site-wide cookies):
console.log(document.cookie); // Output: "cookie1=Value1"

//---------------------------------------------------------------------------------------------

//CHANGING A COOKIE
//With JavaScript, you can change a cookie the same way as you create it:
document.cookie =
  "username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
//The old cookie is overwritten.

//---------------------------------------------------------------------------------------------

//DELETING A COOKIE
// To delete a cookie just set the expires parameter to a past date:
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//You should define the cookie path to ensure that you delete the right cookie.
//Some browsers will not let you delete a cookie if you don't specify the path.

//---------------------------------------------------------------------------------------------

/** The Cookie String
 * The document.cookie property looks like a normal text string. But it is not.
 * Even if you write a whole cookie string to document.cookie, when you read it out again, you can only see the name-value pair of it.
 * If you set a new cookie, older cookies are not overwritten. The new cookie is added to document.cookie, so if you read document.cookie again you will get something like:
 * cookie1 = value; cookie2 = value;
 * If you want to find the value of one specified cookie, you must write a JavaScript function that searches for the cookie value in the cookie string.
 */

//A Function to Set a Cookie
//First, we create a function that stores the name of the visitor in a cookie variable:
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//EXPLAINATION: The parameters of the function above are the name of the cookie (cname), the value of the cookie (cvalue), and the number of days until the cookie should expire (exdays).

//A Function to Get a Cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      //ensure no empty space in the beggining of the cookie key value pair
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      //if the first occurance of the cookiename im looking for is at the beggining then i found the cookiename im looking for.
      // return the value of it, the value starts after the cookieName= aka the first char of the value is at index name.length in the string and the value ends at c.length.
      // note its c.length not c.length-1 since substring doesn't include the last index, so if c.length-1 even tho thats the index of the last char, it won't be taken.
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
/**
 * Function explained:

Take the cookiename as parameter (cname).

Create a variable (name) with the text to search for (cname + "=").

Decode the cookie string, to handle cookies with special characters, e.g. '$'

Split document.cookie on semicolons into an array called ca (ca = decodedCookie.split(';')).

Loop through the ca array (i = 0; i < ca.length; i++), and read out each value c = ca[i]).

If the cookie is found (c.indexOf(name) == 0), return the value of the cookie (c.substring(name.length, c.length).

If the cookie is not found, return "".
 */
