const db = require('../db');

class Sweet {
  static async create(data) {
    const stmt = db.prepare(
      'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      data.name,
      data.category,
      data.price,
      data.quantity
    );

    const row = db
      .prepare('SELECT * FROM sweets WHERE id = ?')
      .get(result.lastInsertRowid);

    return row;
  }

  static async findAll() {
    const rows = db.prepare('SELECT * FROM sweets').all();
    return rows;
  }
}

module.exports = Sweet;
