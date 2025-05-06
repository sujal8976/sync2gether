import { WebSocket } from "ws";

export interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  username: string;
  isAlive: boolean;
  currentRoom: string | null;
}

export enum WebSocketMessageType {
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  ERROR = "ERROR",
  //  = "",
  //  = "",
  //  = "",
  //  = "",
  //  = "",
}
