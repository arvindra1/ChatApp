import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { Icon, Avatar } from '@rneui/base';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GiftedChat, InputToolbar, Message } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { db } from '../Firebase/firebase';
import { useUserContext } from '../user/UserContext';
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    addDoc,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp,
    where // Import where from firestore
} from "firebase/firestore";

export default function ChatScreen(props) {
    const { sender } = useUserContext();
    let user = props.route.params;
    const avatarSource = user.profileImage ? { uri: user.profileImage } : null;
    const first = user.name ? user.name[0].toUpperCase() : '';
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleType = async text => {
        // Update typing status in Firestore
        const typingRef = doc(db, 'message', user._id); // Replace 'chatId' with the appropriate chat ID
        await updateDoc(typingRef, {
            isTyping: text.length > 0,
        });
    };



    useEffect(() => {
        async function fetchTypingStatus() {
            try {
                const docRef = doc(db, 'chats', sender._id); // Replace 'chats' with the appropriate collection name
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setIsTyping(userData.isTyping || false);
                }
            } catch (error) {
                console.error('Error fetching typing status:', error);
            }
        }

        // Fetch typing status initially and then set interval to keep checking
        fetchTypingStatus();
        const intervalId = setInterval(fetchTypingStatus, 500);

        return () => clearInterval(intervalId);
    }, [sender._id]);
        
       

    useEffect(() => {
        const collectionRef = collection(db, 'message');

        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            setMessages(
                
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
        });

        return () => unsubscribe();
    }, [sender._id,user._id]);

    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(db, 'message'), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <View style={{ marginLeft: 10, marginTop: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon
                        name='chevron-left'
                        type='material'
                        size={30}
                        color="white"
                        onPress={() => navigation.goBack()}
                    />
                    <Avatar
                        containerStyle={{ backgroundColor: "#BDBDBD" }}
                        size={40}
                        rounded
                        source={avatarSource}
                        title={first}
                    />
                    <Text style={{ marginLeft: 5, fontSize: 20, color: 'white' }}>{user.name}</Text>
                </View>
            </View>

            <GiftedChat
                loadEarlier={true}
                isTyping={isTyping}
                onInputTextChanged={handleType}

                inverted={true}

                textInputStyle={{ borderRadius: 35 }}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: sender._id,
                    sentto: user._id,
                    name: sender.name,
                }}
                renderInputToolbar={props => (
                    <InputToolbar
                        {...props}
                        containerStyle={{
                            backgroundColor: '#F0F0F0', // Change the background color here
                        }}
                    />
                )}
                renderMessage={props => (
                    <Message
                        {...props}
                        containerStyle={{ backgroundColor: 'grey' }}
                    />
                )}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9001C3',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: '#9F8F8F',
        width: '100%',
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
