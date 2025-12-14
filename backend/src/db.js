const Database = require('better-sqlite3');

// Database file open karo (agar naam alag hai to yahan change kar dena)
const db = new Database('sweetshop.db');  

// SELECT * / multiple rows
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(params);
}

// SELECT ... WHERE / single row
function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(params);
}

// INSERT / UPDATE / DELETE
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(params);
}

module.exports = {
  all,
  get,
  run,
};
