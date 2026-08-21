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
    const { auth, loading, sessionError } = useAuth();

    const [showLoading, setShowLoading] = useState(true);

    // Once the user has seen/dismissed a hydration error, stop holding
    // them on the loading screen for it even if sessionError is still set.
    const [errorDismissed, setErrorDismissed] = useState(false);

    const [mountedAuth, setMountedAuth] = useState(null);

    const contentOpacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        // Initial load: once loading finishes, hold on the loading screen
        // a beat longer if there's a session error to show - otherwise
        // move straight on to mounting the current auth value.
        if (loading) return;
        if (sessionError && !errorDismissed) return;

        setShowLoading(false);
        setMountedAuth(auth);

        Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start();
    }, [loading, sessionError, errorDismissed, contentOpacity, auth]);

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
        return (
            <LoadingScreen
                error={sessionError && !errorDismissed ? sessionError : null}
                onDismiss={() => setErrorDismissed(true)}
            />
        );
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