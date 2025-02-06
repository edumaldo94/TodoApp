import React, { useState } from 'react';
import { View, Text, TextInput, Button,StatusBar, StyleSheet, SafeAreaView, Alert } from 'react-native';
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
      //navigation.navigate('Lista de Tareas'); // Navegar a la pantalla de lista de tareas
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
      <Button title="Seleccionar Fecha y Hora" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={styles.selectedDate}>
        {`Fecha y Hora seleccionadas: ${moment(date).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD HH:mm:ss')}`}
      </Text>
      <Button title="Añadir Tarea" onPress={handleAddTask} />
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
});

export default NewTaskScreen;