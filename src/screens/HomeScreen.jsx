import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";
import FeaturedCard from "../components/FeaturedCard";
import CategoryList from "../components/CategoryList";
import { challenges } from "../data/challenges";
import colors from "../styles/colors";

const HEADER_HEIGHT = 90;

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorite, setFavorite] = useState([]);

  // Animated value untuk menangkap posisi scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  // diffClamp membatasi nilai agar tetap di antara 0 dan HEADER_HEIGHT
  const diffClampY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  // Header bergeser ke atas saat scroll turun, kembali saat scroll naik
  const headerTranslateY = diffClampY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const categories = [
    "All",
    ...new Set(challenges.map((item) => item.category)),
  ];

  const filteredChallenges =
    selectedCategory === "All"
      ? challenges
      : challenges.filter((item) => item.category === selectedCategory);

  const featuredChallenge = filteredChallenges.find((item) => item.isFeatured);
  const regularChallenges = filteredChallenges.filter(
    (item) => !item.isFeatured
  );

  const toggleFavorite = (id) => {
    if (favorite.includes(id)) {
      setFavorite(favorite.filter((item) => item !== id));
    } else {
      setFavorite([...favorite, id]);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header dengan animasi slide ke atas saat scroll */}
      <Animated.View
        style={[
          styles.floatingHeader,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Header />
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </Animated.View>

      {/* ScrollView dengan Animated agar scroll terhubung ke animasi */}
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 80 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {featuredChallenge && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Challenge</Text>
            <FeaturedCard challenge={featuredChallenge} />
          </View>
        )}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>All Challenges</Text>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {regularChallenges.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <ChallengeCard
                  challenge={item}
                  isFavorite={favorite.includes(item.id)}
                  onFavorite={() => toggleFavorite(item.id)}
                />
              </View>
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.background,
    elevation: 4,
  },
  container: {
    flex: 1,
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
