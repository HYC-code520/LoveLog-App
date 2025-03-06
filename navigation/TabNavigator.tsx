import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Image, View, Animated, TouchableWithoutFeedback } from 'react-native';
import HomeScreen from '../app/tabs/HomeScreen';
import CalendarScreen from '../app/tabs/CalendarScreen';
import EventDetailScreen from '../app/tabs/EventDetailScreen';
import MapScreen from '../app/tabs/MapScreen';
import ProfileScreen from '../app/tabs/ProfileScreen';
import AddDateScreen from '../app/tabs/AddDateScreen';
import FavoritesScreen from '../app/tabs/FavoritesScreen';

const Tab = createBottomTabNavigator();
const CalendarStack = createNativeStackNavigator();

function CalendarStackScreen() {
  return (
    <CalendarStack.Navigator id={ undefined } screenOptions={{ headerShown: false }}>
      <CalendarStack.Screen name="CalendarMain" component={CalendarScreen} />
      <CalendarStack.Screen name="EventDetail" component={EventDetailScreen} />
      <CalendarStack.Screen name="Favorites" component={FavoritesScreen} />
    </CalendarStack.Navigator>
  );
}

export default function TabNavigator() {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.5, // Slightly shrink when pressed
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Bounce back to original size
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tab.Navigator id={ undefined }
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor:'#676599',
        tabBarInactiveTintColor:'#d9d9d9',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size + 2} style={{ marginTop: 2 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size + 2} style={{ marginTop: 2 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddDateScreen}
        options={({ navigation }) => ({
          tabBarIcon: () => (
            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate("Add")} // Correct navigation
            >
              <Animated.View
                style={{
                  transform: [{ scale: scaleValue }],
                  position: 'absolute',
                  bottom: -13, // Move icon up
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={require("../assets/plus-tab-butn.png")}
                  style={{ width: 70, height: 70 }} // Make it bigger than other icons
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          ),
        })}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size + 2} style={{ marginTop: 2 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size + 2} style={{ marginTop: 2 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
