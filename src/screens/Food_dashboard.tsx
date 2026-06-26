import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const orders = [
  { id: '1', name: 'Upma', qty: 2 },
  { id: '2', name: 'Curd', qty: 2 },
  { id: '3', name: 'Rasam', qty: 2 },
];

const FoodOrdersScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Profile image that navigates to profile screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../../assets/user.png')} style={styles.profile} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.contentWrapper}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetails', { item })}>
              <View style={styles.imagePlaceholder} />
              <View>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text>Quantity: {item.qty}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
    </View>
  );
};

export default FoodOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profile: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffcba4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
