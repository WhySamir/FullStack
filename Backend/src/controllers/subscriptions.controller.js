import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { Video } from "../models/video.model.js";
//toggle subscribe
//get user subscribers
//get user subscribed channel

// controller to return subscriber list of a channel

const toggleSubscribe = asyncHandler(async (req, res) => {
  //1. get channel going to un/subscribe by login user from params
  const { channelId } = req.params; //channel or user going to be subscribe or unsubcribe

  const subscriberId = req.user._id; //logined user subscriber

  //check channel exist or not
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel (user) not found");
  }
  if (channelId === String(subscriberId)) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }
  let isSubscribed = false;
  //check already subscribed or not
  const existingSubscription = await Subscription.findOne({
    subscribers: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    // Unsubscribe (delete the subscription)
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(
        new ApiResponds(
          200,
          { isSubscribed },
          "Subcribed to channel sucessfully."
        )
      );
  } else {
    //subscribe
    const subscription = new Subscription({
      subscribers: subscriberId,
      channel: channelId,
    });

    await subscription.save();
    isSubscribed = true;

    return res
      .status(200)
      .json(
        new ApiResponds(
          200,
          { isSubscribed, subscription },
          "Subcribed to channel sucessfully."
        )
      );
  }
});
const getChannelSubscribers = asyncHandler(async (req, res) => {
  //get all channelid subscribed to user(mero  subscribers)

  const { channelId } = req.params;
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel doesn't exists");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscribers",
    "fullName email username avatar coverImage" // Populate specific fields of the subscriber
  );
  console.log(subscribers.length);
  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        subscribers,
        subscribers.length > 0
          ? "Subscribers fetched successfully"
          : "No subscribers found for this channel"
      )
    );
});
//controller to return  channels that i subscribed (maile follow gareko)
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(401, "subscriberId missing");
  }

  // 1. Get all subscriptions where this user is the subscriber
  const subscriptions = await Subscription.find({
    subscribers: subscriberId,
  });

  // 2. For each subscription, get channel details, subscriber count, and video count
  const result = await Promise.all(
    subscriptions.map(async (sub) => {
      const channelId = sub.channel;

      // Get channel info
      const channelInfo = await User.findById(channelId).select(
        "fullName username avatar email"
      );

      if (!channelInfo) return null; // Skip if channel user not found

      // Get total number of subscribers this channel has
      const subscriberCount = await Subscription.countDocuments({
        channel: channelId,
      });

      // Get total number of videos this channel has uploaded
      const videoCount = await Video.countDocuments({
        owner: channelId,
      });

      return {
        channel: channelInfo,
        subscriberCount,
        videoCount,
        isSubscribed: true,
      };
    })
  );

  // Filter out nulls in case any channel info was not found
  const filteredResult = result.filter((r) => r !== null);

  return res
    .status(200)
    .json(
      new ApiResponds(
        200,
        filteredResult,
        filteredResult.length > 0
          ? "Subscribed channels"
          : "No channels subscribed"
      )
    );
});
export { toggleSubscribe, getChannelSubscribers, getSubscribedChannels };
