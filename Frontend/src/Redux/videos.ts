import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { VideoProps } from "../types/videosInterface";

  
interface VideoState {
    videos:VideoProps[],
    vidId:string
  }

  const initialState: VideoState = {
    videos: [],
    vidId:''
  };

const videoSlice = createSlice({
    name: "vid",
    initialState,
    reducers: {
      upload(state, action:PayloadAction<VideoProps[]>) {
        state.videos = action.payload;
      },
      selectVid(state, action:PayloadAction<string>) {
        state.vidId=action.payload
        
      },
      deleteVid(state) {
        state.videos =[];
      },

   
    },
  });
  export const { upload,selectVid, deleteVid } = videoSlice.actions;
  export default videoSlice.reducer;
