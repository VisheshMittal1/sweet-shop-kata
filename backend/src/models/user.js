
const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, role = 'user' }) {
    const passwordHash = await bcrypt.hash(password, 10);

    // INSERT
    const result = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role]
    );

    // SELECT new user
    const row = await db.get(
      'SELECT id, email, role FROM users WHERE id = ?',
      [result.lastID || result.lastInsertRowid || result.id]
    );

    return row;
  }

  static async findByEmail(email) {
    const row = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return row;
  }
}

module.exports = User;
