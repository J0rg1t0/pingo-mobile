// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import NewAlarmScreen from './screens/NewAlarmScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';

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

  if (loading) return null;

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstLaunch && <Stack.Screen name="Welcome" component={WelcomeScreen} />}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="EditAlarm" component={EditAlarmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
