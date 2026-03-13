import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SettingItem } from "../components/SettingItem";
import { useSettings } from "../hooks/useSettings";
import { useBLEContext } from "../contexts/BLEContext";
import { useTheme } from "../hooks/useTheme";

const UNIT_LABELS = ["Metric (km/h)", "Imperial (mph)"];
const BRIGHTNESS_STEPS = [50, 100, 150, 200, 250];

export function SettingsScreen() {
  const { colors } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { sendSettings } = useBLEContext();

  const apply = (partial: Partial<typeof settings>) => {
    const next = updateSettings(partial);
    sendSettings(next);
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.groupedBackground }]}
    >
      <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
        ESP32 DISPLAY
      </Text>
      <View style={[styles.section, { backgroundColor: colors.groupedCard }]}>
        <SettingItem
          label="Brightness"
          value={String(settings.brightness)}
          onPress={() => {
            const idx = BRIGHTNESS_STEPS.indexOf(settings.brightness);
            const next = idx >= 0 ? (idx + 1) % BRIGHTNESS_STEPS.length : 0;
            apply({ brightness: BRIGHTNESS_STEPS[next] });
          }}
        />
        <SettingItem
          label="Dim Timeout"
          value={`${settings.dimTimeout * 5}s`}
          onPress={() =>
            apply({
              dimTimeout: settings.dimTimeout >= 12 ? 1 : settings.dimTimeout + 1,
            })
          }
        />
        <SettingItem
          label="Units"
          value={UNIT_LABELS[settings.units]}
          onPress={() => apply({ units: (settings.units + 1) % 2 })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "400",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
  },
});
