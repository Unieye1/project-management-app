const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();
  
//Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [name, email, hashedPassword],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

//Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT id, password_hash
      FROM users
      WHERE email=$1;
      `,
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(
      password,
      result.rows[0].password_hash,
    ); 
    
    if (isMatch) {
      req.session.userId = result.rows[0].id;
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
});


//Logout a user
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to log out",
      });
    }

    res.json({
      message: "Logged out successfully",
    });
  });
});

module.exports = router;