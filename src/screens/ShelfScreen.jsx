import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import BarcodeScanner from '../components/BarcodeScanner';
import BookList from '../components/BookList';

import {
  getMyShelf,
  addBook,
  deleteBook,
} from '../api/shelf';

export default function ShelfScreen({ token, onLogout }) {
  const [books, setBooks] = useState([]);

  // ISBNs collected during the current scanning session
  const [scannedIsbns, setScannedIsbns] = useState([]);

  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingBooks, setAddingBooks] = useState(false);
  const [error, setError] = useState(null);

  async function loadShelf() {
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
  }

  useEffect(() => {
    loadShelf();
  }, []);

  /*
   * This function is called by BarcodeScanner.
   *
   * IMPORTANT:
   * It must return synchronously because BarcodeScanner
   * immediately uses the return value to decide whether
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

    return true;
  }

  /*
   * The user has finished scanning.
   *
   * Now we actually communicate with the backend.
   */
  async function handleFinishScanning() {
    setIsScanning(false);

    if (scannedIsbns.length === 0) {
      return;
    }

    setAddingBooks(true);
    setError(null);

    try {
      for (const isbn of scannedIsbns) {
        await addBook(isbn, token);
      }

      // Get the authoritative version from the backend.
      await loadShelf();

      // Clear the scanning session.
      setScannedIsbns([]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not add books to your shelf'
      );
    } finally {
      setAddingBooks(false);
    }
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

        <TouchableOpacity onPress={onLogout}>
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <BookList
        books={books}
        onDelete={handleDeleteBook}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {
          setScannedIsbns([]);
          setIsScanning(true);
        }}
        disabled={addingBooks}
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