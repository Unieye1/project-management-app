const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");
const router = express.Router();


//GET projects by user ID
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
       SELECT *
       FROM projects
       WHERE owner_id = $1;
      `,
      [req.session.userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

module.exports = router;