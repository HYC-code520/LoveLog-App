import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StackNavigator from "./navigation/StackNavigator";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log (token)
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StackNavigator initialRouteName={isLoggedIn ? "Tabs" : "Login"} />;
}
