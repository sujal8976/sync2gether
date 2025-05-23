import { useRef } from "react";
import VideoController from "./controller";
import ReactPlayer from "react-player/youtube";

export default function VideoPlayer() {
  const playerRef = useRef<ReactPlayer>(null);

  return (
    <>
      <div className="w-full h-[210px] md:h-[350px] lg:h-[450px]">
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          url={"https://www.youtube.com/watch?v=lFeYU31TnQ8"}
          config={{
            playerVars: {
              controls: 0,
              disablekb: 1,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
            },
          }}
          controls={false}
          // getDuration={(duration: number) => console.log(duration)}
          onReady={() => {
            console.log('started')
          }}
        />
      </div>
      <VideoController />
      <div className=" hidden md:flex w-full justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">asdfasfafasfasfasfasfdasfasf</h3>
          <p>Added by: user123</p>
        </div>
        <div className="flex flex-col items-end">
          <p>Upvoted: 8</p>
          <p>Downvoted: 8</p>
        </div>
      </div>
    </>
  );
}
