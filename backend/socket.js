// filepath: /C:/Users/Eduardo/Documents/GitHub/TodoApp/backend/socket.js
let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io no está inicializado');
    }
    return io;
  },
};