import { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert, Image 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const eventIcons = [
  { id: 'blackandwhitecats', source: require('../../assets/blackandwhitecats_pixel.png') },
  { id: 'cat', source: require('../../assets/cat_pixel2.png') },
  { id: 'pizza', source: require('../../assets/pizza_pixel.png') },
  { id: 'tree', source: require('../../assets/tree_pixel2.png') },
  { id: 'moon', source: require('../../assets/moon_pixel.png') },
  { id: 'cake', source: require('../../assets/cake_pixel.png') }
];

export default function AddDateScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEndTimeButton, setShowEndTimeButton] = useState(true);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null); // ✅ Store selected icon

  // 📅 Toggle Date Picker
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  // ⏰ Toggle Time Pickers
  const toggleStartTimePicker = () => setShowStartTimePicker(!showStartTimePicker);
  const toggleEndTimePicker = () => setShowEndTimePicker(!showEndTimePicker);

  // 📅 Handle Date Change
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS !== 'ios') setShowDatePicker(false);
  };

  // ⏰ Handle Start Time Change
  const onStartTimeChange = (event, selectedTime) => {
    if (selectedTime) setStartTime(selectedTime);
    if (Platform.OS !== 'ios') setShowStartTimePicker(false);
  };

  // ⏰ Handle End Time Change
  const onEndTimeChange = (event, selectedTime) => {
    if (selectedTime) setEndTime(selectedTime);
    if (Platform.OS !== 'ios') setShowEndTimePicker(false);
  };

  // ✨ Enable End Time Input
  const enableEndTime = () => {
    setShowEndTimeButton(false);
    setEndTime(new Date());
  };

  // ❌ Remove End Time
  const removeEndTime = () => {
    setEndTime(null);
    setShowEndTimeButton(true);
  };

  // 📌 Save Event
  const handleAddEvent = () => {
    if (!title.trim()) return;

    const newEventObj = {
      date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
      title,
      address,
      details,
      photo,
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      icon: selectedIcon // ✅ Save selected icon in event data
    };

    // ✅ Pass event back to CalendarScreen
    navigation.navigate('Calendar', { newEvent: newEventObj });

    // ✅ Show Success Message (Alert)
    Alert.alert(
      "Success!",
      "Your event has been added successfully 🎉",
      [{ text: "OK", onPress: () => console.log("Event added!") }]
    );

    // ✅ Reset form fields after event is added
    setTitle('');
    setAddress('');
    setDetails('');
    setPhoto('');
    setStartTime(new Date());
    setEndTime(null);
    setShowEndTimeButton(true);
    setSelectedIcon(null); // ✅ Reset selected icon
    Keyboard.dismiss(); // ✅ Close keyboard after adding event
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Add Event</Text>

          {/* 🗓️ Date Input with Toggle Arrow */}
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

          {/* ⏰ Start Time Input with Toggle Arrow */}
          <TouchableOpacity onPress={toggleStartTimePicker} style={styles.dateInput}>
            <Text style={styles.dateText}>🕒 Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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

          {/* ✅ Button to Enable End Time */}
          {showEndTimeButton && <Button title="Set End Time (Optional)" onPress={enableEndTime} />}

          {/* ⏰ End Time Input with Toggle Arrow (Only if enabled) */}
          {endTime !== null && (
            <>
              <TouchableOpacity onPress={toggleEndTimePicker} style={styles.dateInput}>
                <Text style={styles.dateText}>🕛 End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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

              {/* ❌ Remove End Time Option */}
              <TouchableOpacity onPress={removeEndTime}>
                <Text style={styles.removeText}>Remove End Time</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 📝 Other Inputs */}
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Details (Optional)" value={details} onChangeText={setDetails} multiline />
          <TextInput style={styles.input} placeholder="Address (Optional)" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Photo URL (Optional)" value={photo} onChangeText={setPhoto} />

          {/* 🎨 Icon Selection Section */}
          <Text style={styles.iconLabel}>Select an Icon:</Text>
          <View style={styles.iconContainer}>
            {eventIcons.map((icon) => (
              <TouchableOpacity key={icon.id} onPress={() => setSelectedIcon(icon.id)} style={selectedIcon === icon.id ? styles.selectedIcon : styles.icon}>
                <Image source={icon.source} style={styles.iconImage} />
              </TouchableOpacity>
            ))}
          </View>

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
  removeText: { color: 'red', textAlign: 'center', marginTop: 5 },
  iconLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  iconContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  icon: { margin: 5, padding: 5, borderRadius: 10 },
  selectedIcon: { margin: 5, padding: 5, borderRadius: 10, borderWidth: 2, borderColor: 'blue' },
  iconImage: { width: 50, height: 50 }
});
