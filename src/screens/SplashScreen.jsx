// screens/SplashScreen.jsx
// Mengecek token AsyncStorage saat aplikasi pertama kali dibuka.
// Jika token masih valid → langsung ke MainApp, jika tidak → ke Login.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../styles/colors';

export default function SplashScreen() {
  const navigation = useNavigation();

  // Animasi logo (dari BAB 6)
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Jalankan animasi masuk
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4,   useNativeDriver: true }),
    ]).start();

    // Cek token setelah animasi selesai
    checkToken();
  }, []);

  // ── Cek AsyncStorage: apakah token masih berlaku? ──────────
  const checkToken = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        const { token, expires } = JSON.parse(userDataJSON);
        if (token && expires) {
          const currentTime = new Date().getTime();
          const destination  = currentTime <= expires ? 'Main' : 'Login';
          setTimeout(() => navigation.replace(destination), 1500);
          return;
        }
      }
      setTimeout(() => navigation.replace('Login'), 1500);
    } catch (error) {
      console.error('Error memeriksa token:', error);
      setTimeout(() => navigation.replace('Login'), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}
      >
        <Text style={styles.logo}>🎨</Text>
        <Text style={styles.appName}>Daily Art</Text>
        <Text style={styles.appSub}>Challenge</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Presented by</Text>
        <Text style={styles.footerBold}>Bayu Wicaksono @2318035</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  logo:      { fontSize: 64, marginBottom: 12 },
  appName:   { fontSize: 36, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  appSub:    { fontSize: 20, fontWeight: '400', color: '#888', letterSpacing: 3 },
  footer:    { position: 'absolute', bottom: 30, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#aaa' },
  footerBold: { fontSize: 12, fontWeight: '600', color: '#888', textAlign: 'center' },
});
