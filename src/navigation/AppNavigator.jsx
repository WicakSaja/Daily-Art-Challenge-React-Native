import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChallengeDetailScreen from "../screens/ChallengeDetailScreen";
import {
  Home as HomeIcon,
  Compass,
  Heart as Favorite,
  User,
} from "lucide-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
                  tabBarLabel: "Home",
                  tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
                  headerShown: false,
                }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
                  tabBarLabel: "Explore",
                  tabBarIcon: ({ color }) => <Compass color={color} size={24} />,
                  headerShown: false,
                }}
      />

      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
                  tabBarLabel: "Favorite",
                  tabBarIcon: ({ color }) => <Favorite color={color} size={24} />,
                  headerShown: false,
                }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
                  tabBarLabel: "Profile",
                  tabBarIcon: ({ color }) => <User color={color} size={24} />,
                  headerShown: false,
                }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
          options={{
            title: "Challenge Detail",
            
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}