// server.cjs
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

// Validate critical env vars
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing in .env');
  process.exit(1);
}

const connectDB = require('./config/db.cjs'); // Use require

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Routes - Use require for .cjs files
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/expenses', require('./routes/expenses.cjs'));

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

const PORT = process.env.PORT || 5000;

// Connect DB, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('💥 Fatal: Server failed to start due to DB error:', err.message);
    process.exit(1);
  });
