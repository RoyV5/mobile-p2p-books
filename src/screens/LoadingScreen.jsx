import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

/*
 * error / onDismiss let RootNavigator show a session-hydration
 * failure (e.g. server unreachable) right here instead of it
 * being silently swallowed or, worse, surfacing as a LogBox
 * overlay from a console.error. Plain spinner when there's
 * nothing to report.
 */
export default function LoadingScreen({ error, onDismiss }) {
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorTitle}>
                    Couldn&apos;t sign you in automatically
                </Text>

                <Text style={styles.errorText}>
                    {error}
                </Text>

                <Pressable
                    style={styles.button}
                    onPress={onDismiss}
                >
                    <Text style={styles.buttonText}>
                        Continue
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },

    errorTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center'
    },

    errorText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20
    },

    button: {
        backgroundColor: '#222',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 28
    },

    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600'
    }
});