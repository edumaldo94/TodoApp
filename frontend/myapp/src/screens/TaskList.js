// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/TaskList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { getTasks } from '../app/api';
import io from 'socket.io-client';

const socket = io('http://192.168.0.107:5000'); // Reemplaza <TU_DIRECCION_IP> con la dirección IP de tu máquina de desarrollo

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
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { task: item })}>
            <View style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description.substring(0, 50)}...</Text>
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  taskContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default TaskList;