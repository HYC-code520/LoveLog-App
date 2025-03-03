import { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert 
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import API_BASE_URL from '../../constants/AppConfig';
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

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
          agendaKnobColor: 'pink'
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  item: { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 5 },
  multiDayItem: { backgroundColor: '#ffe0e0', padding: 20, borderRadius: 10 },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSubText: { fontSize: 14, color: 'gray' },
  emptyData: { padding: 15, alignItems: 'center' }
});
