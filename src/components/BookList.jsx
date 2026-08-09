import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import BookItem from './BookItem';
import ProcessingBookItem from './ProcessingBookItem';

export default function BookList({
  books,
  processingIsbns,
  onDelete,
}) {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.isbn}
      renderItem={({ item }) => (
        <BookItem
          book={item}
          onDelete={onDelete}
        />
      )}
      ListHeaderComponent={
        processingIsbns.length > 0 ? (
          <View>
            {processingIsbns.map((isbn) => (
              <ProcessingBookItem
                key={isbn}
                isbn={isbn}
              />
            ))}
          </View>
        ) : null
      }
      ListEmptyComponent={
        processingIsbns.length === 0 ? (
          <Text style={styles.emptyText}>
            No books in your shelf yet. Scan some books!
          </Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});