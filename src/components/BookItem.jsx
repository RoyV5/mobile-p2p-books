import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function BookItem({ book, onDelete, onPress }) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onPress?.(book)}
      activeOpacity={0.7}
    >
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
        />
      ) : (
        <View style={styles.noCover}>
          <Text style={styles.noCoverText}>No cover</Text>
        </View>
      )}

      <View style={styles.bookInfo}>
        <Text style={styles.title}>
          {book.title}
        </Text>

        <Text style={styles.authors}>
          {book.authors?.join(', ') || 'Unknown author'}
        </Text>

        <Text style={styles.meta}>
          {book.pageCount ? `${book.pageCount} pages · ` : ''}ISBN: {book.isbn}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },

  cover: {
    width: 64,
    height: 92,
    borderRadius: 8,
    marginRight: 14,
  },

  noCover: {
    width: 64,
    height: 92,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noCoverText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },

  bookInfo: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
  },

  authors: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 1,
  },

  meta: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 6,
  },

  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 10,
  },
});