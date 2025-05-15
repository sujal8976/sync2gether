import {
  AuthenticatedWebSocket,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../types/websocket";
import { WSErrorHandler } from "../../utils/errors/WSErrorHandler";
import { RoomService } from "../services/rooms.service";
import { WebSocketMessageSchemas } from "../../schemas/websocket";
import { MessageService } from "../services/message.service";

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

        case WebSocketMessageType.SEND_MESSAGE:
          await this.handleSendMessage(ws, message);
          break;
      }
    } catch (error) {
      WSErrorHandler.sendError(ws, "Failed to process message");
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
          ws.currentRoom = roomId;
          this.broadcastToRoom(roomId, {
            type: WebSocketMessageType.ROOM_JOINED,
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

  private async handleSendMessage(
    ws: AuthenticatedWebSocket,
    message: WebSocketMessage
  ): Promise<void> {
    try {
      const {
        message: msg,
        roomId,
        userId,
      } = WebSocketMessageSchemas.sendMessageSchema.parse(message).payload;

      if (ws.currentRoom !== roomId) {
        WSErrorHandler.sendError(ws, "Provide a current roomId");
        return;
      }

      if (!(await RoomService.validateARoomAccess(ws.userId, roomId)))
        return WSErrorHandler.sendError(ws, "Unauthorized");

      const chat = await MessageService.createMessage(userId, roomId, msg);

      this.broadcastToRoom(roomId, {
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          id: chat.id,
          message: msg,
          roomId: roomId,
          createdAt: chat.createdAt,
          user: {
            id: userId,
            username: ws.username,
          },
        },
      });
    } catch (error) {
      console.log("Error in handleSendMessage", error);
      WSErrorHandler.sendError(ws, "Failed to send message");
    }
  }
}
