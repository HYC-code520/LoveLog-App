import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";  // ✅ Import useRoute to get token from URL
import { API_BASE_URL, CLOUDINARY_CONFIG } from "../constants/AppConfig";

// Define a type for your route parameters
type ForgotPasswordParams = {
  token?: string;
};

// Define the type for the route prop
type ForgotPasswordRouteProp = RouteProp<{ params: ForgotPasswordParams }, 'params'>;

export default function ForgotPasswordScreen({ navigation }) {
  const route = useRoute<ForgotPasswordRouteProp>();  // ✅ Get route params
  const resetToken = route.params?.token;  // ✅ Get token from email link
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(resetToken ? 2 : 1);  // ✅ Auto-set stage based on token

  // ✅ Automatically switch to Reset Password mode if token is in URL
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
        navigation.replace("Login");  // ✅ Navigate back to login
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

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      Alert.alert("Error", "Invalid token or password missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://c341-163-182-130-6.ngrok-free.app/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Password Reset!", "You can now log in with your new password.");
        navigation.replace("Login");  // ✅ Navigate back to Login
      } else {
        Alert.alert("Error", data.error || "Invalid or expired token.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stage === 1 ? "Forgot Password" : "Reset Password"}</Text>

      {stage === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title={loading ? "Requesting..." : "Request Reset"} onPress={handleForgotPassword} disabled={loading} />
        </>
      ) : (
        <>
          <Text style={styles.infoText}>Resetting password for token: {resetToken}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title={loading ? "Resetting..." : "Reset Password"} onPress={handleResetPassword} disabled={loading} />
        </>
      )}

      <Text style={styles.link} onPress={() => navigation.replace("Login")}>
        Go back to Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 10, borderRadius: 5 },
  link: { color: "blue", marginTop: 10, textDecorationLine: "underline" },
  infoText: { fontSize: 14, color: "gray", marginBottom: 10 },
});
