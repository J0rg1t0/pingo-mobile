// components/MessageActionForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Removido FlatList
import { Ionicons } from '@expo/vector-icons';

export interface MessageItem {
  id: string;
  type: 'sms' | 'email' | 'whatsapp';
  target: string;
  message: string;
}

interface MessageActionFormProps {
  messages: MessageItem[];
  onMessagesChange: (messages: MessageItem[]) => void;
}

export default function MessageActionForm({ messages, onMessagesChange }: MessageActionFormProps) {
  const [currentType, setCurrentType] = useState<MessageItem['type']>('sms');
  const [currentTarget, setCurrentTarget] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  const addMessage = () => {
    if (!currentType || !currentTarget || !currentMessage) {
      Alert.alert('Preencha todos os campos da mensagem.');
      return;
    }
    if (messages.length >= 3) {
      Alert.alert('Limite atingido', 'Você pode adicionar no máximo 3 mensagens.');
      return;
    }

    const newMessage: MessageItem = {
      id: Math.random().toString(),
      type: currentType,
      target: currentTarget,
      message: currentMessage,
    };

    onMessagesChange([...messages, newMessage]);
    setCurrentTarget('');
    setCurrentMessage('');
  };

  const removeMessage = (id: string) => {
    onMessagesChange(messages.filter(msg => msg.id !== id));
  };

  const renderMessageItem = (item: MessageItem) => ( // Renderiza um item individual
    <View key={item.id} style={styles.messageItem}>
      <View style={styles.messageContent}>
        <Text style={styles.messageTypeText}>Tipo: {item.type.toUpperCase()}</Text>
        <Text style={styles.messageTargetText}>Para: {item.target}</Text>
        <Text style={styles.messageText}>"{item.message}"</Text>
      </View>
      <TouchableOpacity onPress={() => removeMessage(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={20} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mensagens a Enviar:</Text>

      {/* Renderiza as mensagens diretamente, sem FlatList */}
      {messages.length > 0 ? (
        messages.map(renderMessageItem)
      ) : (
        <Text style={styles.emptyListText}>Nenhuma mensagem adicionada.</Text>
      )}

      {messages.length < 3 && (
        <View style={styles.addMessageForm}>
          <Text style={styles.label}>Adicionar Nova Mensagem:</Text>
          <View style={styles.typeOptions}>
            {['sms', 'email', 'whatsapp'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  currentType === type && styles.selectedTypeButton,
                ]}
                onPress={() => setCurrentType(type as MessageItem['type'])}
              >
                <Text style={[styles.typeButtonText, currentType === type && styles.selectedTypeButtonText]}>
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Destinatário (número ou e-mail)"
            value={currentTarget}
            onChangeText={setCurrentTarget}
            keyboardType={currentType === 'email' ? 'email-address' : 'default'}
          />
          <TextInput
            style={styles.input}
            placeholder="Mensagem"
            value={currentMessage}
            onChangeText={setCurrentMessage}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMessage}>
            <Text style={styles.addButtonText}>Adicionar Mensagem</Text>
          </TouchableOpacity>
        </View>
      )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  messagesList: {
    maxHeight: 200, // Limita a altura da lista de mensagens
    marginBottom: 10,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageContent: {
    flex: 1,
  },
  messageTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 2,
  },
  messageTargetText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  addMessageForm: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#444',
  },
  typeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    padding: 5,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#6A1B9A',
  },
  typeButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#8BC34A', // Cor para adicionar
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});