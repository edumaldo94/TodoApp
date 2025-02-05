// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/backend/src/__tests__/tasks.test.js
const request = require('supertest');
const { app, server } = require('../../app'); // Importa tu aplicación Express y el servidor

beforeAll((done) => {
  server.listen(5000, done); // Inicia el servidor antes de todas las pruebas
});

afterAll((done) => {
  server.close(done); // Cierra el servidor después de todas las pruebas
});

describe('GET /tasks', () => {
  it('debería devolver todas las tareas', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Imprime las tareas en la consola
    console.log('Tareas devueltas:', response.body);

    // Verifica que las tareas tengan la estructura esperada
    response.body.forEach((task) => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('completed');
    });
  });
});

describe('POST /tasks', () => {
  it('debería crear una nueva tarea', async () => {
    const newTask = {
      title: 'Nueva tarea',
      description: 'Descripción de la nueva tarea',
      due_date: '2023-12-31T23:59:59.999Z'
    };

    const response = await request(app).post('/api/tasks').send(newTask);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
    expect(response.body.due_date).toBe(newTask.due_date);
    expect(response.body.completed).toBe(false);
  });
});

describe('PUT /tasks/:id', () => {
  it('debería actualizar una tarea existente', async () => {
    const updatedTask = {
      title: 'Tarea actualizada',
      description: 'Descripción actualizada',
      completed: true,
      due_date: '2023-12-31T23:59:59.999Z'
    };

    // Primero, crea una nueva tarea para actualizar
    const newTaskResponse = await request(app).post('/api/tasks').send({
      title: 'Tarea para actualizar',
      description: 'Descripción de la tarea para actualizar',
      due_date: '2023-12-31T23:59:59.999Z'
    });

    const taskId = newTaskResponse.body.id;

    const response = await request(app).put(`/api/tasks/${taskId}`).send(updatedTask);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedTask.title);
    expect(response.body.description).toBe(updatedTask.description);
    expect(response.body.completed).toBe(updatedTask.completed);
    expect(response.body.due_date).toBe(updatedTask.due_date);
  });
});

describe('DELETE /tasks/:id', () => {
  it('debería eliminar una tarea existente', async () => {
    // Primero, crea una nueva tarea para eliminar
    const newTaskResponse = await request(app).post('/api/tasks').send({
      title: 'Tarea para eliminar',
      description: 'Descripción de la tarea para eliminar',
      due_date: '2023-12-31T23:59:59.999Z'
    });

    const taskId = newTaskResponse.body.id;

    const response = await request(app).delete(`/api/tasks/${taskId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Tarea eliminada correctamente');
  });
});