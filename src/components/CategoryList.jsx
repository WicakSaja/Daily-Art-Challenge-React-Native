import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}) {

  return (
    <View style={styles.container}>

      {categories.map((category) => {

        const active =
          selectedCategory === category;

        return (

          <TouchableOpacity
            key={category}
            style={[
              styles.button,
              active && styles.activeButton,
            ]}
            onPress={() =>
              onSelectCategory(category)
            }
          >

            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {category}
            </Text>

          </TouchableOpacity>

        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    gap: 10,
  },

  button: {
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  activeButton: {
    backgroundColor: "#222",
  },

  text: {
    color: "#333",
    fontWeight: "500",
  },

  activeText: {
    color: "white",
  },
});