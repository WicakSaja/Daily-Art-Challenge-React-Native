import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../styles/colors";

export default function FavoriteButton({ isFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={10}
        color={isFavorite ? colors.primary : "gray"}
      />
      <Text style={styles.text}>{isFavorite ? "Favorit" : "Tambah Favorit"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  text: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
