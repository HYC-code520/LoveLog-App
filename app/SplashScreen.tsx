import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  // add other routes here
};

export default function SplashScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/AppStartVideo.mp4')}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER} // Use the enum value here
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
            navigation.replace('Login');
          }
        }}
      />
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
  },
});
