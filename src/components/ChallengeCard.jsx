import React from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ChallengeCard({
  title,
  category,
  level,
  image,
  isFavorite,
  onFavorite,
}) {

  return (

    <View style={styles.card}>

      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <View style={styles.content}>

        <View>

          <Text style={styles.category}>
            {category}
          </Text>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.level}>
            Difficulty: {level}
          </Text>

        </View>

        <TouchableOpacity
          onPress={onFavorite}
          style={styles.favoriteButton}
        >

          <Text style={styles.favoriteText}>
            {isFavorite
              ? "❤️ Favorited"
              : "🤍 Favorite"}
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 16,
    minHeight: 150,
    justifyContent: "space-between",
  },

  category: {
    color: "#777",
    fontSize: 12,
    marginBottom: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  level: {
    color: "#666",
    fontSize: 14,
  },

  favoriteButton: {
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },

  favoriteText: {
    fontWeight: "600",
  },

});