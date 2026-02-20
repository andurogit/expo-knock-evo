import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Policy {
  id: string;
  name: string;
  location: string;
  description: string;
  agency: string;
  category: string;
}

const MOCK_POLICIES: Policy[] = [
  {
    id: '1',
    name: 'Young Adult Housing Support',
    location: 'Seoul',
    description: 'Providing monthly rent support up to 200,000 KRW for young adults living alone in Seoul for up to 12 months.',
    agency: 'Seoul Metropolitan Government',
    category: 'Housing'
  },
  {
    id: '2',
    name: 'Freelancer Startup Grant',
    location: 'Gyeonggi-do',
    description: 'Support for freelancers starting their own business. Grants up to 5,000,000 KRW for office space and equipment.',
    agency: 'Gyeonggi Business & Science Accelerator',
    category: 'Employment'
  },
  {
    id: '3',
    name: 'Childcare Subsidy',
    location: 'Incheon',
    description: 'Direct financial support for families with children under the age of 5. Includes childcare voucher and cash support.',
    agency: 'Incheon Metropolitan Government',
    category: 'Welfare'
  }
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderPolicyCard = ({ item, index }: { item: Policy, index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500).springify()}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.agencyText}>{item.agency}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.policyName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#64748b" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.detailButton}
        onPress={() => Haptics.selectionAsync()}
      >
        <Text style={styles.detailButtonText}>View Analysis</Text>
        <Ionicons name="chevron-forward" size={16} color="#1e293b" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.headerBackground}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Policy Finder</Text>
          <Text style={styles.headerSubtitle}>Professional Policy Discovery</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by policy name or agency..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </View>
      </View>
      
      <FlatList
        data={MOCK_POLICIES}
        renderItem={renderPolicyCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 4,
  },
  searchWrapper: {
    marginTop: -25,
    paddingHorizontal: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  listContainer: {
    padding: 24,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  agencyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 16,
  },
  policyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  detailButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '700',
  },
});
