import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '../api/auth'
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function hydrateSession() {
            try {
                const token = await AsyncStorage.getItem('authToken');

                if (!token) {
                    return;
                }

                const user = await getMe(token);

                setAuth({
                    token,
                    user
                });
            } catch (err) {
                if (err.response?.status === 401) {
                    await AsyncStorage.removeItem('authToken');
                    setAuth(null);
                } else {
                    console.error(
                        'Failed to restore session:',
                        err
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        hydrateSession();
    }, []);

    async function login(authResult) {
        setAuth(authResult);

        await AsyncStorage.setItem(
            'authToken',
            authResult.token
        );
    }

    async function logout() {
        setAuth(null);

        await AsyncStorage.removeItem('authToken');
    }

    function updateUser(updatedFields) {
    setAuth(previous => ({
        ...previous,
        user: {
            ...previous.user,
            ...updatedFields
        }
    }))}

    return (
        <AuthContext.Provider value={{ auth, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}