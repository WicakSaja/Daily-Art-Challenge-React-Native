import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";

export default function FeaturedCard({
  challenge,
}) {

  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: challenge.image }}
      style={styles.card}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
       <View style={styles.Container}>
        <Text style={styles.badge}>
          FEATURED TODAY
        </Text>
        <Text style={styles.category}>
          {challenge.category}
        </Text>
        <Text style={styles.title}>
          {challenge.title}
        </Text>
        </View>
        <View style={styles.buttonContainer}>
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
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 28,
    position: "relative",
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

  detailText: {
    fontWeight: "600",
    color: "white",
  },

  buttonContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
});