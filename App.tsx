// App.tsx (ou o arquivo de entrada principal do seu app)
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importe suas telas
import HomeScreen from './screens/HomeScreen';
import NewAlarmScreen from './screens/NewAlarmScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';

// Importe as novas funções de utilidade
import { requestNotificationPermissions } from './utils/notificationManager';
import { checkProximityAndNotify } from './utils/proximityChecker';
import { startBackgroundLocationTask } from './utils/locationTask';



const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    startBackgroundLocationTask();
  }, []);

  useEffect(() => {
    // 1. Solicitar permissão de notificação no início do app
    requestNotificationPermissions();

    // 2. Agendar chamadas periódicas a checkProximityAndNotify()
    const intervalId = setInterval(() => {
      checkProximityAndNotify();
    }, 10000); // A cada 10 segundos (10000 ms)

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewAlarm" component={NewAlarmScreen} options={{ title: 'Novo Alarme' }} />
        <Stack.Screen name="EditAlarm" component={EditAlarmScreen} options={{ title: 'Editar Alarme' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}