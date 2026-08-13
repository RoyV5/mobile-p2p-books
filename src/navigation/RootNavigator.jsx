import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { auth } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    );
}