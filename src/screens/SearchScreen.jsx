import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import { challenges } from "../data/challenges";
import colors from "../styles/colors";

export default function SearchScreen() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const navigation = useNavigation();

  // Filter challenge berdasarkan kata kunci yang diketik
  const filteredChallenges = challenges.filter(
    (item) =>
      item.title.toLowerCase().includes(searchPhrase.toLowerCase()) ||
      item.category.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header dengan SearchBar */}
      <View style={styles.header}>
        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
        />
      </View>

      {/* Hasil pencarian */}
      <FlatList
        data={searchPhrase.length > 0 ? filteredChallenges : []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchPhrase.length > 0 ? (
            <Text style={styles.emptyText}>
              Tidak ada challenge yang cocok dengan "{searchPhrase}"
            </Text>
          ) : (
            <Text style={styles.hintText}>
              Ketik untuk mencari challenge seni...
            </Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("ChallengeDetail", { challenge: item })
            }
          >
            <Text style={styles.resultCategory}>{item.category}</Text>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultLevel}>Difficulty: {item.level}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 14,
    backgroundColor: colors.background,
    zIndex: 100,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  resultCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultLevel: {
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 14,
  },
  hintText: {
    textAlign: "center",
    color: "#bbb",
    marginTop: 40,
    fontSize: 14,
  },
});
