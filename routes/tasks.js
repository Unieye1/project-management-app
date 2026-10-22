const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// GET /api/tasks
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          t.id,
          t.project_id,
          p.name AS project_name,
          t.title,
          t.description,
          t.priority,
          t.due_date,
          t.assigned_at,
          u.name AS assignee_name,
          t.status
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.assigned_at
       WHERE p.owner_id = $1
       ORDER BY t.due_date ASC NULLS LAST`,
      [req.session.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;