const express = require('express');
const cors = require('cors');
const tasksRoutes = require('./src/routes/tasks');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', 
    (req, res) => {
        res.send('Bienvenidos');
    }
);
app.use('/api/tasks', tasksRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});