const db = require('../src/db');

async function main() {
  await db.run('DELETE FROM users WHERE email = ?', ['test@example.com']);
  console.log('Deleted test@example.com from users table');
}

main().then(() => process.exit(0));
