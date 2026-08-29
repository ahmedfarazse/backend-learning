const express = require("express");

const app = express();

app.use(express.json());


// Users
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


// Simple function for unit testing
function add(a, b) {
    return a + b;
}


// GET /api/users
app.get("/api/users", (req, res) => {

    res.status(200).json({
        success: true,
        users
    });

});


// GET /api/users/:id
app.get("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {

        return res.status(404).json({
            success: false,
            message: "User not found"
        });

    }

    res.status(200).json({
        success: true,
        user
    });

});


// POST /login
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }

    res.status(200).json({
        success: true,
        message: "Login successful"
    });

});


module.exports = {
    app,
    add
};