import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { auth } = useAuth();
  const user = auth?.user;

  return (
    <View style={styles.container}>
      {/* Compact Greeting Header */}
      <View style={styles.welcomeRow}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingSub}>Welcome back,</Text>
          <Text style={styles.greetingName}>{user?.displayName || 'Reader'}</Text>
        </View>

        {user?.profilePictureUrl ? (
          <Image source={{ uri: user.profilePictureUrl }} style={styles.smallAvatar} />
        ) : (
          <View style={styles.smallAvatarPlaceholder}>
            <Text style={styles.placeholderText}>
              {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>

      {/* Primary Actions Centered */}
      <View style={styles.buttonContainer}>
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Shelf')}>
            <Text style={styles.buttonText}>My Library</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.buttonText}>Browse</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.buttonText}>Settings</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20, // Adjust this if you need more space from the status bar
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  smallAvatar: {
    width: 56, // Bumped up from 48
    height: 56,
    borderRadius: 28,
  },
  smallAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#475569',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // Centers the buttons vertically in the remaining space
  },
  actions: {
    gap: 12,
  },
  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});