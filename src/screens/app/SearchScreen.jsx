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

import { searchUsers } from '../../api/search';
import { useAuth } from '../../context/AuthContext';

export default function SearchScreen() {
    const { auth } = useAuth();
    const token = auth?.token;
    const navigation = useNavigation();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch() {
        setError(null);
        setLoading(true);
        setHasSearched(true);

        try {
            const users = await searchUsers(query, token);
            setResults(users);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Could not search users'
            );
        } finally {
            setLoading(false);
        }
    }

    function handleSelectUser(user) {
        navigation.navigate('UserProfile', { userId: user.id });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Browse</Text>

            <View style={styles.searchRow}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search users..."
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />

                <Pressable
                    style={styles.button}
                    onPress={handleSearch}
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
                    No users found.
                </Text>
            )}

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                                            style={({ pressed }) => [styles.resultRow, pressed && styles.pressedRow]}
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
                )}
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
        marginBottom: 30
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
    }
});