const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

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


// Get all users
app.get("/api/users", (req, res) => {

    res.json({
        success: true,
        users
    });

});


// Get user by ID
app.get("/api/users/:id", (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

});


// Test error route
app.get("/api/error", (req, res, next) => {

    try {

        throw new Error("Something went wrong");

    } catch (error) {

        next(error);

    }

});


// 404 Handler
app.use((req, res, next) => {

    const error = new Error("Route not found");

    error.statusCode = 404;

    next(error);

});


// Centralized Error Handler
app.use((err, req, res, next) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});


app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});