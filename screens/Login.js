

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword ,sendPasswordResetEmail} from 'firebase/auth'
import { auth } from '../Firebase/firebase';
import { db } from '../Firebase/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useUserContext } from '../user/UserContext';


function Login({ onLog }) {
  const { setSender } = useUserContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {

    if (email && password) {
      try {
        if (email === '' || password === '') {
          console.error('Please fill in all fields.');
          return;
        }
        //this will be come after console.log

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userQuery = query(collection(db, 'users'), where('_id', '==', userCredential.user.uid));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const loggedInUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          setSender(loggedInUser);
          // Set userUUID in the context\

          console.log('User Details:', loggedInUser);
        }
        console.log('User logged in:', userCredential.user);
        // Notify the parent component about successful login
        onLog();
      } catch (error) {
        console.error('Error logging in:', error.message);
      }
    }
  };const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(email,auth);
      setResetSent(true);
    } catch (error) {
      console.log('Error sending reset email:', error);
    }
  };
  

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      {/* Status Bar */}
      <StatusBar style='light' />

      {/* Rest of the login UI */}
      {/* ... (The existing login UI code goes here) ... */}
      {/* Login Container */}
      <View style={{ marginTop: '30%' }}>
        {/* Login Title */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 70 }}>Login</Text>
        </View>

        {/* Username */}
        <View style={{ marginLeft: 42, marginTop: 47 }}>
          <Text style={{ fontWeight: '700', fontSize: 25 }}>Email</Text>
          <TextInput
            style={{ height: 40, borderBottomWidth: 2, width: 280 }}
            placeholder='Enter email'
            value={email}
            type="email"
            onChangeText={(value) => setEmail(value)} // Set the username state correctly
          />
        </View>

        {/* Password */}
        <View style={{ marginLeft: 42, marginTop: 47 }}>
          <Text style={{ fontWeight: '700', fontSize: 25 }}>Password</Text>
          <TextInput
            style={{ height: 40, borderBottomWidth: 2, width: 280 }}
            placeholder='Type your password'
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry // Set the password state correctly
          />
          <TouchableOpacity onPress={handleResetPassword}><Text style={{ marginLeft: 190, marginTop: 7 }}>Forgot password?</Text></TouchableOpacity>
        </View>
        {resetSent && <Text>Password reset email sent.</Text>}

        {/* Login Button */}
        <View style={{ marginTop: 47, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              width: 291,
              height: 52,
              borderRadius: 40,
              backgroundColor: 'blue',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleLogin} // Correctly invoking the handleLogin function
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: 'white',
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>

          {/* Or Sign Up Using */}
          {/* <Text style={{ marginTop: 28 }}>Or Sign Up Using </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Icon size={50} disabled={false} containerStyle={{ padding: 10 }} disabledStyle={{ backgroundColor: 'red' }} name='facebook' />
            <Icon size={50} disabled={false} containerStyle={{ padding: 10 }} disabledStyle={{ backgroundColor: 'red' }} type='ionicon' name='logo-twitter' />
            <Icon size={50} disabled={false} containerStyle={{ padding: 10 }} disabledStyle={{ backgroundColor: 'red' }} type='font-awesome' name='google' />
          </View> */}
        </View>

        <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/google.png')} className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/apple.png')} className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image source={require('../assets/icons/facebook.png')} className="w-10 h-10" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="font-semibold text-yellow-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
        {/* Username */}
        {/* Password */}
        {/* Login Button */}
      </View>
    </View>
  );
}

export default Login;
