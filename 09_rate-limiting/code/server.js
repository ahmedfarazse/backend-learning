const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = 3000;

app.use(express.json());


// General API Rate Limiter
const usersLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: {
        message: "Too many requests to users API. Please try again later."
    }
});


// Login Rate Limiter
const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});


// Users Route
app.get("/api/users", usersLimiter, (req, res) => {
    res.json({
        message: "Users fetched successfully",
        users: [
            {
                id: 1,
                name: "Ahmed"
            },
            {
                id: 2,
                name: "Ali"
            }
        ]
    });
});


// Login Route
app.post("/login", loginLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    res.json({
        message: "Login request received"
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});