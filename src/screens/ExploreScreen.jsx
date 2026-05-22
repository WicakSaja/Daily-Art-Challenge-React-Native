import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import ChallengeCard from "../components/ChallengeCard";
import { challenges } from "../data/challenges";
import colors from "../styles/colors";

export default function ExploreScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      >
      <Text style={styles.title}>
        Explore Arts
      </Text>
      <View style={styles.grid}>
        {challenges.map((item) => (
          <View
            key={item.id}
            style={styles.cardWrapper}
          >
            <ChallengeCard
              challenge={item}
              isFavorite={false}
              onFavorite={() => {}}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
});