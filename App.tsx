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
        tabBarActiveTintColor: '#2949EB',
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
          console.log('checkProximityAndNotify chamado');
          checkProximityAndNotify();
        }, 10000); // A cada 10 segundos (10000 ms)
    
        // Limpar o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
      }, []); 

  if (loading) return null;

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
