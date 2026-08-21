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
  processingIsbns = [],
  onDelete,
  emptyText = 'No books in your shelf yet. Scan some books!',
  header, // 1. Add generic header prop
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
        // 2. Render both the injected header and processing items
        <View>
          {header}
          {processingIsbns.length > 0 && (
            <View>
              {processingIsbns.map((isbn) => (
                <ProcessingBookItem
                  key={isbn}
                  isbn={isbn}
                />
              ))}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        processingIsbns.length === 0 ? (
          <Text style={styles.emptyText}>
            {emptyText}
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