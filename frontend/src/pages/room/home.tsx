import JoinRoomDialog from "@/components/dialogs/join-room";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col rounded-xl dark:bg-slate-700 bg-slate-400 items-center w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] p-4">
        <h1 className="text-4xl p-4 font-semibold">Sync2gether</h1>
        <p>Watch YouTube Videos Together, In Perfect Sync</p>
        <Button className="rounded-full flex mt-12 items-center justify-center w-[40%] text-lg">
          <Plus size={24} className="" />
          Create Room
        </Button>
        <JoinRoomDialog />
        <div className="w-full mt-12 flex flex-col lg:flex-row items-center gap-2 lg:justify-between">
          <p className="flex-1/3">1. Create or Join Room</p>
          <p className="flex-1/3">2. Add your favorite video</p>
          <p className="flex-1/3">3. Watch together in Perfect Sync</p>
        </div>
      </div>
      <Button onClick={() => navigate('/room/asfaf')}>
        room
      </Button>
    </div>
  );
}
