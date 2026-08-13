import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);

    function login(authResult) {
        setAuth(authResult);
    }

    function logout() {
        setAuth(null);
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
        <AuthContext.Provider value={{ auth, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}