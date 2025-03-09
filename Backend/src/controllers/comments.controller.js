import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponds } from "../utlis/ApiResponds.js";

const createComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  console.log("Video ID:", videoId);
  console.log("Comment Content:", content);

  // Validate input
  if (!videoId) {
    throw new ApiError(400, "Video ID is required to add a comment.");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "not video found");
  }

  if (!content) {
    throw new ApiError(400, "Comment content cannot be empty.");
  }

  console.log("User ID:", req.user?._id);

  try {
    // Create comment
    const newComment = await Comment.create({
      content,
      video: videoId,
      owner: req.user?._id,
    });

    // Retrieve the created comment
    const createdComment = await Comment.findById(newComment._id);

    if (!createdComment) {
      throw new ApiError(500, "Failed to retrieve the created comment.");
    }

    // Respond with the created comment
    return res
      .status(201)
      .json(
        new ApiResponds(201, createdComment, "Comment added successfully.")
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while adding the comment.");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  console.log("Comment ID:", commentId);

  // Validate input
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required.");
  }

  try {
    // Attempt to delete the comment
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found.");
    }

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponds(200, comment, "Comment deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "comment id wrong maybe");
  }
});

const editUserComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required.");
  }
  if (!content) {
    throw new ApiError(400, "Content is required.");
  }
  try {
    const comments = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content: content } },
      { new: true }
    );

    if (!comments) {
      throw new ApiError(404, "Comment not found or invalid comment id");
    }

    return res
      .status(200)
      .json(
        new ApiResponds(200, comments, "Comment contents updated successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Error updating comment ");
  }
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  console.log("Video ID:", videoId);

  // Parse query parameters
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (!videoId) {
    return res
      .status(400)
      .json(new ApiError(200, "Video ID is required to fetch comments."));
  }

  try {
    const filter = { video: videoId };

    // Pagination and sorting
    const comments = await Comment.find(filter)
      .populate("owner", "username avatar")
      .populate({
        path: "replies",
        populate: { path: "owner", select: "username avatar" },
      })
      .sort({ createdAt: -1 }) // Sort comments by newest first
      .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
      .limit(limitNumber); // Limit the number of documents

    // Count total documents for pagination metadata
    const totalComments = await Comment.countDocuments(filter);

    // Send the response
    res.status(200).json({
      success: true,
      data: comments,
      totalPages: Math.ceil(totalComments / limitNumber),
      currentPage: pageNumber,
      totalComments,
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

const replyToComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required.");
  }

  if (!content) {
    throw new ApiError(400, "Reply content cannot be empty.");
  }

  try {
    // Check if the parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found.");
    }

    // Create a new reply comment
    const reply = await Comment.create({
      content,
      video: parentComment.video, // Keep the same video ID
      owner: req.user?._id,
    });

    // Add the reply to the parent's replies array
    parentComment.replies.push(reply._id);
    await parentComment.save();

    return res
      .status(201)
      .json(new ApiResponds(201, reply, "Reply added successfully."));
  } catch (error) {
    throw new ApiError(500, "An error occurred while adding the reply.");
  }
});

export {
  createComments,
  deleteComment,
  editUserComment,
  getVideoComments,
  replyToComment,
};
