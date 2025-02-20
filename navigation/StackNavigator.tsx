import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../app/LoginScreen";
import SignupScreen from "../app/SignupScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined} initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )


}