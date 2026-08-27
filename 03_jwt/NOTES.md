### `03-jwt/notes.md`

# JSON Web Token (JWT)

## Introduction

JWT stands for JSON Web Token.

JWT is a token format commonly used in backend authentication.

After a user successfully logs in, the server can generate a JWT and send it to the client.

The client can then send the JWT with future requests to protected routes.

---

## Why Use JWT?

A user should not send their password with every request.

Instead, the user logs in once:

```text
User
  ↓
Email + Password
  ↓
Backend verifies password
  ↓
JWT generated
  ↓
Client receives JWT
```

Future requests can then use the JWT:

```text
Client
  ↓
JWT
  ↓
Backend
  ↓
JWT verification
  ↓
Protected resource
```

---

## JWT Structure

A JWT consists of three parts:

```text
Header.Payload.Signature
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

The three parts are:

* Header
* Payload
* Signature

---

## Header

The header contains information about the token.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

`alg` represents the signing algorithm.

`typ` represents the token type.

---

## Payload

The payload contains claims.

Example:

```json
{
  "userId": 1,
  "role": "user"
}
```

Common registered claims include:

* `sub`
* `iat`
* `exp`

Custom claims can also be included.

---

## JWT Payload Is Not Encrypted

JWT payloads are normally encoded, not encrypted.

Therefore, sensitive information should not be stored in the payload.

Bad:

```json
{
  "userId": 1,
  "password": "mypassword123"
}
```

Better:

```json
{
  "userId": 1,
  "role": "user"
}
```

Do not put passwords, secrets, or other sensitive information in a JWT payload.

---

## Signature

The signature is used to verify the integrity and authenticity of the token.

Conceptually:

```text
Header
   +
Payload
   +
Secret / Key
   ↓
Signature
```

When the backend receives a JWT, it can verify the signature.

If the token has been modified, verification can fail.

---

## JWT Is Not Encryption

A common mistake is thinking that JWT means encrypted data.

JWTs are commonly signed rather than encrypted.

```text
Signed JWT
→ Integrity and authenticity

Encrypted Data
→ Confidentiality
```

Therefore, JWT payloads should not contain sensitive information simply because they are inside a token.

---

## Generate a JWT

The `jsonwebtoken` package can be used to create JWTs.

Install it:

```bash
npm install jsonwebtoken
```

Example:

```javascript
const jwt = require("jsonwebtoken");

const user = {
  id: 1,
  role: "user"
};

const secret = "my-secret-key";

const token = jwt.sign(
  user,
  secret,
  {
    expiresIn: "1h"
  }
);

console.log(token);
```

`jwt.sign()` creates the token.

---

## JWT Secret

The secret is used when signing and verifying the token.

Example:

```javascript
const secret = "my-secret-key";
```

In a real application, secrets should not be hard-coded in the source code.

Instead, environment variables should be used.

Example:

```env
JWT_SECRET=your_secret_here
```

The `.env` file should not be committed to GitHub.

---

## Verify a JWT

A JWT can be verified using `jwt.verify()`.

```javascript
const decoded = jwt.verify(
  token,
  secret
);

console.log(decoded);
```

If the token is valid, the decoded payload is returned.

If the token is invalid, modified, or expired, verification fails.

---

## JWT Authentication Middleware

JWT verification can be placed inside Express middleware.

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};
```

The decoded user information can be attached to the request:

```javascript
req.user = decoded;
```

The next middleware or route can then access:

```javascript
req.user
```

---

## Protected Routes

A protected route can use the authentication middleware.

```javascript
app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});
```

The request must contain a valid JWT before the route can be accessed.

---

## Authorization Header

JWTs are commonly sent using the `Authorization` header.

Format:

```text
Authorization: Bearer <JWT>
```

For example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Here:

```text
Authorization
→ HTTP request header

Bearer
→ Authentication scheme

JWT
→ The actual token
```

---

## JWT Authentication Flow

A typical login flow:

```text
User
  ↓
POST /login
  ↓
Email + Password
  ↓
Verify Password
  ↓
Generate JWT
  ↓
Send JWT to Client
```

Future request:

```text
Client
  ↓
GET /profile
  ↓
Authorization: Bearer JWT
  ↓
JWT Verification
  ↓
Authenticated User
  ↓
Protected Resource
```

---

## JWT Expiration

JWTs can have an expiration time.

Example:

```javascript
const token = jwt.sign(
  user,
  secret,
  {
    expiresIn: "1h"
  }
);
```

After the token expires, it can no longer be used successfully for authentication.

Short-lived access tokens are commonly used with refresh tokens.

---

## JWT vs Password

Password and JWT have different purposes.

### Password

Used to verify the user's identity during login.

### JWT

Used after successful authentication to represent the authenticated session/request context.

Flow:

```text
Password
   ↓
Verification
   ↓
JWT
   ↓
Future Requests
```

---

## JWT vs Session

JWT based authentication and session-based authentication are different approaches.

### JWT

The token carries claims that the server can verify.

### Session

The server usually stores session information and the client sends a session identifier.

Both approaches can be secure when implemented correctly.

---

## Best Practices

* Keep JWT secrets secure.
* Store secrets in environment variables.
* Use token expiration.
* Do not store passwords in JWT payloads.
* Do not store sensitive information in JWT payloads.
* Verify JWTs before allowing access to protected routes.
* Use HTTPS in production.
* Keep access tokens reasonably short-lived.
* Use refresh tokens when longer-lived authentication is required.

---

## Common Mistakes

* Thinking JWT payloads are encrypted.
* Storing passwords inside JWTs.
* Hard-coding JWT secrets in production code.
* Accepting JWTs without verifying them.
* Forgetting token expiration.
* Trusting decoded JWT data without verification.
* Sending JWTs without using HTTPS in production.
* Confusing JWT authentication with authorization.

---

## Interview Questions

* What is JWT?
* What does JWT stand for?
* What are the three parts of a JWT?
* What is the purpose of the header?
* What is stored in the payload?
* What is the purpose of the signature?
* Is a JWT encrypted?
* How do you verify a JWT?
* What is the `Authorization` header?
* What does `Bearer` mean?
* Why should JWT secrets be stored in environment variables?
* What is JWT expiration?
* What is the difference between JWT and session-based authentication?

---

## Quick Revision

* JWT stands for JSON Web Token.
* JWT consists of Header, Payload, and Signature.
* The payload contains claims.
* JWT payloads are normally encoded, not encrypted.
* The signature helps verify token integrity and authenticity.
* `jwt.sign()` creates a JWT.
* `jwt.verify()` verifies a JWT.
* JWTs can protect backend routes.
* JWTs are commonly sent using `Authorization: Bearer <token>`.
* JWT secrets should be stored securely.
* JWTs should have an appropriate expiration time.
