import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactUsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.subText}>For support or queries, reach us at:</Text>
      <Text style={styles.email}>support@kindkitchen.org</Text>
    </View>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e2834c',
  },
  subText: {
    fontSize: 16,
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
