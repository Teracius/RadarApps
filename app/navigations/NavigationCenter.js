import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home";
import VideoScreen from "../screens/VideoScreen";

const AuthStack = createStackNavigator();
const AuthStack2 = createStackNavigator();

function Root() {
  return (
    <AuthStack2.Navigator
      // initialRouteName="VideoScreen"
      initialRouteName="Home"
      screenOptions={{
        animationEnabled: false,
        gestureEnabled: false,
        headerShown: false,
        headerStyle: {
          elevation: 0,
          shadowColor: "transparent",
        },
        cardStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <AuthStack2.Screen name="Home" component={Home} />
      <AuthStack2.Screen name="VideoScreen" component={VideoScreen} />
    </AuthStack2.Navigator>
  );
}

export default () => (
  <NavigationContainer>
    <AuthStack.Navigator
      initialRouteName="Root"
      screenOptions={{
        animationEnabled: false,
        gestureEnabled: false,
        headerShown: false,
        headerStyle: {
          elevation: 0,
          shadowColor: "transparent",
        },
        cardStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <AuthStack.Screen name="Root" component={Root} />
    </AuthStack.Navigator>
  </NavigationContainer>
);
