import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export default function BrowseScreen() {
    const [query, setQuery] = useState('');

    function handleSearch() {
        console.log('Search:', query);
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
        alignItems: 'center'
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
    }
});