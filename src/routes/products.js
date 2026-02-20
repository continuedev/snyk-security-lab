const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validateInput = require('../middleware/validateInput');
const { listProducts, findProductById } = require('../db/queries');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await listProducts();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length > 100) {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC LIMIT 20',
      [`%${q}%`]
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
