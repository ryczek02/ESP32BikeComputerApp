import React from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { BLEProvider } from "./src/contexts/BLEContext";

const Tab = createBottomTabNavigator();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f2f2f7",
    card: "#ffffff",
    text: "#000000",
    border: "#c6c6c8",
    primary: "#007aff",
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    card: "#1c1c1e",
    text: "#ffffff",
    border: "#38383a",
    primary: "#0a84ff",
  },
};

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; outline: keyof typeof Ionicons.glyphMap }> = {
  Ride: { focused: "bicycle", outline: "bicycle-outline" },
  Settings: { focused: "settings", outline: "settings-outline" },
  Profile: { focused: "person", outline: "person-outline" },
};

export default function App() {
  const scheme = useColorScheme();

  return (
    <BLEProvider>
      <NavigationContainer theme={scheme === "dark" ? AppDarkTheme : LightTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size, focused }) => {
              const icons = TAB_ICONS[route.name];
              const iconName = focused ? icons.focused : icons.outline;
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: true,
          })}
        >
          <Tab.Screen
            name="Ride"
            component={HomeScreen}
            options={{ title: "Ride" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </BLEProvider>
  );
}
