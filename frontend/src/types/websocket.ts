export enum WebSocketMessageType {
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  CLOSE_ROOM = "CLOSE_ROOM",
  USER_STATUS = "USER_STATUS",
  TYPING_START = "TYPING_START",
  TYPING_END = "TYPING_END",
  ERROR = "ERROR",
  ROOM_JOINED = "ROOM_JOINED",
  ROOM_LEFT = "ROOM_LEFT",
  ALREADY_JOINED = "ALREADY_JOINED",
  VIDEO_ADDED = "VIDEO_ADDED",
  VOTE = 'VOTE'
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export interface ErrorResponse {
  code?: string;
  message: string;
}
