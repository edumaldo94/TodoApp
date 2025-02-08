import axios from 'axios';
/*const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.107:5000/api', // Reemplaza con la URL de tu backend
  });*/
  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'https://todoapp-burr.onrender.com/api', // Reemplaza con la URL de tu backend
  });
  export const getTasks = async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };
  
  export const addTask = async (task) => {
    try {
      const response = await api.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };
  
  export const updateTask = async (id, task) => {
    try {
      const response = await api.put(`/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  export const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };
  
  export default api;