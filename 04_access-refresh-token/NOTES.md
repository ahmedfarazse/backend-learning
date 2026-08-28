# Access and Refresh Tokens

## Introduction

Access tokens and refresh tokens are commonly used together in authentication systems.

An access token is used to access protected resources, while a refresh token is used to obtain a new access token when the current access token expires.

---

## Access Token

An access token is a short lived token used to access protected APIs or resources.

Example:

```text
Client
  ↓
Access Token
  ↓
Protected API
  ↓
Backend
  ↓
Access Granted
````

---

## Refresh Token

A refresh token is used to obtain a new access token after the current access token expires.

Example:

```text
Access Token Expires
        ↓
Refresh Token
        ↓
Backend Verification
        ↓
New Access Token
```

A refresh token is generally longer lived than an access token.

---

## Why Use Both?

Using only a long lived access token can increase security risk.

Example:

```text
Access Token
     ↓
30 Days
```

If the token is stolen, an attacker may be able to use it for a long period.

Instead, a short lived access token can be used:

```text
Access Token
     ↓
15 Minutes
     ↓
Expires
```

The refresh token can then be used to obtain a new access token without requiring the user to enter their password again.

---

## Access Token vs Refresh Token

| Access Token                  | Refresh Token                     |
| ----------------------------- | --------------------------------- |
| Used to access protected APIs | Used to obtain a new access token |
| Usually short lived           | Usually longer lived              |
| Sent frequently               | Sent less frequently              |
| Expires relatively quickly    | Expires later                     |
| Used for API requests         | Used for token renewal            |

---

## Authentication Flow

### Login

```text
User
  ↓
Email + Password
  ↓
Backend verifies credentials
  ↓
Access Token + Refresh Token
  ↓
Client
```

---

## Access Token Flow

The client uses the access token to access protected resources.

```text
Client
  ↓
Access Token
  ↓
GET /profile
  ↓
Backend verifies token
  ↓
Protected Resource
```

The access token is commonly sent using the Authorization header.

```text
Authorization: Bearer <access-token>
```

---

## Access Token Expiration

Access tokens are usually short lived.

Example:

```javascript
const token = jwt.sign(
  user,
  process.env.JWT_ACCESS_SECRET,
  {
    expiresIn: "15m"
  }
);
```

After the token expires, the backend rejects it.

Example:

```text
GET /profile
      ↓
Expired Access Token
      ↓
401 Unauthorized
```

---

## Refresh Token Flow

When the access token expires, the client can use the refresh token.

```text
Access Token Expires
        ↓
Refresh Token
        ↓
POST /refresh
        ↓
Backend verifies Refresh Token
        ↓
New Access Token
```

The refresh token does not directly replace the access token for normal API requests.

---

## Generating an Access Token

```javascript
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m"
    }
  );
};
```

The access token contains limited user information and has a short expiration time.

---

## Generating a Refresh Token

```javascript
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );
};
```

The refresh token uses a separate secret and has a longer expiration time.

---

## Separate Secrets

Access and refresh tokens can use different secrets.

Example:

```env
JWT_ACCESS_SECRET=my-access-secret
JWT_REFRESH_SECRET=my-refresh-secret
```

Using separate secrets provides separation between the two token types.

Secrets should not be hard-coded in production code.

---

## Login Example

After successful login, the server can generate both tokens.

```javascript
const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

res.json({
  message: "Login successful",
  accessToken,
  refreshToken
});
```

---

## Protected Route

A protected route can verify the access token.

```javascript
app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});
```

The client sends:

```text
Authorization: Bearer <access-token>
```

---

## Refresh Endpoint

A refresh endpoint can verify the refresh token and issue a new access token.

```javascript
app.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token required"
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = generateAccessToken({
      id: decoded.id
    });

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });
  }
});
```

---

## Refresh Token Storage

In the practice project, refresh tokens were stored in memory:

```javascript
const refreshTokens = [];
```

This is useful for learning but is not suitable for a production application.

If the server restarts:

```text
Server Restart
     ↓
Memory Cleared
     ↓
Refresh Tokens Lost
```

Production applications need proper persistent token management.

---

## Logout

A refresh token can be revoked during logout.

Example:

```javascript
const index = refreshTokens.indexOf(refreshToken);

if (index !== -1) {
  refreshTokens.splice(index, 1);
}
```

After revocation, the refresh token should no longer be accepted.

---

## Refresh Token Rotation

Refresh token rotation means issuing a new refresh token when the existing refresh token is used.

Example:

```text
Refresh Token A
      ↓
Used
      ↓
New Access Token
      +
New Refresh Token B
      ↓
Invalidate Token A
```

This can reduce the impact of a stolen refresh token.

---

## Security Considerations

The refresh token is generally more sensitive because it can be used to obtain new access tokens and is usually valid for a longer period.

Important practices:

* Keep access tokens short lived.
* Protect refresh tokens carefully.
* Store secrets in environment variables.
* Use HTTPS in production.
* Implement token expiration.
* Consider refresh token rotation.
* Revoke refresh tokens when required.
* Do not store tokens or secrets in GitHub.

---

## Common Mistakes

* Making access tokens unnecessarily long lived.
* Using refresh tokens as normal API access tokens.
* Storing refresh tokens insecurely.
* Never expiring refresh tokens.
* Not revoking refresh tokens when required.
* Assuming in memory refresh token storage is production ready.
* Hard coding secrets in production code.

---

## Interview Questions

* What is an access token?
* What is a refresh token?
* What is the difference between access and refresh tokens?
* Why are access tokens usually short lived?
* Why do we need refresh tokens?
* What happens when an access token expires?
* Which token is generally more sensitive?
* What is refresh token rotation?
* What is refresh token revocation?
* Why should refresh tokens be protected carefully?
* Why is storing refresh tokens in an in-memory array not suitable for production?
* Can a refresh token directly replace an access token for API requests?

---

## Quick Revision

* Access tokens are used to access protected APIs.
* Refresh tokens are used to obtain new access tokens.
* Access tokens are usually short-lived.
* Refresh tokens are usually longer-lived.
* Access tokens are commonly sent using the Authorization header.
* Refresh tokens should be protected carefully.
* Access token expiration limits the lifetime of a stolen access token.
* Refresh token rotation can improve security.
* Refresh token revocation can invalidate a refresh token.
* In memory refresh token storage is only suitable for learning.
* Secrets should be stored securely using environment variables.

