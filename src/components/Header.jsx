import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import colors from "../styles/colors";

export default function Header() {
  // Animasi fade + slide dari atas saat komponen pertama kali muncul
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Daily Art Challenge</Text>
      <Text style={styles.subtitle}>Latih kreativitasmu setiap hari!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    marginTop: 5,
  },
});
