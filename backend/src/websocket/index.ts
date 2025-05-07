import { createServer } from "http";
import { parse } from "url";
import { WebSocketService } from "./services/websocket.service";
import dotenv from "dotenv";
import { validateToken } from "./utils/validateToken";
import prisma from "../db";
import { AuthenticatedWebSocket } from "../types/websocket";

dotenv.config();

const wsService = WebSocketService.getInstance();
export const WSserver = createServer();

WSserver.on("upgrade", async (request, socket, head) => {
  const { query } = parse(request.url || "", true);
  const token = query.token as string;

  if (!token) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  const userId = await validateToken(token);
  if (!userId) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;    
  }

  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {username: true}
  })
  if (!user || !user.username) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wsService.getWsServer().handleUpgrade(request, socket, head, (ws) => {
    const authenticatedWs = ws as AuthenticatedWebSocket;
    authenticatedWs.userId = userId;
    authenticatedWs.username = user.username;
    wsService.handleConnection(authenticatedWs, userId);
  })
});