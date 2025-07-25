import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FrequencySelectorProps {
  selectedFrequency: 'once' | 'repeat';
  onChange: (frequency: 'once' | 'repeat') => void;
}

export default function FrequencySelector({ selectedFrequency, onChange }: FrequencySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequência:</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedFrequency === 'once' && styles.selectedOptionButton,
          ]}
          onPress={() => onChange('once')}
        >
          <Text
            style={[
              styles.optionButtonText,
              selectedFrequency === 'once' && styles.selectedOptionButtonText,
            ]}
          >
            Uma vez (no dia)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedFrequency === 'repeat' && styles.selectedOptionButton,
          ]}
          onPress={() => onChange('repeat')}
        >
          <Text
            style={[
              styles.optionButtonText,
              selectedFrequency === 'repeat' && styles.selectedOptionButtonText,
            ]}
          >
            Repetir (sempre)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#444',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 4,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#2949EB',
  },
  optionButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  selectedOptionButtonText: {
    color: '#fff',
  },
});