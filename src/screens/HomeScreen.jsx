import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";
import CategoryList from "../components/CategoryList";
import StartButton from "../components/StartButton";
import colors from "../styles/colors";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header />
      <ChallengeCard />
      <CategoryList />
      <StartButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});