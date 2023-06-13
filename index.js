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
      res.status(400).json(writeError(true, "Email and password are required"));
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
      res.status(401).json(writeError(true, "Invalid credentials"));
    }
  } catch (error) {
    console.error("Error login:", error.message);
    res.status(500).json(writeError(true, "Internal server error"));
  }
});

app.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      res.status(400).json(writeError(true, "One of the field are empty"));
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
      res.status(500).json(writeError(true, response.data.message));
    } else {
      res.status(200).json(writeError(false, "User registered successfully"));
    }
  } catch (error) {
    console.error("Error register:", error.message);
    res.status(500).json(writeError(true, "Internal server error"));
  }
});

// If user successfully login
app.get("/logged", (req, res) => {
  if (req.session.userData) {
    res.send(writeError(false, `Welcome, ${req.session.userData.email}!`));
  } else {
    res.status(401).send(writeError(true, "Unauthorized"));
  }
});

app.get("/", (req, res) => res.send("Hello Folks!"));

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send(writeError(false, "Logout successful!"));
});

app.get("/api/recomendation-place", async (req, res) => {
  // get params from request
  const { key } = req.query;
  try {
    const response = await axios.get(
      `https://sql-server-oislxufxaa-et.a.run.app/api/recomendation-place/?key=${key}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error recomendation place:", error.message);
    res.status(500).json(writeError(true, "Internal server error"));
  }
});

app.get("/api/detail-place/:id", async (req, res) => {
  // get params from request
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://sql-server-oislxufxaa-et.a.run.app/api/detail-place/${id}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error detail place:", error.message);
    res.status(500).json(writeError(true, "Internal server error"));
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ================ //
// LOGICAL FUNCTION //
// ================ //

const writeError = (error, message) => {
  return {
    error,
    message,
  };
};
