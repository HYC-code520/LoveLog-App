import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { API_BASE_URL } from "../constants/AppConfig";

// Import the background image
import BackgroundImage from "../assets/Forgotpassword-bg.png"; // Ensure the image is in the correct path

// Define a type for your route parameters
type ForgotPasswordParams = {
  token?: string;
};

// Define the type for the route prop
type ForgotPasswordRouteProp = RouteProp<{ params: ForgotPasswordParams }, "params">;

export default function ForgotPasswordScreen({ navigation }) {
  const route = useRoute<ForgotPasswordRouteProp>(); // ✅ Get route params
  const resetToken = route.params?.token; // ✅ Get token from email link

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(resetToken ? 2 : 1); // ✅ Auto-set stage based on token

  useEffect(() => {
    if (resetToken) {
      setStage(2);
    }
  }, [resetToken]);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Check your email for reset instructions.");
        navigation.replace("Login");
      } else {
        Alert.alert("Error", data.error || "Could not send reset email.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={BackgroundImage} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>

          {/* Description */}
          <Text style={styles.description}>
            Don’t worry, it happens to the best of us!{"\n"}
            Enter your email to reset your password!
          </Text>

          {/* Input field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#3D2451"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Sending..." : "SEND"}</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <Text
            style={styles.link}
            onPress={() => navigation.replace("Login")}
          >
            Go back to Login
          </Text>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    marginTop:205,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3D2451",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#3D2451",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Translucent background
    width: "70%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#3D2451",
  },
  button: {
    backgroundColor: "#3D2451",
    width: "50%",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#3D2451",
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
