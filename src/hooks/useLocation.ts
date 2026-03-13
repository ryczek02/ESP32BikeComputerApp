import { useState, useEffect, useRef, useCallback } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import type { GpsData } from "../types";
import {
  BACKGROUND_LOCATION_TASK,
  GPS_INTERVAL_MS,
  GPS_DISTANCE_FILTER_M,
} from "../constants";
import { sendGpsFromBackground } from "./useBLE";

// Module-level compass heading
let lastCompassHeading = 0;

// Background task — runs even when app is suspended
// Uses module-level sendGpsFromBackground (no React context needed)
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;

  const { locations } = data as { locations: Location.LocationObject[] };
  if (!locations?.length) return;

  const loc = locations[locations.length - 1];
  const gpsData: GpsData = {
    lat: loc.coords.latitude,
    lon: loc.coords.longitude,
    speed: Math.max(0, (loc.coords.speed ?? 0) * 3.6),
    heading: lastCompassHeading,
    timestamp: Math.floor(loc.timestamp / 1000),
  };

  await sendGpsFromBackground(gpsData);
});

export function useLocation(onGpsUpdate: (data: GpsData) => void) {
  const [hasPermission, setHasPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GpsData | null>(null);
  const callbackRef = useRef(onGpsUpdate);
  callbackRef.current = onGpsUpdate;
  const headingRef = useRef(0);

  const startTracking = useCallback(async () => {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") {
      console.warn("Foreground location permission denied");
      return;
    }
    setHasPermission(true);

    // Compass heading (best effort)
    try {
      await Location.watchHeadingAsync((headingData) => {
        headingRef.current = headingData.trueHeading;
        lastCompassHeading = headingData.trueHeading;
      });
    } catch (e) {
      console.warn("Compass not available:", e);
    }

    // Foreground GPS watch
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: GPS_INTERVAL_MS,
        distanceInterval: GPS_DISTANCE_FILTER_M,
      },
      (loc) => {
        const data: GpsData = {
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          speed: Math.max(0, (loc.coords.speed ?? 0) * 3.6),
          heading: headingRef.current,
          timestamp: Math.floor(loc.timestamp / 1000),
        };
        setCurrentLocation(data);
        callbackRef.current(data);
      }
    );

    // Background location (optional)
    try {
      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (bg === "granted") {
        const isStarted = await Location.hasStartedLocationUpdatesAsync(
          BACKGROUND_LOCATION_TASK
        ).catch(() => false);

        if (!isStarted) {
          await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: GPS_INTERVAL_MS,
            distanceInterval: GPS_DISTANCE_FILTER_M,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: "Bike Computer",
              notificationBody: "GPS tracking active",
            },
          });
        }
      }
    } catch (e) {
      console.warn("Background location error:", e);
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const isStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_LOCATION_TASK
      ).catch(() => false);
      if (isStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }
    } catch (e) {}
  }, []);

  return {
    hasPermission,
    currentLocation,
    startTracking,
    stopTracking,
  };
}
