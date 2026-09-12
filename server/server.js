const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { seedDatabase } = require('./services/seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Seed database on startup
try {
  seedDatabase();
} catch (err) {
  console.error('Seeding error:', err.message);
}

// Routes
const packageRoutes = require('./routes/packageRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const miscRoutes = require('./routes/miscRoutes');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Viraj Travels API is running 🚀' });
});

app.use('/api/packages', packageRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api', miscRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n🌍 Viraj Travels API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
