import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

function ProcessingBookItem({ isbn }) {
  return (
    <View style={styles.listItem}>
      <ActivityIndicator />

      <View style={styles.bookInfo}>
        <Text style={styles.title}>
          Looking up book...
        </Text>

        <Text style={styles.isbnText}>
          ISBN: {isbn}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookInfo: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  isbnText: {
    marginTop: 4,
    color: '#666',
  },
});

export default ProcessingBookItem;
