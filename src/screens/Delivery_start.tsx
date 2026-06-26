import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeliveryOrdersScreen = () => {
  const navigation = useNavigation();

  const handleTakeOrders = () => {
    navigation.navigate('NameCard'); // Replace with actual screen name if different
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/delivery-scooter.png')}
        style={styles.scooter}
      />
      <TouchableOpacity style={styles.button} onPress={handleTakeOrders}>
        <Text style={styles.buttonText}>Take Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scooter: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#e2834c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});