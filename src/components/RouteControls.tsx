import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CMD_START, CMD_PAUSE, CMD_STOP } from "../constants";
import { useTheme } from "../hooks/useTheme";

interface Props {
  rideState: number;
  onCommand: (cmd: number) => void;
}

export function RouteControls({ rideState, onCommand }: Props) {
  const { colors } = useTheme();

  const Button = ({
    label,
    color,
    onPress,
  }: {
    label: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {rideState === 0 && (
        <Button
          label="Start Ride"
          color={colors.green}
          onPress={() => onCommand(CMD_START)}
        />
      )}
      {rideState === 1 && (
        <>
          <Button
            label="Pause"
            color={colors.orange}
            onPress={() => onCommand(CMD_PAUSE)}
          />
          <Button
            label="Stop"
            color={colors.red}
            onPress={() => onCommand(CMD_STOP)}
          />
        </>
      )}
      {rideState === 2 && (
        <>
          <Button
            label="Resume"
            color={colors.green}
            onPress={() => onCommand(CMD_START)}
          />
          <Button
            label="Stop"
            color={colors.red}
            onPress={() => onCommand(CMD_STOP)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
