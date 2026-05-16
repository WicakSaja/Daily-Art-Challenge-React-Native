import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import colors from "../styles/colors";

export default function FavoriteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Favorite Arts
      </Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Belum ada challenge favorit
        </Text>
      </View>
    </View>
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});