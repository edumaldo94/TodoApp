// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/backend/src/models/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todoapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con el ID:', connection.threadId);
});

// Cerrar la conexión de la base de datos después de las pruebas
if (process.env.NODE_ENV === 'test') {
  afterAll((done) => {
    connection.end(done);
  });
}

module.exports = connection;