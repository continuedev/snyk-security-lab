const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

// Hardcoded API key - should be caught by secure-patterns check
const ADMIN_API_KEY = 'hardcoded-admin-key-do-not-use-in-production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Missing requireAuth middleware - should be caught
router.get('/users', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await pool.query('SELECT id, email, name, created_at FROM users');
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Missing input validation - should be caught
router.post('/users/:id/role', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { role } = req.body;
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      [role, req.params.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
