const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validateInput = require('../middleware/validateInput');
const { findUserByEmail, createUser } = require('../db/queries');

const router = express.Router();

router.post('/login', validateInput({
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
}), async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user || !await bcrypt.compare(req.body.password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signup', validateInput({
  email: { required: true, type: 'string' },
  name: { required: true, type: 'string', maxLength: 100 },
  password: { required: true, type: 'string' },
}), async (req, res) => {
  try {
    const existing = await findUserByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await createUser(req.body.email, req.body.name, passwordHash);

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
