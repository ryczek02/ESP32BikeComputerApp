import { Buffer } from "buffer";
import type { GpsData, Settings, RideStats, BatteryInfo } from "../types";

// Encode GPS data to 16-byte binary buffer
export function encodeGpsData(data: GpsData): string {
  const buf = Buffer.alloc(16);
  buf.writeInt32LE(Math.round(data.lat * 1e7), 0);
  buf.writeInt32LE(Math.round(data.lon * 1e7), 4);
  buf.writeUInt16LE(Math.round(data.speed * 100), 8);
  buf.writeUInt16LE(Math.round(data.heading * 100), 10);
  buf.writeUInt32LE(data.timestamp, 12);
  return buf.toString("base64");
}

// Encode settings to 8-byte binary buffer
export function encodeSettings(s: Settings): string {
  const buf = Buffer.alloc(8);
  // byte 0 reserved (was orientation)
  buf.writeUInt8(s.brightness, 1);
  buf.writeUInt8(s.dimTimeout, 2);
  buf.writeUInt8(s.units, 3);
  return buf.toString("base64");
}

// Encode route control command (1 byte)
export function encodeRouteControl(cmd: number): string {
  const buf = Buffer.alloc(1);
  buf.writeUInt8(cmd, 0);
  return buf.toString("base64");
}

// Decode ride state (1 byte)
export function decodeRideState(base64: string): number {
  const buf = Buffer.from(base64, "base64");
  return buf.readUInt8(0);
}

// Decode ride stats (16 bytes)
export function decodeRideStats(base64: string): RideStats {
  const buf = Buffer.from(base64, "base64");
  return {
    distance: buf.readUInt32LE(0),
    elapsed: buf.readUInt32LE(4),
    avgSpeed: buf.readUInt16LE(8) / 100,
    speed: buf.readUInt16LE(10) / 100,
    waypointIndex: buf.readUInt16LE(12),
    turnDistance: buf.readUInt16LE(14),
  };
}

// Decode battery (2 bytes)
export function decodeBattery(base64: string): BatteryInfo {
  const buf = Buffer.from(base64, "base64");
  const flags = buf.readUInt8(1);
  return {
    percent: buf.readUInt8(0),
    charging: (flags & 0x01) !== 0,
    usb: (flags & 0x02) !== 0,
  };
}

// Decode settings (8 bytes)
export function decodeSettings(base64: string): Settings {
  const buf = Buffer.from(base64, "base64");
  return {
    brightness: buf.readUInt8(1),
    dimTimeout: buf.readUInt8(2),
    units: buf.readUInt8(3),
  };
}
