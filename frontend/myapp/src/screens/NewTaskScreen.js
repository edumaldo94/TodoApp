// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/NewTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';
import { addTask } from '../app/api';

const NewTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleAddTask = async () => {
    try {
      // Convertir la fecha a la zona horaria de Buenos Aires
      const formattedDate = moment(date).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss');
      await addTask({ title, description, due_date: formattedDate });
      Alert.alert('Tarea añadida', 'La tarea ha sido añadida exitosamente');
      // Limpiar los campos después de añadir la tarea
      setTitle('');
      setDescription('');
      setDate(new Date());
      // Navegar a la pantalla de lista de tareas
      navigation.navigate('MainTabs', { screen: 'TaskList', params: { refresh: true } });
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Hubo un problema al añadir la tarea');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Nueva Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>Seleccionar Fecha y Hora</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={styles.selectedDate}>
        {`Fecha y Hora seleccionadas: ${moment(date).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss')}`}
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Añadir Tarea</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "rgba(8, 57, 125, 0.84)",
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textArea: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  dateButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "rgba(236, 213, 10, 0.95)",
    alignItems: 'center',
    elevation: 2,
  },
  dateButtonText: {
    color:"rgba(255, 255, 255, 0.95)",
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDate: {
    fontSize: 20,
    color:"rgba(255, 255, 255, 0.95)",
    marginBottom: 20,
  },
  addButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#28a745',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewTaskScreen;