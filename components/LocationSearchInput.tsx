// components/LocationSearchInput.tsx
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

const apiKeyGoogleMaps = Constants.expoConfig?.extra?.apiKeyGoogleMaps;
const screen = Dimensions.get('window');

interface LocationSearchInputProps {
  onPlaceSelected: (location: { latitude: number; longitude: number } | null, details: any | null) => void;
  // Adicione outras props se necessário, como placeholder customizado, etc.
}

/**
 * Componente de entrada para busca de locais usando a API do Google Places.
 * Permite buscar por nome, CEP ou endereço e retorna as coordenadas do local selecionado.
 *
 * @param {LocationSearchInputProps} props - As propriedades do componente.
 * @param {function} props.onPlaceSelected - Função de callback chamada quando um local é selecionado.
 * Recebe as coordenadas (latitude, longitude) e os detalhes completos do local.
 */
export default function LocationSearchInput({ onPlaceSelected }: LocationSearchInputProps) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Buscar local, CEP ou endereço"
      fetchDetails={true} // Garante que os detalhes completos do local sejam buscados
      onPress={(data, details = null) => {
        if (details) {
          const loc = details.geometry.location;
          const newLocation = {
            latitude: loc.lat,
            longitude: loc.lng,
          };
          onPlaceSelected(newLocation, details);
        } else {
          onPlaceSelected(null, null); // Caso nenhum detalhe seja retornado
        }
      }}
      query={{
        key: apiKeyGoogleMaps, // Sua chave da API do Google Maps
        language: 'pt-BR',
        timeout: 5000, // Adicionado para resolver o erro "Expected argument 7...to be a number, but got undefined"
        // components: 'country:br', // Opcional: Restringe a busca apenas ao Brasil
      }}
      predefinedPlaces={[]} // Pode ser usado para listar locais predefinidos
      textInputProps={{
        // Estilos adicionais para o TextInput interno, se necessário
        // placeholderTextColor: '#888',
      }}
      minLength={1} // Mínimo de caracteres para iniciar a busca
      enablePoweredByContainer={false} // Opcional: Remove o "Powered by Google"
      styles={{
        container: {
          position: 'absolute',
          top: 40,
          width: screen.width - 32, // Ajusta a largura para ter margem nas laterais
          zIndex: 10,
          alignSelf: 'center', // Centraliza o container
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 10, // Arredonda as bordas do container
          overflow: 'hidden', // Garante que o conteúdo respeite o borderRadius
        },
        textInputContainer: {
          backgroundColor: '#F1ECF9', // Cor de fundo do input
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 50,
        },
        textInput: {
          fontSize: 16,
          color: '#333',
        },
        listView: {
          backgroundColor: 'white',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          marginTop: 5,
        },
        row: {
          padding: 13,
          height: 44,
          flexDirection: 'row',
        },
        description: {
          fontSize: 15,
        },
        separator: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#c8c7cc',
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  // Se precisar de estilos adicionais para este componente, adicione aqui.
});