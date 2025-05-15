import VideoPlayer from "@/components/custom/video-player";
import RoomTabs from "@/components/layout/room-tabs";

export default function Room({roomId}: {roomId: string}) {
  return (
    <div className="w-full h-full flex justify-center items-center md:py-3 md:dark:bg-zinc-900 rounded-md">
      <div className="w-full h-full md:px-2 md:max-w-[90%] flex flex-col md:flex-row gap-1 md:gap-3">
        <div className="flex-[.3] md:min-w-[350px] md:flex-[.6] flex flex-col justify-start items-center">
          <VideoPlayer />
        </div>

        <div className="flex-[.7] md:flex-[.4]">
          <RoomTabs roomId={roomId} />
        </div>
      </div>
    </div>
  );
}
