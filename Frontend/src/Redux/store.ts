import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlicer from "./auth";
import themeSlicer from "./darkmode";
import vidSlicer from "./videos"
import loaderSlicer from "./loader"
import navigationSlicer from "./navigations"
import videoSlicer from "./userallVideos"

const rootReducer = combineReducers({
  auth: authSlicer,
  theme: themeSlicer,
  vid:vidSlicer,
  loader:loaderSlicer,
  navigation:navigationSlicer,
  userVideo: videoSlicer
});

export const store = configureStore({
  reducer: rootReducer, 
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

