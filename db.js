const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./xss_payloads.db', (err) => {
  if (err) console.error('Failed to connect to DB:', err);
  else console.log('Connected to SQLite DB');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS payloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT,
      userAgent TEXT,
      screenshot TEXT,
      ip TEXT,
      time TEXT
    )
  `, (err) => {
    if (err) console.error('Failed to create table:', err);
  });
});

module.exports = db;