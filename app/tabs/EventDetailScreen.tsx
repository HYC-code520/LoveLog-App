import { useState, useEffect } from "react"; // ✅ Import useEffect
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../constants/AppConfig";
import * as SecureStore from "expo-secure-store";

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const [title, setTitle] = useState(event.name);
  const [details, setDetails] = useState(event.details);
  const [address, setAddress] = useState(event.address);
  const [photo, setPhoto] = useState(event.photo);
  const [editing, setEditing] = useState(false); // ✅ Toggle Edit Mode

  /** ✅ Update Event (PUT Request) */
  const handleUpdateEvent = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.replace("Login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          details,
          address,
          photo,
          date: event.date,
          start_time: event.startTime,
          end_time: event.endTime || null,
          range_start: event.range?.start || null,
          range_end: event.range?.end || null,
        }),
      });

      if (response.ok) {
        Alert.alert("Success!", "Event updated successfully.");

         // ✅ Update event state immediately
        navigation.setParams({
          event: { 
            ...event, 
            name: title, 
            details, 
            address, 
            photo 
          }
        });

        setEditing(false);

        navigation.navigate("Calendar", { refresh: true }); // ✅ Refresh calendar
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "Failed to update event.");
      }
    } catch (error) {
      console.error("Update Event Error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  /** ✅ Delete Event */
  const handleDeleteEvent = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
              Alert.alert("Session Expired", "Please log in again.");
              navigation.replace("Login");
              return;
            }

            const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
              Alert.alert("Deleted", "Event has been removed.");
              setEditing(false);  // ✅ Exit edit mode after saving
              
              // ✅ Extract the deleted event's month and year
              const deletedEventDate = new Date(event.date);
              const monthYearKey = `${deletedEventDate.getFullYear()}-${(deletedEventDate.getMonth() + 1).toString().padStart(2, "0")}`;

              navigation.popToTop();
              navigation.navigate("Calendar", { refresh: true }); // ✅ Refresh calendar
            } else {
              const data = await response.json();
              Alert.alert("Error", "Failed to delete event.");
            }
          } catch (error) {
            console.error("Delete Event Error:", error);
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (!editing) {
      // ✅ Reload event details when exiting edit mode
      navigation.setParams({
        event: { 
          ...event, 
          name: title, 
          details, 
          address, 
          photo 
        }
      });
    }
  }, [editing]);
  

  return (
    <View style={styles.container}>
      {/* ✅ Cute Edit Icon in Top Right Corner */}
      {!editing && (
      <TouchableOpacity style={styles.editIcon} onPress={() => setEditing(true)}>
        <Ionicons name="create-outline" size={22} color="white" />
      </TouchableOpacity>
      )}
      {editing ? (
        <>
          {/* 🔹 Editable Fields */}
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} value={details} onChangeText={setDetails} multiline />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} value={photo} onChangeText={setPhoto} placeholder="Photo URL" />

          <TouchableOpacity style={styles.button} onPress={handleUpdateEvent}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* 🔹 Event Details */}
          <Text style={styles.title}>
            {event.icon ? event.icon : ""} {event.name}
          </Text>
          {event.range ? (
            <Text style={styles.detailText}>📅 {event.range.start} - {event.range.end}</Text>
          ) : (
            <Text style={styles.detailText}>📅 {event.date}</Text>
          )}
          {photo ? <Image source={{ uri: photo }} style={styles.image} /> : null}
          {event.address && <Text style={styles.detailText}>📍 {event.address}</Text>}
          {event.details && <Text style={styles.detailText}>📝 {event.details}</Text>}
          {event.startTime && (
            <Text style={styles.detailText}>
              🕒 {event.startTime} {event.endTime ? `- ${event.endTime}` : ""}
            </Text>
          )}

          {/* 🔹 Edit & Delete Buttons */}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
            <Text style={styles.deleteText}>Delete Event</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🔹 Back Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  /** ✅ Cute Floating Edit Icon */
  editIcon: {
    position: "absolute",
    top: 20,
    right: 15,
    backgroundColor: "#ff66b2", // Cute pink
    padding: 10, // Reduced padding to avoid excess space around icon
    borderRadius: 50, // Circular shape
    width: 50,  // ✅ Ensures a bigger tap area
    height: 50, // ✅ Makes it easier to tap
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // ✅ Android shadow
    shadowColor: "#000", // ✅ iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10, // ✅ Ensures it's above all other elements
  },
  
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  detailText: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: "gray", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center" },
  editButton: { backgroundColor: "#ffcc00", padding: 10, borderRadius: 5, marginTop: 10 },
  editText: { textAlign: "center", color: "#333" },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
  deleteText: { textAlign: "center", color: "white" },
  cancelButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 10 },
  cancelButtonText: { textAlign: "center", color: "black" },
});

