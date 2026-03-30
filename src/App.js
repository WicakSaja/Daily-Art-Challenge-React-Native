import React from "react";
import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}