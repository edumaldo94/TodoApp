import axios from 'axios';

const api = axios.create({
 baseURL: 'http://192.168.0.107:5000/api'
});

export const getTasks = () => api.get('/tasks');
export const addTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;