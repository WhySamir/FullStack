import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface Video {
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    videoFile: string;
    isPublished: boolean;
    views: number|null;
    owner: string;
    updatedAt: string;
    createdAt: string;
    _id: string;
  }
  
interface VideoState {
    videos:Video[],
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
      upload(state, action:PayloadAction<Video[]>) {
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
