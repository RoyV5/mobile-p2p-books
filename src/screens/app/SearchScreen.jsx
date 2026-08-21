import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { searchUsers, searchBooks } from '../../api/search';
import { useAuth } from '../../context/AuthContext';

const MIN_QUERY_LENGTH = 2;

export default function SearchScreen() {
    const { auth } = useAuth();
    const token = auth?.token;
    const navigation = useNavigation();

    // Books is the default tab since borrowing — not browsing
    // people — is the app's core loop.
    const [searchType, setSearchType] = useState('books');

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    async function runSearch(type, rawQuery) {
        if (rawQuery.trim().length < MIN_QUERY_LENGTH) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setError(null);
        setLoading(true);
        setHasSearched(true);

        try {
            const data = type === 'books'
                ? await searchBooks(rawQuery, token)
                : await searchUsers(rawQuery, token);

            setResults(data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                `Could not search ${type}`
            );
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit() {
        runSearch(searchType, query);
    }

    function handleChangeType(newType) {
        if (newType === searchType) {
            return;
        }

        setSearchType(newType);
        setResults([]);
        setHasSearched(false);

        // Re-run immediately against the new type rather than
        // making the person press "Go" again for a query
        // they've already typed.
        if (query.trim().length >= MIN_QUERY_LENGTH) {
            runSearch(newType, query);
        }
    }

    function handleSelectUser(user) {
        navigation.navigate('UserProfile', { userId: user.id });
    }

    function handleSelectBook(book) {
        navigation.navigate('UserProfile', { userId: book.owner.id });
    }

    function renderUserResult({ item }) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.resultRow,
                    pressed && styles.pressedRow
                ]}
                onPress={() => handleSelectUser(item)}
            >
                {item.profilePictureUrl ? (
                    <Image
                        source={{ uri: item.profilePictureUrl }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>
                            {item.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                )}

                <View>
                    <Text style={styles.resultDisplayName}>
                        {item.displayName}
                    </Text>
                    <Text style={styles.resultHandle}>
                        @{item.handle}
                    </Text>
                </View>
            </Pressable>
        );
    }

    function renderBookResult({ item }) {
        const subtitle = [item.publisher, item.publishedYear]
            .filter(Boolean)
            .join(' · ');

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.bookResultCard,
                    pressed && styles.pressedRow
                ]}
                onPress={() => handleSelectBook(item)}
            >
                <View style={styles.bookResultTop}>
                    {item.coverUrl ? (
                        <Image
                            source={{ uri: item.coverUrl }}
                            style={styles.bookCover}
                        />
                    ) : (
                        <View style={styles.bookCoverPlaceholder}>
                            <Text style={styles.bookCoverPlaceholderText}>
                                No cover
                            </Text>
                        </View>
                    )}

                    <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle} numberOfLines={2}>
                            {item.title}
                        </Text>

                        {item.authors?.length > 0 && (
                            <Text style={styles.bookAuthors} numberOfLines={1}>
                                {item.authors.join(', ')}
                            </Text>
                        )}

                        {subtitle !== '' && (
                            <Text style={styles.bookSubtitle}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.ownerRow}>
                    {item.owner.profilePictureUrl ? (
                        <Image
                            source={{ uri: item.owner.profilePictureUrl }}
                            style={styles.ownerAvatar}
                        />
                    ) : (
                        <View style={styles.ownerAvatarPlaceholder}>
                            <Text style={styles.ownerAvatarPlaceholderText}>
                                {item.owner.displayName?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.ownerText}>
                        Owned by {item.owner.displayName} (@{item.owner.handle})
                    </Text>
                </View>
            </Pressable>
        );
    }

    const emptyText = searchType === 'books'
        ? 'No books found.'
        : 'No users found.';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Browse</Text>

            <View style={styles.typeToggleRow}>
                <Pressable
                    style={[
                        styles.typeToggleButton,
                        searchType === 'books' && styles.typeToggleButtonActive
                    ]}
                    onPress={() => handleChangeType('books')}
                >
                    <Text
                        style={[
                            styles.typeToggleText,
                            searchType === 'books' && styles.typeToggleTextActive
                        ]}
                    >
                        Books
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.typeToggleButton,
                        searchType === 'users' && styles.typeToggleButtonActive
                    ]}
                    onPress={() => handleChangeType('users')}
                >
                    <Text
                        style={[
                            styles.typeToggleText,
                            searchType === 'users' && styles.typeToggleTextActive
                        ]}
                    >
                        Users
                    </Text>
                </Pressable>
            </View>

            <View style={styles.searchRow}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={
                        searchType === 'books'
                            ? 'Search books by title or ISBN...'
                            : 'Search users...'
                    }
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={handleSubmit}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Go</Text>
                </Pressable>
            </View>

            {loading && (
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
            )}

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}

            {!loading && hasSearched && results.length === 0 && !error && (
                <Text style={styles.emptyText}>
                    {emptyText}
                </Text>
            )}

            <FlatList
                data={results}
                keyExtractor={(item) =>
                    searchType === 'books'
                        ? `${item.isbn}:${item.owner.id}`
                        : item.id
                }
                renderItem={
                    searchType === 'books'
                        ? renderBookResult
                        : renderUserResult
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f5f5f5'
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 20
    },

    typeToggleRow: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 4,
        marginBottom: 20
    },

    typeToggleButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center'
    },

    typeToggleButtonActive: {
        backgroundColor: '#fff'
    },

    typeToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888'
    },

    typeToggleTextActive: {
        color: '#222'
    },

    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },

    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 8
    },

    button: {
        backgroundColor: '#222',
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 11
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600'
    },

    loading: {
        marginTop: 20
    },

    error: {
        color: 'red',
        marginBottom: 10
    },

    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20
    },

    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12
    },

    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },

    avatarPlaceholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666'
    },

    resultDisplayName: {
        fontSize: 16,
        fontWeight: '600'
    },

    resultHandle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2
    },

    pressedRow: {
        backgroundColor: '#f0f0f0'
    },

    bookResultCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10
    },

    bookResultTop: {
        flexDirection: 'row'
    },

    bookCover: {
        width: 50,
        height: 74,
        borderRadius: 4,
        marginRight: 12
    },

    bookCoverPlaceholder: {
        width: 50,
        height: 74,
        borderRadius: 4,
        marginRight: 12,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
    },

    bookCoverPlaceholderText: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center'
    },

    bookInfo: {
        flex: 1,
        justifyContent: 'center'
    },

    bookTitle: {
        fontSize: 16,
        fontWeight: '600'
    },

    bookAuthors: {
        fontSize: 13,
        color: '#555',
        marginTop: 2
    },

    bookSubtitle: {
        fontSize: 12,
        color: '#999',
        marginTop: 2
    },

    ownerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'
    },

    ownerAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8
    },

    ownerAvatarPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },

    ownerAvatarPlaceholderText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666'
    },

    ownerText: {
        fontSize: 12,
        color: '#666'
    }
});