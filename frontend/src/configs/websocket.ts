export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000";
export const RECONNECT_INTERVAL = 3000;
export const MAX_RECONNECT_ATTEMPTS = 5;
export const PING_INTERVAL = 30000;

export enum WS_EVENTS {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ERROR = "error",
  MESSAGE = "message",
  RECONNECT = "reconnect",
  RECONNECT_ATTEMPT = "reconnect_attempt",
  RECONNECT_ERROR = "reconnect_error",
  RECONNECT_FAILED = "reconnect_failed",
}
