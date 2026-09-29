const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/categories  -> returns all categories for the Search dropdown.
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT category_id, category_name FROM categories ORDER BY category_name'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
