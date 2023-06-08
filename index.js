const cors = require("cors");
const express = require("express");
const session = require("express-session");
const { nanoid } = require("nanoid");
const mysql = require("mysql");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 8080;

// Middleware for cors
app.use(cors());
// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "34.101.45.56",
  user: "root",
  password: "=Ddnt5s~l07=6M9O",
  database: "C23-PR513_CapstoneBangkit",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware for session management
app.use(
  session({
    secret: "test-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM User WHERE Email = '${email}' AND Password = '${password}'`;

    // Make a request to the SQL database endpoint
    const response = await axios.post(
      "https://sql-server-oislxufxaa-et.a.run.app/api/query",
      { query }
    );
    const userData = response.data;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    } else {
      // Successful login
      if (userData.data.length > 0) {
        // Set user data in the session
        req.session.userData = { email };
        res.status(200).json({ message: "Login successful", data: userData });
      } else {
        // Invalid credentials
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const userId = nanoid(16);
    const { fullName, email, password } = req.body;

    const query = `INSERT INTO User (User_ID, FullName, Email, Password) VALUES ('${userId}', '${fullName}', '${email}', '${password}')`;

    // Make a request to the SQL database endpoint
    const response = await axios.post(
      "https://sql-server-oislxufxaa-et.a.run.app/api/query",
      { query }
    );
    const userData = response.data;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: "One of the field are empty" });
      return;
    } else {
      if (userData) {
        res.status(200).json({ message: "User registered successfully" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to register user", data: userData });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
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
