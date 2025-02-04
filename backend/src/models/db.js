const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',      // Dirección de XAMPP (usualmente localhost)
    user: 'root',           // Usuario de MySQL
    password: '',           // Contraseña de MySQL (vacía por defecto en XAMPP)
    database: 'todoapp'     // Nombre de la base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos con el ID:', connection.threadId);
});

module.exports = connection;