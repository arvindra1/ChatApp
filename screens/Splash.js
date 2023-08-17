import {  Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React ,{useEffect, useState} from 'react'
import { Icon } from "@rneui/base";
import { useNavigation } from '@react-navigation/native';


const Splash = () => {
    const navigation=useNavigation();
    const [icon, setIcon] = useState('chat');
    useEffect(() =>{
        setTimeout(() =>{
            setIcon('send');
         },1000);
         setTimeout(() =>{
            setIcon('mic');
         },1000);
         setTimeout(() =>{
            setIcon('chat');
         },1000);
         setInterval(() =>{
            setIcon('call');
         },1000);
         setTimeout(() =>{
            setIcon('camera');
         },1000);
         setTimeout(() =>{
            setIcon('photo');
            navigation.navigate('Login');
         },5000);
         
    },[])

  return (
    <View style={{backgroundColor:"purple"}} className="flex-1 justify-center items-center">
    <StatusBar style='light'/>
    <Icon
      color="#0CC"
      containerStyle={{}}
      disabledStyle={{}}
      iconProps={{}}
      iconStyle={{}}
      name={icon}
      onLongPress={() => console.log("onLongPress()")}
      onPress={() => console.log("onPress()")}
      raised
      reverse
      size={40}
      type="material"
    />
    </View>
  )
}

export default Splash

