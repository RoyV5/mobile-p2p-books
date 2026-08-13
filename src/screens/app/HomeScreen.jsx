import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import UserHeader from '../../components/UserHeader';

export default function HomeScreen({ navigation }) {
    const { auth } = useAuth();
    const user = auth?.user;

    return (
        <View style={styles.container}>
            <UserHeader
                displayName={user?.displayName}
                handle={user?.handle}
                profilePictureUrl={user?.profilePictureUrl}
            />

            <View style={styles.actions}>
                <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate('Shelf')}
                >
                    <Text style={styles.buttonText}>
                        My Library
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate('Search')}
                >
                    <Text style={styles.buttonText}>
                        Browse
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.buttonText}>
                        Settings
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center'
    },

    actions: {
        gap: 12
    },

    button: {
        backgroundColor: '#222',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});