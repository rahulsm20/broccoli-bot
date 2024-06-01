import { SongType } from "../types";
import { msToMinutesAndSeconds } from "../utils";
type CurrentPlayingProps = {
  currentPlaying: SongType;
};
const CurrentPlaying = ({ currentPlaying }: CurrentPlayingProps) => {
  return (
    <div className="flex flex-col gap-4 my-5 items-start">
      <p className="text-2xl">Currently Playing </p>
      <div className="flex gap-0 text-xs bg-slate-900 rounded-xl items-center">
        <img
          src={currentPlaying?.album?.images[0]?.url}
          className="w-32 h-full rounded-s-xl"
        />
        <div className="flex flex-col gap-1 items-start p-5">
          <p>{currentPlaying.name}</p>
          <p className="text-gray-400">{currentPlaying?.artists[0]?.name}</p>
          <p className="text-gray-400">{currentPlaying.album.name}</p>
          <p className="text-gray-400">
            {msToMinutesAndSeconds(currentPlaying.duration_ms).minutes}:
            {msToMinutesAndSeconds(currentPlaying.duration_ms).seconds > 9
              ? msToMinutesAndSeconds(currentPlaying.duration_ms).seconds
              : "0" +
                String(
                  msToMinutesAndSeconds(currentPlaying.duration_ms).seconds
                )}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlaying;
