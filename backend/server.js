
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (user && user.password === password) { // В продакшене используйте bcrypt!
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- DATA ROUTES ---
app.get('/api/lessons', authenticate, async (req, res) => {
  const result = await pool.query('SELECT * FROM lessons ORDER BY id');
  res.json(result.rows);
});

app.get('/api/diary', authenticate, async (req, res) => {
  const result = await pool.query('SELECT * FROM diary WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
  res.json(result.rows);
});

app.post('/api/diary', authenticate, async (req, res) => {
  const { date, symptomLevel, emotionLevel, triggers, notes } = req.body;
  const result = await pool.query(
    'INSERT INTO diary (user_id, date, symptom_level, emotion_level, triggers, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [req.user.id, date, symptomLevel, emotionLevel, triggers, notes]
  );
  res.json(result.rows[0]);
});

// --- PRODAMUS WEBHOOK ---
app.post('/api/commerce/webhook', async (req, res) => {
  const { order_id, status } = req.body;
  if (status === 'paid') {
     await pool.query('UPDATE orders SET status = $1 WHERE external_id = $2', ['PAID', order_id]);
     // Логика активации доступа...
  }
  res.send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
