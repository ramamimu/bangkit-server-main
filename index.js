const cors = require("cors");
const express = require("express");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 8080;
// Middleware for cors
app.use(cors());
// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Middleware for session management
app.use(
  session({
    secret: "test-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "test" && password === "123") {
    req.session.user = { username };
    res.send("Login successful!");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// If user successfully login
app.get("/logged", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome, ${req.session.user.username}!`);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/", (req, res) => res.send("Hello Thariq!"));

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout successful!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
