const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // 1. Get project count
    const projectStats = await pool.query(
      `SELECT COUNT(*) AS total_projects
       FROM projects
       WHERE owner_id = $1`,
      [userId],
    );

    // 2. Get task statistics
    const taskStats = await pool.query(
      `SELECT
         COUNT(*) AS total_tasks,
         COUNT(*) FILTER (
           WHERE t.status = 'completed'
         ) AS completed_tasks,
         COUNT(*) FILTER (
           WHERE t.status = 'pending'
         ) AS pending_tasks,
         COUNT(*) FILTER (
           WHERE t.status NOT IN ('completed', 'cancelled')
             AND t.due_date < CURRENT_DATE
         ) AS overdue_tasks
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE p.owner_id = $1`,
      [userId],
    );

    // 3. Get recent projects
    const recentProjects = await pool.query(
      `SELECT
  p.id,
  p.name,
  p.status,
  p.created_at,
  COUNT(t.id) AS total_tasks,
  COUNT(t.id) FILTER (
    WHERE t.status = 'completed'
  ) AS completed_tasks
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
WHERE p.owner_id = $1
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 5`,
      [userId],
    );

    const recentTasks = await pool.query(
      `SELECT
     t.id,
     t.title,
     t.status AS task_status,
     t.priority,
     t.due_date,
     t.created_at,
     p.id AS project_id,
     p.name AS project_name
   FROM tasks t
   JOIN projects p ON p.id = t.project_id
   WHERE p.owner_id = $1
   ORDER BY t.created_at DESC
   LIMIT 5`,
      [userId],
    );

    // Send the results back to React
    res.json({
      stats: {
        totalProjects: Number(projectStats.rows[0].total_projects),
        totalTasks: Number(taskStats.rows[0].total_tasks),
        completedTasks: Number(taskStats.rows[0].completed_tasks),
        pendingTasks: Number(taskStats.rows[0].pending_tasks),
        overdueTasks: Number(taskStats.rows[0].overdue_tasks),
      },
      recentProjects: recentProjects.rows,
      recentTasks: recentTasks.rows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
