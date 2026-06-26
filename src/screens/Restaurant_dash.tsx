import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RestaurantDashboardScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Profile Image with Navigation */}
      <TouchableOpacity
  style={styles.profileContainer}
  onPress={() => navigation.navigate('Profile')}
>
  <Image source={require('../../assets/user.png')} style={styles.profile} />
</TouchableOpacity>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostFood')}>
        <Text style={styles.buttonText}>Post Food</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fooddash')}>
        <Text style={styles.buttonText}>Dashboard</Text>
      </TouchableOpacity>

      

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    padding: 30,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#e2834c',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },profileContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },

});
