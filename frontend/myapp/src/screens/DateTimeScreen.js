// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/DateTimeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTasks } from '../app/api';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io('http://192.168.0.107:5000'); // Reemplaza <TU_DIRECCION_IP> con la dirección IP de tu máquina de desarrollo

const DateTimeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

    // Escuchar eventos de nuevas tareas
    socket.on('newTask', (newTask) => {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    });

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off('newTask');
    };
  }, []);

  useEffect(() => {
    filterTasksByDate(selectedDate);
  }, [selectedDate, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filterTasksByDate = (date) => {
    const filtered = tasks.filter(task => moment(task.due_date).format('YYYY-MM-DD') === date);
    setFilteredTasks(filtered);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Fecha y Hora</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue'},
        }}
      />
      <Text style={styles.textFecha}>
        {`Tareas de la Fecha: ${selectedDate}`}
      </Text>
     
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(6, 60, 206, 0.84)",
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  textFecha: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 2,
    textAlign: 'center',
    color: "rgb(71, 237, 0)",
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskContainer: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: "rgb(111, 251, 86)",
    borderRadius: 8,
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    
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

export default DateTimeScreen;