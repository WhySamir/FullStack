import { Playlists } from "../models/playlists.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { asyncHandler } from "../utlis/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(
      400,
      "Name and description are required for creating a playlist"
    );
  }
  const owner = await User.findById(req.user?._id).select(
    "username avatar _id"
  );

  const newPlaylist = new Playlists({
    name: name,
    description: description,
    owner: owner,
  });
  await newPlaylist.save();
  return res
    .status(200)
    .json(new ApiResponds(200, newPlaylist, "Uploaded sucessfully"));
  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists

  try {
    const userPlaylists = await Playlists.find({ owner: req.user?._id });
    if (!userPlaylists) {
      return res
        .status(404)
        .json(new ApiResponds(404, "No playlists found for this user"));
    }

    return res
      .status(200)
      .json(new ApiResponds(200, userPlaylists, "Playlists found sucess"));
  } catch (error) {
    throw new ApiError(400, "Couldn't find playlists", error);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Please enter  playlistID");
  }
  try {
    const Playlist = await Playlists.findById(playlistId);
    if (!Playlist) {
      return res
        .status(404)
        .json(new ApiResponds(404, "No playlists found for this user"));
    }

    return res
      .status(200)
      .json(new ApiResponds(200, Playlist, "Playlists found sucess"));
  } catch (error) {
    throw new ApiError(400, "Couldn't find playlists", error);
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "Both playlist and video are required to add");
  }
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    const playlist = await Playlists.findByIdAndUpdate(
      playlistId,
      { $set: { videos: videoId } },
      { new: true, runValidators: true }
    );
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    return res
      .status(200)
      .json(new ApiResponds(200, playlist, "Added Video to  playlist Sucess"));
  } catch (error) {
    throw new ApiError(200, error, "Error occured");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "Both playlist and video are required to remove");
  }
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    const playlist = await Playlists.findByIdAndUpdate(
      playlistId,
      { $pull: { videos: videoId } },
      { new: true, runValidators: true }
    );
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponds(200, playlist, "Deleted Video to  playlist Sucess")
      );
  } catch (error) {
    throw new ApiError(200, "Error occured", error);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, " playlist is required to delete");
  }

  try {
    const playlist = await Playlists.findByIdAndDelete(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponds(200, "Playlist  removed successfully"));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Error occurred while removing playlist", error);
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!playlistId) {
    throw new ApiError(400, "please enter playlistid");
  }
  if (!name || !description) {
    throw new ApiError(400, "Name or desc is required");
  }
  const updateFields = {};
  updateFields.name = name;
  updateFields.description = description;
  try {
    const playlist = await Playlists.findByIdAndUpdate(
      playlistId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!playlist) {
      throw new ApiError(404, "playlist not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponds(200, playlist, "Playlists details updated successfully")
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(400, error.message || "Error updating playlist details");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
