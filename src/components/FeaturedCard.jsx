import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../styles/colors";

export default function FeaturedCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Artwork</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: "https://picsum.photos/400/200" }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.artTitle}>Sunset Dream</Text>
          <Text style={styles.artist}>by Artist Random</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: "hidden",

    // shadow (Android & iOS)
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 15,
  },
  artTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  artist: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
  },
});