import { Video } from "../models/video.model.js";
import { Comment } from "../models/comments.model.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { uploadonCloudinary } from "../utlis/cloudinary.js";
import mongoose from "mongoose";
import { Likes } from "../models/likes.model.js";
import { Subscription } from "../models/subscriptions.model.js";
//getallVideos get all videos based on query, sort, pagination
// const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
//publishaVid  get video, upload to cloudinary, create video
//getVideosbyid
//update
// delete
//togglePublishStatus

const publishaVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, duration, hashtag } = req.body;
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
    console.log("Video File Path:", videoLocalPath);
    console.log("Thumbnail Path:", thumbnailLocalPath);
    console.log("Uploading to Cloudinary...");
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
      hashtag: hashtag,
      owner: req.user._id,
    });
    const savedVideo = await uploadVideo.save();
    console.log("Video saved successfully:", savedVideo);
    return res
      .status(200)
      .json(new ApiResponds(200, uploadVideo, "Uploaded video sucessfully."));
  } catch (error) {
    console.error("publishaVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
const getVideosbyid = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { videoById } = req.params;
  try {
    const video = await Video.findById(videoById).populate(
      "owner",
      "username avatar"
    );
    if (!video) {
      return new ApiError(404, "Video not found");
    }

    const likes = await Likes.find({
      contentId: videoById,
      contentType: "Video",
      type: "like",
    });
    const dislikes = await Likes.find({
      contentId: videoById,
      contentType: "Video",
      type: "dislike",
    });

    const isLikedByUser = userId
      ? likes.some((like) => like.user.toString() === userId.toString())
      : false;
    const isDislikedByUser = userId
      ? dislikes.some(
          (dislike) => dislike.user.toString() === userId.toString()
        )
      : false;
    const existingSubscription = userId
      ? await Subscription.findOne({
          subscribers: userId,
          channel: video.owner._id,
        })
      : null;
    const ownerSubscribers = await Subscription.find({
      channel: video.owner._id,
    });

    const isSubscribedByUser = !!existingSubscription;
    const videoWithLikes = {
      ...video.toObject(),
      isLikedByUser,
      isDislikedByUser,
      likesCount: likes.length,
      isSubscribedByUser,
      subscribersCount: ownerSubscribers.length,
      // // dislikesCount: dislikes.length,
    };
    return res
      .status(200)
      .json(new ApiResponds(200, videoWithLikes, "Got Video"));
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
  } = req.query;
  console.log("User ID from request:", req.user ? req.user._id : "Guest user");

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // if (!req.user || !req.user._id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized access: User ID not provided.",
    //   });
    // }

    // Build the search filter
    const filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // Search in the `title`
        { description: { $regex: query, $options: "i" } }, // Search in the `description`
      ];
      if (mongoose.isValidObjectId(query)) {
        filter.$or.push({ owner: new mongoose.Types.ObjectId(query) }); // Match the `owner` as an ObjectId
      }
    }

    // Build the sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortType === "asc" ? 1 : -1; // Descending (-1) or ascending (1)
    }

    // Fetch videos from the database with filters, pagination, and sorting
    const videos = await Video.find(filter)
      .populate("owner", "username avatar")
      .sort(sort) // Apply sorting
      .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
      .limit(limitNumber); // Limit the number of documents

    const videosWithCommentCount = await Promise.all(
      videos.map(async (video) => {
        const commentCount = await Comment.countDocuments({
          video: video._id,
        });
        const likesCount = await Likes.countDocuments({
          contentId: video._id,
          contentType: "Video",
          type: "like",
        });
        return {
          ...video.toObject(),
          commentCount,
          likesCount,
        };
      })
    );
    // Count total documents for pagination metadata
    const totalVideos = await Video.countDocuments(filter);
    console.log({ videos, totalVideos, pageNumber });

    // Send the response
    res.status(200).json({
      data: videosWithCommentCount,
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

const incrementViews = asyncHandler(async (req, res) => {
  const { videoById } = req.params;

  if (!mongoose.isValidObjectId(videoById)) {
    throw new ApiError(400, "Invalid video ID");
  }

  try {
    const exitsvideo = await Video.findById(videoById);
    if (!exitsvideo) {
      throw new ApiError(400, " video  doesnot exits");
    }
    const updatedVideo = await Video.findByIdAndUpdate(
      videoById,
      { $inc: { views: 1 } }, // Increment the `views` field by 1
      { new: true } // Return the updated document
    );

    if (!updatedVideo) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponds(
          200,
          updatedVideo,
          "Video view count updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to update video views", error.message);
  }
});

export {
  getAllVideos,
  publishaVideo,
  getVideosbyid,
  updateVideodetails,
  deleteVideo,
  togglePublishStatus,
  incrementViews,
};
