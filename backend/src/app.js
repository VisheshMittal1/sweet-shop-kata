const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes mount
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
