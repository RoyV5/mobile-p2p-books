import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/HomeScreen';
import ShelfScreen from '../screens/app/ShelfScreen';
import SearchScreen from '../screens/app/SearchScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import UserProfileScreen from '../screens/app/UserProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />

            <Stack.Screen
                name="Shelf"
                component={ShelfScreen}
            />

            <Stack.Screen
                name="Search"
                component={SearchScreen}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
            />

            <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Stack.Navigator>
    );
}