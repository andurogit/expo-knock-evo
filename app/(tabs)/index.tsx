import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Policy {
  id: string;
  name: string;
  location: string;
  description: string;
  agency: string;
}

const MOCK_POLICIES: Policy[] = [
  {
    id: '1',
    name: 'Young Adult Housing Support',
    location: 'Seoul',
    description: 'Providing monthly rent support up to 200,000 KRW for young adults living alone in Seoul for up to 12 months.',
    agency: 'Seoul Metropolitan Government'
  },
  {
    id: '2',
    name: 'Freelancer Startup Grant',
    location: 'Gyeonggi-do',
    description: 'Support for freelancers starting their own business. Grants up to 5,000,000 KRW for office space and equipment.',
    agency: 'Gyeonggi Business & Science Accelerator'
  },
  {
    id: '3',
    name: 'Childcare Subsidy',
    location: 'Incheon',
    description: 'Direct financial support for families with children under the age of 5. Includes childcare voucher and cash support.',
    agency: 'Incheon Metropolitan Government'
  }
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderPolicyCard = ({ item }: { item: Policy }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.emblem}>
          <FontAwesome name="building" size={20} color="#fff" />
        </View>
        <Text style={styles.agencyText}>{item.agency}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.policyName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description.length > 100 
            ? item.description.substring(0, 100) + '...' 
            : item.description}
        </Text>
      </View>
      <TouchableOpacity style={styles.detailButton}>
        <Text style={styles.detailButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search policies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  emblem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  agencyText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 15,
  },
  policyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  detailButton: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
