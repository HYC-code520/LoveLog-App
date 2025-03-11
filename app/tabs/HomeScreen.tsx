import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { API_BASE_URL } from '../../constants/AppConfig';
import * as SecureStore from "expo-secure-store";
import GoGoSpin from "react-native-gogo-spin"; // ✅ Import GoGoSpin
import { NativeStackScreenProps } from '@react-navigation/native-stack'; // ✅ Type support for navigation
import { ImageBackground } from 'react-native';

// ✅ Define types for navigation props
type HomeScreenProps = NativeStackScreenProps<any, 'Home'>;

const SIZE = 240; // ✅ Defined globally
type VideoResizeMode = "contain" | "cover" | "stretch";
// const backgroundImage = require('../../assets/home-bg.png'); 

const HomeScreen = ({ navigation }: HomeScreenProps): React.JSX.Element => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const spinRef = useRef<React.ElementRef<typeof GoGoSpin>>(null);
  const videoRef = useRef<Video>(null);

  const dateIdeas = [
    { name: "Thai", image: require('../../assets/images/king.png') },
    { name: "Chinese", image: require('../../assets/images/prize.png') },
    { name: "Korean", image: require('../../assets/images/prize.png') },
    { name: "Japanese", image: require('../../assets/images/prize.png') },
    { name: "Indian", image: require('../../assets/images/prize.png') },
    { name: "Italian", image: require('../../assets/images/prize.png') },
  ];

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

  // const handleLogout = async () => {
  //   await SecureStore.deleteItemAsync('authToken');
  //   Alert.alert('Logged Out', 'You have been logged out.');
  //   navigation.replace('Login');
  // };

  // 🎡 Function to Trigger Spin
  const doSpin = (): void => {
    const getIdx = Math.floor(Math.random() * dateIdeas.length);
    setWinner(null); // Reset winner text before spinning
    spinRef.current?.doSpinAnimate(getIdx);
  };

  // 🎉 Function to Handle Spin Completion (FIXED!)
  const onEndSpin = (finish: boolean): void => {
    console.log("Spin Finished:", finish);
    if (finish) {
      const getIdx = Math.floor(Math.random() * dateIdeas.length);
      setWinner(dateIdeas[getIdx].name); // ✅ Correctly update winner
    }
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
    <View style={styles.backgroundContainer}>
      {/* 🎥 Background Video */}
      <Video
        ref={videoRef}
        source={ require('../../assets/Home-bg-vid.mp4') }
        style={styles.backgroundVideo}
        resizeMode={"cover" as unknown as ResizeMode} // Force the value to match the expected type
        shouldPlay
        isLooping={false}
      />

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}></Text>

        {user ? (
          <>
            {/* <Text style={styles.subtitle}>Hello, {user.email}!</Text> */}
            {/* <Text style={styles.subtitle}>Track your special moments together.</Text> */}
            <Text style={styles.subtitle}></Text>
          </>
        ) : (
          <Text style={styles.subtitle}>Failed to load user data.</Text>
        )}

        {/* 🎡 Spin Wheel */}
        <View style={styles.centerWheel}>
          <GoGoSpin
            ref={spinRef}
            onEndSpinCallBack={onEndSpin} // ✅ Fixed TypeScript issue
            notShowDividLine={true}
            spinDuration={5000}
            spinReverse={true}
            spinTime={6}
            width={SIZE}
            height={SIZE}
            radius={SIZE / 2}
            data={dateIdeas}
            offsetEnable={true}
            source={require('../../assets/images/wheel.png')} // ✅ Custom wheel image
            renderItem={(data, i) => (
              <View key={i} style={styles.itemWrapper}>
                <Text 
                  style={styles.prizeText} 
                  numberOfLines={1} 
                  adjustsFontSizeToFit 
                  minimumFontScale={0.8} 
                  ellipsizeMode="tail"
                >
                  {data.name}
                </Text>
                <Image source={data.image} style={styles.itemWrap} />
              </View>
            )}
            
          />
          
          {/* 🎯 Spin Button */}
          <TouchableOpacity style={styles.spinWarp} onPress={doSpin}>
            <Image source={require('../../assets/images/btn.png')} style={styles.spinBtn} />
          </TouchableOpacity>
        </View>

        {/* 🎉 Winner Announcement */}
        {/* {winner && <Text style={styles.winnerText}>🎉 Your Date Idea: {winner} 🎉</Text>} */}

        
        </View>
      </ScrollView>
    </View>
  );
};

// ✅ Export as a TypeScript function component
export default HomeScreen;

// 🎨 Styles (ADDED `title` & `subtitle`)
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { // ✅ ADDED
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000",
    marginBottom: 10,
  },
  subtitle: { // ✅ ADDED
    fontSize: 16,
    color: 'gray',
    textAlign: "center",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  prizeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  centerWheel: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinBtn: { width: 80, height: 80 },
  spinWarp: { position: 'absolute' },
  itemWrap: { width: 40, height: 40 },
  winnerText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5733",
    textAlign: "center",
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
