const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5001;



const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Create database and table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    hobbies VARCHAR(255),
    skill_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    bio TEXT
  )
`);

// Register User
app.post('/api/register', async (req, res) => {
  const { name, email, password, gender, hobbies, skill_level, bio } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const hobbiesStr = hobbies.join(',');

  db.query(
    'INSERT INTO users (name, email, password, gender, hobbies, skill_level, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, gender, hobbiesStr, skill_level, bio],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.status(201).json({ message: 'User registered' });
    }
  );
});

// Login User
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware for JWT auth
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get All Users
app.get('/api/users', authenticateToken, (req, res) => {
  db.query('SELECT id, name, email, gender, hobbies, skill_level, bio FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch users' });
    const users = results.map(user => ({
      ...user,
      hobbies: user.hobbies ? user.hobbies.split(',') : [],
    }));
    res.json(users);
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});