const db = require('../db');

// saare sweets laao
async function findAll() {
  const rows = await db.all('SELECT * FROM sweets');
  return rows;
}

// id se ek sweet
async function findById(id) {
  const row = await db.get('SELECT * FROM sweets WHERE id = ?', [id]);
  return row;
}

// naya sweet banao
async function create({ name, category, price, quantity }) {
  const result = await db.run(
    'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
    [name, category, price, quantity]
  );
  return { id: result.lastID, name, category, price, quantity };
}

// update by id
async function updateById(id, fields) {
  const existing = await findById(id);
  if (!existing) return null;

  const name = fields.name ?? existing.name;
  const category = fields.category ?? existing.category;
  const price = fields.price ?? existing.price;
  const quantity = fields.quantity ?? existing.quantity;

  await db.run(
    'UPDATE sweets SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
    [name, category, price, quantity, id]
  );

  return { id: Number(id), name, category, price, quantity };
}

// delete by id
async function deleteById(id) {
  await db.run('DELETE FROM sweets WHERE id = ?', [id]);
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
