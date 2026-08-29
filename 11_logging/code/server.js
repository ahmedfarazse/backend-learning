const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());


// Request Logging Middleware
app.use((req, res, next) => {

    const startTime = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - startTime;

        console.log(
            `[INFO] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
        );

    });

    next();

});


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


// GET /api/users
app.get("/api/users", (req, res) => {

    res.json({
        success: true,
        users
    });

});


// GET /api/users/:id
app.get("/api/users/:id", (req, res, next) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {

        const error = new Error("User not found");

        error.statusCode = 404;

        return next(error);

    }

    res.json({
        success: true,
        user
    });

});


// POST /login
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        console.warn("[WARN] Login request missing email or password");

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }

    console.log(`[INFO] Login attempt for ${email}`);

    res.json({
        success: true,
        message: "Login request received"
    });

});


// Error Testing Route
app.get("/api/error", (req, res, next) => {

    const error = new Error("Something went wrong");

    next(error);

});


// 404 Handler
app.use((req, res, next) => {

    const error = new Error("Route not found");

    error.statusCode = 404;

    next(error);

});


// Centralized Error Handler
app.use((err, req, res, next) => {

    console.error(
        `[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`
    );

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});


// Server
app.listen(PORT, () => {

    console.log(`[INFO] Server started on http://localhost:${PORT}`);

});