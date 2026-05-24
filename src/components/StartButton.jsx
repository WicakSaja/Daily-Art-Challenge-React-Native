import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import colors from "../styles/colors";

export default function StartButton() {
  // Animasi pulse (berulang) pada tombol Start
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Mulai Challenge</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    margin: 5,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
