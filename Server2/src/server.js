const http = require('http');
const app = require('./app');
const { connectToDB } = require('./config/database');// ✅ import your socket logic
const ww = require('./sockets/webSocket');
require('dotenv').config();

const PORT = process.env.PORT;
connectToDB();

const server = http.createServer(app);
ww(server); 

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket running on ws://localhost:${PORT}`);
});
