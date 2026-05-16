import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { profile } from "../data/profile";
import colors from "../styles/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: profile.avatar,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {profile.name}
        </Text>
        <Text style={styles.bio}>
          {profile.bio}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            25
          </Text>
          <Text style={styles.statLabel}>
            Challenges
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            12
          </Text>
          <Text style={styles.statLabel}>
            Favorites
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            8
          </Text>
          <Text style={styles.statLabel}>
            Completed
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 16,
  },
  bio: {
    color: "#777",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    width: "90%",
  },
  statBox: {
    backgroundColor: "white",
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#777",
    marginTop: 6,
  },
});