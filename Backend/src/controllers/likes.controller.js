import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { Comment } from "../models/comments.model.js";
import { Likes } from "../models/likes.model.js";
import { Tweet } from "../models/tweets.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //check video exist or not
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  //check already liked or not
  const existingVideoLike = await Likes.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (existingVideoLike) {
    // Unsubscribe (delete the subscription)
    await Likes.findByIdAndDelete(existingVideoLike._id);
    return res.status(200).json({
      status: 200,
      message: "Disliked  video.",
    });
  } else {
    //subscribe
    const like = new Likes({
      video: videoId,
      likedBy: req.user?._id,
    });
    await like.save();

    return res
      .status(200)
      .json(new ApiResponds(200, like, "Like to video sucessfully."));
  }
});
const toggleCommentsLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  //check video exist or not
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  //check already liked comment or not
  const existingCommentLike = await Likes.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (existingCommentLike) {
    // Unsubscribe (delete the subscription)
    await Likes.findByIdAndDelete(existingCommentLike._id);
    return res.status(200).json({
      status: 200,
      message: "Disliked comments.",
    });
  } else {
    //subscribe
    const comment = new Likes({
      comment: commentId,
      likedBy: req.user?._id,
    });
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponds(200, comment, "Like to video sucessfully."));
  }
});
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //check video exist or not
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  //check already liked or not
  const existingTweetLike = await Likes.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (existingTweetLike) {
    // Unsubscribe (delete the subscription)
    await Likes.findByIdAndDelete(existingTweetLike._id);
    return res.status(200).json({
      status: 200,
      message: "Disliked  tweet.",
    });
  } else {
    //subscribe
    const like = new Likes({
      tweet: tweetId,
      likedBy: req.user?._id,
    });
    await like.save();

    return res
      .status(200)
      .json(new ApiResponds(200, like, "Like to tweet sucessfully."));
  }
});
const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const filter = {
      likedBy: req.user?._id,
      video: { $exists: true, $ne: null },
    };

    // Pagination and sorting
    const likes = await Likes.find(filter)
      .populate("video")
      .sort({ createdAt: -1 }); // Sort comments by newest first

    // Count total documents for pagination metadata
    const totalVideoLikes = await Likes.countDocuments(filter);
    const likedVideos = likes.map((like) => like.video);
    // Send the response
    res.status(200).json({
      success: true,
      data: likedVideos,
      totalVideoLikes,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching video comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments for the video.",
      error: error.message,
    });
  }
});

export { toggleVideoLike, toggleCommentsLike, toggleTweetLike, getLikedVideos };
