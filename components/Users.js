import React, { useState } from 'react'
import { ListItem ,Avatar, Badge} from '@rneui/themed';
import { Text,View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function Users({user}) {
    const avatarSource = user.profileImage ? { uri: user.profileImage } : null;
    const navigation = useNavigation();
    
    const first = user.name ? user.name[0].toUpperCase() : '';
  return (
    <TouchableOpacity onPress={()=>navigation.navigate('Chat',{...user})}>
    <ListItem bottomDivider>
    <TouchableOpacity >
    <Avatar
    containerStyle={{ backgroundColor: "#BDBDBD" }}
    size={40}
      rounded
      source={avatarSource}
      title={first}
    />
    </TouchableOpacity>
    
    <ListItem.Content>
      <ListItem.Title>{user.name}</ListItem.Title>
      <ListItem.Subtitle>{user.description}</ListItem.Subtitle>
    </ListItem.Content>
    {/* <View className="flex-column justify-around items-center">
    <Badge value="3" status="success" />
    <Text style={{fontSize:10}} className="mt-2"></Text>
    </View> */}
   
  </ListItem>
  </TouchableOpacity>
  )
}

export default Users
