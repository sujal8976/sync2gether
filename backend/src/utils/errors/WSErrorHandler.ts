import { WebSocket } from "ws";
import { WebSocketMessageType } from "../../types/websocket";

export class WSErrorHandler {
  static sendError(ws: WebSocket, message: string, code?: number) {
    const errorMessage = {
      code,
      message,
      success: false,
    };

    try {
      ws.send(
        JSON.stringify({
          type: WebSocketMessageType.ERROR,
          payload: errorMessage,
        })
      );
    } catch (error) {
      console.log("Error while sending error message.");
    }
  }
}
