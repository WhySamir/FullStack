import { createSlice } from "@reduxjs/toolkit";
interface ThemeState {
    darkMode: boolean;
  }

const initialState: ThemeState = {
    darkMode: true,
};
interface RootState2 {
    theme: ThemeState;
    }

    const themeSlice = createSlice({
        name: "theme",
        initialState,
        reducers: {
          setTheme(state) {
            state.darkMode =true;
          },
          
       
        },
      });
      export const { setTheme } = themeSlice.actions;
      export default themeSlice.reducer;
      export type { RootState2 };