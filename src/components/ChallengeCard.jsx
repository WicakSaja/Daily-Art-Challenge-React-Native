import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { formatDate } from "../utils/formatDate";

export default function ChallengeCard({ challenge, isFavorite, onFavorite }) {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Image source={{ uri: challenge.image }} style={styles.image} />
      <View style={styles.content}>
        <View>
          <Text style={styles.category}>{challenge.category}</Text>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.level}>Difficulty: {challenge.level}</Text>
          {challenge.createdAt && (
            <Text style={styles.date}>{formatDate(challenge.createdAt)}</Text>
          )}
        </View>
        {/* Kirim challengeId agar DetailScreen bisa GET by ID */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("ChallengeDetail", { challengeId: challenge.id })
          }
        >
          <Text style={styles.detailText}>Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: "white", borderRadius: 24, overflow: "hidden" },
  image:      { width: "100%", height: 180 },
  content:    { padding: 16, minHeight: 150, justifyContent: "space-between" },
  category:   { color: "#777", fontSize: 12, marginBottom: 6 },
  title:      { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  level:      { color: "#666", fontSize: 14 },
  date:       { color: "#aaa", fontSize: 11, marginTop: 4 },
  detailText: { fontWeight: "600", marginTop: 8 },
});
