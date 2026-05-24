import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "lucide-react-native";
import ChallengeCard from "../components/ChallengeCard";
import { challenges } from "../data/challenges";
import colors from "../styles/colors";

export default function ExploreScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header dengan tombol search */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore Arts</Text>
        {/* Menekan ikon search navigasi ke SearchScreen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Search color="#222" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {challenges.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    elevation: 2,
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
