// screens/EditAlarmScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DaySelector from '../components/DaySelector';
import { saveAlarm, Alarm } from '../utils/alarmStorage';

const screen = Dimensions.get('window');
const apiKeyGoogleMaps = process.env.API_KEY_GOOGLE_MAPS;

export default function EditAlarmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { alarm } = route.params;

  const mapRef = useRef<MapView>(null);

  const [name, setName] = useState(alarm.name);
  const [radius, setRadius] = useState(alarm.radius);
  const [selectedDays, setSelectedDays] = useState<string[]>(alarm.days);
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: alarm.latitude,
    longitude: alarm.longitude,
  });

  const save = async () => {
    if (!name || !location || selectedDays.length === 0) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const updated: Alarm = {
      ...alarm,
      name,
      radius,
      days: selectedDays,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    await saveAlarm(updated);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Buscar local, CEP ou endereço"
        fetchDetails
        onPress={(data, details = null) => {
          if (details) {
            const loc = details.geometry.location;
            const newLocation = {
              latitude: loc.lat,
              longitude: loc.lng
            };
            setLocation(newLocation);
            mapRef.current?.animateToRegion({
              ...newLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
        query={{
          key: apiKeyGoogleMaps,
          language: 'pt-BR',
        }}
        styles={{
          container: { position: 'absolute', top: 40, width: '100%', zIndex: 10 },
          listView: { backgroundColor: 'white' },
        }}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={e => setLocation(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={location} />
        <Circle center={location} radius={radius} fillColor="rgba(106,27,154,0.2)" strokeColor="#6A1B9A" />
      </MapView>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Alarme"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Raio: {radius} metros</Text>
        <Slider
          value={radius}
          onValueChange={setRadius}
          minimumValue={50}
          maximumValue={500}
          step={10}
          minimumTrackTintColor="#6A1B9A"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6A1B9A"
        />

        <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />

        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECF9' },
  map: { flex: 1 },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#444'
  },
  button: {
    backgroundColor: '#6A1B9A',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
