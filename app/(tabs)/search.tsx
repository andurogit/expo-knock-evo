import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const RADII = [1000, 5000, 10000]; // in meters

export default function SearchScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [radiusIndex, setRadiusIndex] = useState(0); // Default to 1km
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleRadiusChange = (index: number) => {
    setRadiusIndex(index);
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{errorMsg || 'Fetching location...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Current Location"
          pinColor="blue"
        />
        
        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={RADII[radiusIndex]}
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeColor="rgba(0, 122, 255, 0.5)"
          strokeWidth={2}
        />
      </MapView>

      <View style={styles.controls}>
        <Text style={styles.radiusLabel}>Radius</Text>
        <View style={styles.radiusSelector}>
          {RADII.map((r, index) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.radiusButton,
                radiusIndex === index && styles.activeRadiusButton
              ]}
              onPress={() => handleRadiusChange(index)}
            >
              <Text style={[
                styles.radiusText,
                radiusIndex === index && styles.activeRadiusText
              ]}>
                {r / 1000}km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  radiusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeRadiusButton: {
    backgroundColor: '#007AFF',
  },
  radiusText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  activeRadiusText: {
    color: '#fff',
  },
});
