import { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

let MapView, Marker;
if (Platform.OS !== 'web') {
  // Only import for native platforms (iOS/Android)
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

const BATHROOM_LOCATIONS = [
  { latitude: 40.7505, longitude: -73.9934, title: "Penn Station Relief Center 🚽", description: "Enter at your own risk... if you're brave enough." },
  { latitude: 40.7577, longitude: -73.9857, title: "Times Square Tourist Trap 🚽", description: "For when you realize coffee + sightseeing was a mistake." },
  { latitude: 40.7336, longitude: -73.9903, title: "Union Square Emergency 🚽", description: "A restroom battle royale. Good luck." },
  { latitude: 40.7538, longitude: -73.9832, title: "Bryant Park Throne Room 🚽", description: "One of the *fanciest* public restrooms you'll ever see." },
  { latitude: 40.7419, longitude: -74.0048, title: "High Line Nature Call 🚽", description: "Scenic views, but gotta hold it until 14th St." },
  { latitude: 40.7580, longitude: -73.9855, title: "McDonald's Times Square 🚽", description: "Only for the strong-willed (and those who buy fries first)." },
  { latitude: 40.7769, longitude: -73.9761, title: "Central Park Bathroom Maze 🚽", description: "Run faster than the squirrels to claim your spot." },
  { latitude: 40.7033, longitude: -74.0170, title: "Battery Park Potty 🚽", description: "Perfect for Statue of Liberty pre-board panic." },
  { latitude: 40.7309, longitude: -73.9973, title: "Washington Square Flush 🚽", description: "Where NYU students and street performers unite." },
  { latitude: 40.7043, longitude: -73.9891, title: "Brooklyn Bridge P-Pause 🚽", description: "Halfway across? Bad timing. Good luck." },
  { latitude: 40.6928, longitude: -73.9905, title: "DUMBO Relief Spot 🚽", description: "Instagram your struggle before you enter." },
  { latitude: 40.7484, longitude: -73.9857, title: "Empire State P-Level 🚽", description: "You paid for the view, now you pay for the wait." },
  { latitude: 40.7587, longitude: -73.9787, title: "Rockefeller Center Rest Stop 🚽", description: "The Christmas tree isn’t the only thing getting watered." },
  { latitude: 40.7074, longitude: -74.0113, title: "Wall Street Banker’s Break 🚽", description: "For when the market crashes *and* your stomach does too." },
  { latitude: 40.6720, longitude: -73.9687, title: "Prospect Park Port-a-Potty 🚽", description: "A gamble every time, bring hand sanitizer." },
  { latitude: 40.7458, longitude: -73.9982, title: "Chelsea Market Mystery 🚽", description: "Hidden like a speakeasy. Only the worthy will find it." },
  { latitude: 40.7465, longitude: -73.9834, title: "Madison Square Park Flush Stop 🚽", description: "Shake Shack line too long? Here's Plan B." },
  { latitude: 40.7265, longitude: -74.0037, title: "SoHo Boutique Bathroom 🚽", description: "If you look rich enough, they'll let you in." },
  { latitude: 40.7851, longitude: -73.9683, title: "The MET Museum Throne 🚽", description: "Where art lovers and bladder-holders unite." },
  { latitude: 40.6892, longitude: -74.0445, title: "Statue of Liberty Final Stop 🚽", description: "The last American freedom you'll experience before the ferry." },
  { latitude: 40.6971, longitude: -73.9708, title: "Brooklyn Botanic Garden Zen 🚽", description: "A peaceful place… if you get there in time." },
  { latitude: 40.7301, longitude: -73.9925, title: "St. Mark’s Gotta-Go 🚽", description: "Punk rockers and college kids, a chaotic mix." },
  { latitude: 40.7440, longitude: -73.9901, title: "Eataly’s European Escape 🚽", description: "Pee like the Italians do, after eating way too much pasta." },
  { latitude: 40.7127, longitude: -74.0134, title: "One World Trade Center 🚽", description: "Where you reflect on history... and your urgent needs." },
  { latitude: 40.6915, longitude: -74.1745, title: "Newark Airport Panic 🚽", description: "Miss your flight or make it? The choice is yours." },
  { latitude: 40.7590, longitude: -73.9845, title: "Grand Central Express 🚽", description: "Only the fast and the furious get a stall." },
  { latitude: 40.7396, longitude: -73.9886, title: "Flatiron Building Emergency 🚽", description: "That weird shape? Yeah, it’s got tiny restrooms too." },
  { latitude: 40.7035, longitude: -74.0170, title: "Staten Island Ferry Terminal 🚽", description: "Do your business before the ferry shakes things up." },
  { latitude: 40.7616, longitude: -73.9817, title: "MoMA Art of Relief 🚽", description: "A modern art experience... with automatic flushes." }
];

export default function MapScreen() {
  // Default: New York City
  const [region, setRegion] = useState({
    latitude: 40.7128, 
    longitude: -74.0060,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🗺️ Maps are not available on the web.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
          {BATHROOM_LOCATIONS.map((location, index) => (
          <Marker 
            key={index} 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
            title={location.title} 
            description={location.description}
          >
            <View style={styles.emojiPin}>
              <Text style={styles.emoji}>🚽</Text>
            </View>
          </Marker>
        ))}
        {/* 📍 Raccoon Place (Flatiron School) */}
        <Marker coordinate={{ latitude: 40.7053, longitude: -74.0139 }} title="Presentation Day" description="I'm finishing a big milestone with my classmates">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🦝</Text></View>
        </Marker>

        {/* 📍 Dessert Place (Cake) */}
        <Marker coordinate={{ latitude: 40.7178, longitude: -74.0047 }} title="Lady M Cake Boutique" description="Famous for their delicious mille crepes 🍰">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🍰</Text></View>
        </Marker>

        {/* 📍 Cute Place (Cat Icon) */}
        <Marker coordinate={{ latitude: 40.7216, longitude: -73.9953 }} title="Meow Parlour" description="NYC's cozy cat café 🐱☕">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🐱</Text></View>
        </Marker>

        {/* 📍 Pizza Place (Pizza Icon) */}
        <Marker coordinate={{ latitude: 40.7308, longitude: -73.9832 }} title="Joe's Pizza" description="One of the best pizza spots in NYC 🍕">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🍕</Text></View>
        </Marker>

        {/* 📍 Park (Tree Icon) */}
        <Marker coordinate={{ latitude: 40.785091, longitude: -73.968285 }} title="Central Park" description="The heart of NYC's greenery 🌳">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🌳</Text></View>
        </Marker>

        {/* 📍 Night View Place (Moon Icon) */}
        <Marker coordinate={{ latitude: 40.7580, longitude: -73.9855 }} title="Times Square" description="Best night view with city lights 🌙✨">
          <View style={styles.emojiPin}><Text style={styles.emoji}>🌙</Text></View>
        </Marker>

        {/* 📍 Couple-Friendly Place (Heart Icon) */}
        <Marker coordinate={{ latitude: 40.7419, longitude: -74.0048 }} title="The High Line" description="A romantic walkway with scenic views 👫💕">
          <View style={styles.emojiPin}><Text style={styles.emoji}>💖</Text></View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%' },
  emojiPin: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: "#000", // Black shadow for contrast
    shadowOffset: { width: 3, height: 3 }, // Creates a shadow offset
    shadowOpacity: 0.4, // Opacity of the shadow
    shadowRadius: 4, // Blurring effect
    elevation: 5, // Ensures shadow works on Android
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background to improve visibility
    borderRadius: 50, // Makes it rounder
    padding: 5, // Adds space around the emoji
  },
  emoji: { fontSize: 30 },
  text: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 20 },
});
