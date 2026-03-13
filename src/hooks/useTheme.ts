import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  return {
    dark,
    colors: {
      background: dark ? "#000000" : "#f2f2f7",
      card: dark ? "#1c1c1e" : "#ffffff",
      text: dark ? "#ffffff" : "#000000",
      secondaryText: dark ? "#8e8e93" : "#6c6c70",
      tertiaryText: dark ? "#636366" : "#aeaeb2",
      separator: dark ? "#38383a" : "#c6c6c8",
      groupedBackground: dark ? "#000000" : "#f2f2f7",
      groupedCard: dark ? "#1c1c1e" : "#ffffff",
      tint: "#007aff",
      green: "#34c759",
      red: "#ff3b30",
      orange: "#ff9500",
      yellow: "#ffcc00",
    },
  };
}
