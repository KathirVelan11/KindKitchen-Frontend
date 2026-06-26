import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Payment type:</Text>
      <View style={styles.row}>
        <Image
          source={require('../../assets/gpay.png')}
          style={styles.icon}
        />
        <Image
          source={require('../../assets/phonepe.png')}
          style={styles.icon}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cancel Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#e2834c',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
