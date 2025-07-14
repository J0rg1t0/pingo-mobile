import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export async function checkIfUserIsInZone(alarm: {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  triggered?: boolean;
}) {
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const distance = getDistanceFromLatLonInMeters(
    latitude,
    longitude,
    alarm.latitude,
    alarm.longitude
  );

  if (distance <= alarm.radius && !alarm.triggered) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `PinGo: Você chegou em ${alarm.name}`,
        body: 'Hora de fazer a tarefa que você programou!',
        sound: true,
      },
      trigger: null,
    });

    alarm.triggered = true;
    console.log('Notificação disparada!');
  } else if (distance > alarm.radius && alarm.triggered) {
    alarm.triggered = false; // reset para disparar novamente
  }
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // em metros
}
