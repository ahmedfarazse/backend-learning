# Password Hashing

## Introduction

Password hashing is an important security practice used to protect user passwords in backend applications.

Passwords should never be stored as plain text in a database.

Instead, the password is converted into a hash before being stored.

---

## Why Hash Passwords?

Storing passwords directly in a database is insecure.

Without hashing:

```text
User Password
     ↓
Database
     ↓
mypassword123
```

If the database is compromised, attackers can see the actual passwords.

With hashing:

```text
User Password
     ↓
Hashing
     ↓
Password Hash
     ↓
Database
```

The database stores the hash instead of the original password.

---

## Plaintext Password

A plaintext password is the original password entered by the user.

Example:

```text
mypassword123
```

Storing this directly in a database is bad practice.

---

## Hashing

Hashing converts data into a hash value.

For passwords:

```text
mypassword123
       ↓
    Hashing
       ↓
$2b$10$...
```

Password hashing is designed to be one-way.

The original password should not be recovered by simply reversing the hash.

---

## Hashing vs Encryption

Hashing and encryption are different.

### Hashing

Hashing is generally one-way.

```text
Password
    ↓
  Hash
    ↓
Hash Value
```

The original password is not simply converted back from the hash.

### Encryption

Encryption is reversible when the correct key is available.

```text
Original Data
     ↓
  Encryption
     ↓
Encrypted Data
     ↓
  Decryption
     ↓
Original Data
```

For password storage, hashing is used instead of encryption.

---

## Salt

A salt is a random value used during password hashing.

It helps ensure that the same password does not always produce the same hash.

Example:

```text
User 1:

password123
    +
Salt A
    ↓
Hash A
```

```text
User 2:

password123
    +
Salt B
    ↓
Hash B
```

The passwords are the same, but the resulting hashes can be different.

Modern password hashing algorithms such as bcrypt handle salt generation as part of the hashing process.

---

## Password Hashing Algorithms

Common password hashing algorithms include:

* bcrypt
* Argon2
* scrypt

In this project, bcrypt is used for practice.

---

## bcrypt

bcrypt is a password hashing algorithm commonly used for securely hashing passwords.

Install bcrypt:

```bash
npm install bcrypt
```

---

## Hashing a Password with bcrypt

```javascript
const bcrypt = require("bcrypt");

const password = "mypassword123";

const hashPassword = async () => {
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Hashed Password:", hashedPassword);
};

hashPassword();
```

The result will be a password hash instead of the original password.

---

## Salt Rounds / Cost Factor

In this code:

```javascript
bcrypt.hash(password, 10);
```

The `10` represents the bcrypt cost factor.

It controls how computationally expensive the hashing process is.

A higher cost generally means:

```text
More computation
      ↓
More time required
      ↓
More expensive password guessing attacks
```

The cost should be chosen with a balance between security and application performance.

---

## Salt vs Cost Factor

Salt and cost factor are different concepts.

### Salt

Helps make hashes different even when passwords are the same.

### Cost Factor

Controls how computationally expensive the hashing process is.

```text
Salt
→ Helps produce unique hashes

Cost Factor
→ Controls hashing difficulty
```

---

## Verifying a Password

During login, the backend does not decrypt the stored hash.

Instead, bcrypt compares the entered password with the stored hash.

```javascript
const isMatch = await bcrypt.compare(
  password,
  storedHash
);
```

If the password is correct:

```text
true
```

If the password is incorrect:

```text
false
```

Example:

```javascript
const password = "mypassword123";

const isMatch = await bcrypt.compare(
  password,
  storedHash
);

console.log(isMatch);
```

---

## Password Verification Flow

### Registration

```text
User enters password
        ↓
Password hashing
        ↓
Store password hash
        ↓
Database
```

### Login

```text
User enters password
        ↓
Find user
        ↓
Compare password with stored hash
        ↓
Correct?
   ↓          ↓
  Yes         No
   ↓          ↓
Login       Reject
```

---

## Register Example

```javascript
const hashedPassword = await bcrypt.hash(password, 10);

const user = {
  email: "ahmed@example.com",
  password: hashedPassword
};
```

The database should store the hash:

```text
$2b$10$...
```

not:

```text
mypassword123
```

---

## Login Example

```javascript
const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid credentials"
  });
}
```

If the password matches, the user can continue with the login process.

---

## Important Security Rule

Never store plaintext passwords.

Bad:

```javascript
const user = {
  email: "ahmed@example.com",
  password: "mypassword123"
};
```

Better:

```javascript
const user = {
  email: "ahmed@example.com",
  password: "$2b$10$..."
};
```

In a real application, it is also better to name the field `passwordHash` to make its purpose clear.

---

## Best Practices

* Never store plaintext passwords.
* Use a dedicated password hashing algorithm.
* Use bcrypt, Argon2, or another suitable password hashing algorithm.
* Never log plaintext passwords.
* Never send passwords back in API responses.
* Use password comparison functions provided by the hashing library.
* Choose a suitable cost factor based on security and performance requirements.
* Do not implement your own password hashing algorithm.

---

## Common Mistakes

* Storing passwords as plaintext.
* Encrypting passwords instead of hashing them.
* Using weak or outdated hashing methods.
* Using Base64 as password protection.
* Comparing passwords incorrectly.
* Logging passwords during development.
* Returning passwords in API responses.
* Thinking that a hash can simply be decrypted.

---

## Interview Questions

* What is password hashing?
* Why should passwords never be stored as plaintext?
* What is the difference between hashing and encryption?
* What is a salt?
* Why does bcrypt generate different hashes for the same password?
* What is bcrypt?
* What does the cost factor in bcrypt mean?
* How do you verify a hashed password?
* Does the backend decrypt a password hash during login?
* Why is Base64 not a password hashing algorithm?

---

## Quick Revision

* Never store plaintext passwords.
* Hash passwords before storing them.
* Hashing is generally one-way.
* Encryption is reversible with the correct key.
* Salt helps produce different hashes for the same password.
* bcrypt is a password hashing algorithm.
* The bcrypt cost factor controls computational difficulty.
* `bcrypt.hash()` creates a password hash.
* `bcrypt.compare()` verifies a password.
* Passwords should never be logged or returned in API responses.
