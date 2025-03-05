import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]); // Placeholder state
  const [sortOrder, setSortOrder] = useState("custom");

  return (
    <View style={styles.container}>
      {/* Left-Side Sorting Buttons */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, styles.customSort, sortOrder === "custom" && styles.activeSort]}
          onPress={() => setSortOrder("custom")}
        >
          <Image source={require("../../assets/custom_button.jpg")} style={styles.sortImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, styles.descendingSort, sortOrder === "descending" && styles.activeSort]}
          onPress={() => setSortOrder("descending")}
        >
          <Image source={require("../../assets/descending_button.jpg")} style={styles.sortImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, styles.ascendingSort, sortOrder === "ascending" && styles.activeSort]}
          onPress={() => setSortOrder("ascending")}
        >
          <Image source={require("../../assets/ascending_button.jpg")} style={styles.sortImage} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorite Events</Text>
        </View>

        {/* Empty State */}
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
    flexDirection: "row", // Enables left-side sorting buttons
    backgroundColor: "white",
  },
  sortContainer: {
    width: 30,
    backgroundColor: "#4B3D60", // Dark purple sidebar
    paddingTop: 10,
    alignItems: "center",
    // borderTopRightRadius: 30, // Curved effect
    // borderBottomRightRadius: 30,
  },
  sortButton: {
    width: 30,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  customSort: {
    backgroundColor: "#fff",
  },
  descendingSort: {
    backgroundColor: "#D98E8E",
  },
  ascendingSort: {
    backgroundColor: "#A6C8E2",
  },
  activeSort: {
    borderWidth: 1,
    borderColor: "#fff",
  },
  sortImage: {
    // transform: [{ rotate: "-90deg" }], // Rotates text vertically
    // textAlign: "center", // Centers text horizontally
    // textAlignVertical: "center", // Ensures text stays in the middle
    width: 20, // Image fits inside button
    // height: 120, // Keeps image proportionate
    resizeMode: "contain", // Ensures image is fully visible
    overflow: "hidden", // Prevents wrapping
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    alignSelf: "center",
    marginTop: 20,
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  eventText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
