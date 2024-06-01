import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueue, loginSpotify } from "../api";
import { setMusicData } from "../store/querySlice";
import { RootState } from "../types";
import CurrentPlaying from "./CurrentPlaying";
import Queue from "./Queue";

const Body = () => {
  const [page, setPage] = useState(0);
  const [fetchingQueue, setFetchingQueue] = useState(false);
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
    const getQueue = async () => {
      try {
        setFetchingQueue(true);
        const data = await fetchQueue();
        dispatch(setMusicData(data));
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingQueue(false);
      }
    };
    getQueue();
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
      <button
        className="flex btn bg-slate-200 text-black font-regular hover:bg-red-700 hover:text-slate-200"
        onClick={handleSpotifyLogin}
      >
        Connect to Youtube
        <img
          src="https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png"
          className="w-8"
        />
      </button>
      {spotifyIsAuthenticated && !fetchingQueue && currentPlaying?.artists ? (
        <div className="flex flex-col items-start">
          {currentPlaying && <CurrentPlaying currentPlaying={currentPlaying} />}
          <p className="text-2xl">Your Queue </p>
          <Queue
            fetchingQueue={fetchingQueue}
            queue={queue.slice(
              Math.floor(page * 10),
              Math.floor((page + 1) * 10)
            )}
          />
          <div className="join">
            {queueSize > 0 &&
              tabs.length &&
              tabs.map((tab) => (
                <button
                  className={`join-item btn btn-xs ${
                    tab == page && "btn-active"
                  }`}
                  onClick={() => setPage(tab)}
                >
                  {tab + 1}
                </button>
              ))}
          </div>
        </div>
      ) : !spotifyIsAuthenticated ? (
        <div className="flex flex-col text-white rounded-xl gap-2 items-start justify-start">
          <p className="text-3xl">Welcome to Broccoli Bot!</p>
          <p className="flex justify-start items-start">
            The only stream bot you'll ever need.
          </p>
        </div>
      ) : (
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
};

export default Body;
