import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the parameter types for your screens
type RootStackParamList = {
  joinas: { email: string; password: string };
};

// Type for navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'joinas'>;

interface Props {
  navigation: NavigationProp;
}

const SelectRoleScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.roleBox}>
        <Text style={styles.roleText}>Restaurant</Text>
      </View>
      <View style={styles.roleBox}>
        <Text style={styles.roleText}>NGO</Text>
      </View>
      <View style={styles.roleBox}>
        <Text style={styles.roleText}>Volunteer</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Navigate to 'joinas' screen with email and password as params
          navigation.navigate('joinas');
        }}
      >
        <Text style={styles.buttonText}>Select Role</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde3c8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roleBox: {
    width: '100%',
    height: 50,
    backgroundColor: '#dcdcdc',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  roleText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#e6874e',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
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
