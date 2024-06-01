import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./api";
import Home from "./pages/Home";
import {
  setSpotifyAuthenticated,
  setSpotifyUser,
  setTwitchAuthenticated,
  setTwitchUser,
} from "./store/authSlice";
import { RootState } from "./types";
import { Navigate, Route,Routes } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);

  const twitchIsAuthenticated = useSelector(
    (state: RootState) => state.auth.twitch.isAuthenticated
  );
  const spotifyIsAuthenticated = useSelector(
    (state: RootState) => state.auth.spotify.isAuthenticated
  );
  const dispatch = useDispatch();

  const generateProfiles = async () => {
    try {
      const spotifyUser = await validateToken("spotify");
      const twitchUser = await validateToken("twitch");
      console.log(twitchUser, spotifyUser)
      if (twitchUser?.username) {
        dispatch(setTwitchUser(twitchUser));
        dispatch(setTwitchAuthenticated(true));
      }

      if (spotifyUser?.username) {
        dispatch(setSpotifyUser(spotifyUser));
        dispatch(setSpotifyAuthenticated(true));
      }
      setLoading(false);
    } catch (err) {
      console.log(`${err}`);
    }
  };
  useEffect(() => {
    if (!twitchIsAuthenticated || !spotifyIsAuthenticated) generateProfiles();
  }, []);

  if (loading) {
    return (
      <img
        src="https://blog.hubspot.com/hs-fs/hubfs/7a8f8d634013568124e130728834d47a.gif?width=1500&name=7a8f8d634013568124e130728834d47a.gif"
        className="w-screen h-screen"
      />
    );
  }
  return (
    <Routes>
    <Route path="/" element={<Navigate to="/queue"/>} />
    <Route path="/queue" element={<Home/>} />
    </Routes>
  );
}

export default App;
