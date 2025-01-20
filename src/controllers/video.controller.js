import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
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
  if (!title || !description || !duration) {
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
const getVideosbyid = asyncHandler(async (req, res) => {
  const { videoById } = req.params;

  try {
    const video = await Video.findById(videoById);
    return res.status(200).json(new ApiResponds(200, video, "Got Video"));
  } catch (error) {
    throw new ApiError(400, "No videoes found || Invalid Video Id");
  }
});
const updateVideodetails = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const { videoById } = req.params;

  const videoPath = req.files?.videoFile?.[0]?.path; // For video file
  const thumbnailPath = req.files?.thumbnail?.[0]?.path; // For thumbnail file

  if (!title && !description && !duration && !videoPath && !thumbnailPath) {
    throw new ApiError(400, "At least one field must be provided to update.");
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (duration) updateFields.duration = duration;

  if (videoPath) {
    const videoUpload = await uploadonCloudinary(videoPath);
    if (!videoUpload.url) {
      throw new ApiError(400, "Error uploading video file to Cloudinary");
    }
    updateFields.videoFile = videoUpload.url;
  }

  if (thumbnailPath) {
    const thumbnailUpload = await uploadonCloudinary(thumbnailPath);
    if (!thumbnailUpload.url) {
      throw new ApiError(400, "Error uploading video file to Cloudinary");
    }
    updateFields.thumbnail = thumbnailUpload.url;
  }

  try {
    const videodetails = await Video.findByIdAndUpdate(
      videoById,
      { $set: updateFields },
      { new: true }
    );

    if (!videodetails) {
      throw new ApiError(404, "video not found or invalid video id");
    }

    return res
      .status(200)
      .json(
        new ApiResponds(200, videodetails, "User details updated successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Error updating video details");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoById } = req?.params;
  if (!videoById) {
    throw new ApiError(400, "Please insert videoId");
  }
  try {
    const deletedVideo = await Video.findByIdAndDelete(videoById);

    if (!deletedVideo) {
      throw new ApiError(404, "Video not found or invalid video id");
    }
    return res
      .status(200)
      .json(
        200,
        new ApiResponds(200, deletedVideo, "Video Deleted Sucessfully")
      );
  } catch (error) {
    throw new ApiError(300, error.message, "Failed to delete video");
  }
});
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoById } = req?.params;
  if (!videoById) {
    throw new ApiError(400, "Please insert videoId");
  }

  try {
    const video = await Video.findById(videoById);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoById,
      { $set: { isPublished: !video.isPublished } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponds(
          200,
          updatedVideo,
          "Video publish status updated successfully"
        )
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(
      400,
      error.message || "Error toggling video publish status"
    );
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "title",
    sortType = "asc",
    userId,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // Build the search filter
    const filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // Search in the `title`
        { description: { $regex: query, $options: "i" } }, // Search in the `description`
        { userId: { $regex: query, $options: "i" } }, // Search in the `userId`
      ];
    }
    // Build the sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortType === "asc" ? 1 : -1; // Descending (-1) or ascending (1)
    }

    // Fetch videos from the database with filters, pagination, and sorting
    const videos = await Video.find(filter)
      .sort(sort) // Apply sorting
      // .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
      .limit(limitNumber); // Limit the number of documents

    // Count total documents for pagination metadata
    const totalVideos = await Video.countDocuments(filter);

    // Send the response
    res.status(200).json({
      data: videos,
      totalPages: Math.ceil(totalVideos / limitNumber),
      currentPage: pageNumber,
      totalVideos,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
});
export {
  getAllVideos,
  publishaVideo,
  getVideosbyid,
  updateVideodetails,
  deleteVideo,
  togglePublishStatus,
};
