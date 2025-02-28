import { View, StyleSheet, Text, Platform } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <Text style={styles.text}>🗺️ Maps are disabled for the web version.</Text>
      ) : (
        <Text style={styles.text}>📍 The map is available on mobile devices.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 20 },
});
