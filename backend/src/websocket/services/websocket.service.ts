import { WebSocket, WebSocketServer } from "ws";
import {
  AuthenticatedWebSocket,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../types/websocket";
import { WSErrorHandler } from "../../utils/errors/WSErrorHandler";
import { UserService } from "./users.service";
import { RoomService } from "./rooms.service";
import { WebSocketEventHandler } from "../listeners/event-listener";

export class WebSocketService {
  private static instance: WebSocketService;

  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket>;
  private eventHandler: WebSocketEventHandler;

  private constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.clients = new Map();
    this.eventHandler = new WebSocketEventHandler(
      this.clients,
      this.broadcastToRoom.bind(this)
    );
  }

  public async handleConnection(ws: AuthenticatedWebSocket, userId: string) {
    try {
      ws.isAlive = true;
      ws.currentRoom = null;
      this.clients.set(userId, ws);
      await UserService.updateUserStatus(userId, true);
      this.eventHandler.setupEventListeners(ws);
    } catch (error) {
      WSErrorHandler.sendError(ws, "Failed to establish connection", 401);
      ws.terminate();
    }
  }

  public async broadcastToRoom(
    roomId: string,
    message: WebSocketMessage,
    excludeUserIds: string[] = []
  ): Promise<void> {
    try {
      const onlineRoomMembers = await RoomService.getOnlineRoomMembers(roomId);

      this.clients.forEach((client, userId) => {
        if (
          client.readyState === WebSocket.OPEN &&
          onlineRoomMembers.includes({ userId }) &&
          !excludeUserIds.includes(userId) &&
          client.currentRoom === roomId
        ) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      console.log("Failed to broadcast message", error);
    }
  }

  public getWsServer(): WebSocketServer {
    return this.wss;
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
}