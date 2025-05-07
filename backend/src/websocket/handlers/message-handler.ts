import {
    AuthenticatedWebSocket,
    WebSocketMessage,
    WebSocketMessageType,
  } from "../../types/websocket";
  import { WSErrorHandler } from "../../utils/errors/WSErrorHandler";
  import { RoomService } from "../services/rooms.service"; 
  import { WebSocketMessageSchemas } from "../../schemas/websocket";
  
  export class WebSocketMessageHandler {
    private broadcastToRoom: (
      roomId: string, 
      message: WebSocketMessage, 
      excludeUserIds?: string[]
    ) => Promise<void>;
  
    constructor(
      broadcastToRoomFn: (
        roomId: string,
        message: WebSocketMessage,
        excludeUserIds?: string[]
      ) => Promise<void>
    ) {
      this.broadcastToRoom = broadcastToRoomFn;
    }
  
    public async handleMessage(
      ws: AuthenticatedWebSocket,
      message: WebSocketMessage
    ): Promise<void> {
      try {
        switch (message.type) {
          case WebSocketMessageType.JOIN_ROOM:
            await this.handleJoinRoom(ws, message);
            break;
  
          case WebSocketMessageType.LEAVE_ROOM:
            await this.handleLeaveRoom(ws, message);
            break;
        }
      } catch (error) {
        console.log("Error handling message:", error);
      }
    }
  
    private async handleJoinRoom(
      ws: AuthenticatedWebSocket,
      message: WebSocketMessage
    ): Promise<void> {
      try {
        const { roomId } =
          WebSocketMessageSchemas.joinRoomSchema.parse(message).payload;
        const result = await RoomService.addUserToRoom(ws.userId, roomId);
  
        switch (result) {
          case "ADDED":
          case "ALREADY_JOINED":
            ws.currentRoom = roomId;
            this.broadcastToRoom(roomId, {
              type:
                result === "ADDED"
                  ? WebSocketMessageType.JOIN_ROOM
                  : WebSocketMessageType.ROOM_ALREADY_JOINED,
              payload: {
                userId: ws.userId,
                username: ws.username,
                roomId,
              },
            });
            break;
          case "FAILED":
            WSErrorHandler.sendError(ws, "Failed to join room");
            break;
        }
      } catch (error) {
        WSErrorHandler.sendError(ws, "Failed to join room");
      }
    }
  
    private async handleLeaveRoom(
      ws: AuthenticatedWebSocket,
      message: WebSocketMessage
    ): Promise<void> {
      try {
        const { roomId } =
          WebSocketMessageSchemas.leaveRoomSchema.parse(message).payload;
  
        if (await RoomService.removeUserFromRoom(ws.userId, roomId)) {
          ws.currentRoom = null;
          this.broadcastToRoom(roomId, {
            type: WebSocketMessageType.ROOM_LEFT,
            payload: {
              userId: ws.userId,
              userame: ws.username,
              roomId,
            },
          });
        } else {
          WSErrorHandler.sendError(ws, "Failed to leave room");
        }
      } catch (error) {
        WSErrorHandler.sendError(ws, "Failed to leave room");
      }
    }
  }