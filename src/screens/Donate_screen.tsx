import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DonateScreen = () => {
  const navigation = useNavigation();

  const handleDonate = () => {
    navigation.navigate('PaymentScreen'); // Change 'PaymentScreen' to your target screen
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/hand-heart.png')}
        style={styles.heart}
      />
      <TouchableOpacity style={styles.button} onPress={handleDonate}>
        <Text style={styles.buttonText}>Donate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DonateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    width: 100,
    height: 100,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#e2834c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});