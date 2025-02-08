// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/backend/app.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const tasksRoutes = require('./src/routes/tasks');
const { init } = require('./socket');

const app = express();
const server = http.createServer(app);
const io = init(server);

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
/*app.get('/', (req, res) => {
  res.send('Bienvenidos');
});*/
app.use('/api/tasks', tasksRoutes);

// Manejar conexiones de socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor solo si no está en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  });
}

module.exports = { app, server };