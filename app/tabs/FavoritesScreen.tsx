import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]); // Placeholder state

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Sort Placeholder */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Events</Text>
        <TouchableOpacity
          onPress={() => console.log('Sort feature coming soon')}
          style={styles.sortButton}
        >
          <Ionicons name="funnel-outline" size={24} color="gray" />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorite events yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventText}>{item.name}</Text>
                <TouchableOpacity onPress={() => console.log("Removed from favorites", item.name)}>
                  <Ionicons name="heart" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    // Optional additional styling can go here
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'gray',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center',
    marginTop: 20,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  eventText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
