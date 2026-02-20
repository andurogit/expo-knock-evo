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
  Dimensions,
  ActivityIndicator
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
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const AnimatedInput = ({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightIcon,
  onRightIconPress
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isFocused ? '#334155' : '#e2e8f0', { duration: 200 }),
      borderWidth: withTiming(isFocused ? 1.5 : 1, { duration: 200 }),
      backgroundColor: withTiming(isFocused ? '#fff' : '#f8fafc', { duration: 200 }),
      transform: [{ scale: withSpring(isFocused ? 1.01 : 1) }]
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isFocused ? '#334155' : '#94a3b8', { duration: 200 }),
    };
  });

  return (
    <View style={styles.inputWrapper}>
      <Text style={[styles.label, isFocused && { color: '#334155' }]}>{label}</Text>
      <Animated.View style={[styles.inputInner, animatedContainerStyle]}>
        <Animated.Text style={animatedIconStyle}>
          <Ionicons name={icon} size={18} style={styles.inputIcon} />
        </Animated.Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize || 'none'}
          keyboardType={keyboardType || 'default'}
          onFocus={() => {
            setIsFocused(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onBlur={() => setIsFocused(false)}
        />
        {rightIcon && (
          <Pressable onPress={() => {
            Haptics.selectionAsync();
            onRightIconPress();
          }}>
            <Ionicons name={rightIcon} size={18} color="#94a3b8" />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

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
    buttonScale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  async function signUpWithEmail() {
    if (!email || !password || !confirmPassword) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Signup Failed', error.message);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!session) {
        Alert.alert('Registration Successful', 'An activation link has been sent to your email.');
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
        colors={['#f1f5f9', '#e2e8f0']}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            entering={FadeInUp.duration(600).springify()}
            style={styles.headerContainer}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="person-add-outline" size={40} color="#1e293b" />
            </View>
            <Text style={styles.title}>System Registration</Text>
            <Text style={styles.subtitle}>Create your professional account</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(150).duration(600).springify()}
            style={styles.formContainer}
          >
            <BlurView intensity={60} tint="default" style={styles.blurCard}>
              <AnimatedInput
                label="Work Email"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                keyboardType="email-address"
              />

              <AnimatedInput
                label="Password"
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="Create secure password"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <AnimatedInput
                label="Confirm Password"
                icon="checkmark-circle-outline"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Verify password"
                secureTextEntry={!showPassword}
              />

              <Animated.View style={animatedButtonStyle}>
                <Pressable 
                  style={[styles.button, loading && styles.disabledButton]} 
                  onPress={signUpWithEmail}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Register Account</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </BlurView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).duration(600).springify()}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Already registered? </Text>
            <Pressable onPress={() => {
              Haptics.selectionAsync();
              router.back();
            }}>
              <Text style={styles.signUpLink}>Return to Login</Text>
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
    backgroundColor: '#f8fafc',
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
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  blurCard: {
    padding: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  button: {
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  signUpLink: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
});
