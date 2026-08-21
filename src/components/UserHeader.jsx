import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function UserHeader({ displayName, handle, profilePictureUrl, description }) {
  return (
    <View style={styles.container}>
      {profilePictureUrl ? (
        <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.placeholderText}>
            {displayName?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.handle}>@{handle}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingBottom: 0, // Reduced this to cut down on internal bottom space
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc', // Contrasting inner color
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16, // Reduced external bottom margin
  },
  avatar: {
    width: 64, 
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  placeholderText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#475569',
  },
  info: {
    flex: 1,
    paddingTop: 2, 
  },
  displayName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
  },
  handle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 1,
  },
  description: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 6, // Slightly tighter spacing above the description
  },
});