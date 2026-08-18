import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    View
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { auth, loading } = useAuth();

    const [showLoading, setShowLoading] = useState(true);

    const [mountedAuth, setMountedAuth] = useState(null);

    const contentOpacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        // Initial load: when loading finishes, mount the current auth value
        if (!loading) {
            setShowLoading(false);
            setMountedAuth(auth);

            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }).start();
        }
    }, [loading, contentOpacity, auth]);

    useEffect(() => {
        // If auth changes after initial mount, cross-fade between the
        // old and new navigator contents.
        if (loading) return;
        if (mountedAuth === null) return;

        if (auth !== mountedAuth) {
            // Fade out the current content, switch mountedAuth, then fade in
            Animated.timing(contentOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }).start(() => {
                setMountedAuth(auth);

                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            });
        }
    }, [auth, loading, mountedAuth, contentOpacity]);

    if (showLoading) {
        return <LoadingScreen />;
    }

 return (
    <View style={styles.container}>
        <Animated.View
            style={[
                styles.navigator,
                {
                    opacity: contentOpacity
                }
            ]}
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'none'
                }}
            >
                {mountedAuth ? (
                    <Stack.Screen
                        name="App"
                        component={AppNavigator}
                    />
                ) : (
                    <Stack.Screen
                        name="Auth"
                        component={AuthNavigator}
                    />
                )}
            </Stack.Navigator>
        </Animated.View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    navigator: {
        flex: 1,
        backgroundColor: '#fff'
    }
});