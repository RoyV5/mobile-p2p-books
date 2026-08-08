import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

export default function BookList({ books, onOpenScanner, onDelete }) {
  return (
    <View style={styles.container}>

      <FlatList
        data={books}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => (
          <View style={styles.listItem}>

            {item.cover_url ? (
              <Image
                source={{ uri: item.cover_url }}
                style={styles.cover}
              />
            ) : (
              <View style={styles.noCover}>
                <Text>No cover</Text>
              </View>
            )}

            <View style={styles.bookInfo}>
              <Text style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.authors}>
                {item.authors?.join(', ') || 'Unknown author'}
              </Text>

              {item.page_count && (
                <Text style={styles.pages}>
                  {item.page_count} pages
                </Text>
              )}

              <Text style={styles.isbnText}>
                ISBN: {item.isbn}
              </Text>

              {onDelete && (
                <TouchableOpacity
                  onPress={() => onDelete(item.isbn)}
                >
                  <Text style={styles.deleteText}>
                    Remove from shelf
                  </Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No books in your shelf yet. Scan some books!
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },

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

  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});