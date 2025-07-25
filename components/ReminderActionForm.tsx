// components/ReminderActionForm.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ReminderActionFormProps {
  description: string;
  onChangeDescription: (text: string) => void;
}

export default function ReminderActionForm({ description, onChangeDescription }: ReminderActionFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição do Lembrete:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Ex: Pegar as chaves, ligar para Fulano..."
        value={description}
        onChangeText={onChangeDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top" // Para Android, posiciona o texto no topo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#444',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80, // Altura mínima para a caixa de texto
    fontSize: 16,
    color: '#333',
  },
});