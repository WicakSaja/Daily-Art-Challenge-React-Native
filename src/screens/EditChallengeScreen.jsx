// screens/EditChallengeScreen.jsx
// Mengambil data challenge yang ada via GET (prefill form),
// lalu mengirim perubahan ke REST API menggunakan metode PUT.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../styles/colors";
import { getChallengeById, putChallenge } from "../utils/api";

const CATEGORIES = ["Sketsa", "Lukisan", "Digital Art", "Fotografi", "Kolase", "Ilustrasi"];
const LEVELS     = ["Beginner", "Intermediate", "Advanced"];

export default function EditChallengeScreen({ route }) {
  const { challengeId } = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    level: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // ── GET: ambil data lama untuk prefill form ─────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getChallengeById(challengeId);
        const data = response.data;
        setFormData({
          title:       data.title       || "",
          description: data.description || "",
          image:       data.image       || "",
          category:    data.category    || "",
          level:       data.level       || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data challenge:", error);
        Alert.alert("Error", "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [challengeId]);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.category && formData.level;

  // ── PUT: kirim data yang sudah diubah ke API ─────────────────
  const handleUpdate = async () => {
    if (!isFormValid) {
      Alert.alert("Perhatian", "Harap lengkapi semua field wajib.");
      return;
    }
    setSaving(true);
    try {
      await putChallenge(challengeId, {
        title:       formData.title,
        description: formData.description,
        image:       formData.image,
        category:    formData.category,
        level:       formData.level,
      });
      // Kembali ke detail, detail screen akan GET ulang data terbaru
      navigation.navigate("ChallengeDetail", { challengeId });
    } catch (error) {
      console.error("Gagal memperbarui challenge:", error);
      Alert.alert("Error", "Gagal memperbarui challenge. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ArrowLeft color="#222" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.headerTitle}>Edit Challenge</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Judul */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Judul *</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Judul challenge"
                  placeholderTextColor="#bbb"
                  value={formData.title}
                  onChangeText={(t) => handleChange("title", t)}
                  style={styles.input}
                  maxLength={60}
                />
              </View>
              <Text style={styles.charCount}>{formData.title.length}/60</Text>
            </View>

            {/* Deskripsi */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Deskripsi *</Text>
              <View style={[styles.inputBox, { minHeight: 110 }]}>
                <TextInput
                  placeholder="Deskripsi challenge"
                  placeholderTextColor="#bbb"
                  value={formData.description}
                  onChangeText={(t) => handleChange("description", t)}
                  style={[styles.input, { textAlignVertical: "top" }]}
                  multiline
                  maxLength={300}
                />
              </View>
              <Text style={styles.charCount}>{formData.description.length}/300</Text>
            </View>

            {/* URL Gambar */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>URL Gambar</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#bbb"
                  value={formData.image}
                  onChangeText={(t) => handleChange("image", t)}
                  style={styles.input}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Kategori */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kategori *</Text>
              <View style={styles.chipGroup}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleChange("category", cat)}
                    style={[styles.chip, formData.category === cat && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, formData.category === cat && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Tingkat Kesulitan *</Text>
              <View style={styles.chipGroup}>
                {LEVELS.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => handleChange("level", lvl)}
                    style={[styles.chip, formData.level === lvl && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, formData.level === lvl && styles.chipTextActive]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Tombol Update */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.updateButton, !isFormValid && styles.updateDisabled]}
              onPress={handleUpdate}
              disabled={!isFormValid || saving}
              activeOpacity={0.8}
            >
              <Text style={styles.updateText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>

          {/* Loading overlay saat PUT sedang berlangsung */}
          {saving && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.background },
  centered:       { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  header:         { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 55, paddingBottom: 14, backgroundColor: colors.background, elevation: 3 },
  headerTitle:    { fontSize: 16, fontWeight: "bold", color: "#222" },
  formContent:    { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 20 },
  fieldGroup:     { gap: 6 },
  label:          { fontSize: 14, fontWeight: "600", color: "#444" },
  inputBox:       { backgroundColor: "white", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: "#E8E8E8" },
  input:          { fontSize: 14, color: "#222", padding: 0 },
  charCount:      { fontSize: 11, color: "#bbb", alignSelf: "flex-end" },
  chipGroup:      { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip:           { backgroundColor: "#EFEFEF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipActive:     { backgroundColor: "#222" },
  chipText:       { fontSize: 13, color: "#555", fontWeight: "500" },
  chipTextActive: { color: "white" },
  bottomBar:      { padding: 16, paddingBottom: 24, backgroundColor: colors.background, elevation: 8 },
  updateButton:   { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 30, alignItems: "center" },
  updateDisabled: { opacity: 0.45 },
  updateText:     { color: "white", fontWeight: "bold", fontSize: 16 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
});
