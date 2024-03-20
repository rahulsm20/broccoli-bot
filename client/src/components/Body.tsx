import { useDispatch, useSelector } from "react-redux";
import { fetchQueue, loginSpotify } from "../api";
import { RootState } from "../types";
import Queue from "./Queue";
import { useEffect, useState } from "react";
import { setMusicData } from "../store/querySlice";
import { msToMinutesAndSeconds } from "../utils";

const Body = () => {
  const [page, setPage] = useState(0);
  const handleSpotifyLogin = async () => {
    await loginSpotify();
  };
  const spotifyIsAuthenticated = useSelector(
    (state: RootState) => state.auth.spotify.isAuthenticated
  );
  const queueSize = useSelector(
    (state: RootState) => state.musicData.queueSize
  );
  const tabs: number[] = [];

  if (queueSize > 0) {
    for (let i = 0; i < queueSize / 10; i++) {
      tabs.push(i);
    }
  }

  const dispatch = useDispatch();
  useEffect(() => {
    // setTimeout(() => {
    const getQueue = async () => {
      const data = await fetchQueue();
      dispatch(setMusicData(data));
    };
    getQueue();
    // }, 1000);
  }, [dispatch]);

  const queue = useSelector((state: RootState) => state.musicData.data?.queue);
  const currentPlaying = useSelector(
    (state: RootState) => state.musicData.data?.currently_playing
  );
  return (
    <div className="flex flex-col gap-5 items-center justify-center p-10">
      {spotifyIsAuthenticated ? (
        <button className="flex btn rounded-full bg-green-900 hover:bg-green-900 text-slate-200">
          Connected to Spotify
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
            className="w-8"
          />
        </button>
      ) : (
        <button
          className="flex btn bg-slate-200 text-black font-regular hover:bg-green-700 hover:text-slate-200"
          onClick={handleSpotifyLogin}
        >
          Connect to Spotify
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
            className="w-8"
          />
        </button>
      )}
      {spotifyIsAuthenticated && currentPlaying?.artists ? (
        <div className="flex flex-col items-start">
          {currentPlaying && (
            <div className="flex flex-col gap-4 my-5 items-start">
              <p className="text-2xl">Currently Playing </p>
              <div className="flex gap-0 text-xs bg-slate-900 rounded-xl items-center">
                <img
                  src={currentPlaying?.album?.images[0]?.url}
                  className="w-28 h-full rounded-s-xl"
                />
                <div className="flex flex-col gap-1 items-start p-5">
                  <p>{currentPlaying.name}</p>
                  <p className="text-gray-400">
                    {currentPlaying?.artists[0]?.name}
                  </p>
                  <p className="text-gray-400">{currentPlaying.album.name}</p>
                  <p className="text-gray-400">
                    {msToMinutesAndSeconds(currentPlaying.duration_ms).minutes}:
                    {msToMinutesAndSeconds(currentPlaying.duration_ms).seconds >
                    9
                      ? msToMinutesAndSeconds(currentPlaying.duration_ms)
                          .seconds
                      : "0" +
                        String(
                          msToMinutesAndSeconds(currentPlaying.duration_ms)
                            .seconds
                        )}{" "}
                  </p>
                </div>
              </div>
            </div>
          )}
          <p className="text-2xl">Your Queue </p>
          <Queue
            page={page}
            queue={queue.slice(
              Math.floor(page * 10),
              Math.floor((page + 1) * 10)
            )}
          />
        </div>
      ) : (
        <div className="flex bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl gap-2 btn items-center justify-center">
          <p>No content</p>
          <img src="/no-content.svg" className="w-5" />
        </div>
      )}
      <div className="join">
        {queueSize > 0 &&
          tabs.length &&
          tabs.map((tab) => (
            <button
              className={`join-item btn btn-xs ${tab == page && "btn-active"}`}
              onClick={() => setPage(tab)}
            >
              {tab + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Body;
