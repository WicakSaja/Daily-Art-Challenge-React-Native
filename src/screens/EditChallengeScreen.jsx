import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard,
  ActivityIndicator, Image,
} from 'react-native';
import { ArrowLeft, ImagePlus, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../libs/supabase';
import colors from '../styles/colors';

const CATEGORIES = ['Sketsa', 'Lukisan', 'Digital Art', 'Fotografi', 'Kolase', 'Ilustrasi'];
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced'];

export default function EditChallengeScreen({ route }) {
  const { challengeId } = route.params;
  const navigation = useNavigation();

  const [formData,  setFormData]  = useState({ title: '', description: '', category: '', level: '' });
  const [image,     setImage]     = useState(null);  // URI yang tampil (bisa lama atau baru)
  const [oldImage,  setOldImage]  = useState(null);  // URL lama dari DB
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // ── SELECT (prefill form) ───────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', challengeId)
          .single();
        if (error) throw error;
        if (data) {
          setFormData({
            title:       data.title       ?? '',
            description: data.description ?? '',
            category:    data.category    ?? '',
            level:       data.level       ?? '',
          });
          setImage(data.image);
          setOldImage(data.image);
        }
      } catch (error) {
        Alert.alert('Error', 'Gagal memuat data challenge.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [challengeId]);

  // ── Pilih gambar baru dari galeri ───────────────────────────
  const handleImagePick = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Izin diperlukan', 'Izin akses galeri diperlukan.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipulated.uri);
    }
  };

  // ── Upload gambar baru ke Storage (hanya jika berubah) ─────
  const uploadNewImage = async (localUri) => {
    let filename = localUri.substring(localUri.lastIndexOf('/') + 1);
    const ext    = filename.split('.').pop();
    const base   = filename.split('.').slice(0, -1).join('.');
    filename     = `${base}_${Date.now()}.${ext}`;

    const fileResponse = await fetch(localUri);
    const arrayBuffer  = await fileResponse.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('challenge-images')
      .upload(filename, arrayBuffer, { contentType: 'image/jpeg', upsert: true });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('challenge-images')
      .getPublicUrl(filename);
    return publicUrl;
  };

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.category && formData.level;

  // ── UPDATE challenge di Supabase Database ──────────────────
  const handleUpdate = async () => {
    if (!isFormValid) {
      Alert.alert('Perhatian', 'Harap lengkapi semua field wajib.');
      return;
    }
    setSaving(true);
    try {
      // Jika gambar diganti (bukan URL lama), upload dulu
      let finalImageUrl = oldImage;
      if (image && image !== oldImage) {
        finalImageUrl = await uploadNewImage(image);
      }

      const { error } = await supabase
        .from('challenges')
        .update({
          title:       formData.title,
          description: formData.description,
          image:       finalImageUrl,
          category:    formData.category,
          level:       formData.level,
        })
        .eq('id', challengeId);
      if (error) throw error;

      navigation.navigate('ChallengeDetail', { challengeId });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message ?? 'Gagal memperbarui challenge.');
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ArrowLeft color="#222" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
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
                  onChangeText={(t) => handleChange('title', t)}
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
                  onChangeText={(t) => handleChange('description', t)}
                  style={[styles.input, { textAlignVertical: 'top' }]}
                  multiline
                  maxLength={300}
                />
              </View>
              <Text style={styles.charCount}>{formData.description.length}/300</Text>
            </View>

            {/* Gambar */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gambar Challenge</Text>
              {image ? (
                <View style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                    <X color="white" size={16} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick} activeOpacity={0.7}>
                  <ImagePlus color="#bbb" size={36} />
                  <Text style={styles.imagePickerText}>Pilih gambar baru</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Kategori */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kategori *</Text>
              <View style={styles.chipGroup}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat} onPress={() => handleChange('category', cat)} style={[styles.chip, formData.category === cat && styles.chipActive]} activeOpacity={0.7}>
                    <Text style={[styles.chipText, formData.category === cat && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Tingkat Kesulitan *</Text>
              <View style={styles.chipGroup}>
                {LEVELS.map((lvl) => (
                  <TouchableOpacity key={lvl} onPress={() => handleChange('level', lvl)} style={[styles.chip, formData.level === lvl && styles.chipActive]} activeOpacity={0.7}>
                    <Text style={[styles.chipText, formData.level === lvl && styles.chipTextActive]}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

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

          {saving && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Menyimpan...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: colors.background },
  centered:          { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 14, backgroundColor: colors.background, elevation: 3 },
  headerTitle:       { fontSize: 16, fontWeight: 'bold', color: '#222' },
  formContent:       { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 20 },
  fieldGroup:        { gap: 6 },
  label:             { fontSize: 14, fontWeight: '600', color: '#444' },
  inputBox:          { backgroundColor: 'white', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E8E8E8' },
  input:             { fontSize: 14, color: '#222', padding: 0 },
  charCount:         { fontSize: 11, color: '#bbb', alignSelf: 'flex-end' },
  imagePicker:       { backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: '#E8E8E8', borderStyle: 'dashed', paddingVertical: 30, alignItems: 'center', gap: 10 },
  imagePickerText:   { fontSize: 13, color: '#bbb' },
  imagePreviewWrapper: { position: 'relative' },
  imagePreview:      { width: '100%', height: 160, borderRadius: 14 },
  removeImageBtn:    { position: 'absolute', top: -8, right: -8, backgroundColor: '#E53935', borderRadius: 20, padding: 4 },
  chipGroup:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:              { backgroundColor: '#EFEFEF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipActive:        { backgroundColor: '#222' },
  chipText:          { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive:    { color: 'white' },
  bottomBar:         { padding: 16, paddingBottom: 24, backgroundColor: colors.background, elevation: 8 },
  updateButton:      { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  updateDisabled:    { opacity: 0.45 },
  updateText:        { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:       { color: 'white', fontWeight: '600', fontSize: 14 },
});
