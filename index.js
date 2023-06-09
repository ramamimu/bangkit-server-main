const cors = require("cors");
const express = require("express");
const session = require("express-session");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware for cors
app.use(cors());
// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Middleware for session management
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(writeError("Email and password are required"));
      return;
    }

    // Make a request to the SQL database endpoint
    const response = await axios.post(
      "https://sql-server-oislxufxaa-et.a.run.app/api/auth/login",
      {
        email,
        password,
      }
    );

    // Successful login
    if (!response.data.error) {
      // Set user data in the session
      req.session.userData = { email };
      res.status(200).json({ ...response.data, message: "Login successful" });
    } else {
      // Invalid credentials
      res.status(401).json(writeError("Invalid credentials"));
    }
  } catch (error) {
    console.error("Error login:", error.message);
    res.status(500).json(writeError("Internal server error"));
  }
});

app.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      res.status(400).json(writeError("One of the field are empty"));
      return;
    }

    // Make a request to the SQL database endpoint
    const response = await axios.post(
      "https://sql-server-oislxufxaa-et.a.run.app/api/auth/register",
      {
        email,
        password,
        fullname,
      }
    );

    if (response.data.error) {
      res.status(500).json(writeError(response.data.message));
    } else {
      res
        .status(200)
        .json({ error: false, message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error register:", error.message);
    res.status(500).json(writeError("Internal server error"));
  }
});

// If user successfully login
app.get("/logged", (req, res) => {
  if (req.session.userData) {
    res.send(`Welcome, ${req.session.userData.email}!`);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/", (req, res) => res.send("Hello Folks!"));

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout successful!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ================ //
// LOGICAL FUNCTION //
// ================ //

const writeError = (message) => {
  return {
    error: true,
    message,
  };
};
