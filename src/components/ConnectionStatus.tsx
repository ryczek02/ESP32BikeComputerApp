import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ConnectionState } from "../types";
import { useTheme } from "../hooks/useTheme";

interface Props {
  state: ConnectionState;
}

export function ConnectionStatus({ state }: Props) {
  const { colors } = useTheme();

  const dotColor =
    state === "connected"
      ? colors.green
      : state === "disconnected"
        ? colors.red
        : colors.orange;

  const label =
    state === "connected"
      ? "Connected"
      : state === "scanning"
        ? "Scanning..."
        : state === "connecting"
          ? "Connecting..."
          : "Disconnected";

  return (
    <View style={[styles.badge, { backgroundColor: dotColor + "20" }]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.text, { color: dotColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
