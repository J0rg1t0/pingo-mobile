import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pingo_alarms';

export type Alarm = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  days: string[];  // ["Seg", "Qua", "Sex"]
  enabled: boolean;
  action: {
    type: 'whatsapp' | 'sms' | 'email' | 'alexa';
    target: string;  // Phone number, email, etc.
    message: string; // Message to send
  } | undefined;
};

export async function getAlarms(): Promise<Alarm[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveAlarm(alarm: Alarm) {
  const alarms = await getAlarms();
  const updated = alarms.filter(a => a.id !== alarm.id);
  updated.push(alarm);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function deleteAlarm(id: string) {
  const alarms = await getAlarms();
  const updated = alarms.filter(a => a.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
