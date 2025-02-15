import {  configureStore } from "@reduxjs/toolkit";
import authSlicer from "./auth.ts"
import themeSlicer from "./darkmode.ts"

export  const store = configureStore({
  reducer:{auth: authSlicer ,theme:themeSlicer}
});

