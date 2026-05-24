import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Search, ArrowLeft, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ searchPhrase, setSearchPhrase }) => {
  const navigation = useNavigation();

  // Animasi entrance: elemen muncul dari kiri dengan scale bounce
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          gap: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }),
        },
      ]}
    >
      {/* Tombol back dengan animasi scale masuk */}
      <Animated.View
        style={{
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 1.2, 1],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
        >
          <ArrowLeft color="#999" size={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* Input pencarian */}
      <View style={styles.bar}>
        <Search
          size={18}
          color={searchPhrase ? "#222" : "#aaa"}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Cari challenge seni..."
          placeholderTextColor="#aaa"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          autoCorrect={false}
          autoFocus={true}
          returnKeyType="search"
          underlineColorAndroid="transparent"
        />
        {/* Tombol clear tampil saat ada teks */}
        {searchPhrase.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchPhrase("")}
            activeOpacity={0.6}
          >
            <X size={18} color="#333" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F1F1F1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    padding: 0,
  },
});
