import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity 
} from 'react-native';
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from '../../constants/AppConfig';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.replace('Login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "69420",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch user details');
          navigation.replace('Login');
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
    await SecureStore.deleteItemAsync('authToken');
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A3D9A5" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Partner Placeholder Section */}
      <View style={styles.partnerContainer}>
        {/* User Profile Circle */}
        <View style={styles.profileWrapper}>
          <View style={styles.profileCircle}>
            <MaterialIcons name="favorite" size={30} color="#fff" />
          </View>
          <Text style={styles.userName}>Ariel</Text>
        </View>

        {/* "&" Symbol */}
        <Text style={styles.andSymbol}>&</Text>

        {/* Add Partner Placeholder */}
        <TouchableOpacity style={styles.profileWrapper}>
          <View style={styles.profileCircle}>
            <MaterialIcons name="favorite" size={30} color="#fff" />
            <View style={styles.addIcon}>
              <Ionicons name="add" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.userName}>Add partner</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={24} color="#8E8E8E" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.userEmail}>{user?.email || "No email available"}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="birthday-cake" size={20} color="#8E8E8E" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Enter your birthday</Text>
            <Text style={styles.userEmail}>Set your birthday</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="user-secret" size={22} color="#8E8E8E" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Change your password</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

    padding: 30,
  },
  partnerContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80,
  },
  profileWrapper: {
    alignItems: 'center', // Ensure name is below the icon
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'pink', 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  userName: {
    color: '#B3A6C9',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginHorizontal: 8,
  },
  andSymbol: {
    fontSize: 20,
    color: '#8C89A4',
    marginHorizontal: 10,
  },
  addIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'grey',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    width: '90%',  // Ensure it doesn't touch screen edges
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 5,
  },
  iconContainer: {
    width: 30,  // Ensures icons are aligned properly
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,  // Makes text align properly
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
  },
  copyText: {
    color: '#7586F1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  birthdayPlaceholder: {
    fontSize: 12,
    color: '#DDD',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF5757',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
