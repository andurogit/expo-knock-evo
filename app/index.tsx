import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function IntroScreen() {
  const router = useRouter();
  const [animationFinished, setAnimationFinished] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  const startAnimation = () => {
    // A "knock" sequence: Scale up/down twice
    scale.value = withSequence(
      withTiming(1.2, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) }),
      withTiming(1.2, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) {
          runOnJS(checkAuthAndNavigate)();
        }
      })
    );
    opacity.value = withTiming(1, { duration: 300 });
  };

  const checkAuthAndNavigate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    // Delay the start of the knock animation a bit for effect
    const timer = setTimeout(() => {
      startAnimation();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        <Text style={styles.logoText}>Policy Finder</Text>
      </Animated.View>
      <Text style={styles.knockText}>Knocking...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  knockText: {
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  }
});
