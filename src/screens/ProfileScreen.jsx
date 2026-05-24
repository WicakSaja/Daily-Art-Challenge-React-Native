// screens/ProfileScreen.jsx
// Mengambil data profil dari tabel "users" Supabase Database.
// Mengambil daftar challenge yang dikirim user dari tabel "challenges".
// Logout menggunakan Supabase Auth + hapus token di AsyncStorage.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated,
  ScrollView, TouchableOpacity, RefreshControl,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PenLine, Settings } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../libs/supabase';
import { formatDate } from '../utils/formatDate';
import { formatNumber } from '../utils/formatNumber';
import ChallengeCard from '../components/ChallengeCard';
import colors from '../styles/colors';

// Komponen stat box dengan animasi (dari BAB 6)
function AnimatedStatBox({ number, label, delay }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[styles.statBox, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.statNumber}>{formatNumber(number ?? 0)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [profileData, setProfileData] = useState(null);
  const [challenges,  setChallenges]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  // Animasi avatar (dari BAB 6)
  const avatarScaleAnim = useRef(new Animated.Value(0.7)).current;
  const avatarFadeAnim  = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(avatarScaleAnim, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(avatarFadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── GET profil dari tabel "users" ───────────────────────────
  const getDataProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error mengambil profil:', error.message);
    }
  };

  // ── GET challenges yang dikirim oleh user ini ───────────────
  const getDataChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setChallenges(data ?? []);
      }
    } catch (error) {
      console.error('Error mengambil challenge:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan kedua GET setiap kali layar difokuskan
  useFocusEffect(
    useCallback(() => {
      getDataProfile();
      getDataChallenges();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getDataProfile(), getDataChallenges()]).finally(() =>
      setRefreshing(false)
    );
  }, []);

  // ── Logout: Supabase signOut + hapus AsyncStorage ──────────
  const handleLogout = async () => {
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem('userData');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Tombol settings / logout */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <Settings color="#555" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Avatar dengan animasi */}
        <View style={styles.profileHeader}>
          <Animated.Image
            source={{ uri: profileData?.photo_url ?? 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80' }}
            style={[styles.avatar, { opacity: avatarFadeAnim, transform: [{ scale: avatarScaleAnim }] }]}
          />
          <Text style={styles.name}>{profileData?.full_name ?? '—'}</Text>
          <Text style={styles.bio}>
            Member sejak {profileData?.created_at ? formatDate(profileData.created_at) : '—'}
          </Text>
        </View>

        {/* Stat boxes dengan animasi stagger */}
        <View style={styles.statsContainer}>
          <AnimatedStatBox number={profileData?.total_challenges} label="Challenges" delay={100} />
          <AnimatedStatBox number={profileData?.total_favorites}  label="Favorites"  delay={250} />
          <AnimatedStatBox number={profileData?.total_completed}  label="Completed"  delay={400} />
        </View>

        {/* Daftar challenge milik user */}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>Challenge Saya</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : challenges.length > 0 ? (
            challenges.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <ChallengeCard challenge={item} isFavorite={false} onFavorite={() => {}} />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada challenge yang dikirim.</Text>
          )}
        </View>
      </ScrollView>

      {/* FAB: tambah challenge baru */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddChallenge')}
        activeOpacity={0.8}
      >
        <PenLine color="white" size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: colors.background },
  topBar:           { paddingTop: 55, paddingHorizontal: 20, paddingBottom: 8, alignItems: 'flex-end' },
  scrollContent:    { paddingBottom: 100, alignItems: 'center' },
  profileHeader:    { alignItems: 'center', paddingTop: 10 },
  avatar:           { width: 120, height: 120, borderRadius: 60 },
  name:             { fontSize: 22, fontWeight: 'bold', marginTop: 14 },
  bio:              { color: '#888', marginTop: 6, fontSize: 13 },
  statsContainer:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, width: '90%' },
  statBox:          { backgroundColor: 'white', width: 100, height: 100, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statNumber:       { fontSize: 22, fontWeight: 'bold' },
  statLabel:        { color: '#777', marginTop: 6, fontSize: 12 },
  challengeSection: { width: '90%', marginTop: 30 },
  sectionTitle:     { fontSize: 20, fontWeight: 'bold', marginBottom: 14 },
  cardWrapper:      { marginBottom: 16 },
  emptyText:        { color: '#999', fontSize: 14, textAlign: 'center', marginTop: 10 },
  floatingButton:   {
    position: 'absolute', bottom: 28, right: 24,
    backgroundColor: colors.primary, padding: 16, borderRadius: 16,
    elevation: 8, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
});
