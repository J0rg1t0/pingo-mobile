// utils/notificationManager.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura o manipulador de notificações em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permissão para enviar notificações.
 * Deve ser chamado no início do aplicativo.
 */
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return true;
}

/**
 * Envia uma notificação local imediatamente.
 * @param {string} title - Título da notificação.
 * @param {string} body - Corpo da notificação.
 */
export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { someData: 'goes here' }, // Dados adicionais que podem ser úteis
    },
    trigger: null, // Envia imediatamente
  });
  console.log('Notificação enviada:', title);
}