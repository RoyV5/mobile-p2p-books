import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function UserHeader({
    displayName,
    handle,
    profilePictureUrl
}) {
    return (
        <View style={styles.container}>
            {profilePictureUrl ? (
                <Image
                    source={{ uri: profilePictureUrl }}
                    style={styles.profilePicture}
                />
            ) : (
                <View style={styles.profilePicturePlaceholder}>
                    <Text style={styles.placeholderText}>
                        {displayName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
            )}

            <Text style={styles.displayName}>
                {displayName}
            </Text>

            <Text style={styles.handle}>
                @{handle}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 40
    },

    profilePicture: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 16
    },

    profilePicturePlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },

    placeholderText: {
        fontSize: 42,
        fontWeight: '600',
        color: '#666'
    },

    displayName: {
        fontSize: 26,
        fontWeight: '700'
    },

    handle: {
        fontSize: 15,
        color: '#666',
        marginTop: 4
    }
});