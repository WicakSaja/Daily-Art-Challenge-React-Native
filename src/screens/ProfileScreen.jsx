import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PenLine } from "lucide-react-native";
import { profile } from "../data/profile";
import colors from "../styles/colors";

// Komponen stat box dengan animasi fade + slide dari bawah (dari BAB 6)
function AnimatedStatBox({ number, label, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();

  const avatarScaleAnim = useRef(new Animated.Value(0.7)).current;
  const avatarFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarScaleAnim, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(avatarFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.Image
          source={{ uri: profile.avatar }}
          style={[styles.avatar, { opacity: avatarFadeAnim, transform: [{ scale: avatarScaleAnim }] }]}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.statsContainer}>
        <AnimatedStatBox number={25} label="Challenges" delay={100} />
        <AnimatedStatBox number={12} label="Favorites" delay={250} />
        <AnimatedStatBox number={8} label="Completed" delay={400} />
      </View>

      {/* Floating Action Button - navigasi ke AddChallengeForm */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddChallenge")}
        activeOpacity={0.8}
      >
        <PenLine color="white" size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, alignItems: "center" },
  header: { alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  name: { fontSize: 26, fontWeight: "bold", marginTop: 16 },
  bio: { color: "#777", marginTop: 8 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 40, width: "90%" },
  statBox: { backgroundColor: "white", width: 100, height: 100, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#777", marginTop: 6 },
  floatingButton: {
    position: "absolute", bottom: 28, right: 24,
    backgroundColor: colors.primary, padding: 16, borderRadius: 16,
    elevation: 8, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
});
