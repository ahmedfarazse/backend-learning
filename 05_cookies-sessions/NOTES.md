# Cookies and Sessions

## Introduction

Cookies and sessions are commonly used together in session based authentication.

A cookie is a small piece of data stored by the browser, while a session stores authentication related information on the server.

The browser usually stores a session identifier inside a cookie, which allows the server to identify the user's session.

---

## What Is a Cookie?

A cookie is a small piece of data that a server can send to a browser.

The browser stores the cookie and can send it with future requests.

Basic flow:

```text
Server
  ↓
Set Cookie
  ↓
Browser
  ↓
Cookie Stored
````

Future requests:

```text
Browser
  ↓
Cookie
  ↓
Server
```

---

## Example Cookie

A server can send:

```http
Set Cookie: sessionId=abc123
```

The browser can then send:

```http
Cookie: sessionId=abc123
```

---

## What Is a Session?

A session is server side information used to maintain the state of an authenticated user.

For example, the server may associate a session ID with user information:

```text
sessionId: abc123

userId: 1
role: user
```

The browser usually stores the session identifier in a cookie rather than storing the complete session data.

---

## Cookie vs Session

Cookie:

```text
Stored in the browser
```

Session:

```text
Stored and managed on the server
```

The cookie and session often work together:

```text
Browser
  ↓
Session Cookie
  ↓
Session ID
  ↓
Server
  ↓
Session Data
  ↓
Authenticated User
```

---

## Session-Based Authentication

A typical session authentication flow starts when the user logs in.

```text
User
  ↓
Email + Password
  ↓
Backend verifies credentials
  ↓
Create Session
  ↓
Set Session Cookie
  ↓
Browser
```

Future requests:

```text
Browser
  ↓
Session Cookie
  ↓
Backend
  ↓
Find Session
  ↓
User Authenticated
```

---

## Express Sessions

Express applications can use the `express-session` package to implement sessions.

Install:

```bash
npm install express-session
```

Import:

```javascript
const session = require("express-session");
```

---

## Session Configuration

Basic configuration:

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
```

### Secret

The secret is used to protect the session.

It should be stored in an environment variable.

Example:

```env
SESSION_SECRET=my-session-secret
```

---

## Creating a Session

After successful login, user information can be stored in the session.

Example:

```javascript
req.session.userId = user.id;
```

Another value can also be stored:

```javascript
req.session.role = user.role;
```

The session now contains information associated with the authenticated user.

---

## Login Example

```javascript
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (user) => user.email === email
  );

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  req.session.userId = user.id;
  req.session.role = user.role;

  res.json({
    message: "Login successful"
  });
});
```

---

## Protected Routes

A route can check whether a user session exists.

Example:

```javascript
app.get("/profile", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  res.json({
    message: "Profile accessed",
    userId: req.session.userId,
    role: req.session.role
  });
});
```

The basic logic is:

```text
Request
  ↓
Session Cookie
  ↓
Session Found?
  ↓
Yes → Allow Access
No  → 401 Unauthorized
```

---

## Session Cookie

When a session is created, the client usually receives a session cookie.

Conceptually:

```text
Server
  ↓
Session Created
  ↓
Session Cookie
  ↓
Browser
```

The browser sends the cookie with future requests.

---

## HttpOnly

The `httpOnly` cookie option prevents normal client side JavaScript from directly accessing the cookie.

Example:

```javascript
cookie: {
  httpOnly: true
}
```

This can reduce the risk of certain types of client side token theft.

---

## Secure

The `secure` option restricts the cookie to HTTPS connections.

Example:

```javascript
cookie: {
  secure: true
}
```

For local development using HTTP, this may be set to `false`.

Example:

```javascript
cookie: {
  secure: false
}
```

In production, HTTPS should be used.

---

## SameSite

The `sameSite` option controls how cookies are sent with cross site requests.

Example:

```javascript
cookie: {
  sameSite: "lax"
}
```

Common values include:

```text
strict
lax
none
```

`SameSite` can help reduce certain cross site request risks.

---

## Cookie Configuration Example

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    }
  })
);
```

For production, cookie settings should be configured according to the application's deployment and security requirements.

---

## Checking the Session

The current session can be inspected during development.

Example:

```javascript
app.get("/session", (req, res) => {
  res.json({
    session: req.session
  });
});
```

This is useful for understanding what information is stored in the session.

---

## Logout

A session can be destroyed when the user logs out.

Example:

```javascript
app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout failed"
      });
    }

    res.json({
      message: "Logout successful"
    });
  });
});
```

After the session is destroyed, the user should no longer be authenticated through that session.

---

## Logout Flow

```text
User
  ↓
Logout
  ↓
Destroy Session
  ↓
Session No Longer Valid
  ↓
Protected Route
  ↓
401 Unauthorized
```

---

## Session Storage

For learning purposes, `express-session` can use its default in memory session storage.

This is useful for development and learning.

However, the default memory store is not suitable for production applications.

Production applications should use an appropriate persistent session store.

---

## Session Expiration

Sessions can have an expiration time.

Example:

```javascript
cookie: {
  maxAge: 1000 * 60 * 60
}
```

This example represents one hour.

```text
1000 milliseconds
× 60 seconds
× 60 minutes
= 1 hour
```

The exact session lifetime should depend on the application's requirements.

---

## JWT vs Session

JWT based authentication and session based authentication are different approaches.

### JWT

The client usually sends a token containing claims.

```text
Client
  ↓
JWT
  ↓
Server verifies JWT
```

### Session

The client usually sends a session cookie containing or identifying the session.

```text
Client
  ↓
Session Cookie
  ↓
Server
  ↓
Session Lookup
```

---

## Stateful vs Stateless

Traditional session based authentication is generally stateful because the server maintains session state.

```text
Session
  ↓
Server stores state
```

JWT authentication is often described as stateless because the server can verify the token without maintaining the same session state for every token.

```text
JWT
  ↓
Token contains claims
  ↓
Server verifies token
```

However, real world JWT systems can still maintain server side state for things such as token revocation or refresh token management.

---

## Cookie Does Not Mean Session

A common mistake is thinking that cookies and sessions are the same thing.

They are different:

```text
Cookie
→ Client side storage mechanism

Session
→ Server side authentication state
```

They are often used together:

```text
Cookie
  ↓
Session ID
  ↓
Server Session
```

---

## Security Best Practices

* Use `HttpOnly` for authentication cookies where appropriate.
* Use `Secure` cookies in production with HTTPS.
* Configure `SameSite` appropriately.
* Store session secrets securely.
* Do not hard code secrets in production code.
* Use HTTPS in production.
* Use an appropriate session expiration time.
* Use a proper persistent session store in production.
* Destroy or invalidate sessions when required.
* Do not store sensitive information unnecessarily in cookies.

---

## Common Mistakes

* Thinking cookies and sessions are the same thing.
* Storing sensitive data directly inside cookies.
* Using insecure cookies in production.
* Hard coding session secrets.
* Using the default in memory session store in production.
* Forgetting to destroy sessions during logout.
* Using very long session lifetimes without considering security.
* Assuming session authentication is automatically secure.
* Confusing session authentication with JWT authentication.

---

## Interview Questions

* What is a cookie?
* What is a session?
* What is the difference between cookies and sessions?
* Where is a cookie stored?
* Where is session data normally stored?
* How does session based authentication work?
* What is a session ID?
* What is `HttpOnly`?
* What is the purpose of the `Secure` cookie option?
* What is `SameSite`?
* How do you create a session in Express?
* How do you destroy a session?
* Why is the default Express session memory store not suitable for production?
* What is the difference between JWT and session based authentication?
* What does stateful authentication mean?

---

## Quick Revision

* Cookies are stored on the client/browser.
* Sessions are maintained on the server.
* A session cookie commonly contains or identifies a session ID.
* The server uses the session ID to find the user's session.
* `express-session` can be used to implement sessions in Express.
* `req.session` is used to access the current session.
* `req.session.destroy()` can destroy a session.
* `HttpOnly` prevents normal client side JavaScript from accessing the cookie.
* `Secure` restricts cookies to HTTPS connections.
* `SameSite` controls cross site cookie behavior.
* Session-based authentication is generally stateful.
* JWT authentication is often stateless.
* Cookies and sessions are different concepts but are commonly used together.
* The default in memory session store is for development and learning, not production.

