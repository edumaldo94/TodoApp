const connection = require('../models/db');

// Obtener todas las tareas
const getAllTasks = (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Agregar una nueva tarea
const addTask = (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
    connection.query(query, [title, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId, title, description, completed: false });
    });
};

// Actualizar una tarea
const updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const query = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
    connection.query(query, [title, description, completed, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, title, description, completed });
    });
};

// Eliminar una tarea
const deleteTask = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    });
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask };