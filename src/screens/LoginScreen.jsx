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
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "lucide-react-native";
import colors from "../styles/colors";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoginDisabled, setLoginDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Aktifkan tombol login hanya jika email dan password tidak kosong
  const updateLoginStatus = () => {
    setLoginDisabled(!(email.trim() && password.trim()));
  };

  useEffect(() => {
    updateLoginStatus();
  }, [email, password]);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigasi ke Main app setelah "login"
      navigation.replace("Main");
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Judul */}
        <View>
          <Text style={styles.emoji}>🎨</Text>
          <Text style={styles.header}>Selamat Datang!</Text>
          <Text style={styles.caption}>
            Masuk untuk mulai tantangan seni harianmu.
          </Text>

          <View style={styles.form}>
            {/* Field Email */}
            <View>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Masukkan email kamu"
                  placeholderTextColor="#bbb"
                  value={email}
                  onChangeText={(text) => { setEmail(text); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Field Password */}
            <View>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputBox, styles.inputRow]}>
                <TextInput
                  placeholder="Masukkan password"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={(text) => { setPassword(text); }}
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, { flex: 1 }]}
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
          </View>
        </View>

        {/* Tombol Login */}
        <View style={styles.bottomSection}>
          <TouchableHighlight
            style={[
              styles.loginButton,
              { opacity: isLoginDisabled ? 0.45 : 1 },
            ]}
            underlayColor="#333"
            onPress={handleLogin}
            disabled={isLoginDisabled}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>MASUK</Text>
            )}
          </TouchableHighlight>

          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.registerHint, { color: colors.primary, fontWeight: "700" }]}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 60,
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
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerHint: {
    fontSize: 14,
    color: "#888",
  },
});
