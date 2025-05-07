import { WebSocket } from "ws";
import {
  AuthenticatedWebSocket,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../types/websocket";
import { WSErrorHandler } from "../../utils/errors/WSErrorHandler";
import { UserService } from "../services/users.service";
import { WebSocketMessageHandler } from "../handlers/message-handler";

export class WebSocketEventHandler {
  private broadcastToRoom: (
    roomId: string,
    message: WebSocketMessage,
    excludeUserIds?: string[]
  ) => Promise<void>;

  private clients: Map<string, AuthenticatedWebSocket>;
  private messageHandler: WebSocketMessageHandler;

  constructor(
    clients: Map<string, AuthenticatedWebSocket>,
    broadcastToRoomFn: (
      roomId: string,
      message: WebSocketMessage,
      excludeUserIds?: string[]
    ) => Promise<void>
  ) {
    this.clients = clients;
    this.broadcastToRoom = broadcastToRoomFn;
    this.messageHandler = new WebSocketMessageHandler(broadcastToRoomFn);
  }

  public setupEventListeners(ws: AuthenticatedWebSocket): void {
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data);
        await this.messageHandler.handleMessage(ws, message);
      } catch (error) {
        WSErrorHandler.sendError(ws, "Message Processing error", 400);
        console.log("Error in processing Message:", error);
      }
    });

    ws.on("close", () => this.handleDisconnection(ws));

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${ws.userId}:`, error);
    });

    ws.send(
      JSON.stringify({
        type: WebSocketMessageType.CONNECTION_ESTABLISHED,
        payload: {
          userId: ws.userId,
          username: ws.username,
        },
      })
    );
  }

  public async handleDisconnection(ws: AuthenticatedWebSocket): Promise<void> {
    try {
      await UserService.updateUserStatus(ws.userId, false);
      this.clients.delete(ws.userId);

      if (ws.currentRoom) {
        this.broadcastToRoom(ws.currentRoom, {
          type: WebSocketMessageType.USER_STATUS,
          payload: {
            userId: ws.userId,
            status: "offline",
            username: ws.username,
            roomId: ws.currentRoom,
          },
        });

        ws.currentRoom = null;
        ws.removeAllListeners();

        if (ws.readyState === WebSocket.OPEN) ws.terminate();
      }
    } catch (error) {
      if (error instanceof Error) {
        WSErrorHandler.sendError(
          ws,
          error.message || "Failed to user offline",
          1011
        );
      } else WSErrorHandler.sendError(ws, "Failed to close connection", 1011);
      console.log("Error in handle disconnection", error);
    }
  }
}