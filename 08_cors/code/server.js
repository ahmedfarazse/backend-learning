const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

const users = [
  {
    id: 1,
    name: "Ahmed"
  },
  {
    id: 2,
    name: "Ali"
  }
];

app.get("/api/users", (req, res) => {
  res.json({
    message: "Users fetched successfully",
    users
  });
});

app.get("/api/profile", (req, res) => {
  res.json({
    message: "Profile accessed successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});