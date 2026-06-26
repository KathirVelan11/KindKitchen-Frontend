import { API_BASE_URL } from './config';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PostFoodScreen = ({ navigation }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [vegType, setVegType] = useState<'veg' | 'nonveg' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const formatDate = (date: string) => {
    const parts = date.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
  };

  const handlePost = async () => {
    if (!foodName || !price || !vegType || !selectedDate || !selectedTime || !availableQuantity) {
      Alert.alert('Please fill in all required fields.');
      return;
    }

    const foodTypeFormatted = vegType === 'veg' ? 'Veg' : 'NonVeg';
    const expires = formatDate(selectedDate);

    const requestBody = {
      name: foodName,
      description: description || 'No description',
      available_quantity: parseInt(availableQuantity),
      priceforsingleitem: parseFloat(price),
      photo: imageUri || 'https://via.placeholder.com/150', // You can integrate actual upload
      foodtype: foodTypeFormatted,
      expires,
      restaurantid: 1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/fooditems/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Alert.alert('Food posted successfully!');
        navigation.navigate('PostSuccess');
      } else {
        const errorData = await response.json();
        Alert.alert('Failed to post food', JSON.stringify(errorData));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while posting the food.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={require('../../assets/user.png')}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.foodImage} />
        ) : (
          <Text style={styles.plus}>+</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Name of the food:</Text>
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <Text style={styles.label}>Description of the food:</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Available Quantity:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 10"
        keyboardType="numeric"
        value={availableQuantity}
        onChangeText={(text) => setAvailableQuantity(text.replace(/[^0-9]/g, ''))}
      />

      <Text style={styles.label}>Price (₹):</Text>
      <TextInput
        style={styles.input}
        placeholder="₹"
        keyboardType="numeric"
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeButton, vegType === 'veg' && styles.selectedType]}
          onPress={() => setVegType('veg')}
        >
          <Image source={require('../../assets/veg.png')} style={styles.iconImage} />
          <Text>VEG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, vegType === 'nonveg' && styles.selectedType]}
          onPress={() => setVegType('nonveg')}
        >
          <Image source={require('../../assets/nonveg.png')} style={styles.iconImage} />
          <Text>NON VEG</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Expires at:</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text>
          {selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : 'Select Date & Time'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Enter Expiry Date (DD-MM-YYYY):</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg: 12-04-2025"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />
            <Text style={styles.label}>Enter Expiry Time (HH:MM):</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg: 19:30"
              value={selectedTime}
              onChangeText={setSelectedTime}
            />
            <TouchableOpacity
              style={styles.postButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.postText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostFoodScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fde2cc',
    padding: 20,
    alignItems: 'center',
  },
  profile: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  imageBox: {
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 50,
  },
  plus: { fontSize: 40, color: '#aaa' },
  foodImage: { width: 100, height: 100, borderRadius: 8 },
  label: { fontWeight: 'bold', marginTop: 10, alignSelf: 'flex-start' },
  input: {
    backgroundColor: '#f9b887',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  typeButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#ffe0ba',
    borderColor: '#e2834c',
  },
  postButton: {
    backgroundColor: '#e2834c',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  postText: { color: '#fff', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff4ea',
    padding: 20,
    borderRadius: 20,
    width: '85%',
  },
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
});
