# Rate Limiting

## Introduction

Rate limiting is a technique used to control how many requests a client can make within a specific period of time.

Example:

```text
10 requests
per 1 minute
````

After the client reaches the limit, additional requests can be rejected.

Basic flow:

```text
Client
  ↓
Request
  ↓
Rate Limiter
  ↓
Limit Reached?
  ↓          ↓
No          Yes
↓            ↓
Allow      Reject
             ↓
            429
```

---

## Why Rate Limiting Is Important

Without rate limiting, a client could send a large number of requests to an API.

This can cause:

* API abuse
* Excessive server load
* Brute-force attempts
* Resource exhaustion
* Unnecessary traffic

Rate limiting helps control excessive request traffic.

---

## Basic Example

Suppose an API allows:

```text
5 requests
per minute
```

Requests:

```text
Request 1 → Allowed
Request 2 → Allowed
Request 3 → Allowed
Request 4 → Allowed
Request 5 → Allowed
Request 6 → Rejected
```

The rejected request can receive:

```text
429 Too Many Requests
```

---

## HTTP 429

HTTP status code `429` means:

```text
Too Many Requests
```

It is commonly returned when a client exceeds the configured request limit.

Example:

```javascript
return res.status(429).json({
  message: "Too many requests"
});
```

When using `express-rate-limit`, the middleware can generate this response automatically.

---

## Rate Limiting Terminology

Two important concepts are:

```text
Window
+
Limit
```

Example:

```javascript
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5
});
```

Here:

```text
windowMs
→ 1 minute

limit
→ 5 requests
```

Therefore:

```text
5 requests
within 1 minute
```

are allowed according to this configuration.

---

## Express Rate Limiting

The `express-rate-limit` package can be used to implement rate limiting in Express.js applications.

Install:

```bash
npm install express-rate-limit
```

Import:

```javascript
const rateLimit = require("express-rate-limit");
```

---

## Creating a Rate Limiter

Example:

```javascript
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5
});
```

This creates a limiter that allows 5 requests within a 1 minute window.

---

## Route-Specific Rate Limiting

A limiter can be applied to a specific route.

Example:

```javascript
app.get(
  "/api/users",
  limiter,
  (req, res) => {
    res.json({
      message: "Users fetched successfully"
    });
  }
);
```

Only this route uses the limiter.

---

## Different Limits for Different Routes

Different endpoints may require different limits.

Example:

```javascript
const usersLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5
});
```

Then:

```javascript
app.get(
  "/api/users",
  usersLimiter,
  (req, res) => {
    res.json({
      message: "Users fetched successfully"
    });
  }
);
```

And:

```javascript
app.post(
  "/login",
  loginLimiter,
  (req, res) => {
    res.json({
      message: "Login request received"
    });
  }
);
```

---

## Why Login Should Have a Stricter Limit

Login endpoints can be targeted by brute force attempts.

Example:

```text
Attacker
  ↓
Login Request
  ↓
Wrong Password
  ↓
Login Request
  ↓
Wrong Password
  ↓
Repeat
```

A rate limiter can restrict how many login attempts can be made within a specific time period.

Example:

```text
5 login attempts
per minute
```

This does not completely prevent brute force attacks, but it makes excessive attempts harder.

---

## Global Rate Limiting

A limiter can also be applied globally.

Example:

```javascript
app.use(limiter);
```

This can apply the limiter to many or all routes that follow the middleware.

However, using exactly the same limit for every endpoint is not always appropriate.

Different routes can have different traffic and security requirements.

---

## Global vs Route-Specific

### Global

```javascript
app.use(limiter);
```

Useful when a general request limit should apply across the application.

### Route-Specific

```javascript
app.post("/login", loginLimiter, loginController);
```

Useful when a particular endpoint needs its own limit.

---

## Rate Limiting and Authentication

Rate limiting is different from authentication.

Authentication answers:

```text
Who are you?
```

Rate limiting answers:

```text
How many requests can you make within this period?
```

Example:

```text
Authentication
→ JWT
→ Session
→ Login

Rate Limiting
→ Request limit
→ Time window
```

They can be used together.

---

## Rate Limiting and Authorization

Rate limiting is also different from authorization.

Authorization answers:

```text
What are you allowed to access?
```

Rate limiting answers:

```text
How many requests are allowed?
```

Example:

```text
Authentication
→ Identify user

Authorization
→ Check permissions

Rate Limiting
→ Control request frequency
```

---

## Rate Limiting and CORS

CORS and rate limiting solve different problems.

```text
CORS
→ Controls browser cross origin access

Rate Limiting
→ Controls request frequency
```

An API can use both:

```text
Request
  ↓
CORS
  ↓
Rate Limiting
  ↓
Authentication
  ↓
Authorization
  ↓
Route
```

The exact middleware order depends on the application's requirements.

---

## Example Configuration

```javascript
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});
```

Route:

```javascript
app.post(
  "/login",
  loginLimiter,
  (req, res) => {
    res.json({
      message: "Login request received"
    });
  }
);
```

---

## Complete Example

```javascript
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = 3000;

app.use(express.json());

const usersLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    message: "Too many requests to users API. Please try again later."
  }
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

app.get(
  "/api/users",
  usersLimiter,
  (req, res) => {
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
  }
);

app.post(
  "/login",
  loginLimiter,
  (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    res.json({
      message: "Login request received"
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Important Security Considerations

Rate limiting is a security control, but it is not a complete security solution.

It should be combined with other security mechanisms such as:

```text
Authentication
Authorization
Input Validation
Password Hashing
HTTPS
Logging
```

For production systems, rate limiting may also need a shared storage or distributed configuration when multiple server instances are running.

---

## Common Mistakes

* Not rate limiting sensitive endpoints.
* Using the same limit for every endpoint without considering requirements.
* Thinking rate limiting completely prevents brute force attacks.
* Thinking rate limiting is authentication.
* Thinking rate limiting is authorization.
* Forgetting to return or handle `429 Too Many Requests`.
* Setting limits without considering normal application traffic.
* Relying on rate limiting as the only security mechanism.

---

## Interview Questions

* What is rate limiting?
* Why is rate limiting important?
* What is HTTP 429?
* What is a rate limit window?
* What is the difference between global and route specific rate limiting?
* Why should login endpoints have stricter limits?
* What is `windowMs`?
* What does `limit` represent in `express-rate-limit`?
* Is rate limiting authentication?
* Is rate limiting authorization?
* Can rate limiting completely prevent brute force attacks?
* Why might distributed applications require shared rate limit storage?

---

## Quick Revision

* Rate limiting controls request frequency.
* A rate limit usually contains a time window and request limit.
* `429 Too Many Requests` indicates that a request limit has been exceeded.
* `express-rate-limit` can implement rate limiting in Express.js.
* Different routes can have different limits.
* Login endpoints often require stricter limits.
* Rate limiting can reduce brute force attempts and API abuse.
* Global rate limiting applies broadly.
* Route specific rate limiting targets particular endpoints.
* Rate limiting is different from authentication.
* Rate limiting is different from authorization.
* Rate limiting is one security layer, not a complete security solution.


