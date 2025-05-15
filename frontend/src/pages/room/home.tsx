import JoinRoomDialog from "@/components/dialogs/join-room";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import useRoomStore from "@/store/room";
import { isAxiosError } from "axios";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useWebSocket from "@/hooks/useWebSocket";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const setRoom = useRoomStore().setRoom;
  const { isWSConnected, connect: connectToWS, disconnect } = useWebSocket(false, false);

  const createRoomAndConnect = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/rooms");

      if (response.data?.success) {
        setRoom({
          roomId: response.data.room.id,
          roomHost: response.data.room.host,
        });

        await connectToWS();
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        if (isWSConnected()) {
          navigate(`/room/${response.data.room.id}`);
        }

        setIsLoading(false);
      }
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data?.message || "Failed creating room");
      setIsLoading(false);
      disconnect();
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col rounded-xl dark:bg-zinc-800 bg-slate-400 items-center w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] p-4">
        <h1 className="text-4xl p-4 font-semibold">Sync2gether</h1>
        <p>Watch YouTube Videos Together, In Perfect Sync</p>
        <Button
          onClick={async () =>
            createRoomAndConnect().then(() => toast.success("Room Created"))
          }
          className="rounded-full flex mt-12 items-center justify-center w-[40%] text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <Plus size={24} className="" />
              Create Room
            </>
          )}
        </Button>
        <JoinRoomDialog isLoading={isLoading} />
        <div className="w-full mt-12 flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
          <p className="flex-1/3">1. Create or Join Room</p>
          <p className="flex-1/3">2. Add your favorite video</p>
          <p className="flex-1/3">3. Watch together in Perfect Sync</p>
        </div>
      </div>
    </div>
  );
}
