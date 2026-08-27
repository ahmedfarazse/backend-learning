
// generate jwt

const jwt = require("jsonwebtoken");

const user = {
    id: 1,
    role: "user"
};

const secret = "my-secret-key";

const token = jwt.sign(
    user,
    secret,
    { expiresIn: "1h" }
);

console.log(token);



// to verify token 

const decoded = jwt.verify(
    token,
    secret
);

console.log(decoded);