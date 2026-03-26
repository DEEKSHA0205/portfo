require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

app.use(express.static('public'));

// FEATURE: Database Visitor Counter
app.get('/api/stats', (req, res) => {
  connection.query('UPDATE site_stats SET views = views + 1 WHERE id = 1', () => {
    connection.query('SELECT views FROM site_stats WHERE id = 1', (err, results) => {
      if (err) return res.json({ views: 0 });
      res.json(results[0]);
    });
  });
});

// Get Portfolio Data
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM portfolio_details LIMIT 1', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ profile: results[0] });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));