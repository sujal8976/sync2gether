import { WebSocket, WebSocketServer } from "ws";
import { AuthenticatedWebSocket } from "../../types/websocket";
import prisma from "../../db";
import { WSErrorHandler } from "../../utils/WSErrorHandler";
import Stream from "stream";

export class WebSocketService {
  private static instance: WebSocketService;

  private wss: WebSocketServer;

  private constructor() {
    this.wss = new WebSocketServer({ noServer: true });
  }

  public getWsServer(): WebSocketServer {
    return this.wss;
  }

  public async handleConnection(socket: Stream.Duplex, ws: WebSocket,userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        WSErrorHandler.sendError(ws, "User not authenticated", 401);
        return;
      }

      const authenticatedWs = ws as AuthenticatedWebSocket;

      authenticatedWs.userId = user.id;
    } catch (error) {}
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
}
