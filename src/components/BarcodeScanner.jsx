import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function BarcodeScanner({
  onScan,
  onClose,
  onManualEntry,
  totalScanned,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const isLockedRef = useRef(false);
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
    if (isLockedRef.current) return;

    isLockedRef.current = true;

    const added = onScan(data);
    setScanStatus(added ? 'scanned' : 'duplicate');

    setTimeout(() => {
      isLockedRef.current = false;
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

      {/* Top Header Controls */}
      <View style={styles.topBar}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Scanned: {totalScanned}</Text>
        </View>
        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Dead-Center Viewfinder */}
      <View style={styles.viewfinderContainer} pointerEvents="none">
        <View
          style={[
            styles.viewfinderFrame,
            scanStatus === 'scanned' && styles.viewfinderSuccess,
            scanStatus === 'duplicate' && styles.viewfinderDuplicate,
          ]}
        />
      </View>

      {/* Bottom Floating Controls */}
      <View style={styles.bottomOverlay}>
        <Text
          style={[
            styles.pillBase,
            styles.statusPill,
            scanStatus === 'duplicate' && styles.duplicateOverlayText,
            scanStatus === 'scanned' && styles.successOverlayText,
          ]}
        >
          {scanStatus === 'duplicate' && 'Book already in list'}
          {scanStatus === 'scanned' && 'Scanned! Next book...'}
          {scanStatus === 'ready' && 'Align barcode inside frame'}
        </Text>

        <TouchableOpacity style={styles.manualEntryCard} onPress={onManualEntry}>
          <Text style={[styles.pillBase, styles.manualEntryText]}>
            Can&apos;t scan? Add Manually
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* Top Navigation */
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  doneButtonText: { color: '#000', fontSize: 14, fontWeight: '700' },

  /* Dead-Center Viewfinder */
  viewfinderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  viewfinderFrame: {
    width: 270,
    height: 160,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  viewfinderSuccess: {
    borderColor: '#28a745',
    backgroundColor: 'rgba(40, 167, 69, 0.15)',
  },
  viewfinderDuplicate: {
    borderColor: '#d9534f',
    backgroundColor: 'rgba(217, 83, 79, 0.15)',
  },

  /* Bottom Controls & Uniform Pill Styling */
  bottomOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  pillBase: {
    width: 250,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    overflow: 'hidden',
  },
  statusPill: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  duplicateOverlayText: {
    backgroundColor: 'rgba(217, 83, 79, 0.95)',
    borderColor: 'rgba(217, 83, 79, 1)',
  },
  successOverlayText: {
    backgroundColor: 'rgba(40, 167, 69, 0.95)',
    borderColor: 'rgba(40, 167, 69, 1)',
  },

  manualEntryCard: {
    alignItems: 'center',
  },
  manualEntryText: {
    color: '#e0e0e0',
    backgroundColor: 'rgba(40, 40, 40, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});