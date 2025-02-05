// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/TaskDetailScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { updateTask, deleteTask } from '../app/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io('http://192.168.0.107:5000'); // Reemplaza <TU_DIRECCION_IP> con la dirección IP de tu máquina de desarrollo

const TaskDetailScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);
  const [dueDate, setDueDate] = useState(new Date(task.due_date));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleUpdateTask = async () => {
    try {
      const updatedTask = { title, description, completed, due_date: dueDate.toISOString() };
      await updateTask(task.id, updatedTask);
      socket.emit('updateTask', { id: task.id, ...updatedTask });
      Alert.alert('Tarea actualizada', 'La tarea ha sido actualizada exitosamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la tarea');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      socket.emit('deleteTask', { id: task.id });
      Alert.alert('Tarea eliminada', 'La tarea ha sido eliminada exitosamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la tarea');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDueDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Detalles de la Tarea</Text>
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
      <Button title="Seleccionar Fecha y Hora" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={styles.selectedDate}>
        {`Fecha y Hora seleccionadas: ${moment(dueDate).format('YYYY-MM-DD HH:mm:ss')}`}
      </Text>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Completada:</Text>
        <Button title={completed ? "Sí" : "No"} onPress={() => setCompleted(!completed)} />
      </View>
      <Button title="Actualizar Tarea" onPress={handleUpdateTask} />
      <Button title="Eliminar Tarea" onPress={handleDeleteTask} color="red" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  textArea: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
  },
});

export default TaskDetailScreen;