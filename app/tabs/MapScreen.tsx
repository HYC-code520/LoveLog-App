import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  // Default: New York City
  const [region, setRegion] = useState({
    latitude: 40.7128, 
    longitude: -74.0060,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // 🔥 Centered on NYC
        onRegionChangeComplete={setRegion} // ✅ Allows user to move the map
      >
        <Marker 
          coordinate={{ latitude: 40.7053, longitude: -74.0139 }}
          title="Flatiron School"
          description="Chett's favorite raccoon"
        >
          <Image 
            source={require('../../assets/raccoon_pixel.png')} 
            style={styles.pinIcon} 
          />
        </Marker>
        {/* 📍 Dessert Place (Cake) */}
        <Marker
          coordinate={{ latitude: 40.7178, longitude: -74.0047 }} // Lady M Cake Boutique
          title="Lady M Cake Boutique"
          description="Famous for their delicious mille crepes 🍰"
        >
          <Image 
            source={require('../../assets/cake_pixel.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

        {/* 📍 Cute Place (Cat Icon) */}
        <Marker
          coordinate={{ latitude: 40.7216, longitude: -73.9953 }} // Meow Parlour (NYC Cat Café)
          title="Meow Parlour"
          description="NYC's cozy cat café 🐱☕"
        >
          <Image 
            source={require('../../assets/cat_pixel2.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

        {/* 📍 Pizza Place (Pizza Icon) */}
        <Marker
          coordinate={{ latitude: 40.7308, longitude: -73.9832 }} // Joe's Pizza (NYC classic)
          title="Joe's Pizza"
          description="One of the best pizza spots in NYC 🍕"
        >
          <Image 
            source={require('../../assets/pizza_pixel.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

        {/* 📍 Park (Tree Icon) */}
        <Marker
          coordinate={{ latitude: 40.785091, longitude: -73.968285 }} // Central Park
          title="Central Park"
          description="The heart of NYC's greenery 🌳"
        >
          <Image 
            source={require('../../assets/tree_pixel4.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

        {/* 📍 Night View Place (Moon Icon) */}
        <Marker
          coordinate={{ latitude: 40.7580, longitude: -73.9855 }} // Times Square
          title="Times Square"
          description="Best night view with city lights 🌙✨"
        >
          <Image 
            source={require('../../assets/moon_pixel.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

        {/* 📍 Couple-Friendly Place (Black & White Cat Icon) */}
        <Marker
          coordinate={{ latitude: 40.7419, longitude: -74.0048 }} // The High Line (Romantic spot)
          title="The High Line"
          description="A romantic walkway with scenic views 👫💕"
        >
          <Image 
            source={require('../../assets/heart_pixel.png')} 
            style={styles.pinIcon} 
          />
        </Marker>

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  pinIcon: { width: 40, height: 40, resizeMode: 'contain' }, // ✅ Ensures proper scaling for custom pins
});
