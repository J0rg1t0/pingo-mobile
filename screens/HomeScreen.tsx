import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAlarms, deleteAlarm, Alarm, updateAlarm } from '../utils/alarmStorage';

export default function HomeScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  const loadAlarms = async () => {
    const storedAlarms = await getAlarms();
    setAlarms(storedAlarms);
  };

  useEffect(() => {
    if (isFocused) loadAlarms();
  }, [isFocused]);

  const confirmDelete = (id: string) => {
    Alert.alert('Excluir Alarme', 'Tem certeza que deseja excluir este alarme?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteAlarm(id);
          loadAlarms();
        }
      }
    ]);
  };

  const toggleAlarm = async (alarm: Alarm) => {
    const updatedAlarm = { ...alarm, enabled: !alarm.enabled };
    await updateAlarm(updatedAlarm);
    loadAlarms();
  };

  const renderItem = ({ item }: { item: Alarm }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditAlarmScreen', { alarm: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>Raio: {item.radius}m</Text>
        <Text style={styles.subtitle}>Dias: {item.days.join(', ')}</Text>
        <Text style={styles.subtitle}>Frequência: {item.frequency === 'once' ? 'Uma vez' : 'Sempre'}</Text>
      </View>
      <View style={styles.actions}>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleAlarm(item)}
          thumbColor={item.enabled ? '#2949EB' : '#ccc'}
          trackColor={{ true: '#aabcfb', false: '#ccc' }}
        />
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={{ marginLeft: 12 }}>
          <Ionicons name="trash" size={24} color="#B00020" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 32, color: '#666', fontSize: 16 }}>
            Nenhum alarme cadastrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECF9', padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666' },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
