import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';

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
  const [items, setItems] = useState({
    '2025-02-25': [{ name: 'Dinner with partner', date: '2025-02-25' }],
    '2025-02-26': [{ name: 'Anniversary celebration', date: '2025-02-26' }],
    '2025-02-27': [], // Empty array for no events
    '2025-02-28': [
      { name: 'Trip planning', date: '2025-02-28' },
      { name: 'Photo shoot', date: '2025-02-28' }
    ]
  });
  const [markedDates, setMarkedDates] = useState({});

  // Callback to pre-load a range of dates (even if empty)
  const loadItemsForMonth = (month) => {
    setTimeout(() => {
      const newItems = { ...items };
      // Load dates from 15 days before to 85 days after the current month's timestamp.
      for (let i = -15; i < 85; i++) {
        const time = month.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = new Date(time).toISOString().split('T')[0];
        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }
      }
      setItems(newItems);
    }, 500);
  };

  // Load new events passed from AddDateScreen
  useEffect(() => {
    if (route.params?.newEvent) {
      const { date, title, address, details, photo, startTime, endTime, range } = route.params.newEvent;
      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        // If range is defined, store the event on the range start; otherwise, on the main date.
        const key = range ? range.start : date;
        if (!updatedItems[key]) {
          updatedItems[key] = [];
        }
        updatedItems[key].push({
          name: title,
          address,
          details,
          photo,
          startTime,
          endTime,
          range,
          date // main date for single-day events
        });
        return updatedItems;
      });
    }
  }, [route.params?.newEvent]);

  // Recalculate markedDates when items change
  useEffect(() => {
    const updatedMarkedDates = {};

    // First, mark dates that have events
    Object.keys(items).forEach(date => {
      if (items[date] && items[date].length > 0) {
        updatedMarkedDates[date] = {
          customStyles: {
            container: {
              backgroundColor: 'pink',
              borderRadius: 50
            },
            text: {
              color: 'white',
              fontWeight: 'bold'
            }
          }
        };
      }
    });

    // For each multi-day event, mark every date in its range.
    Object.keys(items).forEach(date => {
      items[date].forEach(event => {
        if (event.range) {
          const rangeDates = getDatesInRange(event.range.start, event.range.end);
          rangeDates.forEach(rdate => {
            updatedMarkedDates[rdate] = {
              customStyles: {
                container: {
                  backgroundColor: 'pink',
                  borderRadius: 50
                },
                text: {
                  color: 'white',
                  fontWeight: 'bold'
                }
              }
            };
          });
        }
      });
    });

    setMarkedDates(updatedMarkedDates);
  }, [items]);

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItemsForMonth}  // Pre-load empty dates
        selected={'2025-02-25'}
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
