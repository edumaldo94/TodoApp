const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');

// Obtener todas las tareas
router.get('/', tasksController.getAllTasks);

// Agregar una nueva tarea
router.post('/', tasksController.addTask);

// Actualizar una tarea
router.put('/:id', tasksController.updateTask);

// Eliminar una tarea
router.delete('/:id', tasksController.deleteTask);

module.exports = router;