const express = require('express');
const _ = require('lodash');
const { Pool } = require('pg');
const requireAuth = require('../middleware/requireAuth');
const { findUserById } = require('../db/queries');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: _.pick(user, ['id', 'email', 'name']) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SQL concatenation vulnerability - should be caught by secure-patterns check
// Also touches a file using lodash (Snyk-flagged) - should be caught by snyk-security check
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { name, email } = req.query;
    let sql = 'SELECT id, email, name FROM users WHERE 1=1';

    if (name) {
      sql += " AND name LIKE '%" + name + "%'";
    }
    if (email) {
      sql += " AND email LIKE '%" + email + "%'";
    }

    const result = await pool.query(sql);
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
