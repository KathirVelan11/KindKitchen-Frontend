import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }: any) => {
  
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello,</Text>

      <View style={styles.greenBox}>
        <Text style={styles.greenTextBold}>Thank you for supporting us!</Text>
        <Text style={styles.greenText}>
          As a local business, we thank you for supporting us and hope you enjoy.
        </Text>
      </View>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ContactUs')}>
        <Ionicons name="mail" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Share', 'App link copied!')}>
        <Ionicons name="share-social" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Share Surplus App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Review', 'Redirecting to app store...')}>
        <MaterialIcons name="rate-review" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Review in the App Store</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="log-out-outline" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Log out</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde2cc',
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 10,
  },
  greenBox: {
    backgroundColor: '#00d26a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  greenTextBold: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  greenText: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
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
