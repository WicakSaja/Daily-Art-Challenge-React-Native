import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "lucide-react-native";
import colors from "../styles/colors";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Aktifkan tombol daftar hanya jika semua field terisi
  const updateButtonStatus = () => {
    setDisabled(
      !(fullName.trim() && email.trim() && password.trim() && confirmPassword.trim())
    );
  };

  useEffect(() => {
    updateButtonStatus();
  }, [fullName, email, password, confirmPassword]);

  const handleRegister = () => {
    // Validasi password
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password minimal harus 8 karakter.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      Alert.alert("Error", "Password harus mengandung kombinasi huruf dan angka.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Pendaftaran Berhasil! 🎨",
        `Selamat datang, ${fullName}! Akun kamu berhasil dibuat.`,
        [{ text: "Masuk", onPress: () => navigation.replace("Login") }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Judul */}
          <View>
            <Text style={styles.emoji}>🖌️</Text>
            <Text style={styles.header}>Buat Akun</Text>
            <Text style={styles.caption}>
              Bergabung dan mulai tantang kreativitasmu setiap hari!
            </Text>

            <View style={styles.form}>
              {/* Nama Lengkap */}
              <View>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Masukkan nama lengkap"
                    placeholderTextColor="#bbb"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Masukkan email kamu"
                    placeholderTextColor="#bbb"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputBox, styles.inputRow]}>
                  <TextInput
                    placeholder="Minimal 8 karakter"
                    placeholderTextColor="#bbb"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    style={[styles.input, { flex: 1 }]}
                    returnKeyType="next"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    activeOpacity={0.6}
                  >
                    {passwordVisible ? (
                      <EyeOff color="#aaa" size={20} />
                    ) : (
                      <Eye color="#aaa" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Konfirmasi Password */}
              <View>
                <Text style={styles.label}>Konfirmasi Password</Text>
                <View style={[styles.inputBox, styles.inputRow]}>
                  <TextInput
                    placeholder="Ulangi password kamu"
                    placeholderTextColor="#bbb"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmVisible}
                    style={[styles.input, { flex: 1 }]}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmVisible(!confirmVisible)}
                    activeOpacity={0.6}
                  >
                    {confirmVisible ? (
                      <EyeOff color="#aaa" size={20} />
                    ) : (
                      <Eye color="#aaa" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Tombol Daftar */}
          <View style={styles.bottomSection}>
            <TouchableHighlight
              style={[styles.registerButton, { opacity: isDisabled ? 0.45 : 1 }]}
              underlayColor="#333"
              onPress={handleRegister}
              disabled={isDisabled}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>DAFTAR SEKARANG</Text>
              )}
            </TouchableHighlight>

            <View style={styles.loginRow}>
              <Text style={styles.loginHint}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.loginHint, { color: colors.primary, fontWeight: "700" }]}>
                  Masuk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  emoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  header: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
  },
  caption: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
    marginBottom: 36,
  },
  form: {
    gap: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    fontSize: 14,
    color: "#222",
    padding: 0,
  },
  bottomSection: {
    gap: 14,
    marginTop: 30,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginHint: {
    fontSize: 14,
    color: "#888",
  },
});
