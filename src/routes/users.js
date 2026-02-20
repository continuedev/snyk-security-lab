const express = require('express');
const _ = require('lodash');
const requireAuth = require('../middleware/requireAuth');
const { findUserById } = require('../db/queries');

const router = express.Router();

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

module.exports = router;
