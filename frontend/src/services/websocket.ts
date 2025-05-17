import {
  MAX_RECONNECT_ATTEMPTS,
  PING_INTERVAL,
  RECONNECT_INTERVAL,
  WS_URL,
} from "@/configs/websocket";
import useRoomStore from "@/store/room";
import { useUserStore } from "@/store/user";
import { WebSocketMessage, WebSocketMessageType } from "@/types/websocket";
import { baseURL } from "./api";
import useRoomMembersStore from "@/store/room-members";
import { toast } from "sonner";
import useChatsStore from "@/store/chat";
import { Chat } from "@/types/chat";

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  newAccessToken: string;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isIntentionalClose = false;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.isIntentionalClose = false;

      if (!useUserStore.getState().getAccessToken()) {
        console.log("No accessToken, attempting to refresh");
        try {
          const response = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to refresh token:", errorText);
            useRoomStore
              .getState()
              .setError("Authentication failed. Please log in again.");
            return;
          }

          const data: RefreshTokenResponse = await response.json();
          useUserStore.getState().setAccessToken(data.newAccessToken);
        } catch (error) {
          console.error("Token refresh error:", error);
          useRoomStore
            .getState()
            .setError("Authentication failed. Please check your connection.");
          return;
        }
      }

      const token = useUserStore.getState().getAccessToken();
      if (!token) {
        useRoomStore.getState().setError("No authentication token available");
        return;
      }

      this.ws = new WebSocket(`${WS_URL}?token=${token}`);
      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection error", error);
      this.handleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected succesfully");
      this.reconnectAttempts = 0;
      useRoomStore.getState().setError(null);
      this.setupPing();
    };

    this.ws.onclose = (event) => {
      console.log(`websocket disconnected: ${event.code} - ${event.reason}`);
      useRoomStore.getState().setRoomConnectionStatus("disconnected");

      if (!this.isIntentionalClose) this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("Websocket error:", error);
      useRoomStore.getState().setRoomConnectionStatus("error");
      useRoomStore
        .getState()
        .setError("Connection error, please try again later.");
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.log("Error processing Websocket Message:", error);
      }
    };
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case WebSocketMessageType.ROOM_JOINED:
        if (message.payload.userId === useUserStore.getState().getUser()?.id)
          useRoomStore.getState().setRoomConnectionStatus("connected");
        else {
          useRoomMembersStore.getState().addRoomMember({
            userId: message.payload.userId,
            username: message.payload.username,
            isOnline: true,
          });
          toast("New member joined:", {
            description: `${message.payload.username}`,
          });
        }
        break;

      case WebSocketMessageType.ALREADY_JOINED:
        if (message.payload.userId === useUserStore.getState().getUser()?.id)
          useRoomStore.getState().setRoomConnectionStatus("connected");
        else
          useRoomMembersStore.getState().setUserOnline(message.payload.userId);
        break;

      case WebSocketMessageType.USER_STATUS:
        if (message.payload.status === "offline") {
          useRoomMembersStore.getState().setUserOffline(message.payload.userId);
          toast(`${message.payload.username} gone offline.`);
        }
        break;

      case WebSocketMessageType.SEND_MESSAGE:
        if (
          useRoomStore.getState().getRoom()?.roomId === message.payload.roomId
        ) {
          if (!message.payload.tempId) {
            const newMsg: Chat = {
              id: message.payload.id,
              message: message.payload.message,
              createdAt: message.payload.createdAt,
              user: {
                id: message.payload.user.id,
                username: message.payload.user.username,
              },
            };
            useChatsStore.getState().addChat(newMsg);
          }
        }
        break;

      // case WebSocketMessageType.SEND_MESSAGE:
      //   if (message.payload.userId === ) {

      //   }

      case WebSocketMessageType.ERROR:
        console.log("WebSoket Error message:", message.payload);
        useRoomStore.getState().setError(message.payload.message);
        break;
    }
  }

  public leaveRoom() {
    const currentRoom = useRoomStore.getState().getRoom()?.roomId;
    if (currentRoom) {
      this.send({
        type: WebSocketMessageType.LEAVE_ROOM,
        payload: { roomId: currentRoom },
      });
    }
  }

  private setupPing() {
    if (this.pingInterval) clearInterval(this.pingInterval);

    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "PING", payload: {} }));
      } else if (
        this.ws?.readyState === WebSocket.CLOSED ||
        this.ws?.readyState === WebSocket.CLOSING
      ) {
        this.handleReconnect();
      }
    }, PING_INTERVAL);
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Reattempting... attempt ${this.reconnectAttempts}`);
      this.cleanup(false);
      this.connect();
    }, RECONNECT_INTERVAL * Math.min(this.reconnectAttempts + 1, 5));
  }

  public send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
        return false;
      }
    } else {
      console.warn(
        "WebSocket is not connected. Current state:",
        this.ws?.readyState
      );

      this.handleReconnect();

      return false;
    }
  }

  public cleanup(intentional: boolean): void {
    this.isIntentionalClose = intentional;

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearInterval(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (useRoomStore.getState().getRoom()) {
      useRoomStore.getState().setRoom(null);
      useRoomStore.getState().setRoomConnectionStatus("disconnected");
      useRoomMembersStore.getState().clearAllMembers();
    }

    if (this.ws) {
      if (intentional) {
        this.ws.onclose = null;
      }

      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CLOSING
      )
        this.ws.close(1000, "Intentional disconnect");

      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): number | null {
    return this.ws?.readyState ?? null;
  }
}

export const wsService = WebSocketService.getInstance();
