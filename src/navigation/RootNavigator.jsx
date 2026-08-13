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

    const contentOpacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        if (!loading) {
            setShowLoading(false);

            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }).start();
        }
    }, [loading, contentOpacity]);

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
                {auth ? (
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