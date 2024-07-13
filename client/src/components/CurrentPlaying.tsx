import { RotateCw } from "lucide-react";
import { SongType } from "../types";
import { msToMinutesAndSeconds } from "../utils";
type CurrentPlayingProps = {
  currentPlaying: SongType;
  getQueue: () => void;
};
const CurrentPlaying = ({ currentPlaying, getQueue }: CurrentPlayingProps) => {
  return (
    <div className="flex flex-col gap-4 my-5 items-start">
      <div className="flex gap-2 justify-center items-center">
        <p className="text-2xl">Currently Playing </p>
        <button
          className="btn bg-transparent  hover:bg-slate-700 p-3"
          onClick={() => getQueue()}
        >
          <RotateCw className="text-white w-4" />
        </button>
      </div>
      <div className="flex gap-0 text-xs hover:bg-slate-100 dark:hover:bg-zinc-900 backdrop-blur-xl rounded-xl items-center">
        <img
          src={currentPlaying?.album?.images[0]?.url}
          className="w-32 h-full rounded-s-xl"
        />
        <div className="flex flex-col gap-1 items-start p-5">
          <p>{currentPlaying.name}</p>
          <p className="text-gray-700 dark:text-gray-400">
            {currentPlaying?.artists[0]?.name}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            {currentPlaying.album.name}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            {msToMinutesAndSeconds(currentPlaying.duration_ms).minutes}:
            {msToMinutesAndSeconds(currentPlaying.duration_ms).seconds > 9
              ? msToMinutesAndSeconds(currentPlaying.duration_ms).seconds
              : "0" +
                String(
                  msToMinutesAndSeconds(currentPlaying.duration_ms).seconds
                )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlaying;
