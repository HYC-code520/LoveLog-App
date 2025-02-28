import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {event.icon ? event.icon : ''} {event.name}
      </Text>
      {/* Display date or date range */}
      {event.range ? (
        <Text style={styles.detailText}>📅 {event.range.start} - {event.range.end}</Text>
      ) : (
        <Text style={styles.detailText}>📅 {event.date}</Text>
      )}
      {event.photo ? <Image source={{ uri: event.photo }} style={styles.image} /> : null}
      {event.address && <Text style={styles.detailText}>📍 {event.address}</Text>}
      {event.details && <Text style={styles.detailText}>📝 {event.details}</Text>}
      {event.startTime && (
        <Text style={styles.detailText}>
          🕒 {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
        </Text>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  detailText: { fontSize: 16, marginBottom: 5 },
  button: { backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 20 },
  buttonText: { color: 'white', textAlign: 'center' },
});
