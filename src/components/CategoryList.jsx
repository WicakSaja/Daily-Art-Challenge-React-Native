import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

function CategoryButton({ category, active, onPress }) {
  // Animasi scale saat tombol ditekan
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.button,
          active && styles.activeButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={[styles.text, active && styles.activeText]}>
          {category}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <View style={styles.container}>
      {categories.map((category) => {
        const active = selectedCategory === category;
        return (
          <CategoryButton
            key={category}
            category={category}
            active={active}
            onPress={() => onSelectCategory(category)}
          />
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
