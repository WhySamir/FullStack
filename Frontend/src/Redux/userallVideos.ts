import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAllvideo } from "../Api/videoApis";
import { VideoProps } from "../types/videosInterface";



interface VideoState {
  videos: VideoProps[];
  loading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
};

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async (userId: string, thunkAPI) => {
    try {
      const res = await userAllvideo({ userId });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    deleteVideo: (state, action) => {
      state.videos = state.videos.filter(video => video._id !== action.payload);
    },
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.sort(
          (a: VideoProps, b: VideoProps) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { deleteVideo } = videoSlice.actions;
export default videoSlice.reducer;
