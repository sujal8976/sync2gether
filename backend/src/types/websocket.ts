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
  USER_STATUS = "USER_STATUS",
  CONNECTION_ESTABLISHED  = "CONNECTION_ESTABLISHED",
  ROOM_JOINED  = "ROOM_JOINED",
  ALREADY_JOINED = "ALREADY_JOINED",
  ROOM_LEFT  = "ROOM_LEFT",
  SYNC_PLAYER_PLAY = "SYNC_PLAYER_PLAY",
  SYNC_PLAYER_PAUSE = "SYNC_PLAYER_PAUSE",
  VIDEO_ADDED = "VIDEO_ADDED",
  VOTE = 'VOTE'
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export interface SyncPlayerMessageType {

}