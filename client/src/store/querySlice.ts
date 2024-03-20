import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data:{
    currentyPlaying: null,
    queue:[],
  },
  queueSize: 0
};

const queueSlice = createSlice({
  name: "musicData",
  initialState,
  reducers: {
    setMusicData: (state, action) => {
        state.data = action.payload;
        state.queueSize = action.payload.queue.length;  
    },
  },
});

export const {
  setMusicData,
} = queueSlice.actions;
export default queueSlice.reducer;
