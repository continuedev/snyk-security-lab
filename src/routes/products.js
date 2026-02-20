const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validateInput = require('../middleware/validateInput');
const { listProducts, findProductById } = require('../db/queries');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await listProducts();
    res.json({ products });
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
