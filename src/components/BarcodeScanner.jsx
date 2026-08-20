import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function BarcodeScanner({ onScan, onClose, totalScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  
  // 1. Synchronous lock for the high-speed camera engine (No race conditions!)
  const isLockedRef = useRef(false);

  // 2. UI-only state to handle visual feedback text & background color
  const [scanStatus, setScanStatus] = useState('ready'); // 'ready' | 'scanned' | 'duplicate'

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>We need camera access to scan ISBNs.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    // 1. INSTANT SYNCHRONOUS CHECK: If locked, drop this camera frame immediately!
    if (isLockedRef.current) return;

    // 2. INSTANT SYNCHRONOUS LOCK: Locks memory on the exact same microsecond tick!
    isLockedRef.current = true;
    
    // 3. Process the scan
    const added = onScan(data);
    setScanStatus(added ? 'scanned' : 'duplicate');

    // 4. UNLOCK memory and reset UI state after 1.5 seconds
    setTimeout(() => {
      isLockedRef.current = false; // Synchronously unlocks memory
      setScanStatus('ready');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.cameraOverlay}>
        <Text style={[
          styles.overlayText, 
          scanStatus === 'duplicate' && styles.duplicateOverlayText,
          scanStatus === 'scanned' && styles.successOverlayText
        ]}>
          {scanStatus === 'duplicate' && "Book already in list, scan another?"}
          {scanStatus === 'scanned' && "Scanned! Point at next book..."}
          {scanStatus === 'ready' && "Ready to scan..."}
        </Text>
        
        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
          <Text style={styles.buttonText}>Done Scanning ({totalScanned})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  closeButton: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  permissionText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  cameraOverlay: { position: 'absolute', bottom: 40, left: 20, right: 20, alignItems: 'center' },
  overlayText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 15,
    paddingVertical: 10, borderRadius: 20, marginBottom: 15, textAlign: 'center'
  },
  duplicateOverlayText: {
    backgroundColor: 'rgba(217, 83, 79, 0.9)',
  },
  successOverlayText: {
    backgroundColor: 'rgba(40, 167, 69, 0.95)', // Green accent for successful scans
  },
});