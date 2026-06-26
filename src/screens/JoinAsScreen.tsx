import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const JoinAsScreen = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!role) {
      Alert.alert('Please select a role');
      return;
    }
    
    switch (role) {
      case 'Restaurant':
        navigation.navigate('Restaurantsign');
        break;
      case 'NGO':
        navigation.navigate('NGOsign');
        break;
      case 'Donor':
        navigation.navigate('DonorSignup');
        break;
      case 'Delivery':
        navigation.navigate('DeliverySignup');
        break;
      default:
        Alert.alert('Unknown role');
        break;
    }
  };

  const renderOption = (label: string, icon: any) => {
    const selected = role === label;

    return (
      <TouchableOpacity
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setRole(label)}
      >
        <View style={styles.optionRow}>
          <Image source={icon} style={styles.icon} />
          <Text style={styles.optionLabel}>{label}</Text>
        </View>
        <Switch
          value={selected}
          onValueChange={() => setRole(label)}
          thumbColor={selected ? '#fff' : '#ccc'}
          trackColor={{ false: '#ccc', true: '#e47c39' }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join as a</Text>

      {renderOption('Restaurant', require('../../assets/restaurant.png'))}
      {renderOption('NGO', require('../../assets/ngo.png'))}
      {renderOption('Donor', require('../../assets/donor.png'))}
      {renderOption('Delivery', require('../../assets/delivery.png'))}

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: role ? '#3cbd2b' : '#8fed75' }]}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JoinAsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fde3c8',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 30,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6b07b',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  optionSelected: {
    backgroundColor: '#e47c39',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  optionLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
