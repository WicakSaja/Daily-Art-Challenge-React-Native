// Konfigurasi client Supabase untuk DailyArtChallenge.
// Menggunakan AsyncStorage agar sesi pengguna tetap tersimpan
// meski aplikasi ditutup dan dibuka kembali.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = 'https://vfesbeshmwmlwlttlihz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZXNiZXNobXdtbHdsdHRsaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzYyNzAsImV4cCI6MjA5NTIxMjI3MH0.RzFkZWeBVkn2uT-PO8BpQG_JgYVBPLt1BYUeFRDzyzc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,      // simpan sesi di AsyncStorage
    autoRefreshToken: true,     // refresh token otomatis sebelum kadaluarsa
    persistSession: true,       // sesi bertahan saat app dimatikan
    detectSessionInUrl: false,  // nonaktifkan deteksi URL (tidak relevan di mobile)
  },
});
