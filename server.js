const express = require('express');
const cors = require('cors');
const path = require('path');

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
  payloads.push({
    ...req.body,
    time: new Date().toISOString(),
    ip: req.ip
  });
  res.sendStatus(200);
});

// Admin panel route
app.get('/panel', (req, res) => {
  res.render('panel', { payloads });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}/panel`));
