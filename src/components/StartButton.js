import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default function StartButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Mulai Challenge</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});