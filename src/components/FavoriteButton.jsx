import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] =
    useState(false);
  function toggleFavorite() {
    setIsFavorite(!isFavorite);
  }
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFavorite &&
          styles.activeButton,
      ]}
      onPress={toggleFavorite}
      activeOpacity={0.8}
    >

      <Text style={styles.text}>
        {isFavorite
          ? "❤️ Favorited"
          : "🤍 Add Favorite"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: "#F1F1F1",
    marginHorizontal: 20,
    margin: 5,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  activeButton: {
    backgroundColor: "#FFE5E5",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },

});