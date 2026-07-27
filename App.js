import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import BarcodeScanner from './src/components/BarcodeScanner';
import BookList from './src/components/BookList';

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedIsbns, setScannedIsbns] = useState([]);

  // Handler passed down to the BarcodeScanner component
const handleScan = (isbn) => {
  // 1. Check if the ISBN exists synchronously BEFORE triggering state updates
  const isAlreadyScanned = scannedIsbns.includes(isbn);
  
  if (!isAlreadyScanned) {
    console.log("Scanned NEW ISBN:", isbn);
    // 2. Add to list
    setScannedIsbns((prev) => [isbn, ...prev]);
    return true; // Successfully added new book!
  }

  console.log("Duplicate scan detected:", isbn);
  return false; // Book already in list!
};

  return (
    <SafeAreaView style={styles.container}>
      {isScanning ? (
        <BarcodeScanner 
          onScan={handleScan} 
          onClose={() => setIsScanning(false)} 
          totalScanned={scannedIsbns.length}
        />
      ) : (
        <BookList 
          books={scannedIsbns} 
          onOpenScanner={() => setIsScanning(true)} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
});