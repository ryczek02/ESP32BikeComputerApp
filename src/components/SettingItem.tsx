import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface Props {
  label: string;
  value: string;
  onPress: () => void;
}

export function SettingItem({ label, value, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.groupedCard, borderBottomColor: colors.separator }]}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.right}>
        <Text style={[styles.value, { color: colors.secondaryText }]}>
          {value}
        </Text>
        <Text style={[styles.chevron, { color: colors.tertiaryText }]}>
          {"\u203A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
  label: {
    fontSize: 17,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 17,
    marginRight: 6,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
  },
});
