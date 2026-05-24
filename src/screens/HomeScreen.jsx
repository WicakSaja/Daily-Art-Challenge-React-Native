import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";
import FeaturedCard from "../components/FeaturedCard";
import CategoryList from "../components/CategoryList";
import { challenges } from "../data/challenges";
import colors from "../styles/colors";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [favorite, setFavorite] = useState([]);
  const categories = [
    "All",
    ...new Set(
      challenges.map(item => item.category)
    ),
  ];
  const filteredChallenges =
    selectedCategory === "All"
      ? challenges
      : challenges.filter(
          item =>
            item.category === selectedCategory
        );
  const featuredChallenge =
    filteredChallenges.find(
      item => item.isFeatured
    );
  const regularChallenges =
    filteredChallenges.filter(
      item => !item.isFeatured
    );
  const toggleFavorite = (id) => {
    if (favorite.includes(id)) {
      setFavorite(
        favorite.filter(item => item !== id)
      );
    } else {
      setFavorite([...favorite, id]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {featuredChallenge && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>
            Featured Challenge
          </Text>
          <FeaturedCard
            challenge={featuredChallenge}
          />
        </View>
      )}
      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>
          All Challenges
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.horizontalList
          }
        >
          {regularChallenges.map((item) => (
            <View
              key={item.id}
              style={styles.cardWrapper}
            >
              <ChallengeCard
                challenge={item}
                isFavorite={favorite.includes(item.id)}
                onFavorite={() => toggleFavorite(item.id)} 
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  challengeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardWrapper: {
    width: 300,
  },
});