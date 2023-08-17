import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Loginscreen from '../screens/Login';
import Signup from '../screens/Signup';


const Stack = createNativeStackNavigator();

function Auth({onLogin}) {
    const handleLog=()=>
    {
 onLogin();
    };
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Splash'>
      <Stack.Screen name="Splash"  component={Splash} />
      <Stack.Screen  name="Login">
      {props => <Loginscreen {...props} onLog={handleLog} />}
      </Stack.Screen>
      <Stack.Screen  name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}

export default Auth