const express = require("express");
const session = require("express-session");
require("dotenv").config();

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    })
);

const users = [
    {
        id: 1,
        email: "ahmed@example.com",
        password: "123456",
        role: "user"
    }
];

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (user) => user.email === email
    );

    if (!user || user.password !== password) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({
        message: "Login successful"
    });
});

app.get("/profile", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    res.json({
        message: "Profile accessed",
        userId: req.session.userId,
        role: req.session.role
    });
});

app.get("/session", (req, res) => {
    res.json({
        session: req.session
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.json({
            message: "Logout successful"
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});