import { View, Text, StyleSheet } from 'react-native';

export default function AddDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Data Screen </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
