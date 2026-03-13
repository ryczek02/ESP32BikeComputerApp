import { useState, useCallback, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import type {
  ConnectionState,
  GpsData,
  Settings,
  RideStats,
  BatteryInfo,
} from "../types";
import {
  BLE_SERVICE_UUID,
  BLE_UUID_GPS_DATA,
  BLE_UUID_SETTINGS,
  BLE_UUID_ROUTE_CONTROL,
  BLE_UUID_RIDE_STATE,
  BLE_UUID_RIDE_STATS,
  BLE_UUID_BATTERY,
  BLE_UUID_CUR_SETTINGS,
  DEVICE_NAME,
} from "../constants";
import {
  encodeGpsData,
  encodeSettings,
  encodeRouteControl,
  decodeRideState,
  decodeRideStats,
  decodeBattery,
  decodeSettings,
} from "../services/bleProtocol";

// Module-level — survives background task context
const bleManager = new BleManager();
let connectedDevice: Device | null = null;

// Exported for background task to send GPS without React context
export async function sendGpsFromBackground(data: GpsData) {
  if (!connectedDevice) return;
  try {
    await connectedDevice.writeCharacteristicWithoutResponseForService(
      BLE_SERVICE_UUID,
      BLE_UUID_GPS_DATA,
      encodeGpsData(data)
    );
  } catch (e) {
    // device may have disconnected
  }
}

export function useBLE() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [rideState, setRideState] = useState(0);
  const [rideStats, setRideStats] = useState<RideStats | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [espSettings, setEspSettings] = useState<Settings | null>(null);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return Object.values(granted).every(
        (v) => v === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  }, []);

  const connect = useCallback(async () => {
    const ok = await requestPermissions();
    if (!ok) return;

    setConnectionState("scanning");

    bleManager.startDeviceScan(
      [BLE_SERVICE_UUID],
      null,
      async (error, device) => {
        if (error) {
          console.error("Scan error:", error);
          setConnectionState("disconnected");
          return;
        }
        if (!device || device.name !== DEVICE_NAME) return;

        bleManager.stopDeviceScan();
        setConnectionState("connecting");

        try {
          const connected = await device.connect();
          await connected.discoverAllServicesAndCharacteristics();
          connectedDevice = connected;
          setConnectionState("connected");

          // Subscribe to notifications
          connected.monitorCharacteristicForService(
            BLE_SERVICE_UUID,
            BLE_UUID_RIDE_STATE,
            (err, char) => {
              if (err || !char?.value) return;
              setRideState(decodeRideState(char.value));
            }
          );

          connected.monitorCharacteristicForService(
            BLE_SERVICE_UUID,
            BLE_UUID_RIDE_STATS,
            (err, char) => {
              if (err || !char?.value) return;
              setRideStats(decodeRideStats(char.value));
            }
          );

          connected.monitorCharacteristicForService(
            BLE_SERVICE_UUID,
            BLE_UUID_BATTERY,
            (err, char) => {
              if (err || !char?.value) return;
              setBattery(decodeBattery(char.value));
            }
          );

          connected.monitorCharacteristicForService(
            BLE_SERVICE_UUID,
            BLE_UUID_CUR_SETTINGS,
            (err, char) => {
              if (err || !char?.value) return;
              setEspSettings(decodeSettings(char.value));
            }
          );

          // Handle disconnect
          bleManager.onDeviceDisconnected(device.id, () => {
            connectedDevice = null;
            setConnectionState("disconnected");
          });
        } catch (err) {
          console.error("Connect error:", err);
          setConnectionState("disconnected");
        }
      }
    );
  }, [requestPermissions]);

  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      connectedDevice = null;
    }
    setConnectionState("disconnected");
  }, []);

  const sendGps = useCallback(async (data: GpsData) => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        BLE_SERVICE_UUID,
        BLE_UUID_GPS_DATA,
        encodeGpsData(data)
      );
    } catch (e) {}
  }, []);

  const sendSettings = useCallback(async (s: Settings) => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        BLE_SERVICE_UUID,
        BLE_UUID_SETTINGS,
        encodeSettings(s)
      );
    } catch (e) {}
  }, []);

  const sendRouteCommand = useCallback(async (cmd: number) => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        BLE_SERVICE_UUID,
        BLE_UUID_ROUTE_CONTROL,
        encodeRouteControl(cmd)
      );
    } catch (e) {}
  }, []);

  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  return {
    connectionState,
    rideState,
    rideStats,
    battery,
    espSettings,
    connect,
    disconnect,
    sendGps,
    sendSettings,
    sendRouteCommand,
  };
}
