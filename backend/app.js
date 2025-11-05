require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const swapRoutes = require('./routes/swaps');

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

app.get('/', (req, res) => res.send({ ok: true, message: 'Slot Swapper API' }));
app.get('/api/health', (req, res) => res.status(200).json({ 
  status: 'healthy', 
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
