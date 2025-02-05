// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/screens/TaskDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native';
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
      const updatedTask = { title, description, completed, due_date: dueDate.toISOString() };
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
        <TouchableOpacity
          style={[styles.completedButton, completed ? styles.completedYes : styles.completedNo]}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={styles.completedButtonText}>{completed ? "Sí" : "No"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.buttonActualizar, styles.buttonUpdateAc]}
        onPress={() => setUpdateModalVisibility(true)}
      >
        <Text style={styles.textStyle}>Actualizar Tarea</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonBorrar, styles.buttonDeleteBr]}
        onPress={() => setDeleteModalVisibility(true)}
      >
        <Text style={styles.textStyle}>Eliminar Tarea</Text>
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
                style={[styles.button, styles.buttonClose]}
                onPress={() => setUpdateModalVisibility(false)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonUpdate]}
                onPress={() => {
                  setUpdateModalVisibility(false);
                  handleUpdateTask();
                }}
              >
                <Text style={styles.textStyle}>Actualizar</Text>
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
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteModalVisibility(false)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={() => {
                  setDeleteModalVisibility(false);
                  handleDeleteTask();
                }}
              >
                <Text style={styles.textStyle}>Eliminar</Text>
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
    backgroundColor: '#f8f9fa',
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
  buttonActualizar: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonUpdateAc: {
    backgroundColor: '#4CAF50', // Verde para actualizar
  },
  buttonBorrar: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonDeleteBr: {
    backgroundColor: '#f44336', // Rojo para eliminar
  },
  button: {
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
  buttonUpdate: {
    backgroundColor: '#4CAF50', // Verde para actualizar
  },
  buttonDelete: {
    backgroundColor: '#f44336', // Rojo para eliminar
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default TaskDetailScreen;