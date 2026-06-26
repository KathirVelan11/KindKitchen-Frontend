import { API_BASE_URL } from './config';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodItem from './FoodItem.tsx'; // Import the FoodItem component

// Define the interfaces for our data structure
interface FoodItemData {
  fooditemname: string;
  foodimage: string;
  restaurantname: string;
  rating: number | null;
}

interface FoodResponse {
  count: number;
  food_items: FoodItemData[];
}

const FoodOrdersScreen = ({ navigation }: any) => {
  const [foodItems, setFoodItems] = useState<FoodItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch food items from the backend
  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      // Replace the URL with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/fooditems/firstpagefoodinfo`);
      const data: FoodResponse = await response.json();
      
      setFoodItems(data.food_items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to load food items. Please try again later.');
      setLoading(false);
    }
  };

  // Handle food item selection
  const handleFoodItemPress = (item: FoodItemData) => {
    navigation.navigate('FoodDetails', { item });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e8b895" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFoodItems}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../../assets/user.png')} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{foodItems.length}</Text>
          <Text style={styles.statLabel}>Available Items</Text>
        </View>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => navigation.navigate('FoodOrders')}
        >
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Your Orders</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Browse Food</Text>
      
      <FlatList
        data={foodItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <FoodItem
            name={item.fooditemname}
            image={item.foodimage || 'https://via.placeholder.com/150'}
            rating={item.rating || 0}
            onPress={() => handleFoodItemPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
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
    backgroundColor: '#ffcba4',
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
    backgroundColor: '#e8b895',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FoodOrdersScreen;