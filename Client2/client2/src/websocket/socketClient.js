let socket;

export const connectWebSocket = (url, onMessage) => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('🔌 WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('❌ WebSocket JSON parse error:', err);
    }
  };

  socket.onclose = () => {
    console.warn('⚠️ WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };
};

export const sendWebSocketMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

export const closeWebSocket = () => {
  if (socket) socket.close();
};
