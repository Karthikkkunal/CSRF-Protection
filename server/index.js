import express from 'express';
import cors from 'cors';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'csrf-demo-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: isProduction,
    sameSite: 'lax',
    httpOnly: true
  }
}));

// CORS configuration
const corsOptions = {
  origin: isProduction ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    sameSite: 'lax',
    secure: isProduction
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Form tampered with'
    });
  } else {
    next(err);
  }
});

// API Routes
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ 
    csrfToken: req.csrfToken(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/protected-action', csrfProtection, (req, res) => {
  res.json({ 
    message: 'Protected action successful!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/unprotected-action', (req, res) => {
  res.json({ 
    message: 'Unprotected action completed',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (isProduction) {
  app.use(serveStatic(join(__dirname, '../dist')));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});