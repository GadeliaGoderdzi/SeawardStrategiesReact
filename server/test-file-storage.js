// Simple test script to verify file-based storage is working
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'File-based storage is working!',
    timestamp: new Date().toISOString()
  });
});

// Get users file path endpoint
app.get('/api/users-file-path', (req, res) => {
  const fileStorage = require('./src/services/fileStorage');
  res.json({ 
    message: 'User data is stored in this file:',
    filePath: fileStorage.getUsersFilePath()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 User data will be stored in: ${path.join(__dirname, 'data', 'users', 'users.json')}`);
  console.log(`🌐 Test the API at: http://localhost:${PORT}/api/test`);
  console.log(`📋 Get file path at: http://localhost:${PORT}/api/users-file-path`);
});

module.exports = app;