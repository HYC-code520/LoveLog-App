import { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '../../constants/AppConfig';
import * as SecureStore from "expo-secure-store";

export default function AddDateScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEndTimeButton, setShowEndTimeButton] = useState(true);

  // Day Range State – only one extra date is allowed.
  const [rangeEnabled, setRangeEnabled] = useState(false);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [tempRangeEnd, setTempRangeEnd] = useState(new Date());
  const [showRangeEndPicker, setShowRangeEndPicker] = useState(false);
  const [rangeEndPickerVisible, setRangeEndPickerVisible] = useState(false);


  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');

  // Toggle Date Picker
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  // Toggle Time Pickers
  const toggleStartTimePicker = () => setShowStartTimePicker(!showStartTimePicker);
  const toggleEndTimePicker = () => setShowEndTimePicker(!showEndTimePicker);
  // Toggle Range End Picker
  const toggleRangeEndPicker = () => setShowRangeEndPicker(!showRangeEndPicker);

  // Handle Date Change
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS !== 'ios') setShowDatePicker(false);
  };

  // Handle Start Time Change
  const onStartTimeChange = (event, selectedTime) => {
    if (selectedTime) setStartTime(selectedTime);
    if (Platform.OS !== 'ios') setShowStartTimePicker(false);
  };

  // Handle End Time Change
  const onEndTimeChange = (event, selectedTime) => {
    if (selectedTime) setEndTime(selectedTime);
    if (Platform.OS !== 'ios') setShowEndTimePicker(false);
  };

  // Handle Range End Change
  const onRangeEndChange = (event, selectedDate) => {
    if (selectedDate) setTempRangeEnd(selectedDate);
    if (Platform.OS !== 'ios') setShowRangeEndPicker(false);
  };

  // Enable End Time Input
  const enableEndTime = () => {
    setShowEndTimeButton(false);
    setEndTime(new Date());
  };

  // Remove End Time
  const removeEndTime = () => {
    setEndTime(null);
    setShowEndTimeButton(true);
  };

  // Set the single range end date (with check)
  const setSingleRangeEnd = (day) => {
    const newDateStr = day.toISOString().split('T')[0];
    const mainDateStr = date.toISOString().split('T')[0];
    if (newDateStr === mainDateStr) {
      Alert.alert("Invalid Selection", "You cannot select the main date as the range end date.");
      return;
    }
    setRangeEnd(day);
  };

  // Remove the day range
  const removeRange = () => {
    setRangeEnabled(false);
    setRangeEnd(null);
  };

  // Save Event
  const handleAddEvent = async () => {
    if (!title.trim()) return;

    let range = null;
    if (rangeEnabled && rangeEnd) {
        const mainDateStr = date.toISOString().split('T')[0];
        const rangeEndStr = rangeEnd.toISOString().split('T')[0];
        const sortedDates = [mainDateStr, rangeEndStr].sort();
        range = { start: sortedDates[0], end: sortedDates[1] };
    }

    const newEventObj = {
        date: date.toISOString().split('T')[0],
        title,
        address,
        details,
        photo,
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        range_start: rangeEnabled && rangeEnd ? range.start : null,
        range_end: rangeEnabled && rangeEnd ? range.end : null
    };

    try {
        const token = await SecureStore.getItemAsync('authToken');
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEventObj)
        });

        const data = await response.json();
        if (response.ok) {
            Alert.alert("Success!", "Your event has been saved to the database 🎉");

            // ✅ Fetch events immediately after saving to update UI
            navigation.navigate('Calendar', { screen: 'CalendarMain', params: { refresh: true } });

            
            // ✅ Ensure new event is fetched & displayed immediately
            navigation.navigate('Calendar', { screen: 'CalendarMain', params: { refresh: true } });
        } else {
            Alert.alert("Error", data.error || "Failed to save event.");
        }
    } catch (error) {
        console.error("Add Event Error:", error);
        Alert.alert("Error", "Something went wrong.");
    }
};



return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Add Event</Text>

        {/* 📅 Main Date Selection */}
        <TouchableOpacity onPress={toggleDatePicker} style={styles.dateInput}>
          <Text style={styles.dateText}>📅 {date.toDateString()}</Text>
          <Ionicons name={showDatePicker ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
            onChange={onDateChange}
          />
        )}

        {/* 🔄 Day Range Selection */}
        {!rangeEnabled && (
          <Button title="Select Day Range (Optional)" onPress={() => setRangeEnabled(true)} />
        )}
        {rangeEnabled && (
          <>
            {/* 📅 Range End Date Picker */}
            <TouchableOpacity onPress={() => {
              if (!date) {
                Alert.alert("Select a start date first!");
                return;
              }
              setRangeEndPickerVisible(true);
            }} style={styles.dateInput}>
              <Text style={styles.dateText}>📅 Select Range End Date</Text>
              <Ionicons name={rangeEndPickerVisible ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
            </TouchableOpacity>

            {rangeEndPickerVisible && (
              <DateTimePicker
                value={rangeEnd || date}  // ✅ Opens in the selected month's view
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                minimumDate={date}  // ✅ Prevents selecting a date before the start
                onChange={(event, selectedDate) => {
                  setRangeEndPickerVisible(false);
                  if (selectedDate) setRangeEnd(selectedDate);
                }}
              />
            )}

            {rangeEnd && (
              <View style={styles.dateInput}>
                <Text style={styles.dateText}>📅 {rangeEnd.toDateString()}</Text>
                <TouchableOpacity onPress={removeRange}>
                  <Text style={styles.removeText}>Remove Range</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* 🕒 Start Time Selection */}
        <TouchableOpacity onPress={toggleStartTimePicker} style={styles.dateInput}>
          <Text style={styles.dateText}>
            🕒 Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Ionicons name={showStartTimePicker ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={onStartTimeChange}
          />
        )}

        {/* 🕛 End Time Selection */}
        {showEndTimeButton && <Button title="Set End Time (Optional)" onPress={enableEndTime} />}
        {endTime !== null && (
          <>
            <TouchableOpacity onPress={toggleEndTimePicker} style={styles.dateInput}>
              <Text style={styles.dateText}>
                🕛 End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Ionicons name={showEndTimePicker ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                onChange={onEndTimeChange}
              />
            )}
            <TouchableOpacity onPress={removeEndTime}>
              <Text style={styles.removeText}>Remove End Time</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 📋 Other Inputs */}
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Details (Optional)" value={details} onChangeText={setDetails} multiline />
        <TextInput style={styles.input} placeholder="Address (Optional)" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Photo URL (Optional)" value={photo} onChangeText={setPhoto} />

        {/* ✅ Add Event Button */}
        <Button title="Add Event" onPress={handleAddEvent} />
      </ScrollView>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollView: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  dateInput: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#ddd', 
    marginBottom: 10, 
    backgroundColor: '#fff', 
    width: '100%' 
  },
  dateText: { fontSize: 16 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  removeText: { color: 'red', textAlign: 'center', marginTop: 5 }
});
