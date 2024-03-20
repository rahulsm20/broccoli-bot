import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import queueReducer from "./querySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    musicData: queueReducer,
  },
});

export default store;
