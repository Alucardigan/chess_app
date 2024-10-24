// server.js
const express = require('express');
const app = express();


const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});