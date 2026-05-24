import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  // Animasi scale (bounce) saat tombol favorite ditekan
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function toggleFavorite() {
    setIsFavorite(!isFavorite);

    // Efek bounce: kecil dulu lalu balik besar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFavorite && styles.activeButton,
      ]}
      onPress={toggleFavorite}
      activeOpacity={0.8}
    >
      <Animated.Text
        style={[styles.text, { transform: [{ scale: scaleAnim }] }]}
      >
        {isFavorite ? "❤️ Favorited" : "🤍 Add Favorite"}
      </Animated.Text>
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
