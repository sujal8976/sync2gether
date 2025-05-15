import useWebSocket from "@/hooks/useWebSocket";
import api from "@/services/api";
import useRoomStore from "@/store/room";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Room from "./room";

export default function RoomWrapper() {
  const { roomId } = useParams();
  const { joinRoom, isRoomConnected, isWSConnected, connect } = useWebSocket(
    false,
    true
  );
  const { getRoomConnectionStatus, setRoomConnectionStatus, getRoom, setRoom } =
    useRoomStore();

  const connectToRoomOnly = () => {
    setRoomConnectionStatus("connecting");
    if (typeof roomId === "string") joinRoom(roomId);
  };

  const connectToWSAndRoom = async () => {
    try {
      if (!roomId) return;
      setRoomConnectionStatus("connecting");
      const response = await api.get(`/rooms/${roomId}`);

      if (response.data?.success) {
        setRoom({
          roomId: response.data?.room.id,
          roomHost: response.data?.room.host,
        });
      }

      await connect();
      await new Promise(resolve => setTimeout(resolve, 500));

      joinRoom(roomId);
    } catch (error) {
      setRoomConnectionStatus("error");
      toast.error("Failed to Connect to Room");
    }
  };

  useEffect(() => {
    const initalize = async () => {
      if (isWSConnected() && roomId && getRoom()) {
        connectToRoomOnly();
      } else {
        await connectToWSAndRoom();
      }
    };

    initalize();
  }, [roomId, isWSConnected, getRoom, joinRoom]);

  if (getRoomConnectionStatus() === "connecting") {
    return <div className="connection-status">Connecting to room...</div>;
  }

  if (getRoomConnectionStatus() === "error") {
    return <div className="connection-status error">Some error occurred</div>;
  }

  if (isWSConnected() && isRoomConnected() && roomId) {
    return <Room roomId={roomId} />;
  }

  return (
    <div className="connection-status error">Failed to connect to room</div>
  );
}
