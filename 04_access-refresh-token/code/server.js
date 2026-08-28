const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = 3000;

const users = [
    {
        id: 1,
        email: "ahmed@example.com",
        password: "123456"
    }
];

const refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};





// Login Route


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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({
        message: "Login successful",
        accessToken,
        refreshToken
    });
});





// Authentication Middleware


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
};





// Protected Route


app.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Profile accessed",
        user: req.user
    });
});





// Refresh Route


app.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token required"
        });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({
            message: "Invalid refresh token"
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = users.find(
            (user) => user.id === decoded.id
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const newAccessToken = generateAccessToken(user);

        res.json({
            accessToken: newAccessToken
        });
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
});






// Logout 


app.post("/logout", (req, res) => {
    const { refreshToken } = req.body;

    const index = refreshTokens.indexOf(refreshToken);

    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }

    res.json({
        message: "Logged out successfully"
    });
});






// Server Start

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});