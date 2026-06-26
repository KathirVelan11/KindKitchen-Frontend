import { API_BASE_URL } from './config';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext'; // Import useAuth hook
import { getUserId } from './auth.js'; // Import getUserId function

const NGOAccount = ({ navigation }) => {
  // Get userId from both context and memory storage
  const { userId: contextUserId } = useAuth();
  const memoryUserId = getUserId();
  
  // Use contextUserId as primary, fall back to memoryUserId
  const activeUserId = contextUserId || memoryUserId;

  const [ngoName, setNgoName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contact, setContact] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=3829863ec71946738b22e87d74d668c3`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const components = data.results[0].components;
        setStreet(components.road || '');
        setCity(components.city || components.town || components.village || '');
        setState(components.state || '');
        setPostalCode(components.postcode || '');
      } else {
        Alert.alert('Error', 'Could not fetch address');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong fetching location');
      console.error(error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!ngoName || !contact || !street || !city || !state || !postalCode) {
      Alert.alert('Incomplete Info', 'Please fill in all the fields.');
      return;
    }

    // Check if we have a userId
    if (!activeUserId) {
      Alert.alert('Error', 'User ID not found. Please sign up again.');
      navigation.navigate('Login'); // Navigate back to login
      return;
    }

    const dataToSend = {
      Userid: parseInt(activeUserId), // Convert to number if needed
      name: ngoName,
      role: 'NGO',
      phone_number: contact,
      street,
      city,
      state,
      postal_code: postalCode,
    };

    console.log('Sending registration data:', dataToSend);

    try {
      setLoadingSubmit(true);

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration success:', data);
        Alert.alert('Success', 'NGO account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('ngoDash') }
        ]);
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        Alert.alert('Registration Failed', errorData.detail || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server error');
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderLocationField = (label, value, onChange) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWithIcon}>
        <TouchableOpacity onPress={handleGetLocation}>
          <Image source={require('../../assets/location.png')} style={styles.icon} />
        </TouchableOpacity>
        <TextInput
          style={styles.inputNoBG}
          value={value}
          onChangeText={onChange}
          editable={true} // Changed to true to allow manual editing
        />
        {loadingLocation && <ActivityIndicator size="small" color="#000" />}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>NGO Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter NGO name"
        value={ngoName}
        onChangeText={setNgoName}
      />

      {renderLocationField('Street:', street, setStreet)}
      {renderLocationField('City:', city, setCity)}
      {renderLocationField('State:', state, setState)}
      {renderLocationField('Postal Code:', postalCode, setPostalCode)}

      <Text style={styles.label}>Contact:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact number"
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateAccount} disabled={loadingSubmit}>
        <Text style={styles.buttonText}>
          {loadingSubmit ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default NGOAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7d6',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f6b07b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6b07b',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  inputNoBG: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingLeft: 8,
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#ec8c4a',
    padding: 14,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
