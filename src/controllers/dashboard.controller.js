import { Subscription } from "../models/subscriptions.model.js";
import { Likes } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { asyncHandler } from "../utlis/asyncHandler.js";
import mongoose from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // URL parameter

  // Validate the channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  try {
    // Fetch total number of videos for the channel
    const totalVideos = await Video.countDocuments({ owner: channelId });
    console.log("Total Videos:", totalVideos);
    // Fetch total number of subscribers for the channel
    const totalSubscribers = await Subscription.countDocuments({
      _id: channelId,
    });
    console.log("Total Subscribers:", totalSubscribers);

    // Fetch total number of likes for videos in the channel
    // const totalLikes = await Likes.countDocuments({ video: channelId });
    // console.log("Total Likes:", totalLikes);
    // Calculate total views for all videos in the channel

    const userVideos = await Video.find({ owner: channelId });
    userVideos.forEach((video) => {
      console.log(
        "Video ID:",
        video._id,
        "Views:",
        video.views,
        typeof video.views
      );
    });

    const stats = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);
    console.log("Aggregation Result:", stats);

    // // Extract totalViews value from the aggregation result
    const totalViewsCount = stats.length > 0 ? stats[0].totalViews : 0;
    console.log("Total Views:", totalViewsCount);
    const likesAggregation = await Likes.aggregate([
      {
        $lookup: {
          from: "videos", // The name of the `Video` collection in the database
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
        },
      },
      { $unwind: "$videoDetails" }, // Flatten the `videoDetails` array
      {
        $match: {
          "videoDetails.owner": new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: 1 }, // Count each like
        },
      },
    ]);
    const totalLikes =
      likesAggregation.length > 0 ? likesAggregation[0].totalLikes : 0;
    console.log("Total Likes:", totalLikes);

    // Return the stats as a response
    return res.status(200).json(
      new ApiResponds(
        200,
        {
          totalVideos,
          totalSubscribers,
          // totalLikes,
          totalViews: totalViewsCount,
          totalLikes,
        },
        "Channel statistics fetched successfully"
      )
    );
  } catch (error) {
    // Handle errors
    throw new ApiError(
      500,
      "Failed to fetch channel statistics",
      error.message
    );
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // URL parameter
  const { page = 1, limit = 10 } = req.query; // Query parameters for pagination

  // Validate the channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Fetch the videos for the given channel
  const videos = await Video.find({ owner: channelId })
    .select("title description createdAt thumbnail views videoFile")
    .sort({ createdAt: -1 }) // Sort videos by the newest first
    // .skip((page - 1) * limit)
    .limit(Number(limit));
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // If no videos are found, throw an error
  if (!videos.length) {
    throw new ApiError(404, "No videos found for this channel");
  }

  // Return the videos
  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        { videos, totalVideos, currentPage: page },
        "Channel videos fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
