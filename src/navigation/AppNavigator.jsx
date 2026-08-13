import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/HomeScreen';
import ShelfScreen from '../screens/app/ShelfScreen';
import SearchScreen from '../screens/app/SearchScreen';
import SettingsScreen from '../screens/app/SettingsScreen';

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
        </Stack.Navigator>
    );
}