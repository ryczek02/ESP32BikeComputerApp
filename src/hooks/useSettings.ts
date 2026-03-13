import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Settings } from "../types";

const STORAGE_KEY = "bike_settings";

const DEFAULT_SETTINGS: Settings = {
  brightness: 200,
  dimTimeout: 3, // 3 * 5 = 15 seconds
  units: 0, // metric
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(json) });
        } catch {}
      }
    });
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<Settings>) => {
      const next = { ...settings, ...partial };
      setSettings(next);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
    [settings]
  );

  return { settings, updateSettings };
}
