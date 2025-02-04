import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TaskList from './src/screens/TaskList'; // Ajusta la ruta según tu estructura

export default function App() {
  return (
    <View style={styles.container}>
      <TaskList /> {/* Renderiza el componente TaskList */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});