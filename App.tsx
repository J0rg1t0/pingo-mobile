// App.tsx
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
// import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';
import NewAlarmScreen from './screens/NewAlarmScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';
import { checkProximityAndNotify } from './services/locationService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PreferencesScreen from './screens/PreferencesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import { requestNotificationPermissions } from './utils/notificationManager';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === 'HomeScreen') iconName = 'location';
          else if (route.name === 'NewAlarm') iconName = 'alarm';
          else if (route.name === 'Preferences') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A1B9A',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Alarmes' }} />
      <Tab.Screen name="NewAlarm" component={NewAlarmScreen} options={{ title: 'Novo Alarme' }} />
      <Tab.Screen name="Preferences" component={PreferencesScreen} options={{ title: 'Preferências' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('hasLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('hasLaunched', 'true');
        setFirstLaunch(true);
      }
      setLoading(false);
    });
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

  if (loading) return null;
  
  // return (
  //   <NavigationContainer>
  //     <StatusBar barStyle="default" />
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name="Welcome" component={WelcomeScreen} />
  //       <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
  //       <Stack.Screen name="Main" component={MainTabs} />
  //       <Stack.Screen name="EditAlarm" component={EditAlarmScreen} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NewAlarmScreen" component={NewAlarmScreen} options={{ title: 'Novo Alarme' }} />
          <Stack.Screen name="EditAlarmScreen" component={EditAlarmScreen} options={{ title: 'Editar Alarme' }} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}
