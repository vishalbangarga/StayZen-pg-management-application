const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'server-debug.log');
fs.writeFileSync(logFile, 'Server starting...\n');
process.on('uncaughtException', (error) => {
  fs.appendFileSync(logFile, `UNCAUGHT EXCEPTION: ${error.stack}\n`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  fs.appendFileSync(logFile, `UNHANDLED REJECTION: ${reason}\n`);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
fs.appendFileSync(logFile, 'Middleware registered\n');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pg', require('./routes/pg'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
fs.appendFileSync(logFile, 'Routes registered\n');

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PG Manager API' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  fs.appendFileSync(logFile, `Server listening on port ${PORT} at 0.0.0.0\n`);
});
