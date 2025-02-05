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
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator>
        <Tab.Screen name="Nueva Tarea" component={NewTaskScreen} options={{ title: 'Nueva Tarea' }} />
        <Tab.Screen name="Lista de Tareas" component={TaskList} options={{ title: 'Lista de Tareas' }} />
        <Tab.Screen name="Fecha y Hora" component={DateTimeScreen} options={{ title: 'Fecha y Hora' }} />
      </Tab.Navigator>
    </SafeAreaView>
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
    backgroundColor: "rgb(248, 12, 12)",
  },
});