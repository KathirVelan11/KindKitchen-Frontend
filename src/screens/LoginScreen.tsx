import { API_BASE_URL } from './config';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setAuthToken, setUserRole, setUserId } from './auth.js'; // Added setUserId
import { useAuth } from './AuthContext'; // Import useAuth hook

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId: setContextUserId } = useAuth(); // Get setUserId from context

  const handleContinue = async () => {
    if (isSignUp) {
      // Handle signup directly from this screen
      try {
        console.log('Starting signup request...');
        const response = await fetch(`${API_BASE_URL}/users/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailOrUsername,
            password: password,
          }),
        });

        // Parse response
        const data = await response.json();
        console.log('Signup response received:', data);

        if (!response.ok) {
          // If server returns an error
          Alert.alert('SignUp Failed', data.message || 'Registration failed');
          return;
        }

        // Extract user ID from response
        const userId = data.UserID;
        console.log('User signed up successfully with ID:', userId);

        // Store the userId both in memory and in context
        setUserId(userId);
        setContextUserId(userId.toString());

        // If you need to store any auth token
        if (data.access_token) {
          setAuthToken(data.access_token);
        }

        // Successfully signed up, now navigate directly without using Alert
        console.log('Navigating to ad screen...');
        navigation.navigate('Ad');
        
      } catch (error) {
        console.error('SignUp Error:', error);
        Alert.alert('Network Error', 'Failed to connect to the server. Please try again later.');
      }
    } else {
      // Handle login (your existing login code)
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Email: emailOrUsername,
            Password: password,
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials.');
        }

        const data = await response.json();

        // Extract the 4 fields
        const email = emailOrUsername;
        const passwordVal = password;
        const accessToken = data.access_token;
        const role = data.User.Role;
        
        // Store in-memory values
        setAuthToken(accessToken);
        setUserRole(role);

        console.log('Login Success:', { email, passwordVal, accessToken, role });

        // Navigate based on role
        switch (role) {
          case 'Restaurant':
            navigation.navigate("RestaurantDash");
            break;
          case 'NGO':
            navigation.navigate('RestaurantHomePage');
            break;
          case 'Donor':
            navigation.navigate('HomePage');
            break;
          case 'Delivery_Agent':
            navigation.navigate('DeliveryOrdersScreen');
            break;
          default:
            Alert.alert('Unknown role');
        }
      } catch (error) {
        console.error('Login Error:', error);
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    }
  };


  // Rest of your component remains the same
  return (
    <View style={styles.container}>
      <Text style={styles.title}>KindKitchen</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
          onPress={() => setIsSignUp(false)}
        >
          <Text style={[styles.toggleText, !isSignUp && styles.activeText]}>
            Log-in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, isSignUp && styles.activeToggle]}
          onPress={() => setIsSignUp(true)}
        >
          <Text style={[styles.toggleText, isSignUp && styles.activeText]}>
            SignUp
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={isSignUp ? 'Email' : 'Username or email'}
        keyboardType={isSignUp ? 'email-address' : 'default'}
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleContinue}>
        <Text style={styles.loginText}>
          {isSignUp ? 'Sign Up' : 'Log-in'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.dividerText}>
        {isSignUp ? 'Or Sign-up with' : 'Or continue with'}
      </Text>

      <View style={styles.socialRow}>
        <Image source={require('../../assets/google.png')} style={styles.icon} />
        <Image source={require('../../assets/apple.png')} style={styles.icon} />
        <Image source={require('../../assets/windows.png')} style={styles.icon} />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce0bd',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'cursive',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f6b98d',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#e88a52',
  },
  toggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fcb889',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#e88a52',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dividerText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});