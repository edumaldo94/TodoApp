// filepath: /C:/Users/Eduardo/Documents/GitHub/TodoApp/backend/src/controllers/tasks.js
const connection = require('../models/db');
const { getIo } = require('../../socket'); // Importamos `getIo`

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
  const { title, description, due_date } = req.body;

  const query = 'INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)';
  connection.query(query, [title, description, due_date], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newTask = { id: results.insertId, title, description, due_date, completed: false };

    const io = getIo(); // Obtenemos `io` correctamente
    io.emit('newTask', newTask); // Emitimos el evento

    res.json(newTask);
  });
};

// Actualizar una tarea
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, completed, due_date } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, completed = ?, due_date = ? WHERE id = ?';
  connection.query(query, [title, description, completed, due_date, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const updatedTask = { id, title, description, completed, due_date };
    const io = getIo(); // Obtenemos `io` correctamente
    io.emit('updateTask', updatedTask); // Emitimos el evento
    res.json(updatedTask);
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
    const io = getIo(); // Obtenemos `io` correctamente
    io.emit('deleteTask', { id }); // Emitimos el evento
    res.json({ message: 'Tarea eliminada correctamente' });
  });
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask };