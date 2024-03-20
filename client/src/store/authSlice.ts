import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spotify: {
    isAuthenticated: false,
    user: {},
  },
  twitch: {
    isAuthenticated: false,
    user: {},
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTwitchAuthenticated: (state, action) => {
      state.twitch.isAuthenticated = action.payload;
    },
    setTwitchUser: (state, action) => {
      state.twitch.user = action.payload;
    },
    setSpotifyAuthenticated: (state, action) => {
      state.spotify.isAuthenticated = action.payload;
    },
    setSpotifyUser: (state, action) => {
      state.spotify.user = action.payload;
    },
  },
});

export const {
  setTwitchAuthenticated,
  setTwitchUser,
  setSpotifyAuthenticated,
  setSpotifyUser,
} = authSlice.actions;
export default authSlice.reducer;
