const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");
const router = express.Router();


// GET all users
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT id, name, email, description, created_at, updated_at
        FROM users;
      `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET user by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, description, created_at, updated_at
      FROM users
      WHERE users.id = $1;
    `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//Create a new user
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, email, description } = req.body;

    const result = await pool.query(
      `
      INSERT INTO users (name, email, description)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [name, email, description],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;