import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo ao PinGo!</Text>
      <Text style={styles.description}>
        Defina alarmes, notificações e integrações baseados em localização com raio, dias e frequência personalizáveis.
      </Text>

      <Image
        source={require('../assets/icon.png')} // você pode trocar por uma local no assets
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Main')}>
        <Text style={styles.buttonText}>Vamos Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1ECF9', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  description: { textAlign: 'center', fontSize: 14, color: '#333', marginBottom: 30 },
  image: { width: '100%', height: 300 },
  button: {
    backgroundColor: '#3D5AFE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
