// utils/proximityChecker.ts
import * as Location from 'expo-location';
import { getAlarms, saveAlarm, Alarm } from './alarmStorage';
import { sendLocalNotification } from './notificationManager';
import { sendMultipleMessages } from './messageSender';

const REPEAT_COOLDOWN_MINUTES = 5;

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function checkProximityAndNotify() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permissão de localização não concedida para verificar proximidade.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const alarms = await getAlarms();

    for (const alarm of alarms) {
      if (!alarm.enabled) continue;

      const distance = getDistanceInMeters(
        alarm.latitude,
        alarm.longitude,
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      if (distance <= alarm.radius) {
        let shouldNotify = false;
        const now = new Date();

        if (alarm.frequency === 'once') {
          if (!alarm.lastNotifiedAt) {
            shouldNotify = true;
          } else {
            const lastNotifiedDate = new Date(alarm.lastNotifiedAt);
            if (
              lastNotifiedDate.getUTCFullYear() !== now.getUTCFullYear() ||
              lastNotifiedDate.getUTCMonth() !== now.getUTCMonth() ||
              lastNotifiedDate.getUTCDate() !== now.getUTCDate()
            ) {
              shouldNotify = true;
            }
          }
          if (shouldNotify) {
            alarm.lastNotifiedAt = now.toISOString();
          }
        } else if (alarm.frequency === 'repeat') {
          if (!alarm.lastRepeatedNotifiedAt) {
            shouldNotify = true;
          } else {
            const lastRepeatedNotifiedTime = new Date(alarm.lastRepeatedNotifiedAt).getTime();
            const cooldownDurationMs = REPEAT_COOLDOWN_MINUTES * 60 * 1000;
            if (now.getTime() - lastRepeatedNotifiedTime > cooldownDurationMs) {
              shouldNotify = true;
            }
          }
          if (shouldNotify) {
            alarm.lastRepeatedNotifiedAt = now.toISOString();
          }
        }

        if (shouldNotify) {
          let notificationTitle = `Alarme: ${alarm.name}`;
          let notificationBody = 'Você está perto do local do seu alarme!';

          if (alarm.actionType === 'reminder' && alarm.reminderDescription) {
            notificationBody = `Lembrete: ${alarm.reminderDescription}`;
          } else if (alarm.actionType === 'message' && alarm.messageActions && alarm.messageActions?.length > 0) {
            notificationBody = `Mensagem: ${alarm.messageActions[0].message} (para ${alarm.messageActions[0].target})`;
            if (alarm.messageActions.length > 1) {
              notificationBody += ` e mais ${alarm.messageActions.length - 1} mensagem(ns).`;
            }

            // Envia as mensagens
            await sendMultipleMessages(alarm.messageActions);
          }

          await sendLocalNotification(notificationTitle, notificationBody);
          await saveAlarm(alarm);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao verificar proximidade e notificar:', error);
  }
}
