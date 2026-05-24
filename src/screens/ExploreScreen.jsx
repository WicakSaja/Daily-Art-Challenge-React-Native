// screens/ExploreScreen.jsx
// SELECT semua challenge dari Supabase untuk tampilan grid.

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import ChallengeCard from '../components/ChallengeCard';
import colors from '../styles/colors';
import { supabase } from '../libs/supabase';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChallenges(data ?? []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchChallenges(); }, []));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChallenges().finally(() => setRefreshing(false));
  }, []);

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore Arts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')} activeOpacity={0.7} style={styles.searchButton}>
          <Search color="#222" size={22} />
        </TouchableOpacity>
      </View>

      {challenges.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada challenge.</Text>
      ) : (
        <View style={styles.grid}>
          {challenges.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <ChallengeCard challenge={item} isFavorite={false} onFavorite={() => {}} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  centered:     { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  headerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  title:        { fontSize: 28, fontWeight: 'bold' },
  searchButton: { backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 2 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  cardWrapper:  { width: '48%', marginBottom: 20 },
  emptyText:    { paddingHorizontal: 20, color: '#999', fontSize: 14 },
});
