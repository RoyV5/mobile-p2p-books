import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ShelfScreen from './src/screens/ShelfScreen';

export default function App() {
  const [auth, setAuth] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  function handleLogin(authResult) {
    setAuth(authResult);
  }

  function handleLogout() {
    setAuth(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      {!auth ? (
        showRegister ? (
          <RegisterScreen
            onRegister={handleLogin}
            onBack={() => setShowRegister(false)}
          />
        ) : (
          <LoginScreen
            onLogin={handleLogin}
            onRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        <ShelfScreen
          token={auth.token}
          onLogout={handleLogout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});