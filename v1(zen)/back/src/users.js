// users.js
const bcrypt = require('bcrypt');
const pool = require('./db');

// Sign up a new user
async function signUpUser(email, username, password, api_key, api_secret) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, username, password, api_key, api_secret, balance) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *';
  const values = [email, username, hashedPassword, api_key, api_secret];

  try {
    console.log(values);
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
}

// Sign in an existing user
async function signInUser(email, password) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw new Error('Failed to sign in');
  }
}

module.exports = {
  signUpUser,
  signInUser,
};