import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DaySelector from '../components/DaySelector';

export default function EditAlarmScreen({ route, navigation }: any) {
  const { alarm } = route.params;

  const [name, setName] = useState(alarm?.name || '');
  const [radius, setRadius] = useState(alarm?.radius || 100);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const saveChanges = () => {
    // Salvar alteração (ex: AsyncStorage ou backend)
    console.log('Salvo:', { name, radius });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Alarme</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Casa, Trabalho..."
      />

      <Text style={styles.label}>Raio (em metros)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(radius)}
        onChangeText={v => setRadius(Number(v))}
      />
    <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />
      <TouchableOpacity style={styles.button} onPress={saveChanges}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1ECF9' },
  label: { fontWeight: 'bold', marginTop: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6A1B9A',
    padding: 16,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
