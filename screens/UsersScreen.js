import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Users from '../components/Users';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '@rneui/base';
import { Menu } from 'native-base';
import { auth, db } from '../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useUserContext } from '../user/UserContext';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


function UsersScreen({ onLogOut }) {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { sender } = useUserContext();
  const handleLogOut = async () => {
    try {
      // Call the signOut function on the auth object
      await signOut(auth);
      console.log('User logged out');
      onLogOut(); // Call the provided onOut callback
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== sender._id) {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        }
      });
      setUsers(fetchedUsers);
    }

    fetchUsers();
  }, []);

  return (
   
      <View style={styles.container}>

        <StatusBar style='light' />
        <View style={styles.header}><Text style={{ fontSize: 30, color: 'white', fontWeight: 500, marginLeft: 10 }}>ChatApp</Text>

          <View className="mr-3 mt-3">
            <Menu w="140" mr={2} shadow={5} trigger={triggerProps => {
              return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <Icon name='menu' type='material' color='white' />
              </Pressable>;
            }}>
             
              <Menu.Item>New group</Menu.Item>
              <Menu.Item>New update</Menu.Item>
              <Menu.Item onPress={()=>navigation.navigate('Setting')}>Settings</Menu.Item>
              <Menu.Item onPress={handleLogOut}>Log Out</Menu.Item>
            </Menu>
          </View>



        </View>
        <ScrollView>
          {users.map((item) => {
            return <Users key={item.id} user={item} />
          })}
        </ScrollView>
      
        
          <Icon
            color="#0CC"
            containerStyle={{ position: 'absolute', marginTop: 720, marginLeft: 280 }}
            disabledStyle={{}}
            iconProps={{}}
            iconStyle={{}}
            name="message"
            onPress={() => setShowModal(true)}
            raised
            reverse
            size={25}
            type="material"
          />
        {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)} safeAreaTop={true}>
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Contact Us</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Number</FormControl.Label>
                <Input />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() =>
                  setShowModal(false)}>
                  Cancel
                </Button>
                <Button>
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}
      </View>
   

  )
}

export default UsersScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#9F8F8F',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
