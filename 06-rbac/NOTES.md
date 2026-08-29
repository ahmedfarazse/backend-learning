# Role Based Access Control (RBAC)

## Introduction

RBAC stands for Role Based Access Control.

RBAC is an authorization approach where users are given roles, and access to resources is controlled based on those roles.

Basic flow:

```text
User
  ↓
Role
  ↓
Permissions
  ↓
Resource Access
````

---

## Authentication vs Authorization

Authentication answers:

```text
Who are you?
```

Example:

```text
Login
  ↓
Email + Password
  ↓
User verified
```

Authorization answers:

```text
What are you allowed to do?
```

Example:

```text
Authenticated User
  ↓
Can access this resource?
```

RBAC is a way to implement authorization using roles.

```text
User
  ↓
Role
  ↓
Allowed Access
```

---

## What Is a Role?

A role represents a user's access level.

Example:

```javascript
const user = {
  id: 1,
  name: "Ahmed",
  role: "admin"
};
```

Another user:

```javascript
const user = {
  id: 2,
  name: "Ali",
  role: "user"
};
```

---

## Common Roles

A backend application may have roles such as:

```text
Admin
Manager
User
```

Example permissions:

```text
Admin
→ Create
→ Read
→ Update
→ Delete

Manager
→ Create
→ Read
→ Update

User
→ Read
```

---

## Role-Based Access

Suppose an application has three users:

```javascript
const users = [
  {
    id: 1,
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: 2,
    email: "manager@example.com",
    role: "manager"
  },
  {
    id: 3,
    email: "user@example.com",
    role: "user"
  }
];
```

The role determines which resources the user can access.

---

## Authorization Middleware

Express middleware can be used to check roles.

Example:

```javascript
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};
```

The middleware receives an array of allowed roles.

Example:

```javascript
authorize(["admin"])
```

Only administrators are allowed.

---

## Multiple Roles

Multiple roles can be allowed on the same route.

Example:

```javascript
authorize(["admin", "manager"])
```

This means:

```text
Admin
→ Allowed

Manager
→ Allowed

User
→ Denied
```

---

## Middleware Order

Authentication should happen before authorization.

Correct order:

```javascript
app.get(
  "/admin",
  authenticate,
  authorize(["admin"]),
  (req, res) => {
    res.json({
      message: "Admin area accessed"
    });
  }
);
```

Flow:

```text
Request
  ↓
Authentication
  ↓
Identify User
  ↓
Authorization
  ↓
Check Role
  ↓
Route
```

---

## Why Authentication Comes First

Authorization needs to know who the user is.

For example:

```text
Authentication
→ req.user = admin
```

Then authorization can check:

```javascript
req.user.role
```

Without authentication, the server does not reliably know which user's role should be checked.

---

## 401 Unauthorized

HTTP status code `401` is used when authentication is missing or invalid.

Example:

```text
No valid authentication
  ↓
401 Unauthorized
```

Example response:

```javascript
return res.status(401).json({
  message: "Authentication required"
});
```

---

## 403 Forbidden

HTTP status code `403` is used when the user is authenticated but does not have permission to access the resource.

Example:

```text
Authenticated User
  ↓
Role = user
  ↓
Admin-only resource
  ↓
403 Forbidden
```

Example:

```javascript
return res.status(403).json({
  message: "Access denied"
});
```

---

## 401 vs 403

```text
401
→ Authentication problem
→ User is not properly authenticated

403
→ Authorization problem
→ User is authenticated but access is forbidden
```

Simple way to remember:

```text
401
→ Who are you?

403
→ I know who you are, but you cannot do this.
```

---

## Admin-Only Route

A route can be restricted to administrators.

Example:

```javascript
app.get(
  "/admin",
  authenticate,
  authorize(["admin"]),
  (req, res) => {
    res.json({
      message: "Admin area accessed"
    });
  }
);
```

Access:

```text
Admin
→ 200

Manager
→ 403

User
→ 403
```

---

## Manager Route

A route can allow both administrators and managers.

Example:

```javascript
app.get(
  "/manager",
  authenticate,
  authorize(["admin", "manager"]),
  (req, res) => {
    res.json({
      message: "Manager area accessed"
    });
  }
);
```

Access:

```text
Admin
→ 200

Manager
→ 200

User
→ 403
```

---

## Delete User Route

Only administrators can delete users.

Example:

```javascript
app.delete(
  "/users/:id",
  authenticate,
  authorize(["admin"]),
  (req, res) => {
    res.json({
      message: `User ${req.params.id} deleted`
    });
  }
);
```

Access:

```text
Admin
→ 200

Manager
→ 403

User
→ 403
```

---

## RBAC with JWT

RBAC can be combined with JWT authentication.

A JWT can contain a user's role.

Example:

```javascript
const token = jwt.sign(
  {
    id: user.id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m"
  }
);
```

After verifying the token:

```javascript
req.user = decoded;
```

The authorization middleware can then check:

```javascript
req.user.role
```

Flow:

```text
Login
  ↓
JWT Generated
  ↓
JWT Contains User Role
  ↓
JWT Verified
  ↓
req.user
  ↓
RBAC Middleware
  ↓
Role Checked
  ↓
Access Granted or Denied
```

---

## RBAC with Sessions

RBAC can also work with session based authentication.

Example:

```javascript
req.session.userId = user.id;
req.session.role = user.role;
```

After session verification:

```text
Session
  ↓
User
  ↓
Role
  ↓
Authorization
```

Therefore, RBAC is not limited to JWT.

It can be used with different authentication systems.

---

## Authentication and RBAC Flow

A complete backend flow can look like:

```text
Client
  ↓
Login
  ↓
Authentication
  ↓
User Identified
  ↓
Role Identified
  ↓
Authorization
  ↓
RBAC
  ↓
Access Granted / Denied
```

---

## RBAC Middleware Example

Complete authorization middleware:

```javascript
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};
```

Example:

```javascript
authorize(["admin"]);
```

Another example:

```javascript
authorize(["admin", "manager"]);
```

---

## Important Concept

RBAC does not authenticate the user.

Authentication identifies the user.

RBAC decides whether that authenticated user has permission based on their role.

```text
Authentication
→ Who are you?

RBAC
→ What can your role access?
```

---

## RBAC vs Permissions

Simple RBAC:

```text
Admin
→ Delete Users

Manager
→ Update Users

User
→ Read Users
```

In larger systems, permissions can be separated from roles:

```text
Permissions

user:read
user:create
user:update
user:delete
```

Roles can then contain permissions:

```text
Admin
→ user:read
→ user:create
→ user:update
→ user:delete

Manager
→ user:read
→ user:update

User
→ user:read
```

This provides more flexibility than checking only role names.

---

## Security Considerations

* Never trust a role supplied directly by the client.
* Role information should come from trusted server side data or a properly verified authentication mechanism.
* Always authenticate before performing authorization.
* Use `403` when an authenticated user lacks permission.
* Keep authorization logic centralized in middleware where practical.
* Do not rely only on frontend role checks.
* Backend authorization must always enforce access rules.

---

## Common Mistakes

* Confusing authentication with authorization.
* Returning `403` when authentication is missing instead of `401`.
* Checking roles before identifying the user.
* Trusting an unverified JWT role.
* Allowing the frontend to decide authorization.
* Hard coding authorization checks throughout every route.
* Assuming a user with a valid token can access every resource.
* Giving every authenticated user admin access.

---

## Interview Questions

* What is RBAC?
* What does RBAC stand for?
* What is the difference between authentication and authorization?
* What is a role?
* How does role based authorization work?
* What is authorization middleware?
* Why should authentication happen before authorization?
* What is the difference between `401` and `403`?
* How can RBAC work with JWT?
* How can RBAC work with sessions?
* Can one route allow multiple roles?
* Why should authorization be enforced on the backend?
* What is the difference between roles and permissions?

---

## Quick Revision

* RBAC stands for Role Based Access Control.
* RBAC is an authorization approach.
* Users are assigned roles.
* Roles determine what users can access.
* Authentication identifies the user.
* Authorization determines what the user can access.
* Authentication should happen before authorization.
* `401` means authentication is missing or invalid.
* `403` means the user is authenticated but access is forbidden.
* `authorize()` middleware can check allowed roles.
* Multiple roles can be allowed on the same route.
* RBAC can be combined with JWT.
* RBAC can also be combined with sessions.
* Backend authorization must enforce access control.
* Roles should come from trusted and verified sources.

