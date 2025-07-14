// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAlarms, deleteAlarm, Alarm } from '../utils/alarmStorage';

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

  const renderItem = ({ item }: { item: Alarm }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditAlarm', { alarm: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>Raio: {item.radius}m</Text>
        <Text style={styles.subtitle}>Dias: {item.days.join(', ')}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Ionicons name="trash" size={24} color="#B00020" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
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
});
