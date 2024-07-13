import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "./api";

import { RotateCw } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import Commands from "./pages/Commands";
import Home from "./pages/Home";
import {
  setSpotifyAuthenticated,
  setSpotifyUser,
  setTwitchAuthenticated,
  setTwitchUser,
} from "./store/authSlice";
import { RootState } from "./types";

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
      console.log(twitchUser, spotifyUser);
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
      <div className="w-full  h-screen flex items-center justify-center align-middle">
        <RotateCw className="flex items-center justify-center animate-spin w-20" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/queue" />} />
      <Route path="/queue" element={<Home />} />
      <Route path="/commands" element={<Commands />} />
    </Routes>
  );
}

export default App;
