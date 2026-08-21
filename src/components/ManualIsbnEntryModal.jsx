import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ManualIsbnEntryModal({
  visible,
  onSubmit,
  onCancel,
}) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    // Strip anything that isn't a digit or the ISBN-10 check
    // character (X), so hyphens/spaces typed by the user don't
    // block submission. Real format/checksum validation still
    // happens once, at the boundary, in the backend's isbn
    // middleware — this is just enough cleanup to be usable,
    // not a duplicate of that validation.
    const cleaned = value.replace(/[^0-9Xx]/g, '');

    if (!cleaned) {
      return;
    }

    setValue('');
    onSubmit(cleaned);
  }

  function handleCancel() {
    setValue('');
    onCancel();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter ISBN</Text>

          <Text style={styles.subtitle}>
            {"If a barcode won't scan, type the ISBN printed on " +
              'the book instead.'}
          </Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="e.g. 9780140449266"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="number-pad"
            autoFocus
            maxLength={17}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: '#eee',
  },

  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },

  submitButton: {
    backgroundColor: '#222',
  },

  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});