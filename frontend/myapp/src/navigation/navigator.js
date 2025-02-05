// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/navigation/navigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskList from '../screens/TaskList';
import NewTaskScreen from '../screens/NewTaskScreen';
import DateTimeScreen from '../screens/DateTimeScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { SafeAreaView, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="NewTask" component={NewTaskScreen} options={{ title: 'Nueva Tarea' }} />
      <Tab.Screen name="TaskList" component={TaskList} options={{ title: 'Lista de Tareas' }} />
      <Tab.Screen name="DateTime" component={DateTimeScreen} options={{ title: 'Fecha y Hora' }} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalles de la Tarea' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});