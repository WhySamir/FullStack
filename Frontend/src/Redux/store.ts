import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlicer from "./auth";
import themeSlicer from "./darkmode";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only the auth slice, not theme
};

const rootReducer = combineReducers({
  auth: authSlicer,
  theme: themeSlicer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Prevents Redux Toolkit warnings
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
