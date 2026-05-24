import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../styles/colors";

export default function SplashScreen() {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animasi logo muncul
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Pindah ke Login setelah 2 detik
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <Text style={styles.logo}>🎨</Text>
        <Text style={styles.appName}>Daily Art</Text>
        <Text style={styles.appSub}>Challenge</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Presented by</Text>
        <Text style={styles.footerBold}>Mobile Programming Laboratory</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
  },
  appSub: {
    fontSize: 20,
    fontWeight: "400",
    color: "#888",
    letterSpacing: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#aaa",
  },
  footerBold: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textAlign: "center",
  },
});
