import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import BarcodeScanner from '../../components/BarcodeScanner';
import BookList from '../../components/BookList';

import {
  getMyShelf,
  addBook,
  deleteBook,
} from '../../api/shelf';

import { useAuth } from '../../context/AuthContext';

export default function ShelfScreen() {
  const { auth } = useAuth();
  const token = auth?.token;
  const [books, setBooks] = useState([]);

  // ISBNs collected during the current scanning session
  const [scannedIsbns, setScannedIsbns] = useState([]);

  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ISBNs whose backend requests are currently in progress
  const [processingIsbns, setProcessingIsbns] = useState([]);

  const loadShelf = useCallback(async () => {
    setError(null);

    try {
      const shelf = await getMyShelf(token);
      setBooks(shelf);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not load your shelf'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadShelf();
  }, [loadShelf]);

  /*
   * Called by BarcodeScanner.
   *
   * IMPORTANT:
   * This must return synchronously because BarcodeScanner
   * immediately uses the return value to determine whether
   * the scan was new or a duplicate.
   */
  function handleScan(isbn) {
    const alreadyScanned = scannedIsbns.includes(isbn);

    if (alreadyScanned) {
      return false;
    }

    setScannedIsbns((previous) => [
      ...previous,
      isbn,
    ]);

    // Do NOT await this.
    // The request runs independently while scanning continues.
    processBook(isbn);

    return true;
  }

  async function processBook(isbn) {
    setProcessingIsbns((previous) => [
      ...previous,
      isbn,
    ]);

    try {
      const book = await addBook(isbn, token);

      setBooks((previousBooks) => {
        const alreadyExists = previousBooks.some(
          (existingBook) => existingBook.isbn === book.isbn
        );

        if (alreadyExists) {
          return previousBooks;
        }

        return [...previousBooks, book];
      });
    } catch (err) {
      handleAddBookError(err, isbn);
    } finally {
      setProcessingIsbns((previous) =>
        previous.filter((item) => item !== isbn)
      );
    }
  }

  /*
   * Scanning happens full-screen, over the camera view, so a
   * banner elsewhere on ShelfScreen would go unnoticed until the
   * user finishes scanning and backs out — often long after the
   * failure happened, disconnected from which scan caused it.
   * An immediate Alert surfaces the failure right when and where
   * it occurred instead.
   */
  function handleAddBookError(err, isbn) {
    setScannedIsbns(prev =>
      prev.filter(scannedIsbn => scannedIsbn !== isbn)
    );
    const status = err.response?.status;
    const code = err.response?.data?.code;
    

    if (status === 409) {
      Alert.alert(
        'Already on your shelf',
        'This book is already in your library.'
      );
      return;
    }

    if (code === 'BOOK_NOT_FOUND') {
      Alert.alert(
        'Book not found',
        `We couldn't find a book with ISBN ${isbn} in our ` +
        'sources. Want to log it in manually?',
        [
          {
            text: 'Log manually',
            onPress: () => {
              // TODO: manual-entry flow isn't built yet.
              Alert.alert(
                'Coming soon',
                'Manually logging a book isn\u2019t available yet.'
              );
            },
          },
          { text: 'Dismiss', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert(
      'Could not add book',
      err.response?.data?.error ||
      `Something went wrong adding ${isbn}.`,
      [
        { text: 'Try Again', onPress: () => processBook(isbn) },
        { text: 'Dismiss', style: 'cancel' },
      ]
    );
  }

  /*
   * The user has finished scanning.
   *
   * The requests already fired by processBook() continue
   * running independently. We only close the scanner and
   * clear the temporary scanning-session list.
   */
  function handleFinishScanning() {
    setIsScanning(false);
    setScannedIsbns([]);
  }

  async function handleDeleteBook(isbn) {
    try {
      await deleteBook(isbn, token);

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book.isbn !== isbn)
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not delete book'
      );
    }
  }

  if (isScanning) {
    return (
      <BarcodeScanner
        onScan={handleScan}
        onClose={handleFinishScanning}
        totalScanned={scannedIsbns.length}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading your shelf...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Shelf</Text>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <BookList
        books={books}
        processingIsbns={processingIsbns}
        onDelete={handleDeleteBook}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {
          setScannedIsbns([]);
          setIsScanning(true);
        }}
      >
        <Text style={styles.scanButtonText}>
          Scan Books
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  scanButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },
});