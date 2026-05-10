import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import colors from "../styles/colors";

const categories = ["Sketch", "Digital", "3D", "Painting", "Anime"];

export default function CategoryList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    color: "white",
  },
});