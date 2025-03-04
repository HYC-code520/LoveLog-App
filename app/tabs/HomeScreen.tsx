import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
// import DateSuggestion from "../../components/DateSuggestion";
import { ScrollView } from "react-native"; // Ensure ScrollView is imported
import { API_BASE_URL, CLOUDINARY_CONFIG } from '../../constants/AppConfig';
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);  // 🔹 Store only the logged-in user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.replace('Login');  // Redirect to login if no token
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user`, {  // 🔹 Use /api/user (singular)
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // 🔥 Send JWT token
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "69420",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);  // ✅ Store only the logged-in user's data
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch user details');
          navigation.replace('Login'); // 🔄 Redirect to login on error
        }
      } catch (error) {
        console.error('Fetch User Error:', error);
        Alert.alert('Error', 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authToken'); // ❌ Clear stored token
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.replace('Login');  // 🔄 Redirect to login
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff66b2" />
        <Text>Loading your LoveLog...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to LoveLog! ❤️</Text>
        
        {/* 🔹 Show only the logged-in user */}
        {user ? (
          <>
            <Text style={styles.subtitle}>Hello, {user.email}!</Text>
            <Text style={styles.subtitle}>Track your special moments together.</Text>
            
          </>
        ) : (
          <Text style={styles.subtitle}>Failed to load user data.</Text>
        )}
        {/* 📌 AI Date Suggestion Component
        <DateSuggestion />       */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: 'gray',
    textAlign: "center",
  },
});