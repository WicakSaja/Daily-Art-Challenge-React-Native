import React, { useState } from "react";
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
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../styles/colors";

const CATEGORIES = [
  "Sketsa",
  "Lukisan",
  "Digital Art",
  "Fotografi",
  "Kolase",
  "Patung",
  "Ilustrasi",
  "Karikatur",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AddChallengeForm() {
  const navigation = useNavigation();

  // State untuk setiap field form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    level: "",
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.category &&
    formData.level;

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Perhatian", "Harap lengkapi semua field yang wajib diisi.");
      return;
    }
    Alert.alert(
      "Challenge Dikirim!",
      `Challenge "${formData.title}" berhasil ditambahkan.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

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
              <Text style={styles.headerTitle}>Tambah Challenge</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Judul challenge */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Judul Challenge *</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Contoh: Sketsa Wajah Realistis"
                  placeholderTextColor="#bbb"
                  value={formData.title}
                  onChangeText={(text) => handleChange("title", text)}
                  style={styles.input}
                  maxLength={60}
                  returnKeyType="next"
                />
              </View>
              <Text style={styles.charCount}>{formData.title.length}/60</Text>
            </View>

            {/* Deskripsi */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Deskripsi *</Text>
              <View style={[styles.inputBox, { minHeight: 110 }]}>
                <TextInput
                  placeholder="Jelaskan detail challenge yang akan dilakukan..."
                  placeholderTextColor="#bbb"
                  value={formData.description}
                  onChangeText={(text) => handleChange("description", text)}
                  style={[styles.input, { textAlignVertical: "top" }]}
                  multiline
                  maxLength={300}
                />
              </View>
              <Text style={styles.charCount}>{formData.description.length}/300</Text>
            </View>

            {/* URL Gambar */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>URL Gambar (opsional)</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#bbb"
                  value={formData.imageUrl}
                  onChangeText={(text) => handleChange("imageUrl", text)}
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
                    style={[
                      styles.chip,
                      formData.category === cat && styles.chipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.category === cat && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level kesulitan */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Tingkat Kesulitan *</Text>
              <View style={styles.chipGroup}>
                {LEVELS.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => handleChange("level", lvl)}
                    style={[
                      styles.chip,
                      formData.level === lvl && styles.chipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        formData.level === lvl && styles.chipTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom bar tombol submit */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Kirim Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 14,
    backgroundColor: colors.background,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  input: {
    fontSize: 14,
    color: "#222",
    padding: 0,
  },
  charCount: {
    fontSize: 11,
    color: "#bbb",
    alignSelf: "flex-end",
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: "#222",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "white",
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.background,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
