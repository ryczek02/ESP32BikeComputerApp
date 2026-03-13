import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../hooks/useTheme";

const PROFILE_KEY = "bike_profile";

interface Profile {
  name: string;
  email: string;
}

export function ProfileScreen() {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((json) => {
      if (json) {
        try {
          const p = JSON.parse(json) as Profile;
          setProfile(p);
          setName(p.name);
          setEmail(p.email);
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const save = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }
    const p: Profile = { name: name.trim(), email: email.trim() };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    setName("");
    setEmail("");
  };

  if (!loaded) return null;

  // Logged in view
  if (profile) {
    return (
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.groupedBackground }]}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View
            style={[styles.avatar, { backgroundColor: colors.tint + "30" }]}
          >
            <Text style={[styles.avatarText, { color: colors.tint }]}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {profile.name}
          </Text>
          {profile.email ? (
            <Text style={[styles.profileEmail, { color: colors.secondaryText }]}>
              {profile.email}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.card }]}
          onPress={logout}
        >
          <Text style={[styles.logoutText, { color: colors.red }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Login form
  return (
    <KeyboardAvoidingView
      style={[styles.scroll, { backgroundColor: colors.groupedBackground }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <Text style={[styles.loginTitle, { color: colors.text }]}>
          Sign In
        </Text>
        <Text style={[styles.loginSubtitle, { color: colors.secondaryText }]}>
          Enter your details to save your profile
        </Text>

        <View
          style={[styles.inputSection, { backgroundColor: colors.groupedCard }]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderBottomColor: colors.separator,
              },
            ]}
            placeholder="Name"
            placeholderTextColor={colors.tertiaryText}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, styles.inputLast, { color: colors.text }]}
            placeholder="Email (optional)"
            placeholderTextColor={colors.tertiaryText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.tint }]}
          onPress={save}
        >
          <Text style={styles.saveBtnText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  loginContainer: {
    padding: 16,
    paddingTop: 40,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
  },
  inputSection: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 24,
  },
  input: {
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputLast: {
    borderBottomWidth: 0,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  profileCard: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 15,
    marginTop: 4,
  },
  logoutBtn: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "400",
  },
});
