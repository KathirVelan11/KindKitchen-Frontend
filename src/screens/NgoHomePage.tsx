import { API_BASE_URL } from './config';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Define the interfaces for our data structure
interface NGO {
  name: string;
}

interface NGOResponse {
  count: number;
  ngos: NGO[];
}

// Sample JSON data for testing
const sampleData: NGOResponse = {
  "count": 8,
  "ngos": [
    {
      "name": "Kathir's Helping Hands Foundation"
    },
    {
      "name": "Kathir Hand Works"
    },
    {
      "name": "Kathir Trusts"
    },
    {
      "name": "King Kathir Foundation"
    },
    {
      "name": "Kathir For All"
    },
    {
      "name": "Kathir helpers"
    },
    {
      "name": "xxKathirxx"
    },
    {
      "name": "YOYO Kathir Foundation"
    }
  ]
};

const DonorDashboardScreen = ({ navigation }: any) => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useRealAPI, setUseRealAPI] = useState<boolean>(false);
  const [donationsMade, setDonationsMade] = useState<number>(0);

  // Fetch NGOs from the backend or use sample data
  useEffect(() => {
    if (useRealAPI) {
      fetchNGOsFromAPI();
    } else {
      // Simulate network delay with sample data
      setTimeout(() => {
        setNgos(sampleData.ngos);
        setLoading(false);
      }, 1000);
    }
  }, [useRealAPI]);

  const fetchNGOsFromAPI = async () => {
    try {
      setLoading(true);
      // Replace the URL with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/ngos/`);
      const data: NGOResponse = await response.json();
      
      setNgos(data.ngos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      setError('Failed to load NGOs. Please try again later.');
      setLoading(false);
    }
  };

  // Toggle between sample data and real API
  const toggleDataSource = () => {
    setUseRealAPI(!useRealAPI);
  };

  // Handle NGO selection
  const handleNGOPress = (ngo: NGO) => {
    navigation.navigate('NGODetails', { ngo });
  };

  // Render NGO card
  const renderNGOCard = ({ item }: { item: NGO }) => (
    <TouchableOpacity 
      style={styles.ngoCard}
      onPress={() => handleNGOPress(item)}
    >
      <View style={styles.ngoIconContainer}>
        <AntDesign name="heart" size={30} color="#ef5350" />
      </View>
      <View style={styles.ngoInfoContainer}>
        <Text style={styles.ngoName}>{item.name}</Text>
        <TouchableOpacity 
          style={styles.donateButton}
          onPress={() => navigation.navigate('DonateScreen', { ngo: item })}
        >
          <Text style={styles.donateButtonText}>Donate</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Retry fetching data
  const retryFetch = () => {
    if (useRealAPI) {
      fetchNGOsFromAPI();
    } else {
      setLoading(true);
      setTimeout(() => {
        setNgos(sampleData.ngos);
        setLoading(false);
      }, 1000);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading NGOs...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Donor Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../../assets/user.png')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{ngos.length}</Text>
          <Text style={styles.statLabel}>Available NGOs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{donationsMade}</Text>
          <Text style={styles.statLabel}>Your Donations</Text>
        </View>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact</Text>
        <Text style={styles.impactDescription}>
          Your donations have helped provide meals to those in need. Thank you for your generosity!
        </Text>
        <TouchableOpacity
          style={styles.viewHistoryButton}
          onPress={() => navigation.navigate('DonationHistory')}
        >
          <Text style={styles.viewHistoryButtonText}>View Donation History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dataSourceContainer}>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={toggleDataSource}
        >
          <Text style={styles.toggleButtonText}>
            Switch to {useRealAPI ? 'Sample Data' : 'Real API'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>NGOs</Text>
      
      <FlatList
        data={ngos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNGOCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E5CA',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: '#FFC48C',
    borderRadius: 12,
    padding: 15,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  impactCard: {
    backgroundColor: '#FFC48C',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  impactDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  viewHistoryButton: {
    backgroundColor: '#E28E53',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  viewHistoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dataSourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dataSourceText: {
    fontSize: 14,
    color: '#555',
  },
  toggleButton: {
    backgroundColor: '#E28E53',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ngoCard: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 15,
  },
  ngoIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 30,
    marginRight: 15,
  },
  ngoInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ngoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  donateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  donateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DonorDashboardScreen;