import React,{useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './screens/ChatScreen';
import UsersScreen from './screens/UsersScreen';
import Splash from './screens/Splash';
import { UserProvider } from './user/UserContext';
import Auth from './Navigate/Auth';
import SettingsScreen from './screens/Setting';
import { NativeBaseProvider } from 'native-base';

const Stack = createNativeStackNavigator();

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLogin = () => {
    // Perform your login logic here
    // If login is successful, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic here
    // Set isLoggedIn to false
    setIsLoggedIn(false);
  };
  return (
    <NativeBaseProvider>
    <UserProvider>
      <NavigationContainer >

{isLoggedIn?(
        <Stack.Navigator initialRouteName='Users'>
          <Stack.Screen options={{ headerShown: false }} name='Users'>
          {props => <UsersScreen {...props} onLogOut={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen options={{ headerShown: false }} name='Chat' component={ChatScreen} />
          <Stack.Screen options={{ headerShown: false }} name='Setting' component={SettingsScreen} />
        </Stack.Navigator>):(<Auth onLogin={handleLogin}  />)}

      </NavigationContainer>
    </UserProvider>
    </NativeBaseProvider>
  )
}

export default App
