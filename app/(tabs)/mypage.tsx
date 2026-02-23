import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert, Dimensions, Switch, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const REGIONS = ['Seoul', 'Gyeonggi-do', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon-do', 'Chungcheongbuk-do', 'Chungcheongnam-do', 'Jeollabuk-do', 'Jeollanam-do', 'Gyeongsangbuk-do', 'Gyeongsangnam-do', 'Jeju'];

const CATEGORIES = [
  { id: 'housing', label: 'Housing', icon: 'home-outline' },
  { id: 'employment', label: 'Employment', icon: 'briefcase-outline' },
  { id: 'welfare', label: 'Welfare', icon: 'heart-outline' },
  { id: 'education', label: 'Education', icon: 'book-outline' },
  { id: 'health', label: 'Health', icon: 'medkit-outline' },
  { id: 'culture', label: 'Culture', icon: 'musical-notes-outline' },
];

const SettingsItem = ({ icon, label, value, type = 'chevron', onPress }: any) => (
  <Pressable 
    style={styles.settingsItem} 
    onPress={() => {
      Haptics.selectionAsync();
      onPress?.();
    }}
  >
    <View style={styles.settingsIconWrapper}>
      <Ionicons name={icon} size={20} color="#64748b" />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsLabel}>{label}</Text>
      {value && <Text style={styles.settingsValue}>{value}</Text>}
    </View>
    {type === 'chevron' && <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />}
    {type === 'switch' && <Switch trackColor={{ false: '#e2e8f0', true: '#1e293b' }} />}
  </Pressable>
);

export default function MyPageScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [residence, setResidence] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['housing', 'employment']);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
      }
    })();
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const toggleCategory = (id: string) => {
    Haptics.selectionAsync();
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleResidenceSelect = (item: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResidence(item);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.header}
        >
          <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person" size={40} color="#fff" />
              <Pressable style={styles.editAvatar}>
                <Ionicons name="camera" size={16} color="#1e293b" />
              </Pressable>
            </View>
            <Text style={styles.emailText}>{email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified Account</Text>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.settingsGroup}>
              <SettingsItem 
                icon="mail-outline" 
                label="Email Address" 
                value={email}
              />
              <SettingsItem 
                icon="location-outline" 
                label="Primary Residence" 
                value={residence || 'Not set'}
                onPress={() => setIsModalVisible(true)}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
            <Text style={styles.sectionTitle}>Interest Categories</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <Ionicons 
                      name={cat.icon as any} 
                      size={18} 
                      color={isSelected ? '#fff' : '#64748b'} 
                    />
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600).springify()}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingsGroup}>
              <SettingsItem 
                icon="notifications-outline" 
                label="Push Notifications" 
                type="switch"
              />
              <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" />
              <SettingsItem icon="help-circle-outline" label="Support Center" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(600).springify()}>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Terminate Session</Text>
            </Pressable>
            <Text style={styles.versionText}>Version 1.0.0 (Build 2402)</Text>
          </Animated.View>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Residence</Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1e293b" />
              </Pressable>
            </View>
            <FlatList
              data={REGIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable 
                  style={styles.regionItem}
                  onPress={() => handleResidenceSelect(item)}
                >
                  <Text style={[styles.regionText, residence === item && styles.regionTextSelected]}>
                    {item}
                  </Text>
                  {residence === item && <Ionicons name="checkmark" size={20} color="#1e293b" />}
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingsValue: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginHorizontal: -4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipSelected: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 12,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  regionText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  regionTextSelected: {
    color: '#1e293b',
    fontWeight: '700',
  }
});

