// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/backend/src/controllers/tasks.js
const connection = require('../models/db');
const { getIo } = require('../../socket');
const moment = require('moment-timezone');

// Obtener todas las tareas
const getAllTasks = (req, res) => {
  connection.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // No convertir las fechas a la zona horaria, enviarlas tal como están
    res.json(results);
  });
};

// Agregar una nueva tarea
const addTask = (req, res) => {
  const { title, description, due_date } = req.body;
  const formattedDate = moment.tz(due_date, 'America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');

  const query = 'INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)';
  connection.query(query, [title, description, formattedDate], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newTask = { id: results.insertId, title, description, due_date: formattedDate, completed: false };

    const io = getIo();
    io.emit('newTask', newTask);

    res.json(newTask);
  });
};

// Actualizar una tarea
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, completed, due_date } = req.body;
  const formattedDate = moment.tz(due_date, 'America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
  const query = 'UPDATE tasks SET title = ?, description = ?, completed = ?, due_date = ? WHERE id = ?';
  connection.query(query, [title, description, completed, formattedDate, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const updatedTask = { id, title, description, completed, due_date: formattedDate };
    const io = getIo();
    io.emit('updateTask', updatedTask);
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
    const io = getIo();
    io.emit('deleteTask', { id });
    res.json({ message: 'Tarea eliminada correctamente' });
  });
};

module.exports = { getAllTasks, addTask, updateTask, deleteTask };