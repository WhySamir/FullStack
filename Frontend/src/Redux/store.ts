import {  configureStore } from "@reduxjs/toolkit";
import authSlicer from "./auth.ts"

export  const store = configureStore({
  reducer:{auth: authSlicer ,}
});

