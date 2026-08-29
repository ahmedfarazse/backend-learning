const test = require("node:test");

const assert = require("node:assert");

const { app, add } = require("../code/app");


// Start test server
let server;

test.before(() => {

    server = app.listen(3001);

});


// Close test server
test.after(() => {

    server.close();

});


// Unit Test
test("add function should return correct result", () => {

    const result = add(10, 20);

    assert.strictEqual(result, 30);

});


// API Test - Get all users
test("GET /api/users should return 200 and users", async () => {

    const response = await fetch(
        "http://localhost:3001/api/users"
    );

    const data = await response.json();

    assert.strictEqual(response.status, 200);

    assert.strictEqual(data.success, true);

    assert.ok(Array.isArray(data.users));

});


// API Test - Get existing user
test("GET /api/users/1 should return 200", async () => {

    const response = await fetch(
        "http://localhost:3001/api/users/1"
    );

    const data = await response.json();

    assert.strictEqual(response.status, 200);

    assert.strictEqual(data.success, true);

    assert.strictEqual(data.user.id, 1);

});


// API Test - User not found
test("GET /api/users/999 should return 404", async () => {

    const response = await fetch(
        "http://localhost:3001/api/users/999"
    );

    const data = await response.json();

    assert.strictEqual(response.status, 404);

    assert.strictEqual(data.success, false);

    assert.strictEqual(data.message, "User not found");

});


// API Test - Login validation
test("POST /login without email and password should return 400", async () => {

    const response = await fetch(
        "http://localhost:3001/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({})
        }
    );

    const data = await response.json();

    assert.strictEqual(response.status, 400);

    assert.strictEqual(data.success, false);

    assert.strictEqual(
        data.message,
        "Email and password are required"
    );

});


// API Test - Successful login
test("POST /login with email and password should return 200", async () => {

    const response = await fetch(
        "http://localhost:3001/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: "ahmed@example.com",
                password: "12345678"
            })
        }
    );

    const data = await response.json();

    assert.strictEqual(response.status, 200);

    assert.strictEqual(data.success, true);

    assert.strictEqual(
        data.message,
        "Login successful"
    );

});