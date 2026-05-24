import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import StartButton from "../components/StartButton";
import FavoriteButton from "../components/FavoriteButton";
import { useState } from "react";

const HEADER_HEIGHT = 60;

export default function ChallengeDetailScreen({ route }) {
  const { challenge } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Animated value untuk scroll
  const scrollY = useRef(new Animated.Value(0)).current;

  // diffClamp untuk membatasi rentang scroll yang mempengaruhi animasi
  const diffClampY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  // Bottom bar bergeser ke bawah saat scroll turun, kembali saat scroll naik
  const bottomBarTranslateY = diffClampY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT + 20],
  });

  // Animasi fade-in pada gambar saat layar pertama kali dibuka
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <View style={styles.wrapper}>
      {/* ScrollView dengan Animated agar posisi scroll terhubung ke animasi */}
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Gambar dengan animasi fade-in saat pertama kali load */}
        <Animated.Image
          source={{ uri: challenge.image }}
          style={[styles.image, { opacity: imageFadeAnim }]}
          onLoad={() => {
            Animated.timing(imageFadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }}
        />

        <View style={styles.content}>
          <Text style={styles.category}>{challenge.category}</Text>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.level}>Difficulty: {challenge.level}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        <FavoriteButton isFavorite={isFavorite} onPress={handleFavorite} />
      </Animated.ScrollView>

      {/* Bottom bar dengan animasi slide ke bawah saat scroll turun */}
      <Animated.View
        style={[
          styles.bottomBar,
          { transform: [{ translateY: bottomBarTranslateY }] },
        ]}
      >
        <StartButton />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 280,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  level: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingBottom: 16,
    paddingTop: 8,
    elevation: 10,
  },
});
