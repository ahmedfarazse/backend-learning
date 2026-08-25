# Authentication vs Authorization

## Introduction

Authentication and authorization are two important concepts in backend development and security.

Authentication verifies the identity of a user, while authorization determines what an authenticated user is allowed to access or perform.

---

## Authentication

Authentication means verifying the identity of a user.

In simple words:

> Who are you?

For example, when a user logs in using an email and password, the backend verifies the provided credentials.

```text
User
  ↓
Email + Password
  ↓
Backend verifies credentials
  ↓
User authenticated
```

Common authentication methods:

* Email and password
* OTP
* Google login
* GitHub login
* Passkeys
* Authentication tokens

---

## Authorization

Authorization determines what an authenticated user is allowed to access or perform.

In simple words:

> What are you allowed to do?

For example, a normal user may be allowed to view their profile but may not be allowed to access an admin dashboard.

```text
User
Role: user

Allowed:
- View profile
- Update own profile

Not allowed:
- Access admin dashboard
- Delete other users
```

---

## Authentication vs Authorization

| Authentication             | Authorization                               |
| -------------------------- | ------------------------------------------- |
| Verifies identity          | Verifies permissions                        |
| Who are you?               | What can you do?                            |
| Usually happens first      | Usually happens after authentication        |
| Login is commonly involved | Roles and permissions are commonly involved |

---

## Simple Example

Imagine entering a building.

The security guard checks your ID.

This is:

```text
Authentication
```

After verifying your identity, the guard checks whether you are allowed to enter a restricted room.

This is:

```text
Authorization
```

---

## Authentication Flow

A simple authentication flow can look like:

```text
User
  ↓
Login
  ↓
Credentials
  ↓
Backend verifies identity
  ↓
Authenticated
```

---

## Authorization Flow

Authorization happens after authentication.

```text
Authenticated User
  ↓
Check Role / Permissions
  ↓
Allowed
   or
Denied
```

---

## Express Authentication Middleware

Authentication can be implemented using middleware.

```javascript
const authenticate = (req, res, next) => {
  if (!user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  req.user = user;

  next();
};
```

The authenticated user can be attached to the request:

```javascript
req.user = user;
```

Other middleware and route handlers can then access:

```javascript
req.user
```

---

## Express Authorization Middleware

Authorization can check the user's role.

```javascript
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied"
    });
  }

  next();
};
```

Only users with the `admin` role can continue.

---

## Protected Routes

A route can require authentication:

```javascript
app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});
```

A route can require both authentication and authorization:

```javascript
app.get(
  "/admin",
  authenticate,
  authorizeAdmin,
  (req, res) => {
    res.json({
      message: "Welcome to admin dashboard"
    });
  }
);
```

Middleware executes from left to right:

```text
authenticate
      ↓
authorizeAdmin
      ↓
route handler
```

---

## HTTP Status Codes

### 401 Unauthorized

`401` is used when authentication is required or the user's identity could not be verified.

Example:

```javascript
return res.status(401).json({
  message: "Authentication required"
});
```

---

### 403 Forbidden

`403` is used when the user is authenticated but does not have permission to access the requested resource.

Example:

```javascript
return res.status(403).json({
  message: "Access denied"
});
```

Remember:

```text
401 → Authentication problem

403 → Authorization problem
```

---

## Best Practices

* Keep authentication and authorization separate.
* Authenticate the user before checking permissions.
* Use middleware for reusable authentication and authorization logic.
* Use appropriate HTTP status codes.
* Do not assume that a logged-in user can access everything.
* Do not trust role or permission information directly from the client.
* Keep authorization rules clear and easy to maintain.

---

## Common Mistakes

* Confusing authentication with authorization.
* Assuming authentication gives access to everything.
* Using `403` when authentication is required.
* Checking roles before authenticating the user.
* Forgetting to call `next()` in middleware.
* Allowing clients to freely decide their own roles or permissions.

---

## Interview Questions

* What is authentication?
* What is authorization?
* What is the difference between authentication and authorization?
* What is the difference between HTTP 401 and 403?
* What is authentication middleware?
* Why does authentication usually happen before authorization?
* How can roles be used for authorization?
* What is a protected route?

---

## Quick Revision

* Authentication verifies **who the user is**.
* Authorization verifies **what the user can do**.
* Authentication usually happens before authorization.
* `401` is related to authentication.
* `403` means the user is authenticated but not allowed.
* Middleware can be used for authentication and authorization.
* Protected routes require authentication.
* Role-based access can be used for authorization.
