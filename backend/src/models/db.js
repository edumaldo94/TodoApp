require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err);
      setTimeout(handleDisconnect, 2000);  // Reintentar conexión en 2s
    } else {
      console.log('✅ Conectado a la base de datos con el ID:', connection.threadId);
    }
  });

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('⚠️ Conexión perdida. Reconectando...');
      handleDisconnect();
    } else {
      console.error('🔥 Error en la base de datos:', err);
    }
  });
}

handleDisconnect();

module.exports = connection;
