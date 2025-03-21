import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { Likes } from "../models/likes.model.js";

const createComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content, parentCommentId } = req.body;

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
      parentComment: parentCommentId || null,
    });

    // Retrieve the created comment
    const createdComment = await Comment.findById(newComment._id);

    if (!createdComment) {
      throw new ApiError(500, "Failed to retrieve the created comment.");
    }
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: newComment._id },
      });
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

async function deleteCommentAndChildren(commentId) {
  // Find and delete direct children
  const childComments = await Comment.find({ parentComment: commentId });
  for (const child of childComments) {
    await deleteCommentAndChildren(child._id); // Recursively delete children of this child
  }
  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId);
}
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  console.log("Comment ID:", commentId);

  // Validate input
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required.");
  }

  try {
    // Attempt to delete the comment
    await deleteCommentAndChildren(commentId);

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponds(200, null, "Comment deleted successfully."));
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
  const userId = req.user?._id;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (!videoId) {
    return res
      .status(400)
      .json(new ApiError(400, "Video ID is required to fetch comments."));
  }

  try {
    const filter = { video: videoId, parentComment: null };

    // Pagination and sorting
    const comments = await Comment.find(filter)
      .populate("owner", "username avatar")
      .populate({
        path: "replies",
        populate: { path: "owner", select: "username avatar" },
      })
      .sort({ createdAt: -1 }) // Sort comments by newest first
      .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
      .limit(limitNumber);

    const commentIds = comments.map((comment) => comment._id);

    // Get likes and dislikes for comments
    const likes = await Likes.find({
      contentId: { $in: commentIds },
      contentType: "Comment",
    });

    // Separate likes and dislikes
    const likesByComment = likes.filter((like) => like.type === "like");
    const dislikesByComment = likes.filter((like) => like.type === "dislike");

    // Associate likes and dislikes with comments
    const commentsWithLikesAndDislikes = comments.map((comment) => {
      const commentLikes = likesByComment.filter((like) =>
        like.contentId.equals(comment._id)
      );
      const commentDislikes = dislikesByComment.filter((dislike) =>
        dislike.contentId.equals(comment._id)
      );

      const isLikedByUser = commentLikes.some(
        (like) => like.user.toString() === userId?.toString()
      );

      const isDislikedByUser = commentDislikes.some(
        (dislike) => dislike.user.toString() === userId?.toString()
      );

      return {
        ...comment.toObject(),
        likesCount: commentLikes.length,
        isLikedByUser,
        // dislikesCount: commentDislikes.length,
        isDislikedByUser,
      };
    });

    const totalComments = await Comment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: commentsWithLikesAndDislikes,
      totalPages: Math.ceil(totalComments / limitNumber),
      currentPage: pageNumber,
      totalComments,
    });
  } catch (error) {
    console.error("Error fetching video comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments for the video.",
      error: error.message,
    });
  }
});
const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id; // Assuming you have the user ID available from req.user

  if (!commentId) {
    return res
      .status(400)
      .json(new ApiError(400, "Comment ID is required to fetch comments."));
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json(new ApiError(404, "Comment not found or invalid comment id"));
    }

    // Get likes and dislikes for this comment
    const likes = await Likes.find({
      contentId: commentId,
      contentType: "Comment",
    });

    const likesByComment = likes.filter((like) => like.type === "like");
    const dislikesByComment = likes.filter((like) => like.type === "dislike");

    const likesCount = likesByComment.length;
    const isLikedByUser = likesByComment.some(
      (like) => like.user.toString() === userId?.toString()
    );
    const isDislikedByUser = dislikesByComment.some(
      (dislike) => dislike.user.toString() === userId?.toString()
    );

    // Return only relevant fields (likesCount, isLikedByUser, isDislikedByUser)
    const commentWithLikes = {
      likesCount,
      isLikedByUser,
      isDislikedByUser,
    };

    return res
      .status(200)
      .json(new ApiResponds(200, commentWithLikes, "Comment found"));
  } catch (error) {
    console.error("Error fetching video comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comment.",
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
      parentComment: commentId,
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
  getCommentById,
};
