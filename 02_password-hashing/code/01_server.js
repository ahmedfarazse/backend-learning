const bcrypt = require("bcrypt");

const password = "mypassword123";

const hashPassword = async () => {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);

    const isMatch = await bcrypt.compare(
        password,
        hashedPassword
    );

    console.log("Password Match:", isMatch);
};

hashPassword();






// Example 2 

// Check by true or false password 

// const bcrypt = require("bcrypt");

// const password = "mypassword123";

// const hashPassword = async () => {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     console.log("Original Password:", password);
//     console.log("Hashed Password:", hashedPassword);

//     const correctPassword = await bcrypt.compare(
//         "mypassword123",
//         hashedPassword
//     );

//     const wrongPassword = await bcrypt.compare(
//         "wrongpassword",
//         hashedPassword
//     );

//     console.log("Correct Password Match:", correctPassword);
//     console.log("Wrong Password Match:", wrongPassword);
// };

// hashPassword();