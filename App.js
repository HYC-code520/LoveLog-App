import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Platform, StatusBar } from "react-native";
import StackNavigator from "./navigation/StackNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        
        if (token) {
          setIsLoggedIn(true);  // ✅ User stays logged in if token exists
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeContainer} edges={["top"]}>
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer} edges={["top"]}>
        <StackNavigator initialRouteName={isLoggedIn ? "Tabs" : "Login"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // ✅ Moves everything below status bar
  },
  centeredView: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  }
});
