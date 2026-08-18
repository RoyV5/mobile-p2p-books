import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import UserHeader from '../../components/UserHeader';
import BookList from '../../components/BookList';

import { getUserShelf } from '../../api/shelf';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileScreen() {
  const { auth } = useAuth();
  const token = auth?.token;

  const route = useRoute();
  const { userId } = route.params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setError(null);

    try {
      const data = await getUserShelf(userId, token);
      setProfile(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not load this profile'
      );
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserHeader
        displayName={profile.user.displayName}
        handle={profile.user.handle}
        profilePictureUrl={profile.user.profilePictureUrl}
      />

      {profile.books === null ? (
        <View style={styles.privateBox} accessible accessibilityLabel="Private profile">
          <Text style={styles.privateBadge}>🔒 Private profile</Text>
          <Text style={styles.privateText}>
            This profile is private.
          </Text>
        </View>
      ) : (
        <BookList
          books={profile.books}
          processingIsbns={[]}
          emptyText="This user hasn't added any books yet."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  privateBox: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 12,
    alignItems: 'center'
  },

  privateBadge: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#666'
  },

  privateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },

  error: {
    color: 'red',
  },
});