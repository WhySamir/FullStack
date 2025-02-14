import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { Tweet } from "../models/tweets.js";

const createTweets = asyncHandler(async (req, res) => {
  const { content } = req.body;

  //   console.log("Tweet Content:", content);

  if (!content) {
    throw new ApiError(400, "Tweet content cannot be empty.");
  }
  //   console.log("User ID:", req.user?._id);
  const twitter = await Video.findById(req.user?._id);

  try {
    // Create comment
    const tweets = await Tweet.create({
      content,
      owner: req.user?._id,
    });

    // Retrieve the created comment
    const createdTweet = await Tweet.findById(tweets._id);

    if (!createdTweet) {
      throw new ApiError(500, "Failed to retrieve the created tweet.");
    }

    // Respond with the created comment
    return res
      .status(201)
      .json(new ApiResponds(201, createdTweet, "Tweets added successfully."));
  } catch (error) {
    throw new ApiError(500, "An error occurred while adding the tweets.");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //   console.log("Tweet ID:", tweetId);

  // Validate input
  if (!tweetId) {
    throw new ApiError(400, "Twitter ID is required.");
  }

  try {
    // Attempt to delete the comment
    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
      throw new ApiError(404, "Tweet not found.");
    }

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponds(200, tweet, "Tweet deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Twitter id wrong maybe");
  }
});

const editUserTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!tweetId) {
    throw new ApiError(400, "Twitter ID is required.");
  }
  if (!content) {
    throw new ApiError(400, "Content is required.");
  }
  try {
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $set: { content: content } },
      { new: true }
    );

    if (!tweet) {
      throw new ApiError(404, "Tweet not found or invalid Twitter id");
    }

    return res
      .status(200)
      .json(
        new ApiResponds(200, tweet, "Twitter contents updated successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Error updating tweet ");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  //   console.log("User ID:", req.user?._id);

  // Parse query parameters
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    const filter = { owner: req.user?._id };

    // Pagination and sorting
    const tweets = await Tweet.find(filter)
      .sort({ createdAt: -1 }) // Sort comments by newest first
      .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
      .limit(limitNumber); // Limit the number of documents

    // Count total documents for pagination metadata
    const totalTweets = await Tweet.countDocuments(filter);

    // Send the response
    res.status(200).json({
      success: true,
      data: tweets,
      totalPages: Math.ceil(totalTweets / limitNumber),
      currentPage: pageNumber,
      totalTweets,
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

export { createTweets, deleteTweet, editUserTweet, getUserTweets };
