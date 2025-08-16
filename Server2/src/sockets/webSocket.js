// //webSocket.js
// const WebSocket = require('ws');
// const PORT = process.env.PORT;

// function setupWebSocket(server) {
//   const wss = new WebSocket.Server({ server });
//   console.log(`📡 WebSocket running on ws://localhost:${PORT}`);
//   wss.on('connection', (ws) => {
//     console.log('Client connected to WebSocket');

//     ws.on('message', (message) => {
//       try {
//         const data = JSON.parse(message);
//         console.log('Received from ESP32:', data);

//         // Broadcast to all connected clients
//         wss.clients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//           }
//         });
//       } catch (error) {
//         console.error('Error parsing message:', error);
//       }
//     });

//     ws.on('close', () => {
//       console.log('Client disconnected from WebSocket');
//     });
//   });

//   return wss;
// }

// module.exports = setupWebSocket;
const WebSocket = require('ws');
const logger = require('../utils/logger');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws'
  });
  
  const PORT = process.env.PORT || 5000;
  logger.info(`WebSocket server running on ws://192.168.1.179:${PORT}/ws`);
  
  wss.on('connection', (ws, req) => {
    logger.success(`ESP32 connected to ${req.socket.remoteAddress}`);
    
    ws.send(JSON.stringify({ status: 'Server ready' }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        logger.log('Sensor data received:', JSON.stringify(data));

        // Broadcast to all other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        logger.error('Message parse error:', error.message);
      }
    });

    ws.on('close', () => {
      logger.warn('ESP32 disconnected');
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error.message);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
