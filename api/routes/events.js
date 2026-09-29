const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/events  -> Home page
// Returns all current/upcoming events that are NOT suspended,
// together with their category and organisation names.
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.location,
             e.ticket_price, e.goal_amount, e.raised_amount, e.image_url,
             c.category_name, o.org_name,
             CASE WHEN e.event_date >= NOW() THEN 'upcoming' ELSE 'past' END AS status
      FROM events e
      JOIN categories c   ON e.category_id = c.category_id
      JOIN organisations o ON e.org_id = o.org_id
      WHERE e.is_suspended = 0
        AND e.event_date >= NOW()
      ORDER BY e.event_date ASC
    `;
    const [rows] = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/search?date=&location=&category=
// Filters events by exact date, fuzzy location and category id.
// NOTE: must be declared BEFORE the /:id route below.
router.get('/search', async (req, res) => {
  try {
    const { date, location, category } = req.query;
    let sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.location,
             e.ticket_price, e.image_url, c.category_name,
             CASE WHEN e.event_date >= NOW() THEN 'upcoming' ELSE 'past' END AS status
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.is_suspended = 0
    `;
    const params = [];

    if (date) {
      sql += ' AND DATE(e.event_date) = ?';
      params.push(date);
    }
    if (location) {
      sql += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (category) {
      sql += ' AND c.category_id = ?';
      params.push(category);
    }
    sql += ' ORDER BY e.event_date ASC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id  -> Event detail page
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }
    const sql = `
      SELECT e.*, c.category_name, o.org_name, o.mission, o.contact_email,
             o.contact_phone, o.website,
             CASE WHEN e.event_date >= NOW() THEN 'upcoming' ELSE 'past' END AS status
      FROM events e
      JOIN categories c   ON e.category_id = c.category_id
      JOIN organisations o ON e.org_id = o.org_id
      WHERE e.event_id = ? AND e.is_suspended = 0
    `;
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
