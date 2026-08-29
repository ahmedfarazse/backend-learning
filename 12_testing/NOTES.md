# Testing Basics

## Introduction

Testing is the process of checking whether an application behaves as expected.

Testing helps developers find bugs and verify that existing functionality continues to work after code changes.

---

## Why Testing Is Important

Testing helps with:

- Finding bugs
- Verifying expected behavior
- Preventing regressions
- Improving code reliability
- Making changes safer
- Automating repeated checks

Without automated testing, developers may need to manually test the same functionality again and again.

---

## Manual Testing

Manual testing means testing an application by manually performing actions.

For an API, this can be done using tools such as Postman.

Example:

```text
Postman
   ↓
Send Request
   ↓
Check Response
   ↓
Check Status Code
````

Manual testing is useful, but it becomes inefficient when an application has many endpoints and features.

---

## Automated Testing

Automated testing uses code to test other code.

Example:

```text
Test Code
    ↓
Run Application
    ↓
Send Request
    ↓
Check Result
    ↓
PASS / FAIL
```

Automated tests can be run repeatedly without manually sending each request.

---

## Types of Testing

Some common types of testing are:

```text
Unit Testing
Integration Testing
API Testing
End-to-End Testing
```

---

## Unit Testing

Unit testing tests a small, isolated part of an application.

Example:

```javascript
function add(a, b) {
    return a + b;
}
```

A unit test can check:

```text
add(10, 20)
Expected: 30
```

The function is tested independently.

---

## Integration Testing

Integration testing checks whether multiple parts of an application work correctly together.

Example:

```text
API Route
    ↓
Controller
    ↓
Service
    ↓
Database
```

Instead of testing only one function, integration testing checks how multiple components interact.

---

## API Testing

API testing checks whether backend endpoints behave as expected.

Example:

```text
GET /api/users
```

The test can check:

```text
Status Code → 200
success → true
users → Array
```

---

## Assertions

An assertion checks whether an actual result matches an expected result.

Example:

```javascript
assert.strictEqual(response.status, 200);
```

This means:

```text
Actual status
      ↓
Compare
      ↓
Expected 200
```

If they match:

```text
PASS
```

If they do not match:

```text
FAIL
```

---

## Node.js Built-in Test Runner

Node.js provides a built in test runner.

It can be imported using:

```javascript
const test = require("node:test");
```

Assertions can be imported using:

```javascript
const assert = require("node:assert");
```

This allows basic tests to be written without installing a separate testing framework.

---

## Basic Test

Example:

```javascript
const test = require("node:test");
const assert = require("node:assert");

test("addition should return correct result", () => {

    const result = 2 + 3;

    assert.strictEqual(result, 5);

});
```

Run the test:

```bash
node --test
```

---

## `assert.strictEqual()`

`assert.strictEqual()` checks whether two values are strictly equal.

Example:

```javascript
assert.strictEqual(5, 5);
```

This passes.

Example:

```javascript
assert.strictEqual(5, 10);
```

This fails.

---

## `assert.ok()`

`assert.ok()` checks whether a value is truthy.

Example:

```javascript
assert.ok(true);
```

Another example:

```javascript
assert.ok(Array.isArray(users));
```

This can be useful for checking that a response contains an array.

---

## Testing an Express API

An Express API can be tested by sending HTTP requests.

Example:

```javascript
const response = await fetch(
    "http://localhost:3001/api/users"
);
```

The response can then be checked.

Example:

```javascript
assert.strictEqual(response.status, 200);
```

---

## Testing Response Data

The response body can be converted to JSON:

```javascript
const data = await response.json();
```

Then specific values can be tested:

```javascript
assert.strictEqual(data.success, true);
```

---

## Testing Successful Requests

Example:

```text
GET /api/users
```

Expected:

```text
Status → 200
success → true
users → Array
```

Test:

```javascript
assert.strictEqual(response.status, 200);

assert.strictEqual(data.success, true);

assert.ok(Array.isArray(data.users));
```

---

## Testing Not Found Errors

Example:

```text
GET /api/users/999
```

If the user does not exist:

```text
404 Not Found
```

The test can verify:

```javascript
assert.strictEqual(response.status, 404);

assert.strictEqual(data.success, false);

assert.strictEqual(
    data.message,
    "User not found"
);
```

---

## Testing Validation

Example:

```text
POST /login
```

with an empty body:

```json
{}
```

Expected:

```text
400 Bad Request
```

The test can verify:

```javascript
assert.strictEqual(response.status, 400);

assert.strictEqual(data.success, false);
```

---

## Testing Successful Login

Example request:

```json
{
    "email": "ahmed@example.com",
    "password": "12345678"
}
```

Expected:

```text
Status → 200
success → true
```

The test verifies that valid input produces the expected response.

---

## Test Lifecycle

The Node.js test runner provides hooks that can run before or after tests.

Example:

```javascript
test.before(() => {

    server = app.listen(3001);

});
```

This starts the test server before the tests run.

After the tests:

```javascript
test.after(() => {

    server.close();

});
```

This closes the server.

---

## Why Use a Separate Test Port?

The practice uses:

```text
3001
```

for the test server.

This helps avoid conflicts with another development server that may already be running on:

```text
3000
```

---

## Test Flow

A basic API test follows this process:

```text
Test
  ↓
Send HTTP Request
  ↓
Receive Response
  ↓
Read Response Body
  ↓
Check Status Code
  ↓
Check Response Data
  ↓
PASS / FAIL
```

---

## Testing Success and Failure

Good API tests should cover both successful and unsuccessful scenarios.

Example:

```text
Valid Request
    ↓
200
```

and:

```text
Invalid Request
    ↓
400
```

and:

```text
Resource Not Found
    ↓
404
```

Testing only successful requests is not enough.

---

## Testing and Previous Backend Topics

Testing can be used with the topics learned earlier.

Examples:

```text
Authentication
→ Test valid and invalid login

Authorization
→ Test allowed and denied access

Password Hashing
→ Test password verification

JWT
→ Test valid and invalid tokens

RBAC
→ Test different user roles

Validation
→ Test valid and invalid input

CORS
→ Test allowed origins

Rate Limiting
→ Test excessive requests

Error Handling
→ Test error responses

Logging
→ Verify important events are recorded
```

This is why testing is important after learning backend fundamentals.

---

## Test Failure

A failed test does not necessarily mean the testing code is wrong.

It may indicate that:

```text
Application behavior is wrong
```

or:

```text
Expected result is wrong
```

or:

```text
Test itself contains a mistake
```

The failure should be investigated instead of simply changing the expected result.

---

## Common Mistakes

* Testing only successful cases.
* Not testing error responses.
* Not checking status codes.
* Not checking response data.
* Writing tests that do not verify meaningful behavior.
* Ignoring failed tests.
* Depending only on manual Postman testing.
* Forgetting to close test servers.
* Mixing test code with application code unnecessarily.
* Using real sensitive credentials in tests.

---

## Best Practices

* Test important application behavior.
* Test both success and failure cases.
* Keep tests independent where possible.
* Use clear test names.
* Make tests repeatable.
* Avoid real production data.
* Avoid real passwords and secrets.
* Run tests after important code changes.
* Investigate failed tests instead of ignoring them.

---

## Interview Questions

* What is software testing?
* Why is testing important?
* What is automated testing?
* What is unit testing?
* What is integration testing?
* What is API testing?
* What is an assertion?
* What is `assert.strictEqual()`?
* What is `assert.ok()`?
* What is the Node.js built in test runner?
* How do you test an Express API?
* Why should both success and error cases be tested?
* What is a test lifecycle?
* Why should a test server be closed after testing?
* What is the difference between manual and automated testing?

---

## Quick Revision

* Testing checks whether software behaves as expected.
* Automated tests use code to perform checks.
* Unit testing tests small isolated pieces of code.
* Integration testing checks multiple components working together.
* API testing checks backend endpoints.
* Assertions compare actual and expected results.
* Node.js provides a built in test runner.
* `node:test` is used to create tests.
* `node:assert` provides assertion methods.
* HTTP status codes should be tested.
* Response data should also be tested.
* Both success and failure scenarios should be tested.
* Tests help prevent regressions.
* Failed tests should be investigated.
* Sensitive credentials should not be used in tests.
