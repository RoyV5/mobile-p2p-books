import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

export default function BookList({ books, onOpenScanner }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onOpenScanner}>
        <Text style={styles.buttonText}>+ Scan Books</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Scanned Barcodes ({books.length})</Text>

      <FlatList
        data={books}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.isbnText}>ISBN: {item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No books scanned yet. Tap scan above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listItem: {
    backgroundColor: '#fff', padding: 15, borderRadius: 8,
    marginBottom: 10, elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  isbnText: { fontSize: 16, fontFamily: 'monospace' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40 },
});