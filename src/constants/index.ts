export const BLE_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

// Phone → ESP32
export const BLE_UUID_GPS_DATA = "6e400010-b5a3-f393-e0a9-e50e24dcca9e";
export const BLE_UUID_SETTINGS = "6e400011-b5a3-f393-e0a9-e50e24dcca9e";
export const BLE_UUID_ROUTE_CONTROL = "6e400012-b5a3-f393-e0a9-e50e24dcca9e";

// ESP32 → Phone
export const BLE_UUID_RIDE_STATE = "6e400020-b5a3-f393-e0a9-e50e24dcca9e";
export const BLE_UUID_RIDE_STATS = "6e400021-b5a3-f393-e0a9-e50e24dcca9e";
export const BLE_UUID_BATTERY = "6e400022-b5a3-f393-e0a9-e50e24dcca9e";
export const BLE_UUID_CUR_SETTINGS = "6e400023-b5a3-f393-e0a9-e50e24dcca9e";

export const CMD_START = 0x01;
export const CMD_PAUSE = 0x02;
export const CMD_STOP = 0x03;

export const STATE_IDLE = 0x00;
export const STATE_RECORDING = 0x01;
export const STATE_PAUSED = 0x02;

export const DEVICE_NAME = "BikeESP";

export const GPS_INTERVAL_MS = 1000;
export const GPS_DISTANCE_FILTER_M = 0; // send every second regardless of movement

export const BACKGROUND_LOCATION_TASK = "background-location-task";
