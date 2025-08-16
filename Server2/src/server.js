// //server.js
// const http = require('http');
// const app = require('./app');
// const { connectToDB } = require('./config/database');// ✅ import your socket logic
// const ww = require('./sockets/webSocket');
// const setupWebSocket = require('./sockets/webSocket');
// require('dotenv').config();

// const PORT = process.env.PORT;
// connectToDB();

// const server = http.createServer(app);

// setupWebSocket(server);

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const http = require('http');
const app = require('./app');
const { connectToDB } = require('./config/database');
const setupWebSocket = require('./sockets/webSocket');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
connectToDB();

const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on http://192.168.1.179:${PORT}`);
});