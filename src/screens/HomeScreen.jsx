// screens/HomeScreen.jsx
// Mengambil daftar challenge dari Supabase Database (SELECT dari tabel "challenges").

import React, { useState, useCallback } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import ChallengeCard from '../components/ChallengeCard';
import FeaturedCard from '../components/FeaturedCard';
import CategoryList from '../components/CategoryList';
import colors from '../styles/colors';
import { supabase } from '../libs/supabase';

export default function HomeScreen() {
  const [challenges, setChallenges]             = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorite, setFavorite]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [refreshing, setRefreshing]             = useState(false);

  // ── SELECT semua challenge dari Supabase ────────────────────
  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChallenges(data ?? []);
    } catch (error) {
      console.error('Gagal mengambil challenges:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChallenges().finally(() => setRefreshing(false));
  }, []);

  const categories = ['All', ...new Set(challenges.map((c) => c.category))];
  const filteredChallenges =
    selectedCategory === 'All'
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);
  const featuredChallenge = filteredChallenges.find((c) => c.is_featured);
  const regularChallenges = filteredChallenges.filter((c) => !c.is_featured);

  const toggleFavorite = (id) =>
    setFavorite((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      <Header />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {featuredChallenge && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Challenge</Text>
          <FeaturedCard challenge={featuredChallenge} />
        </View>
      )}

      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>All Challenges</Text>
        {regularChallenges.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada challenge tersedia.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {regularChallenges.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <ChallengeCard
                  challenge={item}
                  isFavorite={favorite.includes(item.id)}
                  onFavorite={() => toggleFavorite(item.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: colors.background },
  centered:         { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  featuredSection:  { paddingHorizontal: 20, marginBottom: 30 },
  challengeSection: { marginBottom: 30 },
  sectionTitle:     { fontSize: 22, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 20 },
  horizontalList:   { paddingHorizontal: 20, gap: 16 },
  cardWrapper:      { width: 300 },
  emptyText:        { paddingHorizontal: 20, color: '#999', fontSize: 14 },
});
