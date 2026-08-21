/*
 * STUB — there's no loan/borrowing model on the backend yet, so
 * there's no real signal to derive this from. Every book reads as
 * 'available' for now. Once the backend exposes real loan state
 * (e.g. a `status` field on the book-on-shelf record), replace the
 * body of getBookAvailability with that lookup — everything that
 * consumes this (colors, labels, Request button state) already
 * keys off the three states below and won't need to change.
 */

export const AVAILABILITY = {
    AVAILABLE: 'available',
    BORROWED: 'borrowed',
    UNAVAILABLE: 'unavailable'
};

export const AVAILABILITY_META = {
    [AVAILABILITY.AVAILABLE]: {
        label: 'Available',
        color: '#2e7d32',
        backgroundColor: '#e8f5e9'
    },
    [AVAILABILITY.BORROWED]: {
        label: 'Lent out',
        color: '#a17400',
        backgroundColor: '#fff8e1'
    },
    [AVAILABILITY.UNAVAILABLE]: {
        label: 'Not for loaning',
        color: '#c62828',
        backgroundColor: '#ffebee'
    }
};

export function getBookAvailability(book) {
    return AVAILABILITY.AVAILABLE;
}