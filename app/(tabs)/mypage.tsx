import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { FontAwesome } from '@expo/vector-icons';

export default function MyPageScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [residence, setResidence] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
      }
    })();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const saveResidence = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Residence updated successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={40} color="#fff" />
        </View>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Residence Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Residence</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={residence}
              onChangeText={setResidence}
              placeholder="e.g. Gangnam-gu, Seoul"
            />
          ) : (
            <Text style={styles.residenceText}>
              {residence || 'No residence information set'}
            </Text>
          )}
        </View>

        {isEditing ? (
          <Pressable style={styles.saveButton} onPress={saveResidence}>
            <Text style={styles.saveButtonText}>Save Residence</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit Residence</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.logoutSection}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emailText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  residenceText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
