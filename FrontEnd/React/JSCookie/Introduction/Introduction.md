# Introduction to JavaScript Cookies

Cookies are small pieces of data stored in the user's browser that help persist information between requests. They are widely used for authentication, user preferences, and tracking user behavior.

## Cookies as Key-Value Pairs

Cookies are stored as key-value pairs in the browser. When a cookie is set, it follows the format:

```text
key=value;
```

For example, if we set a cookie like this:

```js
Cookies.set("username", "JohnDoe");
```

It will be stored in the browser as:

```text
username=JohnDoe;
```

Cookies can also include additional metadata such as expiration dates, paths, and security flags.

## Importing Cookies in React (ES6)

In React, we use the `js-cookie` library to manage cookies efficiently. First, install the package:

```sh
npm install js-cookie
```

Then, import it in your React component:

```js
import Cookies from "js-cookie";
```

## Accessing Non-HTTP Only Cookies

Non-HTTP only cookies are accessible via JavaScript, meaning you can read them using `js-cookie`. To retrieve a cookie:

```js
const userToken = Cookies.get("userToken");
console.log("User Token:", userToken);
```

If the cookie exists, it will return its value; otherwise, it returns `undefined`.

## Writing Cookies in React

To set a cookie in React using `js-cookie`:

```js
Cookies.set("theme", "dark", { expires: 7 }); // Expires in 7 days
```

### Cookie Options

When setting a cookie, we can provide additional options:

- `expires`: Defines the expiration time in days.
- `path`: Specifies the URL path where the cookie is available.
- `secure`: Ensures the cookie is only sent over HTTPS.
- `sameSite`: Controls whether cookies should be sent with cross-site requests.

Example:

```js
Cookies.set("sessionId", "abc123", {
  expires: 7, // Cookie expires in 7 days
  path: "/", // Available across all pages
  secure: true, // Only sent over HTTPS
  sameSite: "Strict", // Prevents cross-site request issues
});
```

### Viewing Cookies in the Browser

To inspect cookies in the browser:

1. Open Developer Tools (F12 or right-click > Inspect).
2. Navigate to the **Application** tab.
3. Expand the **Storage** section and select **Cookies**.
4. Click on the website’s domain to view stored cookies.

You will see a table with cookie names, values, expiration dates, and additional attributes.

---

This setup enables seamless management of cookies in a React application.
