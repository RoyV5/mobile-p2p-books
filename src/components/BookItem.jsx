import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function BookItem({ book, onDelete }) {
  return (
    <View style={styles.listItem}>
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
        />
      ) : (
        <View style={styles.noCover}>
          <Text>No cover</Text>
        </View>
      )}

      <View style={styles.bookInfo}>
        <Text style={styles.title}>
          {book.title}
        </Text>

        <Text style={styles.authors}>
          {book.authors?.join(', ') || 'Unknown author'}
        </Text>

        {book.pageCount && (
          <Text style={styles.pages}>
            {book.pageCount} pages
          </Text>
        )}

        <Text style={styles.isbnText}>
          ISBN: {book.isbn}
        </Text>

        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(book.isbn)}
          >
            <Text style={styles.deleteText}>
              Remove from shelf
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },

  cover: {
    width: 70,
    height: 100,
    marginRight: 12,
  },

  noCover: {
    width: 70,
    height: 100,
    marginRight: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookInfo: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  authors: {
    marginBottom: 5,
  },

  pages: {
    color: '#666',
    marginBottom: 5,
  },

  isbnText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
  },

  deleteText: {
    color: '#cc0000',
    marginTop: 10,
  },
});