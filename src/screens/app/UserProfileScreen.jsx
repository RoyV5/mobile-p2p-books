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

  // Define the header component once
  const profileHeader = (
    <UserHeader
      displayName={profile.user.displayName}
      handle={profile.user.handle}
      profilePictureUrl={profile.user.profilePictureUrl}
      description={profile.user.description}
    />
  );

  return (
    <View style={styles.container}>
      {profile.books === null ? (
        <View style={styles.paddedContent}>
          {profileHeader}
          <View style={styles.privateBox} accessible accessibilityLabel="Private profile">
            <Text style={styles.privateBadge}>🔒 Private profile</Text>
            <Text style={styles.privateText}>
              This profile is private.
            </Text>
          </View>
        </View>
      ) : (
        <BookList
          books={profile.books}
          processingIsbns={[]}
          emptyText="This user hasn't added any books yet."
          header={
            <View style={styles.headerWrapper}>
              {profileHeader}
            </View>
          }
        />
      )}
    </View>
  );
}

// Inside UserProfileScreen.js

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // <-- Ensure this is pure white to fix the book shadows
  },
  // Use this for static content like the private profile view
  paddedContent: {
    padding: 20,
  },
  // Ensures the header has padding, but the list items can span full width or handle their own padding
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
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