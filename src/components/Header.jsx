import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Art Challenge</Text>
      <Text style={styles.subtitle}>Latih kreativitasmu setiap hari!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 65,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    marginTop: 5,
  },
});