import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function PreferencesScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.section}>Alarme</Text>
      <Text style={styles.option}>Som do Alarme</Text>
      <Text style={styles.subOption}>Padrão</Text>

      <Text style={styles.section}>Notificações</Text>
      <View style={styles.row}>
        <Text style={styles.option}>Notificações</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1ECF9' },
  section: { fontWeight: 'bold', fontSize: 16, marginTop: 20 },
  option: { fontSize: 14, marginTop: 10 },
  subOption: { color: 'gray', fontSize: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
