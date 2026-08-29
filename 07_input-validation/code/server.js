const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const validateRegister = (req, res, next) => {
    const { name, email, age, password } = req.body;

    // Required fields
    if (!name || !email || age === undefined || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Name type
    if (typeof name !== "string") {
        return res.status(400).json({
            message: "Name must be a string"
        });
    }

    // Name length
    if (name.length < 3) {
        return res.status(400).json({
            message: "Name must be at least 3 characters"
        });
    }

    // Email type
    if (typeof email !== "string") {
        return res.status(400).json({
            message: "Email must be a string"
        });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email"
        });
    }

    // Age type
    if (typeof age !== "number") {
        return res.status(400).json({
            message: "Age must be a number"
        });
    }

    // Age range
    if (age < 18 || age > 60) {
        return res.status(400).json({
            message: "Age must be between 18 and 60"
        });
    }

    // Password type
    if (typeof password !== "string") {
        return res.status(400).json({
            message: "Password must be a string"
        });
    }

    // Password length
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    next();
};

app.post("/register", validateRegister, (req, res) => {
    const { name, email, age } = req.body;

    res.status(201).json({
        message: "Registration data is valid",
        user: {
            name,
            email,
            age
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});