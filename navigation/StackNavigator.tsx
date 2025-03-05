import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator"; // Correct path
import SplashScreen from "../app/SplashScreen"; // ✅ Import SplashScreen
import LoginScreen from "../app/LoginScreen";
import SignupScreen from "../app/SignupScreen";
import ForgotPasswordScreen from "../app/ForgotPasswordScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined} initialRouteName="Splash">
                <Stack.Screen 
                    name="Splash" 
                    component={SplashScreen} 
                    options={{ headerShown: false }} // ✅ Hide the top bar
                />
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Signup" 
                    component={SignupScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="ForgotPassword" 
                    component={ForgotPasswordScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Tabs" 
                    component={TabNavigator} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
