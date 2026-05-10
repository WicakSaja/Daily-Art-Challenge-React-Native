import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default function ChallengeCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Challenge Hari Ini</Text>
      <Text style={styles.challenge}>Gambar "Dunia Impian"</Text>
      <Text style={styles.desc}>
        Gunakan imajinasimu untuk menggambar dunia versimu sendiri.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  label: {
    color: colors.white,
    fontSize: 12,
  },
  challenge: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  desc: {
    color: colors.white,
    fontSize: 13,
  },
});