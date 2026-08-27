const jwt = require("jsonwebtoken");

const secret = "my-secret-key";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};




// Protected route


app.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Profile accessed",
        user: req.user
    });
});