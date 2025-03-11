import { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert 
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { API_BASE_URL, CLOUDINARY_CONFIG } from '../../constants/AppConfig';
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const CLOUDINARY_UPLOAD_URL = CLOUDINARY_CONFIG.UPLOAD_URL;
const UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET;
const backgroundImage = require('../../assets/calendar-top-bg.png');


// Helper function to get all date strings in a range (inclusive)
function getDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function CalendarScreen({ route, navigation }) {
  const [items, setItems] = useState<Record<string, { 
    name: string; 
    date: string; 
    address?: string; 
    details?: string; 
    photo?: string; 
    startTime?: string; 
    endTime?: string; 
    range?: { start: string; end: string };
  }[]>>({});  // ✅ Initial empty object for proper TypeScript handling
  
  const [markedDates, setMarkedDates] = useState<Record<string, { 
    customStyles: { container: { backgroundColor: string; borderRadius: number }; text: { color: string; fontWeight: string } } 
  }>>({});
  

  // Callback to pre-load a range of dates (even if empty)
  const loadItemsForMonth = (month) => {
    setTimeout(() => {
        setItems((prevItems) => {
            const newItems = { ...prevItems };  // ✅ Keep existing events

            for (let i = -15; i < 85; i++) {
                const time = month.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = new Date(time).toISOString().split('T')[0];

                if (!newItems[strTime]) {
                    newItems[strTime] = [];  // ✅ Add empty list ONLY if date doesn't exist
                }
            }

            // console.log("🔄 Merged items in loadItemsForMonth:", newItems);
            return newItems;
        });
    }, 500);
};

 // ✅ Move fetchEvents to be a standalone function
 const fetchEvents = async () => {
  try {
      const token = await SecureStore.getItemAsync("authToken");
      const response = await fetch(`${API_BASE_URL}/events`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      const data = await response.json();
      // console.log("📥 Received events:", data);

      if (!data || typeof data !== "object" || !Array.isArray(data.events)) {
          console.error("Fetch Events Error: Invalid response structure", data);
          return;
      }

      const newItems = {};
      data.events.forEach((event) => {
          const key = event.range_start ? event.range_start : event.date;
          if (!newItems[key]) {
              newItems[key] = [];
          }
          newItems[key].push({
              id: event.id,
              name: event.title,
              address: event.address,
              details: event.details,
              photo: event.photo,
              startTime: event.start_time,
              endTime: event.end_time,
              range: event.range_start ? { start: event.range_start, end: event.range_end } : null,
              date: event.date
          });
      });

      // console.log("🔹 Updating state with new events:", newItems);
      setItems({ ...newItems }); // ✅ Ensure new object reference for React update

  } catch (error) {
      console.error("Fetch Events Error:", error);
  }
};




// ✅ Fetch events when the calendar screen is focused
useFocusEffect(
  useCallback(() => {
    console.log("🛠 Fetching events on screen focus...");
    fetchEvents();
  }, [])
);



useEffect(() => {
  // console.log("🔍 Updated items state:", JSON.stringify(items, null, 2));
}, [items]); 

useEffect(() => {
  const newMarkedDates = {};

  Object.keys(items).forEach((date) => {
      items[date].forEach((item) => {
          if (item.range) {
              // Get all dates in the range
              const rangeDates = getDatesInRange(item.range.start, item.range.end);
              rangeDates.forEach((rangeDate) => {
                  newMarkedDates[rangeDate] = {
                      customStyles: {
                          container: {
                              backgroundColor: 'pink',
                              borderRadius: 10
                          },
                          text: {
                              color: 'white',
                              fontWeight: 'bold',
                          },
                      },
                  };
              });
          } else {
              // Single-day event
              newMarkedDates[date] = {
                  customStyles: {
                      container: {
                          backgroundColor: 'pink',
                          borderRadius: 10
                      },
                      text: {
                          color: 'white',
                          fontWeight: 'bold',
                      },
                  },
              };
          }
      });
  });

  // console.log("🔹 Updated markedDates:", newMarkedDates);
  setMarkedDates(newMarkedDates);
}, [items]);


  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItemsForMonth}  // Pre-load empty dates
          // selected={'2025-02-25'}
          maxDate={'2050-12-31'}                // Extend future date limit
          pastScrollRange={50}                  // Allow more past days
          futureScrollRange={50}                // Allow more future days
          hideKnob={false}
          showClosingKnob={true}
          markingType={'custom'}
          markedDates={markedDates}
          renderItem={(item) => (
            <TouchableOpacity
              style={[styles.item, item.range ? styles.multiDayItem : null]}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
            >
              {/* ❤️ Favorite Heart Icon */}
              <TouchableOpacity style={styles.heartIcon} onPress={() => console.log("Favorited:", item.name)}>
                <Ionicons name="heart-outline" size={20} color="gray" />
              </TouchableOpacity>

              <Text style={styles.itemText}>{item.name}</Text>
              {item.range ? (
                <>
                  <Text style={styles.itemSubText}>
                    From {item.range.start} to {item.range.end}
                  </Text>
                  {item.address && <Text style={styles.itemSubText}>📍 {item.address}</Text>}
                  {item.details && <Text style={styles.itemSubText}>📝 {item.details}</Text>}
                </>
              ) : (
                <>
                  {item.address ? <Text style={styles.itemSubText}>📍 {item.address}</Text> : null}
                  {item.details ? <Text style={styles.itemSubText}>📝 {item.details}</Text> : null}
                  {item.startTime && (
                    <Text style={styles.itemSubText}>
                      🕒 {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}
                    </Text>
                  )}
                </>
              )}
            </TouchableOpacity>
          )}
          renderEmptyDate={() => (
            <View style={styles.emptyData}>
              <Text></Text>
            </View>
          )}
          theme={{
            agendaDayTextColor: 'black',
            agendaDayNumColor: 'black',
            agendaTodayColor: 'red',
            agendaKnobColor: 'pink',
            knobContainer: {
              paddingVertical: 40,
            }
          }}
        />

        {/* Floating Heart Button */}
        <TouchableOpacity 
          style={styles.floatingHeart} 
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', marginTop: 214, },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 20,
    borderRadius: 15, // ✅ Rounded Corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // ✅ Android Shadow
  },
    // 📅 Multi-Day Event Styling
    multiDayItem: {
      backgroundColor: '#ffe0e0',
      padding: 20,
      borderRadius: 15,
      borderLeftWidth: 5,
      borderLeftColor: '#ff6b81', // ✅ Adds a border indicator for multi-day events
    },
  itemText: { fontSize: 13, fontWeight: 'bold' },
  itemSubText: { fontSize: 12, color: 'gray', fontStyle: 'italic', },
  emptyData: { padding: 10, alignItems: 'center' },
  // ❤️ Heart Icon Styling
  heartIcon: {
    position: 'absolute',
    top: 8, // Adjust for proper spacing
    right: 10, // Position in top-right corner
    zIndex: 2, // Ensure it appears above the event box
  },
  // 🔥 Floating Button with Glow Effect
  floatingHeart: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ff6b81',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background covers the top area
    justifyContent: 'flex-start', // Aligns content properly
  },
    // 🔴 Highlighted Indicator for Today's Date
  todayIndicator: {
    backgroundColor: 'yellow',
    width: 8,
    height: 8,
    borderRadius: 50,
    position: 'absolute',
    top: 5,
    right: 10,
  },
});
