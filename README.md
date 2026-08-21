# p2p-books | Mobile App

A React Native mobile application built with Expo for scanning ISBN barcodes, managing personal book collections, and searching book metadata.

*Backend Repository: [backend-p2p-books](https://github.com/RoyV5/backend-p2p-books)*

## Overview

This client provides a fast interface for building a personal book shelf via physical barcode scanning or manual entry. It communicates with a custom Node.js backend to retrieve reconciled metadata across multiple book APIs.

## Key Technical Details

* **Synchronous Frame Locking:** Uses `useRef` flags to block duplicate barcode reads inside `expo-camera` before state re-renders occur, eliminating race conditions when scanning physical books rapidly.
* **Camera Interface:** Built using `CameraView` with EAN-13 decoding restricted specifically to ISBN barcodes.
* **Ergonomic Controls:** Custom overlay layout with targeted scan areas, visual status indicators (`ready`, `scanned`, `duplicate`), and manual ISBN fallback entry.

## Stack

* React Native / Expo
* expo-camera
* JavaScript (ES6+)
