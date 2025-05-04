import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { Comment } from "../models/comments.model.js";
import { Likes } from "../models/likes.model.js";
import { Tweet } from "../models/tweets.js";
import { Video } from "../models/video.model.js";

const toggleLikeDislike = asyncHandler(async (req, res) => {
  const { contentId, type } = req.params;
  const { contentType } = req.body;

  if (!["like", "dislike"].includes(type)) {
    throw new ApiError(400, "Invalid type. Must be 'like' or 'dislike'");
  }

  let content;
  if (contentType === "Video") content = await Video.findById(contentId);
  else if (contentType === "Comment")
    content = await Comment.findById(contentId);
  else if (contentType === "Tweet") content = await Tweet.findById(contentId);

  if (!content) throw new ApiError(404, `${contentType} not found`);

  const existingEntry = await Likes.findOne({
    contentId,
    contentType,
    user: req.user?._id,
    type,
  });

  let isLikedByUser = false;
  let isDislikedByUser = false;

  if (existingEntry) {
    // If already liked/disliked, remove it (toggle off)
    await Likes.findByIdAndDelete(existingEntry._id);
  } else {
    // Remove opposite action (if exists) before adding a new one
    const oppositeType = type === "like" ? "dislike" : "like";
    const oppositeEntry = await Likes.findOneAndDelete({
      contentId,
      contentType,
      user: req.user?._id,
      type: oppositeType,
    });

    // Add new like/dislike
    const newEntry = new Likes({
      contentId,
      contentType,
      user: req.user?._id,
      type,
    });
    await newEntry.save();

    // Set user-specific toggling state
    if (type === "like") {
      isLikedByUser = true;
      isDislikedByUser = false; // Since we removed dislike
    } else {
      isLikedByUser = false; // Since we removed like
      isDislikedByUser = true;
    }
  }

  // Get total likes count
  const totalLikes = await Likes.countDocuments({
    contentId,
    contentType,
    type: "like",
  });

  return res.status(200).json({
    status: 200,
    message: `${type} toggled successfully.`,
    totalLikes,
    isLikedByUser,
    isDislikedByUser,
  });
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const filter = {
      user: req.user?._id,
      contentType: "Video",
    };
    const likes = await Likes.find(filter)
      .sort({ updatedAt: -1 })
      .select("contentId updatedAt")
      .populate({
        path: "contentId",
        model: "Video",
        populate: {
          path: "owner",
          model: "User",
          select: "username",
        },
      });
    const totalVideoLikes = await Likes.countDocuments(filter);
    const lastUpdated = likes.length > 0 ? likes[0].updatedAt : null;
    const likedVideos = likes
      .map((like) => like.contentId)
      .filter((video) => video !== null);

    res.status(200).json({
      success: true,
      data: likedVideos,
      totalVideoLikes,
      lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch liked videos.",
      error: error.message,
    });
  }
});

export { toggleLikeDislike, getLikedVideos };
