// screens/RegisterScreen.jsx
// Registrasi menggunakan Supabase Auth (signUp) lalu menyimpan
// profil pengguna ke tabel "users" di Supabase Database.

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  TouchableHighlight, StyleSheet, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../libs/supabase';
import colors from '../styles/colors';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName,         setFullName]        = useState('');
  const [email,            setEmail]           = useState('');
  const [password,         setPassword]        = useState('');
  const [confirmPassword,  setConfirmPassword] = useState('');
  const [passwordVisible,  setPasswordVisible] = useState(false);
  const [confirmVisible,   setConfirmVisible]  = useState(false);
  const [isDisabled,       setDisabled]        = useState(true);
  const [loading,          setLoading]         = useState(false);

  useEffect(() => {
    setDisabled(!(fullName.trim() && email.trim() && password.trim() && confirmPassword.trim()));
  }, [fullName, email, password, confirmPassword]);

  // ── Supabase Auth: signUp + insert ke tabel users ─────────
  const handleRegister = async () => {
    // Validasi client-side
    let errorMessage = '';
    if (password !== confirmPassword) {
      errorMessage = 'Password dan konfirmasi password tidak cocok.';
    } else if (password.length < 8) {
      errorMessage = 'Password minimal harus 8 karakter.';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
      errorMessage = 'Password harus mengandung kombinasi huruf dan angka.';
    }

    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    setLoading(true);
    try {
      // 1. Daftarkan user ke Supabase Auth
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      // 2. Simpan data profil ke tabel "users"
      const { error: insertError } = await supabase.from('users').upsert({
        id:               authData.user.id,
        full_name:        fullName,
        email:            email,
        photo_url:        `https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80`,
        total_challenges: 0,
        total_favorites:  0,
        total_completed:  0,
        created_at:       new Date().toISOString(),
      });
      if (insertError) throw insertError;

      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.emoji}>🖌️</Text>
            <Text style={styles.header}>Buat Akun</Text>
            <Text style={styles.caption}>Bergabung dan mulai tantang kreativitasmu!</Text>

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
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} activeOpacity={0.6}>
                    {passwordVisible ? <EyeOff color="#aaa" size={20} /> : <Eye color="#aaa" size={20} />}
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
                  <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} activeOpacity={0.6}>
                    {confirmVisible ? <EyeOff color="#aaa" size={20} /> : <Eye color="#aaa" size={20} />}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableHighlight
              style={[styles.registerButton, { opacity: isDisabled ? 0.45 : 1 }]}
              underlayColor="#333"
              onPress={handleRegister}
              disabled={isDisabled || loading}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.registerButtonText}>DAFTAR SEKARANG</Text>}
            </TouchableHighlight>

            <View style={styles.loginRow}>
              <Text style={styles.hint}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.hint, { color: colors.primary, fontWeight: '700' }]}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:          { flexGrow: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, justifyContent: 'space-between' },
  emoji:              { fontSize: 40, marginBottom: 16 },
  header:             { fontSize: 30, fontWeight: '900', color: '#111' },
  caption:            { fontSize: 14, color: '#888', marginTop: 6, marginBottom: 36 },
  form:               { gap: 18 },
  label:              { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
  inputBox:           { backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: 14, height: 52, justifyContent: 'center' },
  inputRow:           { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input:              { fontSize: 14, color: '#222', padding: 0 },
  bottomSection:      { gap: 14, marginTop: 30 },
  registerButton:     { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  registerButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
  loginRow:           { flexDirection: 'row', justifyContent: 'center' },
  hint:               { fontSize: 14, color: '#888' },
});
