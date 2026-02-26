// Custom DNS servers fix Windows Node.js SRV resolution for MongoDB Atlas
// Skip in production (Render's Linux DNS works natively)
if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/monsters', require('./routes/monsters'));
app.use('/api/encounters', require('./routes/encounters'));
app.use('/api/combat-sessions', require('./routes/combatSessions'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
console.log(`Starting server... (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'set' : 'NOT SET'}`);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error(`Failed to start: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});
