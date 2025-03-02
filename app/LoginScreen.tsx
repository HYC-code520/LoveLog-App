import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import API_BASE_URL from "../constants/AppConfig";


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLogin = async () => {
        setLoading(true);  // Show loading indicator
    
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.access_token) {
                console.log("Token received:", data.access_token);
                await SecureStore.setItemAsync("authToken", data.access_token);  // ✅ Secure token storage
                Alert.alert("Login Successful!", `Welcome back, ${email}`);
                navigation.replace("Tabs");  // ✅ Navigate to home screen
            } else {
                Alert.alert("Login Failed", data.error || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", "Something went wrong. Try again.");
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
            />
            <TextInput 
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
            {/* ✅ Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Text
                style={styles.link}
                onPress={() => navigation.navigate('Signup')}
            >
                Don't have an account? Sign up
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '80%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 10,
      borderRadius: 5,
    },
    forgotPasswordText: {
      color: 'red',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    link: {
      color: 'blue',
      marginTop: 10,
    },
});
