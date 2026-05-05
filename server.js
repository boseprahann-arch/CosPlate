
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const db = new Database(process.env.DB_PATH || './database.sqlite');

app.use(cors());
app.use(express.json());

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    custom_api_key TEXT,
    requests_today INTEGER DEFAULT 0,
    last_request_time DATETIME,
    tokens_today INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const JWT_SECRET = process.env.JWT_SECRET || 'cosplate_secret_vibe_coding_2026';

// Middleware for Auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    stmt.run(email, hashedPassword);
    res.status(201).send('User registered');
  } catch (e) {
    res.status(400).send('User already exists');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token });
});

// AI Proxy with Rate Limiting
app.post('/api/chat', authenticateToken, async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const { message, customApiKey, model } = req.body;

  let apiKey = process.env.GOOGLE_API_KEY;
  let useDefaultLimits = true;

  if (customApiKey) {
    apiKey = customApiKey;
    useDefaultLimits = false;
  }

  if (useDefaultLimits) {
    // Check limits: 13 RPM, 800 RPD, 230,000 TPM
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    
    const recentRequests = db.prepare('SELECT COUNT(*) as count FROM usage_logs WHERE user_id = ? AND timestamp > ?').get(user.id, oneMinuteAgo.toISOString());
    if (recentRequests.count >= 13) return res.status(429).send('Too many requests (13/min)');

    if (user.requests_today >= 800) return res.status(429).send('Daily limit reached (800)');
    
    const recentTokens = db.prepare('SELECT SUM(tokens) as total FROM usage_logs WHERE user_id = ? AND timestamp > ?').get(user.id, oneMinuteAgo.toISOString());
    if (recentTokens.total >= 230000) return res.status(429).send('Token limit reached (230,000/min)');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const selectedModel = model || 'gemini-2.5-flash-lite';
    const aiModel = genAI.getGenerativeModel({ model: selectedModel });

    const result = await aiModel.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    // Simple token estimation (4 chars per token)
    const tokensUsed = Math.ceil((message.length + text.length) / 4);

    if (useDefaultLimits) {
      db.prepare('UPDATE users SET requests_today = requests_today + 1, tokens_today = tokens_today + ? WHERE id = ?').run(tokensUsed, user.id);
      db.prepare('INSERT INTO usage_logs (user_id, tokens) VALUES (?, ?)').run(user.id, tokensUsed);
    }

    res.json({ text, tokensUsed });
  } catch (error) {
    console.error(error);
    res.status(500).send(customApiKey ? 'API key not working' : 'AI Service Error');
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT email, requests_today, tokens_today FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
