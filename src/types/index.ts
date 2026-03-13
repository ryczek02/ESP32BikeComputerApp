export type ConnectionState =
  | "disconnected"
  | "scanning"
  | "connecting"
  | "connected";

export type RideState = "idle" | "recording" | "paused";

export interface GpsData {
  lat: number;
  lon: number;
  speed: number; // km/h
  heading: number; // degrees
  timestamp: number; // epoch seconds
}

export interface Settings {
  brightness: number; // 0-255
  dimTimeout: number; // value * 5 = seconds
  units: number; // 0=metric, 1=imperial
}

export interface RideStats {
  distance: number; // meters
  elapsed: number; // seconds
  avgSpeed: number; // km/h
  speed: number; // km/h
  waypointIndex: number;
  turnDistance: number; // meters
}

export interface BatteryInfo {
  percent: number;
  charging: boolean;
  usb: boolean;
}
