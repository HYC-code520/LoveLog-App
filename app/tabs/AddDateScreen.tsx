import { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

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
  const handleAddEvent = () => {
    if (!title.trim()) return;

    // Compute range if enabled and rangeEnd is set.
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
      // For compatibility, we still pass an empty array for multipleDays when no range is enabled.
      multipleDays: [],
      range
    };

    // Navigate to the Calendar tab's CalendarMain screen (nested in CalendarStack)
    navigation.navigate('Calendar', { 
      screen: 'CalendarMain', 
      params: { newEvent: newEventObj }
    });

    Alert.alert(
      "Success!",
      "Your event has been added successfully 🎉",
      [{ text: "OK", onPress: () => console.log("Event added!") }]
    );

    // Reset form fields
    setTitle('');
    setAddress('');
    setDetails('');
    setPhoto('');
    setStartTime(new Date());
    setEndTime(null);
    setShowEndTimeButton(true);
    setRangeEnabled(false);
    setRangeEnd(null);
    
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Add Event</Text>

          {/* Main Date Input */}
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

          {/* Day Range Selection */}
          {!rangeEnabled && (
            <Button title="Select Day Range (Optional)" onPress={() => setRangeEnabled(true)} />
          )}
          {rangeEnabled && (
            <>
              <TouchableOpacity onPress={toggleRangeEndPicker} style={styles.dateInput}>
                <Text style={styles.dateText}>📅 Select Range End Date</Text>
                <Ionicons name={showRangeEndPicker ? 'chevron-up' : 'chevron-down'} size={20} color="gray" />
              </TouchableOpacity>
              {showRangeEndPicker && (
                <DateTimePicker
                  value={tempRangeEnd}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                  onChange={onRangeEndChange}
                />
              )}
              <Button title="Set Range End Date" onPress={() => setSingleRangeEnd(tempRangeEnd)} />
              {rangeEnd && (
                <View style={styles.dateInput}>
                  <Text style={styles.dateText}>{rangeEnd.toDateString()}</Text>
                  <TouchableOpacity onPress={removeRange}>
                    <Text style={styles.removeText}>Remove Range</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* Start Time Input */}
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

          {/* End Time Input */}
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

          {/* Other Inputs */}
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Details (Optional)" value={details} onChangeText={setDetails} multiline />
          <TextInput style={styles.input} placeholder="Address (Optional)" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Photo URL (Optional)" value={photo} onChangeText={setPhoto} />

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
