// utils/alarmStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Adicione a interface para as mensagens de ação
export interface MessageActionItem {
  id: string; // Adicionado para identificação única
  type: 'sms' | 'email' | 'whatsapp';
  target: string;
  message: string;
}

export interface Alarm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  days: string[];
  enabled: boolean;
  frequency: 'once' | 'repeat'; // 'once' para uma vez ao dia, 'repeat' para sempre

  actionType: 'none' | 'reminder' | 'message'; // Novo tipo para selecionar a ação
  reminderDescription?: string;
  messageActions?: MessageActionItem[];

  // NOVAS PROPRIEDADES PARA CONTROLE DE NOTIFICAÇÃO
  lastNotifiedAt?: string; // Data (ISO string) da última notificação para frequência 'once'
  lastRepeatedNotifiedAt?: string; // Data (ISO string) da última notificação para frequência 'repeat' (cooldown)
}

const ALARMS_KEY = '@alarms';

/**
 * Salva um novo alarme ou atualiza um existente.
 * @param {Alarm} alarm - O objeto alarme a ser salvo.
 */
export const saveAlarm = async (alarm: Alarm): Promise<void> => {
  try {
    const storedAlarms = await AsyncStorage.getItem(ALARMS_KEY);
    let alarms: Alarm[] = storedAlarms ? JSON.parse(storedAlarms) : [];

    const existingIndex = alarms.findIndex(a => a.id === alarm.id);
    if (existingIndex > -1) {
      // Atualiza alarme existente
      alarms[existingIndex] = alarm;
    } else {
      // Adiciona novo alarme
      alarms.push(alarm);
    }

    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    // console.log('Alarme salvo com sucesso:', alarm.id); // Remover para produção, manter para debug
  } catch (error) {
    console.error('Erro ao salvar alarme:', error);
    throw error;
  }
};

/**
 * Carrega todos os alarmes salvos.
 * @returns {Promise<Alarm[]>} Uma promessa que resolve para um array de alarmes.
 */
export const getAlarms = async (): Promise<Alarm[]> => {
  try {
    const storedAlarms = await AsyncStorage.getItem(ALARMS_KEY);
    return storedAlarms ? JSON.parse(storedAlarms) : [];
  } catch (error) {
    console.error('Erro ao carregar alarmes:', error);
    return [];
  }
};

/**
 * Deleta um alarme pelo seu ID.
 * @param {string} id - O ID do alarme a ser deletado.
 */
export const deleteAlarm = async (id: string): Promise<void> => {
  try {
    const storedAlarms = await AsyncStorage.getItem(ALARMS_KEY);
    let alarms: Alarm[] = storedAlarms ? JSON.parse(storedAlarms) : [];
    const filteredAlarms = alarms.filter(alarm => alarm.id !== id);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(filteredAlarms));
    // console.log('Alarme deletado com sucesso:', id); // Remover para produção
  } catch (error) {
    console.error('Erro ao deletar alarme:', error);
    throw error;
  }
};

/**
 * Atualiza o status 'enabled' de um alarme.
 * @param {string} id - O ID do alarme a ser atualizado.
 * @param {boolean} enabled - O novo status 'enabled'.
 */
export const updateAlarmEnabledStatus = async (id: string, enabled: boolean): Promise<void> => {
  try {
    const storedAlarms = await AsyncStorage.getItem(ALARMS_KEY);
    let alarms: Alarm[] = storedAlarms ? JSON.parse(storedAlarms) : [];
    const alarmIndex = alarms.findIndex(alarm => alarm.id === id);

    if (alarmIndex > -1) {
      alarms[alarmIndex].enabled = enabled;
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
      // console.log(`Status do alarme ${id} atualizado para ${enabled}`); // Remover para produção
    } else {
      console.warn(`Alarme com ID ${id} não encontrado para atualização de status.`);
    }
  } catch (error) {
    console.error('Erro ao atualizar status do alarme:', error);
    throw error;
  }
};