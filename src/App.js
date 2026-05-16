import React from "react";

import { NavigationContainer }
from "@react-navigation/native";

import { createBottomTabNavigator }
from "@react-navigation/bottom-tabs";

import {
  Ionicons,
} from "@expo/vector-icons";

import HomeScreen
from "./screens/HomeScreen";
import ExploreScreen
from "./screens/ExploreScreen";
import FavoriteScreen
from "./screens/FavoriteScreen";
import ProfileScreen
from "./screens/ProfileScreen";

const Tab =
  createBottomTabNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Tab.Navigator

        screenOptions={({
          route,
        }) => ({

          headerShown: false,

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => {

            let iconName;

            if (route.name === "Home") {

              iconName =
                focused
                  ? "home"
                  : "home-outline";

            } else if (
              route.name === "Explore"
            ) {

              iconName =
                focused
                  ? "search"
                  : "search-outline";

            } else if (
              route.name === "Favorite"
            ) {

              iconName =
                focused
                  ? "heart"
                  : "heart-outline";

            } else if (
              route.name === "Profile"
            ) {

              iconName =
                focused
                  ? "person"
                  : "person-outline";
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },

          tabBarActiveTintColor:
            "#222",

          tabBarInactiveTintColor:
            "gray",

          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },

          tabBarLabelStyle: {
            fontSize: 12,
          },

        })}
      >

        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
        />

        <Tab.Screen
          name="Favorite"
          component={FavoriteScreen}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />

      </Tab.Navigator>

    </NavigationContainer>

  );
}