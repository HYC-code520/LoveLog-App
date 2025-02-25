import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';

export default function CalendarScreen({ route }) {
  const [items, setItems] = useState({
    '2025-02-25': [{ name: 'Dinner with partner' }],
    '2025-02-26': [{ name: 'Anniversary celebration' }],
    '2025-02-27': [], // ✅ Empty array for no events
    '2025-02-28': [{ name: 'Trip planning' }, { name: 'Photo shoot' }]
  });

  const [markedDates, setMarkedDates] = useState({}); // ✅ State for marked dates

  // ✅ Load new events if passed from AddDateScreen
  useEffect(() => {
    if (route.params?.newEvent) {
      const { date, title, address, details, photo, startTime, endTime } = route.params.newEvent;

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };

        if (!updatedItems[date]) {
          updatedItems[date] = [];
        }

        updatedItems[date].push({
          name: title,
          address,
          details,
          photo,
          startTime,
          endTime
        });

        return updatedItems;
      });
    }
  }, [route.params?.newEvent]);

  // ✅ Recalculate markedDates every time items change
  useEffect(() => {
    const updatedMarkedDates = Object.keys(items).reduce((acc, date) => {
      if (items[date] && items[date].length > 0) {
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: 'pink', // 🎀 Pink filled circle
              borderRadius: 50
            },
            text: {
              color: 'white', // 🔹 White text for contrast
              fontWeight: 'bold'
            }
          }
        };
      }
      return acc;
    }, {});

    setMarkedDates(updatedMarkedDates);
  }, [items]);

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        selected={'2025-02-25'}
        maxDate={'2025-12-31'}
        pastScrollRange={120}
        futureScrollRange={6}
        hideKnob={false}
        showClosingKnob={true}
        markingType={'custom'}
        markedDates={markedDates} // ✅ Dynamically updated
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            {item.address ? <Text style={styles.itemSubText}>📍 {item.address}</Text> : null}
            {item.details ? <Text style={styles.itemSubText}>📝 {item.details}</Text> : null}
            {item.startTime && (
              <Text style={styles.itemSubText}>🕒 {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}</Text>
            )}
          </View>
        )}
        renderEmptyDate={() => <View style={styles.emptyData} />}
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
  itemText: { fontSize: 16, fontWeight: 'bold' },
  itemSubText: { fontSize: 14, color: 'gray' },
  emptyData: { padding: 15, alignItems: 'center' }
});
