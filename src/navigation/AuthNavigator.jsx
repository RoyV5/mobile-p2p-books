import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    const { login } = useAuth();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login">
                {({ navigation }) => (
                    <LoginScreen
                        onLogin={login}
                        onRegister={() => navigation.navigate('Register')}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="Register">
                {({ navigation }) => (
                    <RegisterScreen
                        onRegister={login}
                        onBack={() => navigation.goBack()}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}