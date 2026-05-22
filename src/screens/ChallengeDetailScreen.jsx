import React from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import StartButton from "../components/StartButton";
import FavoriteButton from "../components/FavoriteButton";
import { useState } from "react";
export default function ChallengeDetailScreen({
  route,
}) {


  const { challenge } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (


    <ScrollView style={styles.container}>
      <Image
        source={{ uri: challenge.image }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.category}>
          {challenge.category}
        </Text>
        <Text style={styles.title}>
          {challenge.title}
        </Text>
        <Text style={styles.level}>
          Difficulty: {challenge.level}
        </Text>
        <Text style={styles.description}>
          {challenge.description}
        </Text>
        <FavoriteButton isFavorite={isFavorite} onPress={handleFavorite} />
      </View>
      <StartButton />
    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 280,
  },

  content: {
    padding: 20,
  },

  category: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },

  level: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555",
  },

});