import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ConnectionStatus } from "../components/ConnectionStatus";
import { RouteControls } from "../components/RouteControls";
import { useBLEContext } from "../contexts/BLEContext";
import { useLocation } from "../hooks/useLocation";
import { useTheme } from "../hooks/useTheme";
import type { GpsData } from "../types";

export function HomeScreen() {
  const { colors } = useTheme();
  const {
    connectionState,
    rideState,
    rideStats,
    battery,
    connect,
    disconnect,
    sendGps,
    sendRouteCommand,
  } = useBLEContext();

  const onGpsUpdate = useCallback(
    (data: GpsData) => {
      sendGps(data);
    },
    [sendGps]
  );

  const { currentLocation, startTracking, stopTracking } =
    useLocation(onGpsUpdate);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.groupedBackground }]}
      contentContainerStyle={styles.content}
    >
      {/* Connection */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.connectionRow}>
          <ConnectionStatus state={connectionState} />
          {connectionState === "disconnected" ? (
            <TouchableOpacity
              style={[styles.connectBtn, { backgroundColor: colors.tint }]}
              onPress={connect}
            >
              <Text style={styles.connectBtnText}>Connect</Text>
            </TouchableOpacity>
          ) : connectionState === "connected" ? (
            <TouchableOpacity
              style={[styles.connectBtn, { backgroundColor: colors.secondaryText }]}
              onPress={disconnect}
            >
              <Text style={styles.connectBtnText}>Disconnect</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* GPS */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardHeader, { color: colors.secondaryText }]}>
          GPS
        </Text>
        {currentLocation ? (
          <>
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {currentLocation.lat.toFixed(5)}, {currentLocation.lon.toFixed(5)}
            </Text>
            <Text style={[styles.cardDetail, { color: colors.secondaryText }]}>
              {currentLocation.speed.toFixed(1)} km/h · {currentLocation.heading.toFixed(0)}°
            </Text>
          </>
        ) : (
          <Text style={[styles.cardDetail, { color: colors.tertiaryText }]}>
            Waiting for GPS fix...
          </Text>
        )}
      </View>

      {/* Battery */}
      {battery && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardHeader, { color: colors.secondaryText }]}>
            ESP32 Battery
          </Text>
          <Text
            style={[
              styles.cardValue,
              {
                color:
                  battery.percent < 20
                    ? colors.red
                    : battery.percent < 50
                      ? colors.orange
                      : colors.green,
              },
            ]}
          >
            {battery.percent}%
          </Text>
          <Text style={[styles.cardDetail, { color: colors.secondaryText }]}>
            {battery.charging ? "Charging" : "On battery"}
            {battery.usb ? " · USB" : ""}
          </Text>
        </View>
      )}

      {/* Ride Stats */}
      {rideStats && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardHeader, { color: colors.secondaryText }]}>
            Ride
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {rideStats.speed.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.tertiaryText }]}>
                km/h
              </Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {(rideStats.distance / 1000).toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.tertiaryText }]}>
                km
              </Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatTime(rideStats.elapsed)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.tertiaryText }]}>
                time
              </Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {rideStats.avgSpeed.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.tertiaryText }]}>
                avg km/h
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Controls */}
      <RouteControls rideState={rideState} onCommand={sendRouteCommand} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  connectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  cardDetail: {
    fontSize: 15,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCell: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});
