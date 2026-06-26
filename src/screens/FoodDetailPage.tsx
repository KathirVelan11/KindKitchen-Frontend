// screens/FoodDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Navigation param list
type RootStackParamList = {
  FoodDetailPage: { foodItem: FoodItem };
  OrderSummary: { foodItem: FoodItem; quantity: number }; // Example next screen
};

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetailPage'>;

type FoodItem = {
  id: number;
  name: string;
  image: string;
  location?: string;
};

const FoodDetailPage: React.FC<Props> = ({ route, navigation }) => {
  const [quantity, setQuantity] = useState<number>(2);
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { foodItem } = route.params;

  const fetchFoodDetails = async () => {
    try {
      setFoodDetails(foodItem);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodDetails();
  }, []);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : prev));
  };

  if (loading || !foodDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{foodDetails.name}</Text>
          <View style={styles.profileImage}>
            <Image
              source={{ uri: 'https://example.com/profile.jpg' }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: foodDetails.image }}
            style={styles.foodImage}
            resizeMode="cover"
          />
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantity :</Text>
          <TouchableOpacity onPress={decreaseQuantity}>
            <Text style={styles.quantityValue}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.quantityValue, { marginHorizontal: 10 }]}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity}>
            <Text style={styles.quantityValue}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Address:</Text>
          <TouchableOpacity style={styles.addressBox}>
            <Text style={styles.addressText}>{foodDetails.location || 'Not specified'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeAddressButton}>
            <Text style={styles.changeAddressText}>change ?</Text>
          </TouchableOpacity>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={() => {
            navigation.navigate('OrderSummary', {
              foodItem: foodDetails,
              quantity,
            });
          }}
        >
          <Text style={styles.placeOrderText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f0e3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f0e3',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addressSection: {
    marginBottom: 20,
  },
  addressBox: {
    backgroundColor: '#ffd9b3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  addressText: {
    fontSize: 16,
  },
  changeAddressButton: {
    alignSelf: 'flex-end',
  },
  changeAddressText: {
    fontSize: 16,
    color: '#333',
  },
  placeOrderButton: {
    backgroundColor: '#e8b895',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FoodDetailPage;
