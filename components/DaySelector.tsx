import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function DaySelector({ selectedDays, onChange }: any) {
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d: string) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      {dias.map(day => (
        <TouchableOpacity
          key={day}
          style={[styles.day, selectedDays.includes(day) && styles.selected]}
          onPress={() => toggleDay(day)}
        >
          <Text style={styles.text}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
  day: {
    backgroundColor: '#E1D5F0',
    padding: 8,
    borderRadius: 10,
    margin: 5,
  },
  selected: {
    backgroundColor: '#6A1B9A',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
