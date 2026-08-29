# Cross Origin Resource Sharing (CORS)

## Introduction

CORS stands for Cross Origin Resource Sharing.

CORS is a browser security mechanism that controls whether a web page can make and access requests to a different origin.

Example:

```text
Frontend
http://localhost:5173

        ↓

Backend
http://localhost:3000
````

The frontend and backend have different origins because their ports are different.

---

## What Is an Origin?

An origin is based on:

```text
Protocol + Host + Port
```

Example:

```text
http://localhost:3000
```

Here:

```text
http
→ Protocol

localhost
→ Host

3000
→ Port
```

---

## Same-Origin Request

Two URLs are same origin when their relevant protocol, host, and port are the same.

Example:

```text
Frontend
http://localhost:3000

Backend
http://localhost:3000
```

Both use:

```text
http
localhost
3000
```

Therefore, they have the same origin.

---

## Cross-Origin Request

A request is cross origin when the origin is different.

Example:

```text
Frontend
http://localhost:5173

Backend
http://localhost:3000
```

The ports are different:

```text
5173 ≠ 3000
```

Therefore, the origins are different.

---

## Same-Origin Policy

Browsers enforce the Same Origin Policy as an important security mechanism.

It restricts how a web page can interact with resources from another origin.

CORS provides a controlled way for servers to tell browsers which cross origin requests are allowed.

---

## Why Is CORS Needed?

Suppose:

```text
Frontend
http://localhost:5173
```

needs data from:

```text
Backend
http://localhost:3000
```

The browser sees that this is a cross origin request.

The backend can use CORS headers to tell the browser:

```text
This origin is allowed.
```

---

## CORS in Express

The `cors` package can be used with Express.js.

Install it:

```bash
npm install cors
```

Import it:

```javascript
const cors = require("cors");
```

Basic configuration:

```javascript
app.use(cors());
```

This enables CORS handling for the Express application.

---

## Allowing a Specific Origin

Instead of allowing every origin, a specific origin can be configured.

Example:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
```

This tells the CORS middleware to allow requests from the specified origin.

---

## Multiple Allowed Origins

Multiple trusted origins can be configured.

Example:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://example.com"
];
```

The application can then use the allowed origins in its CORS configuration.

---

## Credentials

Credentials can include things such as cookies.

Example backend configuration:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
```

`credentials: true` allows the server to participate in credentialed cross origin requests.

It does not create cookies by itself.

---

## Frontend Credentials

When using cookies in a cross origin request, the frontend can include credentials.

Example using `fetch`:

```javascript
fetch("http://localhost:3000/api/profile", {
  credentials: "include"
})
  .then(response => response.json())
  .then(data => console.log(data));
```

The backend must also be configured appropriately.

---

## CORS and Cookies

CORS and cookies are separate concepts.

CORS controls cross origin browser access.

Cookies are a mechanism for storing and sending data with HTTP requests.

Example:

```text
Frontend
    ↓
Request + Credentials
    ↓
CORS Configuration
    ↓
Backend
```

For cross site cookies, additional cookie attributes such as `SameSite` and `Secure` can also affect whether cookies are sent.

---

## Preflight Request

Some cross origin requests require a preflight request.

The browser sends an HTTP `OPTIONS` request before the actual request.

Example:

```text
Browser
   ↓
OPTIONS /api/users
   ↓
Backend
   ↓
CORS checks
   ↓
Allowed?
   ↓
Actual Request
```

The preflight request allows the browser to determine whether the actual cross origin request is permitted.

---

## When Can Preflight Happen?

Preflight commonly occurs when a cross origin request uses conditions that require permission to be checked before the actual request.

Examples can include:

* Certain HTTP methods
* Custom request headers
* Certain content types

Example:

```text
OPTIONS /api/users
```

---

## CORS Headers

CORS is implemented using HTTP response headers.

One important header is:

```text
Access-Control-Allow-Origin
```

Example:

```text
Access-Control-Allow-Origin: http://localhost:5173
```

This tells the browser which origin is allowed.

Other CORS-related headers include:

```text
Access-Control-Allow-Methods
Access-Control-Allow-Headers
Access-Control-Allow-Credentials
```

---

## CORS vs Authentication

CORS is not authentication.

Authentication answers:

```text
Who are you?
```

CORS answers:

```text
Which browser origins are allowed to access this resource?
```

Authentication example:

```text
JWT
Session
Cookie
```

CORS example:

```text
Allowed Origin
→ http://localhost:5173
```

---

## CORS vs Authorization

CORS is also different from authorization.

Authorization answers:

```text
What is this authenticated user allowed to do?
```

Example:

```text
Admin
→ Delete Users

User
→ Read Users
```

CORS answers:

```text
Which origin is allowed to make/access this browser request?
```

---

## Complete Flow

A typical cross origin request can look like:

```text
Frontend
http://localhost:5173
        ↓
API Request
        ↓
Backend
http://localhost:3000
        ↓
CORS Check
        ↓
Allowed?
    ↓       ↓
   Yes      No
    ↓        ↓
Response   Browser blocks access
```

---

## Example Backend

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.get("/api/users", (req, res) => {
  res.json({
    message: "Users fetched successfully",
    users: [
      {
        id: 1,
        name: "Ahmed"
      },
      {
        id: 2,
        name: "Ali"
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Example Frontend Request

```javascript
fetch("http://localhost:3000/api/users", {
  credentials: "include"
})
  .then(response => response.json())
  .then(data => console.log(data));
```

The frontend is running on:

```text
http://localhost:5173
```

The backend is running on:

```text
http://localhost:3000
```

Therefore, the request is cross-origin.

---

## Security Considerations

Do not blindly allow every origin in production without understanding the consequences.

Avoid using broad configuration such as:

```javascript
app.use(cors());
```

when the application requires a restricted list of trusted origins.

Prefer explicitly configured trusted origins when appropriate:

```javascript
app.use(
  cors({
    origin: "https://your-frontend.example"
  })
);
```

CORS is a browser security mechanism. It does not replace authentication or authorization.

---

## Common Mistakes

* Thinking CORS is authentication.
* Thinking CORS is authorization.
* Thinking CORS protects an API from every type of client.
* Allowing every origin without understanding the security implications.
* Forgetting that different ports create different origins.
* Assuming `credentials: true` creates cookies.
* Forgetting frontend `credentials: "include"` when cookies are required.
* Confusing CORS errors with server errors.
* Forgetting that CORS is primarily enforced by browsers.

---

## Interview Questions

* What is CORS?
* What does CORS stand for?
* What is an origin?
* What is the Same Origin Policy?
* What is the difference between same origin and cross origin requests?
* Why is CORS needed?
* How do you enable CORS in Express?
* How do you allow a specific origin?
* What does `credentials: true` do?
* What does `credentials: "include"` do?
* What is a preflight request?
* What HTTP method is commonly used for preflight?
* What is `Access-Control-Allow-Origin`?
* Is CORS authentication?
* Is CORS authorization?
* How does CORS work with cookies?

---

## Quick Revision

* CORS stands for Cross Origin Resource Sharing.
* CORS controls cross origin browser requests.
* An origin consists of protocol, host, and port.
* Different ports create different origins.
* The Same Origin Policy is enforced by browsers.
* CORS allows servers to specify trusted origins.
* Express can use the `cors` package.
* Specific origins can be configured.
* `credentials: true` enables credentialed CORS handling on the server.
* `credentials: "include"` tells the browser to include credentials when appropriate.
* Some cross origin requests require a preflight `OPTIONS` request.
* CORS is different from authentication.
* CORS is different from authorization.
* CORS does not replace backend security controls.
