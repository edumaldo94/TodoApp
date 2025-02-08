// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/TaskDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
import { updateTask, deleteTask } from '../app/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import io from 'socket.io-client';

//const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.107:5000'); // Reemplaza <TU_DIRECCION_IP> con la dirección IP de tu máquina de desarrollo
const socket = io(process.env.REACT_APP_BACKEND_URL);
const TaskDetailScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);
  const [dueDate, setDueDate] = useState(new Date(task.due_date));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisibility] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);

  useEffect(() => {
    // Conectar al socket cuando el componente se monta
    socket.connect();

    // Desconectar del socket cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateTask = async () => {
    try {
      const formattedDate = moment(dueDate).format('YYYY-MM-DD HH:mm:ss'); // Formateamos la fecha
      const updatedTask = { title, description, completed, due_date: formattedDate };
      await updateTask(task.id, updatedTask);
      socket.emit('updateTask', { id: task.id, ...updatedTask });
      Alert.alert('Tarea actualizada', 'La tarea ha sido actualizada exitosamente');
      navigation.navigate('MainTabs', { screen: 'TaskList', params: { refresh: true } });
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
      navigation.navigate('MainTabs', { screen: 'TaskList', params: { refresh: true } });
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
        {`Fecha y Hora seleccionadas: ${moment(dueDate).format('YYYY-MM-DD HH:mm:ss')}`}
      </Text>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Completada:</Text>
        <TouchableOpacity
          style={[styles.completedButton, completed ? styles.completedYes : styles.completedNo]}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={styles.completedButtonText}>{completed ? "Sí" : "No"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.buttonUpdate]}
        onPress={() => setUpdateModalVisibility(true)}
      >
        <Text style={styles.buttonText}>Actualizar Tarea</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonDelete]}
        onPress={() => setDeleteModalVisibility(true)}
      >
        <Text style={styles.buttonText}>Eliminar Tarea</Text>
      </TouchableOpacity>

      {/* Modal de Confirmación de Actualización */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateModalVisible}
        onRequestClose={() => setUpdateModalVisibility(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Deseas actualizar esta tarea?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setUpdateModalVisibility(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonUpdate]}
                onPress={() => {
                  setUpdateModalVisibility(false);
                  handleUpdateTask();
                }}
              >
                <Text style={styles.modalButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisibility(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Deseas eliminar esta tarea?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setDeleteModalVisibility(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={() => {
                  setDeleteModalVisibility(false);
                  handleDeleteTask();
                }}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
    color: '#fff',
  },
  completedButton: {
    padding: 10,
    borderRadius: 5,
  },
  completedYes: {
    backgroundColor: '#4CAF50', // Verde para "Sí"
  },
  completedNo: {
    backgroundColor: '#f44336', // Rojo para "No"
  },
  completedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 10,
  },
  buttonUpdate: {
    backgroundColor: '#28a745', // Verde para actualizar
  },
  buttonDelete: {
    backgroundColor: '#f44336', // Rojo para eliminar
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TaskDetailScreen;