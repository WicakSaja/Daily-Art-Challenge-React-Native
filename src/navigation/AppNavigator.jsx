import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen            from '../screens/HomeScreen';
import ExploreScreen         from '../screens/ExploreScreen';
import FavoriteScreen        from '../screens/FavoriteScreen';
import ProfileScreen         from '../screens/ProfileScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import EditChallengeScreen   from '../screens/EditChallengeScreen';
import AddChallengeForm      from '../screens/AddChallengeForm';
import SearchScreen          from '../screens/SearchScreen';
import SplashScreen          from '../screens/SplashScreen';
import LoginScreen           from '../screens/LoginScreen';
import RegisterScreen        from '../screens/RegisterScreen';

import { Home as HomeIcon, Compass, Heart as Favorite, User } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"     component={HomeScreen}     options={{ tabBarLabel: 'Home',    tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} /> }} />
      <Tab.Screen name="Explore"  component={ExploreScreen}  options={{ tabBarLabel: 'Explore', tabBarIcon: ({ color }) => <Compass  color={color} size={24} /> }} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} options={{ tabBarLabel: 'Favorit', tabBarIcon: ({ color }) => <Favorite color={color} size={24} /> }} />
      <Tab.Screen name="Profile"  component={ProfileScreen}  options={{ tabBarLabel: 'Profil',  tabBarIcon: ({ color }) => <User     color={color} size={24} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash"           component={SplashScreen}          options={{ headerShown: false }} />
        <Stack.Screen name="Login"            component={LoginScreen}           options={{ headerShown: false }} />
        <Stack.Screen name="Register"         component={RegisterScreen}        options={{ headerShown: false }} />
        <Stack.Screen name="Main"             component={BottomTabs}            options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeDetail"  component={ChallengeDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditChallenge"    component={EditChallengeScreen}   options={{ headerShown: false }} />
        <Stack.Screen name="AddChallenge"     component={AddChallengeForm}      options={{ headerShown: false }} />
        <Stack.Screen name="Search"           component={SearchScreen}          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
