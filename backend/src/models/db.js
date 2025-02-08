const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',   // XAMPP usa contraseña vacía por defecto
  database: 'todoapp',
  port: 3306,     // Asegúrate de que sea el puerto correcto
  multipleStatements: true,  // Permite múltiples consultas
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err);
      setTimeout(handleDisconnect, 2000);  // Reintentar conexión en 2s
    } else {
      console.log('Conectado a la base de datos con el ID:', connection.threadId);
    }
  });

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('Conexión a la base de datos perdida. Reconectando...');
      handleDisconnect();
    } else {
      console.error('Error en la base de datos:', err);
    }
  });
}

handleDisconnect();

module.exports = connection;
