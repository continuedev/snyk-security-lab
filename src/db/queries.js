const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function findUserById(id) {
  const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser(email, name, passwordHash) {
  const result = await pool.query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email, name, passwordHash]
  );
  return result.rows[0];
}

async function listProducts(limit = 20, offset = 0) {
  const result = await pool.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

async function findProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  listProducts,
  findProductById,
};
