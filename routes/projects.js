const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");
const router = express.Router();

//GET projects by user ID
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
      p.id,
      p.name,
      p.status,
      p.created_at,
      COUNT(t.id)::int AS total_tasks,
      COUNT(t.id) FILTER (
        WHERE t.status = 'completed'
      )::int AS completed_tasks
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.owner_id = $1
    GROUP BY p.id
    ORDER BY p.created_at DESC;`,
      [req.session.userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST /api/projects — create a project
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    // Validate project name
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "Project name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, owner_id)
       VALUES ($1, $2)
       RETURNING id, name, status, created_at`,
      [name.trim(), req.session.userId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      error: "Failed to create project",
    });
  }
});

module.exports = router;
