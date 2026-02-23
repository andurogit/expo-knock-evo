import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Reusing MOCK_POLICIES or similar structure
const MOCK_POLICIES = [
  {
    id: '1',
    name: 'Young Adult Housing Support',
    location: 'Seoul',
    description: 'Providing monthly rent support up to 200,000 KRW for young adults living alone in Seoul for up to 12 months.',
    agency: 'Seoul Metropolitan Government',
    category: 'Housing',
    eligibility: 'Young adults aged 19-39, living in Seoul, earning below 150% of median income.',
    benefits: 'Up to 2.4 million KRW per year (200,000 KRW/month).',
    deadline: '2026.05.31',
    website: 'https://youth.seoul.go.kr'
  },
  {
    id: '2',
    name: 'Freelancer Startup Grant',
    location: 'Gyeonggi-do',
    description: 'Support for freelancers starting their own business. Grants up to 5,000,000 KRW for office space and equipment.',
    agency: 'Gyeonggi Business & Science Accelerator',
    category: 'Employment',
    eligibility: 'Freelancers with Gyeonggi-do residency, planning to start a business within 6 months.',
    benefits: 'Max 5 million KRW grant, mentorship, and workspace access.',
    deadline: '2026.04.15',
    website: 'https://gbsa.or.kr'
  },
  {
    id: '3',
    name: 'Childcare Subsidy',
    location: 'Incheon',
    description: 'Direct financial support for families with children under the age of 5. Includes childcare voucher and cash support.',
    agency: 'Incheon Metropolitan Government',
    category: 'Welfare',
    eligibility: 'Parents with children aged 0-5 living in Incheon.',
    benefits: 'Monthly cash allowance based on child age and income level.',
    deadline: 'Year-round',
    website: 'https://incheon.go.kr/welfare'
  }
];

const DetailSection = ({ icon, title, content }: { icon: any, title: string, content: string }) => (
  <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#1e293b" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  </Animated.View>
);

export default function PolicyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const policy = MOCK_POLICIES.find(p => p.id === id) || MOCK_POLICIES[0];

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out this policy: ${policy.name} by ${policy.agency}`,
        url: policy.website,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.hero}
        >
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeIn.duration(800)} style={styles.heroContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{policy.category}</Text>
            </View>
            <Text style={styles.policyTitle}>{policy.name}</Text>
            <View style={styles.agencyRow}>
              <Ionicons name="business-outline" size={16} color="#94a3b8" />
              <Text style={styles.agencyName}>{policy.agency}</Text>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.body}>
          <DetailSection 
            icon="information-circle-outline" 
            title="Overview" 
            content={policy.description} 
          />
          <DetailSection 
            icon="people-outline" 
            title="Eligibility" 
            content={policy.eligibility} 
          />
          <DetailSection 
            icon="gift-outline" 
            title="Support Benefits" 
            content={policy.benefits} 
          />
          <DetailSection 
            icon="calendar-outline" 
            title="Application Deadline" 
            content={policy.deadline} 
          />
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{policy.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="globe-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>Web/App</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  policyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
    marginBottom: 12,
  },
  agencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyName: {
    color: '#94a3b8',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  body: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 10,
  },
  sectionContent: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  applyButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});
