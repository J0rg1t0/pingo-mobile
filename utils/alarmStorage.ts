import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alarm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  days: string[];
  enabled: boolean;
  frequency: 'once' | 'repeat';
  actionType?: 'none' | 'reminder' | 'message';
  reminderDescription?: string;
  messageActions?: any[]; 
  _insideRegion?: boolean; 
  lastNotifiedAt?: string; 
  lastRepeatedNotifiedAt?: string; 
}

const ALARM_STORAGE_KEY = 'ALARMS';

export const getAlarms = async (): Promise<Alarm[]> => {
  const json = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveAlarm = async (alarm: Alarm) => {
  const alarms = await getAlarms();
  alarms.push(alarm);
  await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
};

export const deleteAlarm = async (id: string) => {
  const alarms = await getAlarms();
  const filtered = alarms.filter(alarm => alarm.id !== id);
  await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(filtered));
};

export const updateAlarm = async (updated: Alarm) => {
  const alarms = await getAlarms();
  const newList = alarms.map(alarm => alarm.id === updated.id ? updated : alarm);
  await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(newList));
};
