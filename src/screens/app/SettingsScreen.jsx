import React, { useEffect, useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';

import {
    getSettings,
    updateSettings,
    uploadProfilePicture
} from '../../api/settings';

import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
    const { auth, logout, updateUser } = useAuth();
    const token = auth?.token;

    const [settings, setSettings] = useState(null);
    const [originalSettings, setOriginalSettings] = useState(null);

    const [handle, setHandle] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [privateProfile, setPrivateProfile] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadSettings = useCallback(async () => {
        if (!token) {
            return;
        }

        setError('');

        try {
            const data = await getSettings(token);

            const initialSettings = {
                handle: data.handle ?? '',
                displayName: data.displayName ?? '',
                description: data.description ?? '',
                privateProfile: data.privateProfile ?? false,
                profilePictureUrl: data.profilePictureUrl ?? null
            };

            setSettings(initialSettings);
            setOriginalSettings(initialSettings);

            setHandle(initialSettings.handle);
            setDisplayName(initialSettings.displayName);
            setDescription(initialSettings.description);
            setPrivateProfile(initialSettings.privateProfile);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Could not load settings'
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    async function handleSave() {
        if (!originalSettings) {
            return;
        }

        setError('');
        setSaving(true);

        try {
            const changes = {};

            if (handle !== originalSettings.handle) {
                changes.handle = handle;
            }

            if (displayName !== originalSettings.displayName) {
                changes.displayName = displayName;
            }

            if (description !== originalSettings.description) {
                changes.description = description || null;
            }

            if (privateProfile !== originalSettings.privateProfile) {
                changes.privateProfile = privateProfile;
            }

            if (Object.keys(changes).length === 0) {
                return;
            }

            const updated = await updateSettings(
                changes,
                token
            );

            /*
             * Backend returns only the fields that actually changed.
             */
            updateUser(updated);

            /*
             * Update the server snapshot with the confirmed values.
             */
            setOriginalSettings((previous) => ({
                ...previous,
                ...updated
            }));

            /*
             * Keep the local settings representation synchronized.
             */
            setSettings((previous) => ({
                ...previous,
                ...updated
            }));

            /*
             * The backend may normalize values, such as handles,
             * so use its response rather than assuming our submitted
             * value was accepted unchanged.
             */
            if (updated.handle !== undefined) {
                setHandle(updated.handle);
            }

            if (updated.displayName !== undefined) {
                setDisplayName(updated.displayName);
            }

            if (updated.description !== undefined) {
                setDescription(updated.description ?? '');
            }

            if (updated.privateProfile !== undefined) {
                setPrivateProfile(updated.privateProfile);
            }

            Alert.alert(
                'Saved',
                'Your settings have been updated.'
            );
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Could not update settings'
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleChangeProfilePicture() {
        setError('');

        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permission required',
                'We need access to your photos to change your profile picture.'
            );

            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8
            });

        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];

        const formData = new FormData();

        formData.append('profilePicture', {
            uri: asset.uri,
            name: asset.fileName || 'profile-picture.jpg',
            type: asset.mimeType || 'image/jpeg'
        });

        try {
            const data = await uploadProfilePicture(
                token,
                formData
            );

            setSettings((previous) => ({
                ...previous,
                profilePictureUrl: data.profilePictureUrl
            }));

            updateUser({
                profilePictureUrl: data.profilePictureUrl
            });

            Alert.alert(
                'Updated',
                'Your profile picture has been changed.'
            );
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Could not update profile picture'
            );
        }
    }

    const hasChanges =
        originalSettings &&
        (
            handle !== originalSettings.handle ||
            displayName !== originalSettings.displayName ||
            description !== originalSettings.description ||
            privateProfile !== originalSettings.privateProfile
        );
    
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>

                {settings?.profilePictureUrl ? (
                    <Image
                        source={{ uri: settings.profilePictureUrl }}
                        style={styles.profilePicture}
                    />
                ) : (
                    <View style={styles.profilePicturePlaceholder}>
                        <Text style={styles.placeholderText}>
                            No picture
                        </Text>
                    </View>
                )}

                <Pressable
                    style={styles.secondaryButton}
                    onPress={handleChangeProfilePicture}
                >
                    <Text style={styles.secondaryButtonText}>
                        Change profile picture
                    </Text>
                </Pressable>

                <Text style={styles.label}>Handle</Text>

                <TextInput
                    value={handle}
                    onChangeText={setHandle}
                    autoCapitalize="none"
                    style={styles.input}
                    placeholder="Your handle"
                />

                <Text style={styles.label}>Display name</Text>

                <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    style={styles.input}
                    placeholder="Your display name"
                />

                <Text style={styles.label}>Description</Text>

                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Tell people a little about yourself"
                    multiline
                    maxLength={100}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.privacyRow}>
                    <View style={styles.privacyText}>
                        <Text style={styles.label}>
                            Private profile
                        </Text>

                        <Text style={styles.helpText}>
                            Other users won&apos;t be able to view your shelf.
                        </Text>
                    </View>

                    <Switch
                        value={privateProfile}
                        onValueChange={setPrivateProfile}
                    />
                </View>
            </View>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <Pressable
                style={[
                    styles.saveButton,
                    !hasChanges && styles.disabledButton
                ]}
                onPress={handleSave}
                disabled={!hasChanges || saving}
            >
                <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : 'Save changes'}
                </Text>
            </Pressable>

            <Pressable
                style={styles.logoutButton}
                onPress={() =>
                    Alert.alert(
                        'Log out',
                        'Are you sure you want to log out?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Log out', style: 'destructive', onPress: logout }
                        ]
                    )
                }
            >
                <Text style={styles.logoutText}>
                    Log out
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 24
    },

    section: {
        marginBottom: 28
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16
    },

    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12
    },

    profilePicturePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },

    placeholderText: {
        color: '#666'
    },

    secondaryButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        marginBottom: 20
    },

    secondaryButtonText: {
        fontWeight: '600'
    },

    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 7
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
        fontSize: 16
    },

    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top'
    },

    privacyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    privacyText: {
        flex: 1,
        paddingRight: 20
    },

    helpText: {
        color: '#666',
        lineHeight: 20
    },

    error: {
        color: '#c62828',
        marginBottom: 16
    },

    saveButton: {
        backgroundColor: '#222',
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
        marginBottom: 12
    },

    disabledButton: {
        opacity: 0.6
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    logoutButton: {
        paddingVertical: 14,
        alignItems: 'center'
    },

    logoutText: {
        color: '#c62828',
        fontSize: 16,
        fontWeight: '600'
    }
});