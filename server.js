const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// VULNERABILITY: Security Misconfiguration - CORS allows all origins
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// VULNERABILITY: Session Management Issues - Weak session configuration
app.use(session({
  secret: 'weak-secret-123',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Should be true in production
    httpOnly: false, // VULNERABILITY: Allows XSS to steal cookies
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// VULNERABILITY: Sensitive Data Exposure - Database credentials in code
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',  // CHANGE THIS IN PRODUCTION
  database: process.env.DB_NAME || 'vulnerable_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// VULNERABILITY: File Upload - No file type validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // VULNERABILITY: No sanitization
  }
});
const upload = multer({ storage: storage });

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve uploaded files - VULNERABILITY: Directory Traversal possible
app.use('/uploads', express.static('uploads'));

// VULNERABILITY #1: SQL Injection - Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // INTENTIONALLY VULNERABLE: Direct string concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length > 0) {
      req.session.userId = results[0].id;
      req.session.username = results[0].username;
      req.session.role = results[0].role;
      
      res.json({ 
        success: true, 
        user: results[0],
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// VULNERABILITY #2: XSS - Search endpoint returns unsanitized data
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  
  // VULNERABILITY: No input sanitization
  const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // VULNERABILITY: Returns unsanitized search term
    res.json({ 
      searchTerm: searchTerm,
      results: results 
    });
  });
});

// VULNERABILITY #3: CSRF - No CSRF token validation
app.post('/api/transfer', (req, res) => {
  const { to, amount } = req.body;
  
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // VULNERABILITY: No CSRF protection
  const query = `INSERT INTO transfers (from_user, to_user, amount) VALUES (${req.session.userId}, ${to}, ${amount})`;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Transfer completed' });
  });
});

// VULNERABILITY #4: Broken Access Control - No authorization check
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // VULNERABILITY: Any logged-in user can access any user's data
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

// VULNERABILITY #5: Authentication Issues - Weak password requirements
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  
  // VULNERABILITY: No password strength validation
  // VULNERABILITY: Password stored in plaintext
  const query = `INSERT INTO users (username, password, email, role) VALUES ('${username}', '${password}', '${email}', 'user')`;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'User registered' });
  });
});

// VULNERABILITY #6: File Upload Vulnerabilities
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // VULNERABILITY: No file type validation, no size limit
  res.json({ 
    success: true, 
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// VULNERABILITY #7: Directory Traversal
app.get('/api/file', (req, res) => {
  const filename = req.query.name;
  
  // VULNERABILITY: No path sanitization
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// VULNERABILITY #8: Security Misconfiguration - Debug endpoint exposed
app.get('/api/debug', (req, res) => {
  // VULNERABILITY: Exposes sensitive system information
  res.json({
    env: process.env,
    session: req.session,
    headers: req.headers,
    cookies: req.cookies
  });
});

// VULNERABILITY #9: IDOR - Direct object reference without authorization
app.get('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  
  // VULNERABILITY: No check if user owns this order
  const query = `SELECT * FROM orders WHERE id = ${orderId}`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});

// VULNERABILITY #10: Sensitive Data Exposure - Returns sensitive info
app.get('/api/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const query = `SELECT * FROM users WHERE id = ${req.session.userId}`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // VULNERABILITY: Returns password and other sensitive data
    res.json(results[0]);
  });
});

// VULNERABILITY #11: Clickjacking - No X-Frame-Options header
// This is demonstrated by the absence of security headers

// VULNERABILITY #12: API Security - No rate limiting, no authentication on some endpoints
app.get('/api/admin/users', (req, res) => {
  // VULNERABILITY: No rate limiting, weak admin check
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Delete user - VULNERABILITY: CSRF + Broken Access Control
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // VULNERABILITY: No CSRF token, weak authorization
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const query = `DELETE FROM users WHERE id = ${userId}`;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'User deleted' });
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Vulnerable server running on http://localhost:${PORT}`);
  console.log('⚠️  WARNING: This application contains intentional security vulnerabilities!');
  console.log('⚠️  FOR EDUCATIONAL PURPOSES ONLY - DO NOT DEPLOY TO PRODUCTION!');
});
