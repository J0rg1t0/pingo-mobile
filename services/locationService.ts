// services/locationMonitor.ts
import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
import { Alarm, getAlarms, saveAlarm } from '../utils/alarmStorage';

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function checkProximityAndNotify() {
  const alarms = await getAlarms();
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'short' });
  const day = today.charAt(0).toUpperCase() + today.slice(1, 3); // Ex: "Seg"

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  for (let alarm of alarms) {
    if (!alarm.enabled || !alarm.days.includes(day)) continue;
    const dist = getDistanceFromLatLonInMeters(latitude, longitude, alarm.latitude, alarm.longitude);
    if (dist <= alarm.radius) {
      // Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: `PinGo: Você chegou em ${alarm.name}`,
      //     body: 'Hora de fazer o que você programou! 🛎️',
      //     sound: true,
      //   },
      //   trigger: null,
      // });
    }
  }
}
