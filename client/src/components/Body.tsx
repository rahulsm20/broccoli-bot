import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQueue, loginSpotify } from "../api";
import { setMusicData } from "../store/querySlice";
import { RootState } from "../types";
import CurrentPlaying from "./CurrentPlaying";
import Queue from "./Queue";
import { RotateCw } from "lucide-react";

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
  useEffect(() => {
    // setTimeout(() => {
    getQueue();
    // }, 200);
  }, []);

  const queue = useSelector((state: RootState) => state.musicData.data?.queue);
  const currentPlaying = useSelector(
    (state: RootState) => state.musicData.data?.currently_playing
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.twitch.isAuthenticated
  );
  return (
    <div className="flex flex-col gap-5 items-center justify-center   ">
      <div className="flex flex-col md:flex-row gap-5">
        {spotifyIsAuthenticated ? (
          <button className="flex btn border-0 bg-green-800 hover:bg-green-700 text-white rounded-full text-current">
            Connected to Spotify
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
              className="w-8"
            />
          </button>
        ) : isAuthenticated ? (
          <button
            className="flex btn  bg-green-800 font-regular hover:bg-green-700 rounded-full text-white border-0"
            onClick={handleSpotifyLogin}
          >
            Connect to Spotify
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
              className="w-8"
            />
          </button>
        ) : (
          <></>
        )}
      </div>
      {spotifyIsAuthenticated &&
      !fetchingQueue &&
      queueSize &&
      queueSize > 0 ? (
        <div className="flex flex-col items-start mx-20">
          {currentPlaying && currentPlaying?.id && (
            <CurrentPlaying
              currentPlaying={currentPlaying}
              getQueue={getQueue}
            />
          )}
          <p className="text-2xl">Your Queue </p>
          {queueSize && queueSize > 0 && tabs.length && (
            <>
              <Queue
                fetchingQueue={fetchingQueue}
                queue={queue.slice(
                  Math.floor(page * 10),
                  Math.floor((page + 1) * 10)
                )}
                page={page}
              />
              <div className="join">
                {tabs.map((tab) => (
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
            </>
          )}
        </div>
      ) : fetchingQueue ? (
        <RotateCw className="animate-spin" />
      ) : (
        <div className="flex flex-col  rounded-xl gap-2 items-start justify-start">
          <p className="text-3xl">Broccoli Bot</p>
          <p className="flex justify-start items-start">An okay stream bot.</p>
        </div>
      )}
    </div>
  );
};

export default Body;
