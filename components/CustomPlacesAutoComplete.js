import React, { useState, useCallback, useEffect, useRef } from 'react'; // Adicionado useEffect e useRef
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Constants from 'expo-constants';

const CustomPlacesAutoComplete = ({
  onLocationSelect,
  mapRef,
  placeholder = "Buscar local, CEP ou endereço",
  setLocation,
  // Adicione esta nova prop
  initialAddress = '' // Novo prop para definir o texto inicial do input
}) => {
  const [query, setQuery] = useState(initialAddress); // Inicializa com a prop
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const apiKey = Constants.expoConfig?.extra?.apiKeyGoogleMaps;

  const debounceTimeoutRef = useRef(null); // Para o debounce

  // Efeito para atualizar o 'query' quando initialAddress muda (e vem de fora)
  useEffect(() => {
    // Apenas atualiza se initialAddress for diferente do query atual
    // e se o usuário não estiver digitando ativamente (evita sobrescrever)
    if (initialAddress && initialAddress !== query && !showResults) {
        setQuery(initialAddress);
    }
  }, [initialAddress]); // Dependência na nova prop


  const searchPlaces = useCallback(async (text) => {
    if (text.length < 2) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}&language=pt-BR&components=country:br`
      );
      const data = await response.json();

      // console.log('Search results:', data); // Debug

      if (data.predictions && data.predictions.length > 0) {
        setResults(data.predictions);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const getPlaceDetails = async (placeId, description) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry,name,formatted_address`
      );
      const data = await response.json();

      // console.log('Place details:', data); // Debug

      if (data.result && data.result.geometry) {
        const loc = data.result.geometry.location;
        const newLocation = {
          latitude: loc.lat,
          longitude: loc.lng
        };

        if (setLocation) {
          setLocation(newLocation);
        }

        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }

        if (mapRef && mapRef.current) {
          mapRef.current.animateToRegion({
            ...newLocation,
            latitudeDelta: 0.0025,
            longitudeDelta: 0.0025,
          });
        }

        setResults([]);
        setShowResults(false);
        setQuery(description); // Define o texto do input como o endereço selecionado
      }
    } catch (error) {
      console.error('Details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text) => {
    setQuery(text);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (text.length > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        searchPlaces(text);
      }, 300); // Debounce de 300ms
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectPlace = (item) => {
    getPlaceDetails(item.place_id, item.description);
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // Limpeza do debounce ao desmontar o componente
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => {
            if (results.length > 0 && query.length > 0) { // Mostra resultados se houver algo digitado
              setShowResults(true);
            }
          }}
          onBlur={() => { // Esconde resultados ao perder o foco, mas com um pequeno delay
              // Isso ajuda a garantir que o clique em um item da lista seja registrado
              setTimeout(() => setShowResults(false), 100);
          }}
          placeholderTextColor="#666"
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#007AFF"
            style={styles.loadingIndicator}
          />
        )}

        {query.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          style={styles.resultsList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item)}
            >
              <Text style={styles.mainText}>
                {item.structured_formatting?.main_text || item.description}
              </Text>
              {item.structured_formatting?.secondary_text && (
                <Text style={styles.secondaryText}>
                  {item.structured_formatting.secondary_text}
                </Text>
              )}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  clearButton: {
    marginLeft: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  resultsList: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultItem: {
    padding: 15,
  },
  mainText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
});

export default CustomPlacesAutoComplete;