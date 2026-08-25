const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

// Fake logged-in user
const user = {
    id: 1,
    name: "Ahmed",
    role: "user"
};

// Authentication Middleware
const authenticate = (req, res, next) => {
    if (!user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    req.user = user;

    next();
};

// Authorization Middleware
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    next();
};

// Public route
app.get("/", (req, res) => {
    res.json({
        message: "Public route"
    });
});

// Authentication required
app.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Profile accessed",
        user: req.user
    });
});

// Authentication + Authorization required
app.get(
    "/admin",
    authenticate,
    authorizeAdmin,
    (req, res) => {
        res.json({
            message: "Welcome to admin dashboard"
        });
    }
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});