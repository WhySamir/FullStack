import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlicer from "./auth";
import themeSlicer from "./darkmode";
import vidSlicer from "./videos"

const rootReducer = combineReducers({
  auth: authSlicer,
  theme: themeSlicer,
  vid:vidSlicer,
});

export const store = configureStore({
  reducer: rootReducer, 
});

export type RootState = ReturnType<typeof store.getState>;
