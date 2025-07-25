// screens/EditAlarmScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native'; // Adicionado ScrollView
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

import CustomPlacesAutoComplete from '../components/CustomPlacesAutoComplete';
import DaySelector from '../components/DaySelector';
import FrequencySelector from '../components/FrequencySelector'; // Novo componente
import ReminderActionForm from '../components/ReminderActionForm'; // Novo componente
import MessageActionForm, { MessageItem } from '../components/MessageActionForm'; // Novo componente e interface

import { saveAlarm, Alarm } from '../utils/alarmStorage';

const screen = Dimensions.get('window');
const apiKeyGoogleMaps = Constants.expoConfig?.extra?.apiKeyGoogleMaps;

const calculateDeltaForRadius = (radiusInMeters: number) => {
  const metersPerDegree = 111000;
  const idealDelta = (radiusInMeters * 2.5) / metersPerDegree;
  return idealDelta;
};

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

  // Novos estados para frequência e ações, inicializados com os dados do alarme
  const [frequency, setFrequency] = useState<'once' | 'repeat'>(alarm.frequency || 'once'); // Inicializa com valor salvo ou 'once'
  const [selectedActionType, setSelectedActionType] = useState<'none' | 'reminder' | 'message'>(alarm.actionType || 'none');
  const [reminderDescription, setReminderDescription] = useState(alarm.reminderDescription || '');
  const [messageActions, setMessageActions] = useState<MessageItem[]>(alarm.messageActions || []);

  const [mapAddress, setMapAddress] = useState('');
  const [mapDeltas, setMapDeltas] = useState(() => {
    const initialDelta = calculateDeltaForRadius(alarm.radius);
    return {
      latitudeDelta: initialDelta,
      longitudeDelta: initialDelta,
    };
  });

  const [loadingInitialAddress, setLoadingInitialAddress] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitialAddress(true);
      if (location) {
        await reverseGeocode(location);
      }
      setLoadingInitialAddress(false);
    };
    loadInitialData();
  }, []);

  const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKeyGoogleMaps}&language=pt-BR`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setMapAddress(data.results[0].formatted_address);
      } else {
        setMapAddress('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro no geocoding reverso:', error);
      setMapAddress('Erro ao buscar endereço');
    }
  };

  const handleMapPress = async (e: any) => {
    const newCoords = e.nativeEvent.coordinate;
    setLocation(newCoords);

    if (mapRef.current) {
      const currentRegion = await mapRef.current.getMapBoundaries();
      const currentLatitudeDelta = Math.abs(currentRegion.northEast.latitude - currentRegion.southWest.latitude);
      const currentLongitudeDelta = Math.abs(currentRegion.northEast.longitude - currentRegion.southWest.longitude);

      setMapDeltas({
        latitudeDelta: currentLatitudeDelta,
        longitudeDelta: currentLongitudeDelta,
      });

      mapRef.current.animateToRegion({
        ...newCoords,
        latitudeDelta: currentLatitudeDelta,
        longitudeDelta: currentLongitudeDelta,
      });
    }

    await reverseGeocode(newCoords);
  };

  const handlePlaceSelectedFromAutocomplete = async (newLocation: { latitude: number; longitude: number } | null, details: any | null) => {
    if (newLocation) {
      setLocation(newLocation);
      if (mapRef.current) {
        const currentRegion = await mapRef.current.getMapBoundaries();
        const currentLatitudeDelta = Math.abs(currentRegion.northEast.latitude - currentRegion.southWest.latitude);
        const currentLongitudeDelta = Math.abs(currentRegion.northEast.longitude - currentRegion.southWest.longitude);

        setMapDeltas({
          latitudeDelta: currentLatitudeDelta,
          longitudeDelta: currentLongitudeDelta,
        });

        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: currentLatitudeDelta,
          longitudeDelta: currentLongitudeDelta,
        });
      }
      if (details && details.formatted_address) {
        setMapAddress(details.formatted_address);
      }
    }
  };

  const handleRadiusChange = (value: number) => {
    setRadius(value);
    if (mapRef.current && location) {
      const newDelta = calculateDeltaForRadius(value);
      setMapDeltas({
        latitudeDelta: newDelta,
        longitudeDelta: newDelta,
      });
      mapRef.current.animateToRegion({
        ...location,
        latitudeDelta: newDelta,
        longitudeDelta: newDelta,
      });
    }
  };


  const save = async () => {
    if (!name || !location || selectedDays.length === 0) {
      Alert.alert('Preencha todos os campos obrigatórios (Nome, Local, Dias da Semana).');
      return;
    }

    // Validação específica para ações
    if (selectedActionType === 'reminder' && !reminderDescription.trim()) {
      Alert.alert('Ação Inválida', 'A descrição do lembrete não pode estar vazia.');
      return;
    }
    if (selectedActionType === 'message' && messageActions.length === 0) {
      Alert.alert('Ação Inválida', 'Adicione pelo menos uma mensagem para enviar.');
      return;
    }

    const updated: Alarm = {
      ...alarm,
      name,
      radius,
      days: selectedDays,
      latitude: location.latitude,
      longitude: location.longitude,
      frequency: frequency, // Salva a frequência

      actionType: selectedActionType, // Salva o tipo de ação
      reminderDescription: selectedActionType === 'reminder' ? reminderDescription.trim() : undefined,
      messageActions: selectedActionType === 'message' ? messageActions : undefined,
    };

    await saveAlarm(updated);
    navigation.navigate('Home');
  };

  if (loadingInitialAddress) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={{ marginTop: 10 }}>Carregando alarme...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomPlacesAutoComplete
        mapRef={mapRef}
        setLocation={handlePlaceSelectedFromAutocomplete}
        initialAddress={mapAddress}
        placeholder="Buscar local, CEP ou endereço"
        onLocationSelect={(newLocation: { latitude: number; longitude: number; } | null, details: any) => {
          handlePlaceSelectedFromAutocomplete(newLocation, details);
        }
        }
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: mapDeltas.latitudeDelta,
          longitudeDelta: mapDeltas.longitudeDelta,
        }}
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          if (!loadingInitialAddress) {
            setMapDeltas({
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            });
          }
        }}
      >
        <Marker coordinate={location} />
        <Circle center={location} radius={radius} fillColor="rgba(106,27,154,0.2)" strokeColor="#6A1B9A" />
      </MapView>

      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Alarme"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Raio: {radius} {radius > 1 ? 'metros' : 'metro'}</Text>
        <Slider
          value={radius}
          onValueChange={handleRadiusChange}
          minimumValue={1}
          maximumValue={300}
          step={1}
          minimumTrackTintColor="#6A1B9A"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6A1B9A"
        />

        <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />

        <FrequencySelector selectedFrequency={frequency} onChange={setFrequency} /> {/* Novo */}

        <Text style={styles.label}>Ação ao chegar:</Text>
        <View style={styles.actionTypeContainer}>
          <TouchableOpacity
            style={[styles.actionTypeButton, selectedActionType === 'none' && styles.selectedActionTypeButton]}
            onPress={() => setSelectedActionType('none')}
          >
            <Text style={[styles.actionTypeButtonText, selectedActionType === 'none' && styles.selectedActionTypeButtonText]}>Nenhuma</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionTypeButton, selectedActionType === 'reminder' && styles.selectedActionTypeButton]}
            onPress={() => setSelectedActionType('reminder')}
          >
            <Text style={[styles.actionTypeButtonText, selectedActionType === 'reminder' && styles.selectedActionTypeButtonText]}>Lembrete Local</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionTypeButton, selectedActionType === 'message' && styles.selectedActionTypeButton]}
            onPress={() => setSelectedActionType('message')}
          >
            <Text style={[styles.actionTypeButtonText, selectedActionType === 'message' && styles.selectedActionTypeButtonText]}>Enviar Mensagens</Text>
          </TouchableOpacity>
        </View>

        {selectedActionType === 'reminder' && (
          <ReminderActionForm
            description={reminderDescription}
            onChangeDescription={setReminderDescription}
          />
        )}

        {selectedActionType === 'message' && (
          <MessageActionForm
            messages={messageActions}
            onMessagesChange={setMessageActions}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
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
    maxHeight: screen.height * 0.5, // Limita a altura do formulário para o mapa ser visível
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
    marginBottom: 20, // Espaço extra para o ScrollView
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 4,
  },
  actionTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedActionTypeButton: {
    backgroundColor: '#6A1B9A',
  },
  actionTypeButtonText: {
    color: '#555',
    fontWeight: 'bold',
  },
  selectedActionTypeButtonText: {
    color: '#fff',
  },
});