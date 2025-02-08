// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/DateTimeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTasks } from '../app/api';
import moment from 'moment';
import io from 'socket.io-client';
import eventEmitter from '../app/eventEmitter';

const socket = io(process.env.BACKEND_URL);

const DateTimeScreen = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    refresh();

    // Escuchar eventos de nuevas tareas
    socket.on('newTask', (newTask) => {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      refresh();
    });

    // Escuchar eventos de actualización de tareas
    socket.on('updateTask', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      refresh();
    });

    // Escuchar eventos de eliminación de tareas
    socket.on('deleteTask', ({ id }) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      refresh();
    });

    // Escuchar el evento personalizado para refrescar la pantalla
    eventEmitter.on('refreshDateTimeScreen', refresh);

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      socket.off('newTask');
      socket.off('updateTask');
      socket.off('deleteTask');
      eventEmitter.off('refreshDateTimeScreen', refresh);
    };
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      refresh();
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    filterTasksByDate(selectedDate);
    markTaskDates(tasks);
  }, [selectedDate, tasks]);

  const refresh = async () => {
    await fetchTasks();
    filterTasksByDate(selectedDate);
    markTaskDates(tasks);
  };

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filterTasksByDate = (date) => {
    const filtered = tasks.filter(task => moment(task.due_date).format('YYYY-MM-DD') === date);
    setFilteredTasks(filtered);
  };

  const markTaskDates = (tasks) => {
    const dates = {};
    tasks.forEach(task => {
      const date = moment(task.due_date).format('YYYY-MM-DD');
      if (dates[date]) {
        dates[date].marked = true;
      } else {
        dates[date] = { marked: true };
      }
    });
    setMarkedDates(dates);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.text}>Fecha y Hora</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, selectedColor: 'red' },
        }}
        theme={{
          backgroundColor: 'rgba(143, 18, 18, 0.84)', // Cambia el color de fondo del calendario
          calendarBackground: 'rgba(56, 56, 68, 0.84)', // Cambia el color de fondo del calendario
          textSectionTitleColor: 'rgb(192, 192, 192)', // Cambia el color del texto de los títulos de las secciones
          dayTextColor: 'rgb(203, 203, 203)', // Cambia el color del texto de los días
          todayTextColor: 'red', // Cambia el color del texto del día actual
          selectedDayTextColor: 'white', // Cambia el color del texto del día seleccionado
          monthTextColor: 'rgb(192, 192, 192)', // Cambia el color del texto del mes
          indicatorColor: 'red', // Cambia el color del indicador
          textDayFontFamily: 'monospace', // Cambia la fuente del texto de los días
          textMonthFontFamily: 'monospace', // Cambia la fuente del texto del mes
          textDayHeaderFontFamily: 'monospace', // Cambia la fuente del texto de los encabezados de los días
          textDayFontWeight: '300', // Cambia el peso de la fuente del texto de los días
          textMonthFontWeight: 'bold', // Cambia el peso de la fuente del texto del mes
          textDayHeaderFontWeight: '300', // Cambia el peso de la fuente del texto de los encabezados de los días
          textDayFontSize: 16, // Cambia el tamaño de la fuente del texto de los días
          textMonthFontSize: 16, // Cambia el tamaño de la fuente del texto del mes
          textDayHeaderFontSize: 16, // Cambia el tamaño de la fuente del texto de los encabezados de los días
        }}
      />
      <Text style={styles.textFecha}>
        {`Tareas de la Fecha: ${selectedDate}`}
      </Text>
      <FlatList
        data={filteredTasks}
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
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.84)",
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: "rgb(192, 192, 192)",
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Color de la sombra (negro con 50% de opacidad)
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra (2px a la derecha y 2px hacia abajo)
    textShadowRadius: 3, // Radio de desenfoque de la sombra
  },
  textFecha: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 2,
    textAlign: 'center',
    color: "rgb(192, 192, 192)",
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Color de la sombra (negro con 50% de opacidad)
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra (2px a la derecha y 2px hacia abajo)
    textShadowRadius: 3, // Radio de desenfoque de la sombra
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
    backgroundColor: "rgb(45, 45, 43)",
    borderRadius: 8,
    shadowColor: "rgb(0, 0, 0)",
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
    color: "rgb(203, 203, 203)",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.31)', // Color de la sombra (negro con 50% de opacidad)
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra (2px a la derecha y 2px hacia abajo)
    textShadowRadius: 3, // Radio de desenfoque de la sombra
  },
  taskDescription: {
    fontSize: 14,
    color: "rgb(203, 203, 203)",
  },
  taskHora: {
    fontSize: 14,
    color: "rgb(203, 203, 203)",
  },
});

export default DateTimeScreen;