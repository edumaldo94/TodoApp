// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/TaskList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { getTasks } from '../app/api';
import io from 'socket.io-client';
import moment from 'moment';

//const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.107:5000'); // Reemplaza <TU_DIRECCION_IP> con la dirección IP de tu máquina de desarrollo
const socket = io(process.env.BACKEND_URL);
const TaskList = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

    // Escuchar eventos de nuevas tareas
    socket.on('newTask', (newTask) => {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    });

    // Escuchar eventos de actualización de tareas
    socket.on('updateTask', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    // Escuchar eventos de eliminación de tareas
    socket.on('deleteTask', ({ id }) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    });

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      socket.off('newTask');
      socket.off('updateTask');
      socket.off('deleteTask');
    };
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchTasks();
    }
  }, [route.params?.refresh]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { task: item })}>
            <View style={[styles.taskContainer, item.completed && styles.completedTask]}>
              <Text style={[styles.taskTitle, item.completed && styles.completedTaskText]}>{item.title}</Text>
              <Text style={[styles.taskDescription, item.completed && styles.completedTaskText]}>{item.description.substring(0, 50)}...</Text>
              <Text style={[styles.taskHora, item.completed && styles.completedTaskText]}>{moment(item.due_date).format('HH:mm')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "rgba(3, 47, 57, 0.84)",
  },
  taskContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "rgb(45, 45, 43)",
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedTask: {
    backgroundColor: "rgb(215, 251, 166)", // Verde claro para tareas completadas
  },
  completedTaskText: {
    color: "rgb(22, 59, 6)", // Color de texto para tareas completadas
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "rgb(187, 187, 187)",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.22)', // Color de la sombra (negro con 50% de opacidad)
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra (2px a la derecha y 2px hacia abajo)
    textShadowRadius: 3, // Radio de desenfoque de la sombra
  },
  taskDescription: {
    fontSize: 14,
    color: '#6c757d',
    color: "rgb(162, 162, 162)",
  },
  taskHora: {
    fontSize: 14,
    color: "rgb(203, 203, 203)",
  },
});

export default TaskList;