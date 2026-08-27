
// Mini Mini Project


const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const PORT = 3000;

const users = [];

// Register
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: users.length + 1,
        email,
        password: hashedPassword
    };

    users.push(user);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user.id,
            email: user.email
        }
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    res.json({
        message: "Login successful"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});