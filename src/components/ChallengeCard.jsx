import React from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet,} from "react-native";
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
        <Text style={styles.category}>
          {category}
        </Text>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.level}>
          Difficulty: {level}
        </Text>
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
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,
  },
  image: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  category: {
    color: "#777",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  level: {
    marginTop: 6,
    color: "#666",
  },
  favoriteButton: {
    marginTop: 12,
  },
  favoriteText: {
    fontWeight: "600",
  },
});