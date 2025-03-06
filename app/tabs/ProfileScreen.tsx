import { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity, Modal, TextInput
} from 'react-native';
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from '../../constants/AppConfig';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { ImageBackground } from 'react-native';

const backgroundImage = require("../../assets/Profile-bg.png");

// ✅ Manually map avatar images
const avatars = {
  av1: require("../../assets/av1.png"),
  av2: require("../../assets/av2.png"),
  av3: require("../../assets/av3.png"),
  av4: require("../../assets/av4.png"),
  av5: require("../../assets/av5.png"),
  av6: require("../../assets/av6.png"),
  av7: require("../../assets/av7.png"),
  av8: require("../../assets/av8.png"),
  av9: require("../../assets/av9.png"),
  av10: require("../../assets/av10.png"),
  av11: require("../../assets/av11.png"),
  av12: require("../../assets/av12.png"),
};

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [displayName, setDisplayName] = useState("Me");

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

// Function to select an avatar (but NOT close modal)
const handleAvatarSelect = (avatarKey: string) => {
  setSelectedAvatar(avatarKey); // ✅ Stores the selected avatar
};

// Function to confirm selection & close modal
const handleDone = () => {
  if (!selectedAvatar) {
    Alert.alert("Please select an avatar before confirming.");
    return;
  }
  setModalVisible(false); // ✅ Closes the modal only when user confirms
};

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
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Partner Placeholder Section */}
          <View style={styles.partnerContainer}>
            {/* User Profile Circle */}
            <TouchableOpacity 
              style={styles.profileWrapper} 
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.profileCircle}>
              {selectedAvatar ? (
                  <Image
                    source={avatars[selectedAvatar]}
                    style={styles.avatarImage}
                  />
                ) : (
              
                <MaterialIcons name="favorite" size={30} color="#fff" />
              )}
                </View>
              <TextInput
                style={styles.userName}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </TouchableOpacity>

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
                <Text style={styles.userName}>Add person</Text>
              </TouchableOpacity>
            </View>
            {/* Avatar Selection Modal */}
          <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose Your Avatar</Text>
                <View style={styles.avatarGrid}>
                  {Object.keys(avatars).map((avatarKey) => (
                    <TouchableOpacity
                      key={avatarKey}
                      style={[
                        styles.avatarPlaceholder,
                        selectedAvatar === avatarKey && styles.selectedAvatar,
                      ]}
                      onPress={() => handleAvatarSelect(avatarKey)}
                    >
                      <Image
                        source={avatars[avatarKey]}
                        style={styles.avatarImageSmall}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 🔹 Account Section Title */}
          <Text style={styles.sectionTitle}>Account</Text>

          {/* Profile Info */}
          <View style={styles.infoBox}>
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

          {/* 🔹 More Section Title */}
          <Text style={styles.sectionTitle}>More</Text>

          {/* 🔹 Additional Settings (Fixed Placement) */}
          <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingsBox}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="color-palette-outline" size={22} color="#8E8E8E" />
                  </View>
                  <Text style={styles.settingsText}>Theme</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsBox}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="images-outline" size={22} color="#8E8E8E" />
                  </View>
                  <Text style={styles.settingsText}>Photo Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsBox}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="person-add-outline" size={22} color="#8E8E8E" />
                  </View>
                  <Text style={styles.settingsText}>Invite a friend</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsBox}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="mail-outline" size={22} color="#8E8E8E" />
                  </View>
                  <Text style={styles.settingsText}>Contact us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsBox}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="star-outline" size={22} color="#8E8E8E" />
                  </View>
                  <Text style={styles.settingsText}>Rate us on App Store</Text>
                </TouchableOpacity>
              </View>
                

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

    padding: 30,
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
    overflow: "hidden",
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  avatarImageSmall: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  selectedAvatar: {
    borderColor: "#007AFF", // ✅ Blue border when selected
    borderWidth: 3, // Makes selection stand out
    opacity: 0.8, // Slight fade effect for selected avatar
  },
  doneButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    color: 'grey',
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
  infoBox: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15,           // Rounded corners
    padding: 15,                // Padding inside the box
    width: 350,               // Ensures proper width
    // shadowColor: '#000',        // Adds a slight shadow
    // shadowOpacity: 0.05,
    // shadowRadius: 5,
    elevation: 3,               // Elevation for Android
    marginBottom: 20,           // Spacing before logout button
  },
  settingsContainer: {
    width: 350,
    marginBottom: 20,
  },
  
  settingsBox: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 15,           // Rounded corners
    flexDirection: 'row',       // Align icon and text horizontally
    alignItems: 'center',       // Center items vertically
    paddingVertical: 20,        // Reduced height compared to infoBox
    paddingHorizontal: 15,
    marginBottom: 20,           // Space between boxes
    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    elevation: 2,               // Shadow for Android
  },
  
  settingsText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginLeft: 10,             // Space between icon and text
  },
  scrollContainer: {
    marginTop: 250,
    flex: 1,
    backgroundColor: 'transparent', // Optional background color
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',    // Make sure it covers full width
    height: '100%',   // Ensure full height
    resizeMode: 'cover', // Ensure it stretches correctly
    position: 'absolute', // Fix background position
  },
  
  

});
