import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const RADII = [1000, 5000, 10000];

// 데모 모드 설정 (API 키가 없을 때 true로 두면 크래시를 방지합니다)
const IS_DEMO_MODE = true; 

export default function SearchScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        setErrorMsg('Location services are disabled.');
        setLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied.');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error: any) {
      console.warn('Location Error:', error.message);
      setErrorMsg('Using default location for demo.');
      
      // 데모를 위한 기본 위치 설정 (서울역 인근)
      setLocation({
        coords: {
          latitude: 37.5547,
          longitude: 126.9706,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      } as any);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleRadiusChange = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRadiusIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e293b" />
        <Text style={styles.loadingText}>Preparing Map Analysis...</Text>
      </View>
    );
  }

  // 지도를 렌더링할지, 데모용 플레이스홀더를 보여줄지 결정
  const renderMap = () => {
    if (IS_DEMO_MODE && Platform.OS === 'android') {
      return (
        <View style={[styles.map, styles.demoMapContainer]}>
          <View style={styles.gridPattern} />
          <Ionicons name="map-outline" size={80} color="#cbd5e1" />
          <Text style={styles.demoText}>Demo Map View</Text>
          <Text style={styles.demoSubText}>API Key required for live Google Maps</Text>
          
          {/* 가짜 위치 표시자 */}
          <View style={styles.demoMarkerContainer}>
             <View style={styles.markerCircle}>
              <View style={styles.markerInner} />
            </View>
            <View style={styles.demoCircle} />
          </View>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 37.5665,
          longitude: location?.coords.longitude || 126.9780,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {location?.coords && (
          <>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            >
              <View style={styles.markerCircle}>
                <View style={styles.markerInner} />
              </View>
            </Marker>
            
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={RADII[radiusIndex]}
              fillColor="rgba(30, 41, 59, 0.08)"
              strokeColor="rgba(30, 41, 59, 0.3)"
              strokeWidth={1.5}
            />
          </>
        )}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}

      <View style={styles.topBar}>
        <BlurView intensity={80} tint="light" style={styles.blurTop}>
          <Text style={styles.topTitle}>Nearby Analysis</Text>
          <Text style={styles.topSubtitle}>
            {errorMsg ? errorMsg : 'Policies within range'}
          </Text>
        </BlurView>
      </View>

      <View style={styles.controls}>
        <BlurView intensity={90} tint="light" style={styles.blurControls}>
          <Text style={styles.radiusLabel}>Search Radius</Text>
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
        </BlurView>
      </View>

      <TouchableOpacity 
        style={styles.locateButton}
        onPress={() => {
          Haptics.selectionAsync();
          fetchLocation();
        }}
      >
        <Ionicons name="locate" size={24} color="#1e293b" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  demoMapContainer: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: '#94a3b8',
  },
  demoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 12,
  },
  demoSubText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  demoMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(30, 41, 59, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.05)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  blurTop: {
    padding: 16,
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  topSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  blurControls: {
    padding: 20,
  },
  radiusLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  radiusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeRadiusButton: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  radiusText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },
  activeRadiusText: {
    color: '#fff',
  },
  locateButton: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  markerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(30, 41, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  markerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#fff',
  }
});
