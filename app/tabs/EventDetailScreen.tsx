import { useState, useEffect } from "react"; // ✅ Import useEffect
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Platform, Button, 
  TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard 
} from "react-native";import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, CLOUDINARY_CONFIG } from "../../constants/AppConfig";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from '@react-native-community/datetimepicker';

const CLOUDINARY_UPLOAD_URL = CLOUDINARY_CONFIG.UPLOAD_URL;
const UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET;


export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const [title, setTitle] = useState(event.name);
  const [details, setDetails] = useState(event.details);
  const [address, setAddress] = useState(event.address);
  const [photo, setPhoto] = useState(event.photo);
  const [editing, setEditing] = useState(false); // ✅ Toggle Edit Mode

  // ✅ Add Date State
  const [date, setDate] = useState(() => {
    const [year, month, day] = event.date.split('-').map(Number);
    return new Date(year, month - 1, day); // creates date in local time
  });
  const [showDatePicker, setShowDatePicker] = useState(false);


  // ✅ Fix: Add missing states
  const [startTime, setStartTime] = useState(new Date(event.startTime || Date.now()));
  const [endTime, setEndTime] = useState(event.endTime ? new Date(event.endTime) : null);
  const [rangeEnabled, setRangeEnabled] = useState(!!event.range);
  const [rangeEnd, setRangeEnd] = useState(event.range ? new Date(event.range.end) : null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRangeEndPicker, setShowRangeEndPicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker ] = useState(false);

  // ✅ Toggle Pickers
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleStartTimePicker = () => setShowStartTimePicker(!showStartTimePicker);
  const toggleEndTimePicker = () => setShowEndTimePicker(!showEndTimePicker);
  const toggleRangeEndPicker = () => setShowRangeEndPicker(!showRangeEndPicker);

  // ✅ Handle Date Change
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS !== "ios") setShowDatePicker(false);
  };

  const onStartTimeChange = (event, selectedTime) => {
    if (selectedTime) setStartTime(selectedTime);
    if (Platform.OS !== "ios") setShowStartTimePicker(false);
  };

  const onEndTimeChange = (event, selectedTime) => {
    if (selectedTime) setEndTime(selectedTime);
    if (Platform.OS !== "ios") setShowEndTimePicker(false);
  };

  const onRangeEndChange = (event, selectedDate) => {
    if (selectedDate) setRangeEnd(selectedDate);
    if (Platform.OS !== "ios") setShowRangeEndPicker(false);
  };

  const handleUpdateEvent = async () => {
    try {
        const token = await SecureStore.getItemAsync("authToken");
        if (!token) {
            Alert.alert("Session Expired", "Please log in again.");
            navigation.replace("Login");
            return;
        }

        let range = null;
        if (rangeEnabled && rangeEnd) {
            const mainDateStr = date.toISOString().split("T")[0];
            const rangeEndStr = rangeEnd.toISOString().split("T")[0];
            const sortedDates = [mainDateStr, rangeEndStr].sort();
            range = { start: sortedDates[0], end: sortedDates[1] };
        }

        const updatedEvent = {
            date: date.toISOString().split("T")[0], // ✅ Matches AddDateScreen format
            title,
            address,
            details,
            photo,
            startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            endTime: endTime ? endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
            range_start: rangeEnabled && rangeEnd ? range.start : null,
            range_end: rangeEnabled && rangeEnd ? range.end : null,
        };

        const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEvent),
        });

        if (response.ok) {
            Alert.alert("Success!", "Event updated successfully.");
            setEditing(false);
            navigation.navigate("Calendar", { refresh: true });
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
      // Reload event details when exiting edit mode
      navigation.setParams({
        event: { 
          ...event, 
          name: title, 
          details, 
          address, 
          photo,
          date: date.toISOString().split("T")[0]  // update the date too
        }
      });
    }
  }, [editing]);
  
  


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.editTitle}>Edit Event</Text>
          {/* Main content container */}
          <View>
            {/* ✅ Cute Edit Icon in Top Right Corner */}
            {!editing && (
              <TouchableOpacity style={styles.editIcon} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={22} color="white" />
              </TouchableOpacity>
            )}
            {editing ? (
              <>
                {/* 📅 Date Picker */}
                <TouchableOpacity onPress={toggleDatePicker} style={styles.dateInput}>
                  <Text style={styles.dateText}>📅 {date.toDateString()}</Text>
                  <Ionicons name={showDatePicker ? "chevron-up" : "chevron-down"} size={20} color="gray" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                    onChange={onDateChange}
                  />
                )}
  
                {/* Day Range Selection */}
                {!rangeEnabled ? (
                  <Button title="Select Day Range (Optional)" onPress={() => setRangeEnabled(true)} />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (!date) {
                          Alert.alert("Select a start date first!");
                          return;
                        }
                        setShowRangeEndPicker(true);
                      }}
                      style={styles.dateInput}
                    >
                      <Text style={styles.dateText}>
                        📅 Range End: {rangeEnd ? rangeEnd.toDateString() : "Select Range End Date"}
                      </Text>
                      <Ionicons name={showRangeEndPicker ? "chevron-up" : "chevron-down"} size={20} color="gray" />
                    </TouchableOpacity>
                    {showRangeEndPicker && (
                      <DateTimePicker
                        value={rangeEnd || date}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "spinner"}
                        minimumDate={date}
                        onChange={(event, selectedDate) => {
                          setShowRangeEndPicker(false);
                          if (selectedDate) setRangeEnd(selectedDate);
                        }}
                      />
                    )}
                    {rangeEnd && (
                      <TouchableOpacity onPress={() => { setRangeEnabled(false); setRangeEnd(null); }}>
                        <Text style={styles.removeText}>Remove Range</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
  
                {/* 🕒 Start Time Picker */}
                <TouchableOpacity onPress={toggleStartTimePicker} style={styles.dateInput}>
                  <Text style={styles.dateText}>
                    🕒 Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    onChange={onStartTimeChange}
                  />
                )}
  
                {/* 🕛 End Time Picker */}
                <TouchableOpacity onPress={toggleEndTimePicker} style={styles.dateInput}>
                  <Text style={styles.dateText}>
                    🕛 End Time: {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not Set"}
                  </Text>
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime || new Date()}
                    mode="time"
                    display="spinner"
                    onChange={onEndTimeChange}
                  />
                )}
  
                {/* Editable Fields */}
                <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
                <TextInput style={styles.input} placeholder="Details (Optional)" value={details} onChangeText={setDetails} multiline />
                <TextInput style={styles.input} placeholder="Address (Optional)" value={address} onChangeText={setAddress} />
                <TextInput style={styles.input} placeholder="Photo URL (Optional)" value={photo} onChangeText={setPhoto} />
  
                <TouchableOpacity style={styles.button} onPress={handleUpdateEvent}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
  
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Event Details */}
                <Text style={styles.title}>
                  {event.icon ? event.icon : ""} {event.name}
                </Text>
                {event.range ? (
                  <Text style={styles.detailText}>📅 {event.range.start} - {event.range.end}</Text>
                ) : (
                  <Text style={styles.detailText}>📅 {event.date}</Text>
                )}
                {photo && <Image source={{ uri: photo }} style={styles.image} />}
                {event.address && <Text style={styles.detailText}>📍 {event.address}</Text>}
                {event.details && <Text style={styles.detailText}>📝 {event.details}</Text>}
                {event.startTime && (
                  <Text style={styles.detailText}>
                    🕒 {event.startTime} {event.endTime ? `- ${event.endTime}` : ""}
                  </Text>
                )}
  
                {/* Edit & Delete Buttons */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
                  <Text style={styles.deleteText}>Delete Event</Text>
                </TouchableOpacity>
              </>
            )}
  
            {/* Back Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  scrollView: { padding: 10, flexGrow: 1 },
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
  
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10,
    marginTop: 20,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  
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
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  dateText: { fontSize: 16 },
  removeText: { color: "red", textAlign: "center", marginTop: 5 },
});

