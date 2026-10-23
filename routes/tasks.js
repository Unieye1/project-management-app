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

// POST /api/tasks — create a task
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      priority,
      due_date,
      assigned_at,
      status,
    } = req.body;

    if (!title || !title.trim() || !project_id) {
      return res.status(400).json({
        error: "Task title and project are required",
      });
    }

    // Make sure this project belongs to the logged-in user.
    const projectResult = await pool.query(
      `SELECT id
       FROM projects
       WHERE id = $1 AND owner_id = $2`,
      [project_id, req.session.userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (
         project_id,
         title,
         description,
         priority,
         due_date,
         assigned_at,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        project_id,
        title.trim(),
        description?.trim() || null,
        Number(priority),
        due_date || null,
        assigned_at || null,
        status || "pending",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH /api/tasks/:id — update a task
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      priority,
      due_date,
      assigned_at,
      status,
    } = req.body;

    if (!title?.trim() || !project_id) {
      return res.status(400).json({
        error: "Task title and project are required",
      });
    }

    const result = await pool.query(
      `UPDATE tasks AS t
       SET project_id = $1,
           title = $2,
           description = $3,
           priority = $4,
           due_date = $5,
           assigned_at = $6,
           status = $7,
           updated_at = CURRENT_TIMESTAMP
       FROM projects AS p
       WHERE t.id = $8
         AND t.project_id = p.id
         AND p.owner_id = $9
       RETURNING t.*`,
      [
        project_id,
        title.trim(),
        description?.trim() || null,
        Number(priority),
        due_date || null,
        assigned_at || null,
        status || "pending",
        req.params.id,
        req.session.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM tasks AS t
       USING projects AS p
       WHERE t.id = $1
         AND t.project_id = p.id
         AND p.owner_id = $2
       RETURNING t.id`,
      [req.params.id, req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;