import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'native-base';
import { Icon } from '@rneui/base';
import { doc, updateDoc, deleteField, collection, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { useUserContext } from '../user/UserContext';

// Initialize Firebase Storage

const storage = getStorage();

const ProfileScreen = () => {
  const { sender } = useUserContext();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const fetchProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', sender._id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setAbout(userData.about);
        setNumber(userData.number);
        setName(userData.name);
        setProfileImage(userData.profileImage);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Fetch user UID from your authentication context or wherever it's available
    fetchProfile();
  }, []);

  const handleSave = async () => {
    // Implement logic to save updated profile details
    const userDocRef = doc(db, 'users', sender._id); // Assuming 'BJ' is the document ID

    // Update the document with new values
    await updateDoc(userDocRef, {
      name: name,
      number: number,
      about: about,
    });
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }


    if (!image) {
      return;
    }

    const storage = getStorage();
    const response = await fetch(image);
    const blob = await response.blob();

    try {
      setUploading(true);

      const storageRef = ref(storage, `Pictures/Image1`);
      const snapshot = await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploading(false);

      console.log('Download URL:', downloadURL);
      setImage(downloadURL);
    } catch (error) {
      setUploading(false);
      console.error('Error uploading image:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Avatar mt={8} mb={6} bg="purple.600" alignSelf="center" size="2xl"
        source={{ uri: profileImage }}>
        <Avatar.Badge bg="trueGray.100">
          <Icon name="camera" type="antdesign" color="blue" onPress={handleImageUpload} />
        </Avatar.Badge>
      </Avatar>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(value) => setName(value)}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={about}
        onChangeText={(value) => setAbout(value)}
        placeholder="about"
      />
      <TextInput
        style={styles.input}
        value={number}
        onChangeText={(value) => setNumber(value)}
        placeholder="number"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'start',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#DF5F5F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
