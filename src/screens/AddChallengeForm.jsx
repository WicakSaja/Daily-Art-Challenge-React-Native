// screens/AddChallengeForm.jsx
// Mengirim challenge baru ke Supabase Database (INSERT ke tabel "challenges").
// Gambar diunggah ke Supabase Storage (bucket: "challenge-images")
// lalu public URL-nya disimpan di kolom "image" tabel challenges.

import React, { useState } from 'react';
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

export default function AddChallengeForm() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({ title: '', description: '', category: '', level: '' });
  const [image,    setImage]    = useState(null); // URI lokal gambar yang dipilih
  const [loading,  setLoading]  = useState(false);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.category && formData.level;

  // ── Pilih gambar dari galeri & compress ───────────────────
  const handleImagePick = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Izin diperlukan', 'Izin akses galeri diperlukan untuk mengunggah gambar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      // Kompres & resize gambar sebelum upload
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipulated.uri);
    }
  };

  // ── Upload gambar ke Supabase Storage ─────────────────────
  const uploadImageToStorage = async (localUri) => {
    let filename  = localUri.substring(localUri.lastIndexOf('/') + 1);
    const ext     = filename.split('.').pop();
    const base    = filename.split('.').slice(0, -1).join('.');
    filename      = `${base}_${Date.now()}.${ext}`;

    const fileResponse  = await fetch(localUri);
    const arrayBuffer   = await fileResponse.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('challenge-images')
      .upload(filename, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('challenge-images')
      .getPublicUrl(filename);

    return publicUrl;
  };

  // ── INSERT challenge ke Supabase Database ─────────────────
  const handleUpload = async () => {
    if (!isFormValid) {
      Alert.alert('Perhatian', 'Harap lengkapi semua field yang wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Upload gambar jika ada, dapatkan public URL-nya
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToStorage(image);
      }

      // Simpan challenge ke tabel "challenges"
      const { error: insertError } = await supabase.from('challenges').insert({
        title:       formData.title,
        description: formData.description,
        image:       imageUrl,
        category:    formData.category,
        level:       formData.level,
        is_featured: false,
        user_id:     user?.id ?? null,
        created_at:  new Date().toISOString(),
      });
      if (insertError) throw insertError;

      navigation.navigate('Main', { screen: 'Profile' });
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', error.message ?? 'Gagal mengirim challenge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ArrowLeft color="#222" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.headerTitle}>Tambah Challenge</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Judul */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Judul *</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Contoh: Sketsa Wajah Realistis"
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
                  placeholder="Jelaskan detail challenge..."
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

            {/* Upload Gambar → Supabase Storage */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gambar Challenge (opsional)</Text>
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
                  <Text style={styles.imagePickerText}>Pilih gambar dari galeri</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Kategori */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Kategori *</Text>
              <View style={styles.chipGroup}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleChange('category', cat)}
                    style={[styles.chip, formData.category === cat && styles.chipActive]}
                    activeOpacity={0.7}
                  >
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
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => handleChange('level', lvl)}
                    style={[styles.chip, formData.level === lvl && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, formData.level === lvl && styles.chipTextActive]}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Tombol kirim */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.submitButton, !isFormValid && styles.submitDisabled]}
              onPress={handleUpload}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Kirim Challenge</Text>
            </TouchableOpacity>
          </View>

          {/* Loading overlay saat proses upload */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Mengunggah...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: colors.background },
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
  submitButton:      { backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  submitDisabled:    { opacity: 0.45 },
  submitText:        { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText:       { color: 'white', fontWeight: '600', fontSize: 14 },
});
