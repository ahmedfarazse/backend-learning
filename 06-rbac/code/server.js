const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

const users = [
  {
    id: 1,
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: 2,
    email: "manager@example.com",
    role: "manager"
  },
  {
    id: 3,
    email: "user@example.com",
    role: "user"
  }
];

const authenticate = (req, res, next) => {
  const userId = Number(req.headers["user-id"]);

  const user = users.find(
    (user) => user.id === userId
  );

  if (!user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  req.user = user;

  next();
};


// middleware RBAC

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});

app.get(
  "/admin",
  authenticate,
  authorize(["admin"]),
  (req, res) => {
    res.json({
      message: "Admin area accessed",
      user: req.user
    });
  }
);

app.get(
  "/manager",
  authenticate,
  authorize(["admin", "manager"]),
  (req, res) => {
    res.json({
      message: "Manager area accessed",
      user: req.user
    });
  }
);

app.delete(
  "/users/:id",
  authenticate,
  authorize(["admin"]),
  (req, res) => {
    res.json({
      message: `User ${req.params.id} deleted`,
      deletedBy: req.user
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});