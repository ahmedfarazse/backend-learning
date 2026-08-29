# Input Validation

## Introduction

Input validation is the process of checking data received from a client before the backend processes or stores it.

A backend should never blindly trust incoming data.

Basic flow:

```text
Client
  ↓
Request Data
  ↓
Input Validation
  ↓
Valid?
  ↓
Yes → Continue
No  → Reject Request
````

---

## Why Input Validation Is Important

Clients can send unexpected, incomplete, or invalid data.

Example:

```json
{
  "name": "",
  "email": "invalid-email",
  "age": 15,
  "password": "123"
}
```

The backend should validate this data before processing it.

Input validation helps with:

* Data integrity
* Application reliability
* Security
* Preventing invalid data
* Consistent API behavior

---

## Frontend Validation vs Backend Validation

Frontend validation improves the user experience.

Example:

```text
Frontend
→ Show validation errors quickly
```

However, frontend validation cannot be trusted as a security boundary because users can bypass the frontend and send requests directly to the backend.

Therefore:

```text
Frontend Validation
→ User Experience

Backend Validation
→ Security + Data Integrity
```

Backend validation is mandatory.

---

## Required Fields

Required fields must be present in the request.

Example:

```javascript
const { name, email, age, password } = req.body;

if (!name || !email || age === undefined || !password) {
  return res.status(400).json({
    message: "All fields are required"
  });
}
```

`age === undefined` is used instead of `!age` because `0` is also a falsy value in JavaScript.

---

## String Validation

A field expected to be a string should be checked using `typeof`.

Example:

```javascript
if (typeof name !== "string") {
  return res.status(400).json({
    message: "Name must be a string"
  });
}
```

---

## String Length Validation

The length of a string can be checked using `.length`.

Example:

```javascript
if (name.length < 3) {
  return res.status(400).json({
    message: "Name must be at least 3 characters"
  });
}
```

Maximum length can also be checked:

```javascript
if (name.length > 50) {
  return res.status(400).json({
    message: "Name must not exceed 50 characters"
  });
}
```

---

## Email Validation

An email should be checked before accepting it.

A simple regular expression can be used:

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

Then:

```javascript
if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email"
  });
}
```

This is a basic validation approach.

Production applications may use established validation libraries for more complete validation.

---

## Number Validation

If a field should contain a number, check its type.

Example:

```javascript
if (typeof age !== "number") {
  return res.status(400).json({
    message: "Age must be a number"
  });
}
```

---

## Range Validation

Values can also be restricted to a specific range.

Example:

```javascript
if (age < 18 || age > 60) {
  return res.status(400).json({
    message: "Age must be between 18 and 60"
  });
}
```

This means:

```text
18 ≤ age ≤ 60
```

---

## Password Validation

Password length can be validated before processing.

Example:

```javascript
if (password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters"
  });
}
```

However, validation does not protect the password itself.

Password security requires password hashing before storing the password.

```text
Input Validation
→ Is the password acceptable?

Password Hashing
→ How should the password be stored securely?
```

These are different responsibilities.

---

## Validation Middleware

Validation logic can be placed inside middleware.

Example:

```javascript
const validateRegister = (req, res, next) => {
  const { name, email, age, password } = req.body;

  if (!name || !email || age === undefined || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (typeof name !== "string") {
    return res.status(400).json({
      message: "Name must be a string"
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters"
    });
  }

  next();
};
```

---

## Using Validation Middleware

The middleware can be placed before the controller or route handler.

Example:

```javascript
app.post(
  "/register",
  validateRegister,
  (req, res) => {
    res.status(201).json({
      message: "Registration data is valid"
    });
  }
);
```

Flow:

```text
POST /register
      ↓
validateRegister
      ↓
Valid?
  ↓       ↓
Yes      No
 ↓        ↓
next()   400
 ↓
Route Handler
```

---

## Complete Validation Example

```javascript
const validateRegister = (req, res, next) => {
  const { name, email, age, password } = req.body;

  if (!name || !email || age === undefined || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (typeof name !== "string") {
    return res.status(400).json({
      message: "Name must be a string"
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: "Name must be at least 3 characters"
    });
  }

  if (typeof email !== "string") {
    return res.status(400).json({
      message: "Email must be a string"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email"
    });
  }

  if (typeof age !== "number") {
    return res.status(400).json({
      message: "Age must be a number"
    });
  }

  if (age < 18 || age > 60) {
    return res.status(400).json({
      message: "Age must be between 18 and 60"
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      message: "Password must be a string"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  next();
};
```

---

## Validation and HTTP Status Codes

Invalid client input commonly results in:

```text
400 Bad Request
```

Example:

```javascript
return res.status(400).json({
  message: "Invalid email"
});
```

Successful resource creation can use:

```text
201 Created
```

Example:

```javascript
res.status(201).json({
  message: "Registration successful"
});
```

---

## Validation Libraries

Manual validation is useful for understanding the fundamentals.

For larger applications, validation libraries can reduce repetitive code.

Common Node.js validation libraries include:

* Joi
* Zod
* express-validator

Example concept:

```text
Request
  ↓
Validation Schema
  ↓
Valid?
  ↓
Controller
```

The important concept is understanding validation before relying on a library.

---

## Input Validation vs Sanitization

Validation and sanitization are related but different.

### Validation

Checks whether input meets the expected rules.

```text
Is this email valid?
```

### Sanitization

Cleans or transforms input into an appropriate form.

```text
Remove unnecessary whitespace
Normalize input
```

Example:

```javascript
const name = req.body.name.trim();
```

Validation asks:

```text
Is the input acceptable?
```

Sanitization asks:

```text
Can the input be cleaned or normalized?
```

---

## Security Considerations

* Never trust client input.
* Always validate data on the backend.
* Validate data types.
* Validate required fields.
* Validate string lengths.
* Validate numeric ranges.
* Validate expected formats.
* Do not rely only on frontend validation.
* Do not store plaintext passwords.
* Use password hashing for passwords.
* Use established validation libraries when application complexity increases.

---

## Common Mistakes

* Trusting frontend validation.
* Not validating API requests.
* Checking only whether a field exists.
* Not checking data types.
* Accepting unlimited string lengths.
* Accepting invalid email formats.
* Forgetting numeric range validation.
* Thinking validation is the same as password hashing.
* Writing repeated validation logic in every route.
* Returning success responses for invalid input.

---

## Interview Questions

* What is input validation?
* Why is backend validation necessary?
* Why can't frontend validation be trusted?
* What is the difference between validation and sanitization?
* How do you validate a string?
* How do you validate a number?
* How do you validate an email?
* What HTTP status code is commonly used for invalid input?
* Why should validation be implemented as middleware?
* What is the difference between validation and password hashing?
* Name some Node.js validation libraries.
* What is the purpose of `next()` in validation middleware?

---

## Quick Revision

* Input validation checks incoming data before processing it.
* Backend validation is mandatory.
* Frontend validation should not be treated as a security boundary.
* Required fields should be checked.
* Data types should be validated.
* String lengths should be validated.
* Numeric ranges should be validated.
* Email formats should be validated.
* Invalid input commonly returns `400 Bad Request`.
* Validation middleware can keep route handlers cleaner.
* Validation is different from sanitization.
* Validation is different from password hashing.
* Joi, Zod, and express-validator are common validation libraries.
* Never blindly trust client input.
