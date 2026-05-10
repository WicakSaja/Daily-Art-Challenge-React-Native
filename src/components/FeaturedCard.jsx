import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
export default function FeaturedCard({
  title,
  category,
  image,
}) {
  return (
    <ImageBackground
      source={{ uri: image }}
      style={styles.card}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.badge}>
          FEATURED TODAY
        </Text>
        <Text style={styles.category}>
          {category}
        </Text>
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 280,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 28,
  },
  overlay: {
    padding: 24,
    backgroundColor:
      "rgba(0,0,0,0.35)",
    borderRadius: 28,
  },
  badge: {
    color: "white",
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
  category: {
    color: "#E0E0E0",
    marginBottom: 6,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});