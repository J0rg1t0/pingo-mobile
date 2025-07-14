import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');
let mapView: typeof MapView;
if (Platform.OS !== 'web') {
  mapView = require('react-native-maps').default;
}
export default function NewAlarmScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [radius, setRadius] = useState(200);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);
  
  if (Platform.OS === 'web') {
    return <Text>Mapa não disponível na versão web.</Text>;
  }

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
      >
        <Marker coordinate={location} />
        <Circle center={location} radius={radius} fillColor="rgba(106,27,154,0.2)" strokeColor="#6A1B9A" />
      </MapView>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Raio: {radius} metros</Text>
        <Slider
          style={{ width: '100%' }}
          minimumValue={50}
          maximumValue={500}
          step={10}
          value={radius}
          onValueChange={value => setRadius(value)}
          minimumTrackTintColor="#6A1B9A"
          maximumTrackTintColor="#aaa"
          thumbTintColor="#6A1B9A"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECF9' },
  map: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1ECF9'
  },
  sliderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
});
