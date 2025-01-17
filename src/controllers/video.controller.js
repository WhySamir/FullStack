import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";

//getallVideos get all videos based on query, sort, pagination
// const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
//publishaVid  get video, upload to cloudinary, create video
//getVideosbyid
//update
// delete
//togglePublishStatus

const publishaVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  if ([title, description].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "All feild are required");
  }
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Please Upload videoFile ");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Please Upload thumbnailfile ");
  }

  const videoFile = await uploadonCloudinary(videoLocalPath);
  const thumbnail = await uploadonCloudinary(thumbnailLocalPath);
  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "File upload to Cloudinary failed.");
  }

  const uploadVideo = new Video({
    title: title,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    description: description,
    duration: duration,
    isPublished: true,
  });
  await uploadVideo.save();

  return res
    .status(200)
    .json(new ApiResponds(200, uploadVideo, "Uploaded video sucessfully."));
});
const getAllVideos = asyncHandler(async (req, res) => {
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});
export { getAllVideos, publishaVideo };
