import { useState, ChangeEvent } from "react";
import { Play, Pause, Volume2, VolumeX, Settings, Circle } from "lucide-react";

export default function VideoController() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(63); // 1:03 in seconds

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = (): void => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>): void => {
    const seekPosition = Number(e.target.value);
    setCurrentTime(seekPosition);
  };

  return (
    <div className="h-10 w-full bg-black flex items-center px-2 text-white">
      <button
        onClick={handlePlayPause}
        className="text-white mr-2 flex-shrink-0"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="text-xs w-16 flex-shrink-0 min-w-[80px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="flex-grow h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, white ${
            (currentTime / duration) * 100
          }%, #4b5563 ${(currentTime / duration) * 100}%)`,
        }}
      />

      <div className="ml-2 flex gap-0.5 items-center justify-center text-xs">
        <Circle size={15} fill="green" color="green" />Sync
      </div>

      <button
        onClick={handleMuteToggle}
        className="ml-2 text-white flex-shrink-0"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <button className="ml-2 text-white flex-shrink-0">
        <Settings size={18} />
      </button>

      <button className="hidden" onClick={() => setDuration(11)}></button>
    </div>
  );
}
