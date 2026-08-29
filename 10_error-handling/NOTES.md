# Centralized Error Handling

## Introduction

Error handling is the process of detecting, managing, and responding to errors that occur in a backend application.

In Express.js, errors can be handled using middleware.

Instead of handling every error separately inside every route, errors can be passed to one centralized error handling middleware.

---

## Why Error Handling Is Important

Backend applications can encounter many types of errors.

Examples:

```text
Invalid input
User not found
Database failure
Authentication failure
Authorization failure
Unexpected server error
````

Without proper error handling, the application may return inconsistent responses or expose unnecessary information.

---

## Basic Error Flow

A typical centralized error flow is:

```text
Client Request
      ↓
Route
      ↓
Error occurs
      ↓
next(error)
      ↓
Error Handling Middleware
      ↓
HTTP Response
```

---

## The `next()` Function

Express provides the `next()` function to pass control to the next middleware.

Example:

```javascript
app.get("/users", (req, res, next) => {

    const error = new Error("Something went wrong");

    next(error);

});
```

When an error is passed to `next()`:

```javascript
next(error);
```

Express sends the error to error handling middleware.

---

## Error-Handling Middleware

Express error handling middleware has four parameters:

```javascript
(err, req, res, next)
```

Example:

```javascript
app.use((err, req, res, next) => {

    res.status(500).json({
        success: false,
        message: err.message
    });

});
```

The first parameter must be the error:

```text
err
```

---

## Creating an Error

JavaScript provides the `Error` object.

Example:

```javascript
const error = new Error("User not found");
```

The error can then be passed to the error middleware:

```javascript
next(error);
```

---

## Custom Status Code

An error can contain a custom status code.

Example:

```javascript
const error = new Error("User not found");

error.statusCode = 404;

next(error);
```

The centralized error handler can then use that status code.

---

## Centralized Error Handler

Example:

```javascript
app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});
```

Here:

```text
err.statusCode
→ Custom status code

500
→ Fallback status code
```

---

## Why Use Centralized Error Handling?

Without centralized error handling:

```javascript
app.get("/users", (req, res) => {

    try {

        // code

    } catch (error) {

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});
```

The same pattern may be repeated across many routes.

With centralized error handling:

```text
Route
  ↓
next(error)
  ↓
Central Error Handler
```

The error response can be handled in one place.

Benefits include:

* Less duplicate code
* Consistent error responses
* Easier maintenance
* Centralized logging
* Easier debugging

---

## 404 Not Found

A `404` status code means that the requested resource or route was not found.

Example:

```text
GET /abc
```

If `/abc` does not exist:

```text
404 Not Found
```

A simple 404 middleware can be created:

```javascript
app.use((req, res, next) => {

    const error = new Error("Route not found");

    error.statusCode = 404;

    next(error);

});
```

This should appear after the application routes.

---

## 500 Internal Server Error

A `500` status code represents an unexpected server side error.

Example:

```javascript
throw new Error("Database connection failed");
```

If no custom status code is provided, the centralized error handler can use:

```javascript
const statusCode = err.statusCode || 500;
```

Therefore:

```text
Custom status exists
→ Use custom status

No custom status
→ Use 500
```

---

## Error Middleware Order

Middleware order is important.

A typical structure is:

```text
Routes
   ↓
404 Handler
   ↓
Error Handler
```

Example:

```javascript
app.get("/api/users", (req, res) => {
    // route
});

app.use((req, res, next) => {
    // 404 handler
});

app.use((err, req, res, next) => {
    // error handler
});
```

The centralized error handler should be registered after the routes.

---

## Route Error Example

Example:

```javascript
app.get("/api/users/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {

        const error = new Error("User not found");

        error.statusCode = 404;

        return next(error);

    }

    res.json({
        success: true,
        user
    });

});
```

If the user does not exist:

```text
Route
  ↓
Create Error
  ↓
statusCode = 404
  ↓
next(error)
  ↓
Central Error Handler
  ↓
404 Response
```

---

## Try-Catch

`try-catch` can be used to handle synchronous errors.

Example:

```javascript
app.get("/api/error", (req, res, next) => {

    try {

        throw new Error("Something went wrong");

    } catch (error) {

        next(error);

    }

});
```

The error is passed to the centralized error handler.

---

## Consistent Error Responses

A backend should ideally return predictable error responses.

Example:

```json
{
  "success": false,
  "message": "User not found"
}
```

Another example:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

Keeping a consistent structure makes it easier for frontend applications to handle errors.

---

## Do Not Expose Sensitive Error Details

Development errors may contain useful debugging information.

However, production applications should avoid exposing sensitive internal details.

Avoid returning things such as:

```text
Database credentials
API keys
Internal file paths
Stack traces
Environment variables
```

Instead, return a safe message to the client.

Example:

```javascript
res.status(500).json({
    success: false,
    message: "Internal Server Error"
});
```

Detailed errors can be logged internally for debugging.

---

## Error Handling vs Validation

These are related but different concepts.

Validation checks whether input is valid:

```text
Email is required
Password must be at least 8 characters
```

Error handling manages what happens when something goes wrong:

```text
Invalid input
User not found
Database error
```

Validation errors can be passed to centralized error handling.

---

## Error Handling vs Logging

Error handling determines the response sent to the client.

Logging records information about what happened.

Example:

```javascript
console.error(err);
```

Later, a proper logging system can be used.

Conceptually:

```text
Error occurs
    ↓
Log error
    ↓
Handle error
    ↓
Send safe response
```

---

## Complete Example

```javascript
const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const users = [
    {
        id: 1,
        name: "Ahmed"
    },
    {
        id: 2,
        name: "Ali"
    },
    {
        id: 3,
        name: "Usman"
    }
];

app.get("/api/users", (req, res) => {

    res.json({
        success: true,
        users
    });

});

app.get("/api/users/:id", (req, res, next) => {

    try {

        const id = Number(req.params.id);

        const user = users.find(user => user.id === id);

        if (!user) {

            const error = new Error("User not found");

            error.statusCode = 404;

            return next(error);

        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        next(error);

    }

});

app.get("/api/error", (req, res, next) => {

    try {

        throw new Error("Something went wrong");

    } catch (error) {

        next(error);

    }

});

app.use((req, res, next) => {

    const error = new Error("Route not found");

    error.statusCode = 404;

    next(error);

});

app.use((err, req, res, next) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});
```

---

## Common Mistakes

* Forgetting to call `next(error)`.
* Using the wrong number of parameters in error middleware.
* Putting the error middleware before the routes.
* Returning `500` for every type of error.
* Forgetting to handle 404 routes.
* Exposing sensitive error details.
* Writing duplicate error handling code in every route.
* Confusing validation with error handling.
* Confusing logging with error handling.

---

## Interview Questions

* What is error handling?
* What is centralized error handling?
* What is the purpose of `next(error)`?
* How many parameters does Express error middleware have?
* Why must `err` be the first parameter?
* What is the difference between 404 and 500?
* Where should the error-handling middleware be placed?
* Why should error handling be centralized?
* How can you create a custom error?
* How can you attach a status code to an error?
* Why should sensitive error details not be exposed?
* What is the difference between error handling and logging?
* What is the difference between validation and error handling?

---

## Quick Revision

* Error handling manages errors in the backend.
* Express uses middleware for error handling.
* `next(error)` passes an error to error handling middleware.
* Error-handling middleware has four parameters.
* The format is `(err, req, res, next)`.
* The error middleware should be placed after routes.
* `404` means the requested resource or route was not found.
* `500` represents an unexpected server side error.
* Centralized error handling reduces duplicate code.
* Error responses should have a consistent structure.
* Sensitive internal error details should not be exposed.
* Errors can be logged internally for debugging.


