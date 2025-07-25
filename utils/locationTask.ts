// utils/locationTask.ts
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { checkProximityAndNotify } from './proximityChecker';

const LOCATION_TASK_NAME = 'location-background-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Erro na tarefa de localização em background:', error);
    return;
  }

  if (data) {
    console.log('Executando verificação de proximidade em background...');
    await checkProximityAndNotify();
  }
});

export async function startBackgroundLocationTask() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 100, // em metros
      deferredUpdatesInterval: 30000, // 30 segundos
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'PinGo ativo',
        notificationBody: 'Monitorando alarmes de localização em segundo plano',
      },
    });
  }
}
