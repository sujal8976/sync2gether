import { wsService } from "@/services/websocket";
import useRoomStore from "@/store/room";
import { useUserStore } from "@/store/user";
import { WebSocketMessageType } from "@/types/websocket";
import { useCallback, useEffect } from "react";

const useWebSocket = (autoConnect: boolean = true, autoDisconnect: boolean = true) => {
  const getRoom = useRoomStore().getRoom;
  const getRoomConnectionStatus = useRoomStore().getRoomConnectionStatus;
  const getAccessToken = useUserStore().getAccessToken;
  const userId = useUserStore().getUser()?.id;

  const connect = useCallback(async () => {
    await wsService.connect();
  }, []);

  const disconnect = useCallback(() => {
    wsService.cleanup(true);
  }, []);

  const sendMessage = useCallback(
    (message: string) => {
      const room = getRoom();
      const token = getAccessToken();

      if (!room?.roomId || !token || !userId) {
        console.error("Cannot send message: Room or authentication missing");
        return false;
      }

      return wsService.send({
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          message,
          roomId: room.roomId,
          userId: userId,
        },
      });
    },
    [getRoom, getAccessToken]
  );

  const joinRoom = useCallback((roomId: string) => {
    if (!wsService.isConnected()) {
      wsService.connect().then(() => {
        wsService.send({
          type: WebSocketMessageType.JOIN_ROOM,
          payload: { roomId },
        });
      });
    } else {
      wsService.send({
        type: WebSocketMessageType.JOIN_ROOM,
        payload: { roomId },
      });
    }
  }, []);

  const leaveRoom = useCallback(() => {
    wsService.leaveRoom();
  }, []);

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      const room = getRoom();

      if (!room?.roomId) {
        return false;
      }

      return wsService.send({
        type: isTyping
          ? WebSocketMessageType.TYPING_START
          : WebSocketMessageType.TYPING_END,
        payload: {
          roomId: room.roomId,
        },
      });
    },
    [getRoom]
  );

  const isWSConnected = useCallback(() => {
    return wsService.isConnected();
  }, []);

  const isRoomConnected = useCallback(() => {
    return (
      wsService.isConnected() &&
      getRoom() &&
      getRoomConnectionStatus() === "connected"
    );
  }, []);

  useEffect(() => {
    if (autoConnect) connect();

    return () => {
      if (autoDisconnect) disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendTypingIndicator,
    isWSConnected,
    isRoomConnected,
  };
};

export default useWebSocket;
