// Redux slice (e.g., navigationSlice.ts)
import { createSlice } from "@reduxjs/toolkit";

interface NavigationState {
  isNavigating: boolean;
  navigationCount: number; // Add a count property
}

const initialState: NavigationState = {
  isNavigating: false, navigationCount: 0,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigating: (state, action) => {
      state.isNavigating = action.payload;
    }, incrementNavigationCount: (state) => {
        state.navigationCount += 1; // Increment on each click
      },
  },
});

export const { setNavigating,incrementNavigationCount } = navigationSlice.actions;
export default navigationSlice.reducer;