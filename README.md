# Bike Computer - Phone App

React Native (Expo) companion app for the ESP32 bike computer. Sends GPS + compass data over BLE.

## Setup

```bash
cd app
npm install
npx expo run:ios    # or npx expo run:android
```

## Features

- BLE connection to ESP32 "BikeESP"
- GPS + compass tracking (foreground + background)
- Binary BLE protocol (matching ESP32 structs)
- Ride controls: Start / Pause / Stop
- Settings sync: orientation, brightness, dim timeout, units
- Real-time ride stats from ESP32

## Architecture

```
src/
  types/          - TypeScript types
  constants/      - BLE UUIDs, intervals
  services/       - Binary encode/decode
  hooks/          - useBLE, useLocation, useSettings
  components/     - RouteControls, ConnectionStatus, SettingItem
  screens/        - HomeScreen, SettingsScreen
```

## Permissions

- **iOS**: Location Always, Bluetooth
- **Android**: Fine Location, Background Location, Bluetooth Scan/Connect

## Testing

1. Build and install on device
2. Verify BLE scan finds "BikeESP"
3. Walk around -> check GPS data on ESP32 serial
4. Rotate phone -> verify heading changes
5. Settings -> change values -> verify on ESP32
6. Start/Pause/Stop -> verify ride state
