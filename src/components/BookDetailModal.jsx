import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    AVAILABILITY,
    AVAILABILITY_META,
    getBookAvailability
} from '../api/availability';

const DESCRIPTION_PREVIEW_LENGTH = 150;

// `card` only has a maxHeight (an auto-sized box clamped after the
// fact), not an explicit height - so a `flex: 1` ScrollView has no
// definite space to grow into and collapses to 0. Compute a real
// pixel cap instead so the ScrollView has something concrete to bound
// itself to and can actually become internally scrollable.
const CARD_MAX_HEIGHT = Dimensions.get('window').height * 0.85;
const CARD_CHROME_HEIGHT = 44; // card's own paddingTop + paddingBottom

/*
 * isOwnShelf: true when this book is on the current user's own
 * shelf — Request doesn't make sense there, so it's replaced with
 * a simple "on your shelf" note instead of an availability badge.
 *
 * owner: the other user's public info, when this book is being
 * viewed on someone else's shelf. Not needed (and not passed) for
 * the owner's own shelf.
 */
export default function BookDetailModal({
    book,
    visible,
    isOwnShelf = false,
    owner,
    onClose
}) {
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    // The modal stays mounted between books (only `book`/`visible` change),
    // so reset the expanded state whenever a different book is shown.
    useEffect(() => {
        setDescriptionExpanded(false);
    }, [book?.isbn]);

    if (!book) {
        return null;
    }

    const availability = getBookAvailability(book);
    const meta = AVAILABILITY_META[availability];
    const canRequest = !isOwnShelf && availability === AVAILABILITY.AVAILABLE;

    const description = book.description || '';
    const isLongDescription = description.length > DESCRIPTION_PREVIEW_LENGTH;
    const displayedDescription =
        isLongDescription && !descriptionExpanded
            ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
            : description;

    function handleRequest() {
        // Stub — the loaning flow doesn't exist yet.
        Alert.alert(
            'Coming soon',
            'Requesting to borrow books isn\'t available yet.'
        );
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                {/* Sits behind the card - taps on the card itself never reach this */}
                <Pressable style={styles.backdropTap} onPress={onClose} />

                <View style={styles.card}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={onClose}
                        hitSlop={10}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </Pressable>

                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.headerRow}>
                            {book.coverUrl ? (
                                <Image
                                    source={{ uri: book.coverUrl }}
                                    style={styles.cover}
                                />
                            ) : (
                                <View style={styles.noCover}>
                                    <Text style={styles.noCoverText}>
                                        No cover
                                    </Text>
                                </View>
                            )}

                            <View style={styles.headerText}>
                                <Text style={styles.title}>{book.title}</Text>

                                <Text style={styles.authors}>
                                    {book.authors?.join(', ') || 'Unknown author'}
                                </Text>

                                {owner && (
                                    <Text style={styles.ownerText}>
                                        Owned by {owner.displayName} (@{owner.handle})
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.metaSection}>
                            <MetaRow label="ISBN" value={book.isbn} />
                            <MetaRow label="Publisher" value={book.publisher} />
                            <MetaRow
                                label="Published"
                                value={book.publishedYear ? String(book.publishedYear) : null}
                            />
                            <MetaRow
                                label="Pages"
                                value={book.pageCount ? String(book.pageCount) : null}
                            />
                            <MetaRow label="Language" value={book.language} />
                        </View>

                        {description ? (
                            <View style={styles.descriptionSection}>
                                <Text style={styles.description}>
                                    {displayedDescription}
                                </Text>

                                {isLongDescription && (
                                    <Pressable
                                        onPress={() =>
                                            setDescriptionExpanded((expanded) => !expanded)
                                        }
                                        hitSlop={6}
                                    >
                                        <Text style={styles.seeMoreText}>
                                            {descriptionExpanded ? 'See less' : 'See more...'}
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        ) : null}

                        <View style={styles.actionSection}>
                            {isOwnShelf ? (
                                <View style={styles.ownShelfNote}>
                                    <Text style={styles.ownShelfNoteText}>
                                        📚 This book is on your shelf
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <View
                                        style={[
                                            styles.badge,
                                            { backgroundColor: meta.backgroundColor }
                                        ]}
                                    >
                                        <Text style={[styles.badgeText, { color: meta.color }]}>
                                            {meta.label}
                                        </Text>
                                    </View>

                                    <Pressable
                                        style={[
                                            styles.requestButton,
                                            !canRequest && styles.requestButtonDisabled
                                        ]}
                                        onPress={handleRequest}
                                        disabled={!canRequest}
                                    >
                                        <Text
                                            style={[
                                                styles.requestButtonText,
                                                !canRequest && styles.requestButtonTextDisabled
                                            ]}
                                        >
                                            {canRequest ? 'Request' : meta.label}
                                        </Text>
                                    </Pressable>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function MetaRow({ label, value }) {
    if (!value) {
        return null;
    }

    return (
        <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{label}</Text>
            <Text style={styles.metaValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    // Fills the backdrop behind the card. The card is a later sibling
    // rendered on top of it, so taps landing on the card never reach
    // this - no need for a tap-swallowing wrapper around the card.
    backdropTap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    card: {
        width: '100%',
        maxWidth: 420,
        maxHeight: CARD_MAX_HEIGHT,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 24,
        overflow: 'hidden'
    },

    scroll: {
        maxHeight: CARD_MAX_HEIGHT - CARD_CHROME_HEIGHT
    },

    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center'
    },

    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },

    scrollContent: {
        paddingTop: 12
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%'
    },

    cover: {
        width: 96,
        height: 138,
        borderRadius: 6,
        marginRight: 16
    },

    noCover: {
        width: 96,
        height: 138,
        borderRadius: 6,
        marginRight: 16,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
    },

    noCoverText: {
        color: '#999'
    },

    headerText: {
        flex: 1,
        paddingTop: 2
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4
    },

    authors: {
        fontSize: 15,
        color: '#555',
        marginBottom: 4
    },

    ownerText: {
        fontSize: 13,
        color: '#888',
        marginBottom: 8
    },

    metaSection: {
        width: '100%',
        marginTop: 12,
        marginBottom: 8
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },

    metaLabel: {
        fontSize: 13,
        color: '#888'
    },

    metaValue: {
        fontSize: 13,
        color: '#222',
        fontWeight: '500',
        maxWidth: '65%',
        textAlign: 'right'
    },

    descriptionSection: {
        width: '100%',
        marginTop: 12
    },

    description: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20
    },

    seeMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginTop: 6
    },

    actionSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },

    badge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 12
    },

    badgeText: {
        fontSize: 13,
        fontWeight: '600'
    },

    requestButton: {
        backgroundColor: '#222',
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
        width: '100%'
    },

    requestButtonDisabled: {
        backgroundColor: '#eee'
    },

    requestButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    requestButtonTextDisabled: {
        color: '#999'
    },

    ownShelfNote: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 20
    },

    ownShelfNoteText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500'
    }
});