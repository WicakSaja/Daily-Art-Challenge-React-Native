// screens/ChallengeDetailScreen.jsx
// Menampilkan detail satu challenge yang diambil dari REST API (GET by ID).
// Menyediakan aksi DELETE (hapus challenge) dan navigasi ke EditChallengeScreen.

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MoreVertical, Edit, Trash } from "lucide-react-native";
import colors from "../styles/colors";
import { getChallengeById, deleteChallenge } from "../utils/api";
import { formatDate } from "../utils/formatDate";
import StartButton from "../components/StartButton";
import FavoriteButton from "../components/FavoriteButton";

const HEADER_HEIGHT = 52;

export default function ChallengeDetailScreen({ route }) {
  const { challengeId } = route.params; // terima id, bukan seluruh objek
  const navigation = useNavigation();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFavorite, setIsFavorite]   = useState(false);

  // ── GET by ID ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getChallengeById(challengeId);
        setChallenge(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [challengeId]);

  // ── DELETE ────────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(
      "Hapus Challenge",
      "Apakah kamu yakin ingin menghapus challenge ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteChallenge(challengeId);
              navigation.navigate("Main", { screen: "Home" });
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Gagal menghapus challenge.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ── Animasi scroll (dari BAB 6) ───────────────────────────────
  const scrollY       = useRef(new Animated.Value(0)).current;
  const diffClampY    = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const bottomBarY    = diffClampY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT + 20],
  });
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!challenge) return null;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft color="#555" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.7}>
          <MoreVertical color="#555" size={24} />
        </TouchableOpacity>
      </View>

      {/* Konten scroll */}
      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Gambar dengan animasi fade-in saat load */}
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
          {challenge.createdAt && (
            <Text style={styles.date}>
              Ditambahkan: {formatDate(challenge.createdAt)}
            </Text>
          )}
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        <FavoriteButton isFavorite={isFavorite} onPress={() => setIsFavorite((p) => !p)} />
      </Animated.ScrollView>

      {/* Bottom bar dengan animasi slide */}
      <Animated.View
        style={[styles.bottomBar, { transform: [{ translateY: bottomBarY }] }]}
      >
        <StartButton />
      </Animated.View>

      {/* Modal menu Edit / Delete */}
      <Modal
        animationType="fade"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("EditChallenge", { challengeId: challenge.id });
              }}
            >
              <Edit color="#222" size={20} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
              }}
            >
              <Trash color="#E53935" size={20} />
              <Text style={[styles.menuText, { color: "#E53935" }]}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:      { flex: 1, backgroundColor: "#fff" },
  centered:     { flex: 1, justifyContent: "center", alignItems: "center" },
  header:       {
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 20,
    paddingTop: 50, paddingBottom: 12, backgroundColor: "rgba(255,255,255,0.92)",
  },
  container:    { flex: 1 },
  image:        { width: "100%", height: 280, marginTop: 90 },
  content:      { padding: 20 },
  category:     { fontSize: 14, color: "#777", marginBottom: 8 },
  title:        { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  level:        { fontSize: 16, marginBottom: 6, color: "#444" },
  date:         { fontSize: 13, color: "#999", marginBottom: 14 },
  description:  { fontSize: 16, lineHeight: 26, color: "#555" },
  bottomBar:    {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", paddingBottom: 16, paddingTop: 8, elevation: 10,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.1)", justifyContent: "flex-start", alignItems: "flex-end" },
  modalContent: {
    backgroundColor: "#fff", marginTop: 60, marginRight: 20,
    borderRadius: 12, padding: 8, width: 160, elevation: 6,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  menuItem:     { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  menuText:     { fontSize: 14, fontWeight: "600", color: "#222" },
  menuDivider:  { height: 1, backgroundColor: "#F0F0F0", marginHorizontal: 8 },
});
