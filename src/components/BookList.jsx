import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import BookItem from './BookItem';
import ProcessingBookItem from './ProcessingBookItem';
import BookDetailModal from './BookDetailModal';

export default function BookList({
  books,
  processingIsbns = [],
  onDelete,
  emptyText = 'No books in your shelf yet. Scan some books!',
  header, // 1. Add generic header prop
  isOwnShelf = false,
  shelfOwner, // the other user's public info, when isOwnShelf is false
}) {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <>
      <FlatList
        data={books}
        keyExtractor={(item) => item.isbn}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onDelete={onDelete}
            onPress={setSelectedBook}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          // 2. Render both the injected header and processing items
          <View>
            {header}
            {header && <View style={styles.separator} />}
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

      <BookDetailModal
        book={selectedBook}
        visible={!!selectedBook}
        isOwnShelf={isOwnShelf}
        owner={isOwnShelf ? undefined : shelfOwner}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    // UserHeader already carries its own marginBottom, which is the
    // gap above this line - only add the gap below, so it doesn't
    // stack into a lopsided 32px-above/4px-below gap.
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});