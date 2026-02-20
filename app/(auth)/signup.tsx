import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Text, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  async function signUpWithEmail() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const { 
      data: { session },
      error 
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      if (!session) {
        Alert.alert('Success', 'Please check your inbox for email verification!');
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00f2fe', '#4facfe']}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInUp.duration(1000).springify()}
            style={styles.headerContainer}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="person-add-outline" size={50} color="#fff" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Policy Finder today!</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={styles.formContainer}
          >
            <BlurView intensity={80} tint="light" style={styles.blurCard}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputInner}>
                  <Ionicons name="mail-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="example@mail.com"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputInner}>
                  <Ionicons name="lock-closed-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#999" 
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputInner}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <Animated.View style={animatedButtonStyle}>
                <Pressable 
                  style={[styles.button, loading && styles.disabledButton]} 
                  onPress={signUpWithEmail}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#007AFF', '#0051D5']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.signUpLink}>Sign In</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  blurCard: {
    padding: 24,
    borderRadius: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#fff',
    fontSize: 15,
  },
  signUpLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
